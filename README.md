# Sayı Avcısı Oyunu

Sayı Avcısı, hız ve dikkat gerektiren eğlenceli bir tarayıcı oyunudur. Oyuncular, verilen hedef sayıya ulaşmak için doğru işlem butonlarına zamanında basmalıdır. Her seviyede zorluk artar ve zaman kısalır.

**[>> OYUNU OYNAMAK İÇİN TIKLAYIN <<](https://z3r0-a0e25.web.app)**

![Sayı Avcısı Ekran Görüntüsü](public/ekran-goruntusu1.png)
![Sayı Avcısı Ekran Görüntüsü](public/ekran-goruntusu2.png)

## Nasıl Oynanır?

1.  **Amaç:** Ekranın ortasındaki dairede yazan **Hedef Sayı**'yı, altındaki butonları kullanarak **tam olarak 0'a** düşürmektir.
2.  **Oynanış:** Her butona bastığınızda, butonun üzerindeki değer Hedef Sayı'dan çıkarılır.
3.  **Zaman:** Her seviyede size belirli bir süre verilir. Bu süre, ekranın üstündeki **yeşil zaman çubuğu** ile gösterilir.
4.  **Kazanma:** Hedef Sayı'yı tam olarak **0** yaparsanız seviyeyi geçersiniz.
5.  **Kaybetme:** Süreniz biterse veya hedefi sıfırın altına düşürürseniz oyunu kaybedersiniz.

## Özellikler

-   Üç farklı zorluk seviyesi: Kolay, Normal ve Zor.
-   Dinamik zamanlayıcı ve artan zorluk.
-   Yüksek skor ve en hızlı bitirme süreleri takibi.
-   Klavye desteği, ses ayarları ve duraklatma özelliği.

---

## Geliştirme ve Teknik Detaylar

Bu bölüm, projeye katkıda bulunmak veya projeyi kendi bilgisayarında çalıştırmak isteyen geliştiriciler içindir.

### Yerel Geliştirme (Local Development)

Projeyi kendi bilgisayarınızda çalıştırmak için:

1.  Depoyu klonlayın ve proje klasörüne gidin.
2.  Projeyi bir web sunucusu üzerinden çalıştırmanız gerekir.
    *   **Yöntem 1 (VS Code Live Server):** VS Code'da "Live Server" eklentisini kurun. `public/index.html` dosyasına sağ tıklayıp "Open with Live Server" seçeneğini seçin.
    *   **Yöntem 2 (Basit HTTP Sunucusu):** Terminalde `public` klasörünün içine girin (`cd public`) ve aşağıdaki komutlardan birini çalıştırın:
        ```bash
        # Python 3+ yüklüyse:
        python -m http.server
        
        # Node.js ve npm yüklüyse:
        npx http-server
        ```

### Firebase Konfigürasyonu

Proje, Firebase Hosting ile entegredir.

*   `.firebaserc`: Yerel proje klasörünü doğru Firebase projesine bağlar.
*   `firebase.json`: Hosting kurallarını (public dizini, ignore kuralları, performans için cache ayarları vb.) içerir.

**Proje Bilgileri:**
*   **Proje ID:** `z3r0-a0e25`
*   **Site ID:** `z3r0-a0e25`

### Otomatik Deployment (CI/CD)

Proje, GitHub Actions kullanılarak otomatik olarak deploy edilmektedir.

#### Önizleme (Preview) Ortamı

*   **Tetikleyici:** `develop` dalına açılan her **Pull Request (PR)**.
*   **Davranış:** GitHub Actions, PR'daki değişiklikler için otomatik olarak geçici bir önizleme sitesi oluşturur.
*   **Sonuç:** Oluşturulan önizleme URL'si, ilgili PR sayfasına bir bot tarafından yorum olarak eklenir.

#### Canlı (Live) Ortam

*   **Tetikleyici:** Bir PR, `develop` dalı ile **birleştirildiğinde (merge edildiğinde)**.
*   **Davranış:** GitHub Actions, `develop` dalındaki en son kodu alarak projeyi otomatik olarak canlı ortama deploy eder.
*   **Sonuç:** `https://z3r0-a0e25.web.app` adresindeki site güncellenir.

#### Gerekli Secrets

Otomatik deploy işleminin çalışabilmesi için depoda aşağıdaki secret'ın tanımlı olması gerekmektedir:

*   **`FIREBASE_SERVICE_ACCOUNT_Z3R0_A0E25`**: Bu secret, GitHub Actions'ın Firebase projesine sizin adınıza deploy yapabilmesi için gerekli olan servis hesabı anahtarını içerir ve `firebase init hosting:github` komutu tarafından otomatik olarak oluşturulmuştur.

## Katkıda Bulunma (Contributing)

Bu projeye katkıda bulunmak isterseniz, lütfen çekinmeyin!

1.  Projeyi **fork**'layın.
2.  Yeni bir özellik veya düzeltme için kendi **branch**'inizi oluşturun (`git checkout -b ozellik/yeni-menu`).
3.  Değişikliklerinizi **commit**'leyin (`git commit -m 'Yeni menü eklendi'`).
4.  Oluşturduğunuz branch'i kendi fork'unuza **push**'layın (`git push origin ozellik/yeni-menu`).
5.  Ana projeye bir **Pull Request (Çekme İsteği)** açın.