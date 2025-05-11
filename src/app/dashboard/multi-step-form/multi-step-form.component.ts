import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { FormsService } from './forms.service';
import { FormValidationService } from './form-validation-service';
import {StepIndicatorComponent} from "./step-indicator/step-indicator.component";
import {Step1Component} from "./steps/step1/step1.component";
import {Step2Component} from "./steps/step2/step2.component";
import {Step3Component} from "./steps/step3/step3.component";
import {Step4Component} from "./steps/step4/step4.component";
import {Step5Component} from "./steps/step5/step5.component";
import {Step6Component} from "./steps/step6/step6.component";
import {NgIf} from "@angular/common";

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
  ]
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

  // Form validity tracker for each step
  stepFormsValid: Record<number, boolean> = {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false
  };

  // Map step numbers to form group names
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
      private validationService: FormValidationService
  ) {}

  ngOnInit() {
    this.form = this.formsService.getFormGroup();
    this.updateProgress();
    this.setupFormValidationSubscriptions();
  }

  setupFormValidationSubscriptions() {
    Object.entries(this.formGroups).forEach(([step, groupName]) => {
      const group = this.form.get(groupName);
      if (group) {
        group.valueChanges.subscribe(() => {
          const stepNumber = parseInt(step);
          this.stepFormsValid[stepNumber] = group.valid;
          this.steps[stepNumber - 1].valid = group.valid;
        });
      }
    });
  }

  goToStep(step: number) {
    const currentForm = this.getCurrentStepForm();
    if (step < this.currentStep) {
      this.currentStep = step;
      this.updateProgress();
    } else {
      this.validationService.markFormGroupTouched(currentForm);
      if (currentForm.valid) {
        this.currentStep = step;
        this.updateProgress();
      } else {
        this.validationService.scrollToFirstInvalidControl('multi-step-form');
      }
    }
  }

  nextStep() {
    const currentForm = this.getCurrentStepForm();
     this.validationService.markFormGroupTouched(currentForm);
    console.log('Form submitted!', this.form.value);

    if (currentForm.valid) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
        this.updateProgress();
      }
    } else {
      this.validationService.scrollToFirstInvalidControl('multi-step-form');
    }
  }

  prevStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.updateProgress();
    }
  }

  updateProgress() {
    this.progressPercentage = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
  }

  submitForm() {
    const currentForm = this.getCurrentStepForm();
    this.validationService.markFormGroupTouched(currentForm);

    if (currentForm.valid) {
      console.log('Form submitted!', this.form.value);
      // Implement your form submission logic here
    } else {
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
