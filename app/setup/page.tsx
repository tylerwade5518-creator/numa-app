// app/setup/page.tsx
import { Suspense } from "react";
import SetupClient from "./SetupClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SetupClient />
    </Suspense>
  );
}
