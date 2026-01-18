'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Newspaper,
  Building2,
  BookOpen,
  FileText,
  Lightbulb,
  AlertCircle,
} from 'lucide-react';
import type { MarketauxNewsItem } from '@/lib/marketaux';

export default function AssetNewsDetailPage() {
  const params = useParams();
  const uuid = params.uuid as string;

  const [newsItem, setNewsItem] = useState<MarketauxNewsItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNewsItem();
  }, [uuid]);

  const fetchNewsItem = async () => {
    try {
      const response = await fetch('/api/asset-news');
      if (response.ok) {
        const data = await response.json();
        const item = data.news.find((n: MarketauxNewsItem) => n.uuid === uuid);

        if (item) {
          setNewsItem(item);
        } else {
          console.error('News item not found');
        }
      }
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Lade News...</p>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Newspaper className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">News nicht gefunden</h2>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all mt-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zu News
          </Link>
        </div>
      </div>
    );
  }

  const getSentimentDisplay = (score: number) => {
    if (score > 0.1) return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', label: 'Positiv', borderColor: 'border-green-200' };
    if (score < -0.1) return { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50', label: 'Negativ', borderColor: 'border-red-200' };
    return { icon: Minus, color: 'text-slate-600', bg: 'bg-slate-50', label: 'Neutral', borderColor: 'border-slate-200' };
  };

  const primaryEntity = newsItem.entities[0];
  const allEntities = newsItem.entities || [];

  // Combine description and snippet into a full preview
  const fullPreview = [newsItem.description, newsItem.snippet]
    .filter(Boolean)
    .join('\n\n');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Back Button */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zu News
        </Link>

        {/* Hero Image */}
        {newsItem.image_url && (
          <Card className="overflow-hidden border border-slate-200 rounded-3xl shadow-sm p-0">
            <div className="relative h-96 w-full overflow-hidden bg-slate-100">
              <img
                src={newsItem.image_url}
                alt={newsItem.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Title Overlay on Image */}
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                  {newsItem.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{new Date(newsItem.published_at).toLocaleDateString('de-DE', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</span>
                  </div>
                  {newsItem.source && (
                    <div className="flex items-center gap-2">
                      <Newspaper className="h-4 w-4" />
                      <span className="font-semibold">{newsItem.source}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Title Card (if no image) */}
        {!newsItem.image_url && (
          <Card className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
              {newsItem.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{new Date(newsItem.published_at).toLocaleDateString('de-DE', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              {newsItem.source && (
                <div className="flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  <span className="font-semibold">{newsItem.source}</span>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Affected Assets */}
        {allEntities.length > 0 && (
          <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-lg font-bold text-slate-900">Betroffene Assets</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {allEntities.map((entity, idx) => {
                const entitySentiment = getSentimentDisplay(entity.sentiment_score);
                const EntityIcon = entitySentiment.icon;

                return (
                  <div
                    key={idx}
                    className={`p-4 ${entitySentiment.bg} rounded-xl border ${entitySentiment.borderColor} flex flex-col gap-2`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-sm ${entitySentiment.color}`}>
                        {entity.symbol}
                      </span>
                      <EntityIcon className={`h-4 w-4 ${entitySentiment.color}`} />
                    </div>
                    <div className="text-xs text-slate-600">
                      <div className="font-medium">{entity.name}</div>
                      {entity.industry && (
                        <div className="text-slate-500 mt-1">{entity.industry}</div>
                      )}
                    </div>
                    {entity.sentiment_score !== 0 && (
                      <div className={`text-xs font-semibold ${entitySentiment.color}`}>
                        Sentiment: {entitySentiment.label}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        )}

        {/* Article Preview */}
        {fullPreview && (
          <Card className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <FileText className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-slate-900">Artikel-Vorschau</h2>
            </div>

            <div className="prose prose-lg max-w-none">
              <div className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg">
                {fullPreview}
              </div>
            </div>

            {/* Read More CTA */}
            <div className="mt-8 pt-8 border-t border-slate-200">
              <div className="flex items-start gap-4 p-6 bg-blue-50 rounded-2xl border border-blue-200">
                <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h4 className="font-bold text-blue-900 mb-2">
                    Mehr Details im Originalartikel
                  </h4>
                  <p className="text-sm text-blue-700 mb-4">
                    Die vollständige Story mit allen Details, Hintergründen und Analysen findest du auf der Originalquelle.
                  </p>
                  {newsItem.url && (
                    <a
                      href={newsItem.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Jetzt vollständigen Artikel lesen
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Entity Highlights */}
        {primaryEntity?.highlights && primaryEntity.highlights.length > 0 && (
          <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Lightbulb className="h-6 w-6 text-amber-600" />
              <h3 className="text-xl font-bold text-slate-900">Key Highlights</h3>
            </div>
            <div className="space-y-3">
              {primaryEntity.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
                    highlight.sentiment > 0.1 ? 'bg-green-500' :
                    highlight.sentiment < -0.1 ? 'bg-red-500' :
                    'bg-slate-400'
                  }`} />
                  <p className="text-base text-slate-700 flex-1 leading-relaxed">
                    {highlight.highlight}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Source Attribution */}
        <Card className="p-6 bg-slate-50 border border-slate-200 rounded-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Newspaper className="h-5 w-5 text-slate-500" />
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                  Quelle
                </div>
                <div className="text-sm font-bold text-slate-900">
                  {newsItem.source}
                </div>
              </div>
            </div>
            {newsItem.url && (
              <a
                href={newsItem.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1"
              >
                Zur Quelle
                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        </Card>

      </div>
    </div>
  );
}
