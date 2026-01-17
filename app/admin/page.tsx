'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TiptapEditor } from '@/components/admin/TiptapEditor';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { autoSlug } from '@/lib/slugGenerator';
// ✅ NEUE IMPORTS FÜR PREVIEW FIX
import { NewsView } from '@/app/news/[slug]/NewsView';
import { AnalyseView } from '@/app/analysen/[slug]/AnalyseView';
import {
  FileText,
  Sparkles,
  LayoutGrid,
  Settings,
  PlusCircle,
  Search,
  Trash2,
  Edit3,
  Eye,
  CheckCircle2,
  Clock,
  TrendingUp,
  Calendar,
  Tag,
  Target,
  BarChart3,
  ShieldAlert,
  Zap,
  X,
  ArrowLeft,
  Newspaper,
  AlertTriangle,
  Link as LinkIcon,
  Check,
  ChevronDown
} from 'lucide-react';

// ============================================
// CATEGORY COMBOBOX COMPONENT (INLINE)
// ============================================

const PRESET_CATEGORIES = [
  'Aktien',
  'ETFs',
  'Kryptowährungen',
];

interface CategoryComboboxProps {
  value: string;
  onChange: (value: string) => void;
}

function CategoryCombobox({ value, onChange }: CategoryComboboxProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const filteredCategories = PRESET_CATEGORIES.filter((cat) =>
    cat.toLowerCase().includes(inputValue.toLowerCase())
  );

  const handleSelect = (category: string) => {
    setInputValue(category);
    onChange(category);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder="z.B. Aktien"
          className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 pr-10 text-sm font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      {isOpen && (
        <>
          {/* Backdrop zum Schließen */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />

          {/* Dropdown */}
          <div className="absolute z-20 mt-2 w-full rounded-xl border-2 border-slate-200 bg-white shadow-xl">
            {filteredCategories.length > 0 ? (
              <ul className="max-h-60 overflow-auto py-1">
                {filteredCategories.map((category) => (
                  <li key={category}>
                    <button
                      type="button"
                      onClick={() => handleSelect(category)}
                      className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-semibold hover:bg-blue-50 transition-colors"
                    >
                      <span>{category}</span>
                      {inputValue === category && (
                        <Check className="h-4 w-4 text-blue-600" />
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="px-4 py-3 text-sm text-slate-500">
                Keine Vorschläge - eigene Kategorie eingeben
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ============================================
// MAIN CMS COMPONENT
// ============================================

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl?: string;
  imageSource?: string;
  status: 'draft' | 'published';
  isPremium: boolean;
  ticker?: string;
  category?: string;
  // News-specific
  source?: string;
  sourceUrl?: string;
  sourceType?: 'own' | 'external';
  impact?: 'Low' | 'Medium' | 'High';
  createdAt: string;
  publishedAt?: string;
}

interface DeepDive {
  thesis?: string;
  profitability?: string;
  substance?: string;
  risk?: string;
}

export default function ModernAdminCMS() {
  const router = useRouter();
  const supabase = supabaseBrowser();

  const [view, setView] = useState<'list' | 'editor'>('list');
  const [type, setType] = useState<'news' | 'analysen'>('news');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ AUTH STATE
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // ✅ TOAST STATE HINZUGEFÜGT
  const [toast, setToast] = useState<string | null>(null);

  // ✅ DELETE CONFIRMATION STATE
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id: string; title: string }>({
    show: false,
    id: '',
    title: ''
  });

  // Form state - ERWEITERT mit allen Feldern!
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    imageUrl: '',
    imageSource: '', // ✅ NEU: Bildquelle
    isPremium: false,
    ticker: '',
    category: '',
    
    // ✅ NEWS-SPECIFIC FIELDS:
    source: '', // Autor/Quelle
    sourceUrl: '', // URL zur Quelle
    sourceType: 'own' as 'own' | 'external',
    impact: 'Medium' as 'Low' | 'Medium' | 'High',
  });

  
  // Deep Dive state (nur für Analysen)
  const [deepDive, setDeepDive] = useState<DeepDive>({
    thesis: '',
    profitability: '',
    substance: '',
    risk: '',
  });

  // ✅ CHECK AUTHENTICATION ON MOUNT
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        router.push('/konto?redirect=/admin');
        return;
      }

      // Check if user has admin role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (!profile || profile.role !== 'admin') {
        setToast('❌ Zugriff verweigert: Admin-Rechte erforderlich');
        setTimeout(() => router.push('/'), 3000);
        return;
      }

      setIsAdmin(true);
      setIsCheckingAuth(false);
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/konto?redirect=/admin');
    }
  };

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && view === 'editor' && !editingPost) {
      setForm(prev => ({ ...prev, slug: autoSlug(prev.title) }));
    }
  }, [form.title, view, editingPost]);

  // Load posts on mount
  useEffect(() => {
    if (isAdmin) {
      loadPosts();
    }
  }, [type, isAdmin]);

  const loadPosts = async () => {
    try {
      const res = await fetch(`/api/admin/${type}?includeDrafts=1`);

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          setToast('❌ Session abgelaufen - bitte neu einloggen');
          setTimeout(() => router.push('/konto?redirect=/admin'), 2000);
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
      setToast('❌ Fehler beim Laden der Beiträge');
      setTimeout(() => setToast(null), 4000);
    }
  };

  const startNew = () => {
    setForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      imageUrl: '',
      imageSource: '',
      isPremium: false,
      ticker: '',
      category: '',
      source: '',
      sourceUrl: '',
      sourceType: 'own',
      impact: 'Medium',
    });
    setDeepDive({
      thesis: '',
      profitability: '',
      substance: '',
      risk: '',
    });
    setEditingPost(null);
    setView('editor');
  };

  const startEdit = (post: any) => {
    setForm({
      title: post.title,
      slug: post.slug,
      summary: post.summary,
      content: post.content,
      imageUrl: post.imageUrl || post.image || '',
      imageSource: post.imageSource || '', // ✅ LADEN
      isPremium: post.isPremium,
      ticker: post.ticker || '',
      category: post.category || '',
      
      // ✅ NEWS FIELDS LADEN:
      source: post.source || '',
      sourceUrl: post.sourceUrl || '',
      sourceType: post.sourceType || 'own',
      impact: post.impact || 'Medium',
    });
    
    // Load deep dive if exists (from analysis field)
    if (post.analysis) {
      setDeepDive({
        thesis: post.analysis.overview || '',
        profitability: post.analysis.businessModel || '',
        substance: post.analysis.scenarios || '',
        risk: post.analysis.risks || '',
      });
    } else {
      setDeepDive({ thesis: '', profitability: '', substance: '', risk: '' });
    }
    
    setEditingPost(post);
    setView('editor');
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!form.title || !form.slug || !form.summary || !form.content) {
      // ✅ TOAST STATT ALERT
      setToast('❌ Bitte fülle alle Pflichtfelder aus!');
      setTimeout(() => setToast(null), 4000);
      return;
    }

    setIsSaving(true);

    const payload: any = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      content: form.content,
      imageUrl: form.imageUrl || undefined,
      imageSource: form.imageSource || undefined, // ✅ SPEICHERN
      status,
      isPremium: form.isPremium,
      ticker: form.ticker || undefined,
      category: form.category || undefined,
      auditStatus: 'approved',
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
    };

    // ✅ Add news-specific fields
    if (type === 'news') {
      payload.source = form.source || undefined;
      payload.sourceUrl = form.sourceUrl || undefined;
      payload.sourceType = form.sourceType;
      payload.impact = form.impact;
    }

    // Add deep dive for analysen
    if (type === 'analysen' && (deepDive.thesis || deepDive.profitability || deepDive.substance || deepDive.risk)) {
      payload.analysis = {
        overview: deepDive.thesis || '',
        businessModel: deepDive.profitability || '',
        risks: deepDive.risk || '',
        scenarios: deepDive.substance || '',
      };
    }

    // Add ID if editing
    if (editingPost) {
      payload.id = editingPost.id;
    }

    try {
      const method = editingPost ? 'PUT' : 'POST';
      const res = await fetch(`/api/admin/${type}`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Fehler beim Speichern');
      }

      // ✅ TOAST STATT ALERT
      setToast(status === 'published' ? '✅ Erfolgreich veröffentlicht!' : '✅ Als Entwurf gespeichert!');
      setTimeout(() => setToast(null), 4000);
      
      setView('list');
      loadPosts();
    } catch (error: any) {
      console.error('Error saving:', error);
      // ✅ TOAST STATT ALERT
      setToast(`❌ Fehler: ${error.message}`);
      setTimeout(() => setToast(null), 4000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/admin/${type}?id=${id}`, { method: 'DELETE' });
      setToast('✅ Erfolgreich gelöscht!');
      setTimeout(() => setToast(null), 4000);
      setDeleteConfirm({ show: false, id: '', title: '' });
      loadPosts();
    } catch (error) {
      console.error('Error deleting:', error);
      setToast('❌ Fehler beim Löschen!');
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    const reader = new FileReader();
    return new Promise((resolve) => {
      reader.onload = (e) => {
        const url = e.target?.result as string;
        resolve(url);
      };
      reader.readAsDataURL(file);
    });
  };

  const filteredPosts = posts.filter(p =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ✅ PREVIEW DATA - FÜR KORREKTE VIEW COMPONENT
  const previewData: any = {
    id: 'preview',
    title: form.title || 'Vorschau',
    slug: form.slug || 'vorschau',
    summary: form.summary,
    content: form.content,
    imageUrl: form.imageUrl,
    imageSource: form.imageSource,
    category: form.category || (type === 'news' ? 'News' : 'Analyse'),
    tags: [],
    isPremium: form.isPremium,
    ticker: form.ticker,
    publishedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    auditStatus: 'approved',
    status: 'published',
    // News specific
    ...(type === 'news' && {
      source: form.source || 'BeyondCharts',
      sourceUrl: form.sourceUrl,
      sourceType: form.sourceType,
      impact: form.impact,
    }),
    // Analysis specific  
    ...(type === 'analysen' && {
      analysis: {
        overview: deepDive.thesis,
        businessModel: deepDive.profitability,
        risks: deepDive.risk,
        scenarios: deepDive.substance,
      },
    }),
  };

  // ✅ LOADING SCREEN WHILE CHECKING AUTH
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-blue-500/40 animate-pulse">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <p className="text-lg font-bold text-slate-700">Überprüfe Zugangsberechtigung...</p>
          <p className="text-sm text-slate-500 mt-2">Einen Moment bitte</p>
        </div>
      </div>
    );
  }

  // ✅ ACCESS DENIED SCREEN
  if (!isAdmin) {
    return null; // Will redirect, show nothing
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-slate-50">
      {/* ✅ TOAST NOTIFICATION */}
      {toast && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[9999] animate-in slide-in-from-bottom-4 fade-in">
          <div className={`px-8 py-4 rounded-2xl shadow-2xl border-2 font-bold text-base flex items-center gap-3 ${
            toast.startsWith('✅') 
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-white/20' 
              : 'bg-gradient-to-r from-red-600 to-rose-600 text-white border-white/20'
          }`}>
            {toast.startsWith('✅') ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            ) : (
              <AlertTriangle className="h-5 w-5 flex-shrink-0" />
            )}
            <span>{toast}</span>
          </div>
        </div>
      )}

      {view === 'list' ? (
        <>
          {/* Modern Fluid Header Area */}
          <div className="pt-10 pb-4 px-6">
            <div className="max-w-7xl mx-auto relative group">
              
              <div className="relative overflow-hidden rounded-[40px] bg-slate-900 shadow-2xl shadow-blue-900/20 border border-white/5">
                
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-slate-900" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-violet-500/10 rounded-full blur-[100px]" />
                
                <div className="relative px-8 py-10 md:px-12">
                  
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center shadow-2xl shadow-blue-500/40 ring-1 ring-white/20">
                      <Sparkles className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Content Studio
                      </h1>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase border border-blue-500/30">
                          BeyondCharts CMS
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    
                    <div className="flex items-center gap-2 p-1.5 bg-black/30 backdrop-blur-md rounded-2xl border border-white/5">
                      <button
                        onClick={() => setType('news')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                          type === 'news'
                            ? 'bg-white text-slate-900 shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <Newspaper className="h-4 w-4" />
                        News
                      </button>
                      <button
                        onClick={() => setType('analysen')}
                        className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                          type === 'analysen'
                            ? 'bg-white text-slate-900 shadow-lg'
                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                        }`}
                      >
                        <TrendingUp className="h-4 w-4" />
                        Analysen
                      </button>
                    </div>

                    {/* Neuer Beitrag - Gleiche Größe wie Tabs */}
                    <button
                      onClick={startNew}
                      className="
                        inline-flex items-center gap-2
                        px-6 py-2.5
                        rounded-xl
                        font-bold text-sm
                        bg-white text-slate-900
                        shadow-lg
                        hover:bg-slate-100
                        transition-all
                        active:scale-95
                        ring-1 ring-white/20
                      "
                    >
                      <PlusCircle className="h-4 w-4 text-blue-600" />
                      Neuer Beitrag
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border-2 border-slate-200 rounded-2xl text-base outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="Beiträge durchsuchen..."
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Gesamt', value: posts.length, icon: LayoutGrid, color: 'from-blue-500 to-cyan-500', bg: 'from-blue-50 to-cyan-50' },
                { label: 'Veröffentlicht', value: posts.filter(p => p.status === 'published').length, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', bg: 'from-emerald-50 to-teal-50' },
                { label: 'Entwürfe', value: posts.filter(p => p.status === 'draft').length, icon: Clock, color: 'from-amber-500 to-orange-500', bg: 'from-amber-50 to-orange-50' },
                { label: 'Premium', value: posts.filter(p => p.isPremium).length, icon: Sparkles, color: 'from-violet-500 to-purple-500', bg: 'from-violet-50 to-purple-50' },
              ].map((stat, i) => (
                <Card key={i} className={`p-6 bg-gradient-to-br ${stat.bg} border-none shadow-sm hover:shadow-md transition-all hover:-translate-y-1`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
                      <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Posts Table */}
            <Card className="overflow-hidden shadow-lg border-2 border-slate-200">
              <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 px-6 py-5">
                <h2 className="text-lg font-bold text-white">Alle Beiträge</h2>
                <p className="text-sm text-blue-200 mt-1">{filteredPosts.length} {filteredPosts.length === 1 ? 'Beitrag' : 'Beiträge'} gefunden</p>
              </div>
              
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-blue-50/30 border-b-2 border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Beitrag
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-bold text-slate-600 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-blue-50/30 transition-all group">
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center flex-shrink-0 group-hover:from-blue-100 group-hover:to-violet-100 transition-all">
                            <FileText className="h-5 w-5 text-slate-600 group-hover:text-blue-600 transition-colors" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap mb-2">
                              <div className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{post.title}</div>
                              {post.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold uppercase tracking-wide px-2 py-1 flex items-center gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  PREMIUM
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 flex items-center gap-3 flex-wrap">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3.5 w-3.5" />
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('de-DE', { 
                                  day: '2-digit', 
                                  month: 'short', 
                                  year: 'numeric' 
                                })}
                              </span>
                              <span className="w-1 h-1 rounded-full bg-slate-300" />
                              <span className="font-mono text-blue-600">/{type}/{post.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          className={
                            post.status === "published"
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-200 font-semibold"
                              : "bg-amber-100 text-amber-700 border border-amber-200 font-semibold"
                          }
                        >
                          {post.status === "published" ? "Veröffentlicht" : "Entwurf"}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(post)}
                            className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-all hover:scale-110"
                            title="Bearbeiten"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ show: true, id: post.id, title: post.title })}
                            className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-all hover:scale-110"
                            title="Löschen"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredPosts.length === 0 && (
                <div className="p-20 text-center bg-gradient-to-br from-white to-slate-50">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center mx-auto mb-6">
                    <FileText className="h-12 w-12 text-slate-400" />
                  </div>
                  <p className="text-lg text-slate-600 font-semibold mb-2">
                    {searchQuery ? 'Keine Ergebnisse gefunden' : 'Noch keine Beiträge vorhanden'}
                  </p>
                  <p className="text-sm text-slate-500 mb-6">
                    {searchQuery ? 'Versuche eine andere Suche' : 'Erstelle deinen ersten Beitrag'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={startNew} className="bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg">
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Ersten Beitrag erstellen
                    </Button>
                  )}
                </div>
              )}
            </Card>
          </div>
        </>
      ) : (
        // EDITOR VIEW
        <div className="min-h-screen pb-20">
          {/* Glossy Floating Header */}
          <div className="sticky top-16 md:top-20 z-40 pt-6 pb-4">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative overflow-hidden rounded-[32px] border border-white/40 bg-white/40 backdrop-blur-xl shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] p-3">
                
                <div className="absolute inset-0 bg-gradient-to-tr from-white/20 via-transparent to-white/5 pointer-events-none" />
                
                <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 px-2">
                  
                  <button 
                    onClick={() => setView('list')}
                    className="flex items-center gap-2 px-5 py-2 text-slate-600 hover:text-slate-900 font-bold transition-all hover:bg-white/40 rounded-2xl group"
                  >
                    <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
                    Zurück
                  </button>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => setShowPreview(!showPreview)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/60 text-slate-700 font-bold text-sm hover:bg-white/80 rounded-xl transition-all border border-white/20 shadow-sm"
                    >
                      <Eye className="h-4 w-4 text-blue-500" />
                      {showPreview ? 'Editor' : 'Vorschau'}
                    </button>
                    
                    <button 
                      onClick={() => handleSave('draft')}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/60 text-slate-700 font-bold text-sm hover:bg-white/80 rounded-xl transition-all border border-white/20 shadow-sm disabled:opacity-50"
                    >
                      <Clock className="h-4 w-4 text-amber-500" />
                      {isSaving ? '...' : 'Entwurf'}
                    </button>

                    <button 
                      onClick={() => handleSave('published')}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold text-sm rounded-xl transition-all shadow-[0_4px_12px_rgba(16,185,129,0.2)] active:scale-95 disabled:opacity-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                      {isSaving ? 'Speichert...' : 'Veröffentlichen'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {!showPreview ? (
              <div className="space-y-8">
                {/* Title */}
                <Card className="p-10 bg-white border-2 border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
                    <FileText className="h-4 w-4" />
                    Überschrift
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full border-none p-0 focus:ring-0 outline-none text-5xl font-bold text-slate-900 placeholder:text-slate-200 bg-transparent leading-tight"
                    placeholder="Titel eingeben..."
                  />
                  
                  {form.slug && (
                    <div className="mt-8 pt-8 border-t-2 border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">URL Slug (automatisch generiert)</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-50 to-violet-50 border-2 border-blue-200 text-blue-700 rounded-xl font-mono text-sm font-semibold">
                          /{type}/{form.slug}
                        </div>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Image Upload + Source */}
                <Card className="p-10 bg-white border-2 border-slate-200 shadow-lg">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
                    <Tag className="h-4 w-4" />
                    Titelbild
                  </label>
                  <ImageUpload
                    value={form.imageUrl}
                    onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))}
                    onFileSelect={async (file) => {
                      const url = await handleImageUpload(file);
                      setForm((p) => ({ ...p, imageUrl: url }));
                    }}
                  />
                  
                  {form.imageUrl && (
                    <div className="mt-6 pt-6 border-t-2 border-slate-100">
                      <label className="text-sm font-bold text-slate-700 mb-3 block">
                        Bildquelle (optional, aber empfohlen)
                      </label>
                      <input
                        value={form.imageSource || ''}
                        onChange={(e) => setForm((p) => ({ ...p, imageSource: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        placeholder="z.B. Getty Images, Unsplash, BeyondCharts"
                      />
                      {form.imageSource && (
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                          <span>©</span>
                          <span className="font-medium">{form.imageSource}</span>
                        </p>
                      )}
                    </div>
                  )}
                </Card>

                {/* Summary */}
                <Card className="p-10 bg-white border-2 border-slate-200 shadow-lg">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
                    <FileText className="h-4 w-4" />
                    Zusammenfassung
                  </label>
                  <textarea
                    value={form.summary}
                    onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                    className="w-full h-32 border-none p-0 focus:ring-0 outline-none text-lg text-slate-700 resize-none leading-relaxed placeholder:text-slate-300 bg-transparent"
                    placeholder="Kurze Zusammenfassung des Beitrags..."
                  />
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {form.summary.length} Zeichen
                    </span>
                    {form.summary.length > 300 && (
                      <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Empfohlen: unter 300 Zeichen
                      </span>
                    )}
                  </div>
                </Card>

                {/* NEWS-SPECIFIC FIELDS */}
                {type === 'news' && (
                  <Card className="p-10 bg-gradient-to-br from-white via-emerald-50/20 to-white border-2 border-emerald-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg">
                        <Newspaper className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-emerald-900">News-spezifische Felder</label>
                        <p className="text-xs text-emerald-600">Impact, Quelle und Autor</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-amber-500" />
                          Markt-Impact
                        </label>
                        <select
                          value={form.impact}
                          onChange={(e) => setForm((p) => ({ ...p, impact: e.target.value as any }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold"
                        >
                          <option value="Low">Niedrig - Geringe Marktrelevanz</option>
                          <option value="Medium">Mittel - Moderate Marktrelevanz</option>
                          <option value="High">Hoch - Hohe Marktrelevanz</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-700 mb-3 block">Quellentyp</label>
                        <select
                          value={form.sourceType}
                          onChange={(e) => setForm((p) => ({ ...p, sourceType: e.target.value as any }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold"
                        >
                          <option value="own">Eigene Recherche</option>
                          <option value="external">Externe Quelle</option>
                        </select>
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-700 mb-3 block">
                          {form.sourceType === 'own' ? 'Gepostet von (dein Name)' : 'Quelle (Name)'}
                        </label>
                        <input
                          value={form.source}
                          onChange={(e) => setForm((p) => ({ ...p, source: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-semibold"
                          placeholder={form.sourceType === 'own' ? 'z.B. Max Mustermann' : 'z.B. Reuters, Bloomberg'}
                        />
                      </div>

                      {form.sourceType === 'external' && (
                        <div>
                          <label className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                            <LinkIcon className="h-4 w-4" />
                            Quellen-URL
                          </label>
                          <input
                            value={form.sourceUrl}
                            onChange={(e) => setForm((p) => ({ ...p, sourceUrl: e.target.value }))}
                            className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-mono"
                            placeholder="https://..."
                            type="url"
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                )}

                {/* Deep Dive Metrics (nur für Analysen) */}
                {type === 'analysen' && (
                  <Card className="p-10 bg-gradient-to-br from-white via-violet-50/30 to-white border-2 border-violet-200 shadow-lg">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <label className="text-sm font-bold text-violet-900">Deep Dive Metriken</label>
                        <p className="text-xs text-violet-600">Optional - Erscheinen als Highlights im Artikel</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <label className="text-sm font-bold text-slate-700">Investmentthese</label>
                        </div>
                        <input
                          value={deepDive.thesis}
                          onChange={(e) => setDeepDive(p => ({ ...p, thesis: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-medium"
                          placeholder="z.B. AI-getriebenes Wachstum"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-md">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <label className="text-sm font-bold text-slate-700">Zentraler Katalysator</label>
                        </div>
                        <input
                          value={deepDive.profitability}
                          onChange={(e) => setDeepDive(p => ({ ...p, profitability: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-violet-500/20 focus:border-violet-500 outline-none font-medium"
                          placeholder="z.B. Neue Produktlinie"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md">
                            <BarChart3 className="h-5 w-5 text-white" />
                          </div>
                          <label className="text-sm font-bold text-slate-700">Fundamentale Stärke</label>
                        </div>
                        <input
                          value={deepDive.substance}
                          onChange={(e) => setDeepDive(p => ({ ...p, substance: e.target.value }))}
                          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none font-medium"
                          placeholder="z.B. Starke Marktposition"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center shadow-md">
                            <ShieldAlert className="h-5 w-5 text-white" />
                          </div>
                          <label className="text-sm font-bold text-slate-700">Risikobewertung</label>
                        </div>
                        <input
                          value={deepDive.risk}
                          onChange={(e) => setDeepDive(p => ({ ...p, risk: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 outline-none"
                          placeholder="z.B. Regulatory Risk"
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {/* Meta Info - ✅ MIT CATEGORY COMBOBOX */}
                <Card className="p-10 bg-white border-2 border-slate-200 shadow-lg">
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-6">
                    <Tag className="h-4 w-4" />
                    Metadaten
                  </label>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-3 block">Ticker (optional)</label>
                      <input
                        value={form.ticker}
                        onChange={(e) => setForm((p) => ({ ...p, ticker: e.target.value }))}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none font-mono font-semibold uppercase"
                        placeholder="z.B. AAPL"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-bold text-slate-700 mb-3 block">Kategorie (optional)</label>
                      {/* ✅ COMBOBOX INLINE */}
                      <CategoryCombobox
                        value={form.category}
                        onChange={(value) => setForm((p) => ({ ...p, category: value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t-2 border-slate-100">
                    <label className="flex items-center gap-3 cursor-pointer group p-4 hover:bg-violet-50 rounded-xl transition-all">
                      <input
                        type="checkbox"
                        checked={form.isPremium}
                        onChange={(e) => setForm((p) => ({ ...p, isPremium: e.target.checked }))}
                        className="w-6 h-6 rounded-lg border-2 border-slate-300 text-violet-600 focus:ring-4 focus:ring-violet-500/20"
                      />
                      <div className="flex items-center gap-2 flex-1">
                        <Sparkles className="h-5 w-5 text-amber-500" />
                        <span className="text-sm font-bold text-slate-700 group-hover:text-slate-900">
                          Als Premium-Content markieren
                        </span>
                      </div>
                    </label>
                  </div>
                </Card>

                {/* Content Editor */}
                <Card className="overflow-hidden border-2 border-slate-200 shadow-lg">
                  <div className="px-10 py-6 border-b-2 border-slate-200 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900">
                    <label className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
                      <FileText className="h-5 w-5" />
                      Artikel Inhalt
                    </label>
                    <p className="text-xs text-blue-200 mt-1">Rich-Text Editor mit Formatierungsoptionen</p>
                  </div>
                  <TiptapEditor
                    content={form.content}
                    onChange={(html) => setForm((p) => ({ ...p, content: html }))}
                    placeholder="Schreibe hier deinen Artikel..."
                    onImageUpload={handleImageUpload}
                  />
                  <div className="px-10 py-4 border-t border-slate-200 bg-white">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">
                        {form.content.replace(/<[^>]*>/g, '').length} Zeichen
                      </span>
                      {form.content.replace(/<[^>]*>/g, '').length > 5000 && (
                        <span className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Empfohlen: unter 5000 Zeichen
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              // PREVIEW MODE
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="p-6 border-b-2 border-slate-200 bg-gradient-to-r from-blue-50 to-violet-50">
                  <Badge className="bg-blue-100 text-blue-700 border border-blue-200">
                    <Eye className="h-3 w-3 mr-1" />
                    Vorschau-Modus
                  </Badge>
                </div>
                
                {type === 'news' ? (
                  <NewsView item={previewData} />
                ) : (
                  <AnalyseView item={previewData} />
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirm.show && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full mx-4 p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center flex-shrink-0">
                <Trash2 className="h-7 w-7 text-red-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Wirklich löschen?</h3>
                <p className="text-sm text-slate-500 mt-1">Diese Aktion kann nicht rückgängig gemacht werden</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl mb-6">
              <p className="text-sm text-slate-600 font-medium line-clamp-2">
                {deleteConfirm.title}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, id: '', title: '' })}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all"
              >
                Abbrechen
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm.id)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                Löschen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}