# Contact/Enquiry System Documentation

## Overview
Complete contact and enquiry management system integrated with the cart functionality. All enquiries are stored in the database with site tracking and cart item details.

## Features

### 1. **Database Schema** (`db/schema.ts`)
The `enquiries` table stores all contact form submissions with:
- `siteId` - Tracks which brand/domain (set to "yourbrand-tours")
- `sourcePage` - Page where enquiry originated
- `destinationId` - Optional destination reference
- `activityId` - Optional activity reference
- `name`, `email`, `phone` - Contact details
- `message` - Enriched message including cart items and site info
- `status` - Enquiry status (new, contacted, qualified, closed)
- Timestamps for tracking

### 2. **Contact Form Component** (`src/components/ContactForm.tsx`)
- Modal popup form with validation
- Displays cart items summary
- Collects: name, email, phone, message
- Country code selector for phone numbers
- Loading states and error handling
- Success callback integration

### 3. **Contact Button Component** (`src/components/ContactButton.tsx`)
- Reusable button with 3 variants:
  - `primary` - Blue filled button
  - `secondary` - White outlined button
  - `floating` - Fixed position floating action button
- Manages form modal state
- Shows success notifications
- Can be placed anywhere in the app

### 4. **API Route** (`src/app/api/enquiries/route.ts`)
- POST endpoint for submitting enquiries
- Automatically enriches message with:
  - Cart items details (name, type, destination, price)
  - Site name: "YourBrand Tours"
  - Source page information
  - Submission timestamp
- Extracts destination and activity IDs from cart
- Returns enquiry ID on success

## Integration Points

### Cart Page (`src/app/cart/page.tsx`)
- "Proceed to Checkout" button opens contact form
- Passes all cart items to form
- On successful submission:
  - Clears the cart
  - Shows success message
  - Auto-dismisses after 5 seconds

### Homepage (`src/app/page.tsx`)
- Floating contact button (bottom-right corner)
- Always accessible while browsing

### Footer (`src/components/Footer.tsx`)
- Contact button in footer
- Available on all pages

## Site Configuration

Site information is configured in the API route:
```typescript
const SITE_NAME = "YourBrand Tours";
const SITE_ID = "yourbrand-tours";
```

These values are automatically included in every enquiry message for tracking purposes.

## Enquiry Message Format

When a user submits an enquiry with cart items, the message is enriched with:

```
[User's message]

--- Selected Items from YourBrand Tours ---

• Activity Name (Activity) - Paris - EUR 99.99
• Destination Name (Destination) - London

Total Items: 2

--- Site Information ---
Site: YourBrand Tours
Source Page: /cart
Submitted: 2026-01-11T...
```

## Usage Examples

### Cart Checkout Flow
1. User adds items to cart
2. Clicks "Proceed to Checkout"
3. Contact form appears with cart items listed
4. User fills out contact details
5. On submit, enquiry is saved with all cart details
6. Cart is cleared and success message shown

### General Contact
1. User clicks floating contact button or footer button
2. Form appears (empty cart)
3. User fills details and message
4. Enquiry is saved with page context

### Tracking Enquiries
All enquiries are stored in the `enquiries` table with:
- Which site they came from (`siteId`)
- Which page (`sourcePage`)
- What they were interested in (cart items in message)
- Contact details for follow-up
- Status for pipeline management

## Files Created/Modified

### New Files
- `src/components/ContactForm.tsx` - Main contact form modal
- `src/components/ContactButton.tsx` - Reusable contact trigger button
- `src/app/api/enquiries/route.ts` - API endpoint for submissions

### Modified Files
- `src/app/cart/page.tsx` - Added checkout flow with contact form
- `src/app/page.tsx` - Added floating contact button
- `src/components/Footer.tsx` - Added contact button
- `src/app/globals.css` - Added slide-in animation

## Database Schema (Already Existed)
The enquiries table was already defined in `db/schema.ts` with all necessary fields and indexes.

## Success Notifications
- Green toast notification appears on successful submission
- Auto-dismisses after 5 seconds
- Slide-in animation from right
- Confirms message was sent

## Multi-Site Support
The system is designed for multi-site/multi-brand support:
- `siteId` field tracks which brand/domain
- Easy to update site name and ID in API route
- Can be extended to read from environment variables
