# Meta Pixel Integration — Laqta

## Two Approaches

| | Meta Pixel (Client-Side) | Conversions API (Server-Side) |
|---|---|---|
| **Where it runs** | In the user's browser (JavaScript) | On your server (Next.js API routes) |
| **How it works** | Loads Meta's `fbevents.js` script, fires events on page actions | Your backend sends events directly to Meta's API |
| **Blocked by ad blockers?** | Yes | No |
| **Data accuracy** | ~60-70% (ad blockers, iOS privacy) | ~95%+ |
| **Setup difficulty** | Easy | Moderate |
| **Best for** | Page views, button clicks, general browsing behavior | Form submissions, confirmed conversions, high-value events |

### Recommendation

Use **both together** for maximum tracking accuracy. Meta calls this "redundant setup" and automatically deduplicates events using an `event_id`.

---

## Approach 1: Meta Pixel (Client-Side)

### What It Does
A JavaScript snippet that loads on every page. Once installed, the site owner configures events themselves using Meta's **Event Setup Tool** — a point-and-click browser tool that lets you select buttons, forms, and pages to track without writing any code.

### Developer Work (One-Time)

**1. Add Pixel ID to environment** — `laqta/.env`
```
NEXT_PUBLIC_META_PIXEL_ID=your_pixel_id_here
```

**2. Create Pixel component** — `laqta/components/MetaPixel.tsx`
- Load `fbevents.js` using `next/script` with `afterInteractive` strategy
- Fire `fbq('init', PIXEL_ID)` and `fbq('track', 'PageView')`
- Include `<noscript>` fallback image

**3. Add to root layout** — `laqta/src/app/[locale]/layout.tsx`
- Import and render `<MetaPixel />` in the layout

That's it. No custom event code needed.

**Estimated effort:** ~30 minutes

### Site Owner Work (No Developer Needed)

After the Pixel ID is installed, the site owner sets up events from Meta Events Manager:

1. Go to **Events Manager** > **Settings** > **Open Event Setup Tool**
2. Enter the website URL
3. The tool opens the site in a browser overlay
4. Click on buttons, forms, or links to assign events (Lead, Contact, ViewContent, etc.)
5. Events are saved and tracked automatically — no code changes required

The site owner can add, edit, or remove tracked events at any time using this tool.

---

## Approach 2: Conversions API (Server-Side)

### What It Does
Your Next.js server sends events directly to Meta's API endpoint (`graph.facebook.com/v21.0/{pixel_id}/events`). Not affected by ad blockers or browser privacy settings. This approach requires coordination between the site owner and the developer.

### Events to Track

| Event | Trigger | Where to Send From |
|-------|---------|-------------------|
| `Lead` | Partner request form submitted | Next.js API route |
| `Contact` | Contact form submitted | Next.js API route |
| `PageView` | Key page visits (optional, redundant with pixel) | Next.js middleware or API route |

### Site Owner Work

The site owner handles everything on the Meta side — no coding involved:

**1. Generate API credentials in Meta Events Manager**
- Go to **Events Manager** > select your Pixel > **Settings**
- Scroll to **Conversions API** section
- Click **Generate access token** and copy it
- Share the **access token** and **Pixel ID** with the developer

**2. Decide which events to track**
- Tell the developer which form submissions or actions should be tracked server-side
- Common choices: contact form submissions, partner requests, quote requests
- These are typically high-value actions where accuracy matters most

**3. Verify events are arriving**
- Go to **Events Manager** > **Test Events** tab
- Enter the test event code and share it with the developer for testing
- After the developer deploys, confirm events appear in the **Overview** tab
- Check that events show as "Server" source (not just "Browser")

**4. Ongoing: monitor event quality**
- Events Manager shows a quality score for each event
- If quality drops, coordinate with developer to send additional user data (e.g., email, phone)

### Developer Work

The developer handles all the code — needs the Pixel ID and access token from the site owner:

**1. Add credentials to environment** — `laqta/.env`
```
META_PIXEL_ID=your_pixel_id_here
META_CONVERSIONS_API_TOKEN=your_access_token_here
```
(Values provided by the site owner)

**2. Create server-side helper** — `laqta/lib/meta-conversions.ts`
- A function that sends `POST` to `https://graph.facebook.com/v21.0/{PIXEL_ID}/events`
- Payload structure:
  - `event_name` — e.g., "Lead", "Contact"
  - `event_time` — Unix timestamp
  - `event_id` — unique ID for deduplication with client-side pixel
  - `event_source_url` — the page URL where the action happened
  - `action_source` — always `"website"`
  - `user_data` — hashed user info (see below)
- User data fields (`em`, `ph`, `fn`, `ln`) must be **lowercase, trimmed, and SHA-256 hashed** before sending
- Example: `email: SHA256("user@example.com")` → `em: "a1b2c3..."`

**3. Integrate into form submission handlers**
- After a form submission succeeds (e.g., contact form, partner request), call the helper
- Pass the form data (email, name, phone) for user matching
- Generate a unique `event_id` and pass it to both the client-side pixel and the server-side API
- The same `event_id` on both sides lets Meta deduplicate

**4. Test with Meta's Test Events tool**
- Get the test event code from the site owner
- Add `test_event_code` to the API payload during development
- Verify events appear in Events Manager > Test Events
- Remove test code before going to production

**Estimated effort:**
- Site owner: ~30 minutes (generate token, verify events)
- Developer: ~3 hours (build helper, integrate into forms, test)

---

## Combined Setup (Recommended)

The key to combining both approaches is **event deduplication** using a shared `event_id`:

```
User submits form
  ├── Browser: fbq('track', 'Lead', {}, {eventID: 'abc123'})
  └── Server:  POST to Conversions API with event_id: 'abc123'

Meta receives both → deduplicates → counts as 1 event
```

### Work Needed (Both Combined)

| Task | Who | File | Effort |
|------|-----|------|--------|
| Add env vars | Developer | `laqta/.env` | 5 min |
| Create MetaPixel component | Developer | `laqta/components/MetaPixel.tsx` | 20 min |
| Add to root layout | Developer | `laqta/src/app/[locale]/layout.tsx` | 5 min |
| Create Conversions API helper | Developer | `laqta/lib/meta-conversions.ts` | 1 hour |
| Add server-side events to form handlers | Developer | API routes / server actions | 1 hour |
| Test with Meta Events Manager | Developer | — | 30 min |
| Configure client-side events | Site Owner | Meta Event Setup Tool (browser) | 15 min |
| **Total developer work** | | | **~3 hours** |

---

## Prerequisites

1. A **Meta Business Account** with a Facebook Page
2. A **Meta Pixel** created in [Events Manager](https://business.facebook.com/events_manager)
3. For Conversions API: a **system user access token** with `ads_management` permission
4. Domain verification in Meta Business Settings (needed for best data accuracy)
