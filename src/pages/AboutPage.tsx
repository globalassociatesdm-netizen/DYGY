import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Compass, Target, HeartHandshake, Eye, ShieldCheck, Sparkles } from 'lucide-react';
import { useScrollReveal, staggerDelay } from '../hooks/useScrollReveal';

export const AboutPage: React.FC = () => {
  const scrollRef = useScrollReveal();

  const values = [
    { title: 'Understand First', desc: 'We ask the right questions and understand the commercial reality behind the brief before proposing a strategy.' },
    { title: 'Think Strategically', desc: 'No random tactics. Every creative campaign and line of software connects directly to measurable business growth.' },
    { title: 'Create With Purpose', desc: 'Design, video and code crafted to command attention, evoke emotion and inspire decisive action.' },
    { title: 'Communicate Honestly', desc: 'Radical transparency with live dashboards, realistic timelines, and truthful performance metrics.' },
    { title: 'Learn Continuously', desc: 'Constantly testing new AI workflows, search algorithm updates, and modern tech architectures.' },
    { title: 'Build Lasting Relationships', desc: 'We act as true long-term partners, investing in your journey well beyond single deliverables.' }
  ];

  return (
    <div className="about-page" ref={scrollRef} style={{ paddingTop: '100px' }}>
      {/* Hero Header */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff' }}>
        <div className="container container-narrow" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>ABOUT DYGYTALY</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            We're Dygytaly. Nice to Meet You.
          </h1>
          <p style={{ fontSize: '1.25rem', color: 'var(--color-soft-lavender)', maxWidth: '680px', margin: '0 auto 30px auto' }}>
            We believe good business deserves good digital thinking.
          </p>
        </div>
      </section>

      {/* Main Editorial Story */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container container-narrow">
          <div data-reveal="scale" className="glass-card" style={{ padding: '48px 40px', fontSize: '1.15rem', lineHeight: '1.85', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '24px' }}>
              Every business starts with an idea. But turning that idea into something people notice, trust and choose takes more than a logo, a website or a few advertisements.
            </p>
            <p style={{ marginBottom: '24px' }}>
              It takes the right strategy, thoughtful creativity, useful technology and people who care about getting the details right.
            </p>
            <p style={{ marginBottom: '24px', fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-deep-plum)' }}>
              That's the thinking behind Dygytaly.
            </p>
            <p style={{ marginBottom: '24px' }}>
              We're a digital marketing and technology agency based in Coimbatore, helping businesses bring their ideas to life through marketing, branding, web development and business technology solutions.
            </p>
            <p style={{ margin: 0 }}>
              We like asking questions before offering answers. We believe in understanding the business behind the brief. And we'd rather recommend what makes sense for you than sell you something you don't need.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-py" style={{ background: 'var(--color-soft-cream)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            <div data-reveal="left" className="glass-card" style={{ padding: '40px', borderLeft: '4px solid var(--color-tangerine)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(241, 138, 85, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-tangerine)' }}>
                  <Compass size={24} />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-charcoal)' }}>Our Mission</h3>
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                "To make businesses better through technology, creativity and practical digital solutions."
              </p>
            </div>

            <div data-reveal="right" className="glass-card" style={{ padding: '40px', borderLeft: '4px solid var(--color-deep-plum)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(69, 36, 63, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-deep-plum)' }}>
                  <Eye size={24} />
                </div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--color-charcoal)' }}>Our Vision</h3>
              </div>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                "To be a trusted long-term digital partner for businesses that want to build stronger brands, work smarter and grow with confidence."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container">
          <div data-reveal style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">WHAT GUIDES US</span>
            <h2 className="section-title">The Values That Shape Our Work</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '26px' }}>
            {values.map((v, i) => (
              <div key={i} className="glass-card" data-reveal style={{ padding: '32px 26px', ...staggerDelay(i, 80) }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <CheckCircle2 size={20} style={{ color: 'var(--color-tangerine)' }} />
                  <h4 style={{ fontSize: '1.15rem', color: 'var(--color-charcoal)' }}>{v.title}</h4>
                </div>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Banner */}
      <section className="section-py" style={{ background: 'var(--color-deep-plum)', color: '#fff', textAlign: 'center' }}>
        <div className="container container-narrow" data-reveal>
          <h2 style={{ fontSize: '2.4rem', color: '#fff', marginBottom: '16px' }}>Let's Build Something Meaningful Together.</h2>
          <p style={{ color: '#cfcacf', fontSize: '1.1rem', marginBottom: '32px' }}>
            We'd love to learn about your business and explore where digital thinking can take you.
          </p>
          <Link to="/contact" className="btn btn-primary btn-lg">
            Let's Catch Up ☕
          </Link>
        </div>
      </section>
    </div>
  );
};
