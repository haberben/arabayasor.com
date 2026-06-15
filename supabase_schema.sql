-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- PROFILES TABLE
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    username text unique not null,
    full_name text,
    avatar_url text,
    role text default 'Yeni Üye'::text check (role in ('Yeni Üye', 'Aktif Üye', 'Uzman Kullanıcı', 'Usta', 'Master Usta', 'Efsane Usta')),
    xp integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- BRANDS TABLE
create table if not exists public.brands (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    slug text unique not null,
    logo_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- MODELS TABLE
create table if not exists public.models (
    id uuid default uuid_generate_v4() primary key,
    brand_id uuid references public.brands(id) on delete cascade not null,
    name text not null,
    slug text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(brand_id, slug)
);

-- GENERATIONS TABLE
create table if not exists public.generations (
    id uuid default uuid_generate_v4() primary key,
    model_id uuid references public.models(id) on delete cascade not null,
    name text not null,
    slug text not null,
    years text not null,
    engines jsonb default '[]'::jsonb,
    buying_guide text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(model_id, slug)
);

-- REVIEWS TABLE
create table if not exists public.reviews (
    id uuid default uuid_generate_v4() primary key,
    generation_id uuid references public.generations(id) on delete cascade not null,
    profile_id uuid references public.profiles(id) on delete set null,
    title text not null,
    content text not null,
    rating_engine integer not null check (rating_engine >= 1 and rating_engine <= 5),
    rating_gearbox integer not null check (rating_gearbox >= 1 and rating_gearbox <= 5),
    rating_electric integer default 5 check (rating_electric >= 1 and rating_electric <= 5),
    rating_fuel integer default 5 check (rating_fuel >= 1 and rating_fuel <= 5),
    rating_comfort integer not null check (rating_comfort >= 1 and rating_comfort <= 5),
    rating_parts integer default 5 check (rating_parts >= 1 and rating_parts <= 5),
    rating_mechanic integer default 5 check (rating_mechanic >= 1 and rating_mechanic <= 5),
    rating_overall integer not null check (rating_overall >= 1 and rating_overall <= 5),
    is_anonymous boolean default false,
    engine_details text,
    chronic_issues text[],
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROBLEM REPORTS TABLE (Chronic Issues)
create table if not exists public.problem_reports (
    id uuid default uuid_generate_v4() primary key,
    generation_id uuid references public.generations(id) on delete cascade not null,
    title text not null,
    description text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- PROBLEM VOTES TABLE
create table if not exists public.problem_votes (
    id uuid default uuid_generate_v4() primary key,
    problem_id uuid references public.problem_reports(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    vote_type boolean not null, -- true: Yes, false: No
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(problem_id, user_id)
);

-- COMMENTS TABLE
create table if not exists public.comments (
    id uuid default uuid_generate_v4() primary key,
    review_id uuid references public.reviews(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    content text not null,
    is_pinned boolean default false,
    likes integer default 0,
    dislikes integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- COMMENT VOTES TABLE
create table if not exists public.comment_votes (
    id uuid default uuid_generate_v4() primary key,
    comment_id uuid references public.comments(id) on delete cascade not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    vote_type text check (vote_type in ('like', 'dislike')) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(comment_id, user_id)
);

-- BADGES TABLE
create table if not exists public.badges (
    id uuid default uuid_generate_v4() primary key,
    name text not null,
    description text not null,
    icon text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- USER BADGES TABLE
create table if not exists public.user_badges (
    id uuid default uuid_generate_v4() primary key,
    user_id uuid references public.profiles(id) on delete cascade not null,
    badge_id uuid references public.badges(id) on delete cascade not null,
    awarded_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(user_id, badge_id)
);

-- CREATE INDEXES ON FOREIGN KEYS AND SLUGS FOR HIGHER PERFORMANCE
create index if not exists idx_models_brand_id on public.models(brand_id);
create index if not exists idx_models_slug on public.models(slug);
create index if not exists idx_generations_model_id on public.generations(model_id);
create index if not exists idx_generations_slug on public.generations(slug);
create index if not exists idx_reviews_generation_id on public.reviews(generation_id);
create index if not exists idx_reviews_profile_id on public.reviews(profile_id);
create index if not exists idx_problem_reports_gen_id on public.problem_reports(generation_id);
create index if not exists idx_comments_review_id on public.comments(review_id);

-- TRIGGER FUNCTION TO AUTOMATICALLY SYNC AUTH.USERS TO PUBLIC.PROFILES
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

-- CREATE TRIGGER
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ENABLE ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.brands enable row level security;
alter table public.models enable row level security;
alter table public.generations enable row level security;
alter table public.reviews enable row level security;
alter table public.problem_reports enable row level security;
alter table public.problem_votes enable row level security;
alter table public.comments enable row level security;
alter table public.comment_votes enable row level security;
alter table public.badges enable row level security;
alter table public.user_badges enable row level security;

-- CREATE POLICIES (Allow public read access for catalogs, allow authenticated writes)

-- Brands
create policy "Allow public read access to brands" on public.brands for select using (true);
create policy "Allow authenticated insert to brands" on public.brands for insert with check (auth.role() = 'authenticated');

-- Models
create policy "Allow public read access to models" on public.models for select using (true);
create policy "Allow authenticated insert to models" on public.models for insert with check (auth.role() = 'authenticated');

-- Generations
create policy "Allow public read access to generations" on public.generations for select using (true);
create policy "Allow authenticated insert to generations" on public.generations for insert with check (auth.role() = 'authenticated');

-- Profiles
create policy "Allow public read access to profiles" on public.profiles for select using (true);
create policy "Allow users to update own profile" on public.profiles for update using (auth.uid() = id);

-- Reviews
create policy "Allow public read access to reviews" on public.reviews for select using (true);
create policy "Allow authenticated insert to reviews" on public.reviews for insert with check (auth.role() = 'authenticated');

-- Problem Reports
create policy "Allow public read access to problem_reports" on public.problem_reports for select using (true);

-- Problem Votes
create policy "Allow public read access to problem_votes" on public.problem_votes for select using (true);
create policy "Allow authenticated users to vote" on public.problem_votes for insert with check (auth.role() = 'authenticated');

-- Comments
create policy "Allow public read access to comments" on public.comments for select using (true);
create policy "Allow authenticated users to comment" on public.comments for insert with check (auth.role() = 'authenticated');

-- Badges
create policy "Allow public read access to badges" on public.badges for select using (true);

-- User Badges
create policy "Allow public read access to user_badges" on public.user_badges for select using (true);
