# Custom Socket.io + Strapi — DIY Real-Time Chat

> **Recommendation Score: 2/5** — Full control but massive development effort for what SaaS tools provide free

## Overview

Build a completely custom real-time chat system using Socket.io integrated with your existing Strapi v5 backend and Next.js 16 frontend. Messages stored in your PostgreSQL database, full UI control, no external dependencies. This is the most powerful approach but requires significant development investment.

**Strapi Plugin:** The community plugin `@strapi-community/plugin-io` integrates Socket.io directly into Strapi v5.

## How It Works

1. Install Socket.io plugin in Strapi
2. Create `Message` and `Conversation` content types in Strapi
3. Build a chat UI component in Next.js
4. Connect frontend to Strapi's Socket.io server
5. Messages sent/received in real time via WebSocket
6. Build an admin dashboard for managing conversations
7. Configure Nginx for WebSocket upgrade headers

## Pricing

| Component | Cost |
|-----------|------|
| Socket.io library | Free (MIT license) |
| Strapi plugin | Free (open source) |
| React chat UI | Free (you build it) |
| Infrastructure | Already running (Strapi on port 1337) |
| **Total** | **$0 (but significant dev time)** |

## Architecture

```
┌─────────────────────┐     WebSocket      ┌──────────────────────┐
│   Next.js Frontend   │ ←──────────────→  │   Strapi v5 Backend   │
│   (Port 3000)        │                    │   (Port 1337)         │
│                      │     REST API       │                       │
│  ┌────────────────┐  │ ←──────────────→  │  ┌─────────────────┐  │
│  │ Chat Widget    │  │                    │  │ Socket.io Plugin│  │
│  │ (React)        │  │                    │  │ (@strapi-io)    │  │
│  └────────────────┘  │                    │  └─────────────────┘  │
│                      │                    │                       │
│  ┌────────────────┐  │                    │  ┌─────────────────┐  │
│  │ Socket.io      │  │                    │  │ Message API     │  │
│  │ Client         │  │                    │  │ Conversation API│  │
│  └────────────────┘  │                    │  └─────────────────┘  │
└─────────────────────┘                    │                       │
                                            │  ┌─────────────────┐  │
                                            │  │ PostgreSQL      │  │
                                            │  │ (Messages)      │  │
                                            │  └─────────────────┘  │
                                            └──────────────────────┘
```

## Implementation Steps

### Step 1: Install Strapi Socket.io Plugin

```bash
cd my-blog-cms
npm install @strapi-community/plugin-io socket.io
```

```typescript
// my-blog-cms/config/plugins.ts — add io plugin
export default {
  // ... existing plugins
  io: {
    enabled: true,
    config: {
      IOServerOptions: {
        cors: {
          origin: ['http://localhost:3000', 'https://laqta.com'],
          methods: ['GET', 'POST'],
        },
      },
      contentTypes: {
        message: '*',         // Broadcast all message CRUD events
        conversation: '*',    // Broadcast all conversation CRUD events
      },
    },
  },
};
```

### Step 2: Create Content Types in Strapi

**Conversation:**
```json
{
  "kind": "collectionType",
  "collectionName": "conversations",
  "attributes": {
    "visitorName": { "type": "string" },
    "visitorEmail": { "type": "email" },
    "status": {
      "type": "enumeration",
      "enum": ["open", "closed", "pending"],
      "default": "open"
    },
    "assignedTo": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "admin::user"
    },
    "messages": {
      "type": "relation",
      "relation": "oneToMany",
      "target": "api::message.message"
    },
    "locale": { "type": "string", "default": "en" },
    "metadata": { "type": "json" }
  }
}
```

**Message:**
```json
{
  "kind": "collectionType",
  "collectionName": "messages",
  "attributes": {
    "content": { "type": "text", "required": true },
    "sender": {
      "type": "enumeration",
      "enum": ["visitor", "admin"],
      "required": true
    },
    "conversation": {
      "type": "relation",
      "relation": "manyToOne",
      "target": "api::conversation.conversation"
    },
    "readAt": { "type": "datetime" },
    "attachments": {
      "type": "media",
      "multiple": true,
      "allowedTypes": ["images", "files"]
    }
  }
}
```

### Step 3: Frontend Socket.io Client

```bash
cd laqta
npm install socket.io-client
```

```tsx
// laqta/components/chat/LiveChat.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageCircle, X, Send } from 'lucide-react';

interface Message {
  id: number;
  content: string;
  sender: 'visitor' | 'admin';
  createdAt: string;
}

interface LiveChatProps {
  locale?: string;
  strapiUrl?: string;
}

export default function LiveChat({
  locale = 'en',
  strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL_2 || 'http://localhost:1337',
}: LiveChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<number | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const socket = io(strapiUrl, {
      transports: ['websocket', 'polling'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to chat server');
    });

    socket.on('message:create', (data: { data: Message }) => {
      setMessages((prev) => [...prev, data.data]);
    });

    return () => {
      socket.disconnect();
    };
  }, [isOpen, strapiUrl]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    try {
      const response = await fetch(`${strapiUrl}/api/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data: {
            content: input,
            sender: 'visitor',
            conversation: conversationId,
          },
        }),
      });

      if (response.ok) {
        setInput('');
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const labels: Record<string, { title: string; placeholder: string; greeting: string }> = {
    en: { title: 'Chat with us', placeholder: 'Type a message...', greeting: 'Hello! How can we help?' },
    ar: { title: 'تحدث معنا', placeholder: '...اكتب رسالة', greeting: 'مرحباً! كيف يمكننا المساعدة؟' },
    fr: { title: 'Discutez avec nous', placeholder: 'Tapez un message...', greeting: 'Bonjour ! Comment pouvons-nous aider ?' },
  };

  const l = labels[locale] || labels.en;

  return (
    <div className="fixed bottom-6 right-6 z-50 rtl:right-auto rtl:left-6">
      {isOpen ? (
        <div className="w-80 h-96 bg-white rounded-xl shadow-2xl flex flex-col
                        border border-neutral-200 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-white p-3 flex justify-between items-center">
            <span className="font-medium">{l.title}</span>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            <div className="bg-neutral-100 rounded-lg p-2 text-sm text-neutral-600">
              {l.greeting}
            </div>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg p-2 text-sm max-w-[80%] ${
                  msg.sender === 'visitor'
                    ? 'bg-primary text-white ml-auto rtl:ml-0 rtl:mr-auto'
                    : 'bg-neutral-100 text-neutral-800'
                }`}
              >
                {msg.content}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-2 border-t flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={l.placeholder}
              className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none
                         focus:ring-2 focus:ring-primary/50"
              dir={locale === 'ar' ? 'rtl' : 'ltr'}
            />
            <button
              onClick={sendMessage}
              className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90"
              aria-label="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg
                     flex items-center justify-center hover:scale-110 transition-transform"
          aria-label={l.title}
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}
```

### Step 4: Nginx WebSocket Config

```nginx
# Add WebSocket support to your Strapi Nginx config
location /socket.io/ {
    proxy_pass http://127.0.0.1:1337/socket.io/;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

### Step 5: Admin Dashboard (Must Build)

You need to build a separate admin interface for:
- Viewing active conversations
- Replying to visitors
- Assigning conversations to team members
- Viewing conversation history
- Online/offline status management

This is a significant additional development effort (1-2 weeks for a basic admin panel).

## What You Need to Build (Full Feature List)

| Feature | Effort | Priority |
|---------|--------|----------|
| WebSocket connection | 2-4 hours | Must have |
| Message sending/receiving | 4-8 hours | Must have |
| Conversation management | 8-16 hours | Must have |
| Admin dashboard | 40-80 hours | Must have |
| Typing indicators | 2-4 hours | Nice to have |
| Read receipts | 4-8 hours | Nice to have |
| Online/offline presence | 4-8 hours | Nice to have |
| File attachments | 8-16 hours | Nice to have |
| Push notifications (email) | 8-16 hours | Nice to have |
| Sound notifications | 2-4 hours | Nice to have |
| Chat rating/CSAT | 4-8 hours | Nice to have |
| Pre-chat form | 4-8 hours | Nice to have |
| Canned responses | 4-8 hours | Nice to have |
| Agent assignment/routing | 8-16 hours | Nice to have |
| Analytics/reporting | 16-32 hours | Nice to have |
| Mobile admin app | 80-160 hours | Future |
| **Total (must have)** | **~55-108 hours** | |
| **Total (all features)** | **~200-400 hours** | |

## Arabic / RTL Support

| Aspect | Status |
|--------|--------|
| Chat UI RTL | Full control — you build it |
| Arabic text | Full support (standard HTML/CSS) |
| RTL input fields | Standard CSS `dir="rtl"` |
| Arabic admin dashboard | You must build it |

You have **complete control** over RTL support since you build everything. Use Tailwind's `rtl:` variant prefix for RTL-specific styles.

## AI / Chatbot Capabilities

| Feature | Availability |
|---------|-------------|
| Auto-responses | You build it |
| AI integration (OpenAI, Claude) | You build it (API costs apply) |
| FAQ bot | You build it |
| Sentiment analysis | You build it |

No AI is included — you must integrate external AI services yourself. This adds additional development time and API costs.

## Pros

- **Full ownership** — code, data, and infrastructure are yours
- **Deep Strapi integration** — messages stored as content types, queryable via REST API
- **Perfect RTL** — you control every pixel
- **No recurring SaaS costs** — only infrastructure (already running)
- **No branding** — 100% your design
- **Unlimited customization** — exactly the features you need
- **PostgreSQL** — messages in your existing database
- **No external dependencies** — no third-party service to go down

## Cons

- **Massive development effort** — 4-8 weeks minimum for production-ready
- **Must build admin dashboard** from scratch (or use Strapi admin)
- **Must build everything** — typing indicators, notifications, presence, read receipts
- **No mobile admin app** — must build separately or use web
- **Ongoing maintenance** — bugs, security patches, scaling
- **No pre-built AI** — must integrate yourself
- **WebSocket scaling** — need Redis adapter for multiple server instances
- **Security responsibility** — XSS, injection, rate limiting all on you
- **Opportunity cost** — weeks of development vs 10 minutes with Tawk.to

## Setup Effort

| Phase | Time | Description |
|-------|------|-------------|
| Backend setup (plugin, content types) | 1-2 days | Install plugin, create schemas, configure |
| Frontend chat widget | 2-3 days | Build React component, Socket.io client |
| Admin dashboard (basic) | 1-2 weeks | Conversation list, reply, assign |
| Testing and debugging | 2-3 days | Cross-browser, RTL, edge cases |
| Nginx and deployment config | 1 day | WebSocket headers, PM2 config |
| **Total (production-ready basic)** | **~4-6 weeks** | |

## GDPR Compliance

- **Full data sovereignty** — everything on your server
- No third-party data processing
- You control data retention policies
- You must implement: consent forms, data export, deletion requests
- Data Processing Agreement not needed (you are the processor)

## Best For

A custom solution is only justified if:
1. Chat is a **core product feature** (not just a support widget)
2. You need **deep integration** with Strapi data (e.g., link conversations to projects)
3. You have **specific requirements** that no SaaS tool can meet
4. You have **development resources** available (4-8 weeks)

For a marketing website that needs visitor-to-admin chat, this is **overkill**. Use Tawk.to or Chatwoot instead and invest the saved development time in other features.

## Links

- Strapi IO Plugin: https://market.strapi.io/plugins/@strapi-community-plugin-io
- Plugin GitHub: https://github.com/strapi-community/plugin-io
- Socket.io: https://socket.io
- Strapi Chat Tutorial: https://strapi.io/blog/real-time-chat-application-using-strapi-next-socket-io-and-postgre-sql
- socket.io-client (npm): https://www.npmjs.com/package/socket.io-client
