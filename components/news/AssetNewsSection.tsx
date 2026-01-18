'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Clock, ExternalLink, Newspaper, TrendingDown, Minus, ChevronDown } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import type { UnifiedNewsItem } from '@/lib/unified-news';

interface AssetNewsSectionProps {
  initialNews?: UnifiedNewsItem[];
}

export function AssetNewsSection({ initialNews = [] }: AssetNewsSectionProps) {
  const [news, setNews] = useState<UnifiedNewsItem[]>(initialNews);
  const [loading, setLoading] = useState(false);
  const [displayCount, setDisplayCount] = useState(6);

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
        {news.slice(0, displayCount).map((item) => (
          <AssetNewsCard key={item.id} item={item} />
        ))}
      </div>

      {/* Load More Button */}
      {displayCount < news.length && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => setDisplayCount(prev => Math.min(prev + 6, news.length))}
            className="px-6 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all flex items-center gap-2 font-bold text-slate-700 hover:border-blue-300"
          >
            <span>Mehr News laden</span>
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Show count */}
      <div className="text-center mt-4 text-sm text-slate-500">
        Zeige {Math.min(displayCount, news.length)} von {news.length} News
      </div>
    </section>
  );
}

interface AssetNewsCardProps {
  item: UnifiedNewsItem;
}

function AssetNewsCard({ item }: AssetNewsCardProps) {
  const primarySymbol = item.related_symbols[0];
  const hasMultipleSymbols = item.related_symbols.length > 1;

  // Format time ago
  const timeAgo = getTimeAgo(item.published_at);

  return (
    <a href={item.url} target="_blank" rel="noopener noreferrer">
      <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full flex flex-col">
        {/* Image */}
        {item.image_url && (
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            <img
              src={item.image_url}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Symbol Badge on Image */}
            {primarySymbol && (
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <div className={`px-3 py-1.5 bg-white/95 backdrop-blur-sm border border-slate-200 rounded-xl flex items-center gap-1.5 shadow-lg`}>
                  <span className="text-xs font-bold text-blue-700">
                    {primarySymbol}
                  </span>
                </div>
                {hasMultipleSymbols && (
                  <span className="text-xs text-white font-medium bg-black/50 backdrop-blur-sm px-2 py-1 rounded-lg">
                    +{item.related_symbols.length - 1}
                  </span>
                )}
              </div>
            )}
          </div>
        )}

      <div className="relative p-6 flex-1 flex flex-col">
        {/* Symbol Badge (if no image) */}
        {!item.image_url && primarySymbol && (
          <div className="flex items-center gap-2 mb-4">
            <div className={`px-3 py-1.5 bg-gradient-to-r from-blue-50 to-violet-50 border border-blue-200 rounded-xl flex items-center gap-1.5`}>
              <span className="text-xs font-bold text-blue-700">
                {primarySymbol}
              </span>
            </div>
            {hasMultipleSymbols && (
              <span className="text-xs text-slate-500 font-medium">
                +{item.related_symbols.length - 1} weitere
              </span>
            )}
          </div>
        )}

        {/* Headline */}
        <h3 className="text-lg font-bold text-slate-900 mb-3 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors">
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-sm text-slate-600 mb-4 line-clamp-3 leading-relaxed flex-1">
            {item.description}
          </p>
        )}

        {/* Meta Info */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeAgo}</span>
          </div>

          <div className="flex items-center gap-1 text-blue-600 font-semibold">
            <span>Read more</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </div>
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
    </a>
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
