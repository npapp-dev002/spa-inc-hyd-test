# Spartacus Performance Optimization Guide

## Practical Solutions for Reducing Initial Bundle Size

### 🎯 Quick Wins (Immediate 30-50% reduction)

#### 1. **Remove Unused Feature Modules**

```typescript
// src/app/spartacus/spartacus-features.module.ts
@NgModule({
  imports: [
    // ✅ Keep essential
    AuthModule.forRoot(),
    UserModule,
    ProductModule.forRoot(),

    // ❌ Remove if not used
    // AsmFeatureModule,              // -267KB (Admin features)
    // AsmCustomer360FeatureModule,   // -243KB (Customer 360)
    // OrderFeatureModule,            // -667KB (Order history)
    // CheckoutFeatureModule,         // -318KB (Checkout process)
    // CartSavedCartFeatureModule,    // -143KB (Saved carts)
    // CartQuickOrderFeatureModule,   // -116KB (Quick order)
    // CartImportExportFeatureModule, // -80KB (Cart import/export)
    // StoreFinderFeatureModule,      // Only if physical stores
    // PersonalizationFeatureModule,  // Only if using CDP
    // SmartEditFeatureModule,        // Only for CMS editing
    // ProductVariantsFeatureModule,  // Only if variant products
    // ProductImageZoomFeatureModule, // Only if zoom needed
  ]
})
```

**Potential savings: ~2.3MB** (from 6.09MB to ~3.8MB)

#### 2. **Selective Style Loading**

```scss
// src/styles.scss - Replace this:
// @import "@spartacus/styles";

// With selective imports:
@import "@spartacus/styles/scss/layout/index";
@import "@spartacus/styles/scss/components/header/index";
@import "@spartacus/styles/scss/components/navigation/index";
@import "@spartacus/styles/scss/components/product/index";

// Skip unused features:
// @import "@spartacus/styles/scss/components/asm/index";     // -150KB
// @import "@spartacus/styles/scss/components/checkout/index"; // -200KB
// @import "@spartacus/styles/scss/components/order/index";   // -100KB
```

**Potential savings: ~450KB** (from 1.22MB to ~770KB)

---

### 🚀 Advanced Optimizations

#### 3. **Custom Minimal Spartacus Module**

```typescript
// src/app/spartacus/minimal-spartacus.module.ts
@NgModule({
  imports: [
    // Only core storefront
    BaseStorefrontModule,

    // Minimal required features
    AuthModule.forRoot(),
    UserModule,
    ProductModule.forRoot(),

    // Custom lightweight cart
    CartBaseFeatureModule,
  ],
  providers: [
    // Disable unused CMS components
    provideConfig(<CmsConfig>{
      cmsComponents: {
        // Disable heavy components
        MerchandisingCarouselComponent: null,
        BundleCarouselComponent: null,
        ProductMultiDimensionalSelectorComponent: null,
      },
    }),

    // Optimize routing
    provideConfig(<RoutingConfig>{
      routing: {
        // Remove unused routes
        routes: {
          orderHistory: null,
          checkout: null,
        },
      },
    }),
  ],
})
export class MinimalSpartacusModule {}
```

#### 4. **Feature-Specific Lazy Loading**

```typescript
// src/app/app-routing.module.ts
const routes: Routes = [
  // Core routes use minimal Spartacus
  { path: "", component: HomeComponent },
  { path: "product/:id", component: ProductComponent },

  // Heavy features as lazy modules
  {
    path: "checkout",
    loadChildren: () => import("./features/checkout/checkout.module").then((m) => m.CheckoutModule),
  },
  {
    path: "my-account",
    loadChildren: () => import("./features/account/account.module").then((m) => m.AccountModule),
  },
  {
    path: "orders",
    loadChildren: () => import("./features/orders/orders.module").then((m) => m.OrdersModule),
  },
];
```

#### 5. **Progressive Component Loading**

```typescript
// src/app/components/progressive-cart.component.ts
@Component({
  template: `
    @defer (on interaction) {
    <cx-mini-cart></cx-mini-cart>
    } @placeholder {
    <button class="cart-icon">🛒 Cart</button>
    } @loading {
    <div class="cart-loading">Loading cart...</div>
    } @error {
    <div class="cart-error">Cart unavailable</div>
    }
  `,
})
export class ProgressiveCartComponent {}
```

---

### 📊 Bundle Analysis Tools

#### Setup Bundle Analyzer

```bash
npm install --save-dev webpack-bundle-analyzer

# Add to package.json scripts:
"analyze": "ng build --stats-json && npx webpack-bundle-analyzer dist/*/stats.json"
```

#### Performance Budgets

```json
// angular.json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "2mb", // Down from 6mb
      "maximumError": "3mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "6kb",
      "maximumError": "10kb"
    }
  ]
}
```

---

### 🔧 Build Optimizations

#### Enable Advanced Optimizations

```json
// angular.json
{
  "configurations": {
    "production": {
      "optimization": {
        "scripts": true,
        "styles": {
          "minify": true,
          "inlineCritical": true
        },
        "fonts": true
      },
      "outputHashing": "all",
      "sourceMap": false,
      "namedChunks": false,
      "extractLicenses": true,
      "buildOptimizer": true,
      "vendorChunk": false
    }
  }
}
```

#### Service Worker for Caching

```typescript
// src/app/app.module.ts
imports: [
  ServiceWorkerModule.register('ngsw-worker.js', {
    enabled: environment.production,
    registrationStrategy: 'registerWhenStable:30000'
  })
]

// ngsw-config.json
{
  "dataGroups": [
    {
      "name": "spartacus-chunks",
      "urls": ["/spartacus-*.js"],
      "cacheConfig": {
        "strategy": "performance",
        "maxSize": 20,
        "maxAge": "7d"
      }
    }
  ]
}
```

---

### 📈 Expected Results

| Optimization                | Initial Bundle Reduction | First Load Time |
| --------------------------- | ------------------------ | --------------- |
| **Before**                  | 6.09MB                   | ~3-5 seconds    |
| Remove unused features      | -2.3MB (3.8MB)           | ~2-3 seconds    |
| Selective styles            | -0.45MB (3.4MB)          | ~2 seconds      |
| Progressive loading         | -1MB (2.4MB)             | ~1.5 seconds    |
| **After all optimizations** | **~60% reduction**       | **~70% faster** |

---

### 🎯 Monitoring & Maintenance

#### Performance Tracking

```typescript
// Add performance monitoring
@Injectable()
export class PerformanceService {
  trackChunkLoad(chunkName: string) {
    const startTime = performance.now();

    import(`./features/${chunkName}/${chunkName}.module`).then(() => {
      const loadTime = performance.now() - startTime;
      console.log(`Chunk ${chunkName} loaded in ${loadTime}ms`);

      // Send to analytics
      gtag("event", "chunk_loaded", {
        chunk_name: chunkName,
        load_time: loadTime,
      });
    });
  }
}
```

#### Automated Bundle Size Monitoring

```json
// package.json
{
  "scripts": {
    "size-check": "ng build --prod && bundlesize",
    "precommit": "npm run size-check"
  },
  "bundlesize": [
    {
      "path": "dist/*/main-*.js",
      "maxSize": "200kb"
    },
    {
      "path": "dist/*/spartacus-*.js",
      "maxSize": "500kb"
    }
  ]
}
```

---

### 🏆 Success Metrics

**Target Goals:**

- ✅ Initial bundle: < 3MB (down from 6.09MB)
- ✅ First Contentful Paint: < 1.5s
- ✅ Largest Contentful Paint: < 2.5s
- ✅ Time to Interactive: < 3s
- ✅ Lighthouse Performance Score: > 90

This optimization guide should reduce your initial Spartacus bundle by 50-70% while maintaining all essential e-commerce functionality.
