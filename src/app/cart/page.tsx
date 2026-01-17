"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function CartPage() {
  const { items, removeFromCart, clearCart, totalPrice, itemCount } = useCart();
  const [showContactForm, setShowContactForm] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleCheckout = () => {
    setShowContactForm(true);
  };

  const handleFormSuccess = () => {
    setShowContactForm(false);
    setShowSuccessMessage(true);
    clearCart();
    
    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 5000);
  };

  if (itemCount === 0) {
    return (
      <main className="min-h-screen bg-[var(--bg)]">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-16">
          <div className="text-center py-20 animate-fade-in">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[var(--surface-2)] mb-6 ring-2 ring-[var(--border)] animate-scale-in">
              <ShoppingBag className="w-12 h-12 text-[var(--text-3)]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[var(--text-1)] mb-3">
              Your Cart is Empty
            </h1>
            <p className="text-[var(--text-2)] mb-8 max-w-md mx-auto">
              Start exploring our amazing destinations and activities to plan your next adventure!
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/destinations"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-600)] text-white rounded-full font-semibold hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] transition-all smooth-hover shadow-lg hover:shadow-xl"
              >
                Browse Destinations
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--surface-1)] text-[var(--text-1)] rounded-full font-semibold hover:bg-[var(--surface-2)] transition-all smooth-hover ring-2 ring-[var(--border)] hover:ring-[var(--primary)]"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Group items by currency
  const currencies = Array.from(new Set(items.map(item => item.currency)));

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-[var(--primary)] text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-slide-in">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <div>
            <p className="font-bold">Enquiry Submitted!</p>
            <p className="text-sm text-white/90">We&apos;ll contact you within 24 hours</p>
          </div>
        </div>
      )}

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactForm
          onClose={() => setShowContactForm(false)}
          cartItems={items}
          onSuccess={handleFormSuccess}
        />
      )}

      {/* Header */}
      <div className="bg-[var(--surface-1)] border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
          <nav className="flex items-center gap-2 text-sm text-[var(--text-2)] mb-6 animate-fade-in">
            <Link href="/" className="hover:text-[var(--primary)] transition-colors smooth-hover">Home</Link>
            <span>/</span>
            <span className="text-[var(--text-1)] font-semibold">Cart</span>
          </nav>
          
          <div className="flex items-center justify-between animate-fade-in">
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-[var(--text-1)] mb-2">
                Your Cart
              </h1>
              <p className="text-lg text-[var(--text-2)]">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
            {itemCount > 0 && (
              <button
                onClick={clearCart}
                className="px-4 py-2 text-sm font-semibold text-[var(--error)] hover:text-[var(--error)]/80 hover:bg-[var(--error)]/10 rounded-lg transition-all smooth-hover"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Cart Items */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-[var(--surface-1)] rounded-2xl shadow-md ring-1 ring-[var(--border)] overflow-hidden hover:shadow-lg hover:ring-[var(--primary)]/50 transition-all smooth-hover hover:-translate-y-1 animate-fade-in"
              >
                <div className="flex gap-4 p-4 md:p-6">
                  {/* Image */}
                  <div className="relative w-24 h-24 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ShoppingBag className="w-8 h-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <span className="inline-block px-2 py-1 rounded-md bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold mb-2">
                          {item.type === 'activity' ? 'Activity' : 'Destination'}
                        </span>
                        <h3 className="text-lg md:text-xl font-bold text-[var(--text-1)] line-clamp-2">
                          {item.name}
                        </h3>
                        {item.destinationName && (
                          <p className="text-sm text-[var(--text-2)] mt-1">
                            {item.destinationName}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="flex-shrink-0 p-2 text-[var(--error)] hover:bg-[var(--error)]/10 rounded-lg transition-all smooth-hover"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-lg md:text-xl font-black text-[var(--text-1)]">
                        {item.price > 0 ? `${item.currency} ${item.price.toFixed(2)}` : 'Free'}
                      </div>
                      <Link
                        href={item.type === 'activity' ? `/activity/${item.id}` : `/destination/${item.destinationId}`}
                        className="text-sm font-semibold text-[var(--primary)] hover:text-[var(--primary-600)] hover:underline transition-colors smooth-hover"
                      >
                        View Details →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--surface-1)] rounded-2xl shadow-lg ring-1 ring-[var(--border)] p-6 sticky top-4 animate-fade-in">
              <h2 className="text-2xl font-black text-[var(--text-1)] mb-6">
                Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between text-[var(--text-2)]">
                  <span>Items</span>
                  <span className="font-semibold">{itemCount}</span>
                </div>

                {currencies.map(currency => {
                  const currencyItems = items.filter(item => item.currency === currency);
                  const currencyTotal = currencyItems.reduce((sum, item) => sum + Number(item.price), 0);
                  
                  if (currencyTotal === 0) return null;
                  
                  return (
                    <div key={currency} className="flex items-center justify-between text-[var(--text-2)]">
                      <span>Total ({currency})</span>
                      <span className="font-semibold">{currencyTotal.toFixed(2)}</span>
                    </div>
                  );
                })}

                <div className="pt-4 border-t-2 border-[var(--border)]">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-[var(--text-1)]">Total</span>
                      <span className="text-2xl font-black text-[var(--text-1)]">
                      {currencies.length === 1 && items.some(item => Number(item.price) > 0)
                        ? `${currencies[0]} ${totalPrice.toFixed(2)}`
                        : 'Mixed'}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-600)] hover:from-[var(--primary-600)] hover:to-[var(--primary-700)] text-white font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 smooth-hover"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-[var(--text-3)] text-center mt-4">
                Items in cart are not reserved. Complete booking to secure your spots.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
