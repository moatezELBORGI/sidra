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
        this.getConsultancyFrameDtoList();
        this.getOriginOfDemandDtoList();
        this.getConsultancyMotifDto();
        this.getFamilySituationDtoList();
        this.getAccommodationTypeDtoList();
        this.getProfessionDtoList();
        this.getSchoolLevelDtoList();
        // Add required validators
        this.addValidators();

     }

    // Add validators to form controls
    addValidators() {
        const structureForm = this.structureForm;

        // Add conditional validators where necessary
        structureForm.get('sector')?.valueChanges.subscribe(value => {
            if (value === 3) {
                structureForm.get('ongStructureId')?.setValidators([Validators.required]);
            } else {
                structureForm.get('ongStructureId')?.clearValidators();
            }
            structureForm.get('ongStructureId')?.updateValueAndValidity();
        });

        structureForm.get('residence')?.valueChanges.subscribe(value => {
            if (value === "1") {
                structureForm.get('governorateOfResidenceUuidGovernorate')?.setValidators([Validators.required]);
                structureForm.get('countryOfResidenceUuidCountry')?.clearValidators();
            } else if (value === "2") {
                structureForm.get('countryOfResidenceUuidCountry')?.setValidators([Validators.required]);
                structureForm.get('governorateOfResidenceUuidGovernorate')?.clearValidators();
            }
            structureForm.get('governorateOfResidenceUuidGovernorate')?.updateValueAndValidity();
            structureForm.get('countryOfResidenceUuidCountry')?.updateValueAndValidity();
        });

        structureForm.get('governorateOfResidenceUuidGovernorate')?.valueChanges.subscribe(value => {
            if (value) {
                structureForm.get('cityOfResidenceUuidCity')?.setValidators([Validators.required]);
            } else {
                structureForm.get('cityOfResidenceUuidCity')?.clearValidators();
            }
            structureForm.get('cityOfResidenceUuidCity')?.updateValueAndValidity();
        });

        structureForm.get('consultancyFrame')?.valueChanges.subscribe(value => {
            if (value === -1) {
                structureForm.get('otherConsultancyFrame')?.setValidators([Validators.required]);
            } else {
                structureForm.get('otherConsultancyFrame')?.clearValidators();
            }
            structureForm.get('otherConsultancyFrame')?.updateValueAndValidity();
        });

        structureForm.get('oldConsultancy')?.valueChanges.subscribe(value => {
            if (value === "true") {
                structureForm.get('oldConsultancyDate')?.setValidators([Validators.required]);
                structureForm.get('oldConsultancyMotifUuidConsultancyMotif')?.setValidators([Validators.required]);
            } else {
                structureForm.get('oldConsultancyDate')?.clearValidators();
                structureForm.get('oldConsultancyMotifUuidConsultancyMotif')?.clearValidators();
            }
            structureForm.get('oldConsultancyDate')?.updateValueAndValidity();
            structureForm.get('oldConsultancyMotifUuidConsultancyMotif')?.updateValueAndValidity();
        });

        structureForm.get('oldConsultancyMotifUuidConsultancyMotif')?.valueChanges.subscribe(value => {
            if (value === "-1") {
                structureForm.get('otherOldConsultancyMotif')?.setValidators([Validators.required]);
            } else {
                structureForm.get('otherOldConsultancyMotif')?.clearValidators();
            }

            if (value === "5") {
                structureForm.get('reasonForRecidivismUuidReasonForRecidivism')?.setValidators([Validators.required]);
            } else {
                structureForm.get('reasonForRecidivismUuidReasonForRecidivism')?.clearValidators();
            }

            if (value === "3") {
                structureForm.get('reasonForWithdrawalUuidReasonForWithdrawal')?.setValidators([Validators.required]);
            } else {
                structureForm.get('reasonForWithdrawalUuidReasonForWithdrawal')?.clearValidators();
            }

            structureForm.get('otherOldConsultancyMotif')?.updateValueAndValidity();
            structureForm.get('reasonForRecidivismUuidReasonForRecidivism')?.updateValueAndValidity();
            structureForm.get('reasonForWithdrawalUuidReasonForWithdrawal')?.updateValueAndValidity();
        });

        structureForm.get('reasonForRecidivismUuidReasonForRecidivism')?.valueChanges.subscribe(value => {
            if (value === "-1") {
                structureForm.get('otherReasonForRecidivism')?.setValidators([Validators.required]);
            } else {
                structureForm.get('otherReasonForRecidivism')?.clearValidators();
            }
            structureForm.get('otherReasonForRecidivism')?.updateValueAndValidity();
        });

        structureForm.get('reasonForWithdrawalUuidReasonForWithdrawal')?.valueChanges.subscribe(value => {
            if (value === "-1") {
                structureForm.get('otherReasonForWithdrawal')?.setValidators([Validators.required]);
            } else {
                structureForm.get('otherReasonForWithdrawal')?.clearValidators();
            }
            structureForm.get('otherReasonForWithdrawal')?.updateValueAndValidity();
        });

        structureForm.get('familySituationIdFamilySituation')?.valueChanges.subscribe(value => {
            if (value === -1) {
                structureForm.get('otherFamilySituation')?.setValidators([Validators.required]);
            } else {
                structureForm.get('otherFamilySituation')?.clearValidators();
            }
            structureForm.get('otherFamilySituation')?.updateValueAndValidity();
        });

        structureForm.get('accommodationTypeIdAccommodationType')?.valueChanges.subscribe(value => {
            if (value === -1) {
                structureForm.get('otherAccommodationType')?.setValidators([Validators.required]);
            } else {
                structureForm.get('otherAccommodationType')?.clearValidators();
            }
            structureForm.get('otherAccommodationType')?.updateValueAndValidity();
        });

        structureForm.get('practiceSport')?.valueChanges.subscribe(value => {
            if (value === "true") {
                structureForm.get('regularPracticeSportWay')?.setValidators([Validators.required]);
                structureForm.get('competitionSportWay')?.setValidators([Validators.required]);
            } else {
                structureForm.get('regularPracticeSportWay')?.clearValidators();
                structureForm.get('competitionSportWay')?.clearValidators();
            }
            structureForm.get('regularPracticeSportWay')?.updateValueAndValidity();
            structureForm.get('competitionSportWay')?.updateValueAndValidity();
        });

        structureForm.get('competitionSportWay')?.valueChanges.subscribe(value => {
            if (value === "true") {
                structureForm.get('doping')?.setValidators([Validators.required]);
            } else {
                structureForm.get('doping')?.clearValidators();
            }
            structureForm.get('doping')?.updateValueAndValidity();
        });
    }

    // Single option checkbox handlers
    handleConsultancyFrameChange(event: Event, value: number): void {
        const checkbox = event.target as HTMLInputElement;
        const consultancyFrameControl = this.structureForm.get('consultancyFrame');

        if (checkbox.checked) {
            // Uncheck all other checkboxes
            const checkboxes = document.querySelectorAll('input[formControlName="consultancyFrame"]') as NodeListOf<HTMLInputElement>;
            checkboxes.forEach(cb => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
            consultancyFrameControl?.setValue(value);
            this.showOtherConsultancyFrame(event, value);
        } else {
            consultancyFrameControl?.setValue(null);
            this.showOtherConsultancyFrameInput = false;
        }
    }

    handleFamilySituationChange(event: Event, value: number): void {
        const checkbox = event.target as HTMLInputElement;
        const familySituationControl = this.structureForm.get('familySituationIdFamilySituation');

        if (checkbox.checked) {
            const checkboxes = document.querySelectorAll('input[formControlName="familySituationIdFamilySituation"]') as NodeListOf<HTMLInputElement>;
            checkboxes.forEach(cb => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
            familySituationControl?.setValue(value);
            this.showOtherFamilySituation(event, value);
        } else {
            familySituationControl?.setValue(null);
            this.showOtherFamilySituationInput = false;
        }
    }

    handleAccommodationTypeChange(event: Event, value: number): void {
        const checkbox = event.target as HTMLInputElement;
        const accommodationTypeControl = this.structureForm.get('accommodationTypeIdAccommodationType');

        if (checkbox.checked) {
            const checkboxes = document.querySelectorAll('input[formControlName="accommodationTypeIdAccommodationType"]') as NodeListOf<HTMLInputElement>;
            checkboxes.forEach(cb => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
            accommodationTypeControl?.setValue(value);
            this.showOtherAccommodationType(event, value);
        } else {
            accommodationTypeControl?.setValue(null);
            this.showOtherAccommodationTypeInput = false;
        }
    }

    handleProfessionChange(event: Event, value: number): void {
        const checkbox = event.target as HTMLInputElement;
        const professionControl = this.structureForm.get('professionUuidProfession');

        if (checkbox.checked) {
            const checkboxes = document.querySelectorAll('input[formControlName="professionUuidProfession"]') as NodeListOf<HTMLInputElement>;
            checkboxes.forEach(cb => {
                if (cb !== checkbox) {
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
            const checkboxes = document.querySelectorAll('input[formControlName="schoolLevelUuidSchoolLevelSchoolLevel"]') as NodeListOf<HTMLInputElement>;
            checkboxes.forEach(cb => {
                if (cb !== checkbox) {
                    cb.checked = false;
                }
            });
            schoolLevelControl?.setValue(value);
        } else {
            schoolLevelControl?.setValue(null);
        }
    }

    get structureForm(): FormGroup {
        return this.parentForm.get('structureInfo') as FormGroup;
    }

    get originOfDemandControls(): FormArray {
        return this.structureForm.get('originOfDemandSetUuidOriginOfDemands') as FormArray;
    }

    initializeOriginOfDemandControls(): void {
        const array = this.structureForm.get('originOfDemandSetUuidOriginOfDemands') as FormArray;
        this.originOfDemande?.forEach(() => {
            array.push(this.fb.group({
                selected: [null, Validators.required]
            }));
        });
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

    showOtherConsultancyFrame(event: Event, value: number): void {
        const checkbox = event.target as HTMLInputElement;
        this.showOtherConsultancyFrameInput = checkbox.checked && value === -1;
    }

    showOtherFamilySituation(event: Event, value: number): void {
        const checkbox = event.target as HTMLInputElement;
        this.showOtherFamilySituationInput = checkbox.checked && value === -1;
    }

    showOtherAccommodationType(event: Event, value: number): void {
        const checkbox = event.target as HTMLInputElement;
        this.showOtherAccommodationTypeInput = checkbox.checked && value === -1;
    }

    checkOtherOriginOfDemand(uuidOrigin: number, selectedValue: boolean): void {
        if (uuidOrigin === -1) {
            this.showOtherOriginOfDemandInput = selectedValue;

            if (selectedValue) {
                this.structureForm.get('otherOriginOfDemand')?.setValidators([Validators.required]);
            } else {
                this.structureForm.get('otherOriginOfDemand')?.clearValidators();
            }
            this.structureForm.get('otherOriginOfDemand')?.updateValueAndValidity();
        }
    }

    showOtherOldConsultancyDate(selectedValue: boolean): void {
        this.showOtherOldConsultancyDateInput = selectedValue;
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

            if (selectedValue === '5') {
                this.showRecidivismMotiveInput = true;
                this.getReasonForRecidivismDto();
            } else if (selectedValue === '3') {
                this.showReasonForWithdrawalInput = true;
                this.getReasonForWithdrawalDto();
            } else if (selectedValue === '-1') {
                this.showOtherConsultancyMotifInput = true;
            }
        }
    }

    ShowReasonForWithdrawalInput(event: Event): void {
        const selectElement = event.target as HTMLSelectElement | null;
        if (selectElement) {
            this.ShowOtherReasonForWithdrawalInputInput = selectElement.value === '-1';
        }
    }

    ShowOtherReasonForRecidivismUuidReasonForRecidivism(event: Event): void {
        const selectElement = event.target as HTMLSelectElement | null;
        if (selectElement) {
            this.ShowOtherReasonForRecidivismUuidReasonForRecidivismInput = selectElement.value === '-1';
        }
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
                    this.initializeOriginOfDemandControls();
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
                if (response.status === 200) {
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
}
