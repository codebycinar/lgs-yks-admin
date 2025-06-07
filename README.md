# LGS/YKS Admin Panel

LGS ve YKS Eğitim Platformu Yönetim Paneli

## 🚀 Teknoloji Stack

- **React 18** - Frontend framework
- **TypeScript** - Type safety
- **Material-UI** - UI component library
- **Recharts** - Chart library
- **React Router** - Navigation
- **Axios** - HTTP client

## ✨ Özellikler

- ✅ Admin kimlik doğrulama
- ✅ Dashboard ile istatistikler ve grafikler
- ✅ Kullanıcı yönetimi (listeleme, arama, detay görüntüleme)
- ✅ İçerik yönetimi (sınavlar, sınıflar, dersler, konular)
- ✅ Soru havuzu yönetimi (CRUD, dosya yükleme)
- ✅ Responsive tasarım
- ✅ Dark/Light theme desteği

## 🛠 Kurulum

```bash
# Dependencies install
npm install

# Development server başlat
npm start

# Production build
npm run build

# Tests çalıştır
npm test
```

## 📊 Dashboard Özellikleri

- Kullanıcı, soru, konu, program sayıları
- Ders bazında konu ve soru dağılım grafikleri
- Son kayıtlı kullanıcılar listesi
- Pie chart ile genel dağılım
- Real-time istatistikler

## 👥 Kullanıcı Yönetimi

- Kullanıcıları listeleme ve arama
- Pagination ile sayfalama
- Kullanıcı detay modalı
- Aktivite istatistikleri
- Export işlemleri

## 📚 İçerik Yönetimi

### Sınavlar
- LGS, YKS gibi sınavları yönetme
- Hedef ve hazırlık sınıf seviyeleri
- Sınav tarihleri

### Sınıflar
- Sınıf seviyeleri (5, 6, 7, 8)
- Sınav ilişkilendirme

### Dersler
- Matematik, Türkçe, Fen Bilimleri vb.
- Sıralama ve aktiflik durumu

### Konular
- Hiyerarşik konu yapısı
- Alt konu desteği
- Ders ve sınıf ilişkilendirme

## 📝 Soru Yönetimi

- Konu bazında soru ekleme
- Görsel ve PDF dosya yükleme
- Zorluk seviyesi (Kolay, Orta, Zor)
- Soru filtreleme ve arama
- Toplu işlemler

## 🎨 UI/UX

- Material Design 3 uyumlu
- Responsive layout
- Loading states
- Error handling
- Toast notifications
- Modal dialog'lar

## 🔧 Konfigürasyon

`.env` dosyası örneği:

```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_UPLOAD_URL=http://localhost:3000/uploads
```

## 📁 Proje Yapısı

```
src/
├── components/     # Reusable components
├── pages/         # Route pages
├── services/      # API services
├── contexts/      # React contexts
├── types/         # TypeScript types
├── config/        # Configuration files
└── utils/         # Helper functions
```

## 🧪 Test

```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Coverage report
npm run coverage
```

## 📦 Build & Deploy

```bash
# Production build
npm run build

# Preview production build
npm run preview

# Deploy to Netlify/Vercel
npm run deploy
```

## 🔐 Authentication

Admin paneli JWT tabanlı authentication kullanır:

- Email/password ile giriş
- Token otomatik yenileme
- Protected routes
- Session management

## 👨‍💻 Geliştirici

- **Hüseyin Çınar** - Frontend Developer
- Email: huseyin-cinar@outlook.com
- GitHub: [@codebycinar](https://github.com/codebycinar)

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.