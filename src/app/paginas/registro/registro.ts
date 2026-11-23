import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../servicios/auth';

function clavesIguales(grupo: AbstractControl): ValidationErrors | null {
  const clave = grupo.get('clave')?.value as string;
  const confirmar = grupo.get('confirmar')?.value as string;
  return clave && confirmar && clave !== confirmar ? { clavesDistintas: true } : null;
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
})
export class Registro {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly enviando = signal(false);

  protected readonly form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      correo: ['', [Validators.required, Validators.email]],
      clave: ['', [Validators.required, Validators.minLength(8)]],
      confirmar: ['', Validators.required],
    },
    { validators: clavesIguales },
  );

  protected async registrar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { nombre, correo, clave } = this.form.getRawValue();
    this.enviando.set(true);
    const creado = await this.auth.registrar({ nombre, correo, clave });
    this.enviando.set(false);
    if (!creado) {
      this.error.set('Ya existe un usuario con ese correo.');
      return;
    }
    await this.auth.iniciarSesion(correo, clave);
    await this.router.navigate(['/']);
  }

  protected invalido(campo: 'nombre' | 'correo' | 'clave' | 'confirmar'): boolean {
    const control = this.form.controls[campo];
    return control.invalid && control.touched;
  }
}
