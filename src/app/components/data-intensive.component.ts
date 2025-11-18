import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface DataPoint {
  id: number;
  value: number;
  label: string;
  timestamp: Date;
}

@Component({
  selector: 'app-data-intensive',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="data-intensive-component">
      <div class="component-header">
        <h3>📊 Data-Intensive Analytics Component</h3>
        <span class="badge" [class.hydrated]="isHydrated">
          {{ isHydrated ? '💧 Hydrated' : '🏗️ SSR Only' }}
        </span>
      </div>

      <div class="load-info">
        <p><strong>Bundle Size:</strong> ~150KB (simulated heavy component)</p>
        <p><strong>Hydration Time:</strong> {{ hydrationTime }}ms</p>
        <p><strong>Status:</strong> {{ status }}</p>
      </div>

      <div class="data-visualization">
        <h4>Real-time Data Processing</h4>
        <div class="chart-container">
          <div *ngFor="let point of dataPoints; trackBy: trackById" 
               class="data-bar"
               [style.height.%]="point.value"
               [class.animated]="isHydrated">
            <span class="bar-label">{{ point.label }}</span>
            <span class="bar-value">{{ point.value }}%</span>
          </div>
        </div>
      </div>

      <div class="interactive-controls" *ngIf="isHydrated">
        <button (click)="generateNewData()" class="btn-primary">
          🔄 Generate New Data
        </button>
        <button (click)="sortData()" class="btn-secondary">
          📈 Sort Data
        </button>
        <button (click)="exportData()" class="btn-info">
          💾 Export Data
        </button>
      </div>

      <div class="ssr-note" *ngIf="!isHydrated">
        <p>⚠️ Component rendered on server. Click to hydrate and enable interactions.</p>
      </div>

      <div class="performance-stats">
        <div class="stat">
          <span class="stat-label">Data Points:</span>
          <span class="stat-value">{{ dataPoints.length }}</span>
        </div>
        <div class="stat">
          <span class="stat-label">Processing Speed:</span>
          <span class="stat-value">{{ processingSpeed }}ms</span>
        </div>
        <div class="stat">
          <span class="stat-label">Memory Usage:</span>
          <span class="stat-value">{{ memoryUsage }}MB</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .data-intensive-component {
      border: 3px solid #6610f2;
      border-radius: 12px;
      padding: 25px;
      margin: 20px 0;
      background: linear-gradient(135deg, #f8f9ff 0%, #e9ecff 100%);
      box-shadow: 0 4px 6px rgba(102, 16, 242, 0.1);
    }

    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #6610f2;
    }

    .component-header h3 {
      margin: 0;
      color: #6610f2;
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
      animation: pulse 2s infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.7; }
    }

    .load-info {
      background: rgba(255, 255, 255, 0.6);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .load-info p {
      margin: 5px 0;
      font-size: 0.95em;
    }

    .data-visualization {
      background: white;
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .data-visualization h4 {
      margin-top: 0;
      color: #495057;
    }

    .chart-container {
      display: flex;
      gap: 10px;
      height: 200px;
      align-items: flex-end;
      padding: 20px 0;
      border-bottom: 2px solid #dee2e6;
    }

    .data-bar {
      flex: 1;
      background: linear-gradient(to top, #6610f2, #9775fa);
      border-radius: 4px 4px 0 0;
      position: relative;
      min-height: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 8px 4px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .data-bar.animated:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 8px rgba(102, 16, 242, 0.3);
    }

    .bar-label {
      font-size: 0.75em;
      color: white;
      font-weight: bold;
      margin-bottom: 4px;
    }

    .bar-value {
      font-size: 0.85em;
      color: white;
      font-weight: bold;
    }

    .interactive-controls {
      display: flex;
      gap: 10px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }

    .interactive-controls button {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background: #6610f2;
      color: white;
    }

    .btn-primary:hover {
      background: #5a0dd6;
      transform: translateY(-2px);
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .btn-info {
      background: #17a2b8;
      color: white;
    }

    .btn-info:hover {
      background: #138496;
    }

    .ssr-note {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 20px;
      text-align: center;
    }

    .ssr-note p {
      margin: 0;
      color: #856404;
      font-weight: bold;
    }

    .performance-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
    }

    .stat {
      background: rgba(255, 255, 255, 0.8);
      padding: 15px;
      border-radius: 8px;
      text-align: center;
    }

    .stat-label {
      display: block;
      font-size: 0.85em;
      color: #6c757d;
      margin-bottom: 5px;
    }

    .stat-value {
      display: block;
      font-size: 1.5em;
      font-weight: bold;
      color: #6610f2;
    }
  `]
})
export class DataIntensiveComponent implements OnInit {
  isHydrated = false;
  hydrationTime = 0;
  status = 'Server-side rendered';
  dataPoints: DataPoint[] = [];
  processingSpeed = 0;
  memoryUsage = 0;
  private hydrationStart = 0;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    this.hydrationStart = performance.now();
    this.generateInitialData();
    
    if (isPlatformBrowser(this.platformId)) {
      // Simulate hydration delay for heavy component
      setTimeout(() => {
        this.isHydrated = true;
        this.hydrationTime = Math.round(performance.now() - this.hydrationStart);
        this.status = 'Fully hydrated and interactive';
        this.processingSpeed = Math.round(Math.random() * 100 + 50);
        this.memoryUsage = Math.round(Math.random() * 10 + 5);
        console.log(`📊 Data-Intensive Component hydrated in ${this.hydrationTime}ms`);
      }, 100);
    }
  }

  private generateInitialData() {
    this.dataPoints = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      value: Math.random() * 80 + 20,
      label: `D${i + 1}`,
      timestamp: new Date()
    }));
  }

  generateNewData() {
    const start = performance.now();
    this.dataPoints = this.dataPoints.map(point => ({
      ...point,
      value: Math.random() * 80 + 20,
      timestamp: new Date()
    }));
    this.processingSpeed = Math.round(performance.now() - start);
    console.log('🔄 Generated new data');
  }

  sortData() {
    this.dataPoints.sort((a, b) => b.value - a.value);
    console.log('📈 Data sorted');
  }

  exportData() {
    const dataStr = JSON.stringify(this.dataPoints, null, 2);
    console.log('💾 Exported data:', dataStr);
    alert('Data exported to console!');
  }

  trackById(index: number, item: DataPoint): number {
    return item.id;
  }
}
