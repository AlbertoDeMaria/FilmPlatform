import { ErrorService } from './../error/error.service';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  template: `

  <div class="h-100 d-flex flex-column align-items-center justify-content-center">
    <form [formGroup]="form" (ngSubmit)="onSubmit(form)" class="p-5" style="background-color: #424242; width: 300px;">
      <h1 class="text-left">Accedi</h1>
      <div class="example-container">
        <mat-form-field appearance="legacy">
          <mat-label>Email</mat-label>
          <input formControlName="email" matInput placeholder="pat@example.com" required>
          <mat-error *ngIf="getFormC('email')?.invalid && getFormC('email')?.touched">
              <ng-container *ngIf="getErrorC('email','required')">
                Questo campo è obbligatorio
              </ng-container>
              <ng-container *ngIf="getErrorC('email','email')">
                Formato email non valido
              </ng-container>
            </mat-error>
        </mat-form-field>
      </div>
      <div class="example-container pt-2">
        <mat-form-field appearance="legacy">
          <mat-label>Password</mat-label>
          <input formControlName="password" matInput type="password" required>
          <mat-error *ngIf="getFormC('password')?.invalid && getFormC('password')?.touched">
              <ng-container *ngIf="getErrorC('password','required')">
                Questo campo è obbligatorio
              </ng-container>
            </mat-error>
        </mat-form-field>
      </div>
      <button mat-raised-button color="primary" [disabled]="this.form.invalid || isLoading" class="mt-3">
          <span *ngIf="!isLoading">Accedi</span>
          <mat-icon *ngIf="isLoading">
            <mat-spinner color="accent" diameter="20"></mat-spinner>
          </mat-icon>
        </button>
    </form>
    <p>Non hai ancora un account? <button [routerLink]="['/signup']" mat-button class="mt-3">Registrati</button></p>
  </div>

  `,
  styles: [
  ]
})
export class LoginPage implements OnInit {

  form!:FormGroup;
  hide = true;
  isLoading:boolean = false;
  sub!:Subscription

  constructor(private fb:FormBuilder, private authSrv:AuthService, private router:Router, private erroreSrv:ErrorService) { }

  ngOnInit(): void {
    console.log('login');

    this.form = this.fb.group({
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [Validators.required])
    })

    this.sub = this.authSrv.user$.subscribe((val)=>{
      console.log('user state', val);
    })
  }

  // form
  getErrorC(name:string, error:string){
    return this.form.get(name)?.errors![error]
  }

  getFormC(name:string){
    return this.form.get(name);
  }

  async onSubmit(form:FormGroup){
    try {
      this.isLoading = true;
      await this.authSrv.login(form.value).toPromise();
      form.reset();
      this.isLoading = false;
      this.router.navigate(['/']);
    } catch (error:any) {
      console.error(error);
      this.erroreSrv.openSnackBar(error,'chiudi');
      this.isLoading = false;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
