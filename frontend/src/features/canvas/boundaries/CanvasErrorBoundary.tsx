"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface CanvasErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface CanvasErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * CanvasErrorBoundary - Catches render errors in the canvas tree
 * and shows a recoverable fallback instead of an empty screen.
 */
export class CanvasErrorBoundary extends Component<
  CanvasErrorBoundaryProps,
  CanvasErrorBoundaryState
> {
  state: CanvasErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): CanvasErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("CanvasErrorBoundary caught:", error, info);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
          <p className="text-sm text-[#3F2A35]">
            Kanvas mengalami error saat merender.
          </p>
          <p className="text-xs text-[#8C7783]">
            {this.state.error?.message ?? "Unknown error"}
          </p>
          <button
            onClick={this.handleRetry}
            className="rounded-md bg-[#B8895A] px-3 py-1.5 text-xs font-medium text-white hover:bg-[#9D7B3F]"
          >
            Coba lagi
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
