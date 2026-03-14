# Crisp — Freemium SaaS Live Chat

> **Recommendation Score: 3/5** — Good features but free plan is very limited

## Overview

Crisp is a **cloud-based customer messaging platform** with live chat, chatbot, knowledge base, and CRM features. It offers a free tier with 2 seats (agents) and unlimited conversations. Known for its clean UI and built-in real-time translation feature.

**Website:** https://crisp.chat

## How It Works

1. Create a free Crisp account
2. Add a JavaScript snippet to your Next.js layout
3. Chat widget appears on your site — visitors can chat in real time
4. Admins manage conversations via Crisp dashboard or mobile app
5. Optional: configure chatbot flows and knowledge base

## Pricing

| Plan | Cost | Key Features |
|------|------|-------------|
| **Free** | $0 | 2 seats, live chat, mobile apps, 30-day conversation history |
| **Mini** | €45/month/workspace | Unlimited history, 4 seats, Crisp branding removed |
| **Essentials** | €95/month/workspace | Chatbot, campaigns, audio/video, 20 seats |
| **Plus** | €295/month/workspace | AI, analytics, dedicated support, 50 seats |

**Per-workspace pricing** (not per-agent) — good value if you have multiple agents.

**Startup Program:** 30% lifetime discount for startups under $1M funding and <3 years old.

## Next.js Integration

### Step 1: Create Account
1. Sign up at https://app.crisp.chat/initiate/signup
2. Go to Settings → Website Settings → Setup Instructions
3. Copy your Website ID

### Step 2: Create Widget Component

```tsx
// laqta/components/chat/CrispWidget.tsx
'use client';

import { useEffect } from 'react';

interface CrispWidgetProps {
  locale?: string;
}

export default function CrispWidget({ locale = 'en' }: CrispWidgetProps) {
  useEffect(() => {
    // @ts-ignore
    window.$crisp = [];
    // @ts-ignore
    window.CRISP_WEBSITE_ID = 'YOUR_WEBSITE_ID';

    // Set locale
    // @ts-ignore
    window.$crisp.push(['set', 'session:segments', [[`lang:${locale}`]]]);

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Cleanup on unmount
      const crispScript = document.querySelector('script[src="https://client.crisp.chat/l.js"]');
      if (crispScript) crispScript.remove();
    };
  }, [locale]);

  return null;
}
```

### Step 3: Add to Layout

```tsx
// In laqta/src/app/[locale]/layout.tsx
import CrispWidget from '@/components/chat/CrispWidget';

export default function LocaleLayout({ children, params }: Props) {
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        {children}
        <CrispWidget locale={params.locale} />
      </body>
    </html>
  );
}
```

## Arabic / RTL Support

| Aspect | Status |
|--------|--------|
| Arabic text in chat | Supported (60+ languages) |
| RTL widget layout | Not clearly documented |
| Auto language detection | Yes (browser-based) |
| Real-time translation | Available (paid plans) |

Crisp supports Arabic text and auto-detects the visitor's browser language. However, **explicit RTL widget layout support is not well documented**. The widget may not properly mirror for Arabic users. Real-time translation (agent sees Arabic, can reply in English, message translated to Arabic) is available on paid plans.

## AI / Chatbot Capabilities

| Feature | Availability |
|---------|-------------|
| Visual chatbot builder (Flows) | Essentials plan (€95/mo) |
| AI-powered responses | Plus plan (€295/mo) |
| Knowledge base integration | Mini plan (€45/mo) |
| Canned responses | Free |
| Triggers (auto-open chat) | Free |
| Real-time translation | Essentials plan (€95/mo) |

The free plan only includes canned responses and basic triggers. Chatbot flows and AI features require paid plans.

## Features by Plan

### Free Plan
- 2 seats (agents)
- Live chat widget
- Mobile apps (iOS, Android)
- 30-day conversation history
- Canned responses
- Basic triggers
- Contact form

### Mini Plan (€45/mo)
- Everything in Free +
- Unlimited conversation history
- 4 seats
- Remove Crisp branding
- Knowledge base
- Audio messages
- Saved replies

### Essentials Plan (€95/mo)
- Everything in Mini +
- 20 seats
- Chatbot with visual builder
- Audio/video calls
- Campaigns
- Real-time translation
- Automation rules

## Pros

- **Clean, modern UI** — one of the best-looking chat widgets
- **Real-time translation** — agent and visitor can chat in different languages
- **Visual chatbot builder** — no-code drag-and-drop (paid)
- **GDPR compliant** — EU-hosted infrastructure (Amsterdam, Frankfurt)
- **Per-workspace pricing** — good value for teams
- **Startup program** — 30% lifetime discount for qualifying startups
- **Fast setup** — under 10 minutes

## Cons

- **Free plan very limited** — only 2 seats, 30-day history
- **RTL widget support unclear** — not well documented for Arabic layout
- **Paid plans get expensive** — €295/mo for AI features
- **No self-hosting option** — data on Crisp's servers
- **Chatbot requires €95/mo** plan
- **Crisp branding on free plan**

## Setup Effort

| Task | Time |
|------|------|
| Create account | 2 minutes |
| Add widget to Next.js | 5 minutes |
| Configure appearance and greetings | 10 minutes |
| Set up canned responses (3 languages) | 20 minutes |
| **Total** | **~40 minutes** |

## GDPR Compliance

- Infrastructure hosted in **Amsterdam and Frankfurt (EU)**
- No data transferred outside EU
- No data sharing or resale
- Data Processing Agreement (DPA) available
- Code reviewed by DPOs before deployment
- GDPR consent forms configurable

## Best For

Crisp is best if you have a **small team (2 agents)** and want a clean, professional widget with EU data hosting. The real-time translation feature is unique and valuable for multilingual sites. However, the limited free plan and unclear RTL support make it less ideal than Tawk.to for the Laqta use case.

## Links

- Website: https://crisp.chat
- Documentation: https://docs.crisp.chat
- Pricing: https://crisp.chat/en/pricing
- Next.js guide: https://help.crisp.chat/en/article/how-do-i-install-crisp-live-chat-on-nextjs-xh9yse/
- GDPR: https://help.crisp.chat/en/article/whats-crisp-eu-gdpr-compliance-status-nhv54c/
