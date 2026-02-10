// app/dashboard/loading.tsx
export default function LoadingDashboard() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
      }}
    >
      <div style={{ width: "100%", maxWidth: 420, textAlign: "center" }}>
        <div
          style={{
            width: 84,
            height: 84,
            margin: "0 auto 16px",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.18)",
            background:
              "radial-gradient(circle at 30% 30%, rgba(250,204,21,0.22), rgba(56,189,248,0.14), rgba(2,6,23,0.8))",
            boxShadow:
              "0 0 40px rgba(56,189,248,0.18), 0 0 26px rgba(250,204,21,0.12)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -60,
              background:
                "conic-gradient(from -90deg, rgba(56,189,248,0.0), rgba(56,189,248,0.35), rgba(250,204,21,0.25), rgba(56,189,248,0.0))",
              animation: "spin 1.2s linear infinite",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 10,
              borderRadius: 9999,
              background: "rgba(2,6,23,0.85)",
              border: "1px solid rgba(255,255,255,0.10)",
            }}
          />
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "grid",
              placeItems: "center",
              color: "rgba(255,255,255,0.85)",
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.28em",
            }}
          >
            NUMA
          </div>
        </div>

        <div
          style={{
            fontSize: 11,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.6)",
          }}
        >
          Aligning today’s sky
        </div>

        <div
          style={{
            marginTop: 10,
            fontSize: 14,
            color: "rgba(255,255,255,0.86)",
            lineHeight: 1.35,
          }}
        >
          Opening your dashboard…
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </main>
  );
}
