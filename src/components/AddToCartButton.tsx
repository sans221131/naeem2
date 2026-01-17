"use client";

import { useCart, type CartItem } from "@/contexts/CartContext";
import { ShoppingCart, Check } from "lucide-react";

interface AddToCartButtonProps {
  item: Omit<CartItem, "addedAt">;
  className?: string;
  variant?: "primary" | "secondary" | "small";
}

export default function AddToCartButton({ 
  item, 
  className = "", 
  variant = "primary" 
}: AddToCartButtonProps) {
  const { addToCart, isInCart } = useCart();
  const inCart = isInCart(item.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!inCart) {
      addToCart(item);
    }
  };

  const baseClasses = "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-300 smooth-hover";
  
  const variantClasses = {
    primary: inCart
      ? "bg-[var(--success)] hover:bg-[var(--success)]/90 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl smooth-hover"
      : "bg-gradient-to-r from-[var(--btn-primary-bg)] to-[var(--btn-primary-hover)] hover:from-[var(--btn-primary-hover)] hover:to-[var(--btn-primary-bg)] text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl smooth-hover",
    secondary: inCart
      ? "bg-[var(--success)]/10 text-[var(--success)] border-2 border-[var(--success)]/30 px-4 py-2 rounded-lg smooth-hover"
      : "bg-[var(--btn-secondary-bg)] text-[var(--btn-secondary-text)] border-2 border-[var(--btn-secondary-border)] hover:border-[var(--primary)] px-4 py-2 rounded-lg hover:bg-[var(--btn-secondary-hover)] smooth-hover",
    small: inCart
      ? "bg-[var(--success)] text-white px-3 py-1.5 rounded-lg text-sm smooth-hover"
      : "bg-gradient-to-r from-[var(--btn-primary-bg)] to-[var(--btn-primary-hover)] hover:from-[var(--btn-primary-hover)] hover:to-[var(--btn-primary-bg)] text-white px-3 py-1.5 rounded-lg text-sm smooth-hover",
  };

  return (
    <button
      onClick={handleClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={inCart}
    >
      {inCart ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added to Cart</span>
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
