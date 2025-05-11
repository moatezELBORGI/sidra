import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
interface Step {
  label: string;
  valid: boolean;
}

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step-indicator.component.html',
  styleUrl: './step-indicator.component.css'
})
export class StepIndicatorComponent {
  @Input() steps: Step[] = [];
  @Input() currentStep = 1;
  @Input() progressPercentage = 0;
  @Output() stepSelected = new EventEmitter<number>();

  onStepClick(stepIndex: number) {
    // Only allow clicking on previous steps or the current step
    if (stepIndex <= this.currentStep) {
      this.stepSelected.emit(stepIndex);
    } else {
      // Check if all previous steps are valid before allowing navigation
      const allPreviousStepsValid = this.steps
          .slice(0, stepIndex - 1)
          .every(step => step.valid);

      if (allPreviousStepsValid) {
        this.stepSelected.emit(stepIndex);
      } else {
        console.log('Please complete previous steps first');
        // You could add a visual notification here
      }
    }
  }
}
