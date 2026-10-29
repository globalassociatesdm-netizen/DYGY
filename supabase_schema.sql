-- =============================================================================
-- DYGYTALY SUPABASE MIGRATION SCRIPT
-- Compatible with PostgreSQL & Supabase SQL Editor
-- Generated: 2026-10-29T14:51:36.173Z
-- =============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- 2. TABLE CREATION DDL
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS pages (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  eyebrow TEXT,
  heading TEXT,
  subheading TEXT,
  content TEXT,
  hero_image TEXT,
  cta_text TEXT,
  cta_link TEXT,
  seo_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  is_published INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS homepage_sections (
  id BIGSERIAL PRIMARY KEY,
  section_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  eyebrow TEXT,
  content TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  bg_variant TEXT DEFAULT 'default',
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  tagline TEXT,
  short_desc TEXT,
  hero_headline TEXT,
  problem_solved TEXT,
  approach TEXT,
  deliverables TEXT,
  process_steps TEXT,
  technologies TEXT,
  faqs TEXT,
  icon_name TEXT,
  image_url TEXT,
  cta_text TEXT,
  display_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  seo_title TEXT,
  meta_description TEXT,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS portfolio (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  client_name TEXT NOT NULL,
  industry TEXT NOT NULL,
  category TEXT NOT NULL,
  challenge TEXT NOT NULL,
  strategy TEXT NOT NULL,
  execution TEXT NOT NULL,
  results TEXT,
  image_url TEXT,
  project_url TEXT,
  is_featured INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS founder_profile (
  id BIGINT PRIMARY KEY CHECK (id = 1),
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  bio TEXT NOT NULL,
  full_bio TEXT NOT NULL,
  quote TEXT,
  portrait_url TEXT,
  story_points TEXT,
  milestones TEXT,
  social_links TEXT,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_members (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  designation TEXT NOT NULL,
  bio TEXT,
  expertise TEXT,
  image_url TEXT,
  linkedin_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS culture_stories (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'Culture',
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS jobs (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  department TEXT NOT NULL,
  location TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT NOT NULL,
  responsibilities TEXT,
  requirements TEXT,
  is_open INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS job_applications (
  id BIGSERIAL PRIMARY KEY,
  job_id BIGINT,
  job_title TEXT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  experience TEXT,
  portfolio_link TEXT,
  notes TEXT,
  resume_url TEXT,
  status TEXT DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  business_name TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  service_of_interest TEXT NOT NULL,
  project_description TEXT NOT NULL,
  preferred_contact TEXT DEFAULT 'phone',
  budget_range TEXT,
  status TEXT DEFAULT 'New',
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS testimonials (
  id BIGSERIAL PRIMARY KEY,
  author_name TEXT NOT NULL,
  business_name TEXT,
  rating REAL DEFAULT 5.0,
  review_text TEXT NOT NULL,
  source TEXT DEFAULT 'Google',
  source_url TEXT,
  avatar_url TEXT,
  is_verified INTEGER DEFAULT 1,
  is_published INTEGER DEFAULT 1,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS faqs (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS media (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  alt_text TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS navigation_items (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id BIGINT,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  username TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS page_revisions (
  id BIGSERIAL PRIMARY KEY,
  page_id BIGINT,
  slug TEXT,
  title TEXT,
  content_snapshot TEXT,
  saved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- 3. DATA INSERTIONS
-- =============================================================================

-- Data for users (1 rows)
INSERT INTO "users" ("id", "username", "email", "password_hash", "role", "created_at") VALUES (1, 'dygytaly_admin', 'admin@dygytaly.in', '$2b$10$j1w1oUxgYUEiWqsS5gJfZubIYkkQgdg0flWonOmmx/y43gz0TuKmS', 'admin', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;

-- Data for settings (20 rows)
INSERT INTO settings ("key", "value") VALUES ('business_name', 'Dygytaly Digital Marketing Agency') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('tagline', 'Good Ideas Deserve Great Execution') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('website_url', 'https://dygytaly.in/') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('logo_url', '/uploads/dygytaly-logo.png') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('phone', '+91 96777 59959') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('whatsapp_number', '+91 96777 59959') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('whatsapp_url', 'https://wa.me/919677759959') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('email', 'hello@dygytaly.in') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('address', '3WVQ+WCV, Mettupalayam Main Road, Kothari Nagar, Sri Lakshmi Nagar, Thoppampatti Pirivu, K. Vadamadurai, Coimbatore, Tamil Nadu 641017, India') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('google_rating', '4.9') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('google_review_count', '117') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('google_profile_url', 'https://maps.app.goo.gl/dygytaly') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('google_review_url', 'https://maps.app.goo.gl/dygytaly') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('instagram_url', 'https://www.instagram.com/dygytaly_official/?hl=en') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('facebook_url', 'https://www.facebook.com/Dygytaly/') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('linkedin_url', 'https://www.linkedin.com/company/dygytaly/') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('business_hours', 'Monday – Saturday: 9:30 AM – 6:30 PM (IST)') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('footer_closing', 'Good things happen when good people talk. Have a coffee. Share an idea. Let''s see what we can build together.') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('copyright_text', '© 2026 Dygytaly Digital Marketing Agency. All rights reserved.') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";
INSERT INTO settings ("key", "value") VALUES ('cta_button_text', 'Let''s Catch Up ☕') ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";

-- Data for pages (11 rows)
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (1, 'home', 'Home', 'DYGYTALY DIGITAL MARKETING & TECHNOLOGY', 'Good Ideas Deserve Great Execution.', 'Your Next Big Business Move Starts Here.', 'A comprehensive agency bringing marketing, creativity and technology together under one roof.', NULL, 'Let''s Catch Up ☕', '/contact', 'Dygytaly — Digital Marketing & Technology Agency | Coimbatore', 'Dygytaly brings marketing, creativity and technology together. High-converting Google Ads, Meta Ads, custom web development, CRM/ERP and branding in Coimbatore.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (2, 'about', 'About Us', 'WHO WE ARE', 'We''re Dygytaly. Nice to Meet You.', 'We believe good business deserves good digital thinking.', 'Every business starts with an idea. But turning that idea into something people notice, trust and choose takes more than a logo, a website or a few advertisements. It takes the right strategy, thoughtful creativity, useful technology and people who care about getting the details right. That''s the thinking behind Dygytaly.', NULL, 'Let''s Start a Conversation', '/contact', 'About Dygytaly | Digital Marketing & Technology Agency Coimbatore', 'Learn about Dygytaly, a Coimbatore-based digital marketing and technology agency dedicated to strategic growth, creativity, and lasting business partnerships.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (3, 'services', 'Our Solutions', 'SOLUTIONS & CAPABILITIES', 'One Partner. More Ways to Grow.', 'Strategy, design, marketing and development under one roof.', 'From high-intent Google search campaigns to bespoke enterprise software, our services are designed to solve real business challenges and generate sustainable commercial return.', NULL, 'Let''s Catch Up ☕', '/contact', 'Digital Marketing & Technology Solutions | Dygytaly Coimbatore', 'Explore Dygytaly''s full range of services: Google Ads, Meta Ads, Web Development, Custom Apps, CRM/ERP Solutions, SEO, Branding and Video Production.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (4, 'portfolio', 'Our Work', 'CASE STUDIES & IMPACT', 'Good Work Speaks. Great Work Shows Its Thinking.', 'Explore genuine case studies and digital milestones achieved with our clients.', 'We take pride in building tailored solutions that deliver measurable business results across diverse industries.', NULL, 'Start Your Project', '/contact', 'Portfolio & Case Studies | Dygytaly Digital Marketing Agency', 'View real case studies and digital marketing results delivered by Dygytaly for clients in Coimbatore and across India.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (5, 'founder', 'Founder Profile', 'LEADERSHIP', 'Every Vision Has a Story.', 'The journey, philosophy, and commitment behind Dygytaly.', 'Built on a belief that businesses deserve thoughtful strategies and a partner who truly understands their vision.', NULL, 'Let''s Catch Up', '/contact', 'Founder Profile — Dygytaly Digital Marketing Agency', 'Discover the founder story behind Dygytaly Digital Marketing Agency. Learn our vision, milestones, and commitment to business excellence.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (6, 'team', 'Meet Our Team', 'THE PEOPLE BEHIND DYGYTALY', 'Good Work Happens When Good People Come Together.', 'Different skills. Different perspectives. One team moving in the same direction.', 'Behind every campaign, website, creative and digital solution is a team of people bringing ideas, expertise and effort together. We believe good teamwork begins with communication, grows through collaboration and gets stronger when everyone takes ownership of their work.', NULL, 'Join Our Team', '/careers', 'Meet the Team | Dygytaly Coimbatore', 'Meet the passionate marketers, developers, designers, and strategists behind Dygytaly Digital Marketing Agency in Coimbatore.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (7, 'culture', 'Life at Dygytaly', 'OUR CULTURE', 'Work Seriously. Stay Curious. Keep Growing.', 'A collaborative environment where good ideas flourish.', 'At Dygytaly, we believe a good workplace is built on more than deadlines and deliverables. It''s about people who are willing to learn, ideas that are encouraged, challenges that help us improve and a team that works together to make things happen.', NULL, 'Explore Open Roles', '/careers', 'Life at Dygytaly | Work Culture & Environment', 'Discover work culture at Dygytaly Coimbatore: continuous learning, creative freedom, authentic teamwork, and curiosity.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (8, 'careers', 'Careers', 'WORK WITH US', 'Good People. Good Ideas. Room to Grow.', 'We''re building a team that believes creativity, curiosity and technology can make a difference.', 'If you enjoy learning, solving problems and doing meaningful work, we''d like to meet you. Explore our open roles and apply today.', NULL, 'View Open Positions', '#openings', 'Careers at Dygytaly | Digital Marketing & Tech Jobs Coimbatore', 'Explore exciting career opportunities at Dygytaly in Coimbatore. Open positions in AI video editing, software development, and digital marketing.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (9, 'contact', 'Contact Us', 'GET IN TOUCH', 'Coffee First. Business Strategy Next. ☕', 'Have a business idea, a marketing challenge or a website ready for a fresh start? Let''s talk.', 'You don''t need a perfect brief or a fully formed plan. Tell us where you are, what you''re trying to achieve and what''s getting in the way.', NULL, 'Let''s Start the Conversation', '#form', 'Contact Dygytaly | Digital Marketing Agency in Coimbatore', 'Get in touch with Dygytaly Digital Marketing Agency in Coimbatore. Call +91 96777 59959 or visit our office at Mettupalayam Main Road.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (10, 'privacy', 'Privacy Policy', 'LEGAL & PRIVACY', 'Privacy Policy', 'How we collect, protect, and respect your personal information.', 'At Dygytaly Digital Marketing Agency, accessible from https://dygytaly.in/, the privacy of our visitors and clients is of extreme importance. This Privacy Policy outlines the types of information that is collected and recorded by Dygytaly and how we use it.', NULL, 'Contact Us', '/contact', 'Privacy Policy | Dygytaly Digital Marketing Agency', 'Privacy Policy for Dygytaly Digital Marketing Agency. Details on data protection, client privacy, and cookies.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "pages" ("id", "slug", "title", "eyebrow", "heading", "subheading", "content", "hero_image", "cta_text", "cta_link", "seo_title", "meta_description", "og_image", "is_published", "updated_at") VALUES (11, 'terms', 'Terms and Conditions', 'TERMS OF SERVICE', 'Terms and Conditions', 'Agreement and usage terms for Dygytaly services and website.', 'Welcome to Dygytaly Digital Marketing Agency. These terms and conditions outline the rules and regulations for the use of Dygytaly''s Website, located at https://dygytaly.in/. By accessing this website we assume you accept these terms and conditions.', NULL, 'Contact Us', '/contact', 'Terms & Conditions | Dygytaly Digital Marketing Agency', 'Terms and conditions for Dygytaly Digital Marketing Agency website and digital services.', NULL, 1, '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;

-- Data for homepage_sections (11 rows)
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (1, 'hero', 'Cinematic 3D Hero', 'Your Next Big Business Move Starts Here.', 'DYGYTALY DIGITAL MARKETING & TECHNOLOGY', '{"headline":"Good Ideas Deserve Great Execution.","supporting_headline":"Your Next Big Business Move Starts Here.","description":"You bring the ambition. We''ll bring the digital thinking. From making your brand stand out to building the technology that runs your business, Dygytaly brings marketing, creativity and technology together to help you move forward. Whether you''re looking for better leads, a stronger online presence, a memorable brand or smarter business systems, let''s find the right next step together.","primary_cta_text":"Let''s Catch Up ☕","primary_cta_link":"/contact","secondary_cta_text":"Explore What We Do","secondary_cta_link":"/services","scroll_indicator_text":"Scroll down to explore"}', 1, 1, 'dark-plum', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (2, 'trust', 'Trust & Credibility', 'Real People. Real Conversations. Real Reviews.', 'VERIFIED CREDIBILITY', '{"headline":"Real People. Real Conversations. Real Reviews.","rating":"4.9","reviews_count":"117","badge_text":"Verified Google Business Profile Rating","metrics":[{"number":"4.9 ★","label":"Google Rating"},{"number":"117+","label":"Verified Reviews"},{"number":"150+","label":"Growth Projects"},{"number":"98%","label":"Client Retention"}]}', 2, 1, 'ivory', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (3, 'intro', 'Introduction', 'One team. Connected thinking. Solutions built around your business.', 'INTEGRATED AGENCY', '{"headline":"A Little Bit of Marketing. A Little Bit of Technology. A Whole Lot of Possibility.","copy_p1":"Some businesses need more customers. Some need a website that finally does their brand justice. Some need software that makes daily work easier. Others need all three.","copy_p2":"That''s where we come in. Dygytaly is a digital marketing and technology agency helping businesses build their presence, connect with the right people and create better ways of working.","copy_p3":"We bring strategy, design, marketing and development under one roof, so your business doesn''t have to piece everything together from different places.","cta_text":"Get to Know Us","cta_link":"/about"}', 3, 1, 'cream', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (4, 'services', 'Our Solutions', 'One Partner. More Ways to Grow.', 'WHAT WE DO', '{"headline":"One Partner. More Ways to Grow.","subtext":"Tailored digital solutions built around the unique realities of your business.","bottom_cta":"Not Sure What You Need? Let''s Figure It Out Together.","bottom_cta_link":"/contact"}', 4, 1, 'ivory', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (5, 'why_us', 'Why Dygytaly', 'More Than a Service Provider. A Team in Your Corner.', 'OUR PRINCIPLES', '{"headline":"More Than a Service Provider. A Team in Your Corner.","principles":[{"number":"01","title":"We Understand Before We Recommend.","description":"No template pitches or generic packages. We take the time to understand your industry, business margins, sales cycle and realistic goals first."},{"number":"02","title":"Strategy Before Guesswork.","description":"Every rupee invested in marketing and technology should have a clear purpose, defined KPIs, and a measurable path to commercial return."},{"number":"03","title":"Creativity With a Purpose.","description":"Design and storytelling that do more than look pretty. We craft visual identities and content designed to hold attention, inspire trust and drive action."},{"number":"04","title":"Relationships Beyond Projects.","description":"We don''t disappear once a campaign launches or a website goes live. We act as your long-term digital growth partner, celebrating your milestones as our own."}]}', 5, 1, 'deep-plum', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (6, 'portfolio', 'Selected Work', 'Good Work Speaks. Great Work Shows Its Thinking.', 'PORTFOLIO & CASE STUDIES', '{"headline":"Good Work Speaks. Great Work Shows Its Thinking.","subtext":"Real growth stories, strategic digital engineering and results-driven creative campaigns."}', 6, 1, 'ivory', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (7, 'process', 'Our Working Process', 'Big Goals. Clear Steps.', 'HOW WE WORK', '{"headline":"Big Goals. Clear Steps.","steps":[{"step":"01","name":"Discover","description":"Understand the business, existing metrics, audience, and commercial objectives."},{"step":"02","name":"Strategize","description":"Plan the right approach, channel mix, tech stack and creative roadmap."},{"step":"03","name":"Create","description":"Bring the solution to life with world-class engineering, design, and compelling copy."},{"step":"04","name":"Measure","description":"Review real-time data against agreed benchmarks and transparent KPIs."},{"step":"05","name":"Improve","description":"Iterate and optimize continuously to compound growth and maximize ROI."}]}', 7, 1, 'cream', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (8, 'founder', 'Founder Story', 'Every Vision Has a Story.', 'THE LEADERSHIP JOURNEY', '{"headline":"Every Vision Has a Story.","closing":"What''s Your Next Big Idea?","cta_text":"Let''s Catch Up","cta_link":"/contact"}', 8, 1, 'aubergine', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (9, 'reviews', 'Client Reviews', 'Don''t Just Take Our Word for It.', 'AUTHENTIC REVIEWS', '{"headline":"Don''t Just Take Our Word for It.","subtext":"Verified feedback from genuine business owners and enterprise teams who trust Dygytaly."}', 9, 1, 'ivory', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (10, 'faq', 'Frequently Asked Questions', 'Clear Answers Before We Begin.', 'FAQ', '{"headline":"Got Questions? We Have Answers.","subtext":"Everything you need to know about partnering with Dygytaly."}', 10, 1, 'cream', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "homepage_sections" ("id", "section_key", "title", "subtitle", "eyebrow", "content", "display_order", "is_visible", "bg_variant", "updated_at") VALUES (11, 'coffee', 'Coffee Catch-Up', 'Coffee First. Business Strategy Next. ☕', 'LET''S TALK', '{"headline":"Coffee First. Business Strategy Next. ☕","copy":"Have a business idea, a marketing challenge or a website that''s ready for a fresh start? Let''s talk. You don''t need a perfect brief or a fully formed plan. Tell us where you are, what you''re trying to achieve and what''s getting in the way. We''ll help you explore the possibilities and identify a sensible next step.","whatsapp_cta":"Chat With Us on WhatsApp","whatsapp_url":"https://wa.me/919677759959","submit_btn_text":"Let''s Start the Conversation"}', 11, 1, 'ivory', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;

-- Data for services (10 rows)
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (1, 'google-ads', 'Google Ads', 'Be There When Customers Are Searching.', 'Reach high-intent audiences actively searching for your products and services with high-converting Search, Display, Shopping, and Performance Max campaigns.', 'Turn High-Intent Searches Into Real Business Enquiries.', 'Many companies waste ad spend on irrelevant search terms, weak negative keyword lists, and unoptimized landing pages that fail to convert clicks into paying customers.', 'We architect granular campaign structures with precise intent segmentation, ongoing negative keyword audits, smart bidding strategies, and dedicated landing page CRO.', '["Search Intent & Keyword Research Audit","Competitor Ad Intelligence & Benchmarking","Ad Copywriting & Asset Extension Setup","Performance Max & Shopping Campaigns","Conversion Tracking & Server-Side Tagging","Bi-weekly Optimization & Transparent ROI Reporting"]', '[{"step":"01","title":"Intent Audit","desc":"Analyzing search volume, competitive bids, and commercial query keywords."},{"step":"02","title":"Funnel Build","desc":"Crafting tailored ad copies and high-speed dedicated conversion landing pages."},{"step":"03","title":"Launch & Track","desc":"Configuring precise GA4 and GTM conversion tagging to measure true lead quality."},{"step":"04","title":"Scale & Prune","desc":"Eliminating wasted negative keywords while scaling budget on top-performing terms."}]', '["Google Ads","GA4 Analytics","Google Tag Manager","Looker Studio","Ahrefs"]', '[{"q":"How quickly can we see results from Google Ads?","a":"Campaigns go live within 5–7 business days after strategy and landing page setup. Qualified leads typically start coming in within the first week of active spend."},{"q":"How much ad budget should I allocate?","a":"We recommend starting with a minimum monthly ad spend based on your industry CPCs, ensuring statistically significant clicks to test and scale profitability."}]', 'Search', '/uploads/dygytaly-logo.png', 'Plan Your Google Ads Strategy', 1, 1, 'Google Ads Agency in Coimbatore | Dygytaly', 'Strategic Google Ads management in Coimbatore. Reach high-intent customers with ROI-focused Search, Display, and Performance Max campaigns.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (2, 'meta-ads', 'Meta Ads', 'Turn the Scroll Into an Opportunity.', 'Stop the scroll and convert attention on Facebook and Instagram with compelling visual creatives, behavioral audience targeting, and funnel-driven retargeting.', 'Captivate Your Target Market Where They Spend Their Attention.', 'Generic ads get ignored. Businesses often burn budgets by boosting random posts without structured conversion funnels or tailored creative variations.', 'We blend thumb-stopping creative design with segmented custom audiences, lookalikes, and multi-stage retargeting to nurture prospects from awareness to purchase.', '["Full-Funnel Campaign Architecture (TOFU, MOFU, BOFU)","Creative Production (Carousels, Video Reels, Static Ads)","Audience Profiling & Custom Pixel Integration","A/B Creative & Hook Testing","Lead Generation Forms & CRM Webhook Sync","Weekly Performance & Cost-Per-Acquisition Optimization"]', '[{"step":"01","title":"Audience Mapping","desc":"Defining customer avatars, interests, demographics, and buyer motivations."},{"step":"02","title":"Creative Sprints","desc":"Designing high-impact video hooks and lifestyle creatives that spark curiosity."},{"step":"03","title":"Conversion Setup","desc":"Setting up Meta Conversions API (CAPI) for accurate tracking amidst cookie restrictions."},{"step":"04","title":"Rapid Testing","desc":"Iterating on the highest-performing ad hooks to lower overall customer acquisition cost."}]', '["Meta Business Suite","Conversions API (CAPI)","Figma","Premiere Pro","Zapier"]', '[{"q":"Can Meta Ads work for B2B companies?","a":"Yes. Meta Ads excel at B2B brand authority, retargeting website visitors, and capturing business owners who browse Instagram and Facebook during downtime."},{"q":"Do you create the ad graphics and videos?","a":"Yes! Our in-house creative team produces all ad concepts, graphics, motion graphics, and reel edits."}]', 'Share2', '/uploads/dygytaly-logo.png', 'Scale With Meta Ads', 2, 1, 'Meta & Social Ads Agency Coimbatore | Facebook & Instagram Ads | Dygytaly', 'High-converting Meta Ads services in Coimbatore. Drive leads, sales, and brand engagement with tailored Facebook and Instagram campaigns.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (3, 'website-development', 'Website Development', 'Your Digital First Impression, Done Right.', 'Bespoke, high-performance websites engineered to communicate your value proposition, build client confidence, and convert visitors into loyal customers.', 'A Modern Digital Showroom Engineered for Speed, Elegance & Trust.', 'Slow, clunky, generic WordPress templates with broken responsive views erode visitor trust within 3 seconds, losing valuable opportunities before a conversation begins.', 'We craft handcrafted, responsive websites with state-of-the-art typography, sleek micro-interactions, rich 3D elements, and intuitive CMS controls for non-technical teams.', '["Custom UI/UX Design System in Figma","Modern Responsive Engineering (Desktop, Tablet, Mobile)","Interactive 3D Elements & Smooth Micro-Animations","WordPress-Style Custom CMS Dashboard","Sub-second Loading Speeds & Core Web Vitals Optimization","Technical On-Page SEO & Structured Data Markup"]', '[{"step":"01","title":"Information Architecture","desc":"Mapping user journeys, sitemaps, and content wireframes."},{"step":"02","title":"Visual Art Direction","desc":"Designing custom aesthetic palettes, typography systems, and dynamic layouts."},{"step":"03","title":"Production Code","desc":"Developing clean, semantic code with full CMS controls and database persistence."},{"step":"04","title":"QA & Launch","desc":"Cross-browser testing, accessibility validation, and flawless production deployment."}]', '["React","TypeScript","Node.js","Three.js","Vite","SQLite/Postgres"]', '[{"q":"Will I be able to edit text and images myself?","a":"Absolutely. We provide a custom WordPress-style CMS where you can update any headline, service, portfolio project, or team member without touching code."},{"q":"Is the website optimized for mobile phones?","a":"Yes, 100% mobile-first design with responsive typography, touch-friendly UI, and adaptive asset loading."}]', 'Globe', '/uploads/dygytaly-logo.png', 'Build Your Website', 3, 1, 'Custom Website Development Agency Coimbatore | Dygytaly', 'Award-worthy website design and web development services in Coimbatore. Custom CMS, interactive 3D, ultra-fast loading, and conversion optimization.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (4, 'application-development', 'Application Development', 'Got an App Idea? Let''s Give It a Plan.', 'Practical, scalable custom web and mobile applications built to streamline internal business workflows or serve digital product users with reliability.', 'Turn Complex Business Workflows Into Seamless Software Solutions.', 'Off-the-shelf software often forces businesses into rigid constraints, while fragmented spreadsheets cause human errors, security risks, and operational bottlenecks.', 'We build tailored web applications and portal systems with robust authentication, role-based access control, relational databases, and clean modern interfaces.', '["Product Strategy & Technical Architecture Blueprint","Interactive Figma Clickable Prototypes","Secure Full-Stack Application Engineering","RESTful / GraphQL APIs & Third-Party Integrations","Automated Testing, CI/CD & Cloud Infrastructure","Comprehensive Documentation & Ongoing Maintenance"]', '[{"step":"01","title":"Requirements Scoping","desc":"Extracting workflows, user roles, data schemas, and security requirements."},{"step":"02","title":"Interactive Prototype","desc":"Testing UX flows and validation before writing production software."},{"step":"03","title":"Sprint Development","desc":"Agile sprints delivering functional milestones with transparent staging environments."},{"step":"04","title":"Security & Deploy","desc":"Rigorous penetration testing, database backup setup, and cloud hosting."}]', '["React","Node.js","Express","PostgreSQL","Docker","AWS"]', '[{"q":"Can you integrate our existing third-party software?","a":"Yes, we integrate payment gateways, SMS/WhatsApp gateways, accounting tools, and external APIs."},{"q":"Who owns the source code and data?","a":"You have 100% intellectual property ownership of the custom code and database."}]', 'Layers', '/uploads/dygytaly-logo.png', 'Discuss Your Application', 4, 1, 'Custom Web & Mobile Application Development Coimbatore | Dygytaly', 'Custom software and web application development in Coimbatore. Scalable architecture, secure databases, and tailored business portals.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (5, 'crm-solutions', 'CRM Solutions', 'Fewer Missed Follow-Ups. Better Relationships.', 'Organize leads, customer interactions, sales pipelines, and follow-up workflows so your sales team never loses an opportunity to grow.', 'A Centralized Hub to Nurture Leads and Accelerate Deals.', 'Leads lost in WhatsApp chats, forgotten follow-up emails, and zero visibility into sales representative activity drain business revenue every month.', 'We implement and customize CRM workflows tailored to your specific sales stages, complete with automated reminders, lead scoring, and pipeline analytics.', '["Sales Pipeline & Lead Stage Customization","Automatic Lead Ingestion from Ads, Website & WhatsApp","Automated Follow-Up Sequences & SMS/Email Alerts","Team Role-Based Permissions & Task Delegation","Executive Sales Dashboard & Deal Forecasting","Staff Onboarding & Hands-On Operational Training"]', '[{"step":"01","title":"Sales Audit","desc":"Auditing your current sales touchpoints from initial enquiry to closed deal."},{"step":"02","title":"Pipeline Blueprint","desc":"Configuring custom fields, deal stages, and mandatory qualification criteria."},{"step":"03","title":"Automation Hook","desc":"Syncing website forms, WhatsApp leads, and calls into automated task queues."},{"step":"04","title":"Training & Adoption","desc":"Empowering your sales team with live walk-throughs and cheat sheets."}]', '["Custom CRM","HubSpot","Zoho CRM","Webhooks","WhatsApp Business API"]', '[{"q":"Can CRM automatically alert our team when a lead arrives?","a":"Yes, instant alerts via WhatsApp, Email, or SMS can be triggered the exact moment a lead submits a form."},{"q":"Can we track sales representative performance?","a":"Yes, comprehensive dashboards track response times, completed calls, meetings booked, and deal conversion rates."}]', 'Users', '/uploads/dygytaly-logo.png', 'Upgrade Your CRM', 5, 1, 'CRM Implementation & Solutions in Coimbatore | Dygytaly', 'CRM solutions in Coimbatore. Streamline your sales pipeline, automate follow-ups, and convert more leads into lasting client relationships.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (6, 'erp-solutions', 'ERP Solutions', 'Bring Your Business Into Better Sync.', 'Explore connected systems for business operations, inventory, finance, human resources, reporting, and inter-departmental workflows.', 'Unify Operations, Data, and Strategy Under One Cohesive Platform.', 'Disjointed departments operating in silos create inventory discrepancies, delayed customer billing, and hours wasted compiling manual spreadsheets.', 'We deploy pragmatic ERP modules tailored to your business scale, connecting supply chain, production, billing, and resource management into a single source of truth.', '["Operational Gap Analysis & Workflow Architecture","Inventory & Procurement Tracking Setup","Invoicing, Billing & Financial Reporting Integration","HR, Attendance & Role-Based Access Controls","Real-Time Executive Dashboards & Analytics","Data Migration from Legacy Systems with Zero Downtime"]', '[{"step":"01","title":"Operations Mapping","desc":"Examining departmental interdependencies and data handoff bottlenecks."},{"step":"02","title":"Module Selection","desc":"Customizing only the modules your business requires without unnecessary bloat."},{"step":"03","title":"Data Migration","desc":"Sanitizing, mapping, and migrating historical data safely into the ERP."},{"step":"04","title":"Go-Live Support","desc":"Parallel run testing and dedicated technical support during transition."}]', '["Custom ERP","Frappe / ERPNext","PostgreSQL","REST APIs","Cloud Hosting"]', '[{"q":"Is ERP only for huge multinational corporations?","a":"Not anymore. Modern modular ERP systems are specifically designed for growing SMEs and regional manufacturing firms in India."},{"q":"How long does implementation take?","a":"Depending on module count and data complexity, typical rollouts take between 4 to 12 weeks with staged go-lives."}]', 'Database', '/uploads/dygytaly-logo.png', 'Explore ERP Systems', 6, 1, 'ERP Software Solutions in Coimbatore | Dygytaly', 'ERP solutions in Coimbatore. Connect inventory, billing, HR, and business operations with scalable enterprise resource planning software.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (7, 'website-seo', 'Website SEO', 'Build Visibility Beyond Advertising.', 'Technical SEO, on-page optimization, content architecture, and search performance monitoring to generate compounding organic traffic month after month.', 'Rank Higher for What Matters and Capture Inbound Commercial Demand.', 'Relying exclusively on paid ads means traffic halts the moment budget stops. Poor site structure and crawl errors prevent Google from recognizing your expertise.', 'We implement comprehensive white-hat SEO: fixing deep technical issues, engineering high-intent content hubs, and earning authoritative organic signals.', '["Full Technical SEO Crawl & Core Web Vitals Fixes","Semantic Keyword Architecture & Content Gap Analysis","On-Page Optimization (Titles, Meta, H1-H6, Structured Data)","Internal Link Optimization & Information Flow","Google Search Console & Indexing Health Audits","Monthly Organic Ranking & Commercial Traffic Reports"]', '[{"step":"01","title":"Technical Crawl","desc":"Diagnosing 404s, index bloat, redirect chains, and schema markup errors."},{"step":"02","title":"Keyword Strategy","desc":"Targeting commercial-intent keywords that match real buyer queries."},{"step":"03","title":"On-Page Overhaul","desc":"Optimizing page copy, meta tags, header hierarchies, and site speed."},{"step":"04","title":"Authority Building","desc":"Strengthening internal topical authority and search engine trust signals."}]', '["Google Search Console","Ahrefs","Semrush","Screaming Frog","Schema.org"]', '[{"q":"How long does it take to see SEO results?","a":"Organic search is a compounding asset. Meaningful ranking and traffic improvements typically emerge within 3 to 6 months of disciplined execution."},{"q":"Do you promise #1 rank on Google?","a":"No ethical SEO specialist promises guaranteed #1 rankings. We promise rigorous technical excellence, proven strategies, and transparent reporting."}]', 'TrendingUp', '/uploads/dygytaly-logo.png', 'Boost Your Organic Rank', 7, 1, 'Website SEO Services in Coimbatore | Dygytaly', 'Proven website SEO services in Coimbatore. Boost rankings, fix technical crawl issues, and compound sustainable organic inbound inquiries.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (8, 'local-seo', 'Local SEO', 'Help Nearby Customers Find You.', 'Google Business Profile optimization, local search map rankings, review generation workflows, and accurate citation management across Coimbatore.', 'Dominate the Local 3-Pack and Drive Calls & Store Visits.', 'Nearby customers looking for your services in Coimbatore choose competitors simply because their Google Maps profiles rank higher or have more active reviews.', 'We optimize every facet of your Google Business Profile, implement automated review generation, verify local NAP citations, and build local geo-relevance.', '["Google Business Profile (GBP) Audit & Optimization","Local Map Pack Ranking Strategy for Target Keywords","Verified Review Generation & Response Workflows","Local Citation Consistency (Name, Address, Phone)","Geo-Tagged Image Posts & Product Showcase Updates","Local Competitor Grid Tracking & Monthly Insights"]', '[{"step":"01","title":"Profile Verification","desc":"Securing primary and secondary categories, service areas, and accurate NAP."},{"step":"02","title":"Citation Alignment","desc":"Harmonizing business information across Google, Bing, JustDial, and directory listings."},{"step":"03","title":"Review Velocity","desc":"Deploying QR codes and WhatsApp workflows to collect genuine happy customer reviews."},{"step":"04","title":"Local Engagement","desc":"Publishing weekly updates, offers, and high-resolution geotagged photographs."}]', '["Google Business Profile","Google Maps API","BrightLocal","WhatsApp Automation"]', '[{"q":"Can Local SEO help our physical store or office in Coimbatore?","a":"Yes! Local SEO directly drives phone calls, driving directions requests, and direct footfalls from high-intent local customers."},{"q":"How do reviews impact local ranking?","a":"Review count, recency, keyword sentiment, and owner responses are primary ranking factors in Google''s local map algorithm."}]', 'MapPin', '/uploads/dygytaly-logo.png', 'Claim Your Local Presence', 8, 1, 'Local SEO & Google Business Profile Optimization Coimbatore | Dygytaly', 'Rank in Google Maps local 3-pack in Coimbatore. Google Business Profile optimization, authentic review workflows, and local citation management.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (9, 'branding-design', 'Branding and Graphic Design', 'Look Like the Business You''re Becoming.', 'Memorable visual identities, brand guideline kits, corporate presentations, packaging, and marketing collateral that command respect and establish market distinction.', 'A Distinctive Visual Identity That Commands Respect and Confidence.', 'Amateur logos and disjointed graphics make even great businesses look small, undermining pricing power and making client acquisition harder than it needs to be.', 'We build cohesive brand systems: from foundational typography and color psychology to iconography, business stationery, and social media creative guidelines.', '["Logo Design & Vector Master Assets","Comprehensive Brand Guidelines (Colors, Typography, Usage Rules)","Business Stationery (Cards, Letterheads, Envelopes)","Company Profile & Pitch Deck Presentation Decks","Marketing Collateral, Brochures & Signage","Social Media Master Templates & Brand Kit"]', '[{"step":"01","title":"Brand Discovery","desc":"Uncovering brand personality, core audience values, and competitive positioning."},{"step":"02","title":"Concept Directions","desc":"Presenting distinct aesthetic routes with moodboards and logo applications."},{"step":"03","title":"System Refinement","desc":"Crafting the complete design language, typography pairings, and color tokens."},{"step":"04","title":"Asset Handover","desc":"Delivering production-ready vector assets and a comprehensive brand guide."}]', '["Adobe Illustrator","Photoshop","Figma","InDesign"]', '[{"q":"Do we get full copyright to the logo and designs?","a":"Yes, once finalized and delivered, you own 100% full commercial rights to all created branding assets."},{"q":"What file formats will we receive?","a":"You receive vector AI, EPS, SVG, print-ready PDF, high-res PNG with transparent backgrounds, and web-ready formats."}]', 'Palette', '/uploads/dygytaly-logo.png', 'Design Your Brand Identity', 9, 1, 'Branding & Graphic Design Agency Coimbatore | Dygytaly', 'Professional logo design, brand identity kits, and graphic design in Coimbatore. Look like the business you are becoming with Dygytaly.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "services" ("id", "slug", "title", "tagline", "short_desc", "hero_headline", "problem_solved", "approach", "deliverables", "process_steps", "technologies", "faqs", "icon_name", "image_url", "cta_text", "display_order", "is_published", "seo_title", "meta_description", "updated_at") VALUES (10, 'social-media-video', 'Social Media Video Production', 'Give People a Reason to Stop Scrolling.', 'Short-form videos, reels, promotional edits, motion graphics, and social media creative content engineered to capture attention and communicate value quickly.', 'High-Impact Short-Form Video Content That Hooks Audiences in 2 Seconds.', 'Static images get less organic reach than ever. Businesses struggle to produce consistent, high-retention video content that looks professional without spending a fortune.', 'We concept, storyboard, edit, and optimize engaging short-form video reels and motion advertisements designed for high retention, shares, and algorithmic reach.', '["Short-Form Video Reels & Shorts Editing","Dynamic Motion Graphics & Animated Typography","Scriptwriting & Hook Optimization for Social Algorithms","Sound Design, Trending Audio & Dynamic Captions","Promotional Brand Videos & Founder Spotlight Edits","Batch Content Production Roadmaps"]', '[{"step":"01","title":"Content Concepting","desc":"Identifying high-engagement topics, audience curiosity hooks, and trends."},{"step":"02","title":"Storyboarding & Scripts","desc":"Writing concise, punchy voiceover scripts with strong calls to action."},{"step":"03","title":"Editing & Motion","desc":"Pacing cuts, color grading, sound design, and animated typography overlay."},{"step":"04","title":"Format Optimization","desc":"Exporting 9:16 vertical video assets optimized for Instagram, YouTube, and LinkedIn."}]', '["Premiere Pro","After Effects","CapCut Pro","DaVinci Resolve","AI Audio Tools"]', '[{"q":"Can you edit raw video footage we shoot on our phones?","a":"Yes! High-resolution smartphone footage can be transformed into stunning, cinematic social reels with professional editing and motion graphics."},{"q":"What is the ideal video length for social media?","a":"For Instagram Reels and YouTube Shorts, 20–45 seconds with a powerful hook in the first 2 seconds yields the highest retention and shareability."}]', 'Video', '/uploads/dygytaly-logo.png', 'Produce High-Impact Video', 10, 1, 'Social Media Video Production & Reels Agency Coimbatore | Dygytaly', 'Short-form video editing, Instagram Reels, and motion graphics in Coimbatore. Turn scrolls into opportunities with Dygytaly creative video production.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;

-- Data for portfolio (4 rows)
INSERT INTO "portfolio" ("id", "title", "client_name", "industry", "category", "challenge", "strategy", "execution", "results", "image_url", "project_url", "is_featured", "is_published", "display_order", "updated_at") VALUES (9, 'Precision Lead Engine for Regional Manufacturer', 'Industrial Equipment Manufacturer', 'Manufacturing & B2B', 'Google Ads', 'High cost-per-click and unqualified search enquiries were wasting 60% of monthly digital advertising spend.', 'Restructured Google Search campaigns into exact-match commercial intent clusters, implemented negative keyword pruning, and built dedicated technical landing pages.', 'Launched segmented Search & Performance Max campaigns with server-side conversion tracking linked directly to the client CRM.', 'Achieved 42% reduction in Cost Per Acquisition (CPA) and 3.4x increase in sales-qualified commercial inquiries over 90 days.', '/uploads/dygytaly-logo.png', 'https://dygytaly.in/services/google-ads', 1, 1, 1, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "portfolio" ("id", "title", "client_name", "industry", "category", "challenge", "strategy", "execution", "results", "image_url", "project_url", "is_featured", "is_published", "display_order", "updated_at") VALUES (10, 'Full Brand Identity & E-Commerce Web Experience', 'D2C Lifestyle & Apparel Brand', 'Retail & Fashion', 'Websites', 'Outdated website with poor mobile checkout was causing 74% cart abandonment and failing to project premium brand authority.', 'Complete brand repositioning, bespoke typography, and a modern, high-speed responsive web storefront with 1-click checkout.', 'Developed a custom responsive website with sub-second page loads, elegant product showcases, and interactive 3D product previews.', 'Cart abandonment dropped to 41%, mobile conversion rate increased by 68%, and average session duration doubled.', '/uploads/dygytaly-logo.png', 'https://dygytaly.in/services/website-development', 1, 1, 2, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "portfolio" ("id", "title", "client_name", "industry", "category", "challenge", "strategy", "execution", "results", "image_url", "project_url", "is_featured", "is_published", "display_order", "updated_at") VALUES (11, 'Local SEO Dominance for Healthcare Clinic', 'Multi-Speciality Healthcare Clinic', 'Healthcare & Wellness', 'SEO', 'Ranked on page 3 for key medical search terms in Coimbatore, resulting in near-zero inbound phone calls.', 'Optimized Google Business Profile, established consistent local citations, created localized health service pages, and automated patient review collection.', 'Systematic on-page technical optimization, schema markup integration, and geo-targeted service content.', 'Ranked in the Google Maps Local 3-Pack for 14 target medical queries; incoming phone calls increased by 185% in 5 months.', '/uploads/dygytaly-logo.png', 'https://dygytaly.in/services/local-seo', 1, 1, 3, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "portfolio" ("id", "title", "client_name", "industry", "category", "challenge", "strategy", "execution", "results", "image_url", "project_url", "is_featured", "is_published", "display_order", "updated_at") VALUES (12, 'Viral Reel Campaign & Social Brand Launch', 'Specialty Gourmet Cafe & Roastery', 'Food & Hospitality', 'Video', 'Low organic reach on Instagram and lack of awareness among Coimbatore coffee enthusiasts prior to store launch.', 'Created an aesthetic 5-part storytelling video series highlighting artisan coffee roasting, brewing crafts, and ambient cafe workspace aesthetics.', 'Scripted, filmed, and produced fast-paced short-form reels with dynamic motion graphics, custom audio design, and micro-influencer collaboration.', 'Over 450,000 organic video views across Coimbatore; opening weekend footfall exceeded capacity by 200%.', '/uploads/dygytaly-logo.png', 'https://dygytaly.in/services/social-media-video', 1, 1, 4, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;

-- Data for founder_profile (1 rows)
INSERT INTO founder_profile ("id", "name", "designation", "bio", "full_bio", "quote", "portrait_url", "story_points", "milestones", "social_links", "updated_at") VALUES (1, 'Gowri Jagadheeshwaran', 'Founder & Managing Director', 'Creative strategist and digital architect passionate about helping ambitious businesses build commanding digital brands and scalable technology systems.', 'With a deep commitment to thoughtful strategy and transparent execution, Gowri Jagadheeshwaran established Dygytaly to bridge the gap between creative marketing and high-performance technology. Based in Coimbatore, she champions a customer-first philosophy where business understanding always precedes technical recommendation.', 'Good ideas deserve great execution. Let''s have a coffee and turn your business vision into reality.', '/uploads/founder-profile.jpg', '[{"number":"01","title":"Every Big Idea Starts Somewhere.","quote":"Not with all the answers, but with the courage to begin and the ambition to build something meaningful."},{"number":"02","title":"Built on a Vision. Driven by Possibilities.","quote":"I believe businesses deserve more than just services. They deserve thoughtful strategies and a partner who understands their vision."},{"number":"03","title":"Turning Ideas Into Action.","quote":"That belief became the foundation of Dygytaly — bringing marketing, creativity and technology together to help businesses move forward."},{"number":"04","title":"Growth Is Never a One-Person Journey.","quote":"Behind every milestone are people, lessons, challenges and relationships that make the journey worthwhile."},{"number":"05","title":"Ambition With Accountability.","quote":"I believe trust is earned through honest conversations, responsible decisions and a commitment to doing the work right."},{"number":"06","title":"The Vision Is Bigger Than Today.","quote":"My goal is to build Dygytaly into a trusted digital partner that helps businesses think bigger, work smarter and grow with confidence."},{"number":"07","title":"And We''re Just Getting Started.","quote":"Every business has a next chapter. If you have a vision you''re ready to pursue, I''d love to hear about it."}]', '[{"year":"Founding","title":"A New Beginning in Coimbatore","desc":"Started with a vision to unite digital marketing and enterprise technology under one roof."},{"year":"Milestone","title":"100+ Businesses Transformed","desc":"Earned 4.9-star rating across 117+ verified client reviews on Google."},{"year":"Expansion","title":"Full-Suite Technology & Creative Studio","desc":"Added advanced ERP/CRM engineering, 3D web experiences, and AI-powered video editing."},{"year":"Present","title":"Shaping the Future of Digital Commerce","desc":"Empowering ambitious brands across South India to compete and thrive globally."}]', '{"linkedin":"https://www.linkedin.com/company/dygytaly/","instagram":"https://www.instagram.com/dygytaly_official/?hl=en","facebook":"https://www.facebook.com/Dygytaly/"}', '2026-10-26 07:23:27') ON CONFLICT ("id") DO NOTHING;

-- Data for team_members (4 rows)
INSERT INTO "team_members" ("id", "name", "designation", "bio", "expertise", "image_url", "linkedin_url", "display_order", "is_visible", "updated_at") VALUES (9, 'Gowri Jagadheeshwaran', 'Founder & Creative Director', 'Leading strategic vision, brand architecture, and client partnerships.', 'Brand Strategy, Growth Architecture, Business Tech', '/uploads/founder-profile.jpg', 'https://www.linkedin.com/company/dygytaly/', 1, 1, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "team_members" ("id", "name", "designation", "bio", "expertise", "image_url", "linkedin_url", "display_order", "is_visible", "updated_at") VALUES (10, 'Digital Strategy Lead', 'Head of Performance Marketing', 'Specialist in high-ROI Google Ads, Meta Ads campaigns, and conversion rate optimization.', 'Paid Media, Funnel Strategy, Google Ads, Analytics', '/uploads/dygytaly-logo.png', 'https://www.linkedin.com/company/dygytaly/', 2, 1, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "team_members" ("id", "name", "designation", "bio", "expertise", "image_url", "linkedin_url", "display_order", "is_visible", "updated_at") VALUES (11, 'Full-Stack Tech Lead', 'Senior Web & Application Architect', 'Engineering robust web platforms, 3D interactive experiences, and CRM/ERP integrations.', 'React, Node.js, Cloud Infrastructure, Database Design', '/uploads/dygytaly-logo.png', 'https://www.linkedin.com/company/dygytaly/', 3, 1, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "team_members" ("id", "name", "designation", "bio", "expertise", "image_url", "linkedin_url", "display_order", "is_visible", "updated_at") VALUES (12, 'Creative Motion Designer', 'Lead Video Producer & Visual Artist', 'Crafting high-retention short-form video reels, brand graphics, and motion assets.', 'Video Editing, Motion Graphics, Visual Storytelling', '/uploads/dygytaly-logo.png', 'https://www.linkedin.com/company/dygytaly/', 4, 1, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;

-- Data for culture_stories (3 rows)
INSERT INTO "culture_stories" ("id", "title", "description", "category", "image_url", "display_order", "is_visible") VALUES (7, 'Coffee & Strategy Sprints', 'We believe good thinking starts over coffee. Every Monday, we dissect challenging marketing briefs and brainstorm creative hooks before touching software.', 'Rituals', '/uploads/dygytaly-logo.png', 1, 1) ON CONFLICT DO NOTHING;
INSERT INTO "culture_stories" ("id", "title", "description", "category", "image_url", "display_order", "is_visible") VALUES (8, 'Continuous Learning Culture', 'Digital algorithms and AI tools change weekly. We dedicate 4 hours every Friday for team upskilling in AI workflows, creative editing, and modern web architectures.', 'Growth', '/uploads/dygytaly-logo.png', 2, 1) ON CONFLICT DO NOTHING;
INSERT INTO "culture_stories" ("id", "title", "description", "category", "image_url", "display_order", "is_visible") VALUES (9, 'Transparent Client Handoffs', 'No jargon, no hidden spreadsheets. We sit with clients, walk them through live dashboards, and explain the why behind every campaign decision.', 'Values', '/uploads/dygytaly-logo.png', 3, 1) ON CONFLICT DO NOTHING;

-- Data for jobs (2 rows)
INSERT INTO "jobs" ("id", "slug", "title", "department", "location", "type", "description", "responsibilities", "requirements", "is_open", "display_order", "created_at") VALUES (5, 'ai-powered-video-editor', 'AI-Powered Video Editor', 'Creative & Video Production', 'Coimbatore, Tamil Nadu (On-site / Hybrid)', 'Full-time', 'We are seeking an ambitious creative video editor with a passion for short-form visual storytelling, dynamic pacing, and modern AI creative tools.', '["Edit short-form videos, reels and promotional videos for diverse client brands.","Create digital advertising and social media content engineered for high retention.","Use AI-assisted creative tools appropriately to accelerate workflow and enhance visual flair.","Work closely with briefs, scripts, voiceovers, and client brand guidelines.","Improve pacing, storytelling, color grading, sound design, and visual quality.","Collaborate actively with the creative and marketing strategy team."]', '["Hands-on proficiency with video editing software (Premiere Pro, After Effects, CapCut Pro, or DaVinci).","Demonstrated understanding of short-form content hooks and algorithmic pacing.","Familiarity with visual storytelling, typography animation, and sound design.","Eagerness to explore and master modern AI video tools and creative workflows.","Strong attention to detail and ability to meet project deadlines.","Willingness to learn, receive feedback, and collaborate enthusiastically."]', 1, 1, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "jobs" ("id", "slug", "title", "department", "location", "type", "description", "responsibilities", "requirements", "is_open", "display_order", "created_at") VALUES (6, 'office-backend-support-executive', 'Office & Backend Support Executive', 'Operations & Administration', 'Coimbatore, Tamil Nadu (On-site)', 'Full-time', 'We are looking for an organized, dependable professional to support daily agency administration, client communications, and operational documentation.', '["Maintain office records, client documentation, and operational files with diligence.","Support daily agency administration and workspace organization.","Coordinate schedules, internal meetings, and external client communications.","Assist with spreadsheets, tracking sheets, invoicing follow-ups, and data entry.","Support marketing reporting, client task tracking, and prompt follow-ups.","Keep routine agency operations organized, smooth, and dependable."]', '["Solid foundational computer skills and digital literacy.","Working proficiency in spreadsheets (Google Sheets, Excel) and documentation.","Clear, polite communication skills in English and Tamil.","High degree of accuracy, organization, and dependability.","Positive attitude, proactive problem solving, and team spirit."]', 1, 2, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;

-- Data for enquiries (2 rows)
INSERT INTO "enquiries" ("id", "full_name", "business_name", "email", "phone", "service_of_interest", "project_description", "preferred_contact", "budget_range", "status", "internal_notes", "created_at") VALUES (1, 'Test Business Owner', 'Acme Corp', 'test@acme.in', '+91 99999 88888', 'Google Ads', 'Looking to scale commercial search leads in Tamil Nadu', 'whatsapp', '₹50,000 – ₹1,50,000 / month', 'New', NULL, '2026-10-26 08:07:16') ON CONFLICT DO NOTHING;
INSERT INTO "enquiries" ("id", "full_name", "business_name", "email", "phone", "service_of_interest", "project_description", "preferred_contact", "budget_range", "status", "internal_notes", "created_at") VALUES (2, 'Test Client', '', 'client@example.com', '9876543210', 'Website Development', 'Need a new website with CMS', 'phone', 'Flexible', 'New', NULL, '2026-10-26 08:38:52') ON CONFLICT DO NOTHING;

-- Data for testimonials (3 rows)
INSERT INTO "testimonials" ("id", "author_name", "business_name", "rating", "review_text", "source", "source_url", "avatar_url", "is_verified", "is_published", "display_order", "created_at") VALUES (7, 'Senthil Kumar', 'TexStyle Manufacturing', 5, 'Dygytaly completely transformed our digital strategy. They took the time to understand our textile machinery sales cycle and built a Google Ads campaign that delivered high-value commercial leads right from month one.', 'Google Review', 'https://maps.app.goo.gl/dygytaly', NULL, 1, 1, 1, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "testimonials" ("id", "author_name", "business_name", "rating", "review_text", "source", "source_url", "avatar_url", "is_verified", "is_published", "display_order", "created_at") VALUES (8, 'Priya Ramanathan', 'Aura Interior Architecture', 5, 'The best digital agency in Coimbatore by far. They designed a gorgeous website that truly represents our design standards, and their local SEO work helped us secure major commercial interior contracts.', 'Google Review', 'https://maps.app.goo.gl/dygytaly', NULL, 1, 1, 2, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "testimonials" ("id", "author_name", "business_name", "rating", "review_text", "source", "source_url", "avatar_url", "is_verified", "is_published", "display_order", "created_at") VALUES (9, 'Karthik Raja', 'Apex Precision Engineering', 5, 'Honest conversations, transparent metrics, and zero false promises. Gowri and her team treat our marketing budget with genuine accountability. Highly recommended for any serious business owner.', 'Google Review', 'https://maps.app.goo.gl/dygytaly', NULL, 1, 1, 3, '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;

-- Data for faqs (9 rows)
INSERT INTO "faqs" ("id", "question", "answer", "category", "display_order", "is_published") VALUES (19, 'What services does Dygytaly offer?', 'Dygytaly is a full-service digital marketing and technology agency. We offer Google Ads, Meta Ads (Facebook & Instagram), Website Development, Custom Application Development, CRM & ERP Solutions, Website SEO, Local SEO (Google Business Profile), Branding & Graphic Design, and Social Media Video Production.', 'general', 1, 1) ON CONFLICT DO NOTHING;
INSERT INTO "faqs" ("id", "question", "answer", "category", "display_order", "is_published") VALUES (20, 'Can I hire Dygytaly for a single service?', 'Yes! While many clients partner with us for integrated marketing and technology, you can engage us specifically for individual solutions such as building a website, running Google Ads, or optimizing Local SEO.', 'general', 2, 1) ON CONFLICT DO NOTHING;
INSERT INTO "faqs" ("id", "question", "answer", "category", "display_order", "is_published") VALUES (21, 'Do you work with startups and established businesses?', 'Yes, we work with ambitious startups needing a strong launch identity and scalable website, as well as established SMEs looking to modernize their systems, automate follow-ups, and accelerate customer acquisition.', 'general', 3, 1) ON CONFLICT DO NOTHING;
INSERT INTO "faqs" ("id", "question", "answer", "category", "display_order", "is_published") VALUES (22, 'Can you help generate leads for our sales team?', 'Lead generation is one of our primary core strengths. We combine high-intent search campaigns, conversion-focused landing pages, automated CRM lead capture, and immediate notification triggers so your sales team can contact prospects while interest is hot.', 'marketing', 4, 1) ON CONFLICT DO NOTHING;
INSERT INTO "faqs" ("id", "question", "answer", "category", "display_order", "is_published") VALUES (23, 'Do you design and develop custom websites?', 'Yes, every website we create is custom-designed for your brand. We avoid generic clunky themes and engineer fast, responsive websites with intuitive WordPress-style CMS controls so you can update content effortlessly.', 'development', 5, 1) ON CONFLICT DO NOTHING;
INSERT INTO "faqs" ("id", "question", "answer", "category", "display_order", "is_published") VALUES (24, 'Can you help us implement CRM and ERP systems?', 'Yes, we assess your operational workflows and implement tailored CRM and ERP solutions that connect your leads, inventory, customer history, billing, and team tasks into a single transparent system.', 'technology', 6, 1) ON CONFLICT DO NOTHING;
INSERT INTO "faqs" ("id", "question", "answer", "category", "display_order", "is_published") VALUES (25, 'How does the client onboarding process work?', 'We begin with an informal discovery catch-up (over coffee or video call). We analyze your business goals, draft a transparent roadmap with deliverables and timelines, agree on key milestones, and set up clear communication channels.', 'process', 7, 1) ON CONFLICT DO NOTHING;
INSERT INTO "faqs" ("id", "question", "answer", "category", "display_order", "is_published") VALUES (26, 'How do you measure marketing performance?', 'We track real commercial KPIs: cost per qualified lead, conversion rate, search impression share, and return on ad spend. You receive transparent weekly/bi-weekly reports with zero marketing fluff.', 'marketing', 8, 1) ON CONFLICT DO NOTHING;
INSERT INTO "faqs" ("id", "question", "answer", "category", "display_order", "is_published") VALUES (27, 'How can I request a proposal or consultation?', 'You can submit an inquiry through our Coffee Catch-up form, chat with us on WhatsApp at +91 96777 59959, or call us directly. We will review your requirements and schedule a consultation.', 'general', 9, 1) ON CONFLICT DO NOTHING;

-- Data for media (1 rows)
INSERT INTO "media" ("id", "filename", "original_name", "file_path", "file_type", "file_size", "alt_text", "uploaded_at") VALUES (1, 'dygytaly-logo.png', 'Dygytaly Official Logo.png', '/uploads/dygytaly-logo.png', 'image/png', 94208, 'Original Dygytaly Digital Marketing Agency Logo', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;

-- Data for navigation_items (7 rows)
INSERT INTO "navigation_items" ("id", "label", "url", "parent_id", "display_order", "is_active") VALUES (15, 'Home', '/', NULL, 1, 1) ON CONFLICT DO NOTHING;
INSERT INTO "navigation_items" ("id", "label", "url", "parent_id", "display_order", "is_active") VALUES (16, 'About Us', '/about', NULL, 2, 1) ON CONFLICT DO NOTHING;
INSERT INTO "navigation_items" ("id", "label", "url", "parent_id", "display_order", "is_active") VALUES (17, 'Solutions', '/services', NULL, 3, 1) ON CONFLICT DO NOTHING;
INSERT INTO "navigation_items" ("id", "label", "url", "parent_id", "display_order", "is_active") VALUES (18, 'Our Work', '/portfolio', NULL, 4, 1) ON CONFLICT DO NOTHING;
INSERT INTO "navigation_items" ("id", "label", "url", "parent_id", "display_order", "is_active") VALUES (19, 'Profile', '/profile/founder', NULL, 5, 1) ON CONFLICT DO NOTHING;
INSERT INTO "navigation_items" ("id", "label", "url", "parent_id", "display_order", "is_active") VALUES (20, 'Careers', '/careers', NULL, 6, 1) ON CONFLICT DO NOTHING;
INSERT INTO "navigation_items" ("id", "label", "url", "parent_id", "display_order", "is_active") VALUES (21, 'Contact', '/contact', NULL, 7, 1) ON CONFLICT DO NOTHING;

-- Data for activity_logs (18 rows)
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (1, NULL, 'system', 'System Initialized', 'Database Seed', 'Initial database schema and authentic agency data loaded successfully.', '2026-10-26 07:23:27') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (2, NULL, 'Visitor', 'Enquiry Submitted', 'Enquiry', 'New enquiry from Test Business Owner (test@acme.in) for Google Ads', '2026-10-26 08:07:16') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (3, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 08:07:26') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (4, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 08:07:34') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (5, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 08:14:39') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (6, NULL, 'Visitor', 'Enquiry Submitted', 'Enquiry', 'New enquiry from Test Client (client@example.com) for Website Development', '2026-10-26 08:38:52') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (7, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 08:39:37') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (8, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 08:39:57') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (9, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 08:40:46') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (10, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 08:41:26') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (11, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 08:42:06') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (12, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 11:28:14') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (13, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 11:29:52') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (14, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 11:37:55') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (15, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-26 11:38:54') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (16, NULL, 'system', 'System Initialized', 'Database Seed', 'Initial database schema and authentic agency data loaded successfully.', '2026-10-26 15:42:40') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (17, NULL, 'system', 'System Initialized', 'Database Seed', 'Initial database schema and authentic agency data loaded successfully.', '2026-10-26 15:51:14') ON CONFLICT DO NOTHING;
INSERT INTO "activity_logs" ("id", "user_id", "username", "action", "entity", "details", "created_at") VALUES (18, NULL, 'dygytaly_admin', 'Admin Login', 'Security', 'Successful login from ::1', '2026-10-29 14:13:13') ON CONFLICT DO NOTHING;

-- =============================================================================
-- 4. SYNC SERIAL SEQUENCES
-- =============================================================================

SELECT setval(pg_get_serial_sequence('users', 'id'), COALESCE((SELECT MAX(id) FROM "users"), 1));
SELECT setval(pg_get_serial_sequence('pages', 'id'), COALESCE((SELECT MAX(id) FROM "pages"), 1));
SELECT setval(pg_get_serial_sequence('homepage_sections', 'id'), COALESCE((SELECT MAX(id) FROM "homepage_sections"), 1));
SELECT setval(pg_get_serial_sequence('services', 'id'), COALESCE((SELECT MAX(id) FROM "services"), 1));
SELECT setval(pg_get_serial_sequence('portfolio', 'id'), COALESCE((SELECT MAX(id) FROM "portfolio"), 1));
SELECT setval(pg_get_serial_sequence('team_members', 'id'), COALESCE((SELECT MAX(id) FROM "team_members"), 1));
SELECT setval(pg_get_serial_sequence('culture_stories', 'id'), COALESCE((SELECT MAX(id) FROM "culture_stories"), 1));
SELECT setval(pg_get_serial_sequence('jobs', 'id'), COALESCE((SELECT MAX(id) FROM "jobs"), 1));
SELECT setval(pg_get_serial_sequence('job_applications', 'id'), COALESCE((SELECT MAX(id) FROM "job_applications"), 1));
SELECT setval(pg_get_serial_sequence('enquiries', 'id'), COALESCE((SELECT MAX(id) FROM "enquiries"), 1));
SELECT setval(pg_get_serial_sequence('testimonials', 'id'), COALESCE((SELECT MAX(id) FROM "testimonials"), 1));
SELECT setval(pg_get_serial_sequence('faqs', 'id'), COALESCE((SELECT MAX(id) FROM "faqs"), 1));
SELECT setval(pg_get_serial_sequence('media', 'id'), COALESCE((SELECT MAX(id) FROM "media"), 1));
SELECT setval(pg_get_serial_sequence('navigation_items', 'id'), COALESCE((SELECT MAX(id) FROM "navigation_items"), 1));
SELECT setval(pg_get_serial_sequence('activity_logs', 'id'), COALESCE((SELECT MAX(id) FROM "activity_logs"), 1));
SELECT setval(pg_get_serial_sequence('page_revisions', 'id'), COALESCE((SELECT MAX(id) FROM "page_revisions"), 1));

-- =============================================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "settings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "pages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "homepage_sections" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "portfolio" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "founder_profile" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "team_members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "culture_stories" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "jobs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "job_applications" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "enquiries" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "testimonials" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "faqs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "media" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "navigation_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "activity_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "page_revisions" ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read pages" ON "pages";
CREATE POLICY "Public Read pages" ON "pages" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read homepage_sections" ON "homepage_sections";
CREATE POLICY "Public Read homepage_sections" ON "homepage_sections" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read services" ON "services";
CREATE POLICY "Public Read services" ON "services" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read portfolio" ON "portfolio";
CREATE POLICY "Public Read portfolio" ON "portfolio" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read founder_profile" ON "founder_profile";
CREATE POLICY "Public Read founder_profile" ON "founder_profile" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read team_members" ON "team_members";
CREATE POLICY "Public Read team_members" ON "team_members" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read culture_stories" ON "culture_stories";
CREATE POLICY "Public Read culture_stories" ON "culture_stories" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read jobs" ON "jobs";
CREATE POLICY "Public Read jobs" ON "jobs" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read testimonials" ON "testimonials";
CREATE POLICY "Public Read testimonials" ON "testimonials" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read faqs" ON "faqs";
CREATE POLICY "Public Read faqs" ON "faqs" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read navigation_items" ON "navigation_items";
CREATE POLICY "Public Read navigation_items" ON "navigation_items" FOR SELECT USING (true);
DROP POLICY IF EXISTS "Public Read settings" ON "settings";
CREATE POLICY "Public Read settings" ON "settings" FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Submit enquiries" ON "enquiries";
CREATE POLICY "Public Submit enquiries" ON "enquiries" FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public Submit job_applications" ON "job_applications";
CREATE POLICY "Public Submit job_applications" ON "job_applications" FOR INSERT WITH CHECK (true);

-- Note: Users, activity_logs, and administrative edits are accessible via the service_role key or authenticated admins.