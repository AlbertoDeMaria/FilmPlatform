import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    children: [
      {
        path: '',
        loadChildren: ()=>
          import ('../movies/movies.module').then((m) => m.MoviesModule),
      },
      {
        path: 'profile',
        loadChildren: ()=>
          import ('../profile/profile.module').then((m) => m.ProfileModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
