import fs from 'fs';
import path from 'path';
import { Project, Client, Review, ContactMessage, SiteSettings, MediaItem, ProjectType } from '@/types/portfolio';
import { initialProjects, initialClients, initialReviews, initialSiteSettings, initialMedia } from './seed';
import { supabase } from '@/lib/supabase';

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
    try {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
      // In read-only serverless environment
    }
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultData: DatabaseSchema = {
      projects: initialProjects,
      clients: initialClients,
      reviews: initialReviews,
      messages: [],
      media: initialMedia,
      settings: initialSiteSettings,
      redirects: [],
    };
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    } catch (e) {
      // In read-only serverless environment
    }
    return defaultData;
  }

  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(content) as DatabaseSchema;
  } catch (err) {
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
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    // Graceful catch for read-only serverless environment like Vercel
  }
}

// ============================================================
// 1. PROJECTS
// ============================================================
export async function getProjects(filter?: {
  type?: string;
  status?: string;
  category?: string;
  featured?: boolean;
  search?: string;
}): Promise<Project[]> {
  if (supabase) {
    try {
      let query = supabase.from('projects').select('*');

      if (filter?.status) {
        query = query.eq('status', filter.status);
      }
      if (filter?.type && filter.type !== 'all') {
        query = query.eq('type', filter.type);
      }
      if (filter?.featured !== undefined) {
        query = query.eq('featured', filter.featured);
      }
      if (filter?.category && filter.category !== 'all') {
        query = query.ilike('category', filter.category);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      if (!error && Array.isArray(data) && data.length > 0) {
        let list = data as Project[];
        if (filter?.search) {
          const q = filter.search.toLowerCase();
          list = list.filter(
            (p) =>
              p.title?.toLowerCase().includes(q) ||
              p.short_description?.toLowerCase().includes(q) ||
              p.description?.toLowerCase().includes(q) ||
              p.client?.toLowerCase().includes(q)
          );
        }
        return list.sort((a, b) => {
          const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
          const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
          return timeB - timeA;
        });
      }
    } catch (e) {
      // Fall through to local fallback
    }
  }

  // Fallback to local DB
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

  return list.sort((a, b) => {
    const timeA = new Date(a.created_at || a.updated_at || 0).getTime();
    const timeB = new Date(b.created_at || b.updated_at || 0).getTime();
    return timeB - timeA;
  });
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('slug', slug).maybeSingle();
      if (!error && data) return data as Project;
    } catch (e) {
      // Fallback
    }
  }

  const db = ensureDbFile();
  const project = db.projects.find((p) => p.slug === slug);
  return project || null;
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
      if (!error && data) return data as Project;
    } catch (e) {
      // Fallback
    }
  }

  const db = ensureDbFile();
  const project = db.projects.find((p) => p.id === id);
  return project || null;
}

export async function createProject(data: Partial<Project>): Promise<Project> {
  const db = ensureDbFile();
  const now = new Date().toISOString();
  const newSlug = data.slug || data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`;
  
  const newProject: Project = {
    id: data.id || `proj-${Date.now()}`,
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
    order: 0,
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

  if (supabase) {
    try {
      await supabase.from('projects').insert(newProject);
    } catch (e) {
      console.error('Supabase project insert failed:', e);
    }
  }

  db.projects.unshift(newProject);
  saveDb(db);
  return newProject;
}

export async function updateProject(id: string, updates: Partial<Project>): Promise<Project | null> {
  const db = ensureDbFile();
  const index = db.projects.findIndex((p) => p.id === id);
  const now = new Date().toISOString();

  let current = index !== -1 ? db.projects[index] : null;

  if (supabase) {
    try {
      const { data: supaProject } = await supabase.from('projects').select('*').eq('id', id).maybeSingle();
      if (supaProject) current = supaProject as Project;

      await supabase.from('projects').update({ ...updates, updated_at: now }).eq('id', id);
    } catch (e) {
      console.error('Supabase project update failed:', e);
    }
  }

  if (!current) return null;

  const updated: Project = {
    ...current,
    ...updates,
    updated_at: now,
    published_at: updates.status === 'published' && !current.published_at ? now : current.published_at,
  };

  if (index !== -1) {
    db.projects[index] = updated;
    saveDb(db);
  }

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
  let deletedFromSupabase = false;

  if (supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) deletedFromSupabase = true;
    } catch (e) {
      console.error('Supabase project delete failed:', e);
    }
  }

  const db = ensureDbFile();
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => p.id !== id);
  if (db.projects.length !== initialLength) {
    saveDb(db);
    return true;
  }

  return deletedFromSupabase;
}

export async function deleteProjects(ids: string[]): Promise<number> {
  if (supabase) {
    try {
      await supabase.from('projects').delete().in('id', ids);
    } catch (e) {
      console.error('Supabase bulk projects delete failed:', e);
    }
  }

  const db = ensureDbFile();
  const idSet = new Set(ids);
  const initialLength = db.projects.length;
  db.projects = db.projects.filter((p) => !idSet.has(p.id));
  const deletedCount = initialLength - db.projects.length;
  if (deletedCount > 0) {
    saveDb(db);
  }
  return ids.length;
}

// ============================================================
// 2. CLIENTS
// ============================================================
export async function getClients(): Promise<Client[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return (data as Client[]).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      }
    } catch (e) {
      // Fallback
    }
  }

  const db = ensureDbFile();
  return db.clients.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}

export async function saveClient(client: Partial<Client>): Promise<Client> {
  const db = ensureDbFile();

  if (client.id) {
    if (supabase) {
      try {
        await supabase.from('clients').update(client).eq('id', client.id);
      } catch (e) {
        console.error('Supabase client update failed:', e);
      }
    }

    const idx = db.clients.findIndex((c) => c.id === client.id);
    if (idx !== -1) {
      db.clients[idx] = { ...db.clients[idx], ...client } as Client;
      saveDb(db);
      return db.clients[idx];
    }
  }

  const newClient: Client = {
    id: client.id || `client-${Date.now()}`,
    name: client.name || 'New Client',
    company: client.company || client.name || '',
    industry: client.industry || '',
    logo: client.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&h=80&q=80',
    website_url: client.website_url || '',
    description: client.description || '',
    order: db.clients.length + 1,
    enabled: client.enabled !== undefined ? client.enabled : true,
  };

  if (supabase) {
    try {
      await supabase.from('clients').insert(newClient);
    } catch (e) {
      console.error('Supabase client insert failed:', e);
    }
  }

  db.clients.push(newClient);
  saveDb(db);
  return newClient;
}

export async function deleteClient(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('clients').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase client delete failed:', e);
    }
  }

  const db = ensureDbFile();
  const len = db.clients.length;
  db.clients = db.clients.filter((c) => c.id !== id);
  if (db.clients.length !== len) {
    saveDb(db);
    return true;
  }
  return true;
}

// ============================================================
// 3. REVIEWS
// ============================================================
export async function getReviews(): Promise<Review[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return (data as Review[]).sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
      }
    } catch (e) {
      // Fallback
    }
  }

  const db = ensureDbFile();
  return db.reviews.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}

export async function saveReview(review: Partial<Review>): Promise<Review> {
  const db = ensureDbFile();

  if (review.id) {
    if (supabase) {
      try {
        await supabase.from('reviews').update(review).eq('id', review.id);
      } catch (e) {
        console.error('Supabase review update failed:', e);
      }
    }

    const idx = db.reviews.findIndex((r) => r.id === review.id);
    if (idx !== -1) {
      db.reviews[idx] = { ...db.reviews[idx], ...review } as Review;
      saveDb(db);
      return db.reviews[idx];
    }
  }

  const newReview: Review = {
    id: review.id || `rev-${Date.now()}`,
    client_name: review.client_name || 'Client Name',
    company: review.company || '',
    review: review.review || '',
    rating: review.rating || 5,
    project_name: review.project_name || '',
    featured: Boolean(review.featured),
    published: review.published !== undefined ? review.published : true,
    order: db.reviews.length + 1,
  };

  if (supabase) {
    try {
      await supabase.from('reviews').insert(newReview);
    } catch (e) {
      console.error('Supabase review insert failed:', e);
    }
  }

  db.reviews.push(newReview);
  saveDb(db);
  return newReview;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('reviews').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase review delete failed:', e);
    }
  }

  const db = ensureDbFile();
  const len = db.reviews.length;
  db.reviews = db.reviews.filter((r) => r.id !== id);
  if (db.reviews.length !== len) {
    saveDb(db);
    return true;
  }
  return true;
}

// ============================================================
// 4. MESSAGES / INQUIRIES
// ============================================================
export async function getContactMessages(): Promise<ContactMessage[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data as ContactMessage[];
      }
    } catch (e) {
      // Fallback
    }
  }

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
  const newMsg: ContactMessage = {
    id: `msg-${Date.now()}`,
    ...msg,
    status: 'unread',
    created_at: new Date().toISOString(),
  };

  if (supabase) {
    try {
      await supabase.from('messages').insert(newMsg);
    } catch (e) {
      console.error('Supabase message insert failed:', e);
    }
  }

  const db = ensureDbFile();
  db.messages.unshift(newMsg);
  saveDb(db);
  return newMsg;
}

export async function updateMessageStatus(id: string, status: ContactMessage['status']): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('messages').update({ status }).eq('id', id);
    } catch (e) {
      console.error('Supabase message status update failed:', e);
    }
  }

  const db = ensureDbFile();
  const msg = db.messages.find((m) => m.id === id);
  if (!msg) return false;
  msg.status = status;
  saveDb(db);
  return true;
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('messages').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase message delete failed:', e);
    }
  }

  const db = ensureDbFile();
  const len = db.messages.length;
  db.messages = db.messages.filter((m) => m.id !== id);
  if (db.messages.length !== len) {
    saveDb(db);
    return true;
  }
  return true;
}

// ============================================================
// 5. MEDIA LIBRARY
// ============================================================
export async function getMediaList(): Promise<MediaItem[]> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('media').select('*').order('created_at', { ascending: false });
      if (!error && Array.isArray(data) && data.length > 0) {
        return data as MediaItem[];
      }
    } catch (e) {
      // Fallback
    }
  }

  const db = ensureDbFile();
  return db.media.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
}

export async function addMediaItem(item: Partial<MediaItem>): Promise<MediaItem> {
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

  if (supabase) {
    try {
      await supabase.from('media').insert(newItem);
    } catch (e) {
      console.error('Supabase media insert failed:', e);
    }
  }

  const db = ensureDbFile();
  db.media.unshift(newItem);
  saveDb(db);
  return newItem;
}

export async function deleteMediaItem(id: string): Promise<boolean> {
  if (supabase) {
    try {
      await supabase.from('media').delete().eq('id', id);
    } catch (e) {
      console.error('Supabase media delete failed:', e);
    }
  }

  const db = ensureDbFile();
  const len = db.media.length;
  db.media = db.media.filter((m) => m.id !== id);
  if (db.media.length !== len) {
    saveDb(db);
    return true;
  }
  return true;
}

// ============================================================
// 6. SITE SETTINGS
// ============================================================
export async function getSiteSettings(): Promise<SiteSettings> {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('settings').select('*').eq('id', 'default').maybeSingle();
      if (!error && data?.data) {
        return data.data as SiteSettings;
      }
    } catch (e) {
      // Fallback
    }
  }

  const db = ensureDbFile();
  return db.settings;
}

export async function updateSiteSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const db = ensureDbFile();
  const updated = { ...db.settings, ...settings };

  if (supabase) {
    try {
      await supabase.from('settings').upsert({ id: 'default', data: updated });
    } catch (e) {
      console.error('Supabase settings upsert failed:', e);
    }
  }

  db.settings = updated;
  saveDb(db);
  return db.settings;
}

// ============================================================
// 7. DASHBOARD STATS
// ============================================================
export async function getDashboardStats() {
  const [projectsList, messagesList] = await Promise.all([
    getProjects(),
    getContactMessages(),
  ]);

  const total = projectsList.length;
  const graphic = projectsList.filter((p) => p.type === 'graphic').length;
  const video = projectsList.filter((p) => p.type === 'video').length;
  const website = projectsList.filter((p) => p.type === 'website').length;
  const caseStudies = projectsList.filter((p) => p.type === 'case_study').length;
  const published = projectsList.filter((p) => p.status === 'published').length;
  const drafts = projectsList.filter((p) => p.status === 'draft').length;
  const featured = projectsList.filter((p) => p.featured).length;
  const unreadMessages = messagesList.filter((m) => m.status === 'unread').length;

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
