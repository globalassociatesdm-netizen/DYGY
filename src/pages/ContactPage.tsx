import React from 'react';
import { MapPin, Phone, MessageCircle, Mail, Clock, ExternalLink } from 'lucide-react';
import { Instagram, Facebook, Linkedin } from '../components/SocialIcons';
import { CoffeeCatchUpForm } from '../components/CoffeeCatchUpForm';
import { useScrollReveal } from '../hooks/useScrollReveal';

export const ContactPage: React.FC = () => {
  const scrollRef = useScrollReveal();

  return (
    <div className="contact-page" ref={scrollRef} style={{ paddingTop: '100px' }}>
      {/* Hero */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: '#fff', textAlign: 'center' }}>
        <div className="container container-narrow">
          <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>GET IN TOUCH</span>
          <h1 className="section-title" style={{ color: '#fff', fontSize: 'clamp(2.4rem, 4.5vw, 3.8rem)' }}>
            Coffee First. Business Strategy Next. ☕
          </h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--color-soft-lavender)', maxWidth: '640px', margin: '0 auto' }}>
            Have a business idea, a marketing challenge or a website ready for a fresh start? Let's talk.
          </p>
        </div>
      </section>

      {/* Contact Details & Enquiry Form Grid */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '50px', alignItems: 'start' }}>
            {/* Left: Contact Information Cards */}
            <div>
              <span className="eyebrow">COIMBATORE HEADQUARTERS</span>
              <h2 style={{ fontSize: '2rem', color: 'var(--color-charcoal)', marginBottom: '24px' }}>
                Visit Our Office or Connect Remotely
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
                {/* Address Card */}
                <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(241, 138, 85, 0.15)', color: 'var(--color-tangerine)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-charcoal)', marginBottom: '4px' }}>Office Address</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      3WVQ+WCV, Mettupalayam Main Road, Kothari Nagar, Sri Lakshmi Nagar, Thoppampatti Pirivu, K. Vadamadurai, Coimbatore, Tamil Nadu 641017, India.
                    </p>
                    <a
                      href="https://maps.app.goo.gl/dygytaly"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--color-deep-plum)', marginTop: '8px' }}
                    >
                      Open in Google Maps <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Telephone Card */}
                <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(69, 36, 63, 0.12)', color: 'var(--color-deep-plum)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Phone size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-charcoal)', marginBottom: '4px' }}>Telephone & Quick Calls</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                      Direct client helpline for project consultations:
                    </p>
                    <a href="tel:+919677759959" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--color-deep-plum)', display: 'inline-block', marginTop: '6px' }}>
                      +91 96777 59959
                    </a>
                  </div>
                </div>

                {/* WhatsApp Direct */}
                <div className="glass-card" style={{ padding: '24px', display: 'flex', gap: '16px', background: 'rgba(37, 211, 102, 0.05)', borderColor: 'rgba(37, 211, 102, 0.3)' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#25D366', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--color-charcoal)', marginBottom: '4px' }}>WhatsApp Instant Chat</h4>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
                      Fast response for queries, brief summaries and coffee catch-ups:
                    </p>
                    <a
                      href="https://wa.me/919677759959"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ fontSize: '0.95rem', fontWeight: 600, color: '#128C7E', display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}
                    >
                      Chat on WhatsApp (+91 96777 59959) <ExternalLink size={14} />
                    </a>
                  </div>
                </div>

                {/* Email & Hours */}
                <div className="glass-card" style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-charcoal)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                      <Mail size={16} /> Email
                    </div>
                    <a href="mailto:hello@dygytaly.in" style={{ fontSize: '0.88rem', color: 'var(--color-deep-plum)' }}>
                      hello@dygytaly.in
                    </a>
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-charcoal)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '4px' }}>
                      <Clock size={16} /> Working Hours
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      Mon – Sat: 9:30 AM – 6:30 PM (IST)
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Channels */}
              <div>
                <h4 style={{ fontSize: '1rem', color: 'var(--color-charcoal)', marginBottom: '14px' }}>Connect on Official Channels:</h4>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <a href="https://www.instagram.com/dygytaly_official/?hl=en" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <Instagram size={16} /> Instagram
                  </a>
                  <a href="https://www.facebook.com/Dygytaly/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <Facebook size={16} /> Facebook
                  </a>
                  <a href="https://www.linkedin.com/company/dygytaly/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                    <Linkedin size={16} /> LinkedIn
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Working Enquiry Form */}
            <div>
              <CoffeeCatchUpForm />
            </div>
          </div>

          {/* Google Maps Embed */}
          <div style={{ marginTop: '70px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            <iframe
              title="Dygytaly Office Location on Google Maps"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3915.228741364583!2d76.93976377583626!3d11.082531353199853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba8f7105dc7984f%3A0xe5a28c2e6fca783f!2sDygytaly!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
              width="100%"
              height="400"
              style={{ border: 0, display: 'block' }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  );
};
