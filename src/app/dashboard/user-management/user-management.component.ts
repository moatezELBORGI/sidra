import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  userForm: FormGroup;
  isLoading = false;
  showForm = false;
  structures: string[] = [
    'Ministère de la Santé',
    'Hôpital Charles Nicolle',
    'Hôpital Habib Thameur',
    'Hôpital La Rabta'
  ];

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      structure: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', Validators.required],
      permissions: this.fb.group({
        manageRequests: [false],
        manageOffers: [false],
        manageUsers: [false],
        manageSettings: [false],
        accessDashboard: [false]
      })
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.isLoading = true;
    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        this.isLoading = false;
      }
    });
  }

  generatePassword() {
    const password = this.userService.generateStrongPassword();
    this.userForm.patchValue({ password });
  }

  toggleBlockUser(user: User) {
    this.userService.toggleBlockUser(user.id!, !user.isBlocked).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (error) => {
        console.error('Error toggling user block status:', error);
      }
    });
  }

  onSubmit() {
    if (this.userForm.invalid) return;

    const userData = {
      ...this.userForm.value,
      isBlocked: false,
      status: 'offline',
      lastLogin: null
    };

    this.userService.createUser(userData).subscribe({
      next: () => {
        this.loadUsers();
        this.userForm.reset();
        this.showForm = false;
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });
  }

  formatLastLogin(date: string | null): string {
    if (!date) return 'Jamais';
    return new Date(date).toLocaleString();
  }
}