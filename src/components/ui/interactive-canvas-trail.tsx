import React, { useEffect } from "react";
import { renderCanvas, destroyCanvas } from "@/components/ui/canvas";

export function InteractiveCanvasTrail() {
  useEffect(() => {
    const timer = setTimeout(() => {
      renderCanvas();
    }, 60);

    return () => {
      clearTimeout(timer);
      destroyCanvas();
    };
  }, []);

  return (
    <canvas
      id="canvas"
      aria-hidden="true"
      style={{
        pointerEvents: "none",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 2,
        opacity: 0.75,
      }}
    />
  );
}

export default InteractiveCanvasTrail;
