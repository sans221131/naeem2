"use client";

import React from "react";

type Review = {
  id: string;
  name: string;
  location?: string;     // e.g. "Mumbai"
  destination?: string;  // e.g. "Dubai"
  title?: string;        // short headline
  text: string;
  rating: 1 | 2 | 3 | 4 | 5;
  dateLabel?: string;    // e.g. "Dec 2025"
  verified?: boolean;
};

const defaultReviews: Review[] = [
  {
    id: "r1",
    name: "Ayaan",
    location: "Mumbai",
    destination: "Dubai",
    title: "Super smooth booking",
    text: "Booked a desert safari + tickets in one go. Clear info, quick confirmation, no drama. Exactly what I wanted.",
    rating: 5,
    dateLabel: "Dec 2025",
    verified: true,
  },
  {
    id: "r2",
    name: "Sara",
    location: "Pune",
    destination: "Bali",
    title: "Great recommendations",
    text: "The short list of activities was actually useful — not random tourist traps. Timing + pickup details were on point.",
    rating: 5,
    dateLabel: "Nov 2025",
    verified: true,
  },
  {
    id: "r3",
    name: "Faizan",
    location: "Delhi",
    destination: "Paris",
    title: "Support was fast",
    text: "Had a question about cancellation. Got a straight answer quickly and didn’t feel like I was talking to a bot.",
    rating: 4,
    dateLabel: "Oct 2025",
    verified: true,
  },
  {
    id: "r4",
    name: "Hina",
    location: "Hyderabad",
    destination: "Japan",
    title: "Clean experience",
    text: "Everything looked premium and easy to understand. Prices were transparent and the itinerary flow was simple.",
    rating: 5,
    dateLabel: "Sep 2025",
    verified: true,
  },
  {
    id: "r5",
    name: "Arjun",
    location: "Bengaluru",
    destination: "Switzerland",
    title: "Loved the clarity",
    text: "No clutter. Just the essentials. The activity descriptions were structured and I could decide fast.",
    rating: 5,
    dateLabel: "Aug 2025",
    verified: true,
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`h-4 w-4 transition-colors ${i < rating ? "text-[var(--accent)]" : "text-[var(--border)]"}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95a1 1 0 00.95.69h4.154c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.95c.3.921-.755 1.688-1.54 1.118l-3.36-2.44a1 1 0 00-1.176 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.286-3.95a1 1 0 00-.364-1.118l-3.36-2.44c-.783-.57-.38-1.81.588-1.81h4.154a1 1 0 00.95-.69l1.286-3.95z" />
        </svg>
      ))}
    </div>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

export default function ReviewsSection({ items }: { items?: Review[] }) {
  const reviews = items ?? defaultReviews;

  // stats and marquee removed (not used)

  return (
    <section className="bg-gradient-to-b from-[var(--bg)] via-[var(--surface-1)] to-[var(--bg)] py-12 sm:py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-[var(--text-1)] mb-3 tracking-tight">Reviews from travellers</h2>
          <p className="text-lg sm:text-xl text-[var(--text-2)] max-w-2xl mx-auto">Real feedback on bookings, clarity, and support.</p>
        </div>

        {/* Grid of reviews */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {reviews.slice(0, 6).map((r, idx) => (
            <article key={r.id} className="rounded-3xl bg-[var(--surface-1)] p-5 sm:p-7 shadow-lg ring-2 ring-[var(--border)] hover:shadow-2xl transition-all duration-500 smooth-hover hover:-translate-y-2 hover:scale-105 animate-fade-in" style={{ animationDelay: `${idx * 0.1}s` }}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-600)] text-white flex items-center justify-center font-extrabold text-lg shadow-lg animate-scale-in">
                  {initials(r.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[var(--text-1)] truncate">{r.name}</p>
                  <p className="text-xs text-[var(--text-3)] truncate">{r.location ?? 'Traveller'}{r.destination ? ` • ${r.destination}` : ''}</p>
                </div>
                <div className="ml-auto text-right">
                  <Stars rating={r.rating} />
                  {r.verified ? <div className="text-xs text-[var(--primary)] font-semibold">Verified</div> : null}
                </div>
              </div>

              <h4 className="mt-4 text-sm font-semibold text-[var(--text-1)]">{r.title}</h4>
              <p className="mt-2 text-sm text-[var(--text-2)] leading-relaxed">{r.text}</p>
            </article>
          ))}
        </div>

        {/* CTA removed — reviews are illustrative only */}
      </div>
    </section>
  );
}
