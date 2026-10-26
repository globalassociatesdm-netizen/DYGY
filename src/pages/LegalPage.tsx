import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const LegalPage: React.FC = () => {
  const location = useLocation();
  const slug = location.pathname.includes('privacy') ? 'privacy' : 'terms';
  const [page, setPage] = useState<any>(null);
  const scrollRef = useScrollReveal();

  useEffect(() => {
    fetch(`/api/pages/${slug}`)
      .then(res => res.json())
      .then(data => setPage(data))
      .catch(() => {});
  }, [slug]);

  const isPrivacy = slug === 'privacy';

  return (
    <div className="legal-page" ref={scrollRef} style={{ paddingTop: '100px' }}>
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff', textAlign: 'center' }}>
        <div className="container container-narrow">
          <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>
            {isPrivacy ? 'DATA & PRIVACY' : 'LEGAL & TERMS'}
          </span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 4.5vw, 3.6rem)' }}>
            {page?.heading || (isPrivacy ? 'Privacy Policy' : 'Terms and Conditions')}
          </h1>
          <p style={{ color: 'var(--color-soft-lavender)', fontSize: '1.1rem' }}>
            {page?.subheading || 'Last updated: 2026. Dygytaly Digital Marketing Agency.'}
          </p>
        </div>
      </section>

      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container container-narrow">
          <div data-reveal="scale" className="glass-card" style={{ padding: '48px 40px', fontSize: '1.05rem', lineHeight: '1.85', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '24px' }}>
              {page?.content || 'Dygytaly is committed to maintaining high standards of data security, transparent client agreements, and protecting personal user privacy.'}
            </p>

            {isPrivacy ? (
              <>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-charcoal)', marginTop: '30px', marginBottom: '12px' }}>
                  1. Information We Collect
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  When you submit an enquiry, book a consultation, or apply for an open job role, we collect personal information including your full name, email address, phone number, company name, and project description. For job applications, we additionally receive your resume and professional portfolio links.
                </p>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-charcoal)', marginTop: '30px', marginBottom: '12px' }}>
                  2. How We Use Your Data
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  Your information is used solely to respond to your inquiry, schedule discovery catch-ups, deliver agreed digital marketing and software engineering services, and communicate project milestones. We never sell, rent, or trade your personal information with third-party marketing brokers.
                </p>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-charcoal)', marginTop: '30px', marginBottom: '12px' }}>
                  3. Cookies and Analytics
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  We use cookies and industry-standard analytics tools (such as Google Analytics 4) to monitor aggregate website traffic, optimize page loading speed, and enhance visitor experience. You can choose to disable cookies through your browser settings at any time.
                </p>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-charcoal)', marginTop: '30px', marginBottom: '12px' }}>
                  4. Data Security & Storage
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  We implement robust database encryption, authenticated server endpoints, and access control policies to safeguard your submissions against unauthorized disclosure or loss.
                </p>
              </>
            ) : (
              <>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-charcoal)', marginTop: '30px', marginBottom: '12px' }}>
                  1. Acceptance of Terms
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  By accessing and using this website, you agree to comply with and be bound by these Terms and Conditions. If you disagree with any part of these terms, please do not use our website.
                </p>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-charcoal)', marginTop: '30px', marginBottom: '12px' }}>
                  2. Intellectual Property Rights
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  Unless otherwise stated, Dygytaly and/or its licensors own the intellectual property rights for all material published on https://dygytaly.in/. Custom software and creative branding assets created for contracted clients are transferred upon complete contract execution.
                </p>

                <h3 style={{ fontSize: '1.3rem', color: 'var(--color-charcoal)', marginTop: '30px', marginBottom: '12px' }}>
                  3. Professional Engagement
                </h3>
                <p style={{ marginBottom: '20px' }}>
                  All marketing and software deliverables, timelines, payment schedules, and campaign parameters are governed by formal client service agreements and statements of work (SOW).
                </p>
              </>
            )}

            <div style={{ marginTop: '40px', borderTop: '1px solid var(--border-light)', paddingTop: '24px' }}>
              <p style={{ fontSize: '0.92rem' }}>
                Questions regarding our legal policies? Contact us directly at <a href="mailto:hello@dygytaly.in" style={{ color: 'var(--color-deep-plum)', fontWeight: 600 }}>hello@dygytaly.in</a> or call <a href="tel:+919677759959" style={{ color: 'var(--color-deep-plum)', fontWeight: 600 }}>+91 96777 59959</a>.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
