import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Coffee, BookOpen, Users, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useScrollReveal, staggerDelay } from '../../hooks/useScrollReveal';

export const CulturePage: React.FC = () => {
  const [stories, setStories] = useState<any[]>([]);
  const scrollRef = useScrollReveal();

  useEffect(() => {
    fetch('/api/culture')
      .then(res => res.json())
      .then(data => setStories(data))
      .catch(() => {});
  }, []);

  return (
    <div className="culture-page" ref={scrollRef} style={{ paddingTop: '100px' }}>
      {/* Hero */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff', textAlign: 'center' }}>
        <div className="container container-narrow">
          <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>LIFE AT DYGYTALY</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}>
            Work Seriously. Stay Curious. Keep Growing.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-soft-lavender)', maxWidth: '680px', margin: '0 auto' }}>
            At Dygytaly, we believe a good workplace is built on more than deadlines and deliverables.
          </p>
        </div>
      </section>

      {/* Main Philosophy */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container container-narrow">
          <div data-reveal="scale" className="glass-card" style={{ padding: '44px 36px', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '20px' }}>
              At Dygytaly, we believe a good workplace is built on more than deadlines and deliverables.
            </p>
            <p style={{ marginBottom: '20px' }}>
              It's about people who are willing to learn, ideas that are encouraged, challenges that help us improve and a team that works together to make things happen.
            </p>
            <p style={{ margin: 0 }}>
              Whether it's dissecting algorithmic changes over morning espresso, celebrating a client's 10x ROI leap, or spending Friday afternoon testing new AI video models — we create room for genuine curiosity and craft.
            </p>
          </div>
        </div>
      </section>

      {/* Culture Stories Grid */}
      <section className="section-py" style={{ background: 'var(--color-soft-cream)' }}>
        <div className="container">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">OUR RITUALS</span>
            <h2 className="section-title">How We Work & Grow Every Day</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {stories.map((story, i) => (
              <div
                key={story.id}
                data-reveal="up"
                style={{
                  ...staggerDelay(i, 80),
                  padding: '36px 30px'
                }}
                className="glass-card"
              >
                <span className="badge badge-tangerine" style={{ marginBottom: '16px' }}>{story.category}</span>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--color-charcoal)', marginBottom: '14px' }}>{story.title}</h3>
                <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.65' }}>{story.description}</p>
              </div>
            ))}
          </div>

          {/* Core Perks */}
          <div data-reveal="up" style={{ marginTop: '60px', background: 'var(--color-white)', borderRadius: 'var(--radius-lg)', padding: '44px', border: '1px solid var(--border-light)' }}>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--color-charcoal)', marginBottom: '24px', textAlign: 'center' }}>
              What You Can Expect Working Here
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
              {[
                'Honest, constructive feedback culture',
                'Freedom to experiment with modern AI tools',
                'Zero micro-management — ownership-driven work',
                'Freshly brewed artisan coffee daily ☕',
                'Structured learning hours every single week',
                'Direct exposure to diverse regional & global brands'
              ].map((perk, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--color-charcoal)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(168, 181, 154, 0.3)', color: '#2d3b24', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Check size={14} />
                  </div>
                  <span>{perk}</span>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '36px' }}>
              <Link to="/careers" className="btn btn-primary btn-lg">
                Explore Current Career Vacancies <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
