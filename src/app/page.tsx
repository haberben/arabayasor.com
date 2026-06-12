import React from 'react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-server'
import { mockBrands, mockReviews, mockProblemReports } from '@/lib/mock-data'
import { Brand } from '@/types/database'
import { 
  Sparkles, ShieldAlert, Award, Star, MessageSquare, 
  Search, ArrowRight, Activity, SlidersHorizontal, AlertTriangle,
  Calendar, Fuel, Settings, Activity as EngineIcon, Shield, Sparkle, HelpCircle, UserCheck, ThumbsUp
} from 'lucide-react'

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
      <div className="flex gap-0.5 text-trust-green">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className="material-symbols-outlined text-[18px]" 
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

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative bg-primary-container text-on-primary py-24 overflow-hidden">
          {/* Subtle light ambient glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="max-w-max-width mx-auto px-margin-desktop relative z-10 text-center">
            <h1 className="font-display-lg text-display-lg mb-6 leading-tight text-white">
              Aracını Sor, Gerçeği Öğren
            </h1>
            <p className="font-body-lg text-body-lg text-surface-variant mb-10 max-w-2xl mx-auto">
              Binlerce kullanıcı deneyimi ve teknik raporlarla otomobil dünyasının şeffaf yüzü. İlan linkini yapıştır, yapay zeka analiz etsin.
            </p>
            
            {/* Search Box */}
            <div className="max-w-3xl mx-auto relative">
              <form action="/arama" method="GET" className="flex bg-white rounded-full p-2 shadow-xl focus-within:ring-4 ring-secondary-container/30 transition-all">
                <span className="material-symbols-outlined text-outline ml-4 self-center">search</span>
                <input 
                  name="q"
                  className="w-full border-none focus:ring-0 text-on-surface font-body-md text-body-md py-4 px-4 bg-transparent outline-none placeholder:text-outline" 
                  placeholder="Marka, model veya kronik sorun ara... (Örn: E90 zincir kopması)" 
                  type="text"
                />
                <button type="submit" className="bg-secondary-container text-on-secondary-container px-8 rounded-full font-label-md text-label-md hover:scale-105 active:scale-95 transition-all">
                  Ara
                </button>
              </form>
            </div>
          </div>
        </section>

        {/* MAIN LAYOUT */}
        <div className="max-w-max-width mx-auto px-margin-desktop py-12 flex flex-col lg:flex-row gap-gutter">
          
          {/* LEFT SIDEBAR FILTERS */}
          <aside className="hidden lg:block w-[300px] shrink-0 space-y-6">
            <div className="bg-surface-container-low dark:bg-primary-container p-gutter rounded-xl border border-border-low dark:border-outline-variant space-y-4 sticky top-24">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary">filter_list</span>
                <div>
                  <h3 className="font-title-md text-title-md text-on-surface dark:text-on-primary">Detaylı Filtreler</h3>
                  <p className="text-on-surface-variant text-caption font-caption opacity-70">Sonuçları daraltın</p>
                </div>
              </div>
              
              <div className="space-y-2">
                <Link href="/arama?yil=2015" className="w-full flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all font-label-md text-label-md dark:text-outline-variant dark:hover:bg-on-primary-fixed-variant">
                  <span className="material-symbols-outlined">calendar_today</span> Model Yılı
                </Link>
                <Link href="/arama?yakit=dizel" className="w-full flex items-center gap-3 p-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold transition-all font-label-md text-label-md dark:bg-secondary dark:text-on-secondary">
                  <span className="material-symbols-outlined">ev_station</span> Yakıt Tipi
                </Link>
                <Link href="/arama?vites=otomatik" className="w-full flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all font-label-md text-label-md dark:text-outline-variant dark:hover:bg-on-primary-fixed-variant">
                  <span className="material-symbols-outlined">settings_input_component</span> Şanzıman
                </Link>
                <Link href="/arama?motor=1.6" className="w-full flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all font-label-md text-label-md dark:text-outline-variant dark:hover:bg-on-primary-fixed-variant">
                  <span className="material-symbols-outlined">enable</span> Motor Hacmi
                </Link>
                <Link href="/arama?cekes=arkadan" className="w-full flex items-center gap-3 p-3 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all font-label-md text-label-md dark:text-outline-variant dark:hover:bg-on-primary-fixed-variant">
                  <span className="material-symbols-outlined">settings_input_antenna</span> Çekiş Tipi
                </Link>
              </div>
              
              <Link href="/arama" className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-label-md mt-4 hover:opacity-90 transition-opacity block text-center">
                Filtreleri Uygula
              </Link>
            </div>
          </aside>

          {/* MAIN CONTENT AREA */}
          <div className="flex-1 space-y-12">
            
            {/* AI LINK ANALYSIS */}
            <section className="bg-white dark:bg-primary-container border border-border-low dark:border-outline-variant rounded-xl p-8 shadow-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-secondary-container/20 rounded-full flex items-center justify-center text-secondary-container">
                  <span className="material-symbols-outlined text-[24px]">auto_awesome</span>
                </div>
                <div>
                  <h2 className="font-title-md text-title-md text-on-surface dark:text-on-primary">AI İlan Analizi</h2>
                  <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant">
                    İlan linkini girin, AI teknik durumu ve piyasayı özetlesin.
                  </p>
                </div>
              </div>
              <form action="/ai-analiz" method="GET" className="flex flex-col sm:flex-row gap-4">
                <input 
                  name="url"
                  className="flex-1 bg-surface-container-low dark:bg-background border border-border-low dark:border-outline-variant rounded-lg px-4 py-3 outline-none focus:border-primary dark:focus:border-[#fea619] transition-all font-body-md text-body-md text-on-surface dark:text-on-primary" 
                  placeholder="https://www.sahibinden.com/ilan/..." 
                  type="text"
                />
                <button type="submit" className="bg-primary text-on-primary dark:bg-secondary-container dark:text-on-secondary-container px-8 py-3 rounded-lg font-label-md text-label-md hover:bg-opacity-90 active:scale-95 transition-all">
                  Analiz Et
                </button>
              </form>
            </section>

            {/* POPULAR BRANDS */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-title-md text-title-md text-on-surface dark:text-on-primary">Popüler Markalar</h2>
                <Link className="text-secondary dark:text-secondary-fixed-dim font-label-md text-label-md hover:underline" href="/arama">
                  Tümünü Gör
                </Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {brands.map((brand) => {
                  const localLogo = `/logos/${brand.slug.toLowerCase()}.svg`
                  return (
                    <Link
                      key={brand.id}
                      href={`/arac/${brand.slug}`}
                      className="bg-white dark:bg-primary-container border border-border-low dark:border-outline-variant p-6 rounded-xl text-center hover:shadow-md transition-all group cursor-pointer"
                    >
                      <img 
                        alt={brand.name} 
                        className="w-12 h-12 mx-auto mb-4 grayscale group-hover:grayscale-0 transition-all object-contain" 
                        src={localLogo}
                      />
                      <span className="font-label-md text-label-md text-on-surface dark:text-on-primary">{brand.name}</span>
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* KRONİK SORUN HIGHLIGHT COMPONENT */}
            {recentProblems.length > 0 && (
              <section className="bg-orange-50 dark:bg-orange-950/20 border-l-4 border-secondary p-6 rounded-r-xl">
                <div className="flex gap-4">
                  <span className="material-symbols-outlined text-secondary text-[24px]">report_problem</span>
                  <div>
                    <h4 className="font-label-md text-label-md text-secondary dark:text-secondary-fixed-dim">
                      Kronik Sorun Alarmı: {recentProblems[0].title}
                    </h4>
                    <p className="font-caption text-caption text-on-surface-variant dark:text-outline-variant mt-1 leading-relaxed">
                      {recentProblems[0].description} Bu kasa tipinde doğrulanmış kronik durum bildirimi bulunmaktadır.
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* COMMUNITY REVIEWS */}
            <section>
              <div className="flex justify-between items-end mb-6">
                <h2 className="font-title-md text-title-md text-on-surface dark:text-on-primary">Son Kullanıcı Değerlendirmeleri</h2>
                <Link href="/arama" className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-opacity-90 active:scale-95 transition-all">
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
                    <article 
                      key={rev.id}
                      className="bg-white dark:bg-primary-container border border-border-low dark:border-outline-variant p-6 rounded-xl hover:border-secondary dark:hover:border-secondary-fixed transition-all"
                    >
                      <div className="flex justify-between mb-4">
                        <div className="flex items-center gap-1.5">
                          {renderStars(Math.round(parseFloat(avgRating)))}
                          <span className="ml-2 text-on-surface dark:text-on-primary font-label-md text-label-md">
                            {avgRating} / 5
                          </span>
                        </div>
                        <span className="font-caption text-caption text-on-surface-variant dark:text-outline-variant">
                          {new Date(rev.created_at || '2026-06-12').toLocaleDateString('tr-TR')}
                        </span>
                      </div>
                      
                      <h3 className="font-title-md text-title-md mb-2 text-on-surface dark:text-on-primary">
                        {brandName} {modelName} {genName} Değerlendirmesi
                      </h3>
                      <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant mb-4 italic leading-relaxed">
                        "{rev.content}"
                      </p>
                      
                      <div className="flex justify-between items-center pt-4 border-t border-border-low dark:border-outline-variant">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-[#e5eeff] dark:bg-background flex items-center justify-center font-bold text-primary dark:text-[#fea619]">
                            {(rev.profiles?.username || 'U')[0].toUpperCase()}
                          </div>
                          <span className="font-label-md text-label-md text-on-surface dark:text-on-primary">
                            @{rev.profiles?.username || 'user'}
                          </span>
                          <span className="bg-trust-green/10 text-trust-green px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide">
                            {rev.profiles?.role || 'Doğrulanmış Sahibi'}
                          </span>
                        </div>
                        <div className="flex gap-4">
                          <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary dark:text-outline-variant dark:hover:text-white transition-all">
                            <span className="material-symbols-outlined text-[18px]">thumb_up</span>
                            <span className="text-[12px] font-semibold">12</span>
                          </button>
                          <button className="flex items-center gap-1 text-on-surface-variant hover:text-primary dark:text-outline-variant dark:hover:text-white transition-all">
                            <span className="material-symbols-outlined text-[18px]">chat_bubble</span>
                            <span className="text-[12px] font-semibold">{rev.comments_count || 0}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </section>

            {/* TOP EXPERTS */}
            <section className="pb-12">
              <h2 className="font-title-md text-title-md mb-6 text-on-surface dark:text-on-primary">Topluluk Uzmanları</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-primary-container text-on-primary p-6 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-black transition-all">
                  <div className="relative shrink-0">
                    <img 
                      alt="Selim Usta" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-secondary-container" 
                      src="https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&q=80&w=150" 
                    />
                    <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container p-0.5 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-white">Usta Selim Y.</h4>
                    <p className="font-caption text-caption opacity-70 text-gray-300">25+ Yıl Motor Mekanik Uzmanı</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-gray-200">BMW UZMANI</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-gray-200">1.2K CEVAP</span>
                    </div>
                  </div>
                </div>

                <div className="bg-primary-container text-on-primary p-6 rounded-xl flex items-center gap-4 group cursor-pointer hover:bg-black transition-all">
                  <div className="relative shrink-0">
                    <img 
                      alt="Ayşe Expert" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-secondary-container" 
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-secondary-container text-on-secondary-container p-0.5 rounded-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-white">Expert Ayşe B.</h4>
                    <p className="font-caption text-caption opacity-70 text-gray-300">Ekspertiz ve Piyasa Analisti</p>
                    <div className="flex gap-2 mt-2">
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-gray-200">VAG GRUBU</span>
                      <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold text-gray-200">900+ CEVAP</span>
                    </div>
                  </div>
                </div>

              </div>
            </section>

          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

