import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-drug-supply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './drug-supply.component.html',
  styleUrls: ['./drug-supply.component.css']
})
export class DrugSupplyComponent {
  seizureForm: FormGroup = {} as FormGroup;
  accusationForm: FormGroup = {} as FormGroup;
  demographicsForm: FormGroup = {} as FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForms();
  }

  private initializeForms() {
    // Seizure form
    this.seizureForm = this.fb.group({
      cannabis: ['', [Validators.required, Validators.min(0)]],
      tableauA: ['', [Validators.required, Validators.min(0)]],
      ecstasyPills: ['', [Validators.required, Validators.min(0)]],
      ecstasyPowder: ['', [Validators.required, Validators.min(0)]],
      subutex: ['', [Validators.required, Validators.min(0)]],
      cocaine: ['', [Validators.required, Validators.min(0)]],
      heroin: ['', [Validators.required, Validators.min(0)]]
    });

    // Accusation form
    this.accusationForm = this.fb.group({
      consumer: this.fb.group({
        count: ['', [Validators.required, Validators.min(0)]],
        percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
      }),
      seller: this.fb.group({
        count: ['', [Validators.required, Validators.min(0)]],
        percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
      }),
      trafficker: this.fb.group({
        count: ['', [Validators.required, Validators.min(0)]],
        percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
      })
    });

    // Demographics form
    this.demographicsForm = this.fb.group({
      gender: this.fb.group({
        male: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        female: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        })
      }),
      age: this.fb.group({
        under18: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        between18And40: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        over40: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        })
      }),
      nationality: this.fb.group({
        tunisian: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        maghrebian: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        others: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        })
      }),
      maritalStatus: this.fb.group({
        single: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        married: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        divorced: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        widowed: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        })
      }),
      employment: this.fb.group({
        student: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        worker: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        }),
        employee: this.fb.group({
          count: ['', [Validators.required, Validators.min(0)]],
          percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
        })
      })
    });
  }

  onSubmit() {
    if (this.seizureForm.valid && this.accusationForm.valid && this.demographicsForm.valid) {
      const formData = {
        seizures: this.seizureForm.value,
        accusations: this.accusationForm.value,
        demographics: this.demographicsForm.value
      };
      console.log('Form data:', formData);
      // Here you would typically send the data to your backend
    }
  }

  calculatePercentage(group: string, subgroup: string) {
    // Implementation for automatic percentage calculation
  }
}