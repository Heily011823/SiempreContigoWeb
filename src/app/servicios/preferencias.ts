import { effect, inject, Injectable, signal } from '@angular/core';
import { Cookies, COOKIE_TEXTO } from './cookies';

@Injectable({ providedIn: 'root' })
export class Preferencias {
  private readonly cookies = inject(Cookies);
  readonly textoGrande = signal(this.cookies.leer(COOKIE_TEXTO) === 'grande');

  constructor() {
    effect(() => {
      document.documentElement.classList.toggle('texto-grande', this.textoGrande());
    });
  }

  alternarTexto(): void {
    this.textoGrande.update((v) => !v);
    this.cookies.guardar(COOKIE_TEXTO, this.textoGrande() ? 'grande' : 'normal');
  }
}
