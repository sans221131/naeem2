"use client";

import Image from "next/image";
import Link from "next/link";
import type { Activity } from "@/../../db/schema";

interface ActivityCardProps {
  activity: Activity;
  destination?: { name: string; flag: string };
  formatPrice: string;
}

export default function ActivityCard({ activity, destination, formatPrice }: ActivityCardProps) {
  const truncate = (text: string, maxLength: number): string => {
    if (!text) return "";
    const cleaned = text
      .replace(/:contentReference\[[^\]]*\]\{[^}]*\}/g, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\s+/g, " ")
      .trim();
    return cleaned.length > maxLength ? `${cleaned.slice(0, maxLength)}…` : cleaned;
  };

  return (
    <div className="group bg-[var(--surface-1)] rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 ring-2 ring-[var(--border)] hover:ring-[var(--primary)] hover:-translate-y-2 hover:scale-[1.02] smooth-hover animate-fade-in flex flex-col h-full">
      <Link href={`/activity/${activity.id}`} className="block flex-shrink-0">
        {/* Image */}
        <div className="relative h-64 bg-gradient-to-br from-[var(--surface-2)] to-[var(--border)] overflow-hidden">
          {activity.imageUrl ? (
            <Image
              src={activity.imageUrl}
              alt={activity.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <svg className="w-16 h-16 text-[var(--text-3)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
          
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
            {destination && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--surface-1)]/95 backdrop-blur-sm text-xs font-bold text-[var(--text-1)] shadow-lg ring-1 ring-[var(--border)] animate-scale-in">
                <span>{destination.flag}</span>
                <span>{destination.name}</span>
              </span>
            )}
            {activity.reviewCount > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[var(--accent)]/95 backdrop-blur-sm text-xs font-bold text-[var(--btn-primary-text)] shadow-lg animate-scale-in">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span>{activity.reviewCount}</span>
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-600)] text-white font-bold text-sm shadow-xl">
              {formatPrice}
            </span>
          </div>
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <Link href={`/activity/${activity.id}`}>
          <h3 className="font-extrabold text-xl text-[var(--text-1)] mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition-colors smooth-hover">
            {activity.name}
          </h3>
          <p className="text-sm text-[var(--text-2)] line-clamp-3 leading-relaxed mb-4 flex-grow">
            {truncate(activity.description, 120)}
          </p>
        </Link>
        
        <div className="mt-auto">
          <Link
            href={`/activity/${activity.id}`}
            className="w-full h-10 flex items-center justify-center py-2.5 rounded-xl bg-gradient-to-r from-[var(--surface-2)] to-[var(--surface-1)] hover:from-[var(--surface-1)] hover:to-[var(--surface-2)] text-[var(--text-1)] font-semibold text-sm transition-all duration-300 ring-1 ring-[var(--border)] hover:ring-[var(--primary)] hover:shadow-md text-center smooth-hover"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
