import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  sidebarCollapsed = false;
  drugMenuExpanded = false;
  userEmail = '';
  
  constructor(private authService: AuthService) {
    this.userEmail = this.authService.currentUser?.email || '';
  }
  
  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
  
  toggleDrugMenu() {
    this.drugMenuExpanded = !this.drugMenuExpanded;
  }
  
  logout() {
    this.authService.logout();
  }
}
