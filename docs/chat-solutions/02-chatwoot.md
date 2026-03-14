# Chatwoot — Free Open-Source Live Chat (Self-Hosted)

> **Recommendation Score: 4/5** — Best for full data ownership and omnichannel support

## Overview

Chatwoot is an **open-source customer engagement platform** that can be self-hosted for free. It provides live chat, email, social media, and messaging app support all in one unified inbox. It's the most feature-rich free option if you're willing to manage your own server.

**Website:** https://www.chatwoot.com
**GitHub:** https://github.com/chatwoot/chatwoot (20k+ stars)

## How It Works

1. Deploy Chatwoot on your server (Docker recommended)
2. Create an inbox and generate a website widget token
3. Add the JavaScript SDK to your Next.js layout
4. Chat widget appears on your website
5. All conversations managed in Chatwoot's admin dashboard
6. Optionally connect WhatsApp, Telegram, email, and social media channels

## Pricing

| Plan | Cost | Features |
|------|------|----------|
| **Self-Hosted (Community)** | Free | All core features, unlimited agents, no support |
| **Self-Hosted (Enterprise)** | $19/agent/month | Premium features + official support |
| **Cloud (Starter)** | Free | Limited agents and conversations |
| **Cloud (Business)** | $19/agent/month | Full features, managed infrastructure |

**Hidden costs for self-hosting:**
- VPS: ~$5-20/month (DigitalOcean, Hetzner, etc.)
- Domain + SSL: ~$10/year
- Maintenance time: ~2 hours/month

## Next.js Integration

### Step 1: Deploy Chatwoot (Docker)

```bash
# On your server (Linux VPS)
wget https://get.chatwoot.app/linux/install.sh
chmod 755 install.sh
./install.sh --install

# Or with Docker Compose
git clone https://github.com/chatwoot/chatwoot.git
cd chatwoot
cp .env.example .env
# Edit .env with your database and Redis credentials
docker compose up -d
```

### Step 2: Configure Chatwoot
1. Access admin panel at `https://your-chatwoot-domain.com`
2. Create an account and an inbox (Website channel)
3. Copy the `websiteToken` from Inbox settings

### Step 3: Create Widget Component

```tsx
// laqta/components/chat/ChatwootWidget.tsx
'use client';

import { useEffect } from 'react';
import Script from 'next/script';

interface ChatwootWidgetProps {
  locale?: string;
}

export default function ChatwootWidget({ locale = 'en' }: ChatwootWidgetProps) {
  const BASE_URL = 'https://your-chatwoot-instance.com';
  const WEBSITE_TOKEN = 'YOUR_WEBSITE_TOKEN';

  useEffect(() => {
    // Set locale when Chatwoot loads
    window.addEventListener('chatwoot:ready', () => {
      window.$chatwoot?.setLocale(locale);
    });
  }, [locale]);

  return (
    <Script
      id="chatwoot-sdk"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
          (function(d,t) {
            var BASE_URL="${BASE_URL}";
            var g=d.createElement(t),s=d.getElementsByTagName(t)[0];
            g.src=BASE_URL+"/packs/js/sdk.js";
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g,s);
            g.onload=function(){
              window.chatwootSDK.run({
                websiteToken: '${WEBSITE_TOKEN}',
                baseUrl: BASE_URL,
                locale: '${locale}'
              })
            }
          })(document,"script");
        `,
      }}
    />
  );
}
```

### Step 4: Add to Layout

```tsx
// In laqta/src/app/[locale]/layout.tsx
import ChatwootWidget from '@/components/chat/ChatwootWidget';

export default function LocaleLayout({ children, params }: Props) {
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        {children}
        <ChatwootWidget locale={params.locale} />
      </body>
    </html>
  );
}
```

### Step 5: Nginx WebSocket Config

```nginx
# Add to your Nginx config for the Chatwoot domain
location /cable {
    proxy_pass http://localhost:3000/cable;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
}
```

## Arabic / RTL Support

| Aspect | Status |
|--------|--------|
| Arabic widget UI | Natively supported |
| RTL layout | Official since v2.15.0 |
| Arabic admin dashboard | Supported (30+ languages) |
| RTL Help Center | Supported |
| Auto text direction | Yes |

Chatwoot has the **best RTL support** among all solutions. Since v2.15.0, the entire UI (widget + admin + help center) automatically adjusts for RTL languages. Arabic is one of 30+ supported languages.

## AI / Chatbot Capabilities

| Feature | Availability |
|---------|-------------|
| Captain AI (auto-reply, summarize, suggest) | Paid plans only |
| Automation rules (route, assign, label) | Free (self-hosted) |
| Canned responses | Free |
| Custom chatbot via API | Free (build your own) |
| Knowledge base | Free |

On the free self-hosted plan, you get automation rules and canned responses. AI-powered features (Captain) require paid plans, but you can build custom chatbot logic via Chatwoot's REST API.

## Features Included (Free Self-Hosted)

- **Omnichannel inbox:** Live chat, email, WhatsApp, Telegram, Facebook, Instagram, Twitter, SMS, LINE
- Unlimited agents
- Real-time chat on website
- Canned responses
- Automation rules (event-based actions)
- Labels and tags for conversations
- Team collaboration (private notes, mentions)
- CSAT surveys
- Pre-chat forms
- File sharing
- Conversation continuity via email
- Contact management
- Reporting (7 report types)
- Knowledge base / help center
- Custom attributes
- Webhooks and API
- Mobile apps (iOS, Android)
- No branding on widget

## Omnichannel: WhatsApp + Telegram Integration

A major advantage of Chatwoot is native integration with messaging apps:

**Telegram:**
- Connect a Telegram bot to Chatwoot
- All Telegram messages appear in the unified inbox
- Reply from Chatwoot dashboard — message goes to Telegram

**WhatsApp:**
- Connect via Twilio, 360dialog, or WhatsApp Cloud API
- Requires WhatsApp Business API access (not free)
- All WhatsApp messages in unified inbox

This means you could offer **live chat + Telegram + WhatsApp** all managed from one dashboard.

## Pros

- **Open source and free** to self-host
- **Best RTL/Arabic support** of all solutions (v2.15.0+)
- **Omnichannel** — chat, email, WhatsApp, Telegram, social media in one inbox
- **No branding** on the widget
- **Full data ownership** — everything on your server
- **Native Telegram integration** — free
- **REST API** for custom integrations with Strapi
- **Knowledge base** included
- **Automation rules** for routing and labeling
- **PostgreSQL** backend (same as your Strapi dev setup)

## Cons

- **DevOps required** — Ruby on Rails app needs Redis, PostgreSQL, Sidekiq
- **Server costs** — need a VPS ($5-20/month)
- **Maintenance burden** — updates, backups, monitoring
- **Mobile app stability** — users report issues
- **AI features** locked behind paid plans
- **Initial setup** takes 2-4 hours
- **Resource hungry** — recommended 4GB+ RAM for smooth operation

## Setup Effort

| Task | Time |
|------|------|
| Provision VPS and install Docker | 30 minutes |
| Deploy Chatwoot with Docker Compose | 30 minutes |
| Configure domain, SSL, Nginx | 30 minutes |
| Create inbox and configure widget | 15 minutes |
| Add widget to Next.js | 10 minutes |
| Configure canned responses (3 languages) | 30 minutes |
| Connect Telegram bot (optional) | 30 minutes |
| **Total** | **~3-4 hours** |

## Infrastructure Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| RAM | 2 GB | 4 GB |
| CPU | 1 vCPU | 2 vCPU |
| Disk | 20 GB | 40 GB |
| OS | Ubuntu 20.04+ | Ubuntu 22.04 |
| Database | PostgreSQL 12+ | PostgreSQL 15 |
| Cache | Redis 6+ | Redis 7 |

## GDPR Compliance

- SOC 2 compliant
- Encryption at rest and in transit
- Audit logs
- Role-based access control
- **Full data sovereignty** (self-hosted — data never leaves your server)
- GDPR Data Processing Agreement available

## Best For

Chatwoot is the best choice if you want **full data ownership**, **omnichannel support** (chat + Telegram + WhatsApp in one inbox), and the **best Arabic/RTL experience**. Ideal if you have basic DevOps skills and don't mind managing a server.

## Links

- Website: https://www.chatwoot.com
- GitHub: https://github.com/chatwoot/chatwoot
- Documentation: https://www.chatwoot.com/docs
- Self-hosting guide: https://www.chatwoot.com/docs/self-hosted
- Next.js integration: https://www.chatwoot.com/hc/user-guide/articles/1677676986
- RTL announcement: https://www.chatwoot.com/blog/v2-15-0-heatmap-rtl-more/
