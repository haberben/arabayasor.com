'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { createClient } from '@/lib/supabase-client'
import { 
  Search, Sun, Moon, LogIn, User as UserIcon, LogOut, Menu, X, 
  Settings, ShieldAlert, BookOpen, Sparkles, MessageSquare, AlertCircle
} from 'lucide-react'

interface SearchResult {
  type: 'brand' | 'model' | 'generation'
  title: string
  url: string
  subtitle?: string
}

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const router = useRouter()
  const supabase = createClient()

  // Search States
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Auth Modal States
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [fullName, setFullName] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Mobile Menu State
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Profile Dropdown State
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fuzzy Search Logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }

    const performSearch = async () => {
      try {
        const query = searchQuery.toLowerCase()
        
        // Markaları çek ve ara
        const { data: brands } = await supabase
          .from('brands')
          .select('name, slug')
          
        // Modelleri çek ve ara
        const { data: models } = await supabase
          .from('models')
          .select('name, slug, brands(name, slug)')

        // Kasaları çek ve ara
        const { data: generations } = await supabase
          .from('generations')
          .select('name, slug, years, models(name, slug, brands(name, slug))')

        const results: SearchResult[] = []

        // Marka filtreleme
        if (brands) {
          brands.forEach(b => {
            if (b.name.toLowerCase().includes(query)) {
              results.push({
                type: 'brand',
                title: b.name,
                url: `/arac/${b.slug}`
              })
            }
          })
        }

        // Model filtreleme
        if (models) {
          models.forEach((m: any) => {
            if (m.name.toLowerCase().includes(query) || (m.brands?.name && m.brands.name.toLowerCase().includes(query))) {
              results.push({
                type: 'model',
                title: `${m.brands?.name} ${m.name}`,
                url: `/arac/${m.brands?.slug}/${m.slug}`
              })
            }
          })
        }

        // Kasa filtreleme
        if (generations) {
          generations.forEach((g: any) => {
            const brandName = g.models?.brands?.name || ''
            const modelName = g.models?.name || ''
            const fullTitle = `${brandName} ${modelName} ${g.name}`
            if (
              g.name.toLowerCase().includes(query) || 
              fullTitle.toLowerCase().includes(query)
            ) {
              results.push({
                type: 'generation',
                title: fullTitle,
                subtitle: `${g.years} | Kasa`,
                url: `/arac/${g.models?.brands?.slug}/${g.models?.slug}/${g.slug}`
              })
            }
          })
        }

        setSearchResults(results.slice(0, 7)) // En fazla 7 sonuç göster
        setShowSearchResults(true)
      } catch (err) {
        console.error('Search error:', err)
      }
    }

    const delayDebounceFn = setTimeout(() => {
      performSearch()
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [searchQuery])

  // Auth Operations
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)

    try {
      if (isSignUp) {
        if (!username || !fullName) {
          throw new Error('Lütfen tüm alanları doldurun.')
        }
        if (username.length < 3) {
          throw new Error('Kullanıcı adı en az 3 karakter olmalıdır.')
        }

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: username.trim().toLowerCase(),
              full_name: fullName.trim()
            }
          }
        })

        if (error) throw error
        
        // E-posta doğrulama kontrolü
        if (data.session) {
          setShowAuthModal(false)
          router.refresh()
        } else {
          setAuthError('Kayıt başarılı! Lütfen e-postanızı kontrol edip doğrulayın.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) throw error
        setShowAuthModal(false)
        router.refresh()
      }
    } catch (err: any) {
      setAuthError(err.message || 'Bir hata oluştu.')
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-2xl font-black tracking-tight text-transparent dark:from-blue-400 dark:to-indigo-300">
                arabayasor<span className="text-blue-600 dark:text-blue-400">.com</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/ai-analiz" className="flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-accent transition-colors">
                <Sparkles className="h-4 w-4 text-warning" />
                AI İlan Analizi
              </Link>
            </nav>
          </div>

          {/* Search Box - Desktop */}
          <div ref={searchRef} className="relative hidden max-w-md flex-1 px-12 md:block">
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-muted" />
              <input
                type="text"
                placeholder="Marka, model veya kasa ara... (Örn: E90)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.trim().length >= 2 && setShowSearchResults(true)}
                className="w-full rounded-full border border-border bg-background py-2 pr-4 pl-10 text-sm outline-none ring-accent/20 focus:border-accent focus:ring-4 transition-all"
              />
            </div>

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute left-12 right-12 mt-2 max-h-96 overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-2xl custom-scrollbar">
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowSearchResults(false)
                      setSearchQuery('')
                      router.push(res.url)
                    }}
                    className="flex w-full flex-col rounded-xl px-4 py-2.5 text-left hover:bg-background transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold">{res.title}</span>
                      <span className="rounded bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                        {res.type === 'brand' ? 'Marka' : res.type === 'model' ? 'Model' : 'Kasa'}
                      </span>
                    </div>
                    {res.subtitle && (
                      <span className="text-xs text-muted mt-0.5">{res.subtitle}</span>
                    )}
                  </button>
                ))}
              </div>
            )}
            {showSearchResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div className="absolute left-12 right-12 mt-2 rounded-2xl border border-border bg-card p-6 text-center text-sm text-muted shadow-2xl">
                Sonuç bulunamadı. Başka bir kelime deneyin.
              </div>
            )}
          </div>

          {/* Desktop Right Side (User actions & theme toggle) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2.5 hover:bg-border/50 text-foreground/80 hover:text-foreground transition-all duration-200"
              title={theme === 'dark' ? 'Açık Mod' : 'Karanlık Mod'}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User Dropdown / Login Button */}
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pr-4 pl-2 hover:bg-border/30 transition-all duration-200"
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent/10 text-accent font-bold text-sm">
                    {profile?.username ? profile.username[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs font-bold leading-tight">{profile?.username || 'Kullanıcı'}</span>
                    <span className="text-[10px] text-accent font-semibold leading-none">{profile?.role || 'Yeni Üye'}</span>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2 border-b border-border/50 mb-1">
                      <p className="text-xs text-muted font-medium">Hoş geldin,</p>
                      <p className="text-sm font-bold truncate">{profile?.full_name || 'Kullanıcı'}</p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="text-[10px] bg-accent/15 text-accent px-2 py-0.5 rounded-full font-bold">
                          {profile?.xp} XP
                        </span>
                      </div>
                    </div>

                    <Link
                      href={`/profil/${profile?.username}`}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm hover:bg-background transition-colors"
                    >
                      <UserIcon className="h-4 w-4 text-muted" />
                      Profilim
                    </Link>

                    {/* Admin checks */}
                    {(profile?.role === 'Master Usta' || profile?.role === 'Efsane Usta') && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm hover:bg-background text-warning transition-colors"
                      >
                        <Settings className="h-4 w-4" />
                        Yönetim Paneli
                      </Link>
                    )}

                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false)
                        await signOut()
                        router.push('/')
                      }}
                      className="flex w-full items-center gap-2 rounded-xl px-4 py-2 text-sm text-danger hover:bg-danger/10 transition-colors mt-1"
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsSignUp(false)
                  setAuthError('')
                  setShowAuthModal(true)
                }}
                className="flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-bold text-accent-foreground hover:bg-accent-hover active:scale-95 transition-all duration-200"
              >
                <LogIn className="h-4 w-4" />
                Giriş Yap
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-3 md:hidden">
            <button onClick={toggleTheme} className="rounded-full p-2 hover:bg-border/50 text-foreground/85">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="rounded-full p-2 hover:bg-border/50 text-foreground">
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md md:hidden animate-in fade-in duration-200">
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <span className="text-xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              arabayasor.com
            </span>
            <button onClick={() => setMobileMenuOpen(false)} className="rounded-full p-2 hover:bg-border/50 text-foreground">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col p-6 gap-6">
            {/* Mobile Search */}
            <div className="relative">
              <Search className="absolute top-2.5 left-3 h-4.5 w-4.5 text-muted" />
              <input
                type="text"
                placeholder="Marka, model veya kasa ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-card py-2.5 pr-4 pl-10 text-sm outline-none"
              />
              {searchResults.length > 0 && (
                <div className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-border bg-card p-2 shadow-2xl z-50">
                  {searchResults.map((res, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setMobileMenuOpen(false)
                        setSearchQuery('')
                        router.push(res.url)
                      }}
                      className="flex w-full items-center justify-between px-4 py-3 rounded-xl hover:bg-background text-left"
                    >
                      <span className="text-sm font-semibold">{res.title}</span>
                      <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-bold">{res.type}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/ai-analiz"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 py-3 px-4 rounded-2xl bg-warning/10 text-warning font-bold text-sm"
            >
              <Sparkles className="h-5 w-5" />
              AI İlan Analizi
            </Link>

            {/* Mobile Auth actions */}
            {user ? (
              <div className="flex flex-col gap-3 border-t border-border/50 pt-4">
                <div className="px-4">
                  <p className="text-xs text-muted">Giriş Yapıldı:</p>
                  <p className="text-base font-bold">{profile?.username}</p>
                  <p className="text-xs text-accent font-bold mt-0.5">{profile?.role} | {profile?.xp} XP</p>
                </div>

                <Link
                  href={`/profil/${profile?.username}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-card text-sm font-bold"
                >
                  <UserIcon className="h-5 w-5 text-muted" />
                  Profilim
                </Link>

                {(profile?.role === 'Master Usta' || profile?.role === 'Efsane Usta') && (
                  <Link
                    href="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-card text-sm font-bold text-warning"
                  >
                    <Settings className="h-5 w-5" />
                    Yönetim Paneli
                  </Link>
                )}

                <button
                  onClick={async () => {
                    setMobileMenuOpen(false)
                    await signOut()
                    router.push('/')
                  }}
                  className="flex items-center gap-3 py-3 px-4 rounded-xl hover:bg-danger/10 text-danger text-sm font-bold text-left"
                >
                  <LogOut className="h-5 w-5" />
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setIsSignUp(false)
                  setAuthError('')
                  setShowAuthModal(true)
                }}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-accent py-3 font-bold text-accent-foreground"
              >
                <LogIn className="h-5 w-5" />
                Giriş Yap / Üye Ol
              </button>
            )}
          </div>
        </div>
      )}

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-border/50 text-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-black tracking-tight mb-1 text-center">
              {isSignUp ? 'Aramıza Katıl' : 'Giriş Yap'}
            </h2>
            <p className="text-xs text-muted text-center mb-6">
              {isSignUp ? 'Fikirlerini paylaşmak ve oylamak için üye ol.' : 'arabayasor.com topluluğuna hoş geldin.'}
            </p>

            {authError && (
              <div className="flex items-start gap-2 rounded-xl bg-danger/10 p-3 text-xs text-danger mb-4">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="flex flex-col gap-4">
              {isSignUp && (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-foreground/80">Kullanıcı Adı</label>
                    <input
                      type="text"
                      placeholder="Orn: ahmet_usta"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-bold text-foreground/80">Ad Soyad</label>
                    <input
                      type="text"
                      placeholder="Orn: Ahmet Yılmaz"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
                    />
                  </div>
                </>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-foreground/80">E-posta</label>
                <input
                  type="email"
                  placeholder="Orn: eposta@adresiniz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-bold text-foreground/80">Şifre</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full bg-accent text-accent-foreground py-3 rounded-full font-bold hover:bg-accent-hover transition-colors mt-2 disabled:opacity-50"
              >
                {authLoading ? 'İşlem yapılıyor...' : isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
              </button>
            </form>

            <div className="text-center mt-6 text-xs">
              <span className="text-muted">
                {isSignUp ? 'Zaten üye misiniz?' : 'Hesabınız yok mu?'}
              </span>{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setAuthError('')
                }}
                className="text-accent font-bold hover:underline"
              >
                {isSignUp ? 'Giriş Yap' : 'Üye Ol'}
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  )
}
