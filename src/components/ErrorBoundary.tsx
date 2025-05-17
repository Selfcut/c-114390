
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    console.error("Error caught by ErrorBoundary:", error);
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error);
    console.error("Component stack:", errorInfo.componentStack);
    
    this.setState({
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="flex flex-col items-center justify-center p-6 min-h-[200px] border border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-900/50 rounded-lg m-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-muted-foreground text-center mb-4">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload(); // Force reload to clear any potential state issues
            }}
          >
            Refresh page
          </button>
          {process.env.NODE_ENV !== 'production' && this.state.errorInfo && (
            <details className="mt-4 p-2 border border-red-300 rounded-md bg-red-50/80 dark:bg-red-950/30 dark:border-red-900/30 w-full overflow-auto">
              <summary className="cursor-pointer font-medium">Error details</summary>
              <pre className="text-xs mt-2 max-h-[200px] overflow-auto p-2 bg-black/5 dark:bg-white/5 rounded">
                {this.state.error?.stack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
