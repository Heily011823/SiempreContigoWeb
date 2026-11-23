import { Component, inject, signal } from '@angular/core';
import { TarjetaUbicacion } from '../../componentes/tarjeta-ubicacion/tarjeta-ubicacion';
import { InfoClima } from '../../modelos/modelos';
import { Auth } from '../../servicios/auth';
import { Clima } from '../../servicios/clima';
import { Datos } from '../../servicios/datos';

type EstadoClima = 'cargando' | 'ok' | 'error';

@Component({
  selector: 'app-inicio',
  imports: [TarjetaUbicacion],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  private readonly auth = inject(Auth);
  private readonly clima = inject(Clima);
  protected readonly datos = inject(Datos);

  protected readonly detalleAbierto = signal(false);
  protected readonly estadoClima = signal<EstadoClima>('cargando');
  protected readonly infoClima = signal<InfoClima | null>(null);
  protected readonly alertaEnviada = signal(false);

  protected readonly nombre = this.auth.sesion()?.nombre.split(' ')[0] ?? '';
  protected readonly saludo = this.calcularSaludo();
  protected readonly recomendaciones = [
    'Toma tus medicamentos a la hora indicada',
    'Bebe al menos 6 vasos de agua',
    'Sal a caminar 15 minutos',
  ];

  constructor() {
    this.cargarClima();
  }

  protected cargarClima(): void {
    this.estadoClima.set('cargando');
    this.clima.consultar().subscribe({
      next: (info) => {
        this.infoClima.set(info);
        this.estadoClima.set('ok');
      },
      error: () => this.estadoClima.set('error'),
    });
  }

  protected alternarDetalle(): void {
    this.detalleAbierto.update((v) => !v);
  }

  protected pedirAyuda(): void {
    this.alertaEnviada.set(true);
    setTimeout(() => this.alertaEnviada.set(false), 4000);
  }

  private calcularSaludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) return 'Buenos días';
    return hora < 19 ? 'Buenas tardes' : 'Buenas noches';
  }
}
