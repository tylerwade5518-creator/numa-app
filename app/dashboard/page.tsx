// app/dashboard/page.tsx
import { Suspense } from "react";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
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
          <p style={{ opacity: 0.7 }}>Loading dashboard…</p>
        </main>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
