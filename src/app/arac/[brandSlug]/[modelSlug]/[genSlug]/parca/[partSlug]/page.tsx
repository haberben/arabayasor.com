'use client'

import React, { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Sparkles, AlertCircle, Wrench, ShieldAlert, ArrowRight, Star, ChevronRight, HelpCircle, ThumbsUp, ThumbsDown, UserCheck } from 'lucide-react'
import Link from 'next/link'

interface PageProps {
  params: {
    brandSlug: string
    modelSlug: string
    genSlug: string
    partSlug: string
  }
}

const getMockPartAnalysis = (partSlug: string, genSlug: string) => {
  const slug = partSlug.toLowerCase()
  const gSlug = genSlug.toLowerCase()
  
  if (slug.includes('turbo') || slug === 'turbocharger' || slug.includes('arj')) {
    return {
      partName: 'Turboşarj',
      sectionName: 'Hava Emme Sistemi',
      durabilityScore: 3.8,
      voteCount: 428,
      expectedLifeMin: 80000,
      expectedLifeMax: 120000,
      chronicRiskPct: 35,
      commonFaults: [
        { title: 'Islık Sesi (Whining Noise)', desc: 'Turbo pervanesinin pallerindeki aşınma veya mil boşluğu nedeniyle yüksek devirlerde duyulan metalik sürtünme sesi.' },
        { title: 'Güç Kaybı & Mavi Duman', desc: 'Wastegate mekanizmasındaki gevşeme (Limp Mode) ve turbo milindeki yağ sızıntısının yanma odasına girmesi sonucu egzozdan mavi duman atılması.' },
        { title: 'Yağ Besleme Hattı Tıkanıklığı', desc: 'Düzenli yağ bakımı yapılmaması sonucu oluşan tortuların turboyu yağsız bırakarak mili sarması.' }
      ],
      oemPrice: '45.000 - 65.000 TL',
      aftermarketPrice: '28.000 - 35.000 TL',
      rebuildPrice: '8.000 - 15.000 TL',
      laborCost: '4.500 - 7.500 TL',
      expertName: 'Usta Ahmet Yılmaz',
      expertQuote: 'F30 sahipleri en çok turboyu yağsız bırakmaktan dolayı bize gelir. Turbo ömrünü %50 artırmak istiyorsanız: Motoru çalıştırdıktan sonra 1 dakika rölantide bekleyin, durmadan önce de yine 1 dakika soğumasına izin verin. Yağ değişim aralığını asla 10 bin kilometrenin üzerine çıkarmayın.',
      imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&q=80&w=600'
    }
  }

  // Fallback default
  return {
    partName: 'Triger Zincir Seti',
    sectionName: 'Motor Mekanik',
    durabilityScore: 4.1,
    voteCount: 215,
    expectedLifeMin: 100000,
    expectedLifeMax: 150000,
    chronicRiskPct: 15,
    commonFaults: [
      { title: 'Soğuk Start Zincir Sesi', desc: 'Aracın ilk çalıştırılmasında motorun arka/ön kısmından gelen 2-3 saniyelik şırıldama sesi.' },
      { title: 'Sente Atlaması', desc: 'Zincirin uzaması sonucu supap zamanlamasının bozulması ve çekiş düşüklüğü.' }
    ],
    oemPrice: '18.000 - 24.000 TL',
    aftermarketPrice: '9.000 - 14.000 TL',
    rebuildPrice: 'Yok (Direkt Değişim)',
    laborCost: '6.000 - 9.000 TL',
    expertName: 'Usta Selim Yılmaz',
    expertQuote: 'Zincir değişimi şakaya gelmez, sente atladığı an supaplar eğilir ve masraf 4-5 katına çıkar. 100 bin km civarında mutlaka ustanıza kontrol ettirin.',
    imageUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&q=80&w=600'
  }
}

export default function PartDetailPage({ params }: PageProps) {
  const { brandSlug, modelSlug, genSlug, partSlug } = params
  const partInfo = getMockPartAnalysis(partSlug, genSlug)

  const brandName = brandSlug.toUpperCase()
  const modelName = modelSlug.toUpperCase().replace('-', ' ')
  const genName = genSlug.toUpperCase()

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs & Title */}
        <div className="mb-8 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-on-surface-variant font-label-md text-xs text-muted">
            <Link href="/" className="hover:underline">Ana Sayfa</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href="/arama" className="hover:underline">Araçlar</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <Link href={`/arac/${brandSlug}/${modelSlug}/${genSlug}`} className="hover:underline">{brandName} {modelName} {genName}</Link>
            <span className="material-symbols-outlined text-[14px]">chevron_right</span>
            <span className="text-foreground font-bold">{partInfo.partName}</span>
          </div>
          <h1 className="font-headline-lg text-3xl font-black text-foreground tracking-tight mt-1">
            {brandName} {modelName} {genName} | Parça Detay Analizi: {partInfo.partName}
          </h1>
        </div>

        {/* Bento Grid Layout for Part Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Part Visual & Identity (Spans 8) */}
          <div className="lg:col-span-8 bg-white border border-border rounded-3xl overflow-hidden flex flex-col h-[400px] relative group shadow-lg">
            <div className="absolute inset-0 bg-slate-900 opacity-40"></div>
            {/* Dark blueprint technical ambient styling fallback */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
            <div className="absolute bottom-8 left-8 text-white z-10">
              <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full font-label-md text-xs font-bold mb-3 inline-block">
                Bölüm: {partInfo.sectionName}
              </span>
              <h2 className="text-2xl font-black">{partInfo.partName} Ünitesi & Mekanizması</h2>
            </div>
          </div>

          {/* Community Durability Poll (Spans 4) */}
          <div className="lg:col-span-4 bg-white border border-border rounded-3xl p-6 flex flex-col justify-between shadow-lg h-[400px]">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-muted-foreground mb-4">Parça Dayanıklılık Skoru</h3>
              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-black leading-none text-trust-green">{partInfo.durabilityScore}</span>
                <div className="flex flex-col">
                  <div className="flex text-trust-green">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className="material-symbols-outlined text-[20px]" 
                        style={{ fontVariationSettings: i < Math.round(partInfo.durabilityScore) ? "'FILL' 1" : "'FILL' 0" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <span className="font-caption text-xs text-muted-foreground mt-1">{partInfo.voteCount} Kullanıcı Oyu</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Beklenen Ömür</span>
                    <span className="text-muted-foreground">{partInfo.expectedLifeMin / 1000}k - {partInfo.expectedLifeMax / 1000}k KM</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-secondary-container w-[75%]"></div>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span>Kronik Sorun Riski</span>
                    <span className="text-danger font-black">%{partInfo.chronicRiskPct}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-danger w-[35%]"></div>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 border border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all active:scale-95 text-xs">
              Deneyiminizi Paylaşın
            </button>
          </div>

          {/* Common Issues (Spans 7) */}
          <div className="lg:col-span-7 bg-white border border-border rounded-3xl p-6 shadow-lg space-y-4">
            <h3 className="font-title-md text-lg font-black mb-4 flex items-center gap-2 text-foreground">
              <span className="material-symbols-outlined text-[#F95A93]">report_problem</span>
              Yaygın Arıza Belirtileri &amp; Nedenler
            </h3>
            
            <div className="space-y-4">
              {partInfo.commonFaults.map((fault, idx) => (
                <div key={idx} className="p-4 bg-orange-50/10 border-l-4 border-secondary-container rounded-r-xl border-y border-r border-border-low">
                  <h4 className="font-label-md text-xs font-black text-secondary">{fault.title}</h4>
                  <p className="text-muted text-xs leading-relaxed mt-1">{fault.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Repair Costs Table (Spans 5) */}
          <div className="lg:col-span-5 bg-white border border-border rounded-3xl p-6 shadow-lg overflow-hidden">
            <h3 className="font-title-md text-lg font-black mb-4">Tahmini Onarım Maliyetleri</h3>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-primary-container text-white">
                  <th className="p-3 font-bold rounded-tl-xl">Parça/Hizmet</th>
                  <th className="p-3 font-bold rounded-tr-xl">Fiyat (TRY)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-700">Orijinal OEM Parça</td>
                  <td className="p-3 font-black text-foreground">{partInfo.oemPrice}</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-slate-50/20">
                  <td className="p-3 font-medium text-slate-700">Yan Sanayi Markalar</td>
                  <td className="p-3 font-black text-foreground">{partInfo.aftermarketPrice}</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 font-medium text-slate-700">Revizyon (Turbo Tamir)</td>
                  <td className="p-3 font-black text-foreground">{partInfo.rebuildPrice}</td>
                </tr>
                <tr className="hover:bg-slate-50 bg-slate-50/20">
                  <td className="p-3 font-medium text-slate-700">İşçilik Ortalama</td>
                  <td className="p-3 font-black text-foreground">{partInfo.laborCost}</td>
                </tr>
              </tbody>
            </table>
            <p className="mt-4 text-[10px] text-muted-foreground italic leading-relaxed">
              ** Fiyatlar Özel Servis ve Yetkili Servis ortalamalarına göre hesaplanmıştır. Döviz kuruna göre değişiklik gösterebilir.
            </p>
          </div>

          {/* Expert Advice (Full Width) */}
          <div className="lg:col-span-12 bg-primary-container text-white rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden shadow-xl">
            <div className="absolute right-0 top-0 opacity-10 pointer-events-none translate-x-12 -translate-y-12">
              <span className="material-symbols-outlined text-[240px]" style={{ fontVariationSettings: "'FILL' 1" }}>build_circle</span>
            </div>
            
            <div className="w-20 h-20 rounded-full border-4 border-secondary-container overflow-hidden shrink-0 bg-slate-800">
              {/* Usta avatar placeholder/silhouette */}
              <div className="w-full h-full flex items-center justify-center text-white font-black text-xl bg-gradient-to-tr from-accent to-secondary">
                AU
              </div>
            </div>

            <div className="flex flex-col gap-2 relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-secondary-container text-on-secondary-container px-3 py-0.5 rounded-full text-[10px] font-black tracking-wide">
                  MASTER USTA ÖNERİSİ
                </span>
                <span className="font-bold text-sm">{partInfo.expertName}</span>
              </div>
              <p className="font-body-lg text-sm italic opacity-95 leading-relaxed">
                "{partInfo.expertQuote}"
              </p>
            </div>

            <button className="bg-secondary-container text-on-secondary-container px-6 py-3 rounded-xl font-black text-xs hover:scale-95 transition-all shrink-0 active:scale-90">
              Arıza Bildir
            </button>
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
