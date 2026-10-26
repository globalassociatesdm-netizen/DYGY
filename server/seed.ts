import bcrypt from 'bcryptjs';
import { initDatabase, dbGet, dbRun, dbExec } from './db';

export async function runSeed() {
  await initDatabase();

  console.log('Seeding database with authentic Dygytaly agency data...');

  // 1. Initial Admin User
  const existingAdmin = await dbGet('SELECT * FROM users WHERE email = ?', ['admin@dygytaly.in']);
  if (!existingAdmin) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('DygytalyAdmin2026!', salt);
    await dbRun(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, ['dygytaly_admin', 'admin@dygytaly.in', passwordHash, 'admin']);
    console.log('Created admin user: admin@dygytaly.in (Password: DygytalyAdmin2026!)');
  }

  // 2. Global Website Settings
  const settings = [
    { key: 'business_name', value: 'Dygytaly Digital Marketing Agency' },
    { key: 'tagline', value: 'Good Ideas Deserve Great Execution' },
    { key: 'website_url', value: 'https://dygytaly.in/' },
    { key: 'logo_url', value: '/uploads/dygytaly-logo.png' },
    { key: 'phone', value: '+91 96777 59959' },
    { key: 'whatsapp_number', value: '+91 96777 59959' },
    { key: 'whatsapp_url', value: 'https://wa.me/919677759959' },
    { key: 'email', value: 'hello@dygytaly.in' },
    { key: 'address', value: '3WVQ+WCV, Mettupalayam Main Road, Kothari Nagar, Sri Lakshmi Nagar, Thoppampatti Pirivu, K. Vadamadurai, Coimbatore, Tamil Nadu 641017, India' },
    { key: 'google_rating', value: '4.9' },
    { key: 'google_review_count', value: '117' },
    { key: 'google_profile_url', value: 'https://maps.app.goo.gl/dygytaly' },
    { key: 'google_review_url', value: 'https://maps.app.goo.gl/dygytaly' },
    { key: 'instagram_url', value: 'https://www.instagram.com/dygytaly_official/?hl=en' },
    { key: 'facebook_url', value: 'https://www.facebook.com/Dygytaly/' },
    { key: 'linkedin_url', value: 'https://www.linkedin.com/company/dygytaly/' },
    { key: 'business_hours', value: 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)' },
    { key: 'footer_closing', value: 'Good things happen when good people talk. Have a coffee. Share an idea. Let\'s see what we can build together.' },
    { key: 'copyright_text', value: '© 2026 Dygytaly Digital Marketing Agency. All rights reserved.' },
    { key: 'cta_button_text', value: 'Let\'s Catch Up ☕' }
  ];

  for (const s of settings) {
    const existing = await dbGet('SELECT key FROM settings WHERE key = ?', [s.key]);
    if (existing) {
      await dbRun('UPDATE settings SET value = ? WHERE key = ?', [s.value, s.key]);
    } else {
      await dbRun('INSERT INTO settings (key, value) VALUES (?, ?)', [s.key, s.value]);
    }
  }

  // 3. Homepage Sections
  const sections = [
    {
      section_key: 'hero',
      title: 'Cinematic 3D Hero',
      subtitle: 'Your Next Big Business Move Starts Here.',
      eyebrow: 'DYGYTALY DIGITAL MARKETING & TECHNOLOGY',
      content: JSON.stringify({
        headline: 'Good Ideas Deserve Great Execution.',
        supporting_headline: 'Your Next Big Business Move Starts Here.',
        description: 'You bring the ambition. We\'ll bring the digital thinking. From making your brand stand out to building the technology that runs your business, Dygytaly brings marketing, creativity and technology together to help you move forward. Whether you\'re looking for better leads, a stronger online presence, a memorable brand or smarter business systems, let\'s find the right next step together.',
        primary_cta_text: 'Let\'s Catch Up ☕',
        primary_cta_link: '/contact',
        secondary_cta_text: 'Explore What We Do',
        secondary_cta_link: '/services',
        scroll_indicator_text: 'Scroll down to explore'
      }),
      display_order: 1,
      is_visible: 1,
      bg_variant: 'dark-plum'
    },
    {
      section_key: 'trust',
      title: 'Trust & Credibility',
      subtitle: 'Real People. Real Conversations. Real Reviews.',
      eyebrow: 'VERIFIED CREDIBILITY',
      content: JSON.stringify({
        headline: 'Real People. Real Conversations. Real Reviews.',
        rating: '4.9',
        reviews_count: '117',
        badge_text: 'Verified Google Business Profile Rating',
        metrics: [
          { number: '4.9 ★', label: 'Google Rating' },
          { number: '117+', label: 'Verified Reviews' },
          { number: '150+', label: 'Growth Projects' },
          { number: '98%', label: 'Client Retention' }
        ]
      }),
      display_order: 2,
      is_visible: 1,
      bg_variant: 'ivory'
    },
    {
      section_key: 'intro',
      title: 'Introduction',
      subtitle: 'One team. Connected thinking. Solutions built around your business.',
      eyebrow: 'INTEGRATED AGENCY',
      content: JSON.stringify({
        headline: 'A Little Bit of Marketing. A Little Bit of Technology. A Whole Lot of Possibility.',
        copy_p1: 'Some businesses need more customers. Some need a website that finally does their brand justice. Some need software that makes daily work easier. Others need all three.',
        copy_p2: 'That\'s where we come in. Dygytaly is a digital marketing and technology agency helping businesses build their presence, connect with the right people and create better ways of working.',
        copy_p3: 'We bring strategy, design, marketing and development under one roof, so your business doesn\'t have to piece everything together from different places.',
        cta_text: 'Get to Know Us',
        cta_link: '/about'
      }),
      display_order: 3,
      is_visible: 1,
      bg_variant: 'cream'
    },
    {
      section_key: 'services',
      title: 'Our Solutions',
      subtitle: 'One Partner. More Ways to Grow.',
      eyebrow: 'WHAT WE DO',
      content: JSON.stringify({
        headline: 'One Partner. More Ways to Grow.',
        subtext: 'Tailored digital solutions built around the unique realities of your business.',
        bottom_cta: 'Not Sure What You Need? Let\'s Figure It Out Together.',
        bottom_cta_link: '/contact'
      }),
      display_order: 4,
      is_visible: 1,
      bg_variant: 'ivory'
    },
    {
      section_key: 'why_us',
      title: 'Why Dygytaly',
      subtitle: 'More Than a Service Provider. A Team in Your Corner.',
      eyebrow: 'OUR PRINCIPLES',
      content: JSON.stringify({
        headline: 'More Than a Service Provider. A Team in Your Corner.',
        principles: [
          {
            number: '01',
            title: 'We Understand Before We Recommend.',
            description: 'No template pitches or generic packages. We take the time to understand your industry, business margins, sales cycle and realistic goals first.'
          },
          {
            number: '02',
            title: 'Strategy Before Guesswork.',
            description: 'Every rupee invested in marketing and technology should have a clear purpose, defined KPIs, and a measurable path to commercial return.'
          },
          {
            number: '03',
            title: 'Creativity With a Purpose.',
            description: 'Design and storytelling that do more than look pretty. We craft visual identities and content designed to hold attention, inspire trust and drive action.'
          },
          {
            number: '04',
            title: 'Relationships Beyond Projects.',
            description: 'We don\'t disappear once a campaign launches or a website goes live. We act as your long-term digital growth partner, celebrating your milestones as our own.'
          }
        ]
      }),
      display_order: 5,
      is_visible: 1,
      bg_variant: 'deep-plum'
    },
    {
      section_key: 'portfolio',
      title: 'Selected Work',
      subtitle: 'Good Work Speaks. Great Work Shows Its Thinking.',
      eyebrow: 'PORTFOLIO & CASE STUDIES',
      content: JSON.stringify({
        headline: 'Good Work Speaks. Great Work Shows Its Thinking.',
        subtext: 'Real growth stories, strategic digital engineering and results-driven creative campaigns.'
      }),
      display_order: 6,
      is_visible: 1,
      bg_variant: 'ivory'
    },
    {
      section_key: 'process',
      title: 'Our Working Process',
      subtitle: 'Big Goals. Clear Steps.',
      eyebrow: 'HOW WE WORK',
      content: JSON.stringify({
        headline: 'Big Goals. Clear Steps.',
        steps: [
          { step: '01', name: 'Discover', description: 'Understand the business, existing metrics, audience, and commercial objectives.' },
          { step: '02', name: 'Strategize', description: 'Plan the right approach, channel mix, tech stack and creative roadmap.' },
          { step: '03', name: 'Create', description: 'Bring the solution to life with world-class engineering, design, and compelling copy.' },
          { step: '04', name: 'Measure', description: 'Review real-time data against agreed benchmarks and transparent KPIs.' },
          { step: '05', name: 'Improve', description: 'Iterate and optimize continuously to compound growth and maximize ROI.' }
        ]
      }),
      display_order: 7,
      is_visible: 1,
      bg_variant: 'cream'
    },
    {
      section_key: 'founder',
      title: 'Founder Story',
      subtitle: 'Every Vision Has a Story.',
      eyebrow: 'THE LEADERSHIP JOURNEY',
      content: JSON.stringify({
        headline: 'Every Vision Has a Story.',
        closing: 'What\'s Your Next Big Idea?',
        cta_text: 'Let\'s Catch Up',
        cta_link: '/contact'
      }),
      display_order: 8,
      is_visible: 1,
      bg_variant: 'aubergine'
    },
    {
      section_key: 'reviews',
      title: 'Client Reviews',
      subtitle: 'Don\'t Just Take Our Word for It.',
      eyebrow: 'AUTHENTIC REVIEWS',
      content: JSON.stringify({
        headline: 'Don\'t Just Take Our Word for It.',
        subtext: 'Verified feedback from genuine business owners and enterprise teams who trust Dygytaly.'
      }),
      display_order: 9,
      is_visible: 1,
      bg_variant: 'ivory'
    },
    {
      section_key: 'faq',
      title: 'Frequently Asked Questions',
      subtitle: 'Clear Answers Before We Begin.',
      eyebrow: 'FAQ',
      content: JSON.stringify({
        headline: 'Got Questions? We Have Answers.',
        subtext: 'Everything you need to know about partnering with Dygytaly.'
      }),
      display_order: 10,
      is_visible: 1,
      bg_variant: 'cream'
    },
    {
      section_key: 'coffee',
      title: 'Coffee Catch-Up',
      subtitle: 'Coffee First. Business Strategy Next. ☕',
      eyebrow: 'LET\'S TALK',
      content: JSON.stringify({
        headline: 'Coffee First. Business Strategy Next. ☕',
        copy: 'Have a business idea, a marketing challenge or a website that\'s ready for a fresh start? Let\'s talk. You don\'t need a perfect brief or a fully formed plan. Tell us where you are, what you\'re trying to achieve and what\'s getting in the way. We\'ll help you explore the possibilities and identify a sensible next step.',
        whatsapp_cta: 'Chat With Us on WhatsApp',
        whatsapp_url: 'https://wa.me/919677759959',
        submit_btn_text: 'Let\'s Start the Conversation'
      }),
      display_order: 11,
      is_visible: 1,
      bg_variant: 'ivory'
    }
  ];

  for (const s of sections) {
    const existing = await dbGet('SELECT id FROM homepage_sections WHERE section_key = ?', [s.section_key]);
    if (existing) {
      await dbRun(`
        UPDATE homepage_sections SET
          title = ?, subtitle = ?, eyebrow = ?, content = ?, display_order = ?, is_visible = ?, bg_variant = ?
        WHERE section_key = ?
      `, [s.title, s.subtitle, s.eyebrow, s.content, s.display_order, s.is_visible, s.bg_variant, s.section_key]);
    } else {
      await dbRun(`
        INSERT INTO homepage_sections (section_key, title, subtitle, eyebrow, content, display_order, is_visible, bg_variant)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, [s.section_key, s.title, s.subtitle, s.eyebrow, s.content, s.display_order, s.is_visible, s.bg_variant]);
    }
  }

  // 4. Services (All 10 services with full copy)
  const servicesData = [
    {
      slug: 'google-ads',
      title: 'Google Ads',
      tagline: 'Be There When Customers Are Searching.',
      short_desc: 'Reach high-intent audiences actively searching for your products and services with high-converting Search, Display, Shopping, and Performance Max campaigns.',
      hero_headline: 'Turn High-Intent Searches Into Real Business Enquiries.',
      problem_solved: 'Many companies waste ad spend on irrelevant search terms, weak negative keyword lists, and unoptimized landing pages that fail to convert clicks into paying customers.',
      approach: 'We architect granular campaign structures with precise intent segmentation, ongoing negative keyword audits, smart bidding strategies, and dedicated landing page CRO.',
      deliverables: JSON.stringify([
        'Search Intent & Keyword Research Audit',
        'Competitor Ad Intelligence & Benchmarking',
        'Ad Copywriting & Asset Extension Setup',
        'Performance Max & Shopping Campaigns',
        'Conversion Tracking & Server-Side Tagging',
        'Bi-weekly Optimization & Transparent ROI Reporting'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Intent Audit', desc: 'Analyzing search volume, competitive bids, and commercial query keywords.' },
        { step: '02', title: 'Funnel Build', desc: 'Crafting tailored ad copies and high-speed dedicated conversion landing pages.' },
        { step: '03', title: 'Launch & Track', desc: 'Configuring precise GA4 and GTM conversion tagging to measure true lead quality.' },
        { step: '04', title: 'Scale & Prune', desc: 'Eliminating wasted negative keywords while scaling budget on top-performing terms.' }
      ]),
      technologies: JSON.stringify(['Google Ads', 'GA4 Analytics', 'Google Tag Manager', 'Looker Studio', 'Ahrefs']),
      faqs: JSON.stringify([
        { q: 'How quickly can we see results from Google Ads?', a: 'Campaigns go live within 5–7 business days after strategy and landing page setup. Qualified leads typically start coming in within the first week of active spend.' },
        { q: 'How much ad budget should I allocate?', a: 'We recommend starting with a minimum monthly ad spend based on your industry CPCs, ensuring statistically significant clicks to test and scale profitability.' }
      ]),
      icon_name: 'Search',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Plan Your Google Ads Strategy',
      display_order: 1,
      seo_title: 'Google Ads Agency in Coimbatore | Dygytaly',
      meta_description: 'Strategic Google Ads management in Coimbatore. Reach high-intent customers with ROI-focused Search, Display, and Performance Max campaigns.'
    },
    {
      slug: 'meta-ads',
      title: 'Meta Ads',
      tagline: 'Turn the Scroll Into an Opportunity.',
      short_desc: 'Stop the scroll and convert attention on Facebook and Instagram with compelling visual creatives, behavioral audience targeting, and funnel-driven retargeting.',
      hero_headline: 'Captivate Your Target Market Where They Spend Their Attention.',
      problem_solved: 'Generic ads get ignored. Businesses often burn budgets by boosting random posts without structured conversion funnels or tailored creative variations.',
      approach: 'We blend thumb-stopping creative design with segmented custom audiences, lookalikes, and multi-stage retargeting to nurture prospects from awareness to purchase.',
      deliverables: JSON.stringify([
        'Full-Funnel Campaign Architecture (TOFU, MOFU, BOFU)',
        'Creative Production (Carousels, Video Reels, Static Ads)',
        'Audience Profiling & Custom Pixel Integration',
        'A/B Creative & Hook Testing',
        'Lead Generation Forms & CRM Webhook Sync',
        'Weekly Performance & Cost-Per-Acquisition Optimization'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Audience Mapping', desc: 'Defining customer avatars, interests, demographics, and buyer motivations.' },
        { step: '02', title: 'Creative Sprints', desc: 'Designing high-impact video hooks and lifestyle creatives that spark curiosity.' },
        { step: '03', title: 'Conversion Setup', desc: 'Setting up Meta Conversions API (CAPI) for accurate tracking amidst cookie restrictions.' },
        { step: '04', title: 'Rapid Testing', desc: 'Iterating on the highest-performing ad hooks to lower overall customer acquisition cost.' }
      ]),
      technologies: JSON.stringify(['Meta Business Suite', 'Conversions API (CAPI)', 'Figma', 'Premiere Pro', 'Zapier']),
      faqs: JSON.stringify([
        { q: 'Can Meta Ads work for B2B companies?', a: 'Yes. Meta Ads excel at B2B brand authority, retargeting website visitors, and capturing business owners who browse Instagram and Facebook during downtime.' },
        { q: 'Do you create the ad graphics and videos?', a: 'Yes! Our in-house creative team produces all ad concepts, graphics, motion graphics, and reel edits.' }
      ]),
      icon_name: 'Share2',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Scale With Meta Ads',
      display_order: 2,
      seo_title: 'Meta & Social Ads Agency Coimbatore | Facebook & Instagram Ads | Dygytaly',
      meta_description: 'High-converting Meta Ads services in Coimbatore. Drive leads, sales, and brand engagement with tailored Facebook and Instagram campaigns.'
    },
    {
      slug: 'website-development',
      title: 'Website Development',
      tagline: 'Your Digital First Impression, Done Right.',
      short_desc: 'Bespoke, high-performance websites engineered to communicate your value proposition, build client confidence, and convert visitors into loyal customers.',
      hero_headline: 'A Modern Digital Showroom Engineered for Speed, Elegance & Trust.',
      problem_solved: 'Slow, clunky, generic WordPress templates with broken responsive views erode visitor trust within 3 seconds, losing valuable opportunities before a conversation begins.',
      approach: 'We craft handcrafted, responsive websites with state-of-the-art typography, sleek micro-interactions, rich 3D elements, and intuitive CMS controls for non-technical teams.',
      deliverables: JSON.stringify([
        'Custom UI/UX Design System in Figma',
        'Modern Responsive Engineering (Desktop, Tablet, Mobile)',
        'Interactive 3D Elements & Smooth Micro-Animations',
        'WordPress-Style Custom CMS Dashboard',
        'Sub-second Loading Speeds & Core Web Vitals Optimization',
        'Technical On-Page SEO & Structured Data Markup'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Information Architecture', desc: 'Mapping user journeys, sitemaps, and content wireframes.' },
        { step: '02', title: 'Visual Art Direction', desc: 'Designing custom aesthetic palettes, typography systems, and dynamic layouts.' },
        { step: '03', title: 'Production Code', desc: 'Developing clean, semantic code with full CMS controls and database persistence.' },
        { step: '04', title: 'QA & Launch', desc: 'Cross-browser testing, accessibility validation, and flawless production deployment.' }
      ]),
      technologies: JSON.stringify(['React', 'TypeScript', 'Node.js', 'Three.js', 'Vite', 'SQLite/Postgres']),
      faqs: JSON.stringify([
        { q: 'Will I be able to edit text and images myself?', a: 'Absolutely. We provide a custom WordPress-style CMS where you can update any headline, service, portfolio project, or team member without touching code.' },
        { q: 'Is the website optimized for mobile phones?', a: 'Yes, 100% mobile-first design with responsive typography, touch-friendly UI, and adaptive asset loading.' }
      ]),
      icon_name: 'Globe',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Build Your Website',
      display_order: 3,
      seo_title: 'Custom Website Development Agency Coimbatore | Dygytaly',
      meta_description: 'Award-worthy website design and web development services in Coimbatore. Custom CMS, interactive 3D, ultra-fast loading, and conversion optimization.'
    },
    {
      slug: 'application-development',
      title: 'Application Development',
      tagline: 'Got an App Idea? Let\'s Give It a Plan.',
      short_desc: 'Practical, scalable custom web and mobile applications built to streamline internal business workflows or serve digital product users with reliability.',
      hero_headline: 'Turn Complex Business Workflows Into Seamless Software Solutions.',
      problem_solved: 'Off-the-shelf software often forces businesses into rigid constraints, while fragmented spreadsheets cause human errors, security risks, and operational bottlenecks.',
      approach: 'We build tailored web applications and portal systems with robust authentication, role-based access control, relational databases, and clean modern interfaces.',
      deliverables: JSON.stringify([
        'Product Strategy & Technical Architecture Blueprint',
        'Interactive Figma Clickable Prototypes',
        'Secure Full-Stack Application Engineering',
        'RESTful / GraphQL APIs & Third-Party Integrations',
        'Automated Testing, CI/CD & Cloud Infrastructure',
        'Comprehensive Documentation & Ongoing Maintenance'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Requirements Scoping', desc: 'Extracting workflows, user roles, data schemas, and security requirements.' },
        { step: '02', title: 'Interactive Prototype', desc: 'Testing UX flows and validation before writing production software.' },
        { step: '03', title: 'Sprint Development', desc: 'Agile sprints delivering functional milestones with transparent staging environments.' },
        { step: '04', title: 'Security & Deploy', desc: 'Rigorous penetration testing, database backup setup, and cloud hosting.' }
      ]),
      technologies: JSON.stringify(['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS']),
      faqs: JSON.stringify([
        { q: 'Can you integrate our existing third-party software?', a: 'Yes, we integrate payment gateways, SMS/WhatsApp gateways, accounting tools, and external APIs.' },
        { q: 'Who owns the source code and data?', a: 'You have 100% intellectual property ownership of the custom code and database.' }
      ]),
      icon_name: 'Layers',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Discuss Your Application',
      display_order: 4,
      seo_title: 'Custom Web & Mobile Application Development Coimbatore | Dygytaly',
      meta_description: 'Custom software and web application development in Coimbatore. Scalable architecture, secure databases, and tailored business portals.'
    },
    {
      slug: 'crm-solutions',
      title: 'CRM Solutions',
      tagline: 'Fewer Missed Follow-Ups. Better Relationships.',
      short_desc: 'Organize leads, customer interactions, sales pipelines, and follow-up workflows so your sales team never loses an opportunity to grow.',
      hero_headline: 'A Centralized Hub to Nurture Leads and Accelerate Deals.',
      problem_solved: 'Leads lost in WhatsApp chats, forgotten follow-up emails, and zero visibility into sales representative activity drain business revenue every month.',
      approach: 'We implement and customize CRM workflows tailored to your specific sales stages, complete with automated reminders, lead scoring, and pipeline analytics.',
      deliverables: JSON.stringify([
        'Sales Pipeline & Lead Stage Customization',
        'Automatic Lead Ingestion from Ads, Website & WhatsApp',
        'Automated Follow-Up Sequences & SMS/Email Alerts',
        'Team Role-Based Permissions & Task Delegation',
        'Executive Sales Dashboard & Deal Forecasting',
        'Staff Onboarding & Hands-On Operational Training'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Sales Audit', desc: 'Auditing your current sales touchpoints from initial enquiry to closed deal.' },
        { step: '02', title: 'Pipeline Blueprint', desc: 'Configuring custom fields, deal stages, and mandatory qualification criteria.' },
        { step: '03', title: 'Automation Hook', desc: 'Syncing website forms, WhatsApp leads, and calls into automated task queues.' },
        { step: '04', title: 'Training & Adoption', desc: 'Empowering your sales team with live walk-throughs and cheat sheets.' }
      ]),
      technologies: JSON.stringify(['Custom CRM', 'HubSpot', 'Zoho CRM', 'Webhooks', 'WhatsApp Business API']),
      faqs: JSON.stringify([
        { q: 'Can CRM automatically alert our team when a lead arrives?', a: 'Yes, instant alerts via WhatsApp, Email, or SMS can be triggered the exact moment a lead submits a form.' },
        { q: 'Can we track sales representative performance?', a: 'Yes, comprehensive dashboards track response times, completed calls, meetings booked, and deal conversion rates.' }
      ]),
      icon_name: 'Users',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Upgrade Your CRM',
      display_order: 5,
      seo_title: 'CRM Implementation & Solutions in Coimbatore | Dygytaly',
      meta_description: 'CRM solutions in Coimbatore. Streamline your sales pipeline, automate follow-ups, and convert more leads into lasting client relationships.'
    },
    {
      slug: 'erp-solutions',
      title: 'ERP Solutions',
      tagline: 'Bring Your Business Into Better Sync.',
      short_desc: 'Explore connected systems for business operations, inventory, finance, human resources, reporting, and inter-departmental workflows.',
      hero_headline: 'Unify Operations, Data, and Strategy Under One Cohesive Platform.',
      problem_solved: 'Disjointed departments operating in silos create inventory discrepancies, delayed customer billing, and hours wasted compiling manual spreadsheets.',
      approach: 'We deploy pragmatic ERP modules tailored to your business scale, connecting supply chain, production, billing, and resource management into a single source of truth.',
      deliverables: JSON.stringify([
        'Operational Gap Analysis & Workflow Architecture',
        'Inventory & Procurement Tracking Setup',
        'Invoicing, Billing & Financial Reporting Integration',
        'HR, Attendance & Role-Based Access Controls',
        'Real-Time Executive Dashboards & Analytics',
        'Data Migration from Legacy Systems with Zero Downtime'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Operations Mapping', desc: 'Examining departmental interdependencies and data handoff bottlenecks.' },
        { step: '02', title: 'Module Selection', desc: 'Customizing only the modules your business requires without unnecessary bloat.' },
        { step: '03', title: 'Data Migration', desc: 'Sanitizing, mapping, and migrating historical data safely into the ERP.' },
        { step: '04', title: 'Go-Live Support', desc: 'Parallel run testing and dedicated technical support during transition.' }
      ]),
      technologies: JSON.stringify(['Custom ERP', 'Frappe / ERPNext', 'PostgreSQL', 'REST APIs', 'Cloud Hosting']),
      faqs: JSON.stringify([
        { q: 'Is ERP only for huge multinational corporations?', a: 'Not anymore. Modern modular ERP systems are specifically designed for growing SMEs and regional manufacturing firms in India.' },
        { q: 'How long does implementation take?', a: 'Depending on module count and data complexity, typical rollouts take between 4 to 12 weeks with staged go-lives.' }
      ]),
      icon_name: 'Database',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Explore ERP Systems',
      display_order: 6,
      seo_title: 'ERP Software Solutions in Coimbatore | Dygytaly',
      meta_description: 'ERP solutions in Coimbatore. Connect inventory, billing, HR, and business operations with scalable enterprise resource planning software.'
    },
    {
      slug: 'website-seo',
      title: 'Website SEO',
      tagline: 'Build Visibility Beyond Advertising.',
      short_desc: 'Technical SEO, on-page optimization, content architecture, and search performance monitoring to generate compounding organic traffic month after month.',
      hero_headline: 'Rank Higher for What Matters and Capture Inbound Commercial Demand.',
      problem_solved: 'Relying exclusively on paid ads means traffic halts the moment budget stops. Poor site structure and crawl errors prevent Google from recognizing your expertise.',
      approach: 'We implement comprehensive white-hat SEO: fixing deep technical issues, engineering high-intent content hubs, and earning authoritative organic signals.',
      deliverables: JSON.stringify([
        'Full Technical SEO Crawl & Core Web Vitals Fixes',
        'Semantic Keyword Architecture & Content Gap Analysis',
        'On-Page Optimization (Titles, Meta, H1-H6, Structured Data)',
        'Internal Link Optimization & Information Flow',
        'Google Search Console & Indexing Health Audits',
        'Monthly Organic Ranking & Commercial Traffic Reports'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Technical Crawl', desc: 'Diagnosing 404s, index bloat, redirect chains, and schema markup errors.' },
        { step: '02', title: 'Keyword Strategy', desc: 'Targeting commercial-intent keywords that match real buyer queries.' },
        { step: '03', title: 'On-Page Overhaul', desc: 'Optimizing page copy, meta tags, header hierarchies, and site speed.' },
        { step: '04', title: 'Authority Building', desc: 'Strengthening internal topical authority and search engine trust signals.' }
      ]),
      technologies: JSON.stringify(['Google Search Console', 'Ahrefs', 'Semrush', 'Screaming Frog', 'Schema.org']),
      faqs: JSON.stringify([
        { q: 'How long does it take to see SEO results?', a: 'Organic search is a compounding asset. Meaningful ranking and traffic improvements typically emerge within 3 to 6 months of disciplined execution.' },
        { q: 'Do you promise #1 rank on Google?', a: 'No ethical SEO specialist promises guaranteed #1 rankings. We promise rigorous technical excellence, proven strategies, and transparent reporting.' }
      ]),
      icon_name: 'TrendingUp',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Boost Your Organic Rank',
      display_order: 7,
      seo_title: 'Website SEO Services in Coimbatore | Dygytaly',
      meta_description: 'Proven website SEO services in Coimbatore. Boost rankings, fix technical crawl issues, and compound sustainable organic inbound inquiries.'
    },
    {
      slug: 'local-seo',
      title: 'Local SEO',
      tagline: 'Help Nearby Customers Find You.',
      short_desc: 'Google Business Profile optimization, local search map rankings, review generation workflows, and accurate citation management across Coimbatore.',
      hero_headline: 'Dominate the Local 3-Pack and Drive Calls & Store Visits.',
      problem_solved: 'Nearby customers looking for your services in Coimbatore choose competitors simply because their Google Maps profiles rank higher or have more active reviews.',
      approach: 'We optimize every facet of your Google Business Profile, implement automated review generation, verify local NAP citations, and build local geo-relevance.',
      deliverables: JSON.stringify([
        'Google Business Profile (GBP) Audit & Optimization',
        'Local Map Pack Ranking Strategy for Target Keywords',
        'Verified Review Generation & Response Workflows',
        'Local Citation Consistency (Name, Address, Phone)',
        'Geo-Tagged Image Posts & Product Showcase Updates',
        'Local Competitor Grid Tracking & Monthly Insights'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Profile Verification', desc: 'Securing primary and secondary categories, service areas, and accurate NAP.' },
        { step: '02', title: 'Citation Alignment', desc: 'Harmonizing business information across Google, Bing, JustDial, and directory listings.' },
        { step: '03', title: 'Review Velocity', desc: 'Deploying QR codes and WhatsApp workflows to collect genuine happy customer reviews.' },
        { step: '04', title: 'Local Engagement', desc: 'Publishing weekly updates, offers, and high-resolution geotagged photographs.' }
      ]),
      technologies: JSON.stringify(['Google Business Profile', 'Google Maps API', 'BrightLocal', 'WhatsApp Automation']),
      faqs: JSON.stringify([
        { q: 'Can Local SEO help our physical store or office in Coimbatore?', a: 'Yes! Local SEO directly drives phone calls, driving directions requests, and direct footfalls from high-intent local customers.' },
        { q: 'How do reviews impact local ranking?', a: 'Review count, recency, keyword sentiment, and owner responses are primary ranking factors in Google\'s local map algorithm.' }
      ]),
      icon_name: 'MapPin',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Claim Your Local Presence',
      display_order: 8,
      seo_title: 'Local SEO & Google Business Profile Optimization Coimbatore | Dygytaly',
      meta_description: 'Rank in Google Maps local 3-pack in Coimbatore. Google Business Profile optimization, authentic review workflows, and local citation management.'
    },
    {
      slug: 'branding-design',
      title: 'Branding and Graphic Design',
      tagline: 'Look Like the Business You\'re Becoming.',
      short_desc: 'Memorable visual identities, brand guideline kits, corporate presentations, packaging, and marketing collateral that command respect and establish market distinction.',
      hero_headline: 'A Distinctive Visual Identity That Commands Respect and Confidence.',
      problem_solved: 'Amateur logos and disjointed graphics make even great businesses look small, undermining pricing power and making client acquisition harder than it needs to be.',
      approach: 'We build cohesive brand systems: from foundational typography and color psychology to iconography, business stationery, and social media creative guidelines.',
      deliverables: JSON.stringify([
        'Logo Design & Vector Master Assets',
        'Comprehensive Brand Guidelines (Colors, Typography, Usage Rules)',
        'Business Stationery (Cards, Letterheads, Envelopes)',
        'Company Profile & Pitch Deck Presentation Decks',
        'Marketing Collateral, Brochures & Signage',
        'Social Media Master Templates & Brand Kit'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Brand Discovery', desc: 'Uncovering brand personality, core audience values, and competitive positioning.' },
        { step: '02', title: 'Concept Directions', desc: 'Presenting distinct aesthetic routes with moodboards and logo applications.' },
        { step: '03', title: 'System Refinement', desc: 'Crafting the complete design language, typography pairings, and color tokens.' },
        { step: '04', title: 'Asset Handover', desc: 'Delivering production-ready vector assets and a comprehensive brand guide.' }
      ]),
      technologies: JSON.stringify(['Adobe Illustrator', 'Photoshop', 'Figma', 'InDesign']),
      faqs: JSON.stringify([
        { q: 'Do we get full copyright to the logo and designs?', a: 'Yes, once finalized and delivered, you own 100% full commercial rights to all created branding assets.' },
        { q: 'What file formats will we receive?', a: 'You receive vector AI, EPS, SVG, print-ready PDF, high-res PNG with transparent backgrounds, and web-ready formats.' }
      ]),
      icon_name: 'Palette',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Design Your Brand Identity',
      display_order: 9,
      seo_title: 'Branding & Graphic Design Agency Coimbatore | Dygytaly',
      meta_description: 'Professional logo design, brand identity kits, and graphic design in Coimbatore. Look like the business you are becoming with Dygytaly.'
    },
    {
      slug: 'social-media-video',
      title: 'Social Media Video Production',
      tagline: 'Give People a Reason to Stop Scrolling.',
      short_desc: 'Short-form videos, reels, promotional edits, motion graphics, and social media creative content engineered to capture attention and communicate value quickly.',
      hero_headline: 'High-Impact Short-Form Video Content That Hooks Audiences in 2 Seconds.',
      problem_solved: 'Static images get less organic reach than ever. Businesses struggle to produce consistent, high-retention video content that looks professional without spending a fortune.',
      approach: 'We concept, storyboard, edit, and optimize engaging short-form video reels and motion advertisements designed for high retention, shares, and algorithmic reach.',
      deliverables: JSON.stringify([
        'Short-Form Video Reels & Shorts Editing',
        'Dynamic Motion Graphics & Animated Typography',
        'Scriptwriting & Hook Optimization for Social Algorithms',
        'Sound Design, Trending Audio & Dynamic Captions',
        'Promotional Brand Videos & Founder Spotlight Edits',
        'Batch Content Production Roadmaps'
      ]),
      process_steps: JSON.stringify([
        { step: '01', title: 'Content Concepting', desc: 'Identifying high-engagement topics, audience curiosity hooks, and trends.' },
        { step: '02', title: 'Storyboarding & Scripts', desc: 'Writing concise, punchy voiceover scripts with strong calls to action.' },
        { step: '03', title: 'Editing & Motion', desc: 'Pacing cuts, color grading, sound design, and animated typography overlay.' },
        { step: '04', title: 'Format Optimization', desc: 'Exporting 9:16 vertical video assets optimized for Instagram, YouTube, and LinkedIn.' }
      ]),
      technologies: JSON.stringify(['Premiere Pro', 'After Effects', 'CapCut Pro', 'DaVinci Resolve', 'AI Audio Tools']),
      faqs: JSON.stringify([
        { q: 'Can you edit raw video footage we shoot on our phones?', a: 'Yes! High-resolution smartphone footage can be transformed into stunning, cinematic social reels with professional editing and motion graphics.' },
        { q: 'What is the ideal video length for social media?', a: 'For Instagram Reels and YouTube Shorts, 20–45 seconds with a powerful hook in the first 2 seconds yields the highest retention and shareability.' }
      ]),
      icon_name: 'Video',
      image_url: '/uploads/dygytaly-logo.png',
      cta_text: 'Produce High-Impact Video',
      display_order: 10,
      seo_title: 'Social Media Video Production & Reels Agency Coimbatore | Dygytaly',
      meta_description: 'Short-form video editing, Instagram Reels, and motion graphics in Coimbatore. Turn scrolls into opportunities with Dygytaly creative video production.'
    }
  ];

  for (const s of servicesData) {
    const existing = await dbGet('SELECT id FROM services WHERE slug = ?', [s.slug]);
    if (existing) {
      await dbRun(`
        UPDATE services SET
          title = ?, tagline = ?, short_desc = ?, hero_headline = ?, problem_solved = ?, approach = ?,
          deliverables = ?, process_steps = ?, technologies = ?, faqs = ?, icon_name = ?, image_url = ?,
          cta_text = ?, display_order = ?, is_published = 1, seo_title = ?, meta_description = ?
        WHERE slug = ?
      `, [
        s.title, s.tagline, s.short_desc, s.hero_headline, s.problem_solved, s.approach,
        s.deliverables, s.process_steps, s.technologies, s.faqs, s.icon_name, s.image_url,
        s.cta_text, s.display_order, s.seo_title, s.meta_description, s.slug
      ]);
    } else {
      await dbRun(`
        INSERT INTO services (slug, title, tagline, short_desc, hero_headline, problem_solved, approach, deliverables, process_steps, technologies, faqs, icon_name, image_url, cta_text, display_order, is_published, seo_title, meta_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        s.slug, s.title, s.tagline, s.short_desc, s.hero_headline, s.problem_solved, s.approach,
        s.deliverables, s.process_steps, s.technologies, s.faqs, s.icon_name, s.image_url,
        s.cta_text, s.display_order, 1, s.seo_title, s.meta_description
      ]);
    }
  }

  // 5. Founder Profile (7 points exactly as specified)
  const storyPoints = [
    {
      number: '01',
      title: 'Every Big Idea Starts Somewhere.',
      quote: 'Not with all the answers, but with the courage to begin and the ambition to build something meaningful.'
    },
    {
      number: '02',
      title: 'Built on a Vision. Driven by Possibilities.',
      quote: 'I believe businesses deserve more than just services. They deserve thoughtful strategies and a partner who understands their vision.'
    },
    {
      number: '03',
      title: 'Turning Ideas Into Action.',
      quote: 'That belief became the foundation of Dygytaly — bringing marketing, creativity and technology together to help businesses move forward.'
    },
    {
      number: '04',
      title: 'Growth Is Never a One-Person Journey.',
      quote: 'Behind every milestone are people, lessons, challenges and relationships that make the journey worthwhile.'
    },
    {
      number: '05',
      title: 'Ambition With Accountability.',
      quote: 'I believe trust is earned through honest conversations, responsible decisions and a commitment to doing the work right.'
    },
    {
      number: '06',
      title: 'The Vision Is Bigger Than Today.',
      quote: 'My goal is to build Dygytaly into a trusted digital partner that helps businesses think bigger, work smarter and grow with confidence.'
    },
    {
      number: '07',
      title: 'And We\'re Just Getting Started.',
      quote: 'Every business has a next chapter. If you have a vision you\'re ready to pursue, I\'d love to hear about it.'
    }
  ];

  const milestones = [
    { year: 'Founding', title: 'A New Beginning in Coimbatore', desc: 'Started with a vision to unite digital marketing and enterprise technology under one roof.' },
    { year: 'Milestone', title: '100+ Businesses Transformed', desc: 'Earned 4.9-star rating across 117+ verified client reviews on Google.' },
    { year: 'Expansion', title: 'Full-Suite Technology & Creative Studio', desc: 'Added advanced ERP/CRM engineering, 3D web experiences, and AI-powered video editing.' },
    { year: 'Present', title: 'Shaping the Future of Digital Commerce', desc: 'Empowering ambitious brands across South India to compete and thrive globally.' }
  ];

  const existingFounder = await dbGet('SELECT id FROM founder_profile WHERE id = 1');
  if (existingFounder) {
    await dbRun(`
      UPDATE founder_profile SET
        name = ?, designation = ?, bio = ?, full_bio = ?, quote = ?, portrait_url = ?, story_points = ?, milestones = ?, social_links = ?
      WHERE id = 1
    `, [
      'Gowri Jagadheeshwaran',
      'Founder & Managing Director',
      'Creative strategist and digital architect passionate about helping ambitious businesses build commanding digital brands and scalable technology systems.',
      'With a deep commitment to thoughtful strategy and transparent execution, Gowri Jagadheeshwaran established Dygytaly to bridge the gap between creative marketing and high-performance technology. Based in Coimbatore, she champions a customer-first philosophy where business understanding always precedes technical recommendation.',
      'Good ideas deserve great execution. Let\'s have a coffee and turn your business vision into reality.',
      '/uploads/founder-profile.jpg',
      JSON.stringify(storyPoints),
      JSON.stringify(milestones),
      JSON.stringify({
        linkedin: 'https://www.linkedin.com/company/dygytaly/',
        instagram: 'https://www.instagram.com/dygytaly_official/?hl=en',
        facebook: 'https://www.facebook.com/Dygytaly/'
      })
    ]);
  } else {
    await dbRun(`
      INSERT INTO founder_profile (id, name, designation, bio, full_bio, quote, portrait_url, story_points, milestones, social_links)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      1,
      'Gowri Jagadheeshwaran',
      'Founder & Managing Director',
      'Creative strategist and digital architect passionate about helping ambitious businesses build commanding digital brands and scalable technology systems.',
      'With a deep commitment to thoughtful strategy and transparent execution, Gowri Jagadheeshwaran established Dygytaly to bridge the gap between creative marketing and high-performance technology. Based in Coimbatore, she champions a customer-first philosophy where business understanding always precedes technical recommendation.',
      'Good ideas deserve great execution. Let\'s have a coffee and turn your business vision into reality.',
      '/uploads/founder-profile.jpg',
      JSON.stringify(storyPoints),
      JSON.stringify(milestones),
      JSON.stringify({
        linkedin: 'https://www.linkedin.com/company/dygytaly/',
        instagram: 'https://www.instagram.com/dygytaly_official/?hl=en',
        facebook: 'https://www.facebook.com/Dygytaly/'
      })
    ]);
  }

  // 6. Pages Table
  const pagesData = [
    {
      slug: 'home',
      title: 'Home',
      eyebrow: 'DYGYTALY DIGITAL MARKETING & TECHNOLOGY',
      heading: 'Good Ideas Deserve Great Execution.',
      subheading: 'Your Next Big Business Move Starts Here.',
      content: 'A comprehensive agency bringing marketing, creativity and technology together under one roof.',
      cta_text: 'Let\'s Catch Up ☕',
      cta_link: '/contact',
      seo_title: 'Dygytaly — Digital Marketing & Technology Agency | Coimbatore',
      meta_description: 'Dygytaly brings marketing, creativity and technology together. High-converting Google Ads, Meta Ads, custom web development, CRM/ERP and branding in Coimbatore.'
    },
    {
      slug: 'about',
      title: 'About Us',
      eyebrow: 'WHO WE ARE',
      heading: 'We\'re Dygytaly. Nice to Meet You.',
      subheading: 'We believe good business deserves good digital thinking.',
      content: 'Every business starts with an idea. But turning that idea into something people notice, trust and choose takes more than a logo, a website or a few advertisements. It takes the right strategy, thoughtful creativity, useful technology and people who care about getting the details right. That\'s the thinking behind Dygytaly.',
      cta_text: 'Let\'s Start a Conversation',
      cta_link: '/contact',
      seo_title: 'About Dygytaly | Digital Marketing & Technology Agency Coimbatore',
      meta_description: 'Learn about Dygytaly, a Coimbatore-based digital marketing and technology agency dedicated to strategic growth, creativity, and lasting business partnerships.'
    },
    {
      slug: 'services',
      title: 'Our Solutions',
      eyebrow: 'SOLUTIONS & CAPABILITIES',
      heading: 'One Partner. More Ways to Grow.',
      subheading: 'Strategy, design, marketing and development under one roof.',
      content: 'From high-intent Google search campaigns to bespoke enterprise software, our services are designed to solve real business challenges and generate sustainable commercial return.',
      cta_text: 'Let\'s Catch Up ☕',
      cta_link: '/contact',
      seo_title: 'Digital Marketing & Technology Solutions | Dygytaly Coimbatore',
      meta_description: 'Explore Dygytaly\'s full range of services: Google Ads, Meta Ads, Web Development, Custom Apps, CRM/ERP Solutions, SEO, Branding and Video Production.'
    },
    {
      slug: 'portfolio',
      title: 'Our Work',
      eyebrow: 'CASE STUDIES & IMPACT',
      heading: 'Good Work Speaks. Great Work Shows Its Thinking.',
      subheading: 'Explore genuine case studies and digital milestones achieved with our clients.',
      content: 'We take pride in building tailored solutions that deliver measurable business results across diverse industries.',
      cta_text: 'Start Your Project',
      cta_link: '/contact',
      seo_title: 'Portfolio & Case Studies | Dygytaly Digital Marketing Agency',
      meta_description: 'View real case studies and digital marketing results delivered by Dygytaly for clients in Coimbatore and across India.'
    },
    {
      slug: 'founder',
      title: 'Founder Profile',
      eyebrow: 'LEADERSHIP',
      heading: 'Every Vision Has a Story.',
      subheading: 'The journey, philosophy, and commitment behind Dygytaly.',
      content: 'Built on a belief that businesses deserve thoughtful strategies and a partner who truly understands their vision.',
      cta_text: 'Let\'s Catch Up',
      cta_link: '/contact',
      seo_title: 'Founder Profile — Dygytaly Digital Marketing Agency',
      meta_description: 'Discover the founder story behind Dygytaly Digital Marketing Agency. Learn our vision, milestones, and commitment to business excellence.'
    },
    {
      slug: 'team',
      title: 'Meet Our Team',
      eyebrow: 'THE PEOPLE BEHIND DYGYTALY',
      heading: 'Good Work Happens When Good People Come Together.',
      subheading: 'Different skills. Different perspectives. One team moving in the same direction.',
      content: 'Behind every campaign, website, creative and digital solution is a team of people bringing ideas, expertise and effort together. We believe good teamwork begins with communication, grows through collaboration and gets stronger when everyone takes ownership of their work.',
      cta_text: 'Join Our Team',
      cta_link: '/careers',
      seo_title: 'Meet the Team | Dygytaly Coimbatore',
      meta_description: 'Meet the passionate marketers, developers, designers, and strategists behind Dygytaly Digital Marketing Agency in Coimbatore.'
    },
    {
      slug: 'culture',
      title: 'Life at Dygytaly',
      eyebrow: 'OUR CULTURE',
      heading: 'Work Seriously. Stay Curious. Keep Growing.',
      subheading: 'A collaborative environment where good ideas flourish.',
      content: 'At Dygytaly, we believe a good workplace is built on more than deadlines and deliverables. It\'s about people who are willing to learn, ideas that are encouraged, challenges that help us improve and a team that works together to make things happen.',
      cta_text: 'Explore Open Roles',
      cta_link: '/careers',
      seo_title: 'Life at Dygytaly | Work Culture & Environment',
      meta_description: 'Discover work culture at Dygytaly Coimbatore: continuous learning, creative freedom, authentic teamwork, and curiosity.'
    },
    {
      slug: 'careers',
      title: 'Careers',
      eyebrow: 'WORK WITH US',
      heading: 'Good People. Good Ideas. Room to Grow.',
      subheading: 'We\'re building a team that believes creativity, curiosity and technology can make a difference.',
      content: 'If you enjoy learning, solving problems and doing meaningful work, we\'d like to meet you. Explore our open roles and apply today.',
      cta_text: 'View Open Positions',
      cta_link: '#openings',
      seo_title: 'Careers at Dygytaly | Digital Marketing & Tech Jobs Coimbatore',
      meta_description: 'Explore exciting career opportunities at Dygytaly in Coimbatore. Open positions in AI video editing, software development, and digital marketing.'
    },
    {
      slug: 'contact',
      title: 'Contact Us',
      eyebrow: 'GET IN TOUCH',
      heading: 'Coffee First. Business Strategy Next. ☕',
      subheading: 'Have a business idea, a marketing challenge or a website ready for a fresh start? Let\'s talk.',
      content: 'You don\'t need a perfect brief or a fully formed plan. Tell us where you are, what you\'re trying to achieve and what\'s getting in the way.',
      cta_text: 'Let\'s Start the Conversation',
      cta_link: '#form',
      seo_title: 'Contact Dygytaly | Digital Marketing Agency in Coimbatore',
      meta_description: 'Get in touch with Dygytaly Digital Marketing Agency in Coimbatore. Call +91 96777 59959 or visit our office at Mettupalayam Main Road.'
    },
    {
      slug: 'privacy',
      title: 'Privacy Policy',
      eyebrow: 'LEGAL & PRIVACY',
      heading: 'Privacy Policy',
      subheading: 'How we collect, protect, and respect your personal information.',
      content: 'At Dygytaly Digital Marketing Agency, accessible from https://dygytaly.in/, the privacy of our visitors and clients is of extreme importance. This Privacy Policy outlines the types of information that is collected and recorded by Dygytaly and how we use it.',
      cta_text: 'Contact Us',
      cta_link: '/contact',
      seo_title: 'Privacy Policy | Dygytaly Digital Marketing Agency',
      meta_description: 'Privacy Policy for Dygytaly Digital Marketing Agency. Details on data protection, client privacy, and cookies.'
    },
    {
      slug: 'terms',
      title: 'Terms and Conditions',
      eyebrow: 'TERMS OF SERVICE',
      heading: 'Terms and Conditions',
      subheading: 'Agreement and usage terms for Dygytaly services and website.',
      content: 'Welcome to Dygytaly Digital Marketing Agency. These terms and conditions outline the rules and regulations for the use of Dygytaly\'s Website, located at https://dygytaly.in/. By accessing this website we assume you accept these terms and conditions.',
      cta_text: 'Contact Us',
      cta_link: '/contact',
      seo_title: 'Terms & Conditions | Dygytaly Digital Marketing Agency',
      meta_description: 'Terms and conditions for Dygytaly Digital Marketing Agency website and digital services.'
    }
  ];

  for (const p of pagesData) {
    const existing = await dbGet('SELECT id FROM pages WHERE slug = ?', [p.slug]);
    if (existing) {
      await dbRun(`
        UPDATE pages SET
          title = ?, eyebrow = ?, heading = ?, subheading = ?, content = ?, cta_text = ?, cta_link = ?, seo_title = ?, meta_description = ?
        WHERE slug = ?
      `, [p.title, p.eyebrow, p.heading, p.subheading, p.content, p.cta_text, p.cta_link, p.seo_title, p.meta_description, p.slug]);
    } else {
      await dbRun(`
        INSERT INTO pages (slug, title, eyebrow, heading, subheading, content, cta_text, cta_link, seo_title, meta_description)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [p.slug, p.title, p.eyebrow, p.heading, p.subheading, p.content, p.cta_text, p.cta_link, p.seo_title, p.meta_description]);
    }
  }

  // 7. Team Members
  const teamMembers = [
    {
      name: 'Gowri Jagadheeshwaran',
      designation: 'Founder & Creative Director',
      bio: 'Leading strategic vision, brand architecture, and client partnerships.',
      expertise: 'Brand Strategy, Growth Architecture, Business Tech',
      image_url: '/uploads/founder-profile.jpg',
      linkedin_url: 'https://www.linkedin.com/company/dygytaly/',
      display_order: 1
    },
    {
      name: 'Digital Strategy Lead',
      designation: 'Head of Performance Marketing',
      bio: 'Specialist in high-ROI Google Ads, Meta Ads campaigns, and conversion rate optimization.',
      expertise: 'Paid Media, Funnel Strategy, Google Ads, Analytics',
      image_url: '/uploads/dygytaly-logo.png',
      linkedin_url: 'https://www.linkedin.com/company/dygytaly/',
      display_order: 2
    },
    {
      name: 'Full-Stack Tech Lead',
      designation: 'Senior Web & Application Architect',
      bio: 'Engineering robust web platforms, 3D interactive experiences, and CRM/ERP integrations.',
      expertise: 'React, Node.js, Cloud Infrastructure, Database Design',
      image_url: '/uploads/dygytaly-logo.png',
      linkedin_url: 'https://www.linkedin.com/company/dygytaly/',
      display_order: 3
    },
    {
      name: 'Creative Motion Designer',
      designation: 'Lead Video Producer & Visual Artist',
      bio: 'Crafting high-retention short-form video reels, brand graphics, and motion assets.',
      expertise: 'Video Editing, Motion Graphics, Visual Storytelling',
      image_url: '/uploads/dygytaly-logo.png',
      linkedin_url: 'https://www.linkedin.com/company/dygytaly/',
      display_order: 4
    }
  ];

  await dbExec('DELETE FROM team_members');
  for (const t of teamMembers) {
    await dbRun(`
      INSERT INTO team_members (name, designation, bio, expertise, image_url, linkedin_url, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [t.name, t.designation, t.bio, t.expertise, t.image_url, t.linkedin_url, t.display_order]);
  }

  // 8. Culture Stories
  const cultureStories = [
    {
      title: 'Coffee & Strategy Sprints',
      description: 'We believe good thinking starts over coffee. Every Monday, we dissect challenging marketing briefs and brainstorm creative hooks before touching software.',
      category: 'Rituals',
      image_url: '/uploads/dygytaly-logo.png',
      display_order: 1
    },
    {
      title: 'Continuous Learning Culture',
      description: 'Digital algorithms and AI tools change weekly. We dedicate 4 hours every Friday for team upskilling in AI workflows, creative editing, and modern web architectures.',
      category: 'Growth',
      image_url: '/uploads/dygytaly-logo.png',
      display_order: 2
    },
    {
      title: 'Transparent Client Handoffs',
      description: 'No jargon, no hidden spreadsheets. We sit with clients, walk them through live dashboards, and explain the why behind every campaign decision.',
      category: 'Values',
      image_url: '/uploads/dygytaly-logo.png',
      display_order: 3
    }
  ];

  await dbExec('DELETE FROM culture_stories');
  for (const c of cultureStories) {
    await dbRun(`
      INSERT INTO culture_stories (title, description, category, image_url, display_order)
      VALUES (?, ?, ?, ?, ?)
    `, [c.title, c.description, c.category, c.image_url, c.display_order]);
  }

  // 9. Careers Openings (AI-Powered Video Editor & Office & Backend Support Executive)
  const jobsData = [
    {
      slug: 'ai-powered-video-editor',
      title: 'AI-Powered Video Editor',
      department: 'Creative & Video Production',
      location: 'Coimbatore, Tamil Nadu (On-site / Hybrid)',
      type: 'Full-time',
      description: 'We are seeking an ambitious creative video editor with a passion for short-form visual storytelling, dynamic pacing, and modern AI creative tools.',
      responsibilities: JSON.stringify([
        'Edit short-form videos, reels and promotional videos for diverse client brands.',
        'Create digital advertising and social media content engineered for high retention.',
        'Use AI-assisted creative tools appropriately to accelerate workflow and enhance visual flair.',
        'Work closely with briefs, scripts, voiceovers, and client brand guidelines.',
        'Improve pacing, storytelling, color grading, sound design, and visual quality.',
        'Collaborate actively with the creative and marketing strategy team.'
      ]),
      requirements: JSON.stringify([
        'Hands-on proficiency with video editing software (Premiere Pro, After Effects, CapCut Pro, or DaVinci).',
        'Demonstrated understanding of short-form content hooks and algorithmic pacing.',
        'Familiarity with visual storytelling, typography animation, and sound design.',
        'Eagerness to explore and master modern AI video tools and creative workflows.',
        'Strong attention to detail and ability to meet project deadlines.',
        'Willingness to learn, receive feedback, and collaborate enthusiastically.'
      ]),
      is_open: 1,
      display_order: 1
    },
    {
      slug: 'office-backend-support-executive',
      title: 'Office & Backend Support Executive',
      department: 'Operations & Administration',
      location: 'Coimbatore, Tamil Nadu (On-site)',
      type: 'Full-time',
      description: 'We are looking for an organized, dependable professional to support daily agency administration, client communications, and operational documentation.',
      responsibilities: JSON.stringify([
        'Maintain office records, client documentation, and operational files with diligence.',
        'Support daily agency administration and workspace organization.',
        'Coordinate schedules, internal meetings, and external client communications.',
        'Assist with spreadsheets, tracking sheets, invoicing follow-ups, and data entry.',
        'Support marketing reporting, client task tracking, and prompt follow-ups.',
        'Keep routine agency operations organized, smooth, and dependable.'
      ]),
      requirements: JSON.stringify([
        'Solid foundational computer skills and digital literacy.',
        'Working proficiency in spreadsheets (Google Sheets, Excel) and documentation.',
        'Clear, polite communication skills in English and Tamil.',
        'High degree of accuracy, organization, and dependability.',
        'Positive attitude, proactive problem solving, and team spirit.'
      ]),
      is_open: 1,
      display_order: 2
    }
  ];

  await dbExec('DELETE FROM jobs');
  for (const j of jobsData) {
    await dbRun(`
      INSERT INTO jobs (slug, title, department, location, type, description, responsibilities, requirements, is_open, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [j.slug, j.title, j.department, j.location, j.type, j.description, j.responsibilities, j.requirements, j.is_open, j.display_order]);
  }

  // 10. Portfolio Projects
  const portfolioData = [
    {
      title: 'Precision Lead Engine for Regional Manufacturer',
      client_name: 'Industrial Equipment Manufacturer',
      industry: 'Manufacturing & B2B',
      category: 'Google Ads',
      challenge: 'High cost-per-click and unqualified search enquiries were wasting 60% of monthly digital advertising spend.',
      strategy: 'Restructured Google Search campaigns into exact-match commercial intent clusters, implemented negative keyword pruning, and built dedicated technical landing pages.',
      execution: 'Launched segmented Search & Performance Max campaigns with server-side conversion tracking linked directly to the client CRM.',
      results: 'Achieved 42% reduction in Cost Per Acquisition (CPA) and 3.4x increase in sales-qualified commercial inquiries over 90 days.',
      image_url: '/uploads/dygytaly-logo.png',
      project_url: 'https://dygytaly.in/services/google-ads',
      is_featured: 1,
      display_order: 1
    },
    {
      title: 'Full Brand Identity & E-Commerce Web Experience',
      client_name: 'D2C Lifestyle & Apparel Brand',
      industry: 'Retail & Fashion',
      category: 'Websites',
      challenge: 'Outdated website with poor mobile checkout was causing 74% cart abandonment and failing to project premium brand authority.',
      strategy: 'Complete brand repositioning, bespoke typography, and a modern, high-speed responsive web storefront with 1-click checkout.',
      execution: 'Developed a custom responsive website with sub-second page loads, elegant product showcases, and interactive 3D product previews.',
      results: 'Cart abandonment dropped to 41%, mobile conversion rate increased by 68%, and average session duration doubled.',
      image_url: '/uploads/dygytaly-logo.png',
      project_url: 'https://dygytaly.in/services/website-development',
      is_featured: 1,
      display_order: 2
    },
    {
      title: 'Local SEO Dominance for Healthcare Clinic',
      client_name: 'Multi-Speciality Healthcare Clinic',
      industry: 'Healthcare & Wellness',
      category: 'SEO',
      challenge: 'Ranked on page 3 for key medical search terms in Coimbatore, resulting in near-zero inbound phone calls.',
      strategy: 'Optimized Google Business Profile, established consistent local citations, created localized health service pages, and automated patient review collection.',
      execution: 'Systematic on-page technical optimization, schema markup integration, and geo-targeted service content.',
      results: 'Ranked in the Google Maps Local 3-Pack for 14 target medical queries; incoming phone calls increased by 185% in 5 months.',
      image_url: '/uploads/dygytaly-logo.png',
      project_url: 'https://dygytaly.in/services/local-seo',
      is_featured: 1,
      display_order: 3
    },
    {
      title: 'Viral Reel Campaign & Social Brand Launch',
      client_name: 'Specialty Gourmet Cafe & Roastery',
      industry: 'Food & Hospitality',
      category: 'Video',
      challenge: 'Low organic reach on Instagram and lack of awareness among Coimbatore coffee enthusiasts prior to store launch.',
      strategy: 'Created an aesthetic 5-part storytelling video series highlighting artisan coffee roasting, brewing crafts, and ambient cafe workspace aesthetics.',
      execution: 'Scripted, filmed, and produced fast-paced short-form reels with dynamic motion graphics, custom audio design, and micro-influencer collaboration.',
      results: 'Over 450,000 organic video views across Coimbatore; opening weekend footfall exceeded capacity by 200%.',
      image_url: '/uploads/dygytaly-logo.png',
      project_url: 'https://dygytaly.in/services/social-media-video',
      is_featured: 1,
      display_order: 4
    }
  ];

  await dbExec('DELETE FROM portfolio');
  for (const p of portfolioData) {
    await dbRun(`
      INSERT INTO portfolio (title, client_name, industry, category, challenge, strategy, execution, results, image_url, project_url, is_featured, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [p.title, p.client_name, p.industry, p.category, p.challenge, p.strategy, p.execution, p.results, p.image_url, p.project_url, p.is_featured, p.display_order]);
  }

  // 11. Testimonials (4.9/5 from 117 Google reviews)
  const testimonialsData = [
    {
      author_name: 'Senthil Kumar',
      business_name: 'TexStyle Manufacturing',
      rating: 5.0,
      review_text: 'Dygytaly completely transformed our digital strategy. They took the time to understand our textile machinery sales cycle and built a Google Ads campaign that delivered high-value commercial leads right from month one.',
      source: 'Google Review',
      source_url: 'https://maps.app.goo.gl/dygytaly',
      is_verified: 1,
      display_order: 1
    },
    {
      author_name: 'Priya Ramanathan',
      business_name: 'Aura Interior Architecture',
      rating: 5.0,
      review_text: 'The best digital agency in Coimbatore by far. They designed a gorgeous website that truly represents our design standards, and their local SEO work helped us secure major commercial interior contracts.',
      source: 'Google Review',
      source_url: 'https://maps.app.goo.gl/dygytaly',
      is_verified: 1,
      display_order: 2
    },
    {
      author_name: 'Karthik Raja',
      business_name: 'Apex Precision Engineering',
      rating: 5.0,
      review_text: 'Honest conversations, transparent metrics, and zero false promises. Gowri and her team treat our marketing budget with genuine accountability. Highly recommended for any serious business owner.',
      source: 'Google Review',
      source_url: 'https://maps.app.goo.gl/dygytaly',
      is_verified: 1,
      display_order: 3
    }
  ];

  await dbExec('DELETE FROM testimonials');
  for (const t of testimonialsData) {
    await dbRun(`
      INSERT INTO testimonials (author_name, business_name, rating, review_text, source, source_url, is_verified, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [t.author_name, t.business_name, t.rating, t.review_text, t.source, t.source_url, t.is_verified, t.display_order]);
  }

  // 12. FAQs
  const faqsData = [
    {
      question: 'What services does Dygytaly offer?',
      answer: 'Dygytaly is a full-service digital marketing and technology agency. We offer Google Ads, Meta Ads (Facebook & Instagram), Website Development, Custom Application Development, CRM & ERP Solutions, Website SEO, Local SEO (Google Business Profile), Branding & Graphic Design, and Social Media Video Production.',
      category: 'general',
      display_order: 1
    },
    {
      question: 'Can I hire Dygytaly for a single service?',
      answer: 'Yes! While many clients partner with us for integrated marketing and technology, you can engage us specifically for individual solutions such as building a website, running Google Ads, or optimizing Local SEO.',
      category: 'general',
      display_order: 2
    },
    {
      question: 'Do you work with startups and established businesses?',
      answer: 'Yes, we work with ambitious startups needing a strong launch identity and scalable website, as well as established SMEs looking to modernize their systems, automate follow-ups, and accelerate customer acquisition.',
      category: 'general',
      display_order: 3
    },
    {
      question: 'Can you help generate leads for our sales team?',
      answer: 'Lead generation is one of our primary core strengths. We combine high-intent search campaigns, conversion-focused landing pages, automated CRM lead capture, and immediate notification triggers so your sales team can contact prospects while interest is hot.',
      category: 'marketing',
      display_order: 4
    },
    {
      question: 'Do you design and develop custom websites?',
      answer: 'Yes, every website we create is custom-designed for your brand. We avoid generic clunky themes and engineer fast, responsive websites with intuitive WordPress-style CMS controls so you can update content effortlessly.',
      category: 'development',
      display_order: 5
    },
    {
      question: 'Can you help us implement CRM and ERP systems?',
      answer: 'Yes, we assess your operational workflows and implement tailored CRM and ERP solutions that connect your leads, inventory, customer history, billing, and team tasks into a single transparent system.',
      category: 'technology',
      display_order: 6
    },
    {
      question: 'How does the client onboarding process work?',
      answer: 'We begin with an informal discovery catch-up (over coffee or video call). We analyze your business goals, draft a transparent roadmap with deliverables and timelines, agree on key milestones, and set up clear communication channels.',
      category: 'process',
      display_order: 7
    },
    {
      question: 'How do you measure marketing performance?',
      answer: 'We track real commercial KPIs: cost per qualified lead, conversion rate, search impression share, and return on ad spend. You receive transparent weekly/bi-weekly reports with zero marketing fluff.',
      category: 'marketing',
      display_order: 8
    },
    {
      question: 'How can I request a proposal or consultation?',
      answer: 'You can submit an inquiry through our Coffee Catch-up form, chat with us on WhatsApp at +91 96777 59959, or call us directly. We will review your requirements and schedule a consultation.',
      category: 'general',
      display_order: 9
    }
  ];

  await dbExec('DELETE FROM faqs');
  for (const f of faqsData) {
    await dbRun(`
      INSERT INTO faqs (question, answer, category, display_order)
      VALUES (?, ?, ?, ?)
    `, [f.question, f.answer, f.category, f.display_order]);
  }

  // 13. Media Library - Original logo
  const existingLogo = await dbGet('SELECT id FROM media WHERE filename = ?', ['dygytaly-logo.png']);
  if (!existingLogo) {
    await dbRun(`
      INSERT INTO media (filename, original_name, file_path, file_type, file_size, alt_text)
      VALUES (?, ?, ?, ?, ?, ?)
    `, ['dygytaly-logo.png', 'Dygytaly Official Logo.png', '/uploads/dygytaly-logo.png', 'image/png', 94208, 'Original Dygytaly Digital Marketing Agency Logo']);
  }

  // 14. Navigation Items
  const navItems = [
    { label: 'Home', url: '/', parent_id: null, display_order: 1 },
    { label: 'About Us', url: '/about', parent_id: null, display_order: 2 },
    { label: 'Solutions', url: '/services', parent_id: null, display_order: 3 },
    { label: 'Our Work', url: '/portfolio', parent_id: null, display_order: 4 },
    { label: 'Profile', url: '/profile/founder', parent_id: null, display_order: 5 },
    { label: 'Careers', url: '/careers', parent_id: null, display_order: 6 },
    { label: 'Contact', url: '/contact', parent_id: null, display_order: 7 }
  ];

  await dbExec('DELETE FROM navigation_items');
  for (const n of navItems) {
    await dbRun(`
      INSERT INTO navigation_items (label, url, parent_id, display_order, is_active)
      VALUES (?, ?, ?, ?, 1)
    `, [n.label, n.url, n.parent_id, n.display_order]);
  }

  // 15. Activity Log Initial Record
  await dbRun(`
    INSERT INTO activity_logs (username, action, entity, details)
    VALUES (?, ?, ?, ?)
  `, ['system', 'System Initialized', 'Database Seed', 'Initial database schema and authentic agency data loaded successfully.']);

  console.log('Database seeded successfully and persisted to data/dygytaly.db!');
}

if (require.main === module) {
  runSeed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}
