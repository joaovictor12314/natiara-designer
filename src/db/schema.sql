create extension if not exists pgcrypto;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  phone text not null,
  address text not null,
  city text not null default 'Goiania',
  password_hash text not null,
  two_factor_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null,
  price numeric(10, 2) not null check (price > 0),
  duration_minutes integer not null check (duration_minutes > 0),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists appointments (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references clients(id) on delete cascade,
  scheduled_at timestamptz not null,
  status text not null check (status in ('confirmado', 'pendente', 'cancelado', 'reagendado')),
  address text not null,
  city text not null,
  distance_km numeric(6, 2) not null check (distance_km >= 0),
  displacement_fee numeric(10, 2) not null default 0,
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamptz not null default now()
);

create table if not exists appointment_services (
  appointment_id uuid not null references appointments(id) on delete cascade,
  service_id uuid not null references services(id),
  price_snapshot numeric(10, 2) not null,
  primary key (appointment_id, service_id)
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  appointment_id uuid not null references appointments(id) on delete cascade,
  amount numeric(10, 2) not null check (amount >= 0),
  method text not null check (method in ('pix', 'credito', 'debito')),
  status text not null check (status in ('aprovado', 'recusado', 'pendente')),
  provider_reference text,
  created_at timestamptz not null default now()
);

create index if not exists idx_appointments_scheduled_at on appointments(scheduled_at);
create index if not exists idx_appointments_status on appointments(status);
create index if not exists idx_payments_status on payments(status);
