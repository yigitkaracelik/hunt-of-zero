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
const yuksekSkorGosterge = document.getElementById('yuksek-skor-gosterge');
const enYuksekSkorKutusu = document.getElementById('en-yuksek-skor-kutusu'); // Yeni kutuyu seç
const leaderboard = document.getElementById('leaderboard');
const hizliZamanlarListesi = document.getElementById('hizli-zamanlar-listesi');
const kazanmaSesi = document.getElementById('kazanmaSesi');

// Oyun durumu değişkenleri
let mevcutSeviye = 1;
let toplamPuan = 0;
let mevcutHedefSayi = 0;
let zamanlayici;
let kalanZaman;
let baslangicZamani;
let sonSesZamani = 0;

// En yüksek skor ve localStorage anahtarı
let enYuksekSkor = 0;
const YUKSEK_SKOR_KEY = 'sayiAvcisiEnYuksekSkor';

// Leaderboard için en hızlı zamanlar ve localStorage anahtarı
let enHizliZamanlar = [];
const HIZLI_ZAMANLAR_KEY = 'sayiAvcisiEnHizliZamanlar';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    enYuksekSkoruYukle();
    enHizliZamanlariYukle();
    leaderboardGuncelle();
});

// En yüksek skoru localStorage'dan yükle
function enYuksekSkoruYukle() {
    const storedSkor = localStorage.getItem(YUKSEK_SKOR_KEY);
    if (storedSkor !== null) {
        enYuksekSkor = parseInt(storedSkor, 10);
    }
    yuksekSkorGosterge.textContent = enYuksekSkor;
}

// En yüksek skoru localStorage'a kaydet
function enYuksekSkoruKaydet() {
    localStorage.setItem(YUKSEK_SKOR_KEY, enYuksekSkor.toString());
}

// En yüksek skoru kontrol et ve güncelle
function enYuksekSkoruKontrolEtVeGuncelle() {
    if (toplamPuan > enYuksekSkor) {
        enYuksekSkor = toplamPuan;
        yuksekSkorGosterge.textContent = enYuksekSkor;
        enYuksekSkoruKaydet();
    }
}

// En hızlı zamanları localStorage'dan yükle
function enHizliZamanlariYukle() {
    const storedZamanlar = localStorage.getItem(HIZLI_ZAMANLAR_KEY);
    if (storedZamanlar) {
        enHizliZamanlar = JSON.parse(storedZamanlar);
    }
}

// En hızlı zamanları localStorage'a kaydet
function enHizliZamanlariKaydet() {
    localStorage.setItem(HIZLI_ZAMANLAR_KEY, JSON.stringify(enHizliZamanlar));
}

// Leaderboard'u güncelle
function leaderboardGuncelle() {
    hizliZamanlarListesi.innerHTML = '';
    enHizliZamanlar.sort((a, b) => a.zaman - b.zaman);

    for (let i = 0; i < Math.min(enHizliZamanlar.length, 5); i++) {
        const item = enHizliZamanlar[i];
        const listItem = document.createElement('li');
        listItem.textContent = `${item.zaman.toFixed(2)} sn - ${item.seviye}. Sv`;
        hizliZamanlarListesi.appendChild(listItem);
    }
}

// Butonları devre dışı bırak/aktif yap
function butonlariDevreDisiBirak() { butonlar.forEach(b => b.disabled = true); }
function butonlariAktiflestir() { butonlar.forEach(b => b.disabled = false); }

// Yeni seviyeyi başlat
function seviyeyiBaslat() {
    butonlariAktiflestir();
    seviyeSonuMesaji.classList.add('gizli');

    const olasiRakamlar = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => 0.5 - Math.random());
    const butonDegerleri = [];
    butonlar.forEach((buton, index) => {
        const yeniRakam = olasiRakamlar[index];
        buton.textContent = yeniRakam;
        buton.dataset.deger = yeniRakam;
        butonDegerleri.push(yeniRakam);
    });

    let geciciHedefSayi = 0;
    const adimSayisi = 3 + Math.floor(mevcutSeviye / 3);
    for (let i = 0; i < adimSayisi; i++) {
        geciciHedefSayi += butonDegerleri[Math.floor(Math.random() * butonDegerleri.length)];
    }
    if (geciciHedefSayi < 10) geciciHedefSayi += 7;
    mevcutHedefSayi = geciciHedefSayi;

    kalanZaman = Math.max(5, 15 - Math.floor(mevcutSeviye / 2));

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

        const suAnkiAralik = 400 + (yuzde / 100) * 800;
        if (Date.now() - sonSesZamani > suAnkiAralik) {
            zamanlayiciSesi.currentTime = 0;
            zamanlayiciSesi.play();
            sonSesZamani = Date.now();
        }

        if (yuzde < 50) zamanCubugu.style.backgroundColor = 'orange';
        if (yuzde < 25) zamanCubugu.style.backgroundColor = 'red';
        if (gecenSure >= kalanZaman) oyunuKaybet("Süre doldu!");
    }, 100);
}

// Buton tıklama olayları
butonlar.forEach(buton => {
    buton.addEventListener('click', () => {
        buton.classList.add('tiklandi');
        const cikarilacakDeger = parseInt(buton.dataset.deger);
        mevcutHedefSayi -= cikarilacakDeger;
        hedefSayiElementi.textContent = mevcutHedefSayi;
        tiklamaSesi.currentTime = 0;
        tiklamaSesi.play();
        if (mevcutHedefSayi === 0) oyunuKazan();
        else if (mevcutHedefSayi < 0) oyunuKaybet("Sıfırın altına düştün!");
    });
    buton.addEventListener('animationend', () => buton.classList.remove('tiklandi'));
});

// Oyunu kazanma
function oyunuKazan() {
    if (kazanmaSesi) kazanmaSesi.play();
    zamanlayiciSesi.pause();
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();

    const gecenSure = (Date.now() - baslangicZamani) / 1000;
    const kalanSaniye = kalanZaman - gecenSure;
    const kazanilanPuan = Math.round((mevcutSeviye * 10) + (Math.max(0, kalanSaniye) * 5));
    toplamPuan += kazanilanPuan;
    puanGosterge.textContent = toplamPuan;

    enYuksekSkoruKontrolEtVeGuncelle();
    
    const yeniSkorSatiri = document.createElement('li');
    yeniSkorSatiri.innerHTML = `Seviye ${mevcutSeviye}: <strong>${gecenSure.toFixed(2)} sn</strong> (+${kazanilanPuan} Puan)`;
    seviyeListesi.appendChild(yeniSkorSatiri);

    enHizliZamanlar.push({ zaman: gecenSure, seviye: mevcutSeviye });
    enHizliZamanlariKaydet();
    leaderboardGuncelle();

    mesajMetni.textContent = `Tebrikler! +${kazanilanPuan} puan kazandın.`;
    sonrakiSeviyeButonu.textContent = "Sonraki Seviye";
    sonrakiSeviyeButonu.disabled = false;
    seviyeSonuMesaji.classList.remove('gizli');

    mevcutSeviye++;
}

// Oyunu kaybetme
function oyunuKaybet(sebep) {
    zamanlayiciSesi.pause();
    kaybetmeSesi.play();
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();

    mesajMetni.textContent = `Kaybettin! Sebep: ${sebep}. Puanın: ${toplamPuan}`;
    sonrakiSeviyeButonu.textContent = "Yeniden Başla";
    sonrakiSeviyeButonu.disabled = false;
    seviyeSonuMesaji.classList.remove('gizli');

    enYuksekSkoruKontrolEtVeGuncelle();

    seviyeListesi.innerHTML = '';
    mevcutSeviye = 1;
    toplamPuan = 0;
    puanGosterge.textContent = toplamPuan;
}

// Sonraki seviye / Yeniden başla butonu
sonrakiSeviyeButonu.addEventListener('click', () => {
    if (sonrakiSeviyeButonu.textContent === "Yeniden Başla") {
        baslatmaSesi.play();
    } else if (sonrakiSeviyeSesi) {
        sonrakiSeviyeSesi.play();
    }
    puanGosterge.textContent = toplamPuan;
    seviyeyiBaslat();
});

// "Başla" butonu
baslaButonu.addEventListener('click', () => {
    baslangicEkrani.classList.add('gizli');
    oyunAlani.classList.remove('gizli');
    skorTablosu.classList.remove('gizli');
    leaderboard.classList.remove('gizli');
    enYuksekSkorKutusu.classList.remove('gizli'); // En yüksek skor kutusunu görünür yap
    seviyeyiBaslat();
});