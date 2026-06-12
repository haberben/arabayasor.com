-- -------------------------------------------------------------
-- arabayasor.com Parça Detay Analiz Tablosu Şeması
-- -------------------------------------------------------------

create table if not exists public.part_analyses (
    id uuid default gen_random_uuid() primary key,
    generation_id uuid references public.generations(id) on delete cascade not null,
    part_slug text not null, -- Örn: turbocharger, zincir-seti
    part_name text not null, -- Örn: Turboşarj, Triger Zincir Seti
    section_name text not null default 'Hava Emme Sistemi', -- Örn: Motor, Şanzıman, Elektrik
    durability_score numeric(2,1) not null default 3.8, -- 1.0 - 5.0 arası
    vote_count integer not null default 428,
    expected_life_min integer not null default 80000, -- km cinsinden
    expected_life_max integer not null default 120000, -- km cinsinden
    chronic_risk_pct integer not null default 35, -- 0 - 100 arası risk yüzdesi
    common_faults text[] not null default '{}'::text[], -- yaygın belirti başlıkları
    oem_price_min integer, -- TL cinsinden minimum
    oem_price_max integer, -- TL cinsinden maksimum
    aftermarket_price_min integer,
    aftermarket_price_max integer,
    rebuild_price_min integer,
    rebuild_price_max integer,
    labor_price_min integer,
    labor_price_max integer,
    expert_name text not null default 'Usta Ahmet Yılmaz',
    expert_title text not null default 'MASTER USTA ÖNERİSİ',
    expert_quote text not null,
    expert_image_url text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(generation_id, part_slug)
);

-- Row Level Security (RLS) ayarları
alter table public.part_analyses enable row level security;

-- Herkes görüntüleyebilir
create policy "Herkes parça analizlerini görüntüleyebilir" on public.part_analyses
    for select using (true);

-- Yalnızca admin seviyesindeki kullanıcılar veya ustalar veri ekleyebilir/güncelleyebilir
create policy "Adminler parça analizlerini düzenleyebilir" on public.part_analyses
    for all using (
        exists (select 1 from public.profiles where id = auth.uid() and role in ('Master Usta', 'Efsane Usta'))
    );

-- -------------------------------------------------------------
-- BMW F30 TURBOŞARJ ÖRNEK SEED VERİSİ
-- -------------------------------------------------------------

do $$
declare
    f30_id uuid;
begin
    -- F30 neslinin ID'sini çek
    select id into f30_id from public.generations where slug = 'f30' limit 1;

    if f30_id is not null then
        insert into public.part_analyses (
            generation_id,
            part_slug,
            part_name,
            section_name,
            durability_score,
            vote_count,
            expected_life_min,
            expected_life_max,
            chronic_risk_pct,
            common_faults,
            oem_price_min,
            oem_price_max,
            aftermarket_price_min,
            aftermarket_price_max,
            rebuild_price_min,
            rebuild_price_max,
            labor_price_min,
            labor_price_max,
            expert_name,
            expert_title,
            expert_quote,
            expert_image_url,
            image_url
        ) values (
            f30_id,
            'turbocharger',
            'Turboşarj',
            'Hava Emme Sistemi',
            3.8,
            428,
            80000,
            120000,
            35,
            array[
                'Islık Sesi (Whining Noise) - Turbo pervanesindeki aşınma veya mil boşluğu',
                'Güç Kaybı & Mavi Duman - Wastegate gevşemesi ve yağ sızıntısı sonucu egzozdan duman atılması',
                'Yağ Besleme Hattı Tıkanıklığı - Düzenli yağ bakımı yapılmaması sonucu milin sarması'
            ],
            45000,
            65000,
            28000,
            35000,
            80000,
            15000,
            4500,
            7500,
            'Usta Ahmet Yılmaz',
            'MASTER USTA ÖNERİSİ',
            'F30 sahipleri en çok turboyu yağsız bırakmaktan dolayı bize gelir. Turbo ömrünü %50 artırmak istiyorsanız: Motoru çalıştırdıktan sonra 1 dakika rölantide bekleyin, durmadan önce de yine 1 dakika soğumasına izin verin. Yağ değişim aralığını asla 10 bin kilometrenin üzerine çıkarmayın.',
            null,
            null
        )
        on conflict (generation_id, part_slug) do nothing;
    end if;
end $$;
