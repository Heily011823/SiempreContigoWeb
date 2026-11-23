import { computed, Injectable, signal } from '@angular/core';
import { DatosRegistro, Usuario } from '../modelos/modelos';

const CLAVE_USUARIOS = 'sc_usuarios';
const CLAVE_SESION = 'sc_sesion';

@Injectable({ providedIn: 'root' })
export class Auth {
  private readonly usuarios = signal<Usuario[]>(this.leerJson<Usuario[]>(CLAVE_USUARIOS) ?? []);
  readonly sesion = signal<Usuario | null>(this.leerJson<Usuario>(CLAVE_SESION));
  readonly estaAutenticado = computed(() => this.sesion() !== null);

  /** Devuelve false si el correo ya está registrado. */
  async registrar(datos: DatosRegistro): Promise<boolean> {
    const correo = datos.correo.trim().toLowerCase();
    if (this.usuarios().some((u) => u.correo === correo)) {
      return false;
    }
    const usuario: Usuario = {
      nombre: datos.nombre.trim(),
      correo,
      claveHash: await this.cifrar(datos.clave),
    };
    this.usuarios.update((lista) => [...lista, usuario]);
    this.guardarJson(CLAVE_USUARIOS, this.usuarios());
    return true;
  }

  /** Valida las credenciales contra los usuarios registrados y abre la sesión. */
  async iniciarSesion(correo: string, clave: string): Promise<boolean> {
    const hash = await this.cifrar(clave);
    const usuario = this.usuarios().find(
      (u) => u.correo === correo.trim().toLowerCase() && u.claveHash === hash,
    );
    if (!usuario) {
      return false;
    }
    this.sesion.set(usuario);
    this.guardarJson(CLAVE_SESION, usuario);
    return true;
  }

  cerrarSesion(): void {
    this.sesion.set(null);
    try {
      localStorage.removeItem(CLAVE_SESION);
    } catch {
      /* almacenamiento no disponible */
    }
  }

  /** SHA-256 con la API del navegador (requiere https o localhost). */
  private async cifrar(texto: string): Promise<string> {
    if (!globalThis.crypto?.subtle) {
      return texto;
    }
    const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(texto));
    return Array.from(new Uint8Array(bytes))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private leerJson<T>(clave: string): T | null {
    try {
      const texto = localStorage.getItem(clave);
      return texto ? (JSON.parse(texto) as T) : null;
    } catch {
      return null;
    }
  }

  private guardarJson(clave: string, valor: unknown): void {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      /* almacenamiento no disponible */
    }
  }
}
