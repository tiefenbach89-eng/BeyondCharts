import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-12 border-t border-[rgb(var(--border))]">
      <div className="ff-container py-10 md:py-14">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div className="text-sm font-semibold">BeyondCharts</div>
            <p className="mt-2 text-sm ff-muted">
              Kuratierte Finanz-News und Analysen im ruhigen, vertrauenswürdigen Stil.
              Keine Anlageberatung.
            </p>
          </div>
          
          <div className="grid gap-2 text-sm">
            <div className="font-semibold">Produkt</div>
            <Link className="ff-muted hover:text-[rgb(var(--text))]" href="/premium">Premium</Link>
            <Link className="ff-muted hover:text-[rgb(var(--text))]" href="/news">News</Link>
            <Link className="ff-muted hover:text-[rgb(var(--text))]" href="/analysen">Analysen</Link>
          </div>
          
          <div className="grid gap-2 text-sm">
            <div className="font-semibold">Rechtliches</div>
            <Link className="ff-muted hover:text-[rgb(var(--text))]" href="/impressum">Impressum</Link>
            {/* NEU: Link zum Haftungsausschluss hinzugefügt */}
            <Link className="ff-muted hover:text-[rgb(var(--text))]" href="/haftungsausschluss">Haftungsausschluss</Link>
            <Link className="ff-muted hover:text-[rgb(var(--text))]" href="/datenschutz">Datenschutz</Link>
            <Link className="ff-muted hover:text-[rgb(var(--text))]" href="/agb">AGB</Link>
          </div>
        </div>
        
        <div className="mt-10 flex items-center justify-between">
          <div className="text-xs ff-muted">© {new Date().getFullYear()} BeyondCharts</div>
        </div>
      </div>
    </footer>
  );
}