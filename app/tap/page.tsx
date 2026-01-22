// app/tap/page.tsx
import { Suspense } from "react";
import TapClient from "./TapClient";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TapClient />
    </Suspense>
  );
}
