import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ChevronDown, ArrowRight, Sparkles, Layers, ShieldCheck, ArrowLeft } from 'lucide-react';
import { CoffeeCatchUpForm } from '../components/CoffeeCatchUpForm';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const ServiceDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [allServices, setAllServices] = useState<any[]>([]);
  const scrollRef = useScrollReveal();

  useEffect(() => {
    setLoading(true);
    fetch(`/api/services/${slug}`)
      .then(res => res.json())
      .then(data => {
        setService(data);
        setLoading(false);
        // Set document title
        if (data.seo_title) {
          document.title = data.seo_title;
        }
      })
      .catch(() => setLoading(false));

    fetch('/api/services')
      .then(res => res.json())
      .then(data => setAllServices(data))
      .catch(() => {});
  }, [slug]);

  if (loading) {
    return (
      <div className="page-loading" style={{ paddingTop: '160px' }}>
        <div className="spinner" />
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Loading service details...</p>
      </div>
    );
  }

  if (!service || service.error) {
    return (
      <div className="container" style={{ paddingTop: '160px', paddingBottom: '100px', textAlign: 'center' }}>
        <h2>Service Not Found</h2>
        <p style={{ margin: '20px 0' }}>The requested solution could not be located.</p>
        <Link to="/services" className="btn btn-primary">
          Back to All Solutions
        </Link>
      </div>
    );
  }

  const relatedServices = allServices.filter(s => s.slug !== slug).slice(0, 3);

  return (
    <div className="service-detail-page" style={{ paddingTop: '90px' }}>
      {/* Hero */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff' }}>
        <div className="container">
          <div style={{ maxWidth: '840px' }}>
            <Link to="/services" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--color-tangerine)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '20px' }}>
              <ArrowLeft size={16} /> All Solutions
            </Link>
            <div className="hero-eyebrow" style={{ color: 'var(--color-tangerine)', borderColor: 'rgba(241, 138, 85, 0.3)' }}>
              {service.title}
            </div>
            <h1 style={{ fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '20px' }}>
              {service.hero_headline || service.tagline}
            </h1>
            <p style={{ fontSize: '1.2rem', color: 'var(--color-soft-lavender)', lineHeight: 1.6, marginBottom: '32px' }}>
              {service.short_desc}
            </p>
            <a href="#consultation" className="btn btn-primary btn-lg">
              {service.cta_text || "Let's Catch Up ☕"}
            </a>
          </div>
        </div>
      </section>

      {/* Problem & Approach */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px' }}>
            {/* The Challenge */}
            <div className="glass-card" style={{ padding: '40px', borderTop: '4px solid #d63638' }}>
              <span className="eyebrow" style={{ color: '#d63638' }}>THE CHALLENGE</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
                Problems We Frequently Address
              </h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
                {service.problem_solved}
              </p>
            </div>

            {/* Our Strategic Approach */}
            <div className="glass-card" style={{ padding: '40px', borderTop: '4px solid var(--color-tangerine)' }}>
              <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>OUR APPROACH</span>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-charcoal)', marginBottom: '16px' }}>
                How Dygytaly Delivers
              </h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: '1.75' }}>
                {service.approach}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deliverables */}
      <section className="section-py" style={{ background: 'var(--color-soft-cream)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">WHAT'S INCLUDED</span>
            <h2 className="section-title">Scope of Deliverables</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Clear, transparent deliverables backed by accountability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {(service.deliverables || []).map((del: string, idx: number) => (
              <div key={idx} className="glass-card" style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(241, 138, 85, 0.15)', color: 'var(--color-tangerine)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <CheckCircle2 size={20} />
                </div>
                <span style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--color-charcoal)' }}>{del}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Working Process */}
      {service.process_steps && service.process_steps.length > 0 && (
        <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <span className="eyebrow">EXECUTION PROCESS</span>
              <h2 className="section-title">How We Partner on {service.title}</h2>
            </div>

            <div className="process-grid">
              {service.process_steps.map((st: any) => (
                <div key={st.step} className="process-card">
                  <div className="process-step-num">{st.step}</div>
                  <h3 className="process-step-title">{st.title}</h3>
                  <p className="process-step-desc">{st.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Technologies */}
      {service.technologies && service.technologies.length > 0 && (
        <section className="section-py" style={{ background: 'var(--color-deep-plum)', color: '#fff', textAlign: 'center' }}>
          <div className="container">
            <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>TECH STACK & TOOLS</span>
            <h2 className="section-title" style={{ color: '#fff', marginBottom: '32px' }}>
              Technologies & Frameworks We Leverage
            </h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '16px' }}>
              {service.technologies.map((tech: string, i: number) => (
                <span
                  key={i}
                  style={{
                    padding: '12px 24px',
                    borderRadius: 'var(--radius-full)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    color: '#fff'
                  }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Service FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
          <div className="container container-narrow">
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
              <span className="eyebrow">FREQUENTLY ASKED QUESTIONS</span>
              <h2 className="section-title">Common Questions About {service.title}</h2>
            </div>

            <div className="faq-list">
              {service.faqs.map((f: any, idx: number) => (
                <div key={idx} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                  <div className="faq-header" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                    <h4>{f.q}</h4>
                    <ChevronDown size={18} style={{ transform: activeFaq === idx ? 'rotate(180deg)' : 'none' }} />
                  </div>
                  {activeFaq === idx && (
                    <div className="faq-body">
                      {f.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related Services */}
      <section className="section-py" style={{ background: 'var(--color-soft-cream)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <span className="eyebrow">COMPLEMENTARY SOLUTIONS</span>
              <h3 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Pair With Related Capabilities</h3>
            </div>
            <Link to="/services" className="btn btn-outline" style={{ background: '#fff' }}>
              All Solutions →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
            {relatedServices.map((r) => (
              <div key={r.slug} className="glass-card" style={{ padding: '28px' }}>
                <h4 style={{ fontSize: '1.2rem', marginBottom: '8px', color: 'var(--color-charcoal)' }}>{r.title}</h4>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '18px' }}>{r.short_desc}</p>
                <Link to={`/services/${r.slug}`} style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-deep-plum)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Learn More <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Consultation Section */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)' }} id="consultation">
        <div className="container container-narrow">
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>START YOUR PROJECT</span>
            <h2 className="section-title" style={{ color: '#fff' }}>Ready to Discuss {service.title}?</h2>
            <p style={{ color: '#cfcacf' }}>
              Fill in your details below and we'll prepare a custom outline for your business over coffee.
            </p>
          </div>
          <CoffeeCatchUpForm defaultService={service.title} />
        </div>
      </section>
    </div>
  );
};
