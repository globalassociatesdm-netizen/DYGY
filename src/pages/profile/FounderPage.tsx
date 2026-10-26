import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Coffee,
  RotateCcw,
  Compass,
  ArrowUp,
  Heart,
  Quote,
  Target,
  Briefcase,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Linkedin, Instagram } from '../../components/SocialIcons';
import { Founder3DCanvas } from '../../components/founder/Founder3DCanvas';
import { CoffeeCatchUpForm } from '../../components/CoffeeCatchUpForm';
import { SmokeCard } from '@/components/ui/smoke-card';

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
  const [chapterProgress, setChapterProgress] = useState<number>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showCoffeeModal, setShowCoffeeModal] = useState<boolean>(false);
  const storyContainerRef = useRef<HTMLDivElement>(null);

  // Scroll Synchronization & Active Chapter Detection
  useEffect(() => {
    const handleScroll = () => {
      const storyEl = storyContainerRef.current;
      if (!storyEl) return;

      const rect = storyEl.getBoundingClientRect();
      const totalHeight = storyEl.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const globalPercent = Math.min(Math.max(scrolled / (totalHeight || 1), 0), 1);
      setScrollProgress(globalPercent);

      // Check which chapter section is closest to viewport center
      const chapterEls = STORY_CHAPTERS.map(ch => document.getElementById(ch.id));
      const viewportCenter = window.innerHeight * 0.42;

      let closestIdx = 0;
      let minDistance = Infinity;

      chapterEls.forEach((el, idx) => {
        if (!el) return;
        const cRect = el.getBoundingClientRect();
        const dist = Math.abs(cRect.top - viewportCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      setActiveChapter(closestIdx);

      // Chapter-specific progress calculation
      const currentEl = chapterEls[closestIdx];
      if (currentEl) {
        const cRect = currentEl.getBoundingClientRect();
        const chProg = Math.min(Math.max((viewportCenter - cRect.top) / cRect.height, 0), 1);
        setChapterProgress(chProg);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToChapter = (index: number) => {
    const el = document.getElementById(`chapter-${index}`);
    if (el) {
      const targetPos = el.offsetTop - 140;
      window.scrollTo({
        top: targetPos,
        behavior: 'smooth'
      });
      setActiveChapter(index);
    }
  };

  const handleReplayChapter = (index: number) => {
    scrollToChapter(index);
  };

  const handleExploreStory = () => {
    scrollToChapter(0);
  };

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className="storytelling-page">
      {/* Editorial Header Hero with Interactive Smoke Effect */}
      <section className="storytelling-hero" style={{ position: 'relative' }}>
        {/* Interactive Ethereal Smoke Effect Canvas Layer */}
        <SmokeCard
          className="absolute inset-0 w-full h-full bg-transparent border-0 rounded-none pointer-events-auto"
          smokeColor="#F18A55"
          listenToWindow={true}
        />
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2, pointerEvents: 'auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 18px',
              borderRadius: '9999px',
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--color-tangerine)',
              marginBottom: '24px'
            }}
          >
            <Sparkles size={14} />
            DYGYTALY FOUNDER PROFILE • INTERACTIVE STORYBOOK
          </div>

          <h1 className="storytelling-hero-title">
            “A Girl With Dreams Too Big to Stay Dreams.”
          </h1>

          <p className="storytelling-hero-subtitle">
            The interactive journey of <strong>Gowri Jagadheeshwaran</strong> — building Dygytaly Digital Marketing Agency from a solitary desk into a 50-seater private limited agency in Coimbatore.
          </p>

          {/* Quick Founder Badge Card */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '20px',
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(12px)',
              padding: '12px 24px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              marginBottom: '32px'
            }}
          >
            <img
              src="/uploads/founder-profile.jpg"
              alt="Gowri Jagadheeshwaran"
              style={{
                width: '46px',
                height: '52px',
                borderRadius: '50% / 54%',
                objectFit: 'cover',
                border: '2px solid var(--color-tangerine)'
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '0.98rem', fontWeight: 700, color: '#fff' }}>Gowri Jagadheeshwaran</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--color-tangerine)', fontWeight: 600 }}>Founder & Managing Director</div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginLeft: '10px' }}>
              <a
                href="https://www.linkedin.com/company/dygytaly/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                style={{ color: '#fff', opacity: 0.85, padding: '4px' }}
              >
                <Linkedin size={17} />
              </a>
              <a
                href="https://www.instagram.com/dygytaly_official/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                style={{ color: '#fff', opacity: 0.85, padding: '4px' }}
              >
                <Instagram size={17} />
              </a>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <button onClick={handleExploreStory} className="btn btn-primary btn-lg">
              <Compass size={18} /> Explore My Story ↓
            </button>
            <button
              onClick={() => setShowCoffeeModal(true)}
              className="btn btn-outline btn-lg"
              style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
            >
              <Coffee size={18} /> Catch Up Over Coffee ☕
            </button>
          </div>
        </div>
      </section>

      {/* Sticky Chapter Navigation Bar */}
      <div className="chapter-nav-sticky">
        <div className="chapter-progress-line" style={{ width: `${Math.round(scrollProgress * 100)}%` }} />
        <div className="container">
          <div className="chapter-pills-bar">
            {STORY_CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => scrollToChapter(idx)}
                className={`chapter-pill-btn ${activeChapter === idx ? 'active' : ''}`}
                title={`Jump to ${ch.category}`}
              >
                <span className="pill-number">{ch.num}</span>
                <span>{ch.animationTitle}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 50/50 Desktop Storytelling Split Section */}
      <div className="container" ref={storyContainerRef}>
        <div className="storytelling-split">
          {/* LEFT HALF: THE 6 CHAPTERS */}
          <div className="story-left-col">
            {STORY_CHAPTERS.map((chapter, idx) => {
              const isActive = activeChapter === idx;
              return (
                <article
                  key={chapter.id}
                  id={chapter.id}
                  className="chapter-section"
                  style={{
                    opacity: isActive ? 1 : 0.72,
                    transform: isActive ? 'scale(1)' : 'scale(0.985)',
                    transition: 'all 0.35s ease'
                  }}
                >
                  <div className={`chapter-card-box ${isActive ? 'active-card' : ''}`}>
                    {/* Chapter Metadata Tag */}
                    <div className="chapter-meta-tag">
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          background: 'var(--color-tangerine)'
                        }}
                      />
                      CHAPTER {chapter.num} — {chapter.category}
                    </div>

                    {/* Editorial Headline */}
                    <h2 className="chapter-headline">{chapter.headline}</h2>

                    {/* Emotional Narrative Paragraphs */}
                    <div className="chapter-paragraphs">
                      {chapter.paragraphs.map((p, pIdx) => (
                        <p key={pIdx}>{p}</p>
                      ))}
                    </div>

                    {/* Memorable Highlighted Sentence Quote */}
                    <div className="chapter-highlight-quote">
                      <Quote
                        size={22}
                        style={{
                          color: 'var(--color-tangerine)',
                          marginBottom: '8px',
                          opacity: 0.9
                        }}
                      />
                      <p>“{chapter.highlightQuote}”</p>
                    </div>

                    {/* "What This Means For You" Client Connection */}
                    <div className="chapter-client-connection">
                      <span className="chapter-client-badge">FOR YOU</span>
                      <p className="chapter-client-text">{chapter.clientConnection}</p>
                    </div>

                    {/* Chapter Action Controls */}
                    <div className="chapter-action-bar">
                      <button
                        onClick={() => handleReplayChapter(idx)}
                        className="btn-replay-chapter"
                        title="Replay visual 3D animation for this chapter"
                      >
                        <RotateCcw size={14} /> Replay this chapter
                      </button>

                      {idx < STORY_CHAPTERS.length - 1 ? (
                        <button
                          onClick={() => scrollToChapter(idx + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-charcoal)',
                            fontWeight: 600,
                            fontSize: '0.86rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          Next: {STORY_CHAPTERS[idx + 1].animationTitle} <ChevronRight size={16} />
                        </button>
                      ) : (
                        <button
                          onClick={handleBackToTop}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--color-tangerine)',
                            fontWeight: 700,
                            fontSize: '0.86rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <ArrowUp size={15} /> Back to beginning
                        </button>
                      )}
                    </div>

                    {/* Final Chapter 6 Climax Invitation & CTA */}
                    {idx === 5 && (
                      <div className="final-climax-box">
                        <img
                          src="/logo.png"
                          alt="Dygytaly Logo"
                          style={{
                            width: '48px',
                            height: '48px',
                            objectFit: 'contain',
                            margin: '0 auto 16px auto',
                            filter: 'brightness(0) invert(1)'
                          }}
                        />
                        <h3>Welcome to Dygytaly.</h3>
                        <p>
                          Let's build something beautiful. Let's grow together. Tell me what you're building, where you want to go, and what growth means to you. Let's explore the possibilities together.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', alignItems: 'center' }}>
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
                            className="btn btn-outline btn-sm"
                            style={{ borderColor: 'rgba(255,255,255,0.4)', color: '#fff' }}
                          >
                            <Coffee size={15} /> Catch Up Over Coffee ☕
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>

          {/* RIGHT HALF: PERSISTENT 3D ANIMATED FOUNDER JOURNEY */}
          <aside className="story-right-col" aria-label="Interactive 3D Founder Character Scene">
            <Founder3DCanvas
              activeChapter={activeChapter}
              chapterProgress={chapterProgress}
              onChapterSelect={scrollToChapter}
            />
          </aside>
        </div>
      </div>

      {/* Coffee Catch Up Modal */}
      {showCoffeeModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            background: 'rgba(41, 26, 45, 0.75)',
            backdropFilter: 'blur(8px)',
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
              <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>DIRECT LEADERSHIP CONNECTION</span>
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
