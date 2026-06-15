'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const navLinks = [
  { href: '/ai-analiz', label: 'AI Analizi' },
  { href: '/arama', label: 'Topluluk' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
  const { user, profile, loading, signOut } = useAuth()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/arama?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  return (
    <>
      <header
        className={`bg-surface-container-lowest sticky top-0 z-50 border-b border-border-low transition-shadow duration-200 ${scrolled ? 'shadow-sm' : ''}`}
      >
        <div className="flex items-center justify-between px-4 md:px-8 w-full max-w-[1280px] mx-auto h-16 gap-6">
          {/* Logo */}
          <div className="flex items-center gap-8 flex-shrink-0">
            <Link
              href="/"
              className="font-black tracking-tight text-on-surface hover:text-primary transition-colors"
              style={{ fontSize: '18px', lineHeight: '28px', fontWeight: 700 }}
            >
              arabayasor.com
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-label-md text-label-md py-1 transition-colors duration-200 ${
                    isActive(link.href)
                      ? 'text-primary font-bold border-b-2 border-secondary-container'
                      : 'text-on-surface-variant font-medium hover:text-secondary'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xs lg:max-w-sm items-center bg-surface-container-low border border-border-low rounded-lg overflow-hidden focus-within:border-primary transition-colors"
          >
            <span className="material-symbols-outlined text-outline ml-3 text-[20px] flex-shrink-0">search</span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Marka veya model ara..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none bg-transparent outline-none px-3 py-2 font-body-md text-body-md text-on-surface placeholder:text-outline text-sm"
              style={{ fontSize: '14px' }}
            />
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Language Switcher */}
            <div className="hidden sm:flex items-center border border-border-low rounded-lg p-1">
              <button className="px-2 py-0.5 text-[12px] font-bold bg-primary text-on-primary rounded">TR</button>
              <button className="px-2 py-0.5 text-[12px] font-medium text-on-surface-variant hover:text-primary">EN</button>
            </div>

            {loading ? (
              <div className="w-6 h-6 rounded-full border-2 border-border-low border-b-primary animate-spin hidden sm:block"></div>
            ) : user ? (
              <div className="relative group hidden sm:block">
                <button className="flex items-center gap-2 hover:opacity-85 transition-all outline-none">
                  <div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs uppercase shadow-sm border border-border-low">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      (profile?.full_name || profile?.username || user.email || 'U').substring(0, 2)
                    )}
                  </div>
                  <span className="font-label-md text-label-md text-on-surface hidden lg:block max-w-[100px] truncate">
                    {profile?.full_name || profile?.username || 'Kullanıcı'}
                  </span>
                  <span className="material-symbols-outlined text-[16px] text-on-surface hidden lg:block">expand_more</span>
                </button>
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white border border-border-low rounded-xl shadow-lg py-2 hidden group-hover:block hover:block z-50 transition-all">
                  <div className="px-4 py-2 border-b border-border-low">
                    <p className="font-bold text-xs text-on-surface truncate">{profile?.full_name || 'Kullanıcı'}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
                    {(profile?.is_vip || user.email?.toLowerCase() === 'ibrahmyldrim@yandex.com') && (
                      <span className="inline-block mt-1 bg-secondary-container text-on-secondary-container text-[9px] px-2 py-0.5 rounded-full font-bold">
                        ★ VIP ÜYE
                      </span>
                    )}
                  </div>
                  <Link href={`/profil/${profile?.username || 'profil'}`} className="block px-4 py-2 text-xs text-on-surface hover:bg-surface-container-low transition-colors">
                    Profilim
                  </Link>
                  {(profile?.is_admin || profile?.role === 'Master Usta' || user.email?.toLowerCase() === 'ibrahmyldrim@yandex.com') && (
                    <Link href="/admin" className="block px-4 py-2 text-xs text-primary font-bold hover:bg-surface-container-low transition-colors">
                      Yönetici Paneli
                    </Link>
                  )}
                  <button onClick={signOut} className="w-full text-left px-4 py-2 text-xs text-error hover:bg-error-container/10 transition-colors border-t border-border-low mt-1">
                    Çıkış Yap
                  </button>
                </div>
              </div>
            ) : (
              <>
                <Link
                  href="/giris"
                  className="font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors hidden sm:block"
                >
                  Giriş Yap
                </Link>

                <Link
                  href="/kayit"
                  className="bg-primary text-on-primary px-5 py-2 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all whitespace-nowrap"
                >
                  Kayıt Ol
                </Link>
              </>
            )}

            {/* Mobile hamburger */}
            <button
              className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menü"
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-surface-container-lowest pt-16">
          <div className="p-6 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="flex items-center bg-surface-container-low border border-border-low rounded-lg overflow-hidden">
              <span className="material-symbols-outlined text-outline ml-3 text-[20px]">search</span>
              <input
                type="text"
                placeholder="Marka veya model ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none bg-transparent outline-none px-3 py-3 text-sm text-on-surface placeholder:text-outline"
              />
            </form>

            {/* Mobile Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block py-3 px-2 font-label-md text-label-md border-b border-border-low ${
                  isActive(link.href) ? 'text-primary font-bold' : 'text-on-surface-variant'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {loading ? (
              <div className="w-8 h-8 rounded-full border-2 border-border-low border-b-primary animate-spin mx-auto"></div>
            ) : user ? (
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl border border-border-low">
                  <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm uppercase shadow-sm shrink-0">
                    {profile?.avatar_url ? (
                      <img src={profile.avatar_url} alt={profile.full_name} className="w-full h-full rounded-full object-cover" />
                    ) : (
                      (profile?.full_name || profile?.username || user.email || 'U').substring(0, 2)
                    )}
                  </div>
                  <div className="truncate min-w-0">
                    <p className="font-bold text-xs text-on-surface truncate">{profile?.full_name || 'Kullanıcı'}</p>
                    <p className="text-[10px] text-on-surface-variant truncate">{user.email}</p>
                    {(profile?.is_vip || user.email?.toLowerCase() === 'ibrahmyldrim@yandex.com') && (
                      <span className="inline-block mt-0.5 bg-secondary-container text-on-secondary-container text-[9px] px-2 py-0.5 rounded-full font-bold">
                        ★ VIP ÜYE
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Link 
                    href={`/profil/${profile?.username || 'profil'}`} 
                    onClick={() => setMobileOpen(false)}
                    className="text-center py-2.5 bg-surface-container-high border border-border-low rounded-lg text-xs font-bold text-on-surface block"
                  >
                    Profilim
                  </Link>
                  {(profile?.is_admin || profile?.role === 'Master Usta' || user.email?.toLowerCase() === 'ibrahmyldrim@yandex.com') && (
                    <Link 
                      href="/admin" 
                      onClick={() => setMobileOpen(false)}
                      className="text-center py-2.5 bg-secondary-container/20 border border-secondary-container/30 rounded-lg text-xs font-bold text-secondary block"
                    >
                      Yönetici
                    </Link>
                  )}
                </div>
                <button 
                  onClick={() => { signOut(); setMobileOpen(false); }} 
                  className="w-full text-center py-2.5 bg-error-container/10 border border-error-container/20 text-error rounded-lg text-xs font-bold"
                >
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <div className="flex gap-3 pt-4">
                <Link href="/giris" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 border border-border-low rounded-lg font-label-md text-on-surface-variant text-xs font-bold">
                  Giriş Yap
                </Link>
                <Link href="/kayit" onClick={() => setMobileOpen(false)} className="flex-1 text-center py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-xs font-bold">
                  Kayıt Ol
                </Link>
              </div>
            )}

            {/* Language */}
            <div className="flex items-center gap-2 pt-2">
              <button className="px-3 py-1 text-xs font-bold bg-primary text-on-primary rounded">TR</button>
              <button className="px-3 py-1 text-xs font-medium text-on-surface-variant border border-border-low rounded">EN</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
