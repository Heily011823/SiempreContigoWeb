import { Component, inject } from '@angular/core';
import { Datos } from '../../servicios/datos';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.html',
})
export class Citas {
  protected readonly datos = inject(Datos);
}
