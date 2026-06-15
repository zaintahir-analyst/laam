-- ⚠️ This file recreates the table from scratch (drops existing data).
-- It is meant for FRESH installs only. If you already have live tickets,
-- do NOT re-run this — use migration_attachments.sql instead.
--
-- Drop the old table to avoid conflicts
drop table if exists public.tickets;

-- Create the updated tickets table
create table public.tickets (
  id            bigserial primary key,
  ticket_id     text not null,
  title         text not null,
  description   text,
  team          text not null check (team in ('Marketing','Product & Eng','Growth','Commercials','Finance','Experience','Warehouse')),
  priority      text not null check (priority in ('Critical','High','Medium','Low')),
  status        text not null default 'New' check (status in ('New','In Progress','Review','Blocked','Done')),
  assignee      text default 'Unassigned',
  due_date      date,
  submitter     text not null,
  email         text not null, -- Added to collect respondent emails
  format        text,
  comments      jsonb default '[]'::jsonb,
  attachments   jsonb default '[]'::jsonb, -- [{type:'link'|'file', url, name}]
  created_at    timestamptz default now()
);

-- Enable Row Level Security
alter table public.tickets enable row level security;

-- Setup Access Policies
create policy "Allow public read"   on public.tickets for select using (true);
create policy "Allow public insert" on public.tickets for insert with check (true);
create policy "Allow public update" on public.tickets for update using (true);
create policy "Allow public delete" on public.tickets for delete using (true);

-- Enable Realtime Sync
alter publication supabase_realtime add table public.tickets;
