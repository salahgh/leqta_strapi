'use client';

/**
 * ErrorBoundary Component - Design System
 * Uses design tokens for consistent styling
 */

import React, { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-card section-px section-py-md bg-background-light rounded-lg">
          <div className="text-center max-w-md">
            <h2 className="text-display-xs sm:text-display-sm font-bold text-white mb-3 sm:mb-4">
              Something went wrong
            </h2>
            <p className="text-body-sm sm:text-body-md text-neutral-300 mb-4 sm:mb-6">
              We encountered an error while loading this content. Please try refreshing the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-md bg-gradient-primary-button text-white rounded-lg hover:scale-105 active:scale-95 transition-all duration-200"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
