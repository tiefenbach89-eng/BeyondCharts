module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/app/api/markets/live/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "dynamic",
    ()=>dynamic,
    "runtime",
    ()=>runtime
]);
// app/api/markets/live/route.ts
// ✅ Live-Marktdaten: Yahoo Finance (Indizes) + Finnhub (Bitcoin)
// ✅ Next.js 16 / App Router / Vercel-safe
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
;
const dynamic = 'force-dynamic';
const runtime = 'nodejs';
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || '';
async function GET() {
    try {
        // Indizes (Yahoo Finance)
        const indices = [
            {
                symbol: '^GSPC',
                name: 'S&P 500',
                region: 'US'
            },
            {
                symbol: '^DJI',
                name: 'Dow Jones',
                region: 'US'
            },
            {
                symbol: '^IXIC',
                name: 'Nasdaq',
                region: 'US'
            },
            {
                symbol: '^GDAXI',
                name: 'DAX',
                region: 'DE'
            },
            {
                symbol: '^FTSE',
                name: 'FTSE 100',
                region: 'UK'
            }
        ];
        const indexPromises = indices.map(async ({ symbol, name, region })=>{
            const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=1m`;
            const response = await fetch(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0'
                },
                cache: 'no-store'
            });
            if (!response.ok) {
                throw new Error(`Yahoo Finance error for ${symbol}`);
            }
            const data = await response.json();
            const meta = data?.chart?.result?.[0]?.meta;
            if (!meta) {
                throw new Error(`Invalid Yahoo response for ${symbol}`);
            }
            const currentPrice = meta.regularMarketPrice;
            const previousClose = meta.chartPreviousClose;
            const change = currentPrice - previousClose;
            const changePercent = change / previousClose * 100;
            return {
                symbol: symbol.replace('^', ''),
                name,
                region,
                price: currentPrice.toFixed(2),
                change: change.toFixed(2),
                changePercent: changePercent.toFixed(2),
                high: meta.regularMarketDayHigh?.toFixed(2) ?? '0.00',
                low: meta.regularMarketDayLow?.toFixed(2) ?? '0.00',
                open: meta.regularMarketOpen?.toFixed(2) ?? currentPrice.toFixed(2),
                timestamp: meta.regularMarketTime ?? Date.now()
            };
        });
        // Bitcoin (Finnhub)
        const btcPromise = (async ()=>{
            const url = `https://finnhub.io/api/v1/quote?symbol=BINANCE:BTCUSDT&token=${FINNHUB_API_KEY}`;
            const response = await fetch(url, {
                cache: 'no-store'
            });
            if (!response.ok) {
                throw new Error('Finnhub error');
            }
            const data = await response.json();
            const currentPrice = data.c || 0;
            const previousClose = data.pc || 0;
            const change = currentPrice - previousClose;
            const changePercent = previousClose !== 0 ? change / previousClose * 100 : 0;
            return {
                symbol: 'BTC',
                name: 'Bitcoin',
                region: 'CRYPTO',
                price: currentPrice.toFixed(2),
                change: change.toFixed(2),
                changePercent: changePercent.toFixed(2),
                high: (data.h || 0).toFixed(2),
                low: (data.l || 0).toFixed(2),
                open: (data.o || 0).toFixed(2),
                timestamp: data.t || Date.now()
            };
        })();
        // 🔒 Robust: niemals kompletter Ausfall
        const indexResults = await Promise.allSettled(indexPromises);
        const indexData = indexResults.map((res, i)=>{
            if (res.status === 'fulfilled') return res.value;
            return {
                symbol: indices[i].symbol.replace('^', ''),
                name: indices[i].name,
                region: indices[i].region,
                price: '0.00',
                change: '0.00',
                changePercent: '0.00',
                high: '0.00',
                low: '0.00',
                open: '0.00',
                timestamp: Date.now()
            };
        });
        const btcData = await btcPromise;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json([
            ...indexData,
            btcData
        ], {
            headers: {
                'Cache-Control': 'no-store, max-age=0'
            }
        });
    } catch (error) {
        console.error('Market API error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch market data'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__fdaa6995._.js.map