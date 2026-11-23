import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BannerCookies } from './componentes/banner-cookies/banner-cookies';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, BannerCookies],
  templateUrl: './app.html',
})
export class App {}
