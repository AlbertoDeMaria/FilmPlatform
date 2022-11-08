import { AuthGuard } from './auth/auth.guard';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

const routes:Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    loadChildren:  () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  }
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
