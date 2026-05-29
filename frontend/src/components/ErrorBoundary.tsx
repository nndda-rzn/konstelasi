'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
  /** Optional label to identify which boundary fired (helps debugging) */
  label?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(
      `[ErrorBoundary${this.props.label ? `:${this.props.label}` : ''}]`,
      error,
      errorInfo
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex flex-col items-center justify-center min-h-[300px] p-8 rounded-2xl bg-white/80 backdrop-blur-xl border border-[#FFB4A2]/20">
          <div className="w-12 h-12 rounded-full bg-[#FF8FA3]/10 flex items-center justify-center mb-4">
            <AlertTriangle className="w-6 h-6 text-[#FF8FA3]" />
          </div>
          <h3 className="text-base font-semibold text-[#4A2F3C] mb-2">
            Terjadi kesalahan
          </h3>
          <p className="text-sm text-[#5A3E4C]/60 mb-4 text-center max-w-md">
            {this.state.error?.message || 'Komponen ini gagal dimuat. Coba muat ulang bagian ini.'}
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#FF8FA3] to-[#FFB4A2] hover:from-[#FF7A8A] hover:to-[#FF8FA3] text-white text-sm font-medium shadow-md shadow-pink-300/30 hover:shadow-pink-300/50 transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            Coba lagi
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
