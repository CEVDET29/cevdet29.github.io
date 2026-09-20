/* Ezan Vakti — service worker.
   Görevi: uygulama kabuğunu (HTML, ikonlar, yazı tipleri) önbelleğe alıp
   çevrimdışı açılmayı sağlamak. Vakit verisi ASLA burada önbeklenmez;
   onu sayfanın kendisi localStorage'da tutuyor. */
var V = "ezan-vakti-v1";
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
        var kopya = res.clone();
        caches.open(V).then(function(c){ c.put("./index.html", kopya); });
        return res;
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
        if(res && (res.ok || res.type === "opaque")){
          var kopya = res.clone();
          caches.open(V).then(function(c){ c.put(r, kopya); });
        }
        return res;
      }).catch(function(){ return hit; });
      return hit || net;
    })
  );
});
