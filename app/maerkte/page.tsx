<<<<<<< HEAD
'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/Badge";
=======
import { Badge } from "@/components/ui/Badge";
import { MarketSnapshot } from "@/components/markets/MarketSnapshot";
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
import { Card } from "@/components/ui/Card";
import { MarketCalendar } from "@/components/markets/MarketCalendar";
import { 
  Calendar, 
  TrendingUp, 
  Activity,
  Globe,
  BarChart3,
<<<<<<< HEAD
  Zap,
  ArrowUp,
  ArrowDown,
  Minus,
  RefreshCw
} from "lucide-react";

// Live Market Data Hook
function useLiveMarketData() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchMarketData = async () => {
    try {
      const response = await fetch('/api/markets/live');
      const marketData = await response.json();
      
      setData(marketData);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching market data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarketData();
    const interval = setInterval(fetchMarketData, 30000);
    return () => clearInterval(interval);
  }, []);

  return { data, loading, lastUpdate, refresh: fetchMarketData };
}

// Live Market Snapshot Component - TR STYLE
function LiveMarketSnapshot() {
  const { data, loading, lastUpdate, refresh } = useLiveMarketData();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-semibold text-slate-700">Lade Marktdaten...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header mit Update Time */}
      <div className="flex items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-sm font-semibold text-slate-700">
            {lastUpdate ? lastUpdate.toLocaleTimeString('de-DE') : 'Live'}
          </span>
        </div>
        
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all text-sm font-semibold text-slate-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          Aktualisieren
        </button>
      </div>

      {/* Market Cards Grid - TR Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-6 pb-6">
        {data.map((market) => {
          const isPositive = parseFloat(market.change) > 0;
          const isNeutral = parseFloat(market.change) === 0;

          return (
            <Card
              key={market.symbol}
              className="p-6 bg-white border border-slate-200 rounded-2xl hover:shadow-md transition-all group"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">
                    {market.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500">
                      {market.symbol}
                    </span>
                    <Badge className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 border-none">
                      {market.region}
                    </Badge>
                  </div>
                </div>

                {/* Change Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  isPositive 
                    ? 'bg-emerald-50' 
                    : isNeutral 
                    ? 'bg-slate-50' 
                    : 'bg-red-50'
                }`}>
                  {isPositive ? (
                    <ArrowUp className="h-5 w-5 text-emerald-600" />
                  ) : isNeutral ? (
                    <Minus className="h-5 w-5 text-slate-400" />
                  ) : (
                    <ArrowDown className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-slate-900 mb-2">
                  {parseFloat(market.price).toLocaleString('de-DE', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-base font-bold ${
                    isPositive 
                      ? 'text-emerald-600' 
                      : isNeutral 
                      ? 'text-slate-400' 
                      : 'text-red-600'
                  }`}>
                    {isPositive ? '+' : ''}{market.change}
                  </span>
                  <span className={`text-sm font-semibold ${
                    isPositive 
                      ? 'text-emerald-600' 
                      : isNeutral 
                      ? 'text-slate-400' 
                      : 'text-red-600'
                  }`}>
                    ({isPositive ? '+' : ''}{market.changePercent}%)
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Hoch
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {parseFloat(market.high).toLocaleString('de-DE')}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                    Tief
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    {parseFloat(market.low).toLocaleString('de-DE')}
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// Main Page Component
export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Container mit max-width wie dein Template */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        
        {/* Header - TR Style */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
=======
  Zap
} from "lucide-react";

export default function MarketsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 flex items-center justify-center shadow-lg">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
<<<<<<< HEAD
                Märkte
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Live-Kurse · Indizes · Kalender
=======
                Markt-Übersicht
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Live-Daten · Indizes · Events · Kalender
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              </p>
            </div>
          </div>

<<<<<<< HEAD
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Die wichtigsten Indizes und Kryptowährungen auf einen Blick – in Echtzeit.
          </p>
        </header>

        {/* Quick Stats - Kompakt für Tablet */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Indizes
                </p>
                <p className="text-xl font-bold text-slate-900">Live</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
                <Globe className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Global
                </p>
                <p className="text-xl font-bold text-slate-900">24/7</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Märkte
                </p>
                <p className="text-xl font-bold text-slate-900">6</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
                <Zap className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Update
                </p>
                <p className="text-xl font-bold text-slate-900">30s</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Live Market Data */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Live Kurse</h2>
                <p className="text-sm text-slate-500">Echtzeit-Daten der wichtigsten Märkte</p>
=======
          <p className="max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
            Die wichtigsten Indizes, Makro-Daten und Unternehmensereignisse 
            auf einen Blick – in Echtzeit.
          </p>
        </header>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Indizes</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">Live</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Globe className="h-4 w-4 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Global</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">24/7</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-violet-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Märkte</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">10+</div>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                <Zap className="h-4 w-4 text-amber-600" />
              </div>
              <span className="text-xs font-semibold text-slate-600">Updates</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">Real</div>
          </div>
        </div>

        {/* Market Snapshot */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Live Indizes</h2>
                <p className="text-sm text-slate-500">Echtzeit-Kurse der wichtigsten Märkte</p>
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Live</span>
            </div>
          </div>

<<<<<<< HEAD
          <Card className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <LiveMarketSnapshot />
          </Card>
=======
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-[32px] opacity-20 group-hover:opacity-30 blur-xl transition-all" />
            
            {/* Snapshot Container */}
            <div className="relative rounded-[32px] bg-slate-950 p-1 shadow-2xl overflow-hidden">
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[800px] md:min-w-full">
                  <MarketSnapshot />
                </div>
              </div>
            </div>
          </div>
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
        </div>

        {/* Market Calendar */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Markt-Kalender</h2>
              <p className="text-sm text-slate-500">
                Wichtige Events, Zinsentscheide und Earnings
=======
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Markt-Kalender</h2>
              <p className="text-sm text-slate-500">
                Makro-Events, Zinsentscheide, Konjunkturdaten & Earnings
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              </p>
            </div>
          </div>

<<<<<<< HEAD
          <Card className="p-6 md:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
=======
          <Card className="p-8 bg-white border-none shadow-sm rounded-3xl">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
            <MarketCalendar />
          </Card>
        </div>

<<<<<<< HEAD
        {/* Info Cards - Responsive Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-sm">
=======
        {/* Info Cards Row */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Echtzeit-Kurse
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
<<<<<<< HEAD
              Verfolge die wichtigsten Indizes weltweit in Echtzeit mit Auto-Updates alle 30 Sekunden.
=======
              Verfolge die wichtigsten Indizes weltweit in Echtzeit mit Live-Updates.
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 rounded-2xl">
<<<<<<< HEAD
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4 shadow-sm">
=======
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4 shadow-lg">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Event-Kalender
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Verpasse keine wichtigen Makro-Events, Earnings oder Zinsentscheide mehr.
            </p>
          </Card>

<<<<<<< HEAD
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 rounded-2xl md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4 shadow-sm">
=======
          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4 shadow-lg">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Globale Märkte
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
<<<<<<< HEAD
              Von US über Europa bis Krypto – alle wichtigen Märkte an einem Ort.
=======
              Von US über Europa bis Asien – alle wichtigen Märkte an einem Ort.
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}