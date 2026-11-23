export interface Usuario {
  nombre: string;
  correo: string;
  claveHash: string;
}

export interface DatosRegistro {
  nombre: string;
  correo: string;
  clave: string;
}

export interface Cita {
  medico: string;
  especialidad: string;
  fecha: string;
  hora: string;
  estado: 'Próxima' | 'Realizada';
}

export interface Medicamento {
  id: number;
  nombre: string;
  frecuencia: string;
  inicio: string;
  fin: string;
  dosis: string;
  tomado: boolean;
}

export interface Recordatorio {
  id: number;
  texto: string;
  hora: string;
}

export interface Coordenadas {
  lat: number;
  lng: number;
}

export interface Sede extends Coordenadas {
  nombre: string;
}

export interface SedeCercana {
  sede: Sede;
  km: number;
}

export interface InfoClima {
  temperatura: number;
  descripcion: string;
}

export type TipoErrorGeo = 'sin-soporte' | 'denegado' | 'no-disponible' | 'tiempo';

export type ConsentimientoCookies = 'aceptadas' | 'rechazadas';
