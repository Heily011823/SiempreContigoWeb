import { Component, inject, input, output } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Auth } from '../../servicios/auth';

interface OpcionMenu {
  ruta: string;
  texto: string;
  icono: string;
}

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  readonly abierto = input(false);
  readonly cerrar = output<void>();

  protected readonly opciones: readonly OpcionMenu[] = [
    { ruta: '/', texto: 'Inicio', icono: 'images/Inicio.png' },
    { ruta: '/citas', texto: 'Citas', icono: 'images/cita-medica.png' },
    { ruta: '/medicamentos', texto: 'Medicamentos', icono: 'images/Medicamentos.png' },
    { ruta: '/recordatorios', texto: 'Recordatorios', icono: 'images/Recordatorios.png' },
    { ruta: '/voz', texto: 'Lectura de voz', icono: 'images/Lecturadevoz.png' },
  ];

  protected salir(): void {
    this.auth.cerrarSesion();
    this.cerrar.emit();
    this.router.navigate(['/login']);
  }
}
