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
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg ring-1 ring-black/5 overflow-hidden p-4">
      <div className="text-center">
        <p className="text-xs text-gray-500 font-semibold">Starting from</p>
        <p className="text-3xl font-black text-gray-900 mt-2">{formattedPrice}</p>
        <p className="text-xs text-gray-500 mt-1">per person</p>
      </div>

      <div className="mt-4">
        <button
          onClick={() => setOpen(true)}
          className="w-full h-11 flex items-center justify-center py-3 rounded-xl bg-gradient-to-r from-[#0EA5A4] to-[#0EA5A4]/90 text-white font-bold shadow-md hover:shadow-lg transition"
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
