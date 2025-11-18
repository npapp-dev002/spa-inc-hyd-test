import { platformBrowser } from '@angular/platform-browser';
import { enableProdMode } from '@angular/core';
import { AppModule } from './app/app.module';

// Enable production mode based on environment
if (typeof window !== 'undefined' && (window as any)['__PRODUCTION__'] || 
    (typeof process !== 'undefined' && process.env['NODE_ENV'] === 'production')) {
  enableProdMode();
}

platformBrowser().bootstrapModule(AppModule, {
  ngZoneEventCoalescing: true,
})
  .catch(err => console.error(err));
