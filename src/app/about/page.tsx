import { Suspense } from "react";
import AboutPage from "./AboutPage";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AboutPage />
    </Suspense>
  );
}
