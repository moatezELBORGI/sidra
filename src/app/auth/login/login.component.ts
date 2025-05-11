import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl:'./login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  error = '';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
  
  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.error = '';
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password).subscribe({
      next: () => {
        this.router.navigate(['/auth/otp']);
      },
      error: (err) => {
        this.error = 'Identifiants invalides. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }
}
