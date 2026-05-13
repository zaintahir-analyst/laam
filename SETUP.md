# LAAM Analytics Tracker — Setup Guide
### Supabase (database) + Vercel (hosting)

---

## Files in this project

| File | Purpose |
|------|---------|
| `index.html` | Main dashboard — for you & your manager |
| `submit.html` | Public intake form — share with all teams |
| `config.js` | Your Supabase credentials go here |
| `schema.sql` | Run once in Supabase to create the database |
| `vercel.json` | Vercel routing config (no changes needed) |

---

## STEP 1 — Create a free Supabase project (~5 min)

1. Go to **https://supabase.com** → click **Start your project**
2. Sign up with GitHub (easiest) or email
3. Click **New project**
4. Fill in:
   - **Name:** `laam-analytics`
   - **Database password:** choose something strong, save it somewhere
   - **Region:** pick the closest to your team (e.g. `eu-west-1` for Europe)
5. Click **Create new project** — wait ~60 seconds for it to spin up

---

## STEP 2 — Create the database table (~2 min)

1. In your Supabase project, click **SQL Editor** in the left sidebar
2. Click **New query**
3. Open `schema.sql` from this folder, copy all the contents, paste into the editor
4. Click **Run** (or press Ctrl+Enter)
5. You should see: *"Success. No rows returned"*

✅ Your `tickets` table is now created with real-time enabled.

---

## STEP 3 — Copy your API credentials (~1 min)

1. In Supabase, go to **Project Settings** (gear icon) → **API**
2. You'll see two values you need:
   - **Project URL** — looks like `https://abcdefgh.supabase.co`
   - **anon public** key — a long string starting with `eyJ...`
3. Open `config.js` in a text editor and replace the placeholders:

```js
var SUPABASE_URL      = "https://abcdefgh.supabase.co";
var SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
```

Save the file.

---

## STEP 4 — Deploy to Vercel (~5 min)

### 4a. Push to GitHub

1. Go to **https://github.com** → sign in (or create free account)
2. Click **+** → **New repository**
3. Name: `laam-analytics` → **Public** → **Create repository**
4. Click **uploading an existing file**
5. Drag all 5 files: `index.html`, `submit.html`, `config.js`, `schema.sql`, `vercel.json`
6. Click **Commit changes**

### 4b. Deploy on Vercel

1. Go to **https://vercel.com** → sign in with GitHub
2. Click **Add New → Project**
3. Find `laam-analytics` in the list → click **Import**
4. Leave all settings as default → click **Deploy**
5. Wait ~30 seconds — Vercel builds and deploys automatically

✅ Your app is live at a URL like: `https://laam-analytics.vercel.app`

---

## STEP 5 — Share with your team

| Who | URL to share | What they can do |
|-----|-------------|-----------------|
| **Other teams** | `https://laam-analytics.vercel.app/submit` | Submit requests (no login needed) |
| **You & manager** | `https://laam-analytics.vercel.app` | View, manage, and update all requests |

> **Tip:** Bookmark the dashboard and pin the submit link in your company Slack or Teams channel.

---

## How real-time sync works

Once Supabase is connected:

- When any team submits a form → it appears in the dashboard **instantly**, no refresh needed
- When you or your manager update a status → both of you see it update in real-time simultaneously
- Everything is stored in Supabase PostgreSQL — your data is safe and persistent

---

## Free tier limits

### Supabase (free "Spark" plan)
| Resource | Limit | Your usage |
|----------|-------|-----------|
| Database rows | 500 MB storage | ~1 MB for 1000s of tickets ✓ |
| API requests | 50,000/month | ~500/month ✓ |
| Real-time connections | 200 concurrent | 2–10 ✓ |
| Projects | 2 free | 1 needed ✓ |

### Vercel (free "Hobby" plan)
| Resource | Limit | Your usage |
|----------|-------|-----------|
| Bandwidth | 100 GB/month | ~1 GB ✓ |
| Deployments | Unlimited | ✓ |
| Custom domain | 1 free | Optional ✓ |

**You will never hit these limits for internal team use.**

---

## Optional upgrades you can ask Claude to build

- 🔐 **Login / authentication** — protect the dashboard with Supabase Auth (Google login)
- 📧 **Email notifications** — alert the analytics team when a Critical request comes in
- 📊 **Analytics charts** — requests over time, by team, by priority
- 📅 **SLA tracking** — flag tickets approaching their due date
- 🔗 **Custom domain** — connect `analytics.laam.com` in Vercel settings (free)

---

## Troubleshooting

**"Demo mode" still showing after adding config**
→ Double-check config.js has no typos; URL must start with `https://` and key with `eyJ`

**Tickets not appearing in real-time**
→ In Supabase → Database → Replication → check that `tickets` is toggled on under `supabase_realtime`

**Vercel build error**
→ Make sure all 5 files were uploaded including `vercel.json`

**Supabase RLS blocking inserts**
→ Re-run the `schema.sql` to ensure the policies were created correctly
