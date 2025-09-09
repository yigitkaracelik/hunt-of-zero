// HTML elemanlarını değişkenlere atama
const hedefSayiElementi = document.getElementById('hedef-sayi');
const butonlar = document.querySelectorAll('.islem-butonu');
const seviyeGosterge = document.getElementById('seviye-gosterge');
const puanGosterge = document.getElementById('puan-gosterge');
const zamanCubugu = document.getElementById('zaman-cubugu-ic');
const seviyeSonuMesaji = document.getElementById('seviye-sonu-mesaji');
const mesajMetni = document.getElementById('mesaj-metni');
const sonrakiSeviyeButonu = document.getElementById('sonraki-seviye-butonu');
const seviyeListesi = document.getElementById('seviye-listesi');
const tiklamaSesi = document.getElementById('tiklamaSesi');
const kaybetmeSesi = document.getElementById('kaybetmeSesi');
const baslatmaSesi = document.getElementById('baslatmaSesi');
const sonrakiSeviyeSesi = document.getElementById('sonrakiSeviyeSesi');
const zamanlayiciSesi = document.getElementById('zamanlayiciSesi');
const baslangicEkrani = document.getElementById('baslangic-ekrani');
const baslaButonu = document.getElementById('basla-butonu');
const oyunAlani = document.getElementById('oyun-alani');
const skorTablosu = document.getElementById('skor-tablosu');
const yuksekSkorGosterge = document.getElementById('yuksek-skor-gosterge'); // En yüksek skor göstergesi

// Eğer kazanma sesi varsa, tanımlayın (HTML'de yoksa bu satırı kaldırabilirsiniz)
const kazanmaSesi = document.getElementById('kazanmaSesi');

// Oyun durumu değişkenleri
let mevcutSeviye = 1;
let toplamPuan = 0; // Mevcut oyunun puanı
let mevcutHedefSayi = 0;
let zamanlayici;
let kalanZaman;
let baslangicZamani;
let sonSesZamani = 0;

// En yüksek skor ve localStorage anahtarı
let enYuksekSkor = 0;
const YUKSEK_SKOR_KEY = 'sayiAvcisiEnYuksekSkor';

// Sayfa yüklendiğinde en yüksek skoru localStorage'dan yükle ve göster
document.addEventListener('DOMContentLoaded', () => {
    enYuksekSkoruYukle();
    // Oyun başladığında veya yeniden başladığında da güncellenmesi için burada çağırıyoruz.
    // Ancak sadece yükleme anında çağırıp, diğer güncellemeler için oyunuKaybet veya oyunuKazan içinde çağırabiliriz.
});


// En yüksek skoru localStorage'dan yükle
function enYuksekSkoruYukle() {
    const storedSkor = localStorage.getItem(YUKSEK_SKOR_KEY);
    if (storedSkor !== null) {
        enYuksekSkor = parseInt(storedSkor, 10);
    }
    yuksekSkorGosterge.textContent = enYuksekSkor; // Arayüzü güncelle
}

// En yüksek skoru localStorage'a kaydet
function enYuksekSkoruKaydet() {
    localStorage.setItem(YUKSEK_SKOR_KEY, enYuksekSkor.toString());
}

// En yüksek skoru kontrol et ve güncelle
function enYuksekSkoruKontrolEtVeGuncelle() {
    // Burada 'mevcutPuan' yerine 'toplamPuan' kullanmalıyız, çünkü mevcut oyunun toplam puanı budur.
    if (toplamPuan > enYuksekSkor) {
        enYuksekSkor = toplamPuan;
        yuksekSkorGosterge.textContent = enYuksekSkor; // Arayüzü güncelle
        enYuksekSkoruKaydet(); // LocalStorage'a kaydet
    }
}

// Butonları devre dışı bırak
function butonlariDevreDisiBirak() {
    butonlar.forEach(buton => {
        buton.disabled = true;
    });
}

// Butonları aktif yap
function butonlariAktiflestir() {
    butonlar.forEach(buton => {
        buton.disabled = false;
    });
}

// Yeni seviyeyi başlat
function seviyeyiBaslat() {
    butonlariAktiflestir();
    seviyeSonuMesaji.classList.add('gizli');

    // Rastgele rakamları butonlara ata
    const olasiRakamlar = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    for (let i = olasiRakamlar.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [olasiRakamlar[i], olasiRakamlar[j]] = [olasiRakamlar[j], olasiRakamlar[i]];
    }

    const butonDegerleri = [];
    butonlar.forEach((buton, index) => {
        const yeniRakam = olasiRakamlar[index];
        buton.textContent = yeniRakam;
        buton.dataset.deger = yeniRakam;
        butonDegerleri.push(yeniRakam);
    });

    // Çözülebilir hedef sayı oluştur
    let geciciHedefSayi = 0;
    const adimSayisi = 3 + Math.floor(mevcutSeviye / 3);

    for (let i = 0; i < adimSayisi; i++) {
        const rastgeleIndex = Math.floor(Math.random() * butonDegerleri.length);
        geciciHedefSayi += butonDegerleri[rastgeleIndex];
    }

    if (geciciHedefSayi < 10) {
        geciciHedefSayi += 7;
    }
    mevcutHedefSayi = geciciHedefSayi;

    // Zaman ayarı
    kalanZaman = 15 - Math.floor(mevcutSeviye / 2); // Seviye arttıkça daha hızlı olsun
    if (kalanZaman < 5) kalanZaman = 5; // Minimum 5 saniye

    // Arayüz güncelle
    hedefSayiElementi.textContent = mevcutHedefSayi;
    seviyeGosterge.textContent = mevcutSeviye;

    zamanCubugu.style.width = '100%';
    zamanCubugu.style.backgroundColor = '#4CAF50';

    baslangicZamani = Date.now();

    clearInterval(zamanlayici);
    zamanlayici = setInterval(() => {
        const gecenSure = (Date.now() - baslangicZamani) / 1000;
        const yuzde = ((kalanZaman - gecenSure) / kalanZaman) * 100;
        zamanCubugu.style.width = yuzde + '%';

        // Ses hızını ayarla
        const maxAralik = 1200; // Başlangıçta yavaş
        const minAralik = 400;  // Süre azaldıkça hızlanır
        // Yüzde 100 iken maxAralık, yüzde 0 iken minAralık olsun
        const suAnkiAralik = minAralik + (yuzde / 100) * (maxAralik - minAralik);

        if (Date.now() - sonSesZamani > suAnkiAralik) {
            zamanlayiciSesi.currentTime = 0;
            zamanlayiciSesi.play();
            sonSesZamani = Date.now();
        }

        if (yuzde < 50) zamanCubugu.style.backgroundColor = 'orange';
        if (yuzde < 25) zamanCubugu.style.backgroundColor = 'red';

        if (gecenSure >= kalanZaman) {
            oyunuKaybet("Süre doldu!");
        }
    }, 100);
}

// Butonlara tıklama olayları ekle
butonlar.forEach(buton => {
    buton.addEventListener('click', () => {
        buton.classList.add('tiklandi');

        const cikarilacakDeger = parseInt(buton.dataset.deger);
        mevcutHedefSayi -= cikarilacakDeger;
        hedefSayiElementi.textContent = mevcutHedefSayi;

        tiklamaSesi.currentTime = 0;
        tiklamaSesi.play();

        if (mevcutHedefSayi === 0) {
            oyunuKazan();
        } else if (mevcutHedefSayi < 0) {
            oyunuKaybet("Sıfırın altına düştün!");
        }
    });

    buton.addEventListener('animationend', () => {
        buton.classList.remove('tiklandi');
    });
});

// Oyuncu kazandığında
function oyunuKazan() {
    if (kazanmaSesi) {
        kazanmaSesi.play();
    }
    zamanlayiciSesi.pause();
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();

    // 1. Önce kalan süreyi saniye cinsinden hesapla
    const gecenSure = (Date.now() - baslangicZamani) / 1000;
    const kalanSaniye = kalanZaman - gecenSure;

    // 2. Yeni puanlama formülünü uygula
    const seviyePuani = mevcutSeviye * 10;
    const zamanBonusu = Math.max(0, kalanSaniye) * 5; // Negatif bonus olmasın diye Math.max kullanılır.
    const kazanilanPuan = Math.round(seviyePuani + zamanBonusu);

    // 3. Toplam puanı güncelle
    toplamPuan += kazanilanPuan;
    puanGosterge.textContent = toplamPuan;

    // YENİ: En yüksek skoru kontrol et ve güncelle
    enYuksekSkoruKontrolEtVeGuncelle();
    
    // Skor tablosuna yazdırırken geçen süreyi formatla
    const gecenSureSaniye = gecenSure.toFixed(2);
    const yeniSkorSatiri = document.createElement('li');
    yeniSkorSatiri.innerHTML = `Seviye ${mevcutSeviye}: <strong>${gecenSureSaniye} sn</strong> (+${kazanilanPuan} Puan)`;
    seviyeListesi.appendChild(yeniSkorSatiri);

    mesajMetni.textContent = `Tebrikler! +${kazanilanPuan} puan kazandın.`;
    sonrakiSeviyeButonu.textContent = "Sonraki Seviye";
    sonrakiSeviyeButonu.disabled = false; // Butonu aktif yap
    seviyeSonuMesaji.classList.remove('gizli');

    mevcutSeviye++;
}

// Oyuncu kaybettiğinde
function oyunuKaybet(sebep) {
    zamanlayiciSesi.pause();
    kaybetmeSesi.play();
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();

    mesajMetni.textContent = `Kaybettin! Sebep: ${sebep}. Puanın: ${toplamPuan}`; // Kaybedince puanı da göster
    sonrakiSeviyeButonu.textContent = "Yeniden Başla";
    sonrakiSeviyeButonu.disabled = false; // Butonu aktif yap
    seviyeSonuMesaji.classList.remove('gizli');

    // YENİ: Oyunu kaybedince en yüksek skoru kontrol et ve güncelle
    enYuksekSkoruKontrolEtVeGuncelle(); // Kaybederken de kontrol edelim

    // Oyunu kaybedince skor tablosunu temizle ve puanı sıfırla
    seviyeListesi.innerHTML = '';
    mevcutSeviye = 1;
    toplamPuan = 0;
    puanGosterge.textContent = toplamPuan; // Puanı arayüzde de sıfırla
}

// "Sonraki Seviye" veya "Yeniden Başla" butonuna tıklama
sonrakiSeviyeButonu.addEventListener('click', () => {
    // Önce hangi sesin çalınacağına karar verelim
    if (sonrakiSeviyeButonu.textContent === "Yeniden Başla") {
        baslatmaSesi.play();
    } else {
        if (sonrakiSeviyeSesi) {
            sonrakiSeviyeSesi.play();
        }
    }
    
    puanGosterge.textContent = toplamPuan;
    seviyeyiBaslat(); // Bu, yeni seviyeyi başlatan en önemli komuttur.
});

// "Başla" butonuna tıklanınca oyunu başlat
baslaButonu.addEventListener('click', () => {
    baslangicEkrani.classList.add('gizli');
    oyunAlani.classList.remove('gizli');
    skorTablosu.classList.remove('gizli');
    seviyeyiBaslat();
});

// Sayfa yüklendiğinde en yüksek skoru yükle ve göster
document.addEventListener('DOMContentLoaded', enYuksekSkoruYukle);