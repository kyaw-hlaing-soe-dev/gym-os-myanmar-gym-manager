'use client';

// ─── Global Error Boundary ────────────────────────────────────────────────────
// Required to prevent Next.js 16 Turbopack from failing during build when it
// attempts to statically prerender the internal /_global-error page.

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: Props) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#f1f5f9',
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: '40px 48px',
            textAlign: 'center',
            maxWidth: 480,
          }}
        >
          <p style={{ fontSize: 32, margin: 0 }}>⚠️</p>
          <h1
            style={{
              marginTop: 16,
              fontSize: 20,
              fontWeight: 700,
              color: '#0f172a',
            }}
          >
            Something went wrong
          </h1>
          <p style={{ color: '#64748b', fontSize: 14, marginTop: 8 }}>
            {error.message ?? 'An unexpected error occurred.'}
          </p>
          {error.digest && (
            <p
              style={{
                fontSize: 11,
                color: '#94a3b8',
                marginTop: 4,
                fontFamily: 'monospace',
              }}
            >
              Digest: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            style={{
              marginTop: 24,
              background: '#0f9b8e',
              color: '#ffffff',
              border: 'none',
              borderRadius: 10,
              padding: '10px 24px',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
