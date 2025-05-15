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

// Updated loadAllData to return a Promise to ensure proper sequencing
  async loadAllData() {
    this.isLoading = true;
    try {
      await Promise.all([
        this.getConsultancyFrameDtoList(),
        this.getOriginOfDemandDtoList(),
        this.getConsultancyMotifDto(),
        this.getReasonForRecidivismDto(),
        this.getReasonForWithdrawalDto(),
        this.getFamilySituationDtoList(),
        this.getAccommodationTypeDtoList(),
        this.getProfessionDtoList(),
        this.getSchoolLevelDtoList()
      ]);
      this.isLoading = false;
      return true;
    } catch (error) {
      console.error('Error loading data:', error);
      this.isLoading = false;
      return false;
    }
  }
  restoreOriginOfDemandSelections() {
    const values = this.structureForm.get('originOfDemandSetUuidOriginOfDemands')?.value;

    if (Array.isArray(values)) {
      values.forEach(value => {
        if (value.id !== undefined && value.selected !== undefined) {
          // Convert to string to ensure compatibility with radio button values
          const valueStr = String(value.selected);

          // Select the correct radio button based on id and selected value
          const input = document.querySelector(
              `input[name="originOfDemand-${value.id}"][value="${valueStr}"]`
          ) as HTMLInputElement;

          if (input) {
            input.checked = true;
          }

          // Handle "Other" option
          if (value.id === -1 && value.selected === true) {
            this.showOtherOriginOfDemandInput = true;
          }
        }
      });
    }
  }


  clearDependentFields(form: FormGroup, fieldsToReset: string[]) {
    fieldsToReset.forEach(field => {
      const control = form.get(field);
      if (control) {
        control.reset();
        control.updateValueAndValidity();
      }
    });

    const radioButtons = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    [...Array.from(radioButtons), ...Array.from(checkboxes)].forEach(input => {
      if (fieldsToReset.some(field => input.id.includes(field))) {
        input.checked = false;
      }
    });
  }

  ShowReasonForWithdrawalInput(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement) {
      const value = selectElement.value;
      this.ShowOtherReasonForWithdrawalInputInput = value === '-1';

      const otherReasonForWithdrawal = this.structureForm.get('otherReasonForWithdrawal');

      otherReasonForWithdrawal?.setValidators([Validators.required]);
      if (value !== '-1') {
        this.clearDependentFields(this.structureForm, ['otherReasonForWithdrawal']);
        otherReasonForWithdrawal?.clearValidators();
      }
    }
  }

  ShowOtherReasonForRecidivismUuidReasonForRecidivism(event: Event): void {
    const selectElement = event.target as HTMLSelectElement | null;
    if (selectElement) {
      const value = selectElement.value;
      this.ShowOtherReasonForRecidivismUuidReasonForRecidivismInput = value === '-1';
      const otherReasonForRecidivism = this.structureForm.get('otherReasonForRecidivism');

      otherReasonForRecidivism?.setValidators([Validators.required]);

      if (value !== '-1') {
        this.clearDependentFields(this.structureForm, ['otherReasonForRecidivism']);
        otherReasonForRecidivism?.clearValidators();
      }
    }
  }

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


        const reasonForRecidivismUuidReasonForRecidivism = this.structureForm.get('reasonForRecidivismUuidReasonForRecidivism');

        reasonForRecidivismUuidReasonForRecidivism?.setValidators([Validators.required]);
        this.getReasonForRecidivismDto();
      } else if (selectedValue === '3') {
        this.showReasonForWithdrawalInput = true;
        const reasonForWithdrawalUuidReasonForWithdrawal = this.structureForm.get('reasonForWithdrawalUuidReasonForWithdrawal');

        reasonForWithdrawalUuidReasonForWithdrawal?.setValidators([Validators.required]);


        this.getReasonForWithdrawalDto();
      } else if (selectedValue === '-1') {
        this.showOtherConsultancyMotifInput = true;
      }
    }
  }

  restoreFieldVisibility() {
    const structureForm = this.structureForm;

    if (structureForm.get('sector')?.value === 3) {
      this.showOngList();
    }

    const residence = structureForm.get('residence')?.value;
    if (residence === "1") {
      this.showGovList();
      if (structureForm.get('governorateOfResidenceUuidGovernorate')?.value) {
        this.showDelegation();
      }
    } else if (residence === "2") {
      this.showResidenceCountryList();
    }

    if (structureForm.get('consultancyFrame')?.value === -1) {
      this.showOtherConsultancyFrameInput = true;
    }

    if (structureForm.get('oldConsultancy')?.value === "true") {
      this.showOtherOldConsultancyDateInput = true;

      const consultancyMotif = structureForm.get('oldConsultancyMotifUuidConsultancyMotif')?.value;
      if (consultancyMotif === "-1") {
        this.showOtherConsultancyMotifInput = true;
      } else if (consultancyMotif === "5") {
        this.showRecidivismMotiveInput = true;
        if (structureForm.get('reasonForRecidivismUuidReasonForRecidivism')?.value === "-1") {
          this.ShowOtherReasonForRecidivismUuidReasonForRecidivismInput = true;
        }
      } else if (consultancyMotif === "3") {
        this.showReasonForWithdrawalInput = true;
        if (structureForm.get('reasonForWithdrawalUuidReasonForWithdrawal')?.value === "-1") {
          this.ShowOtherReasonForWithdrawalInputInput = true;
        }
      }
    }

    if (structureForm.get('familySituationIdFamilySituation')?.value === -1) {
      this.showOtherFamilySituationInput = true;
    }

    if (structureForm.get('accommodationTypeIdAccommodationType')?.value === -1) {
      this.showOtherAccommodationTypeInput = true;
    }

    if (structureForm.get('practiceSport')?.value === "true") {
      this.showPracticeSportInput = true;
      if (structureForm.get('competitionSportWay')?.value === "true") {
        this.showCompetitionSportWayInput = true;
      }
    }

    // Restore origin of demand selections
    const originOfDemandValues = structureForm.get('originOfDemandSetUuidOriginOfDemands')?.value;
    if (originOfDemandValues) {
      originOfDemandValues.forEach((value: any) => {
        if (value.selected !== undefined) {
          const input = document.querySelector(
              `input[name="originOfDemand-${value.id}"][value="${value.selected}"]`
          ) as HTMLInputElement;
          if (input) {
            input.checked = true;
          }
          if (value.id === -1 && value.selected) {
            this.showOtherOriginOfDemandInput = true;
          }
        }
      });
    }
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

  get structureForm(): FormGroup {
    return this.parentForm.get('structureInfo') as FormGroup;
  }

  get originOfDemandControls(): FormArray {
    return this.structureForm.get('originOfDemandSetUuidOriginOfDemands') as FormArray;
  }

  updateOriginOfDemandValidation(): void {
    const hasSelection = this.hasAnyOriginOfDemandSelected();
    for (let i = 0; i < this.originOfDemandControls.length; i++) {
      const control = this.originOfDemandControls.at(i).get('selected');
      if (control) {
        if (hasSelection) {
          control.clearValidators();
        } else {
          control.setValidators([Validators.required]);
        }
        control.updateValueAndValidity({ emitEvent: false });
      }
    }
  }

  initializeOriginOfDemandControls(): void {
    const array = this.structureForm.get('originOfDemandSetUuidOriginOfDemands') as FormArray;
    const previousValues = array.controls.map(control => control.value?.selected);
    while (array.length) {
      array.removeAt(0);
    }
    this.originOfDemande?.forEach((_, index) => {
      array.push(this.fb.group({
        selected: [previousValues[index] ?? null, Validators.required]
      }));
    });
    if (this.hasAnyOriginOfDemandSelected()) {
      this.updateOriginOfDemandValidation();
    }
  }

  showOngList(): boolean {
    const sector = this.structureForm.get('sector')?.value;
    return sector === 3;
  }

  showGovList(): boolean {
    const residence = this.structureForm.get('residence')?.value;
    return residence === "1";
  }

  showResidenceCountryList(): boolean {
    const residence = this.structureForm.get('residence')?.value;
    return residence === "2";
  }

  showDelegation(): boolean {
    const governorateOfResidenceUuidGovernorate = this.structureForm.get('governorateOfResidenceUuidGovernorate')?.value;
    return governorateOfResidenceUuidGovernorate !== "";
  }

  showOtherConsultancyFrameInput: boolean = false;
  showOtherOriginOfDemandInput: boolean = false;
  showOtherOldConsultancyDateInput: boolean = false;
  showOtherConsultancyMotifInput: boolean = false;
  showRecidivismMotiveInput: boolean = false;
  showReasonForWithdrawalInput: boolean = false;
  ShowOtherReasonForRecidivismUuidReasonForRecidivismInput: boolean = false;
  ShowOtherReasonForWithdrawalInputInput: boolean = false;
  showOtherFamilySituationInput: boolean = false;
  showOtherAccommodationTypeInput: boolean = false;
  showPracticeSportInput: boolean = false;
  showCompetitionSportWayInput: boolean = false;

  sectorOptions = [
    {key: 1, label: 'Public'},
    {key: 2, label: 'Privé'},
    {key: 3, label: 'Société civile (ONG)'}
  ];

  ongStructureOptions = [
    {key: 1, label: 'OMS'},
    {key: 2, label: 'GIZ'}
  ];

  ministerOptions = [
    {key: 1, label: 'Ministère de la santé'},
    {key: 2, label: 'Ministère de l intérieur'}
  ];

  structureDemandedOptions = [
    {key: 1, label: 'Centre de prise en charge des addictions'},
    {key: 2, label: 'Hôpital psychiatrique'},
    {key: 3, label: 'Service d\'urgence'},
    {key: 4, label: 'Clinique privée'},
    {key: 5, label: 'Centre de santé communautaire'},
    {key: 6, label: 'Autre'}
  ];

  nationalityOptions = [
    {key: 1, label: 'Tunisie'},
    {key: 2, label: 'France'}
  ];

  gouvernoratOptions = [
    {key: 1, label: 'Tunis'},
    {key: 2, label: 'Ariana'}
  ];

  delegationOptions = [
    {key: 1, label: 'Ariana Ville'},
    {key: 2, label: 'Ariana'}
  ];

  isLoading = true;
  consultancyFrame!: ConsultancyFrameDto[] | null;
  originOfDemande!: OriginOfDemandDto[] | null;
  consultancyMotif!: ConsultancyMotifDto[] | null;
  reasonForWithdrawal!: ReasonForWithdrawalDto[] | null;
  reasonForRecidivism!: ReasonForRecidivismDto[] | null;
  familySituation!: FamilySituationDto[] | null;
  accommodationTypeDto!: AccommodationTypeDto[] | null;
  professionDto!: ProfessionDto[] | null;
  schoolLevel!: SchoolLevelDto[] | null;

  handleConsultancyFrameChange(event: Event, value: number): void {
    const checkbox = event.target as HTMLInputElement;
    const consultancyFrameControl = this.structureForm.get('consultancyFrame');
    const otherConsultancyFrameControl = this.structureForm.get('otherConsultancyFrame');

    if (checkbox.checked) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.id.startsWith('consultancyFrame-')) {
          cb.checked = false;
        }
      });
      consultancyFrameControl?.setValue(value);
      this.showOtherConsultancyFrameInput = value === -1;

      if (value === -1) {
        otherConsultancyFrameControl?.setValidators([Validators.required]);
      } else {
        otherConsultancyFrameControl?.clearValidators();
        otherConsultancyFrameControl?.setValue('');
      }
      otherConsultancyFrameControl?.updateValueAndValidity();
    } else {
      consultancyFrameControl?.setValue(null);
      this.showOtherConsultancyFrameInput = false;
      otherConsultancyFrameControl?.clearValidators();
      otherConsultancyFrameControl?.setValue('');
      otherConsultancyFrameControl?.updateValueAndValidity();
    }
  }

  handleFamilySituationChange(event: Event, value: number): void {
    const checkbox = event.target as HTMLInputElement;
    const familySituationControl = this.structureForm.get('familySituationIdFamilySituation');
    const otherFamilySituationControl = this.structureForm.get('otherFamilySituation');

    if (checkbox.checked) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.id.startsWith('familySituation-')) {
          cb.checked = false;
        }
      });
      familySituationControl?.setValue(value);
      this.showOtherFamilySituationInput = value === -1;

      if (value === -1) {
        otherFamilySituationControl?.setValidators([Validators.required]);
      } else {
        otherFamilySituationControl?.clearValidators();
        otherFamilySituationControl?.setValue('');
      }
      otherFamilySituationControl?.updateValueAndValidity();
    } else {
      familySituationControl?.setValue(null);
      this.showOtherFamilySituationInput = false;
      otherFamilySituationControl?.clearValidators();
      otherFamilySituationControl?.setValue('');
      otherFamilySituationControl?.updateValueAndValidity();
    }
  }

  handleAccommodationTypeChange(event: Event, value: number): void {
    const checkbox = event.target as HTMLInputElement;
    const accommodationTypeControl = this.structureForm.get('accommodationTypeIdAccommodationType');
    const otherAccommodationTypeControl = this.structureForm.get('otherAccommodationType');

    if (checkbox.checked) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.id.startsWith('accommodationType-')) {
          cb.checked = false;
        }
      });
      accommodationTypeControl?.setValue(value);
      this.showOtherAccommodationTypeInput = value === -1;

      if (value === -1) {
        otherAccommodationTypeControl?.setValidators([Validators.required]);
      } else {
        otherAccommodationTypeControl?.clearValidators();
        otherAccommodationTypeControl?.setValue('');
      }
      otherAccommodationTypeControl?.updateValueAndValidity();
    } else {
      accommodationTypeControl?.setValue(null);
      this.showOtherAccommodationTypeInput = false;
      otherAccommodationTypeControl?.clearValidators();
      otherAccommodationTypeControl?.setValue('');
      otherAccommodationTypeControl?.updateValueAndValidity();
    }
  }

  handleProfessionChange(event: Event, value: number): void {
    const checkbox = event.target as HTMLInputElement;
    const professionControl = this.structureForm.get('professionUuidProfession');

    if (checkbox.checked) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.id.startsWith('profession-')) {
          cb.checked = false;
        }
      });
      professionControl?.setValue(value);
    } else {
      professionControl?.setValue(null);
    }
  }

  handleSchoolLevelChange(event: Event, value: number): void {
    const checkbox = event.target as HTMLInputElement;
    const schoolLevelControl = this.structureForm.get('schoolLevelUuidSchoolLevelSchoolLevel');

    if (checkbox.checked) {
      const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;
      checkboxes.forEach(cb => {
        if (cb !== checkbox && cb.id.startsWith('schoolLevel-')) {
          cb.checked = false;
        }
      });
      schoolLevelControl?.setValue(value);
    } else {
      schoolLevelControl?.setValue(null);
    }
  }

  onOriginOfDemandChange(event: any, option: OriginOfDemandDto) {
    const values = this.structureForm.get('originOfDemandSetUuidOriginOfDemands')?.value || [];
    const selected = event.target.value === 'true';

    // Find if an entry for this option already exists
    const existingIndex = values.findIndex((v: any) => v.id === option.uuidOriginOfDemand);

    // Update or add the selection
    if (existingIndex !== -1) {
      values[existingIndex] = { id: option.uuidOriginOfDemand, selected };
    } else {
      values.push({ id: option.uuidOriginOfDemand, selected });
    }

    // Update the form
    this.structureForm.patchValue({
      originOfDemandSetUuidOriginOfDemands: values
    });

    // Update form validation
    const originControl = this.structureForm.get('originOfDemandSetUuidOriginOfDemands');
    if (this.hasAnyOriginOfDemandSelected()) {
      originControl?.setErrors(null);
    } else {
      originControl?.setErrors({ required: true });
    }

    // Handle "other" option visibility and validation
    if (option.uuidOriginOfDemand === -1) {
      this.showOtherOriginOfDemandInput = selected;
      const otherControl = this.structureForm.get('otherOriginOfDemand');

      if (selected) {
        otherControl?.setValidators([Validators.required]);
      } else {
        otherControl?.clearValidators();
        otherControl?.setValue('');
      }

      otherControl?.updateValueAndValidity();
    }

    // Update overall form validity
    this.structureForm.updateValueAndValidity();
  }


  hasAnyOriginOfDemandSelected(): boolean {
    const values = this.structureForm.get('originOfDemandSetUuidOriginOfDemands')?.value;
    console.log(values);

    if (!values || !Array.isArray(values)) return false;

    // Vérifier que chaque élément a une valeur selected (soit true ou false)
    return values.every(value => value.selected === true || value.selected === false);
  }

  checkOtherOriginOfDemand(uuidOrigin: number, selectedValue: boolean): void {
    if (uuidOrigin === -1) {
      this.showOtherOriginOfDemandInput = selectedValue;

      const otherOriginControl = this.structureForm.get('otherOriginOfDemand');
      if (selectedValue) {
        otherOriginControl?.setValidators([Validators.required]);
      } else {
        otherOriginControl?.clearValidators();
        this.clearDependentFields(this.structureForm, ['otherOriginOfDemand']);
      }
      otherOriginControl?.updateValueAndValidity();
    }
  }

  showOtherOldConsultancyDate(selectedValue: boolean): void {
    this.showOtherOldConsultancyDateInput = selectedValue;
  }

  showPracticeSport(selectedValue: boolean): void {
    this.showPracticeSportInput = selectedValue;
  }

  competitionSportWay(selectedValue: boolean): void {
    this.showCompetitionSportWayInput = selectedValue;
  }

  getConsultancyFrameDtoList(): void {
    this.isLoading = true;
    this.drugRequestService.getConsultancyFrameDtoList().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.consultancyFrame = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getOriginOfDemandDtoList(): void {
    this.isLoading = true;
    this.drugRequestService.getOriginOfDemandDtoList().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.originOfDemande = response.body;

          // Get existing selections from form
          const existingSelections = this.structureForm.get('originOfDemandSetUuidOriginOfDemands')?.value || [];

          // If no existing selections, initialize with empty values
          if (existingSelections.length === 0 && this.originOfDemande) {
            const initialSelections = this.originOfDemande.map(option => ({
              id: option.uuidOriginOfDemand,
              selected: null
            }));
            this.structureForm.patchValue({
              originOfDemandSetUuidOriginOfDemands: initialSelections
            });
          }

          // After the data is loaded, restore radio button states
          setTimeout(() => {
            this.restoreOriginOfDemandSelections();
          });

          // Update form validity
          if (this.hasAnyOriginOfDemandSelected()) {
            this.structureForm.get('originOfDemandSetUuidOriginOfDemands')?.setErrors(null);
          }
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  getConsultancyMotifDto(): void {
    this.isLoading = true;
    this.drugRequestService.getConsultancyMotifDto().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.consultancyMotif = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getReasonForWithdrawalDto(): void {
    this.isLoading = true;
    this.drugRequestService.getReasonForWithdrawalDto().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.reasonForWithdrawal = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getReasonForRecidivismDto(): void {
    this.isLoading = true;
    this.drugRequestService.getReasonForRecidivismDto().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.reasonForRecidivism = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getFamilySituationDtoList(): void {
    this.isLoading = true;

    this.drugRequestService.getFamilySituationDtoList().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.familySituation = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getAccommodationTypeDtoList(): void {
    this.isLoading = true;
    this.drugRequestService.getAccommodationTypeDtoList().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status ===  200) {
          this.accommodationTypeDto = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getProfessionDtoList(): void {
    this.isLoading = true;
    this.drugRequestService.getProfessionDtoList().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.professionDto = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getSchoolLevelDtoList(): void {
    this.isLoading = true;
    this.drugRequestService.getSchoolLevelDtoList().subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.status === 200) {
          this.schoolLevel = response.body;
        }
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  updateShowOtherOriginOfDemandInput() {
    const values = this.structureForm.get('originOfDemandSetUuidOriginOfDemands')?.value;
    if (Array.isArray(values)) {
      this.showOtherOriginOfDemandInput = values.some(value => value.id === -1 && value.selected);
      console.log(values)
    }
  }
}
