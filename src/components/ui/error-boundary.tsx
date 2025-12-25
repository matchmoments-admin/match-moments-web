'use client';

import { Component, ReactNode } from 'react';
import { Card } from './card';
import { Button } from './button';

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

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="p-8 text-center">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-destructive mb-2">
              Something went wrong
            </h3>
            <p className="text-muted-foreground">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
          </div>
          <Button
            onClick={() => {
              this.setState({ hasError: false, error: undefined });
              window.location.reload();
            }}
          >
            Try Again
          </Button>
        </Card>
      );
    }

    return this.props.children;
  }
}

export function ErrorMessage({ 
  message, 
  retry 
}: { 
  message: string; 
  retry?: () => void;
}) {
  return (
    <Card className="p-8 text-center">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-destructive mb-2">Error</h3>
        <p className="text-muted-foreground">{message}</p>
      </div>
      {retry && (
        <Button onClick={retry} variant="outline">
          Retry
        </Button>
      )}
    </Card>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="p-12 text-center">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      {description && (
        <p className="text-muted-foreground mb-4">{description}</p>
      )}
      {action}
    </Card>
  );
}

