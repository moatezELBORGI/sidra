import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { DrugRequestService } from '../../core/services/drug-request.service';
import { DrugRequest } from '../../core/models/demanddrugs/drug-request.model';

@Component({
  selector: 'app-drug-requests',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './drug-requests.component.html',
  styleUrl: './drug-requests.component.css'
})
export class DrugRequestsComponent implements OnInit {
  requests: DrugRequest[] = [];
  filteredRequests: DrugRequest[] = [];
  isLoading = true;
  
  // Sorting
  sortField: keyof DrugRequest = 'id';
  sortDirection: 'asc' | 'desc' = 'asc';
  
  // Filtering
  activeFilter: string = 'all';
  searchTerm: string = '';
  
  constructor(private drugRequestService: DrugRequestService) {}
  
  ngOnInit(): void {
    this.loadRequests();
  }
  
  loadRequests(): void {
    this.isLoading = true;
    
    this.drugRequestService.getRequests().subscribe({
      next: (requests) => {
        this.requests = requests;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading requests', error);
        this.isLoading = false;
      }
    });
  }
  
  sortTable(field: keyof DrugRequest): void {
    if (this.sortField === field) {
      // Toggle direction if clicking on the same field
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set new field and default to ascending
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    
    this.applyFilters();
  }
  
  filterByStatus(status: string): void {
    this.activeFilter = status;
    this.applyFilters();
  }
  
  onSearch(event: Event): void {
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.applyFilters();
  }
  
  applyFilters(): void {
    let filtered = [...this.requests];
    
    // Apply status filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(r => r.status === this.activeFilter);
    }
    
    // Apply search filter if there's a search term
    if (this.searchTerm) {
      filtered = filtered.filter(r => 
        r.nationalId.toLowerCase().includes(this.searchTerm) ||
        r.sector.toLowerCase().includes(this.searchTerm) ||
        r.ministry.toLowerCase().includes(this.searchTerm) ||
        r.structure.toLowerCase().includes(this.searchTerm) ||
        r.patientCode.toLowerCase().includes(this.searchTerm)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const valueA = a[this.sortField];
      const valueB = b[this.sortField];
      
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      } else {
        return this.sortDirection === 'asc' 
          ? (valueA < valueB ? -1 : 1) 
          : (valueA > valueB ? -1 : 1);
      }
    });
    
    this.filteredRequests = filtered;
  }
  
  getStatusLabel(status: string): string {
    switch (status) {
      case 'pending': return 'En attente';
      case 'approved': return 'Approuvée';
      case 'rejected': return 'Rejetée';
      default: return status;
    }
  }
}
