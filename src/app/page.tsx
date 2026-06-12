import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import HomeSearch from '@/components/HomeSearch'
import { createClient } from '@/lib/supabase-server'
import { mockBrands, mockReviews, mockProblemReports } from '@/lib/mock-data'
import { Brand } from '@/types/database'

// Verileri çek veya mock kullan
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

export default async function HomePage() {
  const { brands, reviews, recentProblems } = await getHomepageData()

  // Trustpilot tarzı yeşil yıldızlar
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1 text-trust-green">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className="material-symbols-outlined" 
            style={{ fontVariationSettings: i < rating ? "'FILL' 1" : "'FILL' 0" }}
          >
            star
          </span>
        ))}
      </div>
    )
  }

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary-container text-on-primary py-24 overflow-hidden">
        <div className="max-w-max-width mx-auto px-margin-desktop relative z-10 text-center">
          <h1 className="font-display-lg text-display-lg mb-8 leading-tight">Aracını Sor, Gerçeği Öğren</h1>
          <p className="font-body-lg text-body-lg text-surface-variant mb-12 max-w-2xl mx-auto">
            Binlerce kullanıcı deneyimi ve teknik raporlarla otomobil dünyasının şeffaf yüzü. İlan linkini yapıştır, yapay zeka analiz etsin.
          </p>
          <HomeSearch />
        </div>
      </section>

      <main className="max-width mx-auto px-margin-desktop py-12 flex gap-gutter max-w-max-width">
        {/* SideNavBar (Filter Drawer) */}
        <aside className="bg-surface-container-low dark:bg-primary-container h-screen w-[300px] sticky top-20 hidden lg:block border-r border-border-low dark:border-outline-variant flex flex-col p-gutter space-y-4 rounded-xl overflow-y-auto">
          <div className="mb-6">
            <h3 className="font-title-md text-title-md text-on-surface dark:text-on-primary">Detaylı Filtreler</h3>
            <p className="font-label-md text-label-md text-on-surface-variant opacity-70">Araç sonuçlarını daraltın</p>
          </div>
          <nav className="space-y-1">
            <Link className="bg-secondary-container dark:bg-secondary text-on-secondary-container dark:text-on-secondary rounded-lg font-bold flex items-center gap-3 p-3 transition-transform translate-x-1" href="/arama">
              <span className="material-symbols-outlined">calendar_today</span>
              <span className="font-label-md text-label-md">Model Yılı</span>
            </Link>
            <Link className="text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-primary-fixed-variant flex items-center gap-3 p-3 rounded-lg transition-all" href="/arama">
              <span className="material-symbols-outlined">ev_station</span>
              <span className="font-label-md text-label-md">Yakıt Tipi</span>
            </Link>
            <Link className="text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-primary-fixed-variant flex items-center gap-3 p-3 rounded-lg transition-all" href="/arama">
              <span className="material-symbols-outlined">settings_input_component</span>
              <span className="font-label-md text-label-md">Şanzıman</span>
            </Link>
            <Link className="text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-primary-fixed-variant flex items-center gap-3 p-3 rounded-lg transition-all" href="/arama">
              <span className="material-symbols-outlined">enable</span>
              <span className="font-label-md text-label-md">Motor Hacmi</span>
            </Link>
            <Link className="text-on-surface-variant dark:text-outline-variant hover:bg-surface-variant dark:hover:bg-on-primary-fixed-variant flex items-center gap-3 p-3 rounded-lg transition-all" href="/arama">
              <span className="material-symbols-outlined">settings_input_antenna</span>
              <span className="font-label-md text-label-md">Çekiş Tipi</span>
            </Link>
          </nav>
          <Link href="/arama" className="mt-8 bg-primary text-on-primary w-full py-4 rounded-xl font-label-md text-label-md hover:opacity-90 transition-all block text-center">
            Filtreleri Uygula
          </Link>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 space-y-12 min-w-0">
          {/* AI Link Analysis */}
          <section className="bg-white border border-border-low rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center text-secondary-container">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h2 className="font-title-md text-title-md">AI İlan Analizi</h2>
                <p className="font-body-md text-body-md text-on-surface-variant">İlan linkini girin, AI teknik durumu ve piyasayı özetlesin.</p>
              </div>
            </div>
            <form action="/ai-analiz" method="GET" className="flex gap-4">
              <input 
                name="url" 
                className="flex-1 bg-surface-container-low border border-border-low rounded-lg px-4 py-3 outline-none focus:border-primary transition-all font-body-md text-body-md" 
                placeholder="https://www.sahibinden.com/ilan/..." 
                type="text"
              />
              <button type="submit" className="bg-primary text-on-primary px-8 rounded-lg font-label-md text-label-md hover:bg-opacity-95 active:scale-95 transition-all">Analiz Et</button>
            </form>
          </section>

          {/* Popular Brands */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-title-md text-title-md">Popüler Markalar</h2>
              <Link className="text-secondary font-label-md text-label-md hover:underline" href="/arama">Tümünü Gör</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {brands.map((brand) => {
                const localLogo = `/logos/${brand.slug.toLowerCase()}.svg`
                return (
                  <Link
                    key={brand.id}
                    href={`/arac/${brand.slug}`}
                    className="bg-white border border-border-low p-6 rounded-xl text-center hover:shadow-md transition-all group cursor-pointer"
                  >
                    <img 
                      alt={brand.name} 
                      className="w-12 h-12 mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all object-contain" 
                      src={localLogo}
                      onError={(e) => {
                        // Fallback if logo doesn't exist
                        e.currentTarget.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuAG0o0dfPguWsaNdUHCddE2nvQfUcx1794MJeRkZSlTP48-nUOGpDrcSfx1p5fH-uAG1FHJkMZI6maSsX4jk3GJcfrP6u3t7KTGGNbEDSGPsO8Z4v8A_2ggfKMbFOTLug75HTA-lYYna4OBca_B7NT0HUI_hvh5tbg5Tec23nGdizT5ClK6yqFgDOfvatS0y_d43RweYxcv_8RHF-ui3eIJHWUDGQzoGmnsP-GeNLZNu8zEPsM0LXnzeyDBQLaf9mFQ55Enj3ielzA"
                      }}
                    />
                    <span className="font-label-md text-label-md text-on-surface">{brand.name}</span>
                  </Link>
                )
              })}
            </div>
          </section>

          {/* Warning Highlight Component */}
          {recentProblems.length > 0 && (
            <section className="bg-orange-50 border-l-4 border-secondary p-6 rounded-r-xl">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-[24px]">report_problem</span>
                <div>
                  <h4 className="font-label-md text-label-md text-secondary">Kronik Sorun Alarmı: {recentProblems[0].generations?.models?.brands?.name || 'BMW'} {recentProblems[0].title}</h4>
                  <p className="font-caption text-caption text-on-surface-variant mt-1">{recentProblems[0].description}</p>
                </div>
              </div>
            </section>
          )}

          {/* Community Reviews */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-title-md text-title-md">Son Kullanıcı Değerlendirmeleri</h2>
              <Link href="/arama" className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-opacity-95 transition-all">
                <span className="material-symbols-outlined text-[18px]">add</span> Deneyimini Paylaş
              </Link>
            </div>
            <div className="space-y-4">
              {reviews.map((rev: any) => {
                const total = 
                  rev.rating_engine + 
                  rev.rating_gearbox + 
                  rev.rating_electric + 
                  rev.rating_fuel + 
                  rev.rating_comfort + 
                  rev.rating_parts + 
                  rev.rating_mechanic
                const avgRating = (total / 7).toFixed(1)
                
                const genName = rev.generations?.name || 'F30'
                const modelName = rev.generations?.models?.name || '3 Serisi'
                const brandName = rev.generations?.models?.brands?.name || 'BMW'

                return (
                  <article key={rev.id} className="bg-white border border-border-low p-6 rounded-xl hover:border-secondary transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center gap-1 text-trust-green">
                        {renderStars(Math.round(parseFloat(avgRating)))}
                        <span className="ml-2 text-on-surface font-label-md text-label-md">{avgRating} / 5</span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant">
                        {new Date(rev.created_at || '2026-06-12').toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <h3 className="font-title-md text-title-md mb-2">{brandName} {modelName} {genName} Deneyimi</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4">
                      {rev.content}
                    </p>
                    <div className="flex justify-between items-center pt-4 border-t border-border-low">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary">
                          {(rev.profiles?.username || 'U')[0].toUpperCase()}
                        </div>
                        <span className="font-label-md text-label-md">@{rev.profiles?.username || 'user'}</span>
                        <span className="bg-trust-green/10 text-trust-green px-2 py-0.5 rounded text-[10px] font-bold uppercase">Doğrulanmış Sahibi</span>
                      </div>
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                          <span className="text-[12px]">24</span>
                        </button>
                        <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                          <span className="text-[12px]">3</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Top Experts */}
          <section className="pb-12">
            <h2 className="font-title-md text-title-md mb-6">Topluluk Uzmanları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-primary-container text-on-primary p-6 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-black transition-all">
                <div className="relative">
                  <img alt="Usta" className="w-16 h-16 rounded-full object-cover border-2 border-secondary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCEZoNKuZEIDAyWkGovLRyAIzKQbu2mUsHlgnV46eC56vrBAc2Cbzp1KNj8a4UZznfh0dSusv45DySdaStB7Mn7et5vEOoKBHsZiGCpy-oI8BcUvt4ivPlx3YUoc1S6Ag9HCg6URJp4OE-QDt8CeOX_z-0QEsRpucwo9kO6FUkYt4lVwXwwttDe3q6ph7ZgaDmY6fTuTA_nKgLERlQ5bmpmwXeKVYMb-PptBJ6a6aTQIeztRsWOkWenaoupHBLEv8yHbIDvYpiLsbw"/>
                  <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container p-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md">Usta Selim Y.</h4>
                  <p className="font-caption text-caption opacity-70">25+ Yıl Motor Mekanik Uzmanı</p>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">BMW UZMANI</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">1.2B CEVAP</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-primary-container text-on-primary p-6 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-black transition-all">
                <div className="relative">
                  <img alt="Expert" className="w-16 h-16 rounded-full object-cover border-2 border-secondary-container" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA94PpYFl9s16bPekLsOvSEfrm9MkWFyjleDFTPNZ0lh2IaZHuSIONptjRqvHZXytD1vbm0MxTm7fA4PYsfl_6MQ1YxCWN6jwqAON9PZ1Q-w6gOzDlycMyEpnyr6kETclL7xi0L3xwx4bAlmVw4vh01k8XKa8zYZohSobLojj1iAPlrG4wgaGJa5XzxVd_N-G4C5gvUbO1RPkEVvXJ_0ig8SCuyIe2u8tfXCX31OuyWfeX4iQeogVpVLxASA0uutwEmXyJRyEhlv4"/>
                  <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container p-0.5 rounded-full">
                    <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-label-md text-label-md">Expert Ayşe B.</h4>
                  <p className="font-caption text-caption opacity-70">Ekspertiz ve Piyasa Analisti</p>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">VAG GRUBU</span>
                    <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold">900+ CEVAP</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  )
}

