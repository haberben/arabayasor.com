import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-server'
import { mockBrands, mockModels, mockGenerations } from '@/lib/mock-data'
import { Brand, Model } from '@/types/database'
import { ChevronRight, ShieldAlert, Star, BookOpen, Activity } from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'

interface Props {
  params: Promise<{ brandSlug: string }>
}

// SEO optimizasyonu için dinamik Meta Verileri (Title & Description) oluşturur
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const brandSlug = resolvedParams.brandSlug
  let brandName = brandSlug.toUpperCase()

  try {
    const supabase = await createClient()
    const { data } = await supabase.from('brands').select('name').eq('slug', brandSlug).single()
    if (data) brandName = data.name
  } catch (e) {
    const local = mockBrands.find(b => b.slug === brandSlug)
    if (local) brandName = local.name
  }

  return {
    title: `${brandName} Modelleri, Kronik Sorunları ve Yorumları | arabayasor.com`,
    description: `${brandName} araç sahipleri ve ustalarından kronik sorun bildirimleri, motor puanları, konfor incelemeleri ve satın alma rehberleri.`,
  }
}

// Rota verilerini çeker
async function getBrandPageData(brandSlug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const brand = mockBrands.find(b => b.slug === brandSlug)
    if (!brand) return null

    const models = mockModels.filter(m => m.brand_id === brand.id)
    const modelsWithGens = models.map(m => {
      const gens = mockGenerations.filter(g => g.model_id === m.id)
      return { ...m, generations: gens }
    })

    return { brand, models: modelsWithGens }
  }

  try {
    const supabase = await createClient()

    const { data: brand, error: bErr } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', brandSlug)
      .single()

    if (bErr || !brand) {
      // Fallback local brand search if DB doesn't have it
      const localBrand = mockBrands.find(b => b.slug === brandSlug)
      if (!localBrand) return null
      return {
        brand: localBrand,
        models: mockModels.filter(m => m.brand_id === localBrand.id).map(m => ({
          ...m,
          generations: mockGenerations.filter(g => g.model_id === m.id)
        }))
      }
    }

    const { data: models, error: mErr } = await supabase
      .from('models')
      .select('*, generations(*)')
      .eq('brand_id', brand.id)

    return {
      brand: brand as Brand,
      models: models && models.length > 0 ? (models as any[]) : []
    }
  } catch (err) {
    console.error('Failed to fetch brand page data:', err)
    const localBrand = mockBrands.find(b => b.slug === brandSlug)
    if (!localBrand) return null
    return {
      brand: localBrand,
      models: mockModels.filter(m => m.brand_id === localBrand.id).map(m => ({
        ...m,
        generations: mockGenerations.filter(g => g.model_id === m.id)
      }))
    }
  }
}

export default async function BrandPage({ params }: Props) {
  const resolvedParams = await params
  const data = await getBrandPageData(resolvedParams.brandSlug)

  if (!data) {
    notFound()
  }

  const { brand, models } = data

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
            <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground/80">{brand.name}</span>
          </nav>

          {/* Marka Kartı Header */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 mb-12 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
            <div className="relative h-24 w-24 shrink-0 bg-white dark:bg-slate-900 rounded-2xl p-4 flex items-center justify-center border border-border/80">
              <img
                src={brand.logo_url}
                alt={`${brand.name} Logosu`}
                className="max-h-16 max-w-16 object-contain"
              />
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-3xl font-black tracking-tight">{brand.name} Modelleri</h1>
              <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
                {brand.name} otomobillerinin tüm kasalarını, teknik özelliklerini, motor seçeneklerini ve kronik arızalarını aşağıdan inceleyebilirsiniz. Kullanıcı oylamalarıyla doğru kararı hemen verin.
              </p>
            </div>
          </div>

          {/* Model Listesi */}
          <h2 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
            <Activity className="h-5 w-5 text-accent" />
            Mevcut Modeller ({models.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {models.map((model: any) => (
              <div 
                key={model.id}
                className="rounded-3xl border border-border bg-card p-6 hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-black">{brand.name} {model.name}</h3>
                    <span className="text-xs text-muted mt-1 inline-block">
                      {model.generations?.length || 0} Farklı Nesil / Kasa
                    </span>
                  </div>
                  <Link
                    href={`/arac/${brand.slug}/${model.slug}`}
                    className="rounded-full bg-accent/10 px-4 py-1.5 text-xs font-bold text-accent hover:bg-accent hover:text-accent-foreground active:scale-95 transition-all"
                  >
                    Detayları Gör
                  </Link>
                </div>

                {/* Kasalar Listesi */}
                <div className="border-t border-border/60 pt-4 mt-auto">
                  <span className="text-xs font-bold text-foreground/80 block mb-3">Kasalar (Nesiller)</span>
                  <div className="flex flex-col gap-2">
                    {model.generations && model.generations.length > 0 ? (
                      model.generations.map((gen: any) => (
                        <Link
                          key={gen.id}
                          href={`/arac/${brand.slug}/${model.slug}/${gen.slug}`}
                          className="flex items-center justify-between rounded-xl bg-background border border-border/40 p-3 hover:border-accent/30 hover:bg-accent/5 transition-all group"
                        >
                          <div className="flex flex-col">
                            <span className="text-xs font-semibold group-hover:text-accent transition-colors">
                              {model.name} {gen.name}
                            </span>
                            <span className="text-[10px] text-muted mt-0.5">{gen.years}</span>
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                        </Link>
                      ))
                    ) : (
                      <span className="text-xs text-muted">Bu modele ait kasa bulunmuyor.</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
