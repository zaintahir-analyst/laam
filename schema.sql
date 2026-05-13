-- ─────────────────────────────────────────────────────────────
-- LAAM Analytics Tracker — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ─────────────────────────────────────────────────────────────

-- 1. Create the tickets table
create table if not exists public.tickets (
  id            bigserial primary key,
  ticket_id     text not null,
  title         text not null,
  description   text,
  team          text not null,
  priority      text not null check (priority in ('Critical','High','Medium','Low')),
  status        text not null default 'New' check (status in ('New','In Progress','Review','Blocked','Done')),
  assignee      text default 'Unassigned',
  due_date      date,
  submitter     text,
  format        text,
  deparment     text not null check (department in ('Growth','Commercials','Marketing','Finance', 'Product & Engineering','Experience','Sucsel')),
  comments      jsonb default '[]'::jsonb,
  created_at    timestamptz default now()
);

-- 2. Enable Row Level Security
alter table public.tickets enable row level security;

-- 3. Policies — allow all operations (update after go-live if you add auth)
create policy "Allow read"   on public.tickets for select using (true);
create policy "Allow insert" on public.tickets for insert with check (true);
create policy "Allow update" on public.tickets for update using (true);
create policy "Allow delete" on public.tickets for delete using (true);

-- 4. Enable real-time on this table
-- (Do this in Supabase Dashboard → Database → Replication → tickets ✓)
-- Or run:
alter publication supabase_realtime add table public.tickets;
