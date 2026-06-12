import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { createClient } from '@/lib/supabase-server'
import { mockProfiles, mockReviews, mockProblemReports } from '@/lib/mock-data'
import { Profile, Review } from '@/types/database'
import { Award, ChevronRight, Star, MessageSquare, ShieldAlert, Award as BadgeIcon } from 'lucide-react'
import type { Metadata, ResolvingMetadata } from 'next'

interface Props {
  params: { username: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const username = params.username
  return {
    title: `@${username} Kullanıcı Profili ve Otomobil Katkıları | arabayasor.com`,
    description: `@${username} profil seviyesi, kazandığı otomobil uzmanlığı rozetleri, yazdığı incelemeler ve kronik sorun bildirimleri.`,
  }
}

async function getProfilePageData(username: string) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    const profile = mockProfiles.find(p => p.username === username)
    if (!profile) return null

    const reviews = mockReviews.filter(r => r.user_id === profile.id)
    const badges = [
      { name: 'İlk Adım', description: 'Platformda ilk araç incelemesini yazdı.', icon: 'CheckCircle' },
      { name: 'Sosyal Kelebek', description: 'Yazılan incelemelere 10 veya daha fazla yorum yaptı.', icon: 'MessageSquare' }
    ]

    return { profile, reviews, badges }
  }

  try {
    const supabase = await createClient()

    // 1. Profili kullanıcı adına göre bul
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single()

    if (pErr || !profile) {
      // Fallback local lookup
      const local = mockProfiles.find(p => p.username === username)
      if (!local) return null
      return {
        profile: local,
        reviews: mockReviews.filter(r => r.user_id === local.id),
        badges: [
          { name: 'İlk Adım', description: 'Platformda ilk araç incelemesini yazdı.', icon: 'CheckCircle' }
        ]
      }
    }

    // 2. İncelemelerini çek
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, generations(*, models(*, brands(*)))')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })

    // 3. Rozetlerini çek
    const { data: userBadges } = await supabase
      .from('user_badges')
      .select('*, badges(*)')
      .eq('user_id', profile.id)

    const badges = (userBadges || []).map(ub => ub.badges).filter(Boolean)

    return {
      profile: profile as Profile,
      reviews: reviews || [],
      badges: badges.length > 0 ? badges : [
        { name: 'İlk Adım', description: 'Platformda ilk araç incelemesini yazdı.', icon: 'CheckCircle' }
      ]
    }
  } catch (err) {
    console.error('Failed to fetch profile page data:', err)
    const local = mockProfiles.find(p => p.username === username)
    if (!local) return null
    return {
      profile: local,
      reviews: mockReviews.filter(r => r.user_id === local.id),
      badges: [
        { name: 'İlk Adım', description: 'Platformda ilk araç incelemesini yazdı.', icon: 'CheckCircle' }
      ]
    }
  }
}

export default async function ProfilePage({ params }: Props) {
  const data = await getProfilePageData(params.username)

  if (!data) {
    notFound()
  }

  const { profile, reviews, badges } = data

  // XP'ye göre bir sonraki seviye ve bar hesabı
  let nextRole = 'Efsane Usta'
  let prevThreshold = 0
  let nextThreshold = 2000
  let currentXp = profile.xp || 0

  if (currentXp < 100) {
    nextRole = 'Aktif Üye'
    prevThreshold = 0
    nextThreshold = 100
  } else if (currentXp < 300) {
    nextRole = 'Uzman Kullanıcı'
    prevThreshold = 100
    nextThreshold = 300
  } else if (currentXp < 600) {
    nextRole = 'Usta'
    prevThreshold = 300
    nextThreshold = 600
  } else if (currentXp < 1000) {
    nextRole = 'Master Usta'
    prevThreshold = 600
    nextThreshold = 1000
  } else if (currentXp < 2000) {
    nextRole = 'Efsane Usta'
    prevThreshold = 1000
    nextThreshold = 2000
  } else {
    nextRole = 'Maksimum Seviye'
    prevThreshold = 2000
    nextThreshold = 2000
  }

  const xpProgress = nextThreshold > prevThreshold 
    ? Math.min(Math.round(((currentXp - prevThreshold) / (nextThreshold - prevThreshold)) * 100), 100)
    : 100

  // Yıldız çizme yardımcısı
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5 text-warning">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-3 w-3 ${i < rating ? 'fill-current' : 'text-muted-foreground/30'}`} 
          />
        ))}
      </div>
    )
  }

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Sol Sütun: Profil Kartı ve Seviye */}
            <div className="lg:col-span-1 space-y-6">
              
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-2 bg-accent"></div>
                
                <div className="mx-auto mt-4 flex h-20 w-20 items-center justify-center rounded-full bg-accent/10 text-accent font-black text-3xl shadow-inner border border-accent/20">
                  {profile.username[0].toUpperCase()}
                </div>
                
                <h2 className="text-xl font-black mt-4">@{profile.username}</h2>
                <p className="text-xs text-muted-foreground mt-1">{profile.full_name}</p>

                <div className="mt-4 inline-flex items-center gap-1 bg-accent/15 text-accent px-3 py-1 rounded-full text-xs font-black">
                  <Award className="h-4 w-4" />
                  {profile.role}
                </div>

                {/* Seviye Barı */}
                <div className="mt-8 border-t border-border/50 pt-6 text-left">
                  <div className="flex justify-between text-xs font-bold text-foreground/80 mb-2">
                    <span>Katkı Seviyesi</span>
                    <span>{currentXp} XP</span>
                  </div>
                  
                  {/* SVG Bar */}
                  <div className="h-2.5 w-full bg-border rounded-full overflow-hidden">
                    <div 
                      className="bg-accent h-full rounded-full transition-all duration-700"
                      style={{ width: `${xpProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between text-[10px] text-muted font-semibold mt-2">
                    <span>Mevcut: {profile.role}</span>
                    {nextThreshold > currentXp ? (
                      <span>Sonraki: {nextRole} (%{xpProgress})</span>
                    ) : (
                      <span>Zirve Seviye!</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Kazanılan Rozetler */}
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-sm font-black uppercase tracking-wider text-foreground/80 mb-4 flex items-center gap-2">
                  <BadgeIcon className="h-4.5 w-4.5 text-warning" />
                  Kazanılan Rozetler ({badges.length})
                </h3>
                
                <div className="grid grid-cols-1 gap-3">
                  {badges.map((badge, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-2xl bg-background border border-border/80">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-warning/10 text-warning text-sm">
                        🎖️
                      </div>
                      <div>
                        <h4 className="text-xs font-bold">{badge.name}</h4>
                        <p className="text-[10px] text-muted mt-0.5 leading-snug">{badge.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Sağ Sütun: Yazılan İncelemeler */}
            <div className="lg:col-span-2 space-y-6">
              
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-5 w-5 text-accent" />
                <h3 className="text-lg font-black">Yazılan Araç İncelemeleri ({reviews.length})</h3>
              </div>

              <div className="space-y-6">
                {reviews.length > 0 ? (
                  reviews.map((rev: any) => {
                    const avg = ((
                      rev.rating_engine + 
                      rev.rating_gearbox + 
                      rev.rating_electric + 
                      rev.rating_fuel + 
                      rev.rating_comfort + 
                      rev.rating_parts + 
                      rev.rating_mechanic
                    ) / 7).toFixed(1)

                    const brandName = rev.generations?.models?.brands?.name || 'BMW'
                    const modelName = rev.generations?.models?.name || '3 Serisi'
                    const genName = rev.generations?.name || 'E90'

                    return (
                      <div 
                        key={rev.id}
                        className="rounded-3xl border border-border bg-card p-6 hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <span className="text-xs font-bold text-foreground">
                              {brandName} {modelName} {genName}
                            </span>
                            <div className="flex items-center gap-1.5 mt-1">
                              {renderStars(Math.round(parseFloat(avg)))}
                              <span className="text-xs font-black text-foreground">{avg}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-semibold">
                            {new Date(rev.created_at || '2026-06-12').toLocaleDateString('tr-TR')}
                          </span>
                        </div>

                        <p className="text-xs text-muted leading-relaxed line-clamp-3">
                          "{rev.content}"
                        </p>

                        <div className="mt-4 pt-4 border-t border-border/50 flex justify-end">
                          <Link
                            href={`/arac/${rev.generations?.models?.brands?.slug}/${rev.generations?.models?.slug}/${rev.generations?.slug}`}
                            className="inline-flex items-center gap-1 text-[10px] font-bold text-accent hover:underline"
                          >
                            Aracın Tüm Detayları ve Oylamaları Gör
                            <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center py-12 border border-dashed border-border rounded-3xl text-xs text-muted">
                    Bu kullanıcı henüz herhangi bir araç incelemesi yazmamış.
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  )
}
