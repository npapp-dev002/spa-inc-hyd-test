import { Directive, Input, ViewContainerRef, ComponentRef, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

type TriggerType = 'interaction' | 'viewport' | 'timer';

@Directive({
  selector: '[appLazyLoad]',
  standalone: true
})
export class LazyLoadDirective implements OnInit {
  @Input() appLazyLoad!: () => Promise<any>;
  @Input() trigger: TriggerType = 'interaction';
  @Input() timerDelay: number = 3000;
  
  private componentRef?: ComponentRef<any>;
  private isBrowser: boolean;

  constructor(
    private viewContainer: ViewContainerRef,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (!this.isBrowser) {
      return; // Don't load on server
    }

    switch (this.trigger) {
      case 'interaction':
        this.setupInteractionTrigger();
        break;
      case 'viewport':
        this.setupViewportTrigger();
        break;
      case 'timer':
        this.setupTimerTrigger();
        break;
    }
  }

  private setupInteractionTrigger() {
    const element = this.viewContainer.element.nativeElement.parentElement;
    const handler = () => {
      this.loadComponent();
      element.removeEventListener('click', handler);
    };
    element.addEventListener('click', handler);
  }

  private setupViewportTrigger() {
    const element = this.viewContainer.element.nativeElement.parentElement;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.loadComponent();
        observer.disconnect();
      }
    });
    observer.observe(element);
  }

  private setupTimerTrigger() {
    setTimeout(() => {
      this.loadComponent();
    }, this.timerDelay);
  }

  private async loadComponent() {
    console.log('[LazyLoad] Loading component...', this.trigger);
    const componentModule = await this.appLazyLoad();
    const componentType = Object.values(componentModule)[0] as any;
    this.componentRef = this.viewContainer.createComponent(componentType);
    console.log('[LazyLoad] Component loaded successfully');
  }
}
