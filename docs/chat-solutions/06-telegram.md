# Telegram Bot + Website Widget — Free Messenger-Based Chat

> **Recommendation Score: 3.5/5** — Fully free with bot API, great for tech-savvy audiences

## Overview

Telegram offers a **100% free Bot API** with no message limits, no per-message fees, and no conversation caps. Combined with the open-source Intergram widget, you can embed a Telegram-backed chat directly on your website — visitors chat on your site without needing a Telegram account, and admins respond from the Telegram app.

**Key advantage over WhatsApp:** Visitors do NOT need Telegram installed. The chat widget works directly on your website.

## How It Works

### Approach A: Intergram Widget (Recommended)
1. Create a Telegram bot via @BotFather
2. Set up Intergram (connects bot to a website widget)
3. Add widget script to your Next.js layout
4. Visitors type messages in the widget on your site
5. Messages forwarded to your Telegram group/chat
6. Admins reply from Telegram app → response appears on the website widget

### Approach B: Click-to-Telegram Button
1. Create a Telegram bot or use your admin's username
2. Add a floating button linking to `t.me/YourBot` or `t.me/YourUsername`
3. Visitors click → Telegram opens → conversation starts
4. Similar to WhatsApp approach but for Telegram users

## Pricing

| Component | Cost |
|-----------|------|
| Telegram Bot API | Free (unlimited messages) |
| Intergram widget | Free (open source) |
| Self-hosting Intergram | Free (optional, runs on your server) |
| Telegram app for admins | Free |
| **Total** | **$0** |

There are genuinely **no costs** — Telegram's Bot API is free forever with no usage limits.

## Next.js Integration

### Option A: Intergram Widget (Chat on Website)

#### Step 1: Create Telegram Bot
1. Open Telegram, search for `@BotFather`
2. Send `/newbot`
3. Choose a name (e.g., "Laqta Support Bot")
4. Choose a username (e.g., `laqta_support_bot`)
5. Save the API token

#### Step 2: Get Intergram Chat ID
1. Open Telegram, search for `@Intergram`
2. Send `/start`
3. Bot replies with your unique **Chat ID**

#### Step 3: Create Widget Component

```tsx
// laqta/components/chat/TelegramWidget.tsx
'use client';

import Script from 'next/script';

interface TelegramWidgetProps {
  locale?: string;
}

const MESSAGES: Record<string, { closed: string; open: string; intro: string }> = {
  en: {
    closed: 'Chat with us!',
    open: 'Chat with Laqta',
    intro: 'Hello! How can we help you today?',
  },
  ar: {
    closed: '!تحدث معنا',
    open: 'تحدث مع لقطة',
    intro: 'مرحباً! كيف يمكننا مساعدتك؟',
  },
  fr: {
    closed: 'Discutez avec nous !',
    open: 'Chat avec Laqta',
    intro: 'Bonjour ! Comment pouvons-nous vous aider ?',
  },
};

export default function TelegramWidget({ locale = 'en' }: TelegramWidgetProps) {
  const msg = MESSAGES[locale] || MESSAGES.en;

  return (
    <>
      <Script
        id="intergram-config"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.intergramId = "YOUR_CHAT_ID";
            window.intergramCustomizations = {
              titleClosed: "${msg.closed}",
              titleOpen: "${msg.open}",
              introMessage: "${msg.intro}",
              autoResponse: "",
              autoNo498Response: "",
              mainColor: "#7F56D9",
              alwaysUseFloatingButton: true
            };
          `,
        }}
      />
      <Script
        src="https://www.intergram.xyz/js/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}
```

#### Step 4: Add to Layout

```tsx
// In laqta/src/app/[locale]/layout.tsx
import TelegramWidget from '@/components/chat/TelegramWidget';

export default function LocaleLayout({ children, params }: Props) {
  return (
    <html lang={params.locale} dir={params.locale === 'ar' ? 'rtl' : 'ltr'}>
      <body>
        {children}
        <TelegramWidget locale={params.locale} />
      </body>
    </html>
  );
}
```

### Option B: Click-to-Telegram Button

```tsx
// laqta/components/chat/TelegramButton.tsx
'use client';

interface TelegramButtonProps {
  locale?: string;
}

export default function TelegramButton({ locale = 'en' }: TelegramButtonProps) {
  return (
    <a
      href="https://t.me/laqta_support_bot"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 flex items-center justify-center
                 w-14 h-14 bg-[#0088CC] hover:bg-[#006699] text-white
                 rounded-full shadow-lg transition-all hover:scale-110
                 rtl:right-auto rtl:left-6"
      aria-label="Chat on Telegram"
    >
      {/* Telegram icon */}
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.479.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    </a>
  );
}
```

### Self-Hosting Intergram (Optional)

For full control, you can self-host Intergram:

```bash
git clone https://github.com/idoco/intergram.git
cd intergram
npm install
# Set environment variable
export TELEGRAM_TOKEN=your_bot_token
npm start
```

Then point the widget script to your own server instead of `intergram.xyz`.

## Telegram Bot Capabilities (All Free)

| Feature | Description |
|---------|-------------|
| Custom commands | `/start`, `/help`, `/faq`, `/contact` |
| Inline keyboards | Interactive buttons within messages |
| File sharing | Images, documents, audio, video |
| Location sharing | Receive visitor location |
| Webhook support | Real-time message delivery to your server |
| Group forwarding | Forward messages to admin group |
| Unlimited messages | No caps, no fees, ever |
| Rich media | Photos, videos, stickers, voice messages |

### Building a Support Bot (Advanced)

You can build a custom bot that handles FAQs automatically:

```typescript
// Example: Telegram bot with node-telegram-bot-api
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot('YOUR_TOKEN', { polling: true });

const FAQ: Record<string, Record<string, string>> = {
  '/services': {
    en: 'We offer branding, web design, and digital marketing. Visit laqta.com/services',
    ar: 'نقدم خدمات العلامات التجارية والتصميم والتسويق الرقمي',
    fr: 'Nous offrons le branding, le web design et le marketing digital',
  },
  '/contact': {
    en: 'Email: hello@laqta.com | Phone: +212...',
    ar: 'البريد: hello@laqta.com | الهاتف: +212...',
    fr: 'Email: hello@laqta.com | Tél: +212...',
  },
};

bot.onText(/\/(services|contact)/, (msg, match) => {
  const command = `/${match![1]}`;
  const lang = detectLanguage(msg.text); // detect from user's message
  bot.sendMessage(msg.chat.id, FAQ[command][lang] || FAQ[command].en);
});
```

## Arabic / RTL Support

| Aspect | Status |
|--------|--------|
| Arabic text in Telegram | Native — full Unicode support |
| RTL rendering | Automatic in Telegram app |
| Arabic bot responses | Yes (send Arabic text) |
| Intergram widget RTL | May need CSS customization |

Telegram natively supports Arabic. The Intergram widget displays text correctly but may need custom CSS for proper RTL input field alignment.

## AI / Chatbot Capabilities

| Feature | Availability |
|---------|-------------|
| Custom bot with FAQ handling | Free (you build it) |
| OpenAI/Claude integration | Free API + your AI costs |
| Automated responses | Free (Bot API) |
| Pre-built AI chatbot | Not included (DIY) |

You can integrate AI (OpenAI, Claude) into your Telegram bot for intelligent auto-responses. The bot infrastructure is free — you only pay for AI API calls.

## Pros

- **100% free** — no limits, no fees, ever
- **Chat on website** — via Intergram (visitor doesn't need Telegram)
- **Unlimited messages** — no conversation caps
- **Custom bot** — automate FAQs and routing for free
- **Admin responds from Telegram app** — already familiar
- **Arabic supported** natively
- **Can self-host** Intergram for full control
- **Tiny footprint** — Intergram widget is ~5KB gzipped
- **Team support** — forward to Telegram group, multiple admins see messages
- **File sharing** included

## Cons

- **Intergram widget is basic** — not as polished as Tawk.to or Crisp
- **No visitor tracking** — can't see what page they're on
- **No analytics** built-in
- **No agent dashboard** — admins respond from Telegram app
- **Intergram project maintenance** — open source, community maintained
- **No offline messaging** via the website widget (Telegram handles it)
- **RTL for widget** may need CSS tweaks
- **Less familiar** than WhatsApp in Arabic-speaking markets
- **Building advanced bots requires development** effort

## Setup Effort

| Task | Time |
|------|------|
| Create Telegram bot via BotFather | 5 minutes |
| Set up Intergram | 10 minutes |
| Add widget to Next.js | 15 minutes |
| Customize widget colors and messages | 15 minutes |
| Build basic FAQ bot (optional) | 2-4 hours |
| Self-host Intergram (optional) | 1 hour |
| **Total (basic)** | **~45 minutes** |
| **Total (with custom bot)** | **~5 hours** |

## GDPR Considerations

- Intergram (self-hosted): **Full data control** — messages only pass through your server
- Intergram (hosted): Messages pass through intergram.xyz server
- Telegram messages stored on Telegram's servers (Dubai-based company)
- Telegram offers Secret Chats (end-to-end encrypted) for regular chats, but bots don't support this
- No DPA available from Telegram

## Best For

Telegram is ideal as a **secondary channel** alongside a main live chat widget. It works especially well for **tech-savvy audiences**. The Intergram widget is a clever way to offer website chat backed by Telegram without requiring visitors to have the app. Best combined with WhatsApp for broader audience coverage.

## Links

- Telegram Bot API: https://core.telegram.org/bots/api
- BotFather: https://t.me/BotFather
- Intergram: https://github.com/idoco/intergram
- Intergram Demo: https://www.intergram.xyz
- Telegram Support Bot: https://github.com/bostrot/telegram-support-bot
- node-telegram-bot-api: https://www.npmjs.com/package/node-telegram-bot-api
