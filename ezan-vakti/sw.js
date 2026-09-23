/* Ezan Vakti — service worker.
   Görevi: uygulama kabuğunu (HTML, ikonlar, yazı tipleri) önbelleğe alıp
   çevrimdışı açılmayı sağlamak. Vakit verisi ASLA burada önbeklenmez;
   onu sayfanın kendisi localStorage'da tutuyor. */
/* v2: v1 hata sayfalarını (404/500) da index.html diye saklayabiliyordu;
   sürüm değişince o eski önbellek "activate" adımında silinir. */
var V = "ezan-vakti-v2";
var SHELL = [
  "./", "./index.html", "./manifest.json",
  "./icon-192.png", "./icon-512.png", "./icon-maskable-512.png", "./apple-touch-icon.png"
];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(V)
      .then(function(c){ return Promise.all(SHELL.map(function(u){
        return c.add(new Request(u, {cache:"reload"})).catch(function(){});   // biri eksikse kurulum çökmesin
      })); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(ks){
      return Promise.all(ks.map(function(k){ return k===V ? null : caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var r = e.request;
  if(r.method !== "GET") return;

  var u = new URL(r.url);
  var ayniKaynak = (u.origin === self.location.origin);
  var yaziTipi   = (u.hostname === "fonts.googleapis.com" || u.hostname === "fonts.gstatic.com");
  /* Diyanet servisi ve proxy dışarıda bırakılır — vakitler her zaman tazedir. */
  if(!ayniKaynak && !yaziTipi) return;

  /* Sayfa açılışı: önce ağ, olmazsa önbellekteki son kopya. */
  if(r.mode === "navigate"){
    e.respondWith(
      fetch(r).then(function(res){
        /* Yalnız sağlam yanıt saklanır. 404/500 gibi bir hata sayfası saklanırsa
           çevrimdışı açılışta uygulama yerine o hata sayfası gelirdi. */
        if(res && res.ok && res.type === "basic"){
          var kopya = res.clone();
          caches.open(V).then(function(c){ c.put("./index.html", kopya); });
          return res;
        }
        /* Sunucu hata döndürdüyse ve elde sağlam bir kopya varsa onu göster. */
        return caches.match("./index.html").then(function(m){ return m || res; });
      }).catch(function(){
        return caches.match("./index.html").then(function(m){ return m || caches.match("./"); });
      })
    );
    return;
  }

  /* Diğer dosyalar: önbellekten ver, arka planda tazele. */
  e.respondWith(
    caches.match(r).then(function(hit){
      var net = fetch(r).then(function(res){
        /* opaque: Google Fonts gibi başka sitelerden gelen, durumu okunamayan yanıt.
           Aynı siteden gelenlerde yalnız res.ok olanlar saklanır. */
        if(res && (res.ok || (res.type === "opaque" && !ayniKaynak))){
          var kopya = res.clone();
          caches.open(V).then(function(c){ c.put(r, kopya); });
        }
        return res;
      }).catch(function(){ return hit; });
      return hit || net;
    })
  );
});
