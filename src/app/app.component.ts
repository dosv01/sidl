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
  private _jsonURL = 'assets/perguntas.json';
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
    // this.quantidadePerguntas = this.totalPerguntas;
    this.prepareComboQtdPerguntas()
  }
  prepareComboQtdPerguntas() {
    this.qtds = []
    if (this.totalPerguntas > 10) {
      this.qtds.push('10')
    } else if (this.totalPerguntas > 20) {
      this.qtds.push('20')
    } else if (this.totalPerguntas > 30) {
      this.qtds.push('20')
    } else if (this.totalPerguntas > 40) {
      this.qtds.push('20')
    } else if (this.totalPerguntas > 50) {
      this.qtds.push('20')
    }
    this.qtds.push(this.totalPerguntas.toString())
  }

  public getJSON(): Observable<any> {
    return this.http.get(this._jsonURL);
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
      this.perguntas.forEach((pergunta: { respostas: any; }) => {
        pergunta.respostas = this.shuffle(pergunta.respostas);
      });
    });
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
    this.perguntas.forEach((pergunta: { resposta: any; correta: any; }) => {
      if (pergunta.resposta == pergunta.correta) {
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

      console.log('this.scoreFinal');
      console.log(this.scoreFinal);

    }
    this.finalizado = true;
    // alert("Você acertou " + this.scoreFinal.toPrecision(2) + "% das questões.");
  }

  limpaRespostas() {
    this.perguntas.forEach((pergunta: { correta: string; }) => {
      pergunta.correta == '';
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
  }

}
