import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { InfoClima } from '../modelos/modelos';

interface RespuestaOpenMeteo {
  current: { temperature_2m: number; weather_code: number };
}

const URL_CLIMA =
  'https://api.open-meteo.com/v1/forecast?latitude=5.0689&longitude=-75.5174&elevation=2150&current=temperature_2m,weather_code&timezone=auto';

@Injectable({ providedIn: 'root' })
export class Clima {
  private readonly http = inject(HttpClient);

  consultar(): Observable<InfoClima> {
    return this.http.get<RespuestaOpenMeteo>(URL_CLIMA).pipe(
      map((r) => ({
        temperatura: r.current.temperature_2m,
        descripcion: this.interpretar(r.current.weather_code),
      })),
    );
  }

  private interpretar(codigo: number): string {
    if (codigo === 0) return 'Despejado. Buen día para salir.';
    if (codigo <= 3) return 'Parcialmente nublado.';
    if (codigo <= 48) return 'Con niebla, ten cuidado al salir.';
    if (codigo <= 67) return 'Con lluvia, lleva paraguas.';
    return 'Clima variable, revisa antes de salir.';
  }
}
