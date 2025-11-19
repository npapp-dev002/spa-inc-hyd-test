import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface ChunkInfo {
  name: string;
  size: string;
  status: 'loaded' | 'loading' | 'not-loaded';
}

interface PerformanceMetrics {
  totalScripts: number;
  chunkScripts: number;
  loadTime: number;
  bundleSize: string;
  chunks: ChunkInfo[];
}

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'test-spartacus-hyd123';
  activeDemo = 'chunks';
  isBrowser: boolean;
  
  performanceMetrics: PerformanceMetrics = {
    totalScripts: 0,
    chunkScripts: 0,
    loadTime: 0,
    bundleSize: 'Calculating...',
    chunks: []
  };

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Initial performance analysis
      setTimeout(() => {
        this.analyzePerformance();
      }, 1000);
    }
  }

  analyzePerformance() {
    if (!this.isBrowser) {
      console.log('Performance analysis only available in browser');
      return;
    }

    console.group('📊 Performance Analysis');
    
    // Analyze scripts
    const scripts = Array.from(document.scripts);
    const chunkScripts = scripts.filter(script => 
      script.src && (script.src.includes('chunk-') || script.src.includes('main-') || script.src.includes('polyfills-'))
    );

    // Get performance timing
    const navigationTiming = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const loadTime = navigationTiming ? navigationTiming.loadEventEnd - navigationTiming.fetchStart : 0;

    // Analyze resource loading
    const resourceEntries = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    const jsResources = resourceEntries.filter(entry => 
      entry.name.endsWith('.js') && (entry.name.includes('chunk-') || entry.name.includes('main-') || entry.name.includes('polyfills-'))
    );

    // Calculate total bundle size (approximation)
    let totalSize = 0;
    const chunks: ChunkInfo[] = jsResources.map(resource => {
      const name = resource.name.split('/').pop() || 'unknown';
      const size = resource.transferSize ? `${Math.round(resource.transferSize / 1024)}KB` : 'Unknown';
      const sizeNum = resource.transferSize || 0;
      totalSize += sizeNum;
      
      return {
        name: name.replace(/\?.*$/, ''), // Remove query parameters
        size,
        status: 'loaded' as const
      };
    });

    this.performanceMetrics = {
      totalScripts: scripts.length,
      chunkScripts: chunkScripts.length,
      loadTime: Math.round(loadTime),
      bundleSize: `${Math.round(totalSize / 1024)}KB`,
      chunks
    };

    console.log('Scripts found:', scripts.length);
    console.log('Chunk scripts:', chunkScripts.length);
    console.log('Load time:', loadTime + 'ms');
    console.log('JS Resources:', jsResources);
    console.log('Chunks analysis:', chunks);
    console.groupEnd();
  }
}
