import { Subscription } from 'rxjs';
import { ErrorService } from './../error/error.service';
import { AuthService } from './auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `
    <div class="h-100 d-flex flex-column align-items-center justify-content-center">
      <form [formGroup]="form" (ngSubmit)="onSubmit(form)" class="p-5" style="background-color: #424242; width: 300px;">
        <h1 class="text-left">Registrati</h1>
        <div class="example-container">
          <mat-form-field appearance="legacy">
            <mat-label>Nome</mat-label>
            <input formControlName="name" matInput placeholder="pat@example.com" required>
            <mat-error *ngIf="getFormC('name')?.invalid && getFormC('name')?.touched">
              <ng-container *ngIf="getErrorC('name','required')">
                Questo campo è obbligatorio
              </ng-container>
            </mat-error>
          </mat-form-field>
        </div>
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
        <div class="example-container">
          <mat-form-field appearance="legacy">
            <mat-label>Password</mat-label>
            <input formControlName="password" matInput type="password" required>
            <mat-error *ngIf="getFormC('password')?.invalid && getFormC('password')?.touched">
              <ng-container *ngIf="getErrorC('password','required')">
                Questo campo è obbligatorio
              </ng-container>
              <ng-container *ngIf="getErrorC('password','minlength')">
                Deve contenere almeno 6 cifre
              </ng-container>
            </mat-error>
          </mat-form-field>
        </div>
        <button mat-raised-button [disabled]="this.form.invalid || isLoading" color="primary" class="mt-3">
          <span *ngIf="!isLoading">Registrati</span>
          <mat-icon *ngIf="isLoading">
            <mat-spinner color="accent" diameter="20"></mat-spinner>
          </mat-icon>
        </button>
      </form>
      <p>Hai già un account?<button mat-button [routerLink]="['/login']" class="mt-3">Accedi</button></p>
    </div>
  `,
  styles: []
})
export class SignupPage implements OnInit {

  isLoading:boolean = false;
  form!:FormGroup;
  sub!:Subscription

  constructor(private fb:FormBuilder, private authSrv:AuthService, private router:Router, private errorSrv:ErrorService) { }

  ngOnInit(): void {
    console.log('register');

    this.form = this.fb.group({
      name: this.fb.control(null, [Validators.required]),
      email: this.fb.control(null, [Validators.required, Validators.email]),
      password: this.fb.control(null, [Validators.required, Validators.minLength(6)])
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
    // console.log(form)
    this.isLoading = true;
    console.log(form.value);
    try {
      await this.authSrv.signUp(form.value).toPromise();
      form.reset();
      this.isLoading = false;
      this.router.navigate(['/login']);
    } catch (error:any) {
      this.isLoading = false;
      this.errorSrv.openSnackBar(error,'chiudi');
      console.error(error);
    }
  }



}
