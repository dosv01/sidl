import { Component, OnInit, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'sidl';
  private _jsonURL = 'assets/perguntas_sidl.json';
  perguntas: any = [];
  totalPerguntas = 0;
  values = Object.values;
  i: number = 0;
  scoreFinal = 0;
  finalizado = false;
  quantidadePerguntas = 0;
  status = "Não validado";
  qtds: any;
  qtdPerguntasSelect: any;

  ngOnInit() {
  }

  constructor(private http: HttpClient) {
    this.listaPerguntas();
    this.quantidadePerguntas = this.totalPerguntas;
    this.prepareComboQtdPerguntas()
  }

  prepareComboQtdPerguntas() {
    this.qtds = [];
    const valores = [10, 20, 30, 40, 50, 60, 70];
    for (const valor of valores) {
      if (this.totalPerguntas > valor) {
        this.qtds.push(valor.toString());
      }
    }
    this.qtds.push(this.totalPerguntas.toString());
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  public listaPerguntas(qtd?: any) {
    this.getJSON().subscribe(data => {
      this.totalPerguntas = data.length;
      console.log("Total de Perguntas: ", this.totalPerguntas);
      if (qtd == 'All' || qtd === undefined) {
        this.quantidadePerguntas = this.totalPerguntas;
      } else {
        this.quantidadePerguntas = qtd;
      }
      this.perguntas = this.shuffle(data).slice(0, this.quantidadePerguntas);
      // this.perguntas.forEach((pergunta: { alternativas: any; }) => {
      //   pergunta.alternativas = this.shuffle(pergunta.alternativas);
      // });
    });
  }

  // public sortMethod(originalArray: any[]) {

  //   let sortedArray = originalArray.sort((n1, n2) => {
  //     if (n1 > n2) {
  //       return 1;
  //     }

  //     if (n1 < n2) {
  //       return -1;
  //     }

  //     return 0;
  //   });

  //   return sortedArray;
  // }

  onChange(qtdPerguntas: any) {
    if (qtdPerguntas.text === 'All') {
      qtdPerguntas.value = this.totalPerguntas;
    }
    this.listaPerguntas(parseInt(qtdPerguntas.selectedOptions[0].text));
    this.quantidadePerguntas = qtdPerguntas.selectedOptions[0].text;
  }

  public calcularRespostas() {
    let score = 0;
    this.scoreFinal = 0;
    let resposta = '';
    this.perguntas.forEach((pergunta: any) => {
      resposta = '';
      pergunta.alternativas.forEach((alternativa: any) => {
        if (pergunta.tipoPergunta == "singleAnswer") {
          resposta += alternativa.selecionou;
        } else {
          if (alternativa.selecionou)
            resposta += alternativa.id;
        }
      });

      if (pergunta.respostaCorreta.replace(",", "") == resposta) {
        pergunta.acertou = true;
        score++;
      }
      // if (pergunta.respostaUsuario == pergunta.respostaCorreta) {
      //   score++;
      // }
    });

    if (score != 0) {
      this.scoreFinal = (score / parseInt(this.perguntas.length)) * 100;
      this.scoreFinal = parseFloat(this.scoreFinal.toFixed(2));

      if (this.scoreFinal > 85) {
        this.status = "Sucesso";
      }
      else {
        this.status = "Falha";
      }

      console.log('this.scoreFinal');
      console.log(this.scoreFinal);

    }
    this.finalizado = true;
    // alert("Você acertou " + this.scoreFinal.toPrecision(2) + "% das questões.");
  }

  limpaRespostas() {
    this.perguntas.forEach((pergunta: { correta: string; alternativas: any[]; }) => {
      pergunta.correta == '';
      pergunta.alternativas.forEach(alternativa => {
        alternativa.selecionou = '';
      });
    });
    this.finalizado = false;
    this.scoreFinal = 0;
  }

  shuffle(arra1: any[]) {
    let ctr = arra1.length;
    let temp;
    let index;

    while (ctr > 0) {
      index = Math.floor(Math.random() * ctr);
      ctr--;
      temp = arra1[ctr];
      arra1[ctr] = arra1[index];
      arra1[index] = temp;
    }
    return arra1;
  }

  changeFinalizado() {
    this.finalizado == false;
  }

  clean() {
    this.finalizado = false;
    this.limpaRespostas();
  }
}
