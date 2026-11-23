import { Routes } from '@angular/router';
import { invitadoGuard, sesionGuard } from './guards/sesion-guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Siempre Contigo - Iniciar sesión',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./paginas/login/login').then((m) => m.Login),
  },
  {
    path: 'registro',
    title: 'Siempre Contigo - Registro',
    canActivate: [invitadoGuard],
    loadComponent: () => import('./paginas/registro/registro').then((m) => m.Registro),
  },
  {
    path: '',
    canActivate: [sesionGuard],
    loadComponent: () => import('./paginas/panel/panel').then((m) => m.Panel),
    children: [
      {
        path: '',
        pathMatch: 'full',
        title: 'Siempre Contigo - Inicio',
        loadComponent: () => import('./paginas/inicio/inicio').then((m) => m.Inicio),
      },
      {
        path: 'citas',
        title: 'Siempre Contigo - Citas',
        loadComponent: () => import('./paginas/citas/citas').then((m) => m.Citas),
      },
      {
        path: 'medicamentos',
        title: 'Siempre Contigo - Medicamentos',
        loadComponent: () => import('./paginas/medicamentos/medicamentos').then((m) => m.Medicamentos),
      },
      {
        path: 'recordatorios',
        title: 'Siempre Contigo - Recordatorios',
        loadComponent: () => import('./paginas/recordatorios/recordatorios').then((m) => m.Recordatorios),
      },
      {
        path: 'voz',
        title: 'Siempre Contigo - Lectura de voz',
        loadComponent: () => import('./paginas/voz/voz').then((m) => m.VozPagina),
      },
    ],
  },
  {
    path: '**',
    title: 'Siempre Contigo - Página no encontrada',
    loadComponent: () => import('./paginas/no-encontrada/no-encontrada').then((m) => m.NoEncontrada),
  },
];
