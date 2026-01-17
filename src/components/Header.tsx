"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ContactForm from "./ContactForm";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* Success Message */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--success)] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-bold">Message Sent!</p>
            <p className="text-sm text-white/90">We&apos;ll be in touch soon</p>
          </div>
        </div>
      )}

      {/* Contact Form Modal - Rendered outside header for proper centering */}
      {showContactForm && (
        <ContactForm
          onClose={() => setShowContactForm(false)}
          cartItems={[]}
          onSuccess={() => {
            setShowContactForm(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 5000);
          }}
        />
      )}

      <header className="bg-[var(--surface-1)] shadow-lg sticky top-0 z-50 border-b-2 border-[var(--border)] backdrop-blur-lg bg-[var(--surface-1)]/98">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-extrabold text-[var(--primary)] hover:text-[var(--primary-600)] transition-all smooth-hover animate-fade-in tracking-tight">
                YourBrand Tours
              </Link>
            </div>

            {/* Desktop Navigation (only site pages) */}
            <nav className="hidden md:flex items-center space-x-8 text-[var(--text-2)] font-semibold">
              <Link href="/destinations" className="hover:text-[var(--primary)] transition-colors smooth-hover px-2 py-1 rounded-lg hover:bg-[var(--surface-2)]">
                Destinations
              </Link>
              <Link href="/#faq" className="hover:text-[var(--primary)] transition-colors smooth-hover px-2 py-1 rounded-lg hover:bg-[var(--surface-2)]">
                FAQ
              </Link>
              <button onClick={async () => {
                try {
                  const res = await fetch('/countries/manifest.json');
                  const data = await res.json();
                  const keys = Object.keys(data || {});
                  if (keys.length === 0) return;
                  const random = keys[Math.floor(Math.random() * keys.length)];
                  router.push(`/destination/${encodeURIComponent(random)}`);
                } catch (e) {
                  console.error('Failed to open random country', e);
                }
              }} className="hover:text-[var(--primary)] transition-colors smooth-hover">Random Country</button>
            </nav>

            {/* Right Side Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <button onClick={() => setShowContactForm(true)} className="text-[var(--text-1)] hover:text-[var(--primary)] flex items-center gap-2 smooth-hover p-2 rounded-lg hover:bg-[var(--surface-2)] transition-all" aria-label="Open contact form">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="hidden md:inline">Help</span>
              </button>
            </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-[var(--text-1)] hover:text-[var(--primary)] transition-all smooth-hover p-2 rounded-lg hover:bg-[var(--surface-2)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

          {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4 animate-fade-in">
            <nav className="flex flex-col space-y-4">
              <Link href="/destinations" className="text-[var(--text-1)] hover:text-[var(--primary)] font-medium smooth-hover py-2 px-3 rounded-lg hover:bg-[var(--surface-2)]">
                Destinations
              </Link>
              <Link href="/#faq" className="text-[var(--text-1)] hover:text-[var(--primary)] font-medium smooth-hover py-2 px-3 rounded-lg hover:bg-[var(--surface-2)]">
                FAQ
              </Link>
              <button onClick={async () => {
                try {
                  const res = await fetch('/countries/manifest.json');
                  const data = await res.json();
                  const keys = Object.keys(data || {});
                  if (keys.length === 0) return;
                  const random = keys[Math.floor(Math.random() * keys.length)];
                  router.push(`/destination/${encodeURIComponent(random)}`);
                } catch (e) {
                  console.error('Failed to open random country', e);
                }
              }} className="text-[var(--text-1)] hover:text-[var(--primary)] font-medium text-left smooth-hover py-2 px-3 rounded-lg hover:bg-[var(--surface-2)]">Random Country</button>
              <button onClick={() => setShowContactForm(true)} className="text-[var(--text-1)] hover:text-[var(--primary)] font-medium smooth-hover py-2 px-3 rounded-lg hover:bg-[var(--surface-2)]">
                Help
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  );
}
