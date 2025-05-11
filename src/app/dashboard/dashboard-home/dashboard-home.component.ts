import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DrugRequestService } from '../../core/services/drug-request.service';
import { AuthService } from '../../core/services/auth.service';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-dashboard-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard-home.component.html',
  styleUrl: './dashboard-home.component.css',
})
export class DashboardHomeComponent {
  totalRequests = 0;
  pendingRequests = 0;
  approvedRequests = 0;
  rejectedRequests = 0;
  
  constructor(
    private drugRequestService: DrugRequestService,
    private authService: AuthService
  ) {
    this.loadStats();
  }
  
  loadStats() {
    this.drugRequestService.getRequests().subscribe(requests => {
      this.totalRequests = requests.length;
      this.pendingRequests = requests.filter(r => r.status === 'pending').length;
      this.approvedRequests = requests.filter(r => r.status === 'approved').length;
      this.rejectedRequests = requests.filter(r => r.status === 'rejected').length;
    });
  }
}
