import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../servicios/auth';
import { Cookies, COOKIE_USUARIO } from '../../servicios/cookies';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
})
export class Login {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(Auth);
  private readonly cookies = inject(Cookies);
  private readonly router = inject(Router);

  protected readonly error = signal('');
  protected readonly enviando = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    correo: [this.cookies.leer(COOKIE_USUARIO) ?? '', [Validators.required, Validators.email]],
    clave: ['', Validators.required],
    recordar: [this.cookies.leer(COOKIE_USUARIO) !== null],
  });

  protected async entrar(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { correo, clave, recordar } = this.form.getRawValue();
    this.enviando.set(true);
    const ok = await this.auth.iniciarSesion(correo, clave);
    this.enviando.set(false);
    if (!ok) {
      this.error.set('El correo o la contraseña no coinciden con un usuario registrado.');
      return;
    }
    if (recordar) {
      this.cookies.guardar(COOKIE_USUARIO, correo.trim().toLowerCase());
    } else {
      this.cookies.eliminar(COOKIE_USUARIO);
    }
    await this.router.navigate(['/']);
  }
}
