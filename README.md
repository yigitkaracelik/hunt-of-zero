# Sayı Avcısı Oyunu

**[>> OYUNU OYNAMAK İÇİN TIKLAYIN <<](https://Koc-Staj.github.io/Sayi_Oyunu_Projesi/)**

Sayı Avcısı, hız ve dikkat gerektiren eğlenceli bir tarayıcı oyunudur. Oyuncular, verilen hedef sayıya ulaşmak için doğru işlem butonlarına zamanında basmalıdır. Her seviyede zorluk artar ve zaman kısalır.

![Sayı Avcısı Ekran Görüntüsü](ekran-goruntusu2.png)
![Sayı Avcısı Ekran Görüntüsü](ekran-goruntusu1.png)

## 🕹️ Nasıl Oynanır?

1.  **Amaç:** Ekranın ortasındaki dairede yazan **Hedef Sayı**'yı, altındaki butonları kullanarak **tam olarak 0'a** düşürmektir.
2.  **Oynanış:** Her butona bastığınızda, butonun üzerindeki değer Hedef Sayı'dan çıkarılır.
3.  **Zaman:** Her seviyede size belirli bir süre verilir. Bu süre, ekranın üstündeki **yeşil zaman çubuğu** ile gösterilir. Süre dolmadan hedefi sıfırlamanız gerekir.
4.  **Kazanma:** Hedef Sayı'yı tam olarak **0** yaparsanız seviyeyi geçersiniz. Kalan süreniz ve mevcut seviyeniz size ekstra puan kazandırır.
5.  **Kaybetme:**
    *   Süreniz biterse,
    *   Hedef Sayı'yı sıfırın altına düşürürseniz (`-1`, `-3` gibi),
    oyunu kaybedersiniz ve baştan başlarsınız.

## ✨ Özellikler

-   **Üç Farklı Zorluk Seviyesi:** Kolay, Normal ve Zor seçenekleriyle her seviyeden oyuncuya hitap eder.
-   **Dinamik Zamanlayıcı:** Seviye ilerledikçe azalan süre, oyunu daha heyecanlı hale getirir.
-   **Puanlama ve Yüksek Skor:** Oyuncuların en yüksek skorları tarayıcı hafızasında saklanır.
-   **En Hızlı Zamanlar Listesi:** Her seviye için en hızlı bitirme süreleri kaydedilir ve bir lider tablosunda gösterilir.
-   **Klavye Desteği:** Fare kullanmadan, klavye ile hızlıca oynanabilir.
-   **Ayarlar Menüsü:** Ses seviyesi, zorluk ve sesin açık/kapalı olması gibi ayarlar sunar.
-   **Duraklatma Özelliği:** Oyun sırasında 'P' tuşu veya buton ile oyunu duraklatma.

## 🛠️ Ayarlar ve Kontroller

### ⌨️ Klavye Kısayolları

| Tuş           | İşlev                                          |
|---------------|------------------------------------------------|
| **1**'den **9**'a | Ekranda görünen ilgili sayı butonuna basar.    |
| **Boşluk (Space)** | Oyunu başlatır veya seviye sonu ekranında bir sonraki seviyeye geçer. |
| **P**           | Oyunu duraklatır veya devam ettirir.           |

### ⚙️ Oyun Ayarları

Oyunun sol üst köşesindeki dişli ikonuna tıklayarak ayarlar menüsünü açabilirsiniz.

-   **Ses:** Oyundaki tüm ses efektlerini açar veya kapatır.
-   **Ses Düzeyi:** Ses efektlerinin yüksekliğini ayarlar.
-   **Zorluk:**
    -   **Kolay:** Daha uzun süre, daha yavaş zorluk artışı ve daha düşük puan çarpanı sunar. Yeni başlayanlar için idealdir.
    -   **Normal:** Dengeli bir oynanış sunar. Standart zaman ve puanlama.
    -   **Zor:** Daha kısa süre, daha hızlı zorluk artışı ve daha yüksek puan çarpanı sunar. Rekor kırmak isteyenler için idealdir.

## 🚀 Kurulum ve Çalıştırma

Bu proje, herhangi bir kütüphane veya framework bağımlılığı olmadan saf `JavaScript`, `HTML` ve `CSS` ile yazılmıştır.

### Gerekli Dosya Yapısı

Projenin düzgün çalışması için tüm dosyaların aşağıdaki gibi aynı dizinde olması gerekmektedir:
```
/sayi-avcisi-projesi
├── index.html
├── stil.css
├── oyun.js
├── (tüm .png, .jpg, .mp3 dosyaları)
└── README.md
```

### Lokal (Yerel Makinede) Çalıştırma

1.  Bu repoyu bilgisayarınıza klonlayın veya indirin.
2.  Proje klasörünü **VS Code** ile açın.
3.  **Live Server** eklentisini kurun.
4.  `index.html` dosyasına sağ tıklayıp **"Open with Live Server"** seçeneğine tıklayın.

## 🌐 GitHub Pages ile Yayına Alma

Projenizi internet üzerinden yayınlamak için:

1.  Projenizi bir GitHub repositorisine yükleyin.
2.  Ana HTML dosyanızın adının `index.html` olduğundan emin olun.
3.  Reponuzun **Settings > Pages** bölümüne gidin.
4.  Kaynak (Source) olarak **"Deploy from a branch"** seçin.
5.  Branch olarak `main` dalını seçip **Save** butonuna tıklayın.
6.  Birkaç dakika içinde siteniz `https://<kullanici-adiniz>.github.io/<repo-adiniz>/` adresinde yayında olacaktır.

## 🤝 Katkıda Bulunma (Contributing)

Bu projeye katkıda bulunmak isterseniz, lütfen çekinmeyin!

1.  Projeyi **fork**'layın.
2.  Yeni bir özellik veya düzeltme için kendi **branch**'inizi oluşturun (`git checkout -b ozellik/yeni-menu`).
3.  Değişikliklerinizi **commit**'leyin (`git commit -m 'Yeni menü eklendi'`).
4.  Oluşturduğunuz branch'i kendi fork'unuza **push**'layın (`git push origin ozellik/yeni-menu`).
5.  Ana projeye bir **Pull Request (Çekme İsteği)** açın.

## 📝 Bakım Notları

-   Oyunun tüm temel mantığı `oyun.js` dosyası içerisinde yer almaktadır.
-   Zorluk seviyeleri, zamanlama ve puanlama gibi denge ayarları `oyun.js` dosyasının en üstündeki `zorlukAyarlari` objesinden kolayca değiştirilebilir.
-   Tüm görsel stiller `stil.css` dosyasında bulunmaktadır.