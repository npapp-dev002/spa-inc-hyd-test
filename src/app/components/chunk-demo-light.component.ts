import { Component, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-chunk-demo-light',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="light-component">
      <h3>🪶 Light Component (Main Bundle)</h3>
      <div class="status-info">
        <p><strong>Hydration Status:</strong> 
          <span [class]="isHydrated ? 'hydrated' : 'ssr'">
            {{ isHydrated ? '💧 Hydrated & Interactive' : '🏗️ SSR Only' }}
          </span>
        </p>
        <p><strong>Load Time:</strong> {{ loadTime }}</p>
        <p><strong>Bundle:</strong> Main chunk (immediate load)</p>
      </div>
      
      <div class="simple-operations">
        <h4>Light Operations:</h4>
        <button (click)="incrementCounter()" [disabled]="!isHydrated">
          Counter: {{ counter }} {{ !isHydrated ? '(Not interactive)' : '' }}
        </button>
        <button (click)="addMessage()" [disabled]="!isHydrated">
          Add Message
        </button>
        
        <div *ngIf="messages.length > 0" class="messages">
          <h5>Messages ({{ messages.length }}):</h5>
          <ul>
            <li *ngFor="let message of messages">{{ message }}</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .light-component {
      border: 2px solid #28a745;
      border-radius: 12px;
      padding: 20px;
      background: linear-gradient(135deg, #f8fff8, #e8f5e8);
      margin: 20px 0;
    }
    
    .status-info {
      background: rgba(40, 167, 69, 0.1);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.9em;
    }
    
    .hydrated { color: #28a745; font-weight: bold; }
    .ssr { color: #6c757d; font-weight: bold; }
    
    .simple-operations button {
      margin: 5px 10px 5px 0;
      padding: 12px 16px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    
    .simple-operations button:hover:not(:disabled) {
      background: #218838;
      transform: translateY(-1px);
    }
    
    .simple-operations button:disabled {
      background: #ccc;
      cursor: not-allowed;
      transform: none;
    }
    
    .messages {
      margin-top: 15px;
      padding: 12px;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 6px;
      border-left: 4px solid #28a745;
    }
    
    .messages ul {
      margin: 8px 0 0 0;
      padding-left: 20px;
    }
    
    .messages li {
      margin: 4px 0;
      color: #333;
    }
  `]
})
export class ChunkDemoLightComponent implements OnInit, AfterViewInit {
  counter = 0;
  messages: string[] = [];
  isHydrated = false;
  loadTime = '';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadTime = new Date().toLocaleTimeString();
    
    if (this.isBrowser) {
      console.log('🪶 Light Component: Loaded in main bundle at', this.loadTime);
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      console.log('🪶 Light Component: OnInit - initializing');
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.isHydrated = true;
      console.log('🪶 Light Component: ✅ HYDRATED and interactive!');
    }
  }

  incrementCounter() {
    if (!this.isHydrated) return;
    this.counter++;
    console.log(`🪶 Counter incremented to: ${this.counter}`);
  }

  addMessage() {
    if (!this.isHydrated) return;
    const timestamp = new Date().toLocaleTimeString();
    this.messages.push(`Message ${this.messages.length + 1} at ${timestamp}`);
    console.log(`🪶 Added message: ${this.messages[this.messages.length - 1]}`);
  }
}