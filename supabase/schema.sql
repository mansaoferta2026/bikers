
-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- PROFILES (Users)
create type user_role as enum ('admin', 'subscriber', 'visitor');
create type experience_level as enum ('beginner', 'intermediate', 'advanced', 'expert');

create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  phone text,
  experience_level experience_level default 'beginner',
  bike_size text,
  role user_role default 'visitor',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Turn on RLS
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- EVENTS
create type event_type as enum ('local', 'provincial', 'international');
create type difficulty_level as enum ('beginner', 'intermediate', 'advanced', 'expert');
create type event_status as enum ('published', 'draft', 'cancelled', 'finished');

create table public.events (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  type event_type not null,
  difficulty difficulty_level not null,
  start_date timestamp with time zone not null,
  duration text, -- e.g. "4 hours", "2 days"
  distance_km numeric,
  elevation_gain numeric, -- in meters
  meeting_point text,
  location_lat numeric,
  location_lng numeric,
  max_participants integer,
  price numeric not null,
  images text[], -- array of image URLs
  includes text[],
  requirements text[],
  status event_status default 'draft',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.events enable row level security;

create policy "Events are viewable by everyone." on events for select using (true);
create policy "Only admins can insert events." on events for insert with check (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can update events." on events for update using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Only admins can delete events." on events for delete using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- SUBSCRIPTIONS
create type subscription_plan as enum ('monthly', 'annual');
create type subscription_status as enum ('active', 'inactive', 'cancelled');

create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  plan_type subscription_plan not null,
  status subscription_status default 'active',
  start_date timestamp with time zone default timezone('utc'::text, now()) not null,
  end_date timestamp with time zone,
  amount numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;

create policy "Users can view own subscriptions." on subscriptions for select using (auth.uid() = user_id);
create policy "Admins can view all subscriptions." on subscriptions for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- BOOKINGS
create type booking_status as enum ('pending', 'confirmed', 'cancelled');
create type payment_status as enum ('pending', 'completed', 'refunded');

create table public.bookings (
  id uuid default uuid_generate_v4() primary key,
  event_id uuid references public.events(id) not null,
  user_id uuid references public.profiles(id) not null,
  participants_count integer default 1,
  total_amount numeric not null,
  status booking_status default 'pending',
  payment_status payment_status default 'pending',
  additional_info jsonb, -- emergency contact, etc
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.bookings enable row level security;

create policy "Users can view own bookings." on bookings for select using (auth.uid() = user_id);
create policy "Admins can view all bookings." on bookings for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);
create policy "Users can insert own bookings." on bookings for insert with check (auth.uid() = user_id);

-- PAYMENTS
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  booking_id uuid references public.bookings(id) not null,
  amount numeric not null,
  payment_method text,
  transaction_id text,
  status text, -- specific to gateway
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.payments enable row level security;

create policy "Users can view own payments." on payments for select using (
  exists (select 1 from bookings where id = payments.booking_id and user_id = auth.uid())
);
create policy "Admins can view all payments." on payments for select using (
  exists (select 1 from profiles where id = auth.uid() and role = 'admin')
);

-- STORAGE BUCKET POLICIES (Needs manual bucket creation 'event-images', 'avatars')
-- We can add policies assuming the buckets exist, but usually they are created in dashboard.
-- Below is for reference or if we use api to create them.

-- Setup trigger for profiles on auth.users insert
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'subscriber'); -- Default to subscriber? User asked for 3 roles. Let's default to visitor.
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
