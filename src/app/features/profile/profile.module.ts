import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileComponent } from './profile.page';


@NgModule({
  declarations: [
    ProfileComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    MatTabsModule
  ]
})
export class ProfileModule { }
