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
const ayarlarButonu = document.getElementById('ayarlar-butonu');
const ayarlarPaneli = document.getElementById('ayarlar-paneli');
const ayarlarKapat = document.getElementById('ayarlar-kapat');
const sesAcikCheck = document.getElementById('ses-acik');
const sesSeviye = document.getElementById('ses-seviye');
const zorlukSecim = document.getElementById('zorluk');
const kazanmaSesi = document.getElementById('kazanmaSesi');

// Oyun durumu değişkenleri
let mevcutSeviye = 1;
let toplamPuan = 0;
let mevcutHedefSayi = 0;
let zamanlayici;
let kalanZaman;
let baslangicZamani;
let sonSesZamani = 0;

// ----------------- AYARLAR MANTIĞI -----------------

// ----------------- AYARLARI YÜKLEME VE KAYDETME -----------------

// Sayfa ilk yüklendiğinde localStorage'dan ayarları çeken fonksiyon
function ayarlariYukle() {
    // 1. Kayıtlı "Ses Açık" durumunu al ve uygula
    const kayitliSesAcik = localStorage.getItem('sesAcik');
    if (kayitliSesAcik !== null) {
        // localStorage 'true'/'false' string olarak saklar, bunu boolean'a çeviriyoruz
        sesAcikCheck.checked = (kayitliSesAcik === 'true');
    }

    // 2. Kayıtlı "Ses Seviyesi" değerini al ve uygula
    const kayitliSesSeviye = localStorage.getItem('sesSeviye');
    if (kayitliSesSeviye !== null) {
        sesSeviye.value = kayitliSesSeviye;
    }

    // 3. Kayıtlı "Zorluk" seviyesini al ve uygula
    const kayitliZorluk = localStorage.getItem('zorluk');
    if (kayitliZorluk !== null) {
        zorlukSecim.value = kayitliZorluk;
    }
}

// Kullanıcı bir ayarı değiştirdiğinde bunu localStorage'a kaydeden olaylar
sesAcikCheck.addEventListener('change', () => {
    localStorage.setItem('sesAcik', sesAcikCheck.checked);
});

sesSeviye.addEventListener('input', () => {
    localStorage.setItem('sesSeviye', sesSeviye.value);
});

zorlukSecim.addEventListener('change', () => {
    localStorage.setItem('zorluk', zorlukSecim.value);
});
document.addEventListener('DOMContentLoaded', ayarlariYukle);

// Ses çalma fonksiyonu (bu fonksiyon tüm sesleri kontrol edecek)
function sesCal(ses) {
    if (ses && sesAcikCheck.checked) {
        ses.volume = parseFloat(sesSeviye.value); // Ses seviyesini ayarla
        ses.currentTime = 0;
        sesCal(ses);
    }
}

// Zorluk katsayısını döndüren fonksiyon
function zorlukKatsayisi() {
    switch (zorlukSecim.value) {
        case "kolay": return 1.5;
        case "zor": return 0.7;
        default: return 1;
    }
}

// Ayarlar panelini açma/kapama olayları
ayarlarButonu.addEventListener('click', () => {
    ayarlarPaneli.classList.toggle('gizli');
});

ayarlarKapat.addEventListener('click', () => {
    ayarlarPaneli.classList.add('gizli');
});

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
    kalanZaman = (15 - mevcutSeviye) * zorlukKatsayisi();
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
        const yuzde = ((kalanZaman - gecenSure) / kalanZaman) * 100;
        zamanCubugu.style.width = yuzde + '%';

        // Ses hızını ayarla
        const maxAralik = 1200;
        const minAralik = 400;
        const suAnkiAralik = minAralik + (yuzde / 100) * (maxAralik - minAralik);

        if (Date.now() - sonSesZamani > suAnkiAralik) {
            zamanlayiciSesi.currentTime = 0;
            sesCal(zamanlayiciSesi);
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
        sesCal(tiklamaSesi);

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
        sesCal(kazanmaSesi);
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

    // -----------------------------------------------------------
    
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
    sesCal(kaybetmeSesi);
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();

    mesajMetni.textContent = `Kaybettin! Sebep: ${sebep}`;
    sonrakiSeviyeButonu.textContent = "Yeniden Başla";
    sonrakiSeviyeButonu.disabled = false; // Butonu aktif yap
    seviyeSonuMesaji.classList.remove('gizli');

    seviyeListesi.innerHTML = '';
    mevcutSeviye = 1;
    toplamPuan = 0;
}

// "Sonraki Seviye" veya "Yeniden Başla" butonuna tıklama
sonrakiSeviyeButonu.addEventListener('click', () => {
    // Önce hangi sesin çalınacağına karar verelim
    if (sonrakiSeviyeButonu.textContent === "Yeniden Başla") {
       sesCal(baslatmaSesi);
    } else {
        // Eğer butonun üzerinde "Yeniden Başla" yazmıyorsa,
        // bu "Sonraki Seviye" durumudur. İlgili sesi çalalım.
        // `sonrakiSeviyeSesi` değişkeninin null olmamasını kontrol edelim.
        if (sonrakiSeviyeSesi) {
            sesCal(sonrakiSeviyeSesi);
        }
    }
    
    // Ses çalındıktan sonra, her durumda yapılması gereken işlemleri yapalım
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