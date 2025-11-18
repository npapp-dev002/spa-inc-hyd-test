import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FormData {
  name: string;
  email: string;
  preference: string;
  newsletter: boolean;
}

@Component({
  selector: 'app-form-wizard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-wizard-component">
      <div class="component-header">
        <h3>📝 Interactive Form Wizard</h3>
        <span class="badge" [class.hydrated]="isHydrated">
          {{ isHydrated ? '💧 Interactive' : '🏗️ Static' }}
        </span>
      </div>

      <div class="wizard-info">
        <p><strong>Chunk Size:</strong> ~80KB (form validation + interactions)</p>
        <p><strong>Hydration Strategy:</strong> On Viewport</p>
        <p><strong>Load Time:</strong> {{ loadTime }}ms</p>
      </div>

      <div class="wizard-steps">
        <div class="step" [class.active]="currentStep === 1" [class.completed]="currentStep > 1">
          <span class="step-number">1</span>
          <span class="step-label">Personal Info</span>
        </div>
        <div class="step" [class.active]="currentStep === 2" [class.completed]="currentStep > 2">
          <span class="step-number">2</span>
          <span class="step-label">Preferences</span>
        </div>
        <div class="step" [class.active]="currentStep === 3">
          <span class="step-number">3</span>
          <span class="step-label">Confirmation</span>
        </div>
      </div>

      <div class="form-content">
        <div *ngIf="currentStep === 1" class="form-step">
          <h4>Step 1: Personal Information</h4>
          <div class="form-group">
            <label>Name:</label>
            <input 
              type="text" 
              [(ngModel)]="formData.name" 
              [disabled]="!isHydrated"
              placeholder="Enter your name">
          </div>
          <div class="form-group">
            <label>Email:</label>
            <input 
              type="email" 
              [(ngModel)]="formData.email" 
              [disabled]="!isHydrated"
              placeholder="Enter your email">
          </div>
        </div>

        <div *ngIf="currentStep === 2" class="form-step">
          <h4>Step 2: Preferences</h4>
          <div class="form-group">
            <label>Preference:</label>
            <select [(ngModel)]="formData.preference" [disabled]="!isHydrated">
              <option value="">Select...</option>
              <option value="daily">Daily Updates</option>
              <option value="weekly">Weekly Digest</option>
              <option value="monthly">Monthly Summary</option>
            </select>
          </div>
          <div class="form-group checkbox">
            <label>
              <input 
                type="checkbox" 
                [(ngModel)]="formData.newsletter" 
                [disabled]="!isHydrated">
              Subscribe to newsletter
            </label>
          </div>
        </div>

        <div *ngIf="currentStep === 3" class="form-step">
          <h4>Step 3: Confirmation</h4>
          <div class="summary">
            <p><strong>Name:</strong> {{ formData.name || 'Not provided' }}</p>
            <p><strong>Email:</strong> {{ formData.email || 'Not provided' }}</p>
            <p><strong>Preference:</strong> {{ formData.preference || 'Not selected' }}</p>
            <p><strong>Newsletter:</strong> {{ formData.newsletter ? 'Yes' : 'No' }}</p>
          </div>
        </div>
      </div>

      <div class="wizard-actions">
        <button 
          (click)="previousStep()" 
          [disabled]="!isHydrated || currentStep === 1"
          class="btn-secondary">
          ← Previous
        </button>
        <button 
          (click)="nextStep()" 
          [disabled]="!isHydrated || currentStep === 3"
          class="btn-primary">
          Next →
        </button>
        <button 
          *ngIf="currentStep === 3"
          (click)="submit()" 
          [disabled]="!isHydrated"
          class="btn-success">
          ✓ Submit
        </button>
      </div>

      <div class="hydration-notice" *ngIf="!isHydrated">
        <p>⚠️ Form is not interactive yet. Scroll to this area to trigger hydration.</p>
      </div>

      <div class="component-stats">
        <div class="stat">
          <span class="label">Interactions:</span>
          <span class="value">{{ interactionCount }}</span>
        </div>
        <div class="stat">
          <span class="label">Validation Runs:</span>
          <span class="value">{{ validationCount }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .form-wizard-component {
      border: 3px solid #20c997;
      border-radius: 12px;
      padding: 25px;
      margin: 20px 0;
      background: linear-gradient(135deg, #f0fff8 0%, #d4f4e8 100%);
      box-shadow: 0 4px 6px rgba(32, 201, 151, 0.1);
    }

    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #20c997;
    }

    .component-header h3 {
      margin: 0;
      color: #20c997;
    }

    .badge {
      padding: 8px 16px;
      border-radius: 20px;
      font-weight: bold;
      font-size: 0.9em;
      background: #e9ecef;
      color: #6c757d;
    }

    .badge.hydrated {
      background: #d4edda;
      color: #155724;
    }

    .wizard-info {
      background: rgba(255, 255, 255, 0.7);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .wizard-info p {
      margin: 5px 0;
      font-size: 0.95em;
    }

    .wizard-steps {
      display: flex;
      justify-content: space-between;
      margin-bottom: 30px;
      position: relative;
    }

    .wizard-steps::before {
      content: '';
      position: absolute;
      top: 20px;
      left: 10%;
      right: 10%;
      height: 2px;
      background: #dee2e6;
      z-index: 0;
    }

    .step {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      position: relative;
      z-index: 1;
    }

    .step-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #e9ecef;
      color: #6c757d;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      transition: all 0.3s ease;
    }

    .step.active .step-number {
      background: #20c997;
      color: white;
      transform: scale(1.1);
    }

    .step.completed .step-number {
      background: #28a745;
      color: white;
    }

    .step-label {
      font-size: 0.85em;
      font-weight: 500;
      color: #6c757d;
    }

    .step.active .step-label {
      color: #20c997;
      font-weight: bold;
    }

    .form-content {
      background: white;
      padding: 25px;
      border-radius: 8px;
      margin-bottom: 20px;
      min-height: 200px;
    }

    .form-step h4 {
      margin-top: 0;
      color: #495057;
      margin-bottom: 20px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      font-weight: 500;
      margin-bottom: 8px;
      color: #495057;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 10px;
      border: 2px solid #dee2e6;
      border-radius: 6px;
      font-size: 1em;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #20c997;
    }

    .form-group input:disabled,
    .form-group select:disabled {
      background: #e9ecef;
      cursor: not-allowed;
    }

    .form-group.checkbox label {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .form-group.checkbox input {
      width: auto;
    }

    .summary {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 6px;
    }

    .summary p {
      margin: 10px 0;
      font-size: 1em;
    }

    .wizard-actions {
      display: flex;
      gap: 10px;
      justify-content: center;
      margin-bottom: 20px;
    }

    .wizard-actions button {
      padding: 12px 24px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .wizard-actions button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-primary {
      background: #20c997;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #1ba87a;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover:not(:disabled) {
      background: #5a6268;
    }

    .btn-success {
      background: #28a745;
      color: white;
    }

    .btn-success:hover:not(:disabled) {
      background: #218838;
      transform: scale(1.05);
    }

    .hydration-notice {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 20px;
    }

    .hydration-notice p {
      margin: 0;
      color: #856404;
      font-weight: bold;
    }

    .component-stats {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
    }

    .stat {
      background: rgba(255, 255, 255, 0.8);
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }

    .stat .label {
      display: block;
      font-size: 0.85em;
      color: #6c757d;
      margin-bottom: 5px;
    }

    .stat .value {
      display: block;
      font-size: 1.5em;
      font-weight: bold;
      color: #20c997;
    }
  `]
})
export class FormWizardComponent implements OnInit {
  isHydrated = false;
  loadTime = 0;
  currentStep = 1;
  interactionCount = 0;
  validationCount = 0;
  
  formData: FormData = {
    name: '',
    email: '',
    preference: '',
    newsletter: false
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    const start = performance.now();
    
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.isHydrated = true;
        this.loadTime = Math.round(performance.now() - start);
        console.log(`📝 Form Wizard hydrated in ${this.loadTime}ms`);
      }, 50);
    }
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
      this.interactionCount++;
      this.validationCount++;
      console.log(`Moving to step ${this.currentStep}`);
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
      this.interactionCount++;
      console.log(`Moving back to step ${this.currentStep}`);
    }
  }

  submit() {
    this.interactionCount++;
    console.log('Form submitted:', this.formData);
    alert('Form submitted successfully! Check console for data.');
  }
}
