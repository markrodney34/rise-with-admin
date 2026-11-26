create table if not exists public.site_content (
  id text primary key check (id = 'main'),
  content jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key,
  name text not null,
  email text not null,
  topic text not null,
  message text not null,
  created_at timestamptz not null default now(),
  is_read boolean not null default false
);

create table if not exists public.admin_credentials (
  id text primary key check (id = 'primary'),
  salt text not null,
  password_hash text not null,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;
alter table public.contact_messages enable row level security;
alter table public.admin_credentials enable row level security;

-- The Next.js server uses its secret key, which bypasses RLS. No browser roles
-- receive table access and no public Storage policies are created.
revoke all on public.site_content, public.contact_messages, public.admin_credentials from anon, authenticated;
grant all on public.site_content, public.contact_messages, public.admin_credentials to service_role;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('rise-uploads', 'rise-uploads', false, 10485760,
  array['image/jpeg','image/png','image/webp','image/avif','image/gif'])
on conflict (id) do update set
  public = false,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;
