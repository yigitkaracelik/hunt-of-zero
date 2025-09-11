# Sayı Avcısı Oyunu

Sayı Avcısı, hız ve dikkat gerektiren eğlenceli bir tarayıcı oyunudur. Oyuncular, verilen hedef sayıya ulaşmak için doğru işlem butonlarına zamanında basmalıdır. Her seviyede zorluk artar ve zaman kısalır.

Bu proje, `Vanilla JavaScript`, `HTML` ve `CSS` kullanılarak oluşturulmuştur ve herhangi bir kütüphane veya framework bağımlılığı yoktur.

![Sayı Avcısı Ekran Görüntüsü](ekran-goruntusu1.png)
![Sayı Avcısı Ekran Görüntüsü](ekran-goruntusu2.png)

## Özellikler

-   **Üç Farklı Zorluk Seviyesi:** Kolay, Normal ve Zor seçenekleriyle her seviyeden oyuncuya hitap eder.
-   **Dinamik Zamanlayıcı:** Seviye ilerledikçe azalan süre, oyunu daha heyecanlı hale getirir.
-   **Puanlama ve Yüksek Skor:** Oyuncuların en yüksek skorları tarayıcı hafızasında saklanır.
-   **En Hızlı Zamanlar Listesi:** Her seviye için en hızlı bitirme süreleri kaydedilir ve bir lider tablosunda gösterilir.
-   **Ses Ayarları:** Oyun içi sesleri açıp kapatma ve ses seviyesini ayarlama imkanı.
-   **Klavye Desteği:** Rakam tuşları ve Boşluk tuşu ile oynanabilirlik.
-   **Duraklatma Özelliği:** Oyun sırasında 'P' tuşu veya buton ile oyunu duraklatma.

## Gerekli Dosya Yapısı

Projenin düzgün çalışması için tüm dosyaların aşağıdaki gibi aynı dizinde olması gerekmektedir:

```
/sayi-avcisi-projesi
├── index.html
├── stil.css
├── oyun.js
├── arkaplan.jpg
├── favicon.png
├── ayarlar-ikonu.png
├── ayarlar-kapatma-ikonu.png
├── kolay-mod.png
├── normal-mod.png
├── zor-mod.png
├── click.mp3
├── kaybetme.mp3
├── baslatma.mp3
├── tick.mp3
├── kazanma.mp3
└── sonrakiseviye.mp3
```

## Lokal (Yerel Makinede) Çalıştırma

Projeyi bilgisayarınızda denemek için iki basit yöntem vardır:

### Yöntem 1: VS Code Live Server Eklentisi (Önerilen)

1.  Visual Studio Code editörünü açın.
2.  Eğer yüklü değilse, Eklentiler (Extensions) sekmesinden **Live Server** eklentisini kurun.
3.  Proje klasörünü VS Code ile açın.
4.  `index.html` dosyasına sağ tıklayın ve **"Open with Live Server"** seçeneğine tıklayın.
5.  Oyun, varsayılan tarayıcınızda otomatik olarak açılacaktır.

### Yöntem 2: Python ile Basit Sunucu

Bilgisayarınızda Python yüklüyse, aşağıdaki komutlarla hızlıca bir yerel sunucu başlatabilirsiniz:

1.  Terminali veya Komut İstemi'ni açın.
2.  `cd` komutu ile proje dosyalarının bulunduğu klasöre gidin.
3.  Aşağıdaki komutu çalıştırın (Python versiyonunuza göre):
    -   **Python 3.x için:** `python -m http.server`
    -   **Python 2.x için:** `python -m SimpleHTTPServer`
4.  Tarayıcınızı açın ve adres çubuğuna `http://localhost:8000` yazın.

## GitHub Pages ile Yayına Alma

Projenizi internet üzerinden herkesin erişebileceği bir adreste yayınlamak için aşağıdaki adımları izleyin:

1.  **Projenizi GitHub'a Yükleyin:** Proje dosyalarınızı yeni bir GitHub repositorisine `git push` komutu ile gönderin.

2.  **Dosya Adını Kontrol Edin:** Ana HTML dosyanızın adının `index.html` olduğundan emin olun. Bu, GitHub Pages'in sitenizi tanıması için zorunludur.

3.  **GitHub Pages'i Etkinleştirin:**
    -   Projenizin GitHub repositorisine gidin.
    -   **Settings** (Ayarlar) sekmesine tıklayın.
    -   Sol menüden **Pages** sekmesine tıklayın.
    -   "Build and deployment" başlığı altında, **Source** (Kaynak) olarak **"Deploy from a branch"** seçeneğini seçin.
    -   **Branch** (Dal) olarak `main` (veya hangi dalı kullanıyorsanız onu) seçin ve klasör olarak `/(root)` seçili kalsın.
    -   **Save** (Kaydet) butonuna tıklayın.

4.  **Sitenizi Ziyaret Edin:**
    -   Birkaç dakika sonra sayfanın en üstünde "Your site is live at..." şeklinde bir bildirim belirecektir.
    -   Sitenizin adresi şu formatta olacaktır: `https://<kullanici-adiniz>.github.io/<repo-adiniz>/`

Artık oyununuz yayında!