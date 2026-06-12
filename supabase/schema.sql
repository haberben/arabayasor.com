-- -------------------------------------------------------------
-- arabayasor.com Supabase Veritabanı Şeması
-- -------------------------------------------------------------

-- Gerekli eklentileri (extensions) etkinleştirme
create extension if not exists "uuid-ossp";

-- 1. PROFILLER TABLOSU (Supabase Auth ile entegre)
create table public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique not null,
    full_name text,
    avatar_url text,
    role text not null default 'Yeni Üye', -- Yeni Üye, Aktif Üye, Uzman Kullanıcı, Usta, Master Usta, Efsane Usta
    xp integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) ayarları
alter table public.profiles enable row level security;

create policy "Herkes profilleri görüntüleyebilir" on public.profiles
    for select using (true);

create policy "Kullanıcılar kendi profillerini güncelleyebilir" on public.profiles
    for update using (auth.uid() = id);

-- Yeni kullanıcı kaydolduğunda otomatik profil oluşturan trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, avatar_url, role, xp)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', ''),
    'Yeni Üye',
    0
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. MARKALAR TABLOSU (Brands)
create table public.brands (
    id uuid default gen_random_uuid() primary key,
    name text unique not null,
    slug text unique not null,
    logo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.brands enable row level security;
create policy "Herkes markaları görüntüleyebilir" on public.brands for select using (true);
create policy "Yalnızca adminler markaları düzenleyebilir" on public.brands for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('Master Usta', 'Efsane Usta'))
);


-- 3. MODELLER TABLOSU (Models)
create table public.models (
    id uuid default gen_random_uuid() primary key,
    brand_id uuid references public.brands(id) on delete cascade not null,
    name text not null,
    slug text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(brand_id, slug)
);

alter table public.models enable row level security;
create policy "Herkes modelleri görüntüleyebilir" on public.models for select using (true);
create policy "Yalnızca adminler modelleri düzenleyebilir" on public.models for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('Master Usta', 'Efsane Usta'))
);


-- 4. KASALAR/NESİLLER TABLOSU (Generations)
create table public.generations (
    id uuid default gen_random_uuid() primary key,
    model_id uuid references public.models(id) on delete cascade not null,
    name text not null, -- Örn: E90, F30, G20
    slug text not null,
    years text not null, -- Örn: "2005 - 2013"
    engines jsonb not null default '[]'::jsonb, -- Motor seçenekleri listesi
    buying_guide text, -- Satın alma rehberi ("Dikkat edilmesi gerekenler" md)
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(model_id, slug)
);

alter table public.generations enable row level security;
create policy "Herkes kasaları görüntüleyebilir" on public.generations for select using (true);
create policy "Yalnızca adminler kasaları düzenleyebilir" on public.generations for all using (
    exists (select 1 from public.profiles where id = auth.uid() and role in ('Master Usta', 'Efsane Usta'))
);


-- 5. DEĞERLENDİRMELER TABLOSU (Reviews)
create table public.reviews (
    id uuid default gen_random_uuid() primary key,
    generation_id uuid references public.generations(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    rating_engine integer not null check (rating_engine between 1 and 5),
    rating_gearbox integer not null check (rating_gearbox between 1 and 5),
    rating_electric integer not null check (rating_electric between 1 and 5),
    rating_fuel integer not null check (rating_fuel between 1 and 5),
    rating_comfort integer not null check (rating_comfort between 1 and 5),
    rating_parts integer not null check (rating_parts between 1 and 5),
    rating_mechanic integer not null check (rating_mechanic between 1 and 5),
    content text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(generation_id, user_id) -- Her kullanıcı bir kasaya en fazla 1 kez inceleme yazabilir
);

alter table public.reviews enable row level security;
create policy "Herkes incelemeleri görüntüleyebilir" on public.reviews for select using (true);
create policy "Giriş yapan kullanıcılar inceleme yazabilir" on public.reviews for insert with check (auth.uid() = user_id);
create policy "Kullanıcılar kendi incelemelerini güncelleyebilir/silebilir" on public.reviews for all using (auth.uid() = user_id);


-- 6. KRONİK SORUNLAR TABLOSU (Problem Reports)
create table public.problem_reports (
    id uuid default gen_random_uuid() primary key,
    generation_id uuid references public.generations(id) on delete cascade not null,
    title text not null, -- Örn: Yağ eksiltme, Turbo arızası
    description text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(generation_id, title)
);

alter table public.problem_reports enable row level security;
create policy "Herkes kronik sorunları görüntüleyebilir" on public.problem_reports for select using (true);
create policy "Kullanıcılar kronik sorun bildirebilir/ekleyebilir" on public.problem_reports for insert with check (auth.uid() is not null);


-- 7. KRONİK SORUN OYLARI (Problem Votes - 1 vote limit)
create table public.problem_votes (
    id uuid default gen_random_uuid() primary key,
    problem_id uuid references public.problem_reports(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    vote_type boolean not null default true, -- true = bu sorun var, false = bu sorun yok/görmedim
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(problem_id, user_id) -- Tek oy kuralı
);

alter table public.problem_votes enable row level security;
create policy "Herkes kronik sorun oylarını görüntüleyebilir" on public.problem_votes for select using (true);
create policy "Giriş yapanlar oy verebilir" on public.problem_votes for insert with check (auth.uid() = user_id);
create policy "Kullanıcılar kendi oylarını silebilir/değiştirebilir" on public.problem_votes for all using (auth.uid() = user_id);


-- 8. YORUMLAR TABLOSU (Comments for reviews)
create table public.comments (
    id uuid default gen_random_uuid() primary key,
    review_id uuid references public.reviews(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    content text not null,
    is_pinned boolean not null default false,
    likes integer not null default 0,
    dislikes integer not null default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.comments enable row level security;
create policy "Herkes yorumları görüntüleyebilir" on public.comments for select using (true);
create policy "Giriş yapanlar yorum yazabilir" on public.comments for insert with check (auth.uid() = user_id);
create policy "Kullanıcılar kendi yorumlarını güncelleyebilir veya silebilir" on public.comments for all using (auth.uid() = user_id);


-- 9. YORUM BEĞENİ/OY TABLOSU (Comment Votes)
create table public.comment_votes (
    id uuid default gen_random_uuid() primary key,
    comment_id uuid references public.comments(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    vote_type text not null check (vote_type in ('like', 'dislike')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(comment_id, user_id)
);

alter table public.comment_votes enable row level security;
create policy "Herkes yorum oylarını görüntüleyebilir" on public.comment_votes for select using (true);
create policy "Giriş yapanlar yorum oylayabilir" on public.comment_votes for insert with check (auth.uid() = user_id);
create policy "Kullanıcılar kendi yorum oylarını güncelleyebilir/silebilir" on public.comment_votes for all using (auth.uid() = user_id);


-- 10. ROZETLER TABLOSU (Badges)
create table public.badges (
    id uuid default gen_random_uuid() primary key,
    name text unique not null,
    description text not null,
    icon text not null, -- Örn: Lucide ikon adı veya emoji
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.badges enable row level security;
create policy "Herkes rozetleri görüntüleyebilir" on public.badges for select using (true);


-- 11. KULLANICI ROZETLERİ (User Badges)
create table public.user_badges (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    badge_id uuid references public.badges(id) on delete cascade not null,
    awarded_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, badge_id)
);

alter table public.user_badges enable row level security;
create policy "Herkes kullanıcı rozetlerini görebilir" on public.user_badges for select using (true);


-- -------------------------------------------------------------
-- OTOMATİK XP, SEVİYE/ROL VE ROZET SİSTEMİ TETİKLEYİCİLERİ (TRIGGERS)
-- -------------------------------------------------------------

-- 1. Rol/Unvan Güncelleme Fonksiyonu
create or replace function public.update_profile_role_based_on_xp(profile_id uuid)
returns void as $$
declare
    current_xp integer;
    new_role text;
begin
    select xp into current_xp from public.profiles where id = profile_id;
    
    if current_xp < 100 then
        new_role := 'Yeni Üye';
    elsif current_xp < 300 then
        new_role := 'Aktif Üye';
    elsif current_xp < 600 then
        new_role := 'Uzman Kullanıcı';
    elsif current_xp < 1000 then
        new_role := 'Usta';
    elsif current_xp < 2000 then
        new_role := 'Master Usta';
    else
        new_role := 'Efsane Usta';
    end if;

    update public.profiles
    set role = new_role
    where id = profile_id;
end;
$$ language plpgsql security definer;


-- 2. Yorum Oyuna Göre Yorum Beğeni Sayılarını ve Yazar XP'sini Güncelleme
create or replace function public.handle_comment_vote()
returns trigger as $$
declare
    comment_author_id uuid;
    like_count integer;
    dislike_count integer;
begin
    -- Yorum yazarını ve güncel oy sayılarını bul
    select user_id into comment_author_id from public.comments where id = new.comment_id;
    
    select count(*) filter (where vote_type = 'like') into like_count 
    from public.comment_votes where comment_id = new.comment_id;
    
    select count(*) filter (where vote_type = 'dislike') into dislike_count 
    from public.comment_votes where comment_id = new.comment_id;

    -- Yorum tablosunu güncelle
    update public.comments
    set likes = like_count, dislikes = dislike_count
    where id = new.comment_id;

    -- Beğeni oyu verildiyse yazara +5 XP ver
    if new.vote_type = 'like' then
        update public.profiles
        set xp = xp + 5
        where id = comment_author_id;
        
        perform public.update_profile_role_based_on_xp(comment_author_id);
    end if;

    return new;
end;
$$ language plpgsql security definer;

create trigger on_comment_vote_inserted
  after insert on public.comment_votes
  for each row execute procedure public.handle_comment_vote();


-- 3. İnceleme Eklendiğinde XP Verme ve Otomatik Rozet Kazanma
create or replace function public.handle_review_xp_and_badges()
returns trigger as $$
declare
    review_count integer;
    badge_id_var uuid;
begin
    -- Yazara +50 XP ekle
    update public.profiles
    set xp = xp + 50
    where id = new.user_id;

    perform public.update_profile_role_based_on_xp(new.user_id);

    -- Kullanıcının toplam inceleme sayısını al
    select count(*) into review_count from public.reviews where user_id = new.user_id;

    -- 1. İlk Yorum/İnceleme Rozeti (İlk Adım Rozeti)
    if review_count = 1 then
        select id into badge_id_var from public.badges where name = 'İlk Adım';
        if badge_id_var is not null then
            insert into public.user_badges (user_id, badge_id) values (new.user_id, badge_id_var)
            on conflict do nothing;
        end if;
    end if;

    -- 2. Otomobil Gurmesi Rozeti (5+ inceleme)
    if review_count >= 5 then
        select id into badge_id_var from public.badges where name = 'Otomobil Gurmesi';
        if badge_id_var is not null then
            insert into public.user_badges (user_id, badge_id) values (new.user_id, badge_id_var)
            on conflict do nothing;
        end if;
    end if;

    return new;
end;
$$ language plpgsql security definer;

create trigger on_review_inserted
  after insert on public.reviews
  for each row execute procedure public.handle_review_xp_and_badges();


-- 4. Yorum Eklendiğinde XP Verme ve Otomatik Rozet
create or replace function public.handle_comment_xp_and_badges()
returns trigger as $$
declare
    comment_count integer;
    badge_id_var uuid;
begin
    -- Yazara +10 XP ekle
    update public.profiles
    set xp = xp + 10
    where id = new.user_id;

    perform public.update_profile_role_based_on_xp(new.user_id);

    -- Kullanıcının toplam yorum sayısını al
    select count(*) into comment_count from public.comments where user_id = new.user_id;

    -- Sosyal Kelebek Rozeti (10+ Yorum)
    if comment_count >= 10 then
        select id into badge_id_var from public.badges where name = 'Sosyal Kelebek';
        if badge_id_var is not null then
            insert into public.user_badges (user_id, badge_id) values (new.user_id, badge_id_var)
            on conflict do nothing;
        end if;
    end if;

    return new;
end;
$$ language plpgsql security definer;

create trigger on_comment_inserted
  after insert on public.comments
  for each row execute procedure public.handle_comment_xp_and_badges();


-- 5. Kronik Sorun Oy Verildiğinde XP Verme
create or replace function public.handle_problem_vote_xp()
returns trigger as $$
begin
    -- Oy verene +5 XP ekle
    update public.profiles
    set xp = xp + 5
    where id = new.user_id;

    perform public.update_profile_role_based_on_xp(new.user_id);
    return new;
end;
$$ language plpgsql security definer;

create trigger on_problem_vote_inserted
  after insert on public.problem_votes
  for each row execute procedure public.handle_problem_vote_xp();


-- -------------------------------------------------------------
-- ÖRNEK BAŞLANGIÇ VERİLERİNİN EKLENMESİ (SEEDS)
-- -------------------------------------------------------------

-- Rozetleri ekle
insert into public.badges (name, description, icon) values
('İlk Adım', 'Platformda ilk araç incelemesini yazdı.', 'CheckCircle'),
('Otomobil Gurmesi', '5 veya daha fazla araca detaylı inceleme yazdı.', 'Award'),
('Sosyal Kelebek', 'Yazılan incelemelere 10 veya daha fazla yorum yaptı.', 'MessageSquare'),
('Kronik Dedektifi', 'Kronik sorun bildiriminde veya oylamasında bulundu.', 'ShieldAlert'),
('Usta Desteği', 'Puanı ve katkılarıyla "Usta" seviyesine yükseldi.', 'Wrench')
on conflict do nothing;

-- Örnek Markaları Ekle
insert into public.brands (name, slug, logo_url) values
('BMW', 'bmw', 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg'),
('Mercedes-Benz', 'mercedes-benz', 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_logo.svg'),
('Audi', 'audi', 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg'),
('Toyota', 'toyota', 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Toyota_EU.svg'),
('Renault', 'renault', 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Renault_2021.svg')
on conflict do nothing;

-- Örnek Modelleri Ekle (BMW için 3 Serisi, Mercedes için C Serisi vb.)
insert into public.models (brand_id, name, slug) values
((select id from public.brands where slug = 'bmw'), '3 Serisi', '3-series'),
((select id from public.brands where slug = 'bmw'), '5 Serisi', '5-series'),
((select id from public.brands where slug = 'mercedes-benz'), 'C Serisi', 'c-class'),
((select id from public.brands where slug = 'mercedes-benz'), 'E Serisi', 'e-class'),
((select id from public.brands where slug = 'audi'), 'A4', 'a4'),
((select id from public.brands where slug = 'audi'), 'A6', 'a6'),
((select id from public.brands where slug = 'toyota'), 'Corolla', 'corolla'),
((select id from public.brands where slug = 'renault'), 'Megane', 'megane')
on conflict do nothing;

-- Örnek Kasaları (Generations) Ekle
insert into public.generations (model_id, name, slug, years, engines, buying_guide) values
(
  (select id from public.models where slug = '3-series' and brand_id = (select id from public.brands where slug = 'bmw')),
  'E90', 'e90', '2005 - 2013',
  '[
    {"name": "320i (2.0L 150hp Atmosferik Benzin)", "fuel": "Benzin", "consumption": "7.9L/100km"},
    {"name": "320d (2.0L 177hp Turbo Dizel)", "fuel": "Dizel", "consumption": "5.7L/100km"},
    {"name": "325i (2.5L 218hp Atmosferik Benzin)", "fuel": "Benzin", "consumption": "8.4L/100km"}
  ]'::jsonb,
  '### E90 Alırken Dikkat Edilmesi Gerekenler
* **N46 Motor Yağ Yakma Problemi**: 320i modellerinde kullanılan N46 motoru, subap lastiklerinin sertleşmesi sonucu yağ yakmaya (duman atmaya) meyillidir.
* **N47 Zincir Sesi**: 320d (177hp/184hp) modellerinde zincir ömrü kısadır. Motorun arka tarafında yer alan zincirden "şırıl şırıl" ses geliyorsa acilen değişmesi gerekir, aksi halde zincir kopabilir.
* **İç Mekan Soyulmaları**: Kapı kolları ve klima tuşlarındaki kaplamalar zamanla soyulur.
* **Direksiyon Kilidi (ELV) Hatası**: Direksiyon kolonundaki kilidin kilitlenip kalması sonucu araç çalışmayabilir.'
),
(
  (select id from public.models where slug = '3-series' and brand_id = (select id from public.brands where slug = 'bmw')),
  'F30', 'f30', '2012 - 2019',
  '[
    {"name": "316i (1.6L 136hp Turbo Benzin - N13)", "fuel": "Benzin", "consumption": "5.9L/100km"},
    {"name": "320d (2.0L 184hp/190hp Turbo Dizel)", "fuel": "Dizel", "consumption": "4.5L/100km"},
    {"name": "320i ED (1.6L 170hp Turbo Benzin - N13)", "fuel": "Benzin", "consumption": "5.4L/100km"}
  ]'::jsonb,
  '### F30 Alırken Dikkat Edilmesi Gerekenler
* **N13 Motor Soğutma Suyu Kaçakları**: Genleşme kabı hortumu ve devirdaim pompası çevresinden su eksiltme kroniktir.
* **N13 Turbo Yağ Dönüş Borusu**: Turbo yağ borusunun tıkanması sonucu egzozdan mavi duman atma görülebilir.
* **Direksiyon Kutusu Tıkırtısı**: Bozuk yollardan geçerken direksiyondan gelen tıkırtı sesi F30''larda yaygındır.'
),
(
  (select id from public.models where slug = 'c-class' and brand_id = (select id from public.brands where slug = 'mercedes-benz')),
  'W204', 'w204', '2007 - 2014',
  '[
    {"name": "C180 Kompressor (1.6L 156hp)", "fuel": "Benzin/LPG", "consumption": "7.5L/100km"},
    {"name": "C220 CDI (2.2L 170hp Turbo Dizel)", "fuel": "Dizel", "consumption": "5.8L/100km"}
  ]'::jsonb,
  '### W204 Alırken Dikkat Edilmesi Gerekenler
* **Eksantrik Dişlileri (Kam Milleri)**: M271 kodlu motorda soğuk çalıştırmada gelen zincir sesi eksantrik dişlilerinin aşındığını gösterir.
* **Arka Taşıyıcı Paslanması**: Tuzlu bölgelerde kullanılan araçlarda arka taşıyıcı (subframe) paslanıp kırılabilir, Mercedes bunu ücretsiz geri çağrıyla değiştirmektedir.'
),
(
  (select id from public.models where slug = 'corolla' and brand_id = (select id from public.brands where slug = 'toyota')),
  'E160 (11. Nesil)', 'e160', '2012 - 2019',
  '[
    {"name": "1.33 Dual VVT-i (99hp Atmosferik)", "fuel": "Benzin/LPG", "consumption": "5.6L/100km"},
    {"name": "1.6 Valvematic (132hp Atmosferik)", "fuel": "Benzin/LPG", "consumption": "6.3L/100km"},
    {"name": "1.4 D-4D (90hp Turbo Dizel)", "fuel": "Dizel", "consumption": "4.1L/100km"}
  ]'::jsonb,
  '### Corolla E160 Alırken Dikkat Edilmesi Gerekenler
* **MultiMode Şanzıman Isınması**: Yarı otomatik (M/M) şanzımanlarda trafikte ısınma ve kendini korumaya alma (N konumuna atma) sorunu görülebilir.
* **Yol Sesi**: Davlumbaz ve taban yalıtımı zayıf olduğu için yüksek hızlarda tekerlek sesi içeriye fazla gelir.'
)
on conflict do nothing;

-- Örnek Kronik Sorunları Ekle
insert into public.problem_reports (generation_id, title, description) values
((select id from public.generations where slug = 'e90'), 'N47 Zincir Kopması', '2.0d motorlarda zincirin uzayıp kopması sonucu ağır motor hasarı.'),
((select id from public.generations where slug = 'e90'), 'N46 Yağ Eksiltme/Subap Keçesi', 'Valvetronic motorlarda subap lastiklerinin sertleşerek egzozdan mavi duman atması.'),
((select id from public.generations where slug = 'f30'), 'N13 Su Eksiltme / Devirdaim', 'Turbo benzinli 1.6 motorlarda plastik su flanşlarının ve boruların gevşeyip sızdırması.'),
((select id from public.generations where slug = 'f30'), 'Direksiyon Kutusu Boşluğu', 'Bozuk yollarda direksiyondan lok lok ses gelmesi.'),
((select id from public.generations where slug = 'w204'), 'M271 Zincir ve Eksantrik Dişlisi', 'Zamanla eksantrik dişlisinin (vanos) aşınması ve soğuk startta ses yapması.')
on conflict do nothing;
