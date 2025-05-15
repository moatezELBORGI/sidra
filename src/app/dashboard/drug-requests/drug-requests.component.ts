import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormDataService } from '../../core/services/FormDataService.service';
import { FormData } from '../../core/models/FormData';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-drug-requests',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './drug-requests.component.html',
  styleUrl: './drug-requests.component.css'
})
export class DrugRequestsComponent implements OnInit {
  forms: FormData[] = [];
  filteredForms: FormData[] = [];
  isLoading = true;

  // Sorting
  sortField: keyof FormData = 'dateAjout';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Filtering
  activeFilter: string = 'all';
  searchTerm: string = '';
  dateFilter: string = '';
  governoratFilter: string = '';
  structureFilter: string = '';

  // Filter options
  gouvernorats: string[] = ['Tunis', 'Ariana', 'Ben Arous'];
  structures: string[] = ['Hôpital Charles Nicolle', 'Hôpital Abderrahmen Mami', 'Hôpital Régional'];

  constructor(
      private formDataService: FormDataService,
      private router: Router
  ) {}

  ngOnInit(): void {
    this.loadForms();
  }

  loadForms(): void {
    this.isLoading = true;

    this.formDataService.getForms().subscribe({
      next: (forms) => {
        this.forms = forms;
        this.applyFilters();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading forms', error);
        this.isLoading = false;
      }
    });
  }

  editForm(id: string): void {
    this.router.navigate(['/dashboard/drug-requests-form'], {
      queryParams: { id: id, mode: 'edit' }
    });
  }

  sortTable(field: keyof FormData): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
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

  onDateFilterChange(date: string): void {
    this.dateFilter = date;
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.forms];

    // Apply status filter
    if (this.activeFilter !== 'all') {
      filtered = filtered.filter(f => f.status === this.activeFilter);
    }

    // Apply date filter
    if (this.dateFilter) {
      const filterDate = new Date(this.dateFilter).setHours(0, 0, 0, 0);
      filtered = filtered.filter(f => {
        const formDate = new Date(f.dateAjout).setHours(0, 0, 0, 0);
        return formDate === filterDate;
      });
    }

    // Apply governorat filter
    if (this.governoratFilter) {
      filtered = filtered.filter(f => f.governorat === this.governoratFilter);
    }

    // Apply structure filter
    if (this.structureFilter) {
      filtered = filtered.filter(f => f.structure === this.structureFilter);
    }

    // Apply search filter
    if (this.searchTerm) {
      filtered = filtered.filter(f =>
          f.code.toLowerCase().includes(this.searchTerm) ||
          f.governorat.toLowerCase().includes(this.searchTerm) ||
          f.structure.toLowerCase().includes(this.searchTerm)
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

    this.filteredForms = filtered;
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
