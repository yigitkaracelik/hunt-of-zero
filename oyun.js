// Arayüzü çözünürlüğe göre dinamik olarak ölçeklendiren fonksiyon
function ekraniOlceklendir() {
    const oyunKapsayici = document.getElementById('oyun-kapsayici');
    if (!oyunKapsayici) return;

    const referansGenislik = 1920;
    const referansYukseklik = 1080;
    const mevcutGenislik = window.innerWidth;
    const mevcutYukseklik = window.innerHeight;

    const olcek = Math.min(mevcutGenislik / referansGenislik, mevcutYukseklik / referansYukseklik);

    // Kapsayıcıyı hem ortalar hem de ölçeklendirir
    oyunKapsayici.style.transform = `translate(-50%, -50%) scale(${olcek})`;
}

// -------------------------------------------------------------------------------- //
// --- SENİN ORİJİNAL KODUN BAŞLIYOR (DEĞİŞİKLİK YOK) ---
// -------------------------------------------------------------------------------- //

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

const ayarlarButonu = document.getElementById('ayarlar-butonu');
const ayarlarPaneli = document.getElementById('ayarlar-paneli');
const ayarlarKapat = document.getElementById('ayarlar-kapat');
const sesAcikCheck = document.getElementById('ses-acik');
const sesSeviye = document.getElementById('ses-seviye');
const zorlukSecim = document.getElementById('zorluk');
const kazanmaSesi = document.getElementById('kazanmaSesi');
const zorlukIkonResmi = document.getElementById('zorluk-ikon-resmi');
// YENİ: Zorluk parametreleri haritası
const zorlukAyarlari = {
    kolay: {
        baslangicZamani: 20, // Saniye
        zamanAzalmasi: 0.5,  // Her seviyede ne kadar süre azalacağı
        minZaman: 8,        // Ulaşılacak minimum süre
        adimArtisOrani: 5,  // Adım sayısı kaç seviyede bir artacak (yüksek = daha yavaş zorlaşır)
        puanCarpani: 0.8    // Kazanılan puan çarpanı
    },
    normal: {
        baslangicZamani: 15,
        zamanAzalmasi: 1,
        minZaman: 4,
        adimArtisOrani: 3,
        puanCarpani: 1
    },
    zor: {
        baslangicZamani: 10,
        zamanAzalmasi: 1,
        minZaman: 3,
        adimArtisOrani: 2, // Adım sayısı daha sık artacak (düşük = daha hızlı zorlaşır)
        puanCarpani: 1.5
    }
};
const zorlukIkonlari = {
    kolay: 'kolay-mod.png',
    normal: 'normal-mod.png',
    zor: 'zor-mod.png'
};

const hedefSayiDaire = document.getElementById('hedef-sayi-daire');

// Hem pause/resume hem de develop özelliklerinden gelen değişkenler birleştirildi
const duraklatButonu = document.getElementById('duraklat-butonu');
const duraklatOverlay = document.getElementById('duraklat-overlay');
const yuksekSkorGosterge = document.getElementById('yuksek-skor-gosterge');
const enYuksekSkorKutusu = document.getElementById('en-yuksek-skor-kutusu');
const leaderboard = document.getElementById('leaderboard');
const hizliZamanlarListesi = document.getElementById('hizli-zamanlar-listesi');

const kazanmaSesi = document.getElementById('kazanmaSesi');
// YENİ EKLENDİ: Duraklatma butonunun konteynerini de yönetmek için seçtik.
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
    if (!sesAcikCheck.checked) {
        zamanlayiciSesi.pause();
        zamanlayiciSesi.currentTime = 0;
    }
});

sesSeviye.addEventListener('input', () => {
    localStorage.setItem('sesSeviye', sesSeviye.value);
});

zorlukSecim.addEventListener('change', () => {
    localStorage.setItem('zorluk', zorlukSecim.value);
    zorlukIkonResmi.src = zorlukIkonlari[zorlukSecim.value];
    oyunuSifirlaVeBasaDon();
});
document.addEventListener('DOMContentLoaded', ayarlariYukle);

// Ses çalma fonksiyonu (bu fonksiyon tüm sesleri kontrol edecek)
function sesCal(ses) {
    if (ses && sesAcikCheck.checked) {
        ses.volume = parseFloat(sesSeviye.value); // Ses seviyesini ayarla
        ses.currentTime = 0;
        ses.play();
    }
}

// Ayarlar panelini açma/kapama olayları
ayarlarButonu.addEventListener('click', () => {
    ayarlarPaneli.classList.toggle('gizli');
});

ayarlarKapat.addEventListener('click', () => {
    ayarlarPaneli.classList.add('gizli');
});

const YUKSEK_SKOR_KEY = 'sayiAvcisiEnYuksekSkor';
// Duraklatma ile ilgili değişkenler
let duraklatildi = false;
let duraklamaBaslangicZamani;
let duraklatmaKilitli = false; // Spam engelleme icin kilit


// Butonları devre dışı bırak
// (Bu fonksiyonun tekrarı aşağıda var, bu tanımı kaldırıldı)

// En yüksek skor ve localStorage anahtarı
let enYuksekSkor = 0;

// Yeni seviyeyi başlat
// (Bu fonksiyonun tekrarı aşağıda var, bu tanımı kaldırıldı)
// Leaderboard için en hızlı zamanlar ve localStorage anahtarı
let enHizliZamanlar = [];
const HIZLI_ZAMANLAR_KEY = 'sayiAvcisiEnHizliZamanlar';

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
    // ÖNCE ÖLÇEKLENDİRME YAPILIR
    ekraniOlceklendir();
    window.addEventListener('resize', ekraniOlceklendir);

    // SONRA SENİN KODUN ÇALIŞIR
    enYuksekSkoruYukle();
    enHizliZamanlariYukle();
    leaderboardGuncelle();
});

function enYuksekSkoruYukle() {
    const storedSkor = localStorage.getItem(YUKSEK_SKOR_KEY);
    if (storedSkor !== null) { enYuksekSkor = parseInt(storedSkor, 10); }
    yuksekSkorGosterge.textContent = enYuksekSkor;
}

function enYuksekSkoruKaydet() {
    localStorage.setItem(YUKSEK_SKOR_KEY, enYuksekSkor.toString());
}

function enYuksekSkoruKontrolEtVeGuncelle() {
    if (toplamPuan > enYuksekSkor) {
        enYuksekSkor = toplamPuan;
        yuksekSkorGosterge.textContent = enYuksekSkor;
        enYuksekSkoruKaydet();
    }
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

// En hızlı zamanları localStorage'dan yükle
function enHizliZamanlariYukle() {
    const storedZamanlar = localStorage.getItem(HIZLI_ZAMANLAR_KEY);
    if (storedZamanlar) { enHizliZamanlar = JSON.parse(storedZamanlar); }
}

function enHizliZamanlariKaydet() {
    localStorage.setItem(HIZLI_ZAMANLAR_KEY, JSON.stringify(enHizliZamanlar));
}

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

function butonlariDevreDisiBirak() { butonlar.forEach(b => b.disabled = true); }
function butonlariAktiflestir() { butonlar.forEach(b => b.disabled = false); }

function seviyeyiBaslat() {
    // DEĞİŞİKLİK: Oyunun aktif olduğunu ve duraklatma butonunun görünür olması gerektiğini belirttik.
    duraklatKonteyneri.classList.remove('gizli');
    
    // Overlay'in başlangıçta gizli olduğundan emin olundu.
    duraklatOverlay.classList.add('gizli'); 
    
    duraklatildi = false;
    duraklatmaKilitli = false;
    duraklatButonu.disabled = false;
    duraklatButonu.textContent = "Duraklat";
    
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


// Seçili zorluk ayarlarını al
const seciliZorluk = zorlukAyarlari[zorlukSecim.value];
zorlukIkonResmi.src = zorlukIkonlari[zorlukSecim.value];


// Çözülebilir hedef sayı oluştur (Zorluğa göre adimSayisi değişiyor)
let geciciHedefSayi = 0;
const adimSayisi = 3 + Math.floor(mevcutSeviye / seciliZorluk.adimArtisOrani); // DÜZELTİLDİ

for (let i = 0; i < adimSayisi; i++) {
    const rastgeleIndex = Math.floor(Math.random() * butonDegerleri.length);
    geciciHedefSayi += butonDegerleri[rastgeleIndex];
}

if (geciciHedefSayi < 10) {
    geciciHedefSayi += 7;
}
mevcutHedefSayi = geciciHedefSayi;

// Zaman ayarı (Zorluğa göre zaman mantığı değişiyor)
kalanZaman = seciliZorluk.baslangicZamani - (mevcutSeviye - 1) * seciliZorluk.zamanAzalmasi; // DEĞİŞTİ
if (kalanZaman < seciliZorluk.minZaman) kalanZaman = seciliZorluk.minZaman; // DEĞİŞTİ

    // Arayüz güncelle

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
            sesCal(zamanlayiciSesi);
            sonSesZamani = Date.now();
        }
        if (yuzde < 50) zamanCubugu.style.backgroundColor = 'orange';
        if (yuzde < 25) zamanCubugu.style.backgroundColor = 'red';
        if (gecenSure >= kalanZaman) oyunuKaybet("Süre doldu!");
    }, 100);
    zamanlayiciyiBaslat();
}

butonlar.forEach(buton => {
    buton.addEventListener('click', () => {

        if (duraklatildi) return;

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

        tiklamaSesi.play();
        if (mevcutHedefSayi === 0) oyunuKazan();
        else if (mevcutHedefSayi < 0) oyunuKaybet("Sıfırın altına düştün!");

    });
    buton.addEventListener('animationend', () => buton.classList.remove('tiklandi'));
});

function oyunuKazan() {
    // DÜZELTME: Kazanma anında yanıp sönmeyi durdurur.
    hedefSayiDaire.classList.remove('kritik-zaman');

    if (kazanmaSesi) {
        sesCal(kazanmaSesi);
    }
    // DEĞİŞİKLİK: Oyun bittiği için duraklatma butonunu gizledik.
    duraklatKonteyneri.classList.add('gizli');

    if (kazanmaSesi) kazanmaSesi.play();
    zamanlayiciSesi.pause();
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();
    const gecenSure = (Date.now() - baslangicZamani) / 1000;
    const kalanSaniye = kalanZaman - gecenSure;


    // 2. Yeni puanlama formülünü uygula
    const seciliZorluk = zorlukAyarlari[zorlukSecim.value];

// 2. Yeni puanlama formülünü uygula (Zorluğa göre puan çarpanı ekleniyor)
const seviyePuani = mevcutSeviye * 10;
const zamanBonusu = Math.max(0, kalanSaniye) * 5;
const kazanilanPuan = Math.round((seviyePuani + zamanBonusu) * seciliZorluk.puanCarpani); // DEĞİŞTİ
    // 3. Toplam puanı güncelle

    
    const seviyePuani = mevcutSeviye * 10;
    const zamanBonusu = Math.max(0, kalanSaniye) * 5;
    const kazanilanPuan = Math.round(seviyePuani + zamanBonusu);


    toplamPuan += kazanilanPuan;
    puanGosterge.textContent = toplamPuan;
    enYuksekSkoruKontrolEtVeGuncelle();

    const gecenSureSaniye = gecenSure.toFixed(2);

// develop branch'inden gelen kritik fonksiyon çağrısı
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

function oyunuKaybet(sebep) {
    // DEĞİŞİKLİK: Oyun bittiği için duraklatma butonunu gizledik.
    duraklatKonteyneri.classList.add('gizli');

    zamanlayiciSesi.pause();
    sesCal(kaybetmeSesi);
    clearInterval(zamanlayici);
    butonlariDevreDisiBirak();

    hedefSayiDaire.classList.remove('kritik-zaman');
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
// YENİ FONKSİYON: Zorluk değiştiğinde oyunu sıfırlar ve başlangıç ekranına döner.
function oyunuSifirlaVeBasaDon() {
    // 1. O an çalışan bir zamanlayıcı varsa durdur
    clearInterval(zamanlayici);


    // 2. Oyun değişkenlerini başlangıç değerlerine döndür
    mevcutSeviye = 1;
    toplamPuan = 0;
    
    // 3. Arayüzdeki göstergeleri sıfırla
    puanGosterge.textContent = toplamPuan;
    seviyeListesi.innerHTML = ''; // Skor tablosunu temizle

    // 4. Ekranları yönet: Oyun alanını ve skoru gizle, başlangıç ekranını göster
    oyunAlani.classList.add('gizli');
    skorTablosu.classList.add('gizli');
    seviyeSonuMesaji.classList.add('gizli'); // Seviye sonu mesajını da gizle
    baslangicEkrani.classList.remove('gizli');

    // 5. Ayarlar panelini otomatik olarak kapat
    ayarlarPaneli.classList.add('gizli');
}
// "Sonraki Seviye" veya "Yeniden Başla" butonuna tıklama


sonrakiSeviyeButonu.addEventListener('click', () => {
    if (sonrakiSeviyeButonu.textContent === "Yeniden Başla") {
       sesCal(baslatmaSesi);
    } else {
        if (sonrakiSeviyeSesi) {
            sesCal(sonrakiSeviyeSesi);
        }
    }
    puanGosterge.textContent = toplamPuan;
    seviyeyiBaslat();
});

baslaButonu.addEventListener('click', () => {
    baslangicEkrani.classList.add('gizli');
    oyunAlani.classList.remove('gizli');
    skorTablosu.classList.remove('gizli');
    leaderboard.classList.remove('gizli');
    enYuksekSkorKutusu.classList.remove('gizli');
    seviyeyiBaslat();
});

// Olay dinleyicileri
duraklatButonu.addEventListener('click', duraklatDevamEt);
window.addEventListener('keydown', (e) => {
    if (seviyeSonuMesaji.classList.contains('gizli') && e.key.toLowerCase() === 'p') {
        duraklatDevamEt();
    }
});