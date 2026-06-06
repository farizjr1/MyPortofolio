import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      const isApiError =
        this.state.error?.message?.toLowerCase().includes("json") ||
        this.state.error?.message?.toLowerCase().includes("unexpected token") ||
        this.state.error?.message?.toLowerCase().includes("fetch") ||
        this.state.error?.message?.toLowerCase().includes("network");

      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-yellow-300/10 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-yellow-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-semibold text-white">
                {isApiError ? "Tidak dapat terhubung ke server" : "Terjadi kesalahan"}
              </h1>
              <p className="text-gray-400 text-sm leading-relaxed">
                {isApiError
                  ? "Server sedang tidak tersedia atau koneksi terputus. Silakan coba beberapa saat lagi."
                  : "Terjadi kesalahan yang tidak terduga. Coba muat ulang halaman."}
              </p>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-yellow-300 hover:bg-yellow-400 text-gray-900 font-medium text-sm rounded-lg transition-colors"
            >
              Muat Ulang
            </button>

            {import.meta.env.DEV && this.state.error && (
              <details className="text-left mt-4">
                <summary className="text-xs text-gray-500 cursor-pointer hover:text-gray-400">
                  Detail error (dev only)
                </summary>
                <pre className="mt-2 text-xs text-red-400 bg-gray-900 rounded p-3 overflow-auto max-h-40 whitespace-pre-wrap break-all">
                  {this.state.error.message}
                  {"\n\n"}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
