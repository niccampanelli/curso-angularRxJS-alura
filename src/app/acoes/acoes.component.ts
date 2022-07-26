import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Acoes } from './modelo/acoes';
import { AcoesService } from './acoes.service';
import { merge, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-acoes',
  templateUrl: './acoes.component.html',
  styleUrls: ['./acoes.component.css'],
})
export class AcoesComponent {
  acoesInput = new FormControl();
  todasAcoes$ = this.acoesService.getAcoes();
  filtroPeloInput$ = this.acoesInput.valueChanges.pipe(
    debounceTime(1000), // Espera para realizar a próxima ação
    filter((valorDigitado) => valorDigitado.length >= 3 || valorDigitado.length == 0), // Só prossegue se o filtro retornar true
    distinctUntilChanged(), // Não prossegue se o valor for idêntico ao anterior
    switchMap((valorDigitado) => this.acoesService.getAcoes(valorDigitado)) // Redireciona para outro observable
  );

  acoes$ = merge(this.todasAcoes$, this.filtroPeloInput$);

  constructor(private acoesService: AcoesService) {}

}
