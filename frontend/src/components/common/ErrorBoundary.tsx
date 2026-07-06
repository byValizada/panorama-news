import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in ErrorBoundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          padding: '20px',
          textAlign: 'center',
          fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif',
          color: 'var(--text-primary)',
          backgroundColor: 'var(--bg-primary)'
        }}>
          <h2 style={{ marginBottom: '15px', color: 'var(--accent-primary)' }}>
            Xəta baş verdi / Something went wrong
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', maxWidth: '500px' }}>
            Səhifə yüklənərkən gözlənilməz xəta yarandı. Yenidən cəhd etmək üçün səhifəni yeniləyə bilərsiniz.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: 'var(--accent-primary)',
              color: '#ffffff',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color var(--transition-fast)'
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-hover)')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'var(--accent-primary)')}
          >
            Yenilə / Reload Page
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre style={{
              marginTop: '40px',
              padding: '15px',
              backgroundColor: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              textAlign: 'left',
              maxWidth: '90%',
              overflowX: 'auto',
              fontSize: '0.85rem',
              color: '#ff4a4a'
            }}>
              {this.state.error.toString()}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
