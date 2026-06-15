import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-server'
import { mockBrands, mockModels, mockGenerations } from '@/lib/mock-data'
import { Brand, Model, Generation } from '@/types/database'
import { ChevronRight, ShieldAlert, BookOpen, Star, Sparkles, Activity } from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'

interface Props {
  params: Promise<{ brandSlug: string; modelSlug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const { brandSlug, modelSlug } = resolvedParams
  let titleName = `${brandSlug.toUpperCase()} ${modelSlug.toUpperCase()}`

  try {
    const supabase = await createClient()
    const { data: model } = await supabase
      .from('models')
      .select('name, brands(name)')
      .eq('slug', modelSlug)
      .single()
    if (model) {
      titleName = `${(model.brands as any)?.name} ${model.name}`
    }
  } catch (e) {
    const localBrand = mockBrands.find(b => b.slug === brandSlug)
    const localModel = mockModels.find(m => m.slug === modelSlug && m.brand_id === localBrand?.id)
    if (localBrand && localModel) {
      titleName = `${localBrand.name} ${localModel.name}`
    }
  }

  return {
    title: `${titleName} Kasaları, Kronik Sorunları ve Yorumları | arabayasor.com`,
    description: `${titleName} kasa kodları, motor seçenekleri, yakıt tüketim değerleri ve kullanıcı oylamalarıyla belgelenmiş tüm kronik arızaları.`,
  }
}

async function getModelPageData(brandSlug: string, modelSlug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const brand = mockBrands.find(b => b.slug === brandSlug)
    if (!brand) return null
    const model = mockModels.find(m => m.slug === modelSlug && m.brand_id === brand.id)
    if (!model) return null
    const generations = mockGenerations.filter(g => g.model_id === model.id)
    return { brand, model, generations }
  }

  try {
    const supabase = await createClient()

    const { data: brand, error: bErr } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', brandSlug)
      .single()

    if (bErr || !brand) return null

    const { data: model, error: mErr } = await supabase
      .from('models')
      .select('*')
      .eq('brand_id', brand.id)
      .eq('slug', modelSlug)
      .single()

    if (mErr || !model) {
      // Fallback local lookup
      const localModel = mockModels.find(m => m.slug === modelSlug && m.brand_id === brand.id)
      if (!localModel) return null
      return {
        brand: brand as Brand,
        model: localModel,
        generations: mockGenerations.filter(g => g.model_id === localModel.id)
      }
    }

    const { data: generations, error: gErr } = await supabase
      .from('generations')
      .select('*')
      .eq('model_id', model.id)

    return {
      brand: brand as Brand,
      model: model as Model,
      generations: generations && generations.length > 0 ? (generations as Generation[]) : []
    }
  } catch (err) {
    console.error('Failed to fetch model page data:', err)
    const brand = mockBrands.find(b => b.slug === brandSlug)
    if (!brand) return null
    const model = mockModels.find(m => m.slug === modelSlug && m.brand_id === brand.id)
    if (!model) return null
    const generations = mockGenerations.filter(g => g.model_id === model.id)
    return { brand, model, generations }
  }
}

export default async function ModelPage({ params }: Props) {
  const resolvedParams = await params
  const data = await getModelPageData(resolvedParams.brandSlug, resolvedParams.modelSlug)

  if (!data) {
    notFound()
  }

  const { brand, model, generations } = data

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1.5 text-xs text-muted mb-8">
            <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={`/arac/${brand.slug}`} className="hover:text-accent transition-colors">{brand.name}</Link>
            <ChevronRight className="h-3 w-3" />
            <span className="font-semibold text-foreground/80">{model.name}</span>
          </nav>

          {/* Model Title */}
          <div className="mb-12">
            <h1 className="text-3xl font-black tracking-tight">{brand.name} {model.name} Nesilleri</h1>
            <p className="text-sm text-muted mt-2 max-w-2xl leading-relaxed">
              {brand.name} {model.name} serisinin yıllara göre ayrılmış kasa tiplerini, motor hacimlerini ve kullanıcılar tarafından en çok oylanan kronik arızaları aşağıdan inceleyebilirsiniz.
            </p>
          </div>

          {/* Kasalar Grid */}
          <div className="grid grid-cols-1 gap-8">
            {generations.map((gen: any) => (
              <div 
                key={gen.id}
                className="rounded-3xl border border-border bg-card p-6 sm:p-8 hover:shadow-xl hover:border-accent/20 transition-all duration-300 grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Sol Sütun: Kasa Bilgisi */}
                <div className="lg:col-span-1 flex flex-col justify-between">
                  <div>
                    <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
                      {gen.years}
                    </span>
                    <h2 className="text-2xl font-black mt-3">
                      {brand.name} {model.name} {gen.name}
                    </h2>
                    <p className="text-xs text-muted mt-1">
                      Kasa Kodu: {gen.name}
                    </p>
                  </div>

                  <div className="mt-6">
                    <Link
                      href={`/arac/${brand.slug}/${model.slug}/${gen.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full bg-accent px-6 py-3 text-xs font-black text-accent-foreground hover:bg-accent-hover transition-colors"
                    >
                      Kasa Detayları ve Oylamaları Gör
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Orta Sütun: Motor Seçenekleri */}
                <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-x border-border/60 lg:px-8 py-6 lg:py-0">
                  <h3 className="text-xs font-black uppercase tracking-wider text-foreground/80 mb-4 flex items-center gap-1.5">
                    <Activity className="h-4 w-4 text-accent" />
                    Motor Seçenekleri ({gen.engines?.length || 0})
                  </h3>
                  <div className="flex flex-col gap-2.5">
                    {gen.engines && gen.engines.length > 0 ? (
                      gen.engines.map((eng: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between text-xs rounded-xl bg-background border border-border/40 p-3">
                          <span className="font-semibold">{eng.name}</span>
                          <span className="rounded bg-muted px-2 py-0.5 font-bold text-[10px] text-foreground">
                            {eng.consumption}
                          </span>
                        </div>
                      ))
                    ) : (
                      <span className="text-xs text-muted">Motor bilgisi girilmemiş.</span>
                    )}
                  </div>
                </div>

                {/* Sağ Sütun: Kronik Uyarılar ve Satın Alma Rehberi Özeti */}
                <div className="lg:col-span-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-danger flex items-center gap-1.5 mb-4">
                      <ShieldAlert className="h-4.5 w-4.5" />
                      Kronik Sorun Özeti
                    </h3>
                    
                    {/* Rehberden kısa kesit */}
                    <div className="text-xs text-muted leading-relaxed line-clamp-4 bg-background border border-border/40 p-4 rounded-2xl relative overflow-hidden">
                      {gen.buying_guide ? (
                        gen.buying_guide.replace(/[#*]/g, '').trim()
                      ) : (
                        'Bu kasa için detaylı kronik sorun bildirimleri henüz yapılmamış.'
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-[10px] text-muted font-semibold bg-accent/5 rounded-xl p-3 border border-accent/15">
                    <BookOpen className="h-4 w-4 text-accent shrink-0" />
                    <span>Bu kasayı satın alırken dikkat edilmesi gereken kritik detayları içerir.</span>
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
