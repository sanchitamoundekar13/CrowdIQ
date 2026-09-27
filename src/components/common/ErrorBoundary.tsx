import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('CrowdIQ Uncaught Application Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReload = () => {
    window.location.hash = '';
    window.location.reload();
  };

  private handleResetStorage = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error('Failed to clear storage:', e);
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0F172A] text-white flex items-center justify-center p-6 font-sans">
          <div className="max-w-xl w-full bg-[#1E293B] border border-[#334155] rounded-2xl p-8 shadow-2xl space-y-6 text-center">
            <div className="w-16 h-16 bg-[#EF4444]/20 border border-[#EF4444]/40 rounded-full flex items-center justify-center mx-auto text-[#EF4444] text-2xl font-bold">
              ⚠️
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-black text-white tracking-tight">
                CrowdIQ Application Error
              </h1>
              <p className="text-sm text-[#94A3B8]">
                An unexpected runtime exception was intercepted. The platform interface was safely recovered to prevent crash loops.
              </p>
            </div>

            {this.state.error && (
              <div className="bg-[#0F172A] p-4 rounded-xl border border-[#334155] text-left overflow-x-auto max-h-40">
                <p className="text-xs font-mono text-[#F87171] font-semibold">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="text-[10px] font-mono text-[#64748B] mt-2 whitespace-pre-wrap">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-sm transition cursor-pointer shadow-lg shadow-blue-500/20"
              >
                🔄 Reload Operations App
              </button>
              <button
                onClick={this.handleResetStorage}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#334155] hover:bg-[#475569] text-[#94A3B8] hover:text-white font-semibold text-sm transition cursor-pointer"
              >
                🧹 Reset Local State & Reload
              </button>
            </div>

            <p className="text-[11px] font-mono text-[#475569]">
              CrowdIQ Operational Resilience • Zero White Screen Guard
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
