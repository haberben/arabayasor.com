export interface SparePartItem {
  name: string
  oemPrice: string
  aftermarketPrice: string
  laborCost: string
  difficulty: 'Kolay' | 'Orta' | 'Zor'
}

export interface GenPartsData {
  items: SparePartItem[]
  generalNotes: string
}

export const mockPartsData: { [key: string]: GenPartsData } = {
  // E90
  'e90': {
    items: [
      { name: 'Periyodik Bakım Seti (Yağ + Filtreler)', oemPrice: '4.500 TL', aftermarketPrice: '2.500 TL', laborCost: '800 TL', difficulty: 'Kolay' },
      { name: 'Ön Fren Balatası Seti', oemPrice: '2.800 TL', aftermarketPrice: '1.400 TL', laborCost: '600 TL', difficulty: 'Kolay' },
      { name: 'Eksantrik Zincir Seti (Ağır Bakım)', oemPrice: '22.000 TL', aftermarketPrice: '12.500 TL', laborCost: '8.000 TL', difficulty: 'Zor' },
      { name: 'Debriyaj / Volan Seti (Manuel)', oemPrice: '18.000 TL', aftermarketPrice: '10.500 TL', laborCost: '4.000 TL', difficulty: 'Zor' },
      { name: 'Ön Amortisör (Adet)', oemPrice: '5.200 TL', aftermarketPrice: '2.800 TL', laborCost: '1.200 TL', difficulty: 'Orta' },
      { name: 'Subap Lastikleri Seti (Yağ Yakma Çözümü)', oemPrice: '6.000 TL', aftermarketPrice: '3.200 TL', laborCost: '6.500 TL', difficulty: 'Zor' }
    ],
    generalNotes: 'N47 motorlu 320d modellerinde zincir değişimi sırasında motorun indirildiği göz önüne alınarak işçilik maliyeti artabilir. N46 atmosferik motorlarda yağ eksiltme için subap lastikleri değişirken kapak açılmadan değişim yapabilen ustalar tercih edilirse maliyet düşer.'
  },
  // F30
  'f30': {
    items: [
      { name: 'Periyodik Bakım Seti (Yağ + Filtreler)', oemPrice: '5.200 TL', aftermarketPrice: '2.900 TL', laborCost: '900 TL', difficulty: 'Kolay' },
      { name: 'Ön Fren Balatası Seti', oemPrice: '3.200 TL', aftermarketPrice: '1.700 TL', laborCost: '650 TL', difficulty: 'Kolay' },
      { name: 'N13 Devirdaim & Termostat Seti', oemPrice: '9.500 TL', aftermarketPrice: '5.800 TL', laborCost: '2.000 TL', difficulty: 'Orta' },
      { name: 'Eksantrik Zincir Seti (N13)', oemPrice: '18.500 TL', aftermarketPrice: '9.800 TL', laborCost: '6.500 TL', difficulty: 'Zor' },
      { name: 'ZF 8 Şanzıman Yağı & Karter Filtre Seti', oemPrice: '14.500 TL', aftermarketPrice: '8.500 TL', laborCost: '2.500 TL', difficulty: 'Orta' },
      { name: 'Ön Amortisör (Adet)', oemPrice: '6.500 TL', aftermarketPrice: '3.500 TL', laborCost: '1.400 TL', difficulty: 'Orta' }
    ],
    generalNotes: 'ZF şanzıman karteri plastik olup filtre ile bütündür, bu yüzden şanzıman yağı değişiminde karter mutlaka değişmelidir. Turbo yağ boruları ve genleşme kapları oem alınmalıdır.'
  },
  // W204
  'w204': {
    items: [
      { name: 'Periyodik Bakım Seti (Yağ + Filtreler)', oemPrice: '5.800 TL', aftermarketPrice: '3.200 TL', laborCost: '1.000 TL', difficulty: 'Kolay' },
      { name: 'Ön Fren Balatası Seti', oemPrice: '3.800 TL', aftermarketPrice: '1.950 TL', laborCost: '700 TL', difficulty: 'Kolay' },
      { name: 'Eksantrik Zincir Seti (M271)', oemPrice: '26.000 TL', aftermarketPrice: '14.000 TL', laborCost: '7.500 TL', difficulty: 'Zor' },
      { name: 'M271 Eksantrik Dişlileri (Kam Milleri - Adet)', oemPrice: '18.000 TL', aftermarketPrice: '9.000 TL', laborCost: '4.000 TL', difficulty: 'Zor' },
      { name: 'Şanzıman Türbin Revizyonu', oemPrice: '35.000 TL', aftermarketPrice: '18.500 TL', laborCost: '6.000 TL', difficulty: 'Zor' },
      { name: 'Ön Amortisör (Adet)', oemPrice: '7.800 TL', aftermarketPrice: '4.200 TL', laborCost: '1.500 TL', difficulty: 'Orta' }
    ],
    generalNotes: 'M271 motorların eksantrik dişlilerinde kesinlikle orijinal (OEM) parça tercih edilmelidir. Yan sanayi dişliler kısa sürede sente atlatarak motora ağır hasar verebilir.'
  },
  // Audi B8 A4
  'b8': {
    items: [
      { name: 'Periyodik Bakım Seti (Yağ + Filtreler)', oemPrice: '5.000 TL', aftermarketPrice: '2.800 TL', laborCost: '900 TL', difficulty: 'Kolay' },
      { name: 'Ön Fren Balatası Seti', oemPrice: '3.400 TL', aftermarketPrice: '1.650 TL', laborCost: '650 TL', difficulty: 'Kolay' },
      { name: 'TFSI Triger Zincir Seti', oemPrice: '21.000 TL', aftermarketPrice: '11.500 TL', laborCost: '7.000 TL', difficulty: 'Zor' },
      { name: 'Multitronic Kavrama Seti', oemPrice: '24.000 TL', aftermarketPrice: '13.500 TL', laborCost: '5.000 TL', difficulty: 'Zor' },
      { name: 'Ön Amortisör (Adet)', oemPrice: '6.800 TL', aftermarketPrice: '3.600 TL', laborCost: '1.300 TL', difficulty: 'Orta' },
      { name: 'Turbo Revizyonu', oemPrice: '22.000 TL', aftermarketPrice: '11.000 TL', laborCost: '4.500 TL', difficulty: 'Zor' }
    ],
    generalNotes: 'TFSI motorların yağ yakma revizyonunda piston ve segman grubu tamamen yenilenmelidir. Bu revizyon işçilik dahil yaklaşık 90.000 TL - 120.000 TL arası tutabilmektedir.'
  },
  // Corolla E160
  'e160': {
    items: [
      { name: 'Periyodik Bakım Seti (Yağ + Filtreler)', oemPrice: '3.200 TL', aftermarketPrice: '1.800 TL', laborCost: '700 TL', difficulty: 'Kolay' },
      { name: 'Ön Fren Balatası Seti', oemPrice: '1.950 TL', aftermarketPrice: '1.100 TL', laborCost: '500 TL', difficulty: 'Kolay' },
      { name: 'MultiMode Debriyaj / Baskı Balata Seti', oemPrice: '11.500 TL', aftermarketPrice: '6.200 TL', laborCost: '3.500 TL', difficulty: 'Zor' },
      { name: 'Triger Zincir Seti', oemPrice: '12.000 TL', aftermarketPrice: '6.800 TL', laborCost: '5.000 TL', difficulty: 'Zor' },
      { name: 'Ön Amortisör (Adet)', oemPrice: '3.800 TL', aftermarketPrice: '2.100 TL', laborCost: '1.000 TL', difficulty: 'Orta' },
      { name: 'Su Pompası (Devirdaim)', oemPrice: '4.200 TL', aftermarketPrice: '2.400 TL', laborCost: '1.200 TL', difficulty: 'Orta' }
    ],
    generalNotes: 'MultiMode şanzıman debriyaj değişiminden sonra şanzıman beyninin mutlaka orijinal cihazla kalibre (adaptasyon) edilmesi gerekir. Aksi halde vites geçişleri sarsıntılı kalacaktır.'
  },
  // Megane 4
  'megane-4': {
    items: [
      { name: 'Periyodik Bakım Seti (Yağ + Filtreler)', oemPrice: '3.500 TL', aftermarketPrice: '1.950 TL', laborCost: '700 TL', difficulty: 'Kolay' },
      { name: 'Ön Fren Balatası Seti', oemPrice: '2.200 TL', aftermarketPrice: '1.150 TL', laborCost: '500 TL', difficulty: 'Kolay' },
      { name: '1.5 dCi Triger Seti (Ağır Bakım Kayış)', oemPrice: '8.500 TL', aftermarketPrice: '4.800 TL', laborCost: '3.000 TL', difficulty: 'Orta' },
      { name: 'EDC Çift Kavrama Debriyaj Seti', oemPrice: '28.000 TL', aftermarketPrice: '16.500 TL', laborCost: '5.500 TL', difficulty: 'Zor' },
      { name: 'EDC Şanzıman Beyni (Beyin Değişimi)', oemPrice: '38.000 TL', aftermarketPrice: '22.000 TL', laborCost: '3.000 TL', difficulty: 'Zor' },
      { name: 'Ön Amortisör (Adet)', oemPrice: '4.400 TL', aftermarketPrice: '2.400 TL', laborCost: '1.100 TL', difficulty: 'Orta' }
    ],
    generalNotes: 'EDC şanzımanın kavraması değişirken mutlaka şanzıman keçeleri de yağ sızıntısı riskine karşı yenilenmelidir. dCi motorlarda triger seti değişimi 4 yıl veya 80.000 km aralığındadır.'
  },
  // Clio 4
  'clio-4': {
    items: [
      { name: 'Periyodik Bakım Seti (Yağ + Filtreler)', oemPrice: '3.100 TL', aftermarketPrice: '1.750 TL', laborCost: '650 TL', difficulty: 'Kolay' },
      { name: 'Ön Fren Balatası Seti', oemPrice: '1.800 TL', aftermarketPrice: '950 TL', laborCost: '450 TL', difficulty: 'Kolay' },
      { name: 'Triger Kayış Seti & Devirdaim (dCi)', oemPrice: '7.800 TL', aftermarketPrice: '4.200 TL', laborCost: '2.800 TL', difficulty: 'Orta' },
      { name: 'Debriyaj Baskı Balata Seti (Manuel)', oemPrice: '8.500 TL', aftermarketPrice: '4.600 TL', laborCost: '2.500 TL', difficulty: 'Zor' },
      { name: 'Ön Amortisör (Adet)', oemPrice: '3.900 TL', aftermarketPrice: '1.950 TL', laborCost: '950 TL', difficulty: 'Orta' },
      { name: 'Salıncak & Z Rot Ön Takım Takımı', oemPrice: '4.200 TL', aftermarketPrice: '2.200 TL', laborCost: '1.200 TL', difficulty: 'Orta' }
    ],
    generalNotes: 'Clio 4 ön takım elemanları (z-rotlar, burçlar) kasisli yollarda çabuk yorulabilir. Yan sanayi parçaları oldukça ekonomik ve kolay bulunabilirdir.'
  }
}

// Fallback helper to retrieve parts data based on generation slug
export function getSparePartsByGen(slug: string): GenPartsData {
  const normalized = slug.toLowerCase()
  return mockPartsData[normalized] || {
    items: [
      { name: 'Periyodik Bakım Seti (Yağ + Filtreler)', oemPrice: '3.500 TL', aftermarketPrice: '1.900 TL', laborCost: '700 TL', difficulty: 'Kolay' },
      { name: 'Ön Fren Balatası Seti', oemPrice: '2.200 TL', aftermarketPrice: '1.200 TL', laborCost: '500 TL', difficulty: 'Kolay' },
      { name: 'Ağır Bakım (Triger / Zincir Seti)', oemPrice: '15.000 TL', aftermarketPrice: '8.500 TL', laborCost: '5.000 TL', difficulty: 'Zor' },
      { name: 'Debriyaj / Kavrama Seti', oemPrice: '18.000 TL', aftermarketPrice: '10.000 TL', laborCost: '4.000 TL', difficulty: 'Zor' },
      { name: 'Ön Amortisör (Adet)', oemPrice: '4.500 TL', aftermarketPrice: '2.500 TL', laborCost: '1.000 TL', difficulty: 'Orta' }
    ],
    generalNotes: 'Araç yedek parçalarında kritik parçalar için orijinal (OEM), ön takım gibi aşınabilir elemanlarda kaliteli yan sanayi markalar (Lemförder, Sachs, Bosch) tercih edilebilir.'
  }
}
