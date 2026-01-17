"use client";

import { useState } from "react";
import ContactForm from "../../../components/ContactForm";

interface BookingCardProps {
  price?: number | string;
  currency?: string;
}

export default function BookingCard({ price, currency }: BookingCardProps) {
  const [open, setOpen] = useState(false);

  const formattedPrice = typeof price === "number"
    ? `${currency ?? "$"}${price.toFixed(2)}`
    : price ?? "—";

  return (
    <div className="bg-[var(--surface-1)] rounded-xl sm:rounded-2xl shadow-lg ring-1 ring-[var(--border)] overflow-hidden p-4">
      <div className="text-center">
        <p className="text-xs text-[var(--text-3)] font-semibold">Starting from</p>
        <p className="text-3xl font-black text-[var(--text-1)] mt-2">{formattedPrice}</p>
        <p className="text-xs text-[var(--text-3)] mt-1">per person</p>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setOpen(true)}
          className="w-full h-11 flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white font-bold shadow-md hover:shadow-lg transition"
        >
          Enquire Now
        </button>
      </div>

      {open && (
        <ContactForm
          onClose={() => setOpen(false)}
          cartItems={[]}
          onSuccess={() => setOpen(false)}
        />
      )}
    </div>
  );
}
