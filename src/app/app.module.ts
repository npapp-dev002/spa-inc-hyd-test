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
import { LazyLoadDirective } from './directives/lazy-load.directive';
import { CustomCartComponent } from './components/custom-cart.component';
import { ChunkDemoHeavyComponent } from './components/chunk-demo-heavy.component';
import { ChunkDemoLightComponent } from './components/chunk-demo-light.component';
import { DataIntensiveComponent } from './components/data-intensive.component';
import { MediaPlayerComponent } from './components/media-player.component';
import { FormWizardComponent } from './components/form-wizard.component';
@NgModule({
  declarations: [
    AppComponent,
    MyProjectComponent,
    ChildComponentComponent,
  ],
  imports: [
    CustomCartComponent,
    ChunkDemoHeavyComponent,
    ChunkDemoLightComponent,
    DataIntensiveComponent,
    MediaPlayerComponent,
    FormWizardComponent,
    BrowserModule,
    LazyLoadDirective,
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

