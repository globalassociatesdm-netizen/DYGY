import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Coffee,
  Quote,
  Target,
  Briefcase,
  Compass,
  ArrowDown,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import { Linkedin, Instagram } from '../../components/SocialIcons';
import { CoffeeCatchUpForm } from '../../components/CoffeeCatchUpForm';

interface StoryChapter {
  id: string;
  num: string;
  category: string;
  headline: string;
  paragraphs: string[];
  highlightQuote: string;
  clientConnection: string;
  animationTitle: string;
}

const TOTAL_FRAMES = 300;
const PRIMARY_PATH = '/founder-frames/ezgif-frame-';
const FALLBACK_PATH = '/ezgif-45d741942d5b1211-jpg/ezgif-frame-';
const STATIC_FALLBACK_PORTRAIT = '/uploads/founder-profile.jpg';

const getFrameUrl = (frameIndex: number, useFallback = false): string => {
  const clamped = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(frameIndex)));
  const padded = String(clamped).padStart(3, '0');
  return `${useFallback ? FALLBACK_PATH : PRIMARY_PATH}${padded}.jpg`;
};

const STORY_CHAPTERS: StoryChapter[] = [
  {
    id: 'chapter-0',
    num: '01',
    category: 'THE ORIGIN • THE DREAMER',
    headline: '“I didn\'t have the entire map. I just had the desire to begin.”',
    paragraphs: [
      'I wanted more than a career. I wanted independence, purpose, and the freedom to create a life of my own.',
      'I didn\'t have every answer. But I knew I wanted to build something that reflected my ambitions, my values, and the woman I was becoming.'
    ],
    highlightQuote: 'Every meaningful journey begins with the courage to start.',
    clientConnection: 'A founder who understands that every big business starts with a dream and a first step.',
    animationTitle: 'The Dreamer'
  },
  {
    id: 'chapter-1',
    num: '02',
    category: 'THE IDENTITY • THE VISIONARY',
    headline: '“I wanted to create my own table.”',
    paragraphs: [
      'I wanted to build something with my ideas, my identity, and my values behind it.',
      'To make my family proud. To work towards becoming the first millionaire in my family.',
      'And to show other women that they don\'t have to wait until they\'re ready to start building the life they imagine.',
      'My dream was never just about success. It was about creating possibilities — for myself and for others.'
    ],
    highlightQuote: 'Ambition becomes more meaningful when it creates opportunities beyond you.',
    clientConnection: 'A partner who wants to understand your vision, recognise your potential, and help you explore what\'s possible for your brand.',
    animationTitle: 'The Visionary'
  },
  {
    id: 'chapter-2',
    num: '03',
    category: 'THE MOMENTUM • THE BUILDER',
    headline: '“From one client to a bigger vision.”',
    paragraphs: [
      'Dygytaly began with freelancing. Then came a small office, a small team, bigger responsibilities, and even bigger dreams.',
      'Eventually, the journey grew into a private limited company with a 50-seater office.',
      'It didn\'t happen overnight. I built without having everything figured out, learning and adapting with every step.',
      'One decision at a time. One challenge at a time. One dream getting closer to reality.'
    ],
    highlightQuote: 'Growth is built, one decision at a time.',
    clientConnection: 'A growth-minded partner who understands the importance of building steadily, making thoughtful decisions, and working towards meaningful progress.',
    animationTitle: 'The Builder'
  },
  {
    id: 'chapter-3',
    num: '04',
    category: 'THE EVOLUTION • THE EXPLORER',
    headline: '“The goal isn\'t to know everything. It\'s to never stop becoming better.”',
    paragraphs: [
      'The world changes. Industries evolve. New revolutions arrive.',
      'I want to keep learning, creating, and adapting — not just to keep up with change, but to discover what becomes possible because of it.',
      'I believe growth belongs to those who remain curious enough to learn and brave enough to evolve.'
    ],
    highlightQuote: 'Keep learning. Keep creating. Keep evolving.',
    clientConnection: 'A partner who values fresh thinking, evolving digital strategies, and opportunities to help your business stay relevant.',
    animationTitle: 'The Explorer'
  },
  {
    id: 'chapter-4',
    num: '05',
    category: 'THE INTEGRITY • THE DETERMINED FOUNDER',
    headline: '“A little greedy. A lot determined.”',
    paragraphs: [
      'Dygytaly is the beginning of a girl who is a little greedy — greedy for experiences, growth, possibilities, and a life as big as her dreams.',
      'A girl who pats herself on the shoulder when things get difficult. Who picks herself up when she falls. Who keeps believing, even when the next step isn\'t obvious.',
      'And one thing she takes seriously? A promise.',
      'Especially a promise made to a client.',
      'Because growth means more when it\'s built on trust.'
    ],
    highlightQuote: 'Growth means more when it\'s built on trust.',
    clientConnection: 'A founder who believes that commitments matter, communication matters, and the trust behind every business relationship deserves respect.',
    animationTitle: 'The Determined Founder'
  },
  {
    id: 'chapter-5',
    num: '06',
    category: 'THE HORIZON • LOOKING FORWARD',
    headline: '“The story is still being written.”',
    paragraphs: [
      'I\'m still building the company, the life, and the identity I once only imagined.',
      'There are more dreams to chase, more women to inspire, more people to meet, and more meaningful things to create.',
      'This isn\'t the final chapter. It\'s the beginning of everything that could be.',
      'And perhaps our stories are meant to cross paths here.'
    ],
    highlightQuote: 'Let\'s become a chapter in each other\'s stories.',
    clientConnection: 'A collaborative leadership team ready to understand your commercial ambitions and build enduring digital market share.',
    animationTitle: 'Looking Forward'
  }
];

export const FounderPage: React.FC = () => {
  const [activeChapter, setActiveChapter] = useState<number>(0);
  const [isInitialReady, setIsInitialReady] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [loadedCount, setLoadedCount] = useState<number>(0);
  const [showCoffeeModal, setShowCoffeeModal] = useState<boolean>(false);

  const experienceRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const threadFillRef = useRef<HTMLDivElement | null>(null);
  const frameCounterRef = useRef<HTMLSpanElement | null>(null);

  // 300 Image Frames Cache
  const imagesRef = useRef<(HTMLImageElement | null)[]>(new Array(TOTAL_FRAMES + 1).fill(null));
  const loadedFlagsRef = useRef<boolean[]>(new Array(TOTAL_FRAMES + 1).fill(false));
  const fallbackImgRef = useRef<HTMLImageElement | null>(null);

  const currentFrameRef = useRef<number>(1);
  const targetFrameRef = useRef<number>(1);
  const activeChapterRef = useRef<number>(0);
  const animFrameIdRef = useRef<number | null>(null);
  const isUserScrollingRef = useRef<boolean>(false);
  const scrollTimeoutRef = useRef<number | null>(null);

  // Load static fallback portrait as insurance
  useEffect(() => {
    const portrait = new Image();
    portrait.onload = () => {
      fallbackImgRef.current = portrait;
      if (!loadedFlagsRef.current[1]) {
        drawFrame(1);
      }
    };
    portrait.src = STATIC_FALLBACK_PORTRAIT;
  }, []);

  // Helper to retrieve nearest loaded frame
  const getNearestLoadedFrame = (target: number): HTMLImageElement | null => {
    const clamped = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(target)));
    if (loadedFlagsRef.current[clamped] && imagesRef.current[clamped]?.naturalWidth) {
      return imagesRef.current[clamped];
    }
    // Search outward for nearest buffered frame
    for (let offset = 1; offset < 45; offset++) {
      const prev = clamped - offset;
      if (prev >= 1 && loadedFlagsRef.current[prev] && imagesRef.current[prev]?.naturalWidth) {
        return imagesRef.current[prev];
      }
      const next = clamped + offset;
      if (next <= TOTAL_FRAMES && loadedFlagsRef.current[next] && imagesRef.current[next]?.naturalWidth) {
        return imagesRef.current[next];
      }
    }
    // Search any loaded frame
    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      if (loadedFlagsRef.current[i] && imagesRef.current[i]?.naturalWidth) {
        return imagesRef.current[i];
      }
    }
    return fallbackImgRef.current;
  };

  // High-DPI Canvas Rendering
  const drawFrame = useCallback((frameNum: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = getNearestLoadedFrame(frameNum);
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const fallbackW = canvas.parentElement?.clientWidth || window.innerWidth * 0.5;
    const fallbackH = canvas.parentElement?.clientHeight || window.innerHeight;
    const targetW = Math.round((rect.width > 10 ? rect.width : fallbackW) * dpr);
    const targetH = Math.round((rect.height > 10 ? rect.height : fallbackH) * dpr);

    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW;
      canvas.height = targetH;
    }

    try {
      ctx.save();
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Cover math: preserve natural proportions without distortion
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

      ctx.drawImage(img, offsetX, offsetY, renderW, renderH);

      // Luxury right edge blend: dissolves image into dark background (#140916)
      const rightEdge = ctx.createLinearGradient(canvas.width * 0.72, 0, canvas.width, 0);
      rightEdge.addColorStop(0, 'rgba(20, 9, 22, 0)');
      rightEdge.addColorStop(0.55, 'rgba(20, 9, 22, 0.45)');
      rightEdge.addColorStop(1, 'rgba(20, 9, 22, 0.98)');
      ctx.fillStyle = rightEdge;
      ctx.fillRect(canvas.width * 0.7, 0, canvas.width * 0.3, canvas.height);

      // Top and bottom cinematic vignette
      const vertVignette = ctx.createLinearGradient(0, 0, 0, canvas.height);
      vertVignette.addColorStop(0, 'rgba(20, 9, 22, 0.65)');
      vertVignette.addColorStop(0.12, 'rgba(20, 9, 22, 0)');
      vertVignette.addColorStop(0.85, 'rgba(20, 9, 22, 0.15)');
      vertVignette.addColorStop(1, 'rgba(20, 9, 22, 0.92)');
      ctx.fillStyle = vertVignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.restore();
    } catch (err) {
      // Safe boundary
    }
  }, []);

  // Frame preloader pipeline
  useEffect(() => {
    let isCancelled = false;
    let loadedCountLocal = 0;

    const loadSingle = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        if (loadedFlagsRef.current[index]) {
          resolve();
          return;
        }

        const img = new Image();
        img.onload = () => {
          if (isCancelled) return;
          imagesRef.current[index] = img;
          loadedFlagsRef.current[index] = true;
          loadedCountLocal++;
          if (loadedCountLocal % 10 === 0 || loadedCountLocal === TOTAL_FRAMES) {
            setLoadedCount(loadedCountLocal);
          }

          if (index === 1 || !isInitialReady) {
            setIsInitialReady(true);
            drawFrame(index);
          }
          resolve();
        };

        img.onerror = () => {
          // Attempt fallback path
          const fallback = new Image();
          fallback.onload = () => {
            if (isCancelled) return;
            imagesRef.current[index] = fallback;
            loadedFlagsRef.current[index] = true;
            loadedCountLocal++;
            if (index === 1 || !isInitialReady) {
              setIsInitialReady(true);
              drawFrame(index);
            }
            resolve();
          };
          fallback.onerror = () => {
            resolve(); // do not block pipeline
          };
          fallback.src = getFrameUrl(index, true);
        };

        img.src = getFrameUrl(index, false);

        // If already cached and complete
        if (img.complete && img.naturalWidth > 0) {
          imagesRef.current[index] = img;
          loadedFlagsRef.current[index] = true;
          loadedCountLocal++;
          if (index === 1) {
            setIsInitialReady(true);
            drawFrame(1);
          }
          resolve();
        }
      });
    };

    // Priority 1: Load critical milestone keyframes first
    const criticalIndices = [
      1, 10, 25, 40, 50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300
    ];

    Promise.all(criticalIndices.map(loadSingle)).then(() => {
      if (isCancelled) return;
      setIsInitialReady(true);
      drawFrame(currentFrameRef.current);

      // Priority 2: Stagger remaining frames in background chunks of 15
      let cur = 1;
      const loadNextChunk = () => {
        if (isCancelled || cur > TOTAL_FRAMES) return;
        const chunk: Promise<void>[] = [];
        for (let b = 0; b < 15 && cur <= TOTAL_FRAMES; b++, cur++) {
          if (!loadedFlagsRef.current[cur]) {
            chunk.push(loadSingle(cur));
          }
        }
        Promise.all(chunk).then(() => {
          if (!isCancelled && cur <= TOTAL_FRAMES) {
            setTimeout(loadNextChunk, 20);
          }
        });
      };
      loadNextChunk();
    });

    // Safety timeout: ensure loader clears after 600ms even on slow networks
    const readyTimer = setTimeout(() => {
      if (!isCancelled) {
        setIsInitialReady(true);
        drawFrame(1);
      }
    }, 600);

    return () => {
      isCancelled = true;
      clearTimeout(readyTimer);
    };
  }, [drawFrame]);

  // Main 25FPS Continuous Reel & Smooth Scrub Loop
  useEffect(() => {
    let isRunning = true;
    let lastTime = performance.now();
    const fps = 25;
    const interval = 1000 / fps;

    const animLoop = (now: number) => {
      if (!isRunning) return;

      const delta = now - lastTime;

      if (isPlaying && !isUserScrollingRef.current) {
        // Continuous auto-play reel
        if (delta >= interval) {
          lastTime = now - (delta % interval);
          targetFrameRef.current = (targetFrameRef.current % TOTAL_FRAMES) + 1;
          currentFrameRef.current = targetFrameRef.current;
          drawFrame(currentFrameRef.current);

          // Update active chapter ONLY when chapter index changes
          const chIdx = Math.min(
            STORY_CHAPTERS.length - 1,
            Math.floor(((targetFrameRef.current - 1) / TOTAL_FRAMES) * STORY_CHAPTERS.length)
          );
          if (chIdx !== activeChapterRef.current) {
            activeChapterRef.current = chIdx;
            setActiveChapter(chIdx);
          }

          // Direct DOM updates for ultra-smooth UI without React re-render thrashing
          const pct = Math.round(((targetFrameRef.current - 1) / (TOTAL_FRAMES - 1)) * 100);
          if (threadFillRef.current) {
            threadFillRef.current.style.height = `${pct}%`;
          }
          if (frameCounterRef.current) {
            frameCounterRef.current.textContent = `FRM ${String(Math.round(currentFrameRef.current)).padStart(3, '0')}`;
          }
        }
      } else {
        // Smooth scroll interpolation (scrubbing)
        const diff = targetFrameRef.current - currentFrameRef.current;
        if (Math.abs(diff) > 0.05) {
          currentFrameRef.current += diff * 0.24;
          drawFrame(currentFrameRef.current);
          if (frameCounterRef.current) {
            frameCounterRef.current.textContent = `FRM ${String(Math.round(currentFrameRef.current)).padStart(3, '0')}`;
          }
        } else if (Math.abs(diff) > 0) {
          currentFrameRef.current = targetFrameRef.current;
          drawFrame(currentFrameRef.current);
          if (frameCounterRef.current) {
            frameCounterRef.current.textContent = `FRM ${String(Math.round(currentFrameRef.current)).padStart(3, '0')}`;
          }
        }
      }

      animFrameIdRef.current = requestAnimationFrame(animLoop);
    };

    animFrameIdRef.current = requestAnimationFrame(animLoop);

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isPlaying, drawFrame]);

  // Scroll Synchronization Handler
  useEffect(() => {
    const handleScroll = () => {
      isUserScrollingRef.current = true;
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
      // Resume autoplay 1.2s after user stops scrolling
      scrollTimeoutRef.current = window.setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 1200);

      const container = experienceRef.current;
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const totalDist = container.offsetHeight - window.innerHeight;
      if (totalDist <= 0) return;

      const scrolled = Math.max(0, -rect.top);
      const prog = Math.min(1, Math.max(0, scrolled / totalDist));
      const targetFrame = Math.min(TOTAL_FRAMES, Math.max(1, Math.round(1 + prog * (TOTAL_FRAMES - 1))));

      targetFrameRef.current = targetFrame;

      if (threadFillRef.current) {
        threadFillRef.current.style.height = `${Math.round(prog * 100)}%`;
      }

      const chapterIdx = Math.min(
        STORY_CHAPTERS.length - 1,
        Math.floor(prog * STORY_CHAPTERS.length)
      );
      if (chapterIdx !== activeChapterRef.current) {
        activeChapterRef.current = chapterIdx;
        setActiveChapter(chapterIdx);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', () => drawFrame(currentFrameRef.current));

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [drawFrame]);

  const currentChapter = STORY_CHAPTERS[activeChapter] || STORY_CHAPTERS[0];

  return (
    <div className="founder-story-page">
      {/* Main 50/50 Continuous Storytelling Container */}
      <div className="founder-story-container founder-experience-container" ref={experienceRef}>
        
        {/* LEFT COLUMN: Sticky Founder Story Visual Narrative */}
        <div className="founder-visual-column" aria-label="Founder Story Visual Narrative">
          {/* Slender vertical progress thread */}
          <div className="founder-scroll-thread">
            <div
              ref={threadFillRef}
              className="founder-scroll-thread-fill"
              style={{ height: '0%' }}
            />
          </div>

          {/* Minimal Documentary HUD Overlay: Top */}
          <div className="founder-visual-hud-top">
            <div className="founder-hud-dot" />
            <span className="founder-hud-title">
              CHAPTER {currentChapter.num} / 06 • {currentChapter.animationTitle}
            </span>
          </div>

          {/* Canvas Rendering Area */}
          <canvas ref={canvasRef} className="founder-story-canvas" />

          {/* Initial Loading State: Soft transparent spinner that never blocks view */}
          {!isInitialReady && (
            <div className="founder-canvas-loader">
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: '3px solid rgba(241, 138, 85, 0.25)',
                  borderTopColor: '#F18A55',
                  animation: 'spin 0.8s linear infinite'
                }}
              />
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#FFFFFF' }}>
                Preparing Founder Odyssey...
              </span>
            </div>
          )}

          {/* Interactive Play/Pause & Frame Counter Pill in HUD */}
          <div
            style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              zIndex: 25,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              style={{
                background: 'rgba(20, 9, 22, 0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(241, 138, 85, 0.4)',
                borderRadius: '9999px',
                padding: '6px 14px',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)'
              }}
              title={isPlaying ? 'Pause Animation' : 'Play Animation'}
            >
              {isPlaying ? <Pause size={12} color="#F18A55" /> : <Play size={12} fill="#F18A55" color="#F18A55" />}
              <span>{isPlaying ? 'Playing' : 'Paused'}</span>
            </button>

            <div
              style={{
                background: 'rgba(20, 9, 22, 0.75)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '9999px',
                padding: '6px 12px',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                letterSpacing: '0.04em'
              }}
            >
              <span ref={frameCounterRef} style={{ color: '#F18A55' }}>FRM 001</span>
              <span style={{ opacity: 0.5 }}>/300</span>
            </div>
          </div>

          {/* Minimal Documentary HUD Overlay: Bottom */}
          <div className="founder-visual-hud-bottom">
            <div className="founder-hud-name">Gowri Jagadheeshwaran</div>
            <div className="founder-hud-role">Founder & Managing Director, Dygytaly Agency</div>
          </div>
        </div>

        {/* RIGHT COLUMN: Full-Page Vertically Scrolling Narrative */}
        <div className="founder-narrative-column">
          
          {/* Editorial Opening Header Block */}
          <header className="founder-narrative-header">
            <h1 className="founder-lead-title">
              “A Girl With Dreams Too Big to Stay Dreams.”
            </h1>

            <p className="founder-lead-desc">
              The continuous interactive journey of <strong>Gowri Jagadheeshwaran</strong> — building Dygytaly Digital Marketing Agency from a solitary desk into a 50-seater private limited agency in Coimbatore.
            </p>

            {/* Quick credentials */}
            <div className="founder-meta-tags-row">
              <span className="founder-meta-chip">50-Seater Agency HQ</span>
              <span className="founder-meta-chip">Coimbatore, Tamil Nadu</span>
              <span className="founder-meta-chip">First-Gen Founder</span>
            </div>

            {/* LinkedIn & Instagram on the same line */}
            <div className="founder-social-row">
              <a
                href="https://www.linkedin.com/company/dygytaly/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Founder LinkedIn"
                className="founder-social-pill"
              >
                <Linkedin size={16} />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://www.instagram.com/dygytaly_official/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Dygytaly Instagram"
                className="founder-social-pill"
              >
                <Instagram size={16} />
                <span>Instagram</span>
              </a>
            </div>
          </header>

          {/* The 6 Story Chapters */}
          {STORY_CHAPTERS.map((chapter, idx) => {
            const isActive = activeChapter === idx;
            return (
              <section
                key={chapter.id}
                id={chapter.id}
                className={`founder-chapter-block ${isActive ? 'is-active' : ''}`}
              >
                {/* Chapter Eyebrow Tag */}
                <div className="chapter-badge-tag">
                  <div className="chapter-number-circle">{chapter.num}</div>
                  <span>CHAPTER {chapter.num} — {chapter.category}</span>
                </div>

                {/* Editorial Headline */}
                <h2 className="chapter-editorial-headline">{chapter.headline}</h2>

                {/* Narrative Paragraphs */}
                <div className="chapter-body-paragraphs">
                  {chapter.paragraphs.map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}
                </div>

                {/* Highlight Quote */}
                <div className="chapter-pull-quote-box">
                  <Quote
                    size={24}
                    style={{
                      color: 'var(--color-tangerine)',
                      marginBottom: '10px',
                      opacity: 0.95
                    }}
                  />
                  <p>“{chapter.highlightQuote}”</p>
                </div>

                {/* Client Connection */}
                <div className="chapter-for-you-card">
                  <span className="chapter-for-you-badge">FOR YOU</span>
                  <p className="chapter-for-you-text">{chapter.clientConnection}</p>
                </div>
              </section>
            );
          })}

          {/* Final Chapter Climax & Invitation */}
          <section className="founder-story-climax">
            <div className="founder-climax-card">
              <h2>Welcome to Dygytaly.</h2>
              <p>
                Let's build something beautiful. Let's grow together. Tell me what you're building, where you want to go, and what growth means to you. Let's explore the possibilities together.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <Link
                  to="/contact"
                  className="btn btn-primary btn-lg"
                  style={{
                    padding: '16px 36px',
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    letterSpacing: '0.04em'
                  }}
                >
                  LET'S GROW TOGETHER →
                </Link>

                <button
                  onClick={() => setShowCoffeeModal(true)}
                  className="btn btn-outline btn-lg"
                  style={{ borderColor: 'rgba(255, 255, 255, 0.4)', color: '#FFFFFF' }}
                >
                  <Coffee size={18} /> Catch Up Over Coffee ☕
                </button>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Coffee Catch Up Modal */}
      {showCoffeeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2000,
            background: 'rgba(20, 9, 22, 0.85)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCoffeeModal(false);
          }}
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              maxWidth: '680px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '36px',
              boxShadow: 'var(--shadow-xl)',
              position: 'relative'
            }}
          >
            <button
              onClick={() => setShowCoffeeModal(false)}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(69, 36, 63, 0.08)',
                border: 'none',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                fontSize: '18px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              aria-label="Close modal"
            >
              ✕
            </button>

            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>
                DIRECT LEADERSHIP CONNECTION
              </span>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)', marginTop: '6px' }}>
                Let's Catch Up Over Coffee ☕
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Connect directly with Gowri Jagadheeshwaran and the Dygytaly strategy team. No hard sells, no jargon — just clarity for your business.
              </p>
            </div>

            <CoffeeCatchUpForm defaultService="General Consultation" />
          </div>
        </div>
      )}
    </div>
  );
};

export default FounderPage;
