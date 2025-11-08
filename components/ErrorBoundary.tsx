
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  componentName: string;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error(`Uncaught error in ${this.props.componentName}:`, error, errorInfo);
  }

  private handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="glass-card rounded-lg p-6 my-8 flex flex-col items-center justify-center text-center text-red-400 border-red-500/50">
          <AlertTriangle className="w-12 h-12 mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Oops! Something went wrong.</h2>
          <p className="text-gray-400 mb-6">
            The "{this.props.componentName}" section could not be displayed. Please try refreshing the page.
          </p>
          <button
            onClick={this.handleRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/40 rounded-md text-white transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" /> Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
