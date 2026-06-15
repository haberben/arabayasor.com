'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { mockBrands, mockModels, mockGenerations, mockReviews } from '@/lib/mock-data'
import { RotateCcw, Search } from 'lucide-react'

// Map specific slugs to high-res, verified visual images matching the premium templates
function getCarImage(slug: string) {
  const s = slug.toLowerCase()
  if (s === 'f30') {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuBqtOtvRquXQpaum7YoLDcxMrGm89iDl677wBsr7GorVRL42sgeNahUfXHX_n0RI5psEdzDADUJyhUgdpbKgx9x-rsQdppb_ull8uMIHUEvcChZ_mVvq6QiXmIs_ysP8xmg7l8oungnzOcJu0NZYBG-I3e2jlRibTBocwUIOpkDpHrPiFxbMwTGmqQWwCqG65DhlsYqq-vYSBl9sodGMRAY9CpUv-jYb5PpZciE5A0HKsBFRWd_OkH2LVuXrDD2njGvfHQE3S40nmo'
  }
  if (s === 'g20') {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuCr72nltyl7y03K2eQXjU0Ea2wF0HjJjfaFTzkGp9ObabppN8xYenLudpPpPDYA_wlajMgBq4SJgk7qBvr3muEyAp2BpZyH5hfGCGxW6ZxhzrJZmogQcmI8CDz3IhkZcatSMtdoV4f91ro8NHpMJoTcOh0gBi8LP0G3Q2PUKOk3LbhkpUOUhP2LnYdUHV34tEh33ekbL5BzCWj0tqbhnQm30VVMxgxo8h2iXWjzZFfcCZcCgF8sCh1hcHwx2YJm6vZok-1ztHztMUg'
  }
  if (s === 'e90') {
    return 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOxvyURXpkCNeD6fD25EmPtuHHXkB9scpyFkXxUr5ZgYAoWQfuu-jljbfcMRZbEOA9ezM3NlwN-zy-WO9g_S1uL_oLRwwNR2R-6t8qjLba72BxzIPXGzXVPVuLEl8I5ayZNLd40Aq2bXKtJ5e6CuXnZfd31nSilBN0FeS2h0zb-lttGB_ytbtroJSawCPnI9R9kiqR6qo_928x_eh2spoNVYvo6axkNb2103bt1GYrzYu6mjW6q0AAT6jcH5w1rhuvMwauoUT8X7g'
  }
  if (s === 'w204') {
    return '/cars/w204.png'
  }
  if (s === 'b8') {
    return '/cars/b8.png'
  }
  if (s === 'megane-4') {
    return '/cars/megane-4.png'
  }
  if (s === 'clio-4') {
    return '/cars/clio-4.png'
  }
  if (s === 'e160') {
    return '/cars/e160.png'
  }
  return '/cars/f30.png'
}

const getCardTags = (genSlug: string) => {
  const slug = genSlug.toLowerCase()
  if (slug === 'f30') {
    return [
      { type: 'warning', label: 'Turbo Riski' },
      { type: 'warning', label: 'Zincir Sesi' }
    ]
  }
  if (slug === 'e90') {
    return [
      { type: 'warning', label: 'Yağ Eksiltme' },
      { type: 'warning', label: 'Electronics' }
    ]
  }
  if (slug === 'w204') {
    return [
      { type: 'warning', label: 'Zincir & Dişli' },
      { type: 'success', label: 'Low Maintenance' }
    ]
  }
  if (slug === 'megane-4' || slug === 'clio-4') {
    return [
      { type: 'warning', label: 'EDC Kararsızlığı' },
      { type: 'success', label: 'Düşük Tüketim' }
    ]
  }
  return [
    { type: 'success', label: 'Sorunsuz Sürüş' }
  ]
}

function SearchContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [selectedBrand, setSelectedBrand] = useState('')
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedFuel, setSelectedFuel] = useState('')
  const [minYear, setMinYear] = useState('')
  const [maxYear, setMaxYear] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [selectedBodyType, setSelectedBodyType] = useState('')
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  // Sync state with URL search parameters
  useEffect(() => {
    const q = searchParams.get('q') || ''
    setSearchQuery(q)

    const brand = searchParams.get('brand') || ''
    setSelectedBrand(brand)

    const model = searchParams.get('model') || ''
    setSelectedModel(model)

    const fuel = searchParams.get('fuel') || ''
    setSelectedFuel(fuel)

    const minP = searchParams.get('minPrice') || ''
    setMinPrice(minP)

    const maxP = searchParams.get('maxPrice') || ''
    setMaxPrice(maxP)

    const bodyT = searchParams.get('bodyType') || ''
    setSelectedBodyType(bodyT)
  }, [searchParams])

  const handleApplyFilters = () => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedBrand) params.set('brand', selectedBrand)
    if (selectedModel) params.set('model', selectedModel)
    if (selectedFuel) params.set('fuel', selectedFuel)
    if (minYear) params.set('minYear', minYear)
    if (maxYear) params.set('maxYear', maxYear)
    if (minPrice) params.set('minPrice', minPrice)
    if (maxPrice) params.set('maxPrice', maxPrice)
    if (selectedBodyType) params.set('bodyType', selectedBodyType)
    router.push(`/arama?${params.toString()}`)
  }

  const handleResetFilters = () => {
    setSelectedBrand('')
    setSelectedModel('')
    setSelectedFuel('')
    setMinYear('')
    setMaxYear('')
    setMinPrice('')
    setMaxPrice('')
    setSelectedBodyType('')
    setSearchQuery('')
    setSelectedCompareIds([])
    router.push('/arama')
  }

  // Filter Generations logic
  const filteredGenerations = mockGenerations.filter(gen => {
    const modelObj = mockModels.find(m => m.id === gen.model_id)
    if (selectedBrand && modelObj?.brand_id !== selectedBrand) return false
    if (selectedModel && gen.model_id !== selectedModel) return false
    
    if (selectedFuel) {
      const hasFuel = gen.engines.some(eng => eng.fuel.toLowerCase().includes(selectedFuel.toLowerCase()))
      if (!hasFuel) return false
    }

    const yearsArr = gen.years.split('-')
    const startYear = parseInt(yearsArr[0].trim())
    const endYear = yearsArr[1] ? parseInt(yearsArr[1].trim()) : new Date().getFullYear()

    if (minYear && startYear < parseInt(minYear)) return false
    if (maxYear && endYear > parseInt(maxYear)) return false

    // Budget range check (overlap test)
    const genMin = gen.min_price || 0
    const genMax = gen.max_price || 99999999
    if (minPrice && genMax < parseInt(minPrice)) return false
    if (maxPrice && genMin > parseInt(maxPrice)) return false

    // Body type check
    if (selectedBodyType && gen.body_type !== selectedBodyType) return false

    if (searchQuery) {
      const brandName = mockBrands.find(b => b.id === modelObj?.brand_id)?.name || ''
      const modelName = modelObj?.name || ''
      const fullTitle = `${brandName} ${modelName} ${gen.name}`.toLowerCase()
      if (!fullTitle.includes(searchQuery.toLowerCase())) return false
    }

    return true
  })

  const handleCompareCheckboxChange = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedCompareIds(prev => [...prev, id])
    } else {
      setSelectedCompareIds(prev => prev.filter(x => x !== id))
    }
  }

  const getGenAvgRating = (genId: string) => {
    const genReviews = mockReviews.filter(r => r.generation_id === genId)
    if (!genReviews.length) return '4.2'
    const total = genReviews.reduce((acc, r) => acc + (r.rating_engine + r.rating_gearbox + r.rating_electric + r.rating_fuel + r.rating_comfort + r.rating_parts + r.rating_mechanic) / 7, 0)
    return (total / genReviews.length).toFixed(1)
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow w-full max-w-max-width mx-auto px-margin-desktop py-8">
        {/* Breadcrumbs & Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <nav className="flex gap-2 text-caption text-on-surface-variant mb-2">
              <Link className="hover:underline" href="/">Ana Sayfa</Link>
              <span>/</span>
              <span className="text-primary font-semibold">Arama</span>
            </nav>
            <h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">
              {selectedModel 
                ? `${mockBrands.find(b => b.id === selectedBrand)?.name || ''} ${mockModels.find(m => m.id === selectedModel)?.name || ''} Sonuçları`
                : selectedBrand 
                  ? `${mockBrands.find(b => b.id === selectedBrand)?.name || ''} Modelleri`
                  : searchQuery 
                    ? `"${searchQuery}" Sonuçları`
                    : 'Arama Sonuçları'}
            </h1>
            <p className="text-on-surface-variant text-body-md">Toplam {filteredGenerations.length} kasa nesli listeleniyor</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-label-md text-on-surface-variant">Sıralama:</span>
            <select className="bg-white border border-border-low rounded-lg px-4 py-2 font-label-md text-on-surface focus:ring-2 focus:ring-secondary-container focus:border-transparent outline-none text-xs">
              <option>En Çok Oylanan</option>
              <option>En Yeni Kasa</option>
              <option>En Güvenilir</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* SideNavBar (Filter Sidebar) */}
          <aside className="hidden lg:flex flex-col p-4 gap-4 bg-surface-container-low dark:bg-primary-container h-fit w-[300px] sticky top-24 border border-border-low rounded-xl">
            <div className="flex justify-between items-center pb-2 border-b border-border-low">
              <div>
                <h2 className="font-title-md text-title-md text-primary font-bold">Detaylı Filtreler</h2>
                <p className="text-caption text-on-surface-variant">Aramayı daraltın</p>
              </div>
              <button onClick={handleResetFilters} className="text-xs text-muted hover:text-accent flex items-center gap-1">
                <RotateCcw className="h-3 w-3" /> Temizle
              </button>
            </div>

            <div className="space-y-4 mt-2">
              {/* Keyword Search */}
              <div>
                <label className="font-label-md text-primary mb-1 block text-xs">Kelime ile Ara</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-outline" />
                  <input
                    type="text"
                    placeholder="Örn: F30"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-border-low rounded p-2 pl-9 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Brand Select */}
              <div>
                <label className="font-label-md text-primary mb-1 block text-xs">Marka</label>
                <select 
                  value={selectedBrand} 
                  onChange={(e) => { setSelectedBrand(e.target.value); setSelectedModel(''); }}
                  className="w-full bg-white border border-border-low rounded p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Tümü</option>
                  {mockBrands.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>

              {/* Model Select */}
              <div>
                <label className="font-label-md text-primary mb-1 block text-xs">Model</label>
                <select 
                  value={selectedModel} 
                  onChange={(e) => setSelectedModel(e.target.value)}
                  className="w-full bg-white border border-border-low rounded p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  disabled={!selectedBrand}
                >
                  <option value="">Tümü</option>
                  {mockModels.filter(m => m.brand_id === selectedBrand).map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              {/* Year range */}
              <div>
                <label className="font-label-md text-primary mb-1 block text-xs">Yıl Aralığı</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={minYear} 
                    onChange={(e) => setMinYear(e.target.value)}
                    className="w-full bg-white border border-border-low rounded p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={maxYear} 
                    onChange={(e) => setMaxYear(e.target.value)}
                    className="w-full bg-white border border-border-low rounded p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="font-label-md text-primary mb-1 block text-xs">Bütçe Aralığı (TL)</label>
                <div className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Min TL" 
                    value={minPrice} 
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full bg-white border border-border-low rounded p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                  <input 
                    type="number" 
                    placeholder="Max TL" 
                    value={maxPrice} 
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full bg-white border border-border-low rounded p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Kasa Tipi */}
              <div>
                <label className="font-label-md text-primary mb-1 block text-xs">Kasa Tipi</label>
                <select 
                  value={selectedBodyType} 
                  onChange={(e) => setSelectedBodyType(e.target.value)}
                  className="w-full bg-white border border-border-low rounded p-2 text-xs outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="">Tümü</option>
                  <option value="Sedan">Sedan</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="SUV">SUV</option>
                  <option value="Coupe">Coupe</option>
                </select>
              </div>

              {/* Fuel Type */}
              <div>
                <label className="font-label-md text-primary mb-2 block text-xs">Yakıt Tipi</label>
                <div className="space-y-2">
                  {['Benzin', 'Dizel', 'Elektrik'].map(f => (
                    <label key={f} className="flex items-center gap-3 cursor-pointer group">
                      <input 
                        type="checkbox" 
                        checked={selectedFuel.toLowerCase() === f.toLowerCase()}
                        onChange={(e) => setSelectedFuel(e.target.checked ? f : '')}
                        className="w-4 h-4 rounded border-border-low text-primary focus:ring-primary" 
                      />
                      <span className="text-xs text-on-surface group-hover:text-primary transition-colors">{f}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={handleApplyFilters} className="w-full bg-primary text-on-primary py-3 rounded-lg font-label-md text-xs mt-4 hover:opacity-90 transition-all active:scale-[0.98]">
              Filtreleri Uygula
            </button>
          </aside>

          {/* Results Grid */}
          <section className="flex-1">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredGenerations.map((gen) => {
                const modelObj = mockModels.find(m => m.id === gen.model_id)
                const brand = mockBrands.find(b => b.id === modelObj?.brand_id)?.name || 'BMW'
                const model = modelObj?.name || '3 Serisi'
                const tags = getCardTags(gen.slug)
                const isSelected = selectedCompareIds.includes(gen.id)

                return (
                  <div key={gen.id} className="bg-white border border-border-low rounded-lg overflow-hidden flex flex-col group transition-all duration-200 hover:-translate-y-1 hover:shadow-md">
                    <div className="relative h-48 overflow-hidden bg-surface-gray">
                      <img 
                        alt={gen.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        src={getCarImage(gen.slug)}
                      />
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                        <span className="material-symbols-outlined text-trust-green text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                        <span className="text-xs font-bold text-on-surface">{getGenAvgRating(gen.id)}</span>
                      </div>
                    </div>
                    
                    <div className="p-4 flex-grow flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-title-md text-primary font-bold text-sm">{brand} {model} {gen.name}</h3>
                        <label className="flex items-center gap-1 cursor-pointer select-none">
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={(e) => handleCompareCheckboxChange(gen.id, e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-border-low text-primary focus:ring-0" 
                          />
                          <span className="text-caption text-on-surface-variant">Karşılaştır</span>
                        </label>
                      </div>
                      <p className="text-caption text-on-surface-variant mb-1">Üretim Yılları: {gen.years}</p>
                      {gen.min_price && gen.max_price && (
                        <p className="text-caption font-bold text-secondary-container mb-4">
                          Ortalama Piyasa: {(gen.min_price / 1000).toLocaleString('tr-TR')}k - {(gen.max_price / 1000).toLocaleString('tr-TR')}k TL
                        </p>
                      )}
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex flex-wrap gap-2">
                          {tags.map((t, idx) => (
                            <span 
                              key={idx} 
                              className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${t.type === 'warning' ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-on-primary-container border border-primary-container/10'}`}
                            >
                              <span className="material-symbols-outlined text-[12px]">{t.type === 'warning' ? 'warning' : 'check_circle'}</span>
                              {t.label}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-caption text-on-surface-variant">
                          <span className="material-symbols-outlined text-[16px]">forum</span>
                          <span>842 Topluluk Raporu</span>
                        </div>
                      </div>

                      <Link 
                        className="mt-auto w-full text-center border border-primary text-primary py-2 rounded font-label-md text-xs hover:bg-primary hover:text-on-primary transition-all duration-200 block"
                        href={`/arac/${mockModels.find(m => m.id === gen.model_id)?.brands?.slug || 'bmw'}/${mockModels.find(m => m.id === gen.model_id)?.slug || '3-series'}/${gen.slug}`}
                      >
                        Detaylı Raporu Gör
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Pagination Placeholder */}
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button className="w-10 h-10 flex items-center justify-center rounded border border-border-low hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button className="w-10 h-10 flex items-center justify-center rounded bg-primary text-on-primary font-bold">1</button>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-border-low hover:bg-surface-container-low transition-all">2</button>
                <span className="px-2 text-xs">...</span>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-border-low hover:bg-surface-container-low transition-all">12</button>
                <button className="w-10 h-10 flex items-center justify-center rounded border border-border-low hover:bg-surface-container-low transition-all">
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </nav>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Compare FAB (Contextual) */}
      <div 
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary-container text-on-primary-fixed-variant px-6 py-3 rounded-full shadow-lg flex items-center gap-4 transition-all duration-300 z-40 border border-white/10 ${selectedCompareIds.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-32 opacity-0'}`}
      >
        <span className="text-label-md text-white"><span className="font-bold text-secondary-container">{selectedCompareIds.length}</span> Araç Seçildi</span>
        <div className="h-4 w-[1px] bg-white/20"></div>
        <button 
          onClick={() => {
            router.push(`/ai-analiz?compare=${selectedCompareIds.join(',')}`)
          }}
          className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full font-label-md hover:scale-105 active:scale-95 transition-all text-xs"
        >
          Şimdi Karşılaştır
        </button>
        <button className="p-1 hover:bg-white/10 rounded-full text-white" onClick={() => setSelectedCompareIds([])}>
          <span className="material-symbols-outlined text-[18px]">close</span>
        </button>
      </div>
    </>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-container"></div>
      </div>
    }>
      <SearchContent />
    </Suspense>
  )
}
