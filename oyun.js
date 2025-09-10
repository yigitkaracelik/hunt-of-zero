(function () {
    // -------------------- EKRANI ÖLÇEKLENDİR --------------------
    function ekraniOlceklendir() {
        const oyunKapsayici = document.getElementById('oyun-kapsayici');
        if (!oyunKapsayici) return;
        const referansGenislik = 1920;
        const referansYukseklik = 1080;
        const mevcutGenislik = window.innerWidth;
        const mevcutYukseklik = window.innerHeight;
        const olcek = Math.min(mevcutGenislik / referansGenislik, mevcutYukseklik / referansYukseklik);
        const computed = window.getComputedStyle(oyunKapsayici);
        if (computed.position === 'static') {
            oyunKapsayici.style.position = 'absolute';
            oyunKapsayici.style.left = '50%';
            oyunKapsayici.style.top = '50%';
        }
        oyunKapsayici.style.transformOrigin = '50% 50%';
        oyunKapsayici.style.transform = `translate(-50%, -50%) scale(${olcek})`;
    }

    // -------------------- ELEMENT SEÇİMLERİ --------------------
    const get = id => document.getElementById(id);
    const hedefSayiElementi = get('hedef-sayi');
    const butonlar = document.querySelectorAll('.islem-butonu');
    const seviyeGosterge = get('seviye-gosterge');
    const puanGosterge = get('puan-gosterge');
    const zamanCubugu = get('zaman-cubugu-ic');
    const seviyeSonuMesaji = get('seviye-sonu-mesaji');
    const mesajMetni = get('mesaj-metni');
    const sonrakiSeviyeButonu = get('sonraki-seviye-butonu');
    const seviyeListesi = get('seviye-listesi');
    const tiklamaSesi = get('tiklamaSesi');
    const kaybetmeSesi = get('kaybetmeSesi');
    const baslatmaSesi = get('baslatmaSesi');
    const zamanlayiciSesi = get('zamanlayiciSesi');
    const baslangicEkrani = get('baslangic-ekrani');
    const baslaButonu = get('basla-butonu');
    const oyunAlani = get('oyun-alani');
    const skorTablosu = get('skor-tablosu');
    const ayarlarButonu = get('ayarlar-butonu');
    const ayarlarPaneli = get('ayarlar-paneli');
    const ayarlarKapat = get('ayarlar-kapat');
    const sesAcikCheck = get('ses-acik');
    const sesSeviye = get('ses-seviye');
    const zorlukSecim = get('zorluk');
    const kazanmaSesi = get('kazanmaSesi');
    const zorlukIkonResmi = get('zorluk-ikon-resmi');
    const hedefSayiDaire = get('hedef-sayi-daire');
    const gecenSureSaniye = get('gecen-sure-saniye');
    const duraklatButonu = get('duraklat-butonu');
    const duraklatOverlay = get('duraklat-overlay');
    const yuksekSkorGosterge = get('yuksek-skor-gosterge');
    const enYuksekSkorKutusu = get('en-yuksek-skor-kutusu');
    const leaderboard = get('leaderboard');
    const hizliZamanlarListesi = get('hizli-zamanlar-listesi');
    const duraklatKonteyneri = get('duraklat-konteyneri');
    const sonrakiSeviyeSesi = get('sonrakiSeviyeSesi');

    // -------------------- ZORLUK AYARLARI --------------------
    const zorlukAyarlari = {
        kolay: { baslangicZamani: 20, zamanAzalmasi: 0.5, minZaman: 8, adimArtisOrani: 5, puanCarpani: 0.8 },
        normal: { baslangicZamani: 15, zamanAzalmasi: 1, minZaman: 4, adimArtisOrani: 3, puanCarpani: 1 },
        zor: { baslangicZamani: 10, zamanAzalmasi: 1, minZaman: 3, adimArtisOrani: 2, puanCarpani: 1.5 }
    };
    const zorlukIkonlari = {
        kolay: 'kolay-mod.png',
        normal: 'normal-mod.png',
        zor: 'zor-mod.png'
    };

    // -------------------- OYUN DURUM DEĞİŞKENLERİ --------------------
    let mevcutSeviye = 1;
    let toplamPuan = 0;
    let mevcutHedefSayi = 0;
    let zamanlayici = null;
    let kalanZaman = 0;
    let baslangicZamani = 0;
    let sonSesZamani = 0;
    let seslerHazirMi = false;
    const YUKSEK_SKOR_KEY = 'sayiAvcisiEnYuksekSkor';
    let enYuksekSkor = 0;
    let butonDegerleri = [];
    let duraklatildi = false;
    let duraklamaBaslangicZamani = 0;
    let duraklatmaKilitli = false;
    let enHizliZamanlar = [];
    const HIZLI_ZAMANLAR_KEY = 'sayiAvcisiEnHizliZamanlar';

    // -------------------- SES ÇALMA --------------------
    function sesCal(ses) {
        if (!ses || !sesAcikCheck) return;
        if (!sesAcikCheck.checked) return;
        try {
            ses.volume = parseFloat(sesSeviye ? sesSeviye.value : 1);
            ses.currentTime = 0;
            const playPromise = ses.play();
            if (playPromise && typeof playPromise.then === 'function') {
                playPromise.catch(() => {});
            }
        } catch (e) {}
    }

    // -------------------- AYARLARI YÜKLE / KAYDET --------------------
    function ayarlariYukle() {
        if (sesAcikCheck) {
            const kayitliSesAcik = localStorage.getItem('sesAcik');
            if (kayitliSesAcik !== null) sesAcikCheck.checked = (kayitliSesAcik === 'true');
        }
        if (sesSeviye) {
            const kayitliSesSeviye = localStorage.getItem('sesSeviye');
            if (kayitliSesSeviye !== null) sesSeviye.value = kayitliSesSeviye;
        }
        if (zorlukSecim) {
            const kayitliZorluk = localStorage.getItem('zorluk');
            if (kayitliZorluk && zorlukAyarlari[kayitliZorluk]) zorlukSecim.value = kayitliZorluk;
            zorlukIkonResmi && (zorlukIkonResmi.src = zorlukIkonlari[zorlukSecim.value] || '');
        }
    }

    if (sesAcikCheck) {
        sesAcikCheck.addEventListener('change', () => {
            localStorage.setItem('sesAcik', sesAcikCheck.checked);
            if (!sesAcikCheck.checked && zamanlayiciSesi) {
                zamanlayiciSesi.pause();
                zamanlayiciSesi.currentTime = 0;
            }
        });
    }

    if (sesSeviye) {
        sesSeviye.addEventListener('input', () => localStorage.setItem('sesSeviye', sesSeviye.value));
    }

    if (zorlukSecim) {
        zorlukSecim.addEventListener('change', () => {
            localStorage.setItem('zorluk', zorlukSecim.value);
            if (zorlukIkonResmi) zorlukIkonResmi.src = zorlukIkonlari[zorlukSecim.value] || '';
            oyunuSifirlaVeBasaDon();
        });
    }

    // -------------------- SESLERİ HAZIRLA --------------------
    function sesleriHazirla() {
        if (seslerHazirMi) return;
        const tumSesler = [tiklamaSesi, kaybetmeSesi, baslatmaSesi, sonrakiSeviyeSesi, zamanlayiciSesi, kazanmaSesi];
        tumSesler.forEach(ses => {
            if (!ses) return;
            try {
                ses.volume = 0;
                const p = ses.play();
                if (p && typeof p.then === 'function') {
                    p.then(() => {
                        ses.pause();
                        ses.currentTime = 0;
                        ses.volume = 1;
                    }).catch(() => {
                        ses.pause();
                        ses.currentTime = 0;
                        ses.volume = 1;
                    });
                } else {
                    ses.pause();
                    ses.currentTime = 0;
                    ses.volume = 1;
                }
            } catch (e) {}
        });
        seslerHazirMi = true;
    }

    // -------------------- SKOR & LEADERBOARD --------------------
    function enYuksekSkoruYukle() {
        const stored = localStorage.getItem(YUKSEK_SKOR_KEY);
        if (stored !== null) enYuksekSkor = parseInt(stored, 10) || 0;
        if (yuksekSkorGosterge) yuksekSkorGosterge.textContent = enYuksekSkor;
    }
    function enYuksekSkoruKaydet() {
        localStorage.setItem(YUKSEK_SKOR_KEY, enYuksekSkor.toString());
    }
    function enYuksekSkoruKontrolEtVeGuncelle() {
        if (toplamPuan > enYuksekSkor) {
            enYuksekSkor = toplamPuan;
            if (yuksekSkorGosterge) yuksekSkorGosterge.textContent = enYuksekSkor;
            enYuksekSkoruKaydet();
        }
    }
    function enHizliZamanlariYukle() {
        const stored = localStorage.getItem(HIZLI_ZAMANLAR_KEY);
        if (stored) enHizliZamanlar = JSON.parse(stored);
    }
    function enHizliZamanlariKaydet() {
        localStorage.setItem(HIZLI_ZAMANLAR_KEY, JSON.stringify(enHizliZamanlar));
    }
    function leaderboardGuncelle() {
        if (!hizliZamanlarListesi) return;
        hizliZamanlarListesi.innerHTML = '';
        enHizliZamanlar.sort((a, b) => a.zaman - b.zaman);
        for (let i = 0; i < Math.min(enHizliZamanlar.length, 5); i++) {
            const item = enHizliZamanlar[i];
            const li = document.createElement('li');
            li.textContent = `${item.zaman.toFixed(2)} sn - ${item.seviye}. Sv`;
            hizliZamanlarListesi.appendChild(li);
        }
    }

    // -------------------- BUTONLARI DEVRE DIŞI / AKTİF --------------------
    function butonlariDevreDisiBirak() { butonlar.forEach(b => b.disabled = true); }
    function butonlariAktiflestir() { butonlar.forEach(b => b.disabled = false); }

    // -------------------- ZAMANLAYICI --------------------
    function zamanlayiciyiBaslat() {
        clearInterval(zamanlayici);
        zamanlayici = setInterval(() => {
            if (duraklatildi) return;
            const gecenSure = (Date.now() - baslangicZamani) / 1000;
            let yuzde = ((kalanZaman - gecenSure) / kalanZaman) * 100;
            yuzde = Math.max(0, Math.min(100, yuzde));
            if (zamanCubugu) zamanCubugu.style.width = yuzde + '%';
            if (hedefSayiDaire) {
                if (yuzde < 10) hedefSayiDaire.classList.add('kritik-zaman');
                else hedefSayiDaire.classList.remove('kritik-zaman');
            }
            const maxAralik = 1200;
            const minAralik = 400;
            const suAnkiAralik = minAralik + (yuzde / 100) * (maxAralik - minAralik);
            if (Date.now() - sonSesZamani > suAnkiAralik) {
                sesCal(zamanlayiciSesi);
                sonSesZamani = Date.now();
            }
            if (yuzde < 50 && zamanCubugu) zamanCubugu.style.backgroundColor = 'orange';
            if (yuzde < 25 && zamanCubugu) zamanCubugu.style.backgroundColor = 'red';
            if (gecenSure >= kalanZaman) {
                hedefSayiDaire && hedefSayiDaire.classList.remove('kritik-zaman');
                oyunuKaybet("Süre doldu!");
            }
        }, 100);
    }

    // -------------------- OYUNU BAŞLAT / SEVİYE --------------------
    function seviyeyiBaslat() {
        duraklatKonteyneri && duraklatKonteyneri.classList.remove('gizli');
        duraklatOverlay && duraklatOverlay.classList.add('gizli');
        duraklatildi = false;
        duraklatmaKilitli = false;
        if (duraklatButonu) { duraklatButonu.disabled = false; duraklatButonu.textContent = "Duraklat"; }
        butonlariAktiflestir();
        seviyeSonuMesaji && seviyeSonuMesaji.classList.add('gizli');
        const olasiRakamlar = [1,2,3,4,5,6,7,8,9].sort(() => 0.5 - Math.random());
        butonDegerleri = [];
        butonlar.forEach((buton, index) => {
            const yeniRakam = olasiRakamlar[index] || (index+1);
            buton.textContent = yeniRakam;
            buton.dataset.deger = yeniRakam;
            butonDegerleri.push(yeniRakam);
        });
        const seciliZorluk = zorlukAyarlari[(zorlukSecim && zorlukSecim.value) || 'normal'];
        let geciciHedefSayi = 0;
        const adimSayisi = 3 + Math.floor(mevcutSeviye / seciliZorluk.adimArtisOrani);
        for (let i = 0; i < adimSayisi; i++) {
            const rastgeleIndex = Math.floor(Math.random() * butonDegerleri.length);
            geciciHedefSayi += butonDegerleri[rastgeleIndex];
        }
        if (geciciHedefSayi < 10) geciciHedefSayi += 7;
        mevcutHedefSayi = geciciHedefSayi;
        kalanZaman = seciliZorluk.baslangicZamani - (mevcutSeviye - 1) * seciliZorluk.zamanAzalmasi;
        if (kalanZaman < seciliZorluk.minZaman) kalanZaman = seciliZorluk.minZaman;
        if (hedefSayiElementi) hedefSayiElementi.textContent = mevcutHedefSayi;
        if (seviyeGosterge) seviyeGosterge.textContent = mevcutSeviye;
        if (zamanCubugu) {
            zamanCubugu.style.width = '100%';
            zamanCubugu.style.backgroundColor = '#4CAF50';
        }
        baslangicZamani = Date.now();
        clearInterval(zamanlayici);
        zamanlayiciyiBaslat();
    }

    // -------------------- OYUN KAZANMA / KAYBETME --------------------
    function oyunuKazan() {
        hedefSayiDaire && hedefSayiDaire.classList.remove('kritik-zaman');
        sesCal(kazanmaSesi);
        duraklatKonteyneri && duraklatKonteyneri.classList.add('gizli');
        zamanlayiciSesi && zamanlayiciSesi.pause();
        clearInterval(zamanlayici);
        butonlariDevreDisiBirak();
        const gecenSure = (Date.now() - baslangicZamani) / 1000;
        const kalanSaniye = Math.max(0, kalanZaman - gecenSure);
        const seciliZorluk = zorlukAyarlari[(zorlukSecim && zorlukSecim.value) || 'normal'];
        const seviyePuani = mevcutSeviye * 10;
        const zamanBonusu = Math.max(0, kalanSaniye) * 5;
        const kazanilanPuan = Math.round((seviyePuani + zamanBonusu) * seciliZorluk.puanCarpani);
        toplamPuan += kazanilanPuan;
        if (puanGosterge) puanGosterge.textContent = toplamPuan;
        enYuksekSkoruKontrolEtVeGuncelle();
        const yeniSkorSatiri = document.createElement('li');
        yeniSkorSatiri.innerHTML = `Seviye ${mevcutSeviye}: <strong>${gecenSure.toFixed(2)} sn</strong> (+${kazanilanPuan} Puan)`;
        seviyeListesi && seviyeListesi.appendChild(yeniSkorSatiri);
        enHizliZamanlar.push({ zaman: gecenSure, seviye: mevcutSeviye });
        enHizliZamanlariKaydet();
        leaderboardGuncelle();
        if (mesajMetni) mesajMetni.textContent = `Tebrikler! +${kazanilanPuan} puan kazandın.`;
        if (sonrakiSeviyeButonu) { sonrakiSeviyeButonu.textContent = "Sonraki Seviye"; sonrakiSeviyeButonu.disabled = false; }
        seviyeSonuMesaji && seviyeSonuMesaji.classList.remove('gizli');
        mevcutSeviye++;
    }

    function oyunuKaybet(sebep) {
        duraklatKonteyneri && duraklatKonteyneri.classList.add('gizli');
        zamanlayiciSesi && zamanlayiciSesi.pause();
        sesCal(kaybetmeSesi);
        clearInterval(zamanlayici);
        butonlariDevreDisiBirak();
        hedefSayiDaire && hedefSayiDaire.classList.remove('kritik-zaman');
        if (mesajMetni) mesajMetni.textContent = `Kaybettin! Sebep: ${sebep}. Puanın: ${toplamPuan}`;
        if (sonrakiSeviyeButonu) { sonrakiSeviyeButonu.textContent = "Yeniden Başla"; sonrakiSeviyeButonu.disabled = false; }
        seviyeSonuMesaji && seviyeSonuMesaji.classList.remove('gizli');
        enYuksekSkoruKontrolEtVeGuncelle();
        seviyeListesi && (seviyeListesi.innerHTML = '');
        mevcutSeviye = 1;
        toplamPuan = 0;
        if (puanGosterge) puanGosterge.textContent = toplamPuan;
    }

    // -------------------- OYUN SIFIRLA VE BAŞA DÖN --------------------
    function oyunuSifirlaVeBasaDon() {
        clearInterval(zamanlayici);
        mevcutSeviye = 1;
        toplamPuan = 0;
        if (puanGosterge) puanGosterge.textContent = toplamPuan;
        seviyeListesi && (seviyeListesi.innerHTML = '');
        oyunAlani && oyunAlani.classList.add('gizli');
        skorTablosu && skorTablosu.classList.add('gizli');
        seviyeSonuMesaji && seviyeSonuMesaji.classList.add('gizli');
        baslangicEkrani && baslangicEkrani.classList.remove('gizli');
        ayarlarPaneli && ayarlarPaneli.classList.add('gizli');
    }

    // -------------------- DURAKLAT / DEVAM --------------------
    function duraklatDevamEt() {
        if (duraklatmaKilitli || (oyunAlani && oyunAlani.classList.contains('gizli'))) return;
        duraklatildi = !duraklatildi;
        if (duraklatildi) {
            duraklamaBaslangicZamani = Date.now();
            clearInterval(zamanlayici);
            zamanlayiciSesi && zamanlayiciSesi.pause();
            butonlariDevreDisiBirak();
            duraklatOverlay && duraklatOverlay.classList.remove('gizli');
            if (duraklatButonu) duraklatButonu.textContent = "Devam Et";
        } else {
            const gecenDuraklamaSuresi = Date.now() - duraklamaBaslangicZamani;
            baslangicZamani += gecenDuraklamaSuresi;
            butonlariAktiflestir();
            duraklatOverlay && duraklatOverlay.classList.add('gizli');
            if (duraklatButonu) duraklatButonu.textContent = "Duraklat";
            zamanlayiciyiBaslat();
            duraklatmaKilitli = true;
            if (duraklatButonu) duraklatButonu.disabled = true;
            setTimeout(() => {
                duraklatmaKilitli = false;
                if (!duraklatildi && duraklatButonu) duraklatButonu.disabled = false;
            }, 1000);
        }
    }

    // -------------------- BUTONLARIN OLAYLARI --------------------
    butonlar.forEach(buton => {
        buton.addEventListener('click', () => {
            if (duraklatildi) return;
            buton.classList.add('tiklandi');
            const cikarilacakDeger = parseInt(buton.dataset.deger, 10);
            if (Number.isNaN(cikarilacakDeger)) return;
            mevcutHedefSayi -= cikarilacakDeger;
            if (hedefSayiElementi) hedefSayiElementi.textContent = mevcutHedefSayi;
            tiklamaSesi && sesCal(tiklamaSesi);
            if (mevcutHedefSayi === 0) oyunuKazan();
            else if (mevcutHedefSayi < 0) oyunuKaybet("Sıfırın altına düştün!");
        });
        buton.addEventListener('animationend', () => {
            buton.classList.remove('tiklandi');
        });
    });

    // -------------------- KLAVYE KONTROLLERİ --------------------
    document.addEventListener('keydown', (event) => {
        if (event.key === ' ') {
            event.preventDefault();
            if (baslangicEkrani && !baslangicEkrani.classList.contains('gizli')) {
                baslaButonu && baslaButonu.click();
                return;
            }
            if (seviyeSonuMesaji && !seviyeSonuMesaji.classList.contains('gizli') && sonrakiSeviyeButonu && !sonrakiSeviyeButonu.disabled) {
                sonrakiSeviyeButonu.click();
                return;
            }
        }
        const basilanTus = event.key;
        if (basilanTus >= '1' && basilanTus <= '9') {
            if (oyunAlani && oyunAlani.classList.contains('gizli')) return;
            if (seviyeSonuMesaji && !seviyeSonuMesaji.classList.contains('gizli')) return;
            let eslesenButon = null;
            for (const buton of butonlar) {
                if (buton.dataset.deger === basilanTus) { eslesenButon = buton; break; }
            }
            if (eslesenButon && !eslesenButon.disabled) {
                eslesenButon.click();
                eslesenButon.classList.add('klavye-vurgu');
                setTimeout(() => eslesenButon.classList.remove('klavye-vurgu'), 200);
            }
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'p' && seviyeSonuMesaji && seviyeSonuMesaji.classList.contains('gizli')) {
            duraklatDevamEt();
        }
    });

    // -------------------- AYARLAR PANELİ OLAYLARI VE ANİMASYON --------------------
    if (ayarlarButonu && ayarlarPaneli) {
        ayarlarButonu.addEventListener('click', function() {
            ayarlarPaneli.classList.toggle('gizli');
            ayarlarButonu.classList.add('tiklandi');
        });
        ayarlarButonu.addEventListener('animationend', function() {
            ayarlarButonu.classList.remove('tiklandi');
        });
    }
    if (ayarlarKapat && ayarlarPaneli) {
        ayarlarKapat.addEventListener('click', function() {
            ayarlarPaneli.classList.add('gizli');
        });
    }

    // -------------------- SEVİYE GEÇİŞ VE BAŞLATMA --------------------
    sonrakiSeviyeButonu && sonrakiSeviyeButonu.addEventListener('click', () => {
        if (!sonrakiSeviyeButonu) return;
        if (sonrakiSeviyeButonu.textContent === "Yeniden Başla") {
            sesCal(baslatmaSesi);
        } else {
            sesCal(sonrakiSeviyeSesi);
        }
        if (puanGosterge) puanGosterge.textContent = toplamPuan;
        seviyeyiBaslat();
    });

    baslaButonu && baslaButonu.addEventListener('click', () => {
        sesleriHazirla();
        baslangicEkrani && baslangicEkrani.classList.add('gizli');
        oyunAlani && oyunAlani.classList.remove('gizli');
        skorTablosu && skorTablosu.classList.remove('gizli');
        leaderboard && leaderboard.classList.remove('gizli');
        enYuksekSkorKutusu && enYuksekSkorKutusu.classList.remove('gizli');
        seviyeyiBaslat();
    });

    duraklatButonu && duraklatButonu.addEventListener('click', duraklatDevamEt);

    // -------------------- SAYFA YÜKLENDİĞİNDE --------------------
    document.addEventListener('DOMContentLoaded', () => {
        ekraniOlceklendir();
        window.addEventListener('resize', ekraniOlceklendir);
        ayarlariYukle();
        enYuksekSkoruYukle();
        enHizliZamanlariYukle();
        leaderboardGuncelle();
    });

})();