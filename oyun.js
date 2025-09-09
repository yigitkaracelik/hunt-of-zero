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
const zamanlayiciSesi = document.getElementById('zamanlayiciSesi');
const baslangicEkrani = document.getElementById('baslangic-ekrani');
const baslaButonu = document.getElementById('basla-butonu');
const oyunAlani = document.getElementById('oyun-alani');
const skorTablosu = document.getElementById('skor-tablosu');
const duraklatButonu = document.getElementById('duraklat-butonu');
const duraklatOverlay = document.getElementById('duraklat-overlay');
const kazanmaSesi = document.getElementById('kazanmaSesi');
// YENİ EKLENDİ: Duraklatma butonunun konteynerini de yönetmek için seçiyoruz.
const duraklatKonteyneri = document.getElementById('duraklat-konteyneri');
const sonrakiSeviyeSesi = document.getElementById('sonrakiSeviyeSesi'); 

// Oyun durumu değişkenleri
let mevcutSeviye = 1;
let toplamPuan = 0;
let mevcutHedefSayi = 0;
let zamanlayici;
let kalanZaman;
let baslangicZamani;
let sonSesZamani = 0;

// Duraklatma ile ilgili değişkenler
let duraklatildi = false;
let duraklamaBaslangicZamani;
let duraklatmaKilitli = false; // Spam engelleme için kilit

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

// Oyunu Duraklat / Devam Ettir Fonksiyonu
function duraklatDevamEt() {
    // Kilit aktifse veya oyun alanı görünür değilse fonksiyondan çık
    if (duraklatmaKilitli || oyunAlani.classList.contains('gizli')) return;

    duraklatildi = !duraklatildi;

    if (duraklatildi) {
        // Oyunu duraklat
        duraklamaBaslangicZamani = Date.now();
        clearInterval(zamanlayici);
        zamanlayiciSesi.pause();
        butonlariDevreDisiBirak();
        duraklatOverlay.classList.remove('gizli');
        duraklatButonu.textContent = "Devam Et";
    } else {
        // Oyuna devam et
        const gecenDuraklamaSuresi = Date.now() - duraklamaBaslangicZamani;
        baslangicZamani += gecenDuraklamaSuresi;
        
        butonlariAktiflestir();
        duraklatOverlay.classList.add('gizli');
        duraklatButonu.textContent = "Duraklat";
        
        // Zamanlayıcıyı kaldığı yerden başlat
        zamanlayiciyiBaslat();

        // Spam engelleme kilidini başlat
        duraklatmaKilitli = true;
        duraklatButonu.disabled = true;
        setTimeout(() => {
            duraklatmaKilitli = false;
            if (!duraklatildi) {
                duraklatButonu.disabled = false;
            }
        }, 1000); // 1 saniye sonra kilidi aç
    }
}

// Zamanlayıcıyı başlatan fonksiyon
function zamanlayiciyiBaslat() {
    clearInterval(zamanlayici);
    zamanlayici = setInterval(() => {
        if (duraklatildi) return;

        const gecenSure = (Date.now() - baslangicZamani) / 1000;
        const yuzde = ((kalanZaman - gecenSure) / kalanZaman) * 100;
        zamanCubugu.style.width = yuzde + '%';

        const maxAralik = 1200;
        const minAralik = 400;
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

// Yeni seviyeyi başlat
function seviyeyiBaslat() {
    // DEĞİŞİKLİK: Oyunun aktif olduğunu ve duraklatma butonunun görünür olması gerektiğini belirtiyoruz.
    duraklatKonteyneri.classList.remove('gizli');
    
    // Overlay'in başlangıçta gizli olduğundan emin oluyoruz.
    duraklatOverlay.classList.add('gizli'); 
    
    duraklatildi = false;
    duraklatmaKilitli = false;
    duraklatButonu.disabled = false;
    duraklatButonu.textContent = "Duraklat";
    
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
    kalanZaman = 15 - mevcutSeviye;
    if (kalanZaman < 4) kalanZaman = 4;

    // Arayüz güncelle
    hedefSayiElementi.textContent = mevcutHedefSayi;
    seviyeGosterge.textContent = mevcutSeviye;
    zamanCubugu.style.width = '100%';
    zamanCubugu.style.backgroundColor = '#4CAF50';
    baslangicZamani = Date.now();
    
    zamanlayiciyiBaslat();
}

// Butonlara tıklama olayları ekle
butonlar.forEach(buton => {
    buton.addEventListener('click', () => {
        if (duraklatildi) return;

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
    // DEĞİŞİKLİK: Oyun bittiği için duraklatma butonunu gizliyoruz.
    duraklatKonteyneri.classList.add('gizli');

    if (kazanmaSesi) kazanmaSesi.play();
    zamanlayiciSesi.pause();
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();

    const gecenSure = (Date.now() - baslangicZamani) / 1000;
    const kalanSaniye = kalanZaman - gecenSure;
    const seviyePuani = mevcutSeviye * 10;
    const zamanBonusu = Math.max(0, kalanSaniye) * 5;
    const kazanilanPuan = Math.round(seviyePuani + zamanBonusu);
    toplamPuan += kazanilanPuan;
    puanGosterge.textContent = toplamPuan;
    
    const gecenSureSaniye = gecenSure.toFixed(2);
    const yeniSkorSatiri = document.createElement('li');
    yeniSkorSatiri.innerHTML = `Seviye ${mevcutSeviye}: <strong>${gecenSureSaniye} sn</strong> (+${kazanilanPuan} Puan)`;
    seviyeListesi.appendChild(yeniSkorSatiri);

    mesajMetni.textContent = `Tebrikler! +${kazanilanPuan} puan kazandın.`;
    sonrakiSeviyeButonu.textContent = "Sonraki Seviye";
    sonrakiSeviyeButonu.disabled = false;
    seviyeSonuMesaji.classList.remove('gizli');
    mevcutSeviye++;
}

// Oyuncu kaybettiğinde
function oyunuKaybet(sebep) {
    // DEĞİŞİKLİK: Oyun bittiği için duraklatma butonunu gizledik.
    duraklatKonteyneri.classList.add('gizli');

    zamanlayiciSesi.pause();
    kaybetmeSesi.play();
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();

    mesajMetni.textContent = `Kaybettin! Sebep: ${sebep}`;
    sonrakiSeviyeButonu.textContent = "Yeniden Başla";
    sonrakiSeviyeButonu.disabled = false;
    seviyeSonuMesaji.classList.remove('gizli');
    seviyeListesi.innerHTML = '';
    mevcutSeviye = 1;
    toplamPuan = 0;
}

// "Sonraki Seviye" veya "Yeniden Başla" butonuna tıklama
sonrakiSeviyeButonu.addEventListener('click', () => {
    if (sonrakiSeviyeButonu.textContent === "Yeniden Başla") {
        baslatmaSesi.play();
    } else {
        if (sonrakiSeviyeSesi) {
            sonrakiSeviyeSesi.play();
        }
    }
    puanGosterge.textContent = toplamPuan;
    seviyeyiBaslat();
});

// "Başla" butonuna tıklanınca oyunu başlat
baslaButonu.addEventListener('click', () => {
    baslangicEkrani.classList.add('gizli');
    oyunAlani.classList.remove('gizli');
    skorTablosu.classList.remove('gizli');
    seviyeyiBaslat();
});

// Olay dinleyicileri
duraklatButonu.addEventListener('click', duraklatDevamEt);
window.addEventListener('keydown', (e) => {
    if (seviyeSonuMesaji.classList.contains('gizli') && e.key.toLowerCase() === 'p') {
        duraklatDevamEt();
    }
});