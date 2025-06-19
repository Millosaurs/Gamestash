"use client";

import { useEffect } from "react";
import Link from "next/link";
import { renderCanvas } from "@/components/ui/canvas";
import { DIcons } from "dicons";
import { ThemeToggle } from "@/components/toggle-theme";
import { Button } from "@/components/ui/button";

export default function Page() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home">
      <div className="animation-delay-8 animate-fadeIn mt-20 flex flex-col items-center justify-center px-4 text-center md:mt-20">
        <div className="mb-10 mt-4 md:mt-6">
          <div className="px-2">
            <div className="border-ali relative mx-auto h-full max-w-7xl border p-6 [mask-image:radial-gradient(800rem_96rem_at_center,white,transparent)] md:px-12 md:py-20">
              <h1 className="flex select-none flex-col px-3 py-2 text-center text-5xl font-semibold leading-none tracking-tight md:flex-col md:text-8xl lg:flex-row lg:text-8xl">
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-ali absolute -left-5 -top-5 h-10 w-10"
                />
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-ali absolute -bottom-5 -left-5 h-10 w-10"
                />
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-ali absolute -right-5 -top-5 h-10 w-10"
                />
                <DIcons.Plus
                  strokeWidth={4}
                  className="text-ali absolute -bottom-5 -right-5 h-10 w-10"
                />
                Next.js 15 Template
              </h1>
            </div>
          </div>

          <h2 className="mt-8 text-2xl md:text-2xl">
            Built with{" "}
            <span className="text-ali font-bold">shadcn/ui</span>,{" "}
            <span className="text-ali font-bold">Tailwind CSS v4</span>,{" "}
            <span className="text-ali font-bold">Supabase</span>, and{" "}
            <span className="text-ali font-bold">Better Auth</span>
          </h2>

          <p className="md:text-md mx-auto mb-16 mt-2 max-w-2xl px-6 text-sm text-primary/60 sm:px-6 md:max-w-4xl md:px-20 lg:text-lg">
            A modern starter for your next project: production-ready, beautiful
            UI, authentication, and a powerful backend. Everything you need to
            build, launch, and scale with confidence.
          </p>
          <div className="flex justify-center gap-2">
            <Link href={"/dashboard"}>
              <Button variant="default" size="lg">
                Start Project
              </Button>
            </Link>
            
          </div>
        </div>
      </div>
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
    </section>
  );
}