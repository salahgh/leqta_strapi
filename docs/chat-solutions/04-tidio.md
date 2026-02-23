# Tidio — Freemium SaaS Live Chat + AI

> **Recommendation Score: 2.5/5** — Strong AI but complex pricing and limited free tier

## Overview

Tidio is a **customer service platform** combining live chat, AI chatbot (Lyro), and automation flows. It's known for its drag-and-drop chatbot builder and AI capabilities. The free plan is limited, and pricing becomes complex with add-ons.

**Website:** https://www.tidio.com

## How It Works

1. Create a Tidio account (free tier available)
2. Add a JavaScript snippet to your Next.js layout
3. Chat widget appears on your website
4. Admins respond via Tidio dashboard or mobile app
5. Optional: Configure Lyro AI to auto-respond to common questions

## Pricing

| Plan | Cost | Key Features |
|------|------|-------------|
| **Free** | $0 | 50 live chat conversations/month, basic chatbot |
| **Starter** | $29/month | 100 conversations/month, live typing preview |
| **Growth** | $59-349/month | Conversation-based billing, analytics, permissions |
| **Plus** | $749/month | Custom limits, multisite, API access |
| **Premium** | From $2,999/month | Dedicated support, custom SLA |

**Add-ons (separate costs):**
| Add-on | Cost |
|--------|------|
| Lyro AI Agent | From $39/month (100 AI conversations) |
| Flows (automation) | $29/month |
| Extra seats | Varies by plan |

**Warning:** Pricing is complex. The combination of conversation-based billing and separate add-ons can quickly double or triple the effective cost.

## Next.js Integration

### Step 1: Create Account
1. Sign up at https://www.tidio.com
2. Go to Settings → Installation → JavaScript code
3. Copy your unique code snippet

### Step 2: Create Widget Component

```tsx
// laqta/components/chat/TidioWidget.tsx
'use client';

import Script from 'next/script';

export default function TidioWidget() {
  return (
    <Script
      id="tidio-chat"
      src="//code.tidio.co/YOUR_PUBLIC_KEY.js"
      strategy="lazyOnload"
    />
  );
}
```

### Step 3: Add to Layout

```tsx
// In laqta/src/app/[locale]/layout.tsx
import TidioWidget from '@/components/chat/TidioWidget';

export default function LocaleLayout({ children, params }: Props) {
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        {children}
        <TidioWidget />
      </body>
    </html>
  );
}
```

## Arabic / RTL Support

| Aspect | Status |
|--------|--------|
| Arabic text in chat | Supported |
| RTL widget layout | Not clearly confirmed |
| Lyro AI Arabic support | Supports 48 languages (Arabic included) |
| Auto language detection | Yes |

Tidio's Lyro AI supports Arabic among 48 languages with automatic detection. However, **dedicated RTL widget rendering is not explicitly documented**. Arabic text is supported but the widget layout may not properly mirror.

## AI / Chatbot Capabilities

| Feature | Availability |
|---------|-------------|
| Lyro AI Agent (learns from FAQs) | $39/month add-on |
| FAQ Wizard (auto-generate responses) | Paid plans |
| Drag-and-drop Flows builder | $29/month add-on |
| Canned responses | Free |
| Pre-chat survey | Free |
| Auto language detection | Free |

Tidio's AI (Lyro) is one of its strongest features — it learns from your FAQ/knowledge base and can handle up to 70% of customer queries without human intervention. But it's a paid add-on.

## Features by Plan

### Free Plan
- 50 live chat conversations/month
- 100 chatbot triggers/month
- Basic live chat widget
- Email integration
- Mobile apps (iOS, Android)
- Visitor info
- Canned responses

### Starter Plan ($29/mo)
- 100 conversations/month
- Live typing preview
- Visitor list
- Operating hours
- Chat ratings

### Growth Plan ($59-349/mo)
- Custom conversation limits
- Advanced analytics
- Permissions
- Departments
- Unbranded widget (at higher tiers)

## Pros

- **Strong AI capabilities** — Lyro can handle 70% of queries automatically
- **Visual flow builder** — drag-and-drop chatbot automation
- **48 language support** for AI (including Arabic)
- **Good for automating** repetitive FAQ-type questions
- **4.7/5 on G2** — highly rated
- **Easy setup** — 10 minutes

## Cons

- **Very limited free plan** — only 50 conversations/month
- **Complex pricing** — add-ons (AI: $39/mo, Flows: $29/mo) add up fast
- **RTL widget support unclear**
- **Mobile app performance issues** reported by users
- **No self-hosting option**
- **Conversation-based billing** can be unpredictable
- **Branding on free/low plans**
- **Gets extremely expensive** at scale (Plus: $749/mo, Premium: $2,999/mo)

## Setup Effort

| Task | Time |
|------|------|
| Create account | 2 minutes |
| Add widget to Next.js | 5 minutes |
| Configure appearance | 5 minutes |
| Set up basic chatbot flow | 30 minutes |
| Configure Lyro AI (if purchased) | 1 hour |
| **Total** | **~45 minutes (basic) / 2 hours (with AI)** |

## GDPR Compliance

- Pre-chat GDPR consent forms available
- EU-based data processing
- Data Processing Agreement available
- Cookie consent integration

## Best For

Tidio is best if **AI-powered automation is your top priority** and you're willing to pay for it. The 50 conversations/month free limit is too restrictive for most real use. Not recommended for Laqta's use case given the budget constraint of $0.

## Links

- Website: https://www.tidio.com
- Documentation: https://www.tidio.com/help
- Pricing: https://www.tidio.com/pricing
- Lyro AI: https://www.tidio.com/lyro
- Next.js guide: https://medium.com/@victor.okolo/how-to-integrate-tidio-live-chat-in-a-next-js-app-app-router-dffdb5104282
