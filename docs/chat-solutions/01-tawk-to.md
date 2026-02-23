# Tawk.to — Free SaaS Live Chat

> **Recommendation Score: 4.5/5** — Best free SaaS option for quick deployment

## Overview

Tawk.to is a **100% free** live chat platform with no limits on agents, chat volume, or websites. It provides a professional chat widget that embeds directly on your website, allowing visitors to chat with administrators in real time. Revenue comes from optional paid add-ons and a hired-agent service.

**Website:** https://www.tawk.to

## How It Works

1. Create a free Tawk.to account
2. Add a JavaScript snippet to your Next.js layout
3. Widget appears on your website — visitors type messages
4. Admins receive messages in real time via Tawk.to dashboard, desktop app, or mobile app
5. Full conversation history stored on Tawk.to servers

## Pricing

| Feature | Cost |
|---------|------|
| **Core platform** | Free forever |
| **Agents** | Unlimited (free) |
| **Chat volume** | Unlimited (free) |
| **Websites** | Unlimited (free) |
| **Chat history** | Unlimited (free) |
| Remove branding | $19/month |
| AI Assist | $29/month |
| Video + Voice + Screen Share | $29/month |
| Hired agents (Tawk.to staff answer for you) | $1/hour |

**Bottom line:** The core product is completely free. You only pay if you want to remove the "Powered by tawk.to" badge or add AI capabilities.

## Next.js Integration

### Step 1: Create Account
1. Go to https://www.tawk.to and sign up
2. Create a "Property" for your Laqta website
3. Copy the embed code (contains your Property ID and Widget ID)

### Step 2: Create Widget Component

```tsx
// laqta/components/chat/TawkToWidget.tsx
'use client';

import Script from 'next/script';

interface TawkToWidgetProps {
  locale?: string;
}

export default function TawkToWidget({ locale = 'en' }: TawkToWidgetProps) {
  // You can create separate Tawk.to widgets per language
  // or use a single widget with auto language detection
  const propertyId = 'YOUR_PROPERTY_ID';
  const widgetId = 'YOUR_WIDGET_ID';

  return (
    <Script
      id="tawk-to"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          var Tawk_API = Tawk_API || {};
          var Tawk_LoadStart = new Date();

          // Set language based on locale
          Tawk_API.onLoad = function(){
            Tawk_API.setAttributes({
              'language': '${locale}'
            }, function(error){});
          };

          (function(){
            var s1 = document.createElement("script");
            var s0 = document.getElementsByTagName("script")[0];
            s1.async = true;
            s1.src = 'https://embed.tawk.to/${propertyId}/${widgetId}';
            s1.charset = 'UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1, s0);
          })();
        `,
      }}
    />
  );
}
```

### Step 3: Add to Layout

```tsx
// In laqta/src/app/[locale]/layout.tsx
import TawkToWidget from '@/components/chat/TawkToWidget';

export default function LocaleLayout({ children, params }: Props) {
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        {children}
        <TawkToWidget locale={params.locale} />
      </body>
    </html>
  );
}
```

### Step 4: Multi-Language Setup (Optional)

**Option A — Single widget with auto-detection:**
Tawk.to auto-detects the visitor's browser language. No extra config needed.

**Option B — Separate widgets per language:**
Create 3 properties in Tawk.to dashboard (English, Arabic, French), each with localized canned responses. Switch `widgetId` based on `locale`.

## Arabic / RTL Support

| Aspect | Status |
|--------|--------|
| Arabic language in widget | Supported |
| RTL text rendering | Supported |
| Arabic admin dashboard | Supported |
| Auto language detection | Yes (browser-based) |
| Arabic canned responses | Yes (manual setup) |

Tawk.to has supported Arabic since 2015. The widget UI adjusts for Arabic text, and you can configure Arabic greetings and canned responses in the dashboard.

## AI / Chatbot Capabilities

| Feature | Availability |
|---------|-------------|
| AI Assist (auto-reply from knowledge base) | $29/month add-on |
| Canned responses (manual quick replies) | Free |
| Triggers (auto-open chat based on conditions) | Free |
| Pre-chat form | Free |
| Chatbot flows | Not available |

The free tier includes **triggers** (e.g., auto-open chat after 30 seconds on page) and **canned responses** for quick replies. Full AI-powered auto-responses require the $29/month add-on.

## Features Included (Free)

- Unlimited agents and chats
- Real-time visitor monitoring (see who's on your site)
- Proactive chat triggers
- Canned responses (quick reply templates)
- File sharing in conversations
- Pre-chat and post-chat forms
- Offline messaging (visitors leave messages when you're away)
- Ticketing system
- Knowledge base builder
- Chat history (unlimited)
- Desktop apps (Windows, macOS)
- Mobile apps (iOS, Android)
- Visitor info (IP, location, browser, current page)
- Agent-to-agent chat
- Department routing
- Chat transfer between agents
- Banned visitors management
- Basic analytics and reporting

## Pros

- **Truly free** with no catches — unlimited everything
- **Easiest setup** — 10 minutes from signup to live widget
- **Professional widget** with real-time chat on your website
- **Arabic/RTL supported** out of the box
- **Mobile apps** for admins to respond on the go
- **Visitor monitoring** — see what page visitors are on
- **Offline messaging** with email notifications
- **Ticketing system** included
- **Knowledge base** builder included free

## Cons

- **"Powered by tawk.to" branding** on the free plan ($19/mo to remove)
- **Limited widget customization** beyond basic colors
- **Reports of notification delays** on mobile app
- **No self-hosting** — data lives on Tawk.to's servers
- **Basic analytics** compared to paid competitors
- **AI requires $29/month** add-on
- **No chatbot flow builder** (only canned responses and triggers)

## Setup Effort

| Task | Time |
|------|------|
| Create account and configure | 5 minutes |
| Add widget to Next.js | 5 minutes |
| Configure canned responses (3 languages) | 30 minutes |
| Set up triggers and department routing | 30 minutes |
| **Total** | **~1 hour** |

## GDPR Compliance

- GDPR consent forms available (EU-only or global toggle)
- Option to disable IP recording
- Data export and contact deletion tools
- Data Processing Agreement (DPA) available on request
- Encryption in transit

## Best For

Tawk.to is the best choice if you want a **professional live chat on your website for $0** with minimal setup effort. Ideal for getting started quickly while evaluating whether you need more advanced solutions later.

## Links

- Website: https://www.tawk.to
- Documentation: https://help.tawk.to
- Pricing: https://www.tawk.to/pricing
- Mobile Apps: https://www.tawk.to/mobile-apps
