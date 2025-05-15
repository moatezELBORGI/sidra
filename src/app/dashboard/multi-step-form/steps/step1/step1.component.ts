import {Component, Input, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {DrugRequestService} from "../../../../core/services/drug-request.service";
import {ConsultancyFrameDto} from "../../../../core/models/demanddrugs/ConsultancyFrameDto.model";
import {OriginOfDemandDto} from "../../../../core/models/demanddrugs/OriginOfDemandDto.model";
import {ReasonForRecidivismDto} from "../../../../core/models/demanddrugs/ReasonForRecidivismDto.model";
import {ConsultancyMotifDto} from "../../../../core/models/demanddrugs/ConsultancyMotifDto.model";
import {ReasonForWithdrawalDto} from "../../../../core/models/demanddrugs/ReasonForWithdrawalDto.model";
import {FamilySituationDto} from "../../../../core/models/demanddrugs/FamilySituationDto.model";
import {AccommodationTypeDto} from "../../../../core/models/demanddrugs/AccommodationTypeDto.model";
import {ProfessionDto} from "../../../../core/models/demanddrugs/ProfessionDto.model";
import {SchoolLevelDto} from "../../../../core/models/demanddrugs/SchoolLevelDto.model";

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
  sectorOptions = [
    { key: 1, label: 'Public' },
    { key: 2, label: 'Private' }
  ];
  
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
  showOtherOriginOfDemandInput = false;
  showOtherOldConsultancyDateInput = false;
  showRecidivismMotiveInput = false;
  showOtherConsultancyMotifInput = false;
  showReasonForWithdrawalInput = false;
  ShowOtherReasonForWithdrawalInputInput = false;
  ShowOtherReasonForRecidivismUuidReasonForRecidivismInput = false;
  showOtherFamilySituationInput = false;
  showOtherAccommodationTypeInput = false;
  showPracticeSportInput = false;
  showCompetitionSportWayInput = false;
  showOtherConsultancyFrameInput = false; // Added missing property

  constructor(
    private drugRequestService: DrugRequestService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.structureForm = this.parentForm.get('structureInfo') as FormGroup;
    
    // Set required validators for default visible fields
    const requiredFields = [
      'sector',
      'structureId',
      'structureDemandedStructureId',
      'patientId',
      'consultationDate',
      'gender',
      'birthDate',
      'nationalityUuidCountry',
      'residence',
      'consultancyFrame',
      'oldConsultancy',
      'familySituationIdFamilySituation',
      'accommodationTypeIdAccommodationType',
      'stableAccommodation',
      'professionUuidProfession',
      'schoolLevelUuidSchoolLevelSchoolLevel',
      'practiceSport'
    ];

    requiredFields.forEach(field => {
      const control = this.structureForm.get(field);
      if (control) {
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      }
    });

    this.loadAllData();
  }

  async loadAllData(): Promise<void> {
    try {
      // Load all necessary data from the service
      const [
        ongStructures,
        ministers,
        structures,
        nationalities,
        gouvernorats,
        delegations,
        consultancyFrames,
        originOfDemands,
        consultancyMotifs,
        recidivismReasons,
        withdrawalReasons,
        familySituations,
        accommodationTypes,
        professions,
        schoolLevels
      ] = await Promise.all([
        this.drugRequestService.getOngStructures(),
        this.drugRequestService.getMinisters(),
        this.drugRequestService.getStructures(),
        this.drugRequestService.getNationalities(),
        this.drugRequestService.getGouvernorats(),
        this.drugRequestService.getDelegations(),
        this.drugRequestService.getConsultancyFrames(),
        this.drugRequestService.getOriginOfDemands(),
        this.drugRequestService.getConsultancyMotifs(),
        this.drugRequestService.getRecidivismReasons(),
        this.drugRequestService.getWithdrawalReasons(),
        this.drugRequestService.getFamilySituations(),
        this.drugRequestService.getAccommodationTypes(),
        this.drugRequestService.getProfessions(),
        this.drugRequestService.getSchoolLevels()
      ]);

      // Assign the loaded data to the component properties
      this.ongStructureOptions = ongStructures;
      this.ministerOptions = ministers;
      this.structureDemandedOptions = structures;
      this.nationalityOptions = nationalities;
      this.gouvernoratOptions = gouvernorats;
      this.delegationOptions = delegations;
      this.consultancyFrame = consultancyFrames;
      this.originOfDemande = originOfDemands;
      this.consultancyMotif = consultancyMotifs;
      this.reasonForRecidivism = recidivismReasons;
      this.reasonForWithdrawal = withdrawalReasons;
      this.familySituation = familySituations;
      this.accommodationTypeDto = accommodationTypes;
      this.professionDto = professions;
      this.schoolLevel = schoolLevels;
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  // Visibility control methods
  showOngList(): boolean {
    return this.structureForm.get('sector')?.value === 2;
  }

  showGovList(): boolean {
    return this.structureForm.get('residence')?.value === '1';
  }

  showDelegation(): boolean {
    return !!this.structureForm.get('governorateOfResidenceUuidGovernorate')?.value;
  }

  showResidenceCountryList(): boolean {
    return this.structureForm.get('residence')?.value === '2';
  }

  // Event handlers
  handleConsultancyFrameChange(event: Event, value: any): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.structureForm.patchValue({ consultancyFrame: value });
      this.showOtherConsultancyFrameInput = value === -1; // Updated to set the correct flag
      this.showOtherConsultancyMotifInput = value === -1;
    }
  }

  onOriginOfDemandChange(event: Event, option: OriginOfDemandDto): void {
    const checkbox = event.target as HTMLInputElement;
    const originOfDemands = this.structureForm.get('originOfDemandSetUuidOriginOfDemands') as FormArray;
    
    if (checkbox.checked) {
      originOfDemands.push(this.fb.control(option.uuidOriginOfDemand));
      if (option.uuidOriginOfDemand === -1) {
        this.showOtherOriginOfDemandInput = true;
      }
    } else {
      const index = originOfDemands.controls.findIndex(control => 
        control.value === option.uuidOriginOfDemand
      );
      if (index >= 0) {
        originOfDemands.removeAt(index);
      }
      if (option.uuidOriginOfDemand === -1) {
        this.showOtherOriginOfDemandInput = false;
      }
    }
  }

  hasAnyOriginOfDemandSelected(): boolean {
    const originOfDemands = this.structureForm.get('originOfDemandSetUuidOriginOfDemands') as FormArray;
    return originOfDemands.length > 0;
  }

  showOtherOldConsultancyDate(show: boolean): void {
    this.showOtherOldConsultancyDateInput = show;
    if (!show) {
      this.structureForm.patchValue({
        oldConsultancyDate: null,
        oldConsultancyMotifUuidConsultancyMotif: null,
        otherOldConsultancyMotif: null
      });
    }
  }

  handleFamilySituationChange(event: Event, value: any): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.structureForm.patchValue({ familySituationIdFamilySituation: value });
      this.showOtherFamilySituationInput = value === -1;
    }
  }

  handleAccommodationTypeChange(event: Event, value: any): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.structureForm.patchValue({ accommodationTypeIdAccommodationType: value });
      this.showOtherAccommodationTypeInput = value === -1;
    }
  }

  handleProfessionChange(event: Event, value: any): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.structureForm.patchValue({ professionUuidProfession: value });
    }
  }

  handleSchoolLevelChange(event: Event, value: any): void {
    const checkbox = event.target as HTMLInputElement;
    if (checkbox.checked) {
      this.structureForm.patchValue({ schoolLevelUuidSchoolLevelSchoolLevel: value });
    }
  }

  showPracticeSport(show: boolean): void {
    this.showPracticeSportInput = show;
    if (!show) {
      this.structureForm.patchValue({
        regularPracticeSportWay: null,
        competitionSportWay: null,
        doping: null
      });
    }
  }

  competitionSportWay(isCompetition: boolean): void {
    this.showCompetitionSportWayInput = isCompetition;
    if (!isCompetition) {
      this.structureForm.patchValue({ doping: null });
    }
  }

  ShowRecidivismMotiveOrSeverity(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedValue = selectElement.value;

    this.showRecidivismMotiveInput = false;
    this.showOtherConsultancyMotifInput = false;
    this.showReasonForWithdrawalInput = false;
    this.ShowOtherReasonForWithdrawalInputInput = false;
    this.ShowOtherReasonForRecidivismUuidReasonForRecidivismInput = false;

    if (selectedValue === '5') {
      this.showRecidivismMotiveInput = true;
    } else if (selectedValue === '3') {
      this.showReasonForWithdrawalInput = true;
    } else if (selectedValue === '-1') {
      this.showOtherConsultancyMotifInput = true;
    }
  }

  private clearDependentFields(form: FormGroup, fields: string[]): void {
    fields.forEach(field => {
      form.get(field)?.patchValue(null);
    });
  }
}