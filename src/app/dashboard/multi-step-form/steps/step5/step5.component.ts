import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step5',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step5.component.html',
  styleUrl: './step5.component.css'
})
export class Step5Component {
  @Input() parentForm!: FormGroup;

  get comorbiditiesForm(): FormGroup {
    return this.parentForm.get('comorbidities') as FormGroup;
  }
  
  psychiatricDisorders = [
    'Trouble dépressif',
    'Trouble anxieux',
    'Trouble bipolaire',
    'Schizophrénie',
    'Trouble de la personnalité',
    'Trouble du comportement alimentaire',
    'Autre'
  ];
}