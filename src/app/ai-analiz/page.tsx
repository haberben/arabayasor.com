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
        <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
          {/* Breadcrumb & Title */}
          <div>
            <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-2">
              <span>Raporlar</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span>AI Analiz</span>
            </div>
            <h1 className="font-headline-lg text-3xl font-black text-foreground tracking-tight">
              AI İlan Analiz Raporu | {report.detectedBrand} {report.detectedModel} {report.detectedGeneration}
            </h1>
          </div>

          {/* Bento Grid Summary */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-8">
            {/* Risk Level Gauge */}
            <div className="md:col-span-4 bg-surface-container-low p-6 rounded-xl flex flex-col items-center justify-center relative overflow-hidden border border-border-low">
              <div className="relative w-32 h-32 mb-4">
                <svg className="w-full h-full -rotate-90 origin-center" viewBox="0 0 100 100">
                  <circle className="text-surface-container-highest" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle className="text-[#fea619] transition-all duration-700" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeDasharray="251.2" strokeDashoffset="125.6" strokeLinecap="round" strokeWidth="8"></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold text-foreground">{report.riskLevel}</span>
                </div>
              </div>
              <span className="font-label-md text-xs font-bold text-muted uppercase tracking-widest">RİSK SEVİYESİ</span>
              
              <div className="absolute top-0 right-0 p-4">
                <span className="material-symbols-outlined text-warning animate-pulse">priority_high</span>
              </div>
            </div>

            {/* Vehicle Confirmation Hero */}
            <div className="md:col-span-8 relative bg-primary-container rounded-xl overflow-hidden min-h-[200px] flex flex-col justify-end p-8">
              <div className="absolute inset-0 opacity-40 bg-slate-800">
                {/* Fallback pattern representing car detail background */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              </div>
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-1 bg-trust-green/20 text-trust-green px-3 py-1 rounded-full text-xs font-bold mb-4">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  <span>Eşleşme Doğrulandı</span>
                </div>
                <h2 className="text-white font-headline-lg text-2xl font-black">{report.detectedYear} {report.detectedBrand} {report.detectedModel} ({report.engineCode} Motor)</h2>
                <p className="text-slate-300 text-xs mt-2">İlan linkinden araç özellikleri başarıyla tespit edildi.</p>
                
                <div className="flex gap-4 mt-6">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs">
                    <span className="block text-slate-300">Kasa Kodu</span>
                    <span className="text-white font-bold">{report.chassis}</span>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-lg border border-white/10 text-xs">
                    <span className="block text-slate-300">Motor Kodu</span>
                    <span className="text-white font-bold">{report.engineCode}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Top 3 Risks Section */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-foreground">Bu Model İçin En Kritik 3 Risk</h3>
              <span className="text-warning-red font-bold text-xs flex items-center gap-1">
                <span className="material-symbols-outlined text-[18px]">report</span> Odaklanılması Önerilir
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {report.criticalRisks.map((risk: any, idx: number) => (
                <div key={idx} className="border-l-4 border-[#F95A93] bg-orange-50/10 p-6 rounded-r-xl border-y border-r border-border-low hover:shadow-md transition-all">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="material-symbols-outlined text-[#F95A93] text-[24px]">
                      {risk.icon === 'thermostat' ? 'thermostat' : risk.icon === 'oil_barrel' ? 'oil_barrel' : 'bolt'}
                    </span>
                    <h4 className="font-label-md text-xs font-black text-foreground">{risk.title}</h4>
                  </div>
                  <p className="text-muted text-xs leading-relaxed">{risk.description}</p>
                  <div className="mt-4">
                    <span className="px-2 py-0.5 bg-[#F95A93]/10 text-[#F95A93] text-[9px] font-black rounded">{risk.priority}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Market Value Comparison */}
          <div className="bg-surface-gray rounded-xl p-8 border border-border-low mb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div>
                <h3 className="text-lg font-black text-foreground mb-1">Piyasa Fiyat Karşılaştırması</h3>
                <p className="text-muted text-xs">Bu ilandaki fiyatın doğrulanmış topluluk satış ortalamalarıyla kıyaslaması.</p>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm border border-border-low text-right shrink-0">
                <span className="block text-muted text-[10px] font-bold">TOPLULUK ORTALAMASI</span>
                <span className="text-xl font-black text-foreground">{(report.communityAverage).toLocaleString('tr-TR')} TL</span>
              </div>
            </div>

            {/* Price Gauge Bar */}
            <div className="mt-8 relative h-4 bg-slate-200 rounded-full">
              <div className="absolute left-0 top-0 h-full bg-trust-green rounded-l-full" style={{ width: '45%' }}></div>
              <div className="absolute top-0 h-full w-2 bg-primary z-10" style={{ left: '65%' }}>
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold shadow">
                  İlan Fiyatı: {(report.marketPrice).toLocaleString('tr-TR')} TL
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-3 text-[10px] text-muted-foreground font-bold uppercase">
              <span>Piyasa Altı</span>
              <span>Adil Değer</span>
              <span>Piyasa Üstü</span>
            </div>

            <div className="mt-6 p-4 bg-red-50 border border-danger/10 rounded-xl flex items-center gap-3">
              <span className="material-symbols-outlined text-danger">info</span>
              <p className="text-danger font-semibold text-xs">
                Bu ilanın fiyatı, aynı konfigürasyondaki topluluk doğrulanmış satış ortalamalarının %{report.percentageAbove} üzerindedir.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="flex flex-col md:flex-row gap-6">
            <button className="flex-1 bg-secondary-container text-on-secondary-container py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 shadow-md">
              <span className="material-symbols-outlined">support_agent</span>
              Bir Ustaya Sorun
            </button>
            <Link 
              href={`/arac/bmw/3-series/f30`}
              className="flex-1 border-2 border-primary-container text-primary-container py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-primary-container hover:text-white transition-all active:scale-95 text-center"
            >
              <span className="material-symbols-outlined">menu_book</span>
              Kasa Rehberini İncele
            </Link>
          </div>
        </div>
      )}
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
