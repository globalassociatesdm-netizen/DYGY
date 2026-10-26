"use client"

import React from "react";
import { SmokeCard } from "@/components/ui/smoke-card";

function SmokeCardDemo() {
  return (
    <div className="flex flex-col items-center justify-center p-8 gap-3 bg-neutral-950 text-white rounded-xl">
      <h1 className="text-4xl font-mono text-white text-center font-bold tracking-tight">
        SMOKE EFFECT
      </h1>
      <div className="relative">
        <SmokeCard />
      </div>
    </div>
  );
}

export { SmokeCardDemo };
