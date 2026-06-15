'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

const navLinks = [
  { href: '/ai-analiz', label: 'AI Analizi' },
  { href: '/arama', label: 'Topluluk' },
]

export default function Navbar() {
  const router = useRouter()
  const pathname = usePathname()
  const [searchQuery, setSearchQuery] = useState('')
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
        <div className="flex items-center justify-between px-8 w-full max-w-[1280px] mx-auto h-16 gap-6">
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

            <div className="flex gap-3 pt-4">
              <Link href="/giris" className="flex-1 text-center py-2.5 border border-border-low rounded-lg font-label-md text-on-surface-variant">
                Giriş Yap
              </Link>
              <Link href="/kayit" className="flex-1 text-center py-2.5 bg-primary text-on-primary rounded-lg font-label-md">
                Kayıt Ol
              </Link>
            </div>

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
