import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Share2, Globe, Layers, Users, Database, TrendingUp, MapPin, Palette, Video, ArrowRight, Sparkles } from 'lucide-react';
import { useScrollReveal, staggerDelay } from '../hooks/useScrollReveal';
import { SERVICES_LIST } from '../data/servicesData';

export const ServicesIndexPage: React.FC = () => {
  const [services, setServices] = useState<any[]>(SERVICES_LIST);
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
                      {(svc.deliverables || []).slice(0, 3).map((d: string, dIdx: number) => (
                        <li key={dIdx} style={{ marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
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
        </div>
      </section>
    </div>
  );
};
export default ServicesIndexPage;
