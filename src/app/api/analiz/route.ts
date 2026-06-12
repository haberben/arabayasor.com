import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { mockGenerations, mockProblemReports } from '@/lib/mock-data'

export async function POST(req: Request) {
  try {
    const { url, manualBrand, manualModel, manualYear } = await req.json()

    if (!url) {
      return NextResponse.json({ error: 'Lütfen geçerli bir ilan linki girin.' }, { status: 400 })
    }

    // 1. URL'den veya manuel girişten marka/model/yıl tespiti yap
    let brand = (manualBrand || '').trim()
    let model = (manualModel || '').trim()
    let year = (manualYear || '').trim()

    const urlLower = url.toLowerCase()
    
    // URL Analizi (Basit filtreleme)
    if (!brand) {
      if (urlLower.includes('bmw')) brand = 'BMW'
      else if (urlLower.includes('mercedes')) brand = 'Mercedes-Benz'
      else if (urlLower.includes('audi')) brand = 'Audi'
      else if (urlLower.includes('toyota')) brand = 'Toyota'
      else if (urlLower.includes('renault')) brand = 'Renault'
      else brand = 'Belirlenemedi'
    }

    if (!model) {
      if (urlLower.includes('3-series') || urlLower.includes('3-serisi') || urlLower.includes('320d') || urlLower.includes('320i') || urlLower.includes('f30') || urlLower.includes('e90')) {
        model = '3 Serisi'
      } else if (urlLower.includes('5-series') || urlLower.includes('5-serisi') || urlLower.includes('520d') || urlLower.includes('f10')) {
        model = '5 Serisi'
      } else if (urlLower.includes('c-class') || urlLower.includes('c-serisi') || urlLower.includes('w204') || urlLower.includes('c180')) {
        model = 'C Serisi'
      } else if (urlLower.includes('corolla')) {
        model = 'Corolla'
      } else if (urlLower.includes('megane')) {
        model = 'Megane'
      } else {
        model = 'Genel Model'
      }
    }

    // Kasa oylama verilerini al
    let matchedGen = mockGenerations[1] // Varsayılan F30 verelim
    if (urlLower.includes('e90')) matchedGen = mockGenerations[0]
    else if (urlLower.includes('w204')) matchedGen = mockGenerations[2]
    else if (urlLower.includes('e160') || urlLower.includes('corolla')) matchedGen = mockGenerations[3]
    else if (brand === 'BMW' && model === '3 Serisi') matchedGen = mockGenerations[1] // F30 default

    const localProblems = mockProblemReports.filter(p => p.generation_id === matchedGen.id)
    const problemsSummary = localProblems.map(p => `* ${p.title}: ${p.description}`).join('\n')

    // 2. Gemini API Anahtarı kontrolü
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const modelAI = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

        const prompt = `
          Aşağıdaki otomobil ilanı linkine göre aracı analiz et ve Türkçe detaylı bir rapor oluştur.
          İlan URL: ${url}
          Kullanıcı Tarafından Belirtilenler (Varsa): Marka: ${brand}, Model: ${model}, Yıl: ${year}
          Sistem Veritabanımızda Eşleşen Kasa Bilgisi: ${matchedGen.models?.brands?.name} ${matchedGen.models?.name} ${matchedGen.name} (${matchedGen.years})
          Veritabanımızdaki Kronik Sorunlar: 
          ${problemsSummary || 'Kayıtlı sorun bulunmuyor.'}

          Lütfen şu başlıklar altında yanıt ver (Markdown formatında):
          ### 1. Araç ve Motor Analizi
          (Aracın beyan edilen motor ve şanzıman özelliklerinin kısa teknik özeti.)
          
          ### 2. Kritik Kronik Sorunlar
          (Bu kasa modelinde kesinlikle bilinmesi gereken kronik problemler nelerdir? Listele.)
          
          ### 3. Ekspertizde Bakılması Gerekenler
          (Alıcının aracı ekspertize götürdüğünde özellikle kontrol ettirmesi gereken yerler/parçalar nelerdir?)
          
          ### 4. Satın Alma Kararı & Tavsiye (Trafik Işığı Raporu)
          (Alıcı için nihai özet. Yeşil Işık: Sıkıntısız, Sarı Işık: Dikkatli Olunmalı, Kırmızı Işık: Kronik Riskli. Sebebini açıkla.)
        `

        const result = await modelAI.generateContent(prompt)
        const text = result.response.text()

        return NextResponse.json({
          detectedBrand: brand,
          detectedModel: model,
          detectedGeneration: matchedGen.name,
          analysis: text,
          isMock: false
        })
      } catch (geminiError: any) {
        console.error('Gemini API call failed, falling back to local analysis:', geminiError)
      }
    }

    // 3. MOCK / YEREL ANALİZ FALLBACK
    const mockAnalysis = `
### 1. Araç ve Motor Analizi
Sistemimiz girilen ilandan aracın **${matchedGen.models?.brands?.name} ${matchedGen.models?.name} ${matchedGen.name}** (${matchedGen.years}) kasa yapısında olduğunu tespit etti.
* **Yakıt Tüketim Standardı**: Ortalama tüketim değerleri motor seçeneğine bağlı olarak **4.5L - 7.9L/100km** arasında değişmektedir.
* **Şanzıman Karakteristiği**: Bu kasadaki otomatik şanzıman tipleri genel olarak dayanıklı olsa da düzenli yağ bakımı yapılmadığında basınç kayıplarına ve vuruntulara yol açabilir.

### 2. Kritik Kronik Sorunlar
Veritabanımıza göre bu kasa kodunda oylanan ve kesinleşen kronik sorunlar:
${localProblems.map(p => `* **${p.title}**: ${p.description}`).join('\n')}

### 3. Ekspertizde Bakılması Gerekenler
Bu aracı satın almadan önce ekspertizde özellikle şu bölümlere baktırmanızı tavsiye ederiz:
${matchedGen.buying_guide?.split('\n').filter(line => line.startsWith('*') || line.includes('###')).join('\n') || '* Detaylı motor kompresyon testi yaptırın.'}

### 4. Satın Alma Kararı & Tavsiye (Trafik Işığı Raporu)
* **Durum**: 🟡 **SARI IŞIK (Dikkatli Olunmalı)**
* **Gerekçe**: Araç performans ve piyasa gücü olarak son derece caziptir. Ancak yukarıda belirtilen kronik su tesisatı kaçakları veya zincir sesi risklerine karşı yetkili bir usta tarafından kontrol edilmelidir. Ekspertiz onayı alındığı takdirde satın alınabilir.
    `

    // Yapay gecikme
    await new Promise(resolve => setTimeout(resolve, 1500))

    return NextResponse.json({
      detectedBrand: matchedGen.models?.brands?.name || brand,
      detectedModel: matchedGen.models?.name || model,
      detectedGeneration: matchedGen.name,
      analysis: mockAnalysis,
      isMock: true
    })

  } catch (err: any) {
    console.error('Analysis endpoint error:', err)
    return NextResponse.json({ error: err.message || 'Sunucu hatası oluştu.' }, { status: 500 })
  }
}
