'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { mockGenerations, mockBrands, mockModels, mockProblemReports } from '@/lib/mock-data'
import { getSparePartsByGen } from '@/lib/parts-data'
import { Sparkles, Link as LinkIcon, AlertCircle, ChevronDown, CheckCircle, ArrowRight, ShieldAlert, HelpCircle, Activity, Wrench } from 'lucide-react'

// Main Content Component wrapped in Suspense
function AiAnalysisContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const compareParams = searchParams.get('compare')
  const urlParam = searchParams.get('url')

  const [url, setUrl] = useState(urlParam || '')
  
  // Manuel giriş durumları
  const [showManual, setShowManual] = useState(false)
  const [manualBrand, setManualBrand] = useState('')
  const [manualModel, setManualModel] = useState('')
  const [manualYear, setManualYear] = useState('')

  // Rapor durumları
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<any>(null)

  // Load initial analysis if URL param exists
  useEffect(() => {
    if (urlParam) {
      handleAnalyzeUrl(urlParam)
    } else {
      // Default mock report for F30 if no compare and no URL
      if (!compareParams) {
        setReport({
          detectedBrand: 'BMW',
          detectedModel: '3 Serisi',
          detectedGeneration: 'F30',
          detectedYear: '2014',
          chassis: 'F30 LCI',
          engineCode: 'N13B16',
          imageUrl: '/cars/f30.png',
          riskLevel: 'Medium',
          gaugeOffset: 125.6, // ~50%
          criticalRisks: [
            {
              title: 'Genleşme Kabı (Coolant Expansion Tank)',
              description: 'Bu kilometrede çatlama geçmişi yaygındır. Genleşme kabı kaynak yerlerindeki beyaz tortuları kontrol edin.',
              priority: 'HIGH PRIORITY',
              icon: 'thermostat'
            },
            {
              title: 'N13 Yağ Solenoidi (Oil Solenoid)',
              description: 'Kablo tesisatından sızan yağ riski. Solenoid soketlerinde yağ birikintisi olup olmadığını inceleyin.',
              priority: 'TECHNICAL CHECK',
              icon: 'oil_barrel'
            },
            {
              title: 'Turbo Wastegate Boşluğu (Rattle)',
              description: 'Soğuk çalıştırmada gelen metalik tıkırtı sesi aşınmayı gösterir. Drivetrain Malfunction hatasına yol açabilir.',
              priority: 'MONITOR',
              icon: 'bolt'
            }
          ],
          marketPrice: 1350000,
          communityAverage: 1240000,
          percentageAbove: 8.8
        })
      }
    }
  }, [urlParam, compareParams])

  const handleAnalyzeUrl = (targetUrl: string) => {
    setLoading(true)
    setError('')
    setReport(null)

    // Mock delay
    setTimeout(() => {
      setReport({
        detectedBrand: 'BMW',
        detectedModel: '3 Serisi',
        detectedGeneration: 'F30',
        detectedYear: '2014',
        chassis: 'F30 LCI',
        engineCode: 'N13B16',
        imageUrl: '/cars/f30.png',
        riskLevel: 'Medium',
        gaugeOffset: 125.6, // ~50%
        criticalRisks: [
          {
            title: 'Genleşme Kabı (Coolant Expansion Tank)',
            description: 'Bu kilometrede çatlama geçmişi yaygındır. Genleşme kabı kaynak yerlerindeki beyaz tortuları kontrol edin.',
            priority: 'HIGH PRIORITY',
            icon: 'thermostat'
          },
          {
            title: 'N13 Yağ Solenoidi (Oil Solenoid)',
            description: 'Kablo tesisatından sızan yağ riski. Solenoid soketlerinde yağ birikintisi olup olmadığını inceleyin.',
            priority: 'TECHNICAL CHECK',
            icon: 'oil_barrel'
          },
          {
            title: 'Turbo Wastegate Boşluğu (Rattle)',
            description: 'Soğuk çalıştırmada gelen metalik tıkırtı sesi aşınmayı gösterir. Drivetrain Malfunction hatasına yol açabilir.',
            priority: 'MONITOR',
            icon: 'bolt'
          }
        ],
        marketPrice: 1350000,
        communityAverage: 1240000,
        percentageAbove: 8.8
      })
      setLoading(false)
    }, 1200)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    router.push(`/ai-analiz?url=${encodeURIComponent(url)}`)
  }

  // Handle Comparison Rendering
  if (compareParams) {
    const compareIds = compareParams.split(',')
    const compareGenerations = mockGenerations.filter(g => compareIds.includes(g.id))

    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-10 text-center sm:text-left">
          <span className="inline-flex items-center gap-1 bg-warning/10 border border-warning/30 rounded-full px-3 py-1 text-xs font-semibold text-warning">
            <Sparkles className="h-3.5 w-3.5" />
            AI Teknik Karşılaştırma Raporu
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-3">Araç Karşılaştırma Paneli</h1>
          <p className="text-xs text-muted mt-2">
            Seçtiğiniz araç nesillerini teknik dayanıklılık, kronik sorun sıklığı ve yedek parça maliyetleri açısından yan yana karşılaştırın.
          </p>
        </div>

        {compareGenerations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Compare Matrix Table */}
            <div className="lg:col-span-12 overflow-x-auto bg-white border border-border rounded-3xl p-6 shadow-xl">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 pb-4">
                    <th className="p-4 text-xs font-black uppercase text-muted-foreground w-1/4">Özellik / Veri</th>
                    {compareGenerations.map(gen => {
                      const brand = mockBrands.find(b => b.id === (mockModels.find(m => m.id === gen.model_id)?.brand_id))
                      const model = mockModels.find(m => m.id === gen.model_id)
                      return (
                        <th key={gen.id} className="p-4 w-1/3 text-center border-l border-border/60">
                          <div className="flex flex-col items-center">
                            {brand && (
                              <img src={brand.logo_url} alt={brand.name} className="h-10 w-10 object-contain mb-2 bg-slate-50 border border-border/40 p-1 rounded-lg" />
                            )}
                            <h3 className="font-headline-lg-mobile text-sm font-black text-foreground">{brand?.name} {model?.name} {gen.name}</h3>
                            <span className="text-[10px] bg-accent/15 text-accent font-bold px-2 py-0.5 rounded-full mt-1">{gen.years}</span>
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {/* Image */}
                  <tr>
                    <td className="p-4 text-xs font-bold text-muted-foreground">Araç Görseli</td>
                    {compareGenerations.map(gen => (
                      <td key={gen.id} className="p-4 border-l border-border/60">
                        {gen.image_url ? (
                          <img src={gen.image_url} alt={gen.name} className="w-40 h-24 object-cover mx-auto rounded-xl border border-border shadow-sm" />
                        ) : (
                          <div className="w-40 h-24 bg-muted/20 border border-dashed border-border rounded-xl flex items-center justify-center mx-auto text-muted text-xs">Görsel Yok</div>
                        )}
                      </td>
                    ))}
                  </tr>
                  {/* Score */}
                  <tr>
                    <td className="p-4 text-xs font-bold text-muted-foreground">Genel Topluluk Puanı</td>
                    {compareGenerations.map(gen => (
                      <td key={gen.id} className="p-4 border-l border-border/60 text-center">
                        <span className="inline-flex items-center gap-1 bg-trust-green/10 text-trust-green px-3 py-1 rounded-full font-black text-sm">
                          <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          {gen.slug === 'f30' ? '4.2' : gen.slug === 'e90' ? '3.5' : gen.slug === 'w204' ? '4.5' : '3.8'}
                        </span>
                      </td>
                    ))}
                  </tr>
                  {/* Motor List */}
                  <tr>
                    <td className="p-4 text-xs font-bold text-muted-foreground">Yaygın Motor Seçenekleri</td>
                    {compareGenerations.map(gen => (
                      <td key={gen.id} className="p-4 border-l border-border/60 text-xs text-muted-foreground">
                        <ul className="list-disc pl-4 space-y-1">
                          {gen.engines.map((eng, idx) => (
                            <li key={idx}><strong className="text-foreground">{eng.name}</strong> ({eng.consumption})</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>
                  {/* Chronic Problems */}
                  <tr>
                    <td className="p-4 text-xs font-bold text-muted-foreground">Kritik Kronik Riski</td>
                    {compareGenerations.map(gen => {
                      const problems = mockProblemReports.filter(p => p.generation_id === gen.id)
                      return (
                        <td key={gen.id} className="p-4 border-l border-border/60 text-xs">
                          {problems.length > 0 ? (
                            <ul className="space-y-1.5">
                              {problems.map(p => (
                                <li key={p.id} className="flex items-start gap-1.5 text-danger font-semibold">
                                  <span className="material-symbols-outlined text-[14px] mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
                                  <span>{p.title}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-trust-green font-bold">Kritik Sorun Yok</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                  {/* Spare Parts Average */}
                  <tr>
                    <td className="p-4 text-xs font-bold text-muted-foreground">Tahmini Parça Maliyetleri</td>
                    {compareGenerations.map(gen => {
                      const parts = getSparePartsByGen(gen.slug)
                      return (
                        <td key={gen.id} className="p-4 border-l border-border/60 text-xs">
                          <div className="space-y-1">
                            {parts.items.slice(0, 3).map((p, idx) => (
                              <div key={idx} className="flex justify-between text-[11px]">
                                <span className="text-muted-foreground">{p.name.split(' ')[0]}...</span>
                                <span className="font-bold text-warning">{p.oemPrice}</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                  {/* Action */}
                  <tr>
                    <td className="p-4 text-xs font-bold text-muted-foreground">Detaylı İnceleme</td>
                    {compareGenerations.map(gen => {
                      const brand = mockBrands.find(b => b.id === (mockModels.find(m => m.id === gen.model_id)?.brand_id))
                      const model = mockModels.find(m => m.id === gen.model_id)
                      return (
                        <td key={gen.id} className="p-4 border-l border-border/60 text-center">
                          <Link 
                            href={`/arac/${brand?.slug}/${model?.slug}/${gen.slug}`}
                            className="inline-flex items-center gap-1 bg-primary text-on-primary px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 active:scale-95 transition-all"
                          >
                            Kasa Raporuna Git
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </td>
                      )
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 border border-dashed border-border bg-card rounded-3xl text-sm text-muted">
            Karşılaştırma için araç bulunamadı.
          </div>
        )}
      </div>
    )
  }

  // Single Report Rendering
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Search & URL Panel */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="inline-flex items-center gap-1 bg-warning/10 border border-warning/30 rounded-full px-3 py-1 text-xs font-semibold text-warning">
          <Sparkles className="h-3.5 w-3.5" />
          Yapay Zeka İlan Analizcisi
        </span>
        <h1 className="text-3xl font-black tracking-tight mt-3">İlan Analiz Paneli</h1>
        <p className="text-xs text-muted mt-2">
          Sahibinden.com veya arabam.com ilan linkini girerek kronik sorunları ve fiyat karşılaştırmasını saniyeler içinde öğrenin.
        </p>
      </div>

      {/* Form Input */}
      <div className="rounded-3xl border border-border bg-card p-6 shadow-xl relative overflow-hidden mb-12">
        <div className="absolute top-0 right-0 h-32 w-32 bg-accent/5 rounded-full blur-3xl"></div>
        <form onSubmit={handleFormSubmit} className="space-y-4 relative z-10">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-foreground/80 flex items-center gap-1">
              <LinkIcon className="h-3.5 w-3.5 text-accent" />
              İlan Linki (URL)
            </label>
            <input
              type="url"
              placeholder="https://www.sahibinden.com/ilan/vasita-otomobil..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="rounded-xl border border-border bg-background px-4 py-3 text-xs outline-none focus:border-accent ring-accent/20 focus:ring-4 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5 shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? 'Analiz Ediliyor...' : 'Aracı Yapay Zeka ile Analiz Et'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="bg-card border border-border rounded-3xl p-10 text-center flex flex-col items-center justify-center gap-4 animate-pulse">
          <Sparkles className="h-10 w-10 text-warning animate-spin" />
          <p className="text-xs text-muted font-bold">
            Yapay zeka ilan detaylarını çözümlüyor, kronik veri tabanıyla eşleştiriyor ve rapor yazıyor...
          </p>
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 bg-danger/10 p-4 rounded-3xl text-xs text-danger mb-6">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Rapor Çıktısı (Mockup ve Tema Yapısı) */}
      {!loading && report && (
        <ReportOutput report={report} />
      )}
    </div>
  )
}

function ReportOutput({ report }: { report: any }) {
  const [dashoffset, setDashoffset] = useState(251.2)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDashoffset(125.6) // Animate to Medium (~50% offset)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Breadcrumb & Title */}
      <div>
        <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-2">
          <span>Raporlar</span>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span>AI Analizi</span>
        </div>
        <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
          AI İlan Analiz Raporu | {report.detectedBrand} {report.detectedModel} {report.detectedGeneration}
        </h1>
      </div>

      {/* Bento Grid Summary */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter mb-12">
        {/* Risk Level Gauge */}
        <div className="md:col-span-4 bg-surface-container-low p-6 rounded-xl flex flex-col items-center justify-center relative overflow-hidden border border-border-low">
          <div className="relative w-32 h-32 mb-4">
            <svg className="gauge-svg w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
              <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
              <circle 
                className="text-[#fea619] transition-all duration-700" 
                cx="50" 
                cy="50" 
                fill="transparent" 
                r="40" 
                stroke="currentColor" 
                strokeDasharray="251.2" 
                strokeDashoffset={dashoffset}
                strokeLinecap="round" 
                strokeWidth="8"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-title-md font-bold text-on-surface">Orta</span>
            </div>
          </div>
          <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-widest">Risk Seviyesi</span>
          
          <div className="absolute top-0 right-0 p-4">
            <span className="material-symbols-outlined text-secondary-container animate-pulse">priority_high</span>
          </div>
        </div>

        {/* Vehicle Confirmation Hero */}
        <div className="md:col-span-8 relative bg-primary-container rounded-xl overflow-hidden group min-h-[200px]">
          <div className="absolute inset-0 opacity-40">
            <img 
              className="w-full h-full object-cover grayscale" 
              alt="BMW F30" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAxG8s_CtZKWey24hQs5_0Hfvojc6oNEXxzgTia3u8SRrBB1QlWuAszEhedVofbJIVqLXnvpTUq33zKBwFYdah2PTtvZNCURIkhqwJXveHLR31wTZ_ciKVEz4WbQKOaEFb0FkZBGBAXrPUKjFPgQXfp72olWtV3OQ0d8vAbGSRfoiKl8XR5RNvNU7x7uA0qJrKjmgJuw5My19LnxzeHWxTkfq2YybPX_l0084BMeZtJZIjjrIkULrMJBgorXNN3GdRadR4IV9IYRSM"
            />
          </div>
          <div className="relative z-10 p-8 flex flex-col h-full justify-between">
            <div>
              <div className="inline-flex items-center gap-2 bg-trust-green/20 text-trust-green px-3 py-1 rounded-full text-caption mb-4">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span className="font-label-md text-label-md">Araç Doğrulandı</span>
              </div>
              <h2 className="text-on-primary font-headline-lg text-headline-lg">{report.detectedYear} {report.detectedBrand} {report.detectedModel} ({report.engineCode} Motor)</h2>
              <p className="text-on-primary-container font-body-md text-body-md mt-2">İlan linkinden doğru şekilde tespit edildi.</p>
            </div>
            
            <div className="flex gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                <span className="block text-on-primary/60 text-caption font-label-md">Şasi</span>
                <span className="text-on-primary font-bold">{report.chassis}</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10">
                <span className="block text-on-primary/60 text-caption font-label-md">Motor Kodu</span>
                <span className="text-on-primary font-bold">{report.engineCode}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Risks Section */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-title-md text-title-md font-bold text-primary">Bu Model İçin En Kritik 3 Risk</h3>
          <span className="text-warning-red font-label-md text-label-md flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]">report</span> Kontrol Önerilir
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {report.criticalRisks.map((risk: any, idx: number) => (
            <div key={idx} className="border-l-4 border-warning-red bg-orange-50/30 p-6 rounded-r-xl border-y border-r border-border-low hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-4">
                <span className="material-symbols-outlined text-warning-red text-[24px]">
                  {risk.icon === 'thermostat' ? 'thermostat' : risk.icon === 'oil_barrel' ? 'oil_barrel' : 'bolt'}
                </span>
                <h4 className="font-label-md text-label-md text-on-surface">{risk.title}</h4>
              </div>
              <p className="text-on-surface-variant font-body-md text-body-md">{risk.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-0.5 bg-warning-red/10 text-warning-red text-caption font-bold rounded">
                  {risk.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Market Value Comparison */}
      <div className="bg-surface-gray rounded-xl p-8 border border-border-low mb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h3 className="font-title-md text-title-md font-bold text-primary mb-2">Piyasa Değeri Karşılaştırması</h3>
            <p className="text-on-surface-variant font-body-md text-body-md">Bu ilandaki fiyat, topluluk tarafından doğrulanmış {report.detectedGeneration} satış ortalamasına göre ne durumda?</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-border-low text-right">
            <span className="block text-on-surface-variant text-caption font-label-md">Topluluk Ortalaması</span>
            <span className="text-headline-lg font-display-lg text-primary">{(report.communityAverage).toLocaleString('tr-TR')} TL</span>
          </div>
        </div>

        {/* Price Slider */}
        <div className="mt-8 relative h-4 bg-surface-container-highest rounded-full">
          <div className="absolute left-0 top-0 h-full bg-trust-green rounded-l-full" style={{ width: '45%' }}></div>
          <div className="absolute top-0 h-full w-2 bg-primary z-10" style={{ left: '65%' }}>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-caption px-2 py-1 rounded whitespace-nowrap font-bold">
              İlan Fiyatı: {(report.marketPrice).toLocaleString('tr-TR')} TL
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-3 text-caption text-on-surface-variant font-label-md">
          <span>Piyasa Altı</span>
          <span>Adil Fiyat</span>
          <span>Piyasa Üstü</span>
        </div>

        <div className="mt-6 p-4 bg-error-container/20 border border-error-container/30 rounded-lg flex items-center gap-3">
          <span className="material-symbols-outlined text-error">info</span>
          <p className="text-on-error-container font-label-md text-label-md">
            Fiyat, bu donanım ve kilometre için topluluk ortalamasının %{report.percentageAbove} üzerindedir.
          </p>
        </div>
      </div>

      {/* Next Steps */}
      <div className="flex flex-col md:flex-row gap-gutter">
        <button className="flex-1 bg-secondary-container text-on-secondary-container py-5 rounded-xl font-title-md text-title-md font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all active:scale-95 shadow-sm">
          <span className="material-symbols-outlined">support_agent</span>
          Uzmana Sor
        </button>
        <Link 
          href={`/arac/bmw/3-series/f30`}
          className="flex-1 border-2 border-primary-container text-primary-container py-5 rounded-xl font-title-md text-title-md font-bold flex items-center justify-center gap-3 hover:bg-primary-container hover:text-white transition-all active:scale-95 text-center block"
        >
          <span className="material-symbols-outlined font-bold">menu_book</span>
          Tam Model Rehberini Gör
        </Link>
      </div>
    </div>
  )
}

export default function AiAnalysisPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 py-12 bg-background min-h-screen">
        <Suspense fallback={
          <div className="text-center py-24 flex flex-col items-center gap-4">
            <Sparkles className="h-10 w-10 text-warning animate-spin" />
            <p className="text-xs text-muted font-bold">Sayfa yükleniyor...</p>
          </div>
        }>
          <AiAnalysisContent />
        </Suspense>
      </main>
      <Footer />
    </>
  )
}
