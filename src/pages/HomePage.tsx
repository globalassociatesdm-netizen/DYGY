import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Star, CheckCircle, Search, Share2, Globe, Layers,
  Users, Database, TrendingUp, MapPin, Palette, Video, ChevronDown,
  Sparkles, Coffee, ExternalLink
} from 'lucide-react';
import { DuckHeroCanvas } from '../components/DuckHeroCanvas';
import { ThreeCoffeeCanvas } from '../components/ThreeCoffeeCanvas';
import { CoffeeCatchUpForm } from '../components/CoffeeCatchUpForm';
import { useScrollReveal, staggerDelay } from '../hooks/useScrollReveal';
import { SERVICES_LIST } from '../data/servicesData';

const CORE_PRINCIPLES = [
  {
    num: '01',
    title: 'We Understand Before We Recommend.',
    desc: 'No cookie-cutter templates or forced packages. We take the time to dissect your margins, sales cycles, and realistic commercial targets before suggesting a roadmap.'
  },
  {
    num: '02',
    title: 'Strategy Before Guesswork.',
    desc: 'Every rupee invested in advertising, design, and software has a measurable intent. We establish transparent KPIs and clear conversion tracking upfront.'
  },
  {
    num: '03',
    title: 'Creativity With a Purpose.',
    desc: 'Aesthetic elegance designed to do more than win compliments. We engineer visual identities and video narratives that capture attention, build trust, and drive conversions.'
  },
  {
    num: '04',
    title: 'Relationships Beyond Projects.',
    desc: 'We are in this for the long haul. We celebrate your wins, stand beside you through market shifts, and continually optimize to compound your brand equity.'
  }
];

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

const DEFAULT_TESTIMONIALS = [
  {
    id: 1,
    author_name: 'Senthil Kumar',
    business_name: 'TexStyle Manufacturing',
    rating: 5.0,
    review_text: 'Dygytaly completely transformed our digital strategy. They took the time to understand our textile machinery sales cycle and built a Google Ads campaign that delivered high-value commercial leads right from month one.',
    source: 'Google Review',
    source_url: 'https://share.google/0uskTCwteOiHO7Y1Y',
    is_verified: 1
  },
  {
    id: 2,
    author_name: 'Priya Ramanathan',
    business_name: 'Aura Interior Architecture',
    rating: 5.0,
    review_text: 'The best digital agency in Coimbatore by far. They designed a gorgeous website that truly represents our design standards, and their local SEO work helped us secure major commercial interior contracts.',
    source: 'Google Review',
    source_url: 'https://share.google/0uskTCwteOiHO7Y1Y',
    is_verified: 1
  },
  {
    id: 3,
    author_name: 'Karthik Raja',
    business_name: 'Apex Precision Engineering',
    rating: 5.0,
    review_text: 'Honest conversations, transparent metrics, and zero false promises. Gowri and her team treat our marketing budget with genuine accountability. Highly recommended for any serious business owner.',
    source: 'Google Review',
    source_url: 'https://share.google/0uskTCwteOiHO7Y1Y',
    is_verified: 1
  }
];

const DEFAULT_FAQS = [
  {
    question: 'What services does Dygytaly offer?',
    answer: 'Dygytaly is a full-service digital marketing and technology agency. We offer Google Ads, Meta Ads (Facebook & Instagram), Website Development, Custom Application Development, CRM & ERP Solutions, Website SEO, Local SEO (Google Business Profile), Branding & Graphic Design, and Social Media Video Production.'
  },
  {
    question: 'Can I hire Dygytaly for a single service?',
    answer: 'Yes! While many clients partner with us for integrated marketing and technology, you can engage us specifically for individual solutions such as building a website, running Google Ads, or optimizing Local SEO.'
  },
  {
    question: 'Do you work with startups and established businesses?',
    answer: 'Yes, we work with ambitious startups needing a strong launch identity and scalable website, as well as established SMEs looking to modernize their systems, automate follow-ups, and accelerate customer acquisition.'
  },
  {
    question: 'How do we get started?',
    answer: 'Simply click "Let\'s Catch Up Over Coffee" to tell us a little about your goals. We will connect with you, discuss your requirements without pressure or jargon, and recommend a clear, actionable plan.'
  }
];

const DEFAULT_FOUNDER_HOME = {
  name: 'Gowri Jagadheeshwaran',
  designation: 'Founder & Managing Director',
  portrait_url: '/uploads/founder-profile.jpg',
  bio: 'Creative strategist and digital architect passionate about helping ambitious businesses build commanding digital brands and scalable technology systems.',
  story_points: [
    { number: '01', title: 'Every Big Idea Starts Somewhere.', quote: 'Not with all the answers, but with the courage to begin and the ambition to build something meaningful.' },
    { number: '02', title: 'Built on a Vision. Driven by Possibilities.', quote: 'I believe businesses deserve more than just services. They deserve thoughtful strategies and a partner who understands their vision.' },
    { number: '03', title: 'Turning Ideas Into Action.', quote: 'That belief became the foundation of Dygytaly — bringing marketing, creativity and technology together to help businesses move forward.' },
    { number: '04', title: 'Growth Is Never a One-Person Journey.', quote: 'Behind every milestone are people, lessons, challenges and relationships that make the journey worthwhile.' },
    { number: '05', title: 'Ambition With Accountability.', quote: 'I believe trust is earned through honest conversations, responsible decisions and a commitment to doing the work right.' },
    { number: '06', title: 'The Vision Is Bigger Than Today.', quote: 'My goal is to build Dygytaly into a trusted digital partner that helps businesses think bigger, work smarter and grow with confidence.' },
    { number: '07', title: 'And We\'re Just Getting Started.', quote: 'Every business has a next chapter. If you have a vision you\'re ready to pursue, I\'d love to hear about it.' }
  ]
};

export const HomePage: React.FC = () => {
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [services, setServices] = useState<any[]>(SERVICES_LIST);
  const [portfolio, setPortfolio] = useState<any[]>(DEFAULT_PORTFOLIO);
  const [founder, setFounder] = useState<any>(DEFAULT_FOUNDER_HOME);
  const [testimonials, setTestimonials] = useState<any[]>(DEFAULT_TESTIMONIALS);
  const [faqs, setFaqs] = useState<any[]>(DEFAULT_FAQS);

  useEffect(() => {
    // Fetch live CMS data from backend
    fetch('/api/services')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setServices(data); })
      .catch(() => {});

    fetch('/api/portfolio')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setPortfolio(data); })
      .catch(() => {});

    fetch('/api/founder')
      .then(res => res.json())
      .then(data => { if (data && data.name) setFounder(data); })
      .catch(() => {});

    fetch('/api/testimonials')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setTestimonials(data); })
      .catch(() => {});

    fetch('/api/faqs')
      .then(res => res.json())
      .then(data => { if (Array.isArray(data) && data.length > 0) setFaqs(data); })
      .catch(() => {});
  }, []);

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Search': return <Search size={26} />;
      case 'Share2': return <Share2 size={26} />;
      case 'Globe': return <Globe size={26} />;
      case 'Layers': return <Layers size={26} />;
      case 'Users': return <Users size={26} />;
      case 'Database': return <Database size={26} />;
      case 'TrendingUp': return <TrendingUp size={26} />;
      case 'MapPin': return <MapPin size={26} />;
      case 'Palette': return <Palette size={26} />;
      case 'Video': return <Video size={26} />;
      default: return <Sparkles size={26} />;
    }
  };

  const storyPoints = (founder?.story_points && founder.story_points.length > 0)
    ? founder.story_points
    : DEFAULT_FOUNDER_HOME.story_points;

  const scrollRef = useScrollReveal();

  return (
    <div className="homepage" ref={scrollRef}>
      {/* SECTION A: Interactive Mascot Hero Banner */}
      <section className="hero-section">
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-grid-layout">
            <div className="hero-content">
              <div className="hero-eyebrow">
                <Sparkles size={14} /> Dygytaly Digital Marketing & Technology
              </div>
              <h1 className="hero-headline">
                Good Ideas Deserve Great Execution.
              </h1>
              <p className="hero-supporting">
                Your Next Big Business Move Starts Here.
              </p>
              <p className="hero-description">
                You bring the ambition. We'll bring the digital thinking. From making your brand stand out to building the technology that runs your business, Dygytaly brings marketing, creativity and technology together to help you move forward. Whether you're looking for better leads, a stronger online presence, a memorable brand or smarter business systems, let's find the right next step together.
              </p>
              <div className="hero-actions">
                <Link to="/contact" className="btn btn-primary btn-lg">
                  <Coffee size={20} /> Let's Catch Up ☕
                </Link>
                <Link to="/services" className="btn btn-outline-white btn-lg">
                  Explore What We Do <ArrowRight size={18} />
                </Link>
              </div>
              <div className="hero-scroll-indicator">
                <div className="scroll-line" />
                <span>Scroll down to explore</span>
              </div>
            </div>

            <div className="hero-mascot-column">
              <DuckHeroCanvas />
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B: Trust & Credibility */}
      <section className="trust-bar">
        <div className="container">
          <div data-reveal="fade" style={{ textAlign: 'center', marginBottom: '28px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-deep-plum)' }}>VERIFIED CREDIBILITY</span>
            <h2 style={{ fontSize: '1.8rem', color: 'var(--color-charcoal)' }}>Real People. Real Conversations. Real Reviews.</h2>
          </div>
          <div className="trust-grid">
            <a
              href="https://share.google/0uskTCwteOiHO7Y1Y"
              target="_blank"
              rel="noopener noreferrer"
              className="trust-item"
              data-reveal
              style={{ ...staggerDelay(0), textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
              title="View Dygytaly Verified Google Profile & Rating"
            >
              <div className="trust-number">4.9 ★</div>
              <div className="trust-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                Verified Google Business Rating <ExternalLink size={12} />
              </div>
            </a>
            <a
              href="https://share.google/0uskTCwteOiHO7Y1Y"
              target="_blank"
              rel="noopener noreferrer"
              className="trust-item"
              data-reveal
              style={{ ...staggerDelay(1), textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
              title="Read all 117+ Genuine Reviews on Google"
            >
              <div className="trust-number">117+</div>
              <div className="trust-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                Genuine Client Reviews <ExternalLink size={12} />
              </div>
            </a>
            <div className="trust-item" data-reveal style={staggerDelay(2)}>
              <div className="trust-number">150+</div>
              <div className="trust-label">Growth Projects Delivered</div>
            </div>
            <div className="trust-item" data-reveal style={staggerDelay(3)}>
              <div className="trust-number">98%</div>
              <div className="trust-label">Client Retention & Partnership</div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION C: Introduction */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container container-narrow">
          <div data-reveal style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="eyebrow">INTEGRATED AGENCY</span>
            <h2 className="section-title">
              A Little Bit of Marketing. A Little Bit of Technology. A Whole Lot of Possibility.
            </h2>
          </div>
          <div data-reveal="scale" className="glass-card" style={{ padding: '44px 38px', fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
            <p style={{ marginBottom: '20px' }}>
              Some businesses need more customers. Some need a website that finally does their brand justice. Some need software that makes daily work easier. Others need all three.
            </p>
            <p style={{ marginBottom: '20px' }}>
              <strong>That's where we come in.</strong> Dygytaly is a digital marketing and technology agency helping businesses build their presence, connect with the right people and create better ways of working.
            </p>
            <p style={{ marginBottom: '32px' }}>
              We bring strategy, design, marketing and development under one roof, so your business doesn't have to piece everything together from different places. <em>One team. Connected thinking. Solutions built around your business.</em>
            </p>
            <div style={{ textAlign: 'center' }}>
              <Link to="/about" className="btn btn-dark">
                Get to Know Us <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION D: Services */}
      <section className="section-py" style={{ background: 'var(--color-soft-cream)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginBottom: '50px' }}>
            <div data-reveal="left">
              <span className="eyebrow">ONE PARTNER. MORE WAYS TO GROW.</span>
              <h2 className="section-title" style={{ marginBottom: 0 }}>Comprehensive Digital Solutions</h2>
            </div>
            <Link to="/services" className="btn btn-outline" data-reveal="right" style={{ background: '#fff' }}>
              View All 10 Services <ArrowRight size={16} />
            </Link>
          </div>

          <div className="services-grid">
            {services.map((svc, idx) => (
              <div key={svc.slug} className="service-card" data-reveal style={staggerDelay(idx, 60)}>
                <div>
                  <div className="service-icon-box">
                    {getServiceIcon(svc.icon_name)}
                  </div>
                  <h3 className="service-card-title">{svc.title}</h3>
                  <div className="service-card-tagline">“{svc.tagline}”</div>
                  <p className="service-card-desc">{svc.short_desc}</p>
                </div>
                <Link to={`/services/${svc.slug}`} className="service-card-link">
                  Explore {svc.title} <ArrowRight size={16} />
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <Link to="/contact" className="btn btn-dark btn-lg">
              Not Sure What You Need? Let's Figure It Out Together →
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION E: Why Dygytaly? */}
      <section className="section-py" style={{ background: 'var(--color-deep-plum)', color: 'var(--color-white)' }}>
        <div className="container">
          <div data-reveal style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>OUR CORE PRINCIPLES</span>
            <h2 className="section-title" style={{ color: '#fff' }}>More Than a Service Provider. A Team in Your Corner.</h2>
            <p style={{ color: '#cfcacf', maxWidth: '640px', margin: '0 auto', fontSize: '1.05rem' }}>
              How we approach every partnership, every strategy, and every single campaign line.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '28px' }}>
            {CORE_PRINCIPLES.map((item, idx) => (
              <div
                key={item.num}
                data-reveal
                style={{
                  padding: '36px 28px',
                  background: 'rgba(40, 22, 46, 0.94)',
                  border: '1.5px solid rgba(241, 138, 85, 0.45)',
                  borderRadius: '20px',
                  boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  ...staggerDelay(idx, 100)
                }}
              >
                <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 800, color: 'var(--color-tangerine)', opacity: 0.9, marginBottom: '16px', lineHeight: 1 }}>
                  {item.num}
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '14px', color: '#fff', lineHeight: 1.35 }}>{item.title}</h3>
                <p style={{ color: '#d2ccdc', fontSize: '0.95rem', lineHeight: '1.65', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION F: Selected Work & Portfolio */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container">
          <div data-reveal style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">PORTFOLIO & RESULTS</span>
            <h2 className="section-title">Good Work Speaks. Great Work Shows Its Thinking.</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Real case studies highlighting problem breakdown, execution strategy, and measurable outcomes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
            {portfolio.map((p, idx) => (
              <div key={p.id} className="glass-card" data-reveal style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...staggerDelay(idx, 100) }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <span className="badge badge-sage">{p.category}</span>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{p.industry}</span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', color: 'var(--color-charcoal)' }}>{p.title}</h3>
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-deep-plum)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Challenge:</strong>
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{p.challenge}</p>
                  </div>
                  <div style={{ marginBottom: '20px' }}>
                    <strong style={{ fontSize: '0.85rem', color: 'var(--color-tangerine)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Result:</strong>
                    <p style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--color-aubergine)', marginTop: '4px' }}>{p.results}</p>
                  </div>
                </div>
                <Link to="/portfolio" className="btn btn-outline btn-sm" style={{ alignSelf: 'flex-start' }}>
                  Read Full Case Study →
                </Link>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/portfolio" className="btn btn-outline" style={{ background: '#fff' }}>
              Explore All Case Studies & Filter by Service <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION G: Working Process */}
      <section className="section-py" style={{ background: 'var(--color-soft-cream)' }}>
        <div className="container">
          <div data-reveal style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">METHODOLOGY</span>
            <h2 className="section-title">Big Goals. Clear Steps.</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              A disciplined 5-stage framework that keeps campaigns on track and software on schedule.
            </p>
          </div>

          <div className="process-grid">
            {[
              { num: '01', name: 'Discover', desc: 'Understand the business, existing metrics, audience, and commercial objectives.' },
              { num: '02', name: 'Strategize', desc: 'Plan the right approach, channel mix, tech stack and creative roadmap.' },
              { num: '03', name: 'Create', desc: 'Bring the solution to life with world-class engineering, design, and compelling copy.' },
              { num: '04', name: 'Measure', desc: 'Review real-time data against agreed benchmarks and transparent KPIs.' },
              { num: '05', name: 'Improve', desc: 'Iterate and optimize continuously to compound growth and maximize ROI.' }
            ].map((st) => (
              <div key={st.num} className="process-card" data-reveal style={staggerDelay(parseInt(st.num) - 1, 100)}>
                <div className="process-step-num">{st.num}</div>
                <h3 className="process-step-title">{st.name}</h3>
                <p className="process-step-desc">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION H: Founder Story (7 Story Points) */}
      <section className="section-py" style={{ background: 'var(--color-aubergine)', color: 'var(--color-white)' }}>
        <div className="container">
          <div data-reveal style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>LEADERSHIP & VISION</span>
            <h2 className="section-title" style={{ color: '#fff' }}>Every Vision Has a Story.</h2>
            <p style={{ color: '#cfcacf', maxWidth: '600px', margin: '0 auto' }}>
              The journey, beliefs, and commitment that built Dygytaly Digital Marketing Agency.
            </p>
          </div>

          <div className="founder-story-container">
            {/* Left: Founder Card */}
            <div className="founder-portrait-card" data-reveal="left">
              <div className="founder-img-wrapper">
                <img
                  src={founder?.portrait_url || founder?.image_url || '/uploads/founder-profile.jpg'}
                  alt={founder?.name || 'Dygytaly Agency Founder'}
                />
              </div>
              <h3 style={{ fontSize: '1.4rem', color: 'var(--color-charcoal)', marginBottom: '4px' }}>
                {founder?.name || 'Gowri Jagadheeshwaran'}
              </h3>
              <p style={{ color: 'var(--color-tangerine)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '14px' }}>
                {founder?.designation || 'Founder & Managing Director'}
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                {founder?.bio || 'Creative strategist and digital architect passionate about helping ambitious businesses build commanding digital brands and scalable technology systems.'}
              </p>
              <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                <Link to="/profile/founder" className="btn btn-outline btn-sm">
                  Full Founder Biography →
                </Link>
              </div>
            </div>

            {/* Right: 7-Point Story Timeline */}
            <div className="story-timeline">
              {storyPoints.map((sp: any) => (
                <div key={sp.number} className="story-node">
                  <div className="story-number">{sp.number}</div>
                  <h4 className="story-title">{sp.title}</h4>
                  <p className="story-quote">“{sp.quote}”</p>
                </div>
              ))}

              <div style={{ padding: '24px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: 'var(--radius-md)', textAlign: 'center', marginTop: '10px' }}>
                <h4 style={{ fontSize: '1.3rem', color: '#fff', marginBottom: '10px' }}>What's Your Next Big Idea?</h4>
                <Link to="/contact" className="btn btn-primary">
                  Let's Catch Up ☕
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION I: Authentic Reviews */}
      <section className="section-py" style={{ background: 'var(--color-warm-ivory)' }}>
        <div className="container">
          <div data-reveal style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">VERIFIED EXPERIENCES</span>
            <h2 className="section-title">Don't Just Take Our Word for It.</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Genuine feedback from business owners and enterprise directors who trust Dygytaly in Coimbatore.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '28px' }}>
            {testimonials.map((t, idx) => (
              <div key={t.id} className="glass-card" data-reveal style={{ padding: '32px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', ...staggerDelay(idx, 100) }}>
                <div>
                  <div style={{ display: 'flex', color: '#ffb703', marginBottom: '14px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="#ffb703" />
                    ))}
                  </div>
                  <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.65', marginBottom: '22px' }}>
                    “{t.review_text}”
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '16px' }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', color: 'var(--color-charcoal)' }}>{t.author_name}</h4>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{t.business_name}</span>
                  </div>
                  <a
                    href="https://share.google/0uskTCwteOiHO7Y1Y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="badge badge-sage"
                    style={{ fontSize: '0.75rem' }}
                  >
                    Google Verified <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <a
              href="https://share.google/0uskTCwteOiHO7Y1Y"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ background: '#fff' }}
            >
              Verify All 117+ Reviews on Google Business Profile <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION J: Frequently Asked Questions */}
      <section className="section-py" style={{ background: 'var(--color-soft-cream)' }}>
        <div className="container container-narrow">
          <div data-reveal style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span className="eyebrow">COMMON QUERIES</span>
            <h2 className="section-title">Got Questions? We Have Answers.</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Clear, transparent information about how we partner, bill, and measure success.
            </p>
          </div>

          <div className="faq-list">
            {faqs.map((faq, idx) => (
              <div key={faq.id} className={`faq-item ${activeFaq === idx ? 'active' : ''}`}>
                <div className="faq-header" onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}>
                  <h4>{faq.question}</h4>
                  <ChevronDown
                    size={20}
                    style={{
                      transform: activeFaq === idx ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.25s ease',
                      flexShrink: 0
                    }}
                  />
                </div>
                {activeFaq === idx && (
                  <div className="faq-body">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION K: Coffee Catch-Up & Working Enquiry Form */}
      <section className="section-py coffee-section" id="catch-up">
        <div className="container">
          <div className="coffee-grid">
            {/* Left: 3D Steaming Cup & Inviting Copy */}
            <div>
              <span className="eyebrow" style={{ color: 'var(--color-tangerine)' }}>LET'S TALK</span>
              <h2 className="section-title" style={{ color: '#fff' }}>Coffee First. Business Strategy Next. ☕</h2>
              <p style={{ color: '#cfcacf', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '24px' }}>
                Have a business idea, a marketing challenge or a website that's ready for a fresh start?
                Let's talk.
              </p>
              <p style={{ color: '#cfcacf', fontSize: '0.98rem', lineHeight: '1.65', marginBottom: '32px' }}>
                You don't need a perfect brief or a fully formed plan. Tell us where you are, what you're trying to achieve and what's getting in the way. We'll help you explore the possibilities and identify a sensible next step.
              </p>

              {/* Interactive 3D Coffee Cup Component */}
              <ThreeCoffeeCanvas />
            </div>

            {/* Right: Working Enquiry Form */}
            <div>
              <CoffeeCatchUpForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
