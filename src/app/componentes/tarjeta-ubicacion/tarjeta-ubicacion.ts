import { afterNextRender, Component, DestroyRef, ElementRef, inject, signal, viewChild } from '@angular/core';
import * as L from 'leaflet';
import { SedeCercana, TipoErrorGeo } from '../../modelos/modelos';
import { CENTRO_MANIZALES, Geolocalizacion, SEDES } from '../../servicios/geolocalizacion';

@Component({
  selector: 'app-tarjeta-ubicacion',
  templateUrl: './tarjeta-ubicacion.html',
  styleUrl: './tarjeta-ubicacion.css',
})
export class TarjetaUbicacion {
  private readonly geo = inject(Geolocalizacion);
  private readonly contenedorMapa = viewChild.required<ElementRef<HTMLDivElement>>('mapa');
  private mapa?: L.Map;
  private marcadorUsuario?: L.CircleMarker;

  protected readonly cargando = signal(false);
  protected readonly error = signal('');
  protected readonly cercana = signal<SedeCercana | null>(null);

  constructor() {
    afterNextRender(() => this.crearMapa());
    inject(DestroyRef).onDestroy(() => this.mapa?.remove());
  }

  protected async buscar(): Promise<void> {
    this.cargando.set(true);
    this.error.set('');
    try {
      const posicion = await this.geo.obtenerPosicion();
      const cercana = this.geo.sedeMasCercana(posicion);
      this.cercana.set(cercana);
      this.marcadorUsuario?.remove();
      if (this.mapa) {
        this.marcadorUsuario = L.circleMarker([posicion.lat, posicion.lng], {
          radius: 9,
          color: '#fff',
          weight: 2,
          fillColor: '#c0392b',
          fillOpacity: 1,
        })
          .bindTooltip('Tú estás aquí')
          .addTo(this.mapa);
        this.mapa.fitBounds(
          L.latLngBounds([posicion.lat, posicion.lng], [cercana.sede.lat, cercana.sede.lng]),
          { padding: [40, 40], maxZoom: 16 },
        );
      }
    } catch (tipo) {
      this.cercana.set(null);
      this.error.set(this.geo.mensajeError(tipo as TipoErrorGeo));
    } finally {
      this.cargando.set(false);
    }
  }

  private crearMapa(): void {
    this.mapa = L.map(this.contenedorMapa().nativeElement).setView(
      [CENTRO_MANIZALES.lat, CENTRO_MANIZALES.lng],
      13,
    );
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap',
    }).addTo(this.mapa);
    for (const sede of SEDES) {
      L.circleMarker([sede.lat, sede.lng], { radius: 8, color: '#08798a', fillColor: '#08798a', fillOpacity: 0.85 })
        .bindTooltip(sede.nombre)
        .addTo(this.mapa);
    }
  }
}
