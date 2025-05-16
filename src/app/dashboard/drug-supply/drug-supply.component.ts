import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface DrugSupplyEntry {
  id: number;
  date: Date;
  cannabis: number;
  tableauA: number;
  ecstasyPills: number;
  ecstasyPowder: number;
  subutex: number;
  cocaine: number;
  heroin: number;
}

@Component({
  selector: 'app-drug-supply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './drug-supply.component.html',
  styleUrls: ['./drug-supply.component.css']
})
export class DrugSupplyComponent {
  seizureForm: FormGroup;
  showForm = false;
  editMode = false;
  currentId: number | null = null;
  drugSupplyData: DrugSupplyEntry[] = [];

  constructor(private fb: FormBuilder) {
    this.seizureForm = this.initializeForm();
    // Add some mock data
    this.drugSupplyData = [
      {
        id: 1,
        date: new Date(),
        cannabis: 10.5,
        tableauA: 100,
        ecstasyPills: 50,
        ecstasyPowder: 25,
        subutex: 30,
        cocaine: 15,
        heroin: 5
      }
    ];
  }

  private initializeForm(): FormGroup {
    return this.fb.group({
      cannabis: ['', [Validators.required, Validators.min(0)]],
      tableauA: ['', [Validators.required, Validators.min(0)]],
      ecstasyPills: ['', [Validators.required, Validators.min(0)]],
      ecstasyPowder: ['', [Validators.required, Validators.min(0)]],
      subutex: ['', [Validators.required, Validators.min(0)]],
      cocaine: ['', [Validators.required, Validators.min(0)]],
      heroin: ['', [Validators.required, Validators.min(0)]]
    });
  }

  editEntry(entry: DrugSupplyEntry) {
    this.editMode = true;
    this.currentId = entry.id;
    this.seizureForm.patchValue({
      cannabis: entry.cannabis,
      tableauA: entry.tableauA,
      ecstasyPills: entry.ecstasyPills,
      ecstasyPowder: entry.ecstasyPowder,
      subutex: entry.subutex,
      cocaine: entry.cocaine,
      heroin: entry.heroin
    });
    this.showForm = true;
  }

  deleteEntry(id: number) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette entrée ?')) {
      this.drugSupplyData = this.drugSupplyData.filter(entry => entry.id !== id);
    }
  }

  onSubmit() {
    if (this.seizureForm.invalid) return;

    const formData = this.seizureForm.value;
    
    if (this.editMode && this.currentId) {
      // Update existing entry
      this.drugSupplyData = this.drugSupplyData.map(entry => 
        entry.id === this.currentId 
          ? { ...entry, ...formData }
          : entry
      );
    } else {
      // Add new entry
      const newEntry: DrugSupplyEntry = {
        id: Date.now(),
        date: new Date(),
        ...formData
      };
      this.drugSupplyData.unshift(newEntry);
    }

    this.resetForm();
  }

  private resetForm() {
    this.seizureForm.reset();
    this.showForm = false;
    this.editMode = false;
    this.currentId = null;
  }
}