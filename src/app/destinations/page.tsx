"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

interface Country {
  id: string;
  name: string;
  flag: string;
  image: string;
}

const countries: Country[] = [
  { id: "argentina", name: "Argentina", flag: "🇦🇷", image: "/countries/argentina.webp" },
  { id: "australia", name: "Australia", flag: "🇦🇺", image: "/countries/australia.webp" },
  { id: "austria", name: "Austria", flag: "🇦🇹", image: "/countries/austria.jpg" },
  { id: "bali", name: "Bali", flag: "🇮🇩", image: "/countries/bali.jpg" },
  { id: "belgium", name: "Belgium", flag: "🇧🇪", image: "/countries/belgium.jpg" },
  { id: "brazil", name: "Brazil", flag: "🇧🇷", image: "/countries/brazil.jpg" },
  { id: "bulgaria", name: "Bulgaria", flag: "🇧🇬", image: "/countries/bulgaria.jpg" },
  { id: "canada", name: "Canada", flag: "🇨🇦", image: "/countries/canada.webp" },
  { id: "china", name: "China", flag: "🇨🇳", image: "/countries/china.jpg" },
  { id: "croatia", name: "Croatia", flag: "🇭🇷", image: "/countries/coratia.jpg" },
  { id: "cuba", name: "Cuba", flag: "🇨🇺", image: "/countries/cuba.jpg" },
  { id: "czechia", name: "Czechia", flag: "🇨🇿", image: "/countries/czechia.jpeg" },
  { id: "denmark", name: "Denmark", flag: "🇩🇰", image: "/countries/denmark.jpg" },
  { id: "dominican", name: "Dominican Republic", flag: "🇩🇴", image: "/countries/dominican.jpg" },
  { id: "dubai", name: "Dubai", flag: "🇦🇪", image: "/countries/dubai.jpg" },
  { id: "egypt", name: "Egypt", flag: "🇪🇬", image: "/countries/egypt.avif" },
  { id: "france", name: "France", flag: "🇫🇷", image: "/countries/france.jpg" },
  { id: "germany", name: "Germany", flag: "🇩🇪", image: "/countries/germany.webp" },
  { id: "greece", name: "Greece", flag: "🇬🇷", image: "/countries/greece.jpg" },
  { id: "hungary", name: "Hungary", flag: "🇭🇺", image: "/countries/hungary.jpg" },
  { id: "india", name: "India", flag: "🇮🇳", image: "/countries/india.jpg" },
  { id: "ireland", name: "Ireland", flag: "🇮🇪", image: "/countries/ireland.webp" },
  { id: "italy", name: "Italy", flag: "🇮🇹", image: "/countries/italy.jpg" },
  { id: "jamaica", name: "Jamaica", flag: "🇯🇲", image: "/countries/jamiaca.jpg" },
  { id: "japan", name: "Japan", flag: "🇯🇵", image: "/countries/japan.jpg" },
  { id: "jordan", name: "Jordan", flag: "🇯🇴", image: "/countries/jordan.webp" },
  { id: "london", name: "London", flag: "🇬🇧", image: "/countries/london.jpg" },
  { id: "malaysia", name: "Malaysia", flag: "🇲🇾", image: "/countries/malaysia.webp" },
  { id: "mexico", name: "Mexico", flag: "🇲🇽", image: "/countries/mexico.avif" },
  { id: "morocco", name: "Morocco", flag: "🇲🇦", image: "/countries/morocco.avif" },
  { id: "netherlands", name: "Netherlands", flag: "🇳🇱", image: "/countries/netherlands.avif" },
  { id: "newzealand", name: "New Zealand", flag: "🇳🇿", image: "/countries/newzealand.webp" },
  { id: "norway", name: "Norway", flag: "🇳🇴", image: "/countries/Norway.jpg" },
  { id: "poland", name: "Poland", flag: "🇵🇱", image: "/countries/poland.avif" },
  { id: "portugal", name: "Portugal", flag: "🇵🇹", image: "/countries/portugal.jpg" },
  { id: "qatar", name: "Qatar", flag: "🇶🇦", image: "/countries/qatar.jpg" },
  { id: "romania", name: "Romania", flag: "🇷🇴", image: "/countries/romania.jpg" },
  { id: "saudi", name: "Saudi Arabia", flag: "🇸🇦", image: "/countries/saudi.jpg" },
  { id: "singapore", name: "Singapore", flag: "🇸🇬", image: "/countries/singapore.webp" },
  { id: "southafrica", name: "South Africa", flag: "🇿🇦", image: "/countries/southafrica.jpg" },
  { id: "southkorea", name: "South Korea", flag: "🇰🇷", image: "/countries/southkorea.jpg" },
  { id: "spain", name: "Spain", flag: "🇪🇸", image: "/countries/spain.webp" },
  { id: "sweden", name: "Sweden", flag: "🇸🇪", image: "/countries/sweden.webp" },
  { id: "switzerland", name: "Switzerland", flag: "🇨🇭", image: "/countries/switzerland.jpg" },
  { id: "thailand", name: "Thailand", flag: "🇹🇭", image: "/countries/thailand.jpg" },
  { id: "tunisia", name: "Tunisia", flag: "🇹🇳", image: "/countries/tunisia.webp" },
  { id: "turkey", name: "Turkey", flag: "🇹🇷", image: "/countries/turkey.jpg" },
  { id: "united-states", name: "United States", flag: "🇺🇸", image: "/countries/united-states.jpg" },
  { id: "vietnam", name: "Vietnam", flag: "🇻🇳", image: "/countries/vietnam.webp" },
];

export default function DestinationsPage() {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Header */}
      <div className="bg-[var(--surface-1)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-2)] mb-6">
            <Link href="/" className="hover:text-[var(--primary)] transition">Home</Link>
            <span>/</span>
            <span className="text-[var(--text-1)] font-semibold">All Destinations</span>
          </nav>
          
          <h1 className="text-4xl md:text-6xl font-black text-[var(--text-1)] mb-4">
            Explore All Destinations
          </h1>
          <p className="text-lg md:text-xl text-[var(--text-2)] max-w-3xl">
            Discover amazing activities and experiences across {countries.length} incredible destinations worldwide
          </p>
        </div>
      </div>

      {/* Countries Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {countries.map((country) => (
            <div
              key={country.id}
              className="group relative h-80 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 ring-1 ring-[var(--border)] hover:ring-[var(--primary)]/50 bg-[var(--surface-1)]"
            >
              {/* Image Link */}
              <Link
                href={`/destination/${country.id}`}
                className="absolute inset-0"
              >
                <div className="absolute inset-0">
                  <Image
                    src={country.image}
                    alt={country.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-5 pb-20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-3xl">{country.flag}</span>
                  </div>
                  <h3 className="text-2xl font-black text-white mb-1 group-hover:text-[var(--primary)] transition-colors">
                    {country.name}
                  </h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <span>Explore activities</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Hover Effect Border */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/50 rounded-2xl transition-colors pointer-events-none" />
              </Link>

              {/* Enquire Now Button */}
              <div className="absolute bottom-4 left-4 right-4 z-20">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsContactOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all smooth-hover active:scale-95"
                >
                  Enquire Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-600)] py-16">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
            Can&apos;t find your destination?
          </h2>
          <p className="text-lg text-white/80 mb-8">
            We&apos;re constantly adding new destinations. Contact us to suggest your favorite location!
          </p>
          <button
            onClick={() => setIsContactOpen(true)}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-[var(--primary)] rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all"
          >
            Get in Touch
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Contact Form Modal */}
      {isContactOpen && (
        <ContactForm
          onClose={() => setIsContactOpen(false)}
          cartItems={[]}
          onSuccess={() => setIsContactOpen(false)}
        />
      )}
    </main>
  );
}
