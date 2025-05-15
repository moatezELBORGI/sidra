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

  constructor(
      private drugRequestService: DrugRequestService,
      private fb: FormBuilder
  ) {}

  ngOnInit(): void {
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

    // Load all data first
    this.loadAllData().then(() => {
      // Setup validation after data is loaded
      this.setupValidation();

      // Restore visibility of fields based on form values
      this.restoreFieldVisibility();

      // Make sure "other" input is shown if needed
      this.updateShowOtherOriginOfDemandInput();

      // Important: Restore radio button selections after everything is loaded
      setTimeout(() => {
        this.restoreOriginOfDemandSelections();
      });
    });
  }

  private setupValidation() {
    const structureForm = this.structureForm;

    // Sector validation
    structureForm.get('sector')?.valueChanges.subscribe(value => {
      const ongControl = structureForm.get('ongStructureId');
      if (value === 3) {
        ongControl?.setValidators([Validators.required]);
      } else {
        ongControl?.clearValidators();
        this.clearDependentFields(structureForm, ['ongStructureId']);
      }
      ongControl?.updateValueAndValidity();
    });

    // Residence validation
    structureForm.get('residence')?.valueChanges.subscribe(value => {
      const governorateControl = structureForm.get('governorateOfResidenceUuidGovernorate');
      const cityControl = structureForm.get('cityOfResidenceUuidCity');
      const countryControl = structureForm.get('countryOfResidenceUuidCountry');

      if (value === "1") {
        governorateControl?.setValidators([Validators.required]);
        countryControl?.clearValidators();
        this.clearDependentFields(structureForm, ['countryOfResidenceUuidCountry']);
      } else if (value === "2") {
        countryControl?.setValidators([Validators.required]);
        governorateControl?.clearValidators();
        cityControl?.clearValidators();
        this.clearDependentFields(structureForm, [
          'governorateOfResidenceUuidGovernorate',
          'cityOfResidenceUuidCity'
        ]);
      } else {
        governorateControl?.clearValidators();
        cityControl?.clearValidators();
        countryControl?.clearValidators();
        this.clearDependentFields(structureForm, [
          'governorateOfResidenceUuidGovernorate',
          'cityOfResidenceUuidCity',
          'countryOfResidenceUuidCountry'
        ]);
      }

      governorateControl?.updateValueAndValidity();
      cityControl?.updateValueAndValidity();
      countryControl?.updateValueAndValidity();
    });

    // Governorate validation
    structureForm.get('governorateOfResidenceUuidGovernorate')?.valueChanges.subscribe(value => {
      const cityControl = structureForm.get('cityOfResidenceUuidCity');
      if (value) {
        cityControl?.setValidators([Validators.required]);
      } else {
        cityControl?.clearValidators();
        this.clearDependentFields(structureForm, ['cityOfResidenceUuidCity']);
      }
      cityControl?.updateValueAndValidity();
    });

    // Old consultancy validation
    structureForm.get('oldConsultancy')?.valueChanges.subscribe(value => {
      const dateControl = structureForm.get('oldConsultancyDate');
      const motifControl = structureForm.get('oldConsultancyMotifUuidConsultancyMotif');

      if (value === "true") {
        dateControl?.setValidators([Validators.required]);
        motifControl?.setValidators([Validators.required]);
      } else {
        dateControl?.clearValidators();
        motifControl?.clearValidators();
        this.clearDependentFields(structureForm, [
          'oldConsultancyDate',
          'oldConsultancyMotifUuidConsultancyMotif',
          'otherOldConsultancyMotif',
          'reasonForRecidivismUuidReasonForRecidivism',
          'otherReasonForRecidivism',
          'reasonForWithdrawalUuidReasonForWithdrawal',
          'otherReasonForWithdrawal'
        ]);
      }

      dateControl?.updateValueAndValidity();
      motifControl?.updateValueAndValidity();
    });

    // Practice sport validation
    structureForm.get('practiceSport')?.valueChanges.subscribe(value => {
      const regularControl = structureForm.get('regularPracticeSportWay');
      const competitionControl = structureForm.get('competitionSportWay');

      if (value === "true") {
        regularControl?.setValidators([Validators.required]);
        competitionControl?.setValidators([Validators.required]);
      } else {
        regularControl?.clearValidators();
        competitionControl?.clearValidators();
        this.clearDependentFields(structureForm, [
          'regularPracticeSportWay',
          'competitionSportWay',
          'doping'
        ]);
      }

      regularControl?.updateValueAndValidity();
      competitionControl?.updateValueAndValidity();
    });

    // Competition sport validation
    structureForm.get('competitionSportWay')?.valueChanges.subscribe(value => {
      const dopingControl = structureForm.get('doping');
      if (value === "true") {
        dopingControl?.setValidators([Validators.required]);
      } else {
        dopingControl?.clearValidators();
        this.clearDependentFields(structureForm, ['doping']);
      }
      dopingControl?.updateValueAndValidity();
    });

    // Consultancy frame validation
    structureForm.get('consultancyFrame')?.valueChanges.subscribe(value => {
      const otherControl = structureForm.get('otherConsultancyFrame');
      if (value === -1) {
        otherControl?.setValidators([Validators.required]);
      } else {
        otherControl?.clearValidators();
        this.clearDependentFields(structureForm, ['otherConsultancyFrame']);
      }
      otherControl?.updateValueAndValidity();
    });

    // Family situation validation
    structureForm.get('familySituationIdFamilySituation')?.valueChanges.subscribe(value => {
      const otherControl = structureForm.get('otherFamilySituation');
      if (value === -1) {
        otherControl?.setValidators([Validators.required]);
      } else {
        otherControl?.clearValidators();
        this.clearDependentFields(structureForm, ['otherFamilySituation']);
      }
      otherControl?.updateValueAndValidity();
    });

    // Accommodation type validation
    structureForm.get('accommodationTypeIdAccommodationType')?.valueChanges.subscribe(value => {
      const otherControl = structureForm.get('otherAccommodationType');
      if (value === -1) {
        otherControl?.setValidators([Validators.required]);
      } else {
        otherControl?.clearValidators();
        this.clearDependentFields(structureForm, ['otherAccommodationType']);
      }
      otherControl?.updateValueAndValidity();
    });

    // Origin of demand validation
    structureForm.get('originOfDemandSetUuidOriginOfDemands')?.valueChanges.subscribe(values => {
      if (Array.isArray(values)) {
        const hasOther = values.some(v => v.id === -1 && v.selected);
        const otherControl = structureForm.get('otherOriginOfDemand');
        
        if (hasOther) {
          otherControl?.setValidators([Validators.required]);
        } else {
          otherControl?.clearValidators();
          otherControl?.setValue('');
        }
        otherControl?.updateValueAndValidity();
      }
    });
  }

  // Rest of the component code remains unchanged...
}