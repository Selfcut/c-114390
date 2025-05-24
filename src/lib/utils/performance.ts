
interface PerformanceMetrics {
  pageLoad: number;
  componentRender: number;
  apiResponse: number;
}

class PerformanceMonitor {
  private metrics: Map<string, number> = new Map();
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeObservers();
  }

  private initializeObservers() {
    if (typeof window === 'undefined') return;

    try {
      // Navigation timing observer
      const navObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            const loadTime = navEntry.loadEventEnd - navEntry.navigationStart;
            this.metrics.set('navigation', loadTime);
          }
        });
      });
      
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (error) {
      console.warn('Performance Observer not supported:', error);
    }
  }

  trackPageLoad(pageName: string): void {
    if (typeof window === 'undefined') return;
    
    const startTime = performance.now();
    this.metrics.set(`pageLoad_${pageName}`, startTime);
    
    // Track when page is fully loaded
    if (document.readyState === 'complete') {
      this.completePageLoad(pageName, startTime);
    } else {
      window.addEventListener('load', () => {
        this.completePageLoad(pageName, startTime);
      }, { once: true });
    }
  }

  private completePageLoad(pageName: string, startTime: number): void {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    this.metrics.set(`pageLoadComplete_${pageName}`, loadTime);
    
    if (loadTime > 2000) {
      console.warn(`Slow page load detected for ${pageName}: ${loadTime.toFixed(2)}ms`);
    }
  }

  trackComponentRender(componentName: string, renderTime: number): void {
    this.metrics.set(`componentRender_${componentName}`, renderTime);
    
    if (renderTime > 100) {
      console.warn(`Slow component render detected for ${componentName}: ${renderTime.toFixed(2)}ms`);
    }
  }

  trackApiCall(endpoint: string, responseTime: number): void {
    this.metrics.set(`apiCall_${endpoint}`, responseTime);
    
    if (responseTime > 5000) {
      console.warn(`Slow API call detected for ${endpoint}: ${responseTime.toFixed(2)}ms`);
    }
  }

  getMetrics(): Record<string, number> {
    const result: Record<string, number> = {};
    this.metrics.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.metrics.clear();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Hook for component performance tracking
export const useComponentPerformance = (componentName: string) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    performanceMonitor.trackComponentRender(componentName, renderTime);
  };
};
