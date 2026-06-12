'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { getSparePartsByGen } from '@/lib/parts-data'
import { 
  Brand, Model, Generation, Review, ProblemReport, Comment, Profile 
} from '@/types/database'
import { 
  Star, ShieldAlert, Award, MessageSquare, AlertCircle, Wrench, 
  ThumbsUp, ThumbsDown, Pin, Activity, CheckCircle2, PlusCircle, HelpCircle,
  ChevronRight, SlidersHorizontal
} from 'lucide-react'

const getAverageReviewRating = (r: any) => {
  const total = 
    (r.rating_engine || 0) + 
    (r.rating_gearbox || 0) + 
    (r.rating_electric || 0) + 
    (r.rating_fuel || 0) + 
    (r.rating_comfort || 0) + 
    (r.rating_parts || 0) + 
    (r.rating_mechanic || 0)
  return (total / 7).toFixed(1)
}

const hotspotDetails: {
  [key: number]: {
    title: string
    faults: string[]
    price: string
    expert: string
  }
} = {
  1: {
    title: 'Motor (Silindir Kapağı & Zincir)',
    faults: [
      'Yağ filtresi gövdesi sızıntıları',
      'Valvetronic motor arızası',
      'Vanos dişlisi aşınması ve soğuk start sesleri'
    ],
    price: '15.000 TL - 45.000 TL',
    expert: 'Özellikle N13/N20 motorlarda yağ ve su kaçaklarına karşı düzenli conta kontrolleri elzemdir.'
  },
  2: {
    title: 'ZF8 Şanzıman',
    faults: [
      'Tork konvertör kilitleme titremesi',
      'Mekatronik selenoid valf aşınması',
      'Karter contası sızıntısı'
    ],
    price: '12.000 TL - 35.000 TL',
    expert: 'Her 80.000 km\'de bir şanzıman yağı ve karter filtresi orijinal ZF setiyle değiştirilmelidir.'
  },
  3: {
    title: 'Elektrik & FEM Beyni',
    faults: [
      'FEM (Front Body Module) su alması',
      'iDrive ekran kararmaları',
      'Direksiyon kolon kilidi (ELV) hatası'
    ],
    price: '8.000 TL - 22.000 TL',
    expert: 'Ön cam altı tahliye kanalları tıkandığında su doğrudan FEM beynine sızabilir.'
  },
  4: {
    title: 'Süspansiyon & Direksiyon Kutusu',
    faults: [
      'Direksiyon kutusu tıkırtısı ve boşluk',
      'Ön salıncak burçları yırtılması',
      'Amortisör kule bilyaları aşınması'
    ],
    price: '6.000 TL - 18.000 TL',
    expert: 'Kasislerden geçerken gelen tıkırtı sesi genellikle kutu tamir kitiyle giderilebilir.'
  },
  5: {
    title: 'Turboşarj Sistemi',
    faults: [
      'Turbo wastegate boşluğu ve ses yapması',
      'Turbo yağ besleme borusu sızıntısı',
      'Elektrikli wastegate motor arızası'
    ],
    price: '10.000 TL - 28.000 TL',
    expert: 'Wastegate sesi can sıksa da çekişi etkilemedikçe acil revizyon gerektirmez.'
  },
  6: {
    title: 'Farlar & Angel Gözler',
    faults: [
      'Angel LED modül sürücü arızası',
      'Far camı içten buğulanma',
      'Xenon mercek kararmaları'
    ],
    price: '4.000 TL - 12.000 TL',
    expert: 'Farların arkasındaki havalandırma tıpaları tıkandığında buğulanma kronikleşir.'
  }
}

interface ClientProps {
  initialGeneration: any
  initialReviews: any[]
  initialProblems: any[]
  brandSlug: string
  modelSlug: string
  genSlug: string
}

export default function GenerationDetailClient({
  initialGeneration,
  initialReviews,
  initialProblems,
  brandSlug,
  modelSlug,
  genSlug
}: ClientProps) {
  const { user, profile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'problems' | 'reviews' | 'guide' | 'parts'>('overview')
  const [selectedHotspot, setSelectedHotspot] = useState<number | null>(null)

  // Data States
  const [reviews, setReviews] = useState<any[]>(initialReviews)
  const [problems, setProblems] = useState<any[]>(initialProblems)
  const [generation] = useState<any>(initialGeneration)

  // Review Form States
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [ratings, setRatings] = useState({
    rating_engine: 5,
    rating_gearbox: 5,
    rating_electric: 5,
    rating_fuel: 5,
    rating_comfort: 5,
    rating_parts: 5,
    rating_mechanic: 5
  })
  const [reviewContent, setReviewContent] = useState('')
  const [reviewError, setReviewError] = useState('')
  const [reviewLoading, setReviewLoading] = useState(false)

  // Chronic Problem Form States
  const [showProblemForm, setShowProblemForm] = useState(false)
  const [newProblemTitle, setNewProblemTitle] = useState('')
  const [newProblemDesc, setNewProblemDesc] = useState('')
  const [problemError, setProblemError] = useState('')
  const [problemLoading, setProblemLoading] = useState(false)

  // Comment States
  const [activeCommentReviewId, setActiveCommentReviewId] = useState<string | null>(null)
  const [commentsMap, setCommentsMap] = useState<{ [key: string]: any[] }>({})
  const [newCommentText, setNewCommentText] = useState('')
  const [commentError, setCommentError] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

  // User Voted Problem States
  const [userVotedProblems, setUserVotedProblems] = useState<{ [key: string]: boolean }>({})

  // Load user votes on chronic problems & review comments
  useEffect(() => {
    if (!user) return

    const loadUserVotes = async () => {
      // Kronik sorun oylarını çek
      const { data: problemVotes } = await supabase
        .from('problem_votes')
        .select('*')
        .eq('user_id', user.id)

      if (problemVotes) {
        const votesObj: { [key: string]: boolean } = {}
        problemVotes.forEach((v: any) => {
          votesObj[v.problem_id] = v.vote_type
        })
        setUserVotedProblems(votesObj)
      }
    }

    loadUserVotes()
  }, [user, problems])

  // Averages calculations
  const totalReviews = reviews.length
  const avgRatings = {
    rating_engine: totalReviews ? +(reviews.reduce((acc, r) => acc + r.rating_engine, 0) / totalReviews).toFixed(1) : 5.0,
    rating_gearbox: totalReviews ? +(reviews.reduce((acc, r) => acc + r.rating_gearbox, 0) / totalReviews).toFixed(1) : 5.0,
    rating_electric: totalReviews ? +(reviews.reduce((acc, r) => acc + r.rating_electric, 0) / totalReviews).toFixed(1) : 5.0,
    rating_fuel: totalReviews ? +(reviews.reduce((acc, r) => acc + r.rating_fuel, 0) / totalReviews).toFixed(1) : 5.0,
    rating_comfort: totalReviews ? +(reviews.reduce((acc, r) => acc + r.rating_comfort, 0) / totalReviews).toFixed(1) : 5.0,
    rating_parts: totalReviews ? +(reviews.reduce((acc, r) => acc + r.rating_parts, 0) / totalReviews).toFixed(1) : 5.0,
    rating_mechanic: totalReviews ? +(reviews.reduce((acc, r) => acc + r.rating_mechanic, 0) / totalReviews).toFixed(1) : 5.0
  }

  const overallAvg = +(
    Object.values(avgRatings).reduce((acc, val) => acc + val, 0) / 7
  ).toFixed(1)

  // Render Stars helper
  const renderStars = (rating: number, interactive = false, field?: keyof typeof ratings) => {
    if (interactive && field) {
      return (
        <div className="flex gap-1 text-warning">
          {[1, 2, 3, 4, 5].map((starVal) => (
            <button
              key={starVal}
              type="button"
              onClick={() => setRatings(prev => ({ ...prev, [field]: starVal }))}
              className="hover:scale-110 active:scale-95 transition-all"
            >
              <Star 
                className={`h-6 w-6 cursor-pointer ${starVal <= ratings[field] ? 'fill-current text-warning' : 'text-muted-foreground/30'}`} 
              />
            </button>
          ))}
        </div>
      )
    }

    return (
      <div className="flex gap-0.5 text-warning">
        {[1, 2, 3, 4, 5].map((starVal) => (
          <Star 
            key={starVal} 
            className={`h-4 w-4 ${starVal <= Math.round(rating) ? 'fill-current' : 'text-muted-foreground/30'}`} 
          />
        ))}
      </div>
    )
  }

  // Handle review submit
  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setReviewError('')
    setReviewLoading(true)

    if (!user) {
      setReviewError('İnceleme yazmak için lütfen önce giriş yapın.')
      setReviewLoading(false)
      return
    }

    if (reviewContent.trim().length < 20) {
      setReviewError('Lütfen en az 20 karakter uzunluğunda bir değerlendirme yazın.')
      setReviewLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          generation_id: generation.id,
          user_id: user.id,
          ...ratings,
          content: reviewContent.trim()
        })
        .select('*, profiles(*)')
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error('Bu araca daha önce değerlendirme yapmışsınız. Her kullanıcı yalnızca 1 kez inceleme yazabilir.')
        }
        throw error
      }

      setReviews(prev => [data, ...prev])
      setShowReviewForm(false)
      setReviewContent('')
      // Refresh router so SSR calculations update
      router.refresh()
    } catch (err: any) {
      setReviewError(err.message || 'Değerlendirme kaydedilirken hata oluştu.')
    } finally {
      setReviewLoading(false)
    }
  }

  // Handle Chronic Problem Submit
  const handleProblemSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setProblemError('')
    setProblemLoading(true)

    if (!user) {
      setProblemError('Kronik sorun bildirmek için giriş yapın.')
      setProblemLoading(false)
      return
    }

    if (newProblemTitle.trim().length < 4) {
      setProblemError('Başlık en az 4 karakter olmalıdır.')
      setProblemLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('problem_reports')
        .insert({
          generation_id: generation.id,
          title: newProblemTitle.trim(),
          description: newProblemDesc.trim()
        })
        .select('*')
        .single()

      if (error) {
        if (error.code === '23505') {
          throw new Error('Bu kronik sorun zaten eklenmiş.')
        }
        throw error
      }

      setProblems(prev => [...prev, { ...data, yes_votes: 0, no_votes: 0 }])
      setShowProblemForm(false)
      setNewProblemTitle('')
      setNewProblemDesc('')
    } catch (err: any) {
      setProblemError(err.message || 'Sorun bildirilirken hata oluştu.')
    } finally {
      setProblemLoading(false)
    }
  }

  // Handle Chronic Problem Vote (1 vote constraint)
  const handleProblemVote = async (problemId: string, voteType: boolean) => {
    if (!user) {
      alert('Oy vermek için lütfen giriş yapın.')
      return
    }

    const alreadyVoted = userVotedProblems[problemId] !== undefined

    if (alreadyVoted) {
      alert('Bu soruna daha önce oy verdiniz. Oylar değiştirilemez veya tekerrür edemez.')
      return
    }

    try {
      const { error } = await supabase
        .from('problem_votes')
        .insert({
          problem_id: problemId,
          user_id: user.id,
          vote_type: voteType
        })

      if (error) throw error

      // Update state
      setUserVotedProblems(prev => ({ ...prev, [problemId]: voteType }))
      setProblems(prev => prev.map(p => {
        if (p.id === problemId) {
          return {
            ...p,
            yes_votes: voteType ? (p.yes_votes || 0) + 1 : (p.yes_votes || 0),
            no_votes: !voteType ? (p.no_votes || 0) + 1 : (p.no_votes || 0)
          }
        }
        return p
      }))
    } catch (err: any) {
      alert('Oylama başarısız oldu: ' + err.message)
    }
  }

  // Fetch comments for review
  const loadComments = async (reviewId: string) => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*, profiles(*)')
        .eq('review_id', reviewId)
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: true })

      if (error) throw error
      setCommentsMap(prev => ({ ...prev, [reviewId]: data || [] }))
    } catch (err) {
      console.error('Error fetching comments:', err)
    }
  }

  // Open Comments pane
  const toggleCommentsPane = (reviewId: string) => {
    if (activeCommentReviewId === reviewId) {
      setActiveCommentReviewId(null)
    } else {
      setActiveCommentReviewId(reviewId)
      if (!commentsMap[reviewId]) {
        loadComments(reviewId)
      }
    }
  }

  // Handle comment submit
  const handleCommentSubmit = async (e: React.FormEvent, reviewId: string) => {
    e.preventDefault()
    setCommentError('')
    setCommentLoading(true)

    if (!user) {
      setCommentError('Yorum yazmak için giriş yapmalısınız.')
      setCommentLoading(false)
      return
    }

    if (newCommentText.trim().length < 5) {
      setCommentError('Yorum en az 5 karakter olmalıdır.')
      setCommentLoading(false)
      return
    }

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          review_id: reviewId,
          user_id: user.id,
          content: newCommentText.trim()
        })
        .select('*, profiles(*)')
        .single()

      if (error) throw error

      setCommentsMap(prev => ({
        ...prev,
        [reviewId]: [...(prev[reviewId] || []), data]
      }))
      setNewCommentText('')
    } catch (err: any) {
      setCommentError(err.message || 'Yorum gönderilirken hata oluştu.')
    } finally {
      setCommentLoading(false)
    }
  }

  // Handle Comment Like/Dislike (Comment Vote)
  const handleCommentVote = async (commentId: string, reviewId: string, voteType: 'like' | 'dislike') => {
    if (!user) {
      alert('Yorumları beğenmek için giriş yapın.')
      return
    }

    try {
      const { error } = await supabase
        .from('comment_votes')
        .insert({
          comment_id: commentId,
          user_id: user.id,
          vote_type: voteType
        })

      if (error) {
        if (error.code === '23505') {
          alert('Bu yoruma zaten oy verdiniz.')
          return
        }
        throw error
      }

      // Refresh comment list to reflect likes
      await loadComments(reviewId)
    } catch (err: any) {
      alert(err.message)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Premium Car Hero Banner */}
      {generation.image_url && (
        <div className="relative w-full h-[220px] sm:h-[320px] rounded-[32px] overflow-hidden border border-border mb-10 group shadow-lg">
          <img 
            src={generation.image_url} 
            alt={`${generation.models?.brands?.name} ${generation.models?.name} ${generation.name}`} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent"></div>
          {generation.models?.brands && (
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-3 bg-card/70 backdrop-blur-md border border-border px-4 py-2 rounded-2xl">
              <img 
                src={generation.models.brands.logo_url} 
                alt={generation.models.brands.name} 
                className="h-8 w-8 object-contain"
              />
              <span className="text-xs sm:text-sm font-black text-foreground">{generation.models.brands.name} Türkiye</span>
            </div>
          )}
        </div>
      )}
      
      {/* Header Info */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10 pb-8 border-b border-border/80">
        <div>
          <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
            {generation.years} Üretim Yılları
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-3">
            {generation.models?.brands?.name} {generation.models?.name} {generation.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Kasa Seçeneği İnceleme, Oylama ve Platform Puanları
          </p>
        </div>

        {/* Global Score Widget */}
        <div className="flex items-center gap-4 bg-card border border-border p-4 rounded-3xl shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground font-black text-xl shadow-lg shadow-accent/10">
            {overallAvg > 0 ? overallAvg : '5.0'}
          </div>
          <div>
            <div className="flex items-center gap-1">
              {renderStars(overallAvg)}
            </div>
            <p className="text-[10px] text-muted font-bold mt-1 uppercase tracking-wider">
              {totalReviews} Kullanıcı Puanı
            </p>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-border overflow-x-auto custom-scrollbar mb-8 gap-6 scroll-smooth">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-4 text-xs font-bold tracking-wider uppercase border-b-2 shrink-0 transition-all ${activeTab === 'overview' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          Genel Bakış & Motorlar
        </button>
        <button
          onClick={() => setActiveTab('problems')}
          className={`pb-4 text-xs font-bold tracking-wider uppercase border-b-2 shrink-0 transition-all ${activeTab === 'problems' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          Kronik Sorunlar ({problems.length})
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`pb-4 text-xs font-bold tracking-wider uppercase border-b-2 shrink-0 transition-all ${activeTab === 'reviews' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          Değerlendirmeler ({reviews.length})
        </button>
        <button
          onClick={() => setActiveTab('parts')}
          className={`pb-4 text-xs font-bold tracking-wider uppercase border-b-2 shrink-0 transition-all ${activeTab === 'parts' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          Yedek Parça Fiyatları
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`pb-4 text-xs font-bold tracking-wider uppercase border-b-2 shrink-0 transition-all ${activeTab === 'guide' ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-foreground'}`}
        >
          Satın Alma Rehberi
        </button>
      </div>

      {/* TAB CONTENTS */}

      {/* 1. OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Motor Seçenekleri */}
          <div className="lg:col-span-2 space-y-6">

            {/* Interactive Schematic Section */}
            <div className="glass-card p-6 shadow-md overflow-hidden">
              <h2 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-accent" />
                İnteraktif Kronik Arıza Şeması
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Schematic Image Area */}
                <div className="md:w-2/3 relative select-none">
                  <img 
                    alt="BMW Interactive Schematic" 
                    className="w-full h-auto rounded-2xl border border-border" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw4V6OeqqnlucwD0xHYB0E9TaiCxqEAXlORjz5GNSUXlM6dIZA6EksjCADFjrUVcXWZ-u3Lg9qIgq-o6uNxBTZN-B4wCR-s2jTPUBfwMCSZTj0QKJYbJ5Dp2eU31tFHKpbCz0IS6NKN1JHIlYktWSMnkqN_t6oirGzYlRMCYaCFJ4m5uCnukY7DwkoEC7gkVK4ZoWJRTO1fUXmO8Aq-_uC7mSABQsSYDdVuyY310yv2WfrCbcEMyYDCp7w61xA1djmqPx51C4nkT0"
                  />
                  {/* Hotspots */}
                  <div className="absolute inset-0">
                    <button 
                      onClick={() => setSelectedHotspot(1)}
                      className={`absolute top-[45%] left-[32%] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all hover:scale-125 z-10 ${selectedHotspot === 1 ? 'bg-primary text-on-primary ring-4 ring-accent/40 scale-110' : 'bg-secondary-container text-on-secondary-container'}`}
                    >
                      1
                    </button>
                    <button 
                      onClick={() => setSelectedHotspot(2)}
                      className={`absolute top-[58%] left-[48%] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all hover:scale-125 z-10 ${selectedHotspot === 2 ? 'bg-primary text-on-primary ring-4 ring-accent/40 scale-110' : 'bg-secondary-container text-on-secondary-container'}`}
                    >
                      2
                    </button>
                    <button 
                      onClick={() => setSelectedHotspot(3)}
                      className={`absolute top-[30%] left-[82%] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all hover:scale-125 z-10 ${selectedHotspot === 3 ? 'bg-primary text-on-primary ring-4 ring-accent/40 scale-110' : 'bg-secondary-container text-on-secondary-container'}`}
                    >
                      3
                    </button>
                    <button 
                      onClick={() => setSelectedHotspot(4)}
                      className={`absolute top-[45%] left-[75%] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all hover:scale-125 z-10 ${selectedHotspot === 4 ? 'bg-primary text-on-primary ring-4 ring-accent/40 scale-110' : 'bg-secondary-container text-on-secondary-container'}`}
                    >
                      4
                    </button>
                    <button 
                      onClick={() => setSelectedHotspot(5)}
                      className={`absolute top-[40%] left-[42%] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all hover:scale-125 z-10 ${selectedHotspot === 5 ? 'bg-primary text-on-primary ring-4 ring-accent/40 scale-110' : 'bg-secondary-container text-on-secondary-container'}`}
                    >
                      5
                    </button>
                    <button 
                      onClick={() => setSelectedHotspot(6)}
                      className={`absolute top-[68%] left-[24%] w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-all hover:scale-125 z-10 ${selectedHotspot === 6 ? 'bg-primary text-on-primary ring-4 ring-accent/40 scale-110' : 'bg-secondary-container text-on-secondary-container'}`}
                    >
                      6
                    </button>
                  </div>
                </div>

                {/* Part Details Sidebar */}
                <div className="md:w-1/3 bg-surface-container-low dark:bg-background/40 p-4 rounded-2xl border border-border/60 min-h-[200px] flex flex-col justify-center">
                  {selectedHotspot === null ? (
                    <div className="text-center space-y-3 p-4">
                      <span className="material-symbols-outlined text-3xl text-muted-foreground/50">touch_app</span>
                      <p className="text-xs text-on-surface-variant dark:text-outline-variant font-medium leading-relaxed">
                        Kronik bölgeleri, onarım maliyetlerini ve usta tavsiyelerini görmek için şema üzerindeki numaralara tıklayın.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4 animate-in fade-in duration-200">
                      <h4 className="text-sm font-bold text-primary dark:text-[#fea619] border-b border-border/80 pb-2">
                        {hotspotDetails[selectedHotspot].title}
                      </h4>
                      <div className="space-y-2">
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Yaygın Arızalar</span>
                        <ul className="list-disc pl-4 text-xs text-on-surface-variant dark:text-outline-variant space-y-1">
                          {hotspotDetails[selectedHotspot].faults.map((f, i) => (
                            <li key={i}>{f}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-3 border-t border-border/80">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">Ort. Masraf</span>
                          <span className="font-extrabold text-secondary dark:text-secondary-fixed-dim">{hotspotDetails[selectedHotspot].price}</span>
                        </div>
                        <p className="mt-3 p-3 bg-white dark:bg-primary-container/60 border border-border/40 text-on-surface-variant dark:text-outline-variant rounded-xl italic text-[11px] leading-relaxed">
                          "{hotspotDetails[selectedHotspot].expert}"
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="glass-card p-6 shadow-md">
              <h2 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
                <Activity className="h-5 w-5 text-accent" />
                Motor ve Tüketim Seçenekleri
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {generation.engines && generation.engines.length > 0 ? (
                  generation.engines.map((eng: any, idx: number) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-card/40 border border-border/60 hover:border-accent/30 transition-colors">
                      <div>
                        <h4 className="text-sm font-bold">{eng.name}</h4>
                        <span className="text-[10px] bg-muted px-2 py-0.5 rounded font-semibold text-muted-foreground mt-1 inline-block">
                          {eng.fuel}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-accent block">Ortalama Yakıt</span>
                        <span className="text-xs font-bold text-foreground/80">{eng.consumption}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted">Motor verisi henüz eklenmemiş.</p>
                )}
              </div>
            </div>

            {/* Buying Guide Snippet */}
            <div className="glass-card p-6 shadow-md">
              <h2 className="text-lg font-black tracking-tight mb-3 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-warning" />
                Alırken Dikkat Edilmesi Gerekenler
              </h2>
              <div className="text-sm text-muted leading-relaxed line-clamp-4 bg-card/40 p-4 rounded-2xl border border-border/60">
                {generation.buying_guide ? (
                  generation.buying_guide.replace(/[#*]/g, '').trim()
                ) : (
                  'Bu kasa için detaylı satın alma uyarısı yazılmamış.'
                )}
              </div>
              <button 
                onClick={() => setActiveTab('guide')}
                className="mt-4 text-xs font-bold text-accent hover:underline flex items-center gap-1"
              >
                Tüm Rehberi Oku <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Oylama Puanlama Detayları */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-card p-6 shadow-md">
              <h3 className="text-sm font-black uppercase tracking-wider text-foreground/80 mb-6">
                Kategori Derecelendirmeleri
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Motor Dayanıklılığı', value: avgRatings.rating_engine },
                  { label: 'Şanzıman Kararlılığı', value: avgRatings.rating_gearbox },
                  { label: 'Elektrik/Elektronik', value: avgRatings.rating_electric },
                  { label: 'Yakıt Ekonomisi', value: avgRatings.rating_fuel },
                  { label: 'Konfor & Malzeme', value: avgRatings.rating_comfort },
                  { label: 'Yedek Parça Maliyeti', value: avgRatings.rating_parts },
                  { label: 'Usta Bulunabilirliği', value: avgRatings.rating_mechanic },
                ].map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-foreground/80">{item.label}</span>
                      <span className="text-foreground">{item.value} / 5</span>
                    </div>
                    {/* SVG Progress bar */}
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-accent rounded-full transition-all duration-500" 
                        style={{ width: `${(item.value / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. CHRONIC PROBLEMS TAB */}
      {activeTab === 'problems' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black">Kronik Sorun Bildirimleri</h2>
            <button
              onClick={() => {
                if (!user) {
                  alert('Sorun bildirmek için giriş yapmalısınız.')
                  return
                }
                setShowProblemForm(true)
              }}
              className="flex items-center gap-1.5 rounded-full bg-danger px-4 py-2.5 text-xs font-bold text-white hover:bg-red-600 transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Sorun Bildir
            </button>
          </div>

          {/* Yeni Sorun Bildirme Formu */}
          {showProblemForm && (
            <div className="bg-card border border-border p-6 rounded-3xl shadow-xl">
              <h3 className="text-sm font-bold mb-4">Kronik Sorun Ekle</h3>
              
              {problemError && (
                <div className="flex items-center gap-2 bg-danger/10 p-3 rounded-xl text-xs text-danger mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <span>{problemError}</span>
                </div>
              )}

              <form onSubmit={handleProblemSubmit} className="space-y-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-foreground/80">Sorun Başlığı</label>
                  <input
                    type="text"
                    placeholder="Örn: M271 Zincir Uzaması"
                    value={newProblemTitle}
                    onChange={(e) => setNewProblemTitle(e.target.value)}
                    required
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-foreground/80">Detaylı Açıklama</label>
                  <textarea
                    placeholder="Sorunun belirtileri, neden olduğu masraf ve çözüm yöntemleri nelerdir?"
                    rows={4}
                    value={newProblemDesc}
                    onChange={(e) => setNewProblemDesc(e.target.value)}
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none resize-none"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowProblemForm(false)}
                    className="border border-border rounded-full px-4 py-2 text-xs font-bold hover:bg-background"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={problemLoading}
                    className="bg-danger text-white rounded-full px-5 py-2 text-xs font-bold hover:bg-red-600 disabled:opacity-50"
                  >
                    {problemLoading ? 'Gönderiliyor...' : 'Bildiriyi Kaydet'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Sorunlar Listesi */}
          <div className="space-y-6">
            {problems.length > 0 ? (
              problems.map((prob) => {
                const yesVotes = prob.yes_votes || 0
                const noVotes = prob.no_votes || 0
                const total = yesVotes + noVotes
                const percentage = total > 0 ? Math.round((yesVotes / total) * 100) : 0
                const voted = userVotedProblems[prob.id] !== undefined
                const votedType = userVotedProblems[prob.id]

                return (
                  <div key={prob.id} className="glass-card p-6 shadow-md hover:border-accent/30 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="h-2 w-2 rounded-full bg-danger animate-pulse"></span>
                          <h3 className="font-bold text-sm leading-snug">{prob.title}</h3>
                        </div>
                        <p className="text-xs text-muted mt-2 leading-relaxed">
                          {prob.description}
                        </p>
                      </div>

                      {/* SVG Bar Chart Layout */}
                      <div className="w-full sm:w-48 shrink-0 flex flex-col gap-2 p-3 bg-card/40 border border-border/60 rounded-2xl">
                        <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-danger">Kronik: %{percentage}</span>
                          <span className="text-muted">{total} Oy</span>
                        </div>
                        
                        {/* Custom SVG Bar */}
                        <div className="h-3 w-full bg-border rounded-full overflow-hidden flex">
                          <div 
                            className="bg-danger h-full rounded-l-full transition-all" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                          <div 
                            className="bg-success h-full rounded-r-full transition-all" 
                            style={{ width: `${100 - percentage}%` }}
                          ></div>
                        </div>

                        {/* Oylama Butonları */}
                        <div className="flex gap-2 mt-1">
                          <button
                            onClick={() => handleProblemVote(prob.id, true)}
                            disabled={voted}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${voted && votedType === true ? 'bg-danger text-white' : voted ? 'opacity-40 cursor-not-allowed bg-muted' : 'border border-danger/30 text-danger hover:bg-danger/10'}`}
                          >
                            Bende de Var
                          </button>
                          <button
                            onClick={() => handleProblemVote(prob.id, false)}
                            disabled={voted}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 transition-all ${voted && votedType === false ? 'bg-success text-white' : voted ? 'opacity-40 cursor-not-allowed bg-muted' : 'border border-success/30 text-success hover:bg-success/10'}`}
                          >
                            Yok/Görmedim
                          </button>
                        </div>
                        {voted && (
                          <span className="text-[9px] text-center text-muted font-semibold mt-1">
                            Oyunuz kaydedildi.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-3xl text-xs text-muted">
                Bu araç için bildirilmiş kronik sorun bulunamadı. İlk siz ekleyin!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. REVIEWS TAB */}
      {activeTab === 'reviews' && (
        <div className="space-y-8 max-w-4xl mx-auto">
          
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black">Değerlendirmeler ({reviews.length})</h2>
            {!showReviewForm && (
              <button
                onClick={() => {
                  if (!user) {
                    alert('Değerlendirme yapmak için giriş yapmalısınız.')
                    return
                  }
                  setShowReviewForm(true)
                }}
                className="rounded-full bg-accent px-5 py-2.5 text-xs font-bold text-accent-foreground hover:bg-accent-hover transition-colors"
              >
                Araç Değerlendir
              </button>
            )}
          </div>

          {/* İnceleme Yazma Formu */}
          {showReviewForm && (
            <div className="bg-card border border-border p-6 rounded-3xl shadow-xl">
              <h3 className="text-sm font-black tracking-tight mb-6">Aracınızı 7 Kriterde Değerlendirin</h3>
              
              {reviewError && (
                <div className="flex items-center gap-2 bg-danger/10 p-3 rounded-xl text-xs text-danger mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <span>{reviewError}</span>
                </div>
              )}

              <form onSubmit={handleReviewSubmit} className="space-y-6">
                
                {/* 7 Kriter Oylaması */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: 'Motor Dayanıklılığı', field: 'rating_engine' },
                    { label: 'Şanzıman Kararlılığı', field: 'rating_gearbox' },
                    { label: 'Elektrik/Elektronik', field: 'rating_electric' },
                    { label: 'Yakıt Ekonomisi', field: 'rating_fuel' },
                    { label: 'Konfor & Malzeme', field: 'rating_comfort' },
                    { label: 'Yedek Parça Maliyeti', field: 'rating_parts' },
                    { label: 'Usta Bulunabilirliği', field: 'rating_mechanic' },
                  ].map((item) => (
                    <div key={item.field} className="flex items-center justify-between border-b border-border/50 pb-2">
                      <span className="text-xs font-bold text-foreground/80">{item.label}</span>
                      {renderStars(0, true, item.field as any)}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-bold text-foreground/80">Kullanıcı Değerlendirme Yorumu</label>
                  <textarea
                    placeholder="Aracın yol tutuşu, malzeme kalitesi, bakımları hakkında detaylı görüşünüzü paylaşın... (En az 20 karakter)"
                    rows={4}
                    value={reviewContent}
                    onChange={(e) => setReviewContent(e.target.value)}
                    required
                    className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none resize-none"
                  />
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="border border-border rounded-full px-5 py-2 text-xs font-bold hover:bg-background"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    disabled={reviewLoading}
                    className="bg-accent text-accent-foreground rounded-full px-6 py-2 text-xs font-bold hover:bg-accent-hover disabled:opacity-50"
                  >
                    {reviewLoading ? 'Kaydediliyor...' : 'Değerlendirmeyi Yayınla'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* İnceleme Listesi */}
          <div className="space-y-6">
            {reviews.length > 0 ? (
              reviews.map((rev) => {
                const isPinned = rev.is_pinned === true
                const avg = getAverageReviewRating({
                  rating_engine: rev.rating_engine,
                  rating_gearbox: rev.rating_gearbox,
                  rating_electric: rev.rating_electric,
                  rating_fuel: rev.rating_fuel,
                  rating_comfort: rev.rating_comfort,
                  rating_parts: rev.rating_parts,
                  rating_mechanic: rev.rating_mechanic
                })

                return (
                  <div key={rev.id} className={`glass-card p-6 shadow-md hover:border-accent/30 transition-all relative ${isPinned ? 'border-warning/40 shadow-sm' : ''}`}>
                    {isPinned && (
                      <span className="absolute top-4 right-4 text-warning flex items-center gap-1 text-[10px] font-black uppercase bg-warning/10 px-2 py-0.5 rounded-full">
                        <Pin className="h-3 w-3 rotate-45" /> Sabitlenmiş
                      </span>
                    )}

                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-1.5">
                          {renderStars(Math.round(parseFloat(avg)))}
                          <span className="text-xs font-black text-foreground">{avg}</span>
                        </div>
                        <span className="text-[10px] text-muted font-bold block mt-1">
                          {new Date(rev.created_at).toLocaleDateString('tr-TR')}
                        </span>
                      </div>

                      <div className="flex flex-col items-end text-right">
                        <span className="text-xs font-bold text-foreground">@{rev.profiles?.username}</span>
                        <span className="text-[10px] text-accent font-black">{rev.profiles?.role}</span>
                      </div>
                    </div>

                    {/* Kriter Puanları (Mini Slider) */}
                    <div className="grid grid-cols-3 sm:grid-cols-7 gap-2 my-4 bg-card/40 border border-border/50 p-3 rounded-2xl text-center">
                      {[
                        { short: 'Mot', val: rev.rating_engine },
                        { short: 'Şan', val: rev.rating_gearbox },
                        { short: 'Elk', val: rev.rating_electric },
                        { short: 'Yak', val: rev.rating_fuel },
                        { short: 'Kon', val: rev.rating_comfort },
                        { short: 'Prc', val: rev.rating_parts },
                        { short: 'Ust', val: rev.rating_mechanic },
                      ].map((crit, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <span className="text-[9px] font-bold text-muted uppercase">{crit.short}</span>
                          <span className="text-xs font-black text-foreground">{crit.val}</span>
                        </div>
                      ))}
                    </div>

                    <p className="text-xs text-muted leading-relaxed whitespace-pre-line">
                      "{rev.content}"
                    </p>

                    {/* Like / Dislike / Comments Button */}
                    <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                      <button
                        onClick={() => toggleCommentsPane(rev.id)}
                        className="flex items-center gap-1.5 text-xs text-muted hover:text-accent font-bold"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>Yorumlar</span>
                      </button>
                    </div>

                    {/* COMMENTS WINDOW (Nested) */}
                    {activeCommentReviewId === rev.id && (
                      <div className="mt-6 pt-6 border-t border-border/50 space-y-4">
                        <h4 className="text-xs font-bold text-foreground/80">Yorumlar</h4>
                        
                        <div className="space-y-3">
                          {commentsMap[rev.id] && commentsMap[rev.id].length > 0 ? (
                            commentsMap[rev.id].map((comm) => (
                              <div key={comm.id} className="p-3 bg-background border border-border/40 rounded-2xl flex flex-col gap-2">
                                <div className="flex justify-between items-center text-[10px]">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-foreground">@{comm.profiles?.username}</span>
                                    <span className="text-accent font-bold text-[9px]">{comm.profiles?.role}</span>
                                  </div>
                                  <span className="text-muted">{new Date(comm.created_at).toLocaleDateString('tr-TR')}</span>
                                </div>
                                <p className="text-xs text-muted-foreground">{comm.content}</p>
                                
                                {/* Like / Dislike buttons for Comment */}
                                <div className="flex gap-3 text-[10px] mt-1 border-t border-border/10 pt-2 text-muted">
                                  <button 
                                    onClick={() => handleCommentVote(comm.id, rev.id, 'like')}
                                    className="flex items-center gap-1 hover:text-success"
                                  >
                                    <ThumbsUp className="h-3 w-3" />
                                    <span>{comm.likes || 0}</span>
                                  </button>
                                  <button 
                                    onClick={() => handleCommentVote(comm.id, rev.id, 'dislike')}
                                    className="flex items-center gap-1 hover:text-danger"
                                  >
                                    <ThumbsDown className="h-3 w-3" />
                                    <span>{comm.dislikes || 0}</span>
                                  </button>
                                </div>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-muted text-center py-2">İlk yorumu siz yazın.</p>
                          )}
                        </div>

                        {/* Comment Form */}
                        {commentError && (
                          <div className="text-xs text-danger">{commentError}</div>
                        )}
                        <form onSubmit={(e) => handleCommentSubmit(e, rev.id)} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Fikrinizi yazın..."
                            value={newCommentText}
                            onChange={(e) => setNewCommentText(e.target.value)}
                            required
                            className="flex-1 rounded-xl border border-border bg-background px-4 py-2 text-xs outline-none"
                          />
                          <button
                            type="submit"
                            disabled={commentLoading}
                            className="bg-accent text-accent-foreground rounded-xl px-4 py-2 text-xs font-bold hover:bg-accent-hover disabled:opacity-50"
                          >
                            Gönder
                          </button>
                        </form>
                      </div>
                    )}

                  </div>
                )
              })
            ) : (
              <div className="text-center py-12 border border-dashed border-border rounded-3xl text-xs text-muted">
                Henüz değerlendirme yapılmamış. Bu kasaya ilk yorumu siz yazın!
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. SPARE PARTS TAB */}
      {activeTab === 'parts' && (
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-border/80">
              <div>
                <h2 className="text-xl font-black tracking-tight flex items-center gap-2">
                  <Wrench className="h-5.5 w-5.5 text-accent" />
                  Ortalama Yedek Parça & İşçilik Fiyatları
                </h2>
                <p className="text-xs text-muted mt-1">
                  Piyasa ortalaması OEM (Orijinal) ve Yan Sanayi yedek parça fiyatları ile tahmini işçilik maliyetleri.
                </p>
              </div>
              <span className="text-[10px] bg-accent/10 text-accent font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                Haziran 2026 Güncel
              </span>
            </div>

            {/* Fiyat Tablosu */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border/80 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="pb-3 pl-2">Parça Adı</th>
                    <th className="pb-3 text-center">OEM (Orijinal)</th>
                    <th className="pb-3 text-center">Yan Sanayi</th>
                    <th className="pb-3 text-center">Ort. İşçilik</th>
                    <th className="pb-3 text-center pr-2">Montaj Zorluğu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40 text-xs">
                  {getSparePartsByGen(generation.slug).items.map((part, idx) => (
                    <tr key={idx} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 pl-2 font-bold text-foreground/90">{part.name}</td>
                      <td className="py-4 text-center font-semibold text-warning">{part.oemPrice}</td>
                      <td className="py-4 text-center font-semibold text-emerald-500">{part.aftermarketPrice}</td>
                      <td className="py-4 text-center text-muted-foreground">{part.laborCost}</td>
                      <td className="py-4 text-center pr-2">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold ${
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

            {/* Genel Notlar */}
            <div className="mt-8 bg-background border border-border/60 rounded-2xl p-4 sm:p-5">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 mb-2">
                <AlertCircle className="h-4 w-4 text-accent" />
                Önemli Parça Değişim Notları
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                {getSparePartsByGen(generation.slug).generalNotes}
              </p>
            </div>

            {/* Disclaimer */}
            <div className="mt-6 flex items-start gap-2.5 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl p-4 text-[10px] text-muted leading-relaxed">
              <ShieldAlert className="h-4.5 w-4.5 text-warning shrink-0 mt-0.5" />
              <div>
                <strong className="text-foreground/90 block mb-0.5">Fiyatlar Değişkenlik Gösterebilir</strong>
                Burada listelenen fiyatlar Türkiye pazarı genel ortalaması temel alınarak bilgilendirme amacıyla hazırlanmıştır. Kur farkı, parça markası (Bosch, Sachs, Lemförder vb.) ve ustanızın işçilik tarifesine göre fiyatlar değişiklik gösterebilir. Parça satın almadan önce şase numarası ile parça sorgulaması yapılması tavsiye edilir.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. BUYING GUIDE TAB */}
      {activeTab === 'guide' && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-xl font-black tracking-tight flex items-center gap-2 mb-6">
              <ShieldAlert className="h-5.5 w-5.5 text-warning" />
              Alırken Dikkat Edilmesi Gereken Kritik Hususlar
            </h2>

            <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm text-muted leading-relaxed space-y-4">
              {generation.buying_guide ? (
                generation.buying_guide.split('\n').map((line: string, i: number) => {
                  if (line.startsWith('###')) {
                    return <h3 key={i} className="text-base font-bold text-foreground mt-6 mb-2 border-b border-border pb-1">{line.replace('###', '')}</h3>
                  }
                  if (line.startsWith('*')) {
                    const cleanLine = line.replace('*', '').trim()
                    const boldPart = cleanLine.match(/^\*\*(.*?)\*\*/)
                    if (boldPart) {
                      const text = cleanLine.replace(/^\*\*(.*?)\*\*/, '')
                      return (
                        <div key={i} className="flex gap-2.5 items-start mt-2">
                          <CheckCircle2 className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                          <span>
                            <strong className="text-foreground">{boldPart[1]}</strong>
                            {text}
                          </span>
                        </div>
                      )
                    }
                    return (
                      <div key={i} className="flex gap-2.5 items-start mt-2">
                        <CheckCircle2 className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                        <span>{cleanLine}</span>
                      </div>
                    )
                  }
                  return <p key={i}>{line}</p>
                })
              ) : (
                <p>Bu kasa için henüz detaylı satın alma kılavuzu girilmemiş.</p>
              )}
            </div>

            <div className="mt-8 border-t border-border/80 pt-6 flex items-start gap-3 bg-accent/5 rounded-2xl p-4">
              <Wrench className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-foreground">Profesyonel Ekspertiz Şarttır</h4>
                <p className="text-[10px] text-muted mt-1 leading-relaxed">
                  Yukarıdaki veriler arabayasor.com topluluğunun deneyimleri ve bildirimleri temel alınarak derlenmiştir. İlgili aracı satın almadan önce mutlaka yetkili usta veya kurumsal ekspertiz servislerine gösteriniz.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
