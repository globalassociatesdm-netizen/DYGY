import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Share2, Globe, Layers, Users, Database, TrendingUp, MapPin, Palette, Video, ArrowRight, Sparkles } from 'lucide-react';
import { useScrollReveal, staggerDelay } from '../hooks/useScrollReveal';

const DEFAULT_SERVICES = [
  { slug: 'google-ads', title: 'Google Ads', tagline: 'Be There When Customers Are Searching.', short_desc: 'Reach high-intent audiences actively searching for your products and services with high-converting Search, Performance Max, Display, and Remarketing campaigns.', icon_name: 'Search' },
  { slug: 'meta-ads', title: 'Meta Ads', tagline: 'Turn Attention Into Measurable Action.', short_desc: 'Engage laser-targeted audiences on Facebook and Instagram through thumb-stopping creatives, strategic funnel architectures, and precise retargeting.', icon_name: 'Share2' },
  { slug: 'website-development', title: 'Website Development', tagline: 'Your Best Salesperson Never Sleeps.', short_desc: 'Fast, secure, responsive websites built with modern engineering standards to establish authority and turn casual visitors into paying clients.', icon_name: 'Globe' },
  { slug: 'application-development', title: 'Application Development', tagline: 'Custom Software Built Around Your Workflow.', short_desc: 'Custom web apps, progressive web applications, and internal tools engineered for seamless performance and effortless business scalability.', icon_name: 'Layers' },
  { slug: 'crm-solutions', title: 'CRM Solutions', tagline: 'Never Let a Valuable Lead Slip Away.', short_desc: 'Centralized lead management, automated sales pipelines, and customer relationship systems tailored to close more deals with less manual follow-up.', icon_name: 'Users' },
  { slug: 'erp-solutions', title: 'ERP Solutions', tagline: 'One Platform. Total Operational Clarity.', short_desc: 'Unified business technology connecting inventory, accounts, project milestones, and internal communication into one intuitive single source of truth.', icon_name: 'Database' },
  { slug: 'website-seo', title: 'Website SEO', tagline: 'Earn Visibility That Grows Month Over Month.', short_desc: 'Comprehensive technical audits, on-page optimization, and high-authority content strategies that earn defensible organic rank for keywords that actually convert.', icon_name: 'TrendingUp' },
  { slug: 'local-seo', title: 'Local SEO', tagline: 'Dominate Search Results in Your City.', short_desc: 'Optimized Google Business Profiles, localized citations, and review generation systems that drive high-intent local calls, visits, and enquiries.', icon_name: 'MapPin' },
  { slug: 'branding-design', title: 'Branding & Design', tagline: 'Make Your Brand Impossible to Ignore.', short_desc: 'Distinctive visual identities, logo marks, brand guidelines, and creative collateral that build instant credibility and separate you from competitors.', icon_name: 'Palette' },
  { slug: 'social-media-video', title: 'Social Media Video', tagline: 'Stories That Hold Attention and Build Trust.', short_desc: 'Professional short-form reels, product showcases, and testimonial videos planned, scripted, and edited for maximum reach across modern platforms.', icon_name: 'Video' }
];

export const ServicesIndexPage: React.FC = () => {
  const [services, setServices] = useState<any[]>(DEFAULT_SERVICES);
  const scrollRef = useScrollReveal();

  useEffect(() => {
    fetch('/api/services')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setServices(data);
        }
      })
      .catch(() => {});
  }, []);

  const getIcon = (name: string) => {
    switch (name) {
      case 'Search': return <Search size={28} />;
      case 'Share2': return <Share2 size={28} />;
      case 'Globe': return <Globe size={28} />;
      case 'Layers': return <Layers size={28} />;
      case 'Users': return <Users size={28} />;
      case 'Database': return <Database size={28} />;
      case 'TrendingUp': return <TrendingUp size={28} />;
      case 'MapPin': return <MapPin size={28} />;
      case 'Palette': return <Palette size={28} />;
      case 'Video': return <Video size={28} />;
      default: return <Sparkles size={28} />;
    }
  };

  return (
    <div className="services-index-page" ref={scrollRef} style={{ paddingTop: '100px' }}>
      {/* Header */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff', textAlign: 'center' }}>
        <div className="container container-narrow">
          <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>OUR CAPABILITIES</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
            One Partner. More Ways to Grow.
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-soft-lavender)', maxWidth: '680px', margin: '0 auto' }}>
            We bring strategy, design, marketing and software under one roof so your business doesn't have to piece everything together from different vendors.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container">
          <div className="services-grid">
            {services.map((svc, idx) => (
              <div key={svc.slug} className="service-card" data-reveal style={{ padding: '40px 32px', ...staggerDelay(idx, 60) }}>
                <div>
                  <div className="service-icon-box">
                    {getIcon(svc.icon_name)}
                  </div>
                  <h3 className="service-card-title">{svc.title}</h3>
                  <div className="service-card-tagline">"{svc.tagline}"</div>
                  <p className="service-card-desc" style={{ marginBottom: '20px' }}>{svc.short_desc}</p>

                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-deep-plum)', marginBottom: '8px' }}>
                      Key Deliverables:
                    </div>
                    <ul style={{ listStyle: 'none', paddingLeft: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {(svc.deliverables || []).slice(0, 3).map((d: string, idx: number) => (
                        <li key={idx} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ color: 'var(--color-tangerine)', fontWeight: 'bold' }}>✓</span> {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <Link to={`/services/${svc.slug}`} className="btn btn-outline" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <span>View Solution Details</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          <div data-reveal="scale" style={{
            marginTop: '60px',
            background: 'var(--color-soft-cream)',
            border: '1px solid var(--border-light)',
            borderRadius: 'var(--radius-lg)',
            padding: '48px',
            textAlign: 'center'
          }}>
            <h3 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)', marginBottom: '12px' }}>
              Not sure which solution matches your growth phase?
            </h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 24px auto' }}>
              We'll review your current channels, analyze competitor positioning, and propose a sensible roadmap during our discovery catch-up.
            </p>
            <Link to="/contact" className="btn btn-primary btn-lg">
              Let's Catch Up ☕
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
