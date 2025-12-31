"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { NewsCard } from "@/components/news/NewsCard";
import { ChevronDown,ArrowRight,ChevronUp } from "lucide-react";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  category: string;
  source: string;
  publishedAt?: string;
  createdAt?: string;
  isPremium: boolean;
  impact: "Low" | "Medium" | "High";
  tags: string[];
};

export function HomeTopStories({ allNews }: { allNews: NewsItem[] }) {
  const [showAllNews, setShowAllNews] = useState(false);

  const items = useMemo(() => {
    return showAllNews ? allNews.slice(0, 6) : allNews.slice(0, 4);
  }, [allNews, showAllNews]);

  return (
    <section>
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-semibold text-slate-900">
            News
          </h2>
          <p className="mt-2 text-slate-600 leading-relaxed">
            Aktuelle Finanz- und Marktnews auf einen Blick.
          </p>
        </div>

        <Link
          href="/news"
          className="group inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-xl font-semibold text-sm transition-all hover:shadow-lg"
        >
          Alle News
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {items.map((n) => (
          <NewsCard
            key={n.id}
            title={n.title}
            summary={n.summary}
            href={n.slug ? `/news/${n.slug}` : "/news"}
            category={n.category}
            source={n.source}
            publishedAt={(n.publishedAt || n.createdAt) as string}
            isPremium={n.isPremium}
            impact={n.impact}
            tags={n.tags}
          />
        ))}
      </div>

      <div className="mt-10 flex justify-center">
        <button
          onClick={() => setShowAllNews(!showAllNews)}
          className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-8 py-3 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-95 shadow-sm"
        >
          {showAllNews ? (
            <>Weniger anzeigen <ChevronUp className="h-4 w-4" /></>
          ) : (
            <>Mehr News laden <ChevronDown className="h-4 w-4" /></>
          )}
        </button>
      </div>
    </section>
  );
}
