import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DrugRequestService } from '../../../../core/services/drug-request.service';
import { TypesOfSpaConsumptionEntourages } from '../../../../core/models/demanddrugs/TypesOfSpaConsumptionEntourages.model';
import { MorphineDrugDto } from '../../../../core/models/demanddrugs/MorphineDrugDto.model';
import { HypnoticsAndSedativesDto } from '../../../../core/models/demanddrugs/HypnoticsAndSedativesDto.model';
import { EntourageDto } from '../../../../core/models/demanddrugs/EntourageDto.model';

@Component({
  selector: 'app-step3',
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.css'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class Step3Component implements OnInit {
  @Input() parentForm!: FormGroup;
  substanceForm: FormGroup;
  entourageOptions: EntourageDto[] = [];
  typesOfSpaConsumptionEntourages: TypesOfSpaConsumptionEntourages[] = [];
  morphineDrugs: MorphineDrugDto[] = [];
  sedativeHypnotics: HypnoticsAndSedativesDto[] = [];
  showOtherSpaConsumptionInput: boolean = false;
  isLoading: boolean = false;
  selectedEntourageOptions: { [key: string]: boolean } = {};
  filteredTypesOfSpaConsumption: TypesOfSpaConsumptionEntourages[] = [];

  constructor(
    private drugRequestService: DrugRequestService,
    private fb: FormBuilder
  ) {
    this.substanceForm = new FormGroup({});
  }

  ngOnInit() {
    this.substanceForm = this.parentForm.get('substanceUse') as FormGroup;
    this.loadData();
    this.setupValidation();

    // Add required validators for all fields
    const requiredFields = [
      'spaConsumptionInEntourage',
      'spaConsumptionOtherThanAlcoholAndTobacco',
      'ageOfInitialTypesSedativeHypnoticOtherThanAlcoholAndTobacco'
    ];

    requiredFields.forEach(field => {
      const control = this.substanceForm.get(field);
      if (control) {
        control.setValidators([Validators.required]);
        control.updateValueAndValidity();
      }
    });

    setTimeout(() => {
      this.restoreFieldVisibility();
    }, 100);
  }

  setupValidation() {
    // SPA consumption in entourage validation
    this.substanceForm.get('spaConsumptionInEntourage')?.valueChanges.subscribe(value => {
      if (value === true) {
        // Initialize arrays with null values to force validation
        if (!this.substanceForm.get('typesOfSpaConsumptionEntourageAnswers')?.value) {
          this.substanceForm.patchValue({
            typesOfSpaConsumptionEntourageAnswers: new Array(this.typesOfSpaConsumptionEntourages.length).fill(null)
          });
        }
        
        // Set validators for entourage options and SPA consumption types
        this.substanceForm.get('spaConsumptionEntourageUuidEntourages')?.setValidators([
          Validators.required,
          (control) => {
            const values = control.value;
            if (!Array.isArray(values)) return { invalidFormat: true };
            // Check if all entourage options have been answered
            const allAnswered = values.every(v => v.selected === true || v.selected === false);
            return allAnswered ? null : { incomplete: true };
          }
        ]);

        this.substanceForm.get('typesOfSpaConsumptionEntourageAnswers')?.setValidators([
          Validators.required,
          (control) => {
            const values = control.value;
            if (!Array.isArray(values)) return { invalidFormat: true };
            // Check if all SPA consumption types have been answered
            const allAnswered = values.every(v => v === true || v === false);
            return allAnswered ? null : { incomplete: true };
          }
        ]);

        // Update validity
        this.substanceForm.get('spaConsumptionEntourageUuidEntourages')?.updateValueAndValidity();
        this.substanceForm.get('typesOfSpaConsumptionEntourageAnswers')?.updateValueAndValidity();
      } else {
        // Clear validators and values when "No" is selected
        const fieldsToReset = [
          'spaConsumptionEntourageUuidEntourages',
          'otherSpaConsumptionInEntourage',
          'typesOfSpaConsumptionEntourageAnswers',
          'morphineDrugOfSpaConsumptionEntouragesIdMorphineDrug',
          'sedativeHypnoticOfSpaConsumptionEntouragesIdSedativeHypnotic',
          'otherTypesOfSpaConsumptionEntourages'
        ];

        fieldsToReset.forEach(field => {
          const control = this.substanceForm.get(field);
          if (control) {
            control.clearValidators();
            control.reset();
            control.updateValueAndValidity();
          }
        });
      }
    });

    // SPA consumption other than alcohol and tobacco validation
    this.substanceForm.get('spaConsumptionOtherThanAlcoholAndTobacco')?.valueChanges.subscribe(value => {
      if (value === true) {
        // Initialize arrays with null values to force validation
        if (!this.substanceForm.get('typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.value) {
          this.substanceForm.patchValue({
            typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages: 
              new Array(this.filteredTypesOfSpaConsumption.length).fill(null)
          });
        }
        
        // Set validators for other SPA options
        this.substanceForm.get('typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.setValidators([
          Validators.required,
          (control) => {
            const values = control.value;
            if (!Array.isArray(values)) return { invalidFormat: true };
            // Check if all options have been answered
            const allAnswered = values.every(v => v === true || v === false);
            return allAnswered ? null : { incomplete: true };
          }
        ]);

        this.substanceForm.get('typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.updateValueAndValidity();
      } else {
        // Clear validators and values when "No" is selected
        const fieldsToReset = [
          'typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages',
          'morphineDrugOtherThanAlcoholAndTobaccoIdMorphineDrug',
          'sedativeHypnoticOtherThanAlcoholAndTobaccoIdSedativeHypnotic',
          'otherTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobacco'
        ];

        fieldsToReset.forEach(field => {
          const control = this.substanceForm.get(field);
          if (control) {
            control.clearValidators();
            control.reset();
            control.updateValueAndValidity();
          }
        });
      }
    });

    // Initial substance type validation
    this.substanceForm.get('initialTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.setValidators([
      Validators.required,
      (control) => {
        const values = control.value;
        if (!Array.isArray(values)) return { invalidFormat: true };
        // Check if all initial substance types have been answered
        const allAnswered = values.every(v => v === true || v === false);
        return allAnswered ? null : { incomplete: true };
      }
    ]);

    // Initialize initial substance type array with null values
    if (!this.substanceForm.get('initialTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.value) {
      this.substanceForm.patchValue({
        initialTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages:
          new Array(this.filteredTypesOfSpaConsumption.length).fill(null)
      });
    }

    // Update validity of all controls
    Object.keys(this.substanceForm.controls).forEach(key => {
      const control = this.substanceForm.get(key);
      if (control) {
        control.updateValueAndValidity();
      }
    });
  }

  clearDependentFields(form: FormGroup, fieldsToReset: string[]) {
    fieldsToReset.forEach(field => {
      const control = form.get(field);
      if (control) {
        control.reset();
        control.clearValidators();
        control.updateValueAndValidity();
      }
    });

    // Clear radio buttons and checkboxes
    const radioButtons = document.querySelectorAll('input[type="radio"]') as NodeListOf<HTMLInputElement>;
    const checkboxes = document.querySelectorAll('input[type="checkbox"]') as NodeListOf<HTMLInputElement>;

    [...Array.from(radioButtons), ...Array.from(checkboxes)].forEach(input => {
      if (fieldsToReset.some(field => input.id.includes(field))) {
        input.checked = false;
      }
    });
  }

  loadData() {
    this.getTypesOfSpaConsumptionEntouragesDto();
    this.getMorphineDrugDto();
    this.getHypnoticsAndSedativesDto();
    this.getEntourageDtoList();
  }

  getTypesOfSpaConsumptionEntouragesDto() {
    this.isLoading = true;
    this.drugRequestService.getTypesOfSpaConsumptionEntouragesDto().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body) {
          this.typesOfSpaConsumptionEntourages = response.body;
          this.filteredTypesOfSpaConsumption = this.typesOfSpaConsumptionEntourages.filter(
              item => item.uuidTypesOfSpaConsumptionEntourages !== 1 &&
                  item.uuidTypesOfSpaConsumptionEntourages !== 2
          );
          if (!this.substanceForm.get('typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.value) {
            const otherAnswers = new Array(this.filteredTypesOfSpaConsumption.length).fill(null);
            this.substanceForm.patchValue({
              typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages: otherAnswers
            });
          }

          if (!this.substanceForm.get('typesOfSpaConsumptionEntourageAnswers')?.value) {
            const answers = new Array(this.typesOfSpaConsumptionEntourages.length).fill(null);
            this.substanceForm.patchValue({ typesOfSpaConsumptionEntourageAnswers: answers });
          }
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getMorphineDrugDto() {
    this.isLoading = true;
    this.drugRequestService.getMorphineDrugDto().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body) {
          this.morphineDrugs = response.body;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getHypnoticsAndSedativesDto() {
    this.isLoading = true;
    this.drugRequestService.getHypnoticsAndSedativesDto().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body) {
          this.sedativeHypnotics = response.body;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  getEntourageDtoList() {
    this.isLoading = true;
    this.drugRequestService.getEntourageDtoList().subscribe({
      next: (response) => {
        if (response.status === 200 && response.body) {
          this.entourageOptions = response.body;
          setTimeout(() => {
            this.restoreFieldVisibility();
          }, 100);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  showEntourageDetails(): boolean {
    return this.substanceForm.get('spaConsumptionInEntourage')?.value === true;
  }

  showOtherSpaConsumptionDetails(): boolean {
    return this.substanceForm.get('spaConsumptionOtherThanAlcoholAndTobacco')?.value === true;
  }

  onEntourageOptionChange(event: any, option: EntourageDto) {
    const values = this.substanceForm.get('spaConsumptionEntourageUuidEntourages')?.value || [];
    const selected = event.target.value === 'true';

    this.selectedEntourageOptions[option.uuidEntourage] = selected;

    const existingIndex = values.findIndex((v: any) => v.id === option.uuidEntourage);
    if (existingIndex !== -1) {
      values[existingIndex].selected = selected;
    } else {
      values.push({ id: option.uuidEntourage, selected });
    }

    this.substanceForm.patchValue({ spaConsumptionEntourageUuidEntourages: values });
    this.updateShowOtherSpaConsumptionInput();
  }

  onSpaTypeChange(index: number, selected: boolean) {
    const answers = [...(this.substanceForm.get('typesOfSpaConsumptionEntourageAnswers')?.value || [])];
    answers[index] = selected;
    this.substanceForm.patchValue({ typesOfSpaConsumptionEntourageAnswers: answers });

    // Handle dependent fields validation directly here
    const option = this.typesOfSpaConsumptionEntourages[index];
    if (option) {
      if (selected === true) {
        if (option.uuidTypesOfSpaConsumptionEntourages === 5) {
          this.substanceForm.get('morphineDrugOfSpaConsumptionEntouragesIdMorphineDrug')?.setValidators([Validators.required]);
        } else if (option.uuidTypesOfSpaConsumptionEntourages === 8) {
          this.substanceForm.get('sedativeHypnoticOfSpaConsumptionEntouragesIdSedativeHypnotic')?.setValidators([Validators.required]);
        } else if (option.uuidTypesOfSpaConsumptionEntourages === -1) {
          this.substanceForm.get('otherTypesOfSpaConsumptionEntourages')?.setValidators([Validators.required]);
        }
      } else {
        if (option.uuidTypesOfSpaConsumptionEntourages === 5) {
          this.clearDependentFields(this.substanceForm, ['morphineDrugOfSpaConsumptionEntouragesIdMorphineDrug']);
        } else if (option.uuidTypesOfSpaConsumptionEntourages === 8) {
          this.clearDependentFields(this.substanceForm, ['sedativeHypnoticOfSpaConsumptionEntouragesIdSedativeHypnotic']);
        } else if (option.uuidTypesOfSpaConsumptionEntourages === -1) {
          this.clearDependentFields(this.substanceForm, ['otherTypesOfSpaConsumptionEntourages']);
        }
      }
    }
  }

  onInitialSpaTypeChange(index: number, value: boolean) {
    const answers = [...(this.substanceForm.get('initialTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.value || [])];
    answers[index] = value;
    this.substanceForm.patchValue({
      initialTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages: answers
    });

    // Handle dependent fields validation
    const option = this.filteredTypesOfSpaConsumption[index];
    if (option) {
      if (value === true) {
        if (option.uuidTypesOfSpaConsumptionEntourages === 5) {
          this.substanceForm.get('initialTypesMorphineDrugOtherThanAlcoholAndTobaccoIdMorphineDrug')?.setValidators([Validators.required]);
        } else if (option.uuidTypesOfSpaConsumptionEntourages === 8) {
          this.substanceForm.get('initialTypesSedativeHypnoticOtherThanAlcoholAndTobaccoIdSedativeHypnotic')?.setValidators([Validators.required]);
        } else if (option.uuidTypesOfSpaConsumptionEntourages === -1) {
          this.substanceForm.get('initialTypesOtherTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobacco')?.setValidators([Validators.required]);
        }
      } else {
        if (option.uuidTypesOfSpaConsumptionEntourages === 5) {
          this.clearDependentFields(this.substanceForm, ['initialTypesMorphineDrugOtherThanAlcoholAndTobaccoIdMorphineDrug']);
        } else if (option.uuidTypesOfSpaConsumptionEntourages === 8) {
          this.clearDependentFields(this.substanceForm, ['initialTypesSedativeHypnoticOtherThanAlcoholAndTobaccoIdSedativeHypnotic']);
        } else if (option.uuidTypesOfSpaConsumptionEntourages === -1) {
          this.clearDependentFields(this.substanceForm, ['initialTypesOtherTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobacco']);
        }
      }
    }

    // Update validity
    this.substanceForm.get('initialTypesMorphineDrugOtherThanAlcoholAndTobaccoIdMorphineDrug')?.updateValueAndValidity();
    this.substanceForm.get('initialTypesSedativeHypnoticOtherThanAlcoholAndTobaccoIdSedativeHypnotic')?.updateValueAndValidity();
    this.substanceForm.get('initialTypesOtherTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobacco')?.updateValueAndValidity();
  }

  updateShowOtherSpaConsumptionInput() {
    const values = this.substanceForm.get('spaConsumptionEntourageUuidEntourages')?.value;
    if (Array.isArray(values)) {
      this.showOtherSpaConsumptionInput = values.some(value => value.id === -1 && value.selected);
    } else {
      this.showOtherSpaConsumptionInput = false;
    }
  }

  restoreFieldVisibility() {
    if (!this.entourageOptions.length) {
      return;
    }

    const spaConsumption = this.substanceForm.get('spaConsumptionInEntourage')?.value;

    if (spaConsumption === true) {
      const radioYes = document.getElementById('spaConsumptionInEntourage-1') as HTMLInputElement;
      if (radioYes) {
        radioYes.checked = true;
      }
    } else if (spaConsumption === false) {
      const radioNo = document.getElementById('spaConsumptionInEntourage-2') as HTMLInputElement;
      if (radioNo) {
        radioNo.checked = true;
      }
    }

    if (spaConsumption === true) {
      // Set up validation for entourage options
      this.substanceForm.get('spaConsumptionEntourageUuidEntourages')?.setValidators([Validators.required]);
      this.substanceForm.get('spaConsumptionEntourageUuidEntourages')?.updateValueAndValidity();

      const entourageValues = this.substanceForm.get('spaConsumptionEntourageUuidEntourages')?.value || [];

      entourageValues.forEach((value: any) => {
        if (value && value.id !== undefined) {
          this.selectedEntourageOptions[value.id] = !!value.selected;

          setTimeout(() => {
            const inputSelector = `input[name="entourage-${value.id}"][value="${value.selected}"]`;
            const input = document.querySelector(inputSelector) as HTMLInputElement;
            if (input) {
              input.checked = true;
            }
          }, 0);

          if (value.id === -1 && value.selected) {
            this.showOtherSpaConsumptionInput = true;
          }
        }
      });

      const answers = this.substanceForm.get('typesOfSpaConsumptionEntourageAnswers')?.value;
      if (answers && Array.isArray(answers)) {
        answers.forEach((answer: boolean | null, index: number) => {
          if (answer === true || answer === false) {
            setTimeout(() => {
              if (this.typesOfSpaConsumptionEntourages[index]) {
                const optionId = this.typesOfSpaConsumptionEntourages[index].uuidTypesOfSpaConsumptionEntourages;
                const selector = `input[name="spa-${optionId}"][value="${answer}"]`;
                const input = document.querySelector(selector) as HTMLInputElement;
                if (input) {
                  input.checked = true;
                }
              }
            }, 0);
          }
        });
      }
    }

    // Restore initial substance consumption selections
    const initialAnswers = this.substanceForm.get('initialTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.value;
    if (initialAnswers && Array.isArray(initialAnswers)) {
      initialAnswers.forEach((answer: boolean | null, index: number) => {
        if (answer === true || answer === false) {
          setTimeout(() => {
            if (this.filteredTypesOfSpaConsumption[index]) {
              const optionId = this.filteredTypesOfSpaConsumption[index].uuidTypesOfSpaConsumptionEntourages;
              const selector = `input[name="initial-spa-${optionId}"][value="${answer}"]`;
              const input = document.querySelector(selector) as HTMLInputElement;
              if (input) {
                input.checked = true;
              }
            }
          }, 0);
        }
      });
    }
  }

  isOptionAnswered(index: number): boolean {
    const answers = this.substanceForm.get('typesOfSpaConsumptionEntourageAnswers')?.value;
    return answers && answers[index] !== null;
  }

  areAllOptionsAnswered(): boolean {
    const answers = this.substanceForm.get('typesOfSpaConsumptionEntourageAnswers')?.value;
    return answers?.every((answer: boolean | null) => answer !== null) ?? false;
  }

  areAllOtherSpaOptionsAnswered(): boolean {
    const answers = this.substanceForm.get('typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.value;
    return answers?.every((answer: boolean | null) => answer !== null);
  }

  areAllInitialSpaOptionsAnswered(): boolean {
    const answers = this.substanceForm.get('initialTypesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.value;
    return answers?.every((answer: boolean | null) => answer !== null);
  }

  onOtherSpaTypeChange(index: number, value: boolean) {
    const answers = [...this.substanceForm.get('typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages')?.value];
    answers[index] = value;
    this.substanceForm.patchValue({
      typesOfSpaConsumptionEntouragesOtherThanAlcoholAndTobaccoUuidTypesOfSpaConsumptionEntourages: answers
    });
  }

  hasAnyEntourageSelected(): boolean {
    const values = this.substanceForm.get('spaConsumptionEntourageUuidEntourages')?.value;
    return Array.isArray(values) && values.some(value => value.selected !== null);
  }
}

export { Step3Component }

export { Step3Component }