import fs from 'fs';
import path from 'path';
import { Project, Client, Review, ContactMessage, SiteSettings, MediaItem, ProjectType } from '@/types/portfolio';
import { initialProjects, initialClients, initialReviews, initialSiteSettings, initialMedia } from './seed';

interface DatabaseSchema {
  projects: Project[];
  clients: Client[];
  reviews: Review[];
  messages: ContactMessage[];
  media: MediaItem[];
  settings: SiteSettings;
  redirects: { old_url: string; new_url: string; created_at: string }[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'portfolio-store.json');

function ensureDbFile(): DatabaseSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultData: DatabaseSchema = {
      projects: initialProjects,
      clients: initialClients,
      reviews: initialReviews,
      messages: [
        {
          id: 'msg-1',
          name: 'Sarah Jenkins',
          email: 'sarah@example.com',
          phone: '+1 555-0192',
          company: 'Lumen Labs',
          service: 'Graphic Design',
          message: 'Hi Rupesh, love your visual identity work. We are launching an acoustic tech product next month and need social campaign decks and banners.',
          status: 'read',
          created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
        }
      ],
      media: initialMedia,
      settings: initialSiteSettings,
      redirects: [],
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (err) {
    console.error('Failed to read db file, returning fallback', err);
    return {
      projects: initialProjects,
      clients: initialClients,
      reviews: initialReviews,
      messages: [],
      media: initialMedia,
      settings: initialSiteSettings,
      redirects: [],
    };
  }
}

function saveDb(data: DatabaseSchema) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// ----------------- PROJECTS -----------------
export async function getProjects(filter?: {
  type?: ProjectType | string;
  status?: string;
  featured?: boolean;
  category?: string;
  search?: string;
}): Promise<Project[]> {
  const db = ensureDbFile();
  let list = db.projects;

  if (filter?.status) {
    list = list.filter((p) => p.status === filter.status);
  }
  if (filter?.type && filter.type !== 'all') {
    list = list.filter((p) => p.type === filter.type);
  }
  if (filter?.featured !== undefined) {
    list = list.filter((p) => p.featured === filter.featured);
  }
  if (filter?.category && filter.category !== 'all') {
    list = list.filter((p) => p.category.toLowerCase() === filter.category!.toLowerCase());
  }
  if (filter?.search) {
    const q = filter.search.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.short_description?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tools?.some((t) => t.toLowerCase().includes(q)) ||
        p.tags?.some((t) => t.toLowerCase().includes(q)) ||
        p.client?.toLowerCase().includes(q)
    );
  }

  return list.sort((a, b) => (a.order || 0) - (b.order || 0));
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const db = ensureDbFile();
  const project = db.projects.find((p) => p.slug === slug);
  return project || null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  const db = ensureDbFile();
  const project = db.projects.find((p) => p.id === id);
  return project || null;
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const db = ensureDbFile();
  const now = new Date().toISOString();
  const newSlug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`;
  
  const newProject: Project = {
    id: `proj-${Date.now()}`,
    title: data.title || 'Untitled Project',
    slug: newSlug,
    type: data.type || 'graphic',
    category: data.category || 'General',
    subcategory: data.subcategory || '',
    client: data.client || '',
    year: data.year || new Date().getFullYear().toString(),
    short_description: data.short_description || '',
    description: data.description || '',
    tools: data.tools || [],
    services: data.services || [],
    tags: data.tags || [],
    featured: Boolean(data.featured),
    status: data.status || 'draft',
    order: db.projects.length + 1,
    featured_image: data.featured_image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    aspect_ratio: data.aspect_ratio || '16:9',
    format_name: data.format_name || '',
    orientation: data.orientation || 'landscape',
    alt_text: data.alt_text || data.title || 'Creative work by Rupesh Yadav',
    caption: data.caption || '',
    video_url: data.video_url || '',
    video_type: data.video_type || '',
    duration: data.duration || '',
    website_url: data.website_url || '',
    design_role: data.design_role || '',
    development_role: data.development_role || '',
    desktop_screenshot: data.desktop_screenshot || '',
    tablet_screenshot: data.tablet_screenshot || '',
    mobile_screenshot: data.mobile_screenshot || '',
    gallery: data.gallery || [],
    case_study: data.case_study || {},
    seo: {
      seo_title: data.seo?.seo_title || `${data.title || 'Project'} | Rupesh Yadav`,
      seo_description: data.seo?.seo_description || data.short_description || 'Creative project by Rupesh Yadav.',
      focus_keyword: data.seo?.focus_keyword || '',
      canonical_url: data.seo?.canonical_url || `/work/${data.type || 'graphic'}/${newSlug}`,
      no_index: Boolean(data.seo?.no_index),
    },
    published_at: data.status === 'published' ? now : undefined,
    created_at: now,
    updated_at: now,
  };

  db.projects.unshift(newProject);
  saveDb(db);
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const db = ensureDbFile();
  const index = db.projects.findIndex((p) => p.id === id);
  if (index === -1) return null;

  const current = db.projects[index];
  const now = new Date().toISOString();

  // Handle slug change redirect tracking
  if (updates.slug && updates.slug !== current.slug) {
    db.redirects.push({
      old_url: `/work/${current.type}/${current.slug}`,
      new_url: `/work/${updates.type || current.type}/${updates.slug}`,
      created_at: now,
    });
  }

  const updated: Project = {
    ...current,
    ...updates,
    updated_at: now,
    published_at: updates.status === 'published' && !current.published_at ? now : current.published_at,
  };

  db.projects[index] = updated;
  saveDb(db);
  return updated;
}

export async function duplicateProject(id: string): Promise<Project | null> {
  const current = await getProjectById(id);
  if (!current) return null;

  const duplicateData: Partial<Project> = {
    ...current,
    title: `${current.title} (Copy)`,
    slug: `${current.slug}-copy-${Date.now().toString().slice(-4)}`,
    status: 'draft',
    featured: false,
  };

  return createProject(duplicateData);
}

export async function deleteProject(id: string): Promise<boolean> {
  const db = ensureDbFile();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length !== initialLength) {
    saveDb(db);
    return true;
  }
  return false;
}

export async function deleteProjects(ids: string[]): Promise<number> {
  const db = ensureDbFile();
  const idSet = new Set(ids);
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => !idSet.has(p.id));
  const deletedCount = initialLength - db.projects.length;
  if (deletedCount > 0) {
    saveDb(db);
  }
  return deletedCount;
}

// ----------------- CLIENTS -----------------
export async function getClients(): Promise<Client[]> {
  const db = ensureDbFile();
  return db.clients.sort((a, b) => a.order - b.order);
}

export async function saveClient(client: Partial<Client>): Promise<Client> {
  const db = ensureDbFile();
  if (client.id) {
    const idx = db.clients.findIndex((c) => c.id === client.id);
    if (idx !== -1) {
      db.clients[idx] = { ...db.clients[idx], ...client } as Client;
      saveDb(db);
      return db.clients[idx];
    }
  }

  const newClient: Client = {
    id: `client-${Date.now()}`,
    name: client.name || 'New Client',
    company: client.company || client.name || '',
    industry: client.industry || '',
    logo: client.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=80&q=80',
    website_url: client.website_url || '',
    description: client.description || '',
    order: db.clients.length + 1,
    enabled: client.enabled !== undefined ? client.enabled : true,
  };

  db.clients.push(newClient);
  saveDb(db);
  return newClient;
}

export async function deleteClient(id: string): Promise<boolean> {
  const db = ensureDbFile();
  const len = db.clients.length;
  db.clients = db.clients.filter((c) => c.id !== id);
  if (db.clients.length !== len) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- REVIEWS -----------------
export async function getReviews(): Promise<Review[]> {
  const db = ensureDbFile();
  return db.reviews.sort((a, b) => a.order - b.order);
}

export async function saveReview(review: Partial<Review>): Promise<Review> {
  const db = ensureDbFile();
  if (review.id) {
    const idx = db.reviews.findIndex((r) => r.id === review.id);
    if (idx !== -1) {
      db.reviews[idx] = { ...db.reviews[idx], ...review } as Review;
      saveDb(db);
      return db.reviews[idx];
    }
  }

  const newReview: Review = {
    id: `rev-${Date.now()}`,
    client_name: review.client_name || 'Client Name',
    company: review.company || '',
    review: review.review || '',
    rating: review.rating || 5,
    project_name: review.project_name || '',
    featured: Boolean(review.featured),
    published: review.published !== undefined ? review.published : true,
    order: db.reviews.length + 1,
  };

  db.reviews.push(newReview);
  saveDb(db);
  return newReview;
}

export async function deleteReview(id: string): Promise<boolean> {
  const db = ensureDbFile();
  const len = db.reviews.length;
  db.reviews = db.reviews.filter((r) => r.id !== id);
  if (db.reviews.length !== len) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- MESSAGES -----------------
export async function getContactMessages(): Promise<ContactMessage[]> {
  const db = ensureDbFile();
  return db.messages.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function createContactMessage(msg: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
}): Promise<ContactMessage> {
  const db = ensureDbFile();
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}`,
    ...msg,
    status: 'unread',
    created_at: new Date().toISOString(),
  };
  db.messages.unshift(newMsg);
  saveDb(db);
  return newMsg;
}

export async function updateMessageStatus(id: string, status: ContactMessage['status']): Promise<boolean> {
  const db = ensureDbFile();
  const msg = db.messages.find((m) => m.id === id);
  if (!msg) return false;
  msg.status = status;
  saveDb(db);
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  const db = ensureDbFile();
  const len = db.messages.length;
  db.messages = db.messages.filter((m) => m.id !== id);
  if (db.messages.length !== len) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- MEDIA -----------------
export async function getMediaList(): Promise<MediaItem[]> {
  const db = ensureDbFile();
  return db.media;
}

export async function addMediaItem(item: Partial<MediaItem>): Promise<MediaItem> {
  const db = ensureDbFile();
  const newItem: MediaItem = {
    id: `med-${Date.now()}`,
    name: item.name || 'uploaded-file.jpg',
    url: item.url || '',
    type: item.type || 'image',
    size: item.size || 'N/A',
    dimensions: item.dimensions || '1200x800',
    aspect_ratio: item.aspect_ratio || '16:9',
    created_at: new Date().toISOString(),
  };
  db.media.unshift(newItem);
  saveDb(db);
  return newItem;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  const db = ensureDbFile();
  const len = db.media.length;
  db.media = db.media.filter((m) => m.id !== id);
  if (db.media.length !== len) {
    saveDb(db);
    return true;
  }
  return false;
}

// ----------------- SITE SETTINGS -----------------
export async function getSiteSettings(): Promise<SiteSettings> {
  const db = ensureDbFile();
  return db.settings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = ensureDbFile();
  db.settings = { ...db.settings, ...settings };
  saveDb(db);
  return db.settings;
}

// ----------------- DASHBOARD STATS -----------------
export async function getDashboardStats() {
  const db = ensureDbFile();
  const total = db.projects.length;
  const graphic = db.projects.filter((p) => p.type === 'graphic').length;
  const video = db.projects.filter((p) => p.type === 'video').length;
  const website = db.projects.filter((p) => p.type === 'website').length;
  const caseStudies = db.projects.filter((p) => p.type === 'case_study').length;
  const published = db.projects.filter((p) => p.status === 'published').length;
  const drafts = db.projects.filter((p) => p.status === 'draft').length;
  const featured = db.projects.filter((p) => p.featured).length;
  const unreadMessages = db.messages.filter((m) => m.status === 'unread').length;

  return {
    total,
    graphic,
    video,
    website,
    caseStudies,
    published,
    drafts,
    featured,
    unreadMessages,
  };
}
