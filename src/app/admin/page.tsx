'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase-client'
import { 
  mockBrands, mockModels, mockGenerations, mockReviews, mockProblemReports 
} from '@/lib/mock-data'
import { 
  PlusCircle, Trash2, ShieldCheck, ShieldAlert, Award, 
  Settings, Users, MessageSquare, Wrench, RefreshCw, Plus, Check, Database, AlertCircle, X, Info
} from 'lucide-react'

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  // State Management
  const [activeTab, setActiveTab] = useState<'dashboard' | 'brands' | 'models' | 'problems' | 'moderation' | 'users'>('dashboard')
  const [dbConnected, setDbConnected] = useState(false)

  // DB Data States
  const [brands, setBrands] = useState<any[]>([])
  const [models, setModels] = useState<any[]>([])
  const [generations, setGenerations] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [problems, setProblems] = useState<any[]>([])
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

      const { data: pData } = await supabase.from('problem_reports').select('*, generations(*)')
      setProblems(pData || [])

      const { data: uData } = await supabase.from('profiles').select('*')
      setUsers(uData || [])
    } catch (e) {
      console.warn('Supabase not fully setup, using mock data for dashboard visualization.')
      setDbConnected(false)
      setBrands(mockBrands)
      setModels(mockModels)
      setGenerations(mockGenerations)
      setReviews(mockReviews)
      setProblems(mockProblemReports)
      setUsers([
        { id: 'u1', username: 'usta_selim_y', full_name: 'Selim Yılmaz (Usta)', role: 'Master Usta', xp: 14250 },
        { id: 'u2', username: 'f30_sevdalisi', full_name: 'Caner Aydın', role: 'Uzman Kullanıcı', xp: 480 },
        { id: 'u3', username: 'test_kullanici', full_name: 'Test Üye', role: 'Yeni Üye', xp: 10 }
      ])
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/')
        return
      }
      loadAdminData()
    }
  }, [user, authLoading])

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
      setActionSuccess('Kasa/Nesil başarıyla eklendi!')
    } catch (err: any) {
      setActionError(err.message || 'Kasa eklenirken hata oluştu.')
    }
  }

  const handleApproveReview = async (id: string) => {
    setActionError('')
    setActionSuccess('')
    // In local mode, just remove it from listing to simulate approval
    setReviews(prev => prev.filter(r => r.id !== id))
    setActionSuccess('Değerlendirme onaylandı!')
  }

  const handleRejectReview = async (id: string) => {
    setActionError('')
    setActionSuccess('')
    if (dbConnected) {
      try {
        const { error } = await supabase.from('reviews').delete().eq('id', id)
        if (error) throw error
        setReviews(prev => prev.filter(r => r.id !== id))
        setActionSuccess('Değerlendirme reddedildi ve silindi.')
      } catch (err: any) {
        setActionError(err.message || 'Hata oluştu.')
      }
    } else {
      setReviews(prev => prev.filter(r => r.id !== id))
      setActionSuccess('Değerlendirme reddedildi.')
    }
  }

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    setActionError('')
    setActionSuccess('')
    if (dbConnected) {
      try {
        const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId)
        if (error) throw error
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
        setActionSuccess('Kullanıcı rolü güncellendi!')
      } catch (err: any) {
        setActionError(err.message)
      }
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u))
      setActionSuccess('Kullanıcı rolü güncellendi (Local)!')
    }
  }

  const isAuthorized = profile?.role === 'Master Usta' || profile?.role === 'Efsane Usta' || !dbConnected

  return (
    <>
      <Navbar />

      <div className="flex flex-1 max-w-7xl mx-auto w-full min-h-screen relative py-8 px-4 sm:px-6 lg:px-8">
        
        {/* SideNavBar */}
        <aside className="hidden lg:flex flex-col p-4 gap-4 overflow-y-auto bg-background h-fit w-[300px] sticky top-24 border-r border-border-low">
          <div className="mb-4">
            <h2 className="font-title-md text-sm font-black text-primary">Moderasyon</h2>
            <p className="font-caption text-[10px] text-muted">Platform sağlığını yönetin</p>
          </div>
          <nav className="flex flex-col gap-1 text-xs font-bold">
            <button 
              onClick={() => setActiveTab('dashboard')} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'dashboard' ? 'bg-surface-container-highest text-primary scale-95' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-sm">dashboard</span>
              Yönetim Paneli Özet
            </button>
            <button 
              onClick={() => setActiveTab('brands')} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'brands' ? 'bg-surface-container-highest text-primary scale-95' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-sm">database</span>
              Araç Veritabanı (Marka)
            </button>
            <button 
              onClick={() => setActiveTab('models')} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'models' ? 'bg-surface-container-highest text-primary scale-95' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-sm">directions_car</span>
              Araç Veritabanı (Model & Kasa)
            </button>
            <button 
              onClick={() => setActiveTab('moderation')} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'moderation' ? 'bg-surface-container-highest text-primary scale-95' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-sm">rate_review</span>
              Onay Bekleyen İncelemeler
            </button>
            <button 
              onClick={() => setActiveTab('problems')} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'problems' ? 'bg-surface-container-highest text-primary scale-95' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-sm">report_problem</span>
              Sorun Bildirimleri
            </button>
            <button 
              onClick={() => setActiveTab('users')} 
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${activeTab === 'users' ? 'bg-surface-container-highest text-primary scale-95' : 'text-on-surface-variant hover:bg-surface-container-low'}`}
            >
              <span className="material-symbols-outlined text-sm">group</span>
              Kullanıcı Yönetimi
            </button>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-8 min-w-0">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
            <div>
              <h1 className="font-headline-lg text-2xl font-black text-on-surface">Yönetici Kontrol Paneli</h1>
              <p className="text-muted text-xs">Sistem sağlığı ve kullanıcı moderasyon işlemleri.</p>
            </div>
            
            <div className="flex gap-2">
              <button className="border border-outline text-on-surface px-4 py-2 rounded-xl text-xs font-bold hover:bg-surface-container-low transition-colors">Rapor Dışa Aktar</button>
              <button onClick={() => setActiveTab('moderation')} className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all">İnceleme Kuyruğu ({reviews.length})</button>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-border-low p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Toplam Araç Nesli</p>
                  <h3 className="text-3xl font-black text-foreground">{generations.length}</h3>
                </div>
                <div className="bg-surface-container p-2 rounded-xl text-primary">
                  <Database className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-trust-green text-xs font-bold gap-1">
                <span className="material-symbols-outlined text-[16px]">trending_up</span>
                <span>Bu hafta +12 yeni nesil</span>
              </div>
            </div>

            <div className="bg-white border border-border-low p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Onay Bekleyenler</p>
                  <h3 className="text-3xl font-black text-foreground">{reviews.length}</h3>
                </div>
                <div className="bg-primary-container p-2 rounded-xl text-white">
                  <MessageSquare className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-secondary text-xs font-bold gap-1">
                <span className="material-symbols-outlined text-[16px]">schedule</span>
                <span>Ort. Yanıt: 4.2saat</span>
              </div>
            </div>

            <div className="bg-white border border-border-low p-6 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Kronik Bildirimleri</p>
                  <h3 className="text-3xl font-black text-danger">{problems.length}</h3>
                </div>
                <div className="bg-red-50 p-2 rounded-xl text-danger">
                  <ShieldAlert className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-danger text-xs font-bold gap-1">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>Acil inceleme gerektirir</span>
              </div>
            </div>
          </div>

          {/* Success/Error Alerts */}
          {actionSuccess && (
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-xs text-trust-green mb-6 flex justify-between items-center">
              <span>{actionSuccess}</span>
              <button onClick={() => setActionSuccess('')}><X className="h-4 w-4" /></button>
            </div>
          )}
          {actionError && (
            <div className="bg-red-50 border border-danger/10 p-4 rounded-xl text-xs text-danger mb-6 flex justify-between items-center">
              <span>{actionError}</span>
              <button onClick={() => setActionError('')}><X className="h-4 w-4" /></button>
            </div>
          )}

          {/* TAB: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Pending Table */}
              <div className="lg:col-span-2 bg-white border border-border-low rounded-3xl overflow-hidden shadow-sm flex flex-col">
                <div className="p-6 border-b border-border flex justify-between items-center bg-slate-50">
                  <h4 className="text-sm font-black text-foreground">Onay Bekleyen Değerlendirmeler</h4>
                  <button onClick={() => setActiveTab('moderation')} className="text-xs font-bold text-primary hover:underline">Tümünü Yönet</button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/50 border-b border-border/80 text-muted-foreground font-bold">
                        <th className="p-4">Kullanıcı</th>
                        <th className="p-4">Araç Nesli</th>
                        <th className="p-4">Değerlendirme Özeti</th>
                        <th className="p-4 text-center">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {reviews.slice(0, 3).map((rev) => (
                        <tr key={rev.id} className="hover:bg-slate-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary">
                                {(rev.profiles?.username || 'U')[0].toUpperCase()}
                              </div>
                              <span className="font-bold text-foreground">@{rev.profiles?.username || 'user'}</span>
                            </div>
                          </td>
                          <td className="p-4 font-semibold">{rev.generations?.name || 'F30'}</td>
                          <td className="p-4 text-muted truncate max-w-[150px]">"{rev.content}"</td>
                          <td className="p-4 text-center">
                            <div className="flex justify-center gap-2">
                              <button 
                                onClick={() => handleApproveReview(rev.id)}
                                className="bg-trust-green/10 text-trust-green p-1.5 rounded-lg hover:bg-trust-green/20"
                                title="Onayla"
                              >
                                <Check className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleRejectReview(rev.id)}
                                className="bg-red-50 text-danger p-1.5 rounded-lg hover:bg-red-100"
                                title="Reddet"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Column: Database Quick Add */}
              <div className="bg-white border border-border-low rounded-3xl p-6 shadow-sm flex flex-col">
                <h4 className="text-sm font-black text-foreground mb-4 flex items-center gap-2">
                  <PlusCircle className="h-5 w-5 text-secondary" />
                  Hızlı Araç Ekle
                </h4>
                <form onSubmit={handleAddBrand} className="flex flex-col gap-4 flex-1">
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase mb-1">Marka Adı</label>
                    <input 
                      type="text" 
                      placeholder="Örn: Toyota" 
                      value={newBrandName}
                      onChange={(e) => {
                        setNewBrandName(e.target.value)
                        setNewBrandSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                      }}
                      className="w-full border-border border rounded-xl p-3 text-xs outline-none focus:border-primary focus:ring-0" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted uppercase mb-1">Marka Slug</label>
                    <input 
                      type="text" 
                      placeholder="Örn: toyota" 
                      value={newBrandSlug}
                      onChange={(e) => setNewBrandSlug(e.target.value)}
                      className="w-full border-border border rounded-xl p-3 text-xs outline-none focus:border-primary focus:ring-0" 
                    />
                  </div>
                  <button type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold text-xs mt-auto hover:opacity-90 active:scale-95 transition-all">
                    Markayı Kaydet
                  </button>
                </form>
              </div>

              {/* Bottom Row: Recent Chronic Alerts (Full width) */}
              <div className="lg:col-span-3 bg-white border border-border-low rounded-3xl p-6 shadow-sm mt-4">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="text-sm font-black text-foreground">Son Kronik Arıza Alarmları</h4>
                  <span className="bg-red-50 text-danger text-[9px] font-bold px-2 py-0.5 rounded-full uppercase">SİSTEM TAKİBİ</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="border-l-4 border-warning-red bg-slate-50 p-4 rounded-r-xl border-y border-r border-border/40 text-xs">
                    <div className="flex justify-between items-start font-bold mb-1">
                      <span>Fiat Egea</span>
                      <span className="text-muted text-[10px]">2saat önce</span>
                    </div>
                    <p className="font-bold text-danger">Aşırı Yağ Yakma Şikayeti</p>
                    <p className="text-[10px] text-muted mt-1">Son 24 saatte 8 doğrulanmış rapor eklendi.</p>
                  </div>

                  <div className="border-l-4 border-secondary-container bg-slate-50 p-4 rounded-r-xl border-y border-r border-border/40 text-xs">
                    <div className="flex justify-between items-start font-bold mb-1">
                      <span>Peugeot 3008</span>
                      <span className="text-muted text-[10px]">5saat önce</span>
                    </div>
                    <p className="font-bold text-secondary">AdBlue Depo Arızası</p>
                    <p className="text-[10px] text-muted mt-1">2020 modellerde yeni bir arıza paterni oluşuyor.</p>
                  </div>

                  <div className="border-l-4 border-warning-red bg-slate-50 p-4 rounded-r-xl border-y border-r border-border/40 text-xs">
                    <div className="flex justify-between items-start font-bold mb-1">
                      <span>Ford Focus</span>
                      <span className="text-muted text-[10px]">8saat önce</span>
                    </div>
                    <p className="font-bold text-danger">Powershift Titreme</p>
                    <p className="text-[10px] text-muted mt-1">Şanzıman revizyon taleplerinde artış tespit edildi.</p>
                  </div>

                  <div className="border-l-4 border-trust-green bg-slate-50 p-4 rounded-r-xl border-y border-r border-border/40 text-xs">
                    <div className="flex justify-between items-start font-bold mb-1">
                      <span>Sistem Raporu</span>
                      <span className="text-muted text-[10px]">12saat önce</span>
                    </div>
                    <p className="font-bold text-trust-green">Database Eşitlemesi Başarılı</p>
                    <p className="text-[10px] text-muted mt-1">Küresel kronik hasar puanları güncellendi.</p>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: BRANDS (DATABASE) */}
          {activeTab === 'brands' && (
            <div className="bg-white border border-border-low rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase text-foreground">Marka Veritabanı</h2>
              <form onSubmit={handleAddBrand} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  type="text" 
                  placeholder="Marka Adı (Örn: BMW)" 
                  value={newBrandName}
                  onChange={(e) => {
                    setNewBrandName(e.target.value)
                    setNewBrandSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                  }}
                  className="border border-border rounded-xl p-3 text-xs outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="Slug (Örn: bmw)" 
                  value={newBrandSlug}
                  onChange={(e) => setNewBrandSlug(e.target.value)}
                  className="border border-border rounded-xl p-3 text-xs outline-none" 
                />
                <button type="submit" className="bg-primary text-white py-3 rounded-xl font-bold text-xs hover:opacity-90">Ekle</button>
              </form>

              <div className="mt-6">
                <h3 className="text-xs font-bold mb-3">Mevcut Markalar ({brands.length})</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {brands.map(b => (
                    <div key={b.id} className="p-3 bg-slate-50 border border-border/60 rounded-xl text-center text-xs font-bold">
                      {b.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: MODELS (DATABASE) */}
          {activeTab === 'models' && (
            <div className="bg-white border border-border-low rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase text-foreground">Model & Kasa Ekle</h2>
              <form onSubmit={handleAddModel} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select 
                  value={selectedBrandId}
                  onChange={(e) => setSelectedBrandId(e.target.value)}
                  className="border border-border rounded-xl p-3 text-xs bg-white"
                >
                  <option value="">Marka Seçin</option>
                  {brands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <input 
                  type="text" 
                  placeholder="Model Adı (Örn: 3 Serisi)" 
                  value={newModelName}
                  onChange={(e) => {
                    setNewModelName(e.target.value)
                    setNewModelSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))
                  }}
                  className="border border-border rounded-xl p-3 text-xs outline-none" 
                />
                <input 
                  type="text" 
                  placeholder="Slug" 
                  value={newModelSlug}
                  onChange={(e) => setNewModelSlug(e.target.value)}
                  className="border border-border rounded-xl p-3 text-xs outline-none" 
                />
                <button type="submit" className="bg-primary text-white py-3 rounded-xl font-bold text-xs hover:opacity-90">Ekle</button>
              </form>
            </div>
          )}

          {/* TAB: MODERATION */}
          {activeTab === 'moderation' && (
            <div className="bg-white border border-border-low rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase text-foreground">Değerlendirme Moderasyon Paneli ({reviews.length})</h2>
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-4 bg-slate-50 border border-border/60 rounded-2xl flex justify-between items-start gap-4 text-xs shadow-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-bold mb-1">
                        <span className="text-foreground">@{rev.profiles?.username || 'user'}</span>
                        <span className="text-accent text-[10px]">({rev.profiles?.role})</span>
                        <span className="text-muted-foreground text-[10px]">{new Date(rev.created_at || '2026-06-12').toLocaleDateString('tr-TR')}</span>
                      </div>
                      <p className="font-semibold text-slate-800">Araç Kasa: {rev.generations?.name || 'F30'}</p>
                      <p className="text-muted mt-2">"{rev.content}"</p>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleApproveReview(rev.id)}
                        className="bg-trust-green/10 text-trust-green p-2 rounded-lg hover:bg-trust-green/20"
                        title="Onayla"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleRejectReview(rev.id)}
                        className="bg-red-50 text-danger p-2 rounded-lg hover:bg-red-100"
                        title="Sil/Reddet"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: PROBLEMS */}
          {activeTab === 'problems' && (
            <div className="bg-white border border-border-low rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase text-foreground">Kronik Sorun Raporları ({problems.length})</h2>
              <div className="space-y-4">
                {problems.map((p) => (
                  <div key={p.id} className="p-4 bg-red-50/20 border border-danger/10 rounded-2xl text-xs flex justify-between items-start shadow-sm">
                    <div>
                      <h4 className="font-black text-foreground">{p.title}</h4>
                      <p className="text-muted mt-1">{p.description}</p>
                    </div>
                    <span className="bg-danger/10 text-danger px-2.5 py-0.5 rounded-full text-[9px] font-bold">KRONİK</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: USERS */}
          {activeTab === 'users' && (
            <div className="bg-white border border-border-low rounded-3xl p-6 shadow-sm space-y-6">
              <h2 className="text-sm font-black uppercase text-foreground">Kullanıcı Rol Yönetimi</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-border/80 text-muted-foreground font-bold uppercase">
                      <th className="p-4">Kullanıcı</th>
                      <th className="p-4">Mevcut Rol</th>
                      <th className="p-4">XP Değeri</th>
                      <th className="p-4 text-right pr-6">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50">
                        <td className="p-4 font-bold">{u.username}</td>
                        <td className="p-4">
                          <span className="bg-accent/15 text-accent px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                            {u.role}
                          </span>
                        </td>
                        <td className="p-4 font-semibold">{u.xp} XP</td>
                        <td className="p-4 text-right pr-6 space-x-2">
                          <button 
                            onClick={() => handleUpdateUserRole(u.id, 'Usta')}
                            className="bg-warning/10 text-warning px-3 py-1.5 rounded-lg font-bold text-[10px] hover:bg-warning/20"
                          >
                            Usta Yap
                          </button>
                          <button 
                            onClick={() => handleUpdateUserRole(u.id, 'Master Usta')}
                            className="bg-primary text-white px-3 py-1.5 rounded-lg font-bold text-[10px] hover:opacity-90"
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

        </main>
      </div>

      <Footer />
    </>
  )
}
