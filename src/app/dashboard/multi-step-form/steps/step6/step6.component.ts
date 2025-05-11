import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-step6',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step6.component.html',
  styleUrl: './step6.component.css'
})
export class Step6Component {
  @Input() parentForm!: FormGroup;

  get deathsForm(): FormGroup {
    return this.parentForm.get('spaDeaths') as FormGroup;
  }
  
  relationshipOptions = [
    'Famille proche (parent, frère/sœur, enfant)',
    'Famille élargie (cousin, oncle/tante)',
    'Ami(e) proche',
    'Connaissance',
    'Partenaire/conjoint'
  ];
  
  substanceOptions = [
    'Héroïne',
    'Cocaïne/crack',
    'Opioïdes de prescription',
    'Benzodiazépines',
    'Alcool',
    'Amphétamines',
    'Mélange de substances',
    'Inconnue',
    'Autre'
  ];
}