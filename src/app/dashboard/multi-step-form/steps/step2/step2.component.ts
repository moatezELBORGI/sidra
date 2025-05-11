import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {DrugRequestService} from "../../../../core/services/drug-request.service";
import {ConsumptionFrequencyDto} from "../../../../core/models/demanddrugs/ConsumptionFrequencyDto.model";

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step2.component.html',
  styleUrl: './step2.component.css'
})
export class Step2Component implements OnInit {
  @Input() parentForm!: FormGroup;
  isLoading = true;
  constructor(
      private drugRequestService: DrugRequestService,
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getConsumptionFrequencyDtoListWithType1();
     }

  get tobaccoForm(): FormGroup {
    return this.parentForm.get('tobaccoAlcohol') as FormGroup;
  }
  tobaccoConsumption = [
    {key: 1, label: 'Fumeur'},
    {key: 2, label: 'Non-fumeur'},
    {key: 3, label: 'Ex-fumeur'}
  ];
  smokingOptions = [
    'Fumeur actuel',
    'Ancien fumeur',
    'Non fumeur',
    'Vapoteur'
  ];
  
  alcoholOptions = [
    'Consommation quotidienne',
    'Consommation hebdomadaire',
    'Consommation occasionnelle',
    'Abstinent',
    'Ancien consommateur'
  ];
  
  bingeOptions = [
    'Jamais',
    'Moins d\'une fois par mois',
    'Mensuellement',
    'Hebdomadairement',
    'Quotidiennement ou presque'
  ];

  showCigarettesFields(): boolean {
    const smokingStatus = this.tobaccoForm.get('tobaccoConsumption')?.value;
    return smokingStatus === 1 || smokingStatus === 3;
  }

  showCigarettesFieldsIfSmoker(): boolean {
    const smokingStatus = this.tobaccoForm.get('tobaccoConsumption')?.value;
    return smokingStatus === 1
  }
  showConsumptionFrequencyTypeSmoker(): boolean {
    return this.tobaccoForm.get('tobaccoConsumedWithinThirtyDays')?.value;
  }
  showConsumptionFrequencyTypeAlcohol(): boolean {
    return this.tobaccoForm.get('alcoholConsumedWithinThirtyDays')?.value;
  }
  showCigarettesFieldsIfExSmoker(): boolean {
    const smokingStatus = this.tobaccoForm.get('tobaccoConsumption')?.value;
    return smokingStatus === 3
  }

  showAlcoholFields(): boolean {
    return this.tobaccoForm.get('alcoholConsumption')?.value;
  }
  consumptionFrequencyType1!:ConsumptionFrequencyDto[] | null;
  getConsumptionFrequencyDtoListWithType1(): void {
    this.isLoading = true;
    this.drugRequestService.getConsumptionFrequencyDtoListWithType1().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.consumptionFrequencyType1 = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
