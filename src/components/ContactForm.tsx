"use client";

import { useState } from "react";
import { X, Mail, Phone, User, MessageSquare } from "lucide-react";

interface CartItem {
  id: string;
  name: string;
  price: string | number;
  currency?: string;
  type?: string;
  destinationName?: string;
}

interface ContactFormProps {
  onClose: () => void;
  cartItems: CartItem[];
  onSuccess: () => void;
}

export default function ContactForm({ onClose, cartItems, onSuccess }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneCountryCode: "+1",
    phoneNumber: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Log cart items for debugging
  console.log("ContactForm cartItems:", cartItems, "Length:", cartItems?.length);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          cartItems,
          sourcePage: "/cart",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit enquiry");
      }

      onSuccess();
    } catch (err) {
      setError("Failed to submit enquiry. Please try again.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999] flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
      <div className="bg-[var(--surface-1)] rounded-2xl shadow-2xl max-w-lg w-full my-4 animate-scale-in ring-2 ring-[var(--border)]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-600)] text-white p-4 flex items-center justify-between rounded-t-xl">
          <div>
            <h2 className="text-lg font-black mb-0.5">Contact Us</h2>
            <p className="text-white/80 text-xs">We&apos;ll get back to you within 24 hours</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-md smooth-hover"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 max-h-[calc(85vh-80px)] overflow-y-auto">        {/* Cart Items Summary */}
          {cartItems && cartItems.length > 0 && (
            <div className="bg-gradient-to-br from-[var(--surface-2)] to-[var(--surface-1)] border border-[var(--border)] rounded-lg p-3 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[var(--text-1)] text-sm">Your Selected Items</h3>
                <span className="px-2 py-0.5 bg-[var(--primary)] text-white text-[10px] font-bold rounded-full">
                  {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {cartItems.map((item) => (
                  <div key={item.id} className="bg-[var(--surface-2)]/60 rounded-md p-2 border border-[var(--border)]">
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 mt-1">
                        {item.type === 'activity' ? (
                          <svg className="w-4 h-4 text-[var(--primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[var(--text-1)] text-xs">{item.name}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
                            {item.type === 'activity' ? 'Activity' : 'Destination'}
                          </span>
                          {item.destinationName && (
                            <span className="text-[10px] text-[var(--text-3)]">📍 {item.destinationName}</span>
                          )}
                          {Number(item.price) > 0 && (
                            <span className="text-[10px] font-semibold text-[var(--text-1)]">
                              {item.currency} {Number(item.price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2 pt-2 border-t border-[var(--border)]">
                <p className="text-[11px] text-[var(--text-3)]">
                  💡 These items will be included in your enquiry for personalized assistance
                </p>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-xs font-bold text-[var(--text-1)] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-1)] focus:border-[var(--input-focus-border)] focus:ring-2 focus:ring-[var(--input-focus-ring)]/20 transition-all outline-none smooth-hover text-sm"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-[var(--text-1)] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-1)] focus:border-[var(--input-focus-border)] focus:ring-2 focus:ring-[var(--input-focus-ring)]/20 transition-all outline-none smooth-hover text-sm"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phoneNumber" className="block text-xs font-bold text-[var(--text-1)] mb-1">
              Phone Number
            </label>
            <div className="flex gap-2">
              <select
                name="phoneCountryCode"
                value={formData.phoneCountryCode}
                onChange={handleChange}
                className="px-2.5 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-1)] focus:border-[var(--input-focus-border)] focus:ring-2 focus:ring-[var(--input-focus-ring)]/20 transition-all outline-none smooth-hover text-sm"
              >
                <option value="+1">+1</option>
                <option value="+44">+44</option>
                <option value="+91">+91</option>
                <option value="+971">+971</option>
                <option value="+20">+20</option>
                <option value="+34">+34</option>
                <option value="+33">+33</option>
                <option value="+49">+49</option>
                <option value="+39">+39</option>
              </select>
              <div className="relative flex-1">
                <Phone className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-3)]" />
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-1)] focus:border-[var(--input-focus-border)] focus:ring-2 focus:ring-[var(--input-focus-ring)]/20 transition-all outline-none smooth-hover text-sm"
                  placeholder="123-456-7890"
                />
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <label htmlFor="message" className="block text-xs font-bold text-[var(--text-1)] mb-1">
              Message
            </label>
            <div className="relative">
              <MessageSquare className="absolute left-2.5 top-2.5 w-4 h-4 text-[var(--text-3)]" />
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--text-1)] focus:border-[var(--input-focus-border)] focus:ring-2 focus:ring-[var(--input-focus-ring)]/20 transition-all outline-none resize-none smooth-hover text-sm"
                placeholder="Tell us about your travel plans or any questions you have..."
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-[var(--error)]/10 border border-[var(--error)]/30 text-[var(--error)] px-3 py-2 rounded-lg text-xs animate-slide-in">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg bg-gradient-to-r from-[var(--btn-primary-bg)] to-[var(--btn-primary-hover)] hover:from-[var(--btn-primary-hover)] hover:to-[var(--btn-primary-bg)] disabled:from-[var(--border)] disabled:to-[var(--border)] text-white font-bold text-base shadow-md hover:shadow-lg disabled:cursor-not-allowed transition-all duration-300 smooth-hover"
          >
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </button>

          <p className="text-[11px] text-[var(--text-3)] text-center">
            By submitting, you agree to receive communications from YourBrand Tours
          </p>
        </form>
      </div>
    </div>
  );
}
