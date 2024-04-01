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
  }

  public listaPerguntas(qtd?: any) {
    this.getJSON().subscribe(data => {
      this.totalPerguntas = data.length;
      if (qtd == 'All' || qtd === undefined) {
        this.quantidadePerguntas = this.totalPerguntas;
      } else {
        this.quantidadePerguntas = qtd;
      }
      this.perguntas = this.shuffle(data).slice(0, this.quantidadePerguntas);
      this.prepareComboQtdPerguntas(this.quantidadePerguntas);
    });
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
  }

  prepareComboQtdPerguntas(totalDePerguntas: number) {
    this.qtds = [];
    const valores = [10, 20, 30, 40, 50, 60, 70];
    for (const valor of valores) {
      if (this.totalPerguntas > valor) {
        this.qtds.push(valor.toString());
      }
    }
    this.qtds.push(this.totalPerguntas.toString());
  }

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
          if (alternativa.selecionou != null && alternativa.selecionou != '')
            resposta = alternativa.selecionou;
        } else {
          if (alternativa.selecionou)
            resposta += alternativa.id;
        }
      });

      if (pergunta.respostaCorreta.replaceAll(",", "") == resposta) {
        pergunta.acertou = true;
        score++;
      }
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
    }
    this.finalizado = true;
  }

  limpaRespostas() {
    this.perguntas.forEach((pergunta: { acertou: string; alternativas: any[]; }) => {
      pergunta.acertou = '';
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


  changeFinalizado(pergunta: any, id: any) {
    this.finalizado == false;

    if (pergunta.tipoPergunta == "singleAnswer") {
      pergunta.alternativas.forEach((alternativa: any) => {
        if (alternativa.id == id) {
          alternativa.selecionou = id;
        } else {
          alternativa.selecionou = '';
        }
      });
    }
  }

  clean() {
    this.finalizado = false;
    this.limpaRespostas();
  }
}
