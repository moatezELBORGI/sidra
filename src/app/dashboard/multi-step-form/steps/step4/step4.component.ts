import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step4',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step4.component.html',
  styleUrl: './step4.component.css'
})
export class Step4Component {
  @Input() parentForm!: FormGroup;

  get behaviorsForm(): FormGroup {
    return this.parentForm.get('behaviorsAndTests') as FormGroup;
  }
  
  testResults = [
    'Positif',
    'Négatif',
    'Inconnu'
  ];
}