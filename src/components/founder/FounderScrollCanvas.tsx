import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Maximize2,
  Minimize2,
  ChevronRight,
  Sliders,
  Volume2,
  VolumeX,
  Layers
} from 'lucide-react';

export interface StoryChapterMeta {
  id: string;
  num: string;
  category: string;
  headline: string;
  animationTitle: string;
}

interface FounderScrollCanvasProps {
  activeChapter: number;
  chapterProgress: number;
  globalScrollProgress: number;
  chapters: StoryChapterMeta[];
  onChapterSelect?: (index: number) => void;
  onToggle3DMode?: () => void;
  has3DMode?: boolean;
}

const TOTAL_FRAMES = 300;
const FRAME_PREFIX = '/founder-frames/ezgif-frame-';

// Utility to format frame filename with 3 digits zero padding
const getFrameUrl = (frameIndex: number): string => {
  const clamped = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameIndex)));
  const padded = String(clamped).padStart(3, '0');
  return `${FRAME_PREFIX}${padded}.jpg`;
};

export const FounderScrollCanvas: React.FC<FounderScrollCanvasProps> = ({
  activeChapter,
  chapterProgress,
  globalScrollProgress,
  chapters,
  onChapterSelect,
  onToggle3DMode,
  has3DMode = true
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Image cache and load tracking
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const loadedMapRef = useRef<boolean[]>(new Array(TOTAL_FRAMES + 1).fill(false));
  const [loadPercentage, setLoadPercentage] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);

  // Animation interpolation state
  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const animFrameIdRef = useRef<number | null>(null);

  // User interactive state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [scrubberHoverInfo, setScrubberHoverInfo] = useState<{ frame: number; label: string; x: number } | null>(null);
  const autoPlayIntervalRef = useRef<number | null>(null);

  // Map chapter index (0..5) to frame ranges
  const getChapterFrameRange = (chapterIdx: number) => {
    const framesPerChapter = TOTAL_FRAMES / Math.max(1, chapters.length);
    const start = Math.floor(chapterIdx * framesPerChapter) + 1;
    const end = Math.min(TOTAL_FRAMES, Math.floor((chapterIdx + 1) * framesPerChapter));
    return { start, end };
  };

  // Helper to find closest available loaded frame if current frame hasn't finished loading
  const getNearestLoadedFrame = (target: number): HTMLImageElement | null => {
    const clamped = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(target)));
    if (loadedMapRef.current[clamped] && imagesRef.current[clamped]) {
      return imagesRef.current[clamped];
    }
    // Search outward
    for (let offset = 1; offset < 40; offset++) {
      const prev = clamped - offset;
      if (prev >= 1 && loadedMapRef.current[prev] && imagesRef.current[prev]) {
        return imagesRef.current[prev];
      }
      const next = clamped + offset;
      if (next <= TOTAL_FRAMES && loadedMapRef.current[next] && imagesRef.current[next]) {
        return imagesRef.current[next];
      }
    }
    // If still not found, return frame 1 if loaded
    return loadedMapRef.current[1] ? imagesRef.current[1] : null;
  };

  // Draw a frame to canvas with aspect-ratio cover & high-DPI
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getNearestLoadedFrame(frameNum);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const targetWidth = Math.round(rect.width * dpr);
    const targetHeight = Math.round(rect.height * dpr);

    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    // Calculate aspect fill (cover)
    const imgRatio = img.naturalWidth / img.naturalHeight;
    const canvasRatio = canvas.width / canvas.height;

    let renderW = canvas.width;
    let renderH = canvas.height;
    let offsetX = 0;
    let offsetY = 0;

    if (canvasRatio > imgRatio) {
      renderW = canvas.width;
      renderH = canvas.width / imgRatio;
      offsetY = (canvas.height - renderH) / 2;
    } else {
      renderH = canvas.height;
      renderW = canvas.height * imgRatio;
      offsetX = (canvas.width - renderW) / 2;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

    // Subtle atmospheric vignette for editorial luxury feel
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, 'rgba(41, 26, 45, 0.45)');
    gradient.addColorStop(0.2, 'rgba(41, 26, 45, 0.0)');
    gradient.addColorStop(0.75, 'rgba(41, 26, 45, 0.05)');
    gradient.addColorStop(1, 'rgba(41, 26, 45, 0.7)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.restore();
  }, []);

  // Frame preloading strategy:
  // 1. Immediately load frame 1 (instant display)
  // 2. Load chapter boundary keyframes (1, 51, 101, 151, 201, 251, 300)
  // 3. Load first 40 frames
  // 4. Progressively load the remaining frames in background batches
  useEffect(() => {
    let isCancelled = false;
    let loadedCount = 0;

    const loadSingleImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        if (imagesRef.current[index]) {
          resolve(imagesRef.current[index]!);
          return;
        }

        const img = new Image();
        img.onload = () => {
          if (isCancelled) return;
          imagesRef.current[index] = img;
          loadedMapRef.current[index] = true;
          loadedCount++;
          const pct = Math.round((loadedCount / TOTAL_FRAMES) * 100);
          setLoadPercentage(pct);

          if (index === 1) {
            setIsInitialReady(true);
            drawFrame(1);
          }
          resolve(img);
        };
        img.onerror = () => {
          // If a frame fails to load, mark resolved to avoid blocking pipeline
          resolve(img);
        };
        img.src = getFrameUrl(index);

        if (img.complete && img.naturalWidth > 0) {
          imagesRef.current[index] = img;
          loadedMapRef.current[index] = true;
          loadedCount++;
          if (index === 1) {
            setIsInitialReady(true);
            drawFrame(1);
          }
          resolve(img);
        }
      });
    };

    // Priority Sequence
    const runPreloadPipeline = async () => {
      // 1. Load First Frame
      await loadSingleImage(1);

      // 2. Load Chapter Keyframe Milestones
      const keyframes = [1, 50, 100, 150, 200, 250, 300];
      await Promise.all(keyframes.map(k => loadSingleImage(k)));

      // 3. Load Chapter 1 Sequence (first 50 frames)
      const ch1Frames = Array.from({ length: 49 }, (_, i) => i + 2);
      await Promise.all(ch1Frames.map(f => loadSingleImage(f)));

      // 4. Progressively load the remaining frames in smooth staggered chunks
      const remaining: number[] = [];
      for (let i = 51; i <= TOTAL_FRAMES; i++) {
        if (!loadedMapRef.current[i]) remaining.push(i);
      }

      const chunkSize = 12;
      for (let i = 0; i < remaining.length; i += chunkSize) {
        if (isCancelled) break;
        const chunk = remaining.slice(i, i + chunkSize);
        await Promise.all(chunk.map(f => loadSingleImage(f)));
        // Yield thread slightly so main UI / scrolling remains buttery 120fps
        await new Promise(r => setTimeout(r, 16));
      }
    };

    runPreloadPipeline();

    return () => {
      isCancelled = true;
    };
  }, [drawFrame]);

  // Sync target frame when scroll position changes
  useEffect(() => {
    if (isPlaying) return; // Don't override while user has hit play reel

    // Calculate frame mapped to global scroll progress or active chapter
    // Chapter-aware continuous interpolation:
    const numChapters = Math.max(1, chapters.length);
    const continuousChapterPos = activeChapter + Math.min(Math.max(chapterProgress, 0), 1);
    const calculatedFrame = Math.round((continuousChapterPos / numChapters) * (TOTAL_FRAMES - 1)) + 1;
    const clampedFrame = Math.min(TOTAL_FRAMES, Math.max(1, calculatedFrame));

    targetFrameRef.current = clampedFrame;
  }, [globalScrollProgress, activeChapter, chapterProgress, isPlaying, chapters.length]);

  // Continuous animation loop for butter-smooth scrubbing (lerp)
  useEffect(() => {
    let isRunning = true;

    const renderLoop = () => {
      if (!isRunning) return;

      const diff = targetFrameRef.current - currentFrameRef.current;
      if (Math.abs(diff) > 0.05) {
        // High-precision smooth easing
        currentFrameRef.current += diff * 0.18;
        drawFrame(currentFrameRef.current);
      } else if (Math.abs(diff) > 0) {
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(currentFrameRef.current);
      }

      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [drawFrame]);

  // Window resize handler to maintain crisp canvas dimensions
  useEffect(() => {
    const handleResize = () => {
      drawFrame(currentFrameRef.current);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // Auto-play Story Reel toggle
  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    } else {
      setIsPlaying(true);
      autoPlayIntervalRef.current = window.setInterval(() => {
        targetFrameRef.current = (targetFrameRef.current % TOTAL_FRAMES) + 1;
        currentFrameRef.current = targetFrameRef.current;
        drawFrame(targetFrameRef.current);

        // Calculate which chapter we are currently in and notify if needed
        const chapterIdx = Math.min(
          chapters.length - 1,
          Math.floor(((targetFrameRef.current - 1) / TOTAL_FRAMES) * chapters.length)
        );
        if (chapterIdx !== activeChapter && onChapterSelect) {
          // optionally align chapter
        }
      }, 1000 / 25); // 25fps reel playback
    }
  };

  useEffect(() => {
    return () => {
      if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    };
  }, []);

  // Replay Current Chapter
  const handleReplayCurrentChapter = () => {
    setIsPlaying(false);
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);
    const range = getChapterFrameRange(activeChapter);
    targetFrameRef.current = range.start;
    currentFrameRef.current = range.start;
    drawFrame(range.start);
  };

  // Interactive scrubber click / drag
  const handleScrubberClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.min(Math.max(clickX / rect.width, 0), 1);
    const selectedFrame = Math.round(progress * (TOTAL_FRAMES - 1)) + 1;

    setIsPlaying(false);
    if (autoPlayIntervalRef.current) clearInterval(autoPlayIntervalRef.current);

    targetFrameRef.current = selectedFrame;
    currentFrameRef.current = selectedFrame;
    drawFrame(selectedFrame);

    // Sync corresponding chapter
    const chapterIdx = Math.min(
      chapters.length - 1,
      Math.floor(progress * chapters.length)
    );
    if (onChapterSelect) {
      onChapterSelect(chapterIdx);
    }
  };

  const handleScrubberMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const hoverX = e.clientX - rect.left;
    const progress = Math.min(Math.max(hoverX / rect.width, 0), 1);
    const hoverFrame = Math.round(progress * (TOTAL_FRAMES - 1)) + 1;
    const chapterIdx = Math.min(
      chapters.length - 1,
      Math.floor(progress * chapters.length)
    );
    const ch = chapters[chapterIdx];

    setScrubberHoverInfo({
      frame: hoverFrame,
      label: ch ? `${ch.num} • ${ch.animationTitle}` : `Frame ${hoverFrame}`,
      x: hoverX
    });
  };

  const handleScrubberMouseLeave = () => {
    setScrubberHoverInfo(null);
  };

  const currentDisplayFrame = Math.round(currentFrameRef.current);
  const currentChapterObj = chapters[activeChapter] || chapters[0];
  const overallPercentage = Math.round((currentDisplayFrame / TOTAL_FRAMES) * 100);

  return (
    <div
      ref={containerRef}
      className={`founder-scroll-canvas-wrapper ${isFullscreen ? 'is-fullscreen' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '24px',
        overflow: 'hidden',
        background: 'linear-gradient(160deg, #1A0D1B 0%, #291A2D 60%, #150A17 100%)',
        boxShadow: '0 24px 60px rgba(26, 13, 27, 0.45), 0 0 0 1px rgba(241, 138, 85, 0.25)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease'
      }}
    >
      {/* Ambient Radial Backlight Glow */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '320px',
          height: '320px',
          background: 'radial-gradient(circle, rgba(241, 138, 85, 0.28) 0%, rgba(200, 185, 232, 0.08) 50%, transparent 75%)',
          filter: 'blur(45px)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      />

      {/* TOP HUD BAR */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'linear-gradient(180deg, rgba(26, 13, 27, 0.85) 0%, rgba(26, 13, 27, 0) 100%)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)'
        }}
      >
        {/* Active Chapter Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#F18A55',
              boxShadow: '0 0 10px #F18A55'
            }}
          />
          <div style={{ textAlign: 'left' }}>
            <span
              style={{
                display: 'block',
                fontSize: '0.68rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#F18A55'
              }}
            >
              CHAPTER {currentChapterObj.num} • {currentChapterObj.animationTitle}
            </span>
            <span
              style={{
                display: 'block',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#FFFFFF',
                opacity: 0.92
              }}
            >
              Gowri Jagadheeshwaran
            </span>
          </div>
        </div>

        {/* Right Tools: Frame Counter & 3D Switch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              color: '#FFFFFF',
              letterSpacing: '0.04em'
            }}
          >
            <span>FRM</span>
            <span style={{ color: '#F18A55', minWidth: '24px' }}>
              {String(currentDisplayFrame).padStart(3, '0')}
            </span>
            <span style={{ opacity: 0.5 }}>/ 300</span>
          </div>

          {has3DMode && onToggle3DMode && (
            <button
              onClick={onToggle3DMode}
              title="Switch to 3D Character Scene"
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: '#FFFFFF',
                padding: '6px 10px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '0.74rem',
                fontWeight: 600,
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(241, 138, 85, 0.3)';
                e.currentTarget.style.borderColor = '#F18A55';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              <Layers size={13} color="#F18A55" />
              <span>3D Scene</span>
            </button>
          )}
        </div>
      </div>

      {/* MAIN CANVAS ELEMENT */}
      <div
        style={{
          position: 'relative',
          flex: 1,
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover'
          }}
        />

        {/* Buffering Indicator if frame 1 is not loaded yet */}
        {!isInitialReady && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#1A0D1B',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              zIndex: 5
            }}
          >
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                border: '3px solid rgba(241, 138, 85, 0.25)',
                borderTopColor: '#F18A55',
                animation: 'spin 0.9s linear infinite'
              }}
            />
            <div style={{ color: '#FFFFFF', fontSize: '0.86rem', fontWeight: 600 }}>
              Buffering Founder Journey... {loadPercentage}%
            </div>
          </div>
        )}

        {/* Scroll Prompt Floating Pill */}
        <div
          style={{
            position: 'absolute',
            bottom: '90px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(26, 13, 27, 0.72)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(241, 138, 85, 0.35)',
            padding: '6px 16px',
            borderRadius: '9999px',
            color: '#FFFFFF',
            fontSize: '0.76rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            pointerEvents: 'none',
            opacity: isHovered ? 0.3 : 0.9,
            transition: 'opacity 0.3s ease',
            zIndex: 8,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
          }}
        >
          <span style={{ color: '#F18A55', fontSize: '0.9rem' }}>↓</span>
          <span>Scroll chapters to advance story frame by frame</span>
        </div>
      </div>

      {/* BOTTOM CONTROLS & SCRUBBER DOCK */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: '16px 20px 18px 20px',
          background: 'linear-gradient(0deg, rgba(26, 13, 27, 0.95) 0%, rgba(26, 13, 27, 0.75) 60%, rgba(26, 13, 27, 0) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px'
        }}
      >
        {/* Interactive Milestone Scrubber Bar */}
        <div
          onClick={handleScrubberClick}
          onMouseMove={handleScrubberMouseMove}
          onMouseLeave={handleScrubberMouseLeave}
          style={{
            position: 'relative',
            width: '100%',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer'
          }}
        >
          {/* Track Base */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              height: '5px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.16)',
              overflow: 'visible'
            }}
          >
            {/* Filled Progress Track */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: `${overallPercentage}%`,
                borderRadius: '9999px',
                background: 'linear-gradient(90deg, #F18A55 0%, #FFA877 100%)',
                boxShadow: '0 0 12px rgba(241, 138, 85, 0.6)'
              }}
            />

            {/* Scrubber Playhead Thumb */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: `${overallPercentage}%`,
                transform: 'translate(-50%, -50%)',
                width: '14px',
                height: '14px',
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '2px solid #F18A55',
                boxShadow: '0 0 10px rgba(241, 138, 85, 0.9)',
                transition: 'transform 0.1s ease'
              }}
            />

            {/* 6 Chapter Milestone Dots */}
            {chapters.map((ch, idx) => {
              const dotPercent = (idx / (chapters.length - 1)) * 100;
              const isPast = dotPercent <= overallPercentage;
              const isCurr = idx === activeChapter;

              return (
                <div
                  key={ch.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onChapterSelect) onChapterSelect(idx);
                  }}
                  title={`Chapter ${ch.num}: ${ch.animationTitle}`}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: `${dotPercent}%`,
                    transform: 'translate(-50%, -50%)',
                    width: isCurr ? '9px' : '6px',
                    height: isCurr ? '9px' : '6px',
                    borderRadius: '50%',
                    background: isCurr ? '#F18A55' : isPast ? '#FFFFFF' : 'rgba(255, 255, 255, 0.35)',
                    border: isCurr ? '2px solid #FFFFFF' : 'none',
                    zIndex: 2,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                />
              );
            })}
          </div>

          {/* Hover Tooltip Popup on Scrubber */}
          {scrubberHoverInfo && (
            <div
              style={{
                position: 'absolute',
                bottom: '26px',
                left: `${scrubberHoverInfo.x}px`,
                transform: 'translateX(-50%)',
                background: '#1A0D1B',
                border: '1px solid #F18A55',
                color: '#FFFFFF',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                pointerEvents: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
                zIndex: 20
              }}
            >
              {scrubberHoverInfo.label}
            </div>
          )}
        </div>

        {/* Action Controls Row */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          {/* Play / Replay Chapter Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={togglePlay}
              className="canvas-ctrl-btn"
              title={isPlaying ? 'Pause Story Reel' : 'Auto-Play Story Reel'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: isPlaying ? 'rgba(241, 138, 85, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                color: isPlaying ? '#F18A55' : '#FFFFFF',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {isPlaying ? <Pause size={13} /> : <Play size={13} fill="#FFFFFF" />}
              <span>{isPlaying ? 'Pause' : 'Play Reel'}</span>
            </button>

            <button
              onClick={handleReplayCurrentChapter}
              className="canvas-ctrl-btn"
              title="Replay this chapter from start"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '0.76rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <RotateCcw size={12} />
              <span>Reset Chapter</span>
            </button>
          </div>

          {/* Chapter Quick Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {chapters.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => onChapterSelect && onChapterSelect(idx)}
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '6px',
                  border: 'none',
                  background: activeChapter === idx ? '#F18A55' : 'rgba(255, 255, 255, 0.08)',
                  color: activeChapter === idx ? '#FFFFFF' : 'rgba(255, 255, 255, 0.65)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.15s ease'
                }}
                title={`Jump to Chapter ${ch.num}: ${ch.animationTitle}`}
              >
                {ch.num}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
