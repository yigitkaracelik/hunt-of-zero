# Sayı Avcısı Oyunu

Hızlı tempolu, retro piksel sanat estetiğine sahip bir matematik ve refleks oyunu. Amaç, süre dolmadan hedef sayıyı doğru butonlara basarak sıfırlamaktır.

## Ekran Görüntüsü

![Oyun Görüntüsü](ekran_goruntusu1.png)
![Oyun Görüntüsü](ekran_goruntusu2.png)

## Özellikler

-   **Artan Zorluk:** Her seviyede zaman kısalır ve hedef sayılar büyür.
-   **Dinamik Puanlama:** Seviye ve kalan süreye göre puan kazanın.
-   **Retro Tasarım:** "Press Start 2P" fontu ve piksel tabanlı arayüz ile nostaljik bir deneyim.
-   **Ayarlar Menüsü:**
    -   Ses açma/kapatma
    -   Ses seviyesi ayarı
    -   Kolay, Normal, Zor zorluk seviyeleri
-   **Seviye Geçmişi:** Tamamladığınız seviyeleri ve sürelerinizi takip edin.
-   **Etkileşimli Sesler:** Oyuna derinlik katan tıklama, kazanma, kaybetme ve zamanlayıcı sesleri.

## Kullanılan Teknolojiler

-   HTML5
-   CSS3
-   Vanilla JavaScript (Hiçbir kütüphane veya framework kullanılmamıştır.)

## Nasıl Çalıştırılır ve Yayınlanır?

Bu proje hem yerel bilgisayarınızda direkt olarak çalıştırılabilir hem de GitHub Pages üzerinden kolayca canlıya alınabilir.

### Lokal Çalıştırma

1.  **Repoyu Klonlayın:** Bu projeyi `git clone` komutuyla veya ZIP olarak bilgisayarınıza indirin.
2.  **Klasöre Gidin:** Proje dosyalarının bulunduğu klasörü açın.
3.  **`index.html` Dosyasını Açın:** `index.html` dosyasına çift tıklayarak favori web tarayıcınızda (Google Chrome, Firefox, Safari vb.) açın.

### GitHub Pages ile Yayına Alma

Bu projeyi internet üzerinden herkesin erişebileceği bir adreste yayınlamak için:

1.  Projenin GitHub deposunda **Settings (Ayarlar)** sekmesine gidin.
2.  Sol menüden **Pages** sekmesini seçin.
3.  "Build and deployment" başlığı altında, **Source** olarak **"Deploy from a branch"** seçeneğini belirleyin.
4.  Açılan menülerden yayın yapmak istediğiniz dalı (**Branch**) seçin (genellikle `main` veya `develop`).
5.  **Save (Kaydet)** butonuna basın.
6.  Birkaç dakika içinde, sayfanın üst kısmında beliren `https://kullaniciadiniz.github.io/proje-adi/` formatındaki adresten oyununuza canlı olarak erişebilirsiniz.

## Oyun Kuralları

-   **Amaç:** Ekranın ortasındaki **hedef sayıyı**, alttaki butonları kullanarak **tam olarak 0'a** indirmektir.
-   **Kazanma:** Hedef sayı tam olarak 0 olursa seviyeyi kazanırsınız. Kalan süreniz ve mevcut seviyeniz puanınızı belirler.
-   **Kaybetme:**
    -   Üstteki zaman çubuğu tamamen biterse,
    -   Hedef sayı 0'ın altına düşerse kaybedersiniz ve oyun yeniden başlar.

## Dosya Yapısı
Sayı Avcısı/
├── index.html # Oyunun ana HTML yapısı
├── stil.css # Tüm görsel stiller
├── oyun.js # Oyunun tüm mantığı ve işlevselliği
├── arkaplan.jpg # Arka plan görseli
├── click.mp3 # Tıklama sesi
├── kaybetme.mp3 # Kaybetme sesi
├── baslatma.mp3 # Oyun başlangıç sesi
└── README.md # Proje açıklaması
