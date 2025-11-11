import { memo } from 'react';
import { cn } from '@/lib/utils';

interface LoadingProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton' | 'dots';
}

const LoadingSpinner = memo(function LoadingSpinner({ size = 'md' }: { size?: LoadingProps['size'] }) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  return (
    <div className={cn('animate-spin rounded-full border-2 border-muted border-t-primary', sizeClasses[size])} />
  );
});

const LoadingSkeleton = memo(function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse bg-muted rounded', className)} />
  );
});

const LoadingDots = memo(function LoadingDots({ size = 'md' }: { size?: LoadingProps['size'] }) {
  const dotSize = {
    sm: 'h-1 w-1',
    md: 'h-2 w-2',
    lg: 'h-3 w-3',
  };

  return (
    <div className="flex space-x-1">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            'bg-primary rounded-full animate-bounce',
            dotSize[size]
          )}
          style={{
            animationDelay: `${i * 0.1}s`,
            animationDuration: '0.6s',
          }}
        />
      ))}
    </div>
  );
});

export const Loading = memo(function Loading({ 
  className, 
  size = 'md', 
  variant = 'spinner' 
}: LoadingProps) {
  const components = {
    spinner: <LoadingSpinner size={size} />,
    skeleton: <LoadingSkeleton className={className} />,
    dots: <LoadingDots size={size} />,
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      {components[variant]}
    </div>
  );
});

// Componente de loading para páginas
export const PageLoading = memo(function PageLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-2">
        <div className="h-8 bg-muted rounded w-1/3" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-6 space-y-3">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-8 bg-muted rounded w-1/2" />
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded" />
              <div className="h-3 bg-muted rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

// Componente de loading para cards
export const CardLoading = memo(function CardLoading() {
  return (
    <div className="border rounded-lg p-6 space-y-3 animate-pulse">
      <div className="h-4 bg-muted rounded w-3/4" />
      <div className="h-8 bg-muted rounded w-1/2" />
      <div className="space-y-2">
        <div className="h-3 bg-muted rounded" />
        <div className="h-3 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
});
