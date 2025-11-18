import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule, provideClientHydration, withIncrementalHydration, withNoHttpTransferCache } from '@angular/platform-browser';

import { provideHttpClient, withFetch, withInterceptorsFromDi } from "@angular/common/http";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";
import { AppRoutingModule } from "@spartacus/storefront";
import { AppComponent } from './app.component';
import { SpartacusModule } from './spartacus/spartacus.module';
import { MyProjectComponent } from './my-project/my-project.component';
import { ChildComponentComponent } from './my-project/child-component/child-component.component';
@NgModule({
  declarations: [
    AppComponent,
    MyProjectComponent,
    ChildComponentComponent
  ],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),
    AppRoutingModule,
    EffectsModule.forRoot([]),
    SpartacusModule
  ],
  providers: [provideHttpClient(withFetch(), withInterceptorsFromDi()), provideClientHydration(withIncrementalHydration(), withNoHttpTransferCache())],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

