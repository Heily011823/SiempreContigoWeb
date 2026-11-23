import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Recordatorio } from '../../modelos/modelos';
import { Datos } from '../../servicios/datos';

@Component({
  selector: 'app-recordatorios',
  imports: [CdkDropList, CdkDrag, ReactiveFormsModule],
  templateUrl: './recordatorios.html',
  styleUrl: './recordatorios.css',
})
export class Recordatorios {
  private readonly fb = inject(FormBuilder);
  protected readonly datos = inject(Datos);

  protected readonly form = this.fb.nonNullable.group({
    texto: ['', [Validators.required, Validators.minLength(3)]],
    hora: ['', Validators.required],
  });

  /** Reordena dentro de una lista o mueve el recordatorio a la otra. */
  protected soltar(evento: CdkDragDrop<Recordatorio[]>): void {
    const destino = [...evento.container.data];
    if (evento.previousContainer === evento.container) {
      moveItemInArray(destino, evento.previousIndex, evento.currentIndex);
      this.guardarLista(evento.container.id, destino);
      return;
    }
    const origen = [...evento.previousContainer.data];
    transferArrayItem(origen, destino, evento.previousIndex, evento.currentIndex);
    this.guardarLista(evento.previousContainer.id, origen);
    this.guardarLista(evento.container.id, destino);
  }

  /** Alternativa sin arrastrar (teclado y pantallas táctiles). */
  protected mover(recordatorio: Recordatorio, haciaHechos: boolean): void {
    const [desde, hacia] = haciaHechos ? [this.datos.pendientes, this.datos.hechos] : [this.datos.hechos, this.datos.pendientes];
    desde.update((l) => l.filter((r) => r.id !== recordatorio.id));
    hacia.update((l) => [...l, recordatorio]);
  }

  protected agregar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { texto, hora } = this.form.getRawValue();
    this.datos.agregarRecordatorio(texto.trim(), hora);
    this.form.reset();
  }

  private guardarLista(id: string, lista: Recordatorio[]): void {
    (id === 'pendientes' ? this.datos.pendientes : this.datos.hechos).set(lista);
  }
}
