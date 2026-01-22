// app/share/setup/page.tsx
import { Suspense } from "react";
import ShareSetupClient from "./ShareSetupClient";

export const dynamic = "force-dynamic";

export default function ShareSetupPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "system-ui, sans-serif",
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <p style={{ opacity: 0.7 }}>Loading…</p>
        </main>
      }
    >
      <ShareSetupClient />
    </Suspense>
  );
}
