import Link from 'next/link'
import { Sparkles, Shield, Mail } from 'lucide-react'


export default function Footer() {
  return (
    <footer className="bg-primary-container dark:bg-black w-full border-t border-border-low dark:border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-margin-desktop py-12 max-w-max-width mx-auto">
        <div>
          <h3 className="text-title-md font-display-lg text-on-primary mb-4 font-black tracking-tight">
            arabayasor.com
          </h3>
          <p className="font-body-md text-body-md text-on-primary-container dark:text-outline-variant mb-4 leading-relaxed">
            Türkiye'nin teknik odaklı ilk otomobil topluluğu.
          </p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-on-primary opacity-60 cursor-pointer hover:opacity-100">
              public
            </span>
            <span className="material-symbols-outlined text-on-primary opacity-60 cursor-pointer hover:opacity-100">
              share
            </span>
          </div>
        </div>
        
        <div>
          <h4 className="font-label-md text-label-md text-secondary-fixed mb-4 font-bold uppercase tracking-wider">
            Hızlı Erişim
          </h4>
          <ul className="space-y-2 font-body-md text-body-md">
            <li>
              <Link 
                href="/arama" 
                className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors"
              >
                Popüler Markalar
              </Link>
            </li>
            <li>
              <Link 
                href="/arama" 
                className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors"
              >
                Kronik Sorunlar
              </Link>
            </li>
            <li>
              <Link 
                href="/ai-analiz" 
                className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors"
              >
                AI Karşılaştırma
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-label-md text-label-md text-secondary-fixed mb-4 font-bold uppercase tracking-wider">
            Destek
          </h4>
          <ul className="space-y-2 font-body-md text-body-md">
            <li>
              <Link 
                href="#" 
                className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors"
              >
                Kullanım Kılavuzu
              </Link>
            </li>
            <li>
              <Link 
                href="#" 
                className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors"
              >
                İletişim
              </Link>
            </li>
            <li>
              <Link 
                href="#" 
                className="text-on-primary-container dark:text-outline-variant hover:text-secondary-fixed transition-colors"
              >
                Uzman İncelemeleri
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-label-md text-label-md text-secondary-fixed mb-4 font-bold uppercase tracking-wider">
            Bülten
          </h4>
          <p className="font-caption text-caption text-on-primary-container dark:text-outline-variant mb-4 leading-relaxed">
            Haftalık teknik raporlar ve piyasa özeti için kaydolun.
          </p>
          <div className="flex">
            <input 
              className="bg-white/10 border-none rounded-l px-3 py-2 text-on-primary font-caption w-full outline-none placeholder:text-on-primary-container" 
              placeholder="E-posta" 
              type="email"
            />
            <button className="bg-secondary-container text-on-secondary-container px-4 py-2 rounded-r hover:bg-opacity-95 transition-all">
              <span className="material-symbols-outlined align-middle">send</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="border-t border-white/10 py-6 text-center">
        <p className="font-label-md text-label-md text-on-primary-container dark:text-outline-variant">
          © {new Date().getFullYear()} arabayasor.com - Teknik Güvenilirlik Topluluğu
        </p>
      </div>
    </footer>
  )
}
