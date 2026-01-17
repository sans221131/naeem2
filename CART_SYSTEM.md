# Cart System Documentation

## Overview
A complete cache-based cart system using localStorage that allows users to add destinations and activities to their cart across the entire application.

## Features

### 1. **Cart Context** (`src/contexts/CartContext.tsx`)
- Centralized state management for cart items
- Automatic localStorage persistence
- Real-time updates across all components
- Functions:
  - `addToCart(item)` - Add an item to cart
  - `removeFromCart(id)` - Remove item by ID
  - `clearCart()` - Clear all items
  - `isInCart(id)` - Check if item exists in cart
  - `itemCount` - Total number of items
  - `totalPrice` - Sum of all item prices

### 2. **AddToCartButton Component** (`src/components/AddToCartButton.tsx`)
- Reusable button with 3 variants: `primary`, `secondary`, `small`
- Visual feedback when item is in cart (changes to green with checkmark)
- Prevents duplicate additions
- Used throughout destinations and activity pages

### 3. **Cart Page** (`src/app/cart/page.tsx`)
- Full cart management interface
- Display all cart items with images
- Remove individual items or clear all
- Summary section with totals
- Handles multiple currencies
- Empty state with call-to-action

### 4. **Integration Points**

#### Destinations Page (`src/app/destinations/page.tsx`)
- "Add to Cart" button on each destination card
- Items stored with type: "destination"

#### Destination Detail Page (`src/app/destination/[id]/page.tsx`)
- Uses ActivityCard component with built-in cart buttons

#### Activity Cards (`src/components/ActivityCard.tsx`)
- Reusable component with integrated cart functionality
- Shows activity details with "Add to Cart" and "View Details" actions

#### Activity Detail Page (`src/app/activity/[id]/BookingCard.tsx`)
- "Add to Cart" button in the booking card
- Positioned above "Book Now" button

#### Header (`src/components/Header.tsx`)
- Shopping cart icon with item count badge
- Visible in both desktop and mobile views
- Real-time count updates

## Data Structure

```typescript
interface CartItem {
  id: string;                    // Unique identifier
  type: "activity" | "destination";
  name: string;                  // Display name
  destinationId?: string;        // Associated destination
  destinationName?: string;      // Destination display name
  price: number;                 // Numeric price
  currency: string;              // Currency code (USD, EUR, etc.)
  imageUrl?: string;             // Optional image
  addedAt: number;              // Timestamp
}
```

## Usage Examples

### Adding an Activity to Cart
```tsx
<AddToCartButton
  item={{
    id: activity.id,
    type: "activity",
    name: activity.name,
    destinationId: activity.destinationId,
    price: 99.99,
    currency: "USD",
    imageUrl: activity.imageUrl,
  }}
  variant="primary"
/>
```

### Adding a Destination to Cart
```tsx
<AddToCartButton
  item={{
    id: `destination-${country.id}`,
    type: "destination",
    name: country.name,
    destinationId: country.id,
    price: 0,
    currency: "USD",
    imageUrl: country.image,
  }}
  variant="secondary"
/>
```

### Using Cart Context
```tsx
const { items, addToCart, removeFromCart, itemCount } = useCart();
```

## Files Created/Modified

### New Files
- `src/contexts/CartContext.tsx` - Cart state management
- `src/components/AddToCartButton.tsx` - Reusable cart button
- `src/components/ActivityCard.tsx` - Activity card with cart
- `src/app/cart/page.tsx` - Cart page
- `src/app/api/destinations/[id]/activities/route.ts` - API route

### Modified Files
- `src/app/layout.tsx` - Added CartProvider wrapper
- `src/app/destinations/page.tsx` - Added cart buttons
- `src/app/destination/[id]/page.tsx` - Converted to client component with cart
- `src/app/activity/[id]/BookingCard.tsx` - Added cart button
- `src/components/Header.tsx` - Added cart icon and counter

## Browser Storage
Cart data is persisted in localStorage under the key: `travel-cart`

This allows cart items to persist across:
- Page refreshes
- Browser sessions
- Navigation between pages

## Notes
- Cart items are NOT reserved/held - they're just saved for user reference
- Multiple currencies are supported and displayed separately in cart summary
- Cart state is client-side only and syncs automatically across components
- Items can be both free (price: 0) and paid
