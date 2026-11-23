import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Voz {
  readonly disponible = 'speechSynthesis' in window;

  leer(texto: string): void {
    if (!this.disponible) return;
    window.speechSynthesis.cancel();
    const mensaje = new SpeechSynthesisUtterance(texto);
    mensaje.lang = 'es-CO';
    window.speechSynthesis.speak(mensaje);
  }
}
