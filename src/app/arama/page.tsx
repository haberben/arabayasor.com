'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { mockBrands, mockModels, mockGenerations, mockReviews, mockProblemReports } from '@/lib/mock-data'
import { getSparePartsByGen } from '@/lib/parts-data'
import { 
  Search, SlidersHorizontal, ChevronDown, ChevronUp, Star, 
  ShieldAlert, MessageSquare, Sparkles, Plus, Minus, RotateCcw, 
  HelpCircle, ThumbsUp, ThumbsDown, ArrowRight, Car, Activity, Wrench, AlertCircle
} from 'lucide-react'

// Minimalist vector SVGs representing each car silhouette by brand
function CarSilhouette({ brand }: { brand: string }) {
  const brandLower = brand.toLowerCase()
  if (brandLower.includes('bmw')) {
    return (
      <svg className="w-full h-32 text-accent/25 bg-accent/5 dark:bg-accent/10 rounded-2xl p-4 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 50">
        <path d="M10,38 C20,38 22,35 30,35 C38,35 40,22 55,20 C70,18 78,30 84,33 C90,35 92,38 94,38 L94,42 L10,42 Z" fill="currentColor" />
        <circle cx="28" cy="40" r="5.5" fill="#1e293b" stroke="currentColor" stroke-width="2" />
        <circle cx="74" cy="40" r="5.5" fill="#1e293b" stroke="currentColor" stroke-width="2" />
        <path d="M52,22 L68,22 L75,30 L52,30 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M50,22 L36,22 L32,30 L50,30 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
      </svg>
    )
  }
  if (brandLower.includes('mercedes')) {
    return (
      <svg className="w-full h-32 text-stone-400/25 bg-stone-500/5 dark:bg-stone-500/10 rounded-2xl p-4 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 50">
        <path d="M8,36 C18,36 24,34 32,34 C40,34 45,21 58,19 C71,17 76,28 84,32 C92,34 94,36 96,36 L96,41 L8,41 Z" fill="currentColor" />
        <circle cx="26" cy="39" r="6" fill="#1e293b" stroke="currentColor" stroke-width="2" />
        <circle cx="76" cy="39" r="6" fill="#1e293b" stroke="currentColor" stroke-width="2" />
        <path d="M55,20.5 L70,20.5 L76,28 L55,28 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M53,20.5 L38,20.5 L34,28 L53,28 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
      </svg>
    )
  }
  if (brandLower.includes('audi')) {
    return (
      <svg className="w-full h-32 text-zinc-400/25 bg-zinc-500/5 dark:bg-zinc-500/10 rounded-2xl p-4 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 50">
        <path d="M12,37 C22,37 25,34 33,34 C41,34 42,20 54,19 C66,18 76,28 82,31 C88,33 90,37 92,37 L92,41 L12,41 Z" fill="currentColor" />
        <circle cx="30" cy="39" r="5.5" fill="#1e293b" stroke="currentColor" stroke-width="2" />
        <circle cx="72" cy="39" r="5.5" fill="#1e293b" stroke="currentColor" stroke-width="2" />
        <path d="M51,21 L65,21 L70,28 L51,28 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M49,21 L38,21 L35,28 L49,28 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
      </svg>
    )
  }
  if (brandLower.includes('toyota')) {
    return (
      <svg className="w-full h-32 text-stone-300/20 bg-stone-500/5 dark:bg-stone-500/10 rounded-2xl p-4 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 50">
        <path d="M10,38 C18,38 22,35 29,35 C36,35 39,23 51,22 C63,21 73,29 79,33 C85,35 88,38 90,38 L90,42 L10,42 Z" fill="currentColor" />
        <circle cx="28" cy="40" r="5.5" fill="#1e293b" stroke="currentColor" stroke-width="2" />
        <circle cx="70" cy="40" r="5.5" fill="#1e293b" stroke="currentColor" stroke-width="2" />
        <path d="M49,23.5 L62,23.5 L67,29 L49,29 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
        <path d="M47,23.5 L37,23.5 L34,29 L47,29 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
      </svg>
    )
  }
  // Default/Renault
  return (
    <svg className="w-full h-32 text-accent/20 bg-accent/5 dark:bg-accent/10 rounded-2xl p-4 transition-transform duration-300 group-hover:scale-105" viewBox="0 0 100 50">
      <path d="M12,38 C20,38 24,35 30,35 C36,35 40,24 50,23 C60,22 70,30 76,33 C82,35 84,38 86,38 L86,42 L12,42 Z" fill="currentColor" />
      <circle cx="28" cy="40" r="5.5" fill="#1e293b" stroke="currentColor" stroke-width="2" />
      <circle cx="68" cy="40" r="5.5" fill="#1e293b" stroke="currentColor" stroke-width="2" />
      <path d="M48,24.5 L59,24.5 L64,29 L48,29 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
      <path d="M46,24.5 L38,24.5 L35,29 L46,29 Z" fill="none" stroke="currentColor" stroke-width="1.5" />
    </svg>
  )
}

export default function SearchPage() {
  // Filters States
  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedFuel, setSelectedFuel] = useState('')
  const [minYear, setMinYear] = useState('')
  const [maxYear, setMaxYear] = useState('')
  const [minRating, setMinRating] = useState(0)

  // Expand State
  const [expandedGenId, setExpandedGenId] = useState<string | null>(null)
  const [expandedTab, setExpandedTab] = useState<'problems' | 'reviews' | 'analysis' | 'proscons' | 'parts'>('problems')

  // Dynamic Models list based on selected brand
  const filteredModels = selectedBrand
    ? mockModels.filter(m => m.brand_id === selectedBrand)
    : mockModels

  // Filter Generations logic
  const filteredGenerations = mockGenerations.filter(gen => {
    // 1. Marka filtresi
    const modelObj = mockModels.find(m => m.id === gen.model_id)
    if (selectedBrand && modelObj?.brand_id !== selectedBrand) return false

    // 2. Model filtresi
    if (selectedModel && gen.model_id !== selectedModel) return false

    // 3. Yakıt filtresi
    if (selectedFuel) {
      const hasFuel = gen.engines.some(eng => eng.fuel.toLowerCase().includes(selectedFuel.toLowerCase()))
      if (!hasFuel) return false
    }

    // 4. Yıl aralığı filtresi
    const yearsArr = gen.years.split('-')
    const startYear = parseInt(yearsArr[0].trim())
    const endYear = yearsArr[1] ? parseInt(yearsArr[1].trim()) : new Date().getFullYear()

    if (minYear && startYear < parseInt(minYear)) return false
    if (maxYear && endYear > parseInt(maxYear)) return false

    // 5. Değerlendirme puanı filtresi
    if (minRating > 0) {
      const genReviews = mockReviews.filter(r => r.generation_id === gen.id)
      const avg = genReviews.length 
        ? genReviews.reduce((acc, r) => acc + (r.rating_engine + r.rating_gearbox + r.rating_electric + r.rating_fuel + r.rating_comfort + r.rating_parts + r.rating_mechanic) / 7, 0) / genReviews.length
        : 5.0
      if (avg < minRating) return false
    }

    return true
  })

  // Reset Filters helper
  const handleResetFilters = () => {
    setSelectedBrand('')
    setSelectedModel('')
    setSelectedFuel('')
    setMinYear('')
    setMaxYear('')
    setMinRating(0)
    setExpandedGenId(null)
  }

  // Averages helper
  const getGenAvgRating = (genId: string) => {
    const genReviews = mockReviews.filter(r => r.generation_id === genId)
    if (!genReviews.length) return '5.0'
    const total = genReviews.reduce((acc, r) => acc + (r.rating_engine + r.rating_gearbox + r.rating_electric + r.rating_fuel + r.rating_comfort + r.rating_parts + r.rating_mechanic) / 7, 0)
    return (total / genReviews.length).toFixed(1)
  }

  // Pros & Cons helper
  const getProsCons = (brand: string, genSlug: string) => {
    const b = brand.toLowerCase()
    if (b.includes('bmw')) {
      return {
        pros: ['ZF 8 ileri tork konvertörlü harika otomatik şanzıman.', 'Yüksek sürüş keyfi ve yol tutuş dinamikleri.', 'Geniş yan sanayi parça ve usta ağı.'],
        cons: ['Soğutma sistemi su kaçakları (özellikle N13 motor).', 'Arka zincir uzaması ve hırıltı (N47 motor).', 'Hırpalanmış ve modifiye edilmiş araçların fazlalığı.']
      }
    }
    if (b.includes('mercedes')) {
      return {
        pros: ['Kasa tokluğu, sürüş ağırlığı ve üst düzey güvenlik.', 'İç mekan yalıtımı ve süspansiyon konforu.', 'Zengin donanım paketleri (Fascination, AMG).'],
        cons: ['Eksantrik dişlileri (kam milleri) aşınması.', 'Şehir içi yüksek yakıt tüketimi (Kompressor modeller).', 'Direksiyon kilidi (ESL/ELV) motor arızaları.']
      }
    }
    if (b.includes('audi')) {
      return {
        pros: ['Quattro modellerde muazzam yol tutuş.', 'Kabinde son derece sessiz ve tok sürüş.', 'Kaliteli koltuk ve kabin döşemeleri.'],
        cons: ['TFSI motorlarda kronik yağ yakma/eksiltme.', 'Multitronic (CVT) şanzıman beyni (TCU) arızası.', 'Yetkili servis ve yedek parça fiyatları.']
      }
    }
    // Default
    return {
      pros: ['Sınıfına göre ekonomik yedek parça ve usta bulunabilirliği.', 'Son derece düşük yakıt tüketimi (özellikle dCi motorlar).', 'Hızlı ikinci el alım satım pazarı.'],
      cons: ['Yüksek hızlarda zayıf yalıtım (rüzgar ve yol sesi).', 'Sert plastik malzeme kalitesi.', 'Yarı otomatik şanzımanlarda (MultiMode, EDC) ısınma.']
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="mb-10">
            <h1 className="text-3xl font-black tracking-tight">Gelişmiş Filtreleme & Arama</h1>
            <p className="text-xs text-muted mt-2">
              Tıpkı ilan sitelerindeki gibi istediğiniz kriterleri girin, aracın teknik özellikleriyle beraber tüm kronik sorunlarını, artılarını/eksilerini ve topluluk incelemelerini tek ekranda görün.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            
            {/* LEFT SIDEBAR: FILTERS */}
            <div className="lg:col-span-1 glass-card p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-4">
                <span className="text-xs font-black uppercase tracking-wider text-foreground/90 flex items-center gap-1.5">
                  <SlidersHorizontal className="h-4.5 w-4.5 text-accent" />
                  Kriter Filtreleri
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-[10px] text-muted hover:text-accent font-bold flex items-center gap-1 transition-colors"
                >
                  <RotateCcw className="h-3 w-3" />
                  Temizle
                </button>
              </div>

              {/* Marka */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-foreground/80 uppercase">Marka</label>
                <select
                  value={selectedBrand}
                  onChange={(e) => {
                    setSelectedBrand(e.target.value)
                    setSelectedModel('')
                  }}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-accent"
                >
                  <option value="">Tümü</option>
                  {mockBrands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-foreground/80 uppercase">Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-accent"
                >
                  <option value="">Tümü</option>
                  {filteredModels.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Yakıt Tipi */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-foreground/80 uppercase">Yakıt Türü</label>
                <select
                  value={selectedFuel}
                  onChange={(e) => setSelectedFuel(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-xs outline-none focus:border-accent"
                >
                  <option value="">Tümü</option>
                  <option value="Benzin">Benzin</option>
                  <option value="Dizel">Dizel</option>
                  <option value="LPG">LPG / Benzin</option>
                </select>
              </div>

              {/* Yıl Aralığı */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-foreground/80 uppercase">Üretim Yılı Aralığı</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min Yıl"
                    value={minYear}
                    onChange={(e) => setMinYear(e.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none text-center"
                  />
                  <input
                    type="number"
                    placeholder="Max Yıl"
                    value={maxYear}
                    onChange={(e) => setMaxYear(e.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-xs outline-none text-center"
                  />
                </div>
              </div>

              {/* Minimum Değerlendirme Puanı */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-foreground/80 uppercase">Minimum Puan</label>
                <div className="flex gap-1">
                  {[3, 4, 5].map((stars) => (
                    <button
                      key={stars}
                      onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                      className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1 ${minRating === stars ? 'bg-accent border-accent text-accent-foreground' : 'border-border text-muted hover:text-foreground'}`}
                    >
                      <Star className="h-3 w-3 fill-current" />
                      {stars}+
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: SEARCH RESULTS */}
            <div className="lg:col-span-3 space-y-6">
              
              <div className="flex justify-between items-center glass-card px-6 py-4 shadow-sm">
                <span className="text-xs font-bold text-muted-foreground">
                  {filteredGenerations.length} araç nesli/kasası listeleniyor.
                </span>
              </div>

              {filteredGenerations.length > 0 ? (
                filteredGenerations.map(gen => {
                  const brandObj = mockBrands.find(b => b.id === (mockModels.find(m => m.id === gen.model_id)?.brand_id))
                  const modelObj = mockModels.find(m => m.id === gen.model_id)
                  const genReviews = mockReviews.filter(r => r.generation_id === gen.id)
                  const genProblems = mockProblemReports.filter(p => p.generation_id === gen.id)
                  const avgRating = getGenAvgRating(gen.id)
                  const isExpanded = expandedGenId === gen.id
                  const pc = getProsCons(brandObj?.name || '', gen.slug)

                  return (
                    <div 
                      key={gen.id}
                      className={`premium-card overflow-hidden ${isExpanded ? 'border-accent/30 shadow-md ring-2 ring-accent/5' : ''}`}
                    >
                      {/* Car Card Body */}
                      <div className="p-6 flex flex-col md:flex-row items-center gap-6">
                        
                        {/* Car Image with Brand Logo Overlay */}
                        <div className="w-full md:w-48 shrink-0 relative group overflow-hidden rounded-2xl border border-border bg-muted/10">
                          {gen.image_url ? (
                            <img
                              src={gen.image_url}
                              alt={`${brandObj?.name} ${modelObj?.name} ${gen.name}`}
                              className="w-full h-32 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <CarSilhouette brand={brandObj?.name || ''} />
                          )}
                          {brandObj && (
                            <img
                              src={brandObj.logo_url}
                              alt={brandObj.name}
                              className="absolute top-2 left-2 h-6 w-6 bg-white dark:bg-slate-900 border border-border/80 rounded-lg p-0.5 shadow-sm"
                            />
                          )}
                        </div>

                        {/* Middle info */}
                        <div className="flex-1 text-center md:text-left">
                          <span className="rounded-full bg-accent/15 text-accent px-2.5 py-0.5 text-[10px] font-black tracking-wide">
                            {gen.years}
                          </span>
                          <h2 className="text-xl font-black mt-2 text-foreground/95">
                            {brandObj?.name} {modelObj?.name} {gen.name}
                          </h2>
                          <div className="flex items-center justify-center md:justify-start gap-1.5 mt-2">
                            <div className="flex text-warning">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(parseFloat(avgRating)) ? 'fill-current' : 'text-muted-foreground/20'}`} />
                              ))}
                            </div>
                            <span className="text-xs font-bold text-foreground/80">{avgRating} Puan</span>
                            <span className="text-[10px] text-muted-foreground font-semibold">({genReviews.length} İnceleme)</span>
                          </div>

                          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-4">
                            {gen.engines.map((eng, idx) => (
                              <span key={idx} className="rounded-xl border border-border bg-background px-2.5 py-1 text-[10px] text-muted font-bold">
                                {eng.name} | {eng.consumption}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Right button */}
                        <div className="shrink-0">
                          <button
                            onClick={() => {
                              if (isExpanded) {
                                setExpandedGenId(null)
                              } else {
                                setExpandedGenId(gen.id)
                                setExpandedTab('problems')
                              }
                            }}
                            className="w-full md:w-auto flex items-center justify-center gap-1.5 rounded-full bg-accent px-5 py-3 text-xs font-black text-accent-foreground hover:bg-accent-hover transition-colors active:scale-95"
                          >
                            <span>Detayları İncele</span>
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </div>
                      </div>

                      {/* EXPANDED ACCORDION DETAILS PANEL */}
                      {isExpanded && (
                        <div className="border-t border-border bg-card/15 backdrop-blur-md p-6 animate-in slide-in-from-top-4 duration-200">
                          
                          {/* Inner Tabs Navigation */}
                          <div className="flex border-b border-border/80 pb-3 mb-6 overflow-x-auto gap-4 custom-scrollbar">
                            {[
                              { id: 'problems', label: `Kronik Sorunlar (${genProblems.length})` },
                              { id: 'reviews', label: `Değerlendirmeler (${genReviews.length})` },
                              { id: 'parts', label: 'Yedek Parça Fiyatları' },
                              { id: 'proscons', label: 'Artı & Eksiler' },
                              { id: 'analysis', label: 'AI Analiz Özeti' },
                            ].map((tab) => (
                              <button
                                key={tab.id}
                                onClick={() => setExpandedTab(tab.id as any)}
                                className={`text-[10px] font-bold uppercase tracking-wider pb-1.5 border-b-2 transition-all ${expandedTab === tab.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground'}`}
                              >
                                {tab.label}
                              </button>
                            ))}
                          </div>

                          {/* TAB CONTENT: CHRONIC PROBLEMS */}
                          {expandedTab === 'problems' && (
                            <div className="space-y-3">
                              {genProblems.length > 0 ? (
                                genProblems.map((prob) => {
                                  const total = (prob.yes_votes || 0) + (prob.no_votes || 0)
                                  const pct = total > 0 ? Math.round((prob.yes_votes || 0) / total * 100) : 0
                                  return (
                                    <div key={prob.id} className="glass-card p-4 flex items-center justify-between gap-4 shadow-sm hover:border-accent/30 transition-all">
                                      <div>
                                        <h4 className="text-xs font-bold text-foreground/90">{prob.title}</h4>
                                        <p className="text-[10px] text-muted mt-1">{prob.description}</p>
                                      </div>
                                      
                                      {/* Mini SVG Progress indicator */}
                                      <div className="flex items-center gap-3 shrink-0">
                                        <span className="text-[10px] font-bold text-danger">%{pct} Kronik</span>
                                        <div className="h-2 w-20 bg-border rounded-full overflow-hidden">
                                          <div className="h-full bg-danger rounded-full" style={{ width: `${pct}%` }}></div>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })
                              ) : (
                                <p className="text-xs text-muted text-center py-4">Bu araç için bildirilmiş kronik sorun bulunamadı.</p>
                              )}
                            </div>
                          )}

                          {/* TAB CONTENT: REVIEWS */}
                          {expandedTab === 'reviews' && (
                            <div className="space-y-4">
                              {genReviews.length > 0 ? (
                                genReviews.map((rev) => (
                                  <div key={rev.id} className="glass-card p-4 shadow-sm hover:border-accent/30 transition-all">
                                    <div className="flex justify-between items-center text-[10px] mb-2">
                                      <span className="font-bold text-foreground">@{rev.profiles?.username} ({rev.profiles?.role})</span>
                                      <span className="text-muted">{new Date(rev.created_at).toLocaleDateString('tr-TR')}</span>
                                    </div>
                                    <p className="text-xs text-muted leading-relaxed">
                                      "{rev.content}"
                                    </p>
                                  </div>
                                ))
                              ) : (
                                <p className="text-xs text-muted text-center py-4">Henüz yazılmış bir değerlendirme bulunmuyor.</p>
                              )}
                            </div>
                          )}

                          {/* TAB CONTENT: SPARE PARTS */}
                          {expandedTab === 'parts' && (
                            <div className="space-y-4">
                              <div className="glass-card p-5 shadow-md hover:border-accent/30 transition-all">
                                <div className="flex justify-between items-center gap-2 mb-4 pb-2 border-b border-border/80">
                                  <div>
                                    <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                      <Wrench className="h-4 w-4 text-accent" />
                                      Ortalama Parça & İşçilik Fiyatları
                                    </h4>
                                    <p className="text-[10px] text-muted">OEM ve Yan Sanayi tahmini parça fiyatları.</p>
                                  </div>
                                  <span className="text-[9px] bg-accent/15 text-accent font-bold px-2 py-0.5 rounded-full uppercase">
                                    Güncel Fiyatlar
                                  </span>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-left border-collapse text-[11px]">
                                    <thead>
                                      <tr className="border-b border-border/80 font-bold text-muted-foreground uppercase">
                                        <th className="pb-2">Parça Adı</th>
                                        <th className="pb-2 text-center">OEM</th>
                                        <th className="pb-2 text-center">Yan Sanayi</th>
                                        <th className="pb-2 text-center">İşçilik</th>
                                        <th className="pb-2 text-center pr-2">Zorluk</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/40">
                                      {getSparePartsByGen(gen.slug).items.map((part, idx) => (
                                        <tr key={idx} className="hover:bg-muted/10 transition-colors">
                                          <td className="py-2 font-semibold text-foreground/80">{part.name}</td>
                                          <td className="py-2 text-center font-bold text-warning">{part.oemPrice}</td>
                                          <td className="py-2 text-center font-bold text-emerald-500">{part.aftermarketPrice}</td>
                                          <td className="py-2 text-center text-muted-foreground">{part.laborCost}</td>
                                          <td className="py-2 text-center pr-2">
                                            <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${
                                              part.difficulty === 'Kolay' ? 'bg-emerald-500/10 text-emerald-500' :
                                              part.difficulty === 'Orta' ? 'bg-warning/10 text-warning' :
                                              'bg-danger/10 text-danger'
                                            }`}>
                                              {part.difficulty}
                                            </span>
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="mt-4 bg-background border border-border/60 rounded-xl p-3">
                                  <h5 className="text-[10px] font-bold text-foreground flex items-center gap-1 mb-1">
                                    <AlertCircle className="h-3.5 w-3.5 text-accent" />
                                    Uzman Tavsiyesi:
                                  </h5>
                                  <p className="text-[10px] text-muted leading-relaxed">
                                    {getSparePartsByGen(gen.slug).generalNotes}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* TAB CONTENT: PROS & CONS */}
                          {expandedTab === 'proscons' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="bg-success/5 border border-success/15 p-5 rounded-[20px] shadow-sm hover:border-success/30 transition-all">
                                <h4 className="text-xs font-bold text-success flex items-center gap-1 mb-3">
                                  <ThumbsUp className="h-4 w-4" />
                                  Öne Çıkan Artılar (Pros)
                                </h4>
                                <ul className="space-y-2 text-[11px] text-muted">
                                  {pc.pros.map((p, i) => (
                                    <li key={i} className="flex gap-1.5 items-start">
                                      <span className="text-success mt-0.5">•</span>
                                      <span>{p}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              <div className="bg-danger/5 border border-danger/15 p-5 rounded-[20px] shadow-sm hover:border-danger/30 transition-all">
                                <h4 className="text-xs font-bold text-danger flex items-center gap-1 mb-3">
                                  <ThumbsDown className="h-4 w-4" />
                                  Kritik Eksiler (Cons)
                                </h4>
                                <ul className="space-y-2 text-[11px] text-muted">
                                  {pc.cons.map((c, i) => (
                                    <li key={i} className="flex gap-1.5 items-start">
                                      <span className="text-danger mt-0.5">•</span>
                                      <span>{c}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </div>
                          )}

                          {/* TAB CONTENT: AI ANALYSIS */}
                          {expandedTab === 'analysis' && (
                            <div className="glass-card p-5 relative overflow-hidden shadow-md">
                              <div className="absolute top-0 right-0 h-16 w-16 bg-warning/5 rounded-full blur-xl"></div>
                              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2">
                                <Sparkles className="h-4 w-4 text-warning" />
                                Sistem Analiz Özeti
                              </h4>
                              <p className="text-xs text-muted leading-relaxed">
                                {gen.buying_guide?.split('\n').filter((line: string) => line.startsWith('*')).slice(0, 3).map((line: string) => line.replace('*', '').trim()).join('. ') || 'Detaylı analiz verisi bulunmuyor.'}.
                              </p>
                              <div className="mt-4 pt-3 border-t border-border/30 flex justify-end">
                                <Link 
                                  href={`/arac/${brandObj?.slug}/${modelObj?.slug}/${gen.slug}`}
                                  className="text-xs font-bold text-accent hover:underline flex items-center gap-1"
                                >
                                  Tam İnceleme Sayfasına Git
                                  <ArrowRight className="h-3.5 w-3.5" />
                                </Link>
                              </div>
                            </div>
                          )}

                        </div>
                      )}
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-16 border border-dashed border-border bg-card rounded-3xl text-sm text-muted">
                  Kriterlerinize uygun araba kasası bulunamadı. Filtreleri temizlemeyi deneyin.
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
