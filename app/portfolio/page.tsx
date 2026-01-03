'use client';

import React, { useState, useEffect } from 'react';
import { Upload, TrendingUp, TrendingDown, RefreshCw, Download, X, FileText, AlertCircle, Loader2, PieChart } from 'lucide-react';

interface Position {
  isin: string;
  ticker: string;
  name: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  gain: number;
  gainPercent: number;
  allocation: number;
}

interface PortfolioData {
  positions: Position[];
  totalValue: number;
  totalCost: number;
  totalGain: number;
  totalGainPercent: number;
}

const PortfolioPage = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('beyondcharts_portfolio');
    if (saved) {
      const data = JSON.parse(saved);
      setPortfolio(data);
      refreshPrices(data.positions);
    }
    setLoading(false);
  }, []);

  const refreshPrices = async (positions: Position[]) => {
    setRefreshing(true);
    
    try {
      const updated = await Promise.all(
        positions.map(async (pos) => {
          try {
            const res = await fetch(`/api/price/${pos.ticker}`);
            const data = await res.json();
            
            const currentPrice = data.price || pos.avgPrice;
            const value = pos.shares * currentPrice;
            const cost = pos.shares * pos.avgPrice;
            const gain = value - cost;
            const gainPercent = (gain / cost) * 100;
            
            return { ...pos, currentPrice, value, gain, gainPercent };
          } catch {
            return pos;
          }
        })
      );
      
      const totalValue = updated.reduce((s, p) => s + p.value, 0);
      const totalCost = updated.reduce((s, p) => s + (p.shares * p.avgPrice), 0);
      const totalGain = totalValue - totalCost;
      const totalGainPercent = (totalGain / totalCost) * 100;
      
      updated.forEach(p => {
        p.allocation = (p.value / totalValue) * 100;
      });
      
      const portfolioData: PortfolioData = {
        positions: updated,
        totalValue,
        totalCost,
        totalGain,
        totalGainPercent,
      };
      
      setPortfolio(portfolioData);
      localStorage.setItem('beyondcharts_portfolio', JSON.stringify(portfolioData));
    } catch (error) {
      console.error('Refresh error:', error);
    }
    
    setRefreshing(false);
  };

  const handlePDFUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    try {
      const aggregatedPositions = new Map<string, Position>();
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          // Send to API for server-side parsing
          const formData = new FormData();
          formData.append('file', file);
          
          const response = await fetch('/api/parse-tr-pdf', {
            method: 'POST',
            body: formData,
          });
          
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Fehler beim Parsen von ${file.name}`);
          }
          
          const parsed = await response.json();
          
          console.log('Parsed data:', parsed);
          
          if (parsed.isin && parsed.shares && parsed.price) {
            const existing = aggregatedPositions.get(parsed.isin);
            
            if (existing) {
              const totalShares = existing.shares + parsed.shares;
              const totalCost = (existing.shares * existing.avgPrice) + (parsed.shares * parsed.price);
              const avgPrice = totalCost / totalShares;
              
              aggregatedPositions.set(parsed.isin, {
                ...existing,
                shares: totalShares,
                avgPrice: avgPrice,
                currentPrice: avgPrice,
                value: totalShares * avgPrice,
              });
            } else {
              aggregatedPositions.set(parsed.isin, {
                isin: parsed.isin,
                ticker: parsed.ticker,
                name: parsed.name,
                shares: parsed.shares,
                avgPrice: parsed.price,
                currentPrice: parsed.price,
                value: parsed.shares * parsed.price,
                gain: 0,
                gainPercent: 0,
                allocation: 0,
              });
            }
          }
        } catch (fileError: any) {
          console.error(`Error parsing ${file.name}:`, fileError);
          throw fileError;
        }
      }
      
      const positions = Array.from(aggregatedPositions.values());
      
      if (positions.length === 0) {
        throw new Error('Keine Positionen in den PDFs gefunden');
      }
      
      await refreshPrices(positions);
      setUploading(false);
      
    } catch (error: any) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'Fehler beim Upload');
      setUploading(false);
    }
  };

  const handleReset = () => {
    if (confirm('Portfolio wirklich löschen?')) {
      localStorage.removeItem('beyondcharts_portfolio');
      setPortfolio(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!portfolio || portfolio.positions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-slate-900 mb-3">Portfolio Tracker</h1>
            <p className="text-lg text-slate-600">Lade deine Trade Republic PDFs hoch</p>
          </div>

          {uploadError && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-red-900">{uploadError}</p>
              </div>
              <button onClick={() => setUploadError(null)}>
                <X className="h-5 w-5 text-red-600" />
              </button>
            </div>
          )}

          <div className="max-w-xl mx-auto">
            <label className={`cursor-pointer block ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
              <input
                type="file"
                accept=".pdf"
                multiple
                onChange={handlePDFUpload}
                className="hidden"
                disabled={uploading}
              />
              
              <div className="p-12 bg-white border-2 border-dashed border-slate-200 rounded-3xl hover:border-primary hover:bg-primary/5 transition-all">
                <div className="text-center space-y-4">
                  {uploading ? (
                    <Loader2 className="h-16 w-16 text-primary animate-spin mx-auto" />
                  ) : (
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-primary/10">
                      <FileText className="h-10 w-10 text-primary" />
                    </div>
                  )}
                  
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">
                      {uploading ? 'Parse PDFs...' : 'Trade Republic PDFs hochladen'}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Mehrere Abrechnungen auswählbar • Automatisches Parsing
                    </p>
                  </div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    );
  }

  const topPositions = [...portfolio.positions]
    .sort((a, b) => b.allocation - a.allocation)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="sticky top-0 bg-white/80 backdrop-blur-lg border-b border-slate-200 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Portfolio</h1>
              <p className="text-sm text-slate-500">{portfolio.positions.length} Positionen</p>
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={() => refreshPrices(portfolio.positions)}
                disabled={refreshing}
                className="px-4 py-2 bg-white hover:bg-slate-50 border-2 border-slate-200 rounded-xl transition-all flex items-center gap-2 font-semibold disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>
              
              <button
                onClick={handleReset}
                className="p-2 hover:bg-red-50 border-2 border-slate-200 hover:border-red-200 rounded-xl transition-all"
              >
                <X className="h-5 w-5 text-slate-600 hover:text-red-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-slate-500 mb-1">Gesamtwert</div>
            <div className="text-3xl font-bold text-slate-900">
              {portfolio.totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-slate-500 mb-1">Investiert</div>
            <div className="text-3xl font-bold text-slate-900">
              {portfolio.totalCost.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-slate-500 mb-1">Gewinn/Verlust</div>
            <div className={`text-3xl font-bold ${portfolio.totalGain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {portfolio.totalGain >= 0 ? '+' : ''}{portfolio.totalGain.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <div className="text-sm font-semibold text-slate-500 mb-1">Performance</div>
            <div className={`text-3xl font-bold flex items-center gap-2 ${portfolio.totalGainPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {portfolio.totalGainPercent >= 0 ? <TrendingUp className="h-8 w-8" /> : <TrendingDown className="h-8 w-8" />}
              {portfolio.totalGainPercent >= 0 ? '+' : ''}{(portfolio.totalGainPercent || 0).toFixed(2)}%
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Top Positionen
            </h3>
            
            <div className="space-y-4">
              {topPositions.map((pos) => (
                <div key={pos.isin}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://api.elbstream.com/logos/isin/${pos.isin}`}
                        alt={pos.name}
                        className="w-8 h-8 rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${pos.ticker}&background=0D8ABC&color=fff&size=32`;
                        }}
                      />
                      <span className="font-semibold text-slate-900">{pos.ticker}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-900">{(pos.allocation || 0).toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-emerald-500 rounded-full"
                      style={{ width: `${pos.allocation * 5}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Performance</h3>
            
            <div className="space-y-4">
              {[...portfolio.positions]
                .sort((a, b) => b.gainPercent - a.gainPercent)
                .slice(0, 5)
                .map((pos) => (
                  <div key={pos.isin} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={`https://api.elbstream.com/logos/isin/${pos.isin}`}
                        alt={pos.name}
                        className="w-8 h-8 rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = `https://ui-avatars.com/api/?name=${pos.ticker}&background=0D8ABC&color=fff&size=32`;
                        }}
                      />
                      <span className="font-semibold text-slate-900">{pos.ticker}</span>
                    </div>
                    <span className={`font-bold ${pos.gainPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {pos.gainPercent >= 0 ? '+' : ''}{(pos.gainPercent || 0).toFixed(2)}%
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200">
            <h3 className="text-lg font-bold text-slate-900">Alle Positionen</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Asset</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Stück</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Ø Preis</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Aktuell</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Wert</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">G/V</th>
                  <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">%</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {portfolio.positions.map((pos) => (
                  <tr key={pos.isin} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.elbstream.com/logos/isin/${pos.isin}`}
                          alt={pos.name}
                          className="w-10 h-10 rounded-lg"
                          onError={(e) => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${pos.ticker}&background=0D8ABC&color=fff&size=40`;
                          }}
                        />
                        <div>
                          <div className="font-bold text-slate-900">{pos.ticker}</div>
                          <div className="text-sm text-slate-500">{pos.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{(pos.shares || 0).toFixed(4)}</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{(pos.avgPrice || 0).toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{(pos.currentPrice || 0).toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right font-semibold text-slate-900">{(pos.value || 0).toFixed(2)} €</td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${pos.gain >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {pos.gain >= 0 ? '+' : ''}{(pos.gain || 0).toFixed(2)} €
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`font-bold ${pos.gainPercent >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                        {pos.gainPercent >= 0 ? '+' : ''}{(pos.gainPercent || 0).toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center">
          <a
            href="https://elbstream.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-400 hover:text-slate-600"
          >
            Logos by Elbstream
          </a>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPage;