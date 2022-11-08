import { ErrorModule } from './error/error.module';
import { DashboardModule } from './features/dashboard/dashboard.module';
import { AuthModule } from './auth/auth.module';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    AuthModule,
    DashboardModule,
    ErrorModule,
  ],
  bootstrap: [AppComponent],
})

export class AppModule { }
