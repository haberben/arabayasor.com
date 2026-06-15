import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-server'
import { mockBrands, mockReviews, mockProblemReports, mockModels, mockGenerations } from '@/lib/mock-data'
import { Brand } from '@/types/database'

async function getHomepageData() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    return { brands: mockBrands, reviews: mockReviews, recentProblems: mockProblemReports.slice(0, 1) }
  }

  try {
    const supabase = await createClient()
    const { data: brands } = await supabase.from('brands').select('*').limit(6)
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, profiles(*), generations(*, models(*, brands(*)))')
      .order('created_at', { ascending: false })
      .limit(2)
    const { data: problems } = await supabase
      .from('problem_reports')
      .select('*, generations(*, models(*, brands(*)))')
      .order('yes_votes', { ascending: false })
      .limit(1)

    return {
      brands: brands && brands.length > 0 ? (brands as Brand[]) : mockBrands,
      reviews: reviews && reviews.length > 0 ? (reviews as any[]) : mockReviews,
      recentProblems: problems && problems.length > 0 ? (problems as any[]) : mockProblemReports.slice(0, 1)
    }
  } catch (err) {
    return { brands: mockBrands, reviews: mockReviews, recentProblems: mockProblemReports.slice(0, 1) }
  }
}

function StarRating({ rating, total = 5 }: { rating: number; total?: number }) {
  return (
    <div className="flex items-center gap-1 text-trust-green">
      {Array.from({ length: total }).map((_, i) => {
        const filled = i < Math.floor(rating)
        const half = !filled && i < rating
        return (
          <span
            key={i}
            className="material-symbols-outlined text-[18px]"
            style={{ fontVariationSettings: filled ? "'FILL' 1" : half ? "'FILL' 0.5" : "'FILL' 0'" }}
          >
            {half ? 'star_half' : 'star'}
          </span>
        )
      })}
    </div>
  )
}

function timeAgo(dateStr: string) {
  const d = new Date(dateStr)
  const diff = (Date.now() - d.getTime()) / 1000
  if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`
  return `${Math.floor(diff / 86400)} gün önce`
}

export default async function HomePage() {
  const { brands, reviews, recentProblems } = await getHomepageData()

  const brandLogos: Record<string, string> = {
    bmw: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAG0o0dfPguWsaNdUHCddE2nvQfUcx1794MJeRkZSlTP48-nUOGpDrcSfx1p5fH-uAG1FHJkMZI6maSsX4jk3GJcfrP6u3t7KTGGNbEDSGPsO8Z4v8A_2ggfKMbFOTLug75HTA-lYYna4OBca_B7NT0HUI_hvh5tbg5Tec23nGdizT5ClK6yqFgDOfvatS0y_d43RweYxcv_8RHF-ui3eIJHWUDGQzoGmnsP-GeNLZNu8zEPsM0LXnzeyDBQLaf9mFQ55Enj3ielzA',
    'mercedes-benz': 'https://lh3.googleusercontent.com/aida-public/AB6AXuBbA5LvLLqBjTZHmKkMfUH8t1kMC2Rt1E8uWAjvGVhdjSYI-bBQJUjyl_YBttkXtWkpRBKfpXokN96DMKi90JHSoh39meTprgymx3-rpihdbk7_DSos1LPRh6foznUwumEVK8YZZOilMGB7ZngspJ9QzMC-7vL12WZZG8yc4RxRJsilQjitZGqvqpEwCDBEHKQTEWVzPrK9_4IWkXAeajQqrp18pvJGDwKtRKAi8EZsXqi_hzhRB2VlUDS6hCNDsVfsq6RfNZAKmNk',
    audi: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn3J6N0ZA4yCzgHU6ZCtTrAjYZ_lvT8Q4pe3UibTnnU4vLwWcPviG3c-W68nGxEQfcvBwwkkd3_gx1w1eoLSwAgf8DJSs6RUcgWohr1dawcB2A_4u5qWfz2gg0aFHiKGMeD-mjXLM4pDmjRRxXHrD8qCkLBxfPgSe130AtC-OAY8P5DMfb6249CkmjrlwOYPWUnan0LSVo0ZFIwquzzO3HRdrLELhq8I0KhiC_FvilR4uo8kX9PkttdUcKblBX0uExychuo_XyzyY',
    toyota: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9jZi7665ur0ez_4FxtiPROL-B3OdHys3eOPCWMSPlVBT2DanQsEvT89bAaEcAfNx1jqQyCIZ5Q5CGpyNI6MjHgGBOdA2fq1tgr5OXpcqH-USth3VlFQxDXEsG2QkJ7zu1-H7H2q5GKI2khoxKAbeth8XRjamE0zFZ1-HWAjqQe0Ab91pso4jbTQm2h2TTY7YM7gVzpE9CQ2uZeFLAYRWrKzl2JrwUwJGyBzVD20K5wKusFSS7aNQpabO35iiFyVXo2_zituh_N0s',
    renault: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAbt1lYZ8-eh0ig8zlX5v02_jSJDiABCRI3AGA7ArCDTEfgzK20OBtbCA4CQ-soNFJubudBYus-C6KujQbZqCwL_UuEASEOEJYnPFDIqQrOwG2QJbTt43LO6h8fIpQYC8-2GBPbZeoGCX75htWBfuYX8expHfHESZNuo_07tI_3ANtX7wojjSRROYfB93l5x4_WC3POLbt5E_FSuGvHEALenHrEeyP_QJQTCq3yAROrPlyZu42mMUPpvnPfck04bp1zgFAdX1Ovyl8',
    volkswagen: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVKewkWRb4yKElHUOYi0-hC41aPp4P4Nnu7FKNRaJg5vLDD2Z0t-0CF3QrutliG4bdz4I87eroVYX8XZl5jFxvpinaM4tHfyWRTL0ur1Id-9DRRTcHGySrq4Ufi_aZEnK4REPIvHYtJ1iNUpaksWHrFEDSFBla5JZhjkDlaMsnpxHPh4o5_al371lki4sCOIVSTIz4tuS9XQm63dWna1K8IhXeHMOa94yxaTtPLMfheSwgwknHVm95V3q0194puT94UfkGzOmksQs',
  }

  const getBrandLogo = (slug: string) => brandLogos[slug.toLowerCase()] || brandLogos['bmw']

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-primary-container text-on-primary py-24 overflow-hidden">
        {/* Subtle bg texture */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 20% 50%, #fea619 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4a6cf7 0%, transparent 50%)'
        }} />

        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 relative z-10 text-center">
          <h1 className="font-display-lg text-display-lg mb-8 leading-tight">
            Aracını Sor, Gerçeği Öğren
          </h1>
          <p className="font-body-lg text-body-lg text-surface-variant mb-12 max-w-2xl mx-auto">
            Binlerce kullanıcı deneyimi ve teknik raporlarla otomobil dünyasının şeffaf
            yüzü. İlan linkini yapıştır, yapay zeka analiz etsin.
          </p>

          {/* Search Pill */}
          <div className="max-w-3xl mx-auto relative">
            <form action="/arama" method="get">
              <div className="flex bg-white rounded-full p-1 sm:p-2 shadow-xl focus-within:ring-4 ring-secondary-container/30 transition-all">
                <span className="material-symbols-outlined text-outline ml-2 sm:ml-4 self-center text-[20px] sm:text-[24px]">search</span>
                <input
                  name="q"
                  className="w-full border-none focus:ring-0 text-on-surface font-body-md text-sm sm:text-body-md py-2 px-2 sm:py-4 sm:px-4 bg-transparent outline-none"
                  placeholder="BMW 320i kronik sorunlar"
                  type="text"
                />
                <button
                  type="submit"
                  className="bg-secondary-container text-on-secondary-container px-4 sm:px-8 rounded-full font-label-md text-xs sm:text-label-md hover:scale-105 active:scale-95 transition-all"
                >
                  Ara
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-6">
        {/* Filter Sidebar */}
        <aside className="bg-surface-container-low h-fit w-[280px] sticky top-20 hidden lg:flex flex-col p-4 space-y-1 rounded-xl border border-border-low overflow-y-auto flex-shrink-0">
          <div className="mb-4">
            <h3 className="font-title-md text-title-md text-on-surface flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">tune</span>
              Detaylı Filtreler
            </h3>
            <p className="font-label-md text-label-md text-on-surface-variant opacity-70 mt-1">
              Araç sonuçlarını daraltın
            </p>
          </div>

          <nav className="space-y-1">
            {[
              { icon: 'calendar_today', label: 'Model Yılı', active: false },
              { icon: 'ev_station', label: 'Yakıt Tipi', active: false },
              { icon: 'settings_input_component', label: 'Şanzıman', active: false },
              { icon: 'speed', label: 'Motor Hacmi', active: false },
              { icon: 'settings_input_antenna', label: 'Çekiş Tipi', active: false },
            ].map((item) => (
              <Link
                key={item.label}
                href={`/arama?filter=${item.label}`}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all font-label-md text-label-md ${
                  item.active
                    ? 'bg-secondary-container text-on-secondary-container font-bold translate-x-1'
                    : 'text-on-surface-variant hover:bg-surface-variant'
                }`}
              >
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/arama"
            className="mt-6 bg-primary text-on-primary w-full py-4 rounded-xl font-label-md text-label-md text-center hover:opacity-90 transition-all block"
          >
            Filtreleri Uygula
          </Link>
        </aside>

        {/* Content Area */}
        <div className="flex-1 space-y-12 min-w-0">

          {/* AI Ilan Analizi */}
          <section className="bg-white border border-border-low rounded-xl p-8 shadow-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center text-secondary-container flex-shrink-0">
                <span className="material-symbols-outlined">auto_awesome</span>
              </div>
              <div>
                <h2 className="font-title-md text-title-md text-on-surface">AI İlan Analizi</h2>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">
                  İlan linkini girin, AI teknik durumu ve piyasayı özetlesin.
                </p>
              </div>
            </div>
            <form action="/ai-analiz" method="get" className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <input
                name="url"
                className="flex-1 bg-surface-container-low border border-border-low rounded-lg px-4 py-3 outline-none focus:border-primary transition-all font-body-md text-body-md text-sm"
                placeholder="https://www.sahibinden.com/ilan/..."
                type="text"
              />
              <button
                type="submit"
                className="bg-primary text-on-primary py-3 px-8 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all w-full sm:w-auto text-center"
              >
                Analiz Et
              </button>
            </form>
          </section>

          {/* Popüler Markalar */}
          <section>
            <div className="flex justify-between items-end mb-6">
              <h2 className="font-title-md text-title-md text-on-surface">Popüler Markalar</h2>
              <Link href="/arama" className="text-secondary font-label-md text-label-md hover:underline">
                Tümünü Gör
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {brands.slice(0, 6).map((brand: any) => (
                <Link
                  key={brand.id}
                  href={`/arac/${brand.slug}`}
                  className="bg-white border border-border-low p-3 sm:p-5 rounded-xl text-center hover:shadow-md transition-all group cursor-pointer"
                >
                  <img
                    alt={brand.name}
                    src={getBrandLogo(brand.slug)}
                    className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 grayscale group-hover:grayscale-0 transition-all object-contain"
                  />
                  <span className="font-label-md text-label-md text-on-surface text-xs block truncate">{brand.name}</span>
                </Link>
              ))}
            </div>
          </section>

          {/* Kronik Sorun Alarmı */}
          {recentProblems.length > 0 && (
            <section className="bg-orange-50 border-l-4 border-secondary p-6 rounded-r-xl">
              <div className="flex gap-4">
                <span className="material-symbols-outlined text-secondary text-[24px] flex-shrink-0">report_problem</span>
                <div>
                  <h4 className="font-label-md text-label-md text-secondary">
                    Kronik Sorun Alarmı: {recentProblems[0]?.title || 'BMW N47 Motor'}
                  </h4>
                  <p className="font-caption text-caption text-on-surface-variant mt-1 text-sm">
                    {recentProblems[0]?.description || 'Bu motor tipinde zincir kopma riski raporlanmıştır. 150.000 km üstü araçlarda kontrol önerilir.'}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Son Kullanıcı Değerlendirmeleri */}
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-title-md text-title-md text-on-surface">Son Kullanıcı Değerlendirmeleri</h2>
              <Link
                href="/deneyim-paylas"
                className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:opacity-90 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Deneyimini Paylaş
              </Link>
            </div>

            <div className="space-y-4">
              {reviews.slice(0, 2).map((review: any) => {
                const avgRating = Math.round(
                  ((review.rating_engine || 4) + (review.rating_gearbox || 4) + (review.rating_comfort || 4)) / 3
                )
                const genObj = review.generations || mockGenerations.find((g: any) => g.id === review.generation_id)
                const genName = genObj?.name || 'F30'
                const modelObj = genObj?.models || (genObj ? mockModels.find((m: any) => m.id === genObj.model_id) : null)
                const modelName = modelObj?.name || '3 Serisi'
                const brandObj = modelObj?.brands || (modelObj ? mockBrands.find((b: any) => b.id === modelObj.brand_id) : null)
                const brandName = brandObj?.name || 'BMW'
                const year = review.created_at ? new Date(review.created_at).getFullYear() : 2024
                const username = review.profiles?.username || 'anonim'
                const initials = (review.profiles?.full_name || 'A').split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

                return (
                  <article
                    key={review.id}
                    className="bg-white border border-border-low p-6 rounded-xl hover:border-secondary transition-all cursor-pointer"
                  >
                    <div className="flex justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <StarRating rating={avgRating} />
                        <span className="ml-2 text-on-surface font-label-md text-label-md">{avgRating} / 5</span>
                      </div>
                      <span className="font-caption text-caption text-on-surface-variant">
                        {review.created_at ? timeAgo(review.created_at) : '2 saat önce'}
                      </span>
                    </div>

                    <h3 className="font-title-md text-title-md mb-2 text-on-surface" style={{ fontSize: '18px' }}>
                      {brandName} {modelName} {genName} - {year} Deneyimi
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant mb-4 text-sm line-clamp-3">
                      {review.content}
                    </p>

                    <div className="flex justify-between items-center pt-4 border-t border-border-low">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center font-bold text-primary text-sm">
                          {initials}
                        </div>
                        <span className="font-label-md text-label-md text-on-surface text-sm">{username}</span>
                        {review.profiles?.role && (
                          <span className="bg-trust-green/10 text-trust-green px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                            Doğrulanmış Sahibi
                          </span>
                        )}
                      </div>
                      <div className="flex gap-4">
                        <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                          <span className="text-[12px]">24</span>
                        </button>
                        <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary transition-all">
                          <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                          <span className="text-[12px]">{review.comments_count || 0}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Topluluk Uzmanları */}
          <section className="pb-12">
            <h2 className="font-title-md text-title-md text-on-surface mb-6">Topluluk Uzmanları</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  name: 'Usta Selim Y.',
                  title: '25+ Yıl Motor Mekanik Uzmanı',
                  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEZoNKuZEIDAyWkGovLRyAIzKQbu2mUsHlgnV46eC56vrBAc2Cbzp1KNj8a4UZznfh0dSusv45DySdaStB7Mn7et5vEYoc1S6Ag9HCg6URJp4OE-QDt8CeOX_z-0QEsRpucwo9kO6FUkYt4lVwXwwttDe3q6ph7ZgaDmY6fTuTA_nKgLERlQ5bmpmwXeKVYMb-PptBJ6a6aTQIeztRsWOkWenaoupHBLEv8yHbIDvYpiLsbw',
                  badges: ['BMW UZMANI', '1.2B CEVAP'],
                  slug: 'usta-selim-y'
                },
                {
                  name: 'Expert Ayşe B.',
                  title: 'Ekspertiz ve Piyasa Analisti',
                  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA94PpYFl9s16bPekLsOvSEfrm9MkWFyjleDFTPNZ0lh2IaZHuSIONptjRqvHZXytD1vbm0MxTm7fA4PYsfl_6MQ1YxCWN6jwqAON9PZ1Q-w6gOzDlycMyEpnyr6kETclL7xi0L3xwx4bAlmVw4vh01k8XKa8zYZohSobLojj1iAPlrG4wgaGJa5XzxVd_N-G4C5gvUbO1RPkEVvXJ_0ig8SCuyIe2u8tfXCX31OuyWfeX4iQeogVpVLxASA0uutwEmXyJRyEhlv4',
                  badges: ['VAG GRUBU', '900+ CEVAP'],
                  slug: 'expert-ayse-b'
                }
              ].map((expert) => (
                <Link
                  key={expert.name}
                  href={`/profil/${expert.slug}`}
                  className="bg-primary-container text-on-primary p-4 sm:p-6 rounded-xl flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 group cursor-pointer hover:bg-black transition-all"
                >
                  <div className="relative flex-shrink-0">
                    <img
                      alt={expert.name}
                      src={expert.avatar}
                      className="w-16 h-16 rounded-full object-cover border-2 border-secondary-container"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container p-0.5 rounded-full">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-label-md text-label-md text-on-primary truncate">{expert.name}</h4>
                    <p className="font-caption text-caption opacity-70 mt-0.5 text-xs line-clamp-2">{expert.title}</p>
                    <div className="flex flex-wrap gap-2 mt-2 justify-center sm:justify-start">
                      {expert.badges.map((badge) => (
                        <span key={badge} className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-on-primary">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}
