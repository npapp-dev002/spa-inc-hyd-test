import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-media-player',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="media-player-component">
      <div class="component-header">
        <h3>🎬 Media Player Component</h3>
        <span class="badge" [class.hydrated]="isHydrated">
          {{ isHydrated ? '💧 Ready to Play' : '🏗️ Loading...' }}
        </span>
      </div>

      <div class="player-info">
        <p><strong>Bundle Size:</strong> ~200KB (media controls + codecs)</p>
        <p><strong>Hydration Strategy:</strong> On Timer (5 seconds)</p>
        <p><strong>Hydration Time:</strong> {{ hydrationTime }}ms</p>
      </div>

      <div class="player-container">
        <div class="video-placeholder">
          <div class="play-icon" [class.active]="isHydrated">
            {{ isHydrated ? '▶️' : '⏸️' }}
          </div>
          <p class="video-title">Sample Video Content</p>
        </div>

        <div class="timeline" [class.interactive]="isHydrated">
          <div class="progress-bar" [style.width.%]="progress"></div>
          <div class="time-info">
            <span>{{ formatTime(currentTime) }}</span>
            <span>{{ formatTime(duration) }}</span>
          </div>
        </div>

        <div class="player-controls">
          <button 
            (click)="togglePlay()" 
            [disabled]="!isHydrated"
            class="control-btn">
            {{ isPlaying ? '⏸️ Pause' : '▶️ Play' }}
          </button>
          <button 
            (click)="rewind()" 
            [disabled]="!isHydrated"
            class="control-btn">
            ⏪ Rewind
          </button>
          <button 
            (click)="forward()" 
            [disabled]="!isHydrated"
            class="control-btn">
            ⏩ Forward
          </button>
          <button 
            (click)="changeVolume()" 
            [disabled]="!isHydrated"
            class="control-btn">
            🔊 Volume: {{ volume }}%
          </button>
        </div>
      </div>

      <div class="player-features">
        <h4>Features Loaded After Hydration:</h4>
        <ul>
          <li [class.enabled]="isHydrated">✓ Playback controls</li>
          <li [class.enabled]="isHydrated">✓ Timeline scrubbing</li>
          <li [class.enabled]="isHydrated">✓ Volume control</li>
          <li [class.enabled]="isHydrated">✓ Fullscreen mode</li>
          <li [class.enabled]="isHydrated">✓ Keyboard shortcuts</li>
        </ul>
      </div>

      <div class="timer-notice" *ngIf="!isHydrated">
        <p>⏰ This component will auto-hydrate after 5 seconds...</p>
        <div class="countdown">{{ countdown }}s remaining</div>
      </div>

      <div class="player-stats">
        <div class="stat">
          <span class="label">Buffer Status:</span>
          <span class="value">{{ bufferStatus }}%</span>
        </div>
        <div class="stat">
          <span class="label">Quality:</span>
          <span class="value">{{ quality }}</span>
        </div>
        <div class="stat">
          <span class="label">FPS:</span>
          <span class="value">{{ fps }}</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .media-player-component {
      border: 3px solid #e83e8c;
      border-radius: 12px;
      padding: 25px;
      margin: 20px 0;
      background: linear-gradient(135deg, #fff0f6 0%, #ffe0ef 100%);
      box-shadow: 0 4px 6px rgba(232, 62, 140, 0.1);
    }

    .component-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 2px solid #e83e8c;
    }

    .component-header h3 {
      margin: 0;
      color: #e83e8c;
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
      animation: glow 2s ease-in-out infinite;
    }

    @keyframes glow {
      0%, 100% { box-shadow: 0 0 5px rgba(40, 167, 69, 0.5); }
      50% { box-shadow: 0 0 20px rgba(40, 167, 69, 0.8); }
    }

    .player-info {
      background: rgba(255, 255, 255, 0.7);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .player-info p {
      margin: 5px 0;
      font-size: 0.95em;
    }

    .player-container {
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 20px;
    }

    .video-placeholder {
      aspect-ratio: 16/9;
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .play-icon {
      font-size: 4em;
      margin-bottom: 10px;
      opacity: 0.5;
      transition: all 0.3s ease;
    }

    .play-icon.active {
      opacity: 1;
      animation: bounce 2s ease-in-out infinite;
    }

    @keyframes bounce {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.1); }
    }

    .video-title {
      color: white;
      font-size: 1.2em;
      margin: 0;
    }

    .timeline {
      background: #333;
      padding: 10px;
      position: relative;
    }

    .timeline.interactive {
      cursor: pointer;
    }

    .progress-bar {
      height: 4px;
      background: #e83e8c;
      border-radius: 2px;
      transition: width 0.3s ease;
    }

    .time-info {
      display: flex;
      justify-content: space-between;
      margin-top: 5px;
      color: #999;
      font-size: 0.85em;
    }

    .player-controls {
      background: #1a1a1a;
      padding: 15px;
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .control-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 6px;
      background: #e83e8c;
      color: white;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .control-btn:hover:not(:disabled) {
      background: #d62877;
      transform: translateY(-2px);
    }

    .control-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      opacity: 0.5;
    }

    .player-features {
      background: rgba(255, 255, 255, 0.8);
      padding: 20px;
      border-radius: 8px;
      margin-bottom: 20px;
    }

    .player-features h4 {
      margin-top: 0;
      color: #495057;
    }

    .player-features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .player-features li {
      padding: 8px 0;
      color: #6c757d;
      transition: all 0.3s ease;
    }

    .player-features li.enabled {
      color: #28a745;
      font-weight: bold;
    }

    .timer-notice {
      background: #fff3cd;
      border: 1px solid #ffc107;
      padding: 15px;
      border-radius: 6px;
      text-align: center;
      margin-bottom: 20px;
    }

    .timer-notice p {
      margin: 0 0 10px 0;
      color: #856404;
      font-weight: bold;
    }

    .countdown {
      font-size: 2em;
      font-weight: bold;
      color: #e83e8c;
      animation: pulse 1s ease-in-out infinite;
    }

    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }

    .player-stats {
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
      color: #e83e8c;
    }
  `]
})
export class MediaPlayerComponent implements OnInit {
  isHydrated = false;
  hydrationTime = 0;
  isPlaying = false;
  currentTime = 0;
  duration = 180;
  progress = 0;
  volume = 75;
  bufferStatus = 0;
  quality = 'HD';
  fps = 60;
  countdown = 5;
  private intervalId: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    const start = performance.now();
    
    if (isPlatformBrowser(this.platformId)) {
      // Countdown timer
      const countdownInterval = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) {
          clearInterval(countdownInterval);
        }
      }, 1000);

      // Hydrate after 5 seconds
      setTimeout(() => {
        this.isHydrated = true;
        this.hydrationTime = Math.round(performance.now() - start);
        this.bufferStatus = 100;
        console.log(`🎬 Media Player hydrated in ${this.hydrationTime}ms`);
      }, 5000);
    }
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    
    if (this.isPlaying) {
      this.intervalId = setInterval(() => {
        this.currentTime++;
        this.progress = (this.currentTime / this.duration) * 100;
        if (this.currentTime >= this.duration) {
          this.isPlaying = false;
          this.currentTime = 0;
          this.progress = 0;
          clearInterval(this.intervalId);
        }
      }, 1000);
      console.log('▶️ Playing');
    } else {
      clearInterval(this.intervalId);
      console.log('⏸️ Paused');
    }
  }

  rewind() {
    this.currentTime = Math.max(0, this.currentTime - 10);
    this.progress = (this.currentTime / this.duration) * 100;
    console.log('⏪ Rewound 10 seconds');
  }

  forward() {
    this.currentTime = Math.min(this.duration, this.currentTime + 10);
    this.progress = (this.currentTime / this.duration) * 100;
    console.log('⏩ Forwarded 10 seconds');
  }

  changeVolume() {
    this.volume = (this.volume + 25) % 125;
    if (this.volume === 0) this.volume = 25;
    console.log(`🔊 Volume: ${this.volume}%`);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
