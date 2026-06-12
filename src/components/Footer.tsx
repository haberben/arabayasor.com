import Link from 'next/link'
import { Sparkles, Shield, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-card/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo ve Tanım */}
          <div className="flex flex-col gap-4 md:col-span-2">
            <span className="bg-gradient-to-r from-[#d4b27a] to-[#a37d4c] bg-clip-text text-xl font-black tracking-tight text-transparent">
              arabayasor<span className="text-[#a37d4c] dark:text-[#d4b27a]">.com</span>
            </span>
            <p className="text-xs text-muted max-w-sm leading-relaxed">
              Otomobil sahipleri, ustalar, galericiler ve meraklıların araç kronik sorunlarını paylaştığı, değerlendirdiği ve yapay zeka desteğiyle doğru kararları hızlıca alabildiği bağımsız bir topluluk platformudur.
            </p>
          </div>

          {/* Hızlı Bağlantılar */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80">Keşfet</h4>
            <ul className="flex flex-col gap-2 text-xs text-muted">
              <li>
                <Link href="/" className="hover:text-accent transition-colors">Ana Sayfa</Link>
              </li>
              <li>
                <Link href="/ai-analiz" className="flex items-center gap-1 hover:text-accent transition-colors">
                  <Sparkles className="h-3.5 w-3.5 text-warning" />
                  AI İlan Analizi
                </Link>
              </li>
            </ul>
          </div>

          {/* İletişim & Destek */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-foreground/80">Destek & Güvenlik</h4>
            <ul className="flex flex-col gap-2 text-xs text-muted">
              <li className="flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-success" />
                <span>Tek Oy Güvenliği</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" />
                <span>destek@arabayasor.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Alt Kısım */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-muted-foreground">
            &copy; {new Date().getFullYear()} arabayasor.com. Tüm hakları saklıdır. Platform içeriği kullanıcıların beyanları ve topluluk oylamalarıyla oluşur.
          </p>
          <div className="flex items-center gap-4 text-muted text-xs">
            <Link href="#" className="hover:text-accent transition-colors">Kullanım Koşulları</Link>
            <Link href="#" className="hover:text-accent transition-colors">Gizlilik Politikası</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
