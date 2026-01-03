<<<<<<< HEAD
'use client';

import { useState, useEffect } from 'react';
=======
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { 
  Search, 
  TrendingUp, 
  Building2,
  Briefcase,
  Globe,
  DollarSign,
  ArrowRight,
<<<<<<< HEAD
  Filter,
  ArrowUp,
  ArrowDown,
  Minus,
  Euro,
  RefreshCw,
  TrendingDown
} from "lucide-react";

interface Asset {
  ticker: string;
  name: string;
  type: string;
  sector: string;
  region: string;
  currency: string;
  price: number;
  priceUSD: number;
  priceEUR: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  volume: number;
  marketCap: number;
}

const getAssetColor = (type: string) => {
  switch (type) {
    case 'Aktie':
      return 'from-blue-600 to-cyan-600';
    case 'ETF':
      return 'from-violet-600 to-purple-600';
    case 'Index':
      return 'from-amber-600 to-orange-600';
    default:
      return 'from-slate-600 to-slate-800';
  }
};

const getAssetIcon = (type: string) => {
  switch (type) {
    case 'Aktie':
      return Building2;
    case 'ETF':
      return Globe;
    case 'Index':
      return TrendingUp;
    default:
      return DollarSign;
  }
};

export default function AssetsPage() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('Alle');
  const [currency, setCurrency] = useState<'EUR' | 'USD'>('EUR');
  const [eurUsd, setEurUsd] = useState(1.08);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/assets');
      const data = await response.json();
      setAssets(data.assets);
      setFilteredAssets(data.assets);
      setEurUsd(data.eurUsd);
      setLastUpdate(new Date());
      setLoading(false);
    } catch (error) {
      console.error('Error fetching assets:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  useEffect(() => {
    let filtered = assets;

    // Filter by type
    if (selectedType !== 'Alle') {
      filtered = filtered.filter(a => a.type === selectedType);
    }

    // Filter by search
    if (searchQuery) {
      filtered = filtered.filter(a =>
        a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.sector.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredAssets(filtered);
  }, [searchQuery, selectedType, assets]);

  const categories = [
    { label: 'Alle', count: assets.length },
    { label: 'Aktie', count: assets.filter(a => a.type === 'Aktie').length },
    { label: 'ETF', count: assets.filter(a => a.type === 'ETF').length },
  ];

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        
        {/* Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-sm">
=======
  Filter
} from "lucide-react";

const assets = [
  { type: "Aktie", name: "Microsoft", ticker: "MSFT", sector: "Technology", color: "from-blue-600 to-cyan-600", icon: Building2 },
  { type: "Aktie", name: "Apple", ticker: "AAPL", sector: "Technology", color: "from-slate-700 to-slate-900", icon: Building2 },
  { type: "Aktie", name: "NVIDIA", ticker: "NVDA", sector: "Semiconductors", color: "from-emerald-600 to-teal-600", icon: Building2 },
  { type: "ETF", name: "iShares MSCI World", ticker: "EUNL", sector: "Global Equity", color: "from-violet-600 to-purple-600", icon: Globe },
  { type: "Index", name: "DAX", ticker: "DAX", sector: "German Equity", color: "from-amber-600 to-orange-600", icon: TrendingUp },
  { type: "FX", name: "EUR/USD", ticker: "EURUSD", sector: "Currency", color: "from-blue-600 to-indigo-600", icon: DollarSign },
  { type: "Aktie", name: "Tesla", ticker: "TSLA", sector: "Automotive", color: "from-red-600 to-rose-600", icon: Building2 },
  { type: "Aktie", name: "Amazon", ticker: "AMZN", sector: "E-Commerce", color: "from-orange-600 to-amber-600", icon: Building2 },
  { type: "ETF", name: "SPDR S&P 500", ticker: "SPY", sector: "US Equity", color: "from-blue-600 to-cyan-600", icon: Globe },
];

const categories = [
  { label: "Alle", count: assets.length, color: "slate" },
  { label: "Aktien", count: assets.filter(a => a.type === "Aktie").length, color: "blue" },
  { label: "ETFs", count: assets.filter(a => a.type === "ETF").length, color: "violet" },
  { label: "Indizes", count: assets.filter(a => a.type === "Index").length, color: "amber" },
  { label: "FX", count: assets.filter(a => a.type === "FX").length, color: "emerald" },
];

export default function AssetsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50/30">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-12">
        
        {/* Header */}
        <header className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-purple-600 flex items-center justify-center shadow-lg">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
<<<<<<< HEAD
                Assets
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Live-Kurse · Aktien · ETFs
=======
                Asset Universe
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Aktien · ETFs · Indizes · Währungen
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              </p>
            </div>
          </div>

<<<<<<< HEAD
          <p className="text-lg text-slate-600 leading-relaxed max-w-3xl">
            Entdecke und analysiere Unternehmen und Fonds aus unserem Investment-Universe.
          </p>
        </header>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Suche nach Ticker, Name oder Sektor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
            />
          </div>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 p-1 bg-white border-2 border-slate-200 rounded-xl">
            <button
              onClick={() => setCurrency('EUR')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                currency === 'EUR'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Euro className="h-4 w-4" />
              EUR
            </button>
            <button
              onClick={() => setCurrency('USD')}
              className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all flex items-center gap-2 ${
                currency === 'USD'
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="h-4 w-4" />
              USD
            </button>
          </div>

          {/* Refresh */}
          <button
            onClick={fetchAssets}
            className="px-4 py-3 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm text-slate-700"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="hidden sm:inline">Aktualisieren</span>
          </button>
        </div>

        {/* Update Info */}
        {lastUpdate && (
          <div className="flex items-center justify-between px-4 py-3 bg-white border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-semibold text-slate-600">
                Letztes Update: {lastUpdate.toLocaleTimeString('de-DE')}
              </span>
            </div>
            <span className="text-xs text-slate-500">
              EUR/USD: {eurUsd.toFixed(4)}
            </span>
          </div>
        )}

        {/* Category Filters */}
=======
          <p className="max-w-3xl text-lg md:text-xl text-slate-600 leading-relaxed">
            Entdecke und analysiere Unternehmen, Fonds und Instrumente aus unserem 
            kuratierten Investment-Universe.
          </p>
        </header>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Suche nach Ticker, Unternehmen oder Sektor..."
            className="w-full pl-14 pr-6 py-4 bg-white border-2 border-slate-200 rounded-2xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-violet-400 focus:ring-4 focus:ring-violet-100 transition-all shadow-sm"
          />
        </div>

        {/* Category Filter Pills */}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <Filter className="h-4 w-4" />
            <span>Filter:</span>
          </div>
          {categories.map((cat) => (
            <button
              key={cat.label}
<<<<<<< HEAD
              onClick={() => setSelectedType(cat.label)}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 font-semibold text-sm ${
                selectedType === cat.label
                  ? 'bg-primary text-white shadow-sm'
                  : 'bg-white text-slate-700 border-2 border-slate-200 hover:border-slate-300'
              }`}
            >
              {cat.label}
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                selectedType === cat.label
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 text-slate-600'
              }`}>
=======
              className="group px-4 py-2 bg-white hover:bg-slate-50 border-2 border-slate-200 hover:border-violet-300 rounded-xl transition-all flex items-center gap-2 shadow-sm hover:shadow-md"
            >
              <span className="text-sm font-semibold text-slate-700 group-hover:text-violet-700">
                {cat.label}
              </span>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full group-hover:bg-violet-100 group-hover:text-violet-700">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                {cat.count}
              </span>
            </button>
          ))}
        </div>

<<<<<<< HEAD
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <div className="text-3xl font-bold text-slate-900 mb-1">
              {assets.length}
            </div>
            <div className="text-sm text-slate-600">Assets Total</div>
          </Card>
          
          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {assets.filter(a => a.type === 'Aktie').length}
            </div>
            <div className="text-sm text-slate-600">Aktien</div>
          </Card>
          
          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <div className="text-3xl font-bold text-violet-600 mb-1">
              {assets.filter(a => a.type === 'ETF').length}
            </div>
            <div className="text-sm text-slate-600">ETFs</div>
          </Card>
          
          <Card className="p-4 bg-white border border-slate-200 rounded-2xl">
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {filteredAssets.filter(a => a.changePercent > 0).length}
            </div>
            <div className="text-sm text-slate-600">im Plus</div>
          </Card>
=======
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold text-slate-900 mb-1">{assets.length}</div>
            <div className="text-sm text-slate-600">Assets Total</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {assets.filter(a => a.type === "Aktie").length}
            </div>
            <div className="text-sm text-slate-600">Aktien</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold text-violet-600 mb-1">
              {assets.filter(a => a.type === "ETF").length}
            </div>
            <div className="text-sm text-slate-600">ETFs</div>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-3xl font-bold text-emerald-600 mb-1">
              {assets.filter(a => a.type === "Index" || a.type === "FX").length}
            </div>
            <div className="text-sm text-slate-600">Andere</div>
          </div>
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
        </div>

        {/* Assets Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
<<<<<<< HEAD
            <h2 className="text-2xl font-bold text-slate-900">
              {selectedType === 'Alle' ? 'Alle Assets' : selectedType}
            </h2>
            <span className="text-sm text-slate-500">
              {filteredAssets.length} {filteredAssets.length === 1 ? 'Ergebnis' : 'Ergebnisse'}
            </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredAssets.map((asset) => {
              const Icon = getAssetIcon(asset.type);
              const isPositive = asset.changePercent > 0;
              const isNeutral = asset.changePercent === 0;
              const displayPrice = currency === 'EUR' ? asset.priceEUR : asset.priceUSD;

              return (
                <Link key={asset.ticker} href={`/assets/${asset.ticker}`}>
                  <Card className="group relative overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    {/* Gradient Top Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getAssetColor(asset.type)}`} />
                    
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getAssetColor(asset.type)} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform`}>
                          <Icon className="h-6 w-6 text-white" />
=======
            <h2 className="text-xl font-bold text-slate-900">Alle Assets</h2>
            <span className="text-sm text-slate-500">{assets.length} Ergebnisse</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {assets.map((asset) => {
              const Icon = asset.icon;
              return (
                <Link key={asset.ticker} href={`/assets/${asset.ticker}`}>
                  <Card className="group relative overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Gradient Accent Bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${asset.color}`} />
                    
                    <div className="p-6">
                      {/* Header Row */}
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${asset.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                          <Icon className="h-7 w-7 text-white" />
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Badge className="bg-slate-100 text-slate-700 text-[10px] px-2 py-1 border-none">
                            {asset.type}
                          </Badge>
<<<<<<< HEAD
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
=======
                          <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-violet-600 group-hover:translate-x-1 transition-all" />
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
<<<<<<< HEAD
                        {/* Ticker & Region */}
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-slate-900">
                            {asset.ticker.replace('.DE', '')}
                          </span>
                          <Badge className="bg-slate-100 text-slate-600 text-[10px] px-2 py-0.5 border-none">
                            {asset.region}
                          </Badge>
=======
                        {/* Ticker */}
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-slate-900">
                            {asset.ticker}
                          </span>
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                        </div>

                        {/* Name */}
                        <h3 className="text-base font-semibold text-slate-900 line-clamp-1">
                          {asset.name}
                        </h3>

<<<<<<< HEAD
                        {/* Price */}
                        <div className="pt-2 border-t border-slate-100">
                          <div className="flex items-baseline gap-2 mb-1">
                            <span className="text-2xl font-bold text-slate-900">
                              {displayPrice.toLocaleString('de-DE', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                            <span className="text-sm font-semibold text-slate-500">
                              {currency}
                            </span>
                          </div>
                          
                          {/* Change */}
                          <div className="flex items-center gap-2">
                            <div className={`flex items-center gap-1 ${
                              isPositive ? 'text-emerald-600' : isNeutral ? 'text-slate-400' : 'text-red-600'
                            }`}>
                              {isPositive ? (
                                <ArrowUp className="h-3 w-3" />
                              ) : isNeutral ? (
                                <Minus className="h-3 w-3" />
                              ) : (
                                <ArrowDown className="h-3 w-3" />
                              )}
                              <span className="text-sm font-bold">
                                {isPositive ? '+' : ''}{asset.changePercent.toFixed(2)}%
                              </span>
                            </div>
                            <span className={`text-xs font-semibold ${
                              isPositive ? 'text-emerald-600' : isNeutral ? 'text-slate-400' : 'text-red-600'
                            }`}>
                              {isPositive ? '+' : ''}{asset.change.toFixed(2)} {asset.currency}
                            </span>
                          </div>
                        </div>

                        {/* Sector */}
                        <div className="flex items-center gap-2 text-xs text-slate-600 pt-2">
=======
                        {/* Sector */}
                        <div className="flex items-center gap-2 text-xs text-slate-600">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                          <div className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          <span>{asset.sector}</span>
                        </div>
                      </div>

                      {/* Hover Action */}
                      <div className="mt-4 pt-4 border-t border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity">
<<<<<<< HEAD
                        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
=======
                        <div className="flex items-center gap-2 text-sm font-semibold text-violet-600">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                          <Search className="h-4 w-4" />
                          <span>Details ansehen</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
<<<<<<< HEAD

          {/* No Results */}
          {filteredAssets.length === 0 && (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
              <p className="text-lg font-semibold text-slate-600">Keine Assets gefunden</p>
              <p className="text-sm text-slate-500 mt-1">
                Versuche eine andere Suche oder Filter-Einstellung
              </p>
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-6 pt-8">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-sm">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Live-Kurse
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Echtzeitdaten von Yahoo Finance – automatisch in EUR und USD konvertiert.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4 shadow-sm">
              <Globe className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Global diversifiziert
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              US Tech Giants, deutsche Blue Chips und weltweit investierte ETFs.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4 shadow-sm">
              <Briefcase className="h-6 w-6 text-white" />
=======
        </div>

        {/* Info Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Kuratierte Auswahl
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
<<<<<<< HEAD
              Handverlesene Assets mit hoher Liquidität und Relevanz für Privatanleger.
=======
              Alle Assets wurden von unserem Research-Team sorgfältig ausgewählt und analysiert.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-violet-600 flex items-center justify-center mb-4 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Live-Daten
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Echtzeit-Kurse und aktuelle Fundamentaldaten für fundierte Entscheidungen.
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 rounded-2xl">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center mb-4 shadow-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">
              Deep Dives
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Detaillierte Analysen zu Geschäftsmodellen, Wettbewerb und langfristigen Trends.
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
}