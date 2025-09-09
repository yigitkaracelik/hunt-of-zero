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
const hedefSayiDaire = document.getElementById('hedef-sayi-daire');

// Eğer kazanma sesi varsa, tanımlayın (HTML'de yoksa bu satırı kaldırabilirsiniz)
const kazanmaSesi = document.getElementById('kazanmaSesi');

// Oyun durumu değişkenleri
let mevcutSeviye = 1;
let toplamPuan = 0;
let mevcutHedefSayi = 0;
let zamanlayici;
let kalanZaman;
let baslangicZamani;
let sonSesZamani = 0;

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
    // Önceki seviyeden kalma animasyon sınıfını temizle
    hedefSayiDaire.classList.remove('kritik-zaman');

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

    clearInterval(zamanlayici);
    zamanlayici = setInterval(() => {
        const gecenSure = (Date.now() - baslangicZamani) / 1000;
        
        // Yüzdeyi hesapla ve 0-100 arasına sıkıştır (clamp)
        let yuzde = ((kalanZaman - gecenSure) / kalanZaman) * 100;
        yuzde = Math.max(0, Math.min(100, yuzde));

        zamanCubugu.style.width = yuzde + '%';

        // Kritik eşik kontrolü ile yanıp sönme sınıfını yönet
        if (yuzde < 10) {
            hedefSayiDaire.classList.add('kritik-zaman');
        } else {
            hedefSayiDaire.classList.remove('kritik-zaman');
        }

        // Ses hızını ayarla
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
            hedefSayiDaire.classList.remove('kritik-zaman');
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
    // DÜZELTME: Kazanma anında yanıp sönmeyi durdurur.
    hedefSayiDaire.classList.remove('kritik-zaman');

    if (kazanmaSesi) {
        kazanmaSesi.play();
    }
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
    zamanlayiciSesi.pause();
    kaybetmeSesi.play();
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();

    hedefSayiDaire.classList.remove('kritik-zaman');

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