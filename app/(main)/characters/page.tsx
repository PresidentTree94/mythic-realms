import { Suspense } from "react";
import Characters from "@/components/characterComps/Characters";

export default function Page() {
  return (
    <Suspense>
      <Characters />
    </Suspense>
  );
}