import { Injectable, signal } from '@angular/core';
import { ConsentimientoCookies } from '../modelos/modelos';

export const COOKIE_CONSENTIMIENTO = 'sc_consentimiento';
export const COOKIE_USUARIO = 'sc_usuario';
export const COOKIE_TEXTO = 'sc_texto';

@Injectable({ providedIn: 'root' })
export class Cookies {
  readonly consentimiento = signal<ConsentimientoCookies | null>(
    this.leer(COOKIE_CONSENTIMIENTO) as ConsentimientoCookies | null,
  );
  readonly bannerVisible = signal(this.consentimiento() === null);

  /** Guarda una cookie. Las de preferencias solo se guardan si el usuario las aceptó. */
  guardar(nombre: string, valor: string, dias = 365): boolean {
    if (nombre !== COOKIE_CONSENTIMIENTO && this.consentimiento() !== 'aceptadas') {
      return false;
    }
    const expira = new Date(Date.now() + dias * 24 * 60 * 60 * 1000).toUTCString();
    document.cookie = `${nombre}=${encodeURIComponent(valor)}; expires=${expira}; path=/; SameSite=Lax`;
    return true;
  }

  leer(nombre: string): string | null {
    const par = document.cookie.split('; ').find((c) => c.startsWith(`${nombre}=`));
    return par ? decodeURIComponent(par.substring(nombre.length + 1)) : null;
  }

  eliminar(nombre: string): void {
    document.cookie = `${nombre}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; SameSite=Lax`;
  }

  aceptar(): void {
    this.consentimiento.set('aceptadas');
    this.guardar(COOKIE_CONSENTIMIENTO, 'aceptadas');
    this.bannerVisible.set(false);
  }

  rechazar(): void {
    this.eliminarPreferencias();
    this.consentimiento.set('rechazadas');
    this.guardar(COOKIE_CONSENTIMIENTO, 'rechazadas');
    this.bannerVisible.set(false);
  }

  eliminarPreferencias(): void {
    this.eliminar(COOKIE_USUARIO);
    this.eliminar(COOKIE_TEXTO);
  }

  mostrarBanner(): void {
    this.bannerVisible.set(true);
  }
}
