import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrugRequestService } from "../../../../core/services/drug-request.service";
import { ConsultancyFrameDto } from "../../../../core/models/demanddrugs/ConsultancyFrameDto.model";
import { OriginOfDemandDto } from "../../../../core/models/demanddrugs/OriginOfDemandDto.model";
import { ReasonForRecidivismDto } from "../../../../core/models/demanddrugs/ReasonForRecidivismDto.model";
import { ConsultancyMotifDto } from "../../../../core/models/demanddrugs/ConsultancyMotifDto.model";
import { ReasonForWithdrawalDto } from "../../../../core/models/demanddrugs/ReasonForWithdrawalDto.model";
import { FamilySituationDto } from "../../../../core/models/demanddrugs/FamilySituationDto.model";
import { AccommodationTypeDto } from "../../../../core/models/demanddrugs/AccommodationTypeDto.model";
import { ProfessionDto } from "../../../../core/models/demanddrugs/ProfessionDto.model";
import { SchoolLevelDto } from "../../../../core/models/demanddrugs/SchoolLevelDto.model";

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './step1.component.html',
  styleUrl: './step1.component.css'
})
export class Step1Component implements OnInit {
  @Input() parentForm!: FormGroup;
  
  structureForm!: FormGroup;
  
  // Options arrays
  sectorOptions: any[] = [];
  ongStructureOptions: any[] = [];
  ministerOptions: any[] = [];
  structureDemandedOptions: any[] = [];
  nationalityOptions: any[] = [];
  gouvernoratOptions: any[] = [];
  delegationOptions: any[] = [];
  consultancyFrame: ConsultancyFrameDto[] = [];
  originOfDemande: OriginOfDemandDto[] = [];
  consultancyMotif: ConsultancyMotifDto[] = [];
  reasonForRecidivism: ReasonForRecidivismDto[] = [];
  reasonForWithdrawal: ReasonForWithdrawalDto[] = [];
  familySituation: FamilySituationDto[] = [];
  accommodationTypeDto: AccommodationTypeDto[] = [];
  professionDto: ProfessionDto[] = [];
  schoolLevel: SchoolLevelDto[] = [];

  // Show/hide flags
  showOngList(): boolean {
    return this.structureForm.get('sector')?.value === 'ONG';
  }
  
  showPracticeSportInput = false;
  showCompetitionSportWayInput = false;
  showOtherConsultancyFrameInput = false;
  showOtherOriginOfDemandInput = false;
  showOtherOldConsultancyDateInput = false;
  showRecidivismMotiveInput = false;
  showOtherConsultancyMotifInput = false;
  showReasonForWithdrawalInput = false;
  ShowOtherReasonForWithdrawalInputInput = false;
  ShowOtherReasonForRecidivismUuidReasonForRecidivismInput = false;
  showOtherFamilySituationInput = false;
  showOtherAccommodationTypeInput = false;

  showGovList(): boolean {
    return this.structureForm.get('residence')?.value === '1';
  }

  showDelegation(): boolean {
    return !!this.structureForm.get('governorateOfResidenceUuidGovernorate')?.value;
  }

  showResidenceCountryList(): boolean {
    return this.structureForm.get('residence')?.value === '2';
  }

  constructor(
    private drugRequestService: DrugRequestService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadData();
  }

  private initializeForm(): void {
    this.structureForm = this.parentForm.get('structureInfo') as FormGroup;
  }

  private loadData(): void {
    // Load all necessary data from service
    // These would typically be API calls through drugRequestService
    this.loadSectorOptions();
    this.loadOtherOptions();
  }

  private loadSectorOptions(): void {
    this.sectorOptions = [
      { key: 'PUBLIC', label: 'Public' },
      { key: 'ONG', label: 'ONG' }
    ];
  }

  private loadOtherOptions(): void {
    // Initialize other options arrays
    // This would typically involve API calls
  }

  // Event handlers
  handleConsultancyFrameChange(event: Event, value: any): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.structureForm.patchValue({ consultancyFrame: checked ? value : null });
    this.showOtherConsultancyFrameInput = value === -1 && checked;
  }

  onOriginOfDemandChange(event: Event, option: any): void {
    const checked = (event.target as HTMLInputElement).checked;
    const currentValue = this.structureForm.get('originOfDemandSetUuidOriginOfDemands')?.value || [];
    
    if (checked) {
      currentValue.push(option.uuidOriginOfDemand);
    } else {
      const index = currentValue.indexOf(option.uuidOriginOfDemand);
      if (index > -1) {
        currentValue.splice(index, 1);
      }
    }
    
    this.structureForm.patchValue({ originOfDemandSetUuidOriginOfDemands: currentValue });
    this.showOtherOriginOfDemandInput = option.uuidOriginOfDemand === -1 && checked;
  }

  showOtherOldConsultancyDate(show: boolean): void {
    this.showOtherOldConsultancyDateInput = show;
  }

  handleFamilySituationChange(event: Event, value: any): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.structureForm.patchValue({ familySituationIdFamilySituation: checked ? value : null });
    this.showOtherFamilySituationInput = value === -1 && checked;
  }

  handleAccommodationTypeChange(event: Event, value: any): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.structureForm.patchValue({ accommodationTypeIdAccommodationType: checked ? value : null });
    this.showOtherAccommodationTypeInput = value === -1 && checked;
  }

  handleProfessionChange(event: Event, value: any): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.structureForm.patchValue({ professionUuidProfession: checked ? value : null });
  }

  handleSchoolLevelChange(event: Event, value: any): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.structureForm.patchValue({ schoolLevelUuidSchoolLevelSchoolLevel: checked ? value : null });
  }

  showPracticeSport(show: boolean): void {
    this.showPracticeSportInput = show;
  }

  competitionSportWay(isCompetition: boolean): void {
    this.showCompetitionSportWayInput = isCompetition;
  }

  hasAnyOriginOfDemandSelected(): boolean {
    const selections = this.structureForm.get('originOfDemandSetUuidOriginOfDemands')?.value;
    return Array.isArray(selections) && selections.length > 0;
  }

  private clearDependentFields(form: FormGroup, fields: string[]): void {
    fields.forEach(field => {
      const control = form.get(field);
      if (control) {
        control.reset();
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });
  }

  private setupValidation(): void {
    // Add validation logic here
  }

  private restoreFieldVisibility(): void {
    // Restore visibility logic here
  }

  private restoreOriginOfDemandSelections(): void {
    // Restore selections logic here
  }

  private updateShowOtherOriginOfDemandInput(): void {
    // Update visibility logic here
  }

  private async loadAllData(): Promise<void> {
    // Load all data logic here
  }

  private getReasonForRecidivismDto(): void {
    // Load recidivism data logic here
  }

  private getReasonForWithdrawalDto(): void {
    // Load withdrawal data logic here
  }
}