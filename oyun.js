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
    sesCubugunuGuncelle(sesSeviye);
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
    sesCubugunuGuncelle(sesSeviye);
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

// Butonları devre dışı bırak
function butonlariDevreDisiBirak() {
    butonlar.forEach(buton => {
        buton.disabled = true;
    });
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
}

// Buton tıklama olayları
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
    buton.addEventListener('animationend', () => buton.classList.remove('tiklandi'));
});

// Oyunu kazanma
function oyunuKazan() {
    if (kazanmaSesi) {
        sesCal(kazanmaSesi);
    }
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
    sesCal(kaybetmeSesi);
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
        // Eğer butonun üzerinde "Yeniden Başla" yazmıyorsa,
        // bu "Sonraki Seviye" durumudur. İlgili sesi çalalım.
        // `sonrakiSeviyeSesi` değişkeninin null olmamasını kontrol edelim.
        if (sonrakiSeviyeSesi) {
            sesCal(sonrakiSeviyeSesi);
        }
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
// YENİ FONKSİYON: Kurukafa ses çubuğunun dolgusunu günceller
function sesCubugunuGuncelle(slider) {
    const min = slider.min;
    const max = slider.max;
    const value = slider.value;
    
    // Slider'ın yüzde kaç dolu olduğunu hesapla
    const yuzde = ((value - min) / (max - min)) * 100;
    
    // Arkaplanı dinamik olarak ayarla: Belirli bir yüzdeye kadar dolgu, sonrası boş
    const dolguRengi = '#39ff14'; // Parlak yeşil renk
    const bosRenk = 'rgba(0, 0, 0, 0.4)'; // Hafif şeffaf koyu renk
    
    slider.style.background = `linear-gradient(to right, ${dolguRengi} ${yuzde}%, ${bosRenk} ${yuzde}%)`;
}