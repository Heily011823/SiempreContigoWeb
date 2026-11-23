import { Component, inject } from '@angular/core';
import { Cookies } from '../../servicios/cookies';

@Component({
  selector: 'app-banner-cookies',
  templateUrl: './banner-cookies.html',
  styleUrl: './banner-cookies.css',
})
export class BannerCookies {
  protected readonly cookies = inject(Cookies);

  protected borrar(): void {
    this.cookies.eliminarPreferencias();
    this.cookies.rechazar();
  }
}
