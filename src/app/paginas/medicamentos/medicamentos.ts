import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Datos } from '../../servicios/datos';

function fechaFinValida(grupo: AbstractControl): ValidationErrors | null {
  const inicio = grupo.get('inicio')?.value as string;
  const fin = grupo.get('fin')?.value as string;
  return inicio && fin && fin < inicio ? { rangoFechas: true } : null;
}

@Component({
  selector: 'app-medicamentos',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './medicamentos.html',
})
export class Medicamentos {
  private readonly fb = inject(FormBuilder);
  protected readonly datos = inject(Datos);

  protected readonly formularioAbierto = signal(false);
  protected readonly aviso = signal('');

  protected readonly form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      frecuencia: ['', Validators.required],
      inicio: ['', Validators.required],
      fin: ['', Validators.required],
      dosis: ['', Validators.required],
    },
    { validators: fechaFinValida },
  );

  protected alternarFormulario(): void {
    this.formularioAbierto.update((v) => !v);
  }

  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.datos.agregarMedicamento(this.form.getRawValue());
    this.form.reset();
    this.formularioAbierto.set(false);
    this.aviso.set('Medicamento agregado.');
  }

  protected deshacerUltimo(): void {
    this.aviso.set(
      this.datos.eliminarUltimoMedicamento() ? 'Se eliminó el último medicamento.' : 'No hay más medicamentos para eliminar.',
    );
  }

  protected invalido(campo: string): boolean {
    const control = this.form.get(campo);
    return !!control && control.invalid && control.touched;
  }
}
