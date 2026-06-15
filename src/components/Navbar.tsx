'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'
import { createClient } from '@/lib/supabase-client'
import {
  Search, Sun, Moon, LogIn, User as UserIcon, LogOut, Menu, X,
  Settings, Sparkles, AlertCircle, SlidersHorizontal, ChevronDown,
  Car, Shield
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
  const [searchFocused, setSearchFocused] = useState(false)
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

  // Scroll state
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Click outside handlers
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchResults(false)
        setSearchFocused(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Search Logic
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([])
      return
    }

    const performSearch = async () => {
      try {
        const query = searchQuery.toLowerCase()
        const { data: brands } = await supabase.from('brands').select('name, slug')
        const { data: models } = await supabase.from('models').select('name, slug, brands(name, slug)')
        const { data: generations } = await supabase.from('generations').select('name, slug, years, models(name, slug, brands(name, slug))')

        const results: SearchResult[] = []

        brands?.forEach(b => {
          if (b.name.toLowerCase().includes(query)) {
            results.push({ type: 'brand', title: b.name, url: `/arac/${b.slug}` })
          }
        })

        models?.forEach((m: any) => {
          if (m.name.toLowerCase().includes(query) || m.brands?.name?.toLowerCase().includes(query)) {
            results.push({ type: 'model', title: `${m.brands?.name} ${m.name}`, url: `/arac/${m.brands?.slug}/${m.slug}` })
          }
        })

        generations?.forEach((g: any) => {
          const brandName = g.models?.brands?.name || ''
          const modelName = g.models?.name || ''
          const fullTitle = `${brandName} ${modelName} ${g.name}`
          if (g.name.toLowerCase().includes(query) || fullTitle.toLowerCase().includes(query)) {
            results.push({
              type: 'generation',
              title: fullTitle,
              subtitle: `${g.years} · Kasa`,
              url: `/arac/${g.models?.brands?.slug}/${g.models?.slug}/${g.slug}`
            })
          }
        })

        setSearchResults(results.slice(0, 7))
        setShowSearchResults(true)
      } catch (err) {
        console.error('Search error:', err)
      }
    }

    const delay = setTimeout(performSearch, 300)
    return () => clearTimeout(delay)
  }, [searchQuery])

  // Auth Operations
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)

    try {
      if (isSignUp) {
        if (!username || !fullName) throw new Error('Lütfen tüm alanları doldurun.')
        if (username.length < 3) throw new Error('Kullanıcı adı en az 3 karakter olmalıdır.')

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username: username.trim().toLowerCase(), full_name: fullName.trim() } }
        })

        if (error) throw error
        if (data.session) {
          setShowAuthModal(false)
          router.refresh()
        } else {
          setAuthError('Kayıt başarılı! Lütfen e-postanızı doğrulayın.')
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
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

  const typeLabel = (type: string) => {
    if (type === 'brand') return 'Marka'
    if (type === 'model') return 'Model'
    return 'Kasa'
  }

  const typeIcon = (type: string) => {
    if (type === 'brand') return <Shield className="h-3 w-3" />
    if (type === 'model') return <Car className="h-3 w-3" />
    return <Car className="h-3 w-3" />
  }

  return (
    <>
      {/* ===================== NAVBAR ===================== */}
      <header
        className={`glass-header sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? 'shadow-lg shadow-black/5' : ''
        }`}
      >
        <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 md:px-8">

          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 shrink-0 group"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-black text-sm transition-transform group-hover:scale-105">
              A
            </div>
            <span
              className="hidden sm:block font-black text-[15px] tracking-tight"
              style={{ color: 'var(--foreground)' }}
            >
              arabayasor<span style={{ color: 'var(--accent)' }}>.com</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 ml-2">
            <Link
              href="/ai-analiz"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]"
              style={{ color: 'var(--muted)' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Analizi
            </Link>
            <Link
              href="/arama"
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-all hover:bg-[var(--accent-subtle)] hover:text-[var(--accent)]"
              style={{ color: 'var(--muted)' }}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Topluluk
            </Link>
          </nav>

          {/* Search Box - Desktop */}
          <div ref={searchRef} className="relative hidden md:flex flex-1 max-w-sm mx-4">
            <div
              className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 transition-all duration-200 ${
                searchFocused
                  ? 'border-[var(--accent)] shadow-[0_0_0_3px_rgba(254,166,25,0.12)]'
                  : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
              style={{ background: 'var(--surface)' }}
            >
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                placeholder="Marka, model veya kasa ara…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  setSearchFocused(true)
                  if (searchQuery.trim().length >= 2) setShowSearchResults(true)
                }}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: 'var(--foreground)' }}
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(''); setSearchResults([]) }}
                  className="shrink-0 rounded p-0.5 transition-colors hover:bg-[var(--border)]"
                >
                  <X className="h-3.5 w-3.5" style={{ color: 'var(--muted-foreground)' }} />
                </button>
              )}
            </div>

            {/* Search Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div
                className="animate-scale-in absolute left-0 right-0 top-full mt-2 max-h-80 overflow-y-auto rounded-2xl border p-1.5 shadow-2xl custom-scrollbar z-50"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setShowSearchResults(false)
                      setSearchQuery('')
                      router.push(res.url)
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--surface)]"
                  >
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{res.title}</span>
                      {res.subtitle && (
                        <span className="text-xs mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{res.subtitle}</span>
                      )}
                    </div>
                    <span className="accent-badge ml-2 shrink-0 flex items-center gap-1">
                      {typeIcon(res.type)}
                      {typeLabel(res.type)}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {showSearchResults && searchQuery.trim().length >= 2 && searchResults.length === 0 && (
              <div
                className="animate-scale-in absolute left-0 right-0 top-full mt-2 rounded-2xl border p-5 text-center text-sm shadow-2xl z-50"
                style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--muted)' }}
              >
                Sonuç bulunamadı
              </div>
            )}
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:bg-[var(--surface)] hover:border-[var(--border-hover)] active:scale-95"
              style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
              aria-label="Tema değiştir"
            >
              {theme === 'dark'
                ? <Sun className="h-4 w-4 text-[var(--accent)]" />
                : <Moon className="h-4 w-4" />
              }
            </button>

            {/* User Section */}
            {user ? (
              <div ref={dropdownRef} className="relative">
                <button
                  id="profile-dropdown-btn"
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition-all hover:bg-[var(--surface)] hover:border-[var(--border-hover)]"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-lg font-bold text-sm"
                    style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
                  >
                    {profile?.username ? profile.username[0].toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:flex flex-col items-start">
                    <span className="text-xs font-bold leading-tight" style={{ color: 'var(--foreground)' }}>
                      {profile?.username || 'Kullanıcı'}
                    </span>
                    <span className="text-[10px] font-medium leading-none" style={{ color: 'var(--muted)' }}>
                      {profile?.role || 'Üye'}
                    </span>
                  </div>
                  <ChevronDown
                    className={`h-3.5 w-3.5 hidden sm:block transition-transform duration-200 ${profileDropdownOpen ? 'rotate-180' : ''}`}
                    style={{ color: 'var(--muted-foreground)' }}
                  />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="animate-scale-in absolute right-0 mt-2 w-56 rounded-2xl border p-1.5 shadow-2xl z-50"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                  >
                    {/* User Info Header */}
                    <div className="px-3 py-3 border-b mb-1" style={{ borderColor: 'var(--border)' }}>
                      <p className="text-xs font-medium" style={{ color: 'var(--muted)' }}>Hoş geldin,</p>
                      <p className="text-sm font-bold truncate mt-0.5" style={{ color: 'var(--foreground)' }}>
                        {profile?.full_name || 'Kullanıcı'}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <span className="accent-badge">{profile?.xp ?? 0} XP</span>
                      </div>
                    </div>

                    <Link
                      href={`/profil/${profile?.username}`}
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface)]"
                      style={{ color: 'var(--foreground)' }}
                    >
                      <UserIcon className="h-4 w-4" style={{ color: 'var(--muted)' }} />
                      Profilim
                    </Link>

                    {(profile?.role === 'Master Usta' || profile?.role === 'Efsane Usta') && (
                      <Link
                        href="/admin"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-[var(--surface)]"
                        style={{ color: 'var(--warning)' }}
                      >
                        <Settings className="h-4 w-4" />
                        Yönetim Paneli
                      </Link>
                    )}

                    <div className="h-px my-1" style={{ background: 'var(--border)' }} />

                    <button
                      onClick={async () => {
                        setProfileDropdownOpen(false)
                        await signOut()
                        router.push('/')
                      }}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                      style={{ color: 'var(--danger)' }}
                    >
                      <LogOut className="h-4 w-4" />
                      Çıkış Yap
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <button
                  id="login-btn"
                  onClick={() => { setIsSignUp(false); setAuthError(''); setShowAuthModal(true) }}
                  className="text-sm font-semibold px-3 py-2 rounded-lg transition-colors hover:bg-[var(--surface)]"
                  style={{ color: 'var(--muted)' }}
                >
                  Giriş Yap
                </button>
                <button
                  id="signup-btn"
                  onClick={() => { setIsSignUp(true); setAuthError(''); setShowAuthModal(true) }}
                  className="btn-accent text-sm px-4 py-2 rounded-lg"
                >
                  Üye Ol
                </button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:bg-[var(--surface)]"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ===================== MOBILE DRAWER ===================== */}
      {mobileMenuOpen && (
        <div
          className="animate-fade-in fixed inset-0 z-50 md:hidden flex flex-col"
          style={{ background: 'var(--card)' }}
        >
          {/* Drawer Header */}
          <div
            className="flex h-16 items-center justify-between border-b px-5"
            style={{ borderColor: 'var(--border)' }}
          >
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground font-black text-sm">
                A
              </div>
              <span className="font-black text-[15px] tracking-tight" style={{ color: 'var(--foreground)' }}>
                arabayasor<span style={{ color: 'var(--accent)' }}>.com</span>
              </span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Drawer Content */}
          <div className="flex flex-col gap-3 overflow-y-auto p-5 flex-1">
            {/* Mobile Search */}
            <div
              className="flex items-center gap-2 rounded-xl border px-3 py-2.5"
              style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
            >
              <Search className="h-4 w-4 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
              <input
                type="text"
                placeholder="Marka, model veya kasa ara…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm outline-none"
                style={{ color: 'var(--foreground)' }}
              />
            </div>

            {/* Mobile Search Results */}
            {searchResults.length > 0 && (
              <div
                className="rounded-2xl border p-1.5 max-h-48 overflow-y-auto custom-scrollbar"
                style={{ background: 'var(--surface)', borderColor: 'var(--border)' }}
              >
                {searchResults.map((res, i) => (
                  <button
                    key={i}
                    onClick={() => { setMobileMenuOpen(false); setSearchQuery(''); router.push(res.url) }}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-[var(--card)]"
                  >
                    <span className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>{res.title}</span>
                    <span className="accent-badge">{typeLabel(res.type)}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1 mt-2">
              <Link
                href="/ai-analiz"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                style={{ background: 'var(--accent-subtle)', color: 'var(--accent)' }}
              >
                <Sparkles className="h-4.5 w-4.5" />
                AI İlan Analizi
              </Link>
              <Link
                href="/arama"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-[var(--surface)]"
                style={{ color: 'var(--foreground)' }}
              >
                <SlidersHorizontal className="h-4.5 w-4.5" style={{ color: 'var(--muted)' }} />
                Gelişmiş Arama
              </Link>
            </div>

            {/* Mobile Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-[var(--surface)] border mt-1"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              {theme === 'dark'
                ? <><Sun className="h-4 w-4 text-[var(--accent)]" /><span>Açık Tema</span></>
                : <><Moon className="h-4 w-4" style={{ color: 'var(--muted)' }} /><span>Koyu Tema</span></>
              }
            </button>

            {/* Mobile Auth */}
            <div className="mt-auto pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
              {user ? (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-2 py-3">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl font-bold"
                      style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
                    >
                      {profile?.username ? profile.username[0].toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: 'var(--foreground)' }}>{profile?.username}</p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>{profile?.role} · {profile?.xp} XP</p>
                    </div>
                  </div>
                  <Link
                    href={`/profil/${profile?.username}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-[var(--surface)]"
                    style={{ color: 'var(--foreground)' }}
                  >
                    <UserIcon className="h-4 w-4" style={{ color: 'var(--muted)' }} />
                    Profilim
                  </Link>
                  <button
                    onClick={async () => { setMobileMenuOpen(false); await signOut(); router.push('/') }}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors"
                    style={{ color: 'var(--danger)' }}
                  >
                    <LogOut className="h-4 w-4" />
                    Çıkış Yap
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <button
                    onClick={() => { setMobileMenuOpen(false); setIsSignUp(false); setAuthError(''); setShowAuthModal(true) }}
                    className="flex-1 rounded-xl border py-3 text-sm font-bold transition-colors hover:bg-[var(--surface)]"
                    style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={() => { setMobileMenuOpen(false); setIsSignUp(true); setAuthError(''); setShowAuthModal(true) }}
                    className="btn-accent flex-1 rounded-xl py-3 text-sm"
                  >
                    Üye Ol
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================== AUTH MODAL ===================== */}
      {showAuthModal && (
        <div
          className="animate-fade-in fixed inset-0 z-[60] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAuthModal(false) }}
        >
          <div
            className="animate-scale-in relative w-full max-w-md rounded-3xl border p-7 shadow-2xl"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-xl transition-colors hover:bg-[var(--surface)]"
              style={{ color: 'var(--muted)' }}
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Logo in Modal */}
            <div className="flex justify-center mb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-accent-foreground font-black text-xl">
                A
              </div>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-center mb-1" style={{ color: 'var(--foreground)' }}>
              {isSignUp ? 'Aramıza Katıl' : 'Tekrar Hoş Geldin'}
            </h2>
            <p className="text-sm text-center mb-6" style={{ color: 'var(--muted)' }}>
              {isSignUp
                ? 'Fikirlerini paylaşmak ve oylamak için üye ol.'
                : 'arabayasor.com topluluğuna giriş yap.'}
            </p>

            {authError && (
              <div
                className="flex items-start gap-2.5 rounded-xl p-3 text-sm mb-4"
                style={{
                  background: authError.includes('başarılı') ? 'rgba(0,182,122,0.1)' : 'rgba(220,38,38,0.08)',
                  color: authError.includes('başarılı') ? 'var(--success)' : 'var(--danger)',
                  border: `1px solid ${authError.includes('başarılı') ? 'rgba(0,182,122,0.2)' : 'rgba(220,38,38,0.2)'}`
                }}
              >
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAuth} className="flex flex-col gap-3">
              {isSignUp && (
                <>
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                      Kullanıcı Adı
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: ahmet_usta"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="themed-input"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                      Ad Soyad
                    </label>
                    <input
                      type="text"
                      placeholder="Örn: Ahmet Yılmaz"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="themed-input"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                  E-posta
                </label>
                <input
                  type="email"
                  placeholder="eposta@adresiniz.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="themed-input"
                />
              </div>

              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: 'var(--foreground)' }}>
                  Şifre
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="themed-input"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="btn-accent w-full py-3 rounded-xl mt-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {authLoading ? 'İşlem yapılıyor…' : isSignUp ? 'Hesap Oluştur' : 'Giriş Yap'}
              </button>
            </form>

            <p className="text-center text-sm mt-5" style={{ color: 'var(--muted)' }}>
              {isSignUp ? 'Zaten üye misiniz?' : 'Hesabınız yok mu?'}{' '}
              <button
                onClick={() => { setIsSignUp(!isSignUp); setAuthError('') }}
                className="font-bold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {isSignUp ? 'Giriş Yap' : 'Üye Ol'}
              </button>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
