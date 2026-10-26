import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, Coffee, Phone } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
    setSolutionsOpen(false);
    setProfileOpen(false);
  }, [location.pathname]);

  const servicesList = [
    { name: 'Google Ads', path: '/services/google-ads' },
    { name: 'Meta Ads', path: '/services/meta-ads' },
    { name: 'Website Development', path: '/services/website-development' },
    { name: 'Application Development', path: '/services/application-development' },
    { name: 'CRM Solutions', path: '/services/crm-solutions' },
    { name: 'ERP Solutions', path: '/services/erp-solutions' },
    { name: 'Website SEO', path: '/services/website-seo' },
    { name: 'Local SEO', path: '/services/local-seo' },
    { name: 'Branding & Design', path: '/services/branding-design' },
    { name: 'Social Media Video', path: '/services/social-media-video' },
  ];

  return (
    <header className={`site-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand Logo - Original Client Asset */}
        <Link to="/" className="nav-brand" aria-label="Dygytaly Home">
          <img src="/uploads/dygytaly-logo.png" alt="Dygytaly Digital Marketing Agency" />
        </Link>

        {/* Desktop Navigation */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>

          <Link to="/about" className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}>
            About Us
          </Link>

          {/* Solutions Dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <Link
              to="/services"
              className={`nav-link ${location.pathname.startsWith('/services') ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              Solutions <ChevronDown size={14} />
            </Link>
            <ul className={`dropdown-menu ${solutionsOpen ? 'visible' : ''}`} style={{ minWidth: '260px' }}>
              <li>
                <Link to="/services" className="dropdown-item" style={{ fontWeight: 700, color: 'var(--color-tangerine)' }}>
                  All Solutions Overview →
                </Link>
              </li>
              <div style={{ height: '1px', background: 'var(--border-light)', margin: '6px 0' }} />
              {servicesList.map((svc) => (
                <li key={svc.path}>
                  <Link to={svc.path} className="dropdown-item">
                    {svc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <Link to="/portfolio" className={`nav-link ${location.pathname === '/portfolio' ? 'active' : ''}`}>
            Our Work
          </Link>

          {/* Profile Dropdown */}
          <div
            className="nav-dropdown"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            <span
              className={`nav-link ${location.pathname.startsWith('/profile') ? 'active' : ''}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}
            >
              Profile <ChevronDown size={14} />
            </span>
            <ul className={`dropdown-menu ${profileOpen ? 'visible' : ''}`}>
              <li>
                <Link to="/profile/founder" className="dropdown-item">
                  Founder
                </Link>
              </li>
              <li>
                <Link to="/profile/team" className="dropdown-item">
                  Meet Our Team
                </Link>
              </li>
              <li>
                <Link to="/profile/culture" className="dropdown-item">
                  Life at Dygytaly
                </Link>
              </li>
            </ul>
          </div>

          <Link to="/careers" className={`nav-link ${location.pathname === '/careers' ? 'active' : ''}`}>
            Careers
          </Link>

          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}>
            Contact
          </Link>

          {/* Mobile CTA */}
          <div className="mobile-only" style={{ display: 'none', width: '100%', marginTop: '16px' }}>
            <Link to="/contact" className="btn btn-primary" style={{ width: '100%' }}>
              <Coffee size={18} /> Let's Catch Up ☕
            </Link>
          </div>
        </nav>

        {/* Desktop Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <a
            href="tel:+919677759959"
            className="btn btn-outline btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            title="Call Dygytaly"
          >
            <Phone size={14} /> +91 96777 59959
          </a>

          <Link to="/contact" className="btn btn-primary btn-sm">
            <Coffee size={16} /> Let's Catch Up ☕
          </Link>

          {/* Mobile Nav Toggle */}
          <button
            className="mobile-nav-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>
    </header>
  );
};
