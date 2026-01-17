"use client";

import { useState } from "react";
import ContactForm from "./ContactForm";
import { Mail } from "lucide-react";

interface ContactButtonProps {
  variant?: "primary" | "secondary" | "floating";
  sourcePage?: string;
  className?: string;
}

export default function ContactButton({ 
  variant = "primary", 
  className = "" 
}: ContactButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSuccess = () => {
    setShowForm(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 5000);
  };

  const variantClasses = {
    primary: "px-7 py-3.5 bg-gradient-to-r from-[var(--btn-primary-bg)] to-[var(--btn-primary-hover)] hover:from-[var(--btn-primary-hover)] hover:to-[var(--btn-primary-bg)] text-white rounded-full font-bold shadow-lg hover:shadow-xl smooth-hover",
    secondary: "px-7 py-3.5 bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border-2 border-[var(--btn-secondary-border)] hover:bg-[var(--btn-secondary-hover)] rounded-full font-bold smooth-hover",
    floating: "fixed bottom-10 right-10 z-40 p-5 bg-gradient-to-r from-[var(--btn-primary-bg)] to-[var(--btn-primary-hover)] hover:from-[var(--btn-primary-hover)] hover:to-[var(--btn-primary-bg)] text-white rounded-full shadow-2xl hover:shadow-xl hover:scale-110 smooth-hover animate-float ring-4 ring-[var(--primary)]/20",
  };

  return (
    <>
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

      {showForm && (
        <ContactForm
          onClose={() => setShowForm(false)}
          cartItems={[]}
          onSuccess={handleSuccess}
        />
      )}

      <button
        onClick={() => setShowForm(true)}
        className={`${variantClasses[variant]} transition-all duration-300 ${className} inline-flex items-center gap-2`}
      >
        <Mail className="w-5 h-5" />
        {variant !== "floating" && <span>Contact Us</span>}
      </button>
    </>
  );
}
