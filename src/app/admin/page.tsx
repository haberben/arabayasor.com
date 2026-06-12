'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { 
  PlusCircle, Trash2, ShieldCheck, ShieldAlert, Award, 
  Settings, Users, MessageSquare, Wrench, RefreshCw, Plus, Check
} from 'lucide-react'
import { mockBrands, mockModels, mockGenerations, mockReviews } from '@/lib/mock-data'

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // State Management
  const [activeTab, setActiveTab] = useState<'brands' | 'models' | 'problems' | 'moderation' | 'users'>('brands')
  const [dbConnected, setDbConnected] = useState(false)

  // DB Data States
  const [brands, setBrands] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [generations, setGenerations] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])

  // Form inputs
  const [newBrandName, setNewBrandName] = useState('')
  const [newBrandSlug, setNewBrandSlug] = useState('')
  const [newBrandLogo, setNewBrandLogo] = useState('')

  const [selectedBrandId, setSelectedBrandId] = useState('')
  const [newModelName, setNewModelName] = useState('')
  const [newModelSlug, setNewModelSlug] = useState('')

  const [selectedModelId, setSelectedModelId] = useState('')
  const [newGenName, setNewGenName] = useState('')
  const [newGenSlug, setNewGenSlug] = useState('')
  const [newGenYears, setNewGenYears] = useState('')
  const [newGenGuide, setNewGenGuide] = useState('')

  const [actionSuccess, setActionSuccess] = useState('')
  const [actionError, setActionError] = useState('')

  // Check database connectivity and fetch initial lists
  const loadAdminData = async () => {
    try {
      const { data: bData, error: bErr } = await supabase.from('brands').select('*')
      if (bErr) throw bErr
      
      setDbConnected(true)
      setBrands(bData || [])

      const { data: mData } = await supabase.from('models').select('*, brands(*)')
      setModels(mData || [])

      const { data: gData } = await supabase.from('generations').select('*, models(*)')
      setGenerations(gData || [])

      const { data: rData } = await supabase.from('reviews').select('*, profiles(*), generations(*)')
      setReviews(rData || [])

      const { data: uData } = await supabase.from('profiles').select('*')
      setUsers(uData || [])
    } catch (e) {
      console.warn('Supabase not fully setup, using mock data for dashboard visualization.')
      setDbConnected(false)
      setBrands(mockBrands)
      setModels(mockModels)
      setGenerations(mockGenerations)
      setReviews(mockReviews)
      setUsers([
        { id: 'u1', username: 'mehmet_usta', full_name: 'Mehmet Demir', role: 'Master Usta', xp: 1250 },
        { id: 'u2', username: 'f30_sevdalisi', full_name: 'Caner Aydın', role: 'Uzman Kullanıcı', xp: 480 },
        { id: 'u3', username: 'test_kullanici', full_name: 'Test Üye', role: 'Yeni Üye', xp: 10 }
      ])
    }
  }

  useEffect(() => {
    if (!authLoading) {
      // Admin yetkisi yoksa ana sayfaya yönlendir
      if (!user) {
        router.push('/')
        return
      }
      
      // Geliştirici kolaylığı: Eğer veritabanı bağlı değilse veya kullanıcı admin rolünde değilse ama test aşamasındaysak
      // yine de arayüzü görebilsin diye sıkı engel koymuyoruz, ancak uyarı göstereceğiz.
      loadAdminData()
    }
  }, [user, authLoading])

  // Handle Brand Submit
  const handleAddBrand = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionError('')
    setActionSuccess('')

    if (!dbConnected) {
      setActionError('Veritabanı bağlantısı yok. Local modda ekleme yapılamaz.')
      return
    }

    try {
      const { data, error } = await supabase
        .from('brands')
        .insert({
          name: newBrandName.trim(),
          slug: newBrandSlug.trim().toLowerCase(),
          logo_url: newBrandLogo.trim()
        })
        .select()
        .single()

      if (error) throw error
      setBrands(prev => [...prev, data])
      setNewBrandName('')
      setNewBrandSlug('')
      setNewBrandLogo('')
      setActionSuccess('Marka başarıyla eklendi!')
    } catch (err: any) {
      setActionError(err.message || 'Marka eklenirken hata oluştu.')
    }
  }

  // Handle Model Submit
  const handleAddModel = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionError('')
    setActionSuccess('')

    if (!dbConnected) {
      setActionError('Veritabanı bağlantısı yok.')
      return
    }

    try {
      const { data, error } = await supabase
        .from('models')
        .insert({
          brand_id: selectedBrandId,
          name: newModelName.trim(),
          slug: newModelSlug.trim().toLowerCase()
        })
        .select()
        .single()

      if (error) throw error
      setModels(prev => [...prev, data])
      setNewModelName('')
      setNewModelSlug('')
      setActionSuccess('Model başarıyla eklendi!')
    } catch (err: any) {
      setActionError(err.message || 'Model eklenirken hata oluştu.')
    }
  }

  // Handle Generation Submit
  const handleAddGen = async (e: React.FormEvent) => {
    e.preventDefault()
    setActionError('')
    setActionSuccess('')

    if (!dbConnected) {
      setActionError('Veritabanı bağlantısı yok.')
      return
    }

    try {
      const { data, error } = await supabase
        .from('generations')
        .insert({
          model_id: selectedModelId,
          name: newGenName.trim(),
          slug: newGenSlug.trim().toLowerCase(),
          years: newGenYears.trim(),
          buying_guide: newGenGuide.trim()
        })
        .select()
        .single()

      if (error) throw error
      setGenerations(prev => [...prev, data])
      setNewGenName('')
      setNewGenSlug('')
      setNewGenYears('')
      setNewGenGuide('')
      setActionSuccess('Kasa tipi başarıyla eklendi!')
    } catch (err: any) {
      setActionError(err.message || 'Kasa tipi eklenirken hata oluştu.')
    }
  }

  // Handle Delete Review
  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Bu değerlendirmeyi silmek istediğinize emin misiniz?')) return

    try {
      if (dbConnected) {
        const { error } = await supabase.from('reviews').delete().eq('id', reviewId)
        if (error) throw error
      }
      setReviews(prev => prev.filter(r => r.id !== reviewId))
      setActionSuccess('Değerlendirme başarıyla silindi.')
    } catch (err: any) {
      setActionError(err.message || 'Değerlendirme silinemedi.')
    }
  }

  // Handle User Role Update (Promote)
  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      if (dbConnected) {
        const { error } = await supabase
          .from('profiles')
          .update({ role: newRole })
          .eq('id', userId)
        if (error) throw error
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      setActionSuccess('Kullanıcı rolü güncellendi.')
    } catch (err: any) {
      setActionError(err.message || 'Rol güncellenemedi.')
    }
  }

  if (authLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background text-sm text-muted">
        Yükleniyor...
      </div>
    )
  }

  // Sıkı yetki kontrolü
  const isAuthorized = profile?.role === 'Master Usta' || profile?.role === 'Efsane Usta'

  return (
    <>
      <Navbar />

      <main className="flex-1 py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-border/80">
            <div>
              <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                <Settings className="h-7 w-7 text-accent" />
                Yönetim (Admin) Paneli
              </h1>
              <p className="text-xs text-muted mt-2">
                Platform markalarını, modellerini, oylamalarını ve kullanıcı seviyelerini yönetin.
              </p>
            </div>
            
            {/* Database status banner */}
            <div className={`rounded-full px-4 py-1.5 text-xs font-bold flex items-center gap-1.5 border ${dbConnected ? 'bg-success/15 border-success/30 text-success' : 'bg-warning/15 border-warning/30 text-warning'}`}>
              <ShieldCheck className="h-4 w-4" />
              <span>{dbConnected ? 'Supabase Bağlı' : 'Supabase Çevrimdışı (Mock Modu)'}</span>
            </div>
          </div>

          {/* Admin Role Warning if not authorized */}
          {!isAuthorized && (
            <div className="flex items-start gap-3 bg-warning/15 border border-warning/30 p-4 rounded-3xl text-xs text-warning mb-8">
              <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Kısıtlı Yetki Uyarısı</strong>
                <span>
                  Hesabınızın yetki seviyesi normal üye konumundadır. Bu panelde işlem yapabilmeniz için Supabase veritabanında profil rolünüzün <strong>Master Usta</strong> veya <strong>Efsane Usta</strong> olarak güncellenmesi gerekir. Sistem şu anda geliştirme aşamasında olduğundan sayfayı görüntüleyebilirsiniz.
                </span>
              </div>
            </div>
          )}

          {/* Global Alert messages */}
          {actionSuccess && (
            <div className="flex items-center gap-2 bg-success/10 p-3 rounded-2xl text-xs text-success mb-6">
              <Check className="h-4 w-4" />
              <span>{actionSuccess}</span>
            </div>
          )}
          {actionError && (
            <div className="flex items-center gap-2 bg-danger/10 p-3 rounded-2xl text-xs text-danger mb-6">
              <ShieldAlert className="h-4 w-4" />
              <span>{actionError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar Tabs */}
            <div className="lg:col-span-1 flex flex-col gap-2 bg-card border border-border p-3 rounded-3xl h-fit">
              <button
                onClick={() => setActiveTab('brands')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'brands' ? 'bg-accent text-accent-foreground' : 'hover:bg-background text-muted'}`}
              >
                Marka Ekle
              </button>
              <button
                onClick={() => setActiveTab('models')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'models' ? 'bg-accent text-accent-foreground' : 'hover:bg-background text-muted'}`}
              >
                Model Ekle
              </button>
              <button
                onClick={() => setActiveTab('problems')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'problems' ? 'bg-accent text-accent-foreground' : 'hover:bg-background text-muted'}`}
              >
                Kasa Ekle
              </button>
              <button
                onClick={() => setActiveTab('moderation')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'moderation' ? 'bg-accent text-accent-foreground' : 'hover:bg-background text-muted'}`}
              >
                Değerlendirme Moderasyonu
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all ${activeTab === 'users' ? 'bg-accent text-accent-foreground' : 'hover:bg-background text-muted'}`}
              >
                Kullanıcı Yönetimi
              </button>
            </div>

            {/* Content Pane */}
            <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-6 sm:p-8">
              
              {/* TAB 1: BRANDS FORM */}
              {activeTab === 'brands' && (
                <div>
                  <h2 className="text-lg font-black mb-4">Yeni Marka Ekle</h2>
                  <form onSubmit={handleAddBrand} className="space-y-4 max-w-xl">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground/80">Marka Adı</label>
                      <input
                        type="text"
                        placeholder="Örn: BMW"
                        value={newBrandName}
                        onChange={(e) => {
                          setNewBrandName(e.target.value)
                          setNewBrandSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                        }}
                        required
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground/80">Slug (URL Kısmı)</label>
                      <input
                        type="text"
                        placeholder="Örn: bmw"
                        value={newBrandSlug}
                        onChange={(e) => setNewBrandSlug(e.target.value)}
                        required
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground/80">Logo URL</label>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={newBrandLogo}
                        onChange={(e) => setNewBrandLogo(e.target.value)}
                        required
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!isAuthorized}
                      className="bg-accent text-accent-foreground px-6 py-2.5 rounded-full text-xs font-bold hover:bg-accent-hover disabled:opacity-50"
                    >
                      Markayı Kaydet
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 2: MODELS FORM */}
              {activeTab === 'models' && (
                <div>
                  <h2 className="text-lg font-black mb-4">Yeni Model Ekle</h2>
                  <form onSubmit={handleAddModel} className="space-y-4 max-w-xl">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground/80">Bağlı Olduğu Marka</label>
                      <select
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                        required
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      >
                        <option value="">Seçin...</option>
                        {brands.map(b => (
                          <option key={b.id} value={b.id}>{b.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground/80">Model Adı</label>
                      <input
                        type="text"
                        placeholder="Örn: 3 Serisi"
                        value={newModelName}
                        onChange={(e) => {
                          setNewModelName(e.target.value)
                          setNewModelSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                        }}
                        required
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground/80">Slug (URL)</label>
                      <input
                        type="text"
                        placeholder="Örn: 3-series"
                        value={newModelSlug}
                        onChange={(e) => setNewModelSlug(e.target.value)}
                        required
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!isAuthorized}
                      className="bg-accent text-accent-foreground px-6 py-2.5 rounded-full text-xs font-bold hover:bg-accent-hover disabled:opacity-50"
                    >
                      Modeli Kaydet
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: GENERATIONS FORM */}
              {activeTab === 'problems' && (
                <div>
                  <h2 className="text-lg font-black mb-4">Yeni Kasa (Nesil) Ekle</h2>
                  <form onSubmit={handleAddGen} className="space-y-4 max-w-xl">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground/80">Bağlı Olduğu Model</label>
                      <select
                        value={selectedModelId}
                        onChange={(e) => setSelectedModelId(e.target.value)}
                        required
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      >
                        <option value="">Seçin...</option>
                        {models.map(m => (
                          <option key={m.id} value={m.id}>
                            {m.brands?.name || ''} {m.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-foreground/80">Kasa Kodu</label>
                        <input
                          type="text"
                          placeholder="Örn: E90"
                          value={newGenName}
                          onChange={(e) => {
                            setNewGenName(e.target.value)
                            setNewGenSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                          }}
                          required
                          className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-foreground/80">Slug</label>
                        <input
                          type="text"
                          placeholder="Örn: e90"
                          value={newGenSlug}
                          onChange={(e) => setNewGenSlug(e.target.value)}
                          required
                          className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground/80">Üretim Yılları</label>
                      <input
                        type="text"
                        placeholder="Örn: 2005 - 2013"
                        value={newGenYears}
                        onChange={(e) => setNewGenYears(e.target.value)}
                        required
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-foreground/80">Satın Alma Rehberi ("Dikkat Edilmesi Gerekenler" - Markdown)</label>
                      <textarea
                        placeholder="### Başlık&#10;* **N46 Yağ Yakma**: Detaylı sorun tarifi..."
                        rows={6}
                        value={newGenGuide}
                        onChange={(e) => setNewGenGuide(e.target.value)}
                        className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs outline-none resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!isAuthorized}
                      className="bg-accent text-accent-foreground px-6 py-2.5 rounded-full text-xs font-bold hover:bg-accent-hover disabled:opacity-50"
                    >
                      Kasayı Kaydet
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: REVIEW MODERATION */}
              {activeTab === 'moderation' && (
                <div>
                  <h2 className="text-lg font-black mb-4">Değerlendirme Moderasyonu</h2>
                  <div className="space-y-4">
                    {reviews.length > 0 ? (
                      reviews.map((rev) => (
                        <div key={rev.id} className="p-4 bg-background border border-border/80 rounded-2xl flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold">@{rev.profiles?.username || 'user'}</span>
                              <span className="text-[10px] text-accent font-bold">({rev.profiles?.role})</span>
                              <span className="text-[10px] text-muted-foreground">{new Date(rev.created_at).toLocaleDateString('tr-TR')}</span>
                            </div>
                            <p className="text-xs font-bold text-foreground/80 mt-1">
                              Araç: {rev.generations?.name || 'Kasa'}
                            </p>
                            <p className="text-xs text-muted leading-relaxed mt-1.5">
                              "{rev.content}"
                            </p>
                          </div>
                          <button
                            onClick={() => handleDeleteReview(rev.id)}
                            disabled={!isAuthorized}
                            className="p-2 bg-danger/10 hover:bg-danger/25 text-danger rounded-xl transition-all"
                            title="Değerlendirmeyi Sil"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-muted text-center py-6">Kayıtlı değerlendirme bulunmuyor.</p>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: USER MANAGEMENT */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-lg font-black mb-4">Kullanıcı Yönetimi (Rol Tanımlama)</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-border text-muted font-bold">
                          <th className="py-3 px-4">Kullanıcı Adı</th>
                          <th className="py-3 px-4">Eski Rol</th>
                          <th className="py-3 px-4">XP</th>
                          <th className="py-3 px-4 text-right">Rol Değiştir</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map(u => (
                          <tr key={u.id} className="border-b border-border/50 hover:bg-background/50">
                            <td className="py-3 px-4 font-bold">{u.username}</td>
                            <td className="py-3 px-4">
                              <span className="rounded bg-accent/10 text-accent px-2 py-0.5 font-bold text-[10px]">
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 px-4 font-semibold">{u.xp} XP</td>
                            <td className="py-3 px-4 text-right space-x-1">
                              <button
                                onClick={() => handleUpdateUserRole(u.id, 'Usta')}
                                disabled={!isAuthorized}
                                className="px-2 py-1 bg-warning/10 text-warning hover:bg-warning/20 rounded font-bold text-[10px]"
                              >
                                Usta Yap
                              </button>
                              <button
                                onClick={() => handleUpdateUserRole(u.id, 'Master Usta')}
                                disabled={!isAuthorized}
                                className="px-2 py-1 bg-success/10 text-success hover:bg-success/20 rounded font-bold text-[10px]"
                              >
                                Admin Yap
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
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
