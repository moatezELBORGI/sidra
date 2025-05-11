import { Component, ElementRef, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="auth-page">
      <div class="auth-container fade-in">
        <div class="logo-container">
          <img src="../../../assets/logo/logoMinistere.png" alt="Tunisian Flag" class="flag-logo">
        </div>
        
        <h1>SIDRA</h1>
        <p class="subtitle">Système d'Information sur les Drogues et Addictions</p>
        
        <div class="card otp-card">
          <h2>Vérification OTP</h2>
          
          <p class="otp-message">Un code de vérification a été envoyé au numéro 99 *** **99</p>
          
          <form [formGroup]="otpForm" (ngSubmit)="onSubmit()">
            <div class="otp-inputs">
              <ng-container *ngFor="let control of otpControls; let i = index">
                <input 
                  #otpInput
                  type="text" 
                  maxlength="1" 
                  [formControlName]="'digit' + i"
                  class="otp-input"
                  (keydown)="onKeyDown($event, i)"
                  (input)="onInput(i)"
                  (focus)="onFocus(i)"
                  (paste)="onPaste($event)"
                  autocomplete="off"
                  inputmode="numeric"
                  pattern="[0-9]*"
                >
              </ng-container>
            </div>
            
            <div *ngIf="error" class="error-message otp-error">
              {{ error }}
            </div>
            
            <div class="form-actions">
              <button type="submit" class="btn-primary otp-btn" [disabled]="otpForm.invalid || isLoading">
                {{ isLoading ? 'Vérification...' : 'Vérifier' }}
              </button>
            </div>
            
            <div class="resend-container">
              <a href="javascript:void(0)" class="resend-link" (click)="resendOtp()">Renvoyer le code OTP</a>
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
    
    .otp-card {
      margin-bottom: var(--spacing-3);
      text-align: left;
    }
    
    .otp-message {
      margin-bottom: var(--spacing-3);
    }
    
    .otp-inputs {
      display: flex;
      justify-content: space-between;
      gap: var(--spacing-2);
      margin-bottom: var(--spacing-3);
    }
    
    .otp-input {
      width: 48px;
      height: 48px;
      text-align: center;
      font-size: 18px;
      border: 1px solid var(--border);
      border-radius: var(--radius-md);
    }
    
    .otp-input:focus {
      border-color: var(--primary);
      outline: none;
      box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
    }
    
    .otp-input.empty:focus {
      border-color: var(--error);
      box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.2);
    }
    
    .otp-btn {
      width: 100%;
      padding: var(--spacing-2);
      font-size: 16px;
      margin-bottom: var(--spacing-2);
    }
    
    .otp-btn:disabled {
      background-color: var(--text-secondary);
      cursor: not-allowed;
    }
    
    .resend-container {
      text-align: center;
      margin-top: var(--spacing-2);
    }
    
    .resend-link {
      font-size: 14px;
    }
    
    .otp-error {
      margin-bottom: var(--spacing-2);
      text-align: center;
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
      
      .otp-input {
        width: 40px;
        height: 40px;
      }
    }
    
    @media (max-width: 360px) {
      .otp-input {
        width: 36px;
        height: 36px;
        font-size: 16px;
      }
    }
  `]
})
export class OtpComponent implements AfterViewInit {
  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef>;
  
  otpForm: FormGroup;
  isLoading = false;
  error = '';
  otpControls = Array(6).fill(0);
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    // Create form controls for each digit
    const formControls: any = {};
    for (let i = 0; i < 6; i++) {
      formControls['digit' + i] = ['', [
        Validators.required, 
        Validators.pattern('[0-9]')
      ]];
    }
    
    this.otpForm = this.fb.group(formControls);
  }
  
  ngAfterViewInit() {
    // Focus the first input on component init
    setTimeout(() => {
      this.otpInputs.first?.nativeElement.focus();
    }, 0);
  }
  
  onKeyDown(event: KeyboardEvent, index: number) {
    // Get the current input element
    const currentInput = this.otpInputs.toArray()[index].nativeElement;
    
    if (event.key === 'Backspace') {
      if (currentInput.value === '') {
        // If current input is empty, move to previous input
        if (index > 0) {
          event.preventDefault();
          this.otpInputs.toArray()[index - 1].nativeElement.focus();
        }
      }
    } else if (event.key === 'ArrowLeft') {
      // Move to previous input
      if (index > 0) {
        event.preventDefault();
        this.otpInputs.toArray()[index - 1].nativeElement.focus();
      }
    } else if (event.key === 'ArrowRight') {
      // Move to next input
      if (index < 5) {
        event.preventDefault();
        this.otpInputs.toArray()[index + 1].nativeElement.focus();
      }
    }
  }
  
  onInput(index: number) {
    const currentInput = this.otpInputs.toArray()[index].nativeElement;
    
    // If we have a value and we're not at the last input, move to next
    if (currentInput.value !== '' && index < 5) {
      this.otpInputs.toArray()[index + 1].nativeElement.focus();
    }
  }
  
  onFocus(index: number) {
    const currentInput = this.otpInputs.toArray()[index].nativeElement;
    
    // Add 'empty' class if the input is empty to style it differently
    if (currentInput.value === '') {
      currentInput.classList.add('empty');
    } else {
      currentInput.classList.remove('empty');
    }
  }
  
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    
    if (!event.clipboardData) {
      return;
    }
    
    const pastedText = event.clipboardData.getData('text');
    
    // Only process if pasted content looks like an OTP (numbers only)
    if (/^\d+$/.test(pastedText)) {
      const digits = pastedText.substring(0, 6).split('');
      
      digits.forEach((digit, index) => {
        if (index < 6) {
          this.otpForm.get('digit' + index)?.setValue(digit);
          this.otpInputs.toArray()[index].nativeElement.value = digit;
          this.otpInputs.toArray()[index].nativeElement.classList.remove('empty');
        }
      });
      
      // Focus the next empty input or the last one
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      const nextIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      this.otpInputs.toArray()[nextIndex].nativeElement.focus();
      
      // If all digits are filled, submit the form
      if (this.otpForm.valid) {
        this.onSubmit();
      }
    }
  }
  
  resendOtp() {
    // For demo purposes, we'll just show a message
    this.error = '';
    setTimeout(() => {
      alert('Un nouveau code OTP a été envoyé.');
    }, 500);
  }
  
  onSubmit() {
    if (this.otpForm.invalid) {
      return;
    }
    
    this.isLoading = true;
    this.error = '';
    
    // Construct the OTP from individual digits
    let otp = '';
    for (let i = 0; i < 6; i++) {
      otp += this.otpForm.get('digit' + i)?.value;
    }
    
    this.authService.verifyOtp(otp).subscribe({
      next: () => {
        // Navigation to dashboard happens in the service
      },
      error: (err) => {
        this.error = 'Code OTP invalide. Veuillez réessayer.';
        this.isLoading = false;
      }
    });
  }
}
