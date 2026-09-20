(() => {
  "use strict";

  const STORAGE_PREFIX = "arapca-ogreniyorum";
  const body = document.body;
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem(`${STORAGE_PREFIX}:theme`);
  const preferredDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const originalArabicText = new WeakMap();
  const arabicFonts = [
    { value: "noto-naskh", label: "Noto Naskh Arabic · varsayılan", stack: '"Noto Naskh Arabic", "Traditional Arabic", serif' },
    { value: "amiri", label: "Amiri", stack: '"Amiri", "Traditional Arabic", serif' },
    { value: "scheherazade", label: "Scheherazade New", stack: '"Scheherazade New", "Traditional Arabic", serif' },
    { value: "lateef", label: "Lateef", stack: '"Lateef", "Traditional Arabic", serif' },
    { value: "harmattan", label: "Harmattan", stack: '"Harmattan", "Traditional Arabic", serif' },
    { value: "noto-sans", label: "Noto Sans Arabic", stack: '"Noto Sans Arabic", "Segoe UI", sans-serif' },
    { value: "noto-kufi", label: "Noto Kufi Arabic", stack: '"Noto Kufi Arabic", "Segoe UI", sans-serif' },
    { value: "cairo", label: "Cairo", stack: '"Cairo", "Segoe UI", sans-serif' },
    { value: "tajawal", label: "Tajawal", stack: '"Tajawal", "Segoe UI", sans-serif' },
    { value: "reem-kufi", label: "Reem Kufi", stack: '"Reem Kufi", "Segoe UI", sans-serif' },
    { value: "traditional", label: "Traditional Arabic · Windows", stack: '"Traditional Arabic", "Noto Naskh Arabic", "Scheherazade New", "Amiri", serif' },
    { value: "arabic-typesetting", label: "Arabic Typesetting · bilgisayar hattı", stack: '"Arabic Typesetting", "Traditional Arabic", "Noto Naskh Arabic", serif' },
    { value: "simplified-arabic", label: "Simplified Arabic · görsele yakın", stack: '"Simplified Arabic", "Arabic Typesetting", "Traditional Arabic", serif' },
    { value: "uthman-naskh", label: "Osman Taha Nesih · mushaf", stack: '"Uthman Naskh", "Scheherazade New", "Amiri", serif' },
    { value: "uthman-hafs", label: "Osmanî Hafs · Kur’an", stack: '"Uthman Hafs", "Uthman Naskh", "Scheherazade New", serif' }
  ];

  const DEFAULT_ARABIC_FONT = "noto-naskh";
  const EAGER_ARABIC_FONTS = new Set(["noto-naskh", "amiri", "traditional", "arabic-typesetting", "simplified-arabic"]);
  const EXTRA_FONT_CSS_URL = "https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Harmattan:wght@400;500;600;700&family=Lateef:wght@400;500;600;700&family=Noto+Kufi+Arabic:wght@400;600;700&family=Noto+Sans+Arabic:wght@400;600;700&family=Reem+Kufi:wght@400;600;700&family=Scheherazade+New:wght@400;700&family=Tajawal:wght@400;500;700&display=swap";
  let extraFontsRequested = false;

  function ensureExtraArabicFonts() {
    if (extraFontsRequested) return;
    extraFontsRequested = true;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = EXTRA_FONT_CSS_URL;
    document.head.appendChild(link);
  }

  const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14];
  const REVIEW_QUEUE_KEY = `${STORAGE_PREFIX}:review-queue`;
  const REVIEW_MASTERED_KEY = `${STORAGE_PREFIX}:review-mastered`;
  const LESSON_TITLES = {
    "ders-01": "Kelimelerin üç türü",
    "ders-02": "Belirlilik ve “bu”",
    "ders-03": "Şahıs zamirleri",
    "ders-04": "Erillik, dişillik ve sıfat uyumu",
    "ders-05": "Geçmiş zamana giriş",
    "ders-06": "Geçmiş zamanın tam çekimi",
    "ders-07": "Muzari fiile giriş"
  };

  const LESSON_REVIEW_SETS = {
    "ders-01": [
      { id: "hazirlik-isim", topic: "Kelime türleri", prompt: "İnsan, eşya, yer veya kavram bildiren kelime türü hangisidir?", options: [["isim", "İsim"], ["fiil", "Fiil"], ["harf", "Harf / edat"]], answer: "isim", explanation: "İsim; insanı, eşyayı, yeri, özelliği veya kavramı adlandırır." },
      { id: "hazirlik-fiil", topic: "Kelime türleri", prompt: "Bir işi veya oluşu zamanla anlatan kelime türü hangisidir?", options: [["isim", "İsim"], ["fiil", "Fiil"], ["harf", "Harf / edat"]], answer: "fiil", explanation: "Fiil, bir işi ya da oluşu ve onun zamanını anlatır." },
      { id: "hazirlik-harf", topic: "Kelime türleri", prompt: "Kelimeler arasında ilişki kuran kısa kelime türü hangisidir?", options: [["isim", "İsim"], ["fiil", "Fiil"], ["harf", "Harf / edat"]], answer: "harf", explanation: "Harf/edat burada alfabe harfi değil, kelimeler arasında ilişki kuran kelimedir." },
      { id: "hazirlik-kitab", topic: "Temel kelimeler", prompt: "Bu kelimenin anlamını tahmin et.", arabic: "كِتَابٌ", options: [["kitap", "Kitap"], ["ev", "Ev"], ["okul", "Okul"]], answer: "kitap", explanation: "كِتَابٌ (kitâbun) “bir kitap” demektir." },
      { id: "hazirlik-fi", topic: "Temel kelimeler", prompt: "Bu kelimenin anlamını tahmin et.", arabic: "فِي", options: [["ve", "Ve"], ["içinde", "İçinde / -de"], ["ile", "İle"]], answer: "içinde", explanation: "فِي bir yerde bulunmayı anlatır: “içinde, -de/-da”." }
    ],
    "ders-02": [
      { id: "d1-kitab-tur", sourceLesson: "ders-01", topic: "Kelime türleri", prompt: "كِتَابٌ hangi kelime türüdür?", options: [["isim", "İsim"], ["fiil", "Fiil"], ["harf", "Harf / edat"]], answer: "isim", explanation: "كِتَابٌ bir varlığın adıdır; bu yüzden isimdir." },
      { id: "d1-yakrau-tur", sourceLesson: "ders-01", topic: "Kelime türleri", prompt: "يَقْرَأُ hangi kelime türüdür?", options: [["isim", "İsim"], ["fiil", "Fiil"], ["harf", "Harf / edat"]], answer: "fiil", explanation: "يَقْرَأُ “okuyor/okur” diyerek zamanlı bir iş bildirir; fiildir." },
      { id: "d1-fi-tur", sourceLesson: "ders-01", topic: "Kelime türleri", prompt: "فِي hangi kelime türüdür?", options: [["isim", "İsim"], ["fiil", "Fiil"], ["harf", "Harf / edat"]], answer: "harf", explanation: "فِي kelimeler arasında yer ilişkisi kuran bir harf/edattır." },
      { id: "d1-beyt", sourceLesson: "ders-01", topic: "Temel kelimeler", prompt: "بَيْتٌ ne demektir?", options: [["ev", "Ev"], ["kitap", "Kitap"], ["ders", "Ders"]], answer: "ev", explanation: "بَيْتٌ “bir ev” demektir." },
      { id: "d1-okuma", sourceLesson: "ders-01", topic: "Cümle anlamı", prompt: "أَقْرَأُ الْقُرْآنَ ne demektir?", options: [["okuyorum", "Kur’an okuyorum"], ["yaziyorum", "Bir ders yazıyorum"], ["evdeyim", "Evdeyim"]], answer: "okuyorum", explanation: "أَقْرَأُ “okuyorum”, الْقُرْآنَ ise “Kur’an’ı” anlamındadır." }
    ],
    "ders-03": [
      { id: "d2-belirli", sourceLesson: "ders-02", topic: "Belirlilik", prompt: "الْكِتَابُ belirli mi, belirsiz mi?", options: [["belirli", "Belirli"], ["belirsiz", "Belirsiz"]], answer: "belirli", explanation: "Kelimenin başındaki ال, ismi belirli yapar." },
      { id: "d2-belirsiz", sourceLesson: "ders-02", topic: "Belirlilik", prompt: "كِتَابٌ belirli mi, belirsiz mi?", options: [["belirli", "Belirli"], ["belirsiz", "Belirsiz"]], answer: "belirsiz", explanation: "Başında ال yoktur ve sonunda tenvin vardır; kelime belirsizdir." },
      { id: "d2-haza", sourceLesson: "ders-02", topic: "İşaret isimleri", prompt: "Eril bir isim için kullanılan “bu” hangisidir?", options: [["haza", "هَذَا"], ["hazihi", "هَذِهِ"]], answer: "haza", explanation: "هَذَا eril isimlerle, هَذِهِ dişil isimlerle kullanılır." },
      { id: "d2-madrasah", sourceLesson: "ders-02", topic: "İşaret isimleri", prompt: "هَذِهِ مَدْرَسَةٌ ne demektir?", options: [["okul", "Bu bir okuldur"], ["kitap", "Bu bir kitaptır"], ["ev", "Ev buradadır"]], answer: "okul", explanation: "مَدْرَسَةٌ dişil bir isimdir; bu yüzden هَذِهِ ile kullanılır." },
      { id: "d1-fi-tekrar", sourceLesson: "ders-01", topic: "Kelime türleri", prompt: "فِي kelimesinin görevi nedir?", options: [["yer", "Yer ilişkisi kurar"], ["zaman", "Geçmiş zaman bildirir"], ["ad", "Bir varlığı adlandırır"]], answer: "yer", explanation: "فِي “içinde/-de” anlamıyla yer ilişkisi kurar." }
    ],
    "ders-04": [
      { id: "d3-ana", sourceLesson: "ders-03", topic: "Şahıs zamirleri", prompt: "أَنَا hangi şahıstır?", options: [["ben", "Ben"], ["biz", "Biz"], ["o", "O"]], answer: "ben", explanation: "أَنَا birinci tekil şahıs, yani “ben” zamiridir." },
      { id: "d3-anti", sourceLesson: "ders-03", topic: "Şahıs zamirleri", prompt: "أَنْتِ kime söylenir?", options: [["sen-kadin", "Sen · kadın"], ["sen-erkek", "Sen · erkek"], ["o-kadin", "O · kadın"]], answer: "sen-kadin", explanation: "أَنْتِ kadın muhataba söylenen “sen” zamiridir." },
      { id: "d3-nahnu", sourceLesson: "ders-03", topic: "Şahıs zamirleri", prompt: "نَحْنُ ne demektir?", options: [["biz", "Biz"], ["siz", "Siz"], ["onlar", "Onlar"]], answer: "biz", explanation: "نَحْنُ birinci çoğul şahıs, yani “biz” zamiridir." },
      { id: "d3-nekrau", sourceLesson: "ders-03", topic: "Muzari şahıs işaretleri", prompt: "نَقْرَأُ fiilinin başındaki نَـ hangi şahsı gösterir?", options: [["ben", "Ben"], ["biz", "Biz"], ["o", "O"]], answer: "biz", explanation: "Muzaride fiilin başındaki نَـ çoğunlukla “biz” şahsını gösterir." },
      { id: "d2-bu-kitap", sourceLesson: "ders-02", topic: "Belirlilik", prompt: "هَذَا الْكِتَابُ ne demektir?", options: [["bu-kitap", "Bu kitap"], ["bir-kitap", "Bir kitap"], ["kitap-yeni", "Kitap yenidir"]], answer: "bu-kitap", explanation: "هَذَا “bu”, الْكِتَابُ ise belirli biçimde “kitap”tır." }
    ],
    "ders-05": [
      { id: "d4-talibah", sourceLesson: "ders-04", topic: "Erillik ve dişillik", prompt: "طَالِبَةٌ ne demektir?", options: [["kadin-ogrenci", "Kadın öğrenci"], ["erkek-ogrenci", "Erkek öğrenci"], ["ogretmen", "Öğretmen"]], answer: "kadin-ogrenci", explanation: "Sondaki ة, burada dişil biçimin güçlü işaretidir." },
      { id: "d4-yeni-okul", sourceLesson: "ders-04", topic: "Sıfat uyumu", prompt: "مَدْرَسَةٌ için “yeni” sıfatının uygun biçimi hangisidir?", options: [["jadidah", "جَدِيدَةٌ"], ["jadid", "جَدِيدٌ"]], answer: "jadidah", explanation: "مَدْرَسَةٌ dişildir; sıfat da جَدِيدَةٌ biçiminde dişil olur." },
      { id: "d4-haza-muallim", sourceLesson: "ders-04", topic: "İşaret isimleri", prompt: "هَذَا مُعَلِّمٌ ne demektir?", options: [["erkek", "Bu bir erkek öğretmendir"], ["kadin", "Bu bir kadın öğretmendir"], ["okul", "Bu bir okuldur"]], answer: "erkek", explanation: "هَذَا ve مُعَلِّمٌ eril biçimlerdir." },
      { id: "d4-hazihi-madrasah", sourceLesson: "ders-04", topic: "Erillik ve dişillik", prompt: "هَذِهِ مَدْرَسَةٌ ne demektir?", options: [["okul", "Bu bir okuldur"], ["kitap", "Bu bir kitaptır"], ["ogretmen", "Bu bir öğretmendir"]], answer: "okul", explanation: "هَذِهِ dişil “bu”, مَدْرَسَةٌ ise “okul” demektir." },
      { id: "d4-kitap-yeni", sourceLesson: "ders-04", topic: "İsim cümlesi", prompt: "الْكِتَابُ جَدِيدٌ ne demektir?", options: [["yeni", "Kitap yenidir"], ["yeni-kitap", "Yeni kitap"], ["bu-kitap", "Bu kitaptır"]], answer: "yeni", explanation: "Belirli isimden sonra belirsiz sıfat gelince burada “Kitap yenidir” cümlesi oluşur." }
    ],
    "ders-06": [
      { id: "d5-ketebe", sourceLesson: "ders-05", topic: "Geçmiş zaman", prompt: "كَتَبَ ne demektir?", options: [["o-erkek", "O yazdı · erkek"], ["o-kadin", "O yazdı · kadın"], ["onlar", "Onlar yazdılar"]], answer: "o-erkek", explanation: "Ek almamış كَتَبَ biçimi üçüncü tekil eril şahıstır." },
      { id: "d5-ketebet", sourceLesson: "ders-05", topic: "Geçmiş zaman", prompt: "كَتَبَتْ ne demektir?", options: [["o-kadin", "O yazdı · kadın"], ["o-erkek", "O yazdı · erkek"], ["biz", "Biz yazdık"]], answer: "o-kadin", explanation: "Sondaki sakin تْ üçüncü tekil dişil şahsı gösterir." },
      { id: "d5-ketebu", sourceLesson: "ders-05", topic: "Geçmiş zaman", prompt: "كَتَبُوا ne demektir?", options: [["onlar", "Onlar yazdılar"], ["siz", "Siz yazdınız"], ["biz", "Biz yazdık"]], answer: "onlar", explanation: "Sondaki وا, üçüncü çoğul eril/karma şahsı gösterir." },
      { id: "d5-zehebe", sourceLesson: "ders-05", topic: "Temel fiiller", prompt: "ذَهَبَ ne demektir?", options: [["gitti", "Gitti"], ["yazdi", "Yazdı"], ["okudu", "Okudu"]], answer: "gitti", explanation: "ذَهَبَ geçmiş zamanda “gitti” demektir." },
      { id: "d5-cumle", sourceLesson: "ders-05", topic: "Fiil cümlesi", prompt: "كَتَبَ الطَّالِبُ دَرْسًا ne demektir?", options: [["yazdi", "Erkek öğrenci bir ders yazdı"], ["yaziyor", "Erkek öğrenci bir ders yazıyor"], ["kadin", "Kadın öğrenci bir ders yazdı"]], answer: "yazdi", explanation: "كَتَبَ geçmiş zamanı, الطَّالِبُ ise işi yapan erkek öğrenciyi gösterir." }
    ],
    "ders-07": [
      { id: "d6-ketebtu", sourceLesson: "ders-06", topic: "Geçmiş zaman çekimi", prompt: "كَتَبْتُ ne demektir?", options: [["ben", "Ben yazdım"], ["sen", "Sen yazdın"], ["biz", "Biz yazdık"]], answer: "ben", explanation: "Geçmiş zamanda sondaki تُ “ben” şahsını gösterir." },
      { id: "d6-ketebna", sourceLesson: "ders-06", topic: "Geçmiş zaman çekimi", prompt: "كَتَبْنَا ne demektir?", options: [["biz", "Biz yazdık"], ["onlar", "Onlar yazdılar"], ["siz", "Siz yazdınız"]], answer: "biz", explanation: "Geçmiş zamanda sondaki نَا “biz” şahsını gösterir." },
      { id: "d6-ketebtum", sourceLesson: "ders-06", topic: "Geçmiş zaman çekimi", prompt: "كَتَبْتُمْ ne demektir?", options: [["siz", "Siz yazdınız · erkek/karma"], ["onlar", "Onlar yazdılar"], ["biz", "Biz yazdık"]], answer: "siz", explanation: "Sondaki تُمْ ikinci çoğul eril/karma şahsı gösterir." },
      { id: "d6-na-eki", sourceLesson: "ders-06", topic: "Şahıs ekleri", prompt: "Geçmiş zaman fiilinin sonundaki نَا hangi şahsı gösterir?", options: [["biz", "Biz"], ["ben", "Ben"], ["onlar", "Onlar"]], answer: "biz", explanation: "نَا eki geçmiş zaman çekiminde “biz” anlamı taşır." },
      { id: "d6-kevser", sourceLesson: "ders-06", topic: "Kur’an bağlantısı", prompt: "إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ içindeki أَعْطَيْنَا hangi şahıstır?", options: [["biz", "Biz verdik"], ["ben", "Ben verdim"], ["onlar", "Onlar verdiler"]], answer: "biz", explanation: "أَعْطَيْنَا fiilinin sonundaki نَا, yapanın “biz” olduğunu gösterir." }
    ]
  };

  const WRITING_MODELS = {
    "ders-01": {
      speaking_name: { answer: "اِسْمِي [اكتب اسمك].", note: "Köşeli alanın yerine kendi adını Arapça yazman yeterli.", topic: "Kendini tanıtma" }
    },
    "ders-02": {
      quran_words: { answer: "الْحَمْدُ، الْعَالَمِينَ", note: "İki kelimenin de başında ال bulunmalı.", topic: "Belirlilik" },
      speaking_name: { answer: "اِسْمِي [اكتب اسمك].", note: "Kendi adını kullandığın için birebir aynı olması gerekmez.", topic: "Kendini tanıtma" },
      speaking_book: { answer: "هَذَا كِتَابٌ.", note: "كِتَابٌ eril olduğu için هَذَا kullanılır.", topic: "İşaret isimleri" }
    },
    "ders-03": {
      quran_verb: { answer: "نَعْبُدُ", note: "Başındaki نَـ “biz” şahsını gösterir.", topic: "Muzari şahıs işaretleri" },
      speaking_intro: { answer: "أَنَا [اكتب اسمك]. أَقْرَأُ الْقُرْآنَ.", note: "Adını yerleştir; iki kısa cümle kurman yeterli.", topic: "Kendini tanıtma" }
    },
    "ders-04": {
      quran_adjective: { answer: "الْمُسْتَقِيمَ", note: "Bu kelime الصِّرَاطَ ismini niteliyor.", topic: "Sıfat uyumu" },
      speaking_school: { answer: "هَذِهِ مَدْرَسَةٌ جَدِيدَةٌ.", note: "Okul ve onu niteleyen “yeni” sıfatı dişil biçimdedir.", topic: "Sıfat uyumu" },
      speaking_book: { answer: "الْكِتَابُ جَدِيدٌ.", note: "Belirli isim + belirsiz yüklem sıfatı bir isim cümlesi kurar.", topic: "İsim cümlesi" },
      speaking_name: { answer: "اِسْمِي [اكتب اسمك].", note: "Kendi adının doğru harflerini örnekle karşılaştır.", topic: "Yazma" }
    },
    "ders-05": {
      quran_verb: { answer: "خَلَقَ", note: "Rahmân sûresi örneğindeki geçmiş zaman fiilidir.", topic: "Kur’an bağlantısı" },
      speaking_mosque: { answer: "ذَهَبَ إِلَى الْمَسْجِدِ.", note: "ذَهَبَ “gitti”, إِلَى “-e/-a”, الْمَسْجِدِ “mescit”tir.", topic: "Geçmiş zaman cümlesi" },
      speaking_student: { answer: "كَتَبَتْ الطَّالِبَةُ دَرْسًا.", note: "Fiildeki تْ ve طَالِبَةُ biçimi dişil şahısla uyumludur.", topic: "Geçmiş zaman cümlesi" }
    },
    "ders-06": {
      quran_verb: { answer: "أَعْطَيْنَاكَ", note: "Âyetteki tam kelime “sana verdik” anlamındadır; içindeki نَا “biz” işaretidir.", topic: "Kur’an bağlantısı" },
      speaking_i: { answer: "كَتَبْتُ دَرْسًا.", note: "تُ eki “ben” şahsını gösterir.", topic: "Geçmiş zaman çekimi" },
      speaking_we: { answer: "ذَهَبْنَا إِلَى الْمَسْجِدِ.", note: "نَا eki “biz” şahsını gösterir.", topic: "Geçmiş zaman çekimi" }
    },
    "ders-07": {
      quran_verb: { answer: "نَسْتَعِينُ", note: "İkinci fiildir; başındaki نَـ “biz” şahsını gösterir.", topic: "Kur’an bağlantısı" },
      speaking_write: { answer: "أَنَا أَكْتُبُ دَرْسًا.", note: "أَكْتُبُ fiilinin başındaki أَ “ben” şahsına uyar.", topic: "Muzari çekimi" },
      speaking_read: { answer: "نَحْنُ نَقْرَأُ الْقُرْآنَ.", note: "نَقْرَأُ fiilinin başındaki نَـ “biz” şahsına uyar.", topic: "Muzari çekimi" }
    }
  };

  const TOPIC_GUIDANCE = {
    "ders-01:alistirma-1": "İsim bir varlığı/kavramı, fiil zamanlı bir işi, harf/edat ise kelimeler arasındaki ilişkiyi bildirir.",
    "ders-01:alistirma-2": "Kelime kartındaki Arapça biçimi, sesi ve Türkçe anlamı birlikte hatırlamaya çalış.",
    "ders-01:cumleler": "Cümleyi kelime kelime ayır: önce her parçanın görevini, sonra bütün anlamı kur.",
    "ders-02:alistirma-1": "Başındaki ال ismi belirli yapar; belirsiz isimlerde çoğunlukla tenvin görülür.",
    "ders-02:alistirma-2": "هَذَا eril, هَذِهِ dişil isimlerle kullanılır; isim cümlesinde belirlilik düzenine dikkat et.",
    "ders-03:alistirma-1": "Zamirin kişi, sayı ve cinsiyet bilgisini birlikte kontrol et.",
    "ders-03:alistirma-2": "Açık zamir olmasa bile muzari fiilin başındaki أ، ن، ت، ي şahıs hakkında ipucu verir.",
    "ders-04:alistirma-1": "Dişillikte ة güçlü bir ipucudur; benzer görünen ذ/ز ve ج/خ harflerini noktalarıyla ayır.",
    "ders-04:alistirma-2": "Sıfat, nitelediği isimle cinsiyet ve belirlilik bakımından uyum gösterir.",
    "ders-05:alistirma-1": "Mâzi fiilin sonuna bak: تْ dişil tekili, وا eril/karma çoğulu gösterir.",
    "ders-05:alistirma-2": "Fiil biçimindeki son ek ile cümlenin öznesini ve zamanı birlikte kontrol et.",
    "ders-06:alistirma-1": "Geçmiş zaman ekini kökten ayır; تُ ben, تَ erkek sen, تِ kadın sen, نَا biz işaretidir.",
    "ders-06:alistirma-2": "Çekimin sonundaki ek kişi, sayı ve bazen cinsiyet bilgisini birlikte taşır.",
    "ders-07:alistirma-1": "Muzaride önce başlangıç harfine, sonra varsa sondaki şahıs ekine bak.",
    "ders-07:alistirma-2": "Muzari şimdiki veya geniş zaman olabilir; الآنَ ve كُلَّ يَوْمٍ gibi bağlam kelimelerini ara."
  };

  const BREAKDOWN_LESSONS = new Set(["ders-01", "ders-02", "ders-03", "ders-04", "ders-05", "ders-06", "ders-07"]);

  const WORD_ROLES = {
    isim: "İsim",
    fiil: "Fiil",
    zamir: "Zamir / işaret",
    harf: "Harf (edat)",
    soru: "Soru kelimesi",
    ek: "Şahıs eki"
  };

  // Tek baslarina kelime olmayan, fiilin sonuna eklenen sahis ekleri.
  // Harekeleri anlami degistirdigi icin bunlar harekesiyle birlikte eslenir.
  const WORD_EXTRAS = {
    "تُ": { r: "ek", t: "ben", n: "Mâzi fiilin sonunda özneyi “ben” yapan şahıs eki." },
    "تَ": { r: "ek", t: "sen (erkek)", n: "Mâzi fiilin sonunda özneyi “sen (erkek)” yapan şahıs eki." },
    "تِ": { r: "ek", t: "sen (kadın)", n: "Mâzi fiilin sonunda özneyi “sen (kadın)” yapan şahıs eki; erkekten tek farkı harekedir." },
    "نَا": { r: "ek", t: "biz", n: "Mâzi fiilin sonunda özneyi “biz” yapan şahıs eki." },
    "تُمْ": { r: "ek", t: "siz (erkek/karma)", n: "Mâzi fiilin sonunda 2. çoğul eril ekidir." },
    "تُنَّ": { r: "ek", t: "siz (kadınlar)", n: "Mâzi fiilin sonunda 2. çoğul dişil ekidir." },
    "وا": { r: "ek", t: "onlar (erkek/karma)", n: "Mâzi fiilin sonunda 3. çoğul eril ekidir; yanındaki elif okunmaz." },
    "نَ": { r: "ek", t: "onlar (kadınlar)", n: "Mâzi fiilin sonunda 3. çoğul dişil ekidir." },
    "جَوْدَت": { r: "isim", t: "Cevdet", n: "Özel isim." }
  };

  const SENTENCE_BREAKDOWNS = {
    "هَذَا كِتَابٌ.": [{"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril isimler için “bu”. Dişilde “hâzihî” kullanılır."}, {"w": "كِتَابٌ", "t": "bir kitap", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}],
    "هَذَا قَلَمٌ.": [{"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril isimler için “bu”. Dişilde “hâzihî” kullanılır."}, {"w": "قَلَمٌ", "t": "bir kalem", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}],
    "هَذَا بَابٌ.": [{"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril isimler için “bu”. Dişilde “hâzihî” kullanılır."}, {"w": "بَابٌ", "t": "bir kapı", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}],
    "مُحَمَّدٌ فِي الْبَيْتِ.": [{"w": "مُحَمَّدٌ", "t": "Muhammed", "r": "isim", "n": "Özel isim; burada özne."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْبَيْتِ", "t": "ev", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Edattan sonra geldiği için sonu esre."}],
    "أَحْمَدُ فِي الْمَسْجِدِ.": [{"w": "أَحْمَدُ", "t": "Ahmed", "r": "isim", "n": "Özel isim; burada özne."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Edattan sonra geldiği için sonu esre."}],
    "الْكِتَابُ فِي الْحَقِيبَةِ.": [{"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْحَقِيبَةِ", "t": "çanta", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "الْقَلَمُ عَلَى الْمَكْتَبِ.": [{"w": "الْقَلَمُ", "t": "kalem", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "عَلَى", "t": "üzerinde", "r": "harf", "n": "Üstünde olmayı bildiren edat. Sonraki ismin sonu esre olur."}, {"w": "الْمَكْتَبِ", "t": "masa", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "يَقْرَأُ مُحَمَّدٌ الْقُرْآنَ.": [{"w": "يَقْرَأُ", "t": "okuyor", "r": "fiil", "n": "Muzari (şimdiki/geniş zaman). Baştaki “ye” harfi öznenin “o (erkek)” olduğunu gösterir."}, {"w": "مُحَمَّدٌ", "t": "Muhammed", "r": "isim", "n": "İşi yapan; sonu ötre."}, {"w": "الْقُرْآنَ", "t": "Kur’an’ı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "يَقْرَأُ الطَّالِبُ كِتَابًا.": [{"w": "يَقْرَأُ", "t": "okuyor", "r": "fiil", "n": "Muzari; baştaki “ye” harfi “o (erkek)” demek."}, {"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. “et-tâlibu” okunur. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "كِتَابًا", "t": "bir kitap(ı)", "r": "isim", "n": "Nesne olduğu için üstün, belirsiz olduğu için tenvin: “kitâben”."}],
    "ذَهَبَ أَحْمَدُ إِلَى الْمَدْرَسَةِ.": [{"w": "ذَهَبَ", "t": "gitti", "r": "fiil", "n": "Mâzi (geçmiş zaman). Üç harfin de üstünlü olması (ze-he-be) ve hiç ek almaması “o gitti” demektir."}, {"w": "أَحْمَدُ", "t": "Ahmed", "r": "isim", "n": "İşi yapan."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "خَرَجَ الطَّالِبُ مِنَ الْبَيْتِ.": [{"w": "خَرَجَ", "t": "çıktı", "r": "fiil", "n": "Mâzi (geçmiş zaman): ha-ra-ce. Sonuna ek gelmediği için özne “o”dur; öznesi ayrıca yazıldığı için “öğrenci çıktı” olur."}, {"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. “et-tâlibu” okunur. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "مِنَ", "t": "-den / -dan", "r": "harf", "n": "Ayrılma bildiren edat. Aslı sakin nûn iledir; “el-” ile başlayan kelimeden önce sonu üstün okunur: “mine”."}, {"w": "الْبَيْتِ", "t": "ev", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "الْمُعَلِّمُ فِي الْفَصْلِ.": [{"w": "الْمُعَلِّمُ", "t": "öğretmen", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْفَصْلِ", "t": "sınıf", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "الْمَاءُ فِي الْكُوبِ.": [{"w": "الْمَاءُ", "t": "su", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْكُوبِ", "t": "bardak", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "أَنَا فِي الْمَكْتَبَةِ.": [{"w": "أَنَا", "t": "ben", "r": "zamir", "n": "1. tekil şahıs zamiri."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْمَكْتَبَةِ", "t": "kütüphane", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "نَحْنُ فِي الْمَدْرَسَةِ.": [{"w": "نَحْنُ", "t": "biz", "r": "zamir", "n": "1. çoğul şahıs zamiri."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "الطَّالِبُ مِنْ تُرْكِيَا.": [{"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "مِنْ", "t": "-den / -dan", "r": "harf", "n": "Burada köken bildirir: “Türkiye’den, Türkiyeli”."}, {"w": "تُرْكِيَا", "t": "Türkiye", "r": "isim", "n": "Yabancı özel isim; hareke almaz."}],
    "هَذِهِ مَجَلَّةٌ.": [{"w": "هَذِهِ", "t": "bu (dişil)", "r": "zamir", "n": "Dişil isimler için “bu”. Erilde “hâzâ” kullanılır."}, {"w": "مَجَلَّةٌ", "t": "bir dergi", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar. Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}],
    "هَذِهِ حَقِيبَةٌ.": [{"w": "هَذِهِ", "t": "bu (dişil)", "r": "zamir", "n": "Dişil isimler için “bu”. Erilde “hâzâ” kullanılır."}, {"w": "حَقِيبَةٌ", "t": "bir çanta", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar. Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}],
    "هَذَا الْبَيْتُ كَبِيرٌ.": [{"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril isimler için “bu”. Dişilde “hâzihî” kullanılır."}, {"w": "الْبَيْتُ", "t": "ev", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Burada “bu ev” tamlamasının parçası."}, {"w": "كَبِيرٌ", "t": "büyüktür", "r": "isim", "n": "Sıfat; yüklem olduğu için belirsiz kalır ve tenvin alır."}],
    "هَذِهِ الْمَدْرَسَةُ جَدِيدَةٌ.": [{"w": "هَذِهِ", "t": "bu (dişil)", "r": "zamir", "n": "Dişil isimler için “bu”. Erilde “hâzâ” kullanılır."}, {"w": "الْمَدْرَسَةُ", "t": "okul", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Dişil bir isim."}, {"w": "جَدِيدَةٌ", "t": "yenidir", "r": "isim", "n": "Sıfat dişil isimle uyumlu olsun diye sonuna yuvarlak tê alır."}],
    "الْبَابُ مَفْتُوحٌ.": [{"w": "الْبَابُ", "t": "kapı", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "مَفْتُوحٌ", "t": "açıktır", "r": "isim", "n": "Yüklem olduğu için belirsiz kalır."}],
    "النَّافِذَةُ مُغْلَقَةٌ.": [{"w": "النَّافِذَةُ", "t": "pencere", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. “en-nâfizetu” okunur."}, {"w": "مُغْلَقَةٌ", "t": "kapalıdır", "r": "isim", "n": "Dişil yüklem; sonunda yuvarlak tê var."}],
    "مَا هَذَا؟ هَذَا مِفْتَاحٌ.": [{"w": "مَا", "t": "ne?", "r": "soru", "n": "Eşya için “bu nedir?” sorusunu kurar."}, {"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril isimler için “bu”. Dişilde “hâzihî” kullanılır."}, {"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril isimler için “bu”. Dişilde “hâzihî” kullanılır."}, {"w": "مِفْتَاحٌ", "t": "bir anahtar", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}],
    "مَا هَذِهِ؟ هَذِهِ سَاعَةٌ.": [{"w": "مَا", "t": "ne?", "r": "soru", "n": "Eşya için “bu nedir?” sorusunu kurar."}, {"w": "هَذِهِ", "t": "bu (dişil)", "r": "zamir", "n": "Dişil isimler için “bu”. Erilde “hâzâ” kullanılır."}, {"w": "هَذِهِ", "t": "bu (dişil)", "r": "zamir", "n": "Dişil isimler için “bu”. Erilde “hâzâ” kullanılır."}, {"w": "سَاعَةٌ", "t": "bir saat", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar. Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}],
    "أَيْنَ الْكِتَابُ؟ الْكِتَابُ فِي الْغُرْفَةِ.": [{"w": "أَيْنَ", "t": "nerede?", "r": "soru", "n": "Yer sorusu kurar."}, {"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "Cevapta özne tekrar edilir."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْغُرْفَةِ", "t": "oda", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "هَذَا مَسْجِدٌ.": [{"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril isimler için “bu”. Dişilde “hâzihî” kullanılır."}, {"w": "مَسْجِدٌ", "t": "bir mescit", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}],
    "هَذِهِ مَكْتَبَةٌ.": [{"w": "هَذِهِ", "t": "bu (dişil)", "r": "zamir", "n": "Dişil isimler için “bu”. Erilde “hâzâ” kullanılır."}, {"w": "مَكْتَبَةٌ", "t": "bir kütüphane", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar. Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}],
    "الْحَمْدُ لِلَّهِ.": [{"w": "الْحَمْدُ", "t": "hamd / övgü", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. “O övgü” anlamında."}, {"w": "لِلَّهِ", "t": "Allah’a aittir", "r": "harf", "n": "“-e ait” anlamındaki lâm edatı ile Allah isminin birleşimi: “lillâhi”."}],
    "أَنَا طَالِبٌ.": [{"w": "أَنَا", "t": "ben", "r": "zamir", "n": "1. tekil şahıs zamiri; erkek de kadın da kullanır."}, {"w": "طَالِبٌ", "t": "öğrenciyim (erkek)", "r": "isim", "n": "Eril biçim; yüklem olduğu için belirsiz."}],
    "أَنَا طَالِبَةٌ.": [{"w": "أَنَا", "t": "ben", "r": "zamir", "n": "1. tekil şahıs zamiri; erkek de kadın da kullanır."}, {"w": "طَالِبَةٌ", "t": "öğrenciyim (kadın)", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar."}],
    "أَنْتَ مُعَلِّمٌ.": [{"w": "أَنْتَ", "t": "sen (erkek)", "r": "zamir", "n": "2. tekil eril; sonu üstün okunur: “ente”."}, {"w": "مُعَلِّمٌ", "t": "öğretmensin (erkek)", "r": "isim", "n": "Eril biçim."}],
    "أَنْتِ مُعَلِّمَةٌ.": [{"w": "أَنْتِ", "t": "sen (kadın)", "r": "zamir", "n": "2. tekil dişil; sonu esre okunur: “enti”."}, {"w": "مُعَلِّمَةٌ", "t": "öğretmensin (kadın)", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar."}],
    "هُوَ طَبِيبٌ.": [{"w": "هُوَ", "t": "o (erkek)", "r": "zamir", "n": "3. tekil eril."}, {"w": "طَبِيبٌ", "t": "doktordur (erkek)", "r": "isim", "n": "Eril biçim."}],
    "هِيَ طَبِيبَةٌ.": [{"w": "هِيَ", "t": "o (kadın)", "r": "zamir", "n": "3. tekil dişil."}, {"w": "طَبِيبَةٌ", "t": "doktordur (kadın)", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar."}],
    "أَنْتُمْ فِي الْفَصْلِ.": [{"w": "أَنْتُمْ", "t": "siz (erkek/karma)", "r": "zamir", "n": "2. çoğul; karma gruplarda da bu kullanılır."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْفَصْلِ", "t": "sınıf", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "هُمْ فِي الْمَسْجِدِ.": [{"w": "هُمْ", "t": "onlar (erkek/karma)", "r": "zamir", "n": "3. çoğul eril."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "هُنَّ فِي الْمَكْتَبَةِ.": [{"w": "هُنَّ", "t": "onlar (kadınlar)", "r": "zamir", "n": "3. çoğul dişil; yalnız kadınlar için."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْمَكْتَبَةِ", "t": "kütüphane", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "أَنَا أَقْرَأُ الْكِتَابَ.": [{"w": "أَنَا", "t": "ben", "r": "zamir", "n": "1. tekil şahıs zamiri; erkek de kadın da kullanır."}, {"w": "أَقْرَأُ", "t": "okuyorum", "r": "fiil", "n": "Muzari. Baştaki hemze “ben” demek; zamir yazılmasa da özne bellidir."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "نَحْنُ نَقْرَأُ الْقُرْآنَ.": [{"w": "نَحْنُ", "t": "biz", "r": "zamir", "n": "1. çoğul şahıs zamiri."}, {"w": "نَقْرَأُ", "t": "okuyoruz", "r": "fiil", "n": "Muzari. Baştaki nûn “biz” demek."}, {"w": "الْقُرْآنَ", "t": "Kur’an’ı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "أَنْتَ تَكْتُبُ الدَّرْسَ.": [{"w": "أَنْتَ", "t": "sen (erkek)", "r": "zamir", "n": "2. tekil eril."}, {"w": "تَكْتُبُ", "t": "yazıyorsun", "r": "fiil", "n": "Muzari. Baştaki tê burada “sen (erkek)” demek."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. “ed-derse” okunur. İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "هُوَ يَقْرَأُ الْمَجَلَّةَ.": [{"w": "هُوَ", "t": "o (erkek)", "r": "zamir", "n": "3. tekil eril."}, {"w": "يَقْرَأُ", "t": "okuyor", "r": "fiil", "n": "Muzari. Baştaki ye “o (erkek)” demek."}, {"w": "الْمَجَلَّةَ", "t": "dergiyi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "هِيَ تَكْتُبُ الرِّسَالَةَ.": [{"w": "هِيَ", "t": "o (kadın)", "r": "zamir", "n": "3. tekil dişil."}, {"w": "تَكْتُبُ", "t": "yazıyor", "r": "fiil", "n": "Muzari. Baştaki tê burada “o (kadın)” demek: aynı harf hem “sen” hem “o kadın” olabilir, ayrımı zamir veya bağlam yapar."}, {"w": "الرِّسَالَةَ", "t": "mektubu", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. “er-risâlete” okunur. İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "هُمْ يَقْرَؤُونَ الْكِتَابَ.": [{"w": "هُمْ", "t": "onlar (erkek/karma)", "r": "zamir", "n": "3. çoğul."}, {"w": "يَقْرَؤُونَ", "t": "okuyorlar", "r": "fiil", "n": "Muzari. Baştaki ye “o/onlar”, sondaki “-ûne” eki çoğul yapar."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "كِتَابٌ جَدِيدٌ.": [{"w": "كِتَابٌ", "t": "bir kitap", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}, {"w": "جَدِيدٌ", "t": "yeni", "r": "isim", "n": "Nitelediği isim eril olduğu için sıfat da eril; ikisi de belirsiz (tenvinli)."}],
    "سَيَّارَةٌ جَدِيدَةٌ.": [{"w": "سَيَّارَةٌ", "t": "bir araba", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar. Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}, {"w": "جَدِيدَةٌ", "t": "yeni", "r": "isim", "n": "Nitelediği isim dişil olduğu için sıfat sonuna yuvarlak tê alır."}],
    "بَيْتٌ كَبِيرٌ.": [{"w": "بَيْتٌ", "t": "bir ev", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}, {"w": "كَبِيرٌ", "t": "büyük", "r": "isim", "n": "Nitelediği isim eril olduğu için sıfat da eril; ikisi de belirsiz (tenvinli)."}],
    "مَدْرَسَةٌ كَبِيرَةٌ.": [{"w": "مَدْرَسَةٌ", "t": "bir okul", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar."}, {"w": "كَبِيرَةٌ", "t": "büyük", "r": "isim", "n": "Nitelediği isim dişil olduğu için sıfat sonuna yuvarlak tê alır."}],
    "قَلَمٌ صَغِيرٌ.": [{"w": "قَلَمٌ", "t": "bir kalem", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}, {"w": "صَغِيرٌ", "t": "küçük", "r": "isim", "n": "Nitelediği isim eril olduğu için sıfat da eril; ikisi de belirsiz (tenvinli)."}],
    "حَقِيبَةٌ صَغِيرَةٌ.": [{"w": "حَقِيبَةٌ", "t": "bir çanta", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar."}, {"w": "صَغِيرَةٌ", "t": "küçük", "r": "isim", "n": "Nitelediği isim dişil olduğu için sıfat sonuna yuvarlak tê alır."}],
    "رَجُلٌ طَوِيلٌ.": [{"w": "رَجُلٌ", "t": "bir adam", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}, {"w": "طَوِيلٌ", "t": "uzun boylu", "r": "isim", "n": "Nitelediği isim eril olduğu için sıfat da eril; ikisi de belirsiz (tenvinli)."}],
    "اِمْرَأَةٌ طَوِيلَةٌ.": [{"w": "اِمْرَأَةٌ", "t": "bir kadın", "r": "isim", "n": "Yuvarlak tê’si olmasa da anlamca dişildir; sıfatı dişil gelir."}, {"w": "طَوِيلَةٌ", "t": "uzun boylu", "r": "isim", "n": "Nitelediği isim dişil olduğu için sıfat sonuna yuvarlak tê alır."}],
    "مَسْجِدٌ جَمِيلٌ.": [{"w": "مَسْجِدٌ", "t": "bir mescit", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}, {"w": "جَمِيلٌ", "t": "güzel", "r": "isim", "n": "Nitelediği isim eril olduğu için sıfat da eril; ikisi de belirsiz (tenvinli)."}],
    "حَدِيقَةٌ جَمِيلَةٌ.": [{"w": "حَدِيقَةٌ", "t": "bir bahçe", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar."}, {"w": "جَمِيلَةٌ", "t": "güzel", "r": "isim", "n": "Nitelediği isim dişil olduğu için sıfat sonuna yuvarlak tê alır."}],
    "فَصْلٌ نَظِيفٌ.": [{"w": "فَصْلٌ", "t": "bir sınıf", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}, {"w": "نَظِيفٌ", "t": "temiz", "r": "isim", "n": "Nitelediği isim eril olduğu için sıfat da eril; ikisi de belirsiz (tenvinli)."}],
    "غُرْفَةٌ نَظِيفَةٌ.": [{"w": "غُرْفَةٌ", "t": "bir oda", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar."}, {"w": "نَظِيفَةٌ", "t": "temiz", "r": "isim", "n": "Nitelediği isim dişil olduğu için sıfat sonuna yuvarlak tê alır."}],
    "الْكِتَابُ الْجَدِيدُ مُفِيدٌ.": [{"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "Başındaki “el-” onu belirli yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "الْجَدِيدُ", "t": "yeni (olan)", "r": "isim", "n": "İsim belirli olduğu için sıfat da “el-” alır: “yeni kitap”."}, {"w": "مُفِيدٌ", "t": "faydalıdır", "r": "isim", "n": "Yüklem olduğu için belirsiz kalır; cümleyi “…dır” diye bitirir."}],
    "السَّيَّارَةُ الْجَدِيدَةُ سَرِيعَةٌ.": [{"w": "السَّيَّارَةُ", "t": "araba", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. “es-seyyâratu” okunur."}, {"w": "الْجَدِيدَةُ", "t": "yeni (olan)", "r": "isim", "n": "Hem belirli hem dişil: isimle iki yönden uyumlu."}, {"w": "سَرِيعَةٌ", "t": "hızlıdır", "r": "isim", "n": "Dişil yüklem; belirsiz kalır."}],
    "هَذَا كِتَابٌ مُفِيدٌ.": [{"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril isimler için “bu”. Dişilde “hâzihî” kullanılır."}, {"w": "كِتَابٌ", "t": "bir kitap", "r": "isim", "n": "Sonundaki tenvin (çift hareke) “bir” anlamı verir: belirsiz."}, {"w": "مُفِيدٌ", "t": "faydalı", "r": "isim", "n": "Nitelediği isim eril olduğu için sıfat da eril; ikisi de belirsiz (tenvinli)."}],
    "هَذِهِ قِصَّةٌ قَصِيرَةٌ.": [{"w": "هَذِهِ", "t": "bu (dişil)", "r": "zamir", "n": "Dişil isimler için “bu”. Erilde “hâzâ” kullanılır."}, {"w": "قِصَّةٌ", "t": "bir hikâye", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar."}, {"w": "قَصِيرَةٌ", "t": "kısa", "r": "isim", "n": "Nitelediği isim dişil olduğu için sıfat sonuna yuvarlak tê alır."}],
    "كَتَبَ الطَّالِبُ الدَّرْسَ.": [{"w": "كَتَبَ", "t": "yazdı", "r": "fiil", "n": "Mâzi (geçmiş zaman). Sonuna ek gelmediği için özne “o (erkek)”."}, {"w": "الطَّالِبُ", "t": "öğrenci (erkek)", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "كَتَبَتْ الطَّالِبَةُ الرِّسَالَةَ.": [{"w": "كَتَبَتْ", "t": "yazdı (o kadın)", "r": "fiil", "n": "Mâzi. Sondaki sakin tê özneyi “o (kadın)” yapar."}, {"w": "الطَّالِبَةُ", "t": "öğrenci (kadın)", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "الرِّسَالَةَ", "t": "mektubu", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "كَتَبُوا الْوَاجِبَ.": [{"w": "كَتَبُوا", "t": "yazdılar", "r": "fiil", "n": "Mâzi. Sondaki vâv 3. çoğul eril/karma ekidir; yanındaki elif okunmaz."}, {"w": "الْوَاجِبَ", "t": "ödevi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "قَرَأَ مُحَمَّدٌ الْكِتَابَ.": [{"w": "قَرَأَ", "t": "okudu", "r": "fiil", "n": "Mâzi (geçmiş zaman). Sonuna ek gelmediği için özne “o (erkek)”."}, {"w": "مُحَمَّدٌ", "t": "Muhammed", "r": "isim", "n": "İşi yapan; sonu ötre."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "قَرَأَتْ مَرْيَمُ الْقِصَّةَ.": [{"w": "قَرَأَتْ", "t": "okudu (o kadın)", "r": "fiil", "n": "Mâzi. Sondaki sakin tê özneyi “o (kadın)” yapar."}, {"w": "مَرْيَمُ", "t": "Meryem", "r": "isim", "n": "Yabancı kökenli dişil özel isim; tenvin almaz."}, {"w": "الْقِصَّةَ", "t": "hikâyeyi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "قَرَؤُوا الْقُرْآنَ.": [{"w": "قَرَؤُوا", "t": "okudular", "r": "fiil", "n": "Mâzi. Sondaki vâv 3. çoğul eril/karma ekidir; yanındaki elif okunmaz."}, {"w": "الْقُرْآنَ", "t": "Kur’an’ı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "ذَهَبَ أَحْمَدُ إِلَى الْمَسْجِدِ.": [{"w": "ذَهَبَ", "t": "gitti", "r": "fiil", "n": "Mâzi (geçmiş zaman). Sonuna ek gelmediği için özne “o (erkek)”."}, {"w": "أَحْمَدُ", "t": "Ahmed", "r": "isim", "n": "Özel isim; tenvin almaz."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "ذَهَبَتْ فَاطِمَةُ إِلَى الْمَدْرَسَةِ.": [{"w": "ذَهَبَتْ", "t": "gitti (o kadın)", "r": "fiil", "n": "Mâzi. Sondaki sakin tê özneyi “o (kadın)” yapar."}, {"w": "فَاطِمَةُ", "t": "Fatıma", "r": "isim", "n": "Dişil özel isim; tenvin almaz."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "ذَهَبُوا إِلَى السُّوقِ.": [{"w": "ذَهَبُوا", "t": "gittiler", "r": "fiil", "n": "Mâzi. Sondaki vâv 3. çoğul eril/karma ekidir; yanındaki elif okunmaz."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "pazar / çarşı", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. “es-sûki” okunur."}],
    "فَتَحَ الْمُعَلِّمُ الْبَابَ.": [{"w": "فَتَحَ", "t": "açtı", "r": "fiil", "n": "Mâzi (geçmiş zaman). Sonuna ek gelmediği için özne “o (erkek)”."}, {"w": "الْمُعَلِّمُ", "t": "öğretmen", "r": "isim", "n": "Cümlenin öznesi olduğu için sonu ötre."}, {"w": "الْبَابَ", "t": "kapıyı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "فَتَحَتِ الْمُعَلِّمَةُ النَّافِذَةَ.": [{"w": "فَتَحَتِ", "t": "açtı (o kadın)", "r": "fiil", "n": "Mâzi + dişil tê. Sonraki kelime sâkin harfle başladığı için tê esre okunur: “fetehati”."}, {"w": "الْمُعَلِّمَةُ", "t": "öğretmen (kadın)", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "النَّافِذَةَ", "t": "pencereyi", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "شَرِبَ الطِّفْلُ الْمَاءَ.": [{"w": "شَرِبَ", "t": "içti", "r": "fiil", "n": "Mâzi (geçmiş zaman). Sonuna ek gelmediği için özne “o (erkek)”."}, {"w": "الطِّفْلُ", "t": "çocuk", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "الْمَاءَ", "t": "suyu", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "شَرِبَتِ الْبِنْتُ الْحَلِيبَ.": [{"w": "شَرِبَتِ", "t": "içti (o kadın)", "r": "fiil", "n": "Mâzi + dişil tê; sonraki kelime yüzünden esre okunur: “şeribeti”."}, {"w": "الْبِنْتُ", "t": "kız çocuğu", "r": "isim", "n": "Cümlenin öznesi olduğu için sonu ötre."}, {"w": "الْحَلِيبَ", "t": "sütü", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "أَكَلَ الرَّجُلُ الْخُبْزَ.": [{"w": "أَكَلَ", "t": "yedi", "r": "fiil", "n": "Mâzi (geçmiş zaman). Sonuna ek gelmediği için özne “o (erkek)”."}, {"w": "الرَّجُلُ", "t": "adam", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. “er-raculu” okunur."}, {"w": "الْخُبْزَ", "t": "ekmeği", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "جَلَسَتِ الْمَرْأَةُ فِي الْغُرْفَةِ.": [{"w": "جَلَسَتِ", "t": "oturdu (o kadın)", "r": "fiil", "n": "Mâzi + dişil tê; bağlantı yüzünden esre okunur."}, {"w": "الْمَرْأَةُ", "t": "kadın", "r": "isim", "n": "Cümlenin öznesi olduğu için sonu ötre."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْغُرْفَةِ", "t": "oda", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "خَرَجَ الطُّلَّابُ مِنَ الْفَصْلِ.": [{"w": "خَرَجَ", "t": "çıktı(lar)", "r": "fiil", "n": "Mâzi. Fiil önce gelince tekil kalır; çoğulluğu özne gösterir."}, {"w": "الطُّلَّابُ", "t": "öğrenciler", "r": "isim", "n": "“Tâlib”in kırık çoğulu. Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir."}, {"w": "مِنَ", "t": "-den / -dan", "r": "harf", "n": "Ayrılma bildiren edat. “el-” ile başlayan kelimeden önce sonu üstün okunur: “mine”."}, {"w": "الْفَصْلِ", "t": "sınıf", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "كَتَبْتُ رِسَالَةً.": [{"w": "كَتَبْتُ", "t": "yazdım", "r": "fiil", "n": "Mâzi. Sondaki ötreli tê “ben” demektir."}, {"w": "رِسَالَةً", "t": "bir mektup", "r": "isim", "n": "Nesne olduğu için üstün, belirsiz olduğu için tenvin."}],
    "قَرَأْتُ كِتَابًا.": [{"w": "قَرَأْتُ", "t": "okudum", "r": "fiil", "n": "Sondaki ötreli tê “ben”."}, {"w": "كِتَابًا", "t": "bir kitap", "r": "isim", "n": "Nesne + tenvin: “kitâben”."}],
    "كَتَبْتَ الدَّرْسَ.": [{"w": "كَتَبْتَ", "t": "yazdın (erkek)", "r": "fiil", "n": "Sondaki üstünlü tê “sen (erkek)” demektir."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "قَرَأْتِ الْقِصَّةَ.": [{"w": "قَرَأْتِ", "t": "okudun (kadın)", "r": "fiil", "n": "Sondaki esreli tê “sen (kadın)” demektir; erkekten tek farkı harekedir."}, {"w": "الْقِصَّةَ", "t": "hikâyeyi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "ذَهَبَ إِلَى الْمَسْجِدِ.": [{"w": "ذَهَبَ", "t": "gitti (erkek)", "r": "fiil", "n": "Hiç ek almayan mâzi: 3. tekil eril."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "ذَهَبَتْ إِلَى الْمَدْرَسَةِ.": [{"w": "ذَهَبَتْ", "t": "gitti (kadın)", "r": "fiil", "n": "Sondaki sakin tê: 3. tekil dişil."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "كَتَبْنَا الْوَاجِبَ.": [{"w": "كَتَبْنَا", "t": "yazdık", "r": "fiil", "n": "Sondaki “nâ” eki “biz” demektir."}, {"w": "الْوَاجِبَ", "t": "ödevi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "ذَهَبْنَا إِلَى السُّوقِ.": [{"w": "ذَهَبْنَا", "t": "gittik", "r": "fiil", "n": "Sondaki “nâ” eki “biz”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "pazar / çarşı", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir."}],
    "قَرَأْتُمْ الْكِتَابَ.": [{"w": "قَرَأْتُمْ", "t": "okudunuz (erkek/karma)", "r": "fiil", "n": "Sondaki “tum” eki 2. çoğul eril."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "كَتَبْتُنَّ الرَّسَائِلَ.": [{"w": "كَتَبْتُنَّ", "t": "yazdınız (kadınlar)", "r": "fiil", "n": "Sondaki şeddeli nûn 2. çoğul dişil ekidir."}, {"w": "الرَّسَائِلَ", "t": "mektupları", "r": "isim", "n": "“Risâle”nin kırık çoğulu. Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir."}],
    "شَرِبُوا الْمَاءَ.": [{"w": "شَرِبُوا", "t": "içtiler (erkek/karma)", "r": "fiil", "n": "Sondaki vâv 3. çoğul eril ekidir; elif okunmaz."}, {"w": "الْمَاءَ", "t": "suyu", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "قَرَأْنَ الْقِصَّةَ.": [{"w": "قَرَأْنَ", "t": "okudular (kadınlar)", "r": "fiil", "n": "Sondaki sakin nûn 3. çoğul dişil ekidir."}, {"w": "الْقِصَّةَ", "t": "hikâyeyi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "ذَهَبْتُمَا إِلَى الْمَدْرَسَةِ.": [{"w": "ذَهَبْتُمَا", "t": "ikiniz gittiniz", "r": "fiil", "n": "“tumâ” eki ikil: tam iki kişiye hitap eder."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "كَتَبَا الدَّرْسَ.": [{"w": "كَتَبَا", "t": "ikisi yazdı (erkek)", "r": "fiil", "n": "Sondaki elif ikil eril ekidir: tam iki kişi."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "كَتَبَتَا الرِّسَالَةَ.": [{"w": "كَتَبَتَا", "t": "ikisi yazdı (kadın)", "r": "fiil", "n": "Dişil tê + ikil elif: iki kadın."}, {"w": "الرِّسَالَةَ", "t": "mektubu", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "قَرَأْنَا الدَّرْسَ.": [{"w": "قَرَأْنَا", "t": "okuduk", "r": "fiil", "n": "Sondaki “nâ” eki “biz”; dişil çoğul ekiyle karıştırma, o sakin nûndur."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "أَنَا أَكْتُبُ دَرْسًا.": [{"w": "أَنَا", "t": "ben", "r": "zamir", "n": "1. tekil şahıs."}, {"w": "أَكْتُبُ", "t": "yazıyorum", "r": "fiil", "n": "Muzari. Baştaki hemze “ben” demektir; zamir yazılmasa da özne bellidir."}, {"w": "دَرْسًا", "t": "bir ders", "r": "isim", "n": "Nesne + tenvin: “dersen”."}],
    "أَنْتَ تَذْهَبُ إِلَى الْمَدْرَسَةِ.": [{"w": "أَنْتَ", "t": "sen (erkek)", "r": "zamir", "n": "2. tekil eril."}, {"w": "تَذْهَبُ", "t": "gidiyorsun", "r": "fiil", "n": "Muzari. Baştaki tê burada “sen (erkek)”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "أَنْتِ تَكْتُبِينَ رِسَالَةً.": [{"w": "أَنْتِ", "t": "sen (kadın)", "r": "zamir", "n": "2. tekil dişil."}, {"w": "تَكْتُبِينَ", "t": "yazıyorsun (kadın)", "r": "fiil", "n": "Baştaki tê + sondaki “-îne” birlikte 2. tekil dişili gösterir."}, {"w": "رِسَالَةً", "t": "bir mektup", "r": "isim", "n": "Nesne + tenvin."}],
    "هُوَ يَكْتُبُ الْوَاجِبَ.": [{"w": "هُوَ", "t": "o (erkek)", "r": "zamir", "n": "3. tekil eril."}, {"w": "يَكْتُبُ", "t": "yazıyor", "r": "fiil", "n": "Muzari. Baştaki ye “o (erkek)”."}, {"w": "الْوَاجِبَ", "t": "ödevi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "هِيَ تَقْرَأُ الْقِصَّةَ.": [{"w": "هِيَ", "t": "o (kadın)", "r": "zamir", "n": "3. tekil dişil."}, {"w": "تَقْرَأُ", "t": "okuyor (o kadın)", "r": "fiil", "n": "Baştaki tê burada “o kadın”; aynı harf “sen (erkek)” de olabilir, ayrımı bağlam yapar."}, {"w": "الْقِصَّةَ", "t": "hikâyeyi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "أَنْتُمْ تَقْرَؤُونَ الْكِتَابَ.": [{"w": "أَنْتُمْ", "t": "siz (erkek/karma)", "r": "zamir", "n": "2. çoğul."}, {"w": "تَقْرَؤُونَ", "t": "okuyorsunuz", "r": "fiil", "n": "Baştaki tê + sondaki “-ûne”: 2. çoğul eril."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "هُمْ يَذْهَبُونَ إِلَى الْمَسْجِدِ.": [{"w": "هُمْ", "t": "onlar (erkek/karma)", "r": "zamir", "n": "3. çoğul eril."}, {"w": "يَذْهَبُونَ", "t": "gidiyorlar", "r": "fiil", "n": "Baştaki ye + sondaki “-ûne”: 3. çoğul eril."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "أَقْرَأُ كِتَابًا كُلَّ يَوْمٍ.": [{"w": "أَقْرَأُ", "t": "okurum", "r": "fiil", "n": "Muzari geniş zaman da olabilir; “her gün” ifadesi onu alışkanlığa çeker."}, {"w": "كِتَابًا", "t": "bir kitap", "r": "isim", "n": "Nesne + tenvin."}, {"w": "كُلَّ", "t": "her", "r": "isim", "n": "Sonraki isimle tamlama kurar: “her gün”."}, {"w": "يَوْمٍ", "t": "gün", "r": "isim", "n": "Tamlamanın ikinci parçası olduğu için sonu esre-tenvin."}],
    "نَشْرَبُ الْمَاءَ الآنَ.": [{"w": "نَشْرَبُ", "t": "içiyoruz", "r": "fiil", "n": "Baştaki nûn “biz”."}, {"w": "الْمَاءَ", "t": "suyu", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}, {"w": "الآنَ", "t": "şimdi", "r": "isim", "n": "Zaman zarfı; muzariyi şimdiki zamana çeker."}],
    "يَأْكُلُ الطِّفْلُ الْخُبْزَ.": [{"w": "يَأْكُلُ", "t": "yiyor", "r": "fiil", "n": "Muzari; baştaki ye “o (erkek)”."}, {"w": "الطِّفْلُ", "t": "çocuk", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "الْخُبْزَ", "t": "ekmeği", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "تَفْتَحُ الْمُعَلِّمَةُ الْبَابَ.": [{"w": "تَفْتَحُ", "t": "açıyor (o kadın)", "r": "fiil", "n": "Baştaki tê burada “o kadın”; öznesi yazılı olduğu için karışmaz."}, {"w": "الْمُعَلِّمَةُ", "t": "öğretmen (kadın)", "r": "isim", "n": "Sonundaki yuvarlak tê dişil yapar. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "الْبَابَ", "t": "kapıyı", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "يَجْلِسُ الرَّجُلُ فِي الْغُرْفَةِ.": [{"w": "يَجْلِسُ", "t": "oturuyor", "r": "fiil", "n": "Muzari; baştaki ye “o (erkek)”."}, {"w": "الرَّجُلُ", "t": "adam", "r": "isim", "n": "Şemsî harfle başladığı için “el-”deki lâm okunmaz, harf şeddelenir. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْغُرْفَةِ", "t": "oda", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "تَخْرُجُ الْمَرْأَةُ مِنَ الْبَيْتِ.": [{"w": "تَخْرُجُ", "t": "çıkıyor (o kadın)", "r": "fiil", "n": "Baştaki tê burada “o kadın”."}, {"w": "الْمَرْأَةُ", "t": "kadın", "r": "isim", "n": "Cümlenin öznesi olduğu için sonu ötre."}, {"w": "مِنَ", "t": "-den / -dan", "r": "harf", "n": "Ayrılma bildiren edat. “el-” ile başlayan kelimeden önce sonu üstün okunur: “mine”."}, {"w": "الْبَيْتِ", "t": "ev", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "نَذْهَبُ إِلَى الْمَسْجِدِ كُلَّ يَوْمٍ.": [{"w": "نَذْهَبُ", "t": "gideriz", "r": "fiil", "n": "Baştaki nûn “biz”; “her gün” ile geniş zaman anlamı."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}, {"w": "كُلَّ", "t": "her", "r": "isim", "n": "Sonraki isimle tamlama kurar."}, {"w": "يَوْمٍ", "t": "gün", "r": "isim", "n": "Tamlamanın ikinci parçası; sonu esre-tenvin."}],
    "هَلْ تَقْرَأُ الْمَجَلَّةَ؟": [{"w": "هَلْ", "t": "…mı? / …mi?", "r": "soru", "n": "Cevabı evet-hayır olan soruyu kurar; cümlenin başına gelir."}, {"w": "تَقْرَأُ", "t": "okuyorsun", "r": "fiil", "n": "Baştaki tê “sen (erkek)”."}, {"w": "الْمَجَلَّةَ", "t": "dergiyi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}]
  };

  const LESSON_EXAMPLE_SENTENCES = {
    "ders-01": [
      { ar: "هَذَا كِتَابٌ.", tr: "Bu bir kitaptır." },
      { ar: "هَذَا قَلَمٌ.", tr: "Bu bir kalemdir." },
      { ar: "هَذَا بَابٌ.", tr: "Bu bir kapıdır." },
      { ar: "مُحَمَّدٌ فِي الْبَيْتِ.", tr: "Muhammed evdedir." },
      { ar: "أَحْمَدُ فِي الْمَسْجِدِ.", tr: "Ahmed mescittedir." },
      { ar: "الْكِتَابُ فِي الْحَقِيبَةِ.", tr: "Kitap çantadadır." },
      { ar: "الْقَلَمُ عَلَى الْمَكْتَبِ.", tr: "Kalem masanın üzerindedir." },
      { ar: "يَقْرَأُ مُحَمَّدٌ الْقُرْآنَ.", tr: "Muhammed Kur’an okuyor." },
      { ar: "يَقْرَأُ الطَّالِبُ كِتَابًا.", tr: "Öğrenci bir kitap okuyor." },
      { ar: "ذَهَبَ أَحْمَدُ إِلَى الْمَدْرَسَةِ.", tr: "Ahmed okula gitti." },
      { ar: "خَرَجَ الطَّالِبُ مِنَ الْبَيْتِ.", tr: "Öğrenci evden çıktı." },
      { ar: "الْمُعَلِّمُ فِي الْفَصْلِ.", tr: "Öğretmen sınıftadır." },
      { ar: "الْمَاءُ فِي الْكُوبِ.", tr: "Su bardaktadır." },
      { ar: "أَنَا فِي الْمَكْتَبَةِ.", tr: "Ben kütüphanedeyim." },
      { ar: "نَحْنُ فِي الْمَدْرَسَةِ.", tr: "Biz okuldayız." },
      { ar: "الطَّالِبُ مِنْ تُرْكِيَا.", tr: "Öğrenci Türkiye’dendir." }
    ],
    "ders-02": [
      { ar: "هَذَا كِتَابٌ.", tr: "Bu bir kitaptır." },
      { ar: "هَذِهِ مَجَلَّةٌ.", tr: "Bu bir dergidir." },
      { ar: "هَذَا قَلَمٌ.", tr: "Bu bir kalemdir." },
      { ar: "هَذِهِ حَقِيبَةٌ.", tr: "Bu bir çantadır." },
      { ar: "هَذَا الْبَيْتُ كَبِيرٌ.", tr: "Bu ev büyüktür." },
      { ar: "هَذِهِ الْمَدْرَسَةُ جَدِيدَةٌ.", tr: "Bu okul yenidir." },
      { ar: "الْكِتَابُ فِي الْحَقِيبَةِ.", tr: "Kitap çantadadır." },
      { ar: "الْقَلَمُ عَلَى الْمَكْتَبِ.", tr: "Kalem masanın üzerindedir." },
      { ar: "الْبَابُ مَفْتُوحٌ.", tr: "Kapı açıktır." },
      { ar: "النَّافِذَةُ مُغْلَقَةٌ.", tr: "Pencere kapalıdır." },
      { ar: "مَا هَذَا؟ هَذَا مِفْتَاحٌ.", tr: "Bu nedir? Bu bir anahtardır." },
      { ar: "مَا هَذِهِ؟ هَذِهِ سَاعَةٌ.", tr: "Bu nedir? Bu bir saattir." },
      { ar: "أَيْنَ الْكِتَابُ؟ الْكِتَابُ فِي الْغُرْفَةِ.", tr: "Kitap nerede? Kitap odadadır." },
      { ar: "هَذَا مَسْجِدٌ.", tr: "Bu bir mescittir." },
      { ar: "هَذِهِ مَكْتَبَةٌ.", tr: "Bu bir kütüphanedir." },
      { ar: "الْحَمْدُ لِلَّهِ.", tr: "Hamd Allah’a aittir." }
    ],
    "ders-03": [
      { ar: "أَنَا طَالِبٌ.", tr: "Ben erkek öğrenciyim." },
      { ar: "أَنَا طَالِبَةٌ.", tr: "Ben kadın öğrenciyim." },
      { ar: "أَنْتَ مُعَلِّمٌ.", tr: "Sen erkek öğretmensin." },
      { ar: "أَنْتِ مُعَلِّمَةٌ.", tr: "Sen kadın öğretmensin." },
      { ar: "هُوَ طَبِيبٌ.", tr: "O erkek doktordur." },
      { ar: "هِيَ طَبِيبَةٌ.", tr: "O kadın doktordur." },
      { ar: "نَحْنُ فِي الْمَدْرَسَةِ.", tr: "Biz okuldayız." },
      { ar: "أَنْتُمْ فِي الْفَصْلِ.", tr: "Siz sınıftasınız." },
      { ar: "هُمْ فِي الْمَسْجِدِ.", tr: "Onlar mescittedir." },
      { ar: "هُنَّ فِي الْمَكْتَبَةِ.", tr: "Onlar (kadınlar) kütüphanededir." },
      { ar: "أَنَا أَقْرَأُ الْكِتَابَ.", tr: "Ben kitabı okuyorum." },
      { ar: "نَحْنُ نَقْرَأُ الْقُرْآنَ.", tr: "Biz Kur’an okuyoruz." },
      { ar: "أَنْتَ تَكْتُبُ الدَّرْسَ.", tr: "Sen dersi yazıyorsun." },
      { ar: "هُوَ يَقْرَأُ الْمَجَلَّةَ.", tr: "O dergiyi okuyor." },
      { ar: "هِيَ تَكْتُبُ الرِّسَالَةَ.", tr: "O kadın mektubu yazıyor." },
      { ar: "هُمْ يَقْرَؤُونَ الْكِتَابَ.", tr: "Onlar kitabı okuyorlar." }
    ],
    "ders-04": [
      { ar: "كِتَابٌ جَدِيدٌ.", tr: "Yeni bir kitap." },
      { ar: "سَيَّارَةٌ جَدِيدَةٌ.", tr: "Yeni bir araba." },
      { ar: "بَيْتٌ كَبِيرٌ.", tr: "Büyük bir ev." },
      { ar: "مَدْرَسَةٌ كَبِيرَةٌ.", tr: "Büyük bir okul." },
      { ar: "قَلَمٌ صَغِيرٌ.", tr: "Küçük bir kalem." },
      { ar: "حَقِيبَةٌ صَغِيرَةٌ.", tr: "Küçük bir çanta." },
      { ar: "رَجُلٌ طَوِيلٌ.", tr: "Uzun boylu bir adam." },
      { ar: "اِمْرَأَةٌ طَوِيلَةٌ.", tr: "Uzun boylu bir kadın." },
      { ar: "مَسْجِدٌ جَمِيلٌ.", tr: "Güzel bir mescit." },
      { ar: "حَدِيقَةٌ جَمِيلَةٌ.", tr: "Güzel bir bahçe." },
      { ar: "فَصْلٌ نَظِيفٌ.", tr: "Temiz bir sınıf." },
      { ar: "غُرْفَةٌ نَظِيفَةٌ.", tr: "Temiz bir oda." },
      { ar: "الْكِتَابُ الْجَدِيدُ مُفِيدٌ.", tr: "Yeni kitap faydalıdır." },
      { ar: "السَّيَّارَةُ الْجَدِيدَةُ سَرِيعَةٌ.", tr: "Yeni araba hızlıdır." },
      { ar: "هَذَا كِتَابٌ مُفِيدٌ.", tr: "Bu faydalı bir kitaptır." },
      { ar: "هَذِهِ قِصَّةٌ قَصِيرَةٌ.", tr: "Bu kısa bir hikâyedir." }
    ],
    "ders-05": [
      { ar: "كَتَبَ الطَّالِبُ الدَّرْسَ.", tr: "Erkek öğrenci dersi yazdı." },
      { ar: "كَتَبَتْ الطَّالِبَةُ الرِّسَالَةَ.", tr: "Kadın öğrenci mektubu yazdı." },
      { ar: "كَتَبُوا الْوَاجِبَ.", tr: "Onlar ödevi yazdılar." },
      { ar: "قَرَأَ مُحَمَّدٌ الْكِتَابَ.", tr: "Muhammed kitabı okudu." },
      { ar: "قَرَأَتْ مَرْيَمُ الْقِصَّةَ.", tr: "Meryem hikâyeyi okudu." },
      { ar: "قَرَؤُوا الْقُرْآنَ.", tr: "Onlar Kur’an okudular." },
      { ar: "ذَهَبَ أَحْمَدُ إِلَى الْمَسْجِدِ.", tr: "Ahmed mescide gitti." },
      { ar: "ذَهَبَتْ فَاطِمَةُ إِلَى الْمَدْرَسَةِ.", tr: "Fatıma okula gitti." },
      { ar: "ذَهَبُوا إِلَى السُّوقِ.", tr: "Onlar pazara gittiler." },
      { ar: "فَتَحَ الْمُعَلِّمُ الْبَابَ.", tr: "Öğretmen kapıyı açtı." },
      { ar: "فَتَحَتِ الْمُعَلِّمَةُ النَّافِذَةَ.", tr: "Kadın öğretmen pencereyi açtı." },
      { ar: "شَرِبَ الطِّفْلُ الْمَاءَ.", tr: "Çocuk suyu içti." },
      { ar: "شَرِبَتِ الْبِنْتُ الْحَلِيبَ.", tr: "Kız çocuğu sütü içti." },
      { ar: "أَكَلَ الرَّجُلُ الْخُبْزَ.", tr: "Adam ekmeği yedi." },
      { ar: "جَلَسَتِ الْمَرْأَةُ فِي الْغُرْفَةِ.", tr: "Kadın odada oturdu." },
      { ar: "خَرَجَ الطُّلَّابُ مِنَ الْفَصْلِ.", tr: "Öğrenciler sınıftan çıktılar." }
    ],
    "ders-06": [
      { ar: "كَتَبْتُ رِسَالَةً.", tr: "Ben bir mektup yazdım." },
      { ar: "قَرَأْتُ كِتَابًا.", tr: "Ben bir kitap okudum." },
      { ar: "كَتَبْتَ الدَّرْسَ.", tr: "Sen dersi yazdın (erkek)." },
      { ar: "قَرَأْتِ الْقِصَّةَ.", tr: "Sen hikâyeyi okudun (kadın)." },
      { ar: "ذَهَبَ إِلَى الْمَسْجِدِ.", tr: "O mescide gitti (erkek)." },
      { ar: "ذَهَبَتْ إِلَى الْمَدْرَسَةِ.", tr: "O okula gitti (kadın)." },
      { ar: "كَتَبْنَا الْوَاجِبَ.", tr: "Biz ödevi yazdık." },
      { ar: "ذَهَبْنَا إِلَى السُّوقِ.", tr: "Biz pazara gittik." },
      { ar: "قَرَأْتُمْ الْكِتَابَ.", tr: "Siz kitabı okudunuz (erkek/karma)." },
      { ar: "كَتَبْتُنَّ الرَّسَائِلَ.", tr: "Siz mektupları yazdınız (kadınlar)." },
      { ar: "شَرِبُوا الْمَاءَ.", tr: "Onlar suyu içtiler (erkek/karma)." },
      { ar: "قَرَأْنَ الْقِصَّةَ.", tr: "Onlar hikâyeyi okudular (kadınlar)." },
      { ar: "ذَهَبْتُمَا إِلَى الْمَدْرَسَةِ.", tr: "Siz ikiniz okula gittiniz." },
      { ar: "كَتَبَا الدَّرْسَ.", tr: "O ikisi dersi yazdı (iki erkek)." },
      { ar: "كَتَبَتَا الرِّسَالَةَ.", tr: "O ikisi mektubu yazdı (iki kadın)." },
      { ar: "قَرَأْنَا الدَّرْسَ.", tr: "Biz dersi okuduk." }
    ],
    "ders-07": [
      { ar: "أَنَا أَكْتُبُ دَرْسًا.", tr: "Ben bir ders yazıyorum." },
      { ar: "نَحْنُ نَقْرَأُ الْقُرْآنَ.", tr: "Biz Kur’an okuyoruz." },
      { ar: "أَنْتَ تَذْهَبُ إِلَى الْمَدْرَسَةِ.", tr: "Sen okula gidiyorsun (erkek)." },
      { ar: "أَنْتِ تَكْتُبِينَ رِسَالَةً.", tr: "Sen bir mektup yazıyorsun (kadın)." },
      { ar: "هُوَ يَكْتُبُ الْوَاجِبَ.", tr: "O ödevi yazıyor (erkek)." },
      { ar: "هِيَ تَقْرَأُ الْقِصَّةَ.", tr: "O hikâyeyi okuyor (kadın)." },
      { ar: "أَنْتُمْ تَقْرَؤُونَ الْكِتَابَ.", tr: "Siz kitabı okuyorsunuz (erkek/karma)." },
      { ar: "هُمْ يَذْهَبُونَ إِلَى الْمَسْجِدِ.", tr: "Onlar mescide gidiyorlar." },
      { ar: "أَقْرَأُ كِتَابًا كُلَّ يَوْمٍ.", tr: "Her gün bir kitap okurum." },
      { ar: "نَشْرَبُ الْمَاءَ الآنَ.", tr: "Şimdi su içiyoruz." },
      { ar: "يَأْكُلُ الطِّفْلُ الْخُبْزَ.", tr: "Çocuk ekmek yiyor." },
      { ar: "تَفْتَحُ الْمُعَلِّمَةُ الْبَابَ.", tr: "Kadın öğretmen kapıyı açıyor." },
      { ar: "يَجْلِسُ الرَّجُلُ فِي الْغُرْفَةِ.", tr: "Adam odada oturuyor." },
      { ar: "تَخْرُجُ الْمَرْأَةُ مِنَ الْبَيْتِ.", tr: "Kadın evden çıkıyor." },
      { ar: "نَذْهَبُ إِلَى الْمَسْجِدِ كُلَّ يَوْمٍ.", tr: "Her gün mescide gideriz." },
      { ar: "هَلْ تَقْرَأُ الْمَجَلَّةَ؟", tr: "Dergiyi okuyor musun?" }
    ]
  };

  function applyTheme(theme) {
    body.dataset.theme = theme;
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) themeColorMeta.setAttribute("content", theme === "dark" ? "#111619" : "#f2eee6");
    if (themeToggle) {
      const isDark = theme === "dark";
      themeToggle.setAttribute("aria-label", isDark ? "Açık temayı aç" : "Koyu temayı aç");
      themeToggle.title = isDark ? "Açık tema" : "Koyu tema";
    }
  }

  applyTheme(savedTheme || (preferredDark ? "dark" : "light"));

  themeToggle?.addEventListener("click", () => {
    const next = body.dataset.theme === "dark" ? "light" : "dark";
    localStorage.setItem(`${STORAGE_PREFIX}:theme`, next);
    applyTheme(next);
  });

  setupArabicReadingPreferences();
  setupArabicScale();

  if (body.dataset.page === "home") {
    initHome();
  }

  if (body.dataset.page === "lesson") {
    initLesson();
  }

  setupPronounGrid();
  setupUniversalArabicTools();
  colorizeLessonWordBreakdowns();
  setupVerbTables();
  setupReadingProgress();


  function setupArabicReadingPreferences() {
    const tools = ensureReadingTools();
    if (!tools) return;

    const fontKey = `${STORAGE_PREFIX}:arabic-font`;
    const fontDefaultVersionKey = `${STORAGE_PREFIX}:arabic-font-default-version`;
    const harakatKey = `${STORAGE_PREFIX}:harakat`;
    if (localStorage.getItem(fontDefaultVersionKey) !== "3") {
      localStorage.setItem(fontKey, DEFAULT_ARABIC_FONT);
      localStorage.setItem(fontDefaultVersionKey, "3");
    }
    const savedFont = localStorage.getItem(fontKey) || DEFAULT_ARABIC_FONT;
    let showHarakat = localStorage.getItem(harakatKey) !== "hidden";
    let lastFontWheelAt = 0;

    const fontControl = document.createElement("label");
    fontControl.className = "font-control";
    fontControl.htmlFor = "arabic-font-selector";
    fontControl.innerHTML = '<span class="font-control__label">Arapça fontu</span>';

    const fontSelector = document.createElement("select");
    fontSelector.id = "arabic-font-selector";
    fontSelector.className = "font-selector";
    fontSelector.setAttribute("aria-label", "Arapça yazı tipini seç");
    fontSelector.title = "Arapça yazı tipini seç · üzerindeyken fare tekerleğini de kullanabilirsin";

    arabicFonts.forEach((font) => {
      const option = document.createElement("option");
      option.value = font.value;
      option.textContent = font.label;
      fontSelector.appendChild(option);
    });

    fontControl.appendChild(fontSelector);
    tools.prepend(fontControl);

    const harakatButton = document.createElement("button");
    harakatButton.type = "button";
    harakatButton.id = "harakat-toggle";
    harakatButton.className = "harakat-toggle";

    const firstSizeButton = document.getElementById("arabic-smaller");
    tools.insertBefore(harakatButton, firstSizeButton || themeToggle || null);

    function applyFont(value) {
      const font = arabicFonts.find((item) => item.value === value) || arabicFonts[0];
      if (!EAGER_ARABIC_FONTS.has(font.value)) ensureExtraArabicFonts();
      fontSelector.value = font.value;
      document.documentElement.style.setProperty("--arabic-font", font.stack);
      document.documentElement.dataset.arabicFont = font.value;
    }

    function renderHarakat() {
      document.documentElement.dataset.harakat = showHarakat ? "shown" : "hidden";
      harakatButton.setAttribute("aria-pressed", String(!showHarakat));
      harakatButton.setAttribute("aria-label", showHarakat ? "Arapça harekeleri gizle" : "Arapça harekeleri göster");
      harakatButton.title = showHarakat ? "Harekeleri gizle" : "Harekeleri göster";
      harakatButton.innerHTML = `<span class="harakat-toggle__sample" lang="ar" dir="rtl">${showHarakat ? "بَ" : "ب"}</span><span>Hareke: ${showHarakat ? "Açık" : "Kapalı"}</span>`;
      applyHarakatToPage(showHarakat);
    }

    applyFont(savedFont);
    renderHarakat();
    syncTopbarHeight();

    fontSelector.addEventListener("change", () => {
      localStorage.setItem(fontKey, fontSelector.value);
      applyFont(fontSelector.value);
      showToast(`Arapça yazı tipi: ${fontSelector.selectedOptions[0].textContent}`);
    });

    fontSelector.addEventListener("wheel", (event) => {
      event.preventDefault();
      const now = Date.now();
      if (now - lastFontWheelAt < 140 || event.deltaY === 0) return;
      lastFontWheelAt = now;

      const direction = event.deltaY > 0 ? 1 : -1;
      fontSelector.selectedIndex = (fontSelector.selectedIndex + direction + arabicFonts.length) % arabicFonts.length;
      fontSelector.dispatchEvent(new Event("change", { bubbles: true }));
    }, { passive: false });

    harakatButton.addEventListener("click", () => {
      showHarakat = !showHarakat;
      localStorage.setItem(harakatKey, showHarakat ? "shown" : "hidden");
      renderHarakat();
      showToast(showHarakat ? "Harekeler gösteriliyor." : "Harekeler gizlendi.");
    });

    const topbar = document.querySelector(".topbar");
    if (topbar && "ResizeObserver" in window) {
      new ResizeObserver(syncTopbarHeight).observe(topbar);
    }
    window.addEventListener("resize", syncTopbarHeight, { passive: true });
  }

  function setupReadingProgress() {
    const topbar = document.querySelector(".topbar");
    if (!topbar) return;
    if (!document.querySelector(".lesson-content, .reference-content, main")) return;

    const bar = document.createElement("div");
    bar.className = "reading-progress";
    bar.setAttribute("aria-hidden", "true");
    const fill = document.createElement("span");
    bar.appendChild(fill);
    topbar.appendChild(bar);

    let ticking = false;
    const update = () => {
      ticking = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 40 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      fill.style.transform = `scaleX(${ratio})`;
      bar.classList.toggle("is-visible", scrollable > 400);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  function ensureReadingTools() {
    const topbarInner = document.querySelector(".topbar__inner");
    if (!topbarInner) return null;

    let tools = document.querySelector(".reading-tools");
    if (!tools) {
      tools = document.createElement("div");
      tools.className = "reading-tools";
      tools.setAttribute("aria-label", "Okuma araçları");
    }
    tools.id = tools.id || "reading-tools";
    if (themeToggle && themeToggle.parentElement !== tools) tools.appendChild(themeToggle);
    if (themeToggle && !themeToggle.querySelector(".control-label")) {
      const themeLabel = document.createElement("span");
      themeLabel.className = "control-label";
      themeLabel.textContent = "Tema";
      themeToggle.appendChild(themeLabel);
    }

    if (!tools.closest(".topbar__controls")) {
      const controls = document.createElement("div");
      controls.className = "topbar__controls";

      const settingsToggle = document.createElement("button");
      settingsToggle.type = "button";
      settingsToggle.id = "reading-settings-toggle";
      settingsToggle.className = "icon-button settings-toggle";
      settingsToggle.setAttribute("aria-expanded", "false");
      settingsToggle.setAttribute("aria-controls", tools.id);
      settingsToggle.setAttribute("aria-label", "Okuma ayarlarını aç");
      settingsToggle.title = "Okuma ayarları";
      settingsToggle.innerHTML = '<span aria-hidden="true">\u2699</span>';

      topbarInner.appendChild(controls);
      controls.append(settingsToggle, tools);

      const setPanel = (open) => {
        tools.dataset.open = open ? "true" : "false";
        settingsToggle.setAttribute("aria-expanded", String(open));
        settingsToggle.setAttribute("aria-label", open ? "Okuma ayarlarını kapat" : "Okuma ayarlarını aç");
        settingsToggle.classList.toggle("is-active", open);
      };
      setPanel(false);

      settingsToggle.addEventListener("click", (event) => {
        event.stopPropagation();
        setPanel(tools.dataset.open !== "true");
      });

      document.addEventListener("click", (event) => {
        if (tools.dataset.open !== "true") return;
        if (controls.contains(event.target)) return;
        setPanel(false);
      });

      document.addEventListener("keydown", (event) => {
        if (event.key !== "Escape" || tools.dataset.open !== "true") return;
        setPanel(false);
        settingsToggle.focus();
      });
    }

    return tools;
  }

  function applyHarakatToPage(showHarakat) {
    document.querySelectorAll("[lang^='ar']").forEach((element) => {
      if (element.matches("input, textarea")) {
        const originalPlaceholder = element.dataset.originalArabicPlaceholder || element.getAttribute("placeholder");
        if (originalPlaceholder) {
          element.dataset.originalArabicPlaceholder = originalPlaceholder;
          element.setAttribute("placeholder", showHarakat ? originalPlaceholder : stripArabicDiacritics(originalPlaceholder));
        }
        return;
      }

      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      let textNode;
      while ((textNode = walker.nextNode())) {
        if (!originalArabicText.has(textNode)) originalArabicText.set(textNode, textNode.nodeValue);
        const original = originalArabicText.get(textNode);
        textNode.nodeValue = showHarakat ? original : stripArabicDiacritics(original);
      }
    });
  }

  function stripArabicDiacritics(text) {
    return text.replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "");
  }

  function syncTopbarHeight() {
    const topbar = document.querySelector(".topbar");
    if (topbar) document.documentElement.style.setProperty("--topbar-height", `${topbar.offsetHeight}px`);
  }

  function setupArabicScale() {
    const scaleKey = `${STORAGE_PREFIX}:arabic-scale`;
    let scale = Number(localStorage.getItem(scaleKey)) || 1;

    function renderScale() {
      document.documentElement.style.setProperty("--arabic-scale", String(scale));
    }

    renderScale();

    document.getElementById("arabic-larger")?.addEventListener("click", () => {
      scale = Math.min(1.5, Number((scale + 0.1).toFixed(1)));
      localStorage.setItem(scaleKey, String(scale));
      renderScale();
    });

    document.getElementById("arabic-smaller")?.addEventListener("click", () => {
      scale = Math.max(0.8, Number((scale - 0.1).toFixed(1)));
      localStorage.setItem(scaleKey, String(scale));
      renderScale();
    });
  }

  function readReviewQueue() {
    try {
      const queue = JSON.parse(localStorage.getItem(REVIEW_QUEUE_KEY) || "[]");
      return Array.isArray(queue) ? queue : [];
    } catch {
      return [];
    }
  }

  function saveReviewQueue(queue) {
    localStorage.setItem(REVIEW_QUEUE_KEY, JSON.stringify(queue));
  }

  function queueReviewItem(item) {
    const queue = readReviewQueue();
    const existingIndex = queue.findIndex((entry) => entry.id === item.id);
    const existing = existingIndex >= 0 ? queue[existingIndex] : null;
    const queued = {
      ...existing,
      ...item,
      intervalIndex: Math.max(0, Number(existing?.intervalIndex || 0) - (existing ? 1 : 0)),
      dueAt: Date.now(),
      attempts: Number(existing?.attempts || 0) + 1,
      updatedAt: Date.now()
    };

    if (existingIndex >= 0) queue.splice(existingIndex, 1, queued);
    else queue.push(queued);
    saveReviewQueue(queue);
  }

  function advanceReviewItem(id) {
    const queue = readReviewQueue();
    const index = queue.findIndex((entry) => entry.id === id);
    if (index < 0) return;

    const item = queue[index];
    const intervalIndex = Number(item.intervalIndex || 0);
    if (intervalIndex >= REVIEW_INTERVAL_DAYS.length) {
      queue.splice(index, 1);
      const mastered = Number(localStorage.getItem(REVIEW_MASTERED_KEY) || 0) + 1;
      localStorage.setItem(REVIEW_MASTERED_KEY, String(mastered));
    } else {
      item.dueAt = Date.now() + REVIEW_INTERVAL_DAYS[intervalIndex] * 24 * 60 * 60 * 1000;
      item.intervalIndex = intervalIndex + 1;
      item.updatedAt = Date.now();
    }
    saveReviewQueue(queue);
  }

  function removeLessonReviewItems(lessonId) {
    saveReviewQueue(readReviewQueue().filter((item) => item.lessonId !== lessonId));
  }

  function reviewHref(item) {
    const section = item.sectionId ? `#${item.sectionId}` : "";
    return `${item.lessonId}.html?review=${encodeURIComponent(item.id)}${section}`;
  }

  function formatReviewDate(timestamp) {
    return new Intl.DateTimeFormat("tr-TR", { day: "numeric", month: "short" }).format(new Date(timestamp));
  }

  function appendMixedArabicText(container, text) {
    const arabicRun = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+(?:\s+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)*)/g;
    String(text || "").split(arabicRun).filter(Boolean).forEach((part) => {
      if (/[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/.test(part)) {
        const arabic = document.createElement("span");
        arabic.className = "arabic inline review-arabic";
        arabic.lang = "ar";
        arabic.dir = "rtl";
        arabic.textContent = part;
        container.appendChild(arabic);
        // LTR isaretleyici: Arapca parcalarin arasindaki numara/noktalama bidi ile ters siralanmasin.
        container.appendChild(document.createTextNode("\u200E"));
      } else {
        container.appendChild(document.createTextNode(part));
      }
    });
  }

  function addHomeReviewDashboard() {
    const intro = document.querySelector(".course-intro");
    if (!intro) return;

    const queue = readReviewQueue().sort((a, b) => Number(a.dueAt) - Number(b.dueAt));
    const now = Date.now();
    const due = queue.filter((item) => Number(item.dueAt) <= now);
    const upcoming = queue.filter((item) => Number(item.dueAt) > now);
    const mastered = Number(localStorage.getItem(REVIEW_MASTERED_KEY) || 0);
    const section = document.createElement("section");
    section.className = "review-dashboard";
    section.setAttribute("aria-labelledby", "review-dashboard-title");

    const header = document.createElement("div");
    header.className = "review-dashboard__header";
    header.innerHTML = `<div><p class="eyebrow">Aralıklı tekrar</p><h2 id="review-dashboard-title">Bugünkü tekrarların</h2></div><div class="review-dashboard__counts"><span><strong>${due.length}</strong> bugün</span><span><strong>${upcoming.length}</strong> yaklaşan</span><span><strong>${mastered}</strong> pekişen</span></div>`;
    section.appendChild(header);

    if (!due.length) {
      const empty = document.createElement("div");
      empty.className = "review-dashboard__empty";
      const nextText = upcoming.length
        ? `Sıradaki tekrar ${formatReviewDate(upcoming[0].dueAt)} tarihinde.`
        : "Bir soruda zorlandığında veya bir yazılı cevabı tekrar etmek istediğinde burada görünecek.";
      empty.innerHTML = `<strong>Bugün bekleyen tekrar yok.</strong><span>${nextText}</span>`;
      section.appendChild(empty);
    } else {
      const list = document.createElement("div");
      list.className = "review-dashboard__list";
      due.slice(0, 8).forEach((item) => {
        const card = document.createElement("article");
        card.className = "review-task";
        const meta = document.createElement("div");
        meta.className = "review-task__meta";
        meta.textContent = `${LESSON_TITLES[item.lessonId] || item.lessonId} · ${item.topic || "Tekrar"}`;
        const prompt = document.createElement("p");
        appendMixedArabicText(prompt, item.prompt || "Bu konuyu yeniden çalış.");
        const link = document.createElement("a");
        link.className = "secondary-button";
        link.href = reviewHref(item);
        link.textContent = "Tekrarı aç";
        card.append(meta, prompt, link);
        list.appendChild(card);
      });
      section.appendChild(list);
    }

    intro.insertAdjacentElement("afterend", section);
  }

  function initHome() {
    const lessonCards = [...document.querySelectorAll("[data-lesson-card]")];
    let completed = 0;

    lessonCards.forEach((card) => {
      const lessonId = card.dataset.lessonCard;
      const status = localStorage.getItem(`${STORAGE_PREFIX}:${lessonId}:complete`) === "true";
      const hasAnswers = Boolean(localStorage.getItem(`${STORAGE_PREFIX}:${lessonId}:answers`));
      const statusElement = card.querySelector("[data-lesson-status]");
      const link = card.querySelector("[data-lesson-link]");

      if (status) {
        completed += 1;
        statusElement.textContent = "Tamamlandı";
        statusElement.classList.add("complete");
        link.textContent = "Tekrar aç";
      } else if (hasAnswers) {
        statusElement.textContent = "Devam ediyor";
        link.textContent = "Devam et";
      }
    });

    const total = lessonCards.length;
    const percent = total ? Math.round((completed / total) * 100) : 0;
    const label = document.getElementById("course-progress-label");
    const track = document.getElementById("course-progress");

    if (label) label.textContent = `${completed} / ${total}`;
    if (track) {
      track.setAttribute("aria-valuenow", String(percent));
      const bar = track.querySelector("span");
      if (bar) bar.style.width = `${percent}%`;
    }

    addHomeReviewDashboard();
  }

  function initLesson() {
    const lessonId = body.dataset.lessonId;
    const form = document.getElementById("lesson-form");
    const answersKey = `${STORAGE_PREFIX}:${lessonId}:answers`;
    const scoreKey = `${STORAGE_PREFIX}:${lessonId}:score`;
    const completeKey = `${STORAGE_PREFIX}:${lessonId}:complete`;
    const warmupKey = `${STORAGE_PREFIX}:${lessonId}:warmup`;
    const writingKey = `${STORAGE_PREFIX}:${lessonId}:writing-review`;
    let lastScore = null;

    setupLessonReview();
    setupExamplePractice();
    setupPrintControls();
    setupFlashcards();
    setupSentenceTools();
    setupWritingFeedback();
    setupPageProgress();
    setupLessonNavigation();
    restoreForm();
    focusRequestedReview();
    if (document.documentElement.dataset.harakat === "hidden") applyHarakatToPage(false);

    form?.addEventListener("input", (event) => {
      clearQuestionResult(event.target);
      saveForm();
    });
    form?.addEventListener("change", (event) => {
      clearQuestionResult(event.target);
      saveForm();
    });

    document.getElementById("check-answers")?.addEventListener("click", checkAnswers);
    document.getElementById("copy-report")?.addEventListener("click", copyReport);
    document.getElementById("reset-lesson")?.addEventListener("click", resetLesson);
    document.getElementById("lesson-complete")?.addEventListener("change", (event) => {
      localStorage.setItem(completeKey, event.target.checked ? "true" : "false");
      saveForm();
      showToast(event.target.checked ? "Ders tamamlandı olarak işaretlendi." : "Tamamlandı işareti kaldırıldı.");
    });

    function setupLessonReview() {
      const items = LESSON_REVIEW_SETS[lessonId] || [];
      const hero = document.querySelector(".lesson-hero");
      if (!items.length || !hero) return;

      const nav = document.querySelector(".lesson-nav");
      if (nav && !nav.querySelector('a[href="#karma-tekrar"]')) {
        const link = document.createElement("a");
        link.href = "#karma-tekrar";
        link.textContent = lessonId === "ders-01" ? "Hazırlık" : "Karma tekrar";
        nav.querySelector("a")?.insertAdjacentElement("afterend", link);
      }

      const section = document.createElement("section");
      section.className = "lesson-section review-warmup";
      section.id = "karma-tekrar";
      section.innerHTML = `<p class="section-kicker">${lessonId === "ders-01" ? "Hazırlık yoklaması" : "Önce hatırla"}</p><h2>${lessonId === "ders-01" ? "Başlamadan önce bildiklerini yokla" : "Önceki derslerden beş kısa soru"}</h2><p>Notlarına bakmadan cevapla. Bu bölüm ders puanına katılmaz; zorlandığın maddeler tekrar listene eklenir.</p>`;

      const list = document.createElement("div");
      list.className = "question-list question-list--compact review-question-list";
      items.forEach((item, index) => {
        const fieldset = document.createElement("fieldset");
        fieldset.className = "question review-question";
        fieldset.dataset.reviewId = item.id;
        fieldset.dataset.answer = item.answer;
        fieldset.dataset.topic = item.topic;

        const legend = document.createElement("legend");
        const number = document.createElement("span");
        number.className = "question-number";
        number.textContent = String(index + 1);
        const prompt = document.createElement("span");
        appendMixedArabicText(prompt, item.prompt);
        legend.append(number, prompt);
        fieldset.appendChild(legend);

        if (item.arabic) {
          const arabic = document.createElement("p");
          arabic.className = "arabic review-question__arabic";
          arabic.lang = "ar";
          arabic.dir = "rtl";
          arabic.textContent = item.arabic;
          fieldset.appendChild(arabic);
        }

        const choices = document.createElement("div");
        choices.className = "choice-row";
        item.options.forEach(([value, labelText]) => {
          const label = document.createElement("label");
          const input = document.createElement("input");
          input.type = "radio";
          input.name = `review-${lessonId}-${item.id}`;
          input.value = value;
          const labelSpan = document.createElement("span");
          labelSpan.textContent = labelText;
          if (/\p{Script=Arabic}/u.test(labelText)) {
            labelSpan.lang = "ar";
            labelSpan.dir = "rtl";
            labelSpan.className = "arabic mini";
          }
          label.append(input, labelSpan);
          choices.appendChild(label);
        });
        const feedback = document.createElement("p");
        feedback.className = "feedback";
        feedback.setAttribute("aria-live", "polite");
        fieldset.append(choices, feedback);
        list.appendChild(fieldset);
      });

      const actions = document.createElement("div");
      actions.className = "review-warmup__actions";
      const checkButton = document.createElement("button");
      checkButton.type = "button";
      checkButton.className = "secondary-button";
      checkButton.textContent = "Tekrarı kontrol et";
      const summary = document.createElement("p");
      summary.className = "review-warmup__summary";
      summary.setAttribute("aria-live", "polite");
      actions.append(checkButton, summary);
      section.append(list, actions);
      hero.insertAdjacentElement("afterend", section);

      const saved = readJson(warmupKey, {});
      list.querySelectorAll(".review-question").forEach((question) => {
        const value = saved[question.dataset.reviewId];
        if (value) {
          const input = [...question.querySelectorAll("input")].find((candidate) => candidate.value === value);
          if (input) input.checked = true;
        }
        question.addEventListener("change", () => {
          question.classList.remove("correct", "incorrect");
          question.querySelectorAll("label").forEach((label) => label.classList.remove("answer-correct", "answer-wrong"));
          question.querySelector(".feedback").textContent = "";
          const values = readJson(warmupKey, {});
          values[question.dataset.reviewId] = question.querySelector("input:checked")?.value || "";
          localStorage.setItem(warmupKey, JSON.stringify(values));
        });
      });

      checkButton.addEventListener("click", () => {
        let correct = 0;
        let answered = 0;
        items.forEach((item) => {
          const question = list.querySelector(`[data-review-id="${item.id}"]`);
          const selected = question.querySelector("input:checked");
          const feedback = question.querySelector(".feedback");
          question.classList.remove("correct", "incorrect");
          question.querySelectorAll("label").forEach((label) => label.classList.remove("answer-correct", "answer-wrong"));
          if (!selected) {
            feedback.textContent = "Henüz cevaplanmadı.";
            return;
          }
          answered += 1;
          const queueId = `warmup:${lessonId}:${item.id}`;
          if (selected.value === item.answer) {
            correct += 1;
            question.classList.add("correct");
            feedback.textContent = `Doğru. ${item.explanation}`;
            advanceReviewItem(queueId);
          } else {
            question.classList.add("incorrect");
            selected.closest("label")?.classList.add("answer-wrong");
            feedback.textContent = `Tekrar düşün. İpucu: ${item.explanation}`;
            queueReviewItem({
              id: queueId,
              lessonId,
              sectionId: "karma-tekrar",
              topic: item.topic,
              prompt: item.prompt
            });
          }
        });
        summary.textContent = answered < items.length
          ? `${answered}/${items.length} soru cevaplandı; boş kalanları da tamamla.`
          : `${correct}/${items.length} doğru. Yanlışlarını değiştirip yeniden kontrol edebilirsin.`;
        checkButton.textContent = correct === items.length ? "Tekrar tamamlandı ✓" : "Yeniden kontrol et";
      });
    }

    function setupExamplePractice() {
      const sentences = LESSON_EXAMPLE_SENTENCES[lessonId] || [];
      const bottomNav = document.querySelector(".lesson-bottom-nav");
      if (!sentences.length || !form || !bottomNav || document.getElementById("ornek-cumleler")) return;

      const lessonNav = document.querySelector(".lesson-nav");
      if (lessonNav && !lessonNav.querySelector('a[href="#ornek-cumleler"]')) {
        const link = document.createElement("a");
        link.href = "#ornek-cumleler";
        link.textContent = "Örnek cümleler";
        lessonNav.appendChild(link);
      }

      const section = document.createElement("section");
      section.className = "lesson-section example-practice";
      section.id = "ornek-cumleler";
      const header = document.createElement("div");
      header.className = "example-practice__header";
      const copy = document.createElement("div");
      copy.innerHTML = `<p class="section-kicker">Ders sonrası pekiştirme</p><h2>Okuma ve kelime haznesi örnekleri</h2><p>Her cümleyi önce dinle, ardından sesli oku ve Türkçesini kapatarak anlamını hatırlamaya çalış. Bu bölüm yazdırıldığında en az bir A4 çalışma sayfası oluşturacak biçimde düzenlenir.</p>`;
      const printButton = createPrintButton("Dersi yazdır");
      header.append(copy, printButton);
      const legend = buildWordMapLegend();
      if (legend) copy.appendChild(legend);

      const grid = document.createElement("div");
      grid.className = "practice-sentence-grid";
      sentences.forEach((sentence, index) => {
        const card = document.createElement("article");
        card.className = "practice-sentence";
        const number = document.createElement("span");
        number.className = "practice-sentence__number";
        number.textContent = String(index + 1).padStart(2, "0");
        const arabic = document.createElement("p");
        arabic.className = "arabic practice-sentence__arabic";
        arabic.lang = "ar";
        arabic.dir = "rtl";
        arabic.textContent = sentence.ar;
        const translation = document.createElement("p");
        translation.className = "practice-sentence__translation";
        translation.textContent = sentence.tr;
        card.append(number, arabic, translation);
        const wordMap = buildWordMap(sentence.ar);
        if (wordMap) card.appendChild(wordMap);
        grid.appendChild(card);
      });

      section.append(header, grid);
      bottomNav.insertAdjacentElement("beforebegin", section);
    }

    function wordMapKey() {
      return `${STORAGE_PREFIX}:word-map`;
    }

    function wordMapEnabled() {
      return localStorage.getItem(wordMapKey()) !== "hidden";
    }

    function buildWordMapLegend() {
      if (!BREAKDOWN_LESSONS.has(lessonId)) return null;

      const wrap = document.createElement("div");
      wrap.className = "word-map-legend";

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "secondary-button word-map-toggle";
      const renderToggle = () => {
        const on = wordMapEnabled();
        document.body.dataset.wordMap = on ? "shown" : "hidden";
        toggle.textContent = on ? "Kelime kelime: Açık" : "Kelime kelime: Kapalı";
        toggle.setAttribute("aria-pressed", String(on));
      };
      toggle.addEventListener("click", () => {
        localStorage.setItem(wordMapKey(), wordMapEnabled() ? "hidden" : "shown");
        renderToggle();
      });
      renderToggle();

      const keys = document.createElement("div");
      keys.className = "word-map-legend__keys";
      Object.entries(WORD_ROLES).forEach(([role, label]) => {
        const item = document.createElement("span");
        item.className = "word-map-legend__item";
        item.dataset.role = role;
        item.textContent = label;
        keys.appendChild(item);
      });

      const hint = document.createElement("p");
      hint.className = "word-map-legend__hint";
      hint.textContent = "Renk kelimenin görevini, altındaki yazı Türkçesini gösterir. Bir kelimeye dokununca dilbilgisi notu açılır.";

      wrap.append(toggle, keys, hint);
      return wrap;
    }

    function buildWordMap(arabicSentence) {
      if (!BREAKDOWN_LESSONS.has(lessonId)) return null;
      const words = SENTENCE_BREAKDOWNS[arabicSentence];
      if (!words || !words.length) return null;

      const wrap = document.createElement("div");
      wrap.className = "word-map";

      const row = document.createElement("div");
      row.className = "word-map__row";
      row.dir = "rtl";
      row.lang = "ar";

      const note = document.createElement("div");
      note.className = "word-map__note";
      note.hidden = true;
      const noteText = document.createElement("p");
      noteText.className = "word-map__note-text";
      const noteSpeak = document.createElement("button");
      noteSpeak.type = "button";
      noteSpeak.className = "flashcard-action flashcard-action--speak word-map__note-speak";
      noteSpeak.title = "Bu kelimeyi sesli oku";
      noteSpeak.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Zm4.2 4a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>';
      note.append(noteText, noteSpeak);

      words.forEach((item) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "word-chip";
        chip.dataset.role = item.r;
        chip.setAttribute("aria-label", `${item.w} — ${item.t}${item.n ? ". " + item.n : ""}`);

        const ar = document.createElement("span");
        ar.className = "word-chip__ar";
        ar.lang = "ar";
        ar.dir = "rtl";
        ar.textContent = item.w;

        const tr = document.createElement("span");
        tr.className = "word-chip__tr";
        tr.lang = "tr";
        tr.dir = "ltr";
        tr.textContent = item.t;

        chip.append(ar, tr);

        chip.addEventListener("click", () => {
          const wasOpen = chip.classList.contains("is-open");
          row.querySelectorAll(".word-chip.is-open").forEach((other) => other.classList.remove("is-open"));
          if (wasOpen) {
            note.hidden = true;
            return;
          }
          chip.classList.add("is-open");
          note.dataset.role = item.r;
          noteText.textContent = "";
          appendMixedArabicText(noteText, item.n ? `${item.w} — ${item.t}. ${item.n}` : `${item.w} — ${item.t}`);
          noteSpeak.setAttribute("aria-label", `${item.w} kelimesini sesli oku`);
          noteSpeak.onclick = (event) => {
            event.stopPropagation();
            speakArabic(item.w, noteSpeak);
          };
          note.hidden = false;
        });

        row.appendChild(chip);
      });

      wrap.append(row, note);
      return wrap;
    }

    function setupPrintControls() {
      const meta = document.querySelector(".lesson-hero__meta");
      if (!meta || meta.querySelector(".print-lesson-button")) return;
      meta.appendChild(createPrintButton("Yoğun çalışma föyü yazdır"));
      buildPrintHandout();
      window.addEventListener("beforeprint", () => body.classList.add("print-compact"));
      window.addEventListener("afterprint", () => body.classList.remove("print-compact"));
    }

    function createPrintButton(label) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "secondary-button print-lesson-button";
      button.textContent = label;
      button.setAttribute("aria-label", "Bu dersin kâğıt tasarruflu, ayrıntılı çalışma föyünü yazdır");
      button.addEventListener("click", () => {
        body.classList.add("print-compact");
        window.print();
      });
      return button;
    }

    // Cevap anahtarini numarali bir izgara olarak kurar. Her cevap kendi hucresinde
    // durdugu icin Arapca ve Latin metin karisiminda siralama bozulmaz.
    function buildAnswerKey(entries) {
      const wrap = document.createElement("div");
      wrap.className = "print-handout__answer-key";
      const title = document.createElement("span");
      title.className = "print-handout__answer-key-title";
      title.textContent = "Cevap anahtarı";
      const list = document.createElement("ol");
      list.className = "print-handout__answer-key-list";
      entries.forEach((entry) => {
        const item = document.createElement("li");
        if (entry.arabic) {
          const arabic = document.createElement("b");
          arabic.className = "arabic";
          arabic.lang = "ar";
          arabic.dir = "rtl";
          arabic.textContent = entry.arabic;
          item.appendChild(arabic);
        } else {
          item.textContent = entry.text || "—";
        }
        list.appendChild(item);
      });
      wrap.append(title, list);
      return wrap;
    }

    function buildPrintHandout() {
      document.querySelector(".print-handout")?.remove();
      const handout = document.createElement("article");
      handout.className = "print-handout";
      handout.setAttribute("aria-hidden", "true");

      const header = document.createElement("header");
      header.className = "print-handout__header";
      const brand = document.createElement("span");
      brand.textContent = "Arapça Öğreniyorum · Yoğun çalışma föyü";
      const title = document.createElement("h1");
      title.textContent = document.querySelector(".lesson-hero h1")?.textContent || LESSON_TITLES[lessonId] || "Arapça dersi";
      const subtitle = document.createElement("p");
      subtitle.textContent = `${body.querySelector(".lesson-index")?.textContent || lessonId} · Konu anlatımı, başvuru tabloları, alıştırmalar ve örnek cümleler`;
      header.append(brand, title, subtitle);

      const overview = document.createElement("section");
      overview.className = "print-handout__overview";
      const goals = document.createElement("div");
      goals.innerHTML = "<h2>Ders hedefleri</h2>";
      const goalList = document.createElement("ul");
      [...document.querySelectorAll(".lesson-hero .goal-list > div")].forEach((goal) => {
        const item = document.createElement("li");
        item.textContent = goal.textContent.replace(/^\s*✓\s*/, "").trim();
        goalList.appendChild(item);
      });
      goals.appendChild(goalList);

      const tidy = (value) => String(value || "").replace(/\s+/g, " ").trim();
      const usedRuleLabels = new Set();
      const rules = document.createElement("div");
      rules.innerHTML = "<h2>Temel kurallar</h2>";
      const ruleList = document.createElement("ul");
      const ruleTexts = [];
      const pushRule = (label, text) => {
        const value = [tidy(label), tidy(text)].filter(Boolean).join(": ");
        if (!value || ruleTexts.includes(value)) return;
        ruleTexts.push(value);
        if (label) usedRuleLabels.add(tidy(label).toLocaleLowerCase("tr"));
      };
      // Önce gerçek kurallar: hatırlatma kutuları ve kalıplar.
      [...document.querySelectorAll(".memory-rule p")].forEach((rule) => pushRule(null, rule.textContent));
      [...document.querySelectorAll(".formula-box")].slice(0, 3).forEach((formula) => pushRule("Kalıp", formula.textContent));
      // Kural sayısı azsa yeni kavramlarla tamamla; bunlar konu özetinde tekrarlanmaz.
      if (ruleTexts.length < 4) {
        [...document.querySelectorAll(".new-concept")].slice(0, 6 - ruleTexts.length).forEach((concept) => {
          pushRule(concept.querySelector(":scope > strong")?.textContent, concept.querySelector(":scope > p:last-child")?.textContent);
        });
      }
      ruleTexts.slice(0, 8).forEach((text) => {
        const item = document.createElement("li");
        appendMixedArabicText(item, text);
        ruleList.appendChild(item);
      });
      rules.appendChild(ruleList);
      overview.append(goals, rules);

      const topicSummary = document.createElement("section");
      topicSummary.className = "print-handout__summary";
      topicSummary.innerHTML = "<h2>Adım adım konu özeti</h2>";
      const summaryGrid = document.createElement("div");
      summaryGrid.className = "print-handout__summary-grid";
      const SUMMARY_SKIP = ".review-warmup, .exercise, .lesson-finish, .example-practice";
      [...document.querySelectorAll(".lesson-content .lesson-section")].forEach((section) => {
        if (section.matches(SUMMARY_SKIP)) return;
        const heading = tidy(section.querySelector(":scope > h2")?.textContent);
        if (!heading) return;

        const intro = tidy([...section.children]
          .find((element) => element.tagName === "P" && !element.classList.contains("section-kicker"))?.textContent);

        const points = [];
        const addPoint = (label, text) => {
          const value = [tidy(label), tidy(text)].filter(Boolean).join(" — ");
          if (value.length > 3 && !points.includes(value)) points.push(value);
        };

        const cardLabels = new Set();
        section.querySelectorAll(".concept-card").forEach((card) => {
          const term = tidy(card.querySelector(".arabic.term, .term")?.textContent);
          const name = tidy(card.querySelector("h3")?.textContent);
          if (name) cardLabels.add(name.toLocaleLowerCase("tr"));
          const description = [...card.querySelectorAll(":scope > p")]
            .filter((paragraph) => !paragraph.classList.contains("arabic"))
            .map((paragraph) => tidy(paragraph.textContent))
            .filter(Boolean)
            .pop();
          const sample = card.querySelector(".arabic-example");
          const sampleText = sample
            ? `örn. ${tidy(sample.querySelector("span")?.textContent)} = ${tidy(sample.querySelector("small")?.textContent)}`
            : "";
          addPoint([name, term].filter(Boolean).join(" "), [description, sampleText].filter(Boolean).join(" "));
        });

        section.querySelectorAll(".new-concept").forEach((concept) => {
          const label = tidy(concept.querySelector(":scope > strong")?.textContent);
          const key = label.toLocaleLowerCase("tr");
          if (cardLabels.has(key) || usedRuleLabels.has(key)) return;
          addPoint(label, concept.querySelector(":scope > p:last-child")?.textContent);
        });

        section.querySelectorAll(".formula-box").forEach((formula) => addPoint("Kalıp", formula.textContent));
        section.querySelectorAll(".memory-rule p").forEach((rule) => {
          const text = tidy(rule.textContent);
          if (!ruleTexts.includes(text)) addPoint("Hatırlatma", text);
        });

        section.querySelectorAll(".sentence-study article").forEach((article) => {
          addPoint(tidy(article.querySelector(".translation")?.textContent), tidy(article.querySelector(".arabic.sentence")?.textContent));
        });

        // Her replik ayri madde: Arapca satirin sonunda kalinca karisik yon sorunu olusmuyor.
        section.querySelectorAll(".dialogue .dialogue__turn").forEach((turn) => {
          const arabic = tidy(turn.querySelector(".arabic")?.textContent);
          if (!arabic) return;
          const role = tidy(turn.querySelector(":scope > span")?.textContent);
          const gloss = tidy(turn.querySelector("small")?.textContent);
          addPoint([role, gloss].filter(Boolean).join(" · "), arabic);
        });

        if (!points.length && intro.length < 90) return;

        const card = document.createElement("article");
        const cardTitle = document.createElement("h3");
        cardTitle.textContent = heading;
        card.appendChild(cardTitle);
        if (intro) {
          const cardText = document.createElement("p");
          appendMixedArabicText(cardText, intro);
          card.appendChild(cardText);
        }
        if (points.length) {
          const list = document.createElement("ul");
          points.slice(0, 8).forEach((point) => {
            const item = document.createElement("li");
            appendMixedArabicText(item, point);
            list.appendChild(item);
          });
          card.appendChild(list);
        }
        summaryGrid.appendChild(card);
      });
      topicSummary.appendChild(summaryGrid);

      const languageBridge = document.createElement("section");
      languageBridge.className = "print-handout__language";
      languageBridge.innerHTML = "<h2>Arapça–Türkçe–İngilizce karşılaştırması</h2>";
      const languageGrid = document.createElement("div");
      languageGrid.className = "print-handout__language-grid";
      [...document.querySelectorAll(".english-bridge")].slice(0, 2).forEach((bridge) => {
        const item = document.createElement("p");
        appendMixedArabicText(item, bridge.querySelector(":scope > p:last-child")?.textContent.trim() || bridge.textContent.trim());
        languageGrid.appendChild(item);
      });
      languageBridge.appendChild(languageGrid);

      const reference = document.createElement("section");
      reference.className = "print-handout__reference";
      reference.innerHTML = "<h2>Başvuru tabloları ve kalıplar</h2>";
      [...document.querySelectorAll(".lesson-content .lesson-section .pronoun-table-wrap, .lesson-content .lesson-section .formula-box, .lesson-content .lesson-section .pronoun-grid")].forEach((source) => {
        const block = document.createElement("div");
        block.className = "print-handout__reference-block";
        const sourceHeading = source.closest(".lesson-section")?.querySelector(":scope > h2")?.textContent.trim();
        if (sourceHeading) {
          const heading = document.createElement("h3");
          heading.textContent = sourceHeading;
          block.appendChild(heading);
        }
        block.appendChild(source.cloneNode(true));
        reference.appendChild(block);
      });

      const vocabulary = document.createElement("section");
      vocabulary.className = "print-handout__vocabulary";
      vocabulary.innerHTML = "<h2>Temel kelimeler</h2>";
      const vocabularyGrid = document.createElement("div");
      vocabularyGrid.className = "print-handout__vocabulary-grid";
      [...document.querySelectorAll(".flashcard")].forEach((card) => {
        const entry = document.createElement("div");
        const arabic = document.createElement("b");
        arabic.className = "arabic mini";
        arabic.lang = "ar";
        arabic.dir = "rtl";
        arabic.textContent = card.querySelector("[lang^='ar'], .arabic")?.textContent.trim() || "";
        const meaning = document.createElement("span");
        meaning.textContent = card.querySelector(".flashcard__answer")?.textContent.trim() || "";
        entry.append(arabic, meaning);
        vocabularyGrid.appendChild(entry);
      });
      vocabulary.appendChild(vocabularyGrid);

      const quiz = document.createElement("section");
      quiz.className = "print-handout__quiz";
      quiz.innerHTML = "<h2>Kısa tekrar</h2><p>Cevapları notlarına bakmadan yaz.</p>";
      const quizList = document.createElement("ol");
      const answerKey = [];
      const questions = [...form.querySelectorAll(".question[data-answer]:not(.review-question)")];
      questions.slice(0, 12).forEach((question) => {
        const item = document.createElement("li");
        const prompt = question.querySelector("legend")?.textContent.replace(/^\s*\d+\s*/, "").trim() || "Soruyu cevapla.";
        appendMixedArabicText(item, prompt);
        item.appendChild(document.createElement("span")).className = "print-handout__answer-line";
        quizList.appendChild(item);
        answerKey.push(answerLabel(question.dataset.answer, question));
      });
      quiz.append(quizList, buildAnswerKey(answerKey.map((answer) => ({ text: answer }))));

      const examples = document.createElement("section");
      examples.className = "print-handout__examples";
      examples.innerHTML = "<h2>Okuma ve kelime haznesi</h2><p>Her cümleyi sesli oku; sonra Türkçeyi kapatarak anlamını söyle.</p>";
      const exampleGrid = document.createElement("div");
      exampleGrid.className = "print-handout__example-grid";
      (LESSON_EXAMPLE_SENTENCES[lessonId] || []).forEach((sentence, index) => {
        const card = document.createElement("div");
        card.className = "print-handout__sentence";
        const number = document.createElement("span");
        number.textContent = String(index + 1).padStart(2, "0");
        const arabic = document.createElement("b");
        arabic.className = "arabic";
        arabic.lang = "ar";
        arabic.dir = "rtl";
        arabic.textContent = sentence.ar;
        const translation = document.createElement("small");
        translation.textContent = sentence.tr;
        card.append(number, arabic, translation);
        exampleGrid.appendChild(card);
      });
      examples.appendChild(exampleGrid);

      const production = document.createElement("section");
      production.className = "print-handout__production";
      production.innerHTML = "<h2>Türkçeden Arapçaya yazma çalışması</h2><p>Önce yukarıdaki örnekleri kapat. Türkçe cümleyi Arapça yazdıktan sonra cevap anahtarıyla karşılaştır.</p>";
      const productionGrid = document.createElement("div");
      productionGrid.className = "print-handout__production-grid";
      const productionAnswers = [];
      (LESSON_EXAMPLE_SENTENCES[lessonId] || []).slice(0, 8).forEach((sentence, index) => {
        const card = document.createElement("div");
        const prompt = document.createElement("p");
        prompt.textContent = `${index + 1}. ${sentence.tr}`;
        const answerLine = document.createElement("span");
        answerLine.className = "print-handout__writing-line";
        card.append(prompt, answerLine);
        productionGrid.appendChild(card);
        productionAnswers.push({ arabic: sentence.ar });
      });
      production.append(productionGrid, buildAnswerKey(productionAnswers));

      const footer = document.createElement("footer");
      footer.textContent = `${body.querySelector(".lesson-index")?.textContent || lessonId} · Tekrar tarihi: ____ / ____ / ______`;
      handout.append(header, overview);
      if (summaryGrid.children.length) handout.appendChild(topicSummary);
      if (languageGrid.children.length) handout.appendChild(languageBridge);
      if (reference.querySelector(".print-handout__reference-block")) handout.appendChild(reference);
      handout.append(vocabulary, quiz, examples, production, footer);
      body.appendChild(handout);
    }

    function setupWritingFeedback() {
      const models = WRITING_MODELS[lessonId] || {};
      const savedAssessments = readJson(writingKey, {});
      Object.entries(models).forEach(([name, model]) => {
        const field = form?.querySelector(`[name="${name}"]`);
        const label = field?.closest(".writing-field");
        if (!field || !label || label.nextElementSibling?.dataset.writingFor === name) return;

        const panel = document.createElement("div");
        panel.className = "writing-review";
        panel.dataset.writingFor = name;
        const reveal = document.createElement("button");
        reveal.type = "button";
        reveal.className = "writing-review__reveal";
        reveal.textContent = "Örnek cevabı göster";
        const answer = document.createElement("div");
        answer.className = "writing-review__answer";
        answer.hidden = true;
        answer.innerHTML = `<span>Örnek cevap</span><p class="arabic" lang="ar" dir="rtl"></p><small></small>`;
        answer.querySelector("p").textContent = model.answer;
        answer.querySelector("small").textContent = model.note;
        const actions = document.createElement("div");
        actions.className = "writing-review__actions";
        actions.hidden = true;
        const correctButton = document.createElement("button");
        correctButton.type = "button";
        correctButton.className = "self-check self-check--correct";
        correctButton.textContent = "Cevabım uygun";
        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.className = "self-check self-check--retry";
        retryButton.textContent = "Tekrar etmeliyim";
        const status = document.createElement("p");
        status.className = "writing-review__status";
        status.setAttribute("aria-live", "polite");
        actions.append(correctButton, retryButton);
        panel.append(reveal, answer, actions, status);
        label.insertAdjacentElement("afterend", panel);

        const queueId = `${lessonId}:write:${name}`;
        const restoreAssessment = savedAssessments[name];
        if (restoreAssessment) {
          answer.hidden = false;
          actions.hidden = false;
          reveal.textContent = "Örnek cevabı gizle";
          panel.classList.add(restoreAssessment === "correct" ? "is-correct" : "needs-review");
          status.textContent = restoreAssessment === "correct" ? "Bu yazılı çalışma uygun olarak işaretlendi." : "Bu yazılı çalışma tekrar listende.";
        }

        reveal.addEventListener("click", () => {
          const willShow = answer.hidden;
          answer.hidden = !willShow;
          actions.hidden = !willShow;
          reveal.textContent = willShow ? "Örnek cevabı gizle" : "Örnek cevabı göster";
        });

        correctButton.addEventListener("click", () => {
          panel.classList.remove("needs-review");
          panel.classList.add("is-correct");
          status.textContent = "Harika; bu çalışma uygun olarak işaretlendi.";
          updateWritingAssessment(name, "correct");
          advanceReviewItem(queueId);
        });

        retryButton.addEventListener("click", () => {
          panel.classList.remove("is-correct");
          panel.classList.add("needs-review");
          status.textContent = "Bu çalışma Bugünkü Tekrarlar listesine eklendi.";
          updateWritingAssessment(name, "retry");
          const section = field.closest(".lesson-section");
          queueReviewItem({
            id: queueId,
            lessonId,
            sectionId: section?.id || "konusma",
            topic: model.topic,
            prompt: field.dataset.reportLabel || label.querySelector("span")?.textContent || "Yazılı cevabı yeniden kur."
          });
          showToast("Yazılı çalışma tekrar listene eklendi.");
        });
      });
    }

    function updateWritingAssessment(name, value) {
      const assessments = readJson(writingKey, {});
      assessments[name] = value;
      localStorage.setItem(writingKey, JSON.stringify(assessments));
    }

    function readJson(key, fallback) {
      try {
        return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
      } catch {
        return fallback;
      }
    }

    function focusRequestedReview() {
      const reviewId = new URLSearchParams(window.location.search).get("review");
      if (!reviewId) return;
      let target = null;
      if (reviewId.startsWith("warmup:")) {
        const itemId = reviewId.split(":").slice(2).join(":");
        target = document.querySelector(`[data-review-id="${CSS.escape(itemId)}"]`);
      } else if (reviewId.includes(":write:")) {
        const name = reviewId.split(":write:")[1];
        target = document.querySelector(`[data-writing-for="${CSS.escape(name)}"]`);
      } else {
        const name = reviewId.split(":").slice(1).join(":");
        target = form?.querySelector(`[name="${CSS.escape(name)}"]`)?.closest(".question");
      }
      if (!target) return;
      target.classList.add("review-focus");
      window.setTimeout(() => target.scrollIntoView({ behavior: "smooth", block: "center" }), 120);
    }

    function setupFlashcards() {
      document.querySelectorAll(".flashcard").forEach((card) => {
        const arabicText = [...card.querySelectorAll("[lang^='ar'], .arabic")]
          .map((element) => element.textContent.trim())
          .filter(Boolean)
          .filter((value, index, list) => list.indexOf(value) === index)
          .join(" ");

        if (!card.parentElement?.classList.contains("flashcard-wrap")) {
          const wrapper = document.createElement("div");
          wrapper.className = "flashcard-wrap";
          card.parentNode.insertBefore(wrapper, card);
          wrapper.appendChild(card);

          const actions = document.createElement("div");
          actions.className = "flashcard-actions";

          const speakButton = document.createElement("button");
          speakButton.type = "button";
          speakButton.className = "flashcard-action flashcard-action--speak";
          speakButton.setAttribute("aria-label", `${arabicText} metnini sesli oku`);
          speakButton.title = "Arapça metni sesli oku";
          speakButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Zm4.2 4a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>';

          const copyButton = document.createElement("button");
          copyButton.type = "button";
          copyButton.className = "flashcard-action flashcard-action--copy";
          copyButton.setAttribute("aria-label", `${arabicText} metnini kopyala`);
          copyButton.title = "Arapça metni kopyala";
          copyButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';

          speakButton.addEventListener("click", () => speakArabic(arabicText, speakButton));
          copyButton.addEventListener("click", () => copyArabicText(arabicText));

          actions.append(speakButton, copyButton);
          wrapper.appendChild(actions);
        }

        card.addEventListener("click", () => {
          const revealed = card.classList.toggle("revealed");
          card.setAttribute("aria-expanded", String(revealed));
        });
      });
    }

    function setupSentenceTools() {
      document.querySelectorAll(".sentence-study article").forEach((sentenceCard) => {
        if (sentenceCard.querySelector(":scope > .sentence-actions")) return;

        const sentenceElement = sentenceCard.querySelector(".arabic.sentence");
        const arabicText = sentenceElement?.textContent.trim();
        if (!arabicText) return;

        const actions = document.createElement("div");
        actions.className = "sentence-actions";

        const speakButton = document.createElement("button");
        speakButton.type = "button";
        speakButton.className = "flashcard-action flashcard-action--speak";
        speakButton.setAttribute("aria-label", `${arabicText} cümlesini sesli oku`);
        speakButton.title = "Cümlenin tamamını sesli oku";
        speakButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Zm4.2 4a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>';

        const copyButton = document.createElement("button");
        copyButton.type = "button";
        copyButton.className = "flashcard-action flashcard-action--copy";
        copyButton.setAttribute("aria-label", `${arabicText} cümlesini kopyala`);
        copyButton.title = "Cümlenin tamamını kopyala";
        copyButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';

        speakButton.addEventListener("click", () => speakArabic(arabicText, speakButton));
        copyButton.addEventListener("click", () => copyArabicText(arabicText));

        actions.append(speakButton, copyButton);
        sentenceCard.prepend(actions);
      });
    }

    function setupPageProgress() {
      const progressBar = document.getElementById("page-progress");
      if (!progressBar) return;

      const update = () => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percent = scrollable > 0 ? Math.min(100, (window.scrollY / scrollable) * 100) : 0;
        progressBar.style.width = `${percent}%`;
      };

      document.addEventListener("scroll", update, { passive: true });
      update();
    }

    function setupLessonNavigation() {
      const links = [...document.querySelectorAll(".lesson-nav a[href^='#']")];
      const sections = links
        .map((link) => ({ link, section: document.querySelector(link.getAttribute("href")) }))
        .filter((item) => item.section);
      if (!sections.length) return;

      let ticking = false;
      const update = () => {
        const topbarHeight = document.querySelector(".topbar")?.offsetHeight || 72;
        const marker = topbarHeight + 56;
        let active = sections[0];

        sections.forEach((item) => {
          if (item.section.getBoundingClientRect().top <= marker) active = item;
        });

        sections.forEach((item) => {
          const isActive = item === active;
          item.link.classList.toggle("is-active", isActive);
          if (isActive) item.link.setAttribute("aria-current", "location");
          else item.link.removeAttribute("aria-current");
        });
        ticking = false;
      };

      const requestUpdate = () => {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      };

      document.addEventListener("scroll", requestUpdate, { passive: true });
      window.addEventListener("resize", requestUpdate, { passive: true });
      update();
    }

    function collectForm() {
      const values = {};
      if (!form) return values;

      const elements = [...form.elements].filter((element) => element.name);
      const names = [...new Set(elements.map((element) => element.name))];

      names.forEach((name) => {
        const group = elements.filter((element) => element.name === name);
        const first = group[0];

        if (first.type === "radio") {
          values[name] = group.find((element) => element.checked)?.value || "";
        } else if (first.type === "checkbox") {
          values[name] = group.filter((element) => element.checked).map((element) => element.value);
        } else {
          values[name] = first.value;
        }
      });

      return values;
    }

    function saveForm() {
      localStorage.setItem(answersKey, JSON.stringify(collectForm()));
    }

    function restoreForm() {
      let saved = {};
      try {
        saved = JSON.parse(localStorage.getItem(answersKey) || "{}");
      } catch {
        saved = {};
      }

      if (form) {
        [...form.elements].forEach((element) => {
          if (!element.name || !(element.name in saved)) return;
          const value = saved[element.name];

          if (element.type === "radio") {
            element.checked = element.value === value;
          } else if (element.type === "checkbox") {
            element.checked = Array.isArray(value) && value.includes(element.value);
          } else {
            element.value = value;
          }
        });
      }

      const savedScore = localStorage.getItem(scoreKey);
      if (savedScore) {
        lastScore = readJson(scoreKey, null);
        if (lastScore) renderResult(lastScore.correct, lastScore.total, false, lastScore.topicStats || {});
      }
    }

    function checkAnswers() {
      const questions = [...document.querySelectorAll(".question[data-answer]")];
      let correct = 0;
      let total = 0;
      let firstIssue = null;
      const topicStats = {};

      questions.forEach((question) => {
        if (question.classList.contains("review-question")) return;
        const expected = question.dataset.answer;
        const points = Number(question.dataset.points || 1);
        const selectedInput = question.querySelector("input:checked");
        const selected = selectedInput?.value || "";
        const feedback = question.querySelector(".feedback");
        const section = question.closest(".lesson-section");
        const sectionId = section?.id || "alistirma";
        const topic = section?.querySelector("h2")?.textContent.trim() || "Ders alıştırmaları";
        const queueId = `${lessonId}:${question.querySelector("input[name]")?.name || sectionId}`;
        total += points;
        topicStats[topic] ||= { correct: 0, total: 0 };
        topicStats[topic].total += points;
        question.classList.remove("correct", "incorrect");
        question.querySelectorAll(".choice-row label").forEach((label) => {
          label.classList.remove("answer-correct", "answer-wrong");
        });

        const expectedInput = [...question.querySelectorAll("input")]
          .find((input) => input.value === expected);
        expectedInput?.closest("label")?.classList.add("answer-correct");

        if (!selected) {
          question.classList.add("incorrect");
          question.setAttribute("aria-invalid", "true");
          feedback.textContent = `İşaretlenmedi. İpucu: ${questionGuidance(question)}`;
          if (!firstIssue) firstIssue = question;
          return;
        }

        if (selected === expected) {
          correct += points;
          topicStats[topic].correct += points;
          question.classList.add("correct");
          question.setAttribute("aria-invalid", "false");
          feedback.textContent = `Doğru. ${questionGuidance(question)}`;
          advanceReviewItem(queueId);
        } else {
          question.classList.add("incorrect");
          question.setAttribute("aria-invalid", "true");
          selectedInput.closest("label")?.classList.add("answer-wrong");
          feedback.textContent = `Yanlış seçim. Doğru cevap: ${answerLabel(expected, question)}. ${questionGuidance(question)}`;
          queueQuestionForReview(question, queueId, topic, sectionId);
          if (!firstIssue) firstIssue = question;
        }
      });

      lastScore = { correct, total, topicStats, checkedAt: new Date().toISOString() };
      localStorage.setItem(scoreKey, JSON.stringify(lastScore));
      saveForm();
      renderResult(correct, total, !firstIssue, topicStats);

      if (firstIssue) {
        firstIssue.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    function questionGuidance(question) {
      const sectionId = question.closest(".lesson-section")?.id || "";
      return question.dataset.explanation || TOPIC_GUIDANCE[`${lessonId}:${sectionId}`] || "Konu anlatımındaki örneği yeniden inceleyip biçim ve anlamı birlikte karşılaştır.";
    }

    function queueQuestionForReview(question, queueId, topic, sectionId) {
      const legend = question.querySelector("legend")?.textContent.replace(/^\s*\d+\s*/, "").trim();
      queueReviewItem({
        id: queueId,
        lessonId,
        sectionId,
        topic,
        prompt: legend || `${topic} sorusunu yeniden çöz.`
      });
    }

    function retryWrongAnswers() {
      const wrongQuestions = [...document.querySelectorAll(".question.incorrect:not(.review-question)")];
      if (!wrongQuestions.length) return;
      wrongQuestions.forEach((question) => {
        question.querySelectorAll("input[type='radio']").forEach((input) => { input.checked = false; });
        question.classList.remove("incorrect", "correct");
        question.removeAttribute("aria-invalid");
        question.querySelectorAll(".choice-row label").forEach((label) => label.classList.remove("answer-correct", "answer-wrong"));
        const feedback = question.querySelector(".feedback");
        if (feedback) feedback.textContent = "Şimdi notlarına bakmadan yeniden cevapla.";
      });
      saveForm();
      wrongQuestions[0].scrollIntoView({ behavior: "smooth", block: "center" });
      showToast(`${wrongQuestions.length} soru yeniden denemeye hazır.`);
    }

    function clearQuestionResult(target) {
      const question = target?.closest?.(".question[data-answer]");
      if (!question || (!question.classList.contains("correct") && !question.classList.contains("incorrect"))) return;

      question.classList.remove("correct", "incorrect");
      question.removeAttribute("aria-invalid");
      question.querySelectorAll(".choice-row label").forEach((label) => {
        label.classList.remove("answer-correct", "answer-wrong");
      });
      const feedback = question.querySelector(".feedback");
      if (feedback) feedback.textContent = "Seçimin değişti. Yeniden kontrol edebilirsin.";
    }

    function answerLabel(value, question) {
      const labels = {
        isim: "İsim",
        fiil: "Fiil",
        harf: "Harf",
        kitap: "Kitap",
        ev: "Ev",
        okuyor: "Okuyor / okur",
        içinde: "İçinde / -de",
        fî: "فِي"
      };
      return question?.dataset.answerLabel || labels[value] || value;
    }

    function renderResult(correct, total, scrollToResult, topicStats = {}) {
      const resultCard = document.getElementById("result-card");
      const scoreNumber = document.getElementById("score-number");
      const title = document.getElementById("result-title");
      const message = document.getElementById("result-message");
      const copyButton = document.getElementById("copy-report");
      const ratio = total ? correct / total : 0;

      if (!resultCard || !scoreNumber || !title || !message) return;

      resultCard.hidden = false;
      scoreNumber.textContent = `${correct}/${total}`;
      copyButton.disabled = false;

      const topics = Object.entries(topicStats || {}).map(([name, stats]) => ({
        name,
        correct: Number(stats.correct || 0),
        total: Number(stats.total || 0),
        ratio: stats.total ? Number(stats.correct || 0) / Number(stats.total) : 0
      }));
      const strongTopics = topics.filter((topic) => topic.ratio >= 0.8).map((topic) => topic.name);
      const weakTopics = topics.filter((topic) => topic.ratio < 0.8).sort((a, b) => a.ratio - b.ratio).map((topic) => topic.name);

      if (ratio >= 0.85) {
        title.textContent = "Temel ayrım yerleşmiş görünüyor";
        message.textContent = weakTopics.length
          ? `Güçlü olduğun bölüm: ${strongTopics.join(", ") || "genel ders"}. Kısa tekrar önerisi: ${weakTopics.join(", ")}.`
          : `Bütün ölçülen konularda güçlü görünüyorsun${strongTopics.length ? `: ${strongTopics.join(", ")}` : ""}.`;
      } else if (ratio >= 0.6) {
        title.textContent = "İyi bir başlangıç";
        message.textContent = `Önce şu bölümleri yeniden dene: ${weakTopics.join(", ") || "yanlış işaretlenen sorular"}.`;
      } else {
        title.textContent = "Bu konuya biraz daha zaman ayıralım";
        message.textContent = `Öncelikli tekrar alanların: ${weakTopics.join(", ") || "ders alıştırmaları"}. Yanlışlar tekrar listene eklendi.`;
      }

      let resultActions = resultCard.querySelector(".result-card__actions");
      if (!resultActions) {
        resultActions = document.createElement("div");
        resultActions.className = "result-card__actions";
        resultCard.querySelector(":scope > div:last-child")?.appendChild(resultActions);
      }
      resultActions.replaceChildren();

      if (correct < total) {
        const retryButton = document.createElement("button");
        retryButton.type = "button";
        retryButton.className = "secondary-button";
        retryButton.textContent = "Yanlışları yeniden dene";
        retryButton.addEventListener("click", retryWrongAnswers);
        resultActions.appendChild(retryButton);
      }

      const nextLessonLink = document.querySelector(".lesson-bottom-nav a.primary-button");
      if (nextLessonLink) {
        const nextLink = nextLessonLink.cloneNode(true);
        nextLink.classList.add("result-next-link");
        resultActions.appendChild(nextLink);
      }

      if (scrollToResult) {
        resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }

    async function copyReport() {
      const answers = collectForm();
      const questionNames = [...new Set(
        [...document.querySelectorAll(".question[data-answer] input[name]")].map((input) => input.name)
      )];
      const score = lastScore || { correct: "kontrol edilmedi", total: questionNames.length };
      const reportTitle = body.dataset.lessonTitle || "Arapça Ders Sonucu";
      const writtenAnswers = [...document.querySelectorAll("textarea[name], input[type='text'][name]")]
        .map((field) => `${field.dataset.reportLabel || field.name}: ${field.value || "boş"}`);
      const writingAssessments = readJson(writingKey, {});
      const writingAssessmentLines = Object.entries(writingAssessments).map(([name, value]) => {
        const field = form?.querySelector(`[name="${name}"]`);
        return `${field?.dataset.reportLabel || name}: ${value === "correct" ? "uygun" : "tekrar edilmeli"}`;
      });
      const report = [
        reportTitle.toLocaleUpperCase("tr-TR"),
        `Puan: ${score.correct}/${score.total}`,
        "",
        "Seçimler:",
        ...questionNames.map((name, index) => `${index + 1}. ${answers[name] || "boş"}`),
        "",
        "Yazılı cevaplar:",
        ...(writtenAnswers.length ? writtenAnswers : ["Yok"]),
        "",
        "Yazılı cevap öz değerlendirmesi:",
        ...(writingAssessmentLines.length ? writingAssessmentLines : ["Henüz yapılmadı"]),
        "",
        `Sesli tekrar yapıldı: ${answers.speaking_read_aloud?.length ? "evet" : "hayır"}`,
        `Ders tamamlandı: ${answers.lesson_complete?.length ? "evet" : "hayır"}`
      ].join("\n");

      try {
        await navigator.clipboard.writeText(report);
        showToast("Ders sonucu kopyalandı. ChatGPT konuşmasına yapıştırabilirsin.");
      } catch {
        const helper = document.createElement("textarea");
        helper.value = report;
        helper.setAttribute("readonly", "");
        helper.style.position = "fixed";
        helper.style.opacity = "0";
        document.body.appendChild(helper);
        helper.select();
        document.execCommand("copy");
        helper.remove();
        showToast("Ders sonucu kopyalandı. ChatGPT konuşmasına yapıştırabilirsin.");
      }
    }

    function resetLesson() {
      const confirmed = window.confirm("Bu dersteki bütün cevapların ve puanın silinsin mi?");
      if (!confirmed) return;

      localStorage.removeItem(answersKey);
      localStorage.removeItem(scoreKey);
      localStorage.removeItem(completeKey);
      localStorage.removeItem(warmupKey);
      localStorage.removeItem(writingKey);
      removeLessonReviewItems(lessonId);
      form?.reset();
      document.querySelectorAll(".review-question input").forEach((input) => { input.checked = false; });
      document.querySelectorAll(".review-question").forEach((question) => {
        question.classList.remove("correct", "incorrect");
        question.querySelectorAll("label").forEach((label) => label.classList.remove("answer-correct", "answer-wrong"));
        const feedback = question.querySelector(".feedback");
        if (feedback) feedback.textContent = "";
      });
      document.querySelectorAll(".writing-review").forEach((panel) => {
        panel.classList.remove("is-correct", "needs-review");
        const status = panel.querySelector(".writing-review__status");
        if (status) status.textContent = "";
      });
      document.querySelectorAll(".question").forEach((question) => {
        question.classList.remove("correct", "incorrect");
        question.removeAttribute("aria-invalid");
        question.querySelectorAll(".choice-row label").forEach((label) => {
          label.classList.remove("answer-correct", "answer-wrong");
        });
        const feedback = question.querySelector(".feedback");
        if (feedback) feedback.textContent = "";
      });

      const resultCard = document.getElementById("result-card");
      const copyButton = document.getElementById("copy-report");
      if (resultCard) resultCard.hidden = true;
      if (copyButton) copyButton.disabled = true;
      lastScore = null;
      showToast("Ders cevapları sıfırlandı.");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  // Cumle cozumlerinden kelime sozlugu: ders govdesindeki hazir
  // .word-breakdown bloklarini ayni renk sistemine baglamak icin kullanilir.
  var wordIndexCache = null;

  function normalizeArabicWord(text) {
    return String(text || "")
      .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, "")
      .replace(/[\u0622\u0623\u0625]/g, "\u0627")
      .replace(/[^\u0600-\u06FF]/g, "")
      .trim();
  }

  function getWordIndex() {
    if (wordIndexCache) return wordIndexCache;
    wordIndexCache = new Map();
    Object.values(SENTENCE_BREAKDOWNS).forEach((words) => {
      words.forEach((item) => {
        const key = normalizeArabicWord(item.w);
        if (!key) return;
        let entry = wordIndexCache.get(key);
        if (!entry) {
          entry = { role: item.r, notes: new Set(), glosses: new Set(), word: item.w };
          wordIndexCache.set(key, entry);
        }
        if (entry.role !== item.r) entry.role = null;
        if (item.n) entry.notes.add(item.n);
        if (item.t) entry.glosses.add(item.t);
      });
    });
    return wordIndexCache;
  }

  function colorizeLessonWordBreakdowns() {
    const index = getWordIndex();
    document.querySelectorAll(".word-breakdown > span").forEach((cell) => {
      if (cell.dataset.role) return;
      const arabic = cell.querySelector(".arabic");
      const raw = (arabic?.textContent || "").trim();
      const extra = WORD_EXTRAS[raw];
      const entry = extra
        ? { role: extra.r, notes: new Set(extra.n ? [extra.n] : []), glosses: new Set([extra.t]), word: raw }
        : index.get(normalizeArabicWord(raw));
      if (!entry || !entry.role) return;
      cell.dataset.role = entry.role;
      if (entry.notes.size !== 1) return;

      const note = [...entry.notes][0];
      cell.classList.add("has-note");
      cell.setAttribute("role", "button");
      cell.setAttribute("tabindex", "0");
      cell.title = note;
      const open = () => {
        const parent = cell.parentElement;
        let line = parent.querySelector(":scope > .word-breakdown__note");
        const already = cell.classList.contains("is-open");
        parent.querySelectorAll(":scope > span.is-open").forEach((other) => other.classList.remove("is-open"));
        if (already) {
          if (line) line.hidden = true;
          return;
        }
        if (!line) {
          line = document.createElement("p");
          line.className = "word-breakdown__note";
          parent.appendChild(line);
        }
        cell.classList.add("is-open");
        line.dataset.role = entry.role;
        line.textContent = "";
        appendMixedArabicText(line, `${entry.word} — ${[...entry.glosses][0]}. ${note}`);
        line.hidden = false;
      };
      cell.addEventListener("click", open);
      cell.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        open();
      });
    });
  }

  // --- Fiil tablolarinda sahis isaretlerini boyama ---
  function arabicClusters(text) {
    const mark = /[\u064B-\u0655\u0670]/;
    const out = [];
    for (const ch of String(text || "")) {
      if (mark.test(ch) && out.length) out[out.length - 1] += ch;
      else out.push(ch);
    }
    return out;
  }

  function paintVerbCell(cell, mode) {
    if (!cell || cell.dataset.verbMarked === "true") return;
    const raw = cell.textContent.trim();
    if (!raw) return;
    const parts = arabicClusters(raw);
    if (parts.length < 2) return;

    let headCount = 0;
    let tailCount = 0;

    if (mode === "muzari-prefix") {
      if (!/^[\u064A\u062A\u0623\u0622\u0646\u0627]/.test(parts[0])) return;
      headCount = 1;
    } else if (mode === "mazi-suffix") {
      if (!/^\u062A/.test(parts[parts.length - 1])) return;
      tailCount = 1;
    } else if (mode === "template-mazi") {
      // Sablon tablosunda kok her zaman ك-ت-ب: ilk uc harften sonrasi sahis ekidir.
      if (parts.length <= 3) return;
      tailCount = parts.length - 3;
    } else if (mode === "template-muzari") {
      if (parts.length <= 4) {
        headCount = 1;
      } else {
        headCount = 1;
        tailCount = parts.length - 4;
      }
    } else {
      return;
    }

    cell.textContent = "";
    const frag = document.createDocumentFragment();
    parts.forEach((part, index) => {
      const isMark = index < headCount || index >= parts.length - tailCount;
      if (isMark) {
        const span = document.createElement("span");
        span.className = "verb-mark";
        span.textContent = part;
        frag.appendChild(span);
      } else {
        frag.appendChild(document.createTextNode(part));
      }
    });
    cell.appendChild(frag);
    cell.dataset.verbMarked = "true";
  }

  function paintVerbTables() {
    document.querySelectorAll(".conjugation-template tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td");
      if (cells.length < 4) return;
      cells[2].dataset.tense = "mazi";
      cells[3].dataset.tense = "muzari";
      paintVerbCell(cells[2], "template-mazi");
      paintVerbCell(cells[3], "template-muzari");
    });

    const modes = ["", "muzari-prefix", "mazi-suffix", "muzari-prefix"];
    const tenses = ["mazi", "muzari", "mazi", "muzari"];

    document.querySelectorAll(".verb-table tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td.arabic-cell");
      if (cells.length < 4) return;
      cells.forEach((cell, index) => {
        cell.dataset.tense = tenses[index];
        if (modes[index]) paintVerbCell(cell, modes[index]);
      });
    });

    // Yazdirma izgarasi ayri bir DOM olarak uretiliyor; o da isaretlenmeli.
    document.querySelectorAll(".verb-print-grid tbody tr").forEach((row) => {
      const cells = row.querySelectorAll("td.pr-ar");
      if (cells.length < 4) return;
      cells.forEach((cell, index) => {
        cell.dataset.tense = tenses[index];
        if (modes[index]) paintVerbCell(cell, modes[index]);
      });
    });
  }

  function buildVerbLegend() {
    if (document.querySelector(".verb-legend")) return null;
    const legend = document.createElement("div");
    legend.className = "verb-legend";
    legend.innerHTML = '<span class="verb-legend__item" data-tense="mazi">Mâzi · geçmiş</span>'
      + '<span class="verb-legend__item" data-tense="muzari">Muzari · şimdiki/geniş</span>'
      + '<span class="verb-legend__item verb-legend__item--mark">Şahıs işareti</span>'
      + '<p class="verb-legend__hint">Fiiller kırmızı, şahsı belirleyen ek veya ön harf pembedir. Muzari sütunları noktalı çizgiyle işaretlidir: şahsı gösteren harf kelimenin <strong>başında</strong>, mâzide ise <strong>sonundadır</strong>.</p>';
    return legend;
  }

  function setupVerbTables() {
    if (!document.querySelector(".verb-table, .conjugation-template")) return;

    const template = document.querySelector(".conjugation-template");
    const workspace = document.querySelector(".verb-toolbar");
    const legend = buildVerbLegend();
    if (legend) {
      const anchor = template?.closest(".table-scroll") || workspace;
      anchor?.insertAdjacentElement("beforebegin", legend);
    }
    if (workspace) {
      const second = buildVerbLegendClone();
      if (second) workspace.insertAdjacentElement("afterend", second);
    }

    paintVerbTables();

    if ("MutationObserver" in window) {
      [document.getElementById("verb-rows"), document.getElementById("verb-print-grid")]
        .filter(Boolean)
        .forEach((node) => {
          new MutationObserver(() => paintVerbTables()).observe(node, { childList: true, subtree: true });
        });
    }
  }

  function buildVerbLegendClone() {
    const first = document.querySelector(".verb-legend");
    if (!first) return null;
    const clone = first.cloneNode(true);
    clone.classList.add("verb-legend--repeat");
    return clone;
  }

  // --- Sahis zamirleri izgarasi (gelenekse sarf duzeni) ---


  function buildPronounGrid() {
    const PRONOUN_GRID_ROWS = [
      {
        person: "3. şahıs", term: "Gâib", termNote: "Hakkında konuşulan · eril", gender: "eril",
        cells: [
          { ar: "هُمْ", tr: "onlar", lat: "hüm", form: "Çoğul" },
          { ar: "هُمَا", tr: "o ikisi", lat: "hümâ", form: "İkil" },
          { ar: "هُوَ", tr: "o", lat: "hüve", form: "Tekil" }
        ]
      },
      {
        person: "3. şahıs", term: "Gâibe", termNote: "Hakkında konuşulan · dişil", gender: "disil",
        cells: [
          { ar: "هُنَّ", tr: "onlar", lat: "hünne", form: "Çoğul" },
          { ar: "هُمَا", tr: "o ikisi", lat: "hümâ", form: "İkil" },
          { ar: "هِيَ", tr: "o", lat: "hiye", form: "Tekil" }
        ]
      },
      {
        person: "2. şahıs", term: "Muhâtab", termNote: "Karşımızdaki · eril", gender: "eril",
        cells: [
          { ar: "أَنْتُمْ", tr: "siz", lat: "entüm", form: "Çoğul" },
          { ar: "أَنْتُمَا", tr: "siz ikiniz", lat: "entümâ", form: "İkil" },
          { ar: "أَنْتَ", tr: "sen", lat: "ente", form: "Tekil" }
        ]
      },
      {
        person: "2. şahıs", term: "Muhâtaba", termNote: "Karşımızdaki · dişil", gender: "disil",
        cells: [
          { ar: "أَنْتُنَّ", tr: "siz", lat: "entünne", form: "Çoğul" },
          { ar: "أَنْتُمَا", tr: "siz ikiniz", lat: "entümâ", form: "İkil" },
          { ar: "أَنْتِ", tr: "sen", lat: "enti", form: "Tekil" }
        ]
      },
      {
        person: "1. şahıs", term: "Mütekellim", termNote: "Konuşan · ortak", gender: "ortak",
        cells: [
          { ar: "نَحْنُ", tr: "biz", lat: "nahnu", form: "İkil ve çoğul", span: 2 },
          { ar: "أَنَا", tr: "ben", lat: "ene", form: "Tekil" }
        ]
      }
    ];

    const grid = document.createElement("div");
    grid.className = "pronoun-grid";

    ["Çoğul", "İkil", "Tekil"].forEach((label, index) => {
      const head = document.createElement("div");
      head.className = "pronoun-grid__head";
      head.innerHTML = `<strong>${label}</strong><small>${["Cemi", "Müsennâ", "Müfred"][index]}</small>`;
      grid.appendChild(head);
    });
    const headSpacer = document.createElement("div");
    headSpacer.className = "pronoun-grid__head pronoun-grid__head--empty";
    grid.appendChild(headSpacer);

    const FORM_KEYS = {
      "Tekil": "tekil",
      "İkil": "ikil",
      "Çoğul": "cogul",
      "İkil ve çoğul": "ikilvecogul"
    };
    const slug = (value) => FORM_KEYS[value] || "tekil";

    PRONOUN_GRID_ROWS.forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "pronoun-row";
      rowEl.dataset.gender = row.gender;

      row.cells.forEach((cell) => {
        const box = document.createElement("button");
        box.type = "button";
        box.className = "pronoun-cell";
        box.dataset.gender = row.gender;
        box.dataset.form = slug(cell.form);
        if (cell.span) box.classList.add("pronoun-cell--wide");
        box.setAttribute("aria-label", `${cell.ar} — ${cell.tr}, ${row.term}, ${cell.form}. Sesli oku.`);
        box.innerHTML = `<span class="pronoun-cell__form">${cell.form}</span>`
          + `<span class="pronoun-cell__ar" lang="ar" dir="rtl">${cell.ar}</span>`
          + `<span class="pronoun-cell__lat">${cell.lat}</span>`
          + `<span class="pronoun-cell__tr">${cell.tr}</span>`;
        box.addEventListener("click", () => speakArabic(cell.ar, box));
        rowEl.appendChild(box);
      });

      const label = document.createElement("div");
      label.className = "pronoun-grid__label";
      label.dataset.gender = row.gender;
      label.innerHTML = `<strong>${row.term}</strong><small>${row.termNote}</small><span class="pronoun-grid__person">${row.person}</span>`;
      rowEl.appendChild(label);
      grid.appendChild(rowEl);
    });

    return grid;
  }

  function setupPronounGrid() {
    document.querySelectorAll("[data-pronoun-grid]").forEach((host) => {
      if (host.dataset.pronounGridReady === "true") return;
      host.dataset.pronounGridReady = "true";
      host.appendChild(buildPronounGrid());

      const legend = document.createElement("p");
      legend.className = "pronoun-grid__legend";
      legend.textContent = "Mavi satırlar eril, pembe satırlar dişil biçimleri gösterir. Sağdaki adlar geleneksel sarf terimleridir: gâib “hakkında konuşulan”, muhâtab “karşımızdaki”, mütekellim “konuşan”. Bir kutuya dokununca zamir sesli okunur.";
      host.appendChild(legend);
    });
  }

  // --- Fiil cekim izgarasi ---
  // Salim (kuvvetli) uc harfli fiiller icin cekim, verilen 3. tekil eril
  // bicimden uretiliyor. Zayif harfli fiiller listeye alinmaz.
  function arabicMarkRe() {
    return /[\u064B-\u0652\u0670]/;
  }

  function splitArabicClusters(text) {
    const mark = arabicMarkRe();
    const out = [];
    for (const ch of String(text || "")) {
      if (mark.test(ch) && out.length) out[out.length - 1] += ch;
      else out.push(ch);
    }
    return out;
  }

  function withLastVowel(word, vowel) {
    const parts = splitArabicClusters(word);
    if (!parts.length) return word;
    const last = parts[parts.length - 1];
    const base = last[0];
    parts[parts.length - 1] = base + vowel;
    return parts.join("");
  }

  const FATHA = "\u064E";
  const DAMMA = "\u064F";
  const KESRA = "\u0650";
  const SUKUN = "\u0652";

  function conjugateMazi(mazi3ms) {
    const open = withLastVowel(mazi3ms, FATHA);
    const closed = withLastVowel(mazi3ms, SUKUN);
    const damma = withLastVowel(mazi3ms, DAMMA);
    return {
      hu: open,
      huma_m: open + "\u0627",
      hum: damma + "\u0648\u0627",
      hiya: open + "\u062A\u0652",
      huma_f: open + "\u062A" + FATHA + "\u0627",
      hunna: closed + "\u0646" + FATHA,
      ente: closed + "\u062A" + FATHA,
      entuma: closed + "\u062A" + DAMMA + "\u0645" + FATHA + "\u0627",
      entum: closed + "\u062A" + DAMMA + "\u0645" + SUKUN,
      enti: closed + "\u062A" + KESRA,
      entunne: closed + "\u062A" + DAMMA + "\u0646" + "\u0651" + FATHA,
      ene: closed + "\u062A" + DAMMA,
      nahnu: closed + "\u0646" + FATHA + "\u0627"
    };
  }

  function conjugateMuzari(muzari3ms, muzari1s) {
    const parts = splitArabicClusters(muzari3ms);
    if (parts.length < 2) return null;
    const prefixMarks = parts[0].slice(1);
    const body = parts.slice(1).join("");
    const ta = "\u062A" + prefixMarks;
    const ya = "\u064A" + prefixMarks;
    const nun = "\u0646" + prefixMarks;
    const bodyD = withLastVowel(body, DAMMA);
    const bodyF = withLastVowel(body, FATHA);
    const bodyK = withLastVowel(body, KESRA);
    const bodyS = withLastVowel(body, SUKUN);
    const dual = bodyF + "\u0627\u0646" + KESRA;
    const plural = bodyD + "\u0648\u0646" + FATHA;
    const femSing = bodyK + "\u064A\u0646" + FATHA;
    const femPlural = bodyS + "\u0646" + FATHA;
    return {
      hu: ya + bodyD,
      huma_m: ya + dual,
      hum: ya + plural,
      hiya: ta + bodyD,
      huma_f: ta + dual,
      hunna: ya + femPlural,
      ente: ta + bodyD,
      entuma: ta + dual,
      entum: ta + plural,
      enti: ta + femSing,
      entunne: ta + femPlural,
      ene: muzari1s,
      nahnu: nun + bodyD
    };
  }

  function conjugationRows(forms) {
    const PERSON_LABELS = {
      hu: "o", huma: "o ikisi", hum: "onlar",
      hiya: "o (kadın)", hunna: "onlar (kadınlar)",
      ente: "sen", entuma: "siz ikiniz", entum: "siz",
      enti: "sen (kadın)", entunne: "siz (kadınlar)",
      ene: "ben", nahnu: "biz"
    };
    const tr = (key) => PERSON_LABELS[key];
    return [
      { person: "3. şahıs", term: "Gâib", termNote: "Hakkında konuşulan · eril", gender: "eril",
        cells: [
          { ar: forms.hum, pron: "هُمْ", tr: tr("hum"), form: "Çoğul" },
          { ar: forms.huma_m, pron: "هُمَا", tr: tr("huma"), form: "İkil" },
          { ar: forms.hu, pron: "هُوَ", tr: tr("hu"), form: "Tekil" }
        ] },
      { person: "3. şahıs", term: "Gâibe", termNote: "Hakkında konuşulan · dişil", gender: "disil",
        cells: [
          { ar: forms.hunna, pron: "هُنَّ", tr: tr("hunna"), form: "Çoğul" },
          { ar: forms.huma_f, pron: "هُمَا", tr: tr("huma"), form: "İkil" },
          { ar: forms.hiya, pron: "هِيَ", tr: tr("hiya"), form: "Tekil" }
        ] },
      { person: "2. şahıs", term: "Muhâtab", termNote: "Karşımızdaki · eril", gender: "eril",
        cells: [
          { ar: forms.entum, pron: "أَنْتُمْ", tr: tr("entum"), form: "Çoğul" },
          { ar: forms.entuma, pron: "أَنْتُمَا", tr: tr("entuma"), form: "İkil" },
          { ar: forms.ente, pron: "أَنْتَ", tr: tr("ente"), form: "Tekil" }
        ] },
      { person: "2. şahıs", term: "Muhâtaba", termNote: "Karşımızdaki · dişil", gender: "disil",
        cells: [
          { ar: forms.entunne, pron: "أَنْتُنَّ", tr: tr("entunne"), form: "Çoğul" },
          { ar: forms.entuma, pron: "أَنْتُمَا", tr: tr("entuma"), form: "İkil" },
          { ar: forms.enti, pron: "أَنْتِ", tr: tr("enti"), form: "Tekil" }
        ] },
      { person: "1. şahıs", term: "Mütekellim", termNote: "Konuşan · ortak", gender: "ortak",
        cells: [
          { ar: forms.nahnu, pron: "نَحْنُ", tr: tr("nahnu"), form: "İkil ve çoğul", span: 2 },
          { ar: forms.ene, pron: "أَنَا", tr: tr("ene"), form: "Tekil" }
        ] }
    ];
  }

  function conjugationVerbs() {
    return [
    { mazi: "فَهِمَ", muzari: "يَفْهَمُ", muzari1: "أَفْهَمُ", tr: "anlamak" },
    { mazi: "ذَكَرَ", muzari: "يَذْكُرُ", muzari1: "أَذْكُرُ", tr: "anmak; zikretmek" },
    { mazi: "بَحَثَ", muzari: "يَبْحَثُ", muzari1: "أَبْحَثُ", tr: "aramak; araştırmak" },
    { mazi: "فَتَحَ", muzari: "يَفْتَحُ", muzari1: "أَفْتَحُ", tr: "açmak" },
    { mazi: "نَظَرَ", muzari: "يَنْظُرُ", muzari1: "أَنْظُرُ", tr: "bakmak" },
    { mazi: "صَرَخَ", muzari: "يَصْرُخُ", muzari1: "أَصْرُخُ", tr: "bağırmak" },
    { mazi: "عَلِمَ", muzari: "يَعْلَمُ", muzari1: "أَعْلَمُ", tr: "bilmek" },
    { mazi: "تَرَكَ", muzari: "يَتْرُكُ", muzari1: "أَتْرُكُ", tr: "bırakmak" },
    { mazi: "دَرَسَ", muzari: "يَدْرُسُ", muzari1: "أَدْرُسُ", tr: "ders çalışmak" },
    { mazi: "سَمِعَ", muzari: "يَسْمَعُ", muzari1: "أَسْمَعُ", tr: "duymak; dinlemek" },
    { mazi: "حَفِظَ", muzari: "يَحْفَظُ", muzari1: "أَحْفَظُ", tr: "ezberlemek; korumak" },
    { mazi: "دَخَلَ", muzari: "يَدْخُلُ", muzari1: "أَدْخُلُ", tr: "girmek" },
    { mazi: "ذَهَبَ", muzari: "يَذْهَبُ", muzari1: "أَذْهَبُ", tr: "gitmek" },
    { mazi: "ضَحِكَ", muzari: "يَضْحَكُ", muzari1: "أَضْحَكُ", tr: "gülmek" },
    { mazi: "شَتَمَ", muzari: "يَشْتِمُ", muzari1: "أَشْتِمُ", tr: "hakaret etmek" },
    { mazi: "حَمِدَ", muzari: "يَحْمَدُ", muzari1: "أَحْمَدُ", tr: "hamdetmek; övmek" },
    { mazi: "طَلَبَ", muzari: "يَطْلُبُ", muzari1: "أَطْلُبُ", tr: "istemek" },
    { mazi: "شَرِبَ", muzari: "يَشْرَبُ", muzari1: "أَشْرَبُ", tr: "içmek" },
    { mazi: "قَبِلَ", muzari: "يَقْبَلُ", muzari1: "أَقْبَلُ", tr: "kabul etmek" },
    { mazi: "طَرَقَ", muzari: "يَطْرُقُ", muzari1: "أَطْرُقُ", tr: "kapıyı çalmak; vurmak" },
    { mazi: "حَضَرَ", muzari: "يَحْضُرُ", muzari1: "أَحْضُرُ", tr: "katılmak; hazır bulunmak" },
    { mazi: "خَسِرَ", muzari: "يَخْسَرُ", muzari1: "أَخْسَرُ", tr: "kaybetmek" },
    { mazi: "كَسَبَ", muzari: "يَكْسِبُ", muzari1: "أَكْسِبُ", tr: "kazanmak" },
    { mazi: "هَرَبَ", muzari: "يَهْرُبُ", muzari1: "أَهْرُبُ", tr: "kaçmak" },
    { mazi: "قَطَعَ", muzari: "يَقْطَعُ", muzari1: "أَقْطَعُ", tr: "kesmek" },
    { mazi: "رَكَضَ", muzari: "يَرْكُضُ", muzari1: "أَرْكُضُ", tr: "koşmak" },
    { mazi: "عَبَدَ", muzari: "يَعْبُدُ", muzari1: "أَعْبُدُ", tr: "kulluk etmek" },
    { mazi: "جَعَلَ", muzari: "يَجْعَلُ", muzari1: "أَجْعَلُ", tr: "kılmak; yapmak" },
    { mazi: "كَسَرَ", muzari: "يَكْسِرُ", muzari1: "أَكْسِرُ", tr: "kırmak" },
    { mazi: "كَرِهَ", muzari: "يَكْرَهُ", muzari1: "أَكْرَهُ", tr: "nefret etmek; sevmemek" },
    { mazi: "جَلَسَ", muzari: "يَجْلِسُ", muzari1: "أَجْلِسُ", tr: "oturmak" },
    { mazi: "سَكَنَ", muzari: "يَسْكُنُ", muzari1: "أَسْكُنُ", tr: "oturmak; ikamet etmek" },
    { mazi: "لَعِبَ", muzari: "يَلْعَبُ", muzari1: "أَلْعَبُ", tr: "oynamak" },
    { mazi: "رَفَضَ", muzari: "يَرْفُضُ", muzari1: "أَرْفُضُ", tr: "reddetmek" },
    { mazi: "رَكَعَ", muzari: "يَرْكَعُ", muzari1: "أَرْكَعُ", tr: "rükû etmek" },
    { mazi: "حَلَمَ", muzari: "يَحْلُمُ", muzari1: "أَحْلُمُ", tr: "rüya görmek" },
    { mazi: "رَزَقَ", muzari: "يَرْزُقُ", muzari1: "أَرْزُقُ", tr: "rızık vermek" },
    { mazi: "صَبَرَ", muzari: "يَصْبِرُ", muzari1: "أَصْبِرُ", tr: "sabretmek" },
    { mazi: "سَجَدَ", muzari: "يَسْجُدُ", muzari1: "أَسْجُدُ", tr: "secde etmek" },
    { mazi: "حَمَلَ", muzari: "يَحْمِلُ", muzari1: "أَحْمِلُ", tr: "taşımak" },
    { mazi: "جَمَعَ", muzari: "يَجْمَعُ", muzari1: "أَجْمَعُ", tr: "toplamak" },
    { mazi: "ضَرَبَ", muzari: "يَضْرِبُ", muzari1: "أَضْرِبُ", tr: "vurmak" },
    { mazi: "خَلَقَ", muzari: "يَخْلُقُ", muzari1: "أَخْلُقُ", tr: "yaratmak" },
    { mazi: "نَصَرَ", muzari: "يَنْصُرُ", muzari1: "أَنْصُرُ", tr: "yardım etmek" },
    { mazi: "كَتَبَ", muzari: "يَكْتُبُ", muzari1: "أَكْتُبُ", tr: "yazmak" },
    { mazi: "طَبَخَ", muzari: "يَطْبُخُ", muzari1: "أَطْبُخُ", tr: "yemek pişirmek" },
    { mazi: "غَسَلَ", muzari: "يَغْسِلُ", muzari1: "أَغْسِلُ", tr: "yıkamak" },
    { mazi: "عَشِقَ", muzari: "يَعْشَقُ", muzari1: "أَعْشَقُ", tr: "âşık olmak; çok sevmek" },
    { mazi: "عَمِلَ", muzari: "يَعْمَلُ", muzari1: "أَعْمَلُ", tr: "çalışmak; yapmak" },
    { mazi: "رَسَمَ", muzari: "يَرْسُمُ", muzari1: "أَرْسُمُ", tr: "çizmek" },
    { mazi: "خَرَجَ", muzari: "يَخْرُجُ", muzari1: "أَخْرُجُ", tr: "çıkmak" },
    { mazi: "قَتَلَ", muzari: "يَقْتُلُ", muzari1: "أَقْتُلُ", tr: "öldürmek" },
    { mazi: "شَهِدَ", muzari: "يَشْهَدُ", muzari1: "أَشْهَدُ", tr: "şahit olmak" },
    { mazi: "شَكَرَ", muzari: "يَشْكُرُ", muzari1: "أَشْكُرُ", tr: "şükretmek" }
    ];
  }

  function findVerb(key) {
    const list = conjugationVerbs();
    if (!key) return list[0];
    return list.find((v) => v.mazi === key || v.tr === key) || list[0];
  }

  function buildConjugationGrid(verb, tense) {
    const forms = tense === "muzari"
      ? conjugateMuzari(verb.muzari, verb.muzari1)
      : conjugateMazi(verb.mazi);
    if (!forms) return null;

    const grid = document.createElement("div");
    grid.className = "pronoun-grid conjugation-grid";

    ["Çoğul", "İkil", "Tekil"].forEach((label, index) => {
      const head = document.createElement("div");
      head.className = "pronoun-grid__head";
      head.innerHTML = `<strong>${label}</strong><small>${["Cemi", "Tesniye", "Müfred"][index]}</small>`;
      grid.appendChild(head);
    });
    const spacer = document.createElement("div");
    spacer.className = "pronoun-grid__head pronoun-grid__head--empty";
    grid.appendChild(spacer);

    const FORM_KEYS = { "Tekil": "tekil", "İkil": "ikil", "Çoğul": "cogul", "İkil ve çoğul": "ikilvecogul" };

    conjugationRows(forms).forEach((row) => {
      const rowEl = document.createElement("div");
      rowEl.className = "pronoun-row";
      rowEl.dataset.gender = row.gender;

      row.cells.forEach((cell) => {
        const box = document.createElement("button");
        box.type = "button";
        box.className = "pronoun-cell conjugation-cell";
        box.dataset.gender = row.gender;
        box.dataset.form = FORM_KEYS[cell.form] || "tekil";
        if (cell.span) box.classList.add("pronoun-cell--wide");
        box.setAttribute("aria-label", `${cell.ar} — ${cell.tr}. Sesli oku.`);
        box.innerHTML = `<span class="pronoun-cell__form">${cell.form}</span>`
          + `<span class="pronoun-cell__ar" lang="ar" dir="rtl">${cell.ar}</span>`
          + `<span class="pronoun-cell__lat conjugation-cell__pron" lang="ar" dir="rtl">${cell.pron}</span>`
          + `<span class="pronoun-cell__tr">${cell.tr}</span>`;
        box.addEventListener("click", () => speakArabic(cell.ar, box));
        rowEl.appendChild(box);
      });

      const label = document.createElement("div");
      label.className = "pronoun-grid__label";
      label.dataset.gender = row.gender;
      label.innerHTML = `<strong>${row.term}</strong><small>${row.termNote}</small><span class="pronoun-grid__person">${row.person}</span>`;
      rowEl.appendChild(label);
      grid.appendChild(rowEl);
    });

    return grid;
  }

  function setupConjugationGrids() {
    document.querySelectorAll("[data-conjugation-grid]").forEach((host) => {
      if (host.dataset.conjugationReady === "true") return;
      host.dataset.conjugationReady = "true";
      const verb = findVerb(host.dataset.conjugationGrid);
      const tense = host.dataset.tense === "muzari" ? "muzari" : "mazi";
      const grid = buildConjugationGrid(verb, tense);
      if (grid) host.appendChild(grid);
    });
  }

  function setupConjugationWorkbench() {
    const host = document.querySelector("[data-conjugation-workbench]");
    if (!host || host.dataset.workbenchReady === "true") return;
    host.dataset.workbenchReady = "true";

    const verbs = conjugationVerbs();
    const storeKey = `${STORAGE_PREFIX}:conjugation-choice`;
    let saved = {};
    try {
      saved = JSON.parse(localStorage.getItem(storeKey) || "{}");
    } catch {
      saved = {};
    }

    const toolbar = document.createElement("div");
    toolbar.className = "conjugation-toolbar";

    const label = document.createElement("label");
    label.className = "conjugation-toolbar__field";
    label.innerHTML = '<span>Fiil seç</span>';
    const select = document.createElement("select");
    select.id = "conjugation-verb";
    verbs.forEach((verb) => {
      const option = document.createElement("option");
      option.value = verb.mazi;
      option.textContent = `${verb.mazi} · ${verb.tr}`;
      select.appendChild(option);
    });
    select.value = verbs.some((v) => v.mazi === saved.verb) ? saved.verb : verbs[0].mazi;
    label.appendChild(select);

    const tabs = document.createElement("div");
    tabs.className = "conjugation-tabs";
    tabs.setAttribute("role", "tablist");
    const tenses = [
      ["mazi", "Mâzi", "geçmiş zaman"],
      ["muzari", "Muzari", "şimdiki / geniş zaman"]
    ];
    let activeTense = saved.tense === "muzari" ? "muzari" : "mazi";
    const tabButtons = tenses.map(([value, title, note]) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "conjugation-tab";
      button.dataset.tense = value;
      button.setAttribute("role", "tab");
      button.innerHTML = `<strong>${title}</strong><small>${note}</small>`;
      button.addEventListener("click", () => {
        activeTense = value;
        render();
      });
      tabs.appendChild(button);
      return button;
    });

    toolbar.append(label, tabs);

    const summary = document.createElement("p");
    summary.className = "conjugation-summary";

    const gridHost = document.createElement("div");
    gridHost.className = "conjugation-host";

    const hint = document.createElement("p");
    hint.className = "pronoun-grid__legend";
    hint.textContent = "Listedeki fiillerin hepsi sâlim (kuvvetli) üç harfli fiillerdir; çekimleri düzenli kalıpla üretilir. Bir kutuya dokununca o biçim sesli okunur.";

    host.append(toolbar, summary, gridHost, hint);

    function render() {
      const verb = findVerb(select.value);
      tabButtons.forEach((button) => {
        const on = button.dataset.tense === activeTense;
        button.classList.toggle("is-active", on);
        button.setAttribute("aria-selected", String(on));
      });
      gridHost.replaceChildren();
      const grid = buildConjugationGrid(verb, activeTense);
      if (grid) gridHost.appendChild(grid);
      summary.innerHTML = `<b lang="ar" dir="rtl">${activeTense === "muzari" ? verb.muzari : verb.mazi}</b>`
        + ` · <strong>${verb.tr}</strong> · ${activeTense === "muzari" ? "muzari (şimdiki/geniş zaman)" : "mâzi (geçmiş zaman)"}`;
      try {
        localStorage.setItem(storeKey, JSON.stringify({ verb: select.value, tense: activeTense }));
      } catch {
        /* depolama kapali olabilir */
      }
    }

    select.addEventListener("change", render);
    render();
  }

  function setupUniversalArabicTools() {
    document.querySelectorAll("[lang^='ar']").forEach((element) => {
      if (element.closest(".reading-tools")) return;
      if (element.closest(".word-map")) return;
      if (element.closest(".pronoun-grid")) return;
      if (element.closest(".flashcard")) return;
      if (element.matches(".sentence-study article > .arabic.sentence")) return;
      if (element.closest(".arabic-tools, .flashcard-actions, .sentence-actions")) return;
      if (element.dataset.arabicTools === "true") return;

      const isInput = element.matches("textarea, input");
      const getText = () => {
        const rawText = isInput ? element.value : element.textContent;
        return extractArabicText(rawText || "");
      };

      if (!isInput && !getText()) return;

      const actions = createCompactArabicActions(getText, isInput);
      element.dataset.arabicTools = "true";

      if (element.tagName === "TD" || element.tagName === "TH") {
        element.appendChild(actions);
      } else {
        element.insertAdjacentElement("afterend", actions);
      }
    });
  }

  function extractArabicText(text) {
    return text
      .replace(/[^\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\s.,،؛؟…·-]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function createCompactArabicActions(getText, isInput) {
    const actions = document.createElement("span");
    actions.className = `arabic-tools${isInput ? " arabic-input-tools" : ""}`;
    actions.setAttribute("dir", "ltr");

    const speakButton = document.createElement("button");
    speakButton.type = "button";
    speakButton.className = "flashcard-action flashcard-action--speak";
    speakButton.setAttribute("aria-label", "Arapça ifadeyi sesli oku");
    speakButton.title = "Arapça ifadeyi sesli oku";
    speakButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Zm4.2 4a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>';

    const copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "flashcard-action flashcard-action--copy";
    copyButton.setAttribute("aria-label", "Arapça ifadeyi kopyala");
    copyButton.title = "Arapça ifadeyi kopyala";
    copyButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="8" y="8" width="11" height="11" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>';

    speakButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const text = getText();
      if (!text) {
        showToast("Önce Arapça ifadeyi yaz.");
        return;
      }
      speakArabic(text, speakButton);
    });

    copyButton.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      const text = getText();
      if (!text) {
        showToast("Önce Arapça ifadeyi yaz.");
        return;
      }
      copyArabicText(text);
    });

    actions.append(speakButton, copyButton);
    return actions;
  }

  let toastTimer;

  let activeCardAudio = null;
  let activeSpeakButton = null;

  function stopActiveSpeech() {
    if (activeCardAudio) {
      activeCardAudio.pause();
      activeCardAudio.currentTime = 0;
      activeCardAudio = null;
    }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    activeSpeakButton?.classList.remove("is-speaking");
    activeSpeakButton = null;
  }

  const ONLINE_TTS_SOURCES = [
    ["https://translate.googleapis.com/translate_tts", "gtx"],
    ["https://translate.google.com/translate_tts", "tw-ob"]
  ];

  function speakArabic(text, button) {
    if (!text) return;

    const cleanText = text.replace(/\s+/g, " ").trim().slice(0, 200);
    if (!cleanText) return;

    const wasSameButton = activeSpeakButton === button;
    stopActiveSpeech();
    if (wasSameButton) return;

    activeSpeakButton = button;
    button.classList.add("is-speaking");

    const finish = () => {
      button.classList.remove("is-speaking");
      if (activeSpeakButton === button) activeSpeakButton = null;
    };

    const fallbackToOnline = (reason) => {
      playOnlineVoice(cleanText, button, finish, reason);
    };

    if (!speechSupported()) {
      fallbackToOnline("Bu tarayıcı yerleşik konuşma desteği sunmuyor.");
      return;
    }

    const voices = window.speechSynthesis.getVoices() || [];
    const arabicVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith("ar")) || null;

    // Ses listesi boşsa liste henüz yüklenmemiş olabilir (Android'de sık görülür):
    // reddetmek yerine dili belirterek dene, sessiz kalırsa çevrimiçi sese düş.
    if (!arabicVoice && voices.length > 0) {
      fallbackToOnline(`Cihazında yüklü bir Arapça konuşma sesi yok (${voices.length} ses bulundu, hiçbiri Arapça değil).`);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    if (arabicVoice) utterance.voice = arabicVoice;
    utterance.lang = arabicVoice?.lang || "ar-SA";
    utterance.rate = 0.75;
    utterance.pitch = 1;

    const startedAt = Date.now();
    // Gercek konusma metnin uzunlugu kadar surer. Arapcayi okuyamayan bir ses
    // (orn. yalnizca Turkce Microsoft Tolga) uzunluk ne olursa olsun ~300 ms'de
    // biter; bu esigin altinda kalan her okuma sessiz sayilir.
    const minSpokenMs = Math.min(2500, 400 + cleanText.length * 35);

    utterance.onend = () => {
      if (activeSpeakButton !== button) return;
      if (Date.now() - startedAt >= minSpokenMs) {
        finish();
        return;
      }
      fallbackToOnline(arabicVoice
        ? `“${arabicVoice.name}” sesi Arapça metni seslendiremedi.`
        : "Cihazında Arapça konuşma sesi bulunamadı.");
    };

    utterance.onerror = (event) => {
      if (activeSpeakButton !== button) return;
      if (event?.error === "interrupted" || event?.error === "canceled") {
        finish();
        return;
      }
      fallbackToOnline("Cihazın konuşma motoru Arapça metni okuyamadı.");
    };

    window.speechSynthesis.speak(utterance);
  }

  function playOnlineVoice(text, button, finish, reason) {
    const playSource = (index) => {
      if (activeSpeakButton !== button) return;
      if (index >= ONLINE_TTS_SOURCES.length) {
        finish();
        showVoiceHelp(reason);
        return;
      }

      const [host, client] = ONLINE_TTS_SOURCES[index];
      const url = new URL(host);
      url.searchParams.set("ie", "UTF-8");
      url.searchParams.set("client", client);
      url.searchParams.set("tl", "ar");
      url.searchParams.set("q", text);

      const audio = new Audio(url.toString());
      let done = false;
      activeCardAudio = audio;

      const next = () => {
        if (done) return;
        done = true;
        if (activeCardAudio === audio) activeCardAudio = null;
        playSource(index + 1);
      };

      audio.addEventListener("ended", () => {
        done = true;
        if (activeCardAudio === audio) activeCardAudio = null;
        finish();
      }, { once: true });
      audio.addEventListener("error", next, { once: true });
      audio.play().catch(next);
    };

    playSource(0);
  }

  function speechSupported() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  function findArabicVoice() {
    if (!speechSupported()) return null;
    const voices = window.speechSynthesis.getVoices() || [];
    return voices.find((voice) => voice.lang?.toLowerCase().startsWith("ar")) || null;
  }

  function detectPlatform() {
    const info = `${navigator.userAgent} ${navigator.platform || ""}`.toLowerCase();
    if (/iphone|ipad|ipod/.test(info)) return "ios";
    if (/android/.test(info)) return "android";
    if (/mac os|macintosh/.test(info)) return "mac";
    if (/windows/.test(info)) return "windows";
    return "other";
  }

  const VOICE_HELP_STEPS = {
    windows: {
      title: "Windows'ta Arapça sesi ekle",
      steps: [
        "Ayarlar → Saat ve dil → Konuşma → Sesleri yönet.",
        "“Ses ekle” düğmesine bas ve listeden Arapça'yı (العربية) seç.",
        "İndirme bitince tarayıcıyı tamamen kapatıp yeniden aç."
      ],
      note: "Alternatif: Ayarlar → Saat ve dil → Dil ve bölge → Dil ekle → Arapça (kurulum seçeneklerinde “Konuşma” kutusu işaretli olsun)."
    },
    mac: {
      title: "Mac'te Arapça sesi ekle",
      steps: [
        "Sistem Ayarları → Erişilebilirlik → Konuşulan İçerik → Sistem sesi.",
        "Listenin altındaki “Sesi Yönet”ten Arapça sesleri indir.",
        "İndirme bitince tarayıcıyı yeniden başlat."
      ]
    },
    ios: {
      title: "iPhone/iPad'de Arapça sesi ekle",
      steps: [
        "Ayarlar → Erişilebilirlik → Konuşulan İçerik → Sesler.",
        "Arapça'yı seçip bir sesi indir.",
        "Safari'yi kapatıp yeniden aç."
      ]
    },
    android: {
      title: "Android'de Arapça sesi ekle",
      steps: [
        "Ayarlar → Erişilebilirlik → Metin okuma çıkışı.",
        "Motorun ayarlarından “Ses verilerini yükle” → Arapça paketini indir.",
        "Tarayıcıyı kapatıp yeniden aç."
      ]
    },
    other: {
      title: "Arapça sesi ekle",
      steps: [
        "İşletim sisteminin konuşma/erişilebilirlik ayarlarını aç.",
        "Arapça konuşma (text-to-speech) paketini indir.",
        "Tarayıcıyı yeniden başlat."
      ]
    }
  };

  let voiceHelpDialog = null;

  function showVoiceHelp(reason) {
    const platform = detectPlatform();
    const help = VOICE_HELP_STEPS[platform] || VOICE_HELP_STEPS.other;

    if (!voiceHelpDialog) {
      voiceHelpDialog = document.createElement("div");
      voiceHelpDialog.className = "voice-help";
      voiceHelpDialog.setAttribute("role", "dialog");
      voiceHelpDialog.setAttribute("aria-modal", "true");
      voiceHelpDialog.setAttribute("aria-labelledby", "voice-help-title");
      voiceHelpDialog.hidden = true;
      document.body.appendChild(voiceHelpDialog);

      voiceHelpDialog.addEventListener("click", (event) => {
        if (event.target === voiceHelpDialog || event.target.closest("[data-voice-help-close]")) {
          hideVoiceHelp();
        }
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && voiceHelpDialog && !voiceHelpDialog.hidden) hideVoiceHelp();
      });
    }

    const edgeNote = platform === "windows"
      ? '<p class="voice-help__note">Önce şunu dene: Bu sayfayı <strong>Microsoft Edge</strong> ile aç. Edge çoğu kurulumda kendi çevrimiçi Arapça sesleriyle gelir; çalışırsa hiçbir şey kurmana gerek kalmaz.</p>'
      : "";
    const extraNote = help.note ? `<p class="voice-help__note">${help.note}</p>` : "";

    voiceHelpDialog.innerHTML = `
      <div class="voice-help__card">
        <p class="voice-help__reason">${reason || ""}</p>
        <h2 id="voice-help-title">${help.title}</h2>
        <ol class="voice-help__steps">${help.steps.map((step) => `<li>${step}</li>`).join("")}</ol>
        ${edgeNote}
        ${extraNote}
        <p class="voice-help__note">Ses gelene kadar Arapça metinleri kendi sesinle okuyabilirsin; alıştırmaların geri kalanı normal çalışır.</p>
        <button type="button" class="primary-button" data-voice-help-close>Anladım</button>
      </div>
    `;
    voiceHelpDialog.hidden = false;
    voiceHelpDialog.querySelector("[data-voice-help-close]")?.focus();
  }

  function hideVoiceHelp() {
    if (voiceHelpDialog) voiceHelpDialog.hidden = true;
  }

  function warmUpVoices() {
    if (!speechSupported()) return;
    window.speechSynthesis.getVoices();
    window.speechSynthesis.addEventListener?.("voiceschanged", () => {
      window.speechSynthesis.getVoices();
    });
  }

  warmUpVoices();
  setupConjugationGrids();
  setupConjugationWorkbench();

  async function copyArabicText(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const helper = document.createElement("textarea");
      helper.value = text;
      helper.setAttribute("readonly", "");
      helper.style.position = "fixed";
      helper.style.opacity = "0";
      document.body.appendChild(helper);
      helper.select();
      document.execCommand("copy");
      helper.remove();
    }
    showToast("Arapça metin kopyalandı.");
  }

  function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
  }
})();
