import Link from 'next/link'

const FOOTER_LINKS = {
  'Hızlı Erişim': [
    { label: 'Popüler Markalar', href: '/arama' },
    { label: 'Kronik Sorunlar', href: '/arama' },
    { label: 'AI Analizi', href: '/ai-analiz' },
    { label: 'Topluluk', href: '/arama' },
  ],
  'Destek': [
    { label: 'Kullanım Kılavuzu', href: '#' },
    { label: 'İletişim', href: '#' },
    { label: 'Uzman İncelemeleri', href: '#' },
    { label: 'SSS', href: '#' },
  ],
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
      <div className="mx-auto max-w-[1400px] px-4 md:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand Column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div
                className="flex h-9 w-9 items-center justify-center rounded-xl font-black text-base"
                style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
              >
                A
              </div>
              <span className="font-black text-[16px] tracking-tight" style={{ color: 'var(--foreground)' }}>
                arabayasor<span style={{ color: 'var(--accent)' }}>.com</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-5" style={{ color: 'var(--muted)' }}>
              Türkiye'nin teknik odaklı ilk otomobil topluluğu. Güvenilir kullanıcı verileri ile doğru kararlar verin.
            </p>
            <div className="flex gap-3">
              {['public', 'share', 'chat'].map((icon) => (
                <button
                  key={icon}
                  className="flex h-9 w-9 items-center justify-center rounded-xl border transition-all hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}
                >
                  <span className="material-symbols-outlined text-[18px]">{icon}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: 'var(--accent)' }}
              >
                {title}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium transition-colors hover:text-[var(--accent)]"
                      style={{ color: 'var(--muted)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Column */}
          <div>
            <h4
              className="text-xs font-bold uppercase tracking-widest mb-4"
              style={{ color: 'var(--accent)' }}
            >
              Bülten
            </h4>
            <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
              Haftalık teknik raporlar ve piyasa özeti için kaydolun.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="themed-input flex-1 text-sm py-2.5"
              />
              <button
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all hover:scale-105"
                style={{ background: 'var(--accent)', color: 'var(--accent-foreground)' }}
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t py-5"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="mx-auto max-w-[1400px] px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
            © {new Date().getFullYear()} arabayasor.com — Teknik Güvenilirlik Topluluğu
          </p>
          <div className="flex gap-4">
            {['Gizlilik Politikası', 'Kullanım Şartları'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs transition-colors hover:text-[var(--accent)]"
                style={{ color: 'var(--muted-foreground)' }}
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
