import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import multer from 'multer';
import { initDatabase, dbAll, dbGet, dbRun, dbExec, dbPath, getDb } from './db';

const JWT_SECRET = process.env.JWT_SECRET || 'dygytaly_super_secure_jwt_token_key_2026';
const PORT = process.env.PORT || 5050;

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
const uploadsDir = path.resolve(process.cwd(), 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer storage for media and resumes
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e6);
    cb(null, `${basename}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25 MB
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif|svg|pdf|doc|docx|mp4|webm/;
    const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
    if (allowed.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Allowed: Images, Documents, Videos.'));
    }
  }
});

// Authentication middleware
interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

function authenticateToken(req: AuthRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  if (!token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    res.status(401).json({ error: 'Access denied. Please log in.' });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: any) => {
    if (err || !decoded) {
      res.status(403).json({ error: 'Session expired or invalid token.' });
      return;
    }
    req.user = decoded;
    next();
  });
}

function requireRole(allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions.' });
      return;
    }
    next();
  };
}

async function logActivity(username: string, action: string, entity: string, details: string) {
  try {
    await dbRun(`
      INSERT INTO activity_logs (username, action, entity, details)
      VALUES (?, ?, ?, ?)
    `, [username, action, entity, details]);
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

/* ==========================================================================
   PUBLIC API ROUTES
   ========================================================================== */

// 1. Settings
app.get('/api/settings', async (_req, res) => {
  try {
    const rows = await dbAll('SELECT key, value FROM settings');
    const settingsObj: Record<string, string> = {};
    rows.forEach(r => { settingsObj[r.key] = r.value; });
    res.json(settingsObj);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Navigation items
app.get('/api/navigation', async (_req, res) => {
  try {
    const items = await dbAll('SELECT * FROM navigation_items WHERE is_active = 1 ORDER BY display_order ASC');
    res.json(items);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Homepage sections
app.get('/api/sections', async (_req, res) => {
  try {
    const sections = await dbAll('SELECT * FROM homepage_sections WHERE is_visible = 1 ORDER BY display_order ASC');
    const parsed = sections.map(s => {
      let content = s.content;
      try { content = JSON.parse(s.content); } catch (e) { /* keep string */ }
      return { ...s, content };
    });
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Pages
app.get('/api/pages/:slug', async (req, res) => {
  try {
    const page = await dbGet('SELECT * FROM pages WHERE slug = ? AND is_published = 1', [req.params.slug]);
    if (!page) {
      res.status(404).json({ error: 'Page not found' });
      return;
    }
    res.json(page);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Services
app.get('/api/services', async (_req, res) => {
  try {
    const services = await dbAll('SELECT * FROM services WHERE is_published = 1 ORDER BY display_order ASC');
    const parsed = services.map(s => ({
      ...s,
      deliverables: s.deliverables ? JSON.parse(s.deliverables) : [],
      process_steps: s.process_steps ? JSON.parse(s.process_steps) : [],
      technologies: s.technologies ? JSON.parse(s.technologies) : [],
      faqs: s.faqs ? JSON.parse(s.faqs) : []
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/services/:slug', async (req, res) => {
  try {
    const s = await dbGet('SELECT * FROM services WHERE slug = ? AND is_published = 1', [req.params.slug]);
    if (!s) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    res.json({
      ...s,
      deliverables: s.deliverables ? JSON.parse(s.deliverables) : [],
      process_steps: s.process_steps ? JSON.parse(s.process_steps) : [],
      technologies: s.technologies ? JSON.parse(s.technologies) : [],
      faqs: s.faqs ? JSON.parse(s.faqs) : []
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Portfolio
app.get('/api/portfolio', async (_req, res) => {
  try {
    const projects = await dbAll('SELECT * FROM portfolio WHERE is_published = 1 ORDER BY display_order ASC');
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/portfolio/:id', async (req, res) => {
  try {
    const project = await dbGet('SELECT * FROM portfolio WHERE id = ? AND is_published = 1', [req.params.id]);
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }
    res.json(project);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Founder profile
app.get('/api/founder', async (_req, res) => {
  try {
    const founder = await dbGet('SELECT * FROM founder_profile WHERE id = 1');
    if (!founder) {
      res.status(404).json({ error: 'Founder profile not found' });
      return;
    }
    res.json({
      ...founder,
      story_points: founder.story_points ? JSON.parse(founder.story_points) : [],
      milestones: founder.milestones ? JSON.parse(founder.milestones) : [],
      social_links: founder.social_links ? JSON.parse(founder.social_links) : {}
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Team members
app.get('/api/team', async (_req, res) => {
  try {
    const team = await dbAll('SELECT * FROM team_members WHERE is_visible = 1 ORDER BY display_order ASC');
    res.json(team);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Culture stories
app.get('/api/culture', async (_req, res) => {
  try {
    const culture = await dbAll('SELECT * FROM culture_stories WHERE is_visible = 1 ORDER BY display_order ASC');
    res.json(culture);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Careers & Jobs
app.get('/api/jobs', async (_req, res) => {
  try {
    const jobs = await dbAll('SELECT * FROM jobs WHERE is_open = 1 ORDER BY display_order ASC');
    const parsed = jobs.map(j => ({
      ...j,
      responsibilities: j.responsibilities ? JSON.parse(j.responsibilities) : [],
      requirements: j.requirements ? JSON.parse(j.requirements) : []
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/jobs/:slug', async (req, res) => {
  try {
    const job = await dbGet('SELECT * FROM jobs WHERE slug = ? AND is_open = 1', [req.params.slug]);
    if (!job) {
      res.status(404).json({ error: 'Job opening not found' });
      return;
    }
    res.json({
      ...job,
      responsibilities: job.responsibilities ? JSON.parse(job.responsibilities) : [],
      requirements: job.requirements ? JSON.parse(job.requirements) : []
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Testimonials & Google reviews
app.get('/api/testimonials', async (_req, res) => {
  try {
    const reviews = await dbAll('SELECT * FROM testimonials WHERE is_published = 1 ORDER BY display_order ASC');
    res.json(reviews);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 12. FAQs
app.get('/api/faqs', async (_req, res) => {
  try {
    const faqs = await dbAll('SELECT * FROM faqs WHERE is_published = 1 ORDER BY display_order ASC');
    res.json(faqs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 13. Submit Coffee Catch-up Enquiry Form
app.post('/api/enquiries', async (req, res) => {
  try {
    const {
      full_name,
      business_name,
      email,
      phone,
      service_of_interest,
      project_description,
      preferred_contact,
      budget_range
    } = req.body;

    if (!full_name || !email || !phone || !service_of_interest || !project_description) {
      res.status(400).json({ error: 'Please provide all required fields (Name, Email, Phone, Service, Description).' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    const result = await dbRun(`
      INSERT INTO enquiries (full_name, business_name, email, phone, service_of_interest, project_description, preferred_contact, budget_range)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      full_name.trim(),
      business_name ? business_name.trim() : '',
      email.trim(),
      phone.trim(),
      service_of_interest,
      project_description.trim(),
      preferred_contact || 'phone',
      budget_range || 'Flexible'
    ]);

    await logActivity('Visitor', 'Enquiry Submitted', 'Enquiry', `New enquiry from ${full_name} (${email}) for ${service_of_interest}`);

    res.status(201).json({
      success: true,
      message: 'Thank you! Your enquiry has been received. Our team will connect with you over coffee shortly.',
      id: result.lastInsertRowid
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 14. Submit Career Application
app.post('/api/careers/apply', upload.single('resume'), async (req, res) => {
  try {
    const {
      job_id,
      job_title,
      full_name,
      email,
      phone,
      experience,
      portfolio_link,
      notes
    } = req.body;

    if (!full_name || !email || !phone) {
      res.status(400).json({ error: 'Please fill in all mandatory application fields.' });
      return;
    }

    let resume_url = '';
    if (req.file) {
      resume_url = `/uploads/${req.file.filename}`;
    }

    const result = await dbRun(`
      INSERT INTO job_applications (job_id, job_title, full_name, email, phone, experience, portfolio_link, notes, resume_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      job_id ? Number(job_id) : null,
      job_title || 'General Application',
      full_name.trim(),
      email.trim(),
      phone.trim(),
      experience || '',
      portfolio_link || '',
      notes || '',
      resume_url
    ]);

    await logActivity('Candidate', 'Job Application', 'Career', `Application from ${full_name} for ${job_title || 'General'}`);

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! Our talent team will review your profile.',
      id: result.lastInsertRowid
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 15. Dynamic Sitemap XML
app.get('/sitemap.xml', async (_req, res) => {
  try {
    const services = await dbAll('SELECT slug, updated_at FROM services WHERE is_published = 1');
    const pages = await dbAll('SELECT slug, updated_at FROM pages WHERE is_published = 1');
    const jobs = await dbAll('SELECT slug, created_at FROM jobs WHERE is_open = 1');

    const baseUrl = 'https://dygytaly.in';
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    // Static / Core routes
    const staticRoutes = [
      '',
      '/about',
      '/services',
      '/portfolio',
      '/profile/founder',
      '/profile/team',
      '/profile/culture',
      '/careers',
      '/contact',
      '/privacy',
      '/terms'
    ];

    staticRoutes.forEach(r => {
      xml += `  <url>\n    <loc>${baseUrl}${r}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>${r === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
    });

    // Services
    services.forEach(s => {
      xml += `  <url>\n    <loc>${baseUrl}/services/${s.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
    });

    // Jobs
    jobs.forEach(j => {
      xml += `  <url>\n    <loc>${baseUrl}/careers/${j.slug}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
    });

    xml += `</urlset>`;
    res.header('Content-Type', 'application/xml');
    res.send(xml);
  } catch (err: any) {
    res.status(500).send('Error generating sitemap');
  }
});

// 16. Robots.txt
app.get('/robots.txt', (_req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nDisallow: /admin/\nDisallow: /api/\nAllow: /\n\nSitemap: https://dygytaly.in/sitemap.xml\n`);
});

/* ==========================================================================
   AUTHENTICATION & ADMIN API ROUTES
   ========================================================================== */

// Admin Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      res.status(400).json({ error: 'Username/Email and Password are required.' });
      return;
    }

    const user = await dbGet(`
      SELECT * FROM users WHERE email = ? OR username = ?
    `, [identifier, identifier]);

    if (!user) {
      res.status(401).json({ error: 'Invalid credentials. Please verify your email/username.' });
      return;
    }

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid) {
      res.status(401).json({ error: 'Invalid password. Please check and try again.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    await logActivity(user.username, 'Admin Login', 'Security', `Successful login from ${req.ip || 'local'}`);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Get Current Logged-in Admin Info
app.get('/api/auth/me', authenticateToken, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Admin Dashboard Metrics
app.get('/api/admin/stats', authenticateToken, async (_req, res) => {
  try {
    const enquiriesTotal = await dbGet('SELECT COUNT(*) as count FROM enquiries');
    const enquiriesNew = await dbGet('SELECT COUNT(*) as count FROM enquiries WHERE status = "New"');
    const appsTotal = await dbGet('SELECT COUNT(*) as count FROM job_applications');
    const appsNew = await dbGet('SELECT COUNT(*) as count FROM job_applications WHERE status = "New"');
    const servicesCount = await dbGet('SELECT COUNT(*) as count FROM services');
    const portfolioCount = await dbGet('SELECT COUNT(*) as count FROM portfolio');
    const reviewsCount = await dbGet('SELECT COUNT(*) as count FROM testimonials');
    const jobsCount = await dbGet('SELECT COUNT(*) as count FROM jobs WHERE is_open = 1');

    res.json({
      enquiries: { total: enquiriesTotal?.count || 0, new: enquiriesNew?.count || 0 },
      applications: { total: appsTotal?.count || 0, new: appsNew?.count || 0 },
      services: servicesCount?.count || 0,
      portfolio: portfolioCount?.count || 0,
      reviews: reviewsCount?.count || 0,
      jobs: jobsCount?.count || 0
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Activity logs
app.get('/api/admin/activity', authenticateToken, async (_req, res) => {
  try {
    const logs = await dbAll('SELECT * FROM activity_logs ORDER BY created_at DESC LIMIT 50');
    res.json(logs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Homepage Builder Sections
app.get('/api/admin/sections', authenticateToken, async (_req, res) => {
  try {
    const sections = await dbAll('SELECT * FROM homepage_sections ORDER BY display_order ASC');
    const parsed = sections.map(s => {
      let content = s.content;
      try { content = JSON.parse(s.content); } catch (e) { /* keep string */ }
      return { ...s, content };
    });
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/sections/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, subtitle, eyebrow, content, is_visible, bg_variant } = req.body;
    const contentStr = typeof content === 'object' ? JSON.stringify(content) : content;

    await dbRun(`
      UPDATE homepage_sections SET
        title = ?, subtitle = ?, eyebrow = ?, content = ?, is_visible = ?, bg_variant = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, subtitle, eyebrow, contentStr, is_visible !== undefined ? is_visible : 1, bg_variant || 'default', req.params.id]);

    await logActivity(req.user?.username || 'admin', 'Section Updated', 'Homepage Builder', `Updated section #${req.params.id}`);

    res.json({ success: true, message: 'Section updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/sections/reorder', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { order } = req.body; // array of { id: number, display_order: number }
    if (Array.isArray(order)) {
      for (const item of order) {
        await dbRun('UPDATE homepage_sections SET display_order = ? WHERE id = ?', [item.display_order, item.id]);
      }
    }
    await logActivity(req.user?.username || 'admin', 'Sections Reordered', 'Homepage Builder', 'Reordered homepage sections');
    res.json({ success: true, message: 'Sections reordered successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Pages Management
app.get('/api/admin/pages', authenticateToken, async (_req, res) => {
  try {
    const pages = await dbAll('SELECT * FROM pages ORDER BY title ASC');
    res.json(pages);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/pages/:slug', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, eyebrow, heading, subheading, content, hero_image, cta_text, cta_link, seo_title, meta_description, is_published } = req.body;
    const slug = req.params.slug;

    // Save previous version in revisions
    const oldPage = await dbGet('SELECT * FROM pages WHERE slug = ?', [slug]);
    if (oldPage) {
      await dbRun(`
        INSERT INTO page_revisions (page_id, slug, title, content_snapshot, saved_by)
        VALUES (?, ?, ?, ?, ?)
      `, [oldPage.id, slug, oldPage.title, JSON.stringify(oldPage), req.user?.username || 'admin']);
    }

    await dbRun(`
      UPDATE pages SET
        title = ?, eyebrow = ?, heading = ?, subheading = ?, content = ?, hero_image = ?,
        cta_text = ?, cta_link = ?, seo_title = ?, meta_description = ?, is_published = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `, [title, eyebrow, heading, subheading, content, hero_image, cta_text, cta_link, seo_title, meta_description, is_published !== undefined ? is_published : 1, slug]);

    await logActivity(req.user?.username || 'admin', 'Page Updated', 'Pages', `Updated page: ${slug}`);

    res.json({ success: true, message: 'Page updated and revision saved.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Page Revisions
app.get('/api/admin/pages/:slug/revisions', authenticateToken, async (req, res) => {
  try {
    const revisions = await dbAll('SELECT * FROM page_revisions WHERE slug = ? ORDER BY created_at DESC LIMIT 20', [req.params.slug]);
    res.json(revisions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/pages/:slug/restore/:revId', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const rev = await dbGet('SELECT * FROM page_revisions WHERE id = ?', [req.params.revId]);
    if (!rev) {
      res.status(404).json({ error: 'Revision not found' });
      return;
    }
    const snapshot = JSON.parse(rev.content_snapshot);
    await dbRun(`
      UPDATE pages SET
        title = ?, eyebrow = ?, heading = ?, subheading = ?, content = ?, hero_image = ?,
        cta_text = ?, cta_link = ?, seo_title = ?, meta_description = ?, is_published = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE slug = ?
    `, [snapshot.title, snapshot.eyebrow, snapshot.heading, snapshot.subheading, snapshot.content, snapshot.hero_image, snapshot.cta_text, snapshot.cta_link, snapshot.seo_title, snapshot.meta_description, snapshot.is_published, req.params.slug]);

    await logActivity(req.user?.username || 'admin', 'Revision Restored', 'Pages', `Restored revision #${req.params.revId} for page ${req.params.slug}`);

    res.json({ success: true, message: 'Page restored to selected revision.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Services Management
app.get('/api/admin/services', authenticateToken, async (_req, res) => {
  try {
    const services = await dbAll('SELECT * FROM services ORDER BY display_order ASC');
    const parsed = services.map(s => ({
      ...s,
      deliverables: s.deliverables ? JSON.parse(s.deliverables) : [],
      process_steps: s.process_steps ? JSON.parse(s.process_steps) : [],
      technologies: s.technologies ? JSON.parse(s.technologies) : [],
      faqs: s.faqs ? JSON.parse(s.faqs) : []
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/services', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { slug, title, tagline, short_desc, hero_headline, problem_solved, approach, deliverables, process_steps, technologies, faqs, icon_name, image_url, cta_text, display_order, is_published, seo_title, meta_description } = req.body;

    const result = await dbRun(`
      INSERT INTO services (slug, title, tagline, short_desc, hero_headline, problem_solved, approach, deliverables, process_steps, technologies, faqs, icon_name, image_url, cta_text, display_order, is_published, seo_title, meta_description)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      slug, title, tagline, short_desc, hero_headline, problem_solved, approach,
      JSON.stringify(deliverables || []), JSON.stringify(process_steps || []),
      JSON.stringify(technologies || []), JSON.stringify(faqs || []),
      icon_name || 'Globe', image_url || '/uploads/dygytaly-logo.png', cta_text || 'Let\'s Catch Up ☕',
      display_order || 0, is_published !== undefined ? is_published : 1,
      seo_title || `${title} | Dygytaly Coimbatore`, meta_description || short_desc
    ]);

    await logActivity(req.user?.username || 'admin', 'Service Created', 'Services', `Created service: ${title}`);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/services/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { slug, title, tagline, short_desc, hero_headline, problem_solved, approach, deliverables, process_steps, technologies, faqs, icon_name, image_url, cta_text, display_order, is_published, seo_title, meta_description } = req.body;

    await dbRun(`
      UPDATE services SET
        slug = ?, title = ?, tagline = ?, short_desc = ?, hero_headline = ?, problem_solved = ?,
        approach = ?, deliverables = ?, process_steps = ?, technologies = ?, faqs = ?,
        icon_name = ?, image_url = ?, cta_text = ?, display_order = ?, is_published = ?,
        seo_title = ?, meta_description = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      slug, title, tagline, short_desc, hero_headline, problem_solved, approach,
      JSON.stringify(deliverables || []), JSON.stringify(process_steps || []),
      JSON.stringify(technologies || []), JSON.stringify(faqs || []),
      icon_name, image_url, cta_text, display_order, is_published,
      seo_title, meta_description, req.params.id
    ]);

    await logActivity(req.user?.username || 'admin', 'Service Updated', 'Services', `Updated service #${req.params.id}`);
    res.json({ success: true, message: 'Service updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/services/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM services WHERE id = ?', [req.params.id]);
    await logActivity(req.user?.username || 'admin', 'Service Deleted', 'Services', `Deleted service #${req.params.id}`);
    res.json({ success: true, message: 'Service deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Portfolio Management
app.get('/api/admin/portfolio', authenticateToken, async (_req, res) => {
  try {
    const projects = await dbAll('SELECT * FROM portfolio ORDER BY display_order ASC');
    res.json(projects);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/portfolio', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, client_name, industry, category, challenge, strategy, execution, results, image_url, project_url, is_featured, is_published, display_order } = req.body;

    const result = await dbRun(`
      INSERT INTO portfolio (title, client_name, industry, category, challenge, strategy, execution, results, image_url, project_url, is_featured, is_published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [title, client_name, industry, category, challenge, strategy, execution, results, image_url || '/uploads/dygytaly-logo.png', project_url, is_featured || 0, is_published !== undefined ? is_published : 1, display_order || 0]);

    await logActivity(req.user?.username || 'admin', 'Portfolio Created', 'Portfolio', `Created project: ${title}`);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/portfolio/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, client_name, industry, category, challenge, strategy, execution, results, image_url, project_url, is_featured, is_published, display_order } = req.body;

    await dbRun(`
      UPDATE portfolio SET
        title = ?, client_name = ?, industry = ?, category = ?, challenge = ?,
        strategy = ?, execution = ?, results = ?, image_url = ?, project_url = ?,
        is_featured = ?, is_published = ?, display_order = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [title, client_name, industry, category, challenge, strategy, execution, results, image_url, project_url, is_featured, is_published, display_order, req.params.id]);

    await logActivity(req.user?.username || 'admin', 'Portfolio Updated', 'Portfolio', `Updated project #${req.params.id}`);
    res.json({ success: true, message: 'Project updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/portfolio/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM portfolio WHERE id = ?', [req.params.id]);
    await logActivity(req.user?.username || 'admin', 'Portfolio Deleted', 'Portfolio', `Deleted project #${req.params.id}`);
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Founder Profile
app.put('/api/admin/founder', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, designation, bio, full_bio, quote, portrait_url, story_points, milestones, social_links } = req.body;

    await dbRun(`
      UPDATE founder_profile SET
        name = ?, designation = ?, bio = ?, full_bio = ?, quote = ?, portrait_url = ?,
        story_points = ?, milestones = ?, social_links = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = 1
    `, [
      name, designation, bio, full_bio, quote, portrait_url,
      JSON.stringify(story_points || []), JSON.stringify(milestones || []), JSON.stringify(social_links || {})
    ]);

    await logActivity(req.user?.username || 'admin', 'Founder Updated', 'Founder Profile', 'Updated founder profile and story points');
    res.json({ success: true, message: 'Founder profile saved successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Team Members
app.get('/api/admin/team', authenticateToken, async (_req, res) => {
  try {
    const team = await dbAll('SELECT * FROM team_members ORDER BY display_order ASC');
    res.json(team);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/team', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, designation, bio, expertise, image_url, linkedin_url, display_order, is_visible } = req.body;
    const result = await dbRun(`
      INSERT INTO team_members (name, designation, bio, expertise, image_url, linkedin_url, display_order, is_visible)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [name, designation, bio, expertise, image_url || '/uploads/dygytaly-logo.png', linkedin_url, display_order || 0, is_visible !== undefined ? is_visible : 1]);

    await logActivity(req.user?.username || 'admin', 'Team Member Added', 'Team', `Added member: ${name}`);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/team/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { name, designation, bio, expertise, image_url, linkedin_url, display_order, is_visible } = req.body;
    await dbRun(`
      UPDATE team_members SET
        name = ?, designation = ?, bio = ?, expertise = ?, image_url = ?, linkedin_url = ?,
        display_order = ?, is_visible = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [name, designation, bio, expertise, image_url, linkedin_url, display_order, is_visible, req.params.id]);

    await logActivity(req.user?.username || 'admin', 'Team Member Updated', 'Team', `Updated member #${req.params.id}`);
    res.json({ success: true, message: 'Team member updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/team/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM team_members WHERE id = ?', [req.params.id]);
    await logActivity(req.user?.username || 'admin', 'Team Member Deleted', 'Team', `Deleted member #${req.params.id}`);
    res.json({ success: true, message: 'Team member deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Culture Stories
app.get('/api/admin/culture', authenticateToken, async (_req, res) => {
  try {
    const culture = await dbAll('SELECT * FROM culture_stories ORDER BY display_order ASC');
    res.json(culture);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/culture', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { title, description, category, image_url, display_order, is_visible } = req.body;
    const result = await dbRun(`
      INSERT INTO culture_stories (title, description, category, image_url, display_order, is_visible)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [title, description, category || 'Culture', image_url || '/uploads/dygytaly-logo.png', display_order || 0, is_visible !== undefined ? is_visible : 1]);

    await logActivity(req.user?.username || 'admin', 'Culture Story Added', 'Culture', `Added culture story: ${title}`);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/culture/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM culture_stories WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Culture story deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Job Openings
app.get('/api/admin/jobs', authenticateToken, async (_req, res) => {
  try {
    const jobs = await dbAll('SELECT * FROM jobs ORDER BY display_order ASC');
    const parsed = jobs.map(j => ({
      ...j,
      responsibilities: j.responsibilities ? JSON.parse(j.responsibilities) : [],
      requirements: j.requirements ? JSON.parse(j.requirements) : []
    }));
    res.json(parsed);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/jobs', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { slug, title, department, location, type, description, responsibilities, requirements, is_open, display_order } = req.body;
    const result = await dbRun(`
      INSERT INTO jobs (slug, title, department, location, type, description, responsibilities, requirements, is_open, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [slug, title, department, location, type, description, JSON.stringify(responsibilities || []), JSON.stringify(requirements || []), is_open !== undefined ? is_open : 1, display_order || 0]);

    await logActivity(req.user?.username || 'admin', 'Job Created', 'Careers', `Created role: ${title}`);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/jobs/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { slug, title, department, location, type, description, responsibilities, requirements, is_open, display_order } = req.body;
    await dbRun(`
      UPDATE jobs SET
        slug = ?, title = ?, department = ?, location = ?, type = ?, description = ?,
        responsibilities = ?, requirements = ?, is_open = ?, display_order = ?
      WHERE id = ?
    `, [slug, title, department, location, type, description, JSON.stringify(responsibilities || []), JSON.stringify(requirements || []), is_open, display_order, req.params.id]);

    await logActivity(req.user?.username || 'admin', 'Job Updated', 'Careers', `Updated role #${req.params.id}`);
    res.json({ success: true, message: 'Job updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/jobs/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Job deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Job Applications
app.get('/api/admin/applications', authenticateToken, async (_req, res) => {
  try {
    const applications = await dbAll('SELECT * FROM job_applications ORDER BY created_at DESC');
    res.json(applications);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/applications/:id/status', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, notes } = req.body;
    await dbRun(`
      UPDATE job_applications SET status = ?, notes = ? WHERE id = ?
    `, [status, notes || '', req.params.id]);
    await logActivity(req.user?.username || 'admin', 'Application Status Changed', 'Applications', `Application #${req.params.id} -> ${status}`);
    res.json({ success: true, message: 'Status updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/applications/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM job_applications WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Application record deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Contact Enquiries
app.get('/api/admin/enquiries', authenticateToken, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = 'SELECT * FROM enquiries WHERE 1=1';
    const params: any[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    if (search) {
      query += ' AND (full_name LIKE ? OR email LIKE ? OR business_name LIKE ? OR service_of_interest LIKE ?)';
      const s = `%${search}%`;
      params.push(s, s, s, s);
    }
    query += ' ORDER BY created_at DESC';

    const enquiries = await dbAll(query, params);
    res.json(enquiries);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/enquiries/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { status, internal_notes } = req.body;
    await dbRun(`
      UPDATE enquiries SET status = ?, internal_notes = ? WHERE id = ?
    `, [status, internal_notes || '', req.params.id]);
    await logActivity(req.user?.username || 'admin', 'Enquiry Status Changed', 'Enquiries', `Enquiry #${req.params.id} -> ${status}`);
    res.json({ success: true, message: 'Enquiry updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/enquiries/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM enquiries WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Testimonials & Reviews
app.get('/api/admin/testimonials', authenticateToken, async (_req, res) => {
  try {
    const testimonials = await dbAll('SELECT * FROM testimonials ORDER BY display_order ASC');
    res.json(testimonials);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/testimonials', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { author_name, business_name, rating, review_text, source, source_url, avatar_url, is_verified, is_published, display_order } = req.body;
    const result = await dbRun(`
      INSERT INTO testimonials (author_name, business_name, rating, review_text, source, source_url, avatar_url, is_verified, is_published, display_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [author_name, business_name, rating || 5.0, review_text, source || 'Google Review', source_url, avatar_url, is_verified !== undefined ? is_verified : 1, is_published !== undefined ? is_published : 1, display_order || 0]);

    await logActivity(req.user?.username || 'admin', 'Testimonial Added', 'Reviews', `Added review by ${author_name}`);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/testimonials/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { author_name, business_name, rating, review_text, source, source_url, avatar_url, is_verified, is_published, display_order } = req.body;
    await dbRun(`
      UPDATE testimonials SET
        author_name = ?, business_name = ?, rating = ?, review_text = ?, source = ?,
        source_url = ?, avatar_url = ?, is_verified = ?, is_published = ?, display_order = ?
      WHERE id = ?
    `, [author_name, business_name, rating, review_text, source, source_url, avatar_url, is_verified, is_published, display_order, req.params.id]);

    res.json({ success: true, message: 'Review updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/testimonials/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Review deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: FAQs
app.get('/api/admin/faqs', authenticateToken, async (_req, res) => {
  try {
    const faqs = await dbAll('SELECT * FROM faqs ORDER BY display_order ASC');
    res.json(faqs);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/faqs', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { question, answer, category, display_order, is_published } = req.body;
    const result = await dbRun(`
      INSERT INTO faqs (question, answer, category, display_order, is_published)
      VALUES (?, ?, ?, ?, ?)
    `, [question, answer, category || 'general', display_order || 0, is_published !== undefined ? is_published : 1]);

    await logActivity(req.user?.username || 'admin', 'FAQ Created', 'FAQs', `Added FAQ: ${question}`);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/admin/faqs/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { question, answer, category, display_order, is_published } = req.body;
    await dbRun(`
      UPDATE faqs SET
        question = ?, answer = ?, category = ?, display_order = ?, is_published = ?
      WHERE id = ?
    `, [question, answer, category, display_order, is_published, req.params.id]);

    res.json({ success: true, message: 'FAQ updated' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/faqs/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    await dbRun('DELETE FROM faqs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'FAQ deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Media Library
app.get('/api/admin/media', authenticateToken, async (_req, res) => {
  try {
    const media = await dbAll('SELECT * FROM media ORDER BY uploaded_at DESC');
    res.json(media);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/media/upload', authenticateToken, upload.single('file'), async (req: AuthRequest, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: 'No file uploaded.' });
      return;
    }

    const { filename, originalname, mimetype, size } = req.file;
    const filePath = `/uploads/${filename}`;
    const altText = req.body.alt_text || originalname;

    const result = await dbRun(`
      INSERT INTO media (filename, original_name, file_path, file_type, file_size, alt_text)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [filename, originalname, filePath, mimetype, size, altText]);

    await logActivity(req.user?.username || 'admin', 'Media Uploaded', 'Media', `Uploaded file: ${originalname}`);

    res.status(201).json({
      success: true,
      media: {
        id: result.lastInsertRowid,
        filename,
        original_name: originalname,
        file_path: filePath,
        file_type: mimetype,
        file_size: size,
        alt_text: altText
      }
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/media/:id', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const file = await dbGet('SELECT * FROM media WHERE id = ?', [req.params.id]);
    if (file) {
      const diskPath = path.resolve(process.cwd(), 'public', file.file_path.replace(/^\//, ''));
      if (fs.existsSync(diskPath) && !file.filename.includes('dygytaly-logo')) {
        fs.unlinkSync(diskPath);
      }
      await dbRun('DELETE FROM media WHERE id = ?', [req.params.id]);
      await logActivity(req.user?.username || 'admin', 'Media Deleted', 'Media', `Deleted file ${file.filename}`);
    }
    res.json({ success: true, message: 'Media asset deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Settings
app.put('/api/admin/settings', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const settings = req.body; // key-value object
    for (const [key, value] of Object.entries(settings)) {
      const valStr = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const existing = await dbGet('SELECT key FROM settings WHERE key = ?', [key]);
      if (existing) {
        await dbRun('UPDATE settings SET value = ? WHERE key = ?', [valStr, key]);
      } else {
        await dbRun('INSERT INTO settings (key, value) VALUES (?, ?)', [key, valStr]);
      }
    }
    await logActivity(req.user?.username || 'admin', 'Settings Updated', 'Global Settings', 'Updated global site settings');
    res.json({ success: true, message: 'Global settings updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Navigation Editor
app.put('/api/admin/navigation', authenticateToken, async (req: AuthRequest, res) => {
  try {
    const { items } = req.body;
    if (Array.isArray(items)) {
      await dbExec('DELETE FROM navigation_items');
      for (const item of items) {
        await dbRun(`
          INSERT INTO navigation_items (label, url, parent_id, display_order, is_active)
          VALUES (?, ?, ?, ?, ?)
        `, [item.label, item.url, item.parent_id || null, item.display_order || 0, item.is_active !== undefined ? item.is_active : 1]);
      }
    }
    await logActivity(req.user?.username || 'admin', 'Navigation Updated', 'Menus', 'Updated site navigation items');
    res.json({ success: true, message: 'Navigation updated successfully' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: User Management
app.get('/api/admin/users', authenticateToken, requireRole(['admin']), async (_req, res) => {
  try {
    const users = await dbAll('SELECT id, username, email, role, created_at FROM users');
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/admin/users', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
  try {
    const { username, email, password, role } = req.body;
    if (!username || !email || !password) {
      res.status(400).json({ error: 'Username, email and password are required' });
      return;
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const result = await dbRun(`
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `, [username, email, hash, role || 'editor']);

    await logActivity(req.user?.username || 'admin', 'User Created', 'Users', `Created user ${username} (${role})`);
    res.status(201).json({ success: true, id: result.lastInsertRowid });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, requireRole(['admin']), async (req: AuthRequest, res) => {
  try {
    if (Number(req.params.id) === req.user?.id) {
      res.status(400).json({ error: 'You cannot delete your own account.' });
      return;
    }
    await dbRun('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User deleted' });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Backup & Export
app.get('/api/admin/backup/export', authenticateToken, requireRole(['admin']), async (_req, res) => {
  try {
    const pages = await dbAll('SELECT * FROM pages');
    const sections = await dbAll('SELECT * FROM homepage_sections');
    const services = await dbAll('SELECT * FROM services');
    const portfolio = await dbAll('SELECT * FROM portfolio');
    const founder = await dbGet('SELECT * FROM founder_profile WHERE id = 1');
    const team = await dbAll('SELECT * FROM team_members');
    const culture = await dbAll('SELECT * FROM culture_stories');
    const jobs = await dbAll('SELECT * FROM jobs');
    const faqs = await dbAll('SELECT * FROM faqs');
    const settings = await dbAll('SELECT * FROM settings');
    const testimonials = await dbAll('SELECT * FROM testimonials');

    const backupData = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      database: {
        pages,
        sections,
        services,
        portfolio,
        founder,
        team,
        culture,
        jobs,
        faqs,
        settings,
        testimonials
      }
    };

    res.header('Content-Type', 'application/json');
    res.attachment(`dygytaly_backup_${Date.now()}.json`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Export Enquiries CSV
app.get('/api/admin/export/enquiries', authenticateToken, async (_req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM enquiries ORDER BY created_at DESC');
    let csv = 'ID,Name,Business,Email,Phone,Service,Budget,Status,Date,Description\n';
    rows.forEach(r => {
      const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      csv += `${r.id},${escape(r.full_name)},${escape(r.business_name)},${escape(r.email)},${escape(r.phone)},${escape(r.service_of_interest)},${escape(r.budget_range)},${escape(r.status)},${escape(r.created_at)},${escape(r.project_description)}\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.attachment(`dygytaly_enquiries_${Date.now()}.csv`);
    res.send(csv);
  } catch (err: any) {
    res.status(500).send('Error exporting CSV');
  }
});

// Admin: Export Job Applications CSV
app.get('/api/admin/export/applications', authenticateToken, async (_req, res) => {
  try {
    const rows = await dbAll('SELECT * FROM job_applications ORDER BY created_at DESC');
    let csv = 'ID,Job,Name,Email,Phone,Experience,Portfolio,Resume,Status,Date\n';
    rows.forEach(r => {
      const escape = (str: string) => `"${(str || '').replace(/"/g, '""')}"`;
      csv += `${r.id},${escape(r.job_title)},${escape(r.full_name)},${escape(r.email)},${escape(r.phone)},${escape(r.experience)},${escape(r.portfolio_link)},${escape(r.resume_url)},${escape(r.status)},${escape(r.created_at)}\n`;
    });
    res.header('Content-Type', 'text/csv');
    res.attachment(`dygytaly_applications_${Date.now()}.csv`);
    res.send(csv);
  } catch (err: any) {
    res.status(500).send('Error exporting CSV');
  }
});

// Start Server
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`Dygytaly API server running on port ${PORT}`);
  });
}

startServer();
