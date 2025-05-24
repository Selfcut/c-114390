
import { useEffect, useRef, useState } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  componentMountTime: number;
  memoryUsage?: {
    used: number;
    total: number;
    limit: number;
  };
}

export const usePerformanceMonitor = (componentName: string) => {
  const mountTimeRef = useRef<number>();
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);

  useEffect(() => {
    const startTime = performance.now();
    mountTimeRef.current = startTime;

    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      const componentMountTime = endTime - (mountTimeRef.current || startTime);

      const memoryUsage = 'memory' in performance ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : undefined;

      const metrics: PerformanceMetrics = {
        renderTime,
        componentMountTime,
        memoryUsage
      };

      setMetrics(metrics);

      // Log slow components
      if (renderTime > 100) {
        console.warn(`Slow component detected: ${componentName} took ${renderTime.toFixed(2)}ms`);
      }

      // Log to analytics in production
      if (process.env.NODE_ENV === 'production') {
        // trackEvent('component_performance', {
        //   component: componentName,
        //   render_time: renderTime,
        //   mount_time: componentMountTime
        // });
      }
    };
  }, [componentName]);

  return metrics;
};

export const useRenderTracker = (componentName: string, dependencies: any[] = []) => {
  const renderCount = useRef(0);
  const lastRenderTime = useRef<number>();

  useEffect(() => {
    renderCount.current += 1;
    const now = performance.now();
    
    if (lastRenderTime.current) {
      const timeSinceLastRender = now - lastRenderTime.current;
      console.log(`${componentName} render #${renderCount.current} (${timeSinceLastRender.toFixed(2)}ms since last)`);
    }
    
    lastRenderTime.current = now;
  }, dependencies);

  return renderCount.current;
};
