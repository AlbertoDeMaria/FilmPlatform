import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, take, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor( private authSrv:AuthService, private router:Router ){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      return this.authSrv.isLoggedIn$.pipe(
        take(1),
        map(isLoggedIn=>{
          if(isLoggedIn){
            return this.router.createUrlTree(['/']);
          }
          return true;
        })
      )

    return true;
  }

}
