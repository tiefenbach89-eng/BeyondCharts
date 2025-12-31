'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { TiptapEditor } from '@/components/admin/TiptapEditor';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { autoSlug } from '@/lib/slugGenerator';
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
  X
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  imageUrl?: string;
  status: 'draft' | 'published';
  isPremium: boolean;
  ticker?: string;
  category?: string;
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
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [type, setType] = useState<'news' | 'analysen'>('news');
  const [posts, setPosts] = useState<Post[]>([]);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [form, setForm] = useState({
    title: '',
    slug: '',
    summary: '',
    content: '',
    imageUrl: '',
    isPremium: false,
    ticker: '',
    category: '',
  });

  // Deep Dive state (nur für Analysen)
  const [deepDive, setDeepDive] = useState<DeepDive>({
    thesis: '',
    profitability: '',
    substance: '',
    risk: '',
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && view === 'editor' && !editingPost) {
      setForm(prev => ({ ...prev, slug: autoSlug(prev.title) }));
    }
  }, [form.title, view, editingPost]);

  // Load posts on mount
  useEffect(() => {
    loadPosts();
  }, [type]);

  const loadPosts = async () => {
    try {
      const res = await fetch(`/api/admin/${type}?includeDrafts=1`);
      const data = await res.json();
      setPosts(data);
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  };

  const startNew = () => {
    setForm({
      title: '',
      slug: '',
      summary: '',
      content: '',
      imageUrl: '',
      isPremium: false,
      ticker: '',
      category: '',
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
      isPremium: post.isPremium,
      ticker: post.ticker || '',
      category: post.category || '',
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
      alert('Bitte fülle alle Pflichtfelder aus:\n- Titel\n- Slug\n- Summary\n- Inhalt');
      return;
    }

    setIsSaving(true);

    const payload: any = {
      title: form.title,
      slug: form.slug,
      summary: form.summary,
      content: form.content,
      imageUrl: form.imageUrl || undefined,
      status,
      isPremium: form.isPremium,
      ticker: form.ticker || undefined,
      category: form.category || undefined,
      auditStatus: 'approved', // Required by API
      publishedAt: status === 'published' ? new Date().toISOString() : undefined,
    };

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

      alert(status === 'published' ? '✅ Erfolgreich veröffentlicht!' : '✅ Als Entwurf gespeichert!');
      setView('list');
      loadPosts();
    } catch (error: any) {
      console.error('Error saving:', error);
      alert(`❌ Fehler: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Wirklich löschen?')) return;

    try {
      await fetch(`/api/admin/${type}?id=${id}`, { method: 'DELETE' });
      loadPosts();
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Fehler beim Löschen!');
    }
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    // For now: Local preview
    // Later: Upload to Supabase Storage
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
      {view === 'list' ? (
        <>
          {/* Header */}
          <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <Sparkles className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-slate-900">Content Studio</h1>
                    <p className="text-sm text-slate-500 mt-0.5">BeyondCharts CMS · {type === 'news' ? 'News' : 'Analysen'}</p>
                  </div>
                </div>

                {/* Actions */}
                <Button 
                  onClick={startNew}
                  size="sm" 
                  className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 shadow-lg shadow-blue-500/20"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Neu
                </Button>
              </div>
            </div>
          </header>

          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Navigation Tabs */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => setType('news')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  type === 'news'
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <FileText className="h-4 w-4 inline mr-2" />
                News
              </button>
              <button
                onClick={() => setType('analysen')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  type === 'analysen'
                    ? 'bg-slate-900 text-white shadow-lg'
                    : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
                }`}
              >
                <TrendingUp className="h-4 w-4 inline mr-2" />
                Analysen
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                  placeholder="Suchen..."
                />
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[
                { label: 'Gesamt', value: posts.length, icon: LayoutGrid, color: 'from-blue-500 to-cyan-500' },
                { label: 'Published', value: posts.filter(p => p.status === 'published').length, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
                { label: 'Drafts', value: posts.filter(p => p.status === 'draft').length, icon: Clock, color: 'from-amber-500 to-orange-500' },
                { label: 'Premium', value: posts.filter(p => p.isPremium).length, icon: Sparkles, color: 'from-violet-500 to-purple-500' },
              ].map((stat, i) => (
                <Card key={i} className="p-6 bg-gradient-to-br from-white to-slate-50/50 border-none shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{stat.label}</p>
                      <p className="text-3xl font-bold text-slate-900">{stat.value}</p>
                    </div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                      <stat.icon className="h-7 w-7 text-white" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Posts Table */}
            <Card className="overflow-hidden shadow-sm border border-slate-200">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-slate-50 to-slate-100/50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Beitrag
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-start gap-3">
                          <FileText className="h-5 w-5 text-slate-400 mt-0.5 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <div className="font-semibold text-slate-900 truncate">{post.title}</div>
                              {post.isPremium && (
                                <Badge className="bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] flex-shrink-0">
                                  <Sparkles className="h-3 w-3 mr-1" />
                                  PREMIUM
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-3 flex-wrap">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('de-DE')}
                              </span>
                              <span>·</span>
                              <span className="font-mono">/{type}/{post.slug}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <Badge
                          className={
                            post.status === "published"
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-amber-100 text-amber-700 border-amber-200"
                          }
                        >
                          {post.status === "published" ? "Published" : "Draft"}
                        </Badge>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => startEdit(post)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
                            title="Bearbeiten"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(post.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
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
                <div className="p-16 text-center bg-white">
                  <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-base text-slate-500 font-medium">
                    {searchQuery ? 'Keine Ergebnisse gefunden' : 'Noch keine Beiträge vorhanden'}
                  </p>
                  {!searchQuery && (
                    <Button onClick={startNew} size="sm" className="mt-4">
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
        <div className="min-h-screen">
          {/* Floating Editor Header */}
          <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setView('list')}
                  className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 hover:bg-slate-100 rounded-xl"
                >
                  ← Zurück
                </button>
                <div className="flex items-center gap-3">
                  <Button
                    onClick={() => setShowPreview(!showPreview)}
                    variant="outline"
                    size="sm"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? 'Editor' : 'Vorschau'}
                  </Button>
                  <Button
                    onClick={() => handleSave('draft')}
                    variant="outline"
                    size="sm"
                    disabled={isSaving}
                  >
                    {isSaving ? 'Speichert...' : 'Als Entwurf'}
                  </Button>
                  <Button
                    onClick={() => handleSave('published')}
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                    disabled={isSaving}
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    {isSaving ? 'Speichert...' : 'Veröffentlichen'}
                  </Button>
                </div>
              </div>
            </div>
          </header>

          <div className="max-w-5xl mx-auto px-6 py-12">
            {!showPreview ? (
              <div className="space-y-8">
                {/* Title */}
                <Card className="p-8 bg-gradient-to-br from-white via-white to-slate-50/30 border border-slate-200 shadow-sm">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    <FileText className="h-3.5 w-3.5" />
                    Titel
                  </label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                    className="w-full border-none p-0 focus:ring-0 outline-none text-4xl font-bold text-slate-900 placeholder:text-slate-300 bg-transparent"
                    placeholder="Titel eingeben..."
                  />
                  
                  {/* Auto-generated Slug Preview */}
                  {form.slug && (
                    <div className="mt-6 pt-6 border-t border-slate-200">
                      <p className="text-xs text-slate-500 mb-2">URL Slug (automatisch generiert):</p>
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-mono px-3 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-200">
                          /{type}/{form.slug}
                        </p>
                      </div>
                    </div>
                  )}
                </Card>

                {/* Image Upload */}
                <Card className="p-8 bg-gradient-to-br from-white via-white to-slate-50/30 border border-slate-200 shadow-sm">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    <Tag className="h-3.5 w-3.5" />
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
                </Card>

                {/* Summary */}
                <Card className="p-8 bg-gradient-to-br from-white via-white to-slate-50/30 border border-slate-200 shadow-sm">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">
                    <FileText className="h-3.5 w-3.5" />
                    Summary
                  </label>
                  <textarea
                    value={form.summary}
                    onChange={(e) => setForm((p) => ({ ...p, summary: e.target.value }))}
                    className="w-full h-32 border-none p-0 focus:ring-0 outline-none text-lg text-slate-700 resize-none leading-relaxed placeholder:text-slate-300 bg-transparent"
                    placeholder="Kurze Zusammenfassung..."
                  />
                </Card>

                {/* Deep Dive Metrics (nur für Analysen) */}
                {type === 'analysen' && (
                  <Card className="p-8 bg-gradient-to-br from-white via-white to-violet-50/20 border border-violet-200 shadow-sm">
                    <label className="flex items-center gap-2 text-xs font-semibold text-violet-600 uppercase tracking-wider mb-6">
                      <Target className="h-4 w-4" />
                      Deep Dive Metriken (Optional)
                    </label>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                            <Target className="h-5 w-5 text-white" />
                          </div>
                          <label className="text-sm font-semibold text-slate-700">Investment Thesis</label>
                        </div>
                        <input
                          value={deepDive.thesis}
                          onChange={(e) => setDeepDive(p => ({ ...p, thesis: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          placeholder="z.B. Growth Story"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center">
                            <Zap className="h-5 w-5 text-white" />
                          </div>
                          <label className="text-sm font-semibold text-slate-700">Key Catalyst</label>
                        </div>
                        <input
                          value={deepDive.profitability}
                          onChange={(e) => setDeepDive(p => ({ ...p, profitability: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none"
                          placeholder="z.B. AI Adoption"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                            <BarChart3 className="h-5 w-5 text-white" />
                          </div>
                          <label className="text-sm font-semibold text-slate-700">Fundamental Strength</label>
                        </div>
                        <input
                          value={deepDive.substance}
                          onChange={(e) => setDeepDive(p => ({ ...p, substance: e.target.value }))}
                          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          placeholder="z.B. Strong Moat"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
                            <ShieldAlert className="h-5 w-5 text-white" />
                          </div>
                          <label className="text-sm font-semibold text-slate-700">Risk Assessment</label>
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

                {/* Meta Info */}
                <Card className="p-8 bg-gradient-to-br from-white via-white to-slate-50/30 border border-slate-200 shadow-sm">
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6">
                    <Tag className="h-3.5 w-3.5" />
                    Metadaten
                  </label>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Ticker (optional)</label>
                      <input
                        value={form.ticker}
                        onChange={(e) => setForm((p) => ({ ...p, ticker: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        placeholder="z.B. AAPL"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">Kategorie (optional)</label>
                      <input
                        value={form.category}
                        onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                        placeholder="z.B. Tech"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-6 border-t border-slate-200">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={form.isPremium}
                        onChange={(e) => setForm((p) => ({ ...p, isPremium: e.target.checked }))}
                        className="w-5 h-5 rounded border-slate-300 text-violet-600 focus:ring-violet-500/20"
                      />
                      <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">
                        Premium Content
                      </span>
                      <Sparkles className="h-4 w-4 text-amber-500" />
                    </label>
                  </div>
                </Card>

                {/* Content Editor */}
                <Card className="overflow-hidden border border-slate-200 shadow-sm">
                  <div className="px-8 py-6 border-b border-slate-200 bg-gradient-to-r from-slate-50 via-white to-slate-50">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      <FileText className="h-4 w-4" />
                      Artikel Inhalt
                    </label>
                  </div>
                  <TiptapEditor
                    content={form.content}
                    onChange={(html) => setForm((p) => ({ ...p, content: html }))}
                    placeholder="Schreibe hier deinen Artikel..."
                    onImageUpload={handleImageUpload}
                  />
                </Card>
              </div>
            ) : (
              // PREVIEW MODE
              <Card className="p-12 bg-white border border-slate-200 shadow-sm">
                <div className="prose prose-slate max-w-none">
                  <h1 className="text-5xl font-bold mb-6">{form.title || 'Kein Titel'}</h1>
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt={form.title} className="w-full rounded-2xl mb-8" />
                  )}
                  <p className="text-xl text-slate-600 leading-relaxed mb-8">{form.summary || 'Keine Summary'}</p>
                  <div dangerouslySetInnerHTML={{ __html: form.content || '<p class="text-slate-400">Kein Inhalt</p>' }} />
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}