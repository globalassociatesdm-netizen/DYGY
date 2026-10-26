"use client";

import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { renderCanvas } from "@/components/ui/canvas";
import { Shapes, ArrowRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CanvasHero() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-background">
      <div className="animation-delay-8 animate-fadeIn mt-20 flex flex-col items-center justify-center px-4 text-center md:mt-20 relative z-10">
        <div className="z-10 mb-6 mt-10 sm:justify-center md:mb-4 md:mt-20">
          <div className="relative flex items-center whitespace-nowrap rounded-full border border-border bg-popover/80 px-3 py-1 text-xs leading-6 text-foreground/80 shadow-sm backdrop-blur-sm">
            <Shapes className="h-5 p-1 text-primary" /> Introducing Interactive Fluid Canvas.
            <a
              href="#home"
              className="hover:text-primary ml-1 flex items-center font-semibold"
            >
              <div className="absolute inset-0 flex" aria-hidden="true" />
              Explore{" "}
              <span aria-hidden="true">
                <ArrowRight className="h-4 w-4 ml-1" />
              </span>
            </a>
          </div>
        </div>

        <div className="mb-10 mt-4 md:mt-6">
          <div className="px-2">
            <div className="relative mx-auto h-full max-w-7xl border border-border/60 p-6 md:px-12 md:py-20 rounded-2xl bg-background/50 backdrop-blur-sm">
              <Plus
                strokeWidth={3}
                className="text-primary absolute -left-4 -top-4 h-8 w-8"
              />
              <Plus
                strokeWidth={3}
                className="text-primary absolute -bottom-4 -left-4 h-8 w-8"
              />
              <Plus
                strokeWidth={3}
                className="text-primary absolute -right-4 -top-4 h-8 w-8"
              />
              <Plus
                strokeWidth={3}
                className="text-primary absolute -bottom-4 -right-4 h-8 w-8"
              />
              <h1 className="flex select-none flex-col px-3 py-2 text-center text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-7xl lg:text-8xl">
                Your complete platform for Design & Motion.
              </h1>
              <div className="flex items-center justify-center gap-2 mt-4">
                <span className="relative flex h-3 w-3 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                </span>
                <p className="text-xs font-medium text-emerald-500">Interactive Canvas Active</p>
              </div>
            </div>
          </div>

          <h2 className="mt-8 text-2xl font-medium text-foreground md:text-3xl">
            Move your cursor or touch the screen to draw dynamic fluid ribbons!
          </h2>

          <p className="mx-auto mb-10 mt-3 max-w-2xl px-6 text-sm text-muted-foreground sm:px-6 md:max-w-4xl md:px-20 lg:text-base">
            Crafting enchanting visuals and high-performance digital marketing systems for ambitious brands.
          </p>

          <div className="flex justify-center gap-3">
            <Link to="/contact">
              <Button variant="default" size="lg" className="shadow-lg">
                Start Project
              </Button>
            </Link>
            <a href="tel:+919677759959">
              <Button variant="outline" size="lg">
                Book a Call
              </Button>
            </a>
          </div>
        </div>
      </div>
      <canvas
        className="pointer-events-none absolute inset-0 mx-auto w-full h-full"
        id="canvas"
      ></canvas>
    </section>
  );
}

export default CanvasHero;
