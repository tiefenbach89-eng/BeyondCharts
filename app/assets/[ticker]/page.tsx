'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  DollarSign,
  Euro,
  Building2,
  Globe,
  BarChart3,
  Briefcase,
  Calendar,
  Users,
  Target,
  Shield,
  Activity,
  ExternalLink,
  BookOpen,
  Newspaper
} from 'lucide-react';

// Helper: Konvertiere Ticker zu TradingView Symbol Format
function getTradingViewSymbol(ticker: string): string {
  const symbolMap: { [key: string]: string } = {
    // Deutsche Aktien
    'SAP.DE': 'XETR:SAP',
    'SIE.DE': 'XETR:SIE',
    'VOW3.DE': 'XETR:VOW3',
    'AIR.DE': 'XETR:AIR',
    'VWCE.DE': 'XETR:VWCE',
    'EUNL.DE': 'XETR:EUNL',
    'IUSN.DE': 'XETR:IUSN',
    
    // US Aktien
    'AAPL': 'NASDAQ:AAPL',
    'MSFT': 'NASDAQ:MSFT',
    'GOOGL': 'NASDAQ:GOOGL',
    'META': 'NASDAQ:META',
    'NVDA': 'NASDAQ:NVDA',
    'TSLA': 'NASDAQ:TSLA',
    'AMZN': 'NASDAQ:AMZN',
    
    // ETFs
    'SPY': 'AMEX:SPY',
    'QQQ': 'NASDAQ:QQQ',
    'DIA': 'AMEX:DIA',
  };
  
  return symbolMap[ticker] || `NASDAQ:${ticker}`;
}

interface AssetDetails {
  ticker: string;
  name: string;
  currency: string;
  price: number;
  priceUSD: number;
  priceEUR: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume: number;
  previousClose: number;
  fundamentals: {
    marketCap: string;
    pe: string;
    eps: string;
    dividend: string;
    beta: string;
    week52High: string;
    week52Low: string;
    avgVolume: string;
    shares: string;
  };
  eurUsd: number;
}

export default function AssetDetailPage({ params }: { params: { ticker: string } }) {
  const [asset, setAsset] = useState<AssetDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [relatedAnalyses, setRelatedAnalyses] = useState<any[]>([]);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);

  const fetchAssetDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assets/${params.ticker}`);
      if (!response.ok) throw new Error('Asset nicht gefunden');
      
      const data = await response.json();
      setAsset(data);
      setLoading(false);
      
      // Hole related content (Analysen & News mit diesem Ticker)
      fetchRelatedContent(params.ticker);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  const fetchRelatedContent = async (ticker: string) => {
    try {
      // Suche nach Analysen mit diesem Ticker
      const analysesRes = await fetch(`/api/analysen?ticker=${ticker.replace('.DE', '')}`);
      if (analysesRes.ok) {
        const analysesData = await analysesRes.json();
        setRelatedAnalyses(analysesData.slice(0, 3)); // Max 3
      }
      
      // Suche nach News mit diesem Ticker
      const newsRes = await fetch(`/api/news?ticker=${ticker.replace('.DE', '')}`);
      if (newsRes.ok) {
        const newsData = await newsRes.json();
        setRelatedNews(newsData.slice(0, 3)); // Max 3
      }
    } catch (error) {
      console.error('Error fetching related content:', error);
    }
  };

  useEffect(() => {
    fetchAssetDetails();
  }, [params.ticker]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-semibold text-slate-600">Lade Asset-Daten...</p>
        </div>
      </div>
    );
  }

  if (!asset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Asset nicht gefunden</h2>
          <p className="text-slate-600 mb-6">Das angeforderte Asset existiert nicht.</p>
          <Link
            href="/assets"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            Zurück zu Assets
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = asset.changePercent > 0;
  const isNeutral = asset.changePercent === 0;
  const displayPrice = currency === 'EUR' ? asset.priceEUR : asset.priceUSD;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Back Button - Mobile Optimized */}
        <Link
          href="/assets"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Zurück zu Assets
        </Link>

        {/* Header Card - Mobile First */}
        <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            {/* Left: Asset Info */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center shadow-sm">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                    {asset.name}
                  </h1>
                  <p className="text-sm text-slate-500">
                    {asset.ticker} · {asset.currency}
                  </p>
                </div>
              </div>

              {/* Price - Large on Mobile */}
              <div className="mt-4">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-slate-900">
                    {displayPrice.toLocaleString('de-DE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-xl font-semibold text-slate-500">
                    {currency}
                  </span>
                </div>

                {/* Change */}
                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                    isPositive 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : isNeutral 
                      ? 'bg-slate-50 text-slate-600' 
                      : 'bg-red-50 text-red-700'
                  }`}>
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4" />
                    ) : isNeutral ? (
                      <Minus className="h-4 w-4" />
                    ) : (
                      <TrendingDown className="h-4 w-4" />
                    )}
                    <span className="text-base font-bold">
                      {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </span>
                  </div>
                  <span className={`text-sm font-semibold ${
                    isPositive ? 'text-emerald-700' : isNeutral ? 'text-slate-600' : 'text-red-700'
                  }`}>
                    {isPositive ? '+' : ''}{asset.change.toFixed(2)} {asset.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Controls - Stack on Mobile */}
            <div className="flex flex-col gap-3">
              {/* Currency Toggle */}
              <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setCurrency('EUR')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    currency === 'EUR'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  <Euro className="h-4 w-4 inline mr-1" />
                  EUR
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                    currency === 'USD'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600'
                  }`}
                >
                  <DollarSign className="h-4 w-4 inline mr-1" />
                  USD
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={fetchAssetDetails}
                className="px-4 py-2 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all flex items-center justify-center gap-2 font-semibold text-sm text-slate-700"
              >
                <RefreshCw className="h-4 w-4" />
                Aktualisieren
              </button>
            </div>
          </div>
        </Card>

        {/* Chart Section - TradingView Widget */}
        <Card className="p-4 md:p-6 bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Chart</h2>
            <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">
              <Activity className="h-3 w-3 inline mr-1" />
              Live
            </Badge>
          </div>
          
          {/* TradingView Chart - Responsive */}
          <div className="w-full h-[400px] md:h-[500px] rounded-xl overflow-hidden bg-slate-50">
            <iframe
              src={`https://www.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${getTradingViewSymbol(asset.ticker)}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=[]&theme=light&style=1&timezone=Europe/Berlin&withdateranges=1&studies_overrides={}&overrides={}&enabled_features=[]&disabled_features=[]&locale=de_DE&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${asset.ticker}`}
              className="w-full h-full border-0"
              title="TradingView Chart"
            />
          </div>
        </Card>

        {/* Quick Stats - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Hoch
            </p>
            <p className="text-xl font-bold text-slate-900">
              {asset.high?.toFixed(2) || 'N/A'}
            </p>
          </Card>

          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Tief
            </p>
            <p className="text-xl font-bold text-slate-900">
              {asset.low?.toFixed(2) || 'N/A'}
            </p>
          </Card>

          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Eröffnung
            </p>
            <p className="text-xl font-bold text-slate-900">
              {asset.open?.toFixed(2) || 'N/A'}
            </p>
          </Card>

          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Vortag
            </p>
            <p className="text-xl font-bold text-slate-900">
              {asset.previousClose?.toFixed(2) || 'N/A'}
            </p>
          </Card>
        </div>

        {/* Fundamentals - Mobile Optimized Grid */}
        <Card className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Fundamentaldaten</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Market Cap */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Marktkapitalisierung
                </p>
                <p className={`text-lg font-bold ${asset.fundamentals?.marketCap && asset.fundamentals.marketCap !== 'N/A' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {asset.fundamentals?.marketCap || 'N/A'}
                </p>
              </div>
            </div>

            {/* P/E Ratio */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-50 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  KGV (P/E)
                </p>
                <p className={`text-lg font-bold ${asset.fundamentals?.pe && asset.fundamentals.pe !== 'N/A' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {asset.fundamentals?.pe || 'N/A'}
                </p>
              </div>
            </div>

            {/* EPS */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Gewinn/Aktie (EPS)
                </p>
                <p className={`text-lg font-bold ${asset.fundamentals?.eps && asset.fundamentals.eps !== 'N/A' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {asset.fundamentals?.eps || 'N/A'}
                </p>
              </div>
            </div>

            {/* Dividend */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Dividendenrendite
                </p>
                <p className={`text-lg font-bold ${asset.fundamentals?.dividend && asset.fundamentals.dividend !== 'N/A' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {asset.fundamentals?.dividend || 'N/A'}
                </p>
              </div>
            </div>

            {/* Beta */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Beta (Volatilität)
                </p>
                <p className={`text-lg font-bold ${asset.fundamentals?.beta && asset.fundamentals.beta !== 'N/A' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {asset.fundamentals?.beta || 'N/A'}
                </p>
              </div>
            </div>

            {/* Volume */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-cyan-50 flex items-center justify-center flex-shrink-0">
                <Users className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Ø Volumen
                </p>
                <p className={`text-lg font-bold ${asset.fundamentals?.avgVolume && asset.fundamentals.avgVolume !== 'N/A' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {asset.fundamentals?.avgVolume || 'N/A'}
                </p>
              </div>
            </div>

            {/* 52W High */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  52W Hoch
                </p>
                <p className={`text-lg font-bold ${asset.fundamentals?.week52High && asset.fundamentals.week52High !== 'N/A' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {asset.fundamentals?.week52High || 'N/A'}
                </p>
              </div>
            </div>

            {/* 52W Low */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center flex-shrink-0">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  52W Tief
                </p>
                <p className={`text-lg font-bold ${asset.fundamentals?.week52Low && asset.fundamentals.week52Low !== 'N/A' ? 'text-slate-900' : 'text-slate-400'}`}>
                  {asset.fundamentals?.week52Low || 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Related Content - Analysen & News */}
        {(relatedAnalyses.length > 0 || relatedNews.length > 0) && (
          <div className="space-y-6">
            {/* Analysen */}
            {relatedAnalyses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Unsere Analysen</h2>
                  <Link
                    href={`/analysen?ticker=${asset.ticker}`}
                    className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    Alle ansehen
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {relatedAnalyses.map((analyse: any) => (
                    <Link key={analyse.id} href={`/analysen/${analyse.slug}`}>
                      <Card className="p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all group">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                              {analyse.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {analyse.summary}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* News */}
            {relatedNews.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-slate-900">Aktuelle News</h2>
                  <Link
                    href={`/news?ticker=${asset.ticker}`}
                    className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1"
                  >
                    Alle ansehen
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {relatedNews.map((news: any) => (
                    <Link key={news.id} href={`/news/${news.slug}`}>
                      <Card className="p-4 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all group">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center flex-shrink-0">
                            <Newspaper className="h-5 w-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 line-clamp-2 group-hover:text-primary transition-colors">
                              {news.title}
                            </h3>
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">
                          {news.summary}
                        </p>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
