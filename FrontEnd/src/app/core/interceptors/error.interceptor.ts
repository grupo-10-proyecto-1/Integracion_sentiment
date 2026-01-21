import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpContextToken,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { ToastService } from '../services/toast.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const SKIP_ERROR_NOTIFICATION = new HttpContextToken<boolean>(
  () => false
);

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  // Skip global error handling if the request has the SKIP context
  if (req.context.get(SKIP_ERROR_NOTIFICATION)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ocurrió un error inesperado.';

      // Try to get message from backend
      if (error.error && typeof error.error === 'object') {
        if (error.error.detail) {
          errorMessage = error.error.detail;
        } else if (error.error.message) {
          errorMessage = error.error.message;
        }
      }

      // Add context based on status code if no backend message is clear
      if (error.status === 0) {
        errorMessage =
          'No se puede conectar con el servidor. Verifica tu conexión.';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor. Intenta más tarde.';
      } else if (
        error.status === 400 &&
        errorMessage === 'Ocurrió un error inesperado.'
      ) {
        errorMessage = 'La solicitud no es válida.';
      }

      // Show toast
      toastService.showError(errorMessage);

      return throwError(() => error);
    })
  );
};
