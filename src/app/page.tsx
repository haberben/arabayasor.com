import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HomeSearch from '@/components/HomeSearch'
import { createClient } from '@/lib/supabase-server'
import { mockBrands, mockReviews, mockProblemReports } from '@/lib/mock-data'
import { Brand } from '@/types/database'

async function getHomepageData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return {
      brands: mockBrands,
      reviews: mockReviews,
      recentProblems: mockProblemReports.slice(0, 5)
    }
  }

  try {
    const supabase = await createClient()
    const { data: brands } = await supabase.from('brands').select('*').limit(6)
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, profiles(*), generations(*, models(*, brands(*)))')
      .order('created_at', { ascending: false })
      .limit(3)
    const { data: problems } = await supabase
      .from('problem_reports')
      .select('*, generations(*, models(*, brands(*)))')
      .limit(5)

    return {
      brands: brands && brands.length > 0 ? (brands as Brand[]) : mockBrands,
      reviews: reviews && reviews.length > 0 ? (reviews as any[]) : mockReviews,
      recentProblems: problems && problems.length > 0 ? (problems as any[]) : mockProblemReports.slice(0, 5)
    }
  } catch (err) {
    console.error('Supabase fetching failed, using mock data:', err)
    return {
      brands: mockBrands,
      reviews: mockReviews,
      recentProblems: mockProblemReports.slice(0, 5)
    }
  }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <span
          key={i}
          className="material-symbols-outlined text-[18px]"
          style={{
            color: i < rating ? 'var(--success)' : 'var(--border-hover)',
            fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0"
          }}
        >
          star
        </span>
      ))}
    </div>
  )
}

const STAT_ITEMS = [
  { value: '12.400+', label: 'Kayıtlı Araç' },
  { value: '84.000+', label: 'Kullanıcı Yorumu' },
  { value: '3.200+', label: 'Kronik Sorun' },
  { value: '4.8★', label: 'Ortalama Puan' },
]

const FILTER_LINKS = [
  { icon: 'calendar_today', label: 'Model Yılı' },
  { icon: 'ev_station', label: 'Yakıt Tipi' },
  { icon: 'settings_input_component', label: 'Şanzıman' },
  { icon: 'enable', label: 'Motor Hacmi' },
  { icon: 'settings_input_antenna', label: 'Çekiş Tipi' },
]

export default async function HomePage() {
  const { brands, reviews, recentProblems } = await getHomepageData()

  return (
    <>
      <Navbar />

      {/* ================================================
          HERO SECTION
          ================================================ */}
      <section className="hero-bg relative py-24 md:py-32">
        <div className="relative z-10 mx-auto max-w-[1400px] px-4 md:px-8 text-center">

          {/* Eyebrow Badge */}
          <div className="animate-fade-in-up inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8"
            style={{ background: 'rgba(254,166,25,0.12)', borderColor: 'rgba(254,166,25,0.3)', color: '#fea619' }}
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            <span className="text-xs font-bold tracking-wider uppercase">Türkiye'nin #1 Otomobil Platformu</span>
          </div>

          {/* Hero Headline */}
          <h1
            className="animate-fade-in-up animate-delay-100 font-black tracking-tight mb-6 mx-auto max-w-3xl leading-[1.1]"
            style={{ fontSize: 'clamp(2.2rem, 5vw, 3.75rem)', color: '#ffffff' }}
          >
            Aracını Sor,{' '}
            <span style={{ color: 'var(--accent)' }}>Gerçeği</span>{' '}
            Öğren
          </h1>

          {/* Hero Subtitle */}
          <p
            className="animate-fade-in-up animate-delay-200 text-base md:text-lg mb-10 mx-auto max-w-xl leading-relaxed"
            style={{ color: 'rgba(200, 215, 235, 0.8)' }}
          >
            Binlerce kullanıcı deneyimi ve teknik raporlarla otomobil dünyasının şeffaf yüzü.
            İlan linkini yapıştır, yapay zeka analiz etsin.
          </p>

          {/* Search Box */}
          <div className="animate-fade-in-up animate-delay-300">
            <HomeSearch />
          </div>

          {/* Stats Row */}
          <div className="animate-fade-in-up animate-delay-300 flex flex-wrap justify-center gap-6 md:gap-10 mt-12">
            {STAT_ITEMS.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-black" style={{ color: 'var(--accent)' }}>{stat.value}</div>
                <div className="text-xs font-medium mt-0.5" style={{ color: 'rgba(180,200,225,0.7)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================
          MAIN CONTENT
          ================================================ */}
      <main
        className="mx-auto max-w-[1400px] px-4 md:px-8 py-12 flex gap-8"
        style={{ alignItems: 'flex-start' }}
      >

        {/* ── SIDEBAR ── */}
        <aside
          className="hidden lg:flex flex-col w-[260px] shrink-0 sticky top-20 rounded-2xl border overflow-hidden"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', maxHeight: 'calc(100vh - 100px)' }}
        >
          {/* Sidebar Header */}
          <div className="px-5 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
            <h3 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>Detaylı Filtreler</h3>
            <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>Araç sonuçlarını daraltın</p>
          </div>

          {/* Sidebar Links */}
          <nav className="p-3 flex flex-col gap-0.5 flex-1 overflow-y-auto custom-scrollbar">
            {FILTER_LINKS.map((item, i) => (
              <Link
                key={item.label}
                href="/arama"
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                  i === 0 ? 'font-bold' : 'hover:bg-[var(--surface)]'
                }`}
                style={{
                  background: i === 0 ? 'var(--accent-subtle)' : undefined,
                  color: i === 0 ? 'var(--accent)' : 'var(--muted)',
                }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: i === 0 ? 'var(--accent)' : 'var(--muted-foreground)' }}
                >
                  {item.icon}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Apply Button */}
          <div className="p-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <Link
              href="/arama"
              className="btn-primary block w-full text-center py-3 rounded-xl text-sm"
            >
              Filtreleri Uygula
            </Link>
          </div>
        </aside>

        {/* ── MAIN FEED ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-10">

          {/* AI İlan Analizi */}
          <section
            className="rounded-2xl border p-6 md:p-8 relative overflow-hidden"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {/* Decorative glow */}
            <div
              className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: 'radial-gradient(circle, rgba(254,166,25,0.06) 0%, transparent 70%)',
                transform: 'translate(30%, -30%)'
              }}
            />
            <div className="relative z-10">
              <div className="flex items-start gap-4 mb-6">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl"
                  style={{ background: 'var(--accent-subtle)', border: '1px solid rgba(254,166,25,0.25)' }}
                >
                  <span
                    className="material-symbols-outlined text-[22px]"
                    style={{ color: 'var(--accent)', fontVariationSettings: "'FILL' 1" }}
                  >
                    auto_awesome
                  </span>
                </div>
                <div>
                  <h2 className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>AI İlan Analizi</h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--muted)' }}>
                    İlan linkini girin, AI teknik durumu ve piyasayı özetlesin.
                  </p>
                </div>
              </div>
              <form action="/ai-analiz" method="GET" className="flex gap-3">
                <input
                  name="url"
                  className="themed-input flex-1"
                  placeholder="https://www.sahibinden.com/ilan/..."
                  type="text"
                />
                <button
                  type="submit"
                  className="btn-accent shrink-0 px-6 py-2.5 rounded-xl text-sm font-bold"
                >
                  Analiz Et
                </button>
              </form>
            </div>
          </section>

          {/* Popüler Markalar */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">Popüler Markalar</h2>
              <Link
                href="/arama"
                className="text-sm font-semibold transition-colors hover:opacity-80"
                style={{ color: 'var(--accent)' }}
              >
                Tümünü Gör →
              </Link>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {brands.map((brand) => {
                const localLogo = `/logos/${brand.slug.toLowerCase()}.svg`
                return (
                  <Link
                    key={brand.id}
                    href={`/arac/${brand.slug}`}
                    className="premium-card flex flex-col items-center justify-center gap-3 p-4 cursor-pointer"
                  >
                    <img
                      alt={brand.name}
                      className="w-10 h-10 object-contain grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all"
                      src={brand.logo_url || localLogo}
                    />
                    <span
                      className="text-xs font-semibold text-center truncate w-full"
                      style={{ color: 'var(--foreground)' }}
                    >
                      {brand.name}
                    </span>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Kronik Sorun Alarmı */}
          {recentProblems.length > 0 && (
            <section
              className="rounded-2xl border-l-4 p-5 flex items-start gap-4"
              style={{
                background: 'rgba(254,166,25,0.05)',
                borderLeftColor: 'var(--accent)',
                border: '1px solid rgba(254,166,25,0.15)',
                borderLeft: '4px solid var(--accent)'
              }}
            >
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: 'rgba(254,166,25,0.12)' }}
              >
                <span
                  className="material-symbols-outlined text-[20px]"
                  style={{ color: 'var(--accent)', fontVariationSettings: "'FILL' 1" }}
                >
                  report_problem
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--accent)' }}>
                    Kronik Sorun Alarmı
                  </span>
                </div>
                <h4 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                  {recentProblems[0].generations?.models?.brands?.name || 'BMW'} — {recentProblems[0].title}
                </h4>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: 'var(--muted)' }}>
                  {recentProblems[0].description}
                </p>
              </div>
            </section>
          )}

          {/* Son Kullanıcı Değerlendirmeleri */}
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="section-title">Son Kullanıcı Değerlendirmeleri</h2>
              <Link
                href="/arama"
                className="flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-semibold transition-all hover:bg-[var(--surface)]"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <span className="material-symbols-outlined text-[16px]" style={{ color: 'var(--accent)' }}>add</span>
                Deneyimini Paylaş
              </Link>
            </div>

            <div className="flex flex-col gap-4">
              {reviews.map((rev: any) => {
                const total =
                  (rev.rating_engine || 0) +
                  (rev.rating_gearbox || 0) +
                  (rev.rating_electric || 0) +
                  (rev.rating_fuel || 0) +
                  (rev.rating_comfort || 0) +
                  (rev.rating_parts || 0) +
                  (rev.rating_mechanic || 0)
                const avgRating = (total / 7).toFixed(1)

                const genName = rev.generations?.name || 'F30'
                const modelName = rev.generations?.models?.name || '3 Serisi'
                const brandName = rev.generations?.models?.brands?.name || 'BMW'

                return (
                  <article
                    key={rev.id}
                    className="premium-card p-5 md:p-6"
                  >
                    {/* Review Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex flex-col gap-1">
                        <StarRating rating={Math.round(parseFloat(avgRating))} />
                        <span className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>
                          {avgRating} / 5
                        </span>
                      </div>
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {new Date(rev.created_at || '2026-06-12').toLocaleDateString('tr-TR')}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-base font-bold mb-2" style={{ color: 'var(--foreground)' }}>
                      {brandName} {modelName} {genName} Deneyimi
                    </h3>

                    {/* Content */}
                    <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
                      {rev.content}
                    </p>

                    {/* Footer */}
                    <div
                      className="flex items-center justify-between pt-4 border-t"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg font-bold text-sm"
                          style={{ background: 'var(--surface)', color: 'var(--foreground)' }}
                        >
                          {(rev.profiles?.username || 'U')[0].toUpperCase()}
                        </div>
                        <div>
                          <span className="text-sm font-semibold block" style={{ color: 'var(--foreground)' }}>
                            @{rev.profiles?.username || 'user'}
                          </span>
                        </div>
                        <span className="trust-badge">Doğrulanmış</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-[var(--accent)]"
                          style={{ color: 'var(--muted)' }}
                        >
                          <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                          24
                        </button>
                        <button
                          className="flex items-center gap-1 text-xs font-medium transition-colors hover:text-[var(--accent)]"
                          style={{ color: 'var(--muted)' }}
                        >
                          <span className="material-symbols-outlined text-[16px]">chat_bubble</span>
                          3
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Topluluk Uzmanları */}
          <section className="pb-4">
            <h2 className="section-title mb-5">Topluluk Uzmanları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Usta Selim Y.',
                  role: '25+ Yıl Motor Mekanik Uzmanı',
                  tags: ['BMW Uzmanı', '1.2B Cevap'],
                  src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEZoNKuZEIDAyWkGovLRyAIzKQbu2mUsHlgnV46eC56vrBAc2Cbzp1KNj8a4UZznfh0dSusv45DySdaStB7Mn7et5vEOoKBHsZiGCpy-oI8BcUvt4ivPlx3YUoc1S6Ag9HCg6URJp4OE-QDt8CeOX_z-0QEsRpucwo9kO6FUkYt4lVwXwwttDe3q6ph7ZgaDmY6fTuTA_nKgLERlQ5bmpmwXeKVYMb-PptBJ6a6aTQIeztRsWOkWenaoupHBLEv8yHbIDvYpiLsbw'
                },
                {
                  name: 'Expert Ayşe B.',
                  role: 'Ekspertiz ve Piyasa Analisti',
                  tags: ['VAG Grubu', '900+ Cevap'],
                  src: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA94PpYFl9s16bPekLsOvSEfrm9MkWFyjleDFTPNZ0lh2IaZHuSIONptjRqvHZXytD1vbm0MxTm7fA4PYsfl_6MQ1YxCWN6jwqAON9PZ1Q-w6gOzDlycMyEpnyr6kETclL7xi0L3xwx4bAlmVw4vh01k8XKa8zYZohSobLojj1iAPlrG4wgaGJa5XzxVd_N-G4C5gvUbO1RPkEVvXJ_0ig8SCuyIe2u8tfXCX31OuyWfeX4iQeogVpVLxASA0uutwEmXyJRyEhlv4'
                }
              ].map((expert) => (
                <div
                  key={expert.name}
                  className="premium-card flex items-center gap-4 p-5 cursor-pointer group"
                >
                  <div className="relative shrink-0">
                    <img
                      alt={expert.name}
                      className="w-14 h-14 rounded-xl object-cover border-2"
                      style={{ borderColor: 'var(--accent)' }}
                      src={expert.src}
                    />
                    <div
                      className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2"
                      style={{ background: 'var(--success)', borderColor: 'var(--card)' }}
                    >
                      <span
                        className="material-symbols-outlined text-[13px] text-white"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        verified
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{expert.name}</h4>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--muted)' }}>{expert.role}</p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {expert.tags.map((tag) => (
                        <span key={tag} className="accent-badge">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <span
                    className="material-symbols-outlined text-[20px] opacity-0 group-hover:opacity-100 transition-all group-hover:translate-x-1"
                    style={{ color: 'var(--accent)' }}
                  >
                    arrow_forward
                  </span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}
