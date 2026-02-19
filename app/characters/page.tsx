import { Suspense } from "react";
import Characters from "@/components/Characters";

export default function Page() {
  return (
    <Suspense>
      <Characters />
    </Suspense>
  );
}