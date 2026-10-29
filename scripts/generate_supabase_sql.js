const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

function escapeSqlValue(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'number') return val.toString();
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE';
  const str = String(val);
  return "'" + str.replace(/'/g, "''") + "'";
}

async function generate() {
  const SQL = await initSqlJs();
  const dbPath = path.join(__dirname, '..', 'data', 'dygytaly.db');
  const dbFile = fs.readFileSync(dbPath);
  const db = new SQL.Database(dbFile);

  const tablesOrder = [
    'users',
    'settings',
    'pages',
    'homepage_sections',
    'services',
    'portfolio',
    'founder_profile',
    'team_members',
    'culture_stories',
    'jobs',
    'job_applications',
    'enquiries',
    'testimonials',
    'faqs',
    'media',
    'navigation_items',
    'activity_logs',
    'page_revisions'
  ];

  let out = [];
  out.push('-- =============================================================================');
  out.push('-- DYGYTALY SUPABASE MIGRATION SCRIPT');
  out.push('-- Compatible with PostgreSQL & Supabase SQL Editor');
  out.push('-- Generated: ' + new Date().toISOString());
  out.push('-- =============================================================================\n');

  out.push('-- 1. Enable UUID Extension');
  out.push('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n');

  const schemas = {
    users: `CREATE TABLE IF NOT EXISTS users (
  id BIGSERIAL PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`,
    settings: `CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);`,
    pages: `CREATE TABLE IF NOT EXISTS pages (
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
);`,
    homepage_sections: `CREATE TABLE IF NOT EXISTS homepage_sections (
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
);`,
    services: `CREATE TABLE IF NOT EXISTS services (
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
);`,
    portfolio: `CREATE TABLE IF NOT EXISTS portfolio (
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
);`,
    founder_profile: `CREATE TABLE IF NOT EXISTS founder_profile (
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
);`,
    team_members: `CREATE TABLE IF NOT EXISTS team_members (
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
);`,
    culture_stories: `CREATE TABLE IF NOT EXISTS culture_stories (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT DEFAULT 'Culture',
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_visible INTEGER DEFAULT 1
);`,
    jobs: `CREATE TABLE IF NOT EXISTS jobs (
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
);`,
    job_applications: `CREATE TABLE IF NOT EXISTS job_applications (
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
);`,
    enquiries: `CREATE TABLE IF NOT EXISTS enquiries (
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
);`,
    testimonials: `CREATE TABLE IF NOT EXISTS testimonials (
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
);`,
    faqs: `CREATE TABLE IF NOT EXISTS faqs (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  display_order INTEGER DEFAULT 0,
  is_published INTEGER DEFAULT 1
);`,
    media: `CREATE TABLE IF NOT EXISTS media (
  id BIGSERIAL PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  alt_text TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`,
    navigation_items: `CREATE TABLE IF NOT EXISTS navigation_items (
  id BIGSERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  url TEXT NOT NULL,
  parent_id BIGINT,
  display_order INTEGER DEFAULT 0,
  is_active INTEGER DEFAULT 1
);`,
    activity_logs: `CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT,
  username TEXT,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`,
    page_revisions: `CREATE TABLE IF NOT EXISTS page_revisions (
  id BIGSERIAL PRIMARY KEY,
  page_id BIGINT,
  slug TEXT,
  title TEXT,
  content_snapshot TEXT,
  saved_by TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`
  };

  out.push('-- =============================================================================');
  out.push('-- 2. TABLE CREATION DDL');
  out.push('-- =============================================================================\n');

  for (const t of tablesOrder) {
    if (schemas[t]) {
      out.push(schemas[t] + '\n');
    }
  }

  out.push('-- =============================================================================');
  out.push('-- 3. DATA INSERTIONS');
  out.push('-- =============================================================================\n');

  for (const t of tablesOrder) {
    const dataRes = db.exec(`SELECT * FROM "${t}"`);
    if (!dataRes.length || !dataRes[0].values.length) continue;

    const cols = dataRes[0].columns;
    const colList = cols.map(c => `"${c}"`).join(', ');
    out.push(`-- Data for ${t} (${dataRes[0].values.length} rows)`);

    for (const row of dataRes[0].values) {
      const valList = row.map(escapeSqlValue).join(', ');
      if (t === 'settings') {
        out.push(`INSERT INTO settings (${colList}) VALUES (${valList}) ON CONFLICT ("key") DO UPDATE SET "value" = EXCLUDED."value";`);
      } else if (t === 'founder_profile') {
        out.push(`INSERT INTO founder_profile (${colList}) VALUES (${valList}) ON CONFLICT ("id") DO NOTHING;`);
      } else {
        out.push(`INSERT INTO "${t}" (${colList}) VALUES (${valList}) ON CONFLICT DO NOTHING;`);
      }
    }
    out.push('');
  }

  out.push('-- =============================================================================');
  out.push('-- 4. SYNC SERIAL SEQUENCES');
  out.push('-- =============================================================================\n');

  for (const t of tablesOrder) {
    if (t === 'settings' || t === 'founder_profile') continue;
    out.push(`SELECT setval(pg_get_serial_sequence('${t}', 'id'), COALESCE((SELECT MAX(id) FROM "${t}"), 1));`);
  }
  out.push('');

  out.push('-- =============================================================================');
  out.push('-- 5. ROW LEVEL SECURITY (RLS) POLICIES');
  out.push('-- =============================================================================\n');

  const publicTables = [
    'pages',
    'homepage_sections',
    'services',
    'portfolio',
    'founder_profile',
    'team_members',
    'culture_stories',
    'jobs',
    'testimonials',
    'faqs',
    'navigation_items',
    'settings'
  ];

  for (const t of tablesOrder) {
    out.push(`ALTER TABLE "${t}" ENABLE ROW LEVEL SECURITY;`);
  }
  out.push('');

  for (const t of publicTables) {
    out.push(`DROP POLICY IF EXISTS "Public Read ${t}" ON "${t}";`);
    out.push(`CREATE POLICY "Public Read ${t}" ON "${t}" FOR SELECT USING (true);`);
  }
  out.push('');

  out.push(`DROP POLICY IF EXISTS "Public Submit enquiries" ON "enquiries";`);
  out.push(`CREATE POLICY "Public Submit enquiries" ON "enquiries" FOR INSERT WITH CHECK (true);`);

  out.push(`DROP POLICY IF EXISTS "Public Submit job_applications" ON "job_applications";`);
  out.push(`CREATE POLICY "Public Submit job_applications" ON "job_applications" FOR INSERT WITH CHECK (true);`);
  out.push('');

  out.push('-- Note: Users, activity_logs, and administrative edits are accessible via the service_role key or authenticated admins.');

  const finalSql = out.join('\n');
  const targetPath = path.join(__dirname, '..', 'supabase_schema.sql');
  fs.writeFileSync(targetPath, finalSql, 'utf8');
  console.log('Successfully wrote', finalSql.length, 'bytes to', targetPath);
}

generate().catch(console.error);

