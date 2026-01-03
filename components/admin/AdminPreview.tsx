'use client';

import React from 'react';
import { NewsView } from '@/app/news/[slug]/NewsView';
import { AnalyseView } from '@/app/analysen/[slug]/AnalyseView';
import type { NewsItem } from '@/types/news';
import type { Analyse } from '@/types/analyse';

interface AdminPreviewProps {
  kind: 'news' | 'analyses';
  item: any;
}

export function AdminPreview({ kind, item }: AdminPreviewProps) {
  if (kind === 'news') {
    const newsItem: NewsItem = {
      id: item.id || 'preview',
      slug: item.slug || 'preview',
      title: item.title || 'Ohne Titel',
      summary: item.summary || '',
      content: item.content || '',
      image: item.imageUrl || undefined,
      imageSource: item.imageSource || undefined,
      category: item.category || 'News',
      source: item.source || '',
      sourceUrl: item.sourceUrl || '',
      sourceType: item.sourceType || 'own',
      impact: item.impact || 'Medium',
      tags: Array.isArray(item.tags) ? item.tags : [],
      isPremium: Boolean(item.isPremium),
      status: item.status || 'draft',
      createdAt: item.createdAt || new Date().toISOString(),
      updatedAt: item.updatedAt || new Date().toISOString(),
      publishedAt: item.publishedAt,
      auditStatus: item.auditStatus || 'pending',
      auditNotes: item.auditNotes,
      auditedAt: item.auditedAt,
    };

    return <NewsView item={newsItem} />;
  }

  // Analysen
  const analyseItem: Analyse = {
    id: item.id || 'preview',
    slug: item.slug || 'preview',
    title: item.title || 'Ohne Titel',
    summary: item.summary || '',
    content: item.content || '',
    image: item.imageUrl || undefined,
    imageSource: item.imageSource || undefined,
    category: item.category || 'Analysen',
    tags: Array.isArray(item.tags) ? item.tags : [],
    isPremium: Boolean(item.isPremium),
    status: item.status || 'draft',
    createdAt: item.createdAt || new Date().toISOString(),
    updatedAt: item.updatedAt || new Date().toISOString(),
    publishedAt: item.publishedAt,
    auditStatus: item.auditStatus || 'pending',
    auditNotes: item.auditNotes,
    auditedAt: item.auditedAt,
    snapshot: item.analysis ? {
      overview: item.analysis.overview || '',
      businessModel: item.analysis.businessModel || '',
      risks: item.analysis.risks || '',
      scenarios: item.analysis.scenarios || '',
    } as any : undefined,
  };

  return <AnalyseView item={analyseItem} />;
}