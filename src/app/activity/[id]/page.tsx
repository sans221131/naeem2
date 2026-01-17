import { db } from "../../../../db/client";
import { activities } from "../../../../db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BookingCard from "./BookingCard";

interface ActivityPageProps {
  params: Promise<{ id: string }>;
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const { id } = await params;

  // Fetch activity from database
  const [activity] = await db
    .select()
    .from(activities)
    .where(eq(activities.id, id))
    .limit(1);

  if (!activity) {
    notFound();
  }

  // Parse description to extract highlights, inclusions, exclusions, and extra sections
  const parseDescription = (desc: string) => {
    const normalized = desc
      .replace(/\\n/g, "\n")
      .replace(/\r\n/g, "\n")
      .replace(/\u2019/g, "'")
      .replace(/’/g, "'");
    const sections = {
      highlights: [] as string[],
      inclusions: [] as string[],
      exclusions: [] as string[],
      extraSections: [] as { title: string; items: string[] }[],
      overview: "",
    };

    const lines = normalized.split("\n");
    let currentSection: string = "overview";
    let currentExtraTitle = "";
    const overviewParts: string[] = [];

    const startExtraSection = (title: string) => {
      const existing = sections.extraSections.find((section) => section.title === title);
      if (!existing) {
        sections.extraSections.push({ title, items: [] });
      }
      currentExtraTitle = title;
      currentSection = "extra";
    };

    const addExtraItem = (text: string) => {
      const target = sections.extraSections.find((section) => section.title === currentExtraTitle);
      if (target) target.items.push(text);
    };

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const headerCandidate = trimmed.replace(/[:\-]+$/, "").trim();
      const lower = headerCandidate.toLowerCase();

      if (lower.includes("highlight")) {
        currentSection = "highlights";
        continue;
      }
      if (lower.includes("what's included") || lower.includes("whats included") || lower.includes("included") || lower.includes("inclusion")) {
        currentSection = "inclusions";
        continue;
      }
      if (lower.includes("not included") || lower.includes("exclusion") || lower.includes("exclude")) {
        currentSection = "exclusions";
        continue;
      }
      if (
        lower.includes("who it's for") ||
        lower.includes("who its for") ||
        lower.includes("eligibility") ||
        lower.includes("requirements") ||
        lower.includes("rules") ||
        lower.includes("good to know") ||
        lower.includes("what you'll actually do") ||
        lower.includes("what youll actually do") ||
        lower.includes("what you will do") ||
        lower.includes("what you'll do") ||
        lower.includes("what youll do")
      ) {
        startExtraSection(headerCandidate);
        continue;
      }

      const isBullet = /^[-•*]\s+/.test(trimmed);
      const text = isBullet ? trimmed.replace(/^[-•*]\s+/, "") : trimmed;

      switch (currentSection) {
        case "highlights":
          sections.highlights.push(text);
          break;
        case "inclusions":
          sections.inclusions.push(text);
          break;
        case "exclusions":
          sections.exclusions.push(text);
          break;
        case "extra":
          addExtraItem(text);
          break;
        default:
          overviewParts.push(text);
      }
    }

    sections.overview = overviewParts.join("\n").trim() || normalized.trim();
    return sections;
  };

  const parsed = parseDescription(activity.description);

  const formatPrice = () => {
    const price = typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price);
    if (!Number.isFinite(price) || price === 0) return "Free";
    return `${activity.currency} ${price.toFixed(2)}`;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Mobile Hero Section - Completely redesigned */}
      <div className="lg:hidden">
        {/* Compact Image Header */}
        <div className="relative h-[240px] w-full">
          {activity.imageUrl ? (
            <Image
              src={activity.imageUrl}
              alt={activity.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-gray-700">
              <svg className="w-20 h-20 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          
          {/* Rating Badge - Top Right */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
            <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-sm font-bold text-gray-900">4.9</span>
          </div>
        </div>

        {/* Title Card - Overlapping design */}
        <div className="relative -mt-8 mx-3 bg-white rounded-2xl shadow-xl p-4 mb-4">
          <h1 className="text-xl font-black text-gray-900 leading-tight mb-3">
            {activity.name}
          </h1>
          
          {/* Price & Quick Actions Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 font-semibold">From</span>
              <span className="text-2xl font-black text-blue-600">{formatPrice()}</span>
              <span className="text-xs text-gray-500">per person</span>
            </div>
            
            {/* Quick Booking CTA removed (cart system disabled) */}
          </div>
        </div>

        {/* Breadcrumb - Moved below title */}
        <div className="px-3 mb-4">
          <nav className="flex items-center gap-2 text-xs text-gray-500 overflow-x-auto scrollbar-hide">
            <Link href="/" className="hover:text-blue-600 transition whitespace-nowrap">Home</Link>
            <span>/</span>
            <Link href="/activities" className="hover:text-blue-600 transition whitespace-nowrap">Activities</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{activity.name}</span>
          </nav>
        </div>

        {/* Mobile Content Sections */}
        <div className="px-3 pb-4 space-y-3">
          {/* Overview Card */}
          <div className="bg-white rounded-xl p-4 shadow-md">
            <h2 className="text-base font-black text-gray-900 mb-2 flex items-center gap-2">
              <span>📋</span>
              <span>Overview</span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
              {parsed.overview}
            </p>
          </div>

          {/* Highlights Card */}
          {parsed.highlights.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                <span>✨</span>
                <span>Highlights</span>
              </h2>
              <ul className="space-y-2">
                {parsed.highlights.map((highlight, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Inclusions Card */}
          {parsed.inclusions.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                <span>✅</span>
                <span>What&apos;s Included</span>
              </h2>
              <ul className="space-y-2">
                {parsed.inclusions.map((inclusion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span>{inclusion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Exclusions Card */}
          {parsed.exclusions.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                <span>❌</span>
                <span>Not Included</span>
              </h2>
              <ul className="space-y-2">
                {parsed.exclusions.map((exclusion, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span>{exclusion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {parsed.extraSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-xl p-4 shadow-md">
              <h2 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
                <span>🧾</span>
                <span>{section.title}</span>
              </h2>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-2 text-sm text-gray-700">
                    <svg className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0 1 1 0 002 0zm-1 3a1 1 0 00-1 1v5a1 1 0 002 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Important Info Card */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 shadow-md border border-amber-200">
            <h2 className="text-base font-black text-gray-900 mb-3 flex items-center gap-2">
              <span>ℹ️</span>
              <span>Good to Know</span>
            </h2>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Instant confirmation</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Mobile voucher accepted</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span>Free cancellation (48h)</span>
              </li>
            </ul>
          </div>

          {/* Mobile Booking Card removed */}
          <div>
            {/* Booking card (mobile) */}
            <div className="lg:hidden px-0">
              {/* dynamically loaded client component */}
              <BookingCard
                price={typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price)}
                currency={activity.currency}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - Keep original design */}
      <div className="hidden lg:block">
        {/* Breadcrumb */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 sm:py-4">
            <nav className="flex items-center gap-2 text-xs sm:text-sm text-gray-600 overflow-x-auto scrollbar-hide">
              <Link href="/" className="hover:text-blue-600 transition whitespace-nowrap">Home</Link>
              <span className="flex-shrink-0">/</span>
              <Link href="/activities" className="hover:text-blue-600 transition whitespace-nowrap">Activities</Link>
              <span className="flex-shrink-0">/</span>
              <span className="text-gray-900 font-semibold truncate">{activity.name}</span>
            </nav>
          </div>
        </div>

        {/* Hero Image Section with Overlay */}
        <div className="bg-white pb-4 sm:pb-8">
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="relative h-[350px] md:h-[450px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
              {activity.imageUrl ? (
                <Image
                  src={activity.imageUrl}
                  alt={activity.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full bg-gradient-to-br from-gray-900 to-gray-700">
                  <svg className="w-32 h-32 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Dark gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
              
              {/* Content overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                {/* Top badges */}
                <div className="flex items-start justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/95 backdrop-blur-sm px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-lg">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm sm:text-base font-bold text-gray-900">4.9</span>
                  </div>
                </div>

                {/* Bottom title and price */}
                <div>
                  <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-white mb-2 sm:mb-4 drop-shadow-2xl leading-tight line-clamp-3">
                    {activity.name}
                  </h1>
                  <div className="inline-flex items-center gap-1.5 sm:gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-lg shadow-xl">
                    <span>From {formatPrice()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Overview */}
              <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg ring-1 ring-black/5">

              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2 sm:gap-3">
                <span className="text-lg sm:text-xl md:text-2xl">📋</span>
                Overview
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {parsed.overview}
              </p>
            </section>

            {/* Highlights */}
            {parsed.highlights.length > 0 && (
              <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg ring-1 ring-black/5">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl md:text-2xl">✨</span>
                  Highlights
                </h2>
                <ul className="space-y-2 sm:space-y-3">
                  {parsed.highlights.map((highlight, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                      <svg className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Inclusions */}
            {parsed.inclusions.length > 0 && (
              <section className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 shadow-lg ring-1 ring-black/5">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-gray-900 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
                  <span className="text-lg sm:text-xl md:text-2xl">✅</span>
                  What&apos;s Included
                </h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3">
                  {parsed.inclusions.map((inclusion, idx) => (
                    <li key={idx} className="flex items-start gap-2 sm:gap-3 text-sm sm:text-base text-gray-700">
                      <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{inclusion}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Exclusions */}
            {parsed.exclusions.length > 0 && (
              <section className="bg-white rounded-2xl p-6 md:p-8 shadow-lg ring-1 ring-black/5">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-red-600">❌</span>
                  What&apos;s Not Included
                </h2>
                <ul className="space-y-3">
                  {parsed.exclusions.map((exclusion, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span>{exclusion}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {parsed.extraSections.map((section, sectionIndex) => (
              <section key={sectionIndex} className="bg-white rounded-2xl p-6 md:p-8 shadow-lg ring-1 ring-black/5">
                <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                  <span className="text-slate-600">🧾</span>
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3 text-gray-700">
                      <svg className="w-5 h-5 text-slate-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0 1 1 0 002 0zm-1 3a1 1 0 00-1 1v5a1 1 0 002 0V9a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}

            {/* Important Information */}
            <section className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-6 md:p-8 shadow-lg ring-1 ring-amber-200">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-amber-600">ℹ️</span>
                Important Information
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Instant confirmation upon booking</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Mobile voucher accepted - show on your phone</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>Free cancellation up to 48 hours before the activity</span>
                </li>
                <li className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span>English language support available</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column - Booking card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <BookingCard
                price={typeof activity.price === "string" ? parseFloat(activity.price) : Number(activity.price)}
                currency={activity.currency}
              />
            </div>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

// BookingCard is a client component imported directly above.
