import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsService } from './forms.service';
import { FormValidationService } from './form-validation-service';
import { StepIndicatorComponent } from "./step-indicator/step-indicator.component";
import { Step1Component } from "./steps/step1/step1.component";
import { Step2Component } from "./steps/step2/step2.component";
import { Step3Component } from "./steps/step3/step3.component";
import { Step4Component } from "./steps/step4/step4.component";
import { Step5Component } from "./steps/step5/step5.component";
import { Step6Component } from "./steps/step6/step6.component";
import { NgIf } from "@angular/common";
import { FormDataService } from '../../core/services/FormDataService.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-multi-step-form',
  templateUrl: './multi-step-form.component.html',
  styleUrls: ['./multi-step-form.component.css'],
  imports: [
    StepIndicatorComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    Step5Component,
    Step6Component,
    NgIf
  ],
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({transform: 'translateX(100%)', opacity: 0}),
        animate('300ms ease-out', style({transform: 'translateX(0)', opacity: 1}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0)', opacity: 1}),
        animate('300ms ease-in', style({transform: 'translateX(-100%)', opacity: 0}))
      ])
    ])
  ],
  standalone: true
})
export class MultiStepFormComponent implements OnInit {
  steps = [
    { label: 'Step 1', valid: false },
    { label: 'Step 2', valid: false },
    { label: 'Step 3', valid: false },
    { label: 'Step 4', valid: false },
    { label: 'Step 5', valid: false },
    { label: 'Step 6', valid: false }
  ];

  currentStep = 1;
  totalSteps = this.steps.length;
  progressPercentage = 0;
  form!: FormGroup;
  isEditMode = false;
  formId: string | null = null;
  showValidationError = false;

  stepFormsValid: Record<number, boolean> = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  };

  private readonly formGroups: Record<number, string> = {
    1: 'structureInfo',
    2: 'tobaccoAlcohol',
    3: 'substanceUse',
    4: 'behaviorsAndTests',
    5: 'comorbidities',
    6: 'spaDeaths'
  };

  constructor(
      private formsService: FormsService,
      private validationService: FormValidationService,
      private formDataService: FormDataService,
      private router: Router,
      private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.formsService.getFormGroup();
    this.updateProgress();
    this.setupFormValidationSubscriptions();

    this.route.queryParams.subscribe(params => {
      if (params['id'] && params['mode'] === 'edit') {
        this.isEditMode = true;
        this.formId = params['id'];
        this.loadFormData(params['id']);
      }
    });
  }

  private loadFormData(id: string) {
    this.formDataService.getFormById(id).subscribe({
      next: (formData) => {
        Object.entries(this.formGroups).forEach(([_, groupName]) => {
          const groupData = formData[groupName as keyof typeof formData];
          if (groupData) {
            this.form.get(groupName)?.patchValue(groupData);
          }
        });
      },
      error: (error) => {
        console.error('Error loading form data:', error);
      }
    });
  }

  setupFormValidationSubscriptions() {
    Object.entries(this.formGroups).forEach(([step, groupName]) => {
      const group = this.form.get(groupName);
      if (group) {
        group.valueChanges.subscribe(() => {
          const stepNumber = parseInt(step);
          this.stepFormsValid[stepNumber] = group.valid;
          this.steps[stepNumber - 1].valid = group.valid;
          this.showValidationError = false;
        });
      }
    });
  }

  goToStep(step: number) {
    const currentForm = this.getCurrentStepForm();
    if (step < this.currentStep) {
      this.currentStep = step;
      this.updateProgress();
      this.showValidationError = false;
    } else {
      this.validationService.markFormGroupTouched(currentForm);
      if (currentForm.valid) {
        this.currentStep = step;
        this.updateProgress();
        this.showValidationError = false;
      } else {
        this.showValidationError = true;
        this.validationService.scrollToFirstInvalidControl('multi-step-form');
      }
    }
  }

  nextStep() {
    const currentForm = this.getCurrentStepForm();
    this.validationService.markFormGroupTouched(currentForm);

    if (currentForm.valid) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateProgress();
        this.showValidationError = false;
      }
    } else {
      this.showValidationError = true;
      this.validationService.scrollToFirstInvalidControl('multi-step-form');
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgress();
      this.showValidationError = false;
    }
  }

  updateProgress() {
    this.progressPercentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }

  submitForm() {
    const currentForm = this.getCurrentStepForm();
    this.validationService.markFormGroupTouched(currentForm);

    if (currentForm.valid) {
      const formData = {
        governorat: this.form.get('structureInfo')?.get('governorateOfResidenceUuidGovernorate')?.value,
        structure: this.form.get('structureInfo')?.get('structureDemandedStructureId')?.value,
        structureInfo: this.form.get('structureInfo')?.value,
        tobaccoAlcohol: this.form.get('tobaccoAlcohol')?.value,
        substanceUse: this.form.get('substanceUse')?.value,
        behaviorsAndTests: this.form.get('behaviorsAndTests')?.value,
        comorbidities: this.form.get('comorbidities')?.value,
        spaDeaths: this.form.get('spaDeaths')?.value,
        status: 'pending'
      };

      if (this.isEditMode && this.formId) {
        this.formDataService.updateForm(this.formId, formData).subscribe({
          next: () => {
            this.router.navigate(['/dashboard/drug-requests']);
          },
          error: (error) => {
            console.error('Error updating form:', error);
          }
        });
      } else {
        this.formDataService.addForm(formData).subscribe({
          next: () => {
            this.router.navigate(['/dashboard/drug-requests']);
          },
          error: (error) => {
            console.error('Error submitting form:', error);
          }
        });
      }
    } else {
      this.showValidationError = true;
      this.validationService.scrollToFirstInvalidControl('multi-step-form');
    }
  }

  getCurrentStepForm(): FormGroup {
    const groupName = this.formGroups[this.currentStep];
    if (!groupName) {
      throw new Error(`No form group found for step ${this.currentStep}`);
    }
    const group = this.form.get(groupName);
    if (!group) {
      throw new Error(`Form group ${groupName} not found`);
    }
    return group as FormGroup;
  }
}