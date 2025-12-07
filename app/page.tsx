export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        padding: "1.5rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>NUMA Bands</h1>

      <p style={{ maxWidth: 500, marginBottom: "1rem", opacity: 0.85 }}>
        Tap into your daily cosmic dashboard. This is the start of your NUMA
        web app.
      </p>

      <p style={{ fontSize: "0.9rem", opacity: 0.6 }}>
        Web app MVP in progress...
      </p>
    </main>
  );
}
