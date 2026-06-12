import { Brand, Model, Generation, Review, ProblemReport, Comment, Profile } from '@/types/database'

export const mockBrands: Brand[] = [
  { id: '1', name: 'BMW', slug: 'bmw', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/4/44/BMW.svg', created_at: '' },
  { id: '2', name: 'Mercedes-Benz', slug: 'mercedes-benz', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/90/Mercedes-Benz_logo.svg', created_at: '' },
  { id: '3', name: 'Audi', slug: 'audi', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/Audi-Logo_2016.svg', created_at: '' },
  { id: '4', name: 'Toyota', slug: 'toyota', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Toyota_EU.svg', created_at: '' },
  { id: '5', name: 'Renault', slug: 'renault', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/b/b3/Renault_2021.svg', created_at: '' }
]

export const mockModels: Model[] = [
  { id: '101', brand_id: '1', name: '3 Serisi', slug: '3-series', created_at: '' },
  { id: '102', brand_id: '1', name: '5 Serisi', slug: '5-series', created_at: '' },
  { id: '201', brand_id: '2', name: 'C Serisi', slug: 'c-class', created_at: '' },
  { id: '202', brand_id: '2', name: 'E Serisi', slug: 'e-class', created_at: '' },
  { id: '301', brand_id: '3', name: 'A4', slug: 'a4', created_at: '' },
  { id: '302', brand_id: '3', name: 'A6', slug: 'a6', created_at: '' },
  { id: '401', brand_id: '4', name: 'Corolla', slug: 'corolla', created_at: '' },
  { id: '501', brand_id: '5', name: 'Megane', slug: 'megane', created_at: '' }
]

export const mockGenerations: Generation[] = [
  {
    id: '1001',
    model_id: '101',
    name: 'E90',
    slug: 'e90',
    years: '2005 - 2013',
    engines: [
      { name: '320i (2.0L 150hp Atmosferik Benzin)', fuel: 'Benzin', consumption: '7.9L/100km' },
      { name: '320d (2.0L 177hp Turbo Dizel)', fuel: 'Dizel', consumption: '5.7L/100km' },
      { name: '325i (2.5L 218hp Atmosferik Benzin)', fuel: 'Benzin', consumption: '8.4L/100km' }
    ],
    buying_guide: `### E90 Alırken Dikkat Edilmesi Gerekenler
* **N46 Motor Yağ Yakma Problemi**: 320i modellerinde kullanılan N46 motoru, subap lastiklerinin sertleşmesi sonucu yağ yakmaya (egzozdan duman atmaya) meyillidir. Subap lastikleri yenilenmelidir.
* **N47 Zincir Sesi**: 320d (177hp/184hp) modellerinde zincir ömrü kısadır. Motorun arka kısmından gelen sürtünme sesi zincir değişim zamanını gösterir. Geciktirilirse motor yer.
* **İç Mekan Soyulmaları**: Kapı kolları, cam açma butonları kaplamaları zamanla çirkin bir şekilde soyulabilir.
* **Direksiyon Kilidi (ELV)**: Sarı veya kırmızı direksiyon kilidi uyarısı verdiğinde araç marş basmaz. Kilidin tamiri ya da iptali gerekebilir.`,
    created_at: '',
    models: { id: '101', brand_id: '1', name: '3 Serisi', slug: '3-series', created_at: '', brands: mockBrands[0] }
  },
  {
    id: '1002',
    model_id: '101',
    name: 'F30',
    slug: 'f30',
    years: '2012 - 2019',
    engines: [
      { name: '316i (1.6L 136hp Turbo Benzin - N13)', fuel: 'Benzin', consumption: '5.9L/100km' },
      { name: '320d (2.0L 184hp/190hp Turbo Dizel)', fuel: 'Dizel', consumption: '4.5L/100km' },
      { name: '320i ED (1.6L 170hp Turbo Benzin - N13)', fuel: 'Benzin', consumption: '5.4L/100km' }
    ],
    buying_guide: `### F30 Alırken Dikkat Edilmesi Gerekenler
* **N13 Soğutma Suyu Kaçakları**: Genleşme kabı geri dönüş hortumu, termostat gövdesi ve devirdaim flanşları çok kolay gevşeyip su kaçırır. Antifriz seviyesi sürekli kontrol edilmelidir.
* **N13 Turbo Yağlama Borusu**: Turbo milini yağlayan boru tıkanıp turbo arızasına sebep olabilir. Mavi duman atıyorsa turbo kontrol edilmelidir.
* **Direksiyon Tıkırtısı**: Direksiyon kutusundaki boşluktan ötürü parke yollarda veya bozuk yollarda lok lok tıkırtı sesi kroniktir. Tamir kitleri ile çözülür.`,
    created_at: '',
    models: { id: '101', brand_id: '1', name: '3 Serisi', slug: '3-series', created_at: '', brands: mockBrands[0] }
  },
  {
    id: '2001',
    model_id: '201',
    name: 'W204',
    slug: 'w204',
    years: '2007 - 2014',
    engines: [
      { name: 'C180 Kompressor (1.6L 156hp M271)', fuel: 'Benzin/LPG', consumption: '7.5L/100km' },
      { name: 'C180 CGI (1.8L 156hp Turbo Benzin)', fuel: 'Benzin', consumption: '6.9L/100km' },
      { name: 'C220 CDI (2.2L 170hp Turbo Dizel)', fuel: 'Dizel', consumption: '5.8L/100km' }
    ],
    buying_guide: `### W204 Alırken Dikkat Edilmesi Gerekenler
* **Eksantrik Dişlileri ve Zincir**: M271 motorlarında zincir uzaması ve eksantrik vanos dişlilerinin aşınması kroniktir. Soğuk çalıştırmada 2-3 saniye süren hırıltılı zincir sesi duyulduğunda hemen değiştirilmelidir.
* **Arka Taşıyıcı Paslanması**: Alt taşıyıcı travers (subframe) zamanla paslanıp çatlayabilir veya kırılabilir. Güvenlik riski taşır, yetkili servislerde ücretsiz değişim kampanyası vardır.
* **Kilit Motoru (ESL)**: Direksiyon kilidi motorunun bozulması sonucu anahtar yuvada döner ama göstergeye elektrik gelmez. Elektronik emülatör takılarak çözülür.`,
    created_at: '',
    models: { id: '201', brand_id: '2', name: 'C Serisi', slug: 'c-class', created_at: '', brands: mockBrands[1] }
  },
  {
    id: '4001',
    model_id: '401',
    name: 'E160 (11. Nesil)',
    slug: 'e160',
    years: '2012 - 2019',
    engines: [
      { name: '1.33 Dual VVT-i (99hp Atmosferik)', fuel: 'Benzin/LPG', consumption: '5.6L/100km' },
      { name: '1.6 Valvematic (132hp Atmosferik)', fuel: 'Benzin/LPG', consumption: '6.3L/100km' },
      { name: '1.4 D-4D (90hp Turbo Dizel)', fuel: 'Dizel', consumption: '4.1L/100km' }
    ],
    buying_guide: `### Corolla E160 Alırken Dikkat Edilmesi Gerekenler
* **MultiMode Yarı Otomatik Şanzıman**: Dizel modellerde sunulan yarı otomatik şanzıman, debriyaj aktüatörü ve beyni nedeniyle trafikte çabuk ısınır. "N" konumuna alıp dinlendirmek gerekir, yoksa şanzıman arıza lambası yakar.
* **Yol Sesi**: Toyota Corolla'nın bu neslinde davlumbaz içi ve taban ses yalıtımı zayıftır. 110 km/s hızın üzerinde tekerlek ve rüzgar sesi içeriye fazlaca sızar.
* **Direksiyon Mafsalı**: Yavaş hızlarda bozuk yolda direksiyonda hafif boşluk hissi ve tıkırtı hissi verebilir.`,
    created_at: '',
    models: { id: '401', brand_id: '4', name: 'Corolla', slug: 'corolla', created_at: '', brands: mockBrands[3] }
  }
]

export const mockProfiles: Profile[] = [
  { id: 'u1', username: 'mehmet_usta', full_name: 'Mehmet Demir', avatar_url: '', role: 'Master Usta', xp: 1250, created_at: '' },
  { id: 'u2', username: 'f30_sevdalisi', full_name: 'Caner Aydın', avatar_url: '', role: 'Uzman Kullanıcı', xp: 480, created_at: '' },
  { id: 'u3', username: 'car_geek', full_name: 'Bora Yılmaz', avatar_url: '', role: 'Aktif Üye', xp: 210, created_at: '' },
  { id: 'u4', username: 'toyotaci_hasan', full_name: 'Hasan Ak', avatar_url: '', role: 'Usta', xp: 850, created_at: '' }
]

export const mockReviews: Review[] = [
  {
    id: 'r1',
    generation_id: '1002',
    user_id: 'u2',
    rating_engine: 4,
    rating_gearbox: 5,
    rating_electric: 3,
    rating_fuel: 4,
    rating_comfort: 4,
    rating_parts: 3,
    rating_mechanic: 5,
    content: 'F30 LCI (makyajlı) 320d modelini 3 yıldır kullanıyorum. ZF 8 ileri şanzımanı adeta bir sanat eseri, geçişleri hiç hissettirmiyor. Motorun performansı ve yakıtı çok iyi, ancak direksiyon kutusu tıkırtısı ve soğutma suyu hortumlarındaki kaçaklar can sıkabiliyor. Alacaklar mutlaka su tesisatını kontrol ettirsin.',
    created_at: '2026-05-10T12:00:00Z',
    profiles: mockProfiles[1],
    comments_count: 2
  },
  {
    id: 'r2',
    generation_id: '1001',
    user_id: 'u1',
    rating_engine: 3,
    rating_gearbox: 4,
    rating_electric: 3,
    rating_fuel: 4,
    rating_comfort: 3,
    rating_parts: 4,
    rating_mechanic: 5,
    content: 'BMW E90 320d döküm blok M47 motorlar zincir sesi yapmaz ama 2007 sonrası N47 motorlarda zincir arkadadır ve ses yaparsa motorun inmesi gerekir. Alırken sabah soğuk çalıştırmada gelen şırıldama sesini dinleyin. Konforu fena değil ama iç trimler soyuluyor.',
    created_at: '2026-06-01T15:30:00Z',
    profiles: mockProfiles[0],
    comments_count: 1
  },
  {
    id: 'r3',
    generation_id: '2001',
    user_id: 'u3',
    rating_engine: 4,
    rating_gearbox: 4,
    rating_electric: 4,
    rating_fuel: 3,
    rating_comfort: 5,
    rating_parts: 3,
    rating_mechanic: 4,
    content: 'W204 C180 Kompressor sahibiyim. Tam bir Mercedes konforu var. Yol tutuşu ve ağırlığı güven veriyor. Yakıt tüketimi şehir içi 10 litrenin altına zor iniyor. Eksantrik dişlileri (kam milleri) bozulursa 60-70 bin TL masraf açabilir, alırken mutlaka ekspertizde kontrol edilmeli.',
    created_at: '2026-06-05T09:15:00Z',
    profiles: mockProfiles[2],
    comments_count: 0
  }
]

export const mockProblemReports: ProblemReport[] = [
  { id: 'p1', generation_id: '1001', title: 'N47 Eksantrik Zincir Sesi', description: 'N47 motorlu 320d modellerinde zincirin esneyip sürtünmesi ve kopma riski oluşturması.', created_at: '', yes_votes: 45, no_votes: 12 },
  { id: 'p2', generation_id: '1001', title: 'Valvetronic Yağ Yakma', description: 'Atmosferik 320i motorlarında subap lastiklerinin ömrünü tamamlayarak yağ sızdırması.', created_at: '', yes_votes: 32, no_votes: 5 },
  { id: 'p3', generation_id: '1002', title: 'N13 Su Flanşları Kaçağı', description: '1.6 turbo benzinli modellerde plastik su borularının aşırı sıcaklık nedeniyle gevreyip çatlaması.', created_at: '', yes_votes: 58, no_votes: 18 },
  { id: 'p4', generation_id: '1002', title: 'Direksiyon Kutusu Tıkırtısı', description: 'Parke taşlı yollarda direksiyon milinden gelen rahatsız edici ses.', created_at: '', yes_votes: 42, no_votes: 22 },
  { id: 'p5', generation_id: '2001', title: 'Eksantrik Dişlileri Aşınması', description: 'M271 Kompressör motorlarda eksantrik dişlisinin aşınarak soğuk startta ses yapması.', created_at: '', yes_votes: 38, no_votes: 9 }
]

export const mockComments: Comment[] = [
  {
    id: 'c1',
    review_id: 'r1',
    user_id: 'u1',
    content: 'Çok haklısınız Caner bey. ZF8 şanzımanın yağı 80-100 bin km aralığında mutlaka orijinal ZF yağıyla değişmelidir. İhmal edilirse vuruntu yapmaya başlar.',
    is_pinned: true,
    likes: 15,
    dislikes: 1,
    created_at: '2026-05-11T08:00:00Z',
    profiles: mockProfiles[0]
  },
  {
    id: 'c2',
    review_id: 'r1',
    user_id: 'u3',
    content: 'Su kaçakları için alüminyum flanş yedek parçaları satılıyor, alırken onlarla değiştirmek kalıcı çözüm oluyor.',
    is_pinned: false,
    likes: 6,
    dislikes: 0,
    created_at: '2026-05-12T14:20:00Z',
    profiles: mockProfiles[2]
  },
  {
    id: 'c3',
    review_id: 'r2',
    user_id: 'u4',
    content: 'Aynen usta, döküm blok motorlar ses yapmıyor ama LCI F30 motoru gibi sessiz de çalışmıyor. Tercih meselesi.',
    is_pinned: false,
    likes: 8,
    dislikes: 2,
    created_at: '2026-06-02T10:10:00Z',
    profiles: mockProfiles[3]
  }
]
