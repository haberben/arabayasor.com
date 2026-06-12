import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-server'
import { mockBrands, mockReviews, mockProblemReports } from '@/lib/mock-data'
import { Brand, Review } from '@/types/database'
import { 
  Sparkles, ShieldAlert, Award, Star, MessageSquare, 
  Search, ArrowRight, CheckCircle2, ChevronRight, Activity, Info
} from 'lucide-react'

// Verileri Supabase'den çekmeyi dener, hata veya eksiklik durumunda mock verileri döner
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
    
    const { data: brands, error: bErr } = await supabase
      .from('brands')
      .select('*')
      .limit(6)
      
    const { data: reviews, error: rErr } = await supabase
      .from('reviews')
      .select('*, profiles(*), generations(*, models(*, brands(*)))')
      .order('created_at', { ascending: false })
      .limit(3)

    const { data: problems, error: pErr } = await supabase
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

  // Yıldız çizme yardımcısı
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-warning">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3.5 w-3.5 ${i < rating ? 'fill-current' : 'text-muted-foreground/30'}`} 
          />
        ))}
      </div>
    )
  }

  // Ortalama puanı hesaplama yardımcısı
  const getAverageReviewRating = (r: any) => {
    const total = 
      r.rating_engine + 
      r.rating_gearbox + 
      r.rating_electric + 
      r.rating_fuel + 
      r.rating_comfort + 
      r.rating_parts + 
      r.rating_mechanic
    return (total / 7).toFixed(1)
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-950 via-slate-900 to-background py-20 text-white dark:from-slate-950 dark:via-zinc-950">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 px-3 py-1 text-xs font-semibold text-blue-400 mb-6">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              Türkiye'nin En Büyük Otomobil Kronik Sorun Platformu
            </span>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl max-w-3xl mx-auto leading-tight">
              Araba Almadan Önce <br />
              <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                Kullananlara Sorun!
              </span>
            </h1>
            
            <p className="mt-6 text-sm sm:text-lg text-slate-300 max-w-2xl mx-auto font-medium">
              Kullanıcıların gerçek deneyimleriyle kronik sorunları inceleyin, araçları puanlayın ve yapay zeka destekli analizlerle saniyeler içinde karar verin.
            </p>

            {/* AI Callout Card */}
            <div className="mt-12 max-w-3xl mx-auto rounded-3xl border border-white/10 bg-white/5 p-4 sm:p-6 backdrop-blur-md shadow-2xl">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/15 text-warning shrink-0">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                      Yapay Zeka İlan Analizcisi
                      <span className="rounded-full bg-warning/20 px-2 py-0.5 text-[10px] font-black text-warning">YENİ</span>
                    </h4>
                    <p className="text-xs text-slate-300 mt-1 max-w-md">
                      Bir ilan linki yapıştırın; aracın tüm kronik sorunlarını, teknik verilerini ve dikkat etmeniz gerekenleri yapay zeka özetlesin.
                    </p>
                  </div>
                </div>
                <Link
                  href="/ai-analiz"
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-full bg-warning px-6 py-3 text-xs font-black text-slate-950 hover:bg-amber-400 active:scale-95 transition-all shadow-lg shrink-0"
                >
                  Hemen Analiz Et
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </section>

        {/* BRANDS GRID SECTION */}
        <section className="py-16 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Popüler Markalar</h2>
            <p className="text-xs sm:text-sm text-muted mt-2">
              Detaylı kasa seçeneklerini, motor verilerini ve kronik sorunlarını görmek istediğiniz markayı seçin.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/arac/${brand.slug}`}
                className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6 text-center hover:-translate-y-1 hover:border-accent hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 group"
              >
                <div className="relative h-16 w-16 mb-4 flex items-center justify-center">
                  <img
                    src={brand.logo_url}
                    alt={`${brand.name} logosu`}
                    className="max-h-16 max-w-16 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <span className="text-sm font-bold group-hover:text-accent transition-colors">{brand.name}</span>
                <span className="text-[10px] text-muted font-medium mt-1">İncele</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CHRONIC PROBLEMS & REVIEWS ROW */}
        <section className="py-16 bg-card/25 border-y border-border/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Column: Popular Chronic Problems */}
              <div className="lg:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                  <ShieldAlert className="h-5 w-5 text-danger" />
                  <h3 className="text-lg font-black tracking-tight">Popüler Kronik Sorunlar</h3>
                </div>
                <div className="flex flex-col gap-4">
                  {recentProblems.map((prob: any) => {
                    const yesVotes = prob.yes_votes || 0
                    const noVotes = prob.no_votes || 0
                    const totalVotes = yesVotes + noVotes
                    const percentage = totalVotes > 0 ? Math.round((yesVotes / totalVotes) * 100) : 0

                    return (
                      <div
                        key={prob.id}
                        className="rounded-2xl border border-border bg-card p-4 hover:border-danger/30 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs font-bold text-foreground/90 leading-snug">{prob.title}</h4>
                          <span className="text-[10px] rounded bg-danger/10 px-1.5 py-0.5 font-bold text-danger whitespace-nowrap">
                            %{percentage} Doğrulama
                          </span>
                        </div>
                        <p className="text-[11px] text-muted mt-1.5 line-clamp-2">
                          {prob.description}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-[10px] text-muted font-semibold">
                            {prob.generations?.name ? `${prob.generations.models?.brands?.name} ${prob.generations.models?.name} ${prob.generations.name}` : '3 Serisi E90'}
                          </span>
                          <span className="text-[10px] text-muted">
                            {totalVotes} Oy
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Columns: Recent Reviews */}
              <div className="lg:col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <Award className="h-5 w-5 text-accent" />
                  <h3 className="text-lg font-black tracking-tight">En Son Kullanıcı Değerlendirmeleri</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((rev: any) => {
                    const avgRating = getAverageReviewRating(rev)
                    const genName = rev.generations?.name || 'F30'
                    const modelName = rev.generations?.models?.name || '3 Serisi'
                    const brandName = rev.generations?.models?.brands?.name || 'BMW'

                    return (
                      <div
                        key={rev.id}
                        className="flex flex-col rounded-3xl border border-border bg-card p-6 hover:shadow-xl hover:border-accent/30 transition-all duration-300"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <Link 
                              href={`/arac/${rev.generations?.models?.brands?.slug}/${rev.generations?.models?.slug}/${rev.generations?.slug}`}
                              className="text-xs font-bold hover:text-accent transition-colors"
                            >
                              {brandName} {modelName} {genName}
                            </Link>
                            <div className="flex items-center gap-1.5 mt-1">
                              {renderStars(Math.round(parseFloat(avgRating)))}
                              <span className="text-xs font-bold text-foreground/80">{avgRating}</span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end text-right">
                            <span className="text-xs font-bold text-foreground/90">
                              @{rev.profiles?.username || 'user'}
                            </span>
                            <span className="text-[10px] text-accent font-bold">
                              {rev.profiles?.role || 'Yeni Üye'}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-muted leading-relaxed line-clamp-4 flex-1">
                          "{rev.content}"
                        </p>

                        <div className="mt-4 pt-4 border-t border-border/50 flex items-center justify-between text-muted text-[10px]">
                          <span className="font-medium">
                            {new Date(rev.created_at || '2026-06-12').toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {rev.comments_count || 0} Yorum
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-xl mx-auto mb-16">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Platform Nasıl Çalışır?</h2>
            <p className="text-xs sm:text-sm text-muted mt-2">
              arabayasor.com topluluğun gücüne ve yapay zeka teknolojisine dayanır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center bg-card p-8 rounded-3xl border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent font-bold mb-6 text-lg">
                1
              </div>
              <h3 className="text-sm font-bold mb-2">Kronik Sorunları Oyla</h3>
              <p className="text-xs text-muted leading-relaxed max-w-xs">
                Kullandığınız veya bildiğiniz araçların kronik sorunlarını oylayın ya da yeni sorunlar ekleyin. Her kullanıcı tek oy verebilir.
              </p>
            </div>
            
            <div className="flex flex-col items-center bg-card p-8 rounded-3xl border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/10 text-accent font-bold mb-6 text-lg">
                2
              </div>
              <h3 className="text-sm font-bold mb-2">7 Alanda Puanla</h3>
              <p className="text-xs text-muted leading-relaxed max-w-xs">
                Araçların motor, şanzıman, konfor, parça maliyeti, elektrik, yakıt ve usta bulunabilirliğini oylayarak alıcılara rehber olun.
              </p>
            </div>

            <div className="flex flex-col items-center bg-card p-8 rounded-3xl border border-border">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning font-bold mb-6 text-lg">
                3
              </div>
              <h3 className="text-sm font-bold mb-2">Yapay Zeka ile Analiz Et</h3>
              <p className="text-xs text-muted leading-relaxed max-w-xs">
                Satın almak istediğiniz ilan linkini sisteme yapıştırın. Yapay zeka tüm kronik uyarıları ve usta tavsiyelerini önünüze getirsin.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
