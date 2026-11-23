import { Injectable } from '@angular/core';
import { Coordenadas, Sede, SedeCercana, TipoErrorGeo } from '../modelos/modelos';

export const CENTRO_MANIZALES: Coordenadas = { lat: 5.0689, lng: -75.5174 };

/** Sedes de ejemplo (coordenadas aproximadas): ajústalas a las reales del proyecto. */
export const SEDES: readonly Sede[] = [
  { nombre: 'Sede Centro', lat: 5.0689, lng: -75.5174 },
  { nombre: 'Sede Chipre', lat: 5.0615, lng: -75.53 },
  { nombre: 'Sede Milán', lat: 5.053, lng: -75.485 },
  { nombre: 'Sede Cable', lat: 5.069, lng: -75.495 },
];

@Injectable({ providedIn: 'root' })
export class Geolocalizacion {
  obtenerPosicion(): Promise<Coordenadas> {
    return new Promise((resolver, rechazar) => {
      if (!('geolocation' in navigator)) {
        rechazar('sin-soporte' as TipoErrorGeo);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (p) => resolver({ lat: p.coords.latitude, lng: p.coords.longitude }),
        (e) => rechazar(this.traducirError(e)),
        { enableHighAccuracy: true, timeout: 10000 },
      );
    });
  }

  sedeMasCercana(origen: Coordenadas): SedeCercana {
    return SEDES.map((sede) => ({ sede, km: this.distanciaKm(origen, sede) })).reduce((a, b) =>
      b.km < a.km ? b : a,
    );
  }

  mensajeError(tipo: TipoErrorGeo): string {
    const mensajes: Record<TipoErrorGeo, string> = {
      'sin-soporte': 'Tu navegador no permite la geolocalización.',
      denegado: 'Negaste el permiso de ubicación. Actívalo en el navegador para ver tu sede más cercana.',
      'no-disponible': 'No se pudo determinar tu ubicación en este momento.',
      tiempo: 'La ubicación tardó demasiado en responder. Intenta de nuevo.',
    };
    return mensajes[tipo];
  }

  /** Fórmula de Haversine. */
  private distanciaKm(a: Coordenadas, b: Coordenadas): number {
    const rad = (g: number) => (g * Math.PI) / 180;
    const dLat = rad(b.lat - a.lat);
    const dLng = rad(b.lng - a.lng);
    const h =
      Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
    return 6371 * 2 * Math.asin(Math.sqrt(h));
  }

  private traducirError(e: GeolocationPositionError): TipoErrorGeo {
    if (e.code === e.PERMISSION_DENIED) return 'denegado';
    if (e.code === e.TIMEOUT) return 'tiempo';
    return 'no-disponible';
  }
}
