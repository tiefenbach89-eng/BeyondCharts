'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Clock, ExternalLink, Newspaper } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { ElbstreamNewsGroup, ElbstreamNewsItem } from '@/lib/elbstream';

interface AssetNewsSectionProps {
  initialNews?: ElbstreamNewsGroup[];
}

export function AssetNewsSection({ initialNews = [] }: AssetNewsSectionProps) {
  const [news, setNews] = useState<ElbstreamNewsGroup[]>(initialNews);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialNews.length === 0) {
      fetchNews();
    }
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/asset-news');
      if (response.ok) {
        const data = await response.json();
        setNews(data.news || []);
      }
    } catch (error) {
      console.error('Error fetching asset news:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && news.length === 0) {
    return (
      <div className="py-12">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (news.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      {/* Section Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center shadow-lg">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Asset News
            </h2>
            <p className="text-sm text-slate-600">
              Aktuelle Nachrichten zu beliebten Assets
            </p>
          </div>
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 6).map((newsGroup) => {
          // Get the first item from the group
          const item = newsGroup.items[0];
          if (!item) return null;

          return (
            <AssetNewsCard key={newsGroup.id} item={item} />
          );
        })}
      </div>
    </section>
  );
}

interface AssetNewsCardProps {
  item: ElbstreamNewsItem;
}

function AssetNewsCard({ item }: AssetNewsCardProps) {
  const primaryAsset = item.assets[0];
  const hasMultipleAssets = item.assets.length > 1;

  // Format time ago
  const timeAgo = getTimeAgo(item.published_at);

  return (
    <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105">
      {/* Gradient Overlay on Hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-violet-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative p-6">
        {/* Asset Badge */}
        {primaryAsset && (
          <div className="flex items-center gap-2 mb-4">
            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-xl">
              <span className="text-xs font-bold text-blue-700">
                {primaryAsset.symbol || primaryAsset.isin}
              </span>
            </div>
            {hasMultipleAssets && (
              <span className="text-xs text-slate-500 font-medium">
                +{item.assets.length - 1} weitere
              </span>
            )}
          </div>
        )}

        {/* Headline */}
        <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight line-clamp-3 group-hover:text-blue-600 transition-colors">
          {item.headline}
        </h3>

        {/* Summary */}
        {item.summary && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-2 leading-relaxed">
            {item.summary}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo}</span>
          </div>

          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <span>Quelle</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        {/* Source Badge */}
        {item.source && (
          <div className="mt-4 pt-4 border-t border-slate-100">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Newspaper className="w-3.5 h-3.5" />
              <span className="font-medium">{item.source}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// Helper function to format time ago
function getTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Gerade eben';
  if (diffMins < 60) return `vor ${diffMins} Min.`;
  if (diffHours < 24) return `vor ${diffHours} Std.`;
  if (diffDays < 7) return `vor ${diffDays} Tag${diffDays > 1 ? 'en' : ''}`;

  return date.toLocaleDateString('de-DE', {
    day: 'numeric',
    month: 'short',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });
}
