import React from 'react';

/**
 * ErrorFallback Component - Design System
 * Uses design tokens for consistent styling
 * Mobile-first responsive design
 */

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  title = 'Unable to load content',
  message = 'We encountered an error while loading this section. Please try again.',
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center card-p-md bg-background-light rounded-lg border border-neutral-600">
      <div className="text-center max-w-md">
        <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-red-500/10 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="text-body-md sm:text-body-lg font-semibold text-white mb-2">
          {title}
        </h3>
        <p className="text-body-xs sm:text-body-sm text-neutral-400 mb-3 sm:mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="btn-sm bg-gradient-primary-button text-white rounded-lg hover:scale-105 active:scale-95 transition-all duration-200"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorFallback;
