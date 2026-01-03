'use client';

import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MarketCalendar } from "@/components/markets/MarketCalendar";
import { 
  Calendar, 
  TrendingUp, 
  Activity,
  Globe,
  BarChart3,
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
              <Activity className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
                Märkte
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Live-Kurse · Indizes · Kalender
              </p>
            </div>
          </div>

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
              </div>
            </div>
            
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-700">Live</span>
            </div>
          </div>

          <Card className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
            <LiveMarketSnapshot />
          </Card>
        </div>

        {/* Market Calendar */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Markt-Kalender</h2>
              <p className="text-sm text-slate-500">
                Wichtige Events, Zinsentscheide und Earnings
              </p>
            </div>
          </div>

          <Card className="p-6 md:p-8 bg-white border border-slate-200 rounded-3xl shadow-sm">
            <MarketCalendar />
          </Card>
        </div>

        {/* Info Cards - Responsive Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Echtzeit-Kurse
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Verfolge die wichtigsten Indizes weltweit in Echtzeit mit Auto-Updates alle 30 Sekunden.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4 shadow-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Event-Kalender
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Verpasse keine wichtigen Makro-Events, Earnings oder Zinsentscheide mehr.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 rounded-2xl md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4 shadow-sm">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Globale Märkte
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Von US über Europa bis Krypto – alle wichtigen Märkte an einem Ort.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}