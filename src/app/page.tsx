import React from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-server'
import { mockBrands, mockReviews, mockProblemReports } from '@/lib/mock-data'
import { Brand } from '@/types/database'
import { 
  Sparkles, ShieldAlert, Award, Star, MessageSquare, 
  Search, ArrowRight, Activity, SlidersHorizontal, AlertTriangle
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

  // Yıldız çizme yardımcısı
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-warning">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3 w-3 ${i < rating ? 'fill-current' : 'text-muted-foreground/20'}`} 
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <main className="flex-1">
        
        {/* PREMIUM HERO SECTION */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-[#090b11] via-[#0e121d] to-background text-white overflow-hidden text-center">
          {/* Subtle light ambient glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none"></div>
          
          <div className="mx-auto max-w-4xl relative z-10">
            
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/5 border border-blue-500/10 px-4 py-1.5 text-[11px] font-bold text-accent tracking-wide mb-6">
              <Activity className="h-3.5 w-3.5" />
              Topluluk Tabanlı Otomobil Kılavuzu & Puanlama
            </div>

            <h1 className="text-4xl font-black tracking-tight sm:text-6xl max-w-3xl mx-auto leading-[1.15] text-foreground">
              Araba Almadan Önce <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-blue-500 bg-clip-text text-transparent">
                Kullananlara Sorun!
              </span>
            </h1>
            
            <p className="mt-6 text-sm sm:text-base text-muted max-w-2xl mx-auto leading-relaxed">
              Gerçek araç sahipleri ve ustaların deneyimleriyle kronik sorunları oylayın, konfor ve parça maliyetlerini karşılaştırın, yapay zekayla ilanları anında analiz edin.
            </p>

            {/* CTAs */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/arama"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-accent px-8 py-3.5 text-xs font-black text-accent-foreground hover:bg-accent-hover transition-all duration-200 active:scale-95 shadow-lg shadow-accent/10"
              >
                <SlidersHorizontal className="h-4.5 w-4.5" />
                Gelişmiş Arama & Filtreleme
              </Link>
              <Link
                href="/ai-analiz"
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full border border-border bg-card/10 px-8 py-3.5 text-xs font-black text-foreground hover:bg-card/30 transition-all duration-200 active:scale-95"
              >
                <Sparkles className="h-4.5 w-4.5 text-warning" />
                AI İlan Analizcisi
              </Link>
            </div>

          </div>
        </section>

        {/* BRANDS GRID SECTION */}
        <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl text-foreground">Popüler Markalar</h2>
            <p className="text-xs sm:text-sm text-muted mt-2">
              Markaların nesillerini, motor seçeneklerini ve bildirilen tüm kronik arızalarını görmek için bir logo seçin.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/arac/${brand.slug}`}
                className="premium-card flex flex-col items-center justify-center p-6 text-center group"
              >
                <div className="relative h-16 w-16 mb-4 flex items-center justify-center bg-background rounded-2xl p-2 border border-border/40">
                  <img
                    src={brand.logo_url}
                    alt={`${brand.name} logosu`}
                    className="max-h-12 max-w-12 object-contain group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-xs font-bold text-foreground/90 group-hover:text-accent transition-colors">{brand.name}</span>
                <span className="text-[10px] text-muted font-bold mt-1 uppercase tracking-wider">İncele</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CHRONIC PROBLEMS & REVIEWS ROW */}
        <section className="py-20 bg-card/20 border-y border-border">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              
              {/* Left Column: Popular Chronic Problems */}
              <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center gap-2 border-b border-border/80 pb-4 mb-4">
                  <ShieldAlert className="h-5 w-5 text-danger" />
                  <h3 className="text-base font-black tracking-tight">Aktif Kronik Oylamaları</h3>
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
                        className="premium-card p-5 relative overflow-hidden"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="text-xs font-bold text-foreground/90 leading-snug">{prob.title}</h4>
                          <span className="text-[10px] rounded-full bg-danger/10 px-2.5 py-0.5 font-bold text-danger shrink-0">
                            %{percentage} Kronik
                          </span>
                        </div>
                        <p className="text-[11px] text-muted mt-2 leading-relaxed line-clamp-2">
                          {prob.description}
                        </p>
                        
                        {/* Custom SVG Mini Bar Chart */}
                        <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mt-3">
                          <div className="h-full bg-danger rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>

                        <div className="mt-4 flex items-center justify-between text-[10px] text-muted font-bold">
                          <span>
                            {prob.generations?.name || 'BMW 3 Serisi E90'}
                          </span>
                          <span>
                            {totalVotes} Doğrulama Oyu
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Right Columns: Recent Reviews */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between border-b border-border/80 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-accent" />
                    <h3 className="text-base font-black tracking-tight">Kullanıcı Değerlendirmeleri</h3>
                  </div>
                  <Link href="/arama" className="text-[10px] font-bold text-accent hover:underline flex items-center gap-1">
                    Tümünü Filtrele <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <div
                        key={rev.id}
                        className="premium-card p-6 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <span className="text-xs font-bold text-foreground hover:text-accent transition-colors block">
                                {brandName} {modelName} {genName}
                              </span>
                              <div className="flex items-center gap-1.5 mt-1.5">
                                {renderStars(Math.round(parseFloat(avgRating)))}
                                <span className="text-xs font-black text-foreground">{avgRating}</span>
                              </div>
                            </div>
                            
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-foreground/80 block">
                                @{rev.profiles?.username || 'user'}
                              </span>
                              <span className="text-[9px] bg-accent/10 text-accent px-2 py-0.5 rounded-full font-bold inline-block mt-0.5">
                                {rev.profiles?.role || 'Yeni Üye'}
                              </span>
                            </div>
                          </div>

                          <p className="text-xs text-muted leading-relaxed line-clamp-4 italic">
                            "{rev.content}"
                          </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-muted text-[10px] font-bold">
                          <span>
                            {new Date(rev.created_at || '2026-06-12').toLocaleDateString('tr-TR')}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="h-3.5 w-3.5" />
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

        {/* DETAILS ADVANTAGES SECTION */}
        <section className="py-20 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-xl mx-auto mb-16">
            <h2 className="text-2xl font-black tracking-tight sm:text-3xl">Platform Nasıl Çalışır?</h2>
            <p className="text-xs sm:text-sm text-muted mt-2">
              arabayasor.com topluluk oylamalarıyla beslenir, yapay zekayla hız kazanır.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center bg-card border border-border p-8 rounded-[2rem] shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/5 text-accent font-black mb-6 text-sm border border-accent/15">
                01
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2">Kronik Sorun Bildir & Oyla</h3>
              <p className="text-xs text-muted leading-relaxed max-w-xs">
                Kullandığınız veya bildiğiniz araç kasalarının kronik sorunlarını oylayın veya yenilerini ekleyin. Spam korumalı oylama kuralımızla her hesap sadece 1 oy verebilir.
              </p>
            </div>
            
            <div className="flex flex-col items-center bg-card border border-border p-8 rounded-[2rem] shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/5 text-accent font-black mb-6 text-sm border border-accent/15">
                02
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2">7 Kriterde Değerlendir</h3>
              <p className="text-xs text-muted leading-relaxed max-w-xs">
                Araçların motor, şanzıman, konfor, elektrik, yakıt ekonomisi, parça fiyatı ve usta bulunabilirliğini puanlayın. Alıcıların doğru karar vermesini kolaylaştırın.
              </p>
            </div>

            <div className="flex flex-col items-center bg-card border border-border p-8 rounded-[2rem] shadow-sm">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/5 text-warning font-black mb-6 text-sm border border-warning/15">
                03
              </div>
              <h3 className="text-xs font-black uppercase tracking-wider mb-2">Yapay Zeka Destekli Analiz</h3>
              <p className="text-xs text-muted leading-relaxed max-w-xs">
                Satın alacağınız aracın ilan linkini panoya yapıştırın. Yapay zeka tüm oylanan kronik sorunları, motor verilerini ve ekspertiz uyarılarını saniyeler içinde raporlasın.
              </p>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </>
  )
}
