import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpErrorInterceptorService {
  constructor(private toastrService: ToastrService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        const { errorType, errorMessage } = this.handleError(httpErrorResponse);

        // Only show Toastr error for non-200 statuses
        if (httpErrorResponse.status !== 200) {
          this.toastrService.error(errorMessage, errorType, {
            closeButton: true,
          });
        }

        // Throw the error
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private handleError(httpErrorResponse: HttpErrorResponse): {
    errorType: string;
    errorMessage: string;
  } {
    if (httpErrorResponse.error instanceof ErrorEvent) {
      return this.handleClientError(httpErrorResponse);
    } else {
      return this.handleServerError(httpErrorResponse);
    }
  }

  private handleClientError(httpErrorResponse: HttpErrorResponse): {
    errorType: string;
    errorMessage: string;
  } {
    return {
      errorType: 'Client-side error',
      errorMessage: httpErrorResponse.error.message,
    };
  }

  private handleServerError(httpErrorResponse: HttpErrorResponse): {
    errorType: string;
    errorMessage: string;
  } {
    if (httpErrorResponse.status === 0) {
      return {
        errorType: 'Server-side error',
        errorMessage: 'No hay conexión con el servidor',
      };
    } else {
      return this.handleSpecificServerError(httpErrorResponse);
    }
  }

  private handleSpecificServerError(httpErrorResponse: HttpErrorResponse): {
    errorType: string;
    errorMessage: string;
  } {
    let errorType = 'Server-side error';
    let errorMessage = `${httpErrorResponse.status}: ${httpErrorResponse.message}`;

    if (httpErrorResponse.url?.includes('/token')) {
      errorType = 'Error en la autenticación';
      errorMessage = 'Credenciales inválidas';
    } else if (httpErrorResponse.url?.includes('/consumer/details')) {
      errorType = 'Error en la consulta de consumidor';
      if (httpErrorResponse.message.includes('404 Not Found')) {
        errorMessage = 'No se encontro un consumidor con los datos ingresados';
      }
    }

    return { errorType, errorMessage };
  }
}
