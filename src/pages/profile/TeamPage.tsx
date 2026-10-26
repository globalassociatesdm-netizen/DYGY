import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Linkedin } from '../../components/SocialIcons';
import { useScrollReveal, staggerDelay } from '../../hooks/useScrollReveal';

export const TeamPage: React.FC = () => {
  const [team, setTeam] = useState<any[]>([]);
  const scrollRef = useScrollReveal();

  useEffect(() => {
    fetch('/api/team')
      .then(res => res.json())
      .then(data => setTeam(data))
      .catch(() => {});
  }, []);

  return (
    <div className="team-page" ref={scrollRef} style={{ paddingTop: '100px' }}>
      {/* Hero */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff', textAlign: 'center' }}>
        <div className="container container-narrow">
          <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>OUR PEOPLE</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}>
            Good Work Happens When Good People Come Together.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-soft-lavender)', maxWidth: '680px', margin: '0 auto' }}>
            Different skills. Different perspectives. One team moving in the same direction.
          </p>
        </div>
      </section>

      {/* Intro Editorial */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container container-narrow">
          <div data-reveal="scale" className="glass-card" style={{ padding: '36px 32px', textAlign: 'center', fontSize: '1.08rem', lineHeight: '1.75', color: 'var(--text-secondary)' }}>
            <p>
              Behind every campaign, website, creative and digital solution is a team of people bringing ideas, expertise and effort together. We believe good teamwork begins with communication, grows through collaboration and gets stronger when everyone takes ownership of their work.
            </p>
          </div>
        </div>
      </section>

      {/* Team Grid */}
      <section className="section-py" style={{ background: 'var(--color-soft-cream)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
            {team.map((member, i) => (
              <div
                key={member.id}
                data-reveal="up"
                style={{
                  ...staggerDelay(i, 80),
                  padding: '32px 26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
                className="glass-card"
              >
                <div>
                  <div style={{
                    width: '100%',
                    height: '200px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--color-aubergine)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px',
                    overflow: 'hidden'
                  }}>
                    <img
                      src={member.image_url || '/uploads/dygytaly-logo.png'}
                      alt={member.name}
                      style={{ maxHeight: '110px', objectFit: 'contain' }}
                    />
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'var(--color-charcoal)', marginBottom: '4px' }}>
                    {member.name}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--color-tangerine)', fontWeight: 600, marginBottom: '14px' }}>
                    {member.designation}
                  </p>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                    {member.bio}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="badge badge-sage" style={{ fontSize: '0.72rem' }}>
                    {member.expertise}
                  </span>
                  {member.linkedin_url && (
                    <a
                      href={member.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: 'var(--color-deep-plum)', display: 'inline-flex', alignItems: 'center' }}
                      aria-label={`${member.name} LinkedIn`}
                    >
                      <Linkedin size={18} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div data-reveal="scale" style={{ textAlign: 'center', marginTop: '60px' }}>
            <h3 style={{ fontSize: '1.6rem', color: 'var(--color-charcoal)', marginBottom: '12px' }}>
              Want to join our growing team in Coimbatore?
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
              We are constantly seeking ambitious creators, marketers, and developers.
            </p>
            <Link to="/careers" className="btn btn-primary">
              View Open Opportunities <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
