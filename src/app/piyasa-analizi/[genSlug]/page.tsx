import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { mockGenerations, mockModels, mockBrands } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase-server'
import { ArrowLeft, TrendingUp, TrendingDown, Info, Activity } from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'

interface Props {
  params: Promise<{ genSlug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const { genSlug } = resolvedParams
  
  const gen = mockGenerations.find(g => g.slug === genSlug)
  const model = gen ? mockModels.find(m => m.id === gen.model_id) : null
  const brand = model ? mockBrands.find(b => b.id === model.brand_id) : null
  
  const titleName = brand && model && gen ? `${brand.name} ${model.name} ${gen.name}` : genSlug.toUpperCase()

  return {
    title: `${titleName} Piyasa Değeri ve Fiyat Trendi Analizi | arabayasor.com`,
    description: `${titleName} otomobillerinin güncel piyasa ortalaması, adil fiyat aralığı, amortisman oranları, 12 aylık fiyat grafiği ve AI 6 aylık fiyat tahmini.`,
  }
}

async function getMarketData(genSlug: string) {
  const gen = mockGenerations.find(g => g.slug === genSlug)
  if (!gen) return null
  
  const model = mockModels.find(m => m.id === gen.model_id)
  const brand = model ? mockBrands.find(b => b.id === model.brand_id) : null

  // Mock pricing calculations based on model/gen
  let avgPrice = 1425000
  let minPrice = 1300000
  let maxPrice = 1550000
  let changePct = 2.4
  let depreciation = -4.8
  
  if (gen.slug === 'e90') {
    avgPrice = 780000
    minPrice = 700000
    maxPrice = 880000
    changePct = 1.1
    depreciation = -3.2
  } else if (gen.slug === 'w204') {
    avgPrice = 1150000
    minPrice = 1050000
    maxPrice = 1280000
    changePct = -0.5
    depreciation = -5.1
  } else if (gen.slug === 'megane-4') {
    avgPrice = 980000
    minPrice = 890000
    maxPrice = 1100000
    changePct = 3.2
    depreciation = -6.4
  } else if (gen.slug === 'clio-4') {
    avgPrice = 640000
    minPrice = 580000
    maxPrice = 710000
    changePct = 0.8
    depreciation = -2.9
  }

  // Simulated sales history
  const recentSales = [
    { desc: `${gen.years.split('-')[0]} ${gen.name} M-Sport / Icon`, km: '85,000 KM', price: Math.round(avgPrice * 1.08), location: 'Çankaya, Ankara', date: '2 GÜN ÖNCE' },
    { desc: `${parseInt(gen.years.split('-')[0]) + 2} ${gen.name} Sport / Touch`, km: '122,000 KM', price: Math.round(avgPrice * 0.95), location: 'Nilüfer, Bursa', date: '5 GÜN ÖNCE' },
    { desc: `${parseInt(gen.years.split('-')[0]) + 1} ${gen.name} Comfort / Joy`, km: '168,000 KM', price: Math.round(avgPrice * 0.88), location: 'Kadıköy, İstanbul', date: '1 HAFTA ÖNCE' }
  ]

  return {
    gen,
    model,
    brand,
    avgPrice,
    minPrice,
    maxPrice,
    changePct,
    depreciation,
    recentSales
  }
}

export default async function MarketAnalysisPage({ params }: Props) {
  const resolvedParams = await params
  const data = await getMarketData(resolvedParams.genSlug)

  if (!data) {
    notFound()
  }

  const {
    gen,
    model,
    brand,
    avgPrice,
    minPrice,
    maxPrice,
    changePct,
    depreciation,
    recentSales
  } = data

  const brandName = brand?.name || ''
  const modelName = model?.name || ''
  const genName = gen.name

  const formatPrice = (val: number) => {
    return new Intl.NumberFormat('tr-TR', { style: 'currency', currency: 'TRY', maximumFractionDigits: 0 }).format(val)
  }

  return (
    <>
      <Navbar />

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-gutter">
        
        {/* Side Filters Sidebar */}
        <aside className="h-fit w-full lg:w-[280px] sticky top-20 bg-surface-container-low border border-border-low flex flex-col p-4 rounded-xl space-y-4 shrink-0">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-primary">filter_list</span>
            <div>
              <h3 className="font-title-md text-sm font-bold text-on-surface">Detaylı Filtreler</h3>
              <p className="text-on-surface-variant text-[10px]">Piyasa aralığını filtreleyin</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="p-3 bg-secondary-container text-on-secondary-container rounded-lg font-bold flex items-center gap-3 transition-transform cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span className="font-label-md text-xs">Model Yılı</span>
            </div>
            <div className="p-3 text-on-surface-variant hover:bg-surface-variant rounded-lg flex items-center gap-3 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">ev_station</span>
              <span className="font-label-md text-xs">Yakıt Tipi</span>
            </div>
            <div className="p-3 text-on-surface-variant hover:bg-surface-variant rounded-lg flex items-center gap-3 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[18px]">settings_input_component</span>
              <span className="font-label-md text-xs">Şanzıman Tipi</span>
            </div>
          </div>
          <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-bold font-label-md text-xs hover:opacity-90 active:scale-95 transition-all">
            Filtreleri Uygula
          </button>
        </aside>

        {/* Main Content */}
        <div className="flex-grow space-y-8 min-w-0">
          
          {/* Breadcrumbs & Header */}
          <section>
            <nav className="flex items-center gap-1.5 text-xs text-muted mb-3">
              <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <Link href={`/arac/${brand?.slug}`} className="hover:text-accent transition-colors">{brandName}</Link>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <Link href={`/arac/${brand?.slug}/${model?.slug}`} className="hover:text-accent transition-colors">{modelName}</Link>
              <span className="material-symbols-outlined text-[12px]">chevron_right</span>
              <span className="font-semibold text-foreground/80">{genName} Piyasa Analizi</span>
            </nav>
            <h1 className="font-headline-lg text-3xl font-black text-on-surface">
              {brandName} {modelName} {genName} Piyasa Değer Analizi
            </h1>
            <p className="text-on-surface-variant text-sm mt-1">
              Topluluktaki doğrulanmış satış ilanları ve geçmiş verilerle hesaplanmış gerçek zamanlı teknik piyasa analizi.
            </p>
          </section>

          {/* Key Metrics Grid */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            
            {/* Market Average */}
            <div className="bg-surface-container-lowest border border-border-low p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-on-surface-variant font-label-md text-xs uppercase tracking-wider">Piyasa Ortalaması</span>
                <div className="mt-2 text-3xl font-black text-primary">{formatPrice(avgPrice)}</div>
              </div>
              <div className={`mt-4 flex items-center gap-1.5 text-xs font-bold ${
                changePct > 0 ? 'text-trust-green' : 'text-warning-red'
              }`}>
                <span className="material-symbols-outlined text-[18px]">
                  {changePct > 0 ? 'trending_up' : 'trending_down'}
                </span>
                <span>Bu ay {changePct > 0 ? `+${changePct}%` : `${changePct}%`}</span>
              </div>
            </div>

            {/* Fair Price Range */}
            <div className="bg-surface-container-lowest border border-border-low p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-on-surface-variant font-label-md text-xs uppercase tracking-wider">Adil Değer Aralığı</span>
                <div className="mt-2 text-3xl font-black text-primary">
                  {formatPrice(minPrice)} - {formatPrice(maxPrice)}
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>Ortalama kondisyon ve kilometre için</span>
              </div>
            </div>

            {/* Expected Depreciation */}
            <div className="bg-surface-container-lowest border border-border-low p-6 rounded-2xl flex flex-col justify-between shadow-sm">
              <div>
                <span className="text-on-surface-variant font-label-md text-xs uppercase tracking-wider">Yıllık Amortisman (Değer Kaybı)</span>
                <div className="mt-2 text-3xl font-black text-warning-red">{depreciation}%</div>
              </div>
              <div className="mt-4 flex items-center gap-1.5 text-xs text-on-surface-variant">
                <span className="material-symbols-outlined text-[18px]">analytics</span>
                <span>{genName} platformu yıllık ortalama</span>
              </div>
            </div>

          </section>

          {/* Price Trend Chart */}
          <section className="bg-surface-container-lowest border border-border-low rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="font-title-md text-lg font-bold text-on-surface">12 Aylık Fiyat Değişim Trendi</h2>
                <p className="text-on-surface-variant text-xs mt-0.5">Gerçekleşen satışlar ve tahmini gelecek eğrisi</p>
              </div>
              <div className="flex gap-1">
                <button className="px-3.5 py-1.5 bg-surface-container text-on-surface font-label-md text-xs font-bold rounded-full">1 Yıl</button>
                <button className="px-3.5 py-1.5 hover:bg-surface-container text-on-surface-variant font-label-md text-xs rounded-full transition-colors">6 Ay</button>
              </div>
            </div>

            {/* Chart Area */}
            <div className="w-full h-[320px] bg-gradient-to-b from-transparent to-blue-50/10 border border-border-low rounded-2xl relative overflow-hidden flex flex-col justify-between p-6">
              
              {/* Y-Axis lines */}
              <div className="absolute inset-x-0 top-0 bottom-12 flex flex-col justify-between pointer-events-none">
                <div className="border-b border-border-low/40 w-full h-px"></div>
                <div className="border-b border-border-low/40 w-full h-px"></div>
                <div className="border-b border-border-low/40 w-full h-px"></div>
                <div className="border-b border-border-low/40 w-full h-px"></div>
              </div>

              {/* Chart SVG */}
              <svg className="absolute inset-x-0 top-6 bottom-12 w-full h-[200px]" viewBox="0 0 1000 200" preserveAspectRatio="none">
                {/* Background area gradient path */}
                <path 
                  d="M 0 180 Q 200 150 400 130 T 800 90 T 1000 70 L 1000 200 L 0 200 Z" 
                  fill="rgba(254, 166, 25, 0.05)"
                />
                {/* Price Curve Path */}
                <path 
                  d="M 0 180 Q 200 150 400 130 T 800 90 T 1000 70" 
                  fill="none" 
                  stroke="#131b2e" 
                  strokeWidth="3.5"
                />
                {/* Forecast Curve */}
                <path 
                  d="M 1000 70 Q 1100 65 1200 60" 
                  fill="none" 
                  stroke="#fea619" 
                  strokeWidth="3" 
                  strokeDasharray="6,6"
                />
                {/* Data Points */}
                <circle cx="200" cy="150" r="5" fill="#00B67A" />
                <circle cx="450" cy="125" r="5" fill="#00B67A" />
                <circle cx="720" cy="95" r="5" fill="#00B67A" />
                <circle cx="950" cy="73" r="5" fill="#00B67A" />
              </svg>

              {/* Tooltip Simulation */}
              <div className="absolute left-[70%] top-[20%] bg-primary text-on-primary p-3 rounded-xl shadow-xl pointer-events-none text-xs flex flex-col gap-0.5">
                <span className="font-bold opacity-75 text-[10px]">SATIŞ - GEÇEN HAFTA</span>
                <span className="font-black text-sm">{formatPrice(avgPrice * 0.98)}</span>
                <span className="opacity-60 text-[9px]">{genName} (110k KM, Hatasız)</span>
              </div>

              {/* X-Axis labels */}
              <div className="w-full flex justify-between text-[10px] text-muted-foreground font-semibold pt-4 mt-auto border-t border-border-low/40">
                <span>KAS 23</span>
                <span>OCA 24</span>
                <span>MAR 24</span>
                <span>MAY 24</span>
                <span>TEM 24</span>
                <span>EYL 24</span>
                <span className="text-secondary font-black">AI TAHMİN</span>
              </div>

            </div>
          </section>

          {/* AI Forecast & Recent Sales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
            
            {/* AI Predictions */}
            <div className="bg-primary-container text-white p-6 sm:p-8 rounded-3xl relative overflow-hidden flex flex-col justify-between shadow-md">
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary-container">auto_awesome</span>
                  <h2 className="font-title-md text-lg font-bold">AI Fiyat Tahmini (6 Aylık)</h2>
                </div>
                <p className="opacity-80 text-xs leading-relaxed">
                  Mevcut enflasyon eğilimleri, piyasa likiditesi ve yeni kasa lansmanları analiz edilerek {genName} serisi için stabilizesyon öngörülmektedir.
                </p>

                <div className="space-y-3 pt-4">
                  <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs">
                    <span className="opacity-75">3 Aylık Tahmin</span>
                    <span className="font-black text-trust-green">+1.5%</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b border-white/10 text-xs">
                    <span className="opacity-75">6 Aylık Tahmin</span>
                    <span className="font-black text-white/90">-0.5%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="opacity-75">Güvenilirlik Oranı</span>
                    <span className="font-black text-secondary-container">%92</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Sales History */}
            <div className="bg-surface-container-low border border-border-low p-6 sm:p-8 rounded-3xl shadow-sm space-y-4 flex flex-col">
              <h2 className="font-title-md text-lg font-bold text-on-surface">Son Satış Faaliyetleri</h2>
              <div className="space-y-3 overflow-y-auto max-h-[220px] pr-1">
                {recentSales.map((item, idx) => (
                  <div key={idx} className="bg-white border border-border-low/80 p-3 rounded-2xl flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-[20px]">directions_car</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-label-md text-xs font-bold truncate text-primary">{item.desc}</h4>
                        <p className="text-[10px] text-muted-foreground truncate">{item.km} • {item.location}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-black text-xs text-primary">{formatPrice(item.price)}</div>
                      <span className="text-[9px] font-bold text-trust-green tracking-wide">{item.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Value Insight Banner */}
          <section className="bg-white border-l-4 border-secondary-container p-6 rounded-2xl shadow-sm flex items-start gap-4">
            <span className="material-symbols-outlined text-secondary-container text-3xl">warning</span>
            <div>
              <h3 className="font-title-md text-sm font-bold text-on-surface">Değer Analizi Tavsiyesi: Bakımlı Araç Primi</h3>
              <p className="text-on-surface-variant text-xs mt-2 leading-relaxed">
                Soğutma sistemi, devirdaim pompası ve triger zinciri yetkili/özel serviste yenilenmiş, faturası kayıtlı {genName} modelleri piyasa ortalamasının <span className="font-bold text-primary">%4 ila %6 üzerinde</span> alıcı bulmaktadır. Satın alma yaparken bu servis belgelerini mutlaka sorgulayın.
              </p>
            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  )
}
