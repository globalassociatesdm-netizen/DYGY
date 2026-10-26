import initSqlJs, { Database, SqlJsStatic } from 'sql.js';
import path from 'path';
import fs from 'fs';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export const dbPath = path.join(dataDir, 'dygytaly.db');

let SQL: SqlJsStatic;
let dbInstance: Database;

export async function getDb(): Promise<Database> {
  if (dbInstance) return dbInstance;

  SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const filebuffer = fs.readFileSync(dbPath);
    dbInstance = new SQL.Database(filebuffer);
  } else {
    dbInstance = new SQL.Database();
  }

  return dbInstance;
}

export function saveDatabase(): void {
  if (!dbInstance) return;
  const data = dbInstance.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
}

// Helper query functions
export async function dbAll<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await getDb();
  const stmt = db.prepare(sql);
  if (params.length > 0) {
    stmt.bind(params);
  }
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export async function dbGet<T = any>(sql: string, params: any[] = []): Promise<T | null> {
  const all = await dbAll<T>(sql, params);
  return all.length > 0 ? all[0] : null;
}

export async function dbRun(sql: string, params: any[] = []): Promise<{ lastInsertRowid: number; changes: number }> {
  const db = await getDb();
  db.run(sql, params);
  saveDatabase();

  const idRes = db.exec('SELECT last_insert_rowid() as id, changes() as changes');
  let lastInsertRowid = 0;
  let changes = 0;
  if (idRes.length > 0 && idRes[0].values.length > 0) {
    lastInsertRowid = Number(idRes[0].values[0][0]) || 0;
    changes = Number(idRes[0].values[0][1]) || 0;
  }
  return { lastInsertRowid, changes };
}

export async function dbExec(sql: string): Promise<void> {
  const db = await getDb();
  db.exec(sql);
  saveDatabase();
}

export async function initDatabase(): Promise<void> {
  const db = await getDb();

  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'admin',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS pages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS homepage_sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      section_key TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      subtitle TEXT,
      eyebrow TEXT,
      content TEXT,
      display_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1,
      bg_variant TEXT DEFAULT 'default',
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS portfolio (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS founder_profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      bio TEXT NOT NULL,
      full_bio TEXT NOT NULL,
      quote TEXT,
      portrait_url TEXT,
      story_points TEXT,
      milestones TEXT,
      social_links TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      bio TEXT,
      expertise TEXT,
      image_url TEXT,
      linkedin_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS culture_stories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      category TEXT DEFAULT 'Culture',
      image_url TEXT,
      display_order INTEGER DEFAULT 0,
      is_visible INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS job_applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER,
      job_title TEXT,
      full_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      experience TEXT,
      portfolio_link TEXT,
      notes TEXT,
      resume_url TEXT,
      status TEXT DEFAULT 'New',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS testimonials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
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
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS faqs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      question TEXT NOT NULL,
      answer TEXT NOT NULL,
      category TEXT DEFAULT 'general',
      display_order INTEGER DEFAULT 0,
      is_published INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS media (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL,
      original_name TEXT NOT NULL,
      file_path TEXT NOT NULL,
      file_type TEXT NOT NULL,
      file_size INTEGER NOT NULL,
      alt_text TEXT,
      uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS navigation_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      label TEXT NOT NULL,
      url TEXT NOT NULL,
      parent_id INTEGER,
      display_order INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1
    );

    CREATE TABLE IF NOT EXISTS activity_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      username TEXT,
      action TEXT NOT NULL,
      entity TEXT NOT NULL,
      details TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS page_revisions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      page_id INTEGER,
      slug TEXT,
      title TEXT,
      content_snapshot TEXT,
      saved_by TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  saveDatabase();
}
