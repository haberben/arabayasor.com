import React from 'react'
import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-server'
import { 
  mockBrands, mockModels, mockGenerations, mockReviews, mockProblemReports 
} from '@/lib/mock-data'
import { Brand, Model, Generation, Review, ProblemReport } from '@/types/database'
import GenerationDetailClient from '@/components/GenerationDetailClient'
import type { Metadata, ResolvingMetadata } from 'next'

interface Props {
  params: Promise<{ brandSlug: string; modelSlug: string; genSlug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params
  const { brandSlug, modelSlug, genSlug } = resolvedParams
  let titleName = `${brandSlug.toUpperCase()} ${modelSlug.toUpperCase()} ${genSlug.toUpperCase()}`

  try {
    const supabase = await createClient()
    const { data: gen } = await supabase
      .from('generations')
      .select('name, models(name, brands(name))')
      .eq('slug', genSlug)
      .single()
    if (gen) {
      titleName = `${(gen.models as any)?.brands?.name} ${(gen.models as any)?.name} ${gen.name}`
    }
  } catch (e) {
    const localBrand = mockBrands.find(b => b.slug === brandSlug)
    const localModel = mockModels.find(m => m.slug === modelSlug && m.brand_id === localBrand?.id)
    const localGen = mockGenerations.find(g => g.slug === genSlug && g.model_id === localModel?.id)
    if (localBrand && localModel && localGen) {
      titleName = `${localBrand.name} ${localModel.name} ${localGen.name}`
    }
  }

  return {
    title: `${titleName} Kronik Sorunları, Yorumları ve Verileri | arabayasor.com`,
    description: `${titleName} kasa modeli için kullanıcı puanlamaları, motor ömrü, yakıt tüketim değerleri, kronik şanzıman ve motor arıza oylamaları.`,
  }
}

async function getGenerationPageData(brandSlug: string, modelSlug: string, genSlug: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const brand = mockBrands.find(b => b.slug === brandSlug)
    if (!brand) return null
    const model = mockModels.find(m => m.slug === modelSlug && m.brand_id === brand.id)
    if (!model) return null
    const generation = mockGenerations.find(g => g.slug === genSlug && g.model_id === model.id)
    if (!generation) return null

    const reviews = mockReviews.filter(r => r.generation_id === generation.id)
    const problems = mockProblemReports.filter(p => p.generation_id === generation.id)

    return { brand, model, generation, reviews, problems }
  }

  try {
    const supabase = await createClient()

    // 1. Markayı doğrula
    const { data: brand } = await supabase
      .from('brands')
      .select('*')
      .eq('slug', brandSlug)
      .single()

    if (!brand) return null

    // 2. Modeli doğrula
    const { data: model } = await supabase
      .from('models')
      .select('*')
      .eq('brand_id', brand.id)
      .eq('slug', modelSlug)
      .single()

    if (!model) return null

    // 3. Kasayı çek
    const { data: generation, error: gErr } = await supabase
      .from('generations')
      .select('*, models(*, brands(*))')
      .eq('model_id', model.id)
      .eq('slug', genSlug)
      .single()

    if (gErr || !generation) {
      // Fallback local lookup
      const localGen = mockGenerations.find(g => g.slug === genSlug && g.model_id === model.id)
      if (!localGen) return null
      return {
        brand: brand as Brand,
        model: model as Model,
        generation: localGen,
        reviews: mockReviews.filter(r => r.generation_id === localGen.id),
        problems: mockProblemReports.filter(p => p.generation_id === localGen.id)
      }
    }

    // 4. İncelemeleri çek
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, profiles(*)')
      .eq('generation_id', generation.id)
      .order('created_at', { ascending: false })

    // 5. Kronik sorunları çek
    const { data: problems } = await supabase
      .from('problem_reports')
      .select('*')
      .eq('generation_id', generation.id)

    // Oyları birleştirmek için count'lar
    const problemsWithVotes = await Promise.all((problems || []).map(async (p) => {
      const { count: yesCount } = await supabase
        .from('problem_votes')
        .select('*', { count: 'exact', head: true })
        .eq('problem_id', p.id)
        .eq('vote_type', true)

      const { count: noCount } = await supabase
        .from('problem_votes')
        .select('*', { count: 'exact', head: true })
        .eq('problem_id', p.id)
        .eq('vote_type', false)

      return {
        ...p,
        yes_votes: yesCount || 0,
        no_votes: noCount || 0
      }
    }))

    return {
      brand: brand as Brand,
      model: model as Model,
      generation: generation as any,
      reviews: reviews || [],
      problems: problemsWithVotes
    }
  } catch (err) {
    console.error('Failed to fetch generation page data:', err)
    const brand = mockBrands.find(b => b.slug === brandSlug)
    if (!brand) return null
    const model = mockModels.find(m => m.slug === modelSlug && m.brand_id === brand.id)
    if (!model) return null
    const generation = mockGenerations.find(g => g.slug === genSlug && g.model_id === model.id)
    if (!generation) return null
    return {
      brand,
      model,
      generation,
      reviews: mockReviews.filter(r => r.generation_id === generation.id),
      problems: mockProblemReports.filter(p => p.generation_id === generation.id)
    }
  }
}

export default async function GenerationPage({ params }: Props) {
  const resolvedParams = await params
  const data = await getGenerationPageData(resolvedParams.brandSlug, resolvedParams.modelSlug, resolvedParams.genSlug)

  if (!data) {
    notFound()
  }

  const { brand, model, generation, reviews, problems } = data

  return (
    <>
      <Navbar />

      <main className="flex-1 min-h-screen bg-background">
        <GenerationDetailClient
          initialGeneration={generation}
          initialReviews={reviews}
          initialProblems={problems}
          brandSlug={resolvedParams.brandSlug}
          modelSlug={resolvedParams.modelSlug}
          genSlug={resolvedParams.genSlug}
        />
      </main>

      <Footer />
    </>
  )
}
