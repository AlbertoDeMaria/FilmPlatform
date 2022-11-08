import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private authSrv:AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.authSrv.user$.pipe(
      take(1),
      switchMap(user=>{
        // se !user faccio il return della richiesta senza modifiche
        if(!user){
          return next.handle(request);
        }
        // se l'utente esiste faccio il return di una nuova richiesta uguale a prima con un dato in piu nell'header
      const newReq = request.clone({
        headers: request.headers.set(
          'Authorization', `Bearer ${user?.accessToken}`
        )
      })
      return next.handle(newReq);
    }))
  }
}
