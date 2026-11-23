import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '../servicios/auth';

/** Protege las rutas privadas: sin sesión se envía al login. */
export const sesionGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  return auth.estaAutenticado() ? true : inject(Router).createUrlTree(['/login']);
};

/** Evita que un usuario con sesión vea login o registro. */
export const invitadoGuard: CanActivateFn = () => {
  const auth = inject(Auth);
  return auth.estaAutenticado() ? inject(Router).createUrlTree(['/']) : true;
};
