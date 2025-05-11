import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-container fade-in">
        <div class="logo-container">
          <img src="https://images.pexels.com/photos/3938023/pexels-photo-3938023.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Ministry of Health Logo" class="ministry-logo">
          <img src="https://images.pexels.com/photos/969214/pexels-photo-969214.jpeg?auto=compress&cs=tinysrgb&w=150" alt="Tunisian Flag" class="flag-logo">
        </div>
        
        <h1>SIDRA</h1>
        <p class="subtitle">Système d'Information sur les Drogues et Addictions</p>
        
        <div class="card reset-card">
          <h2>Réinitialisation du mot de passe</h2>
          
          <p class="reset-message">Veuillez entrer votre adresse e-mail. Nous vous enverrons un lien pour réinitialiser votre mot de passe.</p>
          
          <form [formGroup]="resetForm" (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                type="email" 
                id="email" 
                formControlName="email" 
                class="form-control"
                placeholder="Entrez votre email"
              >
              <div *ngIf="email?.invalid && (email?.dirty || email?.touched)" class="error-message">
                <div *ngIf="email?.errors?.['required']">Email est obligatoire</div>
                <div *ngIf="email?.errors?.['email']">Format d'email invalide</div>
              </div>
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-primary reset-btn" [disabled]="resetForm.invalid || isLoading">
                {{ isLoading ? 'Envoi en cours...' : 'Envoyer le lien' }}
              </button>
            </div>
            
            <div class="login-link-container">
              <a routerLink="/auth/login" class="login-link">Retour à la connexion</a>
            </div>
          </form>
        </div>
        
        <div class="copyright">
          © Centre Informatique du Ministère de la Santé
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--background);
      padding: var(--spacing-2);
    }
    
    .auth-container {
      width: 100%;
      max-width: 480px;
      text-align: center;
    }
    
    .logo-container {
      display: flex;
      justify-content: center;
      gap: var(--spacing-4);
      margin-bottom: var(--spacing-3);
    }
    
    .ministry-logo, .flag-logo {
      height: 80px;
      object-fit: contain;
      border-radius: var(--radius-sm);
    }
    
    h1 {
      font-size: 36px;
      color: var(--primary);
      margin-bottom: var(--spacing-1);
    }
    
    .subtitle {
      color: var(--text-secondary);
      margin-bottom: var(--spacing-3);
    }
    
    .reset-card {
      margin-bottom: var(--spacing-3);
      text-align: left;
    }
    
    .reset-message {
      margin-bottom: var(--spacing-3);
      color: var(--text-secondary);
    }
    
    .reset-btn {
      width: 100%;
      padding: var(--spacing-2);
      font-size: 16px;
      margin-bottom: var(--spacing-2);
    }
    
    .reset-btn:disabled {
      background-color: var(--text-secondary);
      cursor: not-allowed;
    }
    
    .login-link-container {
      text-align: center;
      margin-top: var(--spacing-2);
    }
    
    .login-link {
      font-size: 14px;
    }
    
    .copyright {
      margin-top: var(--spacing-3);
      font-size: 14px;
      color: var(--text-secondary);
    }
    
    @media (max-width: 768px) {
      .logo-container {
        gap: var(--spacing-2);
      }
      
      .ministry-logo, .flag-logo {
        height: 60px;
      }
      
      h1 {
        font-size: 28px;
      }
    }
  `]
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  isLoading = false;
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }
  
  get email() { return this.resetForm.get('email'); }
  
  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    
    // Simulate API call for password reset
    setTimeout(() => {
      this.isLoading = false;
      alert('Un email de réinitialisation a été envoyé à votre adresse email.');
      this.router.navigate(['/auth/login']);
    }, 1500);
  }
}