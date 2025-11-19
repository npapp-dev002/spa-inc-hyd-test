# 🧪 Angular Incremental Hydration Demo with SAP Spartacus

A demonstration project showcasing Angular 19's incremental hydration capabilities integrated with SAP Spartacus e-commerce framework. This project explores various hydration strategies, chunk loading patterns, and the challenges of implementing incremental hydration with NgModule-based libraries.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Demo Components](#demo-components)
- [Hydration Strategies](#hydration-strategies)
- [Known Limitations](#known-limitations)
- [Getting Started](#getting-started)
- [Build & Deployment](#build--deployment)
- [Key Learnings](#key-learnings)

## 🎯 Overview

This project was created to demonstrate and experiment with Angular's incremental hydration feature introduced in Angular 19. It combines custom standalone components with SAP Spartacus (an NgModule-based e-commerce framework) to explore how different architectural patterns interact with modern Angular features.

### What is Incremental Hydration?

Incremental hydration is a technique where server-side rendered (SSR) content is progressively made interactive on the client side. Instead of hydrating the entire application at once, components are hydrated individually based on triggers like:

- **Immediate**: Hydrates as soon as the page loads
- **On Interaction**: Hydrates when the user interacts with the component
- **On Viewport**: Hydrates when the component scrolls into view
- **On Timer**: Hydrates after a specified delay

## ✨ Key Features

- **Multiple Demo Sections**: Four interactive sections showcasing different aspects

  - 📦 Chunk Loading Demo
  - 💧 Hydration Strategies
  - 🛒 Spartacus Cart Integration
  - ⚡ Performance Analysis

- **Incremental Hydration Examples**: Real-world implementations using `@defer (hydrate on ...)`
- **Custom Standalone Components**: Lightweight components demonstrating different hydration patterns
- **SAP Spartacus Integration**: Full e-commerce functionality with product catalog, cart, checkout
- **Production-Optimized Builds**: Configured for chunk splitting and optimization

## 🛠️ Technologies Used

| Technology    | Version    | Purpose                                           |
| ------------- | ---------- | ------------------------------------------------- |
| Angular       | 19.2.x     | Core framework with incremental hydration support |
| SAP Spartacus | 221121.4.0 | E-commerce framework (requires Angular 19)        |
| TypeScript    | 5.7.2      | Type-safe development                             |
| NgRx          | 19.0.0     | State management for Spartacus                    |
| Node.js       | 18+        | Server-side rendering                             |
| RxJS          | 7.8.1      | Reactive programming                              |

## 📁 Project Structure

```
src/
├── app/
│   ├── components/                      # Custom demo components
│   │   ├── chunk-demo-light.component.ts      # Immediate hydration demo
│   │   ├── chunk-demo-heavy.component.ts      # Interaction-based hydration
│   │   ├── custom-cart.component.ts           # Spartacus cart integration
│   │   ├── data-intensive.component.ts        # ~150KB component
│   │   ├── form-wizard.component.ts           # ~80KB component
│   │   └── media-player.component.ts          # ~200KB component
│   ├── spartacus/                       # Spartacus modules
│   │   ├── spartacus-configuration.module.ts
│   │   ├── spartacus-features.module.ts
│   │   └── features/                    # Feature modules (cart, checkout, etc.)
│   ├── app.component.ts                 # Main application component
│   ├── app.module.ts                    # Client-side module with hydration config
│   └── app.module.server.ts             # Server-side module with hydration config
└── styles/                              # SCSS styling
```

## 🎨 Demo Components

### 1. **Chunk Demo Light** (`chunk-demo-light.component.ts`)

- **Size**: Lightweight standalone component
- **Hydration**: Immediate (`hydrate on immediate`)
- **Purpose**: Demonstrates instant hydration for critical UI elements
- **Features**: Displays load time and hydration status

### 2. **Chunk Demo Heavy** (`chunk-demo-heavy.component.ts`)

- **Size**: ~150KB standalone component
- **Hydration**: On interaction (`hydrate on interaction`)
- **Purpose**: Shows deferred hydration for performance optimization
- **Features**: Interactive counter, heavy computation, hydration tracking

### 3. **Custom Cart Component** (`custom-cart.component.ts`)

- **Integration**: Uses Spartacus services (ActiveCartFacade, UserAccountFacade)
- **Hydration**: On interaction
- **Purpose**: Demonstrates Spartacus integration with incremental hydration
- **Features**: Cart management, product addition, user info display

### 4. **Data Intensive Component** (`data-intensive.component.ts`)

- **Size**: ~150KB with large data tables
- **Purpose**: Simulates heavy data processing components
- **Features**: Multiple large arrays, data manipulation operations

### 5. **Form Wizard Component** (`form-wizard.component.ts`)

- **Size**: ~80KB with complex forms
- **Purpose**: Multi-step form with validation
- **Features**: Reactive forms, step navigation, validation

### 6. **Media Player Component** (`media-player.component.ts`)

- **Size**: ~200KB with media controls
- **Purpose**: Rich media component simulation
- **Features**: Playback controls, playlist, metadata display

## 💧 Hydration Strategies

### Proper Syntax for Incremental Hydration

```typescript
// ✅ CORRECT - Pure incremental hydration (SSR + deferred interactivity)
@defer (hydrate on immediate) {
  <app-component></app-component>
}

@defer (hydrate on interaction) {
  <app-component></app-component>
}

@defer (hydrate on viewport) {
  <app-component></app-component>
}

// ❌ INCORRECT - Mixing lazy loading with hydration
@defer (on immediate; hydrate on immediate) {
  <app-component></app-component>
}
```

### Key Differences

| Syntax                    | SSR Rendering | Client Hydration       | Use Case                       |
| ------------------------- | ------------- | ---------------------- | ------------------------------ |
| `@defer (on ...)`         | ❌ No         | Lazy loads component   | Client-only lazy loading       |
| `@defer (hydrate on ...)` | ✅ Yes        | Deferred interactivity | Incremental hydration with SSR |

### Hydration Configuration

**Client-side** (`app.module.ts`):

```typescript
provideClientHydration(withIncrementalHydration(), withNoHttpTransferCache());
```

**Server-side** (`app.module.server.ts`):

```typescript
provideClientHydration(withIncrementalHydration(), withNoHttpTransferCache());
```

## ⚠️ Known Limitations

### Incremental Hydration with NgModule-Based Libraries

**Current Status**: Incremental hydration **does not work as expected** when integrated with NgModule-based libraries like SAP Spartacus.

#### Why It Doesn't Work

1. **Module Boundaries**: Spartacus uses traditional NgModules which create module boundaries that prevent proper hydration tracking
2. **Eager Loading**: Spartacus loads most of its features eagerly through NgModules, bypassing incremental hydration
3. **Dependency Chain**: The deep dependency chain in NgModules forces full hydration of all dependencies
4. **Service Providers**: Spartacus services are provided at module level, requiring full module hydration

#### Evidence from This Project

When running the application:

```bash
npm run serve:hydration
```

You'll notice:

- Console shows: `"3 defer block(s) were configured to use incremental hydration"`
- However, **Spartacus components load immediately** regardless of defer blocks
- Custom **standalone components** demonstrate incremental hydration correctly
- The `<cx-storefront>` element (Spartacus) hydrates fully on initial load

#### Technical Explanation

```typescript
// This works with standalone components
@defer (hydrate on interaction) {
  <app-chunk-demo-heavy></app-chunk-demo-heavy>  // ✅ Hydrates on interaction
}

// This DOESN'T work effectively with NgModule components
@defer (hydrate on interaction) {
  <app-custom-cart></app-custom-cart>  // ⚠️ Uses Spartacus services
}
// The custom-cart component itself hydrates on interaction,
// but Spartacus modules are already fully loaded
```

#### What This Means

- **Standalone Components**: Full incremental hydration support ✅
- **NgModule Components** (like Spartacus): Limited or no incremental hydration ❌
- **Hybrid Apps**: Only standalone parts benefit from incremental hydration

#### Future Outlook

For full incremental hydration benefits with e-commerce frameworks:

1. Wait for Spartacus to migrate to standalone APIs
2. Consider alternative standalone-first e-commerce solutions
3. Build custom standalone e-commerce components

### Other Limitations

- **Angular 20 Incompatibility**: Spartacus 221121.4.0 requires Angular 19 (not compatible with Angular 20 due to removed `ResourceStatus` export)
- **Build Warnings**: CommonJS dependency warnings from Spartacus packages
- **Development Mode**: Some features work differently in development vs production builds

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/npapp-dev002/spa-inc-hyd-test.git
cd spa-inc-hyd-test

# Install dependencies
npm install
```

### Development Server

```bash
# Standard development mode
npm start

# Development with SSR
npm run dev:ssr

# Incremental hydration development mode
npm run dev:hydration
```

Navigate to `http://localhost:4200/`

### Testing Incremental Hydration

1. Build and serve with SSR:

   ```bash
   npm run serve:hydration
   ```

2. Open browser DevTools:

   - **Console**: Look for "X defer block(s) were configured to use incremental hydration"
   - **Network**: Observe chunk loading patterns
   - **Performance**: Monitor hydration timing

3. Interact with demo sections:
   - Click on "Heavy Component" placeholder (triggers interaction hydration)
   - Scroll to viewport-based components
   - Compare Spartacus vs standalone component behavior

## 🏗️ Build & Deployment

### Production Build

```bash
# Build for production with optimizations
npm run build:hydration

# Output location
dist/test-spartacus-hyd123/
├── browser/          # Client-side bundles
└── server/           # SSR server files
```

### Serve Production Build

```bash
npm run serve:ssr:test-spartacus-hyd123
```

### Build Configuration

**Key settings in `angular.json`**:

- `optimization: true` - Enables chunk splitting
- `namedChunks: true` - Named chunks for easier debugging
- `budgets` - Size warnings configured

### Environment Variables

```bash
# Required for HTTPS backend (development only)
NODE_TLS_REJECT_UNAUTHORIZED=0
```

## 📚 Key Learnings

### 1. Incremental Hydration Syntax

- Use `@defer (hydrate on ...)` not `@defer (on ...; hydrate on ...)`
- The `on` trigger is for lazy loading, not incremental hydration
- Both client and server need hydration configuration

### 2. Standalone vs NgModule Components

- Standalone components: Full incremental hydration support
- NgModule components: Limited/no incremental hydration
- Hybrid apps: Mixed results

### 3. Spartacus Integration Challenges

- Spartacus is NgModule-based (not yet standalone)
- Eager loading conflicts with incremental hydration
- Custom components can use Spartacus services but module boundaries remain

### 4. Build Optimization

- Production builds required for proper chunk generation
- Named chunks help debugging hydration issues
- Development mode behaves differently

### 5. SSR Configuration

- `provideClientHydration()` needed on both client and server
- `withIncrementalHydration()` enables the feature
- `withNoHttpTransferCache()` prevents HTTP caching conflicts

## 🔍 Debugging Tips

### Check Hydration Statistics

Open browser console after page load:

```javascript
// Angular logs hydration info
// Example: "3 defer block(s) were configured to use incremental hydration"
```

### Verify Component Rendering

View page source (Ctrl+U) to see SSR output:

- Components with `@defer (hydrate on ...)` should be present in HTML
- Components with `@defer (on ...)` will only show placeholder

### Network Analysis

Check Network tab:

- Initial page load should include SSR HTML
- Chunks load based on hydration triggers
- Look for named chunk files (e.g., `chunk-XXXXX.js`)

## 📝 Scripts Reference

| Script                    | Description                                   |
| ------------------------- | --------------------------------------------- |
| `npm start`               | Development server (port 4200)                |
| `npm run build`           | Standard production build                     |
| `npm run build:hydration` | Production build with hydration optimizations |
| `npm run serve:hydration` | Build and serve with SSR                      |
| `npm run dev:ssr`         | Development mode with SSR watch               |
| `npm test`                | Run unit tests                                |

## 🤝 Contributing

This is a demonstration project. Feel free to fork and experiment with different hydration patterns.

## 📄 License

This project is for educational and demonstration purposes.

## 🔗 References

- [Angular Incremental Hydration](https://angular.dev/guide/hydration)
- [SAP Spartacus Documentation](https://sap.github.io/spartacus-docs/)
- [Angular Defer Blocks](https://angular.dev/guide/defer)
- [Angular SSR](https://angular.dev/guide/ssr)
- [Angular CLI Documentation](https://angular.dev/tools/cli)

---

**Note**: This project demonstrates both the possibilities and limitations of incremental hydration in Angular 19, particularly highlighting compatibility challenges with NgModule-based frameworks like SAP Spartacus.
