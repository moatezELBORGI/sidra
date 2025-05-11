import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private router: Router) {
    // Check if user is already authenticated
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<User> {
    // For demo purposes, hardcode the valid credentials
    if (email === 'moatezelborgi@gmail.com' && password === 'test') {
      const user: User = { email };
      return of(user).pipe(
        delay(800), // Simulating network delay
        tap(user => {
          this.currentUserSubject.next(user);
          this.isAuthenticatedSubject.next(true);
          localStorage.setItem('currentUser', JSON.stringify(user));
        })
      );
    }
    
    return throwError(() => new Error('Invalid credentials'));
  }

  verifyOtp(otp: string): Observable<boolean> {
    // For demo purposes, hardcode the valid OTP
    if (otp === '000000') {
      return of(true).pipe(
        delay(800), // Simulating network delay
        tap(() => {
          // Update the user with a token after OTP verification
          const currentUser = this.currentUserSubject.value;
          if (currentUser) {
            const updatedUser = { 
              ...currentUser, 
              token: 'dummy-jwt-token' 
            };
            this.currentUserSubject.next(updatedUser);
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
          
          this.router.navigate(['/dashboard']);
        })
      );
    }
    
    return throwError(() => new Error('Invalid OTP'));
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}