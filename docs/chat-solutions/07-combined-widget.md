# Combined Multi-Messenger Widget — Chaty / GetButton

> **Recommendation Score: 3/5** — Convenient multi-channel button but limited free tiers

## Overview

Combined widget services provide a single floating button that expands to show multiple messaging channels (WhatsApp, Telegram, Facebook Messenger, email, phone, etc.). Visitors choose their preferred method to contact you. These don't provide live chat on your website — they redirect to the chosen platform.

**Top options:** Chaty, GetButton, Elfsight, Boei

## How It Works

1. Sign up for a combined widget service
2. Configure which channels to show (WhatsApp, Telegram, email, etc.)
3. Add a script/component to your Next.js layout
4. A floating button appears on your website
5. Clicking it expands to show all configured channels
6. Visitor picks a channel → redirected to that platform

## Pricing Comparison

### Chaty (https://chaty.app)

| Plan | Cost | Key Limits |
|------|------|-----------|
| **Free** | $0/month | 1 widget, 500 visits/month, Chaty branding |
| **Basic** | $9/month | 10,000 visits/month, no branding |
| **Pro** | $15/month | 50,000 visits/month, analytics, targeting |
| **Growth** | $29/month | 150,000 visits/month, priority support |

### GetButton (https://getbutton.io)

| Plan | Cost | Key Features |
|------|------|-------------|
| **Free** | $0/month | Basic widget, branding |
| **Standard** | ~$4/month | No branding, ChatGPT bot included |

### Elfsight (https://elfsight.com)

| Plan | Cost | Key Features |
|------|------|-------------|
| **Free** | $0/month | 1 widget, Elfsight branding |
| **Basic** | $5/month | Remove branding |

### Boei (https://boei.help)

| Plan | Cost | Key Features |
|------|------|-------------|
| **Free** | Limited | Basic widget |
| **Starter** | $7/month | 25+ channels, page rules |

## Supported Channels

Most combined widgets support 20-25+ channels:

| Channel | Chaty | GetButton | Elfsight |
|---------|-------|-----------|----------|
| WhatsApp | Yes | Yes | Yes |
| Telegram | Yes | Yes | Yes |
| Facebook Messenger | Yes | Yes | Yes |
| Instagram | Yes | Yes | Yes |
| Email | Yes | Yes | Yes |
| Phone | Yes | Yes | Yes |
| SMS | Yes | Yes | Yes |
| Viber | Yes | Yes | Yes |
| LINE | Yes | Yes | No |
| WeChat | Yes | No | No |
| TikTok | Yes | No | No |
| Snapchat | Yes | No | No |
| Custom URL | Yes | Yes | Yes |

## Next.js Integration

### Option A: Chaty

```tsx
// laqta/components/chat/ChatyWidget.tsx
'use client';

import Script from 'next/script';

export default function ChatyWidget() {
  return (
    <Script
      src="https://cdn.chaty.app/widget/YOUR_WIDGET_ID.js"
      strategy="lazyOnload"
      id="chaty-widget"
    />
  );
}
```

### Option B: GetButton

```tsx
// laqta/components/chat/GetButtonWidget.tsx
'use client';

import Script from 'next/script';

export default function GetButtonWidget() {
  return (
    <Script
      id="getbutton-widget"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function () {
            var options = {
              whatsapp: "212XXXXXXXXX",
              telegram: "laqta_support_bot",
              call_to_action: "Contact us",
              button_color: "#7F56D9",
              position: "right",
              pre_filled_message: "Hello! I need help with...",
            };
            var proto = document.location.protocol,
              host = "getbutton.io",
              url = proto + "//static." + host;
            var s = document.createElement("script");
            s.type = "text/javascript";
            s.async = true;
            s.src = url + "/widget-send-button/js/init.js";
            s.dataset.options = JSON.stringify(options);
            document.head.appendChild(s);
          })();
        `,
      }}
    />
  );
}
```

### Option C: Custom DIY Multi-Channel Button (FREE, no dependencies)

```tsx
// laqta/components/chat/MultiChannelButton.tsx
'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

interface MultiChannelButtonProps {
  locale?: string;
}

const PHONE = '212XXXXXXXXX';
const TELEGRAM_BOT = 'laqta_support_bot';

export default function MultiChannelButton({ locale = 'en' }: MultiChannelButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const waMessage = encodeURIComponent(
    locale === 'ar' ? 'مرحباً! أود معرفة المزيد عن خدماتكم.'
    : locale === 'fr' ? 'Bonjour ! Je voudrais en savoir plus.'
    : 'Hello! I would like to know more about your services.'
  );

  const channels = [
    {
      name: 'WhatsApp',
      href: `https://wa.me/${PHONE}?text=${waMessage}`,
      color: 'bg-[#25D366]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      name: 'Telegram',
      href: `https://t.me/${TELEGRAM_BOT}`,
      color: 'bg-[#0088CC]',
      icon: (
        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3
                    rtl:right-auto rtl:left-6 rtl:items-start">
      {/* Channel buttons (visible when open) */}
      {isOpen && (
        <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2">
          {channels.map((channel) => (
            <a
              key={channel.name}
              href={channel.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-4 py-2 rounded-full
                         ${channel.color} text-white shadow-lg
                         hover:scale-105 transition-transform`}
            >
              {channel.icon}
              <span className="text-sm font-medium">{channel.name}</span>
            </a>
          ))}
        </div>
      )}

      {/* Main toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-14 h-14 bg-primary
                   hover:bg-primary/90 text-white rounded-full shadow-lg
                   transition-all hover:scale-110"
        aria-label="Contact us"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
```

## Arabic / RTL Support

| Aspect | Status |
|--------|--------|
| Widget position mirroring | Depends on service (DIY: full control) |
| Arabic channel labels | Configurable in most services |
| RTL text in messages | Handled by target platform (WhatsApp, Telegram, etc.) |

The combined widget itself is just buttons — RTL support depends on the underlying messaging platforms. The DIY approach gives full RTL control.

## AI / Chatbot Capabilities

| Feature | Availability |
|---------|-------------|
| GetButton ChatGPT bot | ~$4/month (Standard plan) |
| Chaty chatbot | Not included |
| AI on target platforms | Depends on platform (Telegram bots: free) |

Combined widgets are redirectors — they don't provide chat themselves. AI capabilities depend on the target platform.

## Pros

- **Multiple channels in one button** — WhatsApp, Telegram, email, phone, etc.
- **Visitors choose preferred channel** — better conversion
- **Very easy setup** — script injection, 15 minutes
- **Familiar messaging apps** — visitors use apps they trust
- **DIY option is 100% free** — no dependencies needed
- **Persistent conversations** — messages live in the messaging app

## Cons

- **No actual chat on website** — redirects to external apps
- **Visitors need apps installed** — WhatsApp requires WhatsApp, etc.
- **Free plans are limited** — branding, visit caps (Chaty: 500/month)
- **No visitor tracking** on your website
- **No analytics** (unless paid plan)
- **No proactive chat** — can't initiate with visitors
- **External scripts add page weight** (except DIY)
- **You don't own the chat data** — lives on each platform

## Setup Effort

| Task | Time |
|------|------|
| Sign up for service OR build DIY | 10-30 minutes |
| Configure channels | 10 minutes |
| Add to Next.js | 5 minutes |
| **Total** | **~15-45 minutes** |

## Best For

A combined widget is ideal as a **secondary layer** — give visitors a choice of messaging apps. The **DIY approach** (Option C above) is recommended since it's 100% free, fully customizable, RTL-ready, and doesn't depend on third-party scripts.

Pair it with a website-based live chat (Tawk.to) for the complete experience.

## Links

- Chaty: https://chaty.app
- GetButton: https://getbutton.io
- Elfsight: https://elfsight.com/whatsapp-chat-widget/
- Boei: https://boei.help
