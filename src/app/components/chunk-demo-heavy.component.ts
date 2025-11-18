import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chunk-demo-heavy',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="heavy-component">
      <h3>🎯 Heavy Component (Separate Chunk)</h3>
      <div class="status-info">
        <p><strong>Hydration Status:</strong> 
          <span [class]="isHydrated ? 'hydrated' : 'ssr'">
            {{ isHydrated ? '💧 Hydrated & Interactive' : '🏗️ SSR Only' }}
          </span>
        </p>
        <p><strong>Load Time:</strong> {{ loadTime }}</p>
        <p><strong>Estimated Chunk:</strong> ~150KB</p>
      </div>
      
      <div class="operations">
        <h4>Heavy Operations:</h4>
        <button (click)="generateLargeDataSet()" [disabled]="!isHydrated || isLoading">
          {{ isLoading && currentOperation === 'dataset' ? 'Generating...' : 'Generate Large Dataset (1000 items)' }}
        </button>
        <button (click)="performComplexCalculation()" [disabled]="!isHydrated || isLoading">
          {{ isLoading && currentOperation === 'calc' ? 'Computing...' : 'Complex Math (10K iterations)' }}
        </button>
        
        <div *ngIf="computationResult.length > 0" class="results">
          <h5>Math Results: {{ computationResult.length }} computed ({{ processingTime }}ms)</h5>
          <div class="preview">{{ computationResult.slice(0, 5) }}...</div>
        </div>
        
        <div *ngIf="largeDataSet.length > 0" class="results">
          <h5>Dataset: {{ largeDataSet.length }} items generated ({{ processingTime }}ms)</h5>
          <div class="preview">{{ largeDataSet.slice(0, 2) | json }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .heavy-component {
      border: 2px solid #ff6b6b;
      border-radius: 12px;
      padding: 20px;
      background: linear-gradient(135deg, #fff5f5, #ffe8e8);
      margin: 20px 0;
    }
    
    .status-info {
      background: rgba(255, 107, 107, 0.1);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.9em;
    }
    
    .hydrated { color: #28a745; font-weight: bold; }
    .ssr { color: #6c757d; font-weight: bold; }
    
    .operations button {
      margin: 5px 10px 5px 0;
      padding: 12px 16px;
      background: #ff6b6b;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    
    .operations button:hover:not(:disabled) {
      background: #ff5252;
      transform: translateY(-1px);
    }
    
    .operations button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    
    .results {
      margin-top: 15px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 6px;
      border-left: 4px solid #ff6b6b;
    }
    
    .preview {
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
      color: #555;
      background: #f8f9fa;
      padding: 8px;
      border-radius: 4px;
      max-height: 80px;
      overflow-y: auto;
      margin-top: 8px;
    }
  `]
})
export class ChunkDemoHeavyComponent implements OnInit, AfterViewInit {
  isLoading = false;
  currentOperation = '';
  computationResult: number[] = [];
  largeDataSet: any[] = [];
  processingTime = 0;
  isHydrated = false;
  loadTime = '';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadTime = new Date().toLocaleTimeString();
    
    if (this.isBrowser) {
      console.log('🎯 Heavy Component: Chunk loaded at', this.loadTime);
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      console.log('🎯 Heavy Component: OnInit - initializing');
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.isHydrated = true;
      console.log('🎯 Heavy Component: ✅ HYDRATED and interactive!');
    }
  }

  generateLargeDataSet() {
    if (!this.isHydrated) return;
    
    this.isLoading = true;
    this.currentOperation = 'dataset';
    const start = performance.now();
    
    // Simulate heavy data generation
    setTimeout(() => {
      this.largeDataSet = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        value: Math.random() * 1000,
        timestamp: Date.now(),
        metadata: `Heavy data item ${i}`,
        computation: i * Math.PI * Math.random()
      }));
      
      this.processingTime = Math.round(performance.now() - start);
      this.isLoading = false;
      this.currentOperation = '';
      
      console.log(`🎯 Generated ${this.largeDataSet.length} items in ${this.processingTime}ms`);
    }, 600);
  }

  performComplexCalculation() {
    if (!this.isHydrated) return;
    
    this.isLoading = true;
    this.currentOperation = 'calc';
    const start = performance.now();
    
    // Simulate complex calculation
    setTimeout(() => {
      this.computationResult = [];
      for (let i = 0; i < 10000; i++) {
        const result = Math.pow(i, 2) * Math.sin(i / 100) + Math.cos(i * Math.PI / 180);
        this.computationResult.push(Math.round(result * 1000) / 1000);
      }
      
      this.processingTime = Math.round(performance.now() - start);
      this.isLoading = false;
      this.currentOperation = '';
      
      console.log(`🎯 Computed ${this.computationResult.length} results in ${this.processingTime}ms`);
    }, 800);
  }
}