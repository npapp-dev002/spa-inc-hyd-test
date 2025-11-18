import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-my-project',
  standalone: false,
  templateUrl: './my-project.component.html',
  styleUrl: './my-project.component.scss'
})
export class MyProjectComponent implements OnInit, OnDestroy, AfterViewInit {
  clickCount = 0;
  currentTime = '';
  hydratedAt = '';
  isHydrated = false;
  isBrowser: boolean;
  private timeInterval?: any;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    const startTime = performance.now();
    
    console.group('🚀 INCREMENTAL HYDRATION TEST - Component Constructor');
    console.log('Component constructor called at:', new Date().toISOString());
    console.log('Performance mark:', startTime);
    console.log('Environment:', this.isBrowser ? 'Browser (Client-side)' : 'Server (SSR)');
    console.groupEnd();
  }

  ngOnInit() {
    const initTime = performance.now();
    
    if (this.isBrowser) {
      console.group('🔥 INCREMENTAL HYDRATION TEST - Client-side ngOnInit');
      console.log('Component ngOnInit called on CLIENT at:', new Date().toISOString());
      console.log('Performance mark:', initTime);
      console.log('This is when the component becomes interactive (HYDRATED)!');
      console.log('Bundle loading info:', this.getBundleInfo());
      console.groupEnd();
      
      this.isHydrated = true;
      this.hydratedAt = new Date().toLocaleTimeString();
    } else {
      console.group('🏭 INCREMENTAL HYDRATION TEST - Server-side ngOnInit');
      console.log('Component ngOnInit called on SERVER at:', new Date().toISOString());
      console.log('Performance mark:', initTime);
      console.log('This runs during SSR - component is rendered but NOT interactive yet');
      console.log('Bundle loading info:', this.getBundleInfo());
      console.groupEnd();
    }
    
    this.updateTime();
    
    // Only start timer on client-side
    if (this.isBrowser) {
      this.timeInterval = setInterval(() => {
        this.updateTime();
      }, 1000);
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      console.log('🎆 Component AfterViewInit - Component is now fully hydrated and interactive!');
    }
  }

  ngOnDestroy() {
    console.log('🔄 My Project Component ngOnDestroy called');
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }

  onButtonClick() {
    this.clickCount++;
    console.log(`✅ Button clicked in My Project Component! Click count: ${this.clickCount}`);
    if (this.isBrowser && this.isHydrated) {
      console.log('💡 SUCCESS: Incremental hydration worked! Component was server-rendered but became interactive only when needed.');
    } else {
      console.log('⚠️ This should not happen - button clicked but component not properly hydrated!');
    }
  }

  onHoverAction() {
    console.log('🖱️ Hover action triggered - Component is responsive to user interactions');
  }

  private updateTime() {
    this.currentTime = new Date().toLocaleTimeString();
  }

  private getBundleInfo() {
    if (typeof document === 'undefined') {
      return {
        totalScripts: 0,
        chunkScripts: 0,
        chunkFiles: [],
        environment: 'SSR - document not available'
      };
    }
    
    const scripts = Array.from(document.scripts);
    const chunkScripts = scripts.filter(script => script.src && script.src.includes('chunk-'));
    return {
      totalScripts: scripts.length,
      chunkScripts: chunkScripts.length,
      chunkFiles: chunkScripts.map(script => {
        const src = script.src;
        const filename = src.split('/').pop();
        return {
          filename,
          loaded: (script as any).readyState === 'complete' || !(script as any).readyState,
          async: script.async,
          defer: script.defer
        };
      }),
      environment: 'Browser - client-side'
    };
  }

  showChunkAnalysis() {
    console.group('📈 JS CHUNK ANALYSIS');
    console.log('Current bundle info:', this.getBundleInfo());
    
    if (typeof performance !== 'undefined') {
      console.log('Performance entries:', performance.getEntriesByType('navigation'));
      const resourceEntries = performance.getEntriesByType('resource');
      console.log('Resource timing:', resourceEntries.filter(entry => entry.name.includes('chunk-')));
    } else {
      console.log('Performance API not available in this environment');
    }
    
    console.groupEnd();
  }
}
