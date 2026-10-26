import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ServicesIndexPage } from './pages/ServicesIndexPage';
import { ServiceDetailPage } from './pages/ServiceDetailPage';
import { PortfolioPage } from './pages/PortfolioPage';
import { FounderPage } from './pages/profile/FounderPage';
import { TeamPage } from './pages/profile/TeamPage';
import { CulturePage } from './pages/profile/CulturePage';
import { CareersPage } from './pages/CareersPage';
import { ContactPage } from './pages/ContactPage';
import { LegalPage } from './pages/LegalPage';
import { AdminPortal } from './admin/AdminPortal';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// Layout wrapper for public website
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content" className="page-enter" style={{ flexGrow: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        {/* Admin Portal at /admin */}
        <Route path="/admin/*" element={<AdminPortal />} />

        {/* Public Website Routes */}
        <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
        <Route path="/services" element={<PublicLayout><ServicesIndexPage /></PublicLayout>} />
        <Route path="/services/:slug" element={<PublicLayout><ServiceDetailPage /></PublicLayout>} />
        <Route path="/portfolio" element={<PublicLayout><PortfolioPage /></PublicLayout>} />
        <Route path="/profile/founder" element={<PublicLayout><FounderPage /></PublicLayout>} />
        <Route path="/profile/team" element={<PublicLayout><TeamPage /></PublicLayout>} />
        <Route path="/profile/culture" element={<PublicLayout><CulturePage /></PublicLayout>} />
        <Route path="/careers" element={<PublicLayout><CareersPage /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><LegalPage /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><LegalPage /></PublicLayout>} />

        {/* Catch-all 404 */}
        <Route path="*" element={
          <PublicLayout>
            <div className="container" style={{ paddingTop: '160px', paddingBottom: '100px', textAlign: 'center' }}>
              <h1 style={{ fontSize: '3rem', marginBottom: '16px' }}>404</h1>
              <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '30px' }}>
                The page you are looking for does not exist or has moved.
              </p>
              <a href="/" className="btn btn-primary">Return to Homepage</a>
            </div>
          </PublicLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
