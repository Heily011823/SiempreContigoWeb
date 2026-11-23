import { computed, Injectable, signal } from '@angular/core';
import { Cita, Medicamento, Recordatorio } from '../modelos/modelos';

@Injectable({ providedIn: 'root' })
export class Datos {
  readonly citas = signal<Cita[]>([
    { medico: 'Dr. Juan Pérez', especialidad: 'Medicina general', fecha: 'Viernes, 24 de Mayo', hora: '10:00 a.m.', estado: 'Próxima' },
    { medico: 'Dra. Laura Gómez', especialidad: 'Cardiología', fecha: 'Lunes, 3 de Junio', hora: '2:00 p.m.', estado: 'Próxima' },
    { medico: 'Dr. Andrés Ruiz', especialidad: 'Oftalmología', fecha: 'Martes, 5 de Mayo', hora: '9:00 a.m.', estado: 'Realizada' },
    { medico: 'Dra. Marcela Ortiz', especialidad: 'Nutrición', fecha: 'Jueves, 16 de Abril', hora: '3:30 p.m.', estado: 'Realizada' },
  ]);
  readonly proximaCita = computed(() => this.citas().find((c) => c.estado === 'Próxima'));

  readonly medicamentos = signal<Medicamento[]>([
    { id: 1, nombre: 'Acetaminofén', frecuencia: 'Cada 8 horas', inicio: '2026-09-05', fin: '2026-09-10', dosis: '1 tableta', tomado: false },
    { id: 2, nombre: 'Losartán', frecuencia: 'Cada 12 horas', inicio: '2026-09-05', fin: '2026-09-20', dosis: '1 tableta', tomado: false },
    { id: 3, nombre: 'Omeprazol', frecuencia: 'Cada 24 horas', inicio: '2026-09-05', fin: '2026-09-30', dosis: '1 cápsula', tomado: false },
  ]);
  readonly medicamentoPendiente = computed(() => this.medicamentos().find((m) => !m.tomado));

  readonly pendientes = signal<Recordatorio[]>([
    { id: 1, texto: 'Beber agua', hora: '11:00 a.m.' },
    { id: 2, texto: 'Caminar', hora: '4:00 p.m.' },
  ]);
  readonly hechos = signal<Recordatorio[]>([]);

  agregarMedicamento(datos: Omit<Medicamento, 'id' | 'tomado'>): void {
    const id = Math.max(0, ...this.medicamentos().map((m) => m.id)) + 1;
    this.medicamentos.update((l) => [...l, { ...datos, id, tomado: false }]);
  }

  /** Devuelve false si no hay medicamentos para eliminar. */
  eliminarUltimoMedicamento(): boolean {
    if (this.medicamentos().length === 0) return false;
    this.medicamentos.update((l) => l.slice(0, -1));
    return true;
  }

  alternarTomado(id: number): void {
    this.medicamentos.update((l) => l.map((m) => (m.id === id ? { ...m, tomado: !m.tomado } : m)));
  }

  agregarRecordatorio(texto: string, hora: string): void {
    const id = Math.max(0, ...this.pendientes().map((r) => r.id), ...this.hechos().map((r) => r.id)) + 1;
    this.pendientes.update((l) => [...l, { id, texto, hora }]);
  }
}
