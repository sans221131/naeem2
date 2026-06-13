"use client";

import { Activity } from "../../db/schema";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import NextImage from "next/image";

interface HeroBannerProps {
  activities: Activity[];
}

/**
 * Tweak this if your navbar height is different.
 * (From your screenshot, 88px is a safe default.)
 */
const HEADER_OFFSET_PX = 88;

type MotionPref = "no-preference" | "reduce";

const AUTO_MS = 5200;
const TRANS_MS = 420;

function getMotionPref(): MotionPref {
  if (typeof window === "undefined") return "no-preference";
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches
    ? "reduce"
    : "no-preference";
}

function formatPrice(activity: Activity) {
  const raw = activity.price;
  const currency = activity.currency ?? "";

  const num =
    typeof raw === "number" ? raw : typeof raw === "string" ? parseFloat(raw) : NaN;

  if (!isFinite(num) || num === 0) return { label: "Free Entry", sub: "No ticket required" };

  return { label: `${currency} ${num.toFixed(2)}`, sub: "Starting price" };
}

function cleanText(s: string) {
  return (
    s
      // remove accidental citation artifacts
      .replace(/:contentReference\[[^\]]*\]\{[^}]*\}/g, "")
      .replace(/\*\*/g, "")
      .replace(/`/g, "")
      .replace(/\s+/g, " ")
      .trim()
  );
}

function extractHighlights(description?: string | null) {
  if (!description) return { bullets: [] as string[], summary: "" };

  const lines = description
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const bullets: string[] = [];
  for (const line of lines) {
    if (/^[-•*]\s+/.test(line)) {
      const b = cleanText(line.replace(/^[-•*]\s+/, ""));
      if (b.length >= 4) bullets.push(b);
    }
  }

  const blob = cleanText(description.replace(/\n+/g, " "));
  const summary = blob.length > 180 ? `${blob.slice(0, 180)}…` : blob;

  return { bullets: bullets.slice(0, 4), summary };
}

export default function HeroBanner({
  activities,
}: HeroBannerProps) {
  const len = activities?.length ?? 0;
  const [active, setActive] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  const [paused, setPaused] = useState(false);
  const [motionPref, setMotionPref] = useState<MotionPref>("no-preference");

  // progress bar restart key
  const [progressKey, setProgressKey] = useState(0);

  const activeRef = useRef(0);
  const animRef = useRef(false);
  const hoverRef = useRef(false);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    setMotionPref(getMotionPref());
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = () => setMotionPref(mq.matches ? "reduce" : "no-preference");

    if (mq.addEventListener) mq.addEventListener("change", handler);
    else mq.addListener(handler);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", handler);
      else mq.removeListener(handler);
    };
  }, []);

  // keep index valid
  useEffect(() => {
    if (len === 0) return;
    if (active > len - 1) setActive(0);
  }, [len, active]);

  const goTo = (nextIdx: number) => {
    if (len <= 1) return;
    if (nextIdx === activeRef.current) return;

    if (motionPref === "reduce") {
      setPrev(null);
      setActive((nextIdx + len) % len);
      setProgressKey((k) => k + 1);
      return;
    }

    if (animRef.current) return;
    animRef.current = true;

    const from = activeRef.current;
    const to = (nextIdx + len) % len;

    setPrev(from);
    setActive(to);
    setProgressKey((k) => k + 1);

    window.setTimeout(() => {
      setPrev(null);
      animRef.current = false;
    }, TRANS_MS);
  };

  const next = () => goTo(activeRef.current + 1);
  const prevFn = () => goTo(activeRef.current - 1);

  // autoplay
  useEffect(() => {
    if (len <= 1) return;
    if (paused || hoverRef.current || motionPref === "reduce") return;

    const id = window.setInterval(() => next(), AUTO_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, paused, motionPref, progressKey]);

  // keyboard
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (len <= 1) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prevFn();
      if (e.key === " " || e.key === "Spacebar") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [len, motionPref]);

  // preload next image
  useEffect(() => {
    if (len <= 1) return;
    const nextIdx = (active + 1) % len;
    const nextImg = activities[nextIdx]?.imageUrl as string | undefined;
    if (!nextImg) return;
    const img = new Image();
    img.src = nextImg;
  }, [active, len, activities]);

  const current = activities?.[active] as Activity | undefined;
  const previous = (prev !== null ? (activities?.[prev] as Activity | undefined) : null) as
    | Activity
    | null
    | undefined;

  const { bullets, summary } = extractHighlights(current?.description);

  if (!current) return null;

  const currentImg = current.imageUrl;
  const prevImg = previous ? previous.imageUrl : undefined;

  const title = current.name;
  const destinationId = current.destinationId ?? "";

  const reviewCount = current.reviewCount ?? 0;
  const reviewsLabel =
    typeof reviewCount !== "undefined" && reviewCount !== null
      ? Number(reviewCount) > 0
        ? `${Number(reviewCount).toLocaleString()} reviews`
        : "No reviews yet"
      : null;

  const { label: priceLabel, sub: priceSub } = formatPrice(current);

  // desktop hero height: viewport minus navbar
  const heroStyle = ({
    ["--heroH"]: `calc(100svh - ${HEADER_OFFSET_PX}px)`,
  } as unknown) as React.CSSProperties;

  return (
    <section
      suppressHydrationWarning
      style={heroStyle}
      className="relative w-full bg-gradient-to-b from-[var(--bg)] via-[var(--surface-1)] to-[var(--bg)] lg:h-[var(--heroH)] animate-fade-in"
    >
      {/* IMPORTANT: make the container take full hero height on desktop */}
      <div className="mx-auto max-w-7xl px-3 py-4 sm:px-4 sm:py-6 lg:h-full">
        {/* Card fills height */}
        <div
          className="h-auto overflow-hidden rounded-[28px] bg-[var(--surface-1)] shadow-[0_24px_70px_-45px_rgba(0,0,0,0.55)] ring-1 ring-[var(--border)] lg:h-full smooth-hover"
          onMouseEnter={() => (hoverRef.current = true)}
          onMouseLeave={() => (hoverRef.current = false)}
        >
          {/* Grid fills height. min-h-0 is CRUCIAL so inner scroll works */}
          <div className="grid gap-3 p-2 sm:p-3 md:p-8 lg:h-full lg:min-h-0 lg:grid-cols-12 lg:items-stretch">
            {/* LEFT */}
            <div className="lg:col-span-7 lg:flex lg:h-full lg:min-h-0 lg:flex-col">
              {/* Image box takes remaining height */}
              <div className="relative overflow-hidden rounded-[22px] bg-slate-100 ring-1 ring-[var(--border)] lg:flex-1 lg:min-h-0">
                {/* full height (no aspect ratio) so it fits viewport */}
                <div className="relative aspect-[4/3] w-full overflow-hidden md:h-[420px] md:aspect-auto lg:h-full">
                  {/* prev layer */}
                  {previous && motionPref !== "reduce" ? (
                    prevImg ? (
                      <NextImage
                        src={prevImg}
                        alt={previous!.name}
                        fill
                        className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[420ms] ease-out"
                        style={{ opacity: 0 }}
                        unoptimized
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-200" />
                    )
                  ) : null}

                  {/* current layer */}
                  {currentImg ? (
                    <NextImage
                      src={currentImg}
                      alt={title}
                      fill
                      className="absolute inset-0 h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-12 w-12 rounded-2xl bg-black/10" />
                        <p className="text-sm text-slate-600">No image available</p>
                      </div>
                    </div>
                  )}

                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/10" />

                  <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
                    {destinationId ? (
                      <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold text-white ring-1 ring-white/15 backdrop-blur-md">
                        {String(destinationId).toUpperCase()}
                      </span>
                    ) : null}
                    <span className="rounded-full bg-[var(--primary)] px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
                      {priceLabel === "Free Entry" ? "FREE" : "TOP PICK"}
                    </span>
                    {reviewsLabel ? (
                      <span className="rounded-full bg-black/45 px-2.5 py-1 text-[10px] font-bold text-white ring-1 ring-white/15 backdrop-blur-md">
                        {reviewsLabel}
                      </span>
                    ) : null}
                  </div>

                  <div className="absolute bottom-12 left-3 right-3 lg:bottom-4 lg:left-4 lg:right-20">
                    <h2
                      className="line-clamp-2 text-lg font-extrabold leading-tight text-white drop-shadow md:text-xl lg:block lg:whitespace-nowrap lg:overflow-hidden lg:truncate"
                      title={title}
                    >
                      {title}
                    </h2>
                    {summary ? (
                      <p
                        className="mt-1 line-clamp-2 text-xs leading-relaxed text-white/85 drop-shadow sm:text-sm lg:block lg:whitespace-nowrap lg:overflow-hidden lg:truncate"
                        title={summary}
                      >
                        {summary}
                      </p>
                    ) : null}
                  </div>

                  {len > 1 ? (
                    <>
                      <button
                        onClick={prevFn}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 shadow-lg ring-1 ring-white/15 backdrop-blur-md hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/40 smooth-hover"
                        aria-label="Previous"
                      >
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/35 p-2 shadow-lg ring-1 ring-white/15 backdrop-blur-md hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/40 smooth-hover"
                        aria-label="Next"
                      >
                        <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  ) : null}

                  {/* progress bar */}
                  {len > 1 && !paused && motionPref !== "reduce" ? (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                      <div
                        key={progressKey}
                        className="h-full bg-white/85"
                        style={{ width: "0%", animation: `heroProgress ${AUTO_MS}ms linear forwards` }}
                      />
                    </div>
                  ) : null}

                  {len > 1 ? (
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between lg:hidden">
                      <div className="flex items-center gap-1.5">
                        {activities.slice(0, 7).map((a, i) => (
                          <button
                            key={(a as Activity).id ?? `${(a as Activity).name}-${i}`}
                            onClick={() => goTo(i)}
                            className={`smooth-hover ${
                              i === active
                                ? "h-2 w-5 rounded-full bg-white"
                                : "h-2 w-2 rounded-full bg-white/35 hover:bg-white/60"
                            }`}
                            aria-label={`Go to slide ${i + 1}`}
                          />
                        ))}
                        {len > 7 ? <span className="text-[11px] font-bold text-white/70">+{len - 7}</span> : null}
                      </div>

                      <button
                        onClick={() => setPaused((p) => !p)}
                        className="rounded-full bg-black/40 px-3 py-1.5 text-[11px] font-bold text-white ring-1 ring-white/15 backdrop-blur-md"
                        aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                      >
                        {paused ? "Resume" : "Pause"}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>

              <div className="mt-3 lg:hidden">
                <Link
                  href={`/activity/${current.id}`}
                  className="block rounded-2xl bg-[var(--primary)] px-4 py-3 text-center text-sm font-semibold text-white hover:bg-[var(--primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] smooth-hover"
                >
                  View details
                </Link>
              </div>

              {/* Dots row stays compact */}
              {len > 1 ? (
                <div className="mt-3 hidden items-center justify-between gap-3 lg:flex">
                  <div className="flex items-center gap-2">
                    {activities.slice(0, 7).map((a, i) => (
                      <button
                        key={(a as Activity).id ?? `${(a as Activity).name}-${i}`}
                        onClick={() => goTo(i)}
                        className={`h-2.5 w-2.5 rounded-full smooth-hover ${
                          i === active ? "bg-[var(--primary)]" : "bg-[var(--border)] hover:bg-[var(--text-3)]"
                        }`}
                        aria-label={`Go to slide ${i + 1}`}
                      />
                    ))}
                    {len > 7 ? <span className="text-xs text-slate-500">+{len - 7}</span> : null}
                  </div>

                  <button
                    onClick={() => setPaused((p) => !p)}
                    className="rounded-full bg-[var(--surface-2)] px-3 py-1.5 text-xs font-semibold text-[var(--text-1)] shadow-sm ring-1 ring-[var(--border)] hover:bg-[var(--surface-2)] smooth-hover"
                    aria-label={paused ? "Resume autoplay" : "Pause autoplay"}
                  >
                    {paused ? "Resume" : "Pause"}
                  </button>
                </div>
              ) : null}
            </div>

            {/* RIGHT */}
            <div className="hidden lg:col-span-5 lg:block lg:h-full lg:min-h-0">
              {/* Right panel is flex column; middle scrolls */}
              <div className="flex h-full min-h-0 flex-col rounded-[22px] bg-[var(--surface-1)] ring-1 ring-[var(--border)]">
                {/* Top (fixed) */}
                <div className="p-5 md:p-6">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-3)]">
                      Featured activity
                    </p>
                    <span className="rounded-full bg-[var(--primary)] px-3 py-1 text-xs font-semibold text-white">
                      {active + 1}/{len}
                    </span>
                  </div>

                  <h1
                    className="text-base sm:text-lg font-extrabold leading-tight text-[var(--text-1)] md:text-xl whitespace-nowrap overflow-hidden truncate"
                    title={title}
                  >
                    {title}
                  </h1>

                  <div className="mt-3 sm:mt-4 grid gap-2 sm:gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-[var(--primary)] px-3 sm:px-4 py-2 sm:py-3 text-white smooth-hover hover:bg-[var(--primary-600)]">
                      <div className="text-[10px] sm:text-xs font-semibold text-white/80">{priceSub}</div>
                      <div className="text-base sm:text-lg font-extrabold">{priceLabel}</div>
                    </div>

                    <div className="rounded-2xl bg-[var(--surface-2)] px-3 sm:px-4 py-2 sm:py-3 ring-1 ring-[var(--border)]">
                      <div className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--text-3)]">
                        Tip
                      </div>
                      <div className="text-sm font-medium text-[var(--text-1)]">
                        {priceLabel === "Free Entry"
                          ? "Go early for fewer crowds + better photos."
                          : "Prices vary by time slot & inclusions."}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Middle (scrolls INSIDE the card) */}
                <div className="min-h-0 flex-1 overflow-auto px-5 pb-4 md:px-6">
                  {bullets.length ? (
                    <ul className="space-y-3">
                      {bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 animate-fade-in">
                          <span className="mt-1 inline-flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-white">
                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </span>
                          <p className="text-sm leading-relaxed text-[var(--text-2)] whitespace-nowrap overflow-hidden truncate" title={b}>
                            {b}
                          </p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p
                      className="text-sm text-[var(--text-2)] whitespace-nowrap overflow-hidden truncate"
                      title={summary || "No description available."}
                    >
                      {summary || "No description available."}
                    </p>
                  )}
                </div>

                {/* Bottom (fixed) */}
                <div className="border-t border-[var(--border)] p-4 sm:p-5 md:p-6">
                  <div className="grid gap-2 sm:gap-3">
                    <Link
                      href={`/activity/${current.id}`}
                      className="rounded-2xl bg-[var(--primary)] px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[var(--primary-600)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-center smooth-hover"
                    >
                      View details
                    </Link>
                  </div>

                  <p className="mt-3 text-xs text-[var(--text-3)]">
                    Keyboard: ← / → to navigate, Space to pause.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes heroProgress {
            from {
              width: 0%;
            }
            to {
              width: 100%;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
