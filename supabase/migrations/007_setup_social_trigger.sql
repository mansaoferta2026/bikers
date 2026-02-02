-- Enable pg_net extension for HTTP requests
create extension if not exists pg_net with schema extensions;

-- Function to notify Make.com
create or replace function public.notify_social_automation()
returns trigger as $$
declare
    webhook_url text;
    payload jsonb;
    first_image text;
begin
    -- Safety check: Ensure we only run when status IS 'published'
    if new.status != 'published' then
        return new;
    end if;

    -- Safety check: If it was already published, do not re-send (avoid spam on updates)
    if (TG_OP = 'UPDATE' and old.status = 'published') then
        return new;
    end if;

    -- 1. Get the Webhook URL from settings
    select 
        case 
            when jsonb_typeof(value) = 'string' then value#>>'{}'
            else value->>'value'
        end
    into webhook_url
    from public.site_settings
    where category = 'general' and key = 'social_webhook_url';

    -- 2. If no URL or empty, exit
    if webhook_url is null or webhook_url = '' then
        return new;
    end if;

    -- 3. Get first image safely
    begin
        first_image := new.images->>0;
    exception when others then
        first_image := null;
    end;

    -- 4. Construct payload
    payload = json_build_object(
        'event_id', new.id,
        'title', new.title,
        'description', new.description,
        'date', new.start_date,
        'image_url', first_image, 
        'price', new.price,
        'instagram_url', new.instagram_url,
        'tiktok_url', new.tiktok_url,
        'action', 'new_event_published'
    );

    -- 5. Send request using pg_net
    perform net.http_post(
        url := webhook_url,
        body := payload,
        headers := '{"Content-Type": "application/json"}'::jsonb
    );

    return new;
end;
$$ language plpgsql security definer;

-- Trigger
drop trigger if exists on_event_published on public.events;

create trigger on_event_published
    after insert or update of status
    on public.events
    for each row
    execute function public.notify_social_automation();
