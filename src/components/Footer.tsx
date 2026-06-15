import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-primary-container full-width bottom-0">
      {/* Main Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-8 py-12 max-w-[1280px] mx-auto">
        {/* Brand */}
        <div>
          <h3 className="text-on-primary mb-4 font-black tracking-tight" style={{ fontSize: '18px', lineHeight: '28px' }}>
            arabayasor.com
          </h3>
          <p className="font-body-md text-body-md text-on-primary-container mb-4 text-sm opacity-80">
            Türkiye'nin teknik odaklı ilk otomobil topluluğu.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-on-primary opacity-60 cursor-pointer hover:opacity-100 transition-opacity">public</span>
            <span className="material-symbols-outlined text-on-primary opacity-60 cursor-pointer hover:opacity-100 transition-opacity">share</span>
            <span className="material-symbols-outlined text-on-primary opacity-60 cursor-pointer hover:opacity-100 transition-opacity">mail</span>
          </div>
        </div>

        {/* Hızlı Erişim */}
        <div>
          <h4 className="font-label-md text-label-md text-secondary-fixed mb-4">Hızlı Erişim</h4>
          <ul className="space-y-2">
            {[
              { label: 'Popüler Markalar', href: '/arama' },
              { label: 'Kronik Sorunlar', href: '/arama?filter=sorunlar' },
              { label: 'AI Karşılaştırma', href: '/ai-analiz' },
              { label: 'Tüm İncelemeler', href: '/arama?filter=incelemeler' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="font-body-md text-body-md text-on-primary-container hover:text-secondary-fixed transition-colors text-sm opacity-80 hover:opacity-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Destek */}
        <div>
          <h4 className="font-label-md text-label-md text-secondary-fixed mb-4">Destek</h4>
          <ul className="space-y-2">
            {[
              { label: 'Kullanım Kılavuzu', href: '#' },
              { label: 'İletişim', href: '#' },
              { label: 'Uzman İncelemeleri', href: '#' },
              { label: 'SSS', href: '#' },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="font-body-md text-body-md text-on-primary-container hover:text-secondary-fixed transition-colors text-sm opacity-80 hover:opacity-100"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Bülten */}
        <div>
          <h4 className="font-label-md text-label-md text-secondary-fixed mb-4">Bülten</h4>
          <p className="font-caption text-caption text-on-primary-container mb-4 text-xs opacity-80">
            Haftalık teknik raporlar ve piyasa özeti için kaydolun.
          </p>
          <div className="flex">
            <input
              type="email"
              placeholder="E-posta"
              className="bg-white/10 border-none rounded-l px-3 py-2 text-on-primary font-caption w-full outline-none text-sm placeholder:text-on-primary/40"
            />
            <button className="bg-secondary-container text-on-secondary-container px-3 py-2 rounded-r hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined text-[20px]">send</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6 text-center max-w-[1280px] mx-auto px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="font-label-md text-label-md text-on-primary-container opacity-70 text-xs">
            © 2024 arabayasor.com - Teknik Güvenilirlik Topluluğu
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-xs text-on-primary-container opacity-60 hover:opacity-100 transition-opacity">Gizlilik</Link>
            <Link href="#" className="text-xs text-on-primary-container opacity-60 hover:opacity-100 transition-opacity">Kullanım Şartları</Link>
            <Link href="#" className="text-xs text-on-primary-container opacity-60 hover:opacity-100 transition-opacity">Çerezler</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
