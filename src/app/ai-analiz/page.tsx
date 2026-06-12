'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Sparkles, Link as LinkIcon, AlertCircle, ChevronDown, CheckCircle, ArrowRight, ShieldAlert } from 'lucide-react'

export default function AiAnalysisPage() {
  const [url, setUrl] = useState('')
  
  // Manuel giriş durumları
  const [showManual, setShowManual] = useState(false)
  const [manualBrand, setManualBrand] = useState('')
  const [manualModel, setManualModel] = useState('')
  const [manualYear, setManualYear] = useState('')

  // Rapor durumları
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [report, setReport] = useState<any>(null)

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setReport(null)
    setLoading(true)

    try {
      const response = await fetch('/api/analiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url,
          manualBrand,
          manualModel,
          manualYear
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Analiz sırasında hata oluştu.')
      }

      setReport(data)
    } catch (err: any) {
      setError(err.message || 'Sunucu ile bağlantı kurulamadı.')
    } finally {
      setLoading(false)
    }
  }

  // Markdown formatındaki rapor metnini zengin Tailwind HTML öğelerine dönüştürür
  const renderReportText = (text: string) => {
    if (!text) return null

    const lines = text.split('\n')
    return lines.map((line, index) => {
      const trimmed = line.trim()
      
      // H3 Başlıklar
      if (trimmed.startsWith('###')) {
        return (
          <h3 
            key={index} 
            className="text-sm font-black tracking-tight text-foreground/95 mt-6 mb-2 border-b border-border pb-1 uppercase"
          >
            {trimmed.replace('###', '').trim()}
          </h3>
        )
      }
      
      // Kalın listeler ve listeler
      if (trimmed.startsWith('*') || trimmed.startsWith('-')) {
        const content = trimmed.substring(1).trim()
        
        // **kalın** tespiti
        const boldMatch = content.match(/^\*\*(.*?)\*\*/)
        if (boldMatch) {
          const boldText = boldMatch[1]
          const restText = content.replace(/^\*\*(.*?)\*\*/, '')
          return (
            <div key={index} className="flex gap-2 items-start mt-2 text-xs leading-relaxed text-muted">
              <span className="text-accent mt-1 shrink-0">•</span>
              <span>
                <strong className="text-foreground font-bold">{boldText}</strong>
                {restText}
              </span>
            </div>
          )
        }

        return (
          <div key={index} className="flex gap-2 items-start mt-2 text-xs leading-relaxed text-muted">
            <span className="text-accent mt-1 shrink-0">•</span>
            <span>{content}</span>
          </div>
        )
      }

      // Standart satırlar
      if (trimmed === '') return <div key={index} className="h-2"></div>
      
      return (
        <p key={index} className="text-xs text-muted leading-relaxed mt-1">
          {trimmed}
        </p>
      )
    })
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="inline-flex items-center gap-1 bg-warning/10 border border-warning/30 rounded-full px-3 py-1 text-xs font-semibold text-warning">
              <Sparkles className="h-3.5 w-3.5" />
              Yapay Zeka İlan Analizcisi
            </span>
            <h1 className="text-3xl font-black tracking-tight mt-3">İlan Analiz Paneli</h1>
            <p className="text-xs text-muted mt-2">
              Araç alırken hata yapmayın. Satın almak istediğiniz sahibinden.com veya arabam.com ilan linkini yapıştırın, kronik arızaları ve risk durumunu hemen öğrenin.
            </p>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 h-32 w-32 bg-accent/5 rounded-full blur-3xl"></div>
            
            <form onSubmit={handleAnalyze} className="space-y-4 relative z-10">
              
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

              {/* Accordion Manuel Giriş */}
              <div className="border-t border-border/50 pt-4">
                <button
                  type="button"
                  onClick={() => setShowManual(!showManual)}
                  className="flex items-center gap-1.5 text-xs font-bold text-muted hover:text-foreground transition-colors"
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${showManual ? 'rotate-180' : ''}`} />
                  Araç Bilgilerini Kendim Gir / Destekle (İsteğe Bağlı)
                </button>

                {showManual && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 animate-in fade-in duration-200">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Marka</label>
                      <input
                        type="text"
                        placeholder="Örn: BMW"
                        value={manualBrand}
                        onChange={(e) => setManualBrand(e.target.value)}
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Model</label>
                      <input
                        type="text"
                        placeholder="Örn: 3 Serisi"
                        value={manualModel}
                        onChange={(e) => setManualModel(e.target.value)}
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold text-muted-foreground uppercase">Kasa/Yıl</label>
                      <input
                        type="text"
                        placeholder="Örn: F30 / 2014"
                        value={manualYear}
                        onChange={(e) => setManualYear(e.target.value)}
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-accent text-accent-foreground py-3 rounded-xl font-bold hover:bg-accent-hover transition-colors flex items-center justify-center gap-1.5 shadow-lg shadow-accent/10 active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <>Analiz Ediliyor...</>
                ) : (
                  <>
                    Aracı Yapay Zeka ile Analiz Et
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>
          </div>

          {/* Rapor Çıktısı */}
          {error && (
            <div className="flex items-start gap-2 bg-danger/10 p-4 rounded-3xl text-xs text-danger mt-6">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {loading && (
            <div className="bg-card border border-border rounded-3xl p-10 text-center mt-6 flex flex-col items-center justify-center gap-4 animate-pulse">
              <Sparkles className="h-10 w-10 text-warning animate-spin" />
              <p className="text-xs text-muted font-bold">
                Yapay zeka ilan detaylarını çözümlüyor, kronik veri tabanıyla eşleştiriyor ve rapor yazıyor...
              </p>
            </div>
          )}

          {report && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 mt-6 shadow-2xl animate-in zoom-in-95 duration-200">
              
              {/* Rapor Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-border/80 mb-6">
                <div>
                  <span className="rounded-full bg-warning/10 border border-warning/20 px-3 py-0.5 text-[10px] font-bold text-warning uppercase">
                    Yapay Zeka Raporu
                  </span>
                  <h2 className="text-xl font-black mt-2">
                    Eşleşen Kasa: {report.detectedBrand} {report.detectedModel} {report.detectedGeneration}
                  </h2>
                </div>
                {report.isMock && (
                  <span className="rounded bg-muted px-2.5 py-1 text-[10px] font-bold text-muted-foreground">
                    Veritabanı Analizi
                  </span>
                )}
              </div>

              {/* Rapor Markdown render */}
              <div className="space-y-4">
                {renderReportText(report.analysis)}
              </div>

              <div className="mt-8 border-t border-border/80 pt-6 flex items-start gap-3 bg-muted/15 rounded-2xl p-4">
                <ShieldAlert className="h-5 w-5 text-muted shrink-0 mt-0.5" />
                <p className="text-[10px] text-muted leading-relaxed">
                  Yapay zeka analiz raporları, ilan detaylarının veritabanımızdaki kronik arıza istatistikleriyle otomatik eşleştirilmesi sonucu oluşturulur. Kesin sonuçlar için profesyonel ekspertiz yapılması zorunludur.
                </p>
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  )
}
