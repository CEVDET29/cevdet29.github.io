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
    "ders-07": "Muzari fiile giriş",
    "ders-08": "Muzari tam çekim ve olumsuzluk",
    "ders-09": "Gelecek zaman",
    "ders-10": "Zamanlar karşılaştırması",
    "ders-11": "Emir: “yap!”",
    "ders-12": "Nehiy (yapma!) ve لَمْ",
    "ders-13": "Soru kelimeleri",
    "ders-14": "İsim tamlaması (izafet)",
    "ders-15": "Bitişik zamirler (kitabım, kitabın)",
    "ders-16": "Harf-i cerler (fî, ilâ, min…)",
    "ders-17": "İkil ve çoğul isimler",
    "ders-18": "İşaret isimleri: bu, şu, bunlar",
    "ders-19": "İlgi zamirleri (الَّذِي، الَّتِي)",
    "ders-20": "İ‘râba giriş ve bütünleştirme"
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
    ],
    "ders-08": [
      { id: "d7-ektubu", sourceLesson: "ders-07", topic: "Muzari şahıs işaretleri", prompt: "أَكْتُبُ hangi şahıstır?", options: [["ben", "Ben"], ["biz", "Biz"], ["o", "O"]], answer: "ben", explanation: "Muzaride baştaki أَ “ben” şahsını gösterir." },
      { id: "d7-tektubine", sourceLesson: "ders-07", topic: "Muzari çekimi", prompt: "تَكْتُبِينَ kime söylenir?", options: [["sen-kadin", "Sen · kadın"], ["o-kadin", "O · kadın"], ["siz", "Siz"]], answer: "sen-kadin", explanation: "Başta تَـ, sonda ـِينَ: tek bir kadına “sen”." },
      { id: "d7-yektubune", sourceLesson: "ders-07", topic: "Muzari çekimi", prompt: "يَكْتُبُونَ ne demektir?", options: [["onlar", "Onlar yazıyorlar"], ["siz", "Siz yazıyorsunuz"], ["o", "O yazıyor"]], answer: "onlar", explanation: "Başta يَـ, sonda ـُونَ: üçüncü çoğul eril/karma şahıs." },
      { id: "d7-elane", sourceLesson: "ders-07", topic: "Şimdiki ve geniş anlam", prompt: "أَكْتُبُ الآنَ ne demektir?", options: [["simdi", "Şimdi yazıyorum"], ["hergun", "Her gün yazarım"], ["yazdim", "Yazdım"]], answer: "simdi", explanation: "الآنَ “şimdi” demektir; muzari burada şimdiki zaman anlamı taşır." },
      { id: "d7-fatiha", sourceLesson: "ders-07", topic: "Kur’an bağlantısı", prompt: "إِيَّاكَ نَعْبُدُ içindeki نَعْبُدُ hangi şahıstır?", options: [["biz", "Biz"], ["ben", "Ben"], ["onlar", "Onlar"]], answer: "biz", explanation: "Muzaride baştaki نَـ “biz” şahsını gösterir." }
    ],
    "ders-09": [
      { id: "d8-yektuban", sourceLesson: "ders-08", topic: "Muzari ikil", prompt: "يَكْتُبَانِ ne demektir?", options: [["ikisi", "O ikisi yazıyor"], ["onlar", "Onlar yazıyorlar"], ["ikiniz", "Siz ikiniz yazıyorsunuz"]], answer: "ikisi", explanation: "Başta يَـ, sonda ـَانِ: üçüncü şahıs ikil (iki erkek)." },
      { id: "d8-yektubne", sourceLesson: "ders-08", topic: "Kadınlar çoğulu", prompt: "يَكْتُبْنَ ne demektir?", options: [["onlar-kadin", "Onlar (kadınlar) yazıyorlar"], ["siz-kadin", "Siz (kadınlar) yazıyorsunuz"], ["o-kadin", "O kadın yazıyor"]], answer: "onlar-kadin", explanation: "Başta يَـ, sonda ـْنَ: üçüncü çoğul dişil şahıs." },
      { id: "d8-la-ektubu", sourceLesson: "ders-08", topic: "Olumsuz muzari", prompt: "لَا أَكْتُبُ ne demektir?", options: [["yazmiyorum", "Yazmıyorum / yazmam"], ["yazmadim", "Yazmadım"], ["yazmayacagim", "Yazmayacağım"]], answer: "yazmiyorum", explanation: "لَا muzarinin önünde “-mıyor / -maz” anlamı verir." },
      { id: "d8-la-bicim", sourceLesson: "ders-08", topic: "Olumsuz muzari", prompt: "لَا muzari fiilin biçimini değiştirir mi?", options: [["hayir", "Hayır, fiil aynı kalır"], ["evet", "Evet, sonu üstün olur"]], answer: "hayir", explanation: "لَا fiile dokunmaz: أَكْتُبُ → لَا أَكْتُبُ." },
      { id: "d8-kafirun", sourceLesson: "ders-08", topic: "Kur’an bağlantısı", prompt: "لَا أَعْبُدُ مَا تَعْبُدُونَ içindeki تَعْبُدُونَ hangi şahıstır?", options: [["siz", "Siz"], ["onlar", "Onlar"], ["biz", "Biz"]], answer: "siz", explanation: "Başta تَـ, sonda ـُونَ: ikinci çoğul eril/karma şahıs." }
    ],
    "ders-10": [
      { id: "d9-seektubu", sourceLesson: "ders-09", topic: "Gelecek zaman", prompt: "سَأَكْتُبُ ne demektir?", options: [["yazacagim", "Yazacağım"], ["yaziyorum", "Yazıyorum"], ["yazdim", "Yazdım"]], answer: "yazacagim", explanation: "Muzarinin önündeki سَـ geleceği gösterir." },
      { id: "d9-seyezhebune", sourceLesson: "ders-09", topic: "Gelecek zaman", prompt: "سَيَذْهَبُونَ ne demektir?", options: [["gidecekler", "Onlar gidecekler"], ["gidiyorlar", "Onlar gidiyorlar"], ["gittiler", "Onlar gittiler"]], answer: "gidecekler", explanation: "سَـ + يَذْهَبُونَ: üçüncü çoğul şahısta gelecek." },
      { id: "d9-len", sourceLesson: "ders-09", topic: "Olumsuz gelecek", prompt: "لَنْ أَكْتُبَ ne demektir?", options: [["yazmayacagim", "Yazmayacağım"], ["yazmiyorum", "Yazmıyorum"], ["yazmadim", "Yazmadım"]], answer: "yazmayacagim", explanation: "لَنْ geleceği olumsuz yapar ve fiilin sonunu üstün yapar." },
      { id: "d9-len-yezhebu", sourceLesson: "ders-09", topic: "Olumsuz gelecek", prompt: "“Onlar gitmeyecekler” hangisidir?", options: [["dogru", "لَنْ يَذْهَبُوا"], ["nunlu", "لَنْ يَذْهَبُونَ"], ["la", "لَا يَذْهَبُونَ"]], answer: "dogru", explanation: "لَنْ’den sonra ـُونَ’nin ن’si düşer: يَذْهَبُوا." },
      { id: "d9-tekasur", sourceLesson: "ders-09", topic: "Kur’an bağlantısı", prompt: "كَلَّا سَوْفَ تَعْلَمُونَ ne demektir?", options: [["bileceksiniz", "Hayır! Yakında bileceksiniz."], ["bilmiyorsunuz", "Hayır! Bilmiyorsunuz."], ["bildiniz", "Hayır! Bildiniz."]], answer: "bileceksiniz", explanation: "سَوْفَ + تَعْلَمُونَ: “siz” şahsında gelecek." }
    ],
    "ders-11": [
      { id: "d10-zaman", sourceLesson: "ders-10", topic: "Zamanlar", prompt: "سَنَكْتُبُ hangi zamandır?", options: [["gelecek", "Gelecek"], ["simdiki", "Şimdiki / geniş"], ["gecmis", "Geçmiş"]], answer: "gelecek", explanation: "Muzarinin önündeki سَـ geleceği gösterir: “yazacağız”." },
      { id: "d10-ma", sourceLesson: "ders-10", topic: "Olumsuz geçmiş", prompt: "مَا ذَهَبْتُ ne demektir?", options: [["gitmedim", "Gitmedim"], ["gitmiyorum", "Gitmiyorum"], ["gitmeyecegim", "Gitmeyeceğim"]], answer: "gitmedim", explanation: "مَا + mâzi geçmişi olumsuz yapar; fiil değişmez." },
      { id: "d10-ems", sourceLesson: "ders-10", topic: "Zaman kelimeleri", prompt: "أَمْسِ ne demektir?", options: [["dun", "Dün"], ["yarin", "Yarın"], ["bugun", "Bugün"]], answer: "dun", explanation: "أَمْسِ “dün” demektir ve geçmiş zamanla kullanılır." },
      { id: "d10-len", sourceLesson: "ders-10", topic: "Üç olumsuzluk", prompt: "سَيَكْتُبُ fiilinin olumsuzu hangisidir?", options: [["len", "لَنْ يَكْتُبَ"], ["la-se", "لَا سَيَكْتُبُ"], ["ma-se", "مَا سَيَكْتُبُ"]], answer: "len", explanation: "Geleceğin olumsuzu لَنْ + muzari; fiilin sonu üstün olur." },
      { id: "d10-abedtum", sourceLesson: "ders-10", topic: "Kur’an bağlantısı", prompt: "عَبَدْتُمْ hangi zaman ve şahıstır?", options: [["mazi-siz", "Mâzi · siz"], ["muzari-siz", "Muzari · siz"], ["mazi-onlar", "Mâzi · onlar"]], answer: "mazi-siz", explanation: "Sondaki تُمْ mâzide “siz” ekidir: “kulluk ettiniz”." }
    ],
    "ders-12": [
      { id: "d11-uktub", sourceLesson: "ders-11", topic: "Emir", prompt: "اُكْتُبْ ne demektir?", options: [["yaz", "Yaz!"], ["yaziyorsun", "Yazıyorsun"], ["yazdi", "Yazdı"]], answer: "yaz", explanation: "تَكْتُبُ → اُكْتُبْ: muzari “sen” biçiminden yapılan emir." },
      { id: "d11-izheb", sourceLesson: "ders-11", topic: "Emir", prompt: "يَذْهَبُ fiilinin emri hangisidir?", options: [["izheb", "اِذْهَبْ"], ["uzhub", "اُذْهُبْ"], ["yezheb", "يَذْهَبْ"]], answer: "izheb", explanation: "Orta harf üstünlü olduğu için başa esreli hemze gelir: اِذْهَبْ." },
      { id: "d11-ijlisi", sourceLesson: "ders-11", topic: "Emir çekimi", prompt: "اِجْلِسِي kime söylenir?", options: [["kadin", "Bir kadına"], ["erkek", "Bir erkeğe"], ["topluluk", "Topluluğa"]], answer: "kadin", explanation: "Sondaki ـِي kadına yapılan emrin işaretidir: تَجْلِسِينَ → اِجْلِسِي." },
      { id: "d11-vasl", sourceLesson: "ders-11", topic: "Hemze-i vasl", prompt: "وَاكْتُبْ nasıl okunur?", options: [["vektub", "vektub"], ["veuktub", "ve-uktub"], ["veiktub", "ve-iktub"]], answer: "vektub", explanation: "Önünde وَ olduğu için hemze-i vasl okunmaz." },
      { id: "d11-ikra", sourceLesson: "ders-11", topic: "Kur’an bağlantısı", prompt: "Alak 1’deki اقْرَأْ ne demektir?", options: [["oku", "Oku!"], ["okudu", "Okudu"], ["okuyor", "Okuyor"]], answer: "oku", explanation: "يَقْرَأُ fiilinin emri: “oku!”." }
    ],
    "ders-13": [
      { id: "d12-nehy", sourceLesson: "ders-12", topic: "Nehiy", prompt: "لَا تَكْتُبْ ne demektir?", options: [["yazma", "Yazma!"], ["yazmiyorsun", "Yazmıyorsun"], ["yazmadin", "Yazmadın"]], answer: "yazma", explanation: "لَا + muzari, sonu sükûn: yasak bildirir." },
      { id: "d12-lem", sourceLesson: "ders-12", topic: "لَمْ", prompt: "لَمْ يَذْهَبُوا ne demektir?", options: [["gitmediler", "Gitmediler"], ["gitmiyorlar", "Gitmiyorlar"], ["gitmeyin", "Gitmeyin!"]], answer: "gitmediler", explanation: "لَمْ muzariyi geçmişe çevirip olumsuz yapar." },
      { id: "d12-fark", sourceLesson: "ders-12", topic: "Nehiy", prompt: "لَا تَكْتُبُ ile لَا تَكْتُبْ arasındaki fark nedir?", options: [["bilgi-yasak", "Biri bilgi, biri yasak; son harekeye bakılır"], ["zaman", "Biri geçmiş, biri gelecek"], ["yok", "Fark yoktur"]], answer: "bilgi-yasak", explanation: "Son harf ötreyse “yazmıyorsun”, sükûnsa “yazma!”." },
      { id: "d12-tahzen", sourceLesson: "ders-12", topic: "Kur’an bağlantısı", prompt: "لَا تَحْزَنْ ne demektir?", options: [["uzulme", "Üzülme!"], ["uzulmedi", "Üzülmedi"], ["uzulmeyecek", "Üzülmeyecek"]], answer: "uzulme", explanation: "Tevbe 40: nehiy, “üzülme”." },
      { id: "d12-yelid", sourceLesson: "ders-12", topic: "Kur’an bağlantısı", prompt: "لَمْ يَلِدْ ne demektir?", options: [["dogurmadi", "Doğurmadı"], ["dogurmaz", "Doğurmaz"], ["dogurmayacak", "Doğurmayacak"]], answer: "dogurmadi", explanation: "İhlâs 3: لَمْ + يَلِدْ, geçmişin olumsuzu." }
    ],
    "ders-14": [
      { id: "d13-men", sourceLesson: "ders-13", topic: "Soru kelimeleri", prompt: "مَنْ ne demektir?", options: [["kim", "Kim?"], ["ne", "Ne?"], ["nerede", "Nerede?"]], answer: "kim", explanation: "مَنْ kişiyi sorar: مَنْ هَذَا؟ “Bu kim?”" },
      { id: "d13-eyne", sourceLesson: "ders-13", topic: "Soru kelimeleri", prompt: "“Nerede?” hangisidir?", options: [["eyne", "أَيْنَ"], ["meta", "مَتَى"], ["keyfe", "كَيْفَ"]], answer: "eyne", explanation: "أَيْنَ yer sorar." },
      { id: "d13-maza", sourceLesson: "ders-13", topic: "مَا ve مَاذَا", prompt: "Fiilden önce gelen “ne?” hangisidir?", options: [["maza", "مَاذَا"], ["men", "مَنْ"], ["kem", "كَمْ"]], answer: "maza", explanation: "مَاذَا genellikle fiilden önce gelir: مَاذَا تَقْرَأُ؟" },
      { id: "d13-kem", sourceLesson: "ders-13", topic: "كَمْ", prompt: "كَمْ’den sonra isim nasıl gelir?", options: [["tekil", "Tekil ve üstün tenvinli"], ["cogul", "Çoğul ve ötreli"], ["ikil", "İkil"]], answer: "tekil", explanation: "كَمْ كِتَابًا؟ “Kaç kitap?”" },
      { id: "d13-elem", sourceLesson: "ders-13", topic: "Kur’an bağlantısı", prompt: "أَلَمْ تَرَ ne demektir?", options: [["gormedin-mi", "Görmedin mi?"], ["gorecek-misin", "Görecek misin?"], ["gor", "Gör!"]], answer: "gormedin-mi", explanation: "أَ + لَمْ olumsuz soru kurar (Fîl 1)." }
    ],
    "ders-15": [
      { id: "d14-kitab", sourceLesson: "ders-14", topic: "İsim tamlaması", prompt: "كِتَابُ الطَّالِبِ ne demektir?", options: [["ogrencinin", "Öğrencinin kitabı"], ["yeni", "Yeni kitap"], ["cumle", "Kitap öğrencidir"]], answer: "ogrencinin", explanation: "Birinci isim muzâf, ikinci isim esreli muzâfun ileyh: “öğrencinin kitabı”." },
      { id: "d14-al", sourceLesson: "ders-14", topic: "İsim tamlaması", prompt: "Tamlamanın birinci ismi ال alır mı?", options: [["hayir", "Hayır"], ["evet", "Evet"], ["cogul", "Yalnız çoğulda"]], answer: "hayir", explanation: "Muzâf ال ve tenvin almaz; belirliliği ikinci isimden gelir." },
      { id: "d14-esre", sourceLesson: "ders-14", topic: "İsim tamlaması", prompt: "Tamlamanın ikinci isminin sonu nasıl okunur?", options: [["esre", "Esre"], ["otre", "Ötre"], ["ustun", "Üstün"]], answer: "esre", explanation: "Muzâfun ileyh her zaman mecrurdur, yani esre okunur." },
      { id: "d14-resul", sourceLesson: "ders-14", topic: "İsim tamlaması", prompt: "“Allah’ın elçisi” hangisidir?", options: [["dogru", "رَسُولُ اللَّهِ"], ["al", "الرَّسُولُ اللَّهُ"], ["tenvin", "رَسُولٌ اللَّهِ"]], answer: "dogru", explanation: "رَسُولُ ال ve tenvin almaz; اللَّهِ esredir." },
      { id: "d14-malik", sourceLesson: "ders-14", topic: "Kur’an bağlantısı", prompt: "مَالِكِ يَوْمِ الدِّينِ ne demektir?", options: [["dogru", "Din (hesap) gününün sahibi"], ["cumle", "Sahip, gün dindir"], ["ters", "Dinin sahibinin günü"]], answer: "dogru", explanation: "Üç isimli zincir; sondan başa çevrilir." }
    ],
    "ders-16": [
      { id: "d15-kitabi", sourceLesson: "ders-15", topic: "Bitişik zamirler", prompt: "كِتَابِي ne demektir?", options: [["kitabim", "Kitabım"], ["kitabin", "Kitabın"], ["onun", "Onun kitabı"]], answer: "kitabim", explanation: "ـِي “benim” anlamındaki bitişik zamirdir." },
      { id: "d15-ha", sourceLesson: "ders-15", topic: "Bitişik zamirler", prompt: "اِسْمُهَا ne demektir?", options: [["kadin", "Onun (kadın) adı"], ["erkek", "Onun (erkek) adı"], ["adim", "Adım"]], answer: "kadin", explanation: "ـهَا “onun (kadın)” ekidir." },
      { id: "d15-indi", sourceLesson: "ders-15", topic: "Sahiplik", prompt: "عِنْدِي كِتَابٌ ne demektir?", options: [["var", "Bir kitabım var"], ["yok", "Kitabım yanımda değil"], ["al", "Kitabı yanıma al"]], answer: "var", explanation: "عِنْدَ + zamir sahiplik bildirir: “bende bir kitap var”." },
      { id: "d15-ni", sourceLesson: "ders-15", topic: "Fiile gelen zamir", prompt: "Fiile gelen “beni” eki hangisidir?", options: [["ni", "ـنِي"], ["i", "ـِي"], ["na", "ـنَا"]], answer: "ni", explanation: "يَعْرِفُنِي “beni tanıyor”: fiilde ـنِي kullanılır." },
      { id: "d15-dinukum", sourceLesson: "ders-15", topic: "Kur’an bağlantısı", prompt: "دِينُكُمْ ne demektir?", options: [["dininiz", "Dininiz"], ["dinimiz", "Dinimiz"], ["dinleri", "Onların dini"]], answer: "dininiz", explanation: "دِين + ـكُمْ “sizin” (Kâfirûn 6)." }
    ],
    "ders-17": [
      { id: "d16-fi", sourceLesson: "ders-16", topic: "Harf-i cerler", prompt: "فِي ne demektir?", options: [["de", "-de, içinde"], ["den", "-den"], ["e", "-e"]], answer: "de", explanation: "فِي yer bildirir: فِي الْبَيْتِ “evde”." },
      { id: "d16-mecrur", sourceLesson: "ders-16", topic: "Harf-i cerler", prompt: "Harf-i cerden sonra gelen isim nasıl okunur?", options: [["esre", "Esre"], ["otre", "Ötre"], ["ustun", "Üstün"]], answer: "esre", explanation: "Harf-i cerden sonraki isim mecrurdur." },
      { id: "d16-aleyhi", sourceLesson: "ders-16", topic: "Edat + zamir", prompt: "عَلَيْهِ ne demektir?", options: [["uzerine", "Onun üzerine; ona"], ["ondan", "Ondan"], ["onunla", "Onunla"]], answer: "uzerine", explanation: "عَلَى + ـهُ; zamirle عَلَيْـ olur." },
      { id: "d16-selam", sourceLesson: "ders-16", topic: "Selamlaşma", prompt: "السَّلَامُ عَلَيْكُمْ selamının cevabı hangisidir?", options: [["cevap", "وَعَلَيْكُمُ السَّلَامُ"], ["ila", "السَّلَامُ إِلَيْكُمْ"], ["min", "عَلَيْكُمْ مِنَ السَّلَامِ"]], answer: "cevap", explanation: "“Esenlik sizin de üzerinize olsun.”" },
      { id: "d16-niyet", sourceLesson: "ders-16", topic: "Hadis bağlantısı", prompt: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ ne demektir?", options: [["dogru", "Ameller ancak niyetlere göredir"], ["once", "Ameller niyetten önce gelir"], ["esit", "Niyetler ameldir"]], answer: "dogru", explanation: "بِالنِّيَّاتِ = بِـ + النِّيَّاتِ “niyetlere göre”." }
    ],
    "ders-18": [
      { id: "d17-ikil", sourceLesson: "ders-17", topic: "İkil isim", prompt: "كِتَابَانِ ne demektir?", options: [["iki", "İki kitap"], ["cok", "Kitaplar"], ["bir", "Bir kitap"]], answer: "iki", explanation: "ـَانِ ikil ekidir." },
      { id: "d17-salim", sourceLesson: "ders-17", topic: "Çoğul türleri", prompt: "مُعَلِّمُونَ hangi çoğul türüdür?", options: [["salim", "Sâlim eril çoğul"], ["kirik", "Kırık çoğul"], ["ikil", "İkil"]], answer: "salim", explanation: "Tekil مُعَلِّم bozulmadan ـُونَ almıştır." },
      { id: "d17-kirik", sourceLesson: "ders-17", topic: "Kırık çoğul", prompt: "كِتَابٌ kelimesinin çoğulu hangisidir?", options: [["kutub", "كُتُبٌ"], ["kitabun", "كِتَابُونَ"], ["ketebu", "كَتَبُوا"]], answer: "kutub", explanation: "كِتَابٌ → كُتُبٌ: kırık çoğul." },
      { id: "d17-uyum", sourceLesson: "ders-17", topic: "Çoğulda uyum", prompt: "“Kitaplar yeni.” hangisidir?", options: [["dogru", "الْكُتُبُ جَدِيدَةٌ"], ["cogul", "الْكُتُبُ جَدِيدُونَ"], ["eril", "الْكُتُبُ جَدِيدٌ"]], answer: "dogru", explanation: "İnsan olmayan çoğulun sıfatı dişil tekil olur." },
      { id: "d17-afvac", sourceLesson: "ders-17", topic: "Kur’an bağlantısı", prompt: "أَفْوَاجًا ne demektir?", options: [["boluk", "Bölük bölük"], ["tek", "Tek tek"], ["iki", "İkişer"]], answer: "boluk", explanation: "فَوْجٌ “bölük” kelimesinin kırık çoğulu (Nasr 2)." }
    ],
    "ders-19": [
      { id: "d18-zalike", sourceLesson: "ders-18", topic: "İşaret isimleri", prompt: "ذَلِكَ ne demektir?", options: [["su", "Şu, o · eril"], ["bu", "Bu · eril"], ["bunlar", "Bunlar"]], answer: "su", explanation: "ذَلِكَ uzak, eril tekil işarettir." },
      { id: "d18-tilke", sourceLesson: "ders-18", topic: "İşaret isimleri", prompt: "“Şu okul” hangisidir?", options: [["tilke", "تِلْكَ الْمَدْرَسَةُ"], ["zalike", "ذَلِكَ الْمَدْرَسَةُ"], ["haza", "هَذَا الْمَدْرَسَةُ"]], answer: "tilke", explanation: "مَدْرَسَة dişil; uzak dişil işaret تِلْكَ." },
      { id: "d18-cumle", sourceLesson: "ders-18", topic: "Cümle ve tamlama", prompt: "هَذَا كِتَابٌ ne demektir?", options: [["cumle", "Bu bir kitaptır"], ["tamlama", "Bu kitap"], ["uzak", "Şu kitap"]], answer: "cumle", explanation: "İşaret + belirsiz isim tam bir cümledir." },
      { id: "d18-haulai", sourceLesson: "ders-18", topic: "İşaret isimleri", prompt: "هَؤُلَاءِ hangi isimler için kullanılır?", options: [["insan", "İnsan çoğulu"], ["esya", "İnsan olmayan çoğul"], ["ikil", "İkil"]], answer: "insan", explanation: "İnsan olmayan çoğul için هَذِهِ kullanılır." },
      { id: "d18-bakara", sourceLesson: "ders-18", topic: "Kur’an bağlantısı", prompt: "ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ ne demektir?", options: [["dogru", "O kitap; onda hiç şüphe yoktur"], ["emir", "Bu kitabı şüpheyle oku"], ["ters", "O kitap şüphelidir"]], answer: "dogru", explanation: "Bakara 2; ذَلِكَ yüceliği vurgular." }
    ],
    "ders-20": [
      { id: "d19-lezi", sourceLesson: "ders-19", topic: "İlgi zamirleri", prompt: "الَّذِي ne demektir?", options: [["olan", "… olan (eril tekil)"], ["bu", "Bu"], ["kim", "Kim?"]], answer: "olan", explanation: "الَّذِي eril tekil ilgi zamiridir." },
      { id: "d19-lati", sourceLesson: "ders-19", topic: "İlgi zamirleri", prompt: "“Giden kadın” hangisidir?", options: [["lati", "الْمَرْأَةُ الَّتِي ذَهَبَتْ"], ["lezi", "الْمَرْأَةُ الَّذِي ذَهَبَ"], ["lezine", "الْمَرْأَةُ الَّذِينَ ذَهَبُوا"]], answer: "lati", explanation: "Dişil tekil isim için الَّتِي, fiil de dişil." },
      { id: "d19-aid", sourceLesson: "ders-19", topic: "Dönüş zamiri", prompt: "الْكِتَابُ الَّذِي قَرَأْتُهُ ne demektir?", options: [["okudugum", "Okuduğum kitap"], ["cumle", "Kitabı okudum"], ["okuyan", "Kitabı okuyan"]], answer: "okudugum", explanation: "ـهُ kitaba dönen zamirdir." },
      { id: "d19-ma", sourceLesson: "ders-19", topic: "مَنْ ve مَا", prompt: "اُكْتُبْ مَا تَسْمَعُ ne demektir?", options: [["duydugunu", "Duyduğunu yaz"], ["soru", "Ne duyuyorsun, yaz"], ["olumsuz", "Duymadın, yaz"]], answer: "duydugunu", explanation: "Burada مَا “… olan şey” anlamındadır." },
      { id: "d19-fatiha", sourceLesson: "ders-19", topic: "Kur’an bağlantısı", prompt: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ ne demektir?", options: [["dogru", "Kendilerine nimet verdiklerinin yoluna"], ["yol", "Nimet verdiğin yolda"], ["nimet", "Onların nimetine"]], answer: "dogru", explanation: "الَّذِينَ + sıla; عَلَيْهِمْ dönüş zamiri." }
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
    },
    "ders-08": {
      quran_verb: { answer: "تَعْبُدُونَ", note: "Başta تَـ, sonda ـُونَ: “siz kulluk ediyorsunuz”.", topic: "Kur’an bağlantısı" },
      speaking_neg: { answer: "لَا، لَا أَشْرَبُ الْقَهْوَةَ.", note: "İlk لَا “hayır”, ikincisi fiili olumsuz yapar.", topic: "Olumsuz muzari" },
      speaking_fem: { answer: "هُنَّ يَكْتُبْنَ الدَّرْسَ.", note: "Kadınlar çoğulu: başta يَـ, sonda ـْنَ.", topic: "Muzari tam çekim" }
    },
    "ders-09": {
      quran_verb: { answer: "سَوْفَ تَعْلَمُونَ", note: "سَوْفَ + muzari “siz” biçimi: “bileceksiniz”.", topic: "Kur’an bağlantısı" },
      speaking_future: { answer: "سَأَذْهَبُ إِلَى الْمَدْرَسَةِ غَدًا.", note: "سَـ fiile bitişik yazılır; غَدًا cümlenin başında da olabilir.", topic: "Gelecek zaman" },
      speaking_len: { answer: "لَنْ نَشْرَبَ الْقَهْوَةَ.", note: "لَنْ’den sonra fiilin sonu üstün olur: نَشْرَبَ.", topic: "Olumsuz gelecek" }
    },
    "ders-10": {
      quran_verb: { answer: "عَبَدْتُمْ", note: "Mâzi “siz”: sonda تُمْ. Mushafta عَبَدتُّمْ diye yazılır.", topic: "Kur’an bağlantısı" },
      speaking_story: { answer: "أَمْسِ ذَهَبْتُ إِلَى الْمَدْرَسَةِ. الْيَوْمَ أَكْتُبُ الدَّرْسَ. غَدًا سَأَقْرَأُ الْقُرْآنَ.", note: "Üç cümle, üç zaman: mâzi, muzari, سَـ + muzari.", topic: "Zamanlar karşılaştırması" },
      speaking_neg: { answer: "مَا شَرِبْتُ الْقَهْوَةَ أَمْسِ.", note: "Geçmişin olumsuzu: مَا + mâzi; fiil değişmez.", topic: "Olumsuz geçmiş" }
    },
    "ders-11": {
      quran_verb: { answer: "اقْرَأْ", note: "Muzari يَقْرَأُ → emir اِقْرَأْ “oku!”. Mushafta baştaki elif vasl işaretiyle yazılır.", topic: "Kur’an bağlantısı" },
      speaking_open: { answer: "اِفْتَحِ الْبَابَ.", note: "Sakin ح, ال’den önce esre alır: “iftahi’l-bâb”.", topic: "Emir" },
      speaking_go: { answer: "اِذْهَبُوا إِلَى الْمَسْجِدِ.", note: "Topluluğa emir sonda ـُوا alır; elif okunmaz.", topic: "Emir çekimi" }
    },
    "ders-12": {
      quran_verb: { answer: "لَا تَحْزَنْ", note: "لَا + تَحْزَنْ; sonu sakin olduğu için yasak bildirir: “üzülme”.", topic: "Kur’an bağlantısı" },
      speaking_nehy: { answer: "لَا تَذْهَبْ إِلَى السُّوقِ.", note: "Nehiyde muzarinin تَـ’si kalır, son harf sakin olur.", topic: "Nehiy" },
      speaking_lem: { answer: "لَمْ أَشْرَبِ الْقَهْوَةَ أَمْسِ.", note: "لَمْ + أَشْرَبْ; ال’den önce esre okunur. أَمْسِ başta da olabilir.", topic: "لَمْ ile olumsuz geçmiş" }
    },
    "ders-13": {
      quran_word: { answer: "كَيْفَ", note: "“Nasıl?” sorusu; burada “nasıl/ne şekilde” anlamında cümle içinde kullanılmış.", topic: "Kur’an bağlantısı" },
      speaking_where: { answer: "إِلَى أَيْنَ تَذْهَبُ؟", note: "إِلَى + أَيْنَ “nereye?”; tek başına أَيْنَ تَذْهَبُ؟ da günlük dilde anlaşılır.", topic: "Soru kelimeleri" },
      speaking_when: { answer: "مَتَى سَتَذْهَبُ إِلَى الْمَدْرَسَةِ؟", note: "مَتَى + gelecek zaman (Ders 09).", topic: "Soru kelimeleri" }
    },
    "ders-14": {
      quran_chain: { answer: "مَالِكِ يَوْمِ الدِّينِ", note: "Üç isim: mâlik (sahip) + yevm (gün) + dîn (hesap). Ortadaki يَوْمِ hem ال almaz hem esredir.", topic: "Kur’an bağlantısı" },
      speaking_book: { answer: "هَذَا كِتَابُ الطَّالِبِ.", note: "كِتَابُ ال almaz; الطَّالِبِ esredir.", topic: "İsim tamlaması" },
      speaking_door: { answer: "فَتَحْتُ بَابَ الْمَسْجِدِ.", note: "بَابَ nesne olduğu için üstün; الْمَسْجِدِ tamlama nedeniyle esre.", topic: "İsim tamlaması" }
    },
    "ders-15": {
      quran_word: { answer: "دِينُكُمْ", note: "دِين + ـكُمْ “sizin”: dininiz.", topic: "Kur’an bağlantısı" },
      speaking_have: { answer: "عِنْدِي كِتَابٌ جَدِيدٌ.", note: "Sahiplik عِنْدَ + zamir ile kurulur: “bende yeni bir kitap var”.", topic: "Bitişik zamirler" },
      speaking_name: { answer: "اِسْمُهَا فَاطِمَةُ.", note: "اِسْم + ـهَا “onun (kadın)”. فَاطِمَةُ tek ötre alır, tenvin almaz.", topic: "Bitişik zamirler" }
    },
    "ders-16": {
      quran_harf: { answer: "بِـ ، مِنْ", note: "بِرَبِّ kelimesindeki بِـ ve مِنْ شَرِّ’deki مِنْ. İkisinden sonraki isim de esredir.", topic: "Kur’an bağlantısı" },
      speaking_where: { answer: "الْكِتَابُ عَلَى الْمَكْتَبِ.", note: "عَلَى’dan sonra الْمَكْتَبِ esre okunur.", topic: "Harf-i cerler" },
      speaking_pen: { answer: "كَتَبْتُ الدَّرْسَ بِالْقَلَمِ.", note: "Araç bildiren بِـ kelimeye bitişik yazılır; الْقَلَمِ esredir.", topic: "Harf-i cerler" }
    },
    "ders-17": {
      quran_plural: { answer: "أَفْوَاجًا", note: "فَوْجٌ “bölük” kelimesinin kırık çoğulu; üstün tenvin: “efvâcen”.", topic: "Kur’an bağlantısı" },
      speaking_two: { answer: "فِي الْبَيْتِ طَالِبَانِ.", note: "İkil ötre durumunda ـَانِ ile biter; yer bildiren kısım başa geçebilir.", topic: "İkil isim" },
      speaking_books: { answer: "الْكُتُبُ جَدِيدَةٌ.", note: "İnsan olmayan çoğulun sıfatı dişil tekil olur.", topic: "Çoğulda uyum" }
    },
    "ders-18": {
      quran_word: { answer: "ذَلِكَ", note: "Uzak işaret; burada Kur’an’ın yüceliğini vurgular. Mushafta ذَٰلِكَ diye küçük elifle yazılır.", topic: "Kur’an bağlantısı" },
      speaking_that: { answer: "ذَلِكَ الرَّجُلُ مُعَلِّمٌ.", note: "ذَلِكَ الرَّجُلُ “şu adam” öznedir; مُعَلِّمٌ belirsiz yüklemdir.", topic: "İşaret isimleri" },
      speaking_these: { answer: "هَؤُلَاءِ طُلَّابٌ مُجْتَهِدُونَ.", note: "İnsan çoğulu için هَؤُلَاءِ; sıfat da çoğul.", topic: "İşaret isimleri" }
    },
    "ders-19": {
      quran_word: { answer: "الَّذِينَ", note: "Eril çoğul ilgi zamiri; sıla cümlesi أَنْعَمْتَ عَلَيْهِمْ “kendilerine nimet verdiğin”.", topic: "Kur’an bağlantısı" },
      speaking_who: { answer: "الطَّالِبُ الَّذِي كَتَبَ الدَّرْسَ مُجْتَهِدٌ.", note: "الَّذِي + sıla; yüklem مُجْتَهِدٌ en sonda. يَكْتُبُ ile “yazan” da olur.", topic: "İlgi zamirleri" },
      speaking_book: { answer: "الْكِتَابُ الَّذِي قَرَأْتُهُ جَدِيدٌ.", note: "قَرَأْتُهُ’daki ـهُ kitaba dönen zamirdir.", topic: "Dönüş zamiri" }
    },
    "ders-20": {
      quran_word: { answer: "الْحَمْدُ", note: "Cümlenin başı (mübtedâ) olduğu için merfû: ötre.", topic: "Kur’an bağlantısı" },
      speaking_irab: { answer: "قَرَأَ الْمُعَلِّمُ الْكِتَابَ فِي الْمَسْجِدِ.", note: "Fâil ötre, nesne üstün, harf-i cerden sonra esre.", topic: "İ‘râb" },
      speaking_want: { answer: "أُرِيدُ أَنْ أَتَعَلَّمَ الْعَرَبِيَّةَ.", note: "أَنْ’den sonra muzari mansûb: أَتَعَلَّمَ. الْعَرَبِيَّةَ nesnedir.", topic: "Fiilde i‘râb" }
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
    "ders-07:alistirma-2": "Muzari şimdiki veya geniş zaman olabilir; الآنَ ve كُلَّ يَوْمٍ gibi bağlam kelimelerini ara.",
    "ders-08:alistirma-1": "Önce başlangıç harfine (أ، ن، ت، ي), sonra sondaki eke bak: ـَانِ ikil, ـُونَ eril çoğul, ـِينَ kadın sen, ـْنَ kadınlar çoğulu.",
    "ders-08:alistirma-2": "لَا muzari fiili olumsuz yapar ama fiilin biçimine dokunmaz; tek başına “hayır” da demektir.",
    "ders-09:alistirma-1": "Gelecek = سَـ (bitişik) veya سَوْفَ (ayrı) + muzari. Fiilin geri kalanı muzaridekiyle aynıdır.",
    "ders-09:alistirma-2": "لَنْ ile سَـ birlikte kullanılmaz; لَنْ’den sonra fiilin sonu üstün olur, ـُونَ / ـِينَ / ـَانِ’deki ن düşer.",
    "ders-10:alistirma-1": "Fiilin başına bak: سَـ gelecek, أ/ن/ت/ي muzari; şahıs eki sonda ise mâzi. أَمْسِ، الآنَ، غَدًا ipucu verir.",
    "ders-10:alistirma-2": "Geçmiş: مَا + mâzi · şimdiki/geniş: لَا + muzari · gelecek: لَنْ + muzari (sonu üstün).",
    "ders-11:alistirma-1": "Emir muzari “sen” biçiminden yapılır: baştaki تَـ düşer, sonu sükûn olur ya da ن düşer. Orta harf ötreliyse başa اُ, değilse اِ gelir.",
    "ders-11:alistirma-2": "Hemze-i vasl yalnızca söze onunla başlanınca okunur: وَاكْتُبْ “vektub”. Sakin son harf ال’den önce esre alır: اِفْتَحِ الْبَابَ.",
    "ders-12:alistirma-1": "لَا + muzari “sen” biçimi: son harf sükûnsa yasak (yapma!), ötreyse bilgi (yapmıyorsun). لَمْ her zaman geçmişi olumsuz yapar.",
    "ders-12:alistirma-2": "Cezmde son harf sakin olur; ـِينَ / ـَانِ / ـُونَ eklerindeki ن düşer. Sakin harf ال’den önce esre okunur.",
    "ders-13:alistirma-1": "Soru kelimesi cümlenin başına gelir: مَنْ kim, مَا / مَاذَا ne, أَيْنَ nerede, مَتَى ne zaman, كَيْفَ nasıl, لِمَاذَا neden, كَمْ kaç.",
    "ders-13:alistirma-2": "Cevap sorunun türüne uymalı: مَنْ’e kişi, أَيْنَ’e yer, مَتَى’ye zaman. أَلَمْ olumsuz sorudur: “…-medin mi?”",
    "ders-14:alistirma-1": "İzafette birinci isim ال ve tenvin almaz; ikinci ismin sonu esredir. Türkçeye sondan başa çevir: كِتَابُ الطَّالِبِ “öğrencinin kitabı”.",
    "ders-14:alistirma-2": "Birinci ismin son harekesi cümledeki görevine göre değişir; ikinci isim hep esre kalır. Zincirde ortadaki isim hem ال almaz hem esre okunur.",
    "ders-15:alistirma-1": "Sondaki eke bak: ـِي ben, ـكَ / ـكِ sen, ـهُ / ـهَا o, ـنَا biz, ـكُمْ siz, ـهُمْ onlar. Zamirli isim ال almaz.",
    "ders-15:alistirma-2": "Esre veya ي’den sonra ـهُ → ـهِ, ـهُمْ → ـهِمْ okunur. Fiile gelen “beni” eki ـنِي’dir. عِنْدِي “bende” sahiplik bildirir.",
    "ders-16:alistirma-1": "Harf-i cerden sonraki isim mecrurdur: esre ya da esreli tenvin alır. بِـ، لِـ، كَـ kelimeye bitişik yazılır.",
    "ders-16:alistirma-2": "عَلَى ve إِلَى zamirle عَلَيْـ / إِلَيْـ olur. Fiillerin sevdiği edatlar vardır: ذَهَبَ إِلَى، خَرَجَ مِنْ، جَلَسَ عَلَى.",
    "ders-17:alistirma-1": "İkil ـَانِ / ـَيْنِ, sâlim eril çoğul ـُونَ / ـِينَ, sâlim dişil çoğul ـَاتٌ ile biter. Ek yoksa ve kelimenin içi değişmişse kırık çoğuldur.",
    "ders-17:alistirma-2": "Öznede ـَانِ / ـُونَ; nesnede ve harf-i cerden sonra ـَيْنِ / ـِينَ kullanılır. İnsan olmayan çoğul dişil tekil gibi davranır: هَذِهِ كُتُبٌ جَدِيدَةٌ.",
    "ders-18:alistirma-1": "Yakın: هَذَا / هَذِهِ / هَذَانِ / هَؤُلَاءِ; uzak: ذَلِكَ / تِلْكَ / أُولَئِكَ. Cinsiyet ve sayı, gösterilen isme uyar.",
    "ders-18:alistirma-2": "İşaret + belirsiz isim bir cümledir (هَذَا كِتَابٌ “bu bir kitaptır”); işaret + ال’li isim tamlamadır (هَذَا الْكِتَابُ “bu kitap”). İnsan olmayan çoğul için هَذِهِ / تِلْكَ kullanılır.",
    "ders-19:alistirma-1": "الَّذِي eril tekil, الَّتِي dişil tekil ve insan olmayan çoğul, الَّذِينَ eril çoğul, اللَّاتِي dişil çoğul içindir. Türkçeye -en / -an veya -dığı ile çevir.",
    "ders-19:alistirma-2": "Nesneyi anlatan sıla cümlesi isme dönen bir zamir taşır: الْكِتَابُ الَّذِي قَرَأْتُهُ. Belirsiz isimden sonra الَّذِي gelmez: كِتَابٌ قَرَأْتُهُ.",
    "ders-20:alistirma-1": "Merfû: ötre (özne, cümlenin başı ve yüklemi). Mansûb: üstün (nesne, إِنَّ’den sonra). Mecrûr: esre (harf-i cerden sonra, tamlamanın ikinci ismi).",
    "ders-20:alistirma-2": "Önce fiili ve harfleri ayır; sonra her isme görevini sor. Fiilde لَنْ / أَنْ mansûb, لَمْ / nehiy لَا meczûm yapar."
  };

  const BREAKDOWN_LESSONS = new Set(["ders-01", "ders-02", "ders-03", "ders-04", "ders-05", "ders-06", "ders-07", "ders-08", "ders-09", "ders-10", "ders-11", "ders-12", "ders-13", "ders-14", "ders-15", "ders-16", "ders-17", "ders-18", "ders-19", "ders-20"]);

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
    "هَلْ تَقْرَأُ الْمَجَلَّةَ؟": [{"w": "هَلْ", "t": "…mı? / …mi?", "r": "soru", "n": "Cevabı evet-hayır olan soruyu kurar; cümlenin başına gelir."}, {"w": "تَقْرَأُ", "t": "okuyorsun", "r": "fiil", "n": "Baştaki tê “sen (erkek)”."}, {"w": "الْمَجَلَّةَ", "t": "dergiyi", "r": "isim", "n": "İşten etkilenen (nesne) olduğu için sonu üstün."}],
    "الطَّالِبَانِ يَكْتُبَانِ الدَّرْسَ.": [{"w": "الطَّالِبَانِ", "t": "iki öğrenci", "r": "isim", "n": "طَالِبٌ + ـَانِ: ismin ikili (iki kişi) biçimi."}, {"w": "يَكْتُبَانِ", "t": "yazıyorlar (ikisi)", "r": "fiil", "n": "Muzari: başta يَـ, sonda ـَانِ → “o ikisi (erkek)”."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başlar: “ed-darse”. Nesne olduğu için sonu üstün."}],
    "الطَّالِبَتَانِ تَكْتُبَانِ الرِّسَالَةَ.": [{"w": "الطَّالِبَتَانِ", "t": "iki kadın öğrenci", "r": "isim", "n": "طَالِبَةٌ + ـَانِ: dişil ismin ikili biçimi; ة, ت olarak açılır."}, {"w": "تَكْتُبَانِ", "t": "yazıyorlar (ikisi)", "r": "fiil", "n": "Muzari: başta تَـ, sonda ـَانِ → burada “o iki kadın”."}, {"w": "الرِّسَالَةَ", "t": "mektubu", "r": "isim", "n": "Şemsî harfle başlar: “er-risâlete”. Nesne olduğu için sonu üstün."}],
    "أَنْتُمَا تَذْهَبَانِ إِلَى الْمَدْرَسَةِ.": [{"w": "أَنْتُمَا", "t": "siz ikiniz", "r": "zamir", "n": "2. şahıs ikil zamiri; erkek ve kadın için aynıdır."}, {"w": "تَذْهَبَانِ", "t": "gidiyorsunuz (ikiniz)", "r": "fiil", "n": "Muzari: başta تَـ, sonda ـَانِ → “siz ikiniz”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "هُنَّ يَقْرَأْنَ الْقُرْآنَ.": [{"w": "هُنَّ", "t": "onlar (kadınlar)", "r": "zamir", "n": "3. şahıs dişil çoğul zamiri."}, {"w": "يَقْرَأْنَ", "t": "okuyorlar (kadınlar)", "r": "fiil", "n": "Muzari: başta يَـ, sonda ـْنَ → “onlar (kadınlar)”. Son kök harf sükûnlu."}, {"w": "الْقُرْآنَ", "t": "Kur’an’ı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "أَنْتُنَّ تَكْتُبْنَ الْوَاجِبَ.": [{"w": "أَنْتُنَّ", "t": "siz (kadınlar)", "r": "zamir", "n": "2. şahıs dişil çoğul zamiri."}, {"w": "تَكْتُبْنَ", "t": "yazıyorsunuz (kadınlar)", "r": "fiil", "n": "Muzari: başta تَـ, sonda ـْنَ → “siz (kadınlar)”."}, {"w": "الْوَاجِبَ", "t": "ödevi", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "الطَّالِبَاتُ يَكْتُبْنَ الدَّرْسَ.": [{"w": "الطَّالِبَاتُ", "t": "kadın öğrenciler", "r": "isim", "n": "طَالِبَةٌ’nin çoğulu: ـَاتٌ eki. Cümlenin öznesi olduğu için sonu ötre."}, {"w": "يَكْتُبْنَ", "t": "yazıyorlar (kadınlar)", "r": "fiil", "n": "Muzari: başta يَـ, sonda ـْنَ → “onlar (kadınlar)”."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başlar: “ed-darse”. Nesne olduğu için sonu üstün."}],
    "لَا أَشْرَبُ الْقَهْوَةَ.": [{"w": "لَا", "t": "-maz / -mıyor", "r": "harf", "n": "Muzari fiilin önünde olumsuzluk: “-mıyor, -maz”. Fiilin biçimi değişmez."}, {"w": "أَشْرَبُ", "t": "içerim", "r": "fiil", "n": "Muzari, başta أَ → “ben”."}, {"w": "الْقَهْوَةَ", "t": "kahveyi", "r": "isim", "n": "قَهْوَةٌ “kahve” dişil bir isimdir. Nesne olduğu için sonu üstün."}],
    "لَا نَذْهَبُ إِلَى السُّوقِ.": [{"w": "لَا", "t": "-maz / -mıyor", "r": "harf", "n": "Muzari fiilin önünde olumsuzluk: “-mıyor, -maz”. Fiilin biçimi değişmez."}, {"w": "نَذْهَبُ", "t": "gideriz", "r": "fiil", "n": "Muzari, başta نَـ → “biz”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra geldiği için sonu esre."}],
    "هُوَ لَا يَأْكُلُ الْخُبْزَ.": [{"w": "هُوَ", "t": "o (erkek)", "r": "zamir", "n": "3. tekil eril zamir."}, {"w": "لَا", "t": "-maz / -mıyor", "r": "harf", "n": "Muzari fiilin önünde olumsuzluk: “-mıyor, -maz”. Fiilin biçimi değişmez."}, {"w": "يَأْكُلُ", "t": "yer", "r": "fiil", "n": "Muzari, başta يَـ → “o (erkek)”."}, {"w": "الْخُبْزَ", "t": "ekmeği", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "هِيَ لَا تَكْتُبُ الرِّسَالَةَ.": [{"w": "هِيَ", "t": "o (kadın)", "r": "zamir", "n": "3. tekil dişil zamir."}, {"w": "لَا", "t": "-maz / -mıyor", "r": "harf", "n": "Muzari fiilin önünde olumsuzluk: “-mıyor, -maz”. Fiilin biçimi değişmez."}, {"w": "تَكْتُبُ", "t": "yazar", "r": "fiil", "n": "Muzari, başta تَـ; zamir هِيَ olduğu için “o (kadın)”."}, {"w": "الرِّسَالَةَ", "t": "mektubu", "r": "isim", "n": "Şemsî harfle başlar: “er-risâlete”. Nesne olduğu için sonu üstün."}],
    "أَنْتِ لَا تَشْرَبِينَ الْمَاءَ.": [{"w": "أَنْتِ", "t": "sen (kadın)", "r": "zamir", "n": "2. tekil dişil zamir."}, {"w": "لَا", "t": "-maz / -mıyor", "r": "harf", "n": "Muzari fiilin önünde olumsuzluk: “-mıyor, -maz”. Fiilin biçimi değişmez."}, {"w": "تَشْرَبِينَ", "t": "içersin (kadın)", "r": "fiil", "n": "Muzari: başta تَـ, sonda ـِينَ → “sen (kadın)”."}, {"w": "الْمَاءَ", "t": "suyu", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "هُمْ لَا يَذْهَبُونَ إِلَى السُّوقِ.": [{"w": "هُمْ", "t": "onlar", "r": "zamir", "n": "3. çoğul eril/karma zamir."}, {"w": "لَا", "t": "-maz / -mıyor", "r": "harf", "n": "Muzari fiilin önünde olumsuzluk: “-mıyor, -maz”. Fiilin biçimi değişmez."}, {"w": "يَذْهَبُونَ", "t": "giderler", "r": "fiil", "n": "Muzari: başta يَـ, sonda ـُونَ → “onlar (erkek/karma)”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra geldiği için sonu esre."}],
    "هَلْ تَكْتُبَانِ الدَّرْسَ؟": [{"w": "هَلْ", "t": "mı / mi?", "r": "soru", "n": "Evet-hayır sorusu yapan edat."}, {"w": "تَكْتُبَانِ", "t": "yazıyorsunuz (ikiniz)", "r": "fiil", "n": "Muzari: başta تَـ, sonda ـَانِ → burada “siz ikiniz”."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başlar: “ed-darse”. Nesne olduğu için sonu üstün."}],
    "لَا، لَا أَشْرَبُ الْقَهْوَةَ.": [{"w": "لَا،", "t": "hayır", "r": "harf", "n": "Tek başına cevap olarak “hayır”."}, {"w": "لَا", "t": "-maz / -mıyor", "r": "harf", "n": "Muzari fiilin önünde olumsuzluk: “-mıyor, -maz”. Fiilin biçimi değişmez."}, {"w": "أَشْرَبُ", "t": "içerim", "r": "fiil", "n": "Muzari, başta أَ → “ben”."}, {"w": "الْقَهْوَةَ", "t": "kahveyi", "r": "isim", "n": "قَهْوَةٌ “kahve” dişil bir isimdir. Nesne olduğu için sonu üstün."}],
    "الرَّجُلَانِ يَجْلِسَانِ فِي الْغُرْفَةِ.": [{"w": "الرَّجُلَانِ", "t": "iki adam", "r": "isim", "n": "رَجُلٌ + ـَانِ: ismin ikili biçimi. Şemsî harf: “er-raculâni”."}, {"w": "يَجْلِسَانِ", "t": "oturuyorlar (ikisi)", "r": "fiil", "n": "Muzari: başta يَـ, sonda ـَانِ → “o ikisi (erkek)”."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْغُرْفَةِ", "t": "oda", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "الْبَنَاتُ يَلْعَبْنَ فِي الْحَدِيقَةِ.": [{"w": "الْبَنَاتُ", "t": "kızlar", "r": "isim", "n": "بِنْتٌ “kız”ın çoğulu. Grupta yalnız kızlar olduğu için fiil ـْنَ alır."}, {"w": "يَلْعَبْنَ", "t": "oynuyorlar (kadınlar)", "r": "fiil", "n": "Muzari: başta يَـ, sonda ـْنَ → “onlar (kadınlar)”."}, {"w": "فِي", "t": "-de / içinde", "r": "harf", "n": "Yer bildiren edat. Kendinden sonraki ismin sonu esre olur."}, {"w": "الْحَدِيقَةِ", "t": "bahçe", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "سَأَكْتُبُ الدَّرْسَ غَدًا.": [{"w": "سَأَكْتُبُ", "t": "yazacağım", "r": "fiil", "n": "سَـ + أَكْتُبُ: muzarinin önüne gelen سَـ geleceği gösterir. أَ → “ben”."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başlar: “ed-darse”. Nesne olduğu için sonu üstün."}, {"w": "غَدًا", "t": "yarın", "r": "isim", "n": "Zaman bildiren isim; gelecek zamanla kullanılır."}],
    "سَنَذْهَبُ إِلَى الْمَسْجِدِ.": [{"w": "سَنَذْهَبُ", "t": "gideceğiz", "r": "fiil", "n": "سَـ + نَذْهَبُ: gelecek; نَـ → “biz”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "أَنْتَ سَتَقْرَأُ الْكِتَابَ.": [{"w": "أَنْتَ", "t": "sen (erkek)", "r": "zamir", "n": "2. tekil eril zamir."}, {"w": "سَتَقْرَأُ", "t": "okuyacaksın", "r": "fiil", "n": "سَـ + تَقْرَأُ: gelecek; zamir أَنْتَ olduğu için “sen (erkek)”."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "أَنْتِ سَتَكْتُبِينَ رِسَالَةً.": [{"w": "أَنْتِ", "t": "sen (kadın)", "r": "zamir", "n": "2. tekil dişil zamir."}, {"w": "سَتَكْتُبِينَ", "t": "yazacaksın (kadın)", "r": "fiil", "n": "سَـ + تَكْتُبِينَ: gelecek; sondaki ـِينَ → “sen (kadın)”."}, {"w": "رِسَالَةً", "t": "bir mektup", "r": "isim", "n": "Belirsiz nesne: üstün tenvin, “risâleten”."}],
    "هُوَ سَيَشْرَبُ الْمَاءَ.": [{"w": "هُوَ", "t": "o (erkek)", "r": "zamir", "n": "3. tekil eril zamir."}, {"w": "سَيَشْرَبُ", "t": "içecek", "r": "fiil", "n": "سَـ + يَشْرَبُ: gelecek; يَـ → “o (erkek)”."}, {"w": "الْمَاءَ", "t": "suyu", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "هِيَ سَتَفْتَحُ الْبَابَ.": [{"w": "هِيَ", "t": "o (kadın)", "r": "zamir", "n": "3. tekil dişil zamir."}, {"w": "سَتَفْتَحُ", "t": "açacak", "r": "fiil", "n": "سَـ + تَفْتَحُ: gelecek; zamir هِيَ olduğu için “o (kadın)”."}, {"w": "الْبَابَ", "t": "kapıyı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "سَيَذْهَبُونَ إِلَى السُّوقِ غَدًا.": [{"w": "سَيَذْهَبُونَ", "t": "gidecekler", "r": "fiil", "n": "سَـ + يَذْهَبُونَ: gelecek; يَـ...ـُونَ → “onlar”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra geldiği için sonu esre."}, {"w": "غَدًا", "t": "yarın", "r": "isim", "n": "Zaman bildiren isim; gelecek zamanla kullanılır."}],
    "سَوْفَ نَقْرَأُ الْقُرْآنَ.": [{"w": "سَوْفَ", "t": "-ecek / -acak", "r": "harf", "n": "Gelecek işareti; fiilden ayrı yazılır."}, {"w": "نَقْرَأُ", "t": "okuruz", "r": "fiil", "n": "Muzari, نَـ → “biz”. سَوْفَ ile birlikte “okuyacağız”."}, {"w": "الْقُرْآنَ", "t": "Kur’an’ı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "كَلَّا سَوْفَ تَعْلَمُونَ.": [{"w": "كَلَّا", "t": "hayır, asla", "r": "harf", "n": "Güçlü reddetme ve uyarı edatı."}, {"w": "سَوْفَ", "t": "-ecek / -acak", "r": "harf", "n": "Gelecek işareti; fiilden ayrı yazılır."}, {"w": "تَعْلَمُونَ", "t": "bilirsiniz", "r": "fiil", "n": "Muzari: تَـ...ـُونَ → “siz”. سَوْفَ ile “bileceksiniz”."}],
    "لَنْ أَشْرَبَ الْقَهْوَةَ.": [{"w": "لَنْ", "t": "-meyecek", "r": "harf", "n": "Geleceği olumsuz yapar; fiilin sonunu üstün yapar, sondaki ن çoğu biçimde düşer."}, {"w": "أَشْرَبَ", "t": "içmek (ben)", "r": "fiil", "n": "أَشْرَبُ’nun sonu لَنْ yüzünden üstün olmuş: “eşrabe”."}, {"w": "الْقَهْوَةَ", "t": "kahveyi", "r": "isim", "n": "قَهْوَةٌ “kahve” dişil bir isimdir. Nesne olduğu için sonu üstün."}],
    "لَنْ نَذْهَبَ إِلَى السُّوقِ.": [{"w": "لَنْ", "t": "-meyecek", "r": "harf", "n": "Geleceği olumsuz yapar; fiilin sonunu üstün yapar, sondaki ن çoğu biçimde düşer."}, {"w": "نَذْهَبَ", "t": "gitmek (biz)", "r": "fiil", "n": "نَذْهَبُ’nun sonu لَنْ yüzünden üstün olmuş."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra geldiği için sonu esre."}],
    "لَنْ يَذْهَبُوا إِلَى الْمَدْرَسَةِ غَدًا.": [{"w": "لَنْ", "t": "-meyecek", "r": "harf", "n": "Geleceği olumsuz yapar; fiilin sonunu üstün yapar, sondaki ن çoğu biçimde düşer."}, {"w": "يَذْهَبُوا", "t": "gitmek (onlar)", "r": "fiil", "n": "يَذْهَبُونَ’nun sonundaki ن لَنْ yüzünden düşmüş; okunmayan elif yazılmış."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}, {"w": "غَدًا", "t": "yarın", "r": "isim", "n": "Zaman bildiren isim; gelecek zamanla kullanılır."}],
    "لَنْ تَكْتُبِي الرِّسَالَةَ.": [{"w": "لَنْ", "t": "-meyecek", "r": "harf", "n": "Geleceği olumsuz yapar; fiilin sonunu üstün yapar, sondaki ن çoğu biçimde düşer."}, {"w": "تَكْتُبِي", "t": "yazmak (sen, kadın)", "r": "fiil", "n": "تَكْتُبِينَ’nin sonundaki ـنَ لَنْ yüzünden düşmüş."}, {"w": "الرِّسَالَةَ", "t": "mektubu", "r": "isim", "n": "Şemsî harfle başlar: “er-risâlete”. Nesne olduğu için sonu üstün."}],
    "مَاذَا سَتَفْعَلُ غَدًا؟": [{"w": "مَاذَا", "t": "ne?", "r": "soru", "n": "Fiilden önce gelen “ne?” sorusu."}, {"w": "سَتَفْعَلُ", "t": "yapacaksın", "r": "fiil", "n": "سَـ + تَفْعَلُ (yapar): gelecek; burada “sen (erkek)”."}, {"w": "غَدًا", "t": "yarın", "r": "isim", "n": "Zaman bildiren isim; gelecek zamanla kullanılır."}],
    "سَأَذْهَبُ إِلَى الْمَسْجِدِ، إِنْ شَاءَ اللَّهُ.": [{"w": "سَأَذْهَبُ", "t": "gideceğim", "r": "fiil", "n": "سَـ + أَذْهَبُ: gelecek; أَ → “ben”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ،", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}, {"w": "إِنْ", "t": "eğer", "r": "harf", "n": "Şart edatı."}, {"w": "شَاءَ", "t": "diledi", "r": "fiil", "n": "Mâzi; إِنْ ile “dilerse” anlamı alır."}, {"w": "اللَّهُ", "t": "Allah", "r": "isim", "n": "Fiilin öznesi; sonu ötre."}],
    "لَا، لَنْ أَكْتُبَ الرِّسَالَةَ الْيَوْمَ.": [{"w": "لَا،", "t": "hayır", "r": "harf", "n": "Tek başına cevap olarak “hayır”."}, {"w": "لَنْ", "t": "-meyecek", "r": "harf", "n": "Geleceği olumsuz yapar; fiilin sonunu üstün yapar, sondaki ن çoğu biçimde düşer."}, {"w": "أَكْتُبَ", "t": "yazmak (ben)", "r": "fiil", "n": "أَكْتُبُ’nun sonu لَنْ yüzünden üstün olmuş."}, {"w": "الرِّسَالَةَ", "t": "mektubu", "r": "isim", "n": "Şemsî harfle başlar: “er-risâlete”. Nesne olduğu için sonu üstün."}, {"w": "الْيَوْمَ", "t": "bugün", "r": "isim", "n": "“Gün” kelimesinin belirli ve üstünlü hâli: “bugün”."}],
    "أَمْسِ كَتَبْتُ رِسَالَةً.": [{"w": "أَمْسِ", "t": "dün", "r": "isim", "n": "Zaman bildiren isim; geçmiş zamanla kullanılır. Sonu her zaman esredir: “emsi”."}, {"w": "كَتَبْتُ", "t": "yazdım", "r": "fiil", "n": "Mâzi; sondaki تُ → “ben”."}, {"w": "رِسَالَةً", "t": "bir mektup", "r": "isim", "n": "Belirsiz nesne: üstün tenvin, “risâleten”."}],
    "الآنَ أَكْتُبُ رِسَالَةً.": [{"w": "الآنَ", "t": "şimdi", "r": "isim", "n": "Zaman bildiren isim; şimdiki zamanı belirginleştirir."}, {"w": "أَكْتُبُ", "t": "yazıyorum", "r": "fiil", "n": "Muzari; baştaki أَ → “ben”."}, {"w": "رِسَالَةً", "t": "bir mektup", "r": "isim", "n": "Belirsiz nesne: üstün tenvin, “risâleten”."}],
    "غَدًا سَأَكْتُبُ رِسَالَةً.": [{"w": "غَدًا", "t": "yarın", "r": "isim", "n": "Zaman bildiren isim; gelecek zamanla kullanılır."}, {"w": "سَأَكْتُبُ", "t": "yazacağım", "r": "fiil", "n": "سَـ + أَكْتُبُ: gelecek."}, {"w": "رِسَالَةً", "t": "bir mektup", "r": "isim", "n": "Belirsiz nesne: üstün tenvin, “risâleten”."}],
    "ذَهَبْنَا إِلَى السُّوقِ أَمْسِ.": [{"w": "ذَهَبْنَا", "t": "gittik", "r": "fiil", "n": "Mâzi; sondaki نَا → “biz”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra geldiği için sonu esre."}, {"w": "أَمْسِ", "t": "dün", "r": "isim", "n": "Zaman bildiren isim; geçmiş zamanla kullanılır. Sonu her zaman esredir: “emsi”."}],
    "سَنَذْهَبُ إِلَى الْمَدْرَسَةِ غَدًا.": [{"w": "سَنَذْهَبُ", "t": "gideceğiz", "r": "fiil", "n": "سَـ + نَذْهَبُ: gelecek; نَـ → “biz”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}, {"w": "غَدًا", "t": "yarın", "r": "isim", "n": "Zaman bildiren isim; gelecek zamanla kullanılır."}],
    "مَا شَرِبْتُ الْقَهْوَةَ أَمْسِ.": [{"w": "مَا", "t": "-medi / -madı", "r": "harf", "n": "Mâzi fiilin önünde olumsuzluk: “-medi”. Fiil değişmez."}, {"w": "شَرِبْتُ", "t": "içtim", "r": "fiil", "n": "Mâzi; sondaki تُ → “ben”. مَا ile “içmedim”."}, {"w": "الْقَهْوَةَ", "t": "kahveyi", "r": "isim", "n": "قَهْوَةٌ “kahve” dişil bir isimdir. Nesne olduğu için sonu üstün."}, {"w": "أَمْسِ", "t": "dün", "r": "isim", "n": "Zaman bildiren isim; geçmiş zamanla kullanılır. Sonu her zaman esredir: “emsi”."}],
    "مَا شَرِبْتُ الْقَهْوَةَ.": [{"w": "مَا", "t": "-medi / -madı", "r": "harf", "n": "Mâzi fiilin önünde olumsuzluk: “-medi”. Fiil değişmez."}, {"w": "شَرِبْتُ", "t": "içtim", "r": "fiil", "n": "Mâzi; sondaki تُ → “ben”. مَا ile “içmedim”."}, {"w": "الْقَهْوَةَ", "t": "kahveyi", "r": "isim", "n": "قَهْوَةٌ “kahve” dişil bir isimdir. Nesne olduğu için sonu üstün."}],
    "قَرَأَتْ فَاطِمَةُ الْكِتَابَ أَمْسِ.": [{"w": "قَرَأَتْ", "t": "okudu (kadın)", "r": "fiil", "n": "Mâzi; sondaki sakin تْ → “o (kadın)”."}, {"w": "فَاطِمَةُ", "t": "Fatıma", "r": "isim", "n": "Özel isim; işi yapan."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}, {"w": "أَمْسِ", "t": "dün", "r": "isim", "n": "Zaman bildiren isim; geçmiş zamanla kullanılır. Sonu her zaman esredir: “emsi”."}],
    "تَقْرَأُ فَاطِمَةُ الْكِتَابَ الآنَ.": [{"w": "تَقْرَأُ", "t": "okuyor (kadın)", "r": "fiil", "n": "Muzari; baştaki تَـ burada “o (kadın)”."}, {"w": "فَاطِمَةُ", "t": "Fatıma", "r": "isim", "n": "Özel isim; işi yapan."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}, {"w": "الآنَ", "t": "şimdi", "r": "isim", "n": "Zaman bildiren isim; şimdiki zamanı belirginleştirir."}],
    "سَتَقْرَأُ فَاطِمَةُ الْكِتَابَ غَدًا.": [{"w": "سَتَقْرَأُ", "t": "okuyacak (kadın)", "r": "fiil", "n": "سَـ + تَقْرَأُ: gelecek; burada “o (kadın)”."}, {"w": "فَاطِمَةُ", "t": "Fatıma", "r": "isim", "n": "Özel isim; işi yapan."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}, {"w": "غَدًا", "t": "yarın", "r": "isim", "n": "Zaman bildiren isim; gelecek zamanla kullanılır."}],
    "مَا ذَهَبُوا إِلَى الْمَسْجِدِ.": [{"w": "مَا", "t": "-medi / -madı", "r": "harf", "n": "Mâzi fiilin önünde olumsuzluk: “-medi”. Fiil değişmez."}, {"w": "ذَهَبُوا", "t": "gittiler", "r": "fiil", "n": "Mâzi; sondaki وا → “onlar”. مَا ile “gitmediler”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "لَا يَكْتُبُ، وَلَنْ يَكْتُبَ.": [{"w": "لَا", "t": "-maz / -mıyor", "r": "harf", "n": "Muzari fiilin önünde olumsuzluk: “-mıyor, -maz”. Fiilin biçimi değişmez."}, {"w": "يَكْتُبُ،", "t": "yazar", "r": "fiil", "n": "Muzari; لَا fiili değiştirmez."}, {"w": "وَ", "t": "ve", "r": "harf", "n": "Bağlaç; sonraki kelimeye bitişik yazılır."}, {"w": "لَنْ", "t": "-meyecek", "r": "harf", "n": "Geleceği olumsuz yapar."}, {"w": "يَكْتُبَ", "t": "yazmak (o)", "r": "fiil", "n": "لَنْ yüzünden sonu üstün: “yektube”."}],
    "مَاذَا فَعَلْتَ أَمْسِ؟": [{"w": "مَاذَا", "t": "ne?", "r": "soru", "n": "Fiilden önce gelen “ne?” sorusu."}, {"w": "فَعَلْتَ", "t": "yaptın", "r": "fiil", "n": "Mâzi; sondaki تَ → “sen (erkek)”."}, {"w": "أَمْسِ", "t": "dün", "r": "isim", "n": "Zaman bildiren isim; geçmiş zamanla kullanılır. Sonu her zaman esredir: “emsi”."}],
    "الْيَوْمَ أَقْرَأُ كِتَابًا.": [{"w": "الْيَوْمَ", "t": "bugün", "r": "isim", "n": "“Gün” kelimesinin belirli ve üstünlü hâli: “bugün”."}, {"w": "أَقْرَأُ", "t": "okuyorum", "r": "fiil", "n": "Muzari; baştaki أَ → “ben”."}, {"w": "كِتَابًا", "t": "bir kitap", "r": "isim", "n": "Belirsiz nesne: üstün tenvin, “kitâben”."}],
    "أَمْسِ ذَهَبْتُ إِلَى السُّوقِ.": [{"w": "أَمْسِ", "t": "dün", "r": "isim", "n": "Zaman bildiren isim; geçmiş zamanla kullanılır. Sonu her zaman esredir: “emsi”."}, {"w": "ذَهَبْتُ", "t": "gittim", "r": "fiil", "n": "Mâzi; sondaki تُ → “ben”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra geldiği için sonu esre."}],
    "سَأَذْهَبُ إِلَى الْمَدْرَسَةِ غَدًا.": [{"w": "سَأَذْهَبُ", "t": "gideceğim", "r": "fiil", "n": "سَـ + أَذْهَبُ: gelecek; أَ → “ben”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}, {"w": "غَدًا", "t": "yarın", "r": "isim", "n": "Zaman bildiren isim; gelecek zamanla kullanılır."}],
    "سَوْفَ نَقْرَأُ الْكِتَابَ.": [{"w": "سَوْفَ", "t": "-ecek / -acak", "r": "harf", "n": "Gelecek işareti; fiilden ayrı yazılır."}, {"w": "نَقْرَأُ", "t": "okuruz", "r": "fiil", "n": "Muzari, نَـ → “biz”. سَوْفَ ile “okuyacağız”."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "لَنْ يَذْهَبُوا إِلَى السُّوقِ.": [{"w": "لَنْ", "t": "-meyecek", "r": "harf", "n": "Geleceği olumsuz yapar; fiilin sonunu üstün yapar, sondaki ن çoğu biçimde düşer."}, {"w": "يَذْهَبُوا", "t": "gitmek (onlar)", "r": "fiil", "n": "يَذْهَبُونَ’nun ن’si لَنْ yüzünden düşmüş."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra geldiği için sonu esre."}],
    "اُكْتُبْ دَرْسًا.": [{"w": "اُكْتُبْ", "t": "yaz!", "r": "fiil", "n": "Emir · erkeğe: تَكْتُبُ → اُكْتُبْ. Orta harf ötreli olduğu için başta اُ."}, {"w": "دَرْسًا", "t": "bir ders", "r": "isim", "n": "Belirsiz nesne: üstün tenvin, “dersen”."}],
    "اُكْتُبِ الدَّرْسَ.": [{"w": "اُكْتُبِ", "t": "yaz!", "r": "fiil", "n": "Emir · erkeğe. Sonu normalde sakin; ال’den önce esre okunur."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başlar: “ed-darse”. Nesne olduğu için sonu üstün."}],
    "اِجْلِسْ، مِنْ فَضْلِكَ.": [{"w": "اِجْلِسْ", "t": "otur!", "r": "fiil", "n": "Emir · erkeğe: يَجْلِسُ → اِجْلِسْ. Orta harf esreli olduğu için başta اِ."}, {"w": "مِنْ", "t": "-den", "r": "harf", "n": "مِنْ فَضْلِكَ kalıbının ilk parçası."}, {"w": "فَضْلِكَ", "t": "lütfun(dan)", "r": "isim", "n": "فَضْل “lütuf” + ـكَ “senin”. Birlikte “lütfen (erkeğe)”."}],
    "اِجْلِسِي هُنَا.": [{"w": "اِجْلِسِي", "t": "otur!", "r": "fiil", "n": "Emir · kadına: تَجْلِسِينَ → اِجْلِسِي; sondaki ن düşer."}, {"w": "هُنَا", "t": "burada", "r": "isim", "n": "Yer bildiren kelime: “burada, buraya”."}],
    "اُدْخُلُوا الْمَسْجِدَ.": [{"w": "اُدْخُلُوا", "t": "girin!", "r": "fiil", "n": "Emir · topluluğa: تَدْخُلُونَ → اُدْخُلُوا. Sondaki elif okunmaz."}, {"w": "الْمَسْجِدَ", "t": "mescide", "r": "isim", "n": "دَخَلَ fiili nesneyi doğrudan alır; sonu üstün."}],
    "اِفْتَحِ الْبَابَ.": [{"w": "اِفْتَحِ", "t": "aç!", "r": "fiil", "n": "Emir · erkeğe: يَفْتَحُ → اِفْتَحْ. ال’den önce son harf esre okunur."}, {"w": "الْبَابَ", "t": "kapıyı", "r": "isim", "n": "بَاب “kapı”. Nesne olduğu için sonu üstün."}],
    "اِقْرَأْ كِتَابًا.": [{"w": "اِقْرَأْ", "t": "oku!", "r": "fiil", "n": "Emir · erkeğe: يَقْرَأُ → اِقْرَأْ. Orta harf üstünlü, başta اِ."}, {"w": "كِتَابًا", "t": "bir kitap", "r": "isim", "n": "Belirsiz nesne: üstün tenvin, “kitâben”."}],
    "اِسْمَعْ وَاكْتُبْ.": [{"w": "اِسْمَعْ", "t": "dinle!", "r": "fiil", "n": "Emir · erkeğe: يَسْمَعُ → اِسْمَعْ."}, {"w": "وَاكْتُبْ", "t": "ve yaz!", "r": "fiil", "n": "وَ + اُكْتُبْ. Önünde وَ olduğu için hemze okunmaz: “vektub”."}],
    "اِشْرَبِي الْمَاءَ.": [{"w": "اِشْرَبِي", "t": "iç!", "r": "fiil", "n": "Emir · kadına: تَشْرَبِينَ → اِشْرَبِي."}, {"w": "الْمَاءَ", "t": "suyu", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "اِذْهَبَا إِلَى السُّوقِ.": [{"w": "اِذْهَبَا", "t": "gidin! (ikiniz)", "r": "fiil", "n": "Emir · siz ikiniz: تَذْهَبَانِ → اِذْهَبَا; sondaki ـنِ düşer."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra esre."}],
    "اِذْهَبُوا إِلَى الْمَسْجِدِ.": [{"w": "اِذْهَبُوا", "t": "gidin!", "r": "fiil", "n": "Emir · topluluğa: تَذْهَبُونَ → اِذْهَبُوا. Elif okunmaz."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "اُخْرُجْنَ مِنَ الْفَصْلِ.": [{"w": "اُخْرُجْنَ", "t": "çıkın! (kadınlar)", "r": "fiil", "n": "Emir · kadınlar: تَخْرُجْنَ → اُخْرُجْنَ; bu biçim değişmez."}, {"w": "مِنَ", "t": "-den", "r": "harf", "n": "مِنْ, ال’den önce مِنَ okunur."}, {"w": "الْفَصْلِ", "t": "sınıf", "r": "isim", "n": "فَصْل “sınıf”. Edattan sonra esre."}],
    "اُدْخُلْ وَاجْلِسْ.": [{"w": "اُدْخُلْ", "t": "gir!", "r": "fiil", "n": "Emir · erkeğe: يَدْخُلُ → اُدْخُلْ."}, {"w": "وَاجْلِسْ", "t": "ve otur!", "r": "fiil", "n": "وَ + اِجْلِسْ; hemze okunmaz: “vecles”."}],
    "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ.": [{"w": "اقْرَأْ", "t": "oku!", "r": "fiil", "n": "Emir · erkeğe. Alak 1: inen ilk âyetin ilk kelimesi."}, {"w": "بِاسْمِ", "t": "adıyla", "r": "isim", "n": "بِـ “ile” + اِسْم “ad”. Hemze-i vasl okunmaz: “bismi”."}, {"w": "رَبِّكَ", "t": "Rabbinin", "r": "isim", "n": "رَبّ + ـكَ “senin”."}, {"w": "الَّذِي", "t": "ki o", "r": "zamir", "n": "İlgi zamiri: “… olan” (Ders 19)."}, {"w": "خَلَقَ", "t": "yarattı", "r": "fiil", "n": "Mâzi, 3. tekil eril; الَّذِي ile “yaratan”."}],
    "لَا تَكْتُبْ هُنَا.": [{"w": "لَا", "t": "-ma / -me", "r": "harf", "n": "Muzari “sen/siz” fiilinin önünde yasak bildirir: “-ma, -me”. Fiilin sonu cezmlenir."}, {"w": "تَكْتُبْ", "t": "yaz(ma)", "r": "fiil", "n": "تَكْتُبُ’nun sonu sükûn olmuş: nehiy."}, {"w": "هُنَا", "t": "buraya", "r": "isim", "n": "Yer bildiren kelime: “burada, buraya”."}],
    "لَا تَذْهَبِي إِلَى السُّوقِ.": [{"w": "لَا", "t": "-ma / -me", "r": "harf", "n": "Muzari “sen/siz” fiilinin önünde yasak bildirir: “-ma, -me”. Fiilin sonu cezmlenir."}, {"w": "تَذْهَبِي", "t": "git(me) · kadın", "r": "fiil", "n": "تَذْهَبِينَ’nin ـنَ’si düşmüş."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat; sonraki ismin sonu esre olur."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra esre."}],
    "لَا تَجْلِسُوا هُنَا.": [{"w": "لَا", "t": "-ma / -me", "r": "harf", "n": "Muzari “sen/siz” fiilinin önünde yasak bildirir: “-ma, -me”. Fiilin sonu cezmlenir."}, {"w": "تَجْلِسُوا", "t": "otur(mayın)", "r": "fiil", "n": "تَجْلِسُونَ’un ن’si düşmüş; okunmayan elif yazılmış."}, {"w": "هُنَا", "t": "burada", "r": "isim", "n": "Yer bildiren kelime."}],
    "لَا تَشْرَبِ الْقَهْوَةَ.": [{"w": "لَا", "t": "-ma / -me", "r": "harf", "n": "Muzari “sen/siz” fiilinin önünde yasak bildirir: “-ma, -me”. Fiilin sonu cezmlenir."}, {"w": "تَشْرَبِ", "t": "iç(me)", "r": "fiil", "n": "Sonu sakin; ال’den önce esre okunur."}, {"w": "الْقَهْوَةَ", "t": "kahveyi", "r": "isim", "n": "قَهْوَةٌ “kahve” dişil bir isimdir. Nesne olduğu için sonu üstün."}],
    "لَا تَحْزَنْ.": [{"w": "لَا", "t": "-ma / -me", "r": "harf", "n": "Muzari “sen/siz” fiilinin önünde yasak bildirir: “-ma, -me”. Fiilin sonu cezmlenir."}, {"w": "تَحْزَنْ", "t": "üzül(me)", "r": "fiil", "n": "تَحْزَنُ “üzülüyorsun” → cezm: sonu sükûn."}],
    "لَا تَفْتَحَا الْبَابَ.": [{"w": "لَا", "t": "-ma / -me", "r": "harf", "n": "Muzari “sen/siz” fiilinin önünde yasak bildirir: “-ma, -me”. Fiilin sonu cezmlenir."}, {"w": "تَفْتَحَا", "t": "aç(mayın) · ikiniz", "r": "fiil", "n": "تَفْتَحَانِ’nin ـنِ’si düşmüş."}, {"w": "الْبَابَ", "t": "kapıyı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "لَمْ أَكْتُبِ الدَّرْسَ بَعْدُ.": [{"w": "لَمْ", "t": "-medi", "r": "harf", "n": "Muzarinin önünde geçmişi olumsuz yapar: “-medi”. Fiilin sonu cezmlenir."}, {"w": "أَكْتُبِ", "t": "yazmak · ben", "r": "fiil", "n": "أَكْتُبُ → cezm; ال’den önce esre okunur."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Şemsî harfle başlar: “ed-darse”. Nesne olduğu için sonu üstün."}, {"w": "بَعْدُ", "t": "henüz", "r": "isim", "n": "Olumsuz cümlenin sonunda “henüz”."}],
    "لَمْ يَذْهَبُوا إِلَى الْمَسْجِدِ.": [{"w": "لَمْ", "t": "-medi", "r": "harf", "n": "Muzarinin önünde geçmişi olumsuz yapar: “-medi”. Fiilin sonu cezmlenir."}, {"w": "يَذْهَبُوا", "t": "gitmek · onlar", "r": "fiil", "n": "يَذْهَبُونَ’un ن’si düşmüş."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra geldiği için sonu esre."}],
    "لَمْ نَشْرَبِ الْمَاءَ.": [{"w": "لَمْ", "t": "-medi", "r": "harf", "n": "Muzarinin önünde geçmişi olumsuz yapar: “-medi”. Fiilin sonu cezmlenir."}, {"w": "نَشْرَبِ", "t": "içmek · biz", "r": "fiil", "n": "نَشْرَبُ → cezm; ال’den önce esre."}, {"w": "الْمَاءَ", "t": "suyu", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "لَمْ تَفْتَحِي الْبَابَ.": [{"w": "لَمْ", "t": "-medi", "r": "harf", "n": "Muzarinin önünde geçmişi olumsuz yapar: “-medi”. Fiilin sonu cezmlenir."}, {"w": "تَفْتَحِي", "t": "açmak · sen (kadın)", "r": "fiil", "n": "تَفْتَحِينَ’nin ـنَ’si düşmüş."}, {"w": "الْبَابَ", "t": "kapıyı", "r": "isim", "n": "Nesne olduğu için sonu üstün."}],
    "هُوَ لَمْ يَخْرُجْ مِنَ الْبَيْتِ.": [{"w": "هُوَ", "t": "o (erkek)", "r": "zamir", "n": "3. tekil eril zamir."}, {"w": "لَمْ", "t": "-medi", "r": "harf", "n": "Muzarinin önünde geçmişi olumsuz yapar: “-medi”. Fiilin sonu cezmlenir."}, {"w": "يَخْرُجْ", "t": "çıkmak · o", "r": "fiil", "n": "يَخْرُجُ → cezm: sonu sükûn."}, {"w": "مِنَ", "t": "-den", "r": "harf", "n": "مِنْ, ال’den önce مِنَ okunur."}, {"w": "الْبَيْتِ", "t": "ev", "r": "isim", "n": "Edattan sonra esre."}],
    "لَا تَشْرَبِ الْقَهْوَةَ، اِشْرَبِ الْمَاءَ.": [{"w": "لَا", "t": "-ma / -me", "r": "harf", "n": "Muzari “sen/siz” fiilinin önünde yasak bildirir: “-ma, -me”. Fiilin sonu cezmlenir."}, {"w": "تَشْرَبِ", "t": "iç(me)", "r": "fiil", "n": "Nehiy; ال’den önce esre okunur."}, {"w": "الْقَهْوَةَ", "t": "kahveyi", "r": "isim", "n": "Nesne; sonu üstün."}, {"w": "اِشْرَبِ", "t": "iç!", "r": "fiil", "n": "Emir (Ders 11); ال’den önce esre okunur."}, {"w": "الْمَاءَ", "t": "suyu", "r": "isim", "n": "Nesne; sonu üstün."}],
    "لَمْ يَلِدْ وَلَمْ يُولَدْ.": [{"w": "لَمْ", "t": "-medi", "r": "harf", "n": "Muzarinin önünde geçmişi olumsuz yapar: “-medi”. Fiilin sonu cezmlenir."}, {"w": "يَلِدْ", "t": "doğurmak · o", "r": "fiil", "n": "يَلِدُ “doğurur” → cezm. İhlâs 3."}, {"w": "وَلَمْ", "t": "ve -medi", "r": "harf", "n": "وَ “ve” + لَمْ."}, {"w": "يُولَدْ", "t": "doğurulmak · o", "r": "fiil", "n": "يُولَدُ “doğurulur” (edilgen) → cezm."}],
    "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا.": [{"w": "لَا", "t": "-ma / -me", "r": "harf", "n": "Muzari “sen/siz” fiilinin önünde yasak bildirir: “-ma, -me”. Fiilin sonu cezmlenir."}, {"w": "تَحْزَنْ", "t": "üzül(me)", "r": "fiil", "n": "Nehiy; Tevbe 40."}, {"w": "إِنَّ", "t": "şüphesiz", "r": "harf", "n": "Cümleyi pekiştiren edat; sonraki ismin sonu üstün olur."}, {"w": "اللَّهَ", "t": "Allah", "r": "isim", "n": "إِنَّ’den sonra geldiği için sonu üstün."}, {"w": "مَعَنَا", "t": "bizimle", "r": "isim", "n": "مَعَ “ile, beraber” + نَا “biz”."}],
    "مَنْ هَذَا؟": [{"w": "مَنْ", "t": "kim?", "r": "soru", "n": "Kişiyi soran soru kelimesi."}, {"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril işaret ismi."}],
    "مَا هَذَا؟": [{"w": "مَا", "t": "ne?", "r": "soru", "n": "İsim ve zamirden önce “ne?”"}, {"w": "هَذَا", "t": "bu (eril)", "r": "zamir", "n": "Eril işaret ismi."}],
    "مَاذَا تَقْرَأُ؟": [{"w": "مَاذَا", "t": "ne?", "r": "soru", "n": "Fiilden önce “ne?”"}, {"w": "تَقْرَأُ", "t": "okuyorsun", "r": "fiil", "n": "Muzari; baştaki تَـ burada “sen (erkek)”."}],
    "أَيْنَ الْمَسْجِدُ؟": [{"w": "أَيْنَ", "t": "nerede?", "r": "soru", "n": "Yer soran soru kelimesi."}, {"w": "الْمَسْجِدُ", "t": "mescit", "r": "isim", "n": "Cümlenin öznesi; sonu ötre."}],
    "إِلَى أَيْنَ تَذْهَبُ؟": [{"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön edatı; أَيْنَ ile “nereye?”"}, {"w": "أَيْنَ", "t": "nere?", "r": "soru", "n": "Yer soran soru kelimesi."}, {"w": "تَذْهَبُ", "t": "gidiyorsun", "r": "fiil", "n": "Muzari; تَـ “sen (erkek)”."}],
    "مِنْ أَيْنَ أَنْتَ؟": [{"w": "مِنْ", "t": "-den", "r": "harf", "n": "Ayrılma/çıkış edatı; أَيْنَ ile “nereden?”"}, {"w": "أَيْنَ", "t": "nere?", "r": "soru", "n": "Yer soran soru kelimesi."}, {"w": "أَنْتَ", "t": "sen (erkek)", "r": "zamir", "n": "2. tekil eril zamir."}],
    "مَتَى تَذْهَبُ إِلَى السُّوقِ؟": [{"w": "مَتَى", "t": "ne zaman?", "r": "soru", "n": "Zaman soran soru kelimesi."}, {"w": "تَذْهَبُ", "t": "gidiyorsun", "r": "fiil", "n": "Muzari; تَـ “sen”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Şemsî harfle başlar: “es-sûki”. Edattan sonra esre."}],
    "كَيْفَ حَالُكَ؟": [{"w": "كَيْفَ", "t": "nasıl?", "r": "soru", "n": "Durum soran soru kelimesi."}, {"w": "حَالُكَ", "t": "hâlin", "r": "isim", "n": "حَال “durum” + ـكَ “senin”."}],
    "بِخَيْرٍ، الْحَمْدُ لِلَّهِ.": [{"w": "بِخَيْرٍ", "t": "iyiyim", "r": "isim", "n": "بِـ “ile, içinde” + خَيْر “iyilik”: “iyilik içinde”."}, {"w": "الْحَمْدُ", "t": "hamd", "r": "isim", "n": "Övgü; cümlenin başı olduğu için sonu ötre."}, {"w": "لِلَّهِ", "t": "Allah’a", "r": "isim", "n": "لِـ “-e, için” + اللَّه."}],
    "لِمَاذَا لَمْ تَذْهَبْ إِلَى الْمَدْرَسَةِ؟": [{"w": "لِمَاذَا", "t": "neden?", "r": "soru", "n": "Sebep soran soru kelimesi."}, {"w": "لَمْ", "t": "-medi", "r": "harf", "n": "Muzariyi geçmişe çevirip olumsuz yapar (Ders 12)."}, {"w": "تَذْهَبْ", "t": "gitmek · sen", "r": "fiil", "n": "تَذْهَبُ → cezm."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Edattan sonra esre."}],
    "كَمْ طَالِبًا فِي الْفَصْلِ؟": [{"w": "كَمْ", "t": "kaç?", "r": "soru", "n": "Sayı soran soru; sonraki isim tekil ve üstün tenvinli."}, {"w": "طَالِبًا", "t": "öğrenci", "r": "isim", "n": "كَمْ’den sonra üstün tenvin: “tâliben”."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Yer bildiren edat."}, {"w": "الْفَصْلِ", "t": "sınıf", "r": "isim", "n": "Edattan sonra esre."}],
    "مَنْ كَتَبَ الدَّرْسَ؟": [{"w": "مَنْ", "t": "kim?", "r": "soru", "n": "Kişiyi soran soru kelimesi."}, {"w": "كَتَبَ", "t": "yazdı", "r": "fiil", "n": "Mâzi, 3. tekil eril."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Nesne; sonu üstün."}],
    "مَا اسْمُكَ؟": [{"w": "مَا", "t": "ne?", "r": "soru", "n": "İsimden önce “ne?”"}, {"w": "اسْمُكَ", "t": "adın", "r": "isim", "n": "اِسْم “ad” + ـكَ “senin”. Önde مَا olduğu için hemze okunmaz: “mesmuk”."}],
    "هَلْ أَتَاكَ حَدِيثُ الْغَاشِيَةِ؟": [{"w": "هَلْ", "t": "…mı?", "r": "soru", "n": "Evet-hayır sorusu edatı."}, {"w": "أَتَاكَ", "t": "sana geldi", "r": "fiil", "n": "أَتَى “geldi” + ـكَ “sana”."}, {"w": "حَدِيثُ", "t": "haber, söz", "r": "isim", "n": "“Hadis” kelimesi buradan gelir."}, {"w": "الْغَاشِيَةِ", "t": "kuşatanın", "r": "isim", "n": "Kıyamet günü; tamlamanın ikinci öğesi, sonu esre."}],
    "كِتَابُ الطَّالِبِ جَدِيدٌ.": [{"w": "كِتَابُ", "t": "kitabı", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz. Özne olduğu için ötre."}, {"w": "الطَّالِبِ", "t": "öğrencinin", "r": "isim", "n": "Tamlamanın ikinci ismi: sonu esre."}, {"w": "جَدِيدٌ", "t": "yeni", "r": "isim", "n": "Cümlenin yüklemi; belirsiz ve ötre tenvinli."}],
    "هَذَا بَيْتُ الْمُعَلِّمِ.": [{"w": "هَذَا", "t": "bu", "r": "zamir", "n": "Eril işaret ismi."}, {"w": "بَيْتُ", "t": "evi", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz."}, {"w": "الْمُعَلِّمِ", "t": "öğretmenin", "r": "isim", "n": "Tamlamanın ikinci ismi: sonu esre."}],
    "فَتَحَ الطَّالِبُ بَابَ الْفَصْلِ.": [{"w": "فَتَحَ", "t": "açtı", "r": "fiil", "n": "Mâzi, 3. tekil eril."}, {"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "İşi yapan; sonu ötre."}, {"w": "بَابَ", "t": "kapısını", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz. Nesne olduğu için üstün."}, {"w": "الْفَصْلِ", "t": "sınıfın", "r": "isim", "n": "Tamlamanın ikinci ismi: esre."}],
    "ذَهَبْتُ إِلَى بَيْتِ الْمُعَلِّمِ.": [{"w": "ذَهَبْتُ", "t": "gittim", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat."}, {"w": "بَيْتِ", "t": "evi", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz. Edattan sonra esre."}, {"w": "الْمُعَلِّمِ", "t": "öğretmenin", "r": "isim", "n": "Tamlamanın ikinci ismi: esre."}],
    "بَابُ بَيْتِ الْمُعَلِّمِ كَبِيرٌ.": [{"w": "بَابُ", "t": "kapısı", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz. Özne, ötre."}, {"w": "بَيْتِ", "t": "evinin", "r": "isim", "n": "Zincirin ortası: hem esre hem ال almaz."}, {"w": "الْمُعَلِّمِ", "t": "öğretmenin", "r": "isim", "n": "Zincirin sonu: esre."}, {"w": "كَبِيرٌ", "t": "büyük", "r": "isim", "n": "Yüklem; ötre tenvin."}],
    "قَرَأْتُ كِتَابَ اللَّهِ.": [{"w": "قَرَأْتُ", "t": "okudum", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "كِتَابَ", "t": "kitabını", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz. Nesne, üstün."}, {"w": "اللَّهِ", "t": "Allah’ın", "r": "isim", "n": "Tamlamanın ikinci ismi: esre."}],
    "مُحَمَّدٌ رَسُولُ اللَّهِ.": [{"w": "مُحَمَّدٌ", "t": "Muhammed", "r": "isim", "n": "Özel isim; cümlenin başı, ötre."}, {"w": "رَسُولُ", "t": "elçisi", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz. Yüklem, ötre."}, {"w": "اللَّهِ", "t": "Allah’ın", "r": "isim", "n": "Tamlamanın ikinci ismi: esre."}],
    "لِمَنْ هَذَا الْكِتَابُ؟": [{"w": "لِمَنْ", "t": "kimin?", "r": "soru", "n": "لِـ “için, -e ait” + مَنْ “kim”."}, {"w": "هَذَا", "t": "bu", "r": "zamir", "n": "Eril işaret ismi."}, {"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "هَذَا ile “bu kitap”."}],
    "هَذَا كِتَابُ الْمُعَلِّمِ.": [{"w": "هَذَا", "t": "bu", "r": "zamir", "n": "Eril işaret ismi."}, {"w": "كِتَابُ", "t": "kitabı", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz."}, {"w": "الْمُعَلِّمِ", "t": "öğretmenin", "r": "isim", "n": "Tamlamanın ikinci ismi: esre."}],
    "بَيْتُ الْمُعَلِّمِ قَرِيبٌ مِنَ الْمَسْجِدِ.": [{"w": "بَيْتُ", "t": "evi", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz. Özne, ötre."}, {"w": "الْمُعَلِّمِ", "t": "öğretmenin", "r": "isim", "n": "Tamlamanın ikinci ismi: esre."}, {"w": "قَرِيبٌ", "t": "yakın", "r": "isim", "n": "Yüklem; مِنْ ile “-e yakın”."}, {"w": "مِنَ", "t": "-den", "r": "harf", "n": "مِنْ, ال’den önce مِنَ okunur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra esre."}],
    "فَتَحْتُ بَابَ الْمَسْجِدِ.": [{"w": "فَتَحْتُ", "t": "açtım", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "بَابَ", "t": "kapısını", "r": "isim", "n": "Tamlamanın birinci ismi (muzâf): ال ve tenvin almaz. Nesne, üstün."}, {"w": "الْمَسْجِدِ", "t": "mescidin", "r": "isim", "n": "Tamlamanın ikinci ismi: esre."}],
    "بِسْمِ اللَّهِ.": [{"w": "بِسْمِ", "t": "adıyla", "r": "isim", "n": "بِـ “ile” + اِسْم “ad”; muzâf, edattan sonra esre."}, {"w": "اللَّهِ", "t": "Allah’ın", "r": "isim", "n": "Tamlamanın ikinci ismi: esre."}],
    "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ.": [{"w": "الْحَمْدُ", "t": "hamd", "r": "isim", "n": "Cümlenin başı; sonu ötre."}, {"w": "لِلَّهِ", "t": "Allah’a", "r": "isim", "n": "لِـ + اللَّه; edattan sonra esre."}, {"w": "رَبِّ", "t": "Rabbi", "r": "isim", "n": "Allah’ı niteler, o yüzden esre; aynı zamanda muzâf."}, {"w": "الْعَالَمِينَ", "t": "âlemlerin", "r": "isim", "n": "Muzâfun ileyh; çoğul olduğu için esre yerine ـِينَ."}],
    "مَالِكِ يَوْمِ الدِّينِ.": [{"w": "مَالِكِ", "t": "sahibi", "r": "isim", "n": "Muzâf; önceki âyetteki Allah’ı nitelediği için esre."}, {"w": "يَوْمِ", "t": "gününün", "r": "isim", "n": "Zincirin ortası: esre ve ال’siz."}, {"w": "الدِّينِ", "t": "dinin, hesabın", "r": "isim", "n": "Zincirin sonu: esre. Şemsî harf: “ed-dîn”."}],
    "هَذَا كِتَابِي.": [{"w": "هَذَا", "t": "bu", "r": "zamir", "n": "Eril işaret ismi."}, {"w": "كِتَابِي", "t": "kitabım", "r": "isim", "n": "كِتَاب + ـِي “benim”. Zamirli isim ال almaz."}],
    "مَا اسْمُكِ؟": [{"w": "مَا", "t": "ne?", "r": "soru", "n": "İsimden önce “ne?”"}, {"w": "اسْمُكِ", "t": "adın (kadın)", "r": "isim", "n": "اِسْم + ـكِ “senin (kadın)”."}],
    "اِسْمُهُ عَلِيٌّ.": [{"w": "اِسْمُهُ", "t": "onun adı", "r": "isim", "n": "اِسْم + ـهُ “onun (erkek)”."}, {"w": "عَلِيٌّ", "t": "Ali", "r": "isim", "n": "Özel isim; yüklem, ötre tenvin."}],
    "عِنْدِي كِتَابٌ جَدِيدٌ.": [{"w": "عِنْدِي", "t": "bende", "r": "isim", "n": "عِنْدَ “yanında” (zarf) + ـِي: sahiplik bildirir."}, {"w": "كِتَابٌ", "t": "bir kitap", "r": "isim", "n": "Belirsiz; ötre tenvin."}, {"w": "جَدِيدٌ", "t": "yeni", "r": "isim", "n": "Sıfat; kitapla uyumlu."}],
    "ذَهَبَ الطَّالِبُ إِلَى بَيْتِهِ.": [{"w": "ذَهَبَ", "t": "gitti", "r": "fiil", "n": "Mâzi, 3. tekil eril."}, {"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "İşi yapan; ötre."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat."}, {"w": "بَيْتِهِ", "t": "onun evi", "r": "isim", "n": "بَيْت + ـهُ; esreden sonra ـهِ okunur."}],
    "أَيْنَ بَيْتُكُمْ؟": [{"w": "أَيْنَ", "t": "nerede?", "r": "soru", "n": "Yer soran soru kelimesi."}, {"w": "بَيْتُكُمْ", "t": "eviniz", "r": "isim", "n": "بَيْت + ـكُمْ “sizin”."}],
    "بَيْتُنَا قَرِيبٌ مِنَ الْمَسْجِدِ.": [{"w": "بَيْتُنَا", "t": "evimiz", "r": "isim", "n": "بَيْت + ـنَا “bizim”."}, {"w": "قَرِيبٌ", "t": "yakın", "r": "isim", "n": "Yüklem; مِنْ ile “-e yakın”."}, {"w": "مِنَ", "t": "-den", "r": "harf", "n": "مِنْ, ال’den önce مِنَ okunur."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Edattan sonra esre."}],
    "هَلْ عِنْدَكَ أَخٌ؟": [{"w": "هَلْ", "t": "…mı?", "r": "soru", "n": "Evet-hayır sorusu."}, {"w": "عِنْدَكَ", "t": "sende", "r": "isim", "n": "عِنْدَ (zarf) + ـكَ: “senin … var mı?”"}, {"w": "أَخٌ", "t": "bir kardeş", "r": "isim", "n": "Erkek kardeş; belirsiz."}],
    "كِتَابِي فِي بَيْتِي.": [{"w": "كِتَابِي", "t": "kitabım", "r": "isim", "n": "كِتَاب + ـِي."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Yer bildiren edat."}, {"w": "بَيْتِي", "t": "evim", "r": "isim", "n": "بَيْت + ـِي; edattan sonra da görünüşü değişmez."}],
    "ذَهَبْتُ مَعَهُمْ إِلَى السُّوقِ.": [{"w": "ذَهَبْتُ", "t": "gittim", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "مَعَهُمْ", "t": "onlarla", "r": "isim", "n": "مَعَ “ile” (zarf) + ـهُمْ “onlar”."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Yön bildiren edat."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Edattan sonra esre."}],
    "كَتَبْتُهُ أَمْسِ.": [{"w": "كَتَبْتُهُ", "t": "onu yazdım", "r": "fiil", "n": "كَتَبْتُ “yazdım” + ـهُ “onu”: fiile gelen zamir nesnedir."}, {"w": "أَمْسِ", "t": "dün", "r": "isim", "n": "Zaman bildiren isim."}],
    "أُمِّي فِي الْبَيْتِ.": [{"w": "أُمِّي", "t": "annem", "r": "isim", "n": "أُمّ + ـِي “benim”."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Yer bildiren edat."}, {"w": "الْبَيْتِ", "t": "ev", "r": "isim", "n": "Edattan sonra esre."}],
    "لَكُمْ دِينُكُمْ وَلِيَ دِينِ.": [{"w": "لَكُمْ", "t": "size", "r": "harf", "n": "لِـ + ـكُمْ; لِـ zamirle لَـ okunur."}, {"w": "دِينُكُمْ", "t": "dininiz", "r": "isim", "n": "دِين + ـكُمْ."}, {"w": "وَلِيَ", "t": "ve bana", "r": "harf", "n": "وَ + لِـ + ـِي."}, {"w": "دِينِ", "t": "dinim", "r": "isim", "n": "Sondaki ي mushafta yazılmamış; esre onu gösterir."}],
    "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ؟": [{"w": "أَلَمْ", "t": "-medik mi?", "r": "soru", "n": "أَ + لَمْ: olumsuz soru."}, {"w": "نَشْرَحْ", "t": "açarız", "r": "fiil", "n": "Muzari “biz”; لَمْ yüzünden cezmli."}, {"w": "لَكَ", "t": "senin için", "r": "harf", "n": "لِـ + ـكَ."}, {"w": "صَدْرَكَ", "t": "göğsünü", "r": "isim", "n": "صَدْر + ـكَ; nesne olduğu için üstün."}],
    "الْكِتَابُ عَلَى الْمَكْتَبِ.": [{"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "Cümlenin başı; ötre."}, {"w": "عَلَى", "t": "üzerinde", "r": "harf", "n": "Harf-i cer: üzerinde."}, {"w": "الْمَكْتَبِ", "t": "masa", "r": "isim", "n": "Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "ذَهَبْتُ مِنَ الْبَيْتِ إِلَى الْمَسْجِدِ.": [{"w": "ذَهَبْتُ", "t": "gittim", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "مِنَ", "t": "-den", "r": "harf", "n": "مِنْ, ال’den önce مِنَ okunur."}, {"w": "الْبَيْتِ", "t": "ev", "r": "isim", "n": "Harf-i cerden sonra geldiği için sonu esre (mecrur)."}, {"w": "إِلَى", "t": "-e / -a", "r": "harf", "n": "Harf-i cer: yön."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "كَتَبْتُ الدَّرْسَ بِالْقَلَمِ.": [{"w": "كَتَبْتُ", "t": "yazdım", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Nesne; üstün."}, {"w": "بِالْقَلَمِ", "t": "kalemle", "r": "isim", "n": "بِـ “ile” + الْقَلَمِ; Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "هَذَا الْكِتَابُ لِلطَّالِبِ.": [{"w": "هَذَا", "t": "bu", "r": "zamir", "n": "Eril işaret ismi."}, {"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "هَذَا ile “bu kitap”."}, {"w": "لِلطَّالِبِ", "t": "öğrenci için", "r": "isim", "n": "لِـ + الطَّالِبِ; ال’in elifi düşer. Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "جَلَسَ الْمُعَلِّمُ عَلَى الْكُرْسِيِّ.": [{"w": "جَلَسَ", "t": "oturdu", "r": "fiil", "n": "Mâzi; عَلَى ile kullanılır."}, {"w": "الْمُعَلِّمُ", "t": "öğretmen", "r": "isim", "n": "İşi yapan; ötre."}, {"w": "عَلَى", "t": "üzerine", "r": "harf", "n": "Harf-i cer."}, {"w": "الْكُرْسِيِّ", "t": "sandalye", "r": "isim", "n": "Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "سَأَلْتُ عَنِ الدَّرْسِ.": [{"w": "سَأَلْتُ", "t": "sordum", "r": "fiil", "n": "Mâzi; سَأَلَ عَنْ “hakkında sordu”."}, {"w": "عَنِ", "t": "hakkında", "r": "harf", "n": "عَنْ, ال’den önce عَنِ okunur."}, {"w": "الدَّرْسِ", "t": "ders", "r": "isim", "n": "Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "خَرَجَ الطَّالِبُ مِنَ الْفَصْلِ.": [{"w": "خَرَجَ", "t": "çıktı", "r": "fiil", "n": "Mâzi; مِنْ ile kullanılır."}, {"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "İşi yapan; ötre."}, {"w": "مِنَ", "t": "-den", "r": "harf", "n": "Harf-i cer."}, {"w": "الْفَصْلِ", "t": "sınıf", "r": "isim", "n": "Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "السَّلَامُ عَلَيْكُمْ.": [{"w": "السَّلَامُ", "t": "esenlik, selam", "r": "isim", "n": "Cümlenin başı; ötre."}, {"w": "عَلَيْكُمْ", "t": "üzerinize", "r": "harf", "n": "عَلَى + ـكُمْ; zamirle عَلَيْـ olur."}],
    "وَعَلَيْكُمُ السَّلَامُ.": [{"w": "وَعَلَيْكُمُ", "t": "ve sizin üzerinize", "r": "harf", "n": "وَ + عَلَى + ـكُمْ; ال’den önce mîm ötre alır."}, {"w": "السَّلَامُ", "t": "esenlik", "r": "isim", "n": "Ötre."}],
    "نَظَرْتُ إِلَى الْقَمَرِ.": [{"w": "نَظَرْتُ", "t": "baktım", "r": "fiil", "n": "Mâzi; نَظَرَ إِلَى “-e baktı”."}, {"w": "إِلَى", "t": "-e", "r": "harf", "n": "Harf-i cer."}, {"w": "الْقَمَرِ", "t": "ay", "r": "isim", "n": "Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "دَرَسْتُ حَتَّى الْمَسَاءِ.": [{"w": "دَرَسْتُ", "t": "ders çalıştım", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "حَتَّى", "t": "-e kadar", "r": "harf", "n": "Harf-i cer: sınır bildirir."}, {"w": "الْمَسَاءِ", "t": "akşam", "r": "isim", "n": "Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "الطَّالِبُ فِي الْفَصْلِ مَعَ الْمُعَلِّمِ.": [{"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "Cümlenin başı; ötre."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer."}, {"w": "الْفَصْلِ", "t": "sınıf", "r": "isim", "n": "Harf-i cerden sonra geldiği için sonu esre (mecrur)."}, {"w": "مَعَ", "t": "ile, birlikte", "r": "isim", "n": "Zarf; sonraki isim tamlama gibi esre olur."}, {"w": "الْمُعَلِّمِ", "t": "öğretmen", "r": "isim", "n": "مَعَ’den sonra esre."}],
    "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ.": [{"w": "قُلْ", "t": "de ki", "r": "fiil", "n": "Emir: “söyle!”."}, {"w": "أَعُوذُ", "t": "sığınırım", "r": "fiil", "n": "Muzari “ben”; بِـ ile kullanılır."}, {"w": "بِرَبِّ", "t": "Rabbine", "r": "isim", "n": "بِـ + رَبِّ; Harf-i cerden sonra geldiği için sonu esre (mecrur)."}, {"w": "الْفَلَقِ", "t": "sabah aydınlığının", "r": "isim", "n": "Tamlamanın ikinci ismi; esre."}],
    "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ.": [{"w": "إِنَّمَا", "t": "ancak, sadece", "r": "harf", "n": "Sınırlama bildiren edat."}, {"w": "الْأَعْمَالُ", "t": "ameller", "r": "isim", "n": "عَمَل’in çoğulu; cümlenin başı, ötre."}, {"w": "بِالنِّيَّاتِ", "t": "niyetlere göre", "r": "isim", "n": "بِـ + النِّيَّاتِ (نِيَّة’nin çoğulu); Harf-i cerden sonra geldiği için sonu esre (mecrur)."}],
    "فِي الْفَصْلِ طَالِبَانِ.": [{"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer."}, {"w": "الْفَصْلِ", "t": "sınıf", "r": "isim", "n": "Harf-i cerden sonra esre."}, {"w": "طَالِبَانِ", "t": "iki öğrenci", "r": "isim", "n": "İkil; ötre durumunda ـَانِ."}],
    "رَأَيْتُ طَالِبَيْنِ فِي الْمَسْجِدِ.": [{"w": "رَأَيْتُ", "t": "gördüm", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "طَالِبَيْنِ", "t": "iki öğrenci", "r": "isim", "n": "İkil nesne: ـَيْنِ."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Esre."}],
    "الْمُعَلِّمُونَ فِي الْمَدْرَسَةِ.": [{"w": "الْمُعَلِّمُونَ", "t": "öğretmenler", "r": "isim", "n": "Sâlim eril çoğul; ötre durumunda ـُونَ."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer."}, {"w": "الْمَدْرَسَةِ", "t": "okul", "r": "isim", "n": "Esre."}],
    "ذَهَبْتُ مَعَ الْمُعَلِّمِينَ.": [{"w": "ذَهَبْتُ", "t": "gittim", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "مَعَ", "t": "ile", "r": "isim", "n": "Zarf; sonraki isim esre durumunda."}, {"w": "الْمُعَلِّمِينَ", "t": "öğretmenler", "r": "isim", "n": "Sâlim eril çoğul; esre durumunda ـِينَ."}],
    "الطَّالِبَاتُ مُجْتَهِدَاتٌ.": [{"w": "الطَّالِبَاتُ", "t": "kadın öğrenciler", "r": "isim", "n": "Sâlim dişil çoğul: ـَاتٌ."}, {"w": "مُجْتَهِدَاتٌ", "t": "çalışkan(lar)", "r": "isim", "n": "İnsan çoğulu olduğu için yüklem de dişil çoğul."}],
    "هَذِهِ كُتُبٌ جَدِيدَةٌ.": [{"w": "هَذِهِ", "t": "bunlar", "r": "zamir", "n": "İnsan olmayan çoğul için dişil tekil işaret."}, {"w": "كُتُبٌ", "t": "kitaplar", "r": "isim", "n": "كِتَابٌ’ın kırık çoğulu."}, {"w": "جَدِيدَةٌ", "t": "yeni", "r": "isim", "n": "İnsan olmayan çoğulun sıfatı dişil tekil."}],
    "الْبُيُوتُ قَرِيبَةٌ مِنَ الْمَسْجِدِ.": [{"w": "الْبُيُوتُ", "t": "evler", "r": "isim", "n": "بَيْتٌ’in kırık çoğulu."}, {"w": "قَرِيبَةٌ", "t": "yakın", "r": "isim", "n": "İnsan olmayan çoğul: dişil tekil yüklem."}, {"w": "مِنَ", "t": "-den", "r": "harf", "n": "مِنْ, ال’den önce مِنَ."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Esre."}],
    "الرِّجَالُ فِي السُّوقِ.": [{"w": "الرِّجَالُ", "t": "adamlar", "r": "isim", "n": "رَجُلٌ’ün kırık çoğulu."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Esre."}],
    "الْأَوْلَادُ يَلْعَبُونَ فِي الْحَدِيقَةِ.": [{"w": "الْأَوْلَادُ", "t": "çocuklar", "r": "isim", "n": "وَلَدٌ’un kırık çoğulu (أَفْعَالٌ kalıbı)."}, {"w": "يَلْعَبُونَ", "t": "oynuyorlar", "r": "fiil", "n": "Muzari 3. çoğul eril."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer."}, {"w": "الْحَدِيقَةِ", "t": "bahçe", "r": "isim", "n": "Esre."}],
    "عِنْدِي كُتُبٌ كَثِيرَةٌ.": [{"w": "عِنْدِي", "t": "bende", "r": "isim", "n": "عِنْدَ + ـِي: sahiplik."}, {"w": "كُتُبٌ", "t": "kitaplar", "r": "isim", "n": "Kırık çoğul."}, {"w": "كَثِيرَةٌ", "t": "çok", "r": "isim", "n": "İnsan olmayan çoğulun sıfatı dişil tekil."}],
    "الطُّلَّابُ مُجْتَهِدُونَ.": [{"w": "الطُّلَّابُ", "t": "öğrenciler", "r": "isim", "n": "طَالِبٌ’in kırık çoğulu."}, {"w": "مُجْتَهِدُونَ", "t": "çalışkan(lar)", "r": "isim", "n": "İnsan çoğulu: yüklem sâlim eril çoğul."}],
    "قَرَأْتُ كِتَابَيْنِ.": [{"w": "قَرَأْتُ", "t": "okudum", "r": "fiil", "n": "Mâzi; تُ “ben”."}, {"w": "كِتَابَيْنِ", "t": "iki kitap", "r": "isim", "n": "İkil nesne: ـَيْنِ."}],
    "تَبَّتْ يَدَا أَبِي لَهَبٍ.": [{"w": "تَبَّتْ", "t": "kurusun, helâk oldu", "r": "fiil", "n": "Mâzi, 3. tekil dişil (eller dişildir)."}, {"w": "يَدَا", "t": "iki eli", "r": "isim", "n": "يَدَانِ; tamlamanın ilk ismi olduğu için ن düşmüş."}, {"w": "أَبِي", "t": "babasının", "r": "isim", "n": "أَبٌ “baba”; esre durumunda tamlamada أَبِي biçimini alır."}, {"w": "لَهَبٍ", "t": "alevin", "r": "isim", "n": "Esreli tenvin; “Ebû Leheb” lakabı."}],
    "يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا.": [{"w": "يَدْخُلُونَ", "t": "giriyorlar", "r": "fiil", "n": "Muzari 3. çoğul eril."}, {"w": "فِي", "t": "-e, içine", "r": "harf", "n": "Harf-i cer."}, {"w": "دِينِ", "t": "dinine", "r": "isim", "n": "Muzâf; harf-i cerden sonra esre."}, {"w": "اللَّهِ", "t": "Allah’ın", "r": "isim", "n": "Muzâfun ileyh; esre."}, {"w": "أَفْوَاجًا", "t": "bölük bölük", "r": "isim", "n": "فَوْجٌ’un kırık çoğulu; üstün tenvin."}],
    "هَذَا الْكِتَابُ جَدِيدٌ.": [{"w": "هَذَا", "t": "bu", "r": "zamir", "n": "Yakın, eril tekil işaret."}, {"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "ال’li isim: “bu kitap”."}, {"w": "جَدِيدٌ", "t": "yeni", "r": "isim", "n": "Yüklem; belirsiz."}],
    "ذَلِكَ الرَّجُلُ مُعَلِّمٌ.": [{"w": "ذَلِكَ", "t": "şu, o", "r": "zamir", "n": "Uzak, eril tekil işaret: “zâlike”."}, {"w": "الرَّجُلُ", "t": "adam", "r": "isim", "n": "ال’li isim; şemsî harf: “er-racul”."}, {"w": "مُعَلِّمٌ", "t": "bir öğretmen", "r": "isim", "n": "Yüklem; belirsiz."}],
    "تِلْكَ الْمَدْرَسَةُ كَبِيرَةٌ.": [{"w": "تِلْكَ", "t": "şu, o", "r": "zamir", "n": "Uzak, dişil tekil işaret."}, {"w": "الْمَدْرَسَةُ", "t": "okul", "r": "isim", "n": "Dişil isim."}, {"w": "كَبِيرَةٌ", "t": "büyük", "r": "isim", "n": "Dişil yüklem."}],
    "هَؤُلَاءِ طُلَّابٌ مُجْتَهِدُونَ.": [{"w": "هَؤُلَاءِ", "t": "bunlar", "r": "zamir", "n": "Yakın çoğul (insanlar): “hâulâi”."}, {"w": "طُلَّابٌ", "t": "öğrenciler", "r": "isim", "n": "Kırık çoğul."}, {"w": "مُجْتَهِدُونَ", "t": "çalışkan", "r": "isim", "n": "İnsan çoğulu; sıfat da çoğul."}],
    "أُولَئِكَ الطُّلَّابُ فِي الْمَسْجِدِ.": [{"w": "أُولَئِكَ", "t": "şunlar, onlar", "r": "zamir", "n": "Uzak çoğul; و okunmaz: “ulâike”."}, {"w": "الطُّلَّابُ", "t": "öğrenciler", "r": "isim", "n": "ال’li kırık çoğul."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Esre."}],
    "هَذَانِ كِتَابَانِ.": [{"w": "هَذَانِ", "t": "bu ikisi", "r": "zamir", "n": "Yakın, eril ikil işaret."}, {"w": "كِتَابَانِ", "t": "iki kitap", "r": "isim", "n": "İkil; ötre durumu."}],
    "هَاتَانِ طَالِبَتَانِ.": [{"w": "هَاتَانِ", "t": "bu ikisi (dişil)", "r": "zamir", "n": "Yakın, dişil ikil işaret."}, {"w": "طَالِبَتَانِ", "t": "iki kadın öğrenci", "r": "isim", "n": "ة açık ت olur, ـَانِ eklenir."}],
    "هَذِهِ الْكُتُبُ جَدِيدَةٌ.": [{"w": "هَذِهِ", "t": "bu", "r": "zamir", "n": "İnsan olmayan çoğul için dişil tekil işaret."}, {"w": "الْكُتُبُ", "t": "kitaplar", "r": "isim", "n": "Kırık çoğul."}, {"w": "جَدِيدَةٌ", "t": "yeni", "r": "isim", "n": "Dişil tekil yüklem."}],
    "مَا ذَلِكَ؟": [{"w": "مَا", "t": "ne?", "r": "soru", "n": "İsimden önce “ne?”"}, {"w": "ذَلِكَ", "t": "şu", "r": "zamir", "n": "Uzak işaret."}],
    "ذَلِكَ مَسْجِدٌ كَبِيرٌ.": [{"w": "ذَلِكَ", "t": "şu", "r": "zamir", "n": "Uzak işaret."}, {"w": "مَسْجِدٌ", "t": "bir mescit", "r": "isim", "n": "Belirsiz yüklem."}, {"w": "كَبِيرٌ", "t": "büyük", "r": "isim", "n": "Sıfat; mescide uyar."}],
    "مَنْ هَؤُلَاءِ؟": [{"w": "مَنْ", "t": "kim?", "r": "soru", "n": "Kişiyi sorar."}, {"w": "هَؤُلَاءِ", "t": "bunlar", "r": "zamir", "n": "Yakın çoğul (insanlar)."}],
    "تِلْكَ الْكُتُبُ هُنَاكَ.": [{"w": "تِلْكَ", "t": "o", "r": "zamir", "n": "İnsan olmayan çoğul için uzak dişil işaret."}, {"w": "الْكُتُبُ", "t": "kitaplar", "r": "isim", "n": "Kırık çoğul."}, {"w": "هُنَاكَ", "t": "orada", "r": "isim", "n": "Uzak yer bildirir."}],
    "ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ.": [{"w": "ذَلِكَ", "t": "o", "r": "zamir", "n": "Uzak işaret; burada yüceliği vurgular."}, {"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "Kur’an."}, {"w": "لَا", "t": "hiç … yok", "r": "harf", "n": "Cinsi tamamen olumsuzlayan لَا."}, {"w": "رَيْبَ", "t": "şüphe", "r": "isim", "n": "لَا’dan sonra üstün okunur."}, {"w": "فِيهِ", "t": "onda", "r": "harf", "n": "فِي + ـهِ."}],
    "أُولَئِكَ هُمُ الْمُفْلِحُونَ.": [{"w": "أُولَئِكَ", "t": "işte onlar", "r": "zamir", "n": "Uzak çoğul işaret."}, {"w": "هُمُ", "t": "onlar", "r": "zamir", "n": "Vurgulayan zamir; ال’den önce mîm ötre okunur."}, {"w": "الْمُفْلِحُونَ", "t": "kurtuluşa erenler", "r": "isim", "n": "Sâlim eril çoğul."}],
    "الطَّالِبُ الَّذِي يَكْتُبُ الدَّرْسَ مُجْتَهِدٌ.": [{"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "Cümlenin öznesi; ötre."}, {"w": "الَّذِي", "t": "ki o", "r": "zamir", "n": "İlgi zamiri (eril tekil): “… olan, ki o”."}, {"w": "يَكْتُبُ", "t": "yazıyor", "r": "fiil", "n": "Sıla cümlesinin fiili."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Nesne; üstün."}, {"w": "مُجْتَهِدٌ", "t": "çalışkan", "r": "isim", "n": "Ana cümlenin yüklemi."}],
    "الطَّالِبَةُ الَّتِي فِي الْفَصْلِ أُخْتِي.": [{"w": "الطَّالِبَةُ", "t": "kız öğrenci", "r": "isim", "n": "Özne; ötre."}, {"w": "الَّتِي", "t": "ki o", "r": "zamir", "n": "İlgi zamiri (dişil tekil ve insan olmayan çoğul): “… olan, ki o”."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer; sıla bir yer ifadesi."}, {"w": "الْفَصْلِ", "t": "sınıf", "r": "isim", "n": "Esre."}, {"w": "أُخْتِي", "t": "kız kardeşim", "r": "isim", "n": "أُخْت + ـِي; yüklem."}],
    "الْكِتَابُ الَّذِي قَرَأْتُهُ جَدِيدٌ.": [{"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "Özne."}, {"w": "الَّذِي", "t": "ki", "r": "zamir", "n": "İlgi zamiri (eril tekil): “… olan, ki o”."}, {"w": "قَرَأْتُهُ", "t": "onu okudum", "r": "fiil", "n": "قَرَأْتُ + ـهُ; ـهُ kitaba dönen zamir."}, {"w": "جَدِيدٌ", "t": "yeni", "r": "isim", "n": "Yüklem."}],
    "الرِّجَالُ الَّذِينَ ذَهَبُوا إِلَى الْمَسْجِدِ مُعَلِّمُونَ.": [{"w": "الرِّجَالُ", "t": "adamlar", "r": "isim", "n": "Kırık çoğul; özne."}, {"w": "الَّذِينَ", "t": "ki onlar", "r": "zamir", "n": "İlgi zamiri (eril çoğul)."}, {"w": "ذَهَبُوا", "t": "gittiler", "r": "fiil", "n": "Sıla fiili; çoğulla uyumlu."}, {"w": "إِلَى", "t": "-e", "r": "harf", "n": "Harf-i cer."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Esre."}, {"w": "مُعَلِّمُونَ", "t": "öğretmenler", "r": "isim", "n": "Yüklem; sâlim eril çoğul."}],
    "الْكُتُبُ الَّتِي قَرَأْتُهَا كَثِيرَةٌ.": [{"w": "الْكُتُبُ", "t": "kitaplar", "r": "isim", "n": "İnsan olmayan çoğul."}, {"w": "الَّتِي", "t": "ki", "r": "zamir", "n": "İlgi zamiri (dişil tekil ve insan olmayan çoğul): “… olan, ki o”."}, {"w": "قَرَأْتُهَا", "t": "onları okudum", "r": "fiil", "n": "قَرَأْتُ + ـهَا; insan olmayan çoğula dönen dişil zamir."}, {"w": "كَثِيرَةٌ", "t": "çok", "r": "isim", "n": "Dişil tekil yüklem."}],
    "اُكْتُبْ مَا تَسْمَعُ.": [{"w": "اُكْتُبْ", "t": "yaz!", "r": "fiil", "n": "Emir (Ders 11)."}, {"w": "مَا", "t": "şey ki", "r": "zamir", "n": "İlgi anlamında مَا: “… olan şey”."}, {"w": "تَسْمَعُ", "t": "duyuyorsun", "r": "fiil", "n": "Muzari “sen”; sıla fiili."}],
    "أُحِبُّ مَنْ يَقْرَأُ الْقُرْآنَ.": [{"w": "أُحِبُّ", "t": "severim", "r": "fiil", "n": "يُحِبُّ “sever” fiilinin “ben” biçimi."}, {"w": "مَنْ", "t": "kimse ki", "r": "zamir", "n": "İlgi anlamında مَنْ: “… olan kimse”."}, {"w": "يَقْرَأُ", "t": "okuyor", "r": "fiil", "n": "Sıla fiili."}, {"w": "الْقُرْآنَ", "t": "Kur’an’ı", "r": "isim", "n": "Nesne; üstün."}],
    "هَذَا هُوَ الْكِتَابُ الَّذِي قَرَأْتُهُ أَمْسِ.": [{"w": "هَذَا", "t": "bu", "r": "zamir", "n": "İşaret ismi."}, {"w": "هُوَ", "t": "o", "r": "zamir", "n": "Vurgu zamiri: “işte”."}, {"w": "الْكِتَابُ", "t": "kitap", "r": "isim", "n": "Yüklem tarafı."}, {"w": "الَّذِي", "t": "ki", "r": "zamir", "n": "İlgi zamiri (eril tekil): “… olan, ki o”."}, {"w": "قَرَأْتُهُ", "t": "onu okudum", "r": "fiil", "n": "Dönüş zamirli sıla."}, {"w": "أَمْسِ", "t": "dün", "r": "isim", "n": "Zaman bildirir."}],
    "أَيُّ كِتَابٍ هَذَا؟": [{"w": "أَيُّ", "t": "hangi?", "r": "soru", "n": "Sonraki ismi tamlama gibi esre yapar."}, {"w": "كِتَابٍ", "t": "kitap", "r": "isim", "n": "أَيُّ’dan sonra esreli tenvin."}, {"w": "هَذَا", "t": "bu", "r": "zamir", "n": "İşaret ismi."}],
    "مَنِ الطَّالِبُ الَّذِي كَتَبَ الدَّرْسَ؟": [{"w": "مَنِ", "t": "kim?", "r": "soru", "n": "مَنْ, ال’den önce مَنِ okunur."}, {"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "Ötre."}, {"w": "الَّذِي", "t": "ki o", "r": "zamir", "n": "İlgi zamiri (eril tekil): “… olan, ki o”."}, {"w": "كَتَبَ", "t": "yazdı", "r": "fiil", "n": "Sıla fiili."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Nesne."}],
    "عِنْدِي كِتَابٌ قَرَأْتُهُ مَرَّتَيْنِ.": [{"w": "عِنْدِي", "t": "bende", "r": "isim", "n": "Sahiplik (Ders 15)."}, {"w": "كِتَابٌ", "t": "bir kitap", "r": "isim", "n": "Belirsiz; bu yüzden الَّذِي kullanılmaz."}, {"w": "قَرَأْتُهُ", "t": "onu okudum", "r": "fiil", "n": "Belirsiz ismi niteleyen cümle; ـهُ kitaba döner."}, {"w": "مَرَّتَيْنِ", "t": "iki kez", "r": "isim", "n": "مَرَّة “kez” kelimesinin ikili (ـَيْنِ)."}],
    "الْمَرْأَةُ الَّتِي ذَهَبَتْ إِلَى السُّوقِ أُمِّي.": [{"w": "الْمَرْأَةُ", "t": "kadın", "r": "isim", "n": "Özne; ötre."}, {"w": "الَّتِي", "t": "ki o", "r": "zamir", "n": "İlgi zamiri (dişil tekil ve insan olmayan çoğul): “… olan, ki o”."}, {"w": "ذَهَبَتْ", "t": "gitti", "r": "fiil", "n": "Sıla fiili; dişil."}, {"w": "إِلَى", "t": "-e", "r": "harf", "n": "Harf-i cer."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Esre."}, {"w": "أُمِّي", "t": "annem", "r": "isim", "n": "أُمّ + ـِي; yüklem."}],
    "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ.": [{"w": "صِرَاطَ", "t": "yolu(na)", "r": "isim", "n": "Tamlamanın ilk ismi; üstün."}, {"w": "الَّذِينَ", "t": "ki onlar", "r": "zamir", "n": "İlgi zamiri (eril çoğul)."}, {"w": "أَنْعَمْتَ", "t": "nimet verdin", "r": "fiil", "n": "Mâzi; تَ “sen”."}, {"w": "عَلَيْهِمْ", "t": "onlara", "r": "harf", "n": "عَلَى + ـهِمْ; الَّذِينَ’e dönen zamir."}],
    "الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ.": [{"w": "الَّذِي", "t": "ki O", "r": "zamir", "n": "Önceki âyetteki “Rab”e bağlanan ilgi zamiri."}, {"w": "أَطْعَمَهُمْ", "t": "onları doyurdu", "r": "fiil", "n": "أَطْعَمَ + ـهُمْ."}, {"w": "مِنْ", "t": "-den", "r": "harf", "n": "Harf-i cer."}, {"w": "جُوعٍ", "t": "açlık", "r": "isim", "n": "Esreli tenvin."}],
    "الْمُعَلِّمُ فِي الْمَسْجِدِ.": [{"w": "الْمُعَلِّمُ", "t": "öğretmen", "r": "isim", "n": "Mübtedâ: merfû."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer; mebnî."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Mecrûr: esre."}],
    "قَرَأْتُ كِتَابَ الْمُعَلِّمِ.": [{"w": "قَرَأْتُ", "t": "okudum", "r": "fiil", "n": "Mâzi; تُ fâil zamiri."}, {"w": "كِتَابَ", "t": "kitabını", "r": "isim", "n": "Nesne: mansûb; tamlamanın ilk ismi."}, {"w": "الْمُعَلِّمِ", "t": "öğretmenin", "r": "isim", "n": "Tamlamanın ikinci ismi: mecrûr."}],
    "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ.": [{"w": "إِنَّ", "t": "şüphesiz", "r": "harf", "n": "Sonraki ismi mansûb yapar."}, {"w": "اللَّهَ", "t": "Allah", "r": "isim", "n": "إِنَّ’nin ismi: mansûb."}, {"w": "غَفُورٌ", "t": "çok bağışlayan", "r": "isim", "n": "Yüklem (haber): merfû."}, {"w": "رَحِيمٌ", "t": "çok merhametli", "r": "isim", "n": "İkinci yüklem: merfû."}],
    "رَأَيْتُ الْمُعَلِّمِينَ فِي الْمَسْجِدِ.": [{"w": "رَأَيْتُ", "t": "gördüm", "r": "fiil", "n": "Mâzi."}, {"w": "الْمُعَلِّمِينَ", "t": "öğretmenleri", "r": "isim", "n": "Nesne: mansûb; sâlim çoğulda ـِينَ."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Mecrûr."}],
    "الطُّلَّابُ يَكْتُبُونَ الدُّرُوسَ.": [{"w": "الطُّلَّابُ", "t": "öğrenciler", "r": "isim", "n": "Mübtedâ: merfû."}, {"w": "يَكْتُبُونَ", "t": "yazıyorlar", "r": "fiil", "n": "Merfû muzari; ن duruyor."}, {"w": "الدُّرُوسَ", "t": "dersleri", "r": "isim", "n": "Nesne: mansûb; دَرْس’in kırık çoğulu."}],
    "لَنْ يَذْهَبَ الطَّالِبُ إِلَى السُّوقِ.": [{"w": "لَنْ", "t": "-meyecek", "r": "harf", "n": "Muzariyi mansûb yapar."}, {"w": "يَذْهَبَ", "t": "gitmek", "r": "fiil", "n": "Mansûb muzari: üstün."}, {"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "Fâil: merfû."}, {"w": "إِلَى", "t": "-e", "r": "harf", "n": "Harf-i cer."}, {"w": "السُّوقِ", "t": "çarşı", "r": "isim", "n": "Mecrûr."}],
    "لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ.": [{"w": "لَمْ", "t": "-medi", "r": "harf", "n": "Muzariyi meczûm yapar."}, {"w": "يَكْتُبِ", "t": "yazmak", "r": "fiil", "n": "Meczûm; ال’den önce esre okunur."}, {"w": "الطَّالِبُ", "t": "öğrenci", "r": "isim", "n": "Fâil: merfû."}, {"w": "الدَّرْسَ", "t": "dersi", "r": "isim", "n": "Mef‘ûl: mansûb."}],
    "أُرِيدُ أَنْ أَذْهَبَ إِلَى الْمَسْجِدِ.": [{"w": "أُرِيدُ", "t": "istiyorum", "r": "fiil", "n": "Merfû muzari “ben”."}, {"w": "أَنْ", "t": "-mek", "r": "harf", "n": "Sonraki muzariyi mansûb yapar."}, {"w": "أَذْهَبَ", "t": "gitmek (ben)", "r": "fiil", "n": "Mansûb muzari."}, {"w": "إِلَى", "t": "-e", "r": "harf", "n": "Harf-i cer."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Mecrûr."}],
    "أُرِيدُ أَنْ أَتَعَلَّمَ الْعَرَبِيَّةَ.": [{"w": "أُرِيدُ", "t": "istiyorum", "r": "fiil", "n": "Merfû muzari."}, {"w": "أَنْ", "t": "-mek", "r": "harf", "n": "Mansûb yapan edat."}, {"w": "أَتَعَلَّمَ", "t": "öğrenmek (ben)", "r": "fiil", "n": "Mansûb muzari."}, {"w": "الْعَرَبِيَّةَ", "t": "Arapçayı", "r": "isim", "n": "Nesne: mansûb."}],
    "قَرَأَ الْمُعَلِّمُ الْكِتَابَ فِي الْمَسْجِدِ.": [{"w": "قَرَأَ", "t": "okudu", "r": "fiil", "n": "Mâzi; mebnî."}, {"w": "الْمُعَلِّمُ", "t": "öğretmen", "r": "isim", "n": "Fâil: merfû."}, {"w": "الْكِتَابَ", "t": "kitabı", "r": "isim", "n": "Mef‘ûl: mansûb."}, {"w": "فِي", "t": "-de", "r": "harf", "n": "Harf-i cer."}, {"w": "الْمَسْجِدِ", "t": "mescit", "r": "isim", "n": "Mecrûr."}],
    "كِتَابُ الطَّالِبِ عَلَى الْمَكْتَبِ.": [{"w": "كِتَابُ", "t": "kitabı", "r": "isim", "n": "Mübtedâ: merfû; tamlamanın ilk ismi."}, {"w": "الطَّالِبِ", "t": "öğrencinin", "r": "isim", "n": "Tamlamanın ikinci ismi: mecrûr."}, {"w": "عَلَى", "t": "üzerinde", "r": "harf", "n": "Harf-i cer."}, {"w": "الْمَكْتَبِ", "t": "masa", "r": "isim", "n": "Mecrûr."}],
    "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ.": [{"w": "إِيَّاكَ", "t": "yalnız seni", "r": "zamir", "n": "Öne alınmış nesne zamiri."}, {"w": "نَعْبُدُ", "t": "kulluk ederiz", "r": "fiil", "n": "Merfû muzari “biz”."}, {"w": "وَإِيَّاكَ", "t": "ve yalnız senden", "r": "zamir", "n": "وَ + إِيَّاكَ."}, {"w": "نَسْتَعِينُ", "t": "yardım dileriz", "r": "fiil", "n": "Merfû muzari “biz”."}],
    "مَاذَا تُرِيدُ أَنْ تَفْعَلَ غَدًا؟": [{"w": "مَاذَا", "t": "ne?", "r": "soru", "n": "Fiilden önce “ne?”"}, {"w": "تُرِيدُ", "t": "istiyorsun", "r": "fiil", "n": "Merfû muzari “sen”."}, {"w": "أَنْ", "t": "-mek", "r": "harf", "n": "Mansûb yapan edat."}, {"w": "تَفْعَلَ", "t": "yapmak (sen)", "r": "fiil", "n": "Mansûb muzari."}, {"w": "غَدًا", "t": "yarın", "r": "isim", "n": "Zaman bildiren isim; mansûb."}]
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
    ],
    "ders-08": [
      { ar: "الطَّالِبَانِ يَكْتُبَانِ الدَّرْسَ.", tr: "İki öğrenci dersi yazıyor." },
      { ar: "الطَّالِبَتَانِ تَكْتُبَانِ الرِّسَالَةَ.", tr: "İki kadın öğrenci mektubu yazıyor." },
      { ar: "أَنْتُمَا تَذْهَبَانِ إِلَى الْمَدْرَسَةِ.", tr: "Siz ikiniz okula gidiyorsunuz." },
      { ar: "هُنَّ يَقْرَأْنَ الْقُرْآنَ.", tr: "Onlar (kadınlar) Kur’an okuyorlar." },
      { ar: "أَنْتُنَّ تَكْتُبْنَ الْوَاجِبَ.", tr: "Siz (kadınlar) ödevi yazıyorsunuz." },
      { ar: "الطَّالِبَاتُ يَكْتُبْنَ الدَّرْسَ.", tr: "Kadın öğrenciler dersi yazıyor." },
      { ar: "لَا أَشْرَبُ الْقَهْوَةَ.", tr: "Kahve içmem." },
      { ar: "لَا نَذْهَبُ إِلَى السُّوقِ.", tr: "Çarşıya gitmiyoruz." },
      { ar: "هُوَ لَا يَأْكُلُ الْخُبْزَ.", tr: "O ekmek yemiyor." },
      { ar: "هِيَ لَا تَكْتُبُ الرِّسَالَةَ.", tr: "O (kadın) mektubu yazmıyor." },
      { ar: "أَنْتِ لَا تَشْرَبِينَ الْمَاءَ.", tr: "Sen (kadın) su içmiyorsun." },
      { ar: "هُمْ لَا يَذْهَبُونَ إِلَى السُّوقِ.", tr: "Onlar çarşıya gitmiyorlar." },
      { ar: "هَلْ تَكْتُبَانِ الدَّرْسَ؟", tr: "Siz ikiniz dersi yazıyor musunuz?" },
      { ar: "لَا، لَا أَشْرَبُ الْقَهْوَةَ.", tr: "Hayır, kahve içmem." },
      { ar: "الرَّجُلَانِ يَجْلِسَانِ فِي الْغُرْفَةِ.", tr: "İki adam odada oturuyor." },
      { ar: "الْبَنَاتُ يَلْعَبْنَ فِي الْحَدِيقَةِ.", tr: "Kızlar bahçede oynuyorlar." }
    ],
    "ders-09": [
      { ar: "سَأَكْتُبُ الدَّرْسَ غَدًا.", tr: "Yarın dersi yazacağım." },
      { ar: "سَنَذْهَبُ إِلَى الْمَسْجِدِ.", tr: "Mescide gideceğiz." },
      { ar: "أَنْتَ سَتَقْرَأُ الْكِتَابَ.", tr: "Sen kitabı okuyacaksın." },
      { ar: "أَنْتِ سَتَكْتُبِينَ رِسَالَةً.", tr: "Sen (kadın) bir mektup yazacaksın." },
      { ar: "هُوَ سَيَشْرَبُ الْمَاءَ.", tr: "O suyu içecek." },
      { ar: "هِيَ سَتَفْتَحُ الْبَابَ.", tr: "O (kadın) kapıyı açacak." },
      { ar: "سَيَذْهَبُونَ إِلَى السُّوقِ غَدًا.", tr: "Yarın çarşıya gidecekler." },
      { ar: "سَوْفَ نَقْرَأُ الْقُرْآنَ.", tr: "Kur’an okuyacağız." },
      { ar: "كَلَّا سَوْفَ تَعْلَمُونَ.", tr: "Hayır! Yakında bileceksiniz." },
      { ar: "لَنْ أَشْرَبَ الْقَهْوَةَ.", tr: "Kahve içmeyeceğim." },
      { ar: "لَنْ نَذْهَبَ إِلَى السُّوقِ.", tr: "Çarşıya gitmeyeceğiz." },
      { ar: "لَنْ يَذْهَبُوا إِلَى الْمَدْرَسَةِ غَدًا.", tr: "Yarın okula gitmeyecekler." },
      { ar: "لَنْ تَكْتُبِي الرِّسَالَةَ.", tr: "Sen (kadın) mektubu yazmayacaksın." },
      { ar: "مَاذَا سَتَفْعَلُ غَدًا؟", tr: "Yarın ne yapacaksın?" },
      { ar: "سَأَذْهَبُ إِلَى الْمَسْجِدِ، إِنْ شَاءَ اللَّهُ.", tr: "Allah dilerse mescide gideceğim." },
      { ar: "لَا، لَنْ أَكْتُبَ الرِّسَالَةَ الْيَوْمَ.", tr: "Hayır, mektubu bugün yazmayacağım." }
    ],
    "ders-10": [
      { ar: "أَمْسِ كَتَبْتُ رِسَالَةً.", tr: "Dün bir mektup yazdım." },
      { ar: "الآنَ أَكْتُبُ رِسَالَةً.", tr: "Şimdi bir mektup yazıyorum." },
      { ar: "غَدًا سَأَكْتُبُ رِسَالَةً.", tr: "Yarın bir mektup yazacağım." },
      { ar: "ذَهَبْنَا إِلَى السُّوقِ أَمْسِ.", tr: "Dün çarşıya gittik." },
      { ar: "نَذْهَبُ إِلَى الْمَسْجِدِ كُلَّ يَوْمٍ.", tr: "Her gün mescide gideriz." },
      { ar: "سَنَذْهَبُ إِلَى الْمَدْرَسَةِ غَدًا.", tr: "Yarın okula gideceğiz." },
      { ar: "مَا شَرِبْتُ الْقَهْوَةَ أَمْسِ.", tr: "Dün kahve içmedim." },
      { ar: "مَا شَرِبْتُ الْقَهْوَةَ.", tr: "Kahve içmedim." },
      { ar: "قَرَأَتْ فَاطِمَةُ الْكِتَابَ أَمْسِ.", tr: "Fatıma dün kitabı okudu." },
      { ar: "تَقْرَأُ فَاطِمَةُ الْكِتَابَ الآنَ.", tr: "Fatıma şimdi kitabı okuyor." },
      { ar: "سَتَقْرَأُ فَاطِمَةُ الْكِتَابَ غَدًا.", tr: "Fatıma yarın kitabı okuyacak." },
      { ar: "مَا ذَهَبُوا إِلَى الْمَسْجِدِ.", tr: "Mescide gitmediler." },
      { ar: "لَا يَكْتُبُ، وَلَنْ يَكْتُبَ.", tr: "Yazmıyor ve yazmayacak." },
      { ar: "مَاذَا فَعَلْتَ أَمْسِ؟", tr: "Dün ne yaptın?" },
      { ar: "قَرَأْتُ كِتَابًا.", tr: "Bir kitap okudum." },
      { ar: "الْيَوْمَ أَقْرَأُ كِتَابًا.", tr: "Bugün bir kitap okuyorum." }
    ],
    "ders-11": [
      { ar: "اُكْتُبْ دَرْسًا.", tr: "Bir ders yaz." },
      { ar: "اُكْتُبِ الدَّرْسَ.", tr: "Dersi yaz." },
      { ar: "اِجْلِسْ، مِنْ فَضْلِكَ.", tr: "Lütfen otur." },
      { ar: "اِجْلِسِي هُنَا.", tr: "Burada otur. (kadına)" },
      { ar: "اُدْخُلُوا الْمَسْجِدَ.", tr: "Mescide girin." },
      { ar: "اِفْتَحِ الْبَابَ.", tr: "Kapıyı aç." },
      { ar: "اِقْرَأْ كِتَابًا.", tr: "Bir kitap oku." },
      { ar: "اِسْمَعْ وَاكْتُبْ.", tr: "Dinle ve yaz." },
      { ar: "اِشْرَبِي الْمَاءَ.", tr: "Suyu iç. (kadına)" },
      { ar: "اِذْهَبَا إِلَى السُّوقِ.", tr: "Siz ikiniz çarşıya gidin." },
      { ar: "اِذْهَبُوا إِلَى الْمَسْجِدِ.", tr: "Mescide gidin." },
      { ar: "اُخْرُجْنَ مِنَ الْفَصْلِ.", tr: "Sınıftan çıkın. (kadınlara)" },
      { ar: "اُدْخُلْ وَاجْلِسْ.", tr: "Gir ve otur." },
      { ar: "اقْرَأْ بِاسْمِ رَبِّكَ الَّذِي خَلَقَ.", tr: "Yaratan Rabbinin adıyla oku!" }
    ],
    "ders-12": [
      { ar: "لَا تَكْتُبْ هُنَا.", tr: "Buraya yazma." },
      { ar: "لَا تَذْهَبِي إِلَى السُّوقِ.", tr: "Çarşıya gitme. (kadına)" },
      { ar: "لَا تَجْلِسُوا هُنَا.", tr: "Burada oturmayın." },
      { ar: "لَا تَشْرَبِ الْقَهْوَةَ.", tr: "Kahve içme." },
      { ar: "لَا تَحْزَنْ.", tr: "Üzülme." },
      { ar: "لَا تَفْتَحَا الْبَابَ.", tr: "Siz ikiniz kapıyı açmayın." },
      { ar: "لَمْ أَكْتُبِ الدَّرْسَ بَعْدُ.", tr: "Dersi henüz yazmadım." },
      { ar: "لَمْ يَذْهَبُوا إِلَى الْمَسْجِدِ.", tr: "Mescide gitmediler." },
      { ar: "لَمْ نَشْرَبِ الْمَاءَ.", tr: "Suyu içmedik." },
      { ar: "لَمْ تَفْتَحِي الْبَابَ.", tr: "Kapıyı açmadın. (kadın)" },
      { ar: "هُوَ لَمْ يَخْرُجْ مِنَ الْبَيْتِ.", tr: "O evden çıkmadı." },
      { ar: "لَا تَشْرَبِ الْقَهْوَةَ، اِشْرَبِ الْمَاءَ.", tr: "Kahve içme, su iç." },
      { ar: "لَمْ يَلِدْ وَلَمْ يُولَدْ.", tr: "Doğurmadı ve doğurulmadı." },
      { ar: "لَا تَحْزَنْ إِنَّ اللَّهَ مَعَنَا.", tr: "Üzülme, şüphesiz Allah bizimle beraberdir." }
    ],
    "ders-13": [
      { ar: "مَنْ هَذَا؟", tr: "Bu kim?" },
      { ar: "مَا هَذَا؟", tr: "Bu ne?" },
      { ar: "مَاذَا تَقْرَأُ؟", tr: "Ne okuyorsun?" },
      { ar: "أَيْنَ الْمَسْجِدُ؟", tr: "Mescit nerede?" },
      { ar: "إِلَى أَيْنَ تَذْهَبُ؟", tr: "Nereye gidiyorsun?" },
      { ar: "مِنْ أَيْنَ أَنْتَ؟", tr: "Nerelisin?" },
      { ar: "مَتَى تَذْهَبُ إِلَى السُّوقِ؟", tr: "Çarşıya ne zaman gidiyorsun?" },
      { ar: "كَيْفَ حَالُكَ؟", tr: "Nasılsın?" },
      { ar: "بِخَيْرٍ، الْحَمْدُ لِلَّهِ.", tr: "İyiyim, Allah’a hamd olsun." },
      { ar: "لِمَاذَا لَمْ تَذْهَبْ إِلَى الْمَدْرَسَةِ؟", tr: "Neden okula gitmedin?" },
      { ar: "كَمْ طَالِبًا فِي الْفَصْلِ؟", tr: "Sınıfta kaç öğrenci var?" },
      { ar: "مَنْ كَتَبَ الدَّرْسَ؟", tr: "Dersi kim yazdı?" },
      { ar: "مَا اسْمُكَ؟", tr: "Adın ne?" },
      { ar: "هَلْ أَتَاكَ حَدِيثُ الْغَاشِيَةِ؟", tr: "Kuşatanın haberi sana geldi mi?" }
    ],
    "ders-14": [
      { ar: "كِتَابُ الطَّالِبِ جَدِيدٌ.", tr: "Öğrencinin kitabı yeni." },
      { ar: "هَذَا بَيْتُ الْمُعَلِّمِ.", tr: "Bu, öğretmenin evi." },
      { ar: "فَتَحَ الطَّالِبُ بَابَ الْفَصْلِ.", tr: "Öğrenci sınıfın kapısını açtı." },
      { ar: "ذَهَبْتُ إِلَى بَيْتِ الْمُعَلِّمِ.", tr: "Öğretmenin evine gittim." },
      { ar: "بَابُ بَيْتِ الْمُعَلِّمِ كَبِيرٌ.", tr: "Öğretmenin evinin kapısı büyük." },
      { ar: "قَرَأْتُ كِتَابَ اللَّهِ.", tr: "Allah’ın kitabını okudum." },
      { ar: "مُحَمَّدٌ رَسُولُ اللَّهِ.", tr: "Muhammed Allah’ın elçisidir." },
      { ar: "لِمَنْ هَذَا الْكِتَابُ؟", tr: "Bu kitap kimin?" },
      { ar: "هَذَا كِتَابُ الْمُعَلِّمِ.", tr: "Bu, öğretmenin kitabı." },
      { ar: "بَيْتُ الْمُعَلِّمِ قَرِيبٌ مِنَ الْمَسْجِدِ.", tr: "Öğretmenin evi mescide yakın." },
      { ar: "فَتَحْتُ بَابَ الْمَسْجِدِ.", tr: "Mescidin kapısını açtım." },
      { ar: "بِسْمِ اللَّهِ.", tr: "Allah’ın adıyla." },
      { ar: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ.", tr: "Hamd, âlemlerin Rabbi Allah’a mahsustur." },
      { ar: "مَالِكِ يَوْمِ الدِّينِ.", tr: "Din (hesap) gününün sahibi." }
    ],
    "ders-15": [
      { ar: "هَذَا كِتَابِي.", tr: "Bu benim kitabım." },
      { ar: "مَا اسْمُكِ؟", tr: "Adın ne? (kadına)" },
      { ar: "اِسْمُهُ عَلِيٌّ.", tr: "Onun adı Ali." },
      { ar: "عِنْدِي كِتَابٌ جَدِيدٌ.", tr: "Yeni bir kitabım var." },
      { ar: "ذَهَبَ الطَّالِبُ إِلَى بَيْتِهِ.", tr: "Öğrenci evine gitti." },
      { ar: "أَيْنَ بَيْتُكُمْ؟", tr: "Eviniz nerede?" },
      { ar: "بَيْتُنَا قَرِيبٌ مِنَ الْمَسْجِدِ.", tr: "Evimiz mescide yakın." },
      { ar: "هَلْ عِنْدَكَ أَخٌ؟", tr: "Kardeşin var mı?" },
      { ar: "كِتَابِي فِي بَيْتِي.", tr: "Kitabım evimde." },
      { ar: "ذَهَبْتُ مَعَهُمْ إِلَى السُّوقِ.", tr: "Onlarla çarşıya gittim." },
      { ar: "كَتَبْتُهُ أَمْسِ.", tr: "Onu dün yazdım." },
      { ar: "أُمِّي فِي الْبَيْتِ.", tr: "Annem evde." },
      { ar: "لَكُمْ دِينُكُمْ وَلِيَ دِينِ.", tr: "Sizin dininiz size, benim dinim bana." },
      { ar: "أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ؟", tr: "Senin göğsünü açıp genişletmedik mi?" }
    ],
    "ders-16": [
      { ar: "الْكِتَابُ عَلَى الْمَكْتَبِ.", tr: "Kitap masanın üzerinde." },
      { ar: "ذَهَبْتُ مِنَ الْبَيْتِ إِلَى الْمَسْجِدِ.", tr: "Evden mescide gittim." },
      { ar: "كَتَبْتُ الدَّرْسَ بِالْقَلَمِ.", tr: "Dersi kalemle yazdım." },
      { ar: "هَذَا الْكِتَابُ لِلطَّالِبِ.", tr: "Bu kitap öğrencinindir." },
      { ar: "جَلَسَ الْمُعَلِّمُ عَلَى الْكُرْسِيِّ.", tr: "Öğretmen sandalyeye oturdu." },
      { ar: "سَأَلْتُ عَنِ الدَّرْسِ.", tr: "Ders hakkında sordum." },
      { ar: "خَرَجَ الطَّالِبُ مِنَ الْفَصْلِ.", tr: "Öğrenci sınıftan çıktı." },
      { ar: "السَّلَامُ عَلَيْكُمْ.", tr: "Esenlik üzerinize olsun." },
      { ar: "وَعَلَيْكُمُ السَّلَامُ.", tr: "Esenlik sizin de üzerinize olsun." },
      { ar: "نَظَرْتُ إِلَى الْقَمَرِ.", tr: "Aya baktım." },
      { ar: "دَرَسْتُ حَتَّى الْمَسَاءِ.", tr: "Akşama kadar ders çalıştım." },
      { ar: "الطَّالِبُ فِي الْفَصْلِ مَعَ الْمُعَلِّمِ.", tr: "Öğrenci öğretmenle birlikte sınıfta." },
      { ar: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ.", tr: "De ki: Sabah aydınlığının Rabbine sığınırım." },
      { ar: "إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ.", tr: "Ameller ancak niyetlere göredir." }
    ],
    "ders-17": [
      { ar: "فِي الْفَصْلِ طَالِبَانِ.", tr: "Sınıfta iki öğrenci var." },
      { ar: "رَأَيْتُ طَالِبَيْنِ فِي الْمَسْجِدِ.", tr: "Mescitte iki öğrenci gördüm." },
      { ar: "الْمُعَلِّمُونَ فِي الْمَدْرَسَةِ.", tr: "Öğretmenler okulda." },
      { ar: "ذَهَبْتُ مَعَ الْمُعَلِّمِينَ.", tr: "Öğretmenlerle gittim." },
      { ar: "الطَّالِبَاتُ مُجْتَهِدَاتٌ.", tr: "Kadın öğrenciler çalışkan." },
      { ar: "هَذِهِ كُتُبٌ جَدِيدَةٌ.", tr: "Bunlar yeni kitaplar." },
      { ar: "الْبُيُوتُ قَرِيبَةٌ مِنَ الْمَسْجِدِ.", tr: "Evler mescide yakın." },
      { ar: "الرِّجَالُ فِي السُّوقِ.", tr: "Adamlar çarşıda." },
      { ar: "الْأَوْلَادُ يَلْعَبُونَ فِي الْحَدِيقَةِ.", tr: "Çocuklar bahçede oynuyorlar." },
      { ar: "عِنْدِي كُتُبٌ كَثِيرَةٌ.", tr: "Çok kitabım var." },
      { ar: "الطُّلَّابُ مُجْتَهِدُونَ.", tr: "Öğrenciler çalışkan." },
      { ar: "قَرَأْتُ كِتَابَيْنِ.", tr: "İki kitap okudum." },
      { ar: "تَبَّتْ يَدَا أَبِي لَهَبٍ.", tr: "Ebû Leheb’in iki eli kurusun." },
      { ar: "يَدْخُلُونَ فِي دِينِ اللَّهِ أَفْوَاجًا.", tr: "Allah’ın dinine bölük bölük giriyorlar." }
    ],
    "ders-18": [
      { ar: "هَذَا الْكِتَابُ جَدِيدٌ.", tr: "Bu kitap yeni." },
      { ar: "ذَلِكَ الرَّجُلُ مُعَلِّمٌ.", tr: "Şu adam bir öğretmen." },
      { ar: "تِلْكَ الْمَدْرَسَةُ كَبِيرَةٌ.", tr: "O okul büyük." },
      { ar: "هَؤُلَاءِ طُلَّابٌ مُجْتَهِدُونَ.", tr: "Bunlar çalışkan öğrenciler." },
      { ar: "أُولَئِكَ الطُّلَّابُ فِي الْمَسْجِدِ.", tr: "Şu öğrenciler mescitte." },
      { ar: "هَذَانِ كِتَابَانِ.", tr: "Bunlar iki kitap." },
      { ar: "هَاتَانِ طَالِبَتَانِ.", tr: "Bunlar iki kadın öğrenci." },
      { ar: "هَذِهِ الْكُتُبُ جَدِيدَةٌ.", tr: "Bu kitaplar yeni." },
      { ar: "مَا ذَلِكَ؟", tr: "Şu ne?" },
      { ar: "ذَلِكَ مَسْجِدٌ كَبِيرٌ.", tr: "Şu büyük bir mescit." },
      { ar: "مَنْ هَؤُلَاءِ؟", tr: "Bunlar kim?" },
      { ar: "تِلْكَ الْكُتُبُ هُنَاكَ.", tr: "O kitaplar orada." },
      { ar: "ذَلِكَ الْكِتَابُ لَا رَيْبَ فِيهِ.", tr: "O kitap; onda hiç şüphe yoktur." },
      { ar: "أُولَئِكَ هُمُ الْمُفْلِحُونَ.", tr: "İşte onlar kurtuluşa erenlerdir." }
    ],
    "ders-19": [
      { ar: "الطَّالِبُ الَّذِي يَكْتُبُ الدَّرْسَ مُجْتَهِدٌ.", tr: "Dersi yazan öğrenci çalışkan." },
      { ar: "الطَّالِبَةُ الَّتِي فِي الْفَصْلِ أُخْتِي.", tr: "Sınıftaki kız öğrenci kız kardeşim." },
      { ar: "الْكِتَابُ الَّذِي قَرَأْتُهُ جَدِيدٌ.", tr: "Okuduğum kitap yeni." },
      { ar: "الرِّجَالُ الَّذِينَ ذَهَبُوا إِلَى الْمَسْجِدِ مُعَلِّمُونَ.", tr: "Mescide giden adamlar öğretmen." },
      { ar: "الْكُتُبُ الَّتِي قَرَأْتُهَا كَثِيرَةٌ.", tr: "Okuduğum kitaplar çok." },
      { ar: "اُكْتُبْ مَا تَسْمَعُ.", tr: "Duyduğunu yaz." },
      { ar: "أُحِبُّ مَنْ يَقْرَأُ الْقُرْآنَ.", tr: "Kur’an okuyanı severim." },
      { ar: "هَذَا هُوَ الْكِتَابُ الَّذِي قَرَأْتُهُ أَمْسِ.", tr: "Dün okuduğum kitap işte bu." },
      { ar: "أَيُّ كِتَابٍ هَذَا؟", tr: "Bu hangi kitap?" },
      { ar: "مَنِ الطَّالِبُ الَّذِي كَتَبَ الدَّرْسَ؟", tr: "Dersi yazan öğrenci kim?" },
      { ar: "عِنْدِي كِتَابٌ قَرَأْتُهُ مَرَّتَيْنِ.", tr: "İki kez okuduğum bir kitabım var." },
      { ar: "الْمَرْأَةُ الَّتِي ذَهَبَتْ إِلَى السُّوقِ أُمِّي.", tr: "Çarşıya giden kadın annem." },
      { ar: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ.", tr: "Kendilerine nimet verdiklerinin yoluna." },
      { ar: "الَّذِي أَطْعَمَهُمْ مِنْ جُوعٍ.", tr: "Ki O, onları açlıktan doyurdu." }
    ],
    "ders-20": [
      { ar: "كَتَبَ الطَّالِبُ الدَّرْسَ.", tr: "Öğrenci dersi yazdı." },
      { ar: "الْمُعَلِّمُ فِي الْمَسْجِدِ.", tr: "Öğretmen mescitte." },
      { ar: "قَرَأْتُ كِتَابَ الْمُعَلِّمِ.", tr: "Öğretmenin kitabını okudum." },
      { ar: "إِنَّ اللَّهَ غَفُورٌ رَحِيمٌ.", tr: "Şüphesiz Allah çok bağışlayan, çok merhamet edendir." },
      { ar: "رَأَيْتُ الْمُعَلِّمِينَ فِي الْمَسْجِدِ.", tr: "Mescitte öğretmenleri gördüm." },
      { ar: "الطُّلَّابُ يَكْتُبُونَ الدُّرُوسَ.", tr: "Öğrenciler dersleri yazıyorlar." },
      { ar: "لَنْ يَذْهَبَ الطَّالِبُ إِلَى السُّوقِ.", tr: "Öğrenci çarşıya gitmeyecek." },
      { ar: "لَمْ يَكْتُبِ الطَّالِبُ الدَّرْسَ.", tr: "Öğrenci dersi yazmadı." },
      { ar: "أُرِيدُ أَنْ أَذْهَبَ إِلَى الْمَسْجِدِ.", tr: "Mescide gitmek istiyorum." },
      { ar: "أُرِيدُ أَنْ أَتَعَلَّمَ الْعَرَبِيَّةَ.", tr: "Arapça öğrenmek istiyorum." },
      { ar: "قَرَأَ الْمُعَلِّمُ الْكِتَابَ فِي الْمَسْجِدِ.", tr: "Öğretmen kitabı mescitte okudu." },
      { ar: "كِتَابُ الطَّالِبِ عَلَى الْمَكْتَبِ.", tr: "Öğrencinin kitabı masanın üzerinde." },
      { ar: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ.", tr: "Yalnız sana kulluk eder, yalnız senden yardım dileriz." },
      { ar: "مَاذَا تُرِيدُ أَنْ تَفْعَلَ غَدًا؟", tr: "Yarın ne yapmak istiyorsun?" }
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
  // Sûre sayfaları (sureler.js) sesli okuma ve bildirimler için bu ortak yardımcıları kullanır.
  window.ArapcaApp = Object.assign(window.ArapcaApp || {}, { speakArabic, stopActiveSpeech, showToast });
})();
