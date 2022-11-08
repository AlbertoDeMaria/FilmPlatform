import { signupData } from './../model/signUpData';
import { AuthData } from '../model/authData';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, tap, BehaviorSubject, map, Subscription } from 'rxjs';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  URL = 'http://localhost:4201/';

  private authSubject = new BehaviorSubject<null|AuthData>(null);
  user$ = this.authSubject.asObservable()
  // booleano per sapere se l'utente è loggato o meno
  isLoggedIn$ = this.user$.pipe(map(user=>!!user));
  //JWT mi serve per sapere se il token è scaduto o meno
  jwtHelper = new JwtHelperService();

  sub!:Subscription
  autoLogoutTimer:any;

  constructor(private http:HttpClient, private router:Router) {
    // appena il service viene creato richiamo restoreUser()
    this.restoreUser()
  }

  getUserInfo(){
    let info;
    this.sub = this.user$.subscribe(user => info = user?.user);
    return info;
  }

  getUserId(){
    let loggedUser = this.getUserInfo();
    if(loggedUser){
      return loggedUser['id'];
    }
    return 0;
  }

  login(data:{email:string, password:string}){
    return this.http.post<AuthData>(`${this.URL}login`, data).pipe(tap(val => {
      console.log(val);
    }), tap(data=>{
      this.authSubject.next(data);
      // salvo nel local storage data
      localStorage.setItem('userToken', JSON.stringify(data));
      // faccio partire il timer per l'auto logout
      const expirationDate = this.jwtHelper.getTokenExpirationDate(data.accessToken) as Date;
      this.autoLogout(expirationDate);
    }), catchError(this.errors));
  }

  restoreUser(){
    const userJson = localStorage.getItem('userToken');
    if(!userJson){
      return
    }
    const user:AuthData = JSON.parse( userJson );
    // se è scaduto non ritorno niente se no faccio il restore con il next
    if( this.jwtHelper.isTokenExpired(user.accessToken) ){
      return
    }
    this.authSubject.next(user);
    const expirationDate = this.jwtHelper.getTokenExpirationDate(user.accessToken) as Date;
    this.autoLogout(expirationDate);
  }

  signUp(data:signupData){
    return this.http.post(`${this.URL}register`, data).pipe(catchError(this.errors));
  }

  logout(){
    // faccio il next di null ovvero lo stato iniziale
    this.authSubject.next(null);
    // ritorno alla pagina di login
    this.router.navigate(['/login']);
    // cancello i dati dal localstorage
    localStorage.removeItem('userToken');
    // se è stato settato un timer cancello il timer che ho impostato
    if(this.autoLogoutTimer){
      clearTimeout(this.autoLogoutTimer);
    }
  }

  // se il token è scaduto faccio l'auto-logout
  autoLogout(expirationDate:Date){
    // data di scadenza - la data di oggi
    const expMs = expirationDate.getTime() - new Date().getTime();
    this.autoLogoutTimer = setTimeout(() => {
      this.logout();
    }, expMs);
  }

  public errors(err: any) {
    switch (err.error) {
      case 'Password is too short':
        return throwError(() => new Error('La password è troppo corta'));
        break;
      case 'Email already exists':
        return throwError(() => new Error('Utente già registrato'));
        break;
      case 'Incorrect password':
        return throwError(() => new Error('Password sbagliata'));
        break;
      case 'Cannot find user':
        return throwError(() => new Error('Utente non trovato'));
        break;
      default:
        return throwError(() => new Error('Errore nel processo'));
        break;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
