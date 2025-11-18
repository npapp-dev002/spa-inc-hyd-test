import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { ActiveCartFacade, Cart, OrderEntry } from '@spartacus/cart/base/root';
import { AuthService, User } from '@spartacus/core';
import { UserAccountFacade } from '@spartacus/user/account/root';

@Component({
  selector: 'app-custom-cart',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="custom-cart-component">
      <h3>🛒 Custom Cart Component (Spartacus Integration)</h3>
      
      <div class="status-info">
        <p><strong>Hydration Status:</strong> 
          <span [class]="isHydrated ? 'hydrated' : 'ssr'">
            {{ isHydrated ? '💧 Hydrated & Interactive' : '🏗️ SSR Only' }}
          </span>
        </p>
        <p><strong>Load Time:</strong> {{ loadTime }}</p>
        <p><strong>User Status:</strong> {{ isLoggedIn ? '✅ Logged In' : '❌ Anonymous' }}</p>
      </div>

      <div class="cart-overview" *ngIf="cart$ | async as cart">
        <div class="cart-summary">
          <h4>📦 Cart Summary</h4>
          <div class="summary-item">
            <span class="label">Cart ID:</span>
            <span class="value">{{ cart.code || 'N/A' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Total Items:</span>
            <span class="value">{{ cart.totalItems || 0 }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Total Price:</span>
            <span class="value">{{ cart.totalPrice?.formattedValue || '$0.00' }}</span>
          </div>
          <div class="summary-item">
            <span class="label">Delivery Cost:</span>
            <span class="value">{{ cart.deliveryCost?.formattedValue || 'Free' }}</span>
          </div>
        </div>

        <div class="cart-actions">
          <h4>🎯 Cart Actions</h4>
          <button (click)="addSampleProduct()" [disabled]="!isHydrated || isLoading" class="action-btn add-btn">
            {{ isLoading ? 'Adding...' : 'Add Sample Product' }}
          </button>
          <button (click)="clearCart()" [disabled]="!isHydrated || cart.totalItems === 0" class="action-btn clear-btn">
            Clear Cart
          </button>
          <button (click)="refreshCart()" [disabled]="!isHydrated" class="action-btn refresh-btn">
            Refresh Cart
          </button>
        </div>
      </div>

      <div class="cart-entries" *ngIf="cart$ | async as cart">
        <h4>📋 Cart Items ({{ cart.entries?.length || 0 }})</h4>
        <div *ngIf="!cart.entries || cart.entries.length === 0" class="empty-cart">
          <p>Your cart is empty. Add some products to see them here!</p>
        </div>
        <div *ngFor="let entry of cart.entries; trackBy: trackByEntryNumber" class="cart-entry">
          <div class="entry-info">
            <div class="product-name">{{ entry.product?.name || 'Unknown Product' }}</div>
            <div class="product-code">Code: {{ entry.product?.code || 'N/A' }}</div>
          </div>
          <div class="entry-details">
            <div class="quantity">Qty: {{ entry.quantity }}</div>
            <div class="price">{{ entry.totalPrice?.formattedValue || '$0.00' }}</div>
          </div>
          <div class="entry-actions">
            <button (click)="updateQuantity(entry, (entry.quantity || 0) + 1)" [disabled]="!isHydrated" class="qty-btn">+</button>
            <button (click)="decreaseQuantity(entry)" [disabled]="!isHydrated" class="qty-btn">-</button>
            <button (click)="removeEntry(entry)" [disabled]="!isHydrated" class="remove-btn">🗑️</button>
          </div>
        </div>
      </div>

      <div class="user-info" *ngIf="user$ | async as user">
        <h4>👤 User Information</h4>
        <div class="user-details">
          <p><strong>Name:</strong> {{ user.name || 'Anonymous User' }}</p>
          <p><strong>Email:</strong> {{ user.uid || 'Not available' }}</p>
          <p><strong>Customer ID:</strong> {{ user.customerId || 'Not available' }}</p>
        </div>
      </div>

      <div class="cart-operations">
        <h4>⚙️ Advanced Operations</h4>
        <button (click)="analyzeCartPerformance()" [disabled]="!isHydrated" class="action-btn analyze-btn">
          📊 Analyze Cart Performance
        </button>
        <button (click)="exportCartData()" [disabled]="!isHydrated" class="action-btn export-btn">
          📤 Export Cart Data
        </button>
      </div>

      <div class="performance-info" *ngIf="performanceData">
        <h4>📈 Performance Metrics</h4>
        <div class="perf-grid">
          <div class="perf-item">
            <span class="perf-label">Cart Load Time:</span>
            <span class="perf-value">{{ performanceData.cartLoadTime }}ms</span>
          </div>
          <div class="perf-item">
            <span class="perf-label">API Calls Made:</span>
            <span class="perf-value">{{ performanceData.apiCalls }}</span>
          </div>
          <div class="perf-item">
            <span class="perf-label">Cache Hits:</span>
            <span class="perf-value">{{ performanceData.cacheHits }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .custom-cart-component {
      border: 2px solid #17a2b8;
      border-radius: 12px;
      padding: 25px;
      background: linear-gradient(135deg, #f8f9ff, #e8f4f8);
      margin: 20px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    
    .status-info {
      background: rgba(23, 162, 184, 0.1);
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 0.9em;
    }
    
    .hydrated { color: #28a745; font-weight: bold; }
    .ssr { color: #6c757d; font-weight: bold; }
    
    .cart-overview {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 25px;
    }
    
    .cart-summary {
      background: rgba(255, 255, 255, 0.8);
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #17a2b8;
    }
    
    .cart-summary h4 {
      margin-top: 0;
      color: #17a2b8;
    }
    
    .summary-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e9ecef;
    }
    
    .summary-item:last-child {
      border-bottom: none;
      font-weight: bold;
    }
    
    .label {
      color: #6c757d;
    }
    
    .value {
      color: #495057;
      font-weight: 600;
    }
    
    .cart-actions {
      background: rgba(255, 255, 255, 0.8);
      padding: 20px;
      border-radius: 8px;
      border-left: 4px solid #28a745;
    }
    
    .cart-actions h4 {
      margin-top: 0;
      color: #28a745;
    }
    
    .action-btn {
      display: block;
      width: 100%;
      margin: 8px 0;
      padding: 12px 16px;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    
    .add-btn {
      background: #28a745;
      color: white;
    }
    
    .clear-btn {
      background: #dc3545;
      color: white;
    }
    
    .refresh-btn {
      background: #17a2b8;
      color: white;
    }
    
    .analyze-btn {
      background: #6f42c1;
      color: white;
    }
    
    .export-btn {
      background: #fd7e14;
      color: white;
    }
    
    .action-btn:hover:not(:disabled) {
      transform: translateY(-1px);
      opacity: 0.9;
    }
    
    .action-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      transform: none;
    }
    
    .cart-entries {
      background: rgba(255, 255, 255, 0.8);
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #ffc107;
    }
    
    .cart-entries h4 {
      margin-top: 0;
      color: #856404;
    }
    
    .empty-cart {
      text-align: center;
      padding: 30px;
      color: #6c757d;
      font-style: italic;
    }
    
    .cart-entry {
      display: grid;
      grid-template-columns: 2fr 1fr auto;
      gap: 15px;
      padding: 15px;
      border: 1px solid #e9ecef;
      border-radius: 6px;
      margin: 10px 0;
      background: white;
      align-items: center;
    }
    
    .entry-info .product-name {
      font-weight: bold;
      color: #495057;
    }
    
    .entry-info .product-code {
      font-size: 0.85em;
      color: #6c757d;
    }
    
    .entry-details {
      text-align: right;
    }
    
    .quantity {
      font-weight: bold;
      color: #17a2b8;
    }
    
    .price {
      font-size: 1.1em;
      font-weight: bold;
      color: #28a745;
    }
    
    .entry-actions {
      display: flex;
      gap: 5px;
      align-items: center;
    }
    
    .qty-btn, .remove-btn {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: bold;
      transition: all 0.2s;
    }
    
    .qty-btn {
      background: #17a2b8;
      color: white;
    }
    
    .remove-btn {
      background: #dc3545;
      color: white;
    }
    
    .qty-btn:hover, .remove-btn:hover {
      transform: scale(1.1);
    }
    
    .qty-btn:disabled, .remove-btn:disabled {
      background: #6c757d;
      cursor: not-allowed;
      transform: none;
    }
    
    .user-info {
      background: rgba(255, 255, 255, 0.8);
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #6f42c1;
    }
    
    .user-info h4 {
      margin-top: 0;
      color: #6f42c1;
    }
    
    .user-details p {
      margin: 8px 0;
      color: #495057;
    }
    
    .cart-operations {
      background: rgba(255, 255, 255, 0.8);
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #fd7e14;
    }
    
    .cart-operations h4 {
      margin-top: 0;
      color: #fd7e14;
    }
    
    .performance-info {
      background: rgba(255, 255, 255, 0.8);
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
      border-left: 4px solid #e83e8c;
    }
    
    .performance-info h4 {
      margin-top: 0;
      color: #e83e8c;
    }
    
    .perf-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 15px;
    }
    
    .perf-item {
      background: #f8f9fa;
      padding: 12px;
      border-radius: 6px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .perf-label {
      color: #6c757d;
      font-weight: 600;
    }
    
    .perf-value {
      color: #e83e8c;
      font-weight: bold;
      font-size: 1.1em;
    }
    
    @media (max-width: 768px) {
      .cart-overview {
        grid-template-columns: 1fr;
      }
      
      .cart-entry {
        grid-template-columns: 1fr;
        text-align: center;
      }
      
      .perf-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CustomCartComponent implements OnInit, OnDestroy, AfterViewInit {
  cart$: Observable<Cart>;
  user$: Observable<User | undefined>;
  isLoggedIn = false;
  isLoading = false;
  isHydrated = false;
  loadTime = '';
  performanceData: any = null;
  
  private subscriptions = new Subscription();
  private isBrowser: boolean;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private activeCartFacade: ActiveCartFacade,
    private authService: AuthService,
    private userAccountFacade: UserAccountFacade
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.loadTime = new Date().toLocaleTimeString();
    
    // Initialize observables
    this.cart$ = this.activeCartFacade.getActive();
    this.user$ = this.userAccountFacade.get();
    
    if (this.isBrowser) {
      console.log('🛒 Custom Cart Component: Loaded at', this.loadTime);
    }
  }

  ngOnInit() {
    if (this.isBrowser) {
      console.log('🛒 Custom Cart Component: OnInit - initializing');
      
      // Subscribe to auth state
      this.subscriptions.add(
        this.authService.isUserLoggedIn().subscribe(loggedIn => {
          this.isLoggedIn = loggedIn;
          console.log('🔐 User login status:', loggedIn);
        })
      );

      // Subscribe to cart changes
      this.subscriptions.add(
        this.cart$.subscribe(cart => {
          console.log('🛒 Cart updated:', cart);
        })
      );
    }
  }

  ngAfterViewInit() {
    if (this.isBrowser) {
      this.isHydrated = true;
      console.log('🛒 Custom Cart Component: ✅ HYDRATED and interactive!');
      
      // Load initial cart data
      this.refreshCart();
    }
  }

  ngOnDestroy() {
    console.log('🛒 Custom Cart Component: Destroying');
    this.subscriptions.unsubscribe();
  }

  addSampleProduct() {
    if (!this.isHydrated) return;
    
    this.isLoading = true;
    console.log('🛒 Adding sample product to cart...');
    
    // Add a sample product (you can customize this product code)
    const sampleProductCode = '300938'; // This is typically a camera or electronic product in Spartacus
    const quantity = 1;
    
    this.activeCartFacade.addEntry(sampleProductCode, quantity);
    
    // Simulate loading state
    setTimeout(() => {
      this.isLoading = false;
      console.log('🛒 Sample product added successfully');
    }, 1000);
  }

  clearCart() {
    if (!this.isHydrated) return;
    
    console.log('🛒 Clearing cart...');
    
    // Clear all cart entries
    this.cart$.subscribe(cart => {
      if (cart.entries) {
        cart.entries.forEach(entry => {
          if (entry.entryNumber !== undefined) {
            this.activeCartFacade.removeEntry(entry);
          }
        });
      }
    }).unsubscribe();
    
    console.log('🛒 Cart cleared successfully');
  }

  refreshCart() {
    if (!this.isHydrated) return;
    
    console.log('🛒 Refreshing cart data...');
    this.activeCartFacade.reloadActiveCart();
  }

  updateQuantity(entry: OrderEntry, newQuantity: number) {
    if (!this.isHydrated || entry.entryNumber === undefined) return;
    
    console.log(`🛒 Updating quantity for entry ${entry.entryNumber} to ${newQuantity}`);
    
    if (newQuantity === 0) {
      this.removeEntry(entry);
    } else {
      this.activeCartFacade.updateEntry(entry.entryNumber, newQuantity);
    }
  }

  decreaseQuantity(entry: OrderEntry) {
    if (!this.isHydrated) return;
    const newQuantity = Math.max(0, (entry.quantity || 0) - 1);
    this.updateQuantity(entry, newQuantity);
  }

  removeEntry(entry: OrderEntry) {
    if (!this.isHydrated || entry.entryNumber === undefined) return;
    
    console.log(`🛒 Removing entry ${entry.entryNumber} from cart`);
    this.activeCartFacade.removeEntry(entry);
  }

  analyzeCartPerformance() {
    if (!this.isHydrated) return;
    
    console.group('📊 Cart Performance Analysis');
    
    const startTime = performance.now();
    
    // Simulate performance analysis
    setTimeout(() => {
      const endTime = performance.now();
      
      this.performanceData = {
        cartLoadTime: Math.round(endTime - startTime),
        apiCalls: Math.floor(Math.random() * 10) + 5,
        cacheHits: Math.floor(Math.random() * 20) + 10
      };
      
      console.log('Cart performance metrics:', this.performanceData);
      console.log('Cart service status: Active');
      console.log('Cache status: Enabled');
      console.log('Network requests: Optimized');
      console.groupEnd();
    }, 500);
  }

  exportCartData() {
    if (!this.isHydrated) return;
    
    console.log('📤 Exporting cart data...');
    
    this.cart$.subscribe(cart => {
      const cartData = {
        cartId: cart.code,
        totalItems: cart.totalItems,
        totalPrice: cart.totalPrice,
        entries: cart.entries?.map(entry => ({
          product: entry.product?.name,
          code: entry.product?.code,
          quantity: entry.quantity,
          price: entry.totalPrice?.formattedValue
        })),
        exportedAt: new Date().toISOString(),
        userStatus: this.isLoggedIn ? 'logged-in' : 'anonymous'
      };
      
      console.log('📊 Cart Data Export:', cartData);
      
      // In a real application, you might download this as JSON or CSV
      console.log('💾 Cart data ready for download (check console for full data)');
    }).unsubscribe();
  }

  trackByEntryNumber(index: number, entry: OrderEntry): any {
    return entry.entryNumber || index;
  }
}