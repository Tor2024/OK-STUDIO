import { useState, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  getGithubConfig, saveGithubConfig, clearGithubConfig,
  readDataFile, writeDataFile, verifyToken,
  readItem, writeItem, deleteFile,
  type GithubConfig
} from '../lib/github';
import {
  LayoutDashboard, LogOut, Trash2, FileText,
  Image as ImageIcon, Globe, Loader2, Lock,
  ShieldCheck, Zap, Check, Plus, Settings, Edit2
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Project { id: string; title: string; category: string; image: string; description: string; fullDescription?: string; completedAt?: string; order: number; published?: boolean; keywords?: string; seoTitle?: string; seoDescription?: string; }
interface Insight  { id: string; title: string; date: string; tag: string; author: string; content?: string; published?: boolean; keywords?: string; seoTitle?: string; seoDescription?: string; }
interface Client   { id: string; name: string; link: string; order: number; }
interface Faq      { id: string; question: string; answer: string; order: number; }
interface LocationLanding { id: string; city: string; title: string; description: string; content: string; published: boolean; keywords: string; }
interface LegalSection { id: string; title: string; content: string; order: number; }
interface PrivacyData { title: string; subtitle: string; sections: LegalSection[]; }
interface ImpressumData { title: string; subtitle: string; sections: LegalSection[]; disclaimer: string; }
interface Settings { [key: string]: string; }
interface SpecialOffer { enabled: boolean; title: string; message: string; buttonText: string; buttonLink: string; validUntil?: string; }

type Tab = 'dashboard' | 'projects' | 'insights' | 'landings' | 'clients' | 'faqs' | 'settings' | 'privacy' | 'impressum' | 'special-offer';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

function slugify(s: string) {
  return s.toLowerCase().replace(/[äöüß]/g, c => ({'ä':'ae','ö':'oe','ü':'ue','ß':'ss'}[c]||c))
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// ─── Password Auth ────────────────────────────────────────────────────────────
// Пароль можно задать через Environment Variable: VITE_ADMIN_PASSWORD_HASH
// Или использовать дефолтный: "password"
const DEFAULT_PASSWORD_HASH = '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'; // "password"
const ADMIN_PASSWORD_HASH = (import.meta as any).env.VITE_ADMIN_PASSWORD_HASH || DEFAULT_PASSWORD_HASH;

function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  return crypto.subtle.digest('SHA-256', data).then(buffer => {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  });
}

function getPasswordAuth(): boolean {
  return sessionStorage.getItem('admin_auth') === 'true';
}

function setPasswordAuth(value: boolean) {
  if (value) sessionStorage.setItem('admin_auth', 'true');
  else sessionStorage.removeItem('admin_auth');
}

// ─── Password screen ──────────────────────────────────────────────────────────
function PasswordScreen({ onAuth }: { onAuth: () => void }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Rate limiting
    if (attempts >= 5) {
      setError('Zu viele Versuche. Bitte warten Sie 5 Minuten.');
      setLoading(false);
      return;
    }

    try {
      const hash = await hashPassword(password);
      
      if (hash === ADMIN_PASSWORD_HASH) {
        setPasswordAuth(true);
        onAuth();
      } else {
        setAttempts(prev => prev + 1);
        setError(`Falsches Passwort. Versuch ${attempts + 1}/5`);
        setPassword('');
      }
    } catch (err) {
      setError('Fehler bei der Authentifizierung.');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#F1F3EA]">
      {/* Brutalist Grid Pattern Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(#616752 1px, transparent 1px),
            linear-gradient(90deg, #616752 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="relative max-w-md w-full">
        {/* Security Badge */}
        <div className="mb-8 flex items-center justify-center">
          <div className="border-4 border-[#616752] p-6 bg-white">
            <Lock size={48} className="text-[#616752]" />
          </div>
        </div>

        {/* Login Box */}
        <div className="border-4 border-[#141414] bg-white shadow-[8px_8px_0px_0px_rgba(20,20,20,1)]">
          <div className="border-b-4 border-[#141414] bg-[#616752] p-6">
            <span className="telemetry-label text-white block mb-2">SECURITY_CHECKPOINT</span>
            <h1 className="font-display font-black text-3xl uppercase text-white tracking-tight">
              ADMIN ZUGANG
            </h1>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="telemetry-label text-[10px] block mb-3 text-[#616752]">
                  PASSWORT EINGEBEN
                </label>
                <input
                  className="w-full border-2 border-[#141414] px-4 py-4 font-mono text-sm focus:outline-none focus:border-[#616752] bg-[#F1F3EA] transition-colors"
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  disabled={loading || attempts >= 5}
                  required
                  autoFocus
                />
              </div>

              {error && (
                <div className="border-2 border-red-500 bg-red-50 p-4">
                  <p className="font-mono text-[11px] text-red-700 flex items-center gap-2">
                    <span className="text-red-500">⚠</span>
                    {error}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || attempts >= 5}
                className="w-full bg-[#141414] text-white py-4 font-mono text-[12px] tracking-[0.2em] hover:bg-[#616752] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-3 border-2 border-[#141414]"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>VERIFIZIERE...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck size={16} />
                    <span>ZUGANG GEWÄHREN</span>
                  </>
                )}
              </button>
            </form>

            {/* Info Box */}
            <div className="mt-8 border-2 border-[#C5C5C5] bg-[#F1F3EA] p-4">
              <p className="font-mono text-[9px] text-[#616752] leading-relaxed">
                <strong className="block mb-2">SICHERHEITSHINWEIS:</strong>
                Dieser Bereich ist geschützt. Nur autorisierte Benutzer haben Zugriff.
                Nach 5 fehlgeschlagenen Versuchen wird der Zugang für 5 Minuten gesperrt.
              </p>
            </div>

            {/* Attempts Counter */}
            {attempts > 0 && (
              <div className="mt-4 flex items-center justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`w-3 h-3 border-2 ${
                      i < attempts
                        ? 'bg-red-500 border-red-500'
                        : 'bg-white border-[#C5C5C5]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="font-mono text-[9px] text-[#616752] opacity-60">
            OK STUDIO // ADMIN PANEL v2.0
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Login screen ─────────────────────────────────────────────────────────────
function LoginScreen({ onLogin, onDemoMode }: { onLogin: (cfg: GithubConfig) => void; onDemoMode: () => void }) {
  const [form, setForm] = useState({ token: '', owner: '', repo: '', branch: 'main' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    const ok = await verifyToken(form);
    if (ok) { saveGithubConfig(form); onLogin(form); }
    else setError('Token ungültig oder Repository nicht gefunden.');
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-12 bg-[#F1F3EA]">
      <div className="max-w-md w-full border border-[#C5C5C5] p-12 bg-white">
        <span className="telemetry-label mb-6 block font-bold">ADMIN_ACCESS</span>
        <h1 className="font-display font-black text-2xl uppercase mb-8">GitHub Verbindung</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="telemetry-label text-[9px] block mb-1">GITHUB TOKEN (repo scope)</label>
            <input className="admin-input" type="password" placeholder="ghp_xxxxxxxxxxxx" value={form.token} onChange={e => setForm({...form, token: e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="telemetry-label text-[9px] block mb-1">OWNER</label>
              <input className="admin-input" placeholder="username" value={form.owner} onChange={e => setForm({...form, owner: e.target.value})} required />
            </div>
            <div>
              <label className="telemetry-label text-[9px] block mb-1">REPO</label>
              <input className="admin-input" placeholder="studio-ok" value={form.repo} onChange={e => setForm({...form, repo: e.target.value})} required />
            </div>
          </div>
          <div>
            <label className="telemetry-label text-[9px] block mb-1">BRANCH</label>
            <input className="admin-input" placeholder="main" value={form.branch} onChange={e => setForm({...form, branch: e.target.value})} required />
          </div>
          {error && <p className="font-mono text-[10px] text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="w-full bg-[#616752] text-white py-4 font-mono text-[11px] tracking-widest hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <Loader2 size={14} className="animate-spin" /> : <ShieldCheck size={14} />}
            {loading ? 'VERBINDE...' : 'VERBINDEN'}
          </button>
        </form>
        
        {/* Demo Mode Button */}
        <div className="mt-6 pt-6 border-t border-[#C5C5C5]">
          <button 
            onClick={onDemoMode}
            className="w-full bg-[#F1F3EA] border-2 border-[#616752] text-[#616752] py-4 font-mono text-[11px] tracking-widest hover:bg-[#616752] hover:text-white transition-colors flex items-center justify-center gap-2"
          >
            <Zap size={14} />
            DEMO MODUS (Nur Ansicht)
          </button>
          <p className="font-mono text-[9px] opacity-40 mt-3 text-center">
            Lokale Daten anzeigen ohne GitHub Verbindung
          </p>
        </div>
        
        <p className="font-mono text-[9px] opacity-40 mt-6 leading-relaxed">
          Token benötigt <strong>repo</strong> Scope. Erstellen unter GitHub → Settings → Developer settings → Personal access tokens.
        </p>
      </div>
    </div>
  );
}

// ─── Main Admin component ─────────────────────────────────────────────────────
export default function Admin() {
  usePageTitle('Admin');
  
  // Auto-load GitHub config from environment variables
  const getAutoConfig = (): GithubConfig | null => {
    const token = (import.meta as any).env.VITE_GITHUB_TOKEN;
    const owner = (import.meta as any).env.VITE_GITHUB_OWNER;
    const repo = (import.meta as any).env.VITE_GITHUB_REPO;
    const branch = (import.meta as any).env.VITE_GITHUB_BRANCH || 'main';
    
    if (token && owner && repo) {
      return { token, owner, repo, branch };
    }
    return getGithubConfig();
  };
  
  // ALL HOOKS MUST BE AT THE TOP - BEFORE ANY CONDITIONAL RETURNS
  const [isAuthenticated, setIsAuthenticated] = useState(getPasswordAuth);
  const [cfg, setCfg] = useState<GithubConfig | null>(getAutoConfig);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [tab, setTab] = useState<Tab>('dashboard');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  // Data state
  const [projects, setProjects]   = useState<Project[]>([]);
  const [insights, setInsights]   = useState<Insight[]>([]);
  const [landings, setLandings]   = useState<LocationLanding[]>([]);
  const [clients, setClients]     = useState<Client[]>([]);
  const [faqs, setFaqs]           = useState<Faq[]>([]);
  const [settings, setSettings]   = useState<Settings>({});
  const [privacy, setPrivacy]     = useState<PrivacyData>({ title: '', subtitle: '', sections: [] });
  const [impressum, setImpressum] = useState<ImpressumData>({ title: '', subtitle: '', sections: [], disclaimer: '' });
  const [specialOffer, setSpecialOffer] = useState<SpecialOffer>({ enabled: false, title: 'Sonderangebot', message: '', buttonText: 'Jetzt anfragen', buttonLink: '/contact', validUntil: '' });

  // SHA cache (needed for GitHub API updates)
  const [shas, setShas] = useState<Record<string, string>>({});

  // Loading
  const [dataLoaded, setDataLoaded] = useState(false);

  // New item forms
  const [newProject, setNewProject] = useState<Omit<Project,'id'>>({ title:'', category:'', image:'', description:'', fullDescription:'', completedAt:'', order:0, published: true, keywords: '', seoTitle: '', seoDescription: '' });
  const [newInsight, setNewInsight] = useState<Omit<Insight,'id'>>({ title:'', date: '', tag:'NEWS', author:'Oleh Kalchenko', content:'', published: true, keywords: '', seoTitle: '', seoDescription: '' });
  const [newLanding, setNewLanding] = useState<Omit<LocationLanding,'id'>>({ city:'', title:'', description:'', content:'', published: true, keywords: '' });
  const [newClient,  setNewClient]  = useState<Omit<Client,'id'>>({ name:'', link:'', order:0 });
  const [newFaq,     setNewFaq]     = useState<Omit<Faq,'id'>>({ question:'', answer:'', order:0 });
  const [showPreview, setShowPreview] = useState(false);
  const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);

  // Edit mode state
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [editingLanding, setEditingLanding] = useState<LocationLanding | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingFaq, setEditingFaq] = useState<Faq | null>(null);

  // AI State
  const [isGeneratingSEO, setIsGeneratingSEO] = useState(false);
  const [isFormattingText, setIsFormattingText] = useState(false);

  // Load all data from GitHub or local files - MUST BE BEFORE CONDITIONAL RETURN
  useEffect(() => {
    if (!isAuthenticated) return; // Don't load if not authenticated
    if (!cfg && !isDemoMode) return;
    if (dataLoaded) return; // Prevent re-loading
    
    let isMounted = true; // Prevent state updates after unmount
    
    const load = async () => {
      try {
        if (isDemoMode) {
          // Load from local public folder
          const [p, i, l, c, f, s, pr, im, so] = await Promise.all([
            fetch('/data/projects/index.json').then(r => r.json()).catch(() => []),
            fetch('/data/insights/index.json').then(r => r.json()).catch(() => []),
            fetch('/data/landings.json').then(r => r.json()).catch(() => []),
            fetch('/data/clients.json').then(r => r.json()).catch(() => []),
            fetch('/data/faqs.json').then(r => r.json()).catch(() => []),
            fetch('/data/settings.json').then(r => r.json()).catch(() => ({})),
            fetch('/data/privacy.json').then(r => r.json()).catch(() => ({ title:'', subtitle:'', sections:[] })),
            fetch('/data/impressum.json').then(r => r.json()).catch(() => ({ title:'', subtitle:'', sections:[], disclaimer:'' })),
            fetch('/data/special-offer.json').then(r => r.json()).catch(() => ({ enabled: false, title:'', message:'', buttonText:'', buttonLink:'' })),
          ]);
          if (!isMounted) return;
          setProjects(p);
          setInsights(i);
          setLandings(l);
          setClients(c);
          setFaqs(f);
          setSettings(s);
          setPrivacy(pr);
          setImpressum(im);
          setSpecialOffer(so);
          setDataLoaded(true);
        } else if (cfg) {
          // Load from GitHub
          const [p, i, l, c, f, s, pr, im, so] = await Promise.all([
            readDataFile<Project[]>(cfg, 'projects').catch(() => ({data:[], sha:''})),
            readDataFile<Insight[]>(cfg, 'insights').catch(() => ({data:[], sha:''})),
            readDataFile<LocationLanding[]>(cfg, 'landings').catch(() => ({data:[], sha:''})),
            readDataFile<Client[]>(cfg, 'clients').catch(() => ({data:[], sha:''})),
            readDataFile<Faq[]>(cfg, 'faqs').catch(() => ({data:[], sha:''})),
            readDataFile<Settings>(cfg, 'settings').catch(() => ({data:{}, sha:''})),
            readDataFile<PrivacyData>(cfg, 'privacy').catch(() => ({data:{ title:'', subtitle:'', sections:[] }, sha:''})),
            readDataFile<ImpressumData>(cfg, 'impressum').catch(() => ({data:{ title:'', subtitle:'', sections:[], disclaimer:'' }, sha:''})),
            readDataFile<SpecialOffer>(cfg, 'special-offer').catch(() => ({data:{ enabled: false, title:'', message:'', buttonText:'', buttonLink:'' }, sha:''})),
          ]);
          if (!isMounted) return;
          setProjects(p.data); setShas(prev => ({...prev, projects: p.sha}));
          setInsights(i.data); setShas(prev => ({...prev, insights: i.sha}));
          setLandings(l.data); setShas(prev => ({...prev, landings: l.sha}));
          setClients(c.data);  setShas(prev => ({...prev, clients: c.sha}));
          setFaqs(f.data);     setShas(prev => ({...prev, faqs: f.sha}));
          setSettings(s.data); setShas(prev => ({...prev, settings: s.sha}));
          setPrivacy(pr.data); setShas(prev => ({...prev, privacy: pr.sha}));
          setImpressum(im.data); setShas(prev => ({...prev, impressum: im.sha}));
          setSpecialOffer(so.data); setShas(prev => ({...prev, 'special-offer': so.sha}));
          setDataLoaded(true);
        }
      } catch (err) {
        console.error('Load error:', err);
        if (isMounted) setDataLoaded(true);
      }
    };
    load();
    
    return () => {
      isMounted = false; // Cleanup on unmount
    };
  }, [isAuthenticated, cfg?.token, isDemoMode]);

  // Password protection - AFTER all hooks
  if (!isAuthenticated) {
    return <PasswordScreen onAuth={() => setIsAuthenticated(true)} />;
  }

  const save = async <T,>(name: string, data: T, action: string) => {
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    if (!cfg) return;
    setSaving(true); setSaveMsg('');
    try {
      const res = await writeDataFile(cfg, name, data, shas[name], action);
      setShas(prev => ({...prev, [name]: res.content.sha}));
      setSaveMsg(`✓ ${action}`);
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (err: any) {
      setSaveMsg(`✗ ${err.message}`);
    }
    setSaving(false);
  };

  // ─── AI SEO Generator ───────────────────────────────────────────────────────
  const generateSEO = async (type: 'project' | 'insight' | 'landing', contentText: string) => {
    if (!contentText || contentText.trim().length < 50) {
      alert("Der Text ist zu kurz für eine KI-Analyse. Bitte füllen Sie zuerst den Inhalt aus.");
      return;
    }
    
    setIsGeneratingSEO(true);
    try {
      const res = await fetch(`/api/generate-seo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: contentText })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        let errMsg = errorData.error || "API-Fehler bei Google Gemini";
        if (errorData.details) {
          try {
             const parsedDetails = JSON.parse(errorData.details);
             errMsg += ": " + (parsedDetails.error?.message || errorData.details);
          } catch(e) {
             errMsg += ": " + errorData.details;
          }
        }
        throw new Error(errMsg);
      }
      
      const parsed = await res.json();

      if (type === 'project') {
        if (editingProject) {
          setEditingProject(prev => ({ ...prev!, keywords: parsed.keywords, seoTitle: parsed.seoTitle, seoDescription: parsed.seoDescription }));
        } else {
          setNewProject(prev => ({ ...prev, keywords: parsed.keywords, seoTitle: parsed.seoTitle, seoDescription: parsed.seoDescription }));
        }
      } else if (type === 'insight') {
        if (editingInsight) {
          setEditingInsight(prev => ({ ...prev!, keywords: parsed.keywords, seoTitle: parsed.seoTitle, seoDescription: parsed.seoDescription }));
        } else {
          setNewInsight(prev => ({ ...prev, keywords: parsed.keywords, seoTitle: parsed.seoTitle, seoDescription: parsed.seoDescription }));
        }
      } else if (type === 'landing') {
        if (editingLanding) {
          setEditingLanding(prev => ({ ...prev!, keywords: parsed.keywords, description: parsed.seoDescription }));
        } else {
          setNewLanding(prev => ({ ...prev, keywords: parsed.keywords, description: parsed.seoDescription }));
        }
      }
      
    } catch (e: any) {
      console.error(e);
      alert("Fehler bei der KI-Generierung: " + e.message);
    } finally {
      setIsGeneratingSEO(false);
    }
  };

  const formatContent = async (type: 'project' | 'insight' | 'landing', rawText: string) => {
    if (!rawText || rawText.trim().length < 20) {
      alert("Der Text ist zu kurz zum Formatieren. Bitte geben Sie zuerst etwas Text ein.");
      return;
    }

    setIsFormattingText(true);
    try {
      const res = await fetch(`/api/format-content`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: rawText })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || "Fehler bei der KI-Formatierung");
      }
      
      const { formatted } = await res.json();

      if (type === 'project') {
        if (editingProject) setEditingProject(prev => ({ ...prev!, fullDescription: formatted }));
        else setNewProject(prev => ({ ...prev, fullDescription: formatted }));
      } else if (type === 'insight') {
        if (editingInsight) setEditingInsight(prev => ({ ...prev!, content: formatted }));
        else setNewInsight(prev => ({ ...prev, content: formatted }));
      } else if (type === 'landing') {
        if (editingLanding) setEditingLanding(prev => ({ ...prev!, content: formatted }));
        else setNewLanding(prev => ({ ...prev, content: formatted }));
      }
      
      setSaveMsg('✓ Text wurde von der KI formatiert');
      setTimeout(() => setSaveMsg(''), 3000);
    } catch (e: any) {
      console.error(e);
      alert("Fehler bei der KI-Formatierung: " + e.message);
    } finally {
      setIsFormattingText(false);
    }
  };

  // ─── Semantic Audit Helper ──────────────────────────────────────────────────
  const AuditFeedback = ({ title, content, keywords }: { title: string, content: string, keywords: string }) => {
    const issues: { msg: string, severity: 'warn' | 'error' }[] = [];
    
    if (title && title.length < 30) issues.push({ msg: 'Titel zu kurz für SEO (ideal: 50-60 Zeichen)', severity: 'warn' });
    if (content && content.length < 300) issues.push({ msg: 'Inhalt sehr kurz. Google bevorzugt ausführliche Texte (>600 Wörter)', severity: 'warn' });
    if (!keywords) issues.push({ msg: 'Keine Fokus-Keywords definiert', severity: 'error' });
    
    // Check if title contains at least one keyword
    if (keywords && title && !keywords.split(',').some(k => title.toLowerCase().includes(k.trim().toLowerCase()))) {
      issues.push({ msg: 'Titel enthält keines der Fokus-Keywords', severity: 'warn' });
    }
    
    // Check for H2 tags in markdown content
    if (content && !content.includes('## ')) {
      issues.push({ msg: 'Keine H2-Überschriften (##) im Text gefunden', severity: 'warn' });
    }

    if (issues.length === 0 && title && content) return (
      <div className="p-3 bg-green-50 border border-green-200 flex items-center gap-2 mb-4">
        <Check size={14} className="text-green-600" />
        <span className="font-mono text-[10px] text-green-700 uppercase tracking-widest">SEMANTIC_CHECK: OPTIMAL</span>
      </div>
    );

    if (issues.length === 0) return null;

    return (
      <div className="space-y-1 mb-4">
        <div className="telemetry-label mb-2 block font-bold text-red-500">SEMANTIC_AUDIT_REPORT</div>
        {issues.map((iss, i) => (
          <div key={i} className={`p-2 border font-mono text-[10px] flex items-center gap-2 ${iss.severity === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
            <span className="shrink-0">{iss.severity === 'error' ? '✖' : '⚠'}</span>
            {iss.msg}
          </div>
        ))}
      </div>
    );
  };

  // Landings CRUD
  const addLanding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) return;
    const item: LocationLanding = { ...newLanding, id: slugify(newLanding.city) || uid() };
    const updated = [...landings, item];
    setLandings(updated);
    await save('landings', updated, `Landing Page hinzugefügt: ${item.city}`);
    setNewLanding({ city:'', title:'', description:'', content:'', published: true, keywords: '' });
  };

  const updateLanding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLanding) return;
    const updated = landings.map(l => l.id === editingLanding.id ? editingLanding : l);
    setLandings(updated);
    await save('landings', updated, `Landing Page aktualisiert: ${editingLanding.city}`);
    setEditingLanding(null);
  };

  const deleteLanding = async (id: string) => {
    if (!confirm('Landing Page löschen?')) return;
    const updated = landings.filter(l => l.id !== id);
    setLandings(updated);
    await save('landings', updated, `Landing Page gelöscht: ${id}`);
  };

  // Projects CRUD
  const addProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    const item: Project = { ...newProject, id: slugify(newProject.title) || uid() };
    
    // 1. Write individual project file
    await writeItem(cfg!, 'projects', item.id, item, undefined, `Projekt hinzugefügt: ${item.title}`);
    
    // 2. Update index (without fullDescription)
    const indexItem = { ...item };
    delete indexItem.fullDescription;
    const updated = [...projects, indexItem];
    setProjects(updated);
    await save('projects', updated, `Projekt-Index aktualisiert: ${item.title}`);
    
    setNewProject({ title:'', category:'', image:'', description:'', fullDescription:'', completedAt:'', order: projects.length + 1, published: true, keywords: '', seoTitle: '', seoDescription: '' });
  };

  const updateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      setEditingProject(null);
      return;
    }

    // 1. Update individual project file
    const { sha } = await readItem(cfg!, 'projects', editingProject.id);
    await writeItem(cfg!, 'projects', editingProject.id, editingProject, sha, `Projekt aktualisiert: ${editingProject.title}`);

    // 2. Update index (without fullDescription)
    const indexItem = { ...editingProject };
    delete indexItem.fullDescription;
    const updated = projects.map(p => p.id === editingProject.id ? indexItem : p);
    setProjects(updated);
    await save('projects', updated, `Projekt-Index aktualisiert: ${editingProject.title}`);

    setEditingProject(null);
  };
  
  const deleteProject = async (id: string) => {
    if (!confirm('Projekt löschen?')) return;
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    // 1. Delete individual project file
    try {
      const { sha } = await readItem(cfg!, 'projects', id);
      await deleteFile(cfg!, `public/data/projects/${id}.json`, sha, `Projekt gelöscht: ${id}`);
    } catch (err) {
      console.error('Error deleting project file:', err);
    }
    
    // 2. Update index
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    await save('projects', updated, `Projekt-Index aktualisiert: ${id} entfernt`);
  };

  const startEditProject = async (id: string) => {
    try {
      if (isDemoMode) {
        const response = await fetch(`/data/projects/${id}.json`);
        const data = await response.json();
        setEditingProject(data);
      } else {
        const { data } = await readItem<Project>(cfg!, 'projects', id);
        setEditingProject(data);
      }
    } catch (err) {
      console.error('Error loading project:', err);
    }
  };

  // Insights CRUD
  const addInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    const item: Insight = { ...newInsight, id: slugify(newInsight.title) || uid() };
    
    // 1. Write individual insight file
    await writeItem(cfg!, 'insights', item.id, item, undefined, `Artikel hinzugefügt: ${item.title}`);
    
    // 2. Update index (without content)
    const indexItem = { ...item };
    delete indexItem.content;
    const updated = [...insights, indexItem];
    setInsights(updated);
    await save('insights', updated, `Artikel-Index aktualisiert: ${item.title}`);
    
    setNewInsight({ title:'', date: '', tag:'NEWS', author:'Oleh Kalchenko', content:'', published: true, keywords: '', seoTitle: '', seoDescription: '' });
  };

  const updateInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingInsight) return;
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      setEditingInsight(null);
      return;
    }

    // 1. Update individual insight file
    const { sha } = await readItem(cfg!, 'insights', editingInsight.id);
    await writeItem(cfg!, 'insights', editingInsight.id, editingInsight, sha, `Artikel aktualisiert: ${editingInsight.title}`);

    // 2. Update index (without content)
    const indexItem = { ...editingInsight };
    delete indexItem.content;
    const updated = insights.map(i => i.id === editingInsight.id ? indexItem : i);
    setInsights(updated);
    await save('insights', updated, `Artikel-Index aktualisiert: ${editingInsight.title}`);

    setEditingInsight(null);
  };
  
  const deleteInsight = async (id: string) => {
    if (!confirm('Artikel löschen?')) return;
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    
    // 1. Delete individual insight file
    try {
      const { sha } = await readItem(cfg!, 'insights', id);
      await deleteFile(cfg!, `public/data/insights/${id}.json`, sha, `Artikel gelöscht: ${id}`);
    } catch (err) {
      console.error('Error deleting insight file:', err);
    }
    
    // 2. Update index
    const updated = insights.filter(i => i.id !== id);
    setInsights(updated);
    await save('insights', updated, `Artikel-Index aktualisiert: ${id} entfernt`);
  };

  const startEditInsight = async (id: string) => {
    try {
      if (isDemoMode) {
        const response = await fetch(`/data/insights/${id}.json`);
        const data = await response.json();
        setEditingInsight(data);
      } else {
        const { data } = await readItem<Insight>(cfg!, 'insights', id);
        setEditingInsight(data);
      }
    } catch (err) {
      console.error('Error loading insight:', err);
    }
  };

  // Clients CRUD
  const addClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    const item: Client = { ...newClient, id: uid() };
    const updated = [...clients, item];
    setClients(updated);
    await save('clients', updated, `Kunde hinzugefügt: ${item.name}`);
    setNewClient({ name:'', link:'', order: clients.length + 1 });
  };

  const updateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClient) return;
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      setEditingClient(null);
      return;
    }
    const updated = clients.map(c => c.id === editingClient.id ? editingClient : c);
    setClients(updated);
    await save('clients', updated, `Kunde aktualisiert: ${editingClient.name}`);
    setEditingClient(null);
  };

  const deleteClient = async (id: string) => {
    if (!confirm('Kunde löschen?')) return;
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    const updated = clients.filter(c => c.id !== id);
    setClients(updated);
    await save('clients', updated, `Kunde gelöscht: ${id}`);
  };

  // FAQs CRUD
  const addFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    const item: Faq = { ...newFaq, id: uid() };
    const updated = [...faqs, item];
    setFaqs(updated);
    await save('faqs', updated, `FAQ hinzugefügt`);
    setNewFaq({ question:'', answer:'', order: faqs.length + 1 });
  };

  const updateFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      setEditingFaq(null);
      return;
    }
    const updated = faqs.map(f => f.id === editingFaq.id ? editingFaq : f);
    setFaqs(updated);
    await save('faqs', updated, `FAQ aktualisiert`);
    setEditingFaq(null);
  };

  const deleteFaq = async (id: string) => {
    if (!confirm('FAQ löschen?')) return;
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    const updated = faqs.filter(f => f.id !== id);
    setFaqs(updated);
    await save('faqs', updated, `FAQ gelöscht: ${id}`);
  };

  // Settings save
  const saveSettings = async () => {
    if (isDemoMode) {
      setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
      setTimeout(() => setSaveMsg(''), 3000);
      return;
    }
    await save('settings', settings, 'Einstellungen aktualisiert');
  };

  if (!cfg && !isDemoMode) return <LoginScreen onLogin={setCfg} onDemoMode={() => setIsDemoMode(true)} />;

  const tabs: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: 'ÜBERSICHT' },
    { id: 'projects',  label: 'PORTFOLIO' },
    { id: 'insights',  label: 'JOURNAL' },
    { id: 'landings',  label: 'LANDINGS' },
    { id: 'clients',   label: 'KUNDEN' },
    { id: 'faqs',      label: 'FAQ' },
    { id: 'special-offer', label: 'ANGEBOT' },
    { id: 'privacy',   label: 'DATENSCHUTZ' },
    { id: 'impressum', label: 'IMPRESSUM' },
    { id: 'settings',  label: 'EINSTELLUNGEN' },
  ];

  return (
    <div className="min-h-screen bg-[#F1F3EA]">
      {/* Top bar */}
      <div className="border-b border-[#C5C5C5] bg-white sticky top-0 z-40 px-4 md:px-8 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 pr-4 border-r border-[#C5C5C5]">
            <LayoutDashboard size={16} />
            <span className="font-mono text-[11px] font-bold uppercase tracking-widest hidden sm:block">
              OK STUDIO // ADMIN {isDemoMode && <span className="text-orange-500">// DEMO</span>}
            </span>
          </div>
          <div className="flex gap-1 flex-wrap">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`font-mono text-[9px] tracking-widest px-3 py-1.5 border transition-all ${tab === t.id ? 'bg-[#616752] text-white border-[#616752]' : 'border-transparent text-[#616752] hover:border-[#C5C5C5]'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {isDemoMode && (
            <span className="font-mono text-[9px] text-orange-500 bg-orange-50 px-2 py-1 border border-orange-200">
              NUR ANSICHT
            </span>
          )}
          {saveMsg && <span className={`font-mono text-[9px] ${saveMsg.startsWith('✓') ? 'text-green-600' : saveMsg.startsWith('⚠') ? 'text-orange-500' : 'text-red-500'}`}>{saveMsg}</span>}
          {saving && <Loader2 size={14} className="animate-spin text-[#616752]" />}
          <button onClick={() => { 
            clearGithubConfig(); 
            setPasswordAuth(false);
            setCfg(null);
            setIsDemoMode(false);
            setIsAuthenticated(false);
          }}
            className="p-2 border border-transparent hover:border-red-100 hover:bg-red-50 text-red-500 transition-colors">
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
        {!dataLoaded ? (
          <div className="flex items-center justify-center min-h-[40vh] gap-3 font-mono">
            <Loader2 className="animate-spin" size={20} />
            <span className="telemetry-label animate-pulse">
              {isDemoMode ? 'LADE LOKALE DATEN...' : 'LADE DATEN VON GITHUB...'}
            </span>
          </div>
        ) : (
          <>
            {/* ── DASHBOARD ── */}
            {tab === 'dashboard' && (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'PROJEKTE', val: projects.length },
                    { label: 'ARTIKEL', val: insights.length },
                    { label: 'KUNDEN', val: clients.length },
                    { label: 'FAQS', val: faqs.length },
                  ].map(m => (
                    <div key={m.label} className="border border-[#C5C5C5] p-6 bg-white">
                      <span className="telemetry-label block mb-2 opacity-50">{m.label}</span>
                      <span className="font-display font-black text-4xl">{m.val}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-[#C5C5C5] p-6 bg-white">
                    <span className="telemetry-label block mb-2 opacity-50">DATENSCHUTZ</span>
                    <span className="font-display font-black text-4xl">{privacy.sections.length}</span>
                    <span className="font-mono text-[9px] opacity-40 block mt-1">Abschnitte</span>
                  </div>
                  <div className="border border-[#C5C5C5] p-6 bg-white">
                    <span className="telemetry-label block mb-2 opacity-50">IMPRESSUM</span>
                    <span className="font-display font-black text-4xl">{impressum.sections.length}</span>
                    <span className="font-mono text-[9px] opacity-40 block mt-1">Abschnitte</span>
                  </div>
                </div>
                <div className="border border-[#C5C5C5] p-6 bg-white">
                  <span className="telemetry-label block mb-3 font-bold">REPOSITORY</span>
                  <p className="font-mono text-[11px] opacity-60">
                    {isDemoMode ? (
                      'Demo Modus — Lokale Daten aus public/data/'
                    ) : cfg ? (
                      `${cfg.owner}/${cfg.repo} @ ${cfg.branch} — Jede Änderung committet direkt ins Repository und triggert automatisch einen Redeploy.`
                    ) : (
                      'Keine Verbindung'
                    )}
                  </p>
                </div>
                
                {/* IndexNow Integration */}
                <div className="border border-[#C5C5C5] p-6 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="telemetry-label block mb-1 font-bold">INDEXNOW</span>
                      <p className="font-mono text-[9px] opacity-60">
                        Мгновенное уведомление поисковиков о новых страницах
                      </p>
                    </div>
                    <button
                      onClick={async () => {
                        setSaveMsg('⏳ Отправка в IndexNow...');
                        try {
                          const { reindexEntireSite } = await import('../lib/indexnow');
                          const result = await reindexEntireSite();
                          setSaveMsg(result.message);
                          setTimeout(() => setSaveMsg(''), 5000);
                        } catch (error) {
                          setSaveMsg(`❌ Ошибка: ${error}`);
                          setTimeout(() => setSaveMsg(''), 5000);
                        }
                      }}
                      className="px-4 py-2 bg-[#616752] text-white font-mono text-[10px] tracking-wider hover:bg-[#737A5E] transition-colors flex items-center gap-2"
                    >
                      <Zap size={14} />
                      ПЕРЕИНДЕКСИРОВАТЬ САЙТ
                    </button>
                  </div>
                  <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-3 font-mono text-[9px] space-y-1">
                    <div className="font-bold mb-1">ЧТО ЭТО ДЕЛАЕТ:</div>
                    <div>✓ Отправляет все URL сайта в Google, Bing, Yandex</div>
                    <div>✓ Ускоряет индексацию с недель до часов</div>
                    <div>✓ Бесплатно и безопасно</div>
                    <div className="text-purple-600 mt-2">💡 Нажимай после добавления нового контента</div>
                  </div>
                </div>
              </div>
            )}

            {/* ── PROJECTS ── */}
            {tab === 'projects' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="border border-[#C5C5C5] p-6 bg-white sticky top-24">
                    <h2 className="font-display font-black text-xl uppercase mb-6">
                      {editingProject ? 'Projekt bearbeiten' : 'Neues Projekt'}
                    </h2>
                    <form onSubmit={editingProject ? updateProject : addProject} className="space-y-3">
                      <input className="admin-input" placeholder="Titel" value={editingProject ? editingProject.title : newProject.title} onChange={e => editingProject ? setEditingProject({...editingProject, title: e.target.value}) : setNewProject({...newProject, title: e.target.value})} required />
                      <input className="admin-input" placeholder="Kategorie" value={editingProject ? editingProject.category : newProject.category} onChange={e => editingProject ? setEditingProject({...editingProject, category: e.target.value}) : setNewProject({...newProject, category: e.target.value})} required />
                      <input className="admin-input" placeholder="Bild-URL" value={editingProject ? editingProject.image : newProject.image} onChange={e => editingProject ? setEditingProject({...editingProject, image: e.target.value}) : setNewProject({...newProject, image: e.target.value})} />
                      <input className="admin-input" placeholder="Abgeschlossen (z.B. MRZ 2025)" value={editingProject ? editingProject.completedAt : newProject.completedAt} onChange={e => editingProject ? setEditingProject({...editingProject, completedAt: e.target.value}) : setNewProject({...newProject, completedAt: e.target.value})} />
                      
                      <div className="border border-[#C5C5C5] p-4 bg-[#F1F3EA] space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="telemetry-label block font-bold">SEO_OPTIMIERUNG</span>
                          <button type="button" onClick={() => generateSEO('project', editingProject ? (editingProject.fullDescription || editingProject.description) : (newProject.fullDescription || newProject.description))} disabled={isGeneratingSEO} className="bg-[#A467D2] text-white px-3 py-1 font-mono text-[9px] hover:opacity-90 disabled:opacity-50 transition-opacity">
                            {isGeneratingSEO ? 'LÄDT...' : '✨ KI GENERIEREN'}
                          </button>
                        </div>
                        <div>
                          <input className="admin-input bg-white" placeholder="Fokus-Keywords (kommagetrennt)" value={editingProject ? editingProject.keywords : newProject.keywords} onChange={e => editingProject ? setEditingProject({...editingProject, keywords: e.target.value}) : setNewProject({...newProject, keywords: e.target.value})} />
                          <div className="mt-1.5 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                            <div className="font-bold mb-1">Was muss ich hier eintragen?</div>
                            <ul className="list-disc pl-3 space-y-1 opacity-90">
                              <li>Die wichtigsten 1-3 Suchbegriffe, unter denen diese Seite bei Google gefunden werden soll.</li>
                              <li><strong>Beispiel:</strong> "webdesign siegen, kmu website" (durch Komma getrennt).</li>
                              <li><strong>Wozu?</strong> Das System prüft Ihren Text anhand dieser Wörter und verlinkt automatisch passende Artikel.</li>
                            </ul>
                          </div>
                        </div>
                        <div>
                          <input className="admin-input bg-white" placeholder="SEO Titel (optional)" value={editingProject ? editingProject.seoTitle : newProject.seoTitle} onChange={e => editingProject ? setEditingProject({...editingProject, seoTitle: e.target.value}) : setNewProject({...newProject, seoTitle: e.target.value})} />
                          <div className="mt-1.5 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                            <div className="font-bold mb-1">Der blaue Link bei Google</div>
                            <ul className="list-disc pl-3 space-y-1 opacity-90">
                              <li>Hier schreiben Sie den perfekten Titel für die Suchmaschine.</li>
                              <li><strong>Regel:</strong> Haupt-Keyword vorne, Firmenname hinten (z.B. "Webdesign Kreuztal | OK Studio").</li>
                              <li>Maximal 60 Zeichen. <em>Lassen Sie es leer, um automatisch den normalen Titel zu nutzen.</em></li>
                            </ul>
                          </div>
                        </div>
                        <div>
                          <textarea className="admin-input bg-white h-16" placeholder="SEO Beschreibung (optional)" value={editingProject ? editingProject.seoDescription : newProject.seoDescription} onChange={e => editingProject ? setEditingProject({...editingProject, seoDescription: e.target.value}) : setNewProject({...newProject, seoDescription: e.target.value})} />
                          <div className="mt-1.5 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                            <div className="font-bold mb-1">Der graue Text bei Google (Snippet)</div>
                            <ul className="list-disc pl-3 space-y-1 opacity-90">
                              <li>Fassen Sie den Inhalt in 1-2 Sätzen spannend zusammen, damit Nutzer klicken wollen.</li>
                              <li>Bauen Sie Ihr Fokus-Keyword hier unbedingt mit ein!</li>
                              <li>Optimal: 150-160 Zeichen.</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 pt-2">
                          <input type="checkbox" id="proj-pub" checked={editingProject ? editingProject.published : newProject.published} onChange={e => editingProject ? setEditingProject({...editingProject, published: e.target.checked}) : setNewProject({...newProject, published: e.target.checked})} className="mt-1" />
                          <div>
                            <label htmlFor="proj-pub" className="telemetry-label cursor-pointer block">ÖFFENTLICH SICHTBAR</label>
                            <div className="mt-1 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                              <div className="font-bold mb-0.5">Achtung: Entwurfs-Modus (DRAFT)</div>
                              <div className="opacity-90">Häkchen entfernen, wenn die Seite noch nicht fertig ist. Sie ist dann für Besucher und Google komplett unsichtbar.</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <AuditFeedback 
                        title={editingProject ? editingProject.title : newProject.title} 
                        content={editingProject ? editingProject.fullDescription || '' : newProject.fullDescription || ''} 
                        keywords={editingProject ? editingProject.keywords || '' : newProject.keywords || ''} 
                      />

                      <textarea className="admin-input h-16" placeholder="Kurzbeschreibung" value={editingProject ? editingProject.description : newProject.description} onChange={e => editingProject ? setEditingProject({...editingProject, description: e.target.value}) : setNewProject({...newProject, description: e.target.value})} />
                      
                      {/* Markdown field with AI helper */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="telemetry-label text-[9px] block">VOLLTEXT (MARKDOWN)</label>
                          <button
                            type="button"
                            onClick={() => formatContent('project', editingProject ? editingProject.fullDescription : newProject.fullDescription)}
                            disabled={isFormattingText}
                            className="px-3 py-1 bg-purple-500 text-white font-mono text-[9px] tracking-wider hover:bg-purple-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <Zap size={12} className={isFormattingText ? 'animate-pulse' : ''} />
                            {isFormattingText ? 'LÄDT...' : 'AI FORMATIERUNG'}
                          </button>
                        </div>
                        <textarea className="admin-input h-40 font-mono text-xs" placeholder="Volltext mit Markdown-Formatierung&#10;&#10;## Überschrift&#10;Text hier...&#10;&#10;**Fett** *Kursiv*&#10;- Listenpunkt" value={editingProject ? editingProject.fullDescription : newProject.fullDescription} onChange={e => editingProject ? setEditingProject({...editingProject, fullDescription: e.target.value}) : setNewProject({...newProject, fullDescription: e.target.value})} />
                        <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-3 font-mono text-[9px] space-y-1">
                          <div className="font-bold mb-1">MARKDOWN FORMATIERUNG:</div>
                          <div>## Überschrift | **fett** | *kursiv* | - Liste | &gt; Zitat | [Link](url)</div>
                          <div className="text-purple-600 mt-2">💡 Klicke "AI FORMATIERUNG" → Füge Prompt + Text in ChatGPT/Claude ein → Kopiere Ergebnis hierher</div>
                        </div>
                      </div>
                      
                      <input className="admin-input" type="number" placeholder="Reihenfolge" value={editingProject ? editingProject.order : newProject.order} onChange={e => editingProject ? setEditingProject({...editingProject, order: +e.target.value}) : setNewProject({...newProject, order: +e.target.value})} />
                      <div className="flex gap-2">
                        <button type="submit" disabled={saving} className="flex-1 bg-[#616752] text-white py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50">
                          {saving ? 'SPEICHERT...' : (editingProject ? 'AKTUALISIEREN' : 'SPEICHERN & DEPLOYEN')}
                        </button>
                        {editingProject && (
                          <button type="button" onClick={() => setEditingProject(null)} className="px-4 bg-gray-300 text-gray-700 py-3 font-mono text-[10px] tracking-widest hover:opacity-90">
                            ABBRECHEN
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-3">
                  {projects.sort((a,b) => a.order - b.order).map(p => (
                    <div key={p.id} className="border border-[#C5C5C5] p-5 bg-white flex gap-4 items-center group hover:border-[#616752] transition-colors">
                      {p.image && <img src={p.image} loading="lazy" width="64" height="64" alt={p.title} className="w-16 h-16 object-cover grayscale shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold uppercase truncate">{p.title}</h3>
                          {!p.published && <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 font-mono">DRAFT</span>}
                        </div>
                        <p className="font-mono text-[9px] opacity-40">{p.category} · {p.completedAt}</p>
                      </div>
                      <button onClick={() => startEditProject(p.id)} className="shrink-0 p-2 text-blue-300 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => deleteProject(p.id)} className="shrink-0 p-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── LANDINGS ── */}
            {tab === 'landings' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="border border-[#C5C5C5] p-6 bg-white sticky top-24">
                    <h2 className="font-display font-black text-xl uppercase mb-6">
                      {editingLanding ? 'Landing Page bearbeiten' : 'Neue Landing Page'}
                    </h2>
                    <form onSubmit={editingLanding ? updateLanding : addLanding} className="space-y-3">
                      <input className="admin-input" placeholder="Stadt (z.B. Kreuztal)" value={editingLanding ? editingLanding.city : newLanding.city} onChange={e => editingLanding ? setEditingLanding({...editingLanding, city: e.target.value}) : setNewLanding({...newLanding, city: e.target.value})} required />
                      <input className="admin-input" placeholder="H1 Titel" value={editingLanding ? editingLanding.title : newLanding.title} onChange={e => editingLanding ? setEditingLanding({...editingLanding, title: e.target.value}) : setNewLanding({...newLanding, title: e.target.value})} required />
                      
                      <div className="border border-[#C5C5C5] p-4 bg-[#F1F3EA] space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="telemetry-label block font-bold">SEO_OPTIMIERUNG</span>
                          <button type="button" onClick={() => generateSEO('landing', editingLanding ? editingLanding.content : newLanding.content)} disabled={isGeneratingSEO} className="bg-[#A467D2] text-white px-3 py-1 font-mono text-[9px] hover:opacity-90 disabled:opacity-50 transition-opacity">
                            {isGeneratingSEO ? 'LÄDT...' : '✨ KI GENERIEREN'}
                          </button>
                        </div>
                        <div>
                          <input className="admin-input bg-white" placeholder="Fokus-Keywords (kommagetrennt)" value={editingLanding ? editingLanding.keywords : newLanding.keywords} onChange={e => editingLanding ? setEditingLanding({...editingLanding, keywords: e.target.value}) : setNewLanding({...newLanding, keywords: e.target.value})} />
                          <div className="mt-1.5 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                            <div className="font-bold mb-1">Was muss ich hier eintragen?</div>
                            <ul className="list-disc pl-3 space-y-1 opacity-90">
                              <li>Die wichtigsten 1-3 Suchbegriffe, unter denen diese Seite bei Google gefunden werden soll.</li>
                              <li><strong>Beispiel:</strong> "webdesign siegen, kmu website" (durch Komma getrennt).</li>
                              <li><strong>Wozu?</strong> Das System prüft Ihren Text anhand dieser Wörter und verlinkt automatisch passende Artikel.</li>
                            </ul>
                          </div>
                        </div>
                        <div>
                          <textarea className="admin-input bg-white h-16" placeholder="SEO Beschreibung" value={editingLanding ? editingLanding.description : newLanding.description} onChange={e => editingLanding ? setEditingLanding({...editingLanding, description: e.target.value}) : setNewLanding({...newLanding, description: e.target.value})} />
                          <div className="mt-1.5 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                            <div className="font-bold mb-1">Der graue Text bei Google (Snippet)</div>
                            <ul className="list-disc pl-3 space-y-1 opacity-90">
                              <li>Fassen Sie den Inhalt in 1-2 Sätzen spannend zusammen, damit Nutzer klicken wollen.</li>
                              <li>Bauen Sie Ihr Fokus-Keyword hier unbedingt mit ein!</li>
                              <li>Optimal: 150-160 Zeichen.</li>
                            </ul>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 pt-2">
                          <input type="checkbox" id="land-pub" checked={editingLanding ? editingLanding.published : newLanding.published} onChange={e => editingLanding ? setEditingLanding({...editingLanding, published: e.target.checked}) : setNewLanding({...newLanding, published: e.target.checked})} className="mt-1" />
                          <div>
                            <label htmlFor="land-pub" className="telemetry-label cursor-pointer block">ÖFFENTLICH SICHTBAR</label>
                            <div className="mt-1 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                              <div className="font-bold mb-0.5">Achtung: Entwurfs-Modus (DRAFT)</div>
                              <div className="opacity-90">Häkchen entfernen, wenn die Seite noch nicht fertig ist. Sie ist dann für Besucher und Google komplett unsichtbar.</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <AuditFeedback 
                        title={editingLanding ? editingLanding.title : newLanding.title} 
                        content={editingLanding ? editingLanding.content : newLanding.content} 
                        keywords={editingLanding ? editingLanding.keywords : newLanding.keywords} 
                      />

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="telemetry-label text-[9px] block uppercase opacity-60">Landing Page Content (Markdown)</label>
                          <button
                            type="button"
                            onClick={() => formatContent('landing', editingLanding ? editingLanding.content : newLanding.content)}
                            disabled={isFormattingText}
                            className="px-3 py-1 bg-purple-500 text-white font-mono text-[9px] tracking-wider hover:bg-purple-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                          >
                            <Zap size={12} className={isFormattingText ? 'animate-pulse' : ''} />
                            {isFormattingText ? 'LÄDT...' : 'AI FORMATIERUNG'}
                          </button>
                        </div>
                        <textarea className="admin-input h-64 font-mono text-xs" placeholder="Inhalt (Markdown)" value={editingLanding ? editingLanding.content : newLanding.content} onChange={e => editingLanding ? setEditingLanding({...editingLanding, content: e.target.value}) : setNewLanding({...newLanding, content: e.target.value})} required />
                      </div>
                      
                      <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-[#616752] text-white py-3 font-mono text-[10px] tracking-widest hover:opacity-90">
                          {editingLanding ? 'AKTUALISIEREN' : 'ERSTELLEN'}
                        </button>
                        {editingLanding && (
                          <button type="button" onClick={() => setEditingLanding(null)} className="px-4 bg-gray-300 text-gray-700 py-3 font-mono text-[10px] tracking-widest hover:opacity-90">
                            ABBRECHEN
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-3">
                  <div className="bg-[#616752] p-4 text-[#F1F3EA] font-mono text-[10px] mb-4">
                    💡 LOCAL SEO TIP: Erstelle spezifische Seiten für Städte (Kreuztal, Siegen, Olpe), um für regionale Suchanfragen besser zu ranken.
                  </div>
                  {landings.map(l => (
                    <div key={l.id} className="border border-[#C5C5C5] p-5 bg-white flex gap-4 items-center group hover:border-[#616752] transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display font-bold uppercase truncate">{l.city} — {l.title}</h3>
                          {!l.published && <span className="bg-red-500 text-white text-[8px] px-1.5 py-0.5 font-mono">DRAFT</span>}
                        </div>
                        <p className="font-mono text-[9px] opacity-40">URL: /local/{l.id}</p>
                      </div>
                      <button onClick={() => setEditingLanding(l)} className="shrink-0 p-2 text-blue-300 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => deleteLanding(l.id)} className="shrink-0 p-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                  {landings.length === 0 && (
                    <div className="border-2 border-dashed border-[#C5C5C5] p-12 text-center opacity-30 font-mono text-sm">
                      KEINE LOCAL LANDINGS DEFINIERT
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ── INSIGHTS ── */}
            {tab === 'insights' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="border border-[#C5C5C5] p-6 bg-white sticky top-24">
                    <h2 className="font-display font-black text-xl uppercase mb-6">
                      {editingInsight ? 'Artikel bearbeiten' : 'Neuer Artikel'}
                    </h2>
                    <form onSubmit={editingInsight ? updateInsight : addInsight} className="space-y-3">
                      <input className="admin-input" placeholder="Titel" value={editingInsight ? editingInsight.title : newInsight.title} onChange={e => editingInsight ? setEditingInsight({...editingInsight, title: e.target.value}) : setNewInsight({...newInsight, title: e.target.value})} required />
                      <div className="grid grid-cols-2 gap-3">
                        <input className="admin-input" placeholder="Datum (z.B. Mai 2025)" value={editingInsight ? editingInsight.date : newInsight.date} onChange={e => editingInsight ? setEditingInsight({...editingInsight, date: e.target.value}) : setNewInsight({...newInsight, date: e.target.value})} required />
                        <input className="admin-input" placeholder="Tag (z.B. KI)" value={editingInsight ? editingInsight.tag : newInsight.tag} onChange={e => editingInsight ? setEditingInsight({...editingInsight, tag: e.target.value}) : setNewInsight({...newInsight, tag: e.target.value})} />
                      </div>
                      <input className="admin-input" placeholder="Autor" value={editingInsight ? editingInsight.author : newInsight.author} onChange={e => editingInsight ? setEditingInsight({...editingInsight, author: e.target.value}) : setNewInsight({...newInsight, author: e.target.value})} />
                      
                      <div className="border border-[#C5C5C5] p-4 bg-[#F1F3EA] space-y-3">
                        <div className="flex items-center justify-between mb-2">
                          <span className="telemetry-label block font-bold">SEO_OPTIMIERUNG</span>
                          <button type="button" onClick={() => generateSEO('insight', editingInsight ? editingInsight.content || '' : newInsight.content || '')} disabled={isGeneratingSEO} className="bg-[#A467D2] text-white px-3 py-1 font-mono text-[9px] hover:opacity-90 disabled:opacity-50 transition-opacity">
                            {isGeneratingSEO ? 'LÄDT...' : '✨ KI GENERIEREN'}
                          </button>
                        </div>
                        <div>
                          <input className="admin-input bg-white" placeholder="Fokus-Keywords (kommagetrennt)" value={editingInsight ? editingInsight.keywords : newInsight.keywords} onChange={e => editingInsight ? setEditingInsight({...editingInsight, keywords: e.target.value}) : setNewInsight({...newInsight, keywords: e.target.value})} />
                          <div className="mt-1.5 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                            <div className="font-bold mb-1">Was muss ich hier eintragen?</div>
                            <ul className="list-disc pl-3 space-y-1 opacity-90">
                              <li>Die wichtigsten 1-3 Suchbegriffe, unter denen diese Seite bei Google gefunden werden soll.</li>
                              <li><strong>Beispiel:</strong> "webdesign siegen, kmu website" (durch Komma getrennt).</li>
                              <li><strong>Wozu?</strong> Das System prüft Ihren Text anhand dieser Wörter und verlinkt automatisch passende Artikel.</li>
                            </ul>
                          </div>
                        </div>
                        <div>
                          <input className="admin-input bg-white" placeholder="SEO Titel (optional)" value={editingInsight ? editingInsight.seoTitle : newInsight.seoTitle} onChange={e => editingInsight ? setEditingInsight({...editingInsight, seoTitle: e.target.value}) : setNewInsight({...newInsight, seoTitle: e.target.value})} />
                          <div className="mt-1.5 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                            <div className="font-bold mb-1">Der blaue Link bei Google</div>
                            <ul className="list-disc pl-3 space-y-1 opacity-90">
                              <li>Hier schreiben Sie den perfekten Titel für die Suchmaschine.</li>
                              <li><strong>Regel:</strong> Haupt-Keyword vorne, Firmenname hinten (z.B. "Webdesign Kreuztal | OK Studio").</li>
                              <li>Maximal 60 Zeichen. <em>Lassen Sie es leer, um automatisch den normalen Titel zu nutzen.</em></li>
                            </ul>
                          </div>
                        </div>
                        <div>
                          <textarea className="admin-input bg-white h-16" placeholder="SEO Beschreibung (optional)" value={editingInsight ? editingInsight.seoDescription : newInsight.seoDescription} onChange={e => editingInsight ? setEditingInsight({...editingInsight, seoDescription: e.target.value}) : setNewInsight({...newInsight, seoDescription: e.target.value})} />
                          <div className="mt-1.5 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                            <div className="font-bold mb-1">Der graue Text bei Google (Snippet)</div>
                            <ul className="list-disc pl-3 space-y-1 opacity-90">
                              <li>Fassen Sie den Inhalt in 1-2 Sätzen spannend zusammen, damit Nutzer klicken wollen.</li>
                              <li>Bauen Sie Ihr Fokus-Keyword hier unbedingt mit ein!</li>
                              <li>Optimal: 150-160 Zeichen.</li>
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-2 pt-2">
                          <input type="checkbox" id="ins-pub" checked={editingInsight ? editingInsight.published : newInsight.published} onChange={e => editingInsight ? setEditingInsight({...editingInsight, published: e.target.checked}) : setNewInsight({...newInsight, published: e.target.checked})} className="mt-1" />
                          <div>
                            <label htmlFor="ins-pub" className="telemetry-label cursor-pointer block">ÖFFENTLICH SICHTBAR</label>
                            <div className="mt-1 text-[10px] bg-white/60 p-2 border border-[#C5C5C5] text-[#141414]">
                              <div className="font-bold mb-0.5">Achtung: Entwurfs-Modus (DRAFT)</div>
                              <div className="opacity-90">Häkchen entfernen, wenn die Seite noch nicht fertig ist. Sie ist dann für Besucher und Google komplett unsichtbar.</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <AuditFeedback 
                        title={editingInsight ? editingInsight.title : newInsight.title} 
                        content={editingInsight ? editingInsight.content || '' : newInsight.content || ''} 
                        keywords={editingInsight ? editingInsight.keywords || '' : newInsight.keywords || ''} 
                      />
                      
                      {/* Markdown Editor with Preview */}
                      <div className="space-y-2">
                        <div className="flex gap-2 items-center justify-between flex-wrap">
                          <div className="flex gap-2">
                            <button type="button" onClick={() => setShowPreview(false)} className={`px-3 py-1 font-mono text-[9px] border ${!showPreview ? 'bg-[#616752] text-white border-[#616752]' : 'bg-white text-gray-600 border-[#C5C5C5]'}`}>
                              EDITOR
                            </button>
                            <button type="button" onClick={() => setShowPreview(true)} className={`px-3 py-1 font-mono text-[9px] border ${showPreview ? 'bg-[#616752] text-white border-[#616752]' : 'bg-white text-gray-600 border-[#C5C5C5]'}`}>
                              VORSCHAU
                            </button>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => formatContent('insight', editingInsight ? editingInsight.content : newInsight.content)}
                              disabled={isFormattingText}
                              className="px-3 py-1 bg-purple-500 text-white font-mono text-[9px] tracking-wider hover:bg-purple-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                            >
                              <Zap size={12} className={isFormattingText ? 'animate-pulse' : ''} />
                              {isFormattingText ? 'LÄDT...' : 'AI FORMATIERUNG'}
                            </button>
                            <button type="button" onClick={() => setShowMarkdownHelp(!showMarkdownHelp)} className="font-mono text-[9px] text-[#616752] hover:underline">
                              {showMarkdownHelp ? 'HILFE AUSBLENDEN' : 'MARKDOWN HILFE'}
                            </button>
                          </div>
                        </div>
                        
                        {showMarkdownHelp && (
                          <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-4 font-mono text-[10px] space-y-2">
                            <div><strong>## Überschrift</strong> → Große Überschrift</div>
                            <div><strong>### Unterüberschrift</strong> → Kleinere Überschrift</div>
                            <div><strong>**fett**</strong> → <strong>fett</strong></div>
                            <div><strong>*kursiv*</strong> → <em>kursiv</em></div>
                            <div><strong>- Listenpunkt</strong> → Aufzählung</div>
                            <div><strong>&gt; Zitat</strong> → Blockzitat</div>
                            <div><strong>[Link](url)</strong> → Hyperlink</div>
                            <div className="text-purple-600 mt-2 pt-2 border-t border-[#C5C5C5]">💡 Klicke "AI FORMATIERUNG" → Füge Prompt + Text in ChatGPT/Claude ein → Kopiere Ergebnis hierher</div>
                          </div>
                        )}
                        
                        {!showPreview ? (
                          <textarea 
                            className="admin-input h-64 font-mono text-xs" 
                            placeholder="Inhalt (Markdown)&#10;&#10;## Überschrift&#10;Text hier...&#10;&#10;### Unterüberschrift&#10;- Punkt 1&#10;- Punkt 2" 
                            value={editingInsight ? editingInsight.content : newInsight.content} 
                            onChange={e => editingInsight ? setEditingInsight({...editingInsight, content: e.target.value}) : setNewInsight({...newInsight, content: e.target.value})} 
                          />
                        ) : (
                          <div className="admin-input h-64 overflow-y-auto prose prose-sm max-w-none admin-preview">
                            {(editingInsight?.content || newInsight.content) ? (
                              <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                components={{
                                  a: ({ node, ...props }) => (
                                    <a 
                                      {...props} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="admin-link"
                                    />
                                  ),
                                }}
                              >
                                {editingInsight?.content || newInsight.content}
                              </ReactMarkdown>
                            ) : (
                              <p className="text-gray-400 italic">Keine Vorschau verfügbar. Schreiben Sie Markdown-Inhalt im Editor.</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <button type="submit" disabled={saving} className="flex-1 bg-[#616752] text-white py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50">
                          {saving ? 'SPEICHERT...' : (editingInsight ? 'AKTUALISIEREN' : 'PUBLIZIEREN & DEPLOYEN')}
                        </button>
                        {editingInsight && (
                          <button type="button" onClick={() => setEditingInsight(null)} className="px-4 bg-gray-300 text-gray-700 py-3 font-mono text-[10px] tracking-widest hover:opacity-90">
                            ABBRECHEN
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-3">
                  {insights.map(i => (
                    <div key={i.id} className="border border-[#C5C5C5] p-5 bg-white flex gap-4 items-center group hover:border-[#616752] transition-colors">
                      <div className="w-10 h-10 bg-[#F1F3EA] border border-[#C5C5C5] flex items-center justify-center shrink-0">
                        <FileText size={16} className="opacity-30" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-display font-bold uppercase text-sm truncate">{i.title}</h3>
                        <p className="font-mono text-[9px] opacity-40">{i.date} · {i.tag}</p>
                      </div>
                      <button onClick={() => startEditInsight(i.id)} className="shrink-0 p-2 text-blue-300 hover:text-blue-600 transition-colors"><Edit2 size={16} /></button>
                      <button onClick={() => deleteInsight(i.id)} className="shrink-0 p-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={16} /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── CLIENTS ── */}
            {tab === 'clients' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="border border-[#C5C5C5] p-6 bg-white sticky top-24">
                    <h2 className="font-display font-black text-xl uppercase mb-6">
                      {editingClient ? 'Kunde bearbeiten' : 'Neuer Kunde'}
                    </h2>
                    <form onSubmit={editingClient ? updateClient : addClient} className="space-y-3">
                      <input className="admin-input" placeholder="Name" value={editingClient ? editingClient.name : newClient.name} onChange={e => editingClient ? setEditingClient({...editingClient, name: e.target.value}) : setNewClient({...newClient, name: e.target.value})} required />
                      <input className="admin-input" placeholder="Website (optional)" value={editingClient ? editingClient.link : newClient.link} onChange={e => editingClient ? setEditingClient({...editingClient, link: e.target.value}) : setNewClient({...newClient, link: e.target.value})} />
                      <input className="admin-input" type="number" placeholder="Reihenfolge" value={editingClient ? editingClient.order : newClient.order} onChange={e => editingClient ? setEditingClient({...editingClient, order: +e.target.value}) : setNewClient({...newClient, order: +e.target.value})} />
                      <div className="flex gap-2">
                        <button type="submit" disabled={saving} className="flex-1 bg-[#616752] text-white py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50">
                          {saving ? 'SPEICHERT...' : (editingClient ? 'AKTUALISIEREN' : 'HINZUFÜGEN & DEPLOYEN')}
                        </button>
                        {editingClient && (
                          <button type="button" onClick={() => setEditingClient(null)} className="px-4 bg-gray-300 text-gray-700 py-3 font-mono text-[10px] tracking-widest hover:opacity-90">
                            ABBRECHEN
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {clients.sort((a,b) => a.order - b.order).map(c => (
                    <div key={c.id} className="border border-[#C5C5C5] p-5 bg-white flex items-center justify-between group hover:border-[#616752] transition-colors">
                      <div className="flex items-center gap-3">
                        <Globe size={16} className="opacity-20" />
                        <span className="font-display font-bold uppercase">{c.name}</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => setEditingClient(c)} className="p-2 text-blue-300 hover:text-blue-600 transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => deleteClient(c.id)} className="p-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── FAQS ── */}
            {tab === 'faqs' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4">
                  <div className="border border-[#C5C5C5] p-6 bg-white sticky top-24">
                    <h2 className="font-display font-black text-xl uppercase mb-6">
                      {editingFaq ? 'FAQ bearbeiten' : 'Neue FAQ'}
                    </h2>
                    <form onSubmit={editingFaq ? updateFaq : addFaq} className="space-y-3">
                      <input className="admin-input" placeholder="Frage" value={editingFaq ? editingFaq.question : newFaq.question} onChange={e => editingFaq ? setEditingFaq({...editingFaq, question: e.target.value}) : setNewFaq({...newFaq, question: e.target.value})} required />
                      
                      {/* Answer field with formatting hint */}
                      <div className="space-y-2">
                        <label className="telemetry-label text-[9px] block">ANTWORT (PLAIN TEXT)</label>
                        <textarea className="admin-input h-28" placeholder="Antwort auf die Frage (normaler Text, 2-4 Sätze)" value={editingFaq ? editingFaq.answer : newFaq.answer} onChange={e => editingFaq ? setEditingFaq({...editingFaq, answer: e.target.value}) : setNewFaq({...newFaq, answer: e.target.value})} required />
                        <div className="bg-[#F1F3EA] border border-[#C5C5C5] p-3 font-mono text-[9px]">
                          <div className="font-bold mb-1">HINWEIS:</div>
                          <div>FAQ-Antworten werden als normaler Text angezeigt. Keine Markdown-Formatierung.</div>
                        </div>
                      </div>
                      
                      <input className="admin-input" type="number" placeholder="Reihenfolge" value={editingFaq ? editingFaq.order : newFaq.order} onChange={e => editingFaq ? setEditingFaq({...editingFaq, order: +e.target.value}) : setNewFaq({...newFaq, order: +e.target.value})} />
                      <div className="flex gap-2">
                        <button type="submit" disabled={saving} className="flex-1 bg-[#616752] text-white py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50">
                          {saving ? 'SPEICHERT...' : (editingFaq ? 'AKTUALISIEREN' : 'SPEICHERN & DEPLOYEN')}
                        </button>
                        {editingFaq && (
                          <button type="button" onClick={() => setEditingFaq(null)} className="px-4 bg-gray-300 text-gray-700 py-3 font-mono text-[10px] tracking-widest hover:opacity-90">
                            ABBRECHEN
                          </button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
                <div className="lg:col-span-8 space-y-3">
                  {faqs.map(f => (
                    <div key={f.id} className="border border-[#C5C5C5] p-5 bg-white flex gap-4 justify-between group hover:border-[#616752] transition-colors">
                      <div className="flex-1">
                        <h3 className="font-bold uppercase text-sm mb-1">{f.question}</h3>
                        <p className="font-mono text-[10px] opacity-50 line-clamp-2">{f.answer}</p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingFaq(f)} className="p-2 text-blue-300 hover:text-blue-600 transition-colors"><Edit2 size={15} /></button>
                        <button onClick={() => deleteFaq(f.id)} className="p-2 text-red-300 hover:text-red-600 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SETTINGS ── */}
            {tab === 'settings' && (
              <div className="max-w-2xl space-y-6">
                <div className="border border-[#C5C5C5] p-8 bg-white">
                  <h2 className="font-display font-black text-xl uppercase mb-6">Systemeinstellungen</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'site_status', label: 'SYSTEMSTATUS' },
                      { key: 'node_location', label: 'NODE LOCATION' },
                      { key: 'system_uptime', label: 'UPTIME' },
                      { key: 'engine_version', label: 'ENGINE VERSION' },
                    ].map(s => (
                      <div key={s.key}>
                        <label className="telemetry-label text-[9px] block mb-1">{s.label}</label>
                        <input
                          className="admin-input"
                          value={settings[s.key] ?? ''}
                          onChange={e => setSettings({...settings, [s.key]: e.target.value})}
                        />
                      </div>
                    ))}
                  </div>
                  <button onClick={saveSettings} disabled={saving} className="mt-6 bg-[#616752] text-white px-8 py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50">
                    {saving ? 'SPEICHERT...' : 'SPEICHERN & DEPLOYEN'}
                  </button>
                </div>
                
                <div className="border border-[#C5C5C5] p-8 bg-white">
                  <h2 className="font-display font-black text-xl uppercase mb-6">Kontaktdaten</h2>
                  <div className="space-y-4">
                    {[
                      { key: 'contact_email', label: 'E-MAIL ADRESSE', placeholder: 'hello@webstudio-ok.de' },
                      { key: 'contact_phone', label: 'TELEFON', placeholder: '+49 (0) 2732 123 456' },
                      { key: 'contact_location', label: 'STANDORT', placeholder: 'Kreuztal, NRW, Deutschland' },
                    ].map(s => (
                      <div key={s.key}>
                        <label className="telemetry-label text-[9px] block mb-1">{s.label}</label>
                        <input
                          className="admin-input"
                          placeholder={s.placeholder}
                          value={settings[s.key] ?? ''}
                          onChange={e => setSettings({...settings, [s.key]: e.target.value})}
                        />
                      </div>
                    ))}
                  </div>
                  <button onClick={saveSettings} disabled={saving} className="mt-6 bg-[#616752] text-white px-8 py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50">
                    {saving ? 'SPEICHERT...' : 'SPEICHERN & DEPLOYEN'}
                  </button>
                </div>
                <div className="border border-[#616752] bg-[#616752] text-[#F1F3EA] p-6">
                  <div className="flex items-center gap-2 font-mono text-[9px] mb-2">
                    <Lock size={12} /> 
                    {isDemoMode ? 'DEMO MODUS AKTIV' : 'GITHUB API VERBUNDEN'}
                  </div>
                  <p className="font-mono text-[9px] opacity-60">
                    {isDemoMode ? 'Lokale Daten aus public/data/' : cfg ? `${cfg.owner}/${cfg.repo} @ ${cfg.branch}` : 'Keine Verbindung'}
                  </p>
                </div>
              </div>
            )}

            {/* ── PRIVACY (DATENSCHUTZ) ── */}
            {tab === 'privacy' && (
              <div className="max-w-4xl space-y-6">
                <div className="border border-[#C5C5C5] p-8 bg-white">
                  <h2 className="font-display font-black text-xl uppercase mb-6">Datenschutzerklärung</h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="telemetry-label text-[9px] block mb-1">TITEL</label>
                      <input
                        className="admin-input"
                        value={privacy.title}
                        onChange={e => setPrivacy({...privacy, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="telemetry-label text-[9px] block mb-1">UNTERTITEL</label>
                      <input
                        className="admin-input"
                        value={privacy.subtitle}
                        onChange={e => setPrivacy({...privacy, subtitle: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-sm uppercase mb-4 mt-8">Abschnitte</h3>
                  <div className="space-y-4">
                    {privacy.sections.sort((a, b) => a.order - b.order).map((section, idx) => (
                      <div key={section.id} className="border border-[#C5C5C5] p-4 bg-[#F1F3EA]">
                        <div className="space-y-3">
                          <input
                            className="admin-input font-bold"
                            placeholder="Titel"
                            value={section.title}
                            onChange={e => {
                              const updated = privacy.sections.map(s => 
                                s.id === section.id ? {...s, title: e.target.value} : s
                              );
                              setPrivacy({...privacy, sections: updated});
                            }}
                          />
                          <textarea
                            className="admin-input h-32 font-mono text-xs"
                            placeholder="Inhalt (Markdown möglich)"
                            value={section.content}
                            onChange={e => {
                              const updated = privacy.sections.map(s => 
                                s.id === section.id ? {...s, content: e.target.value} : s
                              );
                              setPrivacy({...privacy, sections: updated});
                            }}
                          />
                          <div className="flex gap-2 items-center">
                            <input
                              className="admin-input w-20"
                              type="number"
                              placeholder="Order"
                              value={section.order}
                              onChange={e => {
                                const updated = privacy.sections.map(s => 
                                  s.id === section.id ? {...s, order: +e.target.value} : s
                                );
                                setPrivacy({...privacy, sections: updated});
                              }}
                            />
                            <button
                              onClick={() => {
                                if (confirm('Abschnitt löschen?')) {
                                  setPrivacy({...privacy, sections: privacy.sections.filter(s => s.id !== section.id)});
                                }
                              }}
                              className="px-4 py-2 bg-red-500 text-white font-mono text-[9px] hover:opacity-90"
                            >
                              LÖSCHEN
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => {
                      const newSection: LegalSection = {
                        id: uid(),
                        title: 'Neuer Abschnitt',
                        content: '',
                        order: privacy.sections.length + 1
                      };
                      setPrivacy({...privacy, sections: [...privacy.sections, newSection]});
                    }}
                    className="mt-4 bg-blue-500 text-white px-6 py-2 font-mono text-[9px] hover:opacity-90"
                  >
                    + ABSCHNITT HINZUFÜGEN
                  </button>
                  
                  <button
                    onClick={async () => {
                      if (isDemoMode) {
                        setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
                        setTimeout(() => setSaveMsg(''), 3000);
                        return;
                      }
                      await save('privacy', privacy, 'Datenschutzerklärung aktualisiert');
                    }}
                    disabled={saving}
                    className="mt-6 bg-[#616752] text-white px-8 py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50 block w-full"
                  >
                    {saving ? 'SPEICHERT...' : 'SPEICHERN & DEPLOYEN'}
                  </button>
                </div>
              </div>
            )}

            {/* ── IMPRESSUM ── */}
            {tab === 'impressum' && (
              <div className="max-w-4xl space-y-6">
                <div className="border border-[#C5C5C5] p-8 bg-white">
                  <h2 className="font-display font-black text-xl uppercase mb-6">Impressum</h2>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="telemetry-label text-[9px] block mb-1">TITEL</label>
                      <input
                        className="admin-input"
                        value={impressum.title}
                        onChange={e => setImpressum({...impressum, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="telemetry-label text-[9px] block mb-1">UNTERTITEL</label>
                      <input
                        className="admin-input"
                        value={impressum.subtitle}
                        onChange={e => setImpressum({...impressum, subtitle: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <h3 className="font-bold text-sm uppercase mb-4 mt-8">Abschnitte</h3>
                  <div className="space-y-4">
                    {impressum.sections.sort((a, b) => a.order - b.order).map((section, idx) => (
                      <div key={section.id} className="border border-[#C5C5C5] p-4 bg-[#F1F3EA]">
                        <div className="space-y-3">
                          <input
                            className="admin-input font-bold"
                            placeholder="Titel"
                            value={section.title}
                            onChange={e => {
                              const updated = impressum.sections.map(s => 
                                s.id === section.id ? {...s, title: e.target.value} : s
                              );
                              setImpressum({...impressum, sections: updated});
                            }}
                          />
                          <textarea
                            className="admin-input h-24"
                            placeholder="Inhalt (Zeilenumbrüche werden beibehalten)"
                            value={section.content}
                            onChange={e => {
                              const updated = impressum.sections.map(s => 
                                s.id === section.id ? {...s, content: e.target.value} : s
                              );
                              setImpressum({...impressum, sections: updated});
                            }}
                          />
                          <div className="flex gap-2 items-center">
                            <input
                              className="admin-input w-20"
                              type="number"
                              placeholder="Order"
                              value={section.order}
                              onChange={e => {
                                const updated = impressum.sections.map(s => 
                                  s.id === section.id ? {...s, order: +e.target.value} : s
                                );
                                setImpressum({...impressum, sections: updated});
                              }}
                            />
                            <button
                              onClick={() => {
                                if (confirm('Abschnitt löschen?')) {
                                  setImpressum({...impressum, sections: impressum.sections.filter(s => s.id !== section.id)});
                                }
                              }}
                              className="px-4 py-2 bg-red-500 text-white font-mono text-[9px] hover:opacity-90"
                            >
                              LÖSCHEN
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => {
                      const newSection: LegalSection = {
                        id: uid(),
                        title: 'Neuer Abschnitt',
                        content: '',
                        order: impressum.sections.length + 1
                      };
                      setImpressum({...impressum, sections: [...impressum.sections, newSection]});
                    }}
                    className="mt-4 bg-blue-500 text-white px-6 py-2 font-mono text-[9px] hover:opacity-90"
                  >
                    + ABSCHNITT HINZUFÜGEN
                  </button>
                  
                  <div className="mt-8">
                    <label className="telemetry-label text-[9px] block mb-1">HAFTUNGSAUSSCHLUSS</label>
                    <textarea
                      className="admin-input h-24"
                      placeholder="Haftungsausschluss Text"
                      value={impressum.disclaimer}
                      onChange={e => setImpressum({...impressum, disclaimer: e.target.value})}
                    />
                  </div>
                  
                  <button
                    onClick={async () => {
                      if (isDemoMode) {
                        setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
                        setTimeout(() => setSaveMsg(''), 3000);
                        return;
                      }
                      await save('impressum', impressum, 'Impressum aktualisiert');
                    }}
                    disabled={saving}
                    className="mt-6 bg-[#616752] text-white px-8 py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50 block w-full"
                  >
                    {saving ? 'SPEICHERT...' : 'SPEICHERN & DEPLOYEN'}
                  </button>
                </div>
              </div>
            )}

            {/* ── SPECIAL OFFER ── */}
            {tab === 'special-offer' && (
              <div className="max-w-2xl space-y-6">
                <div className="border border-[#C5C5C5] p-8 bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="font-display font-black text-xl uppercase">Sonderangebot</h2>
                    <div className="flex items-center gap-2">
                      <label className="telemetry-label text-[9px]">AKTIV</label>
                      <input
                        type="checkbox"
                        checked={specialOffer.enabled}
                        onChange={e => setSpecialOffer({...specialOffer, enabled: e.target.checked})}
                        className="w-5 h-5 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="telemetry-label text-[9px] block mb-1">TITEL</label>
                      <input
                        className="admin-input"
                        placeholder="z.B. Sonderangebot, Frühlingsrabatt, Limitiertes Angebot"
                        value={specialOffer.title}
                        onChange={e => setSpecialOffer({...specialOffer, title: e.target.value})}
                      />
                    </div>

                    <div>
                      <label className="telemetry-label text-[9px] block mb-1">NACHRICHT</label>
                      <textarea
                        className="admin-input h-32"
                        placeholder="Beschreiben Sie das Angebot. Z.B.: Starten Sie Ihr Projekt im Mai und erhalten Sie 15% Rabatt auf alle Web-Relaunch-Pakete."
                        value={specialOffer.message}
                        onChange={e => setSpecialOffer({...specialOffer, message: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="telemetry-label text-[9px] block mb-1">BUTTON TEXT</label>
                        <input
                          className="admin-input"
                          placeholder="z.B. Jetzt anfragen"
                          value={specialOffer.buttonText}
                          onChange={e => setSpecialOffer({...specialOffer, buttonText: e.target.value})}
                        />
                      </div>

                      <div>
                        <label className="telemetry-label text-[9px] block mb-1">BUTTON LINK</label>
                        <input
                          className="admin-input"
                          placeholder="/contact"
                          value={specialOffer.buttonLink}
                          onChange={e => setSpecialOffer({...specialOffer, buttonLink: e.target.value})}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="telemetry-label text-[9px] block mb-1">GÜLTIG BIS (OPTIONAL)</label>
                      <input
                        className="admin-input"
                        placeholder="z.B. 31.05.2025"
                        value={specialOffer.validUntil || ''}
                        onChange={e => setSpecialOffer({...specialOffer, validUntil: e.target.value})}
                      />
                    </div>
                  </div>

                  {/* Preview */}
                  {specialOffer.enabled && (
                    <div className="mt-8 p-6 border-2 border-[#616752] bg-[#F1F3EA]">
                      <p className="telemetry-label text-[9px] mb-4">VORSCHAU</p>
                      <div className="text-center">
                        <h3 className="font-display font-black text-lg uppercase mb-2">{specialOffer.title}</h3>
                        <p className="font-serif text-sm mb-2">{specialOffer.message}</p>
                        {specialOffer.validUntil && (
                          <p className="font-mono text-[10px] text-[#616752] mb-3">Gültig bis {specialOffer.validUntil}</p>
                        )}
                        <div className="inline-block bg-[#616752] text-white px-6 py-2 font-mono text-[10px]">
                          {specialOffer.buttonText}
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={async () => {
                      if (isDemoMode) {
                        setSaveMsg('⚠ Demo Modus - Änderungen werden nicht gespeichert');
                        setTimeout(() => setSaveMsg(''), 3000);
                        return;
                      }
                      await save('special-offer', specialOffer, 'Sonderangebot aktualisiert');
                    }}
                    disabled={saving}
                    className="mt-6 bg-[#616752] text-white px-8 py-3 font-mono text-[10px] tracking-widest hover:opacity-90 disabled:opacity-50 block w-full"
                  >
                    {saving ? 'SPEICHERT...' : 'SPEICHERN & DEPLOYEN'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .admin-input {
          width: 100%;
          border: 1px solid #C5C5C5;
          padding: 10px 12px;
          font-family: var(--font-mono);
          font-size: 11px;
          background: #F1F3EA;
          outline: none;
          border-radius: 0;
          transition: border-color .15s;
          box-sizing: border-box;
        }
        .admin-input:focus { border-color: #616752; background: #fff; }
        textarea.admin-input { resize: vertical; }
        .admin-link{color:#616752;text-decoration:underline;font-weight:600;transition:opacity .2s ease;text-decoration-thickness:1px;text-underline-offset:2px}
        .admin-link:hover{opacity:.7}
      `}</style>
    </div>
  );
}
