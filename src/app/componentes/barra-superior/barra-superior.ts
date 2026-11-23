import { Component, inject, input, output } from '@angular/core';
import { Auth } from '../../servicios/auth';
import { Preferencias } from '../../servicios/preferencias';

@Component({
  selector: 'app-barra-superior',
  templateUrl: './barra-superior.html',
  styleUrl: './barra-superior.css',
})
export class BarraSuperior {
  protected readonly auth = inject(Auth);
  protected readonly preferencias = inject(Preferencias);

  readonly menuAbierto = input(false);
  readonly alternarMenu = output<void>();
}
