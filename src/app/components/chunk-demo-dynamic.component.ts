import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chunk-demo-dynamic',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dynamic-component">
      <h3>🔄 Dynamic Component (Viewport/Timer Loading)</h3>
      <div class="status-info">
        <p><strong>Hydration Status:</strong> 
          <span [class]="isHydrated ? 'hydrated' : 'ssr'">
            {{ isHydrated ? '💧 Hydrated & Interactive' : '🏗️ SSR Only' }}
          </span>
        </p>
        <p><strong>Load Time:</strong> {{ loadTime }}</p>
        <p><strong>Loading:</strong> Viewport/Timer triggered</p>
      </div>
      
      <div class="dynamic-operations">
        <h4>Dynamic Loading Simulation:</h4>
        <button (click)="simulateFeatureLoad('A')" [disabled]="!isHydrated || loading">
          {{ loadingFeatures['A'] ? 'Loading Feature A...' : 'Load Feature A' }}
        </button>
        <button (click)="simulateFeatureLoad('B')" [disabled]="!isHydrated || loading">
          {{ loadingFeatures['B'] ? 'Loading Feature B...' : 'Load Feature B' }}
        </button>
        <button (click)="simulateLibraryLoad()" [disabled]="!isHydrated || loading">
          {{ loadingLibrary ? 'Loading Heavy Library...' : 'Load Heavy Library' }}
        </button>
        
        <div *ngIf="loadedFeatures.length > 0" class="loaded-features">
          <h5>Loaded Features:</h5>
          <ul>
            <li *ngFor="let feature of loadedFeatures">
              <strong>{{ feature.name }}:</strong> {{ feature.description }} 
              <small>({{ feature.loadTime }}ms)</small>
            </li>
          </ul>
        </div>
        
        <div *ngIf="libraryData" class="library-info">
          <h5>Heavy Library Loaded:</h5>
          <div class="library-details">{{ libraryData }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dynamic-component {
      border: 2px solid #007bff;
      border-radius: 12px;
      padding: 20px;
      background: linear-gradient(135deg, #f8f9ff, #e8f0ff);
      margin: 20px 0;
    }
    
    .status-info {
      background: rgba(0, 123, 255, 0.1);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.9em;
    }
    
    .hydrated { color: #28a745; font-weight: bold; }
    .ssr { color: #6c757d; font-weight: bold; }
    
    .dynamic-operations button {
      margin: 5px 10px 5px 0;
      padding: 12px 16px;
      background: #007bff;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    
    .dynamic-operations button:hover:not(:disabled) {
      background: #0056b3;
      transform: translateY(-1px);
    }
    
    .dynamic-operations button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    
    .loaded-features, .library-info {
      margin-top: 15px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 6px;
      border-left: 4px solid #007bff;
    }
    
    .loaded-features ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }
    
    .loaded-features li {
      margin: 6px 0;
      color: #333;
    }
    
    .library-details {
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
      color: #555;
      background: #f8f9fa;
      padding: 8px;
      border-radius: 4px;
      margin-top: 8px;
    }
  `]
})
export class ChunkDemoDynamicComponent implements OnInit, AfterViewInit {
  loading = false;
  loadingFeatures: { [key: string]: boolean } = {};
  loadingLibrary = false;
  loadedFeatures: any[] = [];
  libraryData = '';
  isHydrated = false;
  loadTime = '';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadTime = new Date().toLocaleTimeString();
    
    if (this.isBrowser) {
      console.log('🔄 Dynamic Component: Loaded at', this.loadTime);
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      console.log('🔄 Dynamic Component: OnInit - initializing');
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.isHydrated = true;
      console.log('🔄 Dynamic Component: ✅ HYDRATED and interactive!');
    }
  }

  simulateFeatureLoad(featureName: string) {
    if (!this.isHydrated || this.loading) return;
    
    this.loading = true;
    this.loadingFeatures[featureName] = true;
    const start = performance.now();
    
    // Simulate dynamic import
    setTimeout(() => {
      const loadTime = Math.round(performance.now() - start);
      const feature = {
        name: `Feature ${featureName}`,
        description: `Dynamic feature ${featureName} with advanced capabilities`,
        loadTime,
        timestamp: new Date().toLocaleTimeString()
      };
      
      this.loadedFeatures.push(feature);
      this.loadingFeatures[featureName] = false;
      this.loading = false;
      
      console.log(`🔄 Loaded Feature ${featureName} in ${loadTime}ms`);
    }, Math.random() * 1000 + 500); // 500-1500ms
  }

  simulateLibraryLoad() {
    if (!this.isHydrated || this.loading) return;
    
    this.loading = true;
    this.loadingLibrary = true;
    const start = performance.now();
    
    // Simulate heavy library loading
    setTimeout(() => {
      const loadTime = Math.round(performance.now() - start);
      this.libraryData = `Heavy Library v2.1.0 loaded in ${loadTime}ms. Size: ~250KB. Features: Advanced Analytics, Machine Learning, Data Visualization, Real-time Processing`;
      this.loadingLibrary = false;
      this.loading = false;
      
      console.log(`🔄 Heavy library loaded in ${loadTime}ms`);
    }, Math.random() * 2000 + 1000); // 1000-3000ms
  }
}