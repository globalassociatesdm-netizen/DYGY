import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Sparkles, Heart, PartyPopper } from 'lucide-react';

interface Particle {
  id: number;
  x: number;
  y: number;
  emoji: string;
  vx: number;
  vy: number;
  scale: number;
  opacity: number;
  rotation: number;
}

const TOTAL_FRAMES = 300;
const PRIMARY_PATH = '/duck-frames/ezgif-frame-';
const FALLBACK_PATH = '/ezgif-455edffc4aa5cfdc-jpg/ezgif-frame-';

export const DuckHeroCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const loadedFramesRef = useRef<Set<number>>(new Set());
  const [isReady, setIsReady] = useState(false);

  // Interactive state
  const [currentSpeech, setCurrentSpeech] = useState<string>("Hi! I'm Digi 👋 Move your mouse!");
  const [isHovered, setIsHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [reactionStreak, setReactionStreak] = useState(0);

  // Animation refs for 60fps loop
  const animFrameRef = useRef<number | null>(null);
  const currentFrameRef = useRef<number>(25); // Frame 25 is center-facing
  const targetFrameRef = useRef<number>(25);
  const isPlayingReactionRef = useRef<boolean>(false);
  const reactionFrameRef = useRef<number>(240);
  const lastMouseMoveRef = useRef<number>(Date.now());
  const mousePosRef = useRef<{ normX: number; normY: number }>({ normX: 0.5, normY: 0.5 });
  const tiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetTiltRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Safe draw helper
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rounded = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameNum)));
    let img = imagesRef.current[rounded];

    // If target frame not ready, find closest loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let offset = 1; offset < 50; offset++) {
        const prev = imagesRef.current[rounded - offset];
        if (prev && prev.complete && prev.naturalWidth > 0) {
          img = prev;
          break;
        }
        const next = imagesRef.current[rounded + offset];
        if (next && next.complete && next.naturalWidth > 0) {
          img = next;
          break;
        }
      }
    }

    // Search any loaded frame
    if (!img || !img.complete || img.naturalWidth === 0) {
      for (let i = 1; i <= TOTAL_FRAMES; i++) {
        const candidate = imagesRef.current[i];
        if (candidate && candidate.complete && candidate.naturalWidth > 0) {
          img = candidate;
          break;
        }
      }
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    try {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Cover / contain aspect ratio
      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = width / height;
      let renderW = width;
      let renderH = height;
      let offsetX = 0;
      let offsetY = 0;

      if (canvasAspect > imgAspect) {
        renderW = width;
        renderH = width / imgAspect;
        offsetY = (height - renderH) / 2;
      } else {
        renderH = height;
        renderW = height * imgAspect;
        offsetX = (width - renderW) / 2;
      }

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);
    } catch (e) {
      // Safe catch to never crash animation loop
    }
  }, []);

  // Frame preloader pipeline
  useEffect(() => {
    let isCancelled = false;

    const preloadSingle = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (loadedFramesRef.current.has(index)) {
          resolve();
          return;
        }

        const img = new Image();
        const padIndex = String(index).padStart(3, '0');

        img.onload = () => {
          if (isCancelled) return;
          imagesRef.current[index] = img;
          loadedFramesRef.current.add(index);
          if (index === 25 || !isReady) {
            setIsReady(true);
            drawFrame(currentFrameRef.current);
          }
          resolve();
        };

        img.onerror = () => {
          // Fallback path
          const fallback = new Image();
          fallback.onload = () => {
            if (isCancelled) return;
            imagesRef.current[index] = fallback;
            loadedFramesRef.current.add(index);
            if (index === 25 || !isReady) {
              setIsReady(true);
              drawFrame(currentFrameRef.current);
            }
            resolve();
          };
          fallback.onerror = () => resolve();
          fallback.src = `${FALLBACK_PATH}${padIndex}.jpg`;
        };

        img.src = `${PRIMARY_PATH}${padIndex}.jpg`;

        if (img.complete && img.naturalWidth > 0) {
          imagesRef.current[index] = img;
          loadedFramesRef.current.add(index);
          if (index === 25 || !isReady) {
            setIsReady(true);
            drawFrame(currentFrameRef.current);
          }
          resolve();
        }
      });
    };

    // Preload critical head-turn & idle frames (1 to 60) and celebration frames (240 to 295)
    const criticalIndices = [
      1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60,
      75, 90, 110, 130, 160, 180, 210, 235, 240, 250, 260, 270, 280, 290, 300
    ];

    Promise.all(criticalIndices.map(preloadSingle)).then(() => {
      if (isCancelled) return;
      setIsReady(true);
      drawFrame(currentFrameRef.current);

      // Stagger remaining frames in background
      let cur = 1;
      const loadNextBatch = () => {
        if (isCancelled || cur > TOTAL_FRAMES) return;
        const batch: Promise<void>[] = [];
        for (let b = 0; b < 12 && cur <= TOTAL_FRAMES; b++, cur++) {
          if (!loadedFramesRef.current.has(cur)) {
            batch.push(preloadSingle(cur));
          }
        }
        Promise.all(batch).then(() => {
          if (!isCancelled && cur <= TOTAL_FRAMES) {
            setTimeout(loadNextBatch, 25);
          }
        });
      };
      loadNextBatch();
    });

    const readyTimer = setTimeout(() => {
      if (!isCancelled) {
        setIsReady(true);
        drawFrame(currentFrameRef.current);
      }
    }, 400);

    return () => {
      isCancelled = true;
      clearTimeout(readyTimer);
    };
  }, [drawFrame]);

  // Spawn celebration particles
  const triggerParticles = useCallback((count = 8) => {
    const emojis = ['💖', '✨', '🐥', '🌟', '🎉', '🧡'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: Date.now() + Math.random(),
        x: 50 + (Math.random() - 0.5) * 30,
        y: 50 + (Math.random() - 0.5) * 20,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: -3 - Math.random() * 5,
        scale: 0.8 + Math.random() * 0.7,
        opacity: 1,
        rotation: (Math.random() - 0.5) * 60,
      });
    }
    setParticles((prev) => [...prev.slice(-20), ...newParticles]);
  }, []);

  // Update particles loop
  useEffect(() => {
    if (particles.length === 0) return;
    const interval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx * 0.5,
            y: p.y + p.vy * 0.5,
            vy: p.vy + 0.15,
            opacity: p.opacity - 0.03,
            rotation: p.rotation + p.vx * 2,
          }))
          .filter((p) => p.opacity > 0)
      );
    }, 20);
    return () => clearInterval(interval);
  }, [particles]);

  // Trigger celebration reaction
  const triggerCelebration = useCallback((customMsg?: string) => {
    isPlayingReactionRef.current = true;
    reactionFrameRef.current = 240;
    triggerParticles(12);
    setReactionStreak((s) => s + 1);

    const happyMessages = [
      "Eee! So happy to see you! 💖",
      "Let's build something awesome together! 🚀",
      "Dygytaly is where ideas take flight! ✨",
      "Haha tickles! 🐥",
      "Good ideas deserve great execution! 💡",
      "Team Dygytaly's got your back! 🔥"
    ];
    setCurrentSpeech(customMsg || happyMessages[Math.floor(Math.random() * happyMessages.length)]);
  }, [triggerParticles]);

  // Global mouse tracker for responsive head turns
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      lastMouseMoveRef.current = Date.now();
      const winW = window.innerWidth;
      const winH = window.innerHeight;

      const normX = Math.min(1, Math.max(0, e.clientX / winW));
      const normY = Math.min(1, Math.max(0, e.clientY / winH));
      mousePosRef.current = { normX, normY };

      targetTiltRef.current = {
        x: (normX - 0.5) * 14,
        y: (0.5 - normY) * 10,
      };

      if (isPlayingReactionRef.current) return;

      // Map mouse position:
      // normX 0.0 -> Frame 1 (looking left)
      // normX 0.5 -> Frame 25 (looking center)
      // normX 1.0 -> Frame 55 (looking right)
      let frame = 25;
      if (normX <= 0.5) {
        frame = 1 + (normX / 0.5) * 24;
      } else {
        frame = 25 + ((normX - 0.5) / 0.5) * 30;
      }

      if (normY < 0.25) {
        // Looking up inquisitively
        const intensity = (0.25 - normY) / 0.25;
        frame += 15 * intensity;
      }

      targetFrameRef.current = Math.min(TOTAL_FRAMES, Math.max(1, frame));

      // Dynamic speech cues
      if (normX < 0.3) {
        setCurrentSpeech("Reading our story? Let's connect! 👈");
      } else if (normY < 0.15) {
        setCurrentSpeech("Checking out the navigation? 👆");
      } else if (normX > 0.7 && isHovered) {
        setCurrentSpeech("Click me for a happy surprise! 🐥");
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHovered]);

  // Main 60FPS animation and rendering loop
  useEffect(() => {
    let lastTime = performance.now();

    const loop = (time: number) => {
      animFrameRef.current = requestAnimationFrame(loop);
      const delta = Math.min(50, time - lastTime);
      lastTime = time;

      // Handle celebration reaction playback (frames 240 -> 295)
      if (isPlayingReactionRef.current) {
        reactionFrameRef.current += delta * 0.04;
        if (reactionFrameRef.current >= 295) {
          isPlayingReactionRef.current = false;
          targetFrameRef.current = 25;
        } else {
          currentFrameRef.current = reactionFrameRef.current;
          drawFrame(currentFrameRef.current);
          return;
        }
      }

      // Idle animated breathing & curious look-around when mouse is still
      const idleTime = Date.now() - lastMouseMoveRef.current;
      if (idleTime > 800) {
        // Natural look-around cycle: glances center, slight left, back, slight right
        const lookAroundCycle = Math.sin(time * 0.0018) * 12; // smoothly glances frames 13..37
        const breathing = Math.cos(time * 0.0035) * 2.5;
        targetFrameRef.current = 25 + lookAroundCycle + breathing;

        targetTiltRef.current = {
          x: Math.sin(time * 0.0012) * 5,
          y: Math.cos(time * 0.002) * 3,
        };
      }

      // Smooth lerp towards target frame
      const frameDiff = targetFrameRef.current - currentFrameRef.current;
      currentFrameRef.current += frameDiff * 0.16;

      // Smooth lerp for 3D tilt
      tiltRef.current.x += (targetTiltRef.current.x - tiltRef.current.x) * 0.1;
      tiltRef.current.y += (targetTiltRef.current.y - tiltRef.current.y) * 0.1;

      // Apply transform to container
      if (containerRef.current) {
        containerRef.current.style.transform = `perspective(900px) rotateY(${tiltRef.current.x.toFixed(2)}deg) rotateX(${tiltRef.current.y.toFixed(2)}deg) scale(${isHovered ? 1.025 : 1})`;
      }

      drawFrame(currentFrameRef.current);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [drawFrame, isHovered]);

  return (
    <div className="hero-duck-wrapper">
      {/* Ambient background glow orbs */}
      <div className="duck-ambient-glow" />
      <div className="duck-ambient-glow-secondary" />

      {/* 3D Interactive Container */}
      <div
        ref={containerRef}
        className="hero-duck-card"
        onMouseEnter={() => {
          setIsHovered(true);
          setCurrentSpeech("Click me to say hi! 🐥💖");
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setCurrentSpeech("Hi! I'm Digi 👋 Move your mouse!");
        }}
        onClick={() => triggerCelebration()}
        title="Click Digi for a joyful reaction!"
      >
        {/* Top Status Pill */}
        <div className="duck-status-pill">
          <span className="duck-status-dot" />
          <span className="duck-status-text">Digi • Dygytaly Mascot</span>
          {reactionStreak > 0 && (
            <span className="duck-streak-badge">
              🔥 x{reactionStreak}
            </span>
          )}
        </div>

        {/* Speech Bubble */}
        <div className="duck-speech-bubble">
          <Sparkles size={13} className="duck-speech-icon" />
          <span>{currentSpeech}</span>
        </div>

        {/* High-DPI HTML5 Canvas for ultra-smooth 60fps frame rendering */}
        <div className="duck-canvas-viewport">
          <canvas
            ref={canvasRef}
            width={720}
            height={520}
            className="duck-interactive-canvas"
          />

          {/* Floating reaction particles */}
          {particles.map((p) => (
            <span
              key={p.id}
              className="duck-floating-particle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                opacity: p.opacity,
                transform: `scale(${p.scale}) rotate(${p.rotation}deg)`,
              }}
            >
              {p.emoji}
            </span>
          ))}

          {/* Subtle click prompt overlay */}
          <div className="duck-click-hint">
            <span>✨ Tap or click Digi</span>
          </div>
        </div>

        {/* Quick Reaction Bar */}
        <div className="duck-action-bar" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="duck-action-btn"
            onClick={() => triggerCelebration("Yay! Hello there friend! 👋✨")}
            title="Wave to Digi"
          >
            👋 Wave
          </button>
          <button
            type="button"
            className="duck-action-btn"
            onClick={() => triggerCelebration("Lots of love! Thank you! 💖")}
            title="Send love"
          >
            <Heart size={13} /> Love
          </button>
          <button
            type="button"
            className="duck-action-btn duck-action-btn-highlight"
            onClick={() => triggerCelebration("Woohoo! Let's celebrate your business! 🎉")}
            title="Celebrate"
          >
            <PartyPopper size={13} /> Celebrate
          </button>
        </div>
      </div>
    </div>
  );
};
export default DuckHeroCanvas;
