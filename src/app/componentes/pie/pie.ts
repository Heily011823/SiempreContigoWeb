import { Component, inject } from '@angular/core';
import { Cookies } from '../../servicios/cookies';

@Component({
  selector: 'app-pie',
  templateUrl: './pie.html',
  styleUrl: './pie.css',
})
export class Pie {
  protected readonly cookies = inject(Cookies);
  protected readonly anio = new Date().getFullYear();
}
