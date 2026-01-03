import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { formatRelative } from "@/lib/date";
import { PremiumIcon } from "@/components/PremiumIcon";
import { ArrowRight } from "lucide-react";

interface NewsCardProps {
  title: string;
  summary: string;
  href: string;
  category: string;
  source?: string;
  publishedAt: string;
  isPremium: boolean;
  tags: string[];
  image?: string;
}

export function NewsCard({
  title,
  summary,
  href,
  category,
  source,
  publishedAt,
  isPremium,
  tags,
  image,
}: NewsCardProps) {
  const defaultImage = "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)";
  const sourceLabel = (source && source.trim()) ? source : "BeyondCharts";

  return (
    <Link href={href} className="group block h-full focus:outline-none">
<<<<<<< HEAD
      <Card className="relative h-full overflow-hidden p-0 transition-all duration-300 border-none ring-1 ring-slate-200 bg-white group-hover:shadow-xl group-hover:translate-y-[-2px] focus-within:ring-2 focus-within:ring-blue-500/30 rounded-2xl">
=======
      <Card className="relative h-full overflow-hidden p-0 transition-all duration-300 border-none ring-1 ring-slate-200 bg-white group-hover:shadow-xl group-hover:translate-y-[-2px] focus-within:ring-2 focus-within:ring-blue-500/30">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
        <div className="flex items-stretch gap-4 h-full">
          {/* Bild */}
          <div className="relative w-28 sm:w-32 flex-shrink-0 overflow-hidden bg-slate-900">
            {image ? (
              <img
                src={image}
                alt={title}
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div
                className="absolute inset-0 flex h-full w-full items-center justify-center"
                style={{ background: defaultImage }}
              >
<<<<<<< HEAD
                <span className="text-[8px] font-bold text-white/10 uppercase text-center px-1 tracking-wide">
=======
                <span className="text-xs font-semibold text-white/10 uppercase text-center px-1 tracking-wide">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                  Beyond Charts
                </span>
              </div>
            )}
          </div>

          {/* Text */}
<<<<<<< HEAD
          <div className="flex flex-1 flex-col pr-6 py-4 min-w-0">
            {/* Top meta row with Premium badge */}
            <div className="flex items-center justify-between gap-3 mb-1 min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide text-slate-400 min-w-0 flex-1">
                <span className="text-blue-600 transition-colors flex-shrink-0">{category}</span>
                <span className="opacity-30 flex-shrink-0">•</span>
                <span className="truncate">{sourceLabel}</span>
                <span className="opacity-30 flex-shrink-0 hidden sm:inline">•</span>
                <span className="font-medium whitespace-nowrap hidden sm:inline">{formatRelative(publishedAt)}</span>
              </div>
              {isPremium && (
                <div className="flex-shrink-0">
=======
          <div className="flex flex-1 flex-col pr-4 py-4 min-w-0">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-400 mb-1">
              <span className="text-blue-600 transition-colors">{category}</span>
              <span className="opacity-30">•</span>
              <span className="truncate">{sourceLabel}</span>
              <span className="opacity-30">•</span>
              <span className="whitespace-nowrap">{formatRelative(publishedAt)}</span>
            </div>

            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-base font-semibold leading-tight text-slate-900 transition-colors line-clamp-2">
                {title}
              </h3>
              {isPremium && (
                <div className="scale-75 origin-top-right flex-shrink-0">
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                  <PremiumIcon />
                </div>
              )}
            </div>

<<<<<<< HEAD
            {/* Title - no premium badge here anymore */}
            <h3 className="text-sm sm:text-base font-bold leading-tight text-slate-900 transition-colors line-clamp-2">
              {title}
            </h3>

            <p className="mt-2 text-xs leading-relaxed text-slate-500 line-clamp-2">{summary}</p>
=======
            <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-2">{summary}</p>
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555

            <div className="mt-auto pt-3 flex items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {tags?.slice(0, 2).map((t) => (
                  <span
                    key={t}
<<<<<<< HEAD
                    className="text-[9px] font-medium text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100 transition-colors"
=======
                    className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 transition-colors"
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
                  >
                    #{t}
                  </span>
                ))}
              </div>

<<<<<<< HEAD
              {/* Auf Touch nicht “unsichtbar”: sichtbar, aber dezent; auf Hover/Focus stärker */}
=======
              {/* Auf Touch nicht "unsichtbar": sichtbar, aber dezent; auf Hover/Focus stärker */}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
              <ArrowRight className="h-4 w-4 text-blue-600/60 transition-all duration-300 group-hover:text-blue-600 group-hover:translate-x-[2px] group-focus-visible:text-blue-600 group-focus-visible:translate-x-[2px]" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 1ad3d42fee7245012111a3a2033405f598854555
