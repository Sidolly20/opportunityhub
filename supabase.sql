create table if not exists opportunities (
  id text primary key,
  slug text unique not null,
  data jsonb not null,
  published_at timestamptz not null
);
alter table opportunities enable row level security;
