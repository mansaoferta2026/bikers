
-- SITE SETTINGS (Configuration Module)
create table public.site_settings (
    id uuid default uuid_generate_v4() primary key,
    category varchar(50) not null, -- 'business', 'payment', 'landing', 'general'
    key varchar(100) not null,
    value jsonb not null,
    description text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_by uuid references auth.users(id),
    unique(category, key)
);

-- Enable RLS
alter table public.site_settings enable row level security;

-- Admin can read/write
create policy "Admin full access to site_settings"
    on site_settings
    for all
    to authenticated
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

-- Public can read certain settings
create policy "Public can read public site_settings"
    on site_settings
    for select
    using (category in ('business', 'general'));

-- Indexes
create index idx_site_settings_category on site_settings(category);
create index idx_site_settings_key on site_settings(key);

-- Trigger to update timestamp
create or replace function update_site_settings_timestamp()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    new.updated_by = auth.uid();
    return new;
end;
$$ language plpgsql;

create trigger site_settings_updated
    before update on site_settings
    for each row
    execute function update_site_settings_timestamp();

-- LANDING CAROUSEL
create table public.landing_carousel (
    id uuid default uuid_generate_v4() primary key,
    title varchar(200) not null,
    subtitle text,
    image_url text not null,
    cta_text varchar(50),
    cta_link varchar(200),
    display_order integer not null default 0,
    is_active boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.landing_carousel enable row level security;

-- Admin full access
create policy "Admin full access to landing_carousel"
    on landing_carousel
    for all
    to authenticated
    using (
        exists (
            select 1 from profiles
            where profiles.id = auth.uid()
            and profiles.role = 'admin'
        )
    );

-- Public can read active slides
create policy "Public can read active carousel slides"
    on landing_carousel
    for select
    using (is_active = true);

-- Indexes
create index idx_landing_carousel_order on landing_carousel(display_order);
create index idx_landing_carousel_active on landing_carousel(is_active);
