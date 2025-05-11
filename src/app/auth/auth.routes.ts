import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { OtpComponent } from './otp/otp.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

export const AUTH_ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'otp', component: OtpComponent },
  { path: 'reset-password', component: ResetPasswordComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' }
];