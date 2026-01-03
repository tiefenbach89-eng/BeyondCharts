import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">BeyondCharts</div>
            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
<<<<<<< HEAD
              Fundierte Finanz-News & Analysen. Wir liefern den Kontext, Sie entscheiden.
              Inhalte stellen keine Anlageberatung dar.
=======
              Kuratierte Finanz-News und Analysen im ruhigen, vertrauenswürdigen Stil.
              Keine Anlageberatung.
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
            </p>
          </div>
          
          <div className="grid gap-2 text-sm">
            <div className="font-semibold text-slate-900">Produkt</div>
            <Link 
              className="text-slate-600 hover:text-slate-900 transition-colors" 
              href="/premium"
            >
              Premium
            </Link>
            <Link 
              className="text-slate-600 hover:text-slate-900 transition-colors" 
              href="/news"
            >
              News
            </Link>
            <Link 
              className="text-slate-600 hover:text-slate-900 transition-colors" 
              href="/analysen"
            >
              Analysen
            </Link>
          </div>
          
          <div className="grid gap-2 text-sm">
            <div className="font-semibold text-slate-900">Rechtliches</div>
            <Link 
              className="text-slate-600 hover:text-slate-900 transition-colors" 
              href="/impressum"
            >
              Impressum
            </Link>
            <Link 
              className="text-slate-600 hover:text-slate-900 transition-colors" 
              href="/haftungsausschluss"
            >
              Haftungsausschluss
            </Link>
            <Link 
              className="text-slate-600 hover:text-slate-900 transition-colors" 
              href="/datenschutz"
            >
              Datenschutz
            </Link>
            <Link 
              className="text-slate-600 hover:text-slate-900 transition-colors" 
              href="/agb"
            >
              AGB
            </Link>
          </div>
        </div>
        
        <div className="mt-10 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            © {new Date().getFullYear()} BeyondCharts
          </div>
        </div>
      </div>
    </footer>
  );
}
