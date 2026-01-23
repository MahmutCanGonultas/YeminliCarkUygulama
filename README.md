# 🎡 Wheel Spinner - Çark Çevirme Uygulaması

Modern ve kullanışlı bir çark çevirme (random picker) web uygulaması. İki bağımsız çark ile rastgele seçimler yapabilirsiniz.

Bu proje, HTML5 Canvas API kullanılarak vanilla JavaScript ile geliştirilmiştir.

## ✨ Özellikler

- 🎯 **İki Bağımsız Çark**: Her çark kendi seçenekleriyle bağımsız çalışır
- 💾 **Veri Saklama**: Tüm seçenekler tarayıcınızda (localStorage) güvenle saklanır
- 🎨 **Modern Tasarım**: Koyu tema, glassmorphism efektleri ve animasyonlar
- 📱 **Responsive**: Mobil ve masaüstü cihazlarda mükemmel çalışır
- ⚡ **Hızlı ve Hafif**: Vanilla JavaScript, framework yok
- 🎲 **Smooth Animasyonlar**: Yumuşak dönme efektleri ve easing functions
- 📝 **Kolay Kullanım**: Seçenek ekleme/çıkarma çok basit

## 🚀 Kurulum ve Yayınlama

### Yerel Geliştirme

1. Dosyaları bir klasöre kopyalayın
2. `index.html` dosyasını tarayıcıda açın
3. Hazır! Herhangi bir build işlemi gerekmez

### Web Sunucusuna Yükleme

#### GitHub Pages

1. Bu dosyaları bir GitHub repository'sine yükleyin
2. Repository Settings > Pages bölümüne gidin
3. Source olarak `main` branch'ini seçin
4. Kaydedin, birkaç dakika içinde yayında olacak

#### Netlify

1. [Netlify](https://www.netlify.com/) hesabı oluşturun
2. "Add new site" > "Deploy manually"
3. Tüm dosyaları sürükleyip bırakın
4. Otomatik olarak yayınlanacak

#### Vercel

1. [Vercel](https://vercel.com/) hesabı oluşturun
2. "New Project" > "Import Git Repository" veya "Upload"
3. Dosyaları yükleyin
4. Deploy butonuna tıklayın

#### Klasik Web Hosting (cPanel, FTP)

1. Tüm dosyaları FTP ile `public_html` klasörüne yükleyin
2. `.htaccess` dosyası Apache sunucularda otomatik çalışacak
3. Eğer Nginx kullanıyorsanız, aşağıdaki Nginx config'i kullanın

### Nginx Configuration

```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/wheel-spinner;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/css application/javascript application/json text/html;

    # Cache static files
    location ~* \.(css|js|png|jpg|jpeg|gif|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📁 Dosya Yapısı

```
basitCark/
├── index.html          # Ana HTML dosyası
├── style.css           # Stil dosyası
├── script.js            # JavaScript mantığı
├── manifest.json        # PWA manifest (mobil uygulama gibi kullanım için)
├── .htaccess           # Apache sunucu ayarları
└── README.md            # Bu dosya
```

## 🎮 Kullanım

1. **Seçenek Ekleme**: Input alanına yazın ve "Add" butonuna tıklayın
2. **Seçenek Silme**: Her seçeneğin yanındaki "✕ Remove" butonuna tıklayın
3. **Çark Çevirme**: "🎲 Spin" butonuna tıklayın
4. **Sonuç**: Çark durduğunda seçilen seçenek gösterilir

## 💾 Veri Saklama

- Tüm seçenekler tarayıcınızın localStorage'ında saklanır
- Sayfa yenilendiğinde veriler korunur
- Her çark kendi verilerini saklar (wheel1, wheel2)
- Tarayıcı verilerini temizlemediğiniz sürece veriler kalıcıdır

## 🔧 Özelleştirme

### Varsayılan Seçenekleri Değiştirme

`script.js` dosyasındaki `DEFAULT_WHEELS` objesini düzenleyin:

```javascript
const DEFAULT_WHEELS = {
    wheel1: ['seçenek1', 'seçenek2', ...],
    wheel2: ['seçenek1', 'seçenek2', ...]
};
```

### Renkleri Değiştirme

`style.css` dosyasındaki `:root` değişkenlerini düzenleyin:

```css
:root {
    --accent: #8b5cf6;  /* Ana renk */
    --accent-hover: #a78bfa;
    /* ... */
}
```

## 🌐 Tarayıcı Desteği

- ✅ Chrome (son 2 versiyon)
- ✅ Firefox (son 2 versiyon)
- ✅ Safari (son 2 versiyon)
- ✅ Edge (son 2 versiyon)
- ✅ Mobil tarayıcılar (iOS Safari, Chrome Mobile)

## 📝 Lisans

Bu proje açık kaynaklıdır ve serbestçe kullanılabilir.

## 🛠️ Geliştirme Notları

- Canvas API kullanılarak çark render edilir
- localStorage ile veri kalıcılığı sağlanır
- Easing functions ile smooth animasyonlar
- PWA desteği ile mobil cihazlarda uygulama gibi kullanılabilir

## 🐛 Sorun Bildirimi

Herhangi bir sorun bulursanız, lütfen GitHub Issues'da bildirin veya pull request gönderin.

## 🙏 Teşekkürler

Bu uygulamayı kullandığınız için teşekkürler! 🎉
