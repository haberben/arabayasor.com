-- =============================================================
-- arabayasor.com VIP & Yedek Parça Mağazası Güncelleme Betiği
-- =============================================================
-- Bu betiği Supabase kontrol panelinizdeki SQL Editor alanına yapıştırıp 
-- "Run" butonuna basarak veritabanı şemanızı ve VIP özelliklerini güncelleyebilirsiniz.

-- 1. PROFILLER TABLOSUNA VIP & KURUMSAL ALANLARIN EKLENMESİ
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_vip boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS is_admin boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS banner_url text,
ADD COLUMN IF NOT EXISTS business_name text,
ADD COLUMN IF NOT EXISTS business_address text,
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision,
ADD COLUMN IF NOT EXISTS social_media jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS profile_views integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS monthly_views integer DEFAULT 0;

-- 2. YEDEK PARÇALAR TABLOSUNUN OLUŞTURULMASI
CREATE TABLE IF NOT EXISTS public.spare_parts (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title text NOT NULL,
    description text,
    price numeric NOT NULL,
    image_url text,
    condition text, -- Yeni, İkinci El, Revizyonlu
    part_number text, -- OEM / Parça Numarası
    brand text, -- Parça markası
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row Level Security (RLS) yetkilendirme ayarları
ALTER TABLE public.spare_parts ENABLE ROW LEVEL SECURITY;

-- Güvenlik Politikaları (Policies)
DROP POLICY IF EXISTS "Herkes yedek parçaları görüntüleyebilir" ON public.spare_parts;
CREATE POLICY "Herkes yedek parçaları görüntüleyebilir" ON public.spare_parts
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Kullanıcılar kendi yedek parçalarını yönetebilir" ON public.spare_parts;
CREATE POLICY "Kullanıcılar kendi yedek parçalarını yönetebilir" ON public.spare_parts
    FOR ALL USING (auth.uid() = user_id);

-- 3. HEDEF KULLANICIYI (ibrahmyldrim@yandex.com) VIP & ADMIN YAPMA VE PROFİLİ DOLDURMA
DO $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Kullanıcı ID'sini e-posta adresinden bul
    SELECT id INTO user_uuid FROM auth.users WHERE email = 'ibrahmyldrim@yandex.com';
    
    IF user_uuid IS NOT NULL THEN
        -- Profili Güncelle
        UPDATE public.profiles 
        SET is_vip = true, 
            is_admin = true, 
            role = 'Master Usta',
            full_name = 'İbrahim Yıldırım',
            username = 'ibrahimyldrim',
            business_name = 'Yıldırım Otomotiv & Yedek Parça',
            business_address = 'Maslak Atatürk Oto Sanayi Sitesi, 2. Kısım, 34398 Sarıyer/İstanbul',
            latitude = 41.1125,
            longitude = 29.0234,
            banner_url = 'https://images.unsplash.com/photo-1617886903355-9354bb57751f?q=80&w=1200&auto=format&fit=crop',
            social_media = '{"instagram": "yildirim_oto_servis", "website": "www.yildirimotomotiv.com", "phone": "0532 123 4567"}'::jsonb,
            profile_views = 1450,
            monthly_views = 320
        WHERE id = user_uuid;
        
        -- Örnek yedek parçaları bu kullanıcıya ata
        INSERT INTO public.spare_parts (user_id, title, description, price, condition, part_number, brand, image_url)
        VALUES 
        (user_uuid, 'BMW F30 Orijinal Sol Xenon Far', '2012-2015 kasa için orijinal sol Xenon mercekli far. Kırık, çatlak yoktur, tüm kulakları sağlamdır.', 18500, 'İkinci El', '63117419619', 'BMW Original', '/cars/f30_headlight.png'),
        (user_uuid, 'VW Golf 7 1.6 TDI Triger Seti (INA)', 'Golf 7 1.6 TDI motorlar için devirdaimli orijinal INA marka triger seti. Kutusu açılmamış sıfır ürün.', 4200, 'Yeni', '530055010', 'INA', '/cars/golf_timing_belt.png'),
        (user_uuid, 'Peugeot 3008 1.5 BlueHDi AdBlue Deposu', 'Makyajlı kasa için sıfır ayarında, üre pompası ve deposu komple set. Revizyonlu ve garantili.', 12500, 'Revizyonlu', '9818559280', 'Peugeot Original', '/cars/peugeot_adblue.png')
        ON CONFLICT DO NOTHING;
        
        RAISE NOTICE 'ibrahmyldrim@yandex.com kullanıcısı başarıyla VIP & Admin yapıldı ve profil verileri dolduruldu.';
    ELSE
        RAISE NOTICE 'ibrahmyldrim@yandex.com kullanıcısı auth.users tablosunda bulunamadı! Lütfen önce sisteme kaydolun.';
    END IF;
END $$;
