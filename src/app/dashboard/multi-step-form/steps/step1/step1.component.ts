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

  // ... (keep all existing methods)

  ShowRecidivismMotiveOrSeverity(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;

    if (selectElement) {
      const selectedValue = selectElement.value;
      this.showRecidivismMotiveInput = false;
      this.showOtherConsultancyMotifInput = false;
      this.showReasonForWithdrawalInput = false;
      this.ShowOtherReasonForWithdrawalInputInput = false;
      this.ShowOtherReasonForRecidivismUuidReasonForRecidivismInput = false;

      if (selectedValue !== '5') {
        this.clearDependentFields(this.structureForm, [
          'reasonForRecidivismUuidReasonForRecidivism',
          'otherReasonForRecidivism'
        ]);
      }
      if (selectedValue !== '3') {
        this.clearDependentFields(this.structureForm, [
          'reasonForWithdrawalUuidReasonForWithdrawal',
          'otherReasonForWithdrawal'
        ]);
      }
      if (selectedValue !== '-1') {
        this.clearDependentFields(this.structureForm, ['otherOldConsultancyMotif']);
      }

      if (selectedValue === '5') {
        this.showRecidivismMotiveInput = true;
        this.getReasonForRecidivismDto();
        // Add required validator for recidivism reason
        this.structureForm.get('reasonForRecidivismUuidReasonForRecidivism')?.setValidators([Validators.required]);
        this.structureForm.get('reasonForRecidivismUuidReasonForRecidivism')?.updateValueAndValidity();
      } else if (selectedValue === '3') {
        this.showReasonForWithdrawalInput = true;
        this.getReasonForWithdrawalDto();
        // Add required validator for withdrawal reason
        this.structureForm.get('reasonForWithdrawalUuidReasonForWithdrawal')?.setValidators([Validators.required]);
        this.structureForm.get('reasonForWithdrawalUuidReasonForWithdrawal')?.updateValueAndValidity();
      } else if (selectedValue === '-1') {
        this.showOtherConsultancyMotifInput = true;
      }
    }
  }

  // ... (keep all other existing methods)
}