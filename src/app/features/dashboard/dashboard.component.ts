import { AuthService } from './../../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  template: `

    <mat-drawer-container class="h-100">
      <mat-drawer mode="side" style="width: 200px;" opened class="p-3">
        <div fxLayout="column" fxLayoutAlign="space-between" class="h-100">
          <h1 class="mb-5">Menu</h1>
          <div style="margin-bottom: auto;">
            <mat-list>
              <mat-list-item> <a href="#" [routerLink]="['/']"> Movies </a> </mat-list-item>
              <mat-list-item> <a href="#" [routerLink]="['/profile']"> Profile </a> </mat-list-item>
            </mat-list>
          </div>
          <div>
            <button (click)="onLogout()" mat-raised-button color="warn">Esci</button>
          </div>
        </div>
      </mat-drawer>
      <mat-drawer-content>
        <mat-toolbar color="primary">
          <span>movies</span>
        </mat-toolbar>
        <div class="p-4">
          <router-outlet></router-outlet>
        </div>
      </mat-drawer-content>
    </mat-drawer-container>

  `,
  styles: []
})

export class DashboardComponent implements OnInit {

  constructor(private authSrv:AuthService) { }

  ngOnInit(): void {
    console.log('dashboard');
  }

  onLogout(){
    this.authSrv.logout();
  }

}
