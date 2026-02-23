# WhatsApp Business — Free Messenger-Based Chat

> **Recommendation Score: 4/5** — Essential for Arabic markets, zero cost, familiar to everyone

## Overview

WhatsApp is the **most popular messaging app** in Arabic-speaking countries and France. Using the free WhatsApp Business App combined with a website click-to-chat widget, visitors can contact your team directly via WhatsApp. No API costs, no monthly fees.

**Key distinction:** This document covers the **free approach** (WhatsApp Business App + website widget), not the paid WhatsApp Business API.

## How It Works

1. Install WhatsApp Business App (free) on admin's phone
2. Set up business profile (name, hours, description, catalog)
3. Add a floating WhatsApp button to your Next.js website
4. Visitors click the button → WhatsApp opens with a pre-filled message
5. Conversation continues in WhatsApp (visitor's app ↔ admin's app)

**Important:** The chat does NOT happen on your website. The button redirects visitors to WhatsApp, where the conversation continues.

## Pricing

| Component | Cost |
|-----------|------|
| WhatsApp Business App | Free |
| wa.me click-to-chat links | Free |
| React widget libraries | Free (open source) |
| Custom floating button | Free (you build it) |
| **Total** | **$0** |

### WhatsApp Business API (NOT required for this approach)
The API is a separate paid product for high-volume businesses. Costs: $0.02-0.14 per message depending on category and country. Service replies (within 24h of customer message) are free. Only needed if you handle 100+ daily conversations or need automated chatbots.

## Next.js Integration

### Option A: Custom Floating Button (Recommended — Zero Dependencies)

```tsx
// laqta/components/chat/WhatsAppButton.tsx
'use client';

import { MessageCircle } from 'lucide-react';

interface WhatsAppButtonProps {
  locale?: string;
}

const PHONE_NUMBER = '212XXXXXXXXX'; // Morocco format example, no + or dashes

const MESSAGES: Record<string, string> = {
  en: 'Hello! I would like to know more about your services.',
  ar: 'مرحباً! أود معرفة المزيد عن خدماتكم.',
  fr: 'Bonjour ! Je voudrais en savoir plus sur vos services.',
};

export default function WhatsAppButton({ locale = 'en' }: WhatsAppButtonProps) {
  const message = encodeURIComponent(MESSAGES[locale] || MESSAGES.en);
  const href = `https://wa.me/${PHONE_NUMBER}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center
                 w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white
                 rounded-full shadow-lg transition-all hover:scale-110
                 rtl:right-auto rtl:left-6"
      aria-label="Chat on WhatsApp"
    >
      {/* WhatsApp icon */}
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  );
}
```

### Option B: react-floating-whatsapp Library

```bash
npm install react-floating-whatsapp
```

```tsx
// laqta/components/chat/WhatsAppWidget.tsx
'use client';

import { FloatingWhatsApp } from 'react-floating-whatsapp';

interface WhatsAppWidgetProps {
  locale?: string;
}

const MESSAGES: Record<string, { greeting: string; placeholder: string; chatMessage: string }> = {
  en: {
    greeting: 'Hello!',
    placeholder: 'Type a message...',
    chatMessage: 'Hi there! How can we help you?',
  },
  ar: {
    greeting: '!مرحباً',
    placeholder: '...اكتب رسالة',
    chatMessage: 'مرحباً! كيف يمكننا مساعدتك؟',
  },
  fr: {
    greeting: 'Bonjour !',
    placeholder: 'Tapez un message...',
    chatMessage: 'Bonjour ! Comment pouvons-nous vous aider ?',
  },
};

export default function WhatsAppWidget({ locale = 'en' }: WhatsAppWidgetProps) {
  const msg = MESSAGES[locale] || MESSAGES.en;

  return (
    <FloatingWhatsApp
      phoneNumber="212XXXXXXXXX"
      accountName="Laqta Creative"
      avatar="/images/laqta-logo.png"
      chatMessage={msg.chatMessage}
      placeholder={msg.placeholder}
      statusMessage={msg.greeting}
      darkMode={false}
      allowClickAway
      allowEsc
    />
  );
}
```

### Step 3: Add to Layout

```tsx
// In laqta/src/app/[locale]/layout.tsx
import WhatsAppButton from '@/components/chat/WhatsAppButton';

export default function LocaleLayout({ children, params }: Props) {
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        {children}
        <WhatsAppButton locale={params.locale} />
      </body>
    </html>
  );
}
```

## WhatsApp Business App Features (All Free)

| Feature | Description |
|---------|-------------|
| **Business Profile** | Name, address, description, email, website, hours |
| **Greeting Message** | Auto-sent to first-time contacts or after 14 days inactivity |
| **Away Message** | Auto-sent outside business hours |
| **Quick Replies** | Pre-written templates triggered by typing "/" |
| **Labels** | Color-coded tags to organize conversations |
| **Catalog** | Showcase up to 500 products/services |
| **Statistics** | Basic message delivery and read stats |
| **Linked Devices** | 1 phone + 4 linked devices (desktop/web) |

## Arabic / RTL Support

| Aspect | Status |
|--------|--------|
| Arabic text | Native — WhatsApp fully supports Arabic |
| RTL rendering | Automatic in WhatsApp app |
| Arabic greeting/away messages | Yes |
| Arabic quick replies | Yes |
| Pre-filled Arabic messages (wa.me) | Yes (URL-encoded) |

WhatsApp has **perfect Arabic/RTL support** — it's one of the most used apps in the Arab world. No configuration needed. The website button just needs RTL positioning (left side instead of right for Arabic layout).

## AI / Chatbot Capabilities

| Feature | Availability |
|---------|-------------|
| Greeting auto-reply | Free (WhatsApp Business App) |
| Away message auto-reply | Free (WhatsApp Business App) |
| Quick replies (manual) | Free |
| AI chatbot | Not available (free app) |
| Automated flows | Not available (requires API) |

The free WhatsApp Business App has basic auto-replies only. Full chatbot capabilities require the paid WhatsApp Business API + a BSP (Business Solution Provider).

## Pros

- **$0 cost** — completely free
- **Everyone has WhatsApp** — especially in Arabic-speaking markets and France
- **Perfect Arabic/RTL** — native support
- **Familiar UX** — visitors already know how to use WhatsApp
- **Push notifications** — messages are seen (98% open rate)
- **Conversations persist** — visitors can return anytime
- **Mobile-first** — great for mobile users
- **Basic auto-replies** — greeting and away messages
- **No setup on Strapi** — purely frontend integration
- **30 minutes setup** — from zero to live

## Cons

- **Chat happens outside your website** — redirects to WhatsApp
- **Visitor must have WhatsApp installed** — not universal for all markets
- **No chat on desktop without WhatsApp Web** — some friction
- **No visitor tracking** — you can't see what page they were on
- **Limited to 5 devices** — not scalable for large teams
- **No team inbox** — only one person sees messages (unless using groups)
- **No analytics** on your website
- **No proactive chat** — can't initiate conversations with visitors
- **No chat history on your server** — conversations live on WhatsApp
- **No branding customization** of the chat experience

## Setup Effort

| Task | Time |
|------|------|
| Install WhatsApp Business App | 5 minutes |
| Set up business profile | 10 minutes |
| Configure greeting/away messages | 5 minutes |
| Create quick replies (3 languages) | 10 minutes |
| Add floating button to Next.js | 15 minutes |
| **Total** | **~45 minutes** |

## GDPR Considerations

- WhatsApp is owned by Meta — data processed on Meta servers
- WhatsApp provides end-to-end encryption
- Business accounts are subject to WhatsApp's business terms
- You cannot control where data is stored
- Consider adding a privacy notice when redirecting to WhatsApp

## Best For

WhatsApp is **essential** for reaching Arabic-speaking audiences where WhatsApp dominance is 80-90%+. It works perfectly as a **complement** to a website-based live chat (like Tawk.to). Use WhatsApp as a secondary channel — a floating button alongside the main chat widget.

## Recommended Hybrid Approach

Use WhatsApp **alongside** a website chat (Tawk.to or Chatwoot), not as a replacement:

```
Website visitor → Sees both:
  1. Live chat widget (Tawk.to) — for on-site chat
  2. WhatsApp button — for messenger-based chat
  → Visitor chooses preferred method
```

## Links

- WhatsApp Business App: https://business.whatsapp.com
- wa.me documentation: https://faq.whatsapp.com/5913398998672934
- react-floating-whatsapp: https://www.npmjs.com/package/react-floating-whatsapp
- react-whatsapp-widget: https://www.npmjs.com/package/react-whatsapp-widget
