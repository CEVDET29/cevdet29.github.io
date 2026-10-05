/*
 * Sureler üzerinden Arapça — veri dosyası
 * Sıra: Kur’an’ın sonundan başına (114 → 1).
 * Âyet metinleri quran.com "imlâî" yazımına göre kelime kelime bölünmüştür;
 * kelime sırası quran.com kelime seslerinin (wbw) sırasıyla birebir aynıdır.
 *
 * Kelime alanları:
 *   w: Arapça kelime   o: okunuş   t: Türkçe anlam   r: görev (isim/fiil/zamir/harf/soru/ek)
 *   n: dilbilgisi notu k: kök (varsa)
 */
window.SURE_VERILERI = {
  besmele: {
    ar: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    okunus: "Bismillâhi’r-rahmâni’r-rahîm",
    meal: "Rahmân ve Rahîm olan Allah’ın adıyla.",
    kelimeler: [
      { w: "بِسْمِ", o: "bismi", t: "adıyla", r: "isim", n: "بِـ “ile” edatı + اِسْم “ad”. Edattan sonra geldiği için sonu esre.", k: "س-م-و" },
      { w: "اللَّهِ", o: "llâhi", t: "Allah’ın", r: "isim", n: "Allah lafzı. İsim tamlamasının ikinci öğesi olduğu için sonu esre: “Allah’ın adıyla”." },
      { w: "الرَّحْمَٰنِ", o: "r-rahmâni", t: "Rahmân (çok merhametli)", r: "isim", n: "Dünyada herkese merhamet eden. Râ şemsî harf: “el-”deki lâm okunmaz. Üstteki küçük elif “â” diye uzatılır.", k: "ر-ح-م" },
      { w: "الرَّحِيمِ", o: "r-rahîm", t: "Rahîm (çok esirgeyen)", r: "isim", n: "Rahmân ile aynı kökten. فَعِيل kalıbı kalıcı bir niteliği anlatır.", k: "ر-ح-م" }
    ]
  },

  sureler: {
    114: {
      ad: "Nâs", adAr: "النَّاس", anlam: "İnsanlar", yer: "Mekke", dakika: 25,
      giris: "Kur’an’ın son sûresi. Felak ile birlikte “Muavvizeteyn” (iki sığınma sûresi) diye anılır. “İnsanlar” kelimesi beş kez tekrar eder; bu tekrar, kelimeyi ve isim tamlamasını öğrenmek için çok iyi bir başlangıçtır.",
      hedefler: ["“Rab, melik, ilâh” kelimelerini tanımak", "أَعُوذُ fiilinde muzari “ben” işaretini görmek", "İsim tamlamasını (رَبِّ النَّاسِ) çözmek"],
      odak: [
        { ar: "أَعُوذُ", baslik: "Muzari “ben”", metin: "Baştaki أَ, Ders 07’deki muzari “ben” işaretidir: أَكْتُبُ “yazarım” gibi أَعُوذُ “sığınırım”." },
        { ar: "رَبِّ النَّاسِ", baslik: "İsim tamlaması", metin: "İki isim yan yana gelince ikincisi esre olur ve “-in” anlamı verir: “insanların Rabbi”. Birinci isim “el-” almaz." },
        { ar: "النَّاس", baslik: "Şemsî harf", metin: "Nûn şemsî harftir: “el-”deki lâm okunmaz, nûn şeddelenir. el-nâs değil en-nâs okunur." }
      ],
      kartlar: [["رَبّ", "Rab, terbiye eden", "İsim"], ["النَّاس", "insanlar", "İsim"], ["مَلِك", "hükümdar", "İsim"], ["إِلَٰه", "ilâh, tapılan", "İsim"], ["شَرّ", "kötülük, şer", "İsim"], ["صُدُور", "göğüsler, kalpler", "İsim"], ["الْجِنَّة", "cinler", "İsim"], ["أَعُوذُ", "sığınırım", "Fiil"]],
      ayetler: [
        { okunus: "Kul e‘ûzü bi-rabbi’n-nâs", meal: "De ki: İnsanların Rabbine sığınırım,", kelimeler: [
          { w: "قُلْ", o: "kul", t: "de ki, söyle", r: "fiil", n: "Emir fiil: “söyle!”. قَالَ “dedi” / يَقُولُ “diyor” fiilinin emir biçimi.", k: "ق-و-ل" },
          { w: "أَعُوذُ", o: "e‘ûzü", t: "sığınırım", r: "fiil", n: "Muzari; baştaki أَ “ben” işaretidir (Ders 07). “E‘ûzü billâh” sözü buradan gelir.", k: "ع-و-ذ" },
          { w: "بِرَبِّ", o: "bi-rabbi", t: "Rabbine", r: "isim", n: "بِـ “-e, ile” edatı + رَبّ “Rab: terbiye eden, sahip”. Edattan sonra sonu esre.", k: "ر-ب-ب" },
          { w: "النَّاسِ", o: "n-nâs", t: "insanların", r: "isim", n: "اَلْ + نَاس “insanlar”. Nûn şemsîdir: lâm okunmaz. Tamlamanın ikinci öğesi olduğu için sonu esre: “insanların Rabbi”." }
        ] },
        { okunus: "Meliki’n-nâs", meal: "İnsanların Melik’ine (hükümdarına),", kelimeler: [
          { w: "مَلِكِ", o: "meliki", t: "hükümdarına", r: "isim", n: "Melik: hükümdar. Önceki رَبِّ kelimesini açıkladığı için o da esre okunur.", k: "م-ل-ك" },
          { w: "النَّاسِ", o: "n-nâs", t: "insanların", r: "isim", n: "Aynı kelime ikinci kez: her âyet Allah’ın insanlarla ilişkisinin başka bir yönünü gösterir." }
        ] },
        { okunus: "İlâhi’n-nâs", meal: "İnsanların İlâhına,", kelimeler: [
          { w: "إِلَٰهِ", o: "ilâhi", t: "ilâhına", r: "isim", n: "İlâh: ibadet edilen, kulluk edilen. Lâmın üstündeki küçük elif uzatma işaretidir: “ilâ-”.", k: "أ-ل-ه" },
          { w: "النَّاسِ", o: "n-nâs", t: "insanların", r: "isim", n: "Rab → Melik → İlâh: üç tamlamanın ikinci öğesi hep aynı kelime." }
        ] },
        { okunus: "Min şerri’l-vesvâsi’l-hannâs", meal: "O sinsi vesvesecinin şerrinden,", kelimeler: [
          { w: "مِن", o: "min", t: "-den", r: "harf", n: "Ayrılma ve başlangıç bildiren edat. Sonraki isim esre olur." },
          { w: "شَرِّ", o: "şerri", t: "şerrinden, kötülüğünden", r: "isim", n: "Şer: kötülük. مِن edatından sonra geldiği için sonu esre.", k: "ش-ر-ر" },
          { w: "الْوَسْوَاسِ", o: "l-vesvâsi", t: "vesvese verenin", r: "isim", n: "Kötülüğü fısıldayıp telkin eden. Vâv kamerî harftir: “el-”deki lâm okunur. Dört harfli kök.", k: "و-س-و-س" },
          { w: "الْخَنَّاسِ", o: "l-hannâs", t: "sinsice geri çekilenin", r: "isim", n: "فَعَّال kalıbı “çok yapan” anlamı verir: Allah anılınca sinip geri çekilen.", k: "خ-ن-س" }
        ] },
        { okunus: "Ellezî yuvesvisu fî sudûri’n-nâs", meal: "O ki insanların göğüslerine (kalplerine) vesvese verir,", kelimeler: [
          { w: "الَّذِي", o: "ellezî", t: "o ki", r: "zamir", n: "İlgi zamiri (ism-i mevsûl), eril tekil. Önceki ismi bir cümleyle açıklar." },
          { w: "يُوَسْوِسُ", o: "yuvesvisu", t: "vesvese verir", r: "fiil", n: "Muzari; baştaki يُـ “o (erkek)” işaretidir. الْوَسْوَاس ile aynı kökten.", k: "و-س-و-س" },
          { w: "فِي", o: "fî", t: "-e, içine", r: "harf", n: "Ders 01’den bildiğin yer edatı. Sonraki isim esre olur." },
          { w: "صُدُورِ", o: "sudûri", t: "göğüslerine", r: "isim", n: "صَدْر “göğüs” kelimesinin çoğulu (kırık çoğul). Edattan sonra esre.", k: "ص-د-ر" },
          { w: "النَّاسِ", o: "n-nâs", t: "insanların", r: "isim", n: "Dördüncü tekrar: “insanların göğüsleri”." }
        ] },
        { okunus: "Mine’l-cinneti ve’n-nâs", meal: "Gerek cinlerden gerek insanlardan (olan vesveseciden).", kelimeler: [
          { w: "مِنَ", o: "mine", t: "-den", r: "harf", n: "مِنْ edatı. Sonraki “el-” ile birleşirken üstün alır: mine’l-." },
          { w: "الْجِنَّةِ", o: "l-cinneti", t: "cinlerden", r: "isim", n: "Cinler topluluğu. Kök “gizli olmak” anlamındadır; cennet ve cenin de bu köktendir.", k: "ج-ن-ن" },
          { w: "وَالنَّاسِ", o: "ve’n-nâs", t: "ve insanlardan", r: "isim", n: "وَ “ve” bağlacı kelimeye bitişik yazılır + النَّاس. Beşinci tekrar." }
        ] }
      ],
      sorular: [
        { s: "أَعُوذُ ne demektir?", secenekler: [["siginirim", "Sığınırım"], ["sigindi", "O sığındı"], ["sigin", "Sığın!"]], cevap: "siginirim", aciklama: "Baştaki أَ muzari “ben” işaretidir: sığınırım." },
        { s: "بِرَبِّ النَّاسِ ne demektir?", secenekler: [["insanlarin-rabbine", "İnsanların Rabbine"], ["rabbim-insan", "Rabbim insandır"], ["insanlar-rabbe", "İnsanlar Rabbe"]], cevap: "insanlarin-rabbine", aciklama: "بِـ “-e”, رَبّ “Rab”; ikinci isim esre olunca “insanların” anlamı verir." },
        { s: "قُلْ hangi fiil türüdür?", secenekler: [["emir", "Emir: söyle!"], ["mazi", "Mâzi: dedi"], ["muzari", "Muzari: diyor"]], cevap: "emir", aciklama: "قُلْ bir emirdir: “de ki, söyle”." },
        { s: "النَّاسِ neden “en-nâs” okunur?", secenekler: [["semsi", "Nûn şemsî harf olduğu için lâm okunmaz"], ["fiil", "Kelime fiil olduğu için"], ["esre", "Sonu esre olduğu için"]], cevap: "semsi", aciklama: "Şemsî harfle başlayan kelimede “el-”deki lâm okunmaz, harf şeddelenir." },
        { s: "يُوَسْوِسُ fiilinin başındaki يُـ hangi şahsı gösterir?", secenekler: [["o", "O (erkek)"], ["ben", "Ben"], ["biz", "Biz"]], cevap: "o", aciklama: "Muzaride يَـ / يُـ “o (erkek)” işaretidir." },
        { s: "صُدُورِ ne demektir?", secenekler: [["gogusler", "Göğüsler (kalpler)"], ["insanlar", "İnsanlar"], ["cinler", "Cinler"]], cevap: "gogusler", aciklama: "صُدُور, صَدْر “göğüs” kelimesinin çoğuludur." }
      ]
    },

    113: {
      ad: "Felak", adAr: "الْفَلَق", anlam: "Sabah aydınlığı", yer: "Mekke", dakika: 25,
      giris: "Nâs ile birlikte okunan ikinci sığınma sûresi. “Şerrinden” kelimesi dört kez tekrar eder. Bu sûrede mâzi fiilleri ve “yapan” anlamı veren فَاعِل kalıbını göreceğiz.",
      hedefler: ["Mâzi fiilleri (خَلَقَ، وَقَبَ، حَسَدَ) tanımak", "فَاعِل kalıbını görmek: غَاسِق، حَاسِد", "إِذَا + mâzi = “-dığı zaman” yapısını çözmek"],
      odak: [
        { ar: "خَلَقَ · حَسَدَ", baslik: "Mâzi fiil", metin: "Üç harfin üstünlü olduğu ek almamış biçim “o yaptı” demektir (Ders 05): خَلَقَ “yarattı”, حَسَدَ “haset etti”." },
        { ar: "حَاسِد · غَاسِق", baslik: "فَاعِل: yapan", metin: "Kökün ilk harfinden sonra elif gelen kalıp “yapan” anlamı verir: كَاتِب “yazan” gibi حَاسِد “haset eden”." },
        { ar: "إِذَا حَسَدَ", baslik: "-dığı zaman", metin: "إِذَا ardından gelen mâzi fiili genel bir zamana çevirir: “haset ettiği zaman”." }
      ],
      kartlar: [["الْفَلَق", "sabah aydınlığı", "İsim"], ["خَلَقَ", "yarattı", "Fiil"], ["غَاسِق", "karanlık gece", "İsim"], ["إِذَا", "-dığı zaman", "Zaman"], ["الْعُقَد", "düğümler", "İsim"], ["حَاسِد", "haset eden", "İsim"], ["حَسَدَ", "haset etti", "Fiil"], ["شَرّ", "kötülük, şer", "İsim"]],
      ayetler: [
        { okunus: "Kul e‘ûzü bi-rabbi’l-felak", meal: "De ki: Sabah aydınlığının Rabbine sığınırım,", kelimeler: [
          { w: "قُلْ", o: "kul", t: "de ki", r: "fiil", n: "Emir fiil: “söyle!”. Nâs sûresiyle aynı başlangıç.", k: "ق-و-ل" },
          { w: "أَعُوذُ", o: "e‘ûzü", t: "sığınırım", r: "fiil", n: "Muzari “ben”: baştaki أَ.", k: "ع-و-ذ" },
          { w: "بِرَبِّ", o: "bi-rabbi", t: "Rabbine", r: "isim", n: "بِـ + رَبّ. Edattan sonra esre.", k: "ر-ب-ب" },
          { w: "الْفَلَقِ", o: "l-felak", t: "sabah aydınlığının", r: "isim", n: "Karanlığı yarıp çıkan şafak. Fâ kamerî harf: lâm okunur.", k: "ف-ل-ق" }
        ] },
        { okunus: "Min şerri mâ halak", meal: "Yarattığı şeylerin şerrinden,", kelimeler: [
          { w: "مِن", o: "min", t: "-den", r: "harf", n: "Ayrılma edatı; sonraki isim esre." },
          { w: "شَرِّ", o: "şerri", t: "şerrinden", r: "isim", n: "Kötülük. مِن’den sonra esre.", k: "ش-ر-ر" },
          { w: "مَا", o: "mâ", t: "-dığı şey", r: "zamir", n: "Burada ilgi zamiri: “yarattığı şey(ler)”. Olumsuzluk bildiren مَا ile karıştırma." },
          { w: "خَلَقَ", o: "halak", t: "yarattı", r: "fiil", n: "Mâzi, 3. tekil eril: “o yarattı” (Ders 05). Mahlûk, hâlık ve ahlâk bu köktendir.", k: "خ-ل-ق" }
        ] },
        { okunus: "Ve min şerri ğâsikın izâ vekab", meal: "Karanlığı çöktüğü zaman gecenin şerrinden,", kelimeler: [
          { w: "وَمِن", o: "ve min", t: "ve -den", r: "harf", n: "وَ “ve” + مِنْ “-den”." },
          { w: "شَرِّ", o: "şerri", t: "şerrinden", r: "isim", n: "İkinci tekrar.", k: "ش-ر-ر" },
          { w: "غَاسِقٍ", o: "ğâsikın", t: "karanlık gecenin", r: "isim", n: "فَاعِل kalıbı: “karartan”. Tenvinli (belirsiz): bir karanlık.", k: "غ-س-ق" },
          { w: "إِذَا", o: "izâ", t: "-dığı zaman", r: "isim", n: "Zaman bildiren kelime (zarf): “-dığında”. Ardından gelen mâzi fiil genel anlam kazanır." },
          { w: "وَقَبَ", o: "vekab", t: "çöktüğü", r: "fiil", n: "Mâzi 3. tekil eril: “bastırdı, çöktü”. إِذَا ile “çöktüğü zaman”.", k: "و-ق-ب" }
        ] },
        { okunus: "Ve min şerri’n-neffâsâti fi’l-‘ukad", meal: "Düğümlere üfleyenlerin şerrinden,", kelimeler: [
          { w: "وَمِن", o: "ve min", t: "ve -den", r: "harf", n: "وَ + مِنْ." },
          { w: "شَرِّ", o: "şerri", t: "şerrinden", r: "isim", n: "Üçüncü tekrar.", k: "ش-ر-ر" },
          { w: "النَّفَّاثَاتِ", o: "n-neffâsâti", t: "üfleyenlerin", r: "isim", n: "فَعَّال “çok yapan” kalıbı + ـَات dişil çoğul eki: büyü için düğüme üfleyenler.", k: "ن-ف-ث" },
          { w: "فِي", o: "fî", t: "-e, içine", r: "harf", n: "Yer edatı." },
          { w: "الْعُقَدِ", o: "l-‘ukad", t: "düğümlere", r: "isim", n: "عُقْدَة “düğüm” kelimesinin çoğulu. Akit ve akide aynı köktendir.", k: "ع-ق-د" }
        ] },
        { okunus: "Ve min şerri hâsidin izâ hased", meal: "Ve haset ettiği zaman hasetçinin şerrinden.", kelimeler: [
          { w: "وَمِن", o: "ve min", t: "ve -den", r: "harf", n: "وَ + مِنْ." },
          { w: "شَرِّ", o: "şerri", t: "şerrinden", r: "isim", n: "Dördüncü tekrar.", k: "ش-ر-ر" },
          { w: "حَاسِدٍ", o: "hâsidin", t: "haset edenin", r: "isim", n: "فَاعِل kalıbı: “haset eden”. Tenvinli: bir hasetçi.", k: "ح-س-د" },
          { w: "إِذَا", o: "izâ", t: "-dığı zaman", r: "isim", n: "Zaman zarfı." },
          { w: "حَسَدَ", o: "hased", t: "haset ettiği", r: "fiil", n: "Mâzi 3. tekil eril. Aynı kökten isim (حَاسِد) ve fiil (حَسَدَ) yan yana: kök fikrini görmek için güzel bir örnek.", k: "ح-س-د" }
        ] }
      ],
      sorular: [
        { s: "خَلَقَ ne demektir?", secenekler: [["yaratti", "Yarattı"], ["yaratiyor", "Yaratıyor"], ["yarat", "Yarat!"]], cevap: "yaratti", aciklama: "Ek almamış mâzi: “o yarattı”." },
        { s: "حَاسِد ne demektir?", secenekler: [["haset-eden", "Haset eden"], ["haset", "Haset (kıskançlık)"], ["haset-etti", "Haset etti"]], cevap: "haset-eden", aciklama: "فَاعِل kalıbı “yapan” anlamı verir." },
        { s: "مِن شَرِّ ne demektir?", secenekler: [["serrinden", "Şerrinden"], ["serre", "Şerre"], ["serle", "Şer ile"]], cevap: "serrinden", aciklama: "مِن “-den”, شَرّ “şer, kötülük”." },
        { s: "إِذَا حَسَدَ ne demektir?", secenekler: [["ettigi-zaman", "Haset ettiği zaman"], ["etmedi", "Haset etmedi"], ["edecek-mi", "Haset edecek mi?"]], cevap: "ettigi-zaman", aciklama: "إِذَا + mâzi = “-dığı zaman”." },
        { s: "Hangi kelime فَاعِل (yapan) kalıbındadır?", secenekler: [["gasik", "غَاسِق"], ["felak", "الْفَلَق"], ["ukad", "الْعُقَد"]], cevap: "gasik", aciklama: "غَاسِق: ilk harften sonra elif, ikinci harf esreli — “karartan”." },
        { s: "الْعُقَدِ ne demektir?", secenekler: [["dugumler", "Düğümler"], ["geceler", "Geceler"], ["ufleyenler", "Üfleyenler"]], cevap: "dugumler", aciklama: "عُقْدَة “düğüm” kelimesinin çoğulu." }
      ]
    },

    112: {
      ad: "İhlâs", adAr: "الْإِخْلَاص", anlam: "Samimiyet, katıksız inanç", yer: "Mekke", dakika: 25,
      giris: "Dört kısa âyette Allah’ın birliğini anlatır. Burada isim cümlesini, olumsuz geçmiş yapan لَمْ edatını ve etken–edilgen farkını göreceğiz.",
      hedefler: ["لَمْ + muzari = olumsuz geçmiş", "İsim cümlesini (اللَّهُ الصَّمَدُ) okumak", "Etken–edilgen: يَلِدُ / يُولَدُ"],
      odak: [
        { ar: "لَمْ يَلِدْ", baslik: "Olumsuz geçmiş", metin: "لَمْ muzari fiilin başına gelir, anlamı “-medi” yapar ve sonunu sakin okutur: يَلِدُ → لَمْ يَلِدْ “doğurmadı”." },
        { ar: "اللَّهُ الصَّمَدُ", baslik: "İsim cümlesi", metin: "Fiilsiz cümle (Ders 02): “Allah Samed’dir”. Türkçedeki “-dır” eki Arapçada yazılmaz." },
        { ar: "يَلِدُ / يُولَدُ", baslik: "Etken – edilgen", metin: "Baştaki يَـ üstünlü olursa etken “doğurur”, يُـ ötreli olursa edilgen “doğurulur” olur." }
      ],
      kartlar: [["هُوَ", "o (erkek)", "Zamir"], ["أَحَد", "bir, tek", "İsim"], ["الصَّمَد", "her şeyin muhtaç olduğu", "İsim"], ["لَمْ", "-medi (olumsuz geçmiş)", "Harf"], ["يَلِدُ", "doğurur", "Fiil"], ["يُولَدُ", "doğurulur", "Fiil"], ["كُفُو", "denk, eş", "İsim"], ["لَهُ", "O’na, O’nun için", "Harf + zamir"]],
      ayetler: [
        { okunus: "Kul hüva’llâhu ehad", meal: "De ki: O Allah birdir.", kelimeler: [
          { w: "قُلْ", o: "kul", t: "de ki", r: "fiil", n: "Emir: “söyle!”.", k: "ق-و-ل" },
          { w: "هُوَ", o: "hüve", t: "O", r: "zamir", n: "3. tekil eril zamir (Ders 03)." },
          { w: "اللَّهُ", o: "llâhu", t: "Allah", r: "isim", n: "Cümlenin öznesi/haberi olduğu için sonu ötre (-u)." },
          { w: "أَحَدٌ", o: "ehad", t: "bir, tek", r: "isim", n: "Eşi benzeri olmayan tek. Tenvinlidir; durakta “ehad” okunur. وَاحِد ile akraba kök.", k: "أ-ح-د" }
        ] },
        { okunus: "Allâhü’s-samed", meal: "Allah Samed’dir (her şey O’na muhtaçtır, O hiçbir şeye muhtaç değildir).", kelimeler: [
          { w: "اللَّهُ", o: "allâhu", t: "Allah", r: "isim", n: "İsim cümlesinin öznesi (mübtedâ)." },
          { w: "الصَّمَدُ", o: "s-samed", t: "Samed’dir", r: "isim", n: "Her şeyin yöneldiği, hiçbir şeye muhtaç olmayan. Sâd şemsî: lâm okunmaz. İsim cümlesinin haberi: “-dır”.", k: "ص-م-د" }
        ] },
        { okunus: "Lem yelid ve lem yûled", meal: "O doğurmamış ve doğurulmamıştır.", kelimeler: [
          { w: "لَمْ", o: "lem", t: "-medi", r: "harf", n: "Muzariyi olumsuz geçmişe çevirir ve sonunu sakin yapar (cezm)." },
          { w: "يَلِدْ", o: "yelid", t: "doğurmadı", r: "fiil", n: "Muzari يَلِدُ “doğurur”; لَمْ yüzünden sonu sakin. Veled “çocuk” ve vâlide “anne” aynı köktendir.", k: "و-ل-د" },
          { w: "وَلَمْ", o: "ve lem", t: "ve -medi", r: "harf", n: "وَ + لَمْ." },
          { w: "يُولَدْ", o: "yûled", t: "doğurulmadı", r: "fiil", n: "Edilgen (meçhul) muzari: baştaki ötreli يُـ “-ilir” anlamı verir: “doğurulmadı”.", k: "و-ل-د" }
        ] },
        { okunus: "Ve lem yekün lehû küfüven ehad", meal: "Ve hiçbir şey O’na denk değildir.", kelimeler: [
          { w: "وَلَمْ", o: "ve lem", t: "ve -medi", r: "harf", n: "وَ + لَمْ." },
          { w: "يَكُن", o: "yekün", t: "olmadı", r: "fiil", n: "كَانَ “oldu” / يَكُونُ “olur”. لَمْ ile sondaki harf sakin olunca و düşer: يَكُنْ.", k: "ك-و-ن" },
          { w: "لَّهُ", o: "lehû", t: "O’na", r: "harf", n: "لِـ “için, -e” + ـهُ “o” zamiri. Şedde: önceki nûn sesi lâma katılır (idgam)." },
          { w: "كُفُوًا", o: "küfüven", t: "denk", r: "isim", n: "Denk, eş. كَانَ’nin haberi olduğu için üstün tenvin: -en.", k: "ك-ف-أ" },
          { w: "أَحَدٌ", o: "ehad", t: "hiç kimse", r: "isim", n: "Olumsuz cümlede “hiç kimse, hiçbir şey” anlamı verir. Sûre aynı kelimeyle başlar ve biter." }
        ] }
      ],
      sorular: [
        { s: "هُوَ ne demektir?", secenekler: [["o", "O (erkek)"], ["sen", "Sen"], ["biz", "Biz"]], cevap: "o", aciklama: "هُوَ 3. tekil eril zamirdir." },
        { s: "لَمْ يَلِدْ ne demektir?", secenekler: [["dogurmadi", "Doğurmadı"], ["doguruyor", "Doğuruyor"], ["dogurcak", "Doğuracak"]], cevap: "dogurmadi", aciklama: "لَمْ + muzari = olumsuz geçmiş." },
        { s: "لَمْ edatı muzari fiile hangi anlamı verir?", secenekler: [["olumsuz-gecmis", "Olumsuz geçmiş (-medi)"], ["gelecek", "Gelecek zaman"], ["emir", "Emir"]], cevap: "olumsuz-gecmis", aciklama: "لَمْ يَكُن “olmadı”, لَمْ يُولَدْ “doğurulmadı”." },
        { s: "أَحَدٌ ne demektir?", secenekler: [["tek", "Bir, tek"], ["hepsi", "Hepsi"], ["iki", "İkisi"]], cevap: "tek", aciklama: "أَحَد: bir, eşi olmayan tek." },
        { s: "يُولَدْ etken mi, edilgen mi?", secenekler: [["edilgen", "Edilgen: doğurulmadı"], ["etken", "Etken: doğurmadı"]], cevap: "edilgen", aciklama: "Baştaki ötreli يُـ edilgen işaretidir." },
        { s: "لَهُ ne demektir?", secenekler: [["ona", "O’na, O’nun için"], ["ondan", "Ondan"], ["ben", "Benim için"]], cevap: "ona", aciklama: "لِـ “için, -e” + ـهُ “o”." }
      ]
    },

    111: {
      ad: "Tebbet (Mesed)", adAr: "الْمَسَد", anlam: "Hurma lifi", yer: "Mekke", dakika: 25,
      giris: "Ebû Leheb ve karısının akıbetini anlatır. Mâzi fiilde dişil تْ ekini, gelecek zaman ön eki سَـ’yi ve “onun” anlamı veren zamir eklerini göreceğiz.",
      hedefler: ["تَبَّتْ’teki dişil تْ ekini tanımak", "سَـ ön ekiyle gelecek zamanı görmek", "ـهُ / ـهَا “onun” eklerini ayırmak"],
      odak: [
        { ar: "تَبَّتْ", baslik: "Dişil mâzi", metin: "Sondaki sakin تْ, Ders 05’teki “o (kadın)” işaretidir. Burada öznesi “eller” (يَد dişil kabul edilir)." },
        { ar: "سَيَصْلَىٰ", baslik: "Gelecek: سَـ", metin: "Muzarinin başına gelen سَـ, “-ecek” anlamı verir. Ders 09’da ayrıntılı göreceğiz." },
        { ar: "مَالُهُ · جِيدِهَا", baslik: "Onun: ـهُ / ـهَا", metin: "ـهُ “onun (erkek)”, ـهَا “onun (kadın)” demektir: مَالُهُ “malı”, جِيدِهَا “(kadının) boynu”." }
      ],
      kartlar: [["يَد", "el", "İsim"], ["لَهَب", "alev", "İsim"], ["مَال", "mal", "İsim"], ["كَسَبَ", "kazandı", "Fiil"], ["نَار", "ateş", "İsim"], ["امْرَأَة", "kadın, eş", "İsim"], ["الْحَطَب", "odun", "İsim"], ["حَبْل", "ip", "İsim"]],
      ayetler: [
        { okunus: "Tebbet yedâ ebî lehebin ve tebb", meal: "Ebû Leheb’in iki eli kurusun! Kurudu da.", kelimeler: [
          { w: "تَبَّتْ", o: "tebbet", t: "kurusun, helâk oldu", r: "fiil", n: "Mâzi; sondaki sakin تْ 3. tekil dişil işaretidir (Ders 05). Beddua anlamı taşır: “kurusun!”.", k: "ت-ب-ب" },
          { w: "يَدَا", o: "yedâ", t: "iki eli", r: "isim", n: "يَد “el” kelimesinin ikili biçimi يَدَانِ; tamlamada sondaki نِ düşer: يَدَا.", k: "ي-د-ي" },
          { w: "أَبِي", o: "ebî", t: "Ebû (babası)", r: "isim", n: "أَب “baba”. Ebû Leheb bir künyedir: “alevin babası”. Tamlamada ikinci öğe olunca أَبِي biçimini alır." },
          { w: "لَهَبٍ", o: "lehebin", t: "Leheb’in (alevin)", r: "isim", n: "Alev. Tenvinli esre.", k: "ل-ه-ب" },
          { w: "وَتَبَّ", o: "ve tebb", t: "ve kurudu", r: "fiil", n: "وَ + تَبَّ: mâzi 3. tekil eril, “kendisi de helâk oldu”.", k: "ت-ب-ب" }
        ] },
        { okunus: "Mâ ağnâ ‘anhü mâlühû ve mâ keseb", meal: "Ne malı ne de kazandıkları ona fayda verdi.", kelimeler: [
          { w: "مَا", o: "mâ", t: "-medi", r: "harf", n: "Burada olumsuzluk edatı: mâzi fiilin başında “-medi”. Felak’taki “-dığı şey” anlamındaki مَا ile karşılaştır." },
          { w: "أَغْنَىٰ", o: "ağnâ", t: "fayda verdi", r: "fiil", n: "Mâzi (أَفْعَلَ kalıbı). Kök “zenginlik, ihtiyaçsızlık” anlamındadır. Sondaki ى elif gibi okunur.", k: "غ-ن-ي" },
          { w: "عَنْهُ", o: "‘anhu", t: "ona (onu kurtarmaya)", r: "harf", n: "عَنْ “-den, hakkında” + ـهُ “o”." },
          { w: "مَالُهُ", o: "mâlühû", t: "malı", r: "isim", n: "مَال + ـهُ “onun”. Fiilin öznesi olduğu için sonu ötre.", k: "م-و-ل" },
          { w: "وَمَا", o: "ve mâ", t: "ve -dığı şey", r: "zamir", n: "Burada ilgi zamiri: “kazandığı şey”." },
          { w: "كَسَبَ", o: "keseb", t: "kazandı", r: "fiil", n: "Mâzi 3. tekil eril. Kesb “kazanç” bu köktendir.", k: "ك-س-ب" }
        ] },
        { okunus: "Se-yaslâ nâran zâte leheb", meal: "Alevli bir ateşe girecektir.", kelimeler: [
          { w: "سَيَصْلَىٰ", o: "se-yaslâ", t: "girecek", r: "fiil", n: "سَـ gelecek zaman ön eki + يَصْلَى (muzari, “o”): “ateşe girecek, yanacak”.", k: "ص-ل-ي" },
          { w: "نَارًا", o: "nâran", t: "bir ateşe", r: "isim", n: "Nesne; üstün tenvin: “bir ateş”.", k: "ن-و-ر" },
          { w: "ذَاتَ", o: "zâte", t: "sahip, -li", r: "isim", n: "ذُو / ذَاتُ “sahibi”. نَار dişil olduğu için dişil ذَات: “alev sahibi” → alevli." },
          { w: "لَهَبٍ", o: "leheb", t: "alev", r: "isim", n: "1. âyetteki “Leheb” ile ses benzerliği: alevin babası alevli ateşe.", k: "ل-ه-ب" }
        ] },
        { okunus: "Vemre’etühû hammâlete’l-hatab", meal: "Karısı da (girecek); o odun hamalı,", kelimeler: [
          { w: "وَامْرَأَتُهُ", o: "vemra’etühû", t: "ve karısı", r: "isim", n: "وَ + امْرَأَة “kadın, eş” + ـهُ “onun”. Ek alınca ة, ت olarak okunur.", k: "م-ر-أ" },
          { w: "حَمَّالَةَ", o: "hammâlete", t: "taşıyıcısı (kadın)", r: "isim", n: "فَعَّالَة kalıbı: “çok taşıyan” (dişil). Türkçedeki “hamal” bu köktendir.", k: "ح-م-ل" },
          { w: "الْحَطَبِ", o: "l-hatab", t: "odunun", r: "isim", n: "Odun, çalı çırpı. Tamlamanın ikinci öğesi: esre.", k: "ح-ط-ب" }
        ] },
        { okunus: "Fî cîdihâ hablün min mesed", meal: "Boynunda hurma lifinden bükülmüş bir ip olacak.", kelimeler: [
          { w: "فِي", o: "fî", t: "-de", r: "harf", n: "Yer edatı." },
          { w: "جِيدِهَا", o: "cîdihâ", t: "boynunda (kadının)", r: "isim", n: "جِيد “boyun” + ـهَا “onun (kadın)”. Edattan sonra esre.", k: "ج-ي-د" },
          { w: "حَبْلٌ", o: "hablün", t: "bir ip", r: "isim", n: "Tenvinli, belirsiz: “bir ip”. Cümlenin öznesi sonda gelmiş.", k: "ح-ب-ل" },
          { w: "مِّن", o: "min", t: "-den (yapılmış)", r: "harf", n: "Burada malzeme bildirir. Şedde: nûn sonraki mîme katılır (idgam)." },
          { w: "مَّسَدٍ", o: "mesed", t: "hurma lifi", r: "isim", n: "Bükülmüş sağlam lif. Sûre adını bu kelimeden alır.", k: "م-س-د" }
        ] }
      ],
      sorular: [
        { s: "تَبَّتْ fiilinin sonundaki تْ hangi şahsı gösterir?", secenekler: [["o-kadin", "O (dişil)"], ["ben", "Ben"], ["sen", "Sen"]], cevap: "o-kadin", aciklama: "Mâzide sakin تْ 3. tekil dişil işaretidir; öznesi “eller”." },
        { s: "سَيَصْلَىٰ hangi zamandır?", secenekler: [["gelecek", "Gelecek"], ["gecmis", "Geçmiş"], ["emir", "Emir"]], cevap: "gelecek", aciklama: "Baştaki سَـ “-ecek” anlamı verir." },
        { s: "مَالُهُ ne demektir?", secenekler: [["onun-mali", "Onun malı"], ["benim-malim", "Benim malım"], ["mal", "Bir mal"]], cevap: "onun-mali", aciklama: "ـهُ “onun (erkek)” ekidir." },
        { s: "جِيدِهَا içindeki ـهَا ne demektir?", secenekler: [["onun-kadin", "Onun (kadın)"], ["onun-erkek", "Onun (erkek)"], ["bizim", "Bizim"]], cevap: "onun-kadin", aciklama: "ـهَا dişil “onun” ekidir." },
        { s: "مَا أَغْنَىٰ ne demektir?", secenekler: [["vermedi", "Fayda vermedi"], ["verecek", "Fayda verecek"], ["veriyor", "Fayda veriyor"]], cevap: "vermedi", aciklama: "Mâzi fiilin başındaki مَا olumsuzluk bildirir." },
        { s: "يَدَا ne demektir?", secenekler: [["iki-el", "İki el"], ["eller", "Eller (çok)"], ["bir-el", "Bir el"]], cevap: "iki-el", aciklama: "يَد “el” kelimesinin ikili biçimi." }
      ]
    },

    110: {
      ad: "Nasr", adAr: "النَّصْر", anlam: "Yardım, zafer", yer: "Medine", dakika: 25,
      giris: "Mekke’nin fethini ve insanların İslâm’a akın akın girişini müjdeler. Mâzi “sen” ekini, muzari “onlar” biçimini ve emir fiilleri bir arada göreceğiz.",
      hedefler: ["رَأَيْتَ’teki “sen” ekini tanımak", "يَدْخُلُونَ’da muzari “onlar”ı görmek", "Emir fiiller: سَبِّحْ، اسْتَغْفِرْ"],
      odak: [
        { ar: "النَّاسِ / النَّاسَ", baslik: "Son hareke görevi gösterir", metin: "Nâs sûresinde النَّاسِ esreydi (tamlama). Burada النَّاسَ üstün çünkü “gördün” fiilinin nesnesi." },
        { ar: "يَدْخُلُونَ", baslik: "Muzari “onlar”", metin: "يَـ...ـُونَ kalıbı Ders 07’deki “onlar” biçimidir: يَكْتُبُونَ gibi." },
        { ar: "سَبِّحْ · اسْتَغْفِرْ", baslik: "Emir", metin: "Sonu sakin, şahıs harfi düşmüş biçim: “tesbih et!”, “bağışlanma dile!”. قُلْ de böyledir." }
      ],
      kartlar: [["جَاءَ", "geldi", "Fiil"], ["نَصْر", "yardım", "İsim"], ["الْفَتْح", "fetih, açış", "İsim"], ["رَأَيْتَ", "gördün", "Fiil"], ["يَدْخُلُونَ", "giriyorlar", "Fiil"], ["دِين", "din", "İsim"], ["حَمْد", "övgü, hamd", "İsim"], ["تَوَّاب", "tövbeleri çok kabul eden", "İsim"]],
      ayetler: [
        { okunus: "İzâ câe nasru’llâhi ve’l-feth", meal: "Allah’ın yardımı ve fetih geldiği zaman,", kelimeler: [
          { w: "إِذَا", o: "izâ", t: "-dığı zaman", r: "isim", n: "Zaman zarfı; ardından gelen mâzi fiil “-dığı zaman” anlamı kazanır (Felak’ta görmüştük)." },
          { w: "جَاءَ", o: "câe", t: "geldi(ği)", r: "fiil", n: "Mâzi 3. tekil eril. Muzarisi يَجِيءُ.", k: "ج-ي-ء" },
          { w: "نَصْرُ", o: "nasru", t: "yardımı", r: "isim", n: "Fiilin öznesi: sonu ötre. Nusret ve Ensâr bu köktendir.", k: "ن-ص-ر" },
          { w: "اللَّهِ", o: "llâhi", t: "Allah’ın", r: "isim", n: "Tamlamanın ikinci öğesi: esre." },
          { w: "وَالْفَتْحُ", o: "ve’l-feth", t: "ve fetih", r: "isim", n: "Mekke’nin fethi. Kök “açmak” anlamındadır; Fâtiha ve miftâh “anahtar” da bu köktendir.", k: "ف-ت-ح" }
        ] },
        { okunus: "Ve ra’eyte’n-nâse yedhulûne fî dîni’llâhi efvâcâ", meal: "Ve insanların bölük bölük Allah’ın dinine girdiklerini gördüğünde,", kelimeler: [
          { w: "وَرَأَيْتَ", o: "ve ra’eyte", t: "ve gördün", r: "fiil", n: "Mâzi; sondaki تَ “sen (erkek)” ekidir (Ders 06).", k: "ر-أ-ي" },
          { w: "النَّاسَ", o: "n-nâse", t: "insanları", r: "isim", n: "Nesne olduğu için sonu üstün. Nâs sûresinde tamlamada esreydi." },
          { w: "يَدْخُلُونَ", o: "yedhulûne", t: "giriyorlar", r: "fiil", n: "Muzari; يَـ...ـُونَ “onlar” (Ders 07).", k: "د-خ-ل" },
          { w: "فِي", o: "fî", t: "-e, içine", r: "harf", n: "Yer edatı." },
          { w: "دِينِ", o: "dîni", t: "dinine", r: "isim", n: "Edattan sonra esre.", k: "د-ي-ن" },
          { w: "اللَّهِ", o: "llâhi", t: "Allah’ın", r: "isim", n: "Tamlamanın ikinci öğesi: esre." },
          { w: "أَفْوَاجًا", o: "efvâcâ", t: "bölük bölük", r: "isim", n: "فَوْج “bölük, grup” kelimesinin çoğulu. Nasıl girdiklerini anlatır (hâl). Durakta “efvâcâ” okunur.", k: "ف-و-ج" }
        ] },
        { okunus: "Fe-sebbih bi-hamdi rabbike vestağfirh, innehû kâne tevvâbâ", meal: "Rabbini hamd ile tesbih et ve O’ndan bağışlanma dile. Şüphesiz O, tövbeleri çok kabul edendir.", kelimeler: [
          { w: "فَسَبِّحْ", o: "fe-sebbih", t: "o hâlde tesbih et", r: "fiil", n: "فَـ “o hâlde” + سَبِّحْ emir: “tesbih et”. Sübhânallah bu köktendir.", k: "س-ب-ح" },
          { w: "بِحَمْدِ", o: "bi-hamdi", t: "hamd ile", r: "isim", n: "بِـ “ile” + حَمْد “övgü”. Muhammed, Ahmed ve elhamdülillâh bu köktendir.", k: "ح-م-د" },
          { w: "رَبِّكَ", o: "rabbike", t: "Rabbinin", r: "isim", n: "رَبّ + ـكَ “senin”.", k: "ر-ب-ب" },
          { w: "وَاسْتَغْفِرْهُ", o: "vestağfirh", t: "ve O’ndan bağışlanma dile", r: "fiil", n: "وَ + اسْتَغْفِرْ emir (اِسْتَفْعَلَ kalıbı “istemek” anlamı verir) + ـهُ “O’nu”. İstiğfar bu fiilin mastarıdır.", k: "غ-ف-ر" },
          { w: "إِنَّهُ", o: "innehû", t: "şüphesiz O", r: "harf", n: "إِنَّ “şüphesiz” vurgu edatı + ـهُ “o”." },
          { w: "كَانَ", o: "kâne", t: "-dır (hep öyledir)", r: "fiil", n: "كَانَ “idi, oldu”. Allah’ın sıfatlarında süreklilik bildirir.", k: "ك-و-ن" },
          { w: "تَوَّابًا", o: "tevvâbâ", t: "tövbeleri çok kabul eden", r: "isim", n: "فَعَّال “çok yapan” kalıbı. كَانَ’nin haberi olduğu için üstün tenvin.", k: "ت-و-ب" }
        ] }
      ],
      sorular: [
        { s: "جَاءَ ne demektir?", secenekler: [["geldi", "Geldi"], ["geliyor", "Geliyor"], ["gel", "Gel!"]], cevap: "geldi", aciklama: "Ek almamış mâzi: “o geldi”." },
        { s: "رَأَيْتَ fiilinin sonundaki تَ hangi şahıstır?", secenekler: [["sen", "Sen (erkek)"], ["ben", "Ben"], ["o-kadin", "O (kadın)"]], cevap: "sen", aciklama: "Mâzide üstünlü تَ “sen (erkek)” ekidir." },
        { s: "يَدْخُلُونَ ne demektir?", secenekler: [["giriyorlar", "Giriyorlar"], ["girdiler", "Girdiler"], ["giriyorsunuz", "Giriyorsunuz"]], cevap: "giriyorlar", aciklama: "يَـ...ـُونَ muzari “onlar” kalıbıdır." },
        { s: "رَبِّكَ ne demektir?", secenekler: [["rabbin", "Rabbin (senin Rabbin)"], ["rabbim", "Rabbim"], ["rabbimiz", "Rabbimiz"]], cevap: "rabbin", aciklama: "ـكَ “senin” ekidir." },
        { s: "فَسَبِّحْ hangi fiil türüdür?", secenekler: [["emir", "Emir"], ["mazi", "Mâzi"], ["muzari", "Muzari"]], cevap: "emir", aciklama: "“Tesbih et!” anlamında emirdir." },
        { s: "نَصْرُ اللَّهِ ne demektir?", secenekler: [["yardimi", "Allah’ın yardımı"], ["yardim-etti", "Allah yardım etti"], ["allaha", "Allah’a yardım"]], cevap: "yardimi", aciklama: "İsim tamlaması: ikinci isim esre, “Allah’ın”." }
      ]
    },

    109: {
      ad: "Kâfirûn", adAr: "الْكَافِرُون", anlam: "İnkâr edenler", yer: "Mekke", dakika: 30,
      giris: "İnanç konusunda net bir ayrımı ilan eder. Aynı kök (ع-ب-د) hem fiil hem isim hâlinde defalarca geçer; olumsuzluğu ve “siz” şahsını iki zamanda karşılaştırmak için idealdir.",
      hedefler: ["لَا + muzari ile olumsuz cümle kurmak", "Fiil (أَعْبُدُ) ile فَاعِل ismini (عَابِد) ayırmak", "“Siz”in mâzi ve muzari biçimini karşılaştırmak"],
      odak: [
        { ar: "لَا أَعْبُدُ", baslik: "Olumsuz muzari", metin: "لَا muzarinin başına gelince “-mem, -maz” anlamı verir: “kulluk etmem”." },
        { ar: "أَعْبُدُ / عَابِد", baslik: "Fiil – yapan", metin: "أَعْبُدُ bir eylemdir: “kulluk ederim”. عَابِد ise bir niteliktir: “kulluk eden”." },
        { ar: "عَبَدتُّمْ / تَعْبُدُونَ", baslik: "İki zamanda “siz”", metin: "Mâzide sonda تُمْ (Ders 06), muzaride başta تَـ ve sonda ـُونَ (Ders 07)." }
      ],
      kartlar: [["الْكَافِرُون", "inkâr edenler", "İsim"], ["لَا", "-mez, değil", "Harf"], ["أَعْبُدُ", "kulluk ederim", "Fiil"], ["تَعْبُدُونَ", "kulluk edersiniz", "Fiil"], ["عَابِد", "kulluk eden", "İsim"], ["عَبَدتُّمْ", "kulluk ettiniz", "Fiil"], ["أَنتُمْ", "siz", "Zamir"], ["دِين", "din", "İsim"]],
      ayetler: [
        { okunus: "Kul yâ eyyühe’l-kâfirûn", meal: "De ki: Ey kâfirler!", kelimeler: [
          { w: "قُلْ", o: "kul", t: "de ki", r: "fiil", n: "Emir: “söyle!”.", k: "ق-و-ل" },
          { w: "يَا أَيُّهَا", o: "yâ eyyühe", t: "ey", r: "harf", n: "يَا seslenme edatı + أَيُّهَا (belirli isme seslenirken kullanılan köprü). Mushafta tek kelime gibi okunur." },
          { w: "الْكَافِرُونَ", o: "l-kâfirûn", t: "kâfirler, inkâr edenler", r: "isim", n: "كَافِر (فَاعِل: örten, inkâr eden) + ـُونَ eril çoğul eki. Kök “örtmek” anlamındadır.", k: "ك-ف-ر" }
        ] },
        { okunus: "Lâ a‘büdü mâ ta‘büdûn", meal: "Ben sizin taptıklarınıza kulluk etmem.", kelimeler: [
          { w: "لَا", o: "lâ", t: "-mem", r: "harf", n: "Muzarinin başında olumsuzluk: “-mem, -maz”." },
          { w: "أَعْبُدُ", o: "a‘büdü", t: "kulluk ederim", r: "fiil", n: "Muzari, أَ “ben” (Ders 07). Fâtiha’daki نَعْبُدُ ile aynı fiil.", k: "ع-ب-د" },
          { w: "مَا", o: "mâ", t: "-dığınız şey", r: "zamir", n: "İlgi zamiri: “taptığınız şey”." },
          { w: "تَعْبُدُونَ", o: "ta‘büdûn", t: "kulluk ediyorsunuz", r: "fiil", n: "تَـ...ـُونَ “siz (erkek/karma)” (Ders 07).", k: "ع-ب-د" }
        ] },
        { okunus: "Ve lâ entüm ‘âbidûne mâ a‘büd", meal: "Siz de benim kulluk ettiğime kulluk edecek değilsiniz.", kelimeler: [
          { w: "وَلَا", o: "ve lâ", t: "ve değil", r: "harf", n: "İsim cümlesinde “değil” anlamı." },
          { w: "أَنتُمْ", o: "entüm", t: "siz", r: "zamir", n: "2. çoğul eril zamir (Ders 03)." },
          { w: "عَابِدُونَ", o: "‘âbidûne", t: "kulluk edenler", r: "isim", n: "عَابِد (فَاعِل) + ـُونَ eril çoğul. Fiil değil isim: kalıcı durum anlatır.", k: "ع-ب-د" },
          { w: "مَا", o: "mâ", t: "-dığım şey", r: "zamir", n: "İlgi zamiri." },
          { w: "أَعْبُدُ", o: "a‘büd", t: "kulluk ederim", r: "fiil", n: "Muzari “ben”. Durakta son hareke okunmaz: a‘büd.", k: "ع-ب-د" }
        ] },
        { okunus: "Ve lâ ene ‘âbidün mâ ‘abedtüm", meal: "Ben de sizin taptıklarınıza kulluk edecek değilim.", kelimeler: [
          { w: "وَلَا", o: "ve lâ", t: "ve değil", r: "harf", n: "وَ + لَا." },
          { w: "أَنَا", o: "ene", t: "ben", r: "zamir", n: "1. tekil zamir (Ders 03)." },
          { w: "عَابِدٌ", o: "‘âbidün", t: "kulluk eden", r: "isim", n: "Tekil فَاعِل. Tenvin ve sonraki مَا birleşince şeddeli okunur: ‘âbidum-mâ.", k: "ع-ب-د" },
          { w: "مَّا", o: "mâ", t: "-dığınız şey", r: "zamir", n: "Şedde: önceki tenvinin nûnu mîme katılır (idgam)." },
          { w: "عَبَدتُّمْ", o: "‘abettüm", t: "kulluk ettiniz", r: "fiil", n: "Mâzi; sondaki تُمْ “siz” ekidir (Ders 06). د ile ت birleşir: ‘abettüm okunur.", k: "ع-ب-د" }
        ] },
        { okunus: "Ve lâ entüm ‘âbidûne mâ a‘büd", meal: "Siz de benim kulluk ettiğime kulluk edecek değilsiniz.", kelimeler: [
          { w: "وَلَا", o: "ve lâ", t: "ve değil", r: "harf", n: "3. âyetin tekrarı: vurgu ve kesinlik için." },
          { w: "أَنتُمْ", o: "entüm", t: "siz", r: "zamir", n: "2. çoğul eril zamir." },
          { w: "عَابِدُونَ", o: "‘âbidûne", t: "kulluk edenler", r: "isim", n: "فَاعِل + ـُونَ.", k: "ع-ب-د" },
          { w: "مَا", o: "mâ", t: "-dığım şey", r: "zamir", n: "İlgi zamiri." },
          { w: "أَعْبُدُ", o: "a‘büd", t: "kulluk ederim", r: "fiil", n: "Muzari “ben”.", k: "ع-ب-د" }
        ] },
        { okunus: "Leküm dînüküm ve liye dîn", meal: "Sizin dininiz size, benim dinim banadır.", kelimeler: [
          { w: "لَكُمْ", o: "leküm", t: "size, sizin için", r: "harf", n: "لِـ “için” + ـكُمْ “siz”." },
          { w: "دِينُكُمْ", o: "dînüküm", t: "dininiz", r: "isim", n: "دِين + ـكُمْ “sizin”.", k: "د-ي-ن" },
          { w: "وَلِيَ", o: "ve liye", t: "ve bana", r: "harf", n: "وَ + لِـ + ـيَ “ben”." },
          { w: "دِينِ", o: "dîn", t: "dinim", r: "isim", n: "Aslı دِينِي “dinim”; sondaki ي düşmüş, esre onu gösterir.", k: "د-ي-ن" }
        ] }
      ],
      sorular: [
        { s: "لَا أَعْبُدُ ne demektir?", secenekler: [["etmem", "Kulluk etmem"], ["ettim", "Kulluk ettim"], ["et", "Kulluk et!"]], cevap: "etmem", aciklama: "لَا + muzari “ben” = “-mem”." },
        { s: "تَعْبُدُونَ hangi şahıstır?", secenekler: [["siz", "Siz"], ["onlar", "Onlar"], ["biz", "Biz"]], cevap: "siz", aciklama: "تَـ...ـُونَ muzari “siz” kalıbıdır." },
        { s: "عَبَدتُّمْ ne demektir?", secenekler: [["ettiniz", "Kulluk ettiniz"], ["ediyorsunuz", "Kulluk ediyorsunuz"], ["edin", "Kulluk edin!"]], cevap: "ettiniz", aciklama: "Mâzide sondaki تُمْ “siz” ekidir." },
        { s: "عَابِدٌ ne demektir?", secenekler: [["eden", "Kulluk eden"], ["etti", "Kulluk etti"], ["ibadet", "Kulluk (ibadet)"]], cevap: "eden", aciklama: "فَاعِل kalıbı “yapan” anlamı verir." },
        { s: "لَكُمْ دِينُكُمْ ne demektir?", secenekler: [["sizin-dininiz", "Sizin dininiz size"], ["bizim", "Bizim dinimiz"], ["yok", "Sizin için din yok"]], cevap: "sizin-dininiz", aciklama: "لَكُمْ “size”, دِينُكُمْ “dininiz”." },
        { s: "أَنتُمْ ne demektir?", secenekler: [["siz", "Siz"], ["onlar", "Onlar"], ["sen", "Sen"]], cevap: "siz", aciklama: "أَنتُمْ 2. çoğul eril zamirdir." }
      ]
    },

    108: {
      ad: "Kevser", adAr: "الْكَوْثَر", anlam: "Bol hayır", yer: "Mekke", dakika: 20,
      giris: "Kur’an’ın en kısa sûresi. Ders 06’da “biz” ekini burada görmüştük; şimdi her kelimeyi ayrı ayrı çözüyoruz.",
      hedefler: ["أَعْطَيْنَاكَ içindeki iki eki ayırmak", "Emir fiilleri tanımak: صَلِّ، انْحَرْ", "إِنَّ vurgu edatını görmek"],
      odak: [
        { ar: "أَعْطَيْنَاكَ", baslik: "Fiil + iki ek", metin: "أَعْطَى “verdi” + نَا “biz” (Ders 06) + كَ “sana”: “sana verdik”." },
        { ar: "صَلِّ · انْحَرْ", baslik: "Emir", metin: "“Namaz kıl!” ve “kurban kes!”. Emir fiilde şahıs harfi yoktur, sonu sakin ya da kısalmıştır." },
        { ar: "إِنَّ", baslik: "Vurgu", metin: "إِنَّ “şüphesiz, gerçekten” anlamı verir ve kendinden sonraki ismi üstün yapar: إِنَّ شَانِئَكَ." }
      ],
      kartlar: [["إِنَّا", "şüphesiz biz", "Harf + zamir"], ["أَعْطَيْنَا", "verdik", "Fiil"], ["الْكَوْثَر", "bol hayır, Kevser", "İsim"], ["صَلِّ", "namaz kıl!", "Fiil"], ["رَبِّكَ", "Rabbin", "İsim"], ["انْحَرْ", "kurban kes!", "Fiil"], ["شَانِئ", "kin besleyen", "İsim"], ["الْأَبْتَر", "soyu kesik", "İsim"]],
      ayetler: [
        { okunus: "İnnâ a‘taynâke’l-kevser", meal: "Şüphesiz biz sana Kevser’i verdik.", kelimeler: [
          { w: "إِنَّا", o: "innâ", t: "şüphesiz biz", r: "harf", n: "إِنَّ “şüphesiz” + نَا “biz”." },
          { w: "أَعْطَيْنَاكَ", o: "a‘taynâke", t: "sana verdik", r: "fiil", n: "أَعْطَى “verdi” + نَا “biz” (Ders 06) + كَ “sana”. Atâ ve atiyye bu köktendir.", k: "ع-ط-و" },
          { w: "الْكَوْثَرَ", o: "l-kevser", t: "Kevser’i, bol hayrı", r: "isim", n: "Çok bol hayır; cennette bir ırmak. Kesret “çokluk” ile aynı kök. Nesne: üstün.", k: "ك-ث-ر" }
        ] },
        { okunus: "Fe-salli li-rabbike venhar", meal: "Öyleyse Rabbin için namaz kıl ve kurban kes.", kelimeler: [
          { w: "فَصَلِّ", o: "fe-salli", t: "öyleyse namaz kıl", r: "fiil", n: "فَـ “öyleyse” + صَلِّ emir: “namaz kıl”. Salât bu köktendir.", k: "ص-ل-و" },
          { w: "لِرَبِّكَ", o: "li-rabbike", t: "Rabbin için", r: "isim", n: "لِـ “için” + رَبّ + كَ “senin”.", k: "ر-ب-ب" },
          { w: "وَانْحَرْ", o: "venhar", t: "ve kurban kes", r: "fiil", n: "وَ + انْحَرْ emir: “kurban kes”.", k: "ن-ح-ر" }
        ] },
        { okunus: "İnne şâni’eke hüve’l-ebter", meal: "Asıl soyu kesik olan, sana kin besleyendir.", kelimeler: [
          { w: "إِنَّ", o: "inne", t: "şüphesiz", r: "harf", n: "Vurgu edatı; sonraki ismi üstün yapar." },
          { w: "شَانِئَكَ", o: "şâni’eke", t: "sana buğzeden", r: "isim", n: "شَانِئ (فَاعِل: kin besleyen) + كَ “seni”.", k: "ش-ن-أ" },
          { w: "هُوَ", o: "hüve", t: "o (ta kendisi)", r: "zamir", n: "Vurgu için: “asıl o”." },
          { w: "الْأَبْتَرُ", o: "l-ebter", t: "soyu kesik olan", r: "isim", n: "Kök “kesmek” anlamındadır. أَفْعَل kalıbı bir niteliği anlatır.", k: "ب-ت-ر" }
        ] }
      ],
      sorular: [
        { s: "أَعْطَيْنَاكَ içindeki نَا hangi şahıstır?", secenekler: [["biz", "Biz"], ["ben", "Ben"], ["onlar", "Onlar"]], cevap: "biz", aciklama: "Mâzide نَا “biz” ekidir." },
        { s: "أَعْطَيْنَاكَ sonundaki كَ ne demektir?", secenekler: [["sana", "Sana"], ["bize", "Bize"], ["ona", "Ona"]], cevap: "sana", aciklama: "ـكَ “seni / sana” zamir ekidir." },
        { s: "صَلِّ ne demektir?", secenekler: [["kil", "Namaz kıl!"], ["kildi", "Namaz kıldı"], ["kiliyor", "Namaz kılıyor"]], cevap: "kil", aciklama: "Emir fiil." },
        { s: "لِرَبِّكَ ne demektir?", secenekler: [["icin", "Rabbin için"], ["den", "Rabbinden"], ["rabbim", "Rabbim"]], cevap: "icin", aciklama: "لِـ “için” + رَبّ + ـكَ “senin”." },
        { s: "الْأَبْتَرُ ne demektir?", secenekler: [["kesik", "Soyu kesik"], ["hayir", "Bol hayır"], ["kurban", "Kurban"]], cevap: "kesik", aciklama: "Kök “kesmek” anlamındadır." },
        { s: "إِنَّا ne demektir?", secenekler: [["suphesiz-biz", "Şüphesiz biz"], ["ey-biz", "Ey biz"], ["bizden", "Bizden"]], cevap: "suphesiz-biz", aciklama: "إِنَّ + نَا." }
      ]
    },

    107: {
      ad: "Mâûn", adAr: "الْمَاعُون", anlam: "Küçük yardım, gündelik eşya", yer: "Mekke", dakika: 30,
      giris: "Dini yalanlayanın tavırlarını anlatır. Muzari “onlar” biçimleri, eril çoğul ekleri ve الَّذِي / الَّذِينَ ilgi zamirleri bu sûrede sık geçer.",
      hedefler: ["Muzari “onlar” biçimlerini okumak", "Çoğul eki ـُونَ / ـِينَ farkını görmek", "الَّذِي / الَّذِينَ ayrımı"],
      odak: [
        { ar: "يُرَاءُونَ · يَمْنَعُونَ", baslik: "Muzari “onlar”", metin: "Başta يَـ/يُـ, sonda ـُونَ: “gösteriş yapıyorlar”, “esirgiyorlar”." },
        { ar: "سَاهُونَ / الْمُصَلِّينَ", baslik: "Çoğul eki", metin: "Eril çoğul ـُونَ özne durumunda, ـِينَ edattan sonra veya nesne durumunda kullanılır." },
        { ar: "الَّذِي / الَّذِينَ", baslik: "İlgi zamiri", metin: "الَّذِي “o kimse ki” (tekil), الَّذِينَ “o kimseler ki” (çoğul)." }
      ],
      kartlar: [["أَرَأَيْتَ", "gördün mü?", "Fiil"], ["يُكَذِّبُ", "yalanlıyor", "Fiil"], ["الْيَتِيم", "yetim", "İsim"], ["الْمِسْكِين", "yoksul", "İsim"], ["طَعَام", "yemek", "İsim"], ["صَلَاة", "namaz", "İsim"], ["الَّذِينَ", "o kimseler ki", "Zamir"], ["يَمْنَعُونَ", "engelliyorlar", "Fiil"]],
      ayetler: [
        { okunus: "Era’eyte’llezî yükezzibu bi’d-dîn", meal: "Dini (hesap gününü) yalanlayanı gördün mü?", kelimeler: [
          { w: "أَرَأَيْتَ", o: "era’eyte", t: "gördün mü?", r: "fiil", n: "أَ soru harfi + رَأَيْتَ “gördün” (Nasr sûresinde geçti).", k: "ر-أ-ي" },
          { w: "الَّذِي", o: "llezî", t: "o kimseyi ki", r: "zamir", n: "İlgi zamiri, eril tekil." },
          { w: "يُكَذِّبُ", o: "yükezzibu", t: "yalanlıyor", r: "fiil", n: "Muzari “o”. Orta harfi şeddeli kalıp (فَعَّلَ): “yalan saymak”. Kizb “yalan” bu köktendir.", k: "ك-ذ-ب" },
          { w: "بِالدِّينِ", o: "bi’d-dîn", t: "dini, hesap gününü", r: "isim", n: "بِـ + الدِّين. Burada “din” hesap ve ceza günü anlamındadır (Fâtiha: يَوْمِ الدِّينِ). Dâl şemsîdir.", k: "د-ي-ن" }
        ] },
        { okunus: "Fe-zâlike’llezî yedu‘‘u’l-yetîm", meal: "İşte o, yetimi itip kakar,", kelimeler: [
          { w: "فَذَٰلِكَ", o: "fe-zâlike", t: "işte o", r: "zamir", n: "فَـ + ذَٰلِكَ “şu, o” (uzak için işaret). هَذَا yakın, ذَٰلِكَ uzak içindir." },
          { w: "الَّذِي", o: "llezî", t: "o kimse ki", r: "zamir", n: "İlgi zamiri." },
          { w: "يَدُعُّ", o: "yedu‘‘u", t: "sertçe iter", r: "fiil", n: "Muzari “o”: kabaca iter, kovar.", k: "د-ع-ع" },
          { w: "الْيَتِيمَ", o: "l-yetîm", t: "yetimi", r: "isim", n: "Nesne: üstün. Yâ kamerî harf: lâm okunur.", k: "ي-ت-م" }
        ] },
        { okunus: "Ve lâ yehuddu ‘alâ ta‘âmi’l-miskîn", meal: "Yoksulu doyurmaya teşvik etmez.", kelimeler: [
          { w: "وَلَا", o: "ve lâ", t: "ve -mez", r: "harf", n: "وَ + olumsuzluk لَا." },
          { w: "يَحُضُّ", o: "yehuddu", t: "teşvik eder", r: "fiil", n: "Muzari “o”; لَا ile “teşvik etmez”.", k: "ح-ض-ض" },
          { w: "عَلَىٰ", o: "‘alâ", t: "-e (üzerine)", r: "harf", n: "Ders 01’deki “üzerinde” edatı; burada teşvik edilen şeyi gösterir." },
          { w: "طَعَامِ", o: "ta‘âmi", t: "yedirmeye", r: "isim", n: "Yemek, yedirmek.", k: "ط-ع-م" },
          { w: "الْمِسْكِينِ", o: "l-miskîn", t: "yoksulun", r: "isim", n: "Miskin: yoksul. Türkçedeki “miskin” buradan gelir ama anlamı kaymıştır.", k: "س-ك-ن" }
        ] },
        { okunus: "Fe-veylün li’l-musallîn", meal: "Yazıklar olsun o namaz kılanlara ki,", kelimeler: [
          { w: "فَوَيْلٌ", o: "fe-veylün", t: "yazıklar olsun", r: "isim", n: "فَـ + وَيْل “vay hâline, helâk”." },
          { w: "لِّلْمُصَلِّينَ", o: "li’l-musallîn", t: "namaz kılanlara", r: "isim", n: "لِـ + الْمُصَلِّين (مُصَلٍّ “namaz kılan”). Edattan sonra çoğul eki ـُونَ yerine ـِينَ olur.", k: "ص-ل-و" }
        ] },
        { okunus: "Ellezîne hüm ‘an salâtihim sâhûn", meal: "Onlar namazlarından gafildirler.", kelimeler: [
          { w: "الَّذِينَ", o: "ellezîne", t: "o kimseler ki", r: "zamir", n: "الَّذِي’nin eril çoğulu." },
          { w: "هُمْ", o: "hüm", t: "onlar", r: "zamir", n: "3. çoğul eril zamir (Ders 03)." },
          { w: "عَن", o: "‘an", t: "-den", r: "harf", n: "“-den, hakkında” edatı." },
          { w: "صَلَاتِهِمْ", o: "salâtihim", t: "namazlarından", r: "isim", n: "صَلَاة + ـهِمْ “onların”. Ek alınca ة, ت olur.", k: "ص-ل-و" },
          { w: "سَاهُونَ", o: "sâhûn", t: "gafil olanlar", r: "isim", n: "سَاهٍ (فَاعِل: unutan, gaflet eden) + ـُونَ. Sehiv secdesi bu köktendir.", k: "س-ه-و" }
        ] },
        { okunus: "Ellezîne hüm yürâ’ûn", meal: "Onlar gösteriş yaparlar,", kelimeler: [
          { w: "الَّذِينَ", o: "ellezîne", t: "o kimseler ki", r: "zamir", n: "Çoğul ilgi zamiri." },
          { w: "هُمْ", o: "hüm", t: "onlar", r: "zamir", n: "3. çoğul eril zamir." },
          { w: "يُرَاءُونَ", o: "yürâ’ûn", t: "gösteriş yapıyorlar", r: "fiil", n: "Muzari “onlar” (يُـ...ـُونَ). “Görmek” kökünden: başkaları görsün diye yapmak, yani riya.", k: "ر-أ-ي" }
        ] },
        { okunus: "Ve yemne‘ûne’l-mâ‘ûn", meal: "Ve en küçük yardımı bile esirgerler.", kelimeler: [
          { w: "وَيَمْنَعُونَ", o: "ve yemne‘ûne", t: "ve esirgerler", r: "fiil", n: "Muzari “onlar”. Memnû “yasak” bu köktendir.", k: "م-ن-ع" },
          { w: "الْمَاعُونَ", o: "l-mâ‘ûn", t: "küçük yardımı", r: "isim", n: "Komşudan istenen gündelik eşya ve küçük yardım. Sûre adını bu kelimeden alır." }
        ] }
      ],
      sorular: [
        { s: "أَرَأَيْتَ ne demektir?", secenekler: [["gordun-mu", "Gördün mü?"], ["gordum", "Gördüm"], ["goruyor", "Görüyor"]], cevap: "gordun-mu", aciklama: "أَ soru harfi + رَأَيْتَ “gördün”." },
        { s: "الَّذِينَ ne demektir?", secenekler: [["cogul", "O kimseler ki (çoğul)"], ["tekil", "O kimse ki (tekil)"], ["bu", "Bu"]], cevap: "cogul", aciklama: "الَّذِينَ, الَّذِي’nin çoğuludur." },
        { s: "يَمْنَعُونَ hangi şahıstır?", secenekler: [["onlar", "Onlar"], ["siz", "Siz"], ["biz", "Biz"]], cevap: "onlar", aciklama: "يَـ...ـُونَ muzari “onlar”." },
        { s: "الْيَتِيمَ ne demektir?", secenekler: [["yetim", "Yetim"], ["yoksul", "Yoksul"], ["namaz", "Namaz kılan"]], cevap: "yetim", aciklama: "يَتِيم: babası olmayan çocuk." },
        { s: "صَلَاتِهِمْ içindeki ـهِمْ ne demektir?", secenekler: [["onlarin", "Onların"], ["bizim", "Bizim"], ["senin", "Senin"]], cevap: "onlarin", aciklama: "ـهِمْ / ـهُمْ “onların” ekidir." },
        { s: "لِلْمُصَلِّينَ kelimesinde çoğul eki neden ـِينَ?", secenekler: [["edat", "Edattan sonra geldiği için"], ["disil", "Dişil olduğu için"], ["ikil", "İkil olduğu için"]], cevap: "edat", aciklama: "Eril çoğul ـُونَ, edattan sonra ـِينَ olur." }
      ]
    },

    106: {
      ad: "Kureyş", adAr: "قُرَيْش", anlam: "Kureyş kabilesi", yer: "Mekke", dakika: 25,
      giris: "Kureyş kabilesine verilen güven ve rızık nimetini hatırlatır. Ders 01–02’den bildiğin بَيْت ve هَذَا burada Kâbe için kullanılır.",
      hedefler: ["هَٰذَا الْبَيْتِ “bu ev” yapısını tanımak", "Fiile bitişen “onları” ekini (ـهُم) görmek", "Aynı kökü farklı kelimelerde bulmak: طَعَام / أَطْعَمَ"],
      odak: [
        { ar: "هَٰذَا الْبَيْتِ", baslik: "Bu + belirli isim", metin: "هَذَا ardından “el-” almış isim gelince “bu ev” olur (Ders 02). Burada Kâbe kastedilir." },
        { ar: "أَطْعَمَهُم", baslik: "Fiil + nesne eki", metin: "أَطْعَمَ “doyurdu” + ـهُم “onları”: “onları doyurdu”." },
        { ar: "طَعَام · أَطْعَمَ", baslik: "Ortak kök", metin: "Mâûn’daki طَعَام “yemek” ile buradaki أَطْعَمَ “doyurdu” aynı kökten (ط-ع-م)." }
      ],
      kartlar: [["إِيلَاف", "alışkanlık, ülfet", "İsim"], ["رِحْلَة", "yolculuk", "İsim"], ["الشِّتَاء", "kış", "İsim"], ["الصَّيْف", "yaz", "İsim"], ["الْبَيْت", "ev (Kâbe)", "İsim"], ["أَطْعَمَ", "doyurdu", "Fiil"], ["جُوع", "açlık", "İsim"], ["خَوْف", "korku", "İsim"]],
      ayetler: [
        { okunus: "Li-îlâfi kureyş", meal: "Kureyş’in alışkanlığı için;", kelimeler: [
          { w: "لِإِيلَافِ", o: "li-îlâfi", t: "alışkanlığı için", r: "isim", n: "لِـ “için” + إِيلَاف “alıştırma, güvenli ülfet”. Ülfet ve ünsiyet bu köktendir.", k: "أ-ل-ف" },
          { w: "قُرَيْشٍ", o: "kureyş", t: "Kureyş’in", r: "isim", n: "Peygamberimizin kabilesi. Tenvinli esre." }
        ] },
        { okunus: "Îlâfihim rihlete’ş-şitâi ve’s-sayf", meal: "Onların kış ve yaz yolculuklarına alışkanlığı için,", kelimeler: [
          { w: "إِيلَافِهِمْ", o: "îlâfihim", t: "onların alışkanlığı", r: "isim", n: "إِيلَاف + ـهِمْ “onların”.", k: "أ-ل-ف" },
          { w: "رِحْلَةَ", o: "rihlete", t: "yolculuğuna", r: "isim", n: "Rıhlet “seyahat” bu kelimedir. Nesne: üstün.", k: "ر-ح-ل" },
          { w: "الشِّتَاءِ", o: "ş-şitâi", t: "kışın", r: "isim", n: "Şîn şemsî: lâm okunmaz. Tamlamanın ikinci öğesi: esre.", k: "ش-ت-و" },
          { w: "وَالصَّيْفِ", o: "ve’s-sayf", t: "ve yazın", r: "isim", n: "Sâd şemsî. Durakta “sayf” okunur.", k: "ص-ي-ف" }
        ] },
        { okunus: "Fe’l-ya‘büdû rabbe hâze’l-beyt", meal: "Bu evin (Kâbe’nin) Rabbine kulluk etsinler,", kelimeler: [
          { w: "فَلْيَعْبُدُوا", o: "fel-ya‘büdû", t: "kulluk etsinler", r: "fiil", n: "فَـ + لِـ (emir lâmı: “-sinler”) + يَعْبُدُوا. Muzarinin sonundaki نَ düşer, yerine okunmayan elif yazılır.", k: "ع-ب-د" },
          { w: "رَبَّ", o: "rabbe", t: "Rabbine", r: "isim", n: "Nesne: üstün.", k: "ر-ب-ب" },
          { w: "هَٰذَا", o: "hâze", t: "bu", r: "zamir", n: "Ders 02’deki işaret ismi." },
          { w: "الْبَيْتِ", o: "l-beyt", t: "evin", r: "isim", n: "Ders 01’de öğrendiğin بَيْت; burada Kâbe.", k: "ب-ي-ت" }
        ] },
        { okunus: "Ellezî at‘amehüm min cû‘in ve âmenehüm min havf", meal: "O ki onları açlıktan doyurdu ve korkudan emin kıldı.", kelimeler: [
          { w: "الَّذِي", o: "ellezî", t: "O ki", r: "zamir", n: "İlgi zamiri: Rabbi açıklar." },
          { w: "أَطْعَمَهُم", o: "at‘amehüm", t: "onları doyurdu", r: "fiil", n: "أَطْعَمَ “yedirdi” + ـهُم “onları”. Mâûn’daki طَعَام ile aynı kök.", k: "ط-ع-م" },
          { w: "مِّن", o: "min", t: "-den", r: "harf", n: "Şedde: önceki mîm ile birleşir." },
          { w: "جُوعٍ", o: "cû‘in", t: "açlıktan", r: "isim", n: "Açlık. Edattan sonra tenvinli esre.", k: "ج-و-ع" },
          { w: "وَآمَنَهُم", o: "ve âmenehüm", t: "ve onları emin kıldı", r: "fiil", n: "آمَنَ “güvene kavuşturdu” + ـهُم. Emin, îman ve emniyet bu köktendir.", k: "أ-م-ن" },
          { w: "مِّنْ", o: "min", t: "-den", r: "harf", n: "Ayrılma edatı." },
          { w: "خَوْفٍ", o: "havf", t: "korkudan", r: "isim", n: "Korku. Durakta “havf” okunur.", k: "خ-و-ف" }
        ] }
      ],
      sorular: [
        { s: "هَٰذَا الْبَيْتِ ne demektir?", secenekler: [["bu-ev", "Bu ev"], ["bu-bir-ev", "Bu bir evdir"], ["ev-sahibi", "Evin sahibi"]], cevap: "bu-ev", aciklama: "هَذَا + “el-” almış isim = “bu ev”." },
        { s: "أَطْعَمَهُم ne demektir?", secenekler: [["onlari", "Onları doyurdu"], ["onlar", "Onlar doyurdu"], ["bizi", "Bizi doyurdu"]], cevap: "onlari", aciklama: "Fiile bitişen ـهُم nesnedir: “onları”." },
        { s: "خَوْف ne demektir?", secenekler: [["korku", "Korku"], ["aclik", "Açlık"], ["yolculuk", "Yolculuk"]], cevap: "korku", aciklama: "خَوْف: korku." },
        { s: "الشِّتَاءِ وَالصَّيْفِ ne demektir?", secenekler: [["kis-yaz", "Kış ve yaz"], ["gece-gunduz", "Gece ve gündüz"], ["yol-ev", "Yolculuk ve ev"]], cevap: "kis-yaz", aciklama: "شِتَاء kış, صَيْف yaz." },
        { s: "فَلْيَعْبُدُوا ne demektir?", secenekler: [["etsinler", "Kulluk etsinler"], ["ettiler", "Kulluk ettiler"], ["etmezler", "Kulluk etmezler"]], cevap: "etsinler", aciklama: "Emir lâmı لِـ “-sinler” anlamı verir." },
        { s: "جُوع ne demektir?", secenekler: [["aclik", "Açlık"], ["korku", "Korku"], ["yemek", "Yemek"]], cevap: "aclik", aciklama: "جُوع: açlık." }
      ]
    },

    105: {
      ad: "Fîl", adAr: "الْفِيل", anlam: "Fil", yer: "Mekke", dakika: 25,
      giris: "Kâbe’yi yıkmak isteyen fil ordusunun akıbetini anlatır. Aynı fiilin mâzi ve muzari hâlini, أَلَمْ soru kalıbını ve مَفْعُول “edilen” kalıbını göreceğiz.",
      hedefler: ["أَلَمْ “-medi mi?” kalıbını tanımak", "جَعَلَ / يَجْعَلْ: aynı fiilin iki zamanı", "فَاعِل ile مَفْعُول farkını görmek"],
      odak: [
        { ar: "أَلَمْ تَرَ", baslik: "-medin mi?", metin: "أَ soru harfi + لَمْ olumsuz geçmiş: “görmedin mi?”. Cevabı belli olan, düşündürmek için sorulan sorudur." },
        { ar: "جَعَلَ / يَجْعَلْ", baslik: "Mâzi – muzari", metin: "Aynı fiil 5. âyette mâzi (جَعَلَ “kıldı”), 2. âyette لَمْ ile muzari (يَجْعَلْ) olarak geçer." },
        { ar: "مَأْكُول", baslik: "مَفْعُول: edilen", metin: "Başta مَـ, ortada و olan kalıp “-ilmiş” anlamı verir: مَأْكُول “yenmiş”, مَكْتُوب “yazılmış”." }
      ],
      kartlar: [["كَيْفَ", "nasıl", "Soru"], ["فَعَلَ", "yaptı", "Fiil"], ["أَصْحَاب", "sahipler, arkadaşlar", "İsim"], ["الْفِيل", "fil", "İsim"], ["أَرْسَلَ", "gönderdi", "Fiil"], ["طَيْر", "kuşlar", "İsim"], ["حِجَارَة", "taşlar", "İsim"], ["مَأْكُول", "yenmiş", "İsim"]],
      ayetler: [
        { okunus: "E lem tera keyfe fe‘ale rabbüke bi-ashâbi’l-fîl", meal: "Rabbinin fil sahiplerine ne yaptığını görmedin mi?", kelimeler: [
          { w: "أَلَمْ", o: "e lem", t: "-medin mi?", r: "soru", n: "أَ soru harfi + لَمْ olumsuz geçmiş." },
          { w: "تَرَ", o: "tera", t: "görmek (görmedin)", r: "fiil", n: "Muzari تَرَى “görürsün”; لَمْ ile sondaki elif düşer: تَرَ.", k: "ر-أ-ي" },
          { w: "كَيْفَ", o: "keyfe", t: "nasıl", r: "soru", n: "Soru kelimesi: “nasıl”." },
          { w: "فَعَلَ", o: "fe‘ale", t: "yaptı", r: "fiil", n: "Mâzi “o yaptı”. “Fiil” kelimesi de bu köktendir.", k: "ف-ع-ل" },
          { w: "رَبُّكَ", o: "rabbüke", t: "Rabbin", r: "isim", n: "Özne: ötre + ـكَ “senin”.", k: "ر-ب-ب" },
          { w: "بِأَصْحَابِ", o: "bi-ashâbi", t: "sahiplerine", r: "isim", n: "بِـ + أَصْحَاب “sahipler, arkadaşlar” (tekili صَاحِب). Sahabe bu köktendir.", k: "ص-ح-ب" },
          { w: "الْفِيلِ", o: "l-fîl", t: "filin", r: "isim", n: "Fil. Tamlamanın ikinci öğesi: esre." }
        ] },
        { okunus: "E lem yec‘al keydehüm fî tadlîl", meal: "Onların tuzaklarını boşa çıkarmadı mı?", kelimeler: [
          { w: "أَلَمْ", o: "e lem", t: "-medi mi?", r: "soru", n: "Aynı soru kalıbı." },
          { w: "يَجْعَلْ", o: "yec‘al", t: "kılmadı", r: "fiil", n: "Muzari يَجْعَلُ “kılar”; لَمْ ile sonu sakin.", k: "ج-ع-ل" },
          { w: "كَيْدَهُمْ", o: "keydehüm", t: "tuzaklarını", r: "isim", n: "كَيْد “hile, tuzak” + ـهُمْ “onların”.", k: "ك-ي-د" },
          { w: "فِي", o: "fî", t: "içinde", r: "harf", n: "Yer edatı." },
          { w: "تَضْلِيلٍ", o: "tadlîl", t: "boşa çıkma", r: "isim", n: "Saptırma, boşa çıkarma. Dalâlet bu köktendir.", k: "ض-ل-ل" }
        ] },
        { okunus: "Ve ersele ‘aleyhim tayran ebâbîl", meal: "Ve üzerlerine sürü sürü kuşlar gönderdi,", kelimeler: [
          { w: "وَأَرْسَلَ", o: "ve ersele", t: "ve gönderdi", r: "fiil", n: "Mâzi (أَفْعَلَ kalıbı). Resûl “elçi” ve risâle bu köktendir.", k: "ر-س-ل" },
          { w: "عَلَيْهِمْ", o: "‘aleyhim", t: "üzerlerine", r: "harf", n: "عَلَى + ـهِمْ “onlar”." },
          { w: "طَيْرًا", o: "tayran", t: "kuşlar", r: "isim", n: "Nesne: üstün tenvin.", k: "ط-ي-ر" },
          { w: "أَبَابِيلَ", o: "ebâbîl", t: "sürü sürü", r: "isim", n: "Bölük bölük gelen topluluklar." }
        ] },
        { okunus: "Termîhim bi-hicâratin min siccîl", meal: "Onlara pişmiş çamurdan taşlar atıyorlardı,", kelimeler: [
          { w: "تَرْمِيهِم", o: "termîhim", t: "onlara atıyordu", r: "fiil", n: "Muzari; تَـ burada “o (dişil)”: kuş topluluğu dişil kabul edilir. + ـهِم “onlara”.", k: "ر-م-ي" },
          { w: "بِحِجَارَةٍ", o: "bi-hicâratin", t: "taşlarla", r: "isim", n: "بِـ “ile” + حِجَارَة “taşlar” (tekili حَجَر).", k: "ح-ج-ر" },
          { w: "مِّن", o: "min", t: "-den", r: "harf", n: "Malzeme bildirir." },
          { w: "سِجِّيلٍ", o: "siccîl", t: "pişmiş çamur", r: "isim", n: "Pişmiş, sertleşmiş çamur." }
        ] },
        { okunus: "Fe-ce‘alehüm ke-‘asfin me’kûl", meal: "Sonunda onları yenmiş ekin yaprağı gibi yaptı.", kelimeler: [
          { w: "فَجَعَلَهُمْ", o: "fe-ce‘alehüm", t: "sonunda onları kıldı", r: "fiil", n: "فَـ “böylece” + جَعَلَ “kıldı” (mâzi) + ـهُمْ “onları”. 2. âyetteki يَجْعَلْ ile aynı fiil.", k: "ج-ع-ل" },
          { w: "كَعَصْفٍ", o: "ke-‘asfin", t: "ekin yaprağı gibi", r: "isim", n: "كَـ “gibi” + عَصْف “saman, ekin yaprağı”.", k: "ع-ص-ف" },
          { w: "مَّأْكُولٍ", o: "me’kûl", t: "yenmiş", r: "isim", n: "مَفْعُول kalıbı: “yenilmiş”. يَأْكُلُ “yiyor” (Ders 07) ile aynı kök.", k: "أ-ك-ل" }
        ] }
      ],
      sorular: [
        { s: "كَيْفَ ne demektir?", secenekler: [["nasil", "Nasıl"], ["ne-zaman", "Ne zaman"], ["nerede", "Nerede"]], cevap: "nasil", aciklama: "كَيْفَ “nasıl” soru kelimesidir." },
        { s: "فَعَلَ ne demektir?", secenekler: [["yapti", "Yaptı"], ["yapiyor", "Yapıyor"], ["yap", "Yap!"]], cevap: "yapti", aciklama: "Ek almamış mâzi: “o yaptı”." },
        { s: "أَلَمْ تَرَ ne demektir?", secenekler: [["gormedin-mi", "Görmedin mi?"], ["goreceksin", "Göreceksin"], ["gordun", "Gördün"]], cevap: "gormedin-mi", aciklama: "أَ soru + لَمْ olumsuz geçmiş." },
        { s: "أَرْسَلَ ne demektir?", secenekler: [["gonderdi", "Gönderdi"], ["gonderiyor", "Gönderiyor"], ["gonderen", "Gönderen"]], cevap: "gonderdi", aciklama: "Mâzi: “o gönderdi”." },
        { s: "مَأْكُولٍ ne demektir?", secenekler: [["yenmis", "Yenmiş"], ["yiyen", "Yiyen"], ["yemek", "Yemek"]], cevap: "yenmis", aciklama: "مَفْعُول kalıbı “-ilmiş” anlamı verir." },
        { s: "حِجَارَة ne demektir?", secenekler: [["taslar", "Taşlar"], ["kuslar", "Kuşlar"], ["filler", "Filler"]], cevap: "taslar", aciklama: "حِجَارَة, حَجَر “taş” kelimesinin çoğuludur." }
      ]
    }
  },

  // Öğrenme sırası: sondan başa.
  sira: [114, 113, 112, 111, 110, 109, 108, 107, 106, 105],
  siradakiler: [
    { no: 104, ad: "Hümeze", adAr: "الْهُمَزَة" },
    { no: 103, ad: "Asr", adAr: "الْعَصْر" },
    { no: 102, ad: "Tekâsür", adAr: "التَّكَاثُر" }
  ]
};
