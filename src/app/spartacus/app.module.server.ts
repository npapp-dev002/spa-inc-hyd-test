import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';
import { provideClientHydration, withIncrementalHydration, withNoHttpTransferCache } from '@angular/platform-browser';
import { AppComponent } from '../app.component';
import { AppModule } from '../app.module';
import { provideServer } from '@spartacus/setup/ssr';

@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
  providers: [
    provideClientHydration(withIncrementalHydration(), withNoHttpTransferCache()),
    ...provideServer({
       serverRequestOrigin: process.env['SERVER_REQUEST_ORIGIN'],
     }),
  ],
})
export class AppServerModule {}
