export interface ServiceItem {
  slug: string;
  title: string;
  tagline: string;
  short_desc: string;
  hero_headline: string;
  problem_solved: string;
  approach: string;
  deliverables: string[];
  process_steps: { step: string; title: string; desc: string }[];
  technologies: string[];
  faqs: { q: string; a: string }[];
  icon_name: string;
  image_url: string;
  cta_text: string;
  display_order: number;
  seo_title: string;
  meta_description: string;
}

export const SERVICES_DATA: Record<string, ServiceItem> = {
  'google-ads': {
    slug: 'google-ads',
    title: 'Google Ads',
    tagline: 'Be There When Customers Are Searching.',
    short_desc: 'Reach high-intent audiences actively searching for your products and services with high-converting Search, Display, Shopping, and Performance Max campaigns.',
    hero_headline: 'Turn High-Intent Searches Into Real Business Enquiries.',
    problem_solved: 'Many companies waste ad spend on irrelevant search terms, weak negative keyword lists, and unoptimized landing pages that fail to convert clicks into paying customers.',
    approach: 'We architect granular campaign structures with precise intent segmentation, ongoing negative keyword audits, smart bidding strategies, and dedicated landing page CRO.',
    deliverables: [
      'Search Intent & Keyword Research Audit',
      'Competitor Ad Intelligence & Benchmarking',
      'Ad Copywriting & Asset Extension Setup',
      'Performance Max & Shopping Campaigns',
      'Conversion Tracking & Server-Side Tagging',
      'Bi-weekly Optimization & Transparent ROI Reporting'
    ],
    process_steps: [
      { step: '01', title: 'Intent Audit', desc: 'Analyzing search volume, competitive bids, and commercial query keywords.' },
      { step: '02', title: 'Funnel Build', desc: 'Crafting tailored ad copies and high-speed dedicated conversion landing pages.' },
      { step: '03', title: 'Launch & Track', desc: 'Configuring precise GA4 and GTM conversion tagging to measure true lead quality.' },
      { step: '04', title: 'Scale & Prune', desc: 'Eliminating wasted negative keywords while scaling budget on top-performing terms.' }
    ],
    technologies: ['Google Ads', 'GA4 Analytics', 'Google Tag Manager', 'Looker Studio', 'Ahrefs'],
    faqs: [
      { q: 'How quickly can we see results from Google Ads?', a: 'Campaigns go live within 5–7 business days after strategy and landing page setup. Qualified leads typically start coming in within the first week of active spend.' },
      { q: 'How much ad budget should I allocate?', a: 'We recommend starting with a minimum monthly ad spend based on your industry CPCs, ensuring statistically significant clicks to test and scale profitability.' }
    ],
    icon_name: 'Search',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Plan Your Google Ads Strategy',
    display_order: 1,
    seo_title: 'Google Ads Agency in Coimbatore | Dygytaly',
    meta_description: 'Strategic Google Ads management in Coimbatore. Reach high-intent customers with ROI-focused Search, Display, and Performance Max campaigns.'
  },

  'meta-ads': {
    slug: 'meta-ads',
    title: 'Meta Ads',
    tagline: 'Turn the Scroll Into an Opportunity.',
    short_desc: 'Stop the scroll and convert attention on Facebook and Instagram with compelling visual creatives, behavioral audience targeting, and funnel-driven retargeting.',
    hero_headline: 'Captivate Your Target Market Where They Spend Their Attention.',
    problem_solved: 'Generic ads get ignored. Businesses often burn budgets by boosting random posts without structured conversion funnels or tailored creative variations.',
    approach: 'We blend thumb-stopping creative design with segmented custom audiences, lookalikes, and multi-stage retargeting to nurture prospects from awareness to purchase.',
    deliverables: [
      'Full-Funnel Campaign Architecture (TOFU, MOFU, BOFU)',
      'Creative Production (Carousels, Video Reels, Static Ads)',
      'Audience Profiling & Custom Pixel Integration',
      'A/B Creative & Hook Testing',
      'Lead Generation Forms & CRM Webhook Sync',
      'Weekly Performance & Cost-Per-Acquisition Optimization'
    ],
    process_steps: [
      { step: '01', title: 'Audience Mapping', desc: 'Defining customer avatars, interests, demographics, and buyer motivations.' },
      { step: '02', title: 'Creative Sprints', desc: 'Designing high-impact video hooks and lifestyle creatives that spark curiosity.' },
      { step: '03', title: 'Conversion Setup', desc: 'Setting up Meta Conversions API (CAPI) for accurate tracking amidst cookie restrictions.' },
      { step: '04', title: 'Rapid Testing', desc: 'Iterating on the highest-performing ad hooks to lower overall customer acquisition cost.' }
    ],
    technologies: ['Meta Business Suite', 'Conversions API (CAPI)', 'Figma', 'Premiere Pro', 'Zapier'],
    faqs: [
      { q: 'Can Meta Ads work for B2B companies?', a: 'Yes. Meta Ads excel at B2B brand authority, retargeting website visitors, and capturing business owners who browse Instagram and Facebook during downtime.' },
      { q: 'Do you create the ad graphics and videos?', a: 'Yes! Our in-house creative team produces all ad concepts, graphics, motion graphics, and reel edits.' }
    ],
    icon_name: 'Share2',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Scale With Meta Ads',
    display_order: 2,
    seo_title: 'Meta & Social Ads Agency Coimbatore | Facebook & Instagram Ads | Dygytaly',
    meta_description: 'High-converting Meta Ads services in Coimbatore. Drive leads, sales, and brand engagement with tailored Facebook and Instagram campaigns.'
  },

  'website-development': {
    slug: 'website-development',
    title: 'Website Development',
    tagline: 'Your Digital First Impression, Done Right.',
    short_desc: 'Bespoke, high-performance websites engineered to communicate your value proposition, build client confidence, and convert visitors into loyal customers.',
    hero_headline: 'A Modern Digital Showroom Engineered for Speed, Elegance & Trust.',
    problem_solved: 'Slow, clunky, generic WordPress templates with broken responsive views erode visitor trust within 3 seconds, losing valuable opportunities before a conversation begins.',
    approach: 'We craft handcrafted, responsive websites with state-of-the-art typography, sleek micro-interactions, rich 3D elements, and intuitive CMS controls for non-technical teams.',
    deliverables: [
      'Custom UI/UX Design System in Figma',
      'Modern Responsive Engineering (Desktop, Tablet, Mobile)',
      'Interactive 3D Elements & Smooth Micro-Animations',
      'WordPress-Style Custom CMS Dashboard',
      'Sub-second Loading Speeds & Core Web Vitals Optimization',
      'Technical On-Page SEO & Structured Data Markup'
    ],
    process_steps: [
      { step: '01', title: 'Information Architecture', desc: 'Mapping user journeys, sitemaps, and content wireframes.' },
      { step: '02', title: 'Visual Art Direction', desc: 'Designing custom aesthetic palettes, typography systems, and dynamic layouts.' },
      { step: '03', title: 'Production Code', desc: 'Developing clean, semantic code with full CMS controls and database persistence.' },
      { step: '04', title: 'QA & Launch', desc: 'Cross-browser testing, accessibility validation, and flawless production deployment.' }
    ],
    technologies: ['React', 'TypeScript', 'Node.js', 'Three.js', 'Vite', 'SQLite/Postgres'],
    faqs: [
      { q: 'Will I be able to edit text and images myself?', a: 'Absolutely. We provide a custom WordPress-style CMS where you can update any headline, service, portfolio project, or team member without touching code.' },
      { q: 'Is the website optimized for mobile phones?', a: 'Yes, 100% mobile-first design with responsive typography, touch-friendly UI, and adaptive asset loading.' }
    ],
    icon_name: 'Globe',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Build Your Website',
    display_order: 3,
    seo_title: 'Custom Website Development Agency Coimbatore | Dygytaly',
    meta_description: 'Award-worthy website design and web development services in Coimbatore. Custom CMS, interactive 3D, ultra-fast loading, and conversion optimization.'
  },

  'application-development': {
    slug: 'application-development',
    title: 'Application Development',
    tagline: 'Got an App Idea? Let\'s Give It a Plan.',
    short_desc: 'Practical, scalable custom web and mobile applications built to streamline internal business workflows or serve digital product users with reliability.',
    hero_headline: 'Turn Complex Business Workflows Into Seamless Software Solutions.',
    problem_solved: 'Off-the-shelf software often forces businesses into rigid constraints, while fragmented spreadsheets cause human errors, security risks, and operational bottlenecks.',
    approach: 'We build tailored web applications and portal systems with robust authentication, role-based access control, relational databases, and clean modern interfaces.',
    deliverables: [
      'Product Strategy & Technical Architecture Blueprint',
      'Interactive Figma Clickable Prototypes',
      'Secure Full-Stack Application Engineering',
      'RESTful / GraphQL APIs & Third-Party Integrations',
      'Automated Testing, CI/CD & Cloud Infrastructure',
      'Comprehensive Documentation & Ongoing Maintenance'
    ],
    process_steps: [
      { step: '01', title: 'Requirements Scoping', desc: 'Extracting workflows, user roles, data schemas, and security requirements.' },
      { step: '02', title: 'Interactive Prototype', desc: 'Testing UX flows and validation before writing production software.' },
      { step: '03', title: 'Sprint Development', desc: 'Agile sprints delivering functional milestones with transparent staging environments.' },
      { step: '04', title: 'Security & Deploy', desc: 'Rigorous penetration testing, database backup setup, and cloud hosting.' }
    ],
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Docker', 'AWS'],
    faqs: [
      { q: 'Can you integrate our existing third-party software?', a: 'Yes, we integrate payment gateways, SMS/WhatsApp gateways, accounting tools, and external APIs.' },
      { q: 'Who owns the source code and data?', a: 'You have 100% intellectual property ownership of the custom code and database.' }
    ],
    icon_name: 'Layers',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Discuss Your Application',
    display_order: 4,
    seo_title: 'Custom Web & Mobile Application Development Coimbatore | Dygytaly',
    meta_description: 'Custom software and web application development in Coimbatore. Scalable architecture, secure databases, and tailored business portals.'
  },

  'crm-solutions': {
    slug: 'crm-solutions',
    title: 'CRM Solutions',
    tagline: 'Fewer Missed Follow-Ups. Better Relationships.',
    short_desc: 'Organize leads, customer interactions, sales pipelines, and follow-up workflows so your sales team never loses an opportunity to grow.',
    hero_headline: 'A Centralized Hub to Nurture Leads and Accelerate Deals.',
    problem_solved: 'Leads lost in WhatsApp chats, forgotten follow-up emails, and zero visibility into sales representative activity drain business revenue every month.',
    approach: 'We implement and customize CRM workflows tailored to your specific sales stages, complete with automated reminders, lead scoring, and pipeline analytics.',
    deliverables: [
      'Sales Pipeline & Lead Stage Customization',
      'Automatic Lead Ingestion from Ads, Website & WhatsApp',
      'Automated Follow-Up Sequences & SMS/Email Alerts',
      'Team Role-Based Permissions & Task Delegation',
      'Executive Sales Dashboard & Deal Forecasting',
      'Staff Onboarding & Hands-On Operational Training'
    ],
    process_steps: [
      { step: '01', title: 'Sales Audit', desc: 'Auditing your current sales touchpoints from initial enquiry to closed deal.' },
      { step: '02', title: 'Pipeline Blueprint', desc: 'Configuring custom fields, deal stages, and mandatory qualification criteria.' },
      { step: '03', title: 'Automation Hook', desc: 'Syncing website forms, WhatsApp leads, and calls into automated task queues.' },
      { step: '04', title: 'Training & Adoption', desc: 'Empowering your sales team with live walk-throughs and cheat sheets.' }
    ],
    technologies: ['Custom CRM', 'HubSpot', 'Zoho CRM', 'Webhooks', 'WhatsApp Business API'],
    faqs: [
      { q: 'Can CRM automatically alert our team when a lead arrives?', a: 'Yes, instant alerts via WhatsApp, Email, or SMS can be triggered the exact moment a lead submits a form.' },
      { q: 'Can we track sales representative performance?', a: 'Yes, comprehensive dashboards track response times, completed calls, meetings booked, and deal conversion rates.' }
    ],
    icon_name: 'Users',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Upgrade Your CRM',
    display_order: 5,
    seo_title: 'CRM Implementation & Solutions in Coimbatore | Dygytaly',
    meta_description: 'CRM solutions in Coimbatore. Streamline your sales pipeline, automate follow-ups, and convert more leads into lasting client relationships.'
  },

  'erp-solutions': {
    slug: 'erp-solutions',
    title: 'ERP Solutions',
    tagline: 'Bring Your Business Into Better Sync.',
    short_desc: 'Explore connected systems for business operations, inventory, finance, human resources, reporting, and inter-departmental workflows.',
    hero_headline: 'Unify Operations, Data, and Strategy Under One Cohesive Platform.',
    problem_solved: 'Disjointed departments operating in silos create inventory discrepancies, delayed customer billing, and hours wasted compiling manual spreadsheets.',
    approach: 'We deploy pragmatic ERP modules tailored to your business scale, connecting supply chain, production, billing, and resource management into a single source of truth.',
    deliverables: [
      'Operational Gap Analysis & Workflow Architecture',
      'Inventory & Procurement Tracking Setup',
      'Invoicing, Billing & Financial Reporting Integration',
      'HR, Attendance & Role-Based Access Controls',
      'Real-Time Executive Dashboards & Analytics',
      'Data Migration from Legacy Systems with Zero Downtime'
    ],
    process_steps: [
      { step: '01', title: 'Operations Mapping', desc: 'Examining departmental interdependencies and data handoff bottlenecks.' },
      { step: '02', title: 'Module Selection', desc: 'Customizing only the modules your business requires without unnecessary bloat.' },
      { step: '03', title: 'Data Migration', desc: 'Sanitizing, mapping, and migrating historical data safely into the ERP.' },
      { step: '04', title: 'Go-Live Support', desc: 'Parallel run testing and dedicated technical support during transition.' }
    ],
    technologies: ['Custom ERP', 'Frappe / ERPNext', 'PostgreSQL', 'REST APIs', 'Cloud Hosting'],
    faqs: [
      { q: 'Is ERP only for huge multinational corporations?', a: 'Not anymore. Modern modular ERP systems are specifically designed for growing SMEs and regional manufacturing firms in India.' },
      { q: 'How long does implementation take?', a: 'Depending on module count and data complexity, typical rollouts take between 4 to 12 weeks with staged go-lives.' }
    ],
    icon_name: 'Database',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Explore ERP Systems',
    display_order: 6,
    seo_title: 'ERP Software Solutions in Coimbatore | Dygytaly',
    meta_description: 'ERP solutions in Coimbatore. Connect inventory, billing, HR, and business operations with scalable enterprise resource planning software.'
  },

  'website-seo': {
    slug: 'website-seo',
    title: 'Website SEO',
    tagline: 'Build Visibility Beyond Advertising.',
    short_desc: 'Technical SEO, on-page optimization, content architecture, and search performance monitoring to generate compounding organic traffic month after month.',
    hero_headline: 'Rank Higher for What Matters and Capture Inbound Commercial Demand.',
    problem_solved: 'Relying exclusively on paid ads means traffic halts the moment budget stops. Poor site structure and crawl errors prevent Google from recognizing your expertise.',
    approach: 'We implement comprehensive white-hat SEO: fixing deep technical issues, engineering high-intent content hubs, and earning authoritative organic signals.',
    deliverables: [
      'Full Technical SEO Crawl & Core Web Vitals Fixes',
      'Semantic Keyword Architecture & Content Gap Analysis',
      'On-Page Optimization (Titles, Meta, H1-H6, Structured Data)',
      'Internal Link Optimization & Information Flow',
      'Google Search Console & Indexing Health Audits',
      'Monthly Organic Ranking & Commercial Traffic Reports'
    ],
    process_steps: [
      { step: '01', title: 'Technical Crawl', desc: 'Diagnosing 404s, index bloat, redirect chains, and schema markup errors.' },
      { step: '02', title: 'Keyword Strategy', desc: 'Targeting commercial-intent keywords that match real buyer queries.' },
      { step: '03', title: 'On-Page Overhaul', desc: 'Optimizing page copy, meta tags, header hierarchies, and site speed.' },
      { step: '04', title: 'Authority Building', desc: 'Strengthening internal topical authority and search engine trust signals.' }
    ],
    technologies: ['Google Search Console', 'Ahrefs', 'Semrush', 'Screaming Frog', 'Schema.org'],
    faqs: [
      { q: 'How long does it take to see SEO results?', a: 'Organic search is a compounding asset. Meaningful ranking and traffic improvements typically emerge within 3 to 6 months of disciplined execution.' },
      { q: 'Do you promise #1 rank on Google?', a: 'No ethical SEO specialist promises guaranteed #1 rankings. We promise rigorous technical excellence, proven strategies, and transparent reporting.' }
    ],
    icon_name: 'TrendingUp',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Boost Your Organic Rank',
    display_order: 7,
    seo_title: 'Website SEO Services in Coimbatore | Dygytaly',
    meta_description: 'Proven website SEO services in Coimbatore. Boost rankings, fix technical crawl issues, and compound sustainable organic inbound inquiries.'
  },

  'local-seo': {
    slug: 'local-seo',
    title: 'Local SEO',
    tagline: 'Help Nearby Customers Find You.',
    short_desc: 'Google Business Profile optimization, local search map rankings, review generation workflows, and accurate citation management across Coimbatore.',
    hero_headline: 'Dominate the Local 3-Pack and Drive Calls & Store Visits.',
    problem_solved: 'Nearby customers looking for your services in Coimbatore choose competitors simply because their Google Maps profiles rank higher or have more active reviews.',
    approach: 'We optimize every facet of your Google Business Profile, implement automated review generation, verify local NAP citations, and build local geo-relevance.',
    deliverables: [
      'Google Business Profile (GBP) Audit & Optimization',
      'Local Map Pack Ranking Strategy for Target Keywords',
      'Verified Review Generation & Response Workflows',
      'Local Citation Consistency (Name, Address, Phone)',
      'Geo-Tagged Image Posts & Product Showcase Updates',
      'Local Competitor Grid Tracking & Monthly Insights'
    ],
    process_steps: [
      { step: '01', title: 'Profile Verification', desc: 'Securing primary and secondary categories, service areas, and accurate NAP.' },
      { step: '02', title: 'Citation Alignment', desc: 'Harmonizing business information across Google, Bing, JustDial, and directory listings.' },
      { step: '03', title: 'Review Velocity', desc: 'Deploying QR codes and WhatsApp workflows to collect genuine happy customer reviews.' },
      { step: '04', title: 'Local Engagement', desc: 'Publishing weekly updates, offers, and high-resolution geotagged photographs.' }
    ],
    technologies: ['Google Business Profile', 'Google Maps API', 'BrightLocal', 'WhatsApp Automation'],
    faqs: [
      { q: 'Can Local SEO help our physical store or office in Coimbatore?', a: 'Yes! Local SEO directly drives phone calls, driving directions requests, and direct footfalls from high-intent local customers.' },
      { q: 'How do reviews impact local ranking?', a: 'Review count, recency, keyword sentiment, and owner responses are primary ranking factors in Google\'s local map algorithm.' }
    ],
    icon_name: 'MapPin',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Claim Your Local Presence',
    display_order: 8,
    seo_title: 'Local SEO & Google Business Profile Optimization Coimbatore | Dygytaly',
    meta_description: 'Rank in Google Maps local 3-pack in Coimbatore. Google Business Profile optimization, authentic review workflows, and local citation management.'
  },

  'branding-design': {
    slug: 'branding-design',
    title: 'Branding and Graphic Design',
    tagline: 'Look Like the Business You\'re Becoming.',
    short_desc: 'Memorable visual identities, brand guideline kits, corporate presentations, packaging, and marketing collateral that command respect and establish market distinction.',
    hero_headline: 'A Distinctive Visual Identity That Commands Respect and Confidence.',
    problem_solved: 'Amateur logos and disjointed graphics make even great businesses look small, undermining pricing power and making client acquisition harder than it needs to be.',
    approach: 'We build cohesive brand systems: from foundational typography and color psychology to iconography, business stationery, and social media creative guidelines.',
    deliverables: [
      'Logo Design & Vector Master Assets',
      'Comprehensive Brand Guidelines (Colors, Typography, Usage Rules)',
      'Business Stationery (Cards, Letterheads, Envelopes)',
      'Company Profile & Pitch Deck Presentation Decks',
      'Marketing Collateral, Brochures & Signage',
      'Social Media Master Templates & Brand Kit'
    ],
    process_steps: [
      { step: '01', title: 'Brand Discovery', desc: 'Uncovering brand personality, core audience values, and competitive positioning.' },
      { step: '02', title: 'Concept Directions', desc: 'Presenting distinct aesthetic routes with moodboards and logo applications.' },
      { step: '03', title: 'System Refinement', desc: 'Crafting the complete design language, typography pairings, and color tokens.' },
      { step: '04', title: 'Asset Handover', desc: 'Delivering production-ready vector assets and a comprehensive brand guide.' }
    ],
    technologies: ['Adobe Illustrator', 'Photoshop', 'Figma', 'InDesign'],
    faqs: [
      { q: 'Do we get full copyright to the logo and designs?', a: 'Yes, once finalized and delivered, you own 100% full commercial rights to all created branding assets.' },
      { q: 'What file formats will we receive?', a: 'You receive vector AI, EPS, SVG, print-ready PDF, high-res PNG with transparent backgrounds, and web-ready formats.' }
    ],
    icon_name: 'Palette',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Design Your Brand Identity',
    display_order: 9,
    seo_title: 'Branding & Graphic Design Agency Coimbatore | Dygytaly',
    meta_description: 'Professional logo design, brand identity kits, and graphic design in Coimbatore. Look like the business you are becoming with Dygytaly.'
  },

  'social-media-video': {
    slug: 'social-media-video',
    title: 'Social Media Video Production',
    tagline: 'Give People a Reason to Stop Scrolling.',
    short_desc: 'Short-form videos, reels, promotional edits, motion graphics, and social media creative content engineered to capture attention and communicate value quickly.',
    hero_headline: 'High-Impact Short-Form Video Content That Hooks Audiences in 2 Seconds.',
    problem_solved: 'Static images get less organic reach than ever. Businesses struggle to produce consistent, high-retention video content that looks professional without spending a fortune.',
    approach: 'We concept, storyboard, edit, and optimize engaging short-form video reels and motion advertisements designed for high retention, shares, and algorithmic reach.',
    deliverables: [
      'Short-Form Video Reels & Shorts Editing',
      'Dynamic Motion Graphics & Animated Typography',
      'Scriptwriting & Hook Optimization for Social Algorithms',
      'Sound Design, Trending Audio & Dynamic Captions',
      'Promotional Brand Videos & Founder Spotlight Edits',
      'Batch Content Production Roadmaps'
    ],
    process_steps: [
      { step: '01', title: 'Content Concepting', desc: 'Identifying high-engagement topics, audience curiosity hooks, and trends.' },
      { step: '02', title: 'Storyboarding & Scripts', desc: 'Writing concise, punchy voiceover scripts with strong calls to action.' },
      { step: '03', title: 'Editing & Motion', desc: 'Pacing cuts, color grading, sound design, and animated typography overlay.' },
      { step: '04', title: 'Format Optimization', desc: 'Exporting 9:16 vertical video assets optimized for Instagram, YouTube, and LinkedIn.' }
    ],
    technologies: ['Premiere Pro', 'After Effects', 'CapCut Pro', 'DaVinci Resolve', 'AI Audio Tools'],
    faqs: [
      { q: 'Can you edit raw video footage we shoot on our phones?', a: 'Yes! High-resolution smartphone footage can be transformed into stunning, cinematic social reels with professional editing and motion graphics.' },
      { q: 'What is the ideal video length for social media?', a: 'For Instagram Reels and YouTube Shorts, 20–45 seconds with a powerful hook in the first 2 seconds yields the highest retention and shareability.' }
    ],
    icon_name: 'Video',
    image_url: '/uploads/dygytaly-logo.png',
    cta_text: 'Produce High-Impact Video',
    display_order: 10,
    seo_title: 'Social Media Video Production & Reels Agency Coimbatore | Dygytaly',
    meta_description: 'Short-form video editing, Instagram Reels, and motion graphics in Coimbatore. Turn scrolls into opportunities with Dygytaly creative video production.'
  }
};

export const SERVICES_LIST: ServiceItem[] = Object.values(SERVICES_DATA).sort(
  (a, b) => a.display_order - b.display_order
);

