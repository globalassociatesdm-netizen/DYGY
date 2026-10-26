import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Quote, Coffee, ArrowRight, Sparkles, Award, Heart } from 'lucide-react';
import { Linkedin, Instagram, Facebook } from '../../components/SocialIcons';
import { useScrollReveal, staggerDelay } from '../../hooks/useScrollReveal';

const DEFAULT_FOUNDER = {
  name: 'Gowrishankar',
  designation: 'Founder & Managing Director',
  portrait_url: '/uploads/founder-profile.jpg',
  bio: 'Creative strategist and digital architect passionate about helping ambitious businesses build commanding digital brands and scalable technology systems.',
  full_bio: 'Every business starts with an idea. But turning that idea into something people notice, trust and choose takes more than a logo, a website or a few advertisements. It takes the right strategy, thoughtful creativity, useful technology and people who care about getting the details right. That is the conviction behind Dygytaly. We are here to partner with business leaders who want to think bigger, work smarter and build enduring commercial equity in Coimbatore and beyond.',
  quote: 'I believe businesses deserve more than just vendors. They deserve thoughtful strategies and a partner who truly understands their vision.',
  social_links: {
    linkedin: 'https://www.linkedin.com/company/dygytaly/',
    instagram: 'https://www.instagram.com/dygytaly_official/?hl=en'
  },
  story_points: [
    { number: '01', title: 'Every Big Idea Starts Somewhere.', quote: 'Not with all the answers, but with the courage to begin and the ambition to build something meaningful.' },
    { number: '02', title: 'Built on a Vision. Driven by Possibilities.', quote: 'I believe businesses deserve more than just services. They deserve thoughtful strategies and a partner who understands their vision.' },
    { number: '03', title: 'Turning Ideas Into Action.', quote: 'That belief became the foundation of Dygytaly — bringing marketing, creativity and technology together to help businesses move forward.' },
    { number: '04', title: 'Growth Is Never a One-Person Journey.', quote: 'Behind every milestone are people, lessons, challenges and relationships that make the journey worthwhile.' },
    { number: '05', title: 'Ambition With Accountability.', quote: 'I believe trust is earned through honest conversations, responsible decisions and a commitment to doing the work right.' },
    { number: '06', title: 'The Vision Is Bigger Than Today.', quote: 'My goal is to build Dygytaly into a trusted digital partner that helps businesses think bigger, work smarter and grow with confidence.' },
    { number: '07', title: 'And We\'re Just Getting Started.', quote: 'Every business has a next chapter. If you have a vision you\'re ready to pursue, I\'d love to hear about it.' }
  ]
};

export const FounderPage: React.FC = () => {
  const [founder, setFounder] = useState<any>(DEFAULT_FOUNDER);
  const scrollRef = useScrollReveal();

  useEffect(() => {
    fetch('/api/founder')
      .then(res => res.json())
      .then(data => {
        if (data && data.name) {
          setFounder(data);
        }
      })
      .catch(() => {});
  }, []);

  const storyPoints = (founder?.story_points && founder.story_points.length > 0)
    ? founder.story_points
    : DEFAULT_FOUNDER.story_points;

  return (
    <div className="founder-page" ref={scrollRef} style={{ paddingTop: '100px' }}>
      {/* Hero */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff' }}>
        <div className="container container-narrow" style={{ textAlign: 'center' }}>
          <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>FOUNDER PROFILE</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}>
            Every Vision Has a Story.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-soft-lavender)', maxWidth: '640px', margin: '0 auto' }}>
            Built on a belief that businesses deserve thoughtful strategies and a partner who truly understands their vision.
          </p>
        </div>
      </section>

      {/* Profile Intro */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'center' }}>
            <div data-reveal="left" className="glass-card" style={{ padding: '36px 30px', textAlign: 'center' }}>
              <div className="founder-img-wrapper">
                <img
                  src={founder?.portrait_url || founder?.image_url || '/uploads/founder-profile.jpg'}
                  alt={founder?.name || 'Dygytaly Agency Founder'}
                />
              </div>
              <h2 style={{ fontSize: '1.6rem', color: 'var(--color-charcoal)', marginBottom: '4px' }}>
                {founder?.name || 'Gowrishankar'}
              </h2>
              <p style={{ color: 'var(--color-tangerine)', fontWeight: 600, fontSize: '0.95rem', marginBottom: '18px' }}>
                {founder?.designation || 'Founder & Managing Director'}
              </p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
                <a href={founder?.social_links?.linkedin || 'https://www.linkedin.com/company/dygytaly/'} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <Linkedin size={16} /> LinkedIn
                </a>
                <a href={founder?.social_links?.instagram || 'https://www.instagram.com/dygytaly_official/?hl=en'} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                  <Instagram size={16} /> Instagram
                </a>
              </div>
            </div>

            <div data-reveal="right">
              <span className="eyebrow">THE PHILOSOPHY</span>
              <h3 style={{ fontSize: '2rem', color: 'var(--color-charcoal)', marginBottom: '20px' }}>
                Bridging Creative Strategy with Business Technology
              </h3>
              <p style={{ fontSize: '1.08rem', color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '20px' }}>
                {founder?.full_bio || founder?.bio}
              </p>

              {founder?.quote && (
                <div style={{
                  padding: '24px 28px',
                  background: 'var(--color-soft-cream)',
                  borderLeft: '4px solid var(--color-tangerine)',
                  borderRadius: 'var(--radius-sm)',
                  fontStyle: 'italic',
                  fontSize: '1.05rem',
                  color: 'var(--color-deep-plum)',
                  lineHeight: '1.6',
                  margin: '24px 0'
                }}>
                  <Quote size={24} style={{ color: 'var(--color-tangerine)', marginBottom: '8px' }} />
                  "{founder.quote}"
                </div>
              )}

              <Link to="/contact" className="btn btn-primary">
                <Coffee size={18} /> Let's Catch Up ☕
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 7 Story Points */}
      <section className="section-py" style={{ background: 'var(--color-soft-cream)' }}>
        <div className="container container-narrow">
          <div data-reveal="up" style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">THE 7 MILESTONE PRINCIPLES</span>
            <h2 className="section-title">The Seven Chapters Behind Dygytaly</h2>
          </div>

          <div className="story-timeline" style={{ borderLeftColor: 'var(--color-deep-plum)' }}>
            {storyPoints.map((sp: any, i: number) => (
              <div
                key={sp.number}
                data-reveal="up"
                style={staggerDelay(i, 80)}
                className="story-node"
              >
                <div className="story-number" style={{ color: 'var(--color-deep-plum)' }}>{sp.number}</div>
                <h3 className="story-title" style={{ fontSize: '1.35rem', color: 'var(--color-charcoal)' }}>{sp.title}</h3>
                <p className="story-quote" style={{ fontSize: '1.02rem', color: 'var(--text-secondary)' }}>“{sp.quote}”</p>
              </div>
            ))}
          </div>

          <div data-reveal="scale" style={{ textAlign: 'center', marginTop: '60px' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--color-charcoal)', marginBottom: '12px' }}>
              What's Your Next Big Idea?
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Every business has a next chapter. If you have a vision you're ready to pursue, I'd love to hear about it.
            </p>
            <Link to="/contact" className="btn btn-dark btn-lg">
              Let's Catch Up ☕
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
