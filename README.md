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

## Nasıl Çalıştırılır?

Bu oyunu oynamak için herhangi bir web sunucusu (server) kurmanıza gerek yoktur. Dosyalar doğrudan yerel olarak çalışır.

1.  **Dosyaları İndirin:** Bu projenin tüm dosyalarını (`index.html`, `stil.css`, `oyun.js`) ve ses/görsel dosyalarını içeren klasörü bilgisayarınıza indirin.
2.  **Klasörü Açın:** İndirdiğiniz klasörün içine girin.
3.  **`index.html` Dosyasını Çalıştırın:** `index.html` dosyasına çift tıklayarak favori web tarayıcınızda (Google Chrome, Firefox, Safari vb.) açın.
4.  **Oyunun Tadını Çıkarın!**

## Oyun Kuralları

-   **Amaç:** Ekranın ortasındaki **hedef sayıyı**, alttaki butonları kullanarak **tam olarak 0'a** indirmektir.
-   **Kazanma:** Hedef sayı tam olarak 0 olursa seviyeyi kazanırsınız. Kalan süreniz ve mevcut seviyeniz puanınızı belirler.
-   **Kaybetme:**
    -   Üstteki zaman çubuğu tamamen biterse,
    -   Hedef sayı 0'ın altına düşerse kaybedersiniz ve oyun yeniden başlar.

## Dosya Yapısı

```
Sayı Avcısı/
├── index.html         # Oyunun ana HTML yapısı
├── stil.css           # Tüm görsel stiller
├── oyun.js            # Oyunun tüm mantığı ve işlevselliği
├── arkaplan.jpg       # Arka plan görseli
├── click.mp3          # Tıklama sesi
├── kaybetme.mp3       # Kaybetme sesi
├── baslatma.mp3       # Oyun başlangıç sesi
├── tick.mp3           # Zamanlayıcı sesi
└── kazanma.mp3        # Seviye kazanma sesi
```
