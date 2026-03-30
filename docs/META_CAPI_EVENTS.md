# Meta Conversion API (CAPI) — Server-Side Events

## Overview

Server-side event tracking via Meta's Conversion API for improved attribution accuracy. Events are sent from the Next.js server to Meta's Graph API, complementing the existing client-side Meta Pixel.

## Event Mapping

| User Action | Meta Event | Trigger | Type |
|---|---|---|---|
| Any page visit | `PageView` | `MetaPageView` in layout (route change) | Client → API route |
| Service page visit | `ViewContent` | `MetaViewContent` in services page | Client → API route |
| Contact page visit | `InitiateCheckout` | `MetaInitiateCheckout` in contact page | Client → API route |
| Click Submit button | `CompleteRegistration` | `handleFinalSubmit` in ContactUs | Client → API route |
| Form submitted successfully | `Lead` | Odoo handler after opportunity created | Pure server-side |

### Deferred Events (not yet implemented)

| User Action | Meta Event | Notes |
|---|---|---|
| "Contact our Advisors" click | `AddToCart` | Button doesn't exist yet; add when built |

## Architecture

```
Browser                           Server
───────                           ──────
useMetaTrack hook  ──POST──►  /api/meta/track  ──►  meta-capi.ts  ──►  Meta Graph API
                                                          ▲
Odoo handler (after success)  ─────────────────────────────┘
```

### Key Files

| File | Purpose |
|---|---|
| `laqta/lib/meta-capi.ts` | Core utility — sends events to Meta Graph API with SHA-256 hashed user data |
| `laqta/src/app/api/meta/track/route.ts` | API route for client-triggered events |
| `laqta/lib/useMetaTrack.ts` | Client hook — fire-and-forget POST to `/api/meta/track` |
| `laqta/components/tracking/MetaPageView.tsx` | Fires `PageView` on every route change |
| `laqta/components/tracking/MetaViewContent.tsx` | Fires `ViewContent` on mount |
| `laqta/components/tracking/MetaInitiateCheckout.tsx` | Fires `InitiateCheckout` on mount |

## Configuration

### Pixel ID (from Strapi)

The Meta Pixel ID is read from the **Strapi CMS** (`tracking-pixel` single type → `metaPixelId` field). This is the same Pixel ID used by the client-side Meta Pixel. No env var needed — it's already configured in Strapi.

### Access Token (env var)

Add to `laqta/.env.local` (server-only, no `NEXT_PUBLIC_` prefix):

```
META_CAPI_ACCESS_TOKEN=your_access_token
```

Get this from [Meta Events Manager](https://business.facebook.com/events_manager):
1. Go to your Pixel → Settings
2. Under "Conversions API", click "Generate access token"
3. Copy the token and set it as the env var

**Important:** The access token is a secret and must NOT be stored in Strapi or exposed to the client.

## Adding New Events

1. **Add event name** to the `ALLOWED_EVENTS` array in `laqta/src/app/api/meta/track/route.ts`
2. **Add type** to the `MetaEvent` union in `laqta/lib/useMetaTrack.ts`
3. **Client-triggered**: Use `useMetaTrack()` hook in a client component:
   ```tsx
   const { trackEvent } = useMetaTrack();
   trackEvent("NewEvent", { content_name: "example" });
   ```
4. **Server-triggered**: Call `sendMetaEvent()` directly from server code:
   ```ts
   import { sendMetaEvent } from "@/lib/meta-capi";
   sendMetaEvent({ eventName: "NewEvent", sourceUrl: "https://..." });
   ```

## Testing

1. Set up environment variables with real credentials
2. Open [Meta Events Manager](https://business.facebook.com/events_manager) → Test Events tab
3. Browse the site and verify events appear:
   - Visit any page → `PageView`
   - Visit `/services` → `ViewContent`
   - Visit `/contact` → `InitiateCheckout`
   - Submit the contact form → `CompleteRegistration` + `Lead`
4. Check server logs for `[Meta CAPI]` errors if events don't appear

## Notes

- All events are **fire-and-forget** — they never block page loads or form submissions
- User data (email, phone) is **SHA-256 hashed** before sending to Meta, as required by their API
- The API route extracts client IP and User-Agent from request headers for improved matching
- Missing env vars produce a `console.warn` but don't throw errors
