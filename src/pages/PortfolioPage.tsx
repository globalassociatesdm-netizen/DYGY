import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ExternalLink, Filter, Sparkles, CheckCircle2 } from 'lucide-react';
import { useScrollReveal, staggerDelay } from '../hooks/useScrollReveal';

const DEFAULT_PORTFOLIO = [
  {
    id: 1,
    title: 'Precision Lead Engine for Regional Manufacturer',
    client_name: 'Industrial Equipment Manufacturer',
    industry: 'Manufacturing & B2B',
    category: 'Google Ads',
    challenge: 'High cost-per-click and unqualified search enquiries were wasting 60% of monthly digital advertising spend.',
    strategy: 'Restructured Google Search campaigns into exact-match commercial intent clusters, implemented negative keyword pruning, and built dedicated technical landing pages.',
    execution: 'Launched segmented Search & Performance Max campaigns with server-side conversion tracking linked directly to the client CRM.',
    results: 'Achieved 42% reduction in Cost Per Acquisition (CPA) and 3.4x increase in sales-qualified commercial inquiries over 90 days.',
    image_url: '/uploads/dygytaly-logo.png',
    project_url: '/services/google-ads',
    is_featured: 1
  },
  {
    id: 2,
    title: 'Full Brand Identity & E-Commerce Web Experience',
    client_name: 'D2C Lifestyle & Apparel Brand',
    industry: 'Retail & Fashion',
    category: 'Websites',
    challenge: 'Outdated website with poor mobile checkout was causing 74% cart abandonment and failing to project premium brand authority.',
    strategy: 'Complete brand repositioning, bespoke typography, and a modern, high-speed responsive web storefront with 1-click checkout.',
    execution: 'Developed a custom responsive website with sub-second page loads, elegant product showcases, and interactive 3D product previews.',
    results: 'Cart abandonment dropped to 41%, mobile conversion rate increased by 68%, and average session duration doubled.',
    image_url: '/uploads/dygytaly-logo.png',
    project_url: '/services/website-development',
    is_featured: 1
  },
  {
    id: 3,
    title: 'Local SEO Dominance for Healthcare Clinic',
    client_name: 'Multi-Speciality Healthcare Clinic',
    industry: 'Healthcare & Wellness',
    category: 'SEO',
    challenge: 'Ranked on page 3 for key medical search terms in Coimbatore, resulting in near-zero inbound phone calls.',
    strategy: 'Optimized Google Business Profile, established consistent local citations, created localized health service pages, and automated patient review collection.',
    execution: 'Systematic on-page technical optimization, schema markup integration, and geo-targeted service content.',
    results: 'Ranked in the Google Maps Local 3-Pack for 14 target medical queries; incoming phone calls increased by 185% in 5 months.',
    image_url: '/uploads/dygytaly-logo.png',
    project_url: '/services/local-seo',
    is_featured: 1
  },
  {
    id: 4,
    title: 'Viral Reel Campaign & Social Brand Launch',
    client_name: 'Specialty Gourmet Cafe & Roastery',
    industry: 'Food & Hospitality',
    category: 'Video',
    challenge: 'Low organic reach on Instagram and lack of awareness among Coimbatore coffee enthusiasts prior to store launch.',
    strategy: 'Created an aesthetic 5-part storytelling video series highlighting artisan coffee roasting, brewing crafts, and ambient cafe workspace aesthetics.',
    execution: 'Scripted, filmed, and produced fast-paced short-form reels with dynamic motion graphics, custom audio design, and micro-influencer collaboration.',
    results: 'Over 450,000 organic video views across Coimbatore; opening weekend footfall exceeded capacity by 200%.',
    image_url: '/uploads/dygytaly-logo.png',
    project_url: '/services/social-media-video',
    is_featured: 1
  }
];

export const PortfolioPage: React.FC = () => {
  const [projects, setProjects] = useState<any[]>(DEFAULT_PORTFOLIO);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeProject, setActiveProject] = useState<any | null>(null);
  const scrollRef = useScrollReveal();

  useEffect(() => {
    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      })
      .catch(() => {});
  }, []);

  const categories = ['All', 'Websites', 'Branding', 'Google Ads', 'Meta Ads', 'SEO', 'Video', 'Creative'];

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()));

  return (
    <div className="portfolio-page" ref={scrollRef} style={{ paddingTop: '100px' }}>
      {/* Hero */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff', textAlign: 'center' }}>
        <div className="container container-narrow">
          <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>SELECTED WORK</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            Good Work Speaks. Great Work Shows Its Thinking.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-soft-lavender)', maxWidth: '680px', margin: '0 auto' }}>
            Explore how we dissect business hurdles, engineer strategic solutions, and deliver measurable commercial results.
          </p>
        </div>
      </section>

      {/* Filter Tabs & Grid */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container">
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '50px' }}>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid',
                  borderColor: selectedCategory === cat ? 'var(--color-deep-plum)' : 'var(--border-light)',
                  background: selectedCategory === cat ? 'var(--color-deep-plum)' : '#FFFFFF',
                  color: selectedCategory === cat ? '#FFFFFF' : 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '32px' }}>
            {filteredProjects.map((p) => (
              <div
                key={p.id}
                className="glass-card"
                style={{
                  padding: '36px 30px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveProject(p)}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="badge badge-sage">{p.category}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.industry}</span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', color: 'var(--color-charcoal)', marginBottom: '16px', lineHeight: 1.3 }}>
                    {p.title}
                  </h3>

                  <div style={{ marginBottom: '16px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-deep-plum)', textTransform: 'uppercase' }}>Challenge:</span>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{p.challenge}</p>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-tangerine)', textTransform: 'uppercase' }}>Verified Result:</span>
                    <p style={{ fontSize: '0.96rem', fontWeight: 600, color: 'var(--color-aubergine)', marginTop: '4px' }}>{p.results}</p>
                  </div>
                </div>

                <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--color-deep-plum)', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                    View Deep Dive Thinking <ArrowRight size={14} />
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{p.client_name}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Modal for Deep Case Study Breakdown */}
          {activeProject && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(41, 26, 45, 0.75)',
              backdropFilter: 'blur(8px)',
              zIndex: 2000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }} onClick={() => setActiveProject(null)}>
              <div
                className="glass-card"
                style={{
                  background: '#FFFFFF',
                  maxWidth: '720px',
                  width: '100%',
                  maxHeight: '90vh',
                  overflowY: 'auto',
                  padding: '40px',
                  borderRadius: 'var(--radius-lg)',
                  position: 'relative'
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setActiveProject(null)}
                  style={{
                    position: 'absolute',
                    top: '20px',
                    right: '20px',
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    color: 'var(--text-muted)'
                  }}
                >
                  ✕
                </button>

                <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
                  <span className="badge badge-sage">{activeProject.category}</span>
                  <span className="badge badge-lavender">{activeProject.industry}</span>
                </div>

                <h2 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)', marginBottom: '12px' }}>
                  {activeProject.title}
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Client: {activeProject.client_name}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                  <div style={{ background: 'var(--color-warm-ivory)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
                    <h4 style={{ color: '#d63638', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '6px' }}>The Challenge</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.65' }}>{activeProject.challenge}</p>
                  </div>

                  <div style={{ background: 'var(--color-warm-ivory)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
                    <h4 style={{ color: 'var(--color-deep-plum)', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '6px' }}>The Strategy</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.65' }}>{activeProject.strategy}</p>
                  </div>

                  <div style={{ background: 'var(--color-warm-ivory)', padding: '20px', borderRadius: 'var(--radius-sm)' }}>
                    <h4 style={{ color: 'var(--color-charcoal)', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '6px' }}>Execution</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.65' }}>{activeProject.execution}</p>
                  </div>

                  <div style={{ background: 'rgba(241, 138, 85, 0.1)', padding: '20px', borderRadius: 'var(--radius-sm)', borderLeft: '4px solid var(--color-tangerine)' }}>
                    <h4 style={{ color: 'var(--color-tangerine)', fontSize: '0.95rem', textTransform: 'uppercase', marginBottom: '6px' }}>Verified Impact & Results</h4>
                    <p style={{ color: 'var(--color-aubergine)', fontSize: '1.05rem', fontWeight: 600, lineHeight: '1.6' }}>{activeProject.results}</p>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Link to="/contact" className="btn btn-primary" onClick={() => setActiveProject(null)}>
                    Start a Similar Project ☕
                  </Link>
                  <button onClick={() => setActiveProject(null)} className="btn btn-outline btn-sm">
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
