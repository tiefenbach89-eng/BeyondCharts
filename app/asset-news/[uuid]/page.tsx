'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Newspaper,
  Sparkles,
  Building2,
} from 'lucide-react';
import type { MarketauxNewsItem } from '@/lib/marketaux';

export default function AssetNewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const uuid = params.uuid as string;

  const [newsItem, setNewsItem] = useState<MarketauxNewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<string>('');
  const [summaryLoading, setSummaryLoading] = useState(false);

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

  const generateSummary = async () => {
    if (!newsItem) return;

    setSummaryLoading(true);
    try {
      const response = await fetch('/api/summarize-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newsItem.title,
          description: newsItem.description,
          snippet: newsItem.snippet,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setSummary(data.summary);
      }
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('Zusammenfassung konnte nicht generiert werden.');
    } finally {
      setSummaryLoading(false);
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
    if (score > 0.1) return { icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50', label: 'Positiv' };
    if (score < -0.1) return { icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50', label: 'Negativ' };
    return { icon: Minus, color: 'text-slate-600', bg: 'bg-slate-50', label: 'Neutral' };
  };

  const primaryEntity = newsItem.entities[0];
  const sentiment = primaryEntity ? getSentimentDisplay(primaryEntity.sentiment_score) : null;
  const SentimentIcon = sentiment?.icon;

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

        {/* Main Content Card */}
        <Card className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">

          {/* Entity Badges */}
          {newsItem.entities.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              {newsItem.entities.map((entity, idx) => {
                const entitySentiment = getSentimentDisplay(entity.sentiment_score);
                const EntityIcon = entitySentiment.icon;

                return (
                  <div
                    key={idx}
                    className={`px-4 py-2 ${entitySentiment.bg} rounded-xl border ${entitySentiment.bg.replace('bg-', 'border-').replace('50', '200')} flex items-center gap-2`}
                  >
                    <Building2 className={`h-4 w-4 ${entitySentiment.color}`} />
                    <span className={`font-bold text-sm ${entitySentiment.color}`}>
                      {entity.symbol}
                    </span>
                    <EntityIcon className={`h-3 w-3 ${entitySentiment.color}`} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {newsItem.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-slate-600">
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

          {/* Image */}
          {newsItem.image_url && (
            <div className="mb-6 rounded-2xl overflow-hidden">
              <img
                src={newsItem.image_url}
                alt={newsItem.title}
                className="w-full h-auto"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            </div>
          )}

          {/* Description */}
          {newsItem.description && (
            <div className="mb-6">
              <p className="text-lg text-slate-700 leading-relaxed">
                {newsItem.description}
              </p>
            </div>
          )}

          {/* AI Summary Button */}
          {!summary && (
            <button
              onClick={generateSummary}
              disabled={summaryLoading}
              className="w-full mb-6 px-6 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white font-bold rounded-2xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Sparkles className={`h-5 w-5 ${summaryLoading ? 'animate-spin' : ''}`} />
              {summaryLoading ? 'Generiere Zusammenfassung...' : 'KI-Zusammenfassung generieren'}
            </button>
          )}

          {/* AI Summary */}
          {summary && (
            <div className="mb-6 p-6 bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-2xl">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-violet-600" />
                <h3 className="text-lg font-bold text-violet-900">KI-Zusammenfassung</h3>
              </div>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {summary}
              </p>
            </div>
          )}

          {/* Snippet */}
          {newsItem.snippet && (
            <div className="mb-6 p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="text-sm text-slate-600 leading-relaxed">
                {newsItem.snippet}
              </p>
            </div>
          )}

          {/* Read Full Article */}
          {newsItem.url && (
            <a
              href={newsItem.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all"
            >
              Vollständigen Artikel lesen
              <ExternalLink className="h-4 w-4" />
            </a>
          )}

        </Card>

        {/* Entity Highlights */}
        {primaryEntity?.highlights && primaryEntity.highlights.length > 0 && (
          <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Key Highlights</h3>
            <div className="space-y-3">
              {primaryEntity.highlights.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    highlight.sentiment > 0.1 ? 'bg-green-500' :
                    highlight.sentiment < -0.1 ? 'bg-red-500' :
                    'bg-slate-400'
                  }`} />
                  <p className="text-sm text-slate-700 flex-1">
                    {highlight.highlight}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        )}

      </div>
    </div>
  );
}
