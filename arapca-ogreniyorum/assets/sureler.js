/*
 * Sureler üzerinden Arapça — sayfa oluşturucu
 * app.js'ten ÖNCE yüklenir: içerik çizildikten sonra app.js'in harekeler,
 * yazı tipi, tema ve sesli okuma araçları bu içeriğe de uygulanır.
 */
(() => {
  "use strict";

  const DATA = window.SURE_VERILERI;
  const root = document.getElementById("sure-root");
  if (!DATA || !root) return;

  const PREFIX = "arapca-ogreniyorum";
  const page = document.body.dataset.page;
  const ROLE_LABELS = { isim: "İsim", fiil: "Fiil", zamir: "Zamir / işaret", harf: "Harf (edat)", soru: "Soru kelimesi", ek: "Şahıs eki" };
  const SPEAK_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 5 6.8 8.5H3.5v7h3.3L11 19V5Zm4.2 4a4.5 4.5 0 0 1 0 6M18 6.5a8 8 0 0 1 0 11"/></svg>';
  const PLAY_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5.5v13l10-6.5-10-6.5Z"/></svg>';

  const pad3 = (n) => String(n).padStart(3, "0");
  const store = {
    get(key) { try { return localStorage.getItem(`${PREFIX}:${key}`); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(`${PREFIX}:${key}`, value); } catch { /* yok say */ } },
    remove(key) { try { localStorage.removeItem(`${PREFIX}:${key}`); } catch { /* yok say */ } }
  };
  // app.js ortak araçlarını dışarı açarsa onları kullan; yoksa buradaki yedekler çalışır.
  const REVIEW_INTERVAL_DAYS = [1, 3, 7, 14];
  let toastTimer = null;
  const fallback = {
    showToast(message) {
      const box = document.getElementById("toast");
      if (!box) return;
      box.textContent = message;
      box.classList.add("show");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => box.classList.remove("show"), 3200);
    },
    stopActiveSpeech() {
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      document.querySelectorAll(".is-speaking[data-tts]").forEach((b) => { b.classList.remove("is-speaking"); delete b.dataset.tts; });
    },
    speakArabic(text, button) {
      if (!("speechSynthesis" in window)) {
        fallback.showToast("Bu tarayıcı sesli okumayı desteklemiyor.");
        return;
      }
      const wasActive = button?.dataset.tts === "on";
      fallback.stopActiveSpeech();
      if (wasActive) return;
      const voices = window.speechSynthesis.getVoices() || [];
      const voice = voices.find((v) => v.lang?.toLowerCase().startsWith("ar")) || null;
      if (!voice && voices.length) {
        fallback.showToast("Cihazında Arapça konuşma sesi yok. Ses paketini ayarlardan yükleyebilirsin.");
        return;
      }
      const u = new SpeechSynthesisUtterance(String(text).slice(0, 200));
      if (voice) u.voice = voice;
      u.lang = voice?.lang || "ar-SA";
      u.rate = 0.75;
      if (button) {
        button.dataset.tts = "on";
        button.classList.add("is-speaking");
      }
      const done = () => { if (button) { button.classList.remove("is-speaking"); delete button.dataset.tts; } };
      u.onend = done;
      u.onerror = done;
      window.speechSynthesis.speak(u);
    },
    readQueue() {
      try {
        const q = JSON.parse(localStorage.getItem(`${PREFIX}:review-queue`) || "[]");
        return Array.isArray(q) ? q : [];
      } catch { return []; }
    },
    saveQueue(q) {
      try { localStorage.setItem(`${PREFIX}:review-queue`, JSON.stringify(q)); } catch { /* yok say */ }
    },
    queueReviewItem(item) {
      const queue = fallback.readQueue();
      const index = queue.findIndex((e) => e.id === item.id);
      const existing = index >= 0 ? queue[index] : null;
      const queued = {
        ...existing,
        ...item,
        intervalIndex: Math.max(0, Number(existing?.intervalIndex || 0) - (existing ? 1 : 0)),
        dueAt: Date.now(),
        attempts: Number(existing?.attempts || 0) + 1,
        updatedAt: Date.now()
      };
      if (index >= 0) queue.splice(index, 1, queued);
      else queue.push(queued);
      fallback.saveQueue(queue);
    },
    advanceReviewItem(id) {
      const queue = fallback.readQueue();
      const index = queue.findIndex((e) => e.id === id);
      if (index < 0) return;
      const item = queue[index];
      const step = Number(item.intervalIndex || 0);
      if (step >= REVIEW_INTERVAL_DAYS.length) {
        queue.splice(index, 1);
        const mastered = Number(store.get("review-mastered") || 0) + 1;
        store.set("review-mastered", String(mastered));
      } else {
        item.dueAt = Date.now() + REVIEW_INTERVAL_DAYS[step] * 24 * 60 * 60 * 1000;
        item.intervalIndex = step + 1;
        item.updatedAt = Date.now();
      }
      fallback.saveQueue(queue);
    }
  };
  const app = () => ({ ...fallback, ...(window.ArapcaApp || {}) });
  const toast = (message) => app().showToast(message);

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function arabic(tag, text, className = "arabic") {
    const node = el(tag, className, text);
    node.lang = "ar";
    node.dir = "rtl";
    return node;
  }

  // Arapça parçaları ayrı span'a koyarak karışık metni doğru yönde gösterir.
  function mixed(container, text) {
    const run = /([\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+(?:[\s\u00B7/-]+[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]+)*)/g;
    String(text || "").split(run).filter(Boolean).forEach((part) => {
      if (/[\u0600-\u06FF]/.test(part)) {
        const span = arabic("span", part, "arabic inline");
        span.dataset.arabicTools = "true";
        container.appendChild(span);
        container.appendChild(document.createTextNode("\u200E"));
      } else {
        container.appendChild(document.createTextNode(part));
      }
    });
    return container;
  }

  function iconButton(label, icon, extraClass = "") {
    const button = el("button", `flashcard-action flashcard-action--speak ${extraClass}`.trim());
    button.type = "button";
    button.setAttribute("aria-label", label);
    button.title = label;
    button.innerHTML = icon;
    return button;
  }

  // --- Ses: önce gerçek Kur’an tilaveti, olmazsa cihazın Arapça sesi ---
  let currentAudio = null;
  let currentButton = null;
  let playlist = null;
  let cancelPlaylist = null;

  function stopAudio() {
    if (currentAudio) {
      currentAudio.onended = null;
      currentAudio.onerror = null;
      currentAudio.pause();
      currentAudio = null;
    }
    currentButton?.classList.remove("is-speaking");
    currentButton = null;
    document.querySelectorAll(".ayah-card.is-playing").forEach((card) => card.classList.remove("is-playing"));
  }

  function playSources(sources, button, fallbackText, onDone, fromPlaylist = false) {
    if (playlist && !fromPlaylist) cancelPlaylist?.();
    const same = currentButton === button && !playlist;
    stopAudio();
    app().stopActiveSpeech?.();
    if (same) return;
    currentButton = button;
    button?.classList.add("is-speaking");

    const finish = (ok) => {
      if (currentButton === button) {
        button?.classList.remove("is-speaking");
        currentButton = null;
      }
      currentAudio = null;
      onDone?.(ok);
    };

    const tryAt = (index) => {
      if (currentButton !== button) return;
      if (index >= sources.length) {
        finish(false);
        if (fallbackText && button && app().speakArabic) app().speakArabic(fallbackText, button);
        return;
      }
      const audio = new Audio(sources[index]);
      currentAudio = audio;
      audio.onended = () => finish(true);
      audio.onerror = () => tryAt(index + 1);
      audio.play().catch(() => tryAt(index + 1));
    };
    tryAt(0);
  }

  const wordAudio = (s, a, w) => [`https://audio.qurancdn.com/wbw/${pad3(s)}_${pad3(a)}_${pad3(w)}.mp3`];
  const ayahAudio = (s, a) => [
    `https://verses.quran.com/Alafasy/mp3/${pad3(s)}${pad3(a)}.mp3`,
    `https://everyayah.com/data/Alafasy_128kbps/${pad3(s)}${pad3(a)}.mp3`
  ];

  // --- Ortak görünüm ayarları ---
  const prefKeys = { words: "word-map", okunus: "sure-okunus", meal: "sure-meal", autoplay: "sure-word-audio" };
  const prefOn = (name) => store.get(prefKeys[name]) !== "hidden";

  function applyPrefs() {
    document.body.dataset.wordMap = prefOn("words") ? "shown" : "hidden";
    document.body.dataset.okunus = prefOn("okunus") ? "shown" : "hidden";
    document.body.dataset.meal = prefOn("meal") ? "shown" : "hidden";
  }

  function buildToggles() {
    const wrap = el("div", "word-map-legend sure-toggles");
    const row = el("div", "sure-toggles__row");
    const toggles = [
      ["words", "Kelime kelime"],
      ["okunus", "Okunuş"],
      ["meal", "Meal"],
      ["autoplay", "Kelimeye dokununca seslendir"]
    ];
    toggles.forEach(([name, label]) => {
      const button = el("button", "secondary-button word-map-toggle");
      button.type = "button";
      const render = () => {
        const on = prefOn(name);
        button.textContent = `${label}: ${on ? "Açık" : "Kapalı"}`;
        button.setAttribute("aria-pressed", String(on));
      };
      button.addEventListener("click", () => {
        store.set(prefKeys[name], prefOn(name) ? "hidden" : "shown");
        render();
        applyPrefs();
      });
      render();
      row.appendChild(button);
    });

    const keys = el("div", "word-map-legend__keys");
    ["isim", "fiil", "zamir", "harf", "soru"].forEach((role) => {
      const item = el("span", "word-map-legend__item", ROLE_LABELS[role]);
      item.dataset.role = role;
      keys.appendChild(item);
    });
    const hint = el("p", "word-map-legend__hint", "Renk kelimenin görevini, altındaki yazı Türkçesini gösterir. Kelimeye dokununca okunuşu, kökü ve dilbilgisi notu açılır; kelime hâfızın sesinden dinlenir. Kendini sınamak için mealı kapatıp âyetin anlamını kelimelerden çıkarmayı dene.");
    wrap.append(row, keys, hint);
    return wrap;
  }

  // --- Kelime çipleri ---
  function buildWordMap(words, surahNo, ayahNo) {
    const wrap = el("div", "word-map");
    const row = el("div", "word-map__row");
    row.dir = "rtl";
    row.lang = "ar";
    const note = el("div", "word-map__note");
    note.hidden = true;
    const noteText = el("p", "word-map__note-text");
    const noteSpeak = iconButton("Kelimeyi dinle", SPEAK_ICON, "word-map__note-speak");
    note.append(noteText, noteSpeak);

    words.forEach((item, index) => {
      const chip = el("button", "word-chip");
      chip.type = "button";
      chip.dataset.role = item.r;
      chip.setAttribute("aria-label", `${item.w} — ${item.o} — ${item.t}`);
      const ar = arabic("span", item.w, "word-chip__ar");
      const ok = el("span", "word-chip__ok", item.o);
      const tr = el("span", "word-chip__tr", item.t);
      chip.append(ar, ok, tr);

      const sources = wordAudio(surahNo, ayahNo, index + 1);
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
        const head = el("strong");
        mixed(head, `${item.w}`);
        noteText.append(head, document.createTextNode(` · ${item.o} · ${item.t} · ${ROLE_LABELS[item.r] || ""}`));
        if (item.n) {
          noteText.appendChild(document.createElement("br"));
          mixed(noteText, item.n);
        }
        if (item.k) {
          noteText.appendChild(document.createElement("br"));
          const root = el("span", "word-map__root");
          root.append(document.createTextNode("Kök: "));
          const rootAr = arabic("span", item.k.split("-").join(" - "), "arabic inline");
          rootAr.dataset.arabicTools = "true";
          root.appendChild(rootAr);
          noteText.appendChild(root);
        }
        noteSpeak.onclick = (event) => {
          event.stopPropagation();
          playSources(sources, noteSpeak, item.w);
        };
        note.hidden = false;
        if (prefOn("autoplay")) playSources(sources, noteSpeak, item.w);
      });
      row.appendChild(chip);
    });

    wrap.append(row, note);
    return wrap;
  }

  function ayahText(words) {
    return words.map((w) => w.w).join(" ");
  }

  function toArabicDigits(n) {
    return String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[d]);
  }

  function buildAyahCard({ no, text, okunus, meal, words, surahNo, audio, label }) {
    const card = el("article", "ayah-card");
    if (no) card.id = `ayet-${no}`;
    const head = el("div", "ayah-card__head");
    const badge = el("span", "ayah-card__no", label || String(no));
    const play = iconButton(`${label || no + ". âyeti"} dinle`, PLAY_ICON, "ayah-card__play");
    play.addEventListener("click", () => playSources(audio, play, text));
    head.append(badge, play);

    const ar = arabic("p", "", "arabic sentence ayah-card__arabic");
    ar.dataset.arabicTools = "true";
    if (no) {
      // Son kelime ile âyet numarası aynı satırda kalsın.
      const parts = text.split(" ");
      const last = parts.pop();
      const tail = el("span", "ayah-card__tail");
      const mark = el("span", "ayah-card__mark", toArabicDigits(no));
      mark.setAttribute("aria-hidden", "true");
      tail.append(document.createTextNode(`${last} `), mark);
      ar.append(document.createTextNode(parts.length ? `${parts.join(" ")} ` : ""), tail);
    } else {
      ar.append(document.createTextNode(text));
    }

    const ok = el("p", "ayah-card__okunus", okunus);
    const tr = el("p", "ayah-card__meal", meal);
    card.append(head, ar, ok, tr, buildWordMap(words, audio.wordSurah || surahNo, audio.wordAyah || no));
    card.dataset.surah = String(surahNo);
    return card;
  }

  function topicHref(no) {
    return `sure-${no}.html`;
  }

  function statusOf(no) {
    if (store.get(`sure-${no}:complete`) === "true") return "complete";
    if (store.get(`sure-${no}:answers`)) return "started";
    return "new";
  }

  // =================== Liste sayfası ===================
  function renderList() {
    const order = DATA.sira;
    const done = order.filter((no) => statusOf(no) === "complete").length;

    const intro = el("section", "course-intro");
    intro.innerHTML = `<div><p class="eyebrow">Kur’an’ın sonundan başına</p><h1>Sureler üzerinden Arapça</h1><p>Her sûreyi kelime kelime çözüyoruz: Arapça yazılış, okunuş, Türkçe anlam, kök ve kısa dilbilgisi notu. Âyetleri ve tek tek kelimeleri hâfızın sesinden dinleyebilirsin.</p></div>`;
    const progress = el("div", "progress-card");
    const percent = Math.round((done / order.length) * 100);
    progress.innerHTML = `<div class="progress-card__row"><span>Sûre ilerlemesi</span><strong>${done} / ${order.length}</strong></div><div class="progress-track" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>`;
    intro.appendChild(progress);

    const why = el("aside", "new-concepts");
    why.setAttribute("aria-label", "Neden sondan başlıyoruz");
    why.innerHTML = `<h3 class="new-concepts__heading">Neden sondan başlıyoruz?</h3><div class="new-concepts__grid">
      <div class="new-concept"><strong>Kısa ve tanıdık</strong><p>Son sûreler kısa, namazda en çok okunanlardır. Ezberindeki sesleri artık anlamıyla eşleştireceksin.</p></div>
      <div class="new-concept"><strong>Derslerle aynı adımda</strong><p>Muzari “ben”, mâzi “o”, “biz” eki gibi derslerde gördüğün yapılar burada gerçek metinde karşına çıkar.</p></div>
      <div class="new-concept"><strong>Kelime birikimi</strong><p>رَبّ، شَرّ، النَّاس، دِين gibi kelimeler sûreler arasında tekrar eder; her yeni sûre bir öncekinden kolay gelir.</p></div>
    </div>`;

    const section = el("section", "section-block");
    section.innerHTML = `<div class="section-heading"><div><p class="eyebrow">1. paket · 10 sûre</p><h2>Sûreler</h2></div></div>`;
    order.forEach((no, index) => {
      const s = DATA.sureler[no];
      const wordCount = s.ayetler.reduce((sum, a) => sum + a.kelimeler.length, 0);
      const status = statusOf(no);
      const card = el("article", "lesson-card sure-card");
      card.innerHTML = `<div class="lesson-card__number" aria-hidden="true">${no}</div>`;
      const bodyEl = el("div", "lesson-card__body");
      const meta = el("div", "lesson-card__meta");
      const pill = el("span", `status-pill${status === "complete" ? " complete" : ""}`, status === "complete" ? "Tamamlandı" : status === "started" ? "Devam ediyor" : "Başlanmadı");
      meta.append(pill, el("span", "", `${index + 1}. sıra · ${s.yer} · yaklaşık ${s.dakika} dakika`));
      const h3 = el("h3");
      h3.append(document.createTextNode(`${s.ad} sûresi `));
      const h3ar = arabic("span", s.adAr, "arabic inline sure-card__ar");
      h3ar.dataset.arabicTools = "true";
      h3.appendChild(h3ar);
      const p = el("p", "", s.giris);
      const tags = el("div", "lesson-card__tags");
      [`${s.ayetler.length} âyet`, `${wordCount} kelime`, `${s.sorular.length} soru`, s.anlam].forEach((t) => tags.appendChild(el("span", "", t)));
      bodyEl.append(meta, h3, p, tags);
      const link = el("a", "primary-button", status === "complete" ? "Tekrar aç" : status === "started" ? "Devam et" : "Başla");
      link.href = topicHref(no);
      card.append(bodyEl, link);
      section.appendChild(card);
    });

    const next = el("section", "section-block");
    next.innerHTML = `<div class="section-heading"><div><p class="eyebrow">Sıradakiler</p><h2>Bir sonraki paket</h2></div></div>`;
    const list = el("ol", "course-roadmap");
    DATA.siradakiler.forEach((s) => {
      const li = el("li");
      li.innerHTML = `<span>${s.no}</span>`;
      const div = el("div");
      const strong = el("strong");
      strong.append(document.createTextNode(`${s.ad} `));
      strong.appendChild(arabic("b", s.adAr, ""));
      div.append(strong, el("small", "", "Yakında eklenecek"));
      li.appendChild(div);
      list.appendChild(li);
    });
    next.appendChild(list);

    root.append(intro, why, section, next);
  }

  // =================== Sûre sayfası ===================
  function renderSurah(no) {
    const s = DATA.sureler[no];
    if (!s) {
      root.innerHTML = `<section class="course-intro"><div><h1>Sûre bulunamadı</h1><p><a href="sureler.html">Sûre listesine dön</a></p></div></section>`;
      return;
    }
    const order = DATA.sira;
    const pos = order.indexOf(no);
    const prev = order[pos - 1];
    const next = order[pos + 1];
    const id = `sure-${no}`;
    const wordCount = s.ayetler.reduce((sum, a) => sum + a.kelimeler.length, 0);

    document.title = `${s.ad} sûresi · Arapça Öğreniyorum`;
    const brandSmall = document.querySelector(".brand small");
    if (brandSmall) brandSmall.textContent = `Sûre ${no} · ${s.ad}`;

    root.className = "lesson-shell";
    const nav = el("aside", "lesson-nav");
    nav.setAttribute("aria-label", "Sûre bölümleri");
    [["baslangic", "Başlangıç"], ["besmele", "Besmele"], ["ayetler", "Âyet âyet"], ["dilbilgisi", "Dilbilgisi"], ["kokler", "Kökler"], ["kartlar", "Kelime kartları"], ["test", "Mini test"], ["sonuc", "Sûre sonu"]].forEach(([href, label]) => {
      const a = el("a", "", label);
      a.href = `#${href}`;
      nav.appendChild(a);
    });

    const content = el("article", "lesson-content");

    // Başlangıç
    const hero = el("section", "lesson-hero sure-hero");
    hero.id = "baslangic";
    const meta = el("div", "lesson-hero__meta");
    [`Sûre ${no}`, `${s.yer}’de indi`, `${s.ayetler.length} âyet · ${wordCount} kelime`, `${s.dakika} dakika`].forEach((t, i) => meta.appendChild(el("span", i === 0 ? "lesson-index" : "", t)));
    const h1 = el("h1");
    h1.append(document.createTextNode(`${s.ad} sûresi`));
    const title = arabic("p", s.adAr, "arabic sure-hero__title");
    title.dataset.arabicTools = "true";
    const lead = el("p", "", `Adının anlamı: ${s.anlam}. ${s.giris}`);
    const goals = el("div", "goal-list");
    goals.setAttribute("aria-label", "Hedefler");
    s.hedefler.forEach((g) => {
      const d = el("div");
      d.innerHTML = '<span aria-hidden="true">✓</span> ';
      d.appendChild(mixed(el("span", "sure-goal__text"), g));
      goals.appendChild(d);
    });
    const listen = el("div", "sure-listen");
    const listenAll = el("button", "primary-button sure-listen__all");
    listenAll.type = "button";
    listenAll.innerHTML = `${PLAY_ICON}<span>Sûrenin tamamını dinle</span>`;
    listen.append(listenAll, el("small", "", "Okuyan: Mishary Rashid Alafasy · kelime sesleri: quran.com"));
    hero.append(meta, h1, title, lead, goals, listen);

    // Besmele + ayarlar
    const bes = el("section", "lesson-section");
    bes.id = "besmele";
    bes.innerHTML = `<p class="section-kicker">Başlarken</p><h2>Besmele</h2><p>Tevbe dışındaki bütün sûrelerin başında okunur. Dört kelimeyi bir kez çözersen her sûrede tanırsın.</p>`;
    bes.appendChild(buildToggles());
    const b = DATA.besmele;
    const besAudio = ayahAudio(1, 1);
    besAudio.wordSurah = 1;
    besAudio.wordAyah = 1;
    bes.appendChild(buildAyahCard({ no: 0, label: "Besmele", text: b.ar, okunus: b.okunus, meal: b.meal, words: b.kelimeler, surahNo: no, audio: besAudio }));

    // Âyetler
    const ay = el("section", "lesson-section");
    ay.id = "ayetler";
    ay.innerHTML = `<p class="section-kicker">1 · Âyet âyet</p><h2>Kelime kelime okuma</h2><p>Önce âyeti dinle, sonra kelimelere tek tek dokun. Her kelimenin altında okunuşu ve Türkçe karşılığı var.</p>`;
    const ayahCards = [];
    s.ayetler.forEach((a, i) => {
      const card = buildAyahCard({ no: i + 1, text: ayahText(a.kelimeler), okunus: a.okunus, meal: a.meal, words: a.kelimeler, surahNo: no, audio: ayahAudio(no, i + 1) });
      ayahCards.push(card);
      ay.appendChild(card);
    });

    const resetListen = () => {
      playlist = null;
      listenAll.classList.remove("is-speaking");
      listenAll.querySelector("span").textContent = "Sûrenin tamamını dinle";
    };
    cancelPlaylist = () => {
      resetListen();
      stopAudio();
    };
    listenAll.addEventListener("click", () => {
      if (playlist) {
        cancelPlaylist();
        return;
      }
      const queue = [{ src: besAudio, card: bes.querySelector(".ayah-card"), text: b.ar }].concat(
        s.ayetler.map((a, i) => ({ src: ayahAudio(no, i + 1), card: ayahCards[i], text: ayahText(a.kelimeler) }))
      );
      playlist = queue;
      listenAll.querySelector("span").textContent = "Durdur";
      const step = (index) => {
        if (playlist !== queue) return;
        if (index >= queue.length) {
          cancelPlaylist();
          return;
        }
        const item = queue[index];
        currentButton = null;
        playSources(item.src, listenAll, null, (ok) => {
          if (playlist !== queue) return;
          if (!ok && index === 0) {
            resetListen();
            toast("Tilavet sesi açılamadı. İnternet bağlantını kontrol et.");
            return;
          }
          step(index + 1);
        }, true);
        item.card.classList.add("is-playing");
        item.card.scrollIntoView({ behavior: "smooth", block: "center" });
      };
      step(0);
    });

    // Dilbilgisi
    const gram = el("section", "lesson-section");
    gram.id = "dilbilgisi";
    gram.innerHTML = `<p class="section-kicker">2 · Bu sûrenin dilbilgisi</p><h2>Derslerle bağlantı</h2>`;
    const grid = el("div", "concept-grid");
    s.odak.forEach((o, i) => {
      const card = el("article", `concept-card${i === 1 ? " concept-card--verb" : i === 2 ? " concept-card--particle" : ""}`);
      card.appendChild(arabic("p", o.ar, "arabic term"));
      card.appendChild(el("h3", "", o.baslik));
      card.appendChild(mixed(el("p"), o.metin));
      grid.appendChild(card);
    });
    gram.appendChild(grid);

    // Kökler
    const roots = new Map();
    s.ayetler.forEach((a) => a.kelimeler.forEach((w) => {
      if (!w.k) return;
      if (!roots.has(w.k)) roots.set(w.k, []);
      const list = roots.get(w.k);
      if (!list.some((x) => x.w === w.w)) list.push(w);
    }));
    const kok = el("section", "lesson-section");
    kok.id = "kokler";
    kok.innerHTML = `<p class="section-kicker">3 · Kök haritası</p><h2>Bu sûredeki kökler</h2><p>Arapça kelimeler çoğunlukla üç harfli bir kökten türer. Aynı kökü tanırsan yeni kelimenin anlamını tahmin edebilirsin.</p>`;
    const tableWrap = el("div", "pronoun-table-wrap");
    const table = el("table", "pronoun-table sure-root-table");
    table.innerHTML = "<thead><tr><th>Kök</th><th>Sûredeki kelimeler</th><th>Anlamları</th></tr></thead>";
    const tbody = el("tbody");
    [...roots.entries()].forEach(([k, words]) => {
      const tr = el("tr");
      const kTd = arabic("td", k.split("-").join(" - "), "arabic");
      const wTd = arabic("td", words.map((w) => w.w).join("  ·  "), "arabic");
      kTd.dataset.arabicTools = "true";
      wTd.dataset.arabicTools = "true";
      tr.append(kTd, wTd);
      tr.appendChild(el("td", "", words.map((w) => w.t).join(" · ")));
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    tableWrap.appendChild(table);
    kok.appendChild(tableWrap);

    // Kelime kartları
    const kart = el("section", "lesson-section");
    kart.id = "kartlar";
    kart.innerHTML = `<p class="section-kicker">4 · Kelime kartları</p><h2>Önemli kelimeleri ezberle</h2><p>Karta dokununca anlamı açılır. Önce anlamı hatırlamaya çalış, sonra kontrol et.</p>`;
    const fgrid = el("div", "flashcard-grid");
    s.kartlar.forEach(([ar, tr, type]) => {
      const wrap = el("div", "flashcard-wrap");
      const card = el("button", "flashcard");
      card.type = "button";
      card.setAttribute("aria-expanded", "false");
      const typeClass = /fiil/i.test(type) ? "verb" : /harf/i.test(type) ? "particle" : "noun";
      card.append(el("span", `flashcard__type ${typeClass}`, type), arabic("span", ar), el("span", "flashcard__answer", tr), el("span", "flashcard__hint", "Anlamı göster"));
      card.addEventListener("click", () => {
        const revealed = card.classList.toggle("revealed");
        card.setAttribute("aria-expanded", String(revealed));
      });
      const actions = el("div", "flashcard-actions");
      const speak = iconButton(`${ar} kelimesini sesli oku`, SPEAK_ICON);
      speak.addEventListener("click", () => app().speakArabic?.(ar, speak));
      actions.appendChild(speak);
      wrap.append(card, actions);
      fgrid.appendChild(wrap);
    });
    kart.appendChild(fgrid);

    // Mini test
    const answersKey = `${id}:answers`;
    const scoreKey = `${id}:score`;
    const completeKey = `${id}:complete`;
    let saved = {};
    try { saved = JSON.parse(store.get(answersKey) || "{}") || {}; } catch { saved = {}; }

    const test = el("section", "lesson-section exercise");
    test.id = "test";
    test.innerHTML = `<p class="section-kicker">5 · Mini test</p><h2>Ne kadar anladın?</h2><p>Notlara bakmadan cevapla. Yanlış yaptığın sorular ana sayfadaki tekrar listesine eklenir.</p>`;
    const qList = el("div", "question-list");
    s.sorular.forEach((q, i) => {
      const fs = el("fieldset", "question");
      fs.dataset.answer = q.cevap;
      fs.dataset.index = String(i);
      fs.id = `${id}-q${i + 1}`;
      const legend = el("legend");
      legend.appendChild(el("span", "question-number", String(i + 1)));
      const prompt = el("span");
      mixed(prompt, q.s);
      legend.appendChild(prompt);
      const row = el("div", `choice-row${q.secenekler.every(([, l]) => /^[\u0600-\u06FF\s]+$/.test(l)) ? " arabic-choices" : ""}`);
      q.secenekler.forEach(([value, label]) => {
        const lab = el("label");
        const input = el("input");
        input.type = "radio";
        input.name = `${id}-q${i + 1}`;
        input.value = value;
        if (saved[i] === value) input.checked = true;
        const span = el("span");
        mixed(span, label);
        lab.append(input, span);
        row.appendChild(lab);
      });
      const fb = el("p", "feedback");
      fb.setAttribute("aria-live", "polite");
      fs.append(legend, row, fb);
      fs.addEventListener("change", () => {
        fs.classList.remove("correct", "incorrect");
        fs.querySelectorAll("label").forEach((l) => l.classList.remove("answer-correct", "answer-wrong"));
        fb.textContent = "";
        const picked = fs.querySelector("input:checked");
        saved[i] = picked?.value;
        store.set(answersKey, JSON.stringify(saved));
      });
      qList.appendChild(fs);
    });
    test.appendChild(qList);

    // Sonuç
    const fin = el("section", "lesson-section lesson-finish");
    fin.id = "sonuc";
    fin.innerHTML = `<p class="section-kicker">6 · Sûre sonu</p><h2>Çalışmanı tamamla</h2><p>Cevaplarını kontrol et; sûreyi bir kez daha baştan dinleyip kelimeleri takip ederek sesli oku.</p>`;
    const actions = el("div", "finish-actions");
    const check = el("button", "primary-button", "Cevaplarımı kontrol et");
    check.type = "button";
    const copy = el("button", "secondary-button", "Sonucu kopyala");
    copy.type = "button";
    copy.disabled = true;
    actions.append(check, copy);
    const result = el("div", "result-card");
    result.hidden = true;
    result.setAttribute("aria-live", "polite");
    result.innerHTML = `<div class="result-score"><span>0/${s.sorular.length}</span><small>Doğru cevap</small></div><div><h3>Sonucun hazır</h3><p></p></div>`;
    const completion = el("div", "completion-box");
    const cLabel = el("label", "check-line");
    const cInput = el("input");
    cInput.type = "checkbox";
    cInput.checked = store.get(completeKey) === "true";
    cLabel.append(cInput, el("span", "", "Bu sûreyi tamamladım."));
    const reset = el("button", "danger-link", "Bu sûredeki cevapları sıfırla");
    reset.type = "button";
    completion.append(cLabel, reset);
    fin.append(actions, result, completion);

    let lastReport = "";
    function checkAll(scroll = true) {
      let correct = 0;
      const wrong = [];
      qList.querySelectorAll(".question").forEach((fs) => {
        const i = Number(fs.dataset.index);
        const q = s.sorular[i];
        const picked = fs.querySelector("input:checked");
        const fb = fs.querySelector(".feedback");
        fs.classList.remove("correct", "incorrect");
        fs.querySelectorAll("label").forEach((l) => l.classList.remove("answer-correct", "answer-wrong"));
        fb.textContent = "";
        const right = picked?.value === q.cevap;
        fs.querySelectorAll("input").forEach((input) => {
          if (input.value === q.cevap) input.closest("label").classList.add("answer-correct");
          else if (input.checked) input.closest("label").classList.add("answer-wrong");
        });
        if (right) {
          correct += 1;
          fs.classList.add("correct");
          mixed(fb, `Doğru. ${q.aciklama}`);
          app().advanceReviewItem?.(`${id}-q${i + 1}`);
        } else {
          fs.classList.add("incorrect");
          mixed(fb, `${picked ? "Tekrar bak." : "Cevap seçilmedi."} ${q.aciklama}`);
          wrong.push(i + 1);
          app().queueReviewItem?.({
            id: `${id}-q${i + 1}`,
            lessonId: id,
            lessonTitle: `${s.ad} sûresi`,
            topic: `${s.ad} sûresi`,
            prompt: q.s,
            sectionId: `${id}-q${i + 1}`
          });
        }
      });
      const total = s.sorular.length;
      store.set(scoreKey, `${correct}/${total}`);
      result.hidden = false;
      result.querySelector(".result-score span").textContent = `${correct}/${total}`;
      result.querySelector("h3").textContent = correct === total ? "Tebrikler, hepsi doğru!" : correct >= total - 2 ? "Çok iyi gidiyorsun" : "Biraz daha tekrar";
      result.querySelector("p").textContent = correct === total
        ? "Bu sûrenin kelimeleri yerine oturdu. “Bu sûreyi tamamladım” kutusunu işaretleyebilirsin."
        : `Yanlış sorular: ${wrong.join(", ")}. Bu soruların kelimelerine âyet kartlarından tekrar bak; sorular tekrar listene eklendi.`;
      lastReport = `${s.ad} sûresi (${no}) mini test sonucu: ${correct}/${total}${wrong.length ? ` · Yanlış: ${wrong.join(", ")}` : ""}`;
      copy.disabled = false;
      if (scroll) result.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    check.addEventListener("click", () => checkAll(true));
    copy.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(lastReport);
        toast("Sonuç kopyalandı.");
      } catch {
        toast(lastReport);
      }
    });
    cInput.addEventListener("change", () => {
      store.set(completeKey, cInput.checked ? "true" : "false");
      toast(cInput.checked ? "Sûre tamamlandı olarak işaretlendi." : "Tamamlandı işareti kaldırıldı.");
    });
    reset.addEventListener("click", () => {
      store.remove(answersKey);
      store.remove(scoreKey);
      store.remove(completeKey);
      saved = {};
      cInput.checked = false;
      qList.querySelectorAll("input").forEach((input) => { input.checked = false; });
      qList.querySelectorAll(".question").forEach((fs) => {
        fs.classList.remove("correct", "incorrect");
        fs.querySelectorAll("label").forEach((l) => l.classList.remove("answer-correct", "answer-wrong"));
        fs.querySelector(".feedback").textContent = "";
      });
      result.hidden = true;
      copy.disabled = true;
      toast("Bu sûredeki cevaplar sıfırlandı.");
    });

    // Alt gezinme
    const bottom = el("nav", "lesson-bottom-nav");
    bottom.setAttribute("aria-label", "Sûre gezinme");
    const back = el("a", "secondary-button", prev ? `← ${DATA.sureler[prev].ad}` : "← Sûre listesi");
    back.href = prev ? topicHref(prev) : "sureler.html";
    const forward = next
      ? Object.assign(el("a", "primary-button", `Sıradaki: ${DATA.sureler[next].ad} →`), { href: topicHref(next) })
      : el("span", "muted", "Sıradaki paket yakında eklenecek.");
    bottom.append(back, forward);

    content.append(hero, bes, ay, gram, kok, kart, test, fin, bottom);
    root.append(nav, content);

    // Tekrar bağlantısıyla gelindiyse ilgili soruyu vurgula
    const review = new URLSearchParams(location.search).get("review");
    if (review) {
      window.addEventListener("load", () => {
        const target = document.getElementById(review);
        if (!target) return;
        target.classList.add("is-review-target");
        target.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    }

    // Bölüm gezintisinde aktif bağlantı
    if ("IntersectionObserver" in window) {
      const links = [...nav.querySelectorAll("a")];
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${entry.target.id}`));
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      content.querySelectorAll("section[id]").forEach((sec) => observer.observe(sec));
    }
  }

  applyPrefs();
  if (page === "surah-list") renderList();
  if (page === "surah") renderSurah(Number(document.body.dataset.surah));
})();
