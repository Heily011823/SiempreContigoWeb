import { Component, computed, inject, signal } from '@angular/core';
import { Datos } from '../../servicios/datos';
import { Voz } from '../../servicios/voz';

@Component({
  selector: 'app-voz',
  templateUrl: './voz.html',
})
export class VozPagina {
  private readonly datos = inject(Datos);
  protected readonly voz = inject(Voz);
  protected readonly leyendo = signal(false);

  protected readonly texto = computed(() => {
    const meds = this.datos.medicamentos().filter((m) => !m.tomado);
    const recs = this.datos.pendientes();
    const partes = ['Bienvenida a Siempre Contigo.'];
    partes.push(
      meds.length
        ? `Tienes ${meds.length} medicamentos pendientes: ${meds.map((m) => `${m.nombre}, ${m.frecuencia}`).join('. ')}.`
        : 'No tienes medicamentos pendientes.',
    );
    partes.push(
      recs.length ? `Tus recordatorios: ${recs.map((r) => `${r.texto} a las ${r.hora}`).join('. ')}.` : 'No tienes recordatorios pendientes.',
    );
    return partes.join(' ');
  });

  protected escuchar(): void {
    this.voz.leer(this.texto());
    this.leyendo.set(true);
  }
}
