import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, MapPin, MessageCircle, Star, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Instagram, Facebook, Linkedin } from './SocialIcons';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          {/* Col 1: Brand & Verified Presence */}
          <div>
            <Link to="/" style={{ display: 'inline-block', marginBottom: '20px' }}>
              <img
                src="/uploads/dygytaly-logo.png"
                alt="Dygytaly Digital Marketing Agency"
                style={{ height: '46px', width: 'auto', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '8px' }}
              />
            </Link>
            <p style={{ color: '#c9c3cb', fontSize: '0.92rem', lineHeight: '1.65', marginBottom: '22px' }}>
              Dygytaly is a digital marketing and technology agency in Coimbatore, helping businesses build their presence, connect with the right people, and engineer smarter systems for sustainable growth.
            </p>

            {/* Google Rating Badge */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 16px',
              background: 'rgba(255, 255, 255, 0.08)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.12)'
            }}>
              <div style={{ display: 'flex', color: '#ffb703' }}>
                <Star size={16} fill="#ffb703" />
                <Star size={16} fill="#ffb703" />
                <Star size={16} fill="#ffb703" />
                <Star size={16} fill="#ffb703" />
                <Star size={16} fill="#ffb703" />
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>
                4.9 / 5 <span style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400 }}>(117 Google Reviews)</span>
              </span>
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '14px', marginTop: '22px' }}>
              <a
                href="https://www.instagram.com/dygytaly_official/?hl=en"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Dygytaly Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.facebook.com/Dygytaly/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Dygytaly Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://www.linkedin.com/company/dygytaly/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Dygytaly LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="https://wa.me/919677759959"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(37, 211, 102, 0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#25D366',
                  transition: 'all 0.2s ease'
                }}
                aria-label="Chat with Dygytaly on WhatsApp"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Solutions */}
          <div className="footer-col">
            <h5>Our Solutions</h5>
            <ul className="footer-links">
              <li><Link to="/services/google-ads">Google Ads</Link></li>
              <li><Link to="/services/meta-ads">Meta Ads (FB & Insta)</Link></li>
              <li><Link to="/services/website-development">Website Development</Link></li>
              <li><Link to="/services/application-development">Application Development</Link></li>
              <li><Link to="/services/crm-solutions">CRM Solutions</Link></li>
              <li><Link to="/services/erp-solutions">ERP Solutions</Link></li>
              <li><Link to="/services/website-seo">Website SEO</Link></li>
              <li><Link to="/services/local-seo">Local SEO (Google Maps)</Link></li>
              <li><Link to="/services/branding-design">Branding & Graphic Design</Link></li>
              <li><Link to="/services/social-media-video">Social Media Video Production</Link></li>
            </ul>
          </div>

          {/* Col 3: Company & Profile */}
          <div className="footer-col">
            <h5>Company</h5>
            <ul className="footer-links">
              <li><Link to="/about">About Dygytaly</Link></li>
              <li><Link to="/profile/founder">Founder Story</Link></li>
              <li><Link to="/careers">Careers (We're Hiring!)</Link></li>
              <li><Link to="/contact">Contact & Location</Link></li>
              <li><Link to="/privacy">Privacy Policy</Link></li>
              <li><Link to="/terms">Terms & Conditions</Link></li>
              <li>
                <Link to="/admin" style={{ color: 'var(--color-tangerine)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  Admin CMS Portal <ArrowUpRight size={14} />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Office */}
          <div className="footer-col">
            <h5>Visit & Connect</h5>
            <p style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#c9c3cb', marginBottom: '14px', lineHeight: '1.5' }}>
              <MapPin size={22} style={{ color: 'var(--color-tangerine)', flexShrink: 0, marginTop: '2px' }} />
              <span>
                3WVQ+WCV, Mettupalayam Main Road, Kothari Nagar, Sri Lakshmi Nagar, Thoppampatti Pirivu, K. Vadamadurai, Coimbatore, Tamil Nadu 641017, India.
              </span>
            </p>
            <p style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#c9c3cb', marginBottom: '14px', alignItems: 'center' }}>
              <Phone size={18} style={{ color: 'var(--color-tangerine)', flexShrink: 0 }} />
              <a href="tel:+919677759959" style={{ color: '#fff' }}>+91 96777 59959</a>
            </p>
            <p style={{ display: 'flex', gap: '10px', fontSize: '0.9rem', color: '#c9c3cb', marginBottom: '20px', alignItems: 'center' }}>
              <MessageCircle size={18} style={{ color: '#25D366', flexShrink: 0 }} />
              <a href="https://wa.me/919677759959" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366' }}>
                WhatsApp Direct Chat
              </a>
            </p>

            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '16px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', fontStyle: 'italic', margin: 0 }}>
                "Good things happen when good people talk. Have a coffee. Share an idea. Let's see what we can build together."
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>
            © 2026 Dygytaly Digital Marketing Agency. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
            <a href="https://dygytaly.in/sitemap.xml" target="_blank" rel="noopener noreferrer">XML Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
