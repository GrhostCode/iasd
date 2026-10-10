(function () {
  "use strict";

  // ---------------------------------------------------------------
  // Datos de la iglesia. Cambia aquí los horarios y la dirección.
  // Horas en formato 24 h ("09:15", "11:00"). null = "por confirmar".
  // ---------------------------------------------------------------
  var SITE = {
    channelId: "UC9wWITRrvU3R1KFU_vNoznQ",
    handle: "iglesiaadventistaiasdlaspi9097",
    address: ["Calle Faris Santiago Interior #7", "Las Piedras, PR 00771"],
    mapQuery: "Iglesia Adventista del Séptimo Día, Calle Faris Santiago Interior 7, Las Piedras, PR 00771",
    latLng: "18.18140,-65.86277",
    schedule: [
      { es: "Escuela Sabática", en: "Sabbath School", time: null },
      { es: "Culto divino", en: "Worship service", time: null }
    ],
    // Correo guardado al revés y en base64 para que los bots no lo recojan.
    // Para cambiarlo: printf %s "correo@ejemplo.com" | rev | base64
    email: "bW9jLmxpYW1nQHNhcmRlaXBzYWxkc2Fp",
    maxVideos: 9
  };

  var TZ = "America/Puerto_Rico";

  var T = {
    es: {
      "skip": "Saltar al contenido",
      "nav.label": "Secciones", "nav.live": "En vivo", "nav.times": "Horarios", "nav.visit": "Visítanos", "nav.contact": "Contacto",
      "set.open": "Configuración", "set.title": "Configuración", "set.lang": "Idioma", "set.theme": "Apariencia",
      "set.auto": "Automática", "set.light": "Clara", "set.dark": "Oscura",
      "hero.lead": "Cada sábado nos reunimos para estudiar la Biblia, adorar y compartir. Ven en persona o acompáñanos en vivo desde donde estés.",
      "hero.visit": "Cómo llegar", "hero.times": "Ver horarios",
      "live.label": "Transmisión en vivo", "live.tag": "Transmitimos en vivo los sábados", "live.play": "Ver la transmisión",
      "live.note": "Si en este momento no estamos en vivo, YouTube te enseña la próxima transmisión programada.",
      "live.open": "Abrir en YouTube", "live.sub": "Suscribirse al canal", "live.latest": "Ver el último servicio",
      "past.title": "Servicios anteriores", "past.all": "Ver todos en YouTube",
      "past.error": "No pudimos cargar los videos ahora mismo. Puedes verlos todos en nuestro canal de YouTube.",
      "past.play": "Ver el servicio del",
      "times.title": "Horarios", "times.today": "Hoy, ", "times.this": "Este ", "times.tbd": "Hora por confirmar",
      "visit.title": "Visítanos", "visit.map": "Mostrar el mapa aquí", "visit.mapTitle": "Mapa de la iglesia",
      "contact.title": "Contacto",
      "contact.lead": "Escríbenos si tienes alguna pregunta, quieres que oremos por ti o te gustaría estudiar la Biblia.",
      "contact.pray": "Pedir oración", "contact.study": "Quiero estudiar la Biblia", "contact.copy": "Copiar correo", "contact.copied": "Correo copiado",
      "mail.praySubject": "Petición de oración",
      "mail.prayBody": "Hola, me gustaría que oren por:\n\n",
      "mail.studySubject": "Quiero estudiar la Biblia",
      "mail.studyBody": "Hola, me interesa estudiar la Biblia.\n\nMi nombre:\nLa mejor forma de contactarme:\n",
      "foot.name": "Iglesia Adventista del Séptimo Día de Las Piedras", "foot.share": "Compartir esta página", "foot.shared": "Enlace copiado",
      "viewer.label": "Video", "viewer.close": "Cerrar",
      "meta.title": "Iglesia Adventista Las Piedras",
      "meta.desc": "Iglesia Adventista del Séptimo Día en Las Piedras, Puerto Rico. Horarios, cómo llegar y servicios en vivo."
    },
    en: {
      "skip": "Skip to content",
      "nav.label": "Sections", "nav.live": "Live", "nav.times": "Times", "nav.visit": "Visit", "nav.contact": "Contact",
      "set.open": "Settings", "set.title": "Settings", "set.lang": "Language", "set.theme": "Appearance",
      "set.auto": "Automatic", "set.light": "Light", "set.dark": "Dark",
      "hero.lead": "Every Saturday we meet to study the Bible, worship and spend time together. Join us in person or watch live from wherever you are.",
      "hero.visit": "Get directions", "hero.times": "See service times",
      "live.label": "Live stream", "live.tag": "We stream live every Saturday", "live.play": "Watch the stream",
      "live.note": "If we're not live right now, YouTube shows the next scheduled stream.",
      "live.open": "Open in YouTube", "live.sub": "Subscribe to the channel", "live.latest": "Watch the latest service",
      "past.title": "Past services", "past.all": "See all on YouTube",
      "past.error": "We couldn't load the videos right now. You can watch all of them on our YouTube channel.",
      "past.play": "Watch the service from",
      "times.title": "Service times", "times.today": "Today, ", "times.this": "This ", "times.tbd": "Time to be confirmed",
      "visit.title": "Visit us", "visit.map": "Show the map here", "visit.mapTitle": "Map to the church",
      "contact.title": "Contact",
      "contact.lead": "Write to us if you have a question, would like us to pray for you, or want to study the Bible.",
      "contact.pray": "Ask for prayer", "contact.study": "I want to study the Bible", "contact.copy": "Copy email", "contact.copied": "Email copied",
      "mail.praySubject": "Prayer request",
      "mail.prayBody": "Hi, I'd like you to pray for:\n\n",
      "mail.studySubject": "Bible study request",
      "mail.studyBody": "Hi, I'm interested in studying the Bible.\n\nMy name:\nBest way to reach me:\n",
      "foot.name": "Las Piedras Seventh-day Adventist Church", "foot.share": "Share this page", "foot.shared": "Link copied",
      "viewer.label": "Video", "viewer.close": "Close",
      "meta.title": "Las Piedras Adventist Church",
      "meta.desc": "Seventh-day Adventist Church in Las Piedras, Puerto Rico. Service times, directions and live services."
    }
  };

  var $ = function (id) { return document.getElementById(id); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var EMAIL = atob(SITE.email).split("").reverse().join("");
  var YT = "https://www.youtube.com/@" + SITE.handle;
  var state = { lang: "es", videos: null };

  function L(k) { return T[state.lang][k]; }
  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

  // ---------- language ----------
  function pickLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "es" || q === "en") return q;
    var saved = store.get("iasd-lang");
    return saved === "en" ? "en" : "es"; // Spanish is the default
  }

  function setLang(lang, save) {
    state.lang = lang;
    if (save) store.set("iasd-lang", lang);
    document.documentElement.lang = lang;
    document.title = L("meta.title");
    var desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", L("meta.desc"));
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      var v = L(el.getAttribute("data-i18n"));
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-label]").forEach(function (el) {
      var v = L(el.getAttribute("data-i18n-label"));
      if (typeof v === "string") el.setAttribute("aria-label", v);
    });
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    renderTimes();
    renderMail();
    renderVideos();
  }

  // ---------- theme ----------
  function setTheme(mode, save) {
    if (mode === "light" || mode === "dark") document.documentElement.setAttribute("data-theme", mode);
    else { document.documentElement.removeAttribute("data-theme"); mode = "auto"; }
    if (save) store.set("iasd-theme", mode);
    document.querySelectorAll("[data-theme-opt]").forEach(function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-theme-opt") === mode ? "true" : "false");
    });
  }

  // ---------- settings panel ----------
  function initSettings() {
    var btn = $("set-btn"), panel = $("set-panel");
    function open(v) {
      panel.hidden = !v;
      btn.setAttribute("aria-expanded", v ? "true" : "false");
      if (v) { var first = panel.querySelector('button[aria-pressed="true"]'); if (first) first.focus(); }
    }
    btn.addEventListener("click", function () { open(panel.hidden); });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !panel.contains(e.target) && !btn.contains(e.target)) open(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); }
    });
    panel.querySelectorAll("[data-lang]").forEach(function (b) {
      b.addEventListener("click", function () { setLang(b.getAttribute("data-lang"), true); });
    });
    panel.querySelectorAll("[data-theme-opt]").forEach(function (b) {
      b.addEventListener("click", function () { setTheme(b.getAttribute("data-theme-opt"), true); });
    });
  }

  // ---------- dates ----------
  function prNow() {
    // Puerto Rico is UTC-4 all year (no daylight saving).
    var d = new Date(Date.now() - 4 * 3600 * 1000);
    return { y: d.getUTCFullYear(), m: d.getUTCMonth(), d: d.getUTCDate(), wd: d.getUTCDay() };
  }
  function locale() { return state.lang === "es" ? "es-PR" : "en-US"; }

  function renderTimes() {
    var n = prNow();
    var add = (6 - n.wd + 7) % 7;
    var sat = new Date(Date.UTC(n.y, n.m, n.d + add, 12));
    var dateStr = new Intl.DateTimeFormat(locale(), { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(sat);
    var dayOnly = new Intl.DateTimeFormat(locale(), { day: "numeric", month: "long", timeZone: "UTC" }).format(sat);
    var weekday = new Intl.DateTimeFormat(locale(), { weekday: "long", timeZone: "UTC" }).format(sat);
    $("next-sabbath").textContent = add === 0
      ? L("times.today") + dateStr
      : (state.lang === "es" ? "Este " + weekday + ", " + dayOnly : "This " + cap(weekday) + ", " + dayOnly);

    var dl = $("times");
    dl.textContent = "";
    SITE.schedule.forEach(function (s) {
      var row = document.createElement("div");
      var dt = document.createElement("dt"); dt.textContent = s[state.lang];
      var dd = document.createElement("dd");
      if (s.time && /^\d{1,2}:\d{2}$/.test(s.time)) {
        var p = s.time.split(":");
        dd.textContent = new Intl.DateTimeFormat(locale(), { hour: "numeric", minute: "2-digit", timeZone: "UTC" })
          .format(new Date(Date.UTC(2000, 0, 1, +p[0], +p[1])));
      } else {
        dd.textContent = L("times.tbd"); dd.className = "tbd";
      }
      row.appendChild(dt); row.appendChild(dd); dl.appendChild(row);
    });
  }

  function videoDate(iso) {
    var d = new Date(iso);
    if (isNaN(d)) return "";
    var opts = { weekday: "long", day: "numeric", month: "long", timeZone: TZ };
    var y = new Intl.DateTimeFormat("en", { year: "numeric", timeZone: TZ }).format(d);
    if (+y !== prNow().y) opts.year = "numeric";
    return cap(new Intl.DateTimeFormat(locale(), opts).format(d));
  }

  // ---------- YouTube ----------
  function frame(src, title) {
    var f = document.createElement("iframe");
    f.src = src;
    f.title = title;
    f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
    f.referrerPolicy = "strict-origin-when-cross-origin"; // YouTube needs the referrer or it refuses to play
    return f;
  }
  function videoSrc(id) { return "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0"; }

  function initLive() {
    $("yt-live").href = YT + "/live";
    $("yt-sub").href = YT + "?sub_confirmation=1";
    $("yt-all").href = YT + "/streams";
    $("play-live").addEventListener("click", function () {
      var p = $("player");
      p.textContent = "";
      p.classList.add("playing"); // removes the overlay so taps reach the YouTube player
      p.appendChild(frame("https://www.youtube.com/embed/live_stream?channel=" + SITE.channelId + "&autoplay=1", L("live.label")));
    });
    $("play-latest").addEventListener("click", function () {
      if (state.videos && state.videos[0]) openViewer(state.videos[0]);
    });
  }

  function setPoster(id) {
    var img = $("player-bg");
    if (!img) return;
    img.onload = function () {
      // YouTube returns a tiny grey placeholder when the HD thumbnail doesn't exist
      if (img.naturalWidth <= 120 && img.src.indexOf("maxresdefault") > -1) { img.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg"; return; }
      img.hidden = false;
    };
    img.onerror = function () {
      if (img.src.indexOf("maxresdefault") > -1) img.src = "https://i.ytimg.com/vi/" + id + "/hqdefault.jpg";
    };
    img.src = "https://i.ytimg.com/vi/" + id + "/maxresdefault.jpg";
  }

  function skeleton() {
    var ul = $("videos");
    ul.textContent = "";
    for (var i = 0; i < 6; i++) {
      var li = document.createElement("li"); li.className = "skel"; li.setAttribute("aria-hidden", "true");
      var b = document.createElement("span"); b.className = "video";
      var t = document.createElement("span"); t.className = "thumb";
      var d = document.createElement("span"); d.className = "v-date";
      b.appendChild(t); b.appendChild(d); li.appendChild(b); ul.appendChild(li);
    }
  }

  // Stream titles are usually the same generic text, so the date is the label people read.
  function isGenericTitle(t) { return /live\s*stream|en vivo|transmisi[oó]n/i.test(t); }

  function renderVideos() {
    var ul = $("videos");
    if (state.videos === null) return; // still loading
    ul.setAttribute("aria-busy", "false");
    ul.textContent = "";
    var list = state.videos;
    $("videos-error").hidden = list.length > 0;
    var latest = $("play-latest");
    if (list[0]) {
      latest.hidden = false;
      latest.textContent = L("live.latest") + " (" + videoDate(list[0].published).replace(/^\S+,?\s*/, "") + ")";
    } else latest.hidden = true;

    list.forEach(function (v) {
      var li = document.createElement("li");
      var b = document.createElement("button"); b.type = "button"; b.className = "video";
      var date = videoDate(v.published);
      b.setAttribute("aria-label", L("past.play") + " " + date);
      var th = document.createElement("span"); th.className = "thumb";
      var img = document.createElement("img");
      img.src = "https://i.ytimg.com/vi/" + v.id + "/hqdefault.jpg";
      img.alt = ""; img.loading = "lazy"; img.decoding = "async";
      th.appendChild(img);
      var d = document.createElement("span"); d.className = "v-date"; d.textContent = date;
      b.appendChild(th); b.appendChild(d);
      if (v.title && !isGenericTitle(v.title)) {
        var t = document.createElement("span"); t.className = "v-title"; t.textContent = v.title;
        b.appendChild(t);
      }
      b.addEventListener("click", function () { openViewer(v); });
      li.appendChild(b); ul.appendChild(li);
    });
  }

  function loadVideos() {
    skeleton();
    fetch("/api/videos", { headers: { accept: "application/json" } })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (data) {
        var list = (data && Array.isArray(data.videos) ? data.videos : [])
          .filter(function (v) { return v && /^[\w-]{11}$/.test(v.id); })
          .slice(0, SITE.maxVideos);
        state.videos = list;
        if (list[0]) setPoster(list[0].id);
        renderVideos();
      })
      .catch(function () { state.videos = []; renderVideos(); });
  }

  // ---------- viewer ----------
  var lastFocus = null;
  function openViewer(v) {
    var dlg = $("viewer");
    lastFocus = document.activeElement;
    var box = $("viewer-frame");
    box.textContent = "";
    box.appendChild(frame(videoSrc(v.id), videoDate(v.published) || L("viewer.label")));
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute("open", "");
  }
  function initViewer() {
    var dlg = $("viewer");
    $("viewer-close").addEventListener("click", function () { dlg.close ? dlg.close() : dlg.removeAttribute("open"); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener("close", function () {
      $("viewer-frame").textContent = ""; // stops the video
      if (lastFocus) lastFocus.focus();
    });
  }

  // ---------- visit ----------
  function initVisit() {
    var addr = $("addr");
    addr.textContent = "";
    SITE.address.forEach(function (line, i) {
      if (i) addr.appendChild(document.createElement("br"));
      addr.appendChild(document.createTextNode(line));
    });
    var q = encodeURIComponent(SITE.mapQuery);
    $("map-google").href = "https://www.google.com/maps/search/?api=1&query=" + q;
    $("map-apple").href = "https://maps.apple.com/?q=" + encodeURIComponent("Iglesia Adventista Las Piedras") + "&ll=" + SITE.latLng;
    $("map-waze").href = "https://waze.com/ul?ll=" + SITE.latLng + "&navigate=yes";
    $("map-load").addEventListener("click", function () {
      var m = $("map");
      m.textContent = "";
      m.classList.add("loaded");
      var f = frame("https://www.google.com/maps?q=" + q + "&output=embed", L("visit.mapTitle"));
      f.loading = "lazy";
      m.appendChild(f);
    });
  }

  // ---------- contact ----------
  function mailto(subject, body) {
    return "mailto:" + EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  }
  function renderMail() {
    var e = $("email");
    e.textContent = EMAIL;
    e.href = "mailto:" + EMAIL;
    $("mail-pray").href = mailto(L("mail.praySubject"), L("mail.prayBody"));
    $("mail-study").href = mailto(L("mail.studySubject"), L("mail.studyBody"));
  }
  function flash(btn, key, back) {
    btn.textContent = L(key); btn.classList.add("done");
    setTimeout(function () { btn.textContent = L(back); btn.classList.remove("done"); }, 1800);
  }
  function copy(text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (ok, fail) {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy") ? ok() : fail(); } catch (e) { fail(e); }
      document.body.removeChild(ta);
    });
  }
  function initContact() {
    $("copy-email").addEventListener("click", function () {
      var b = this;
      copy(EMAIL).then(function () { flash(b, "contact.copied", "contact.copy"); }, function () {});
    });
    $("share").addEventListener("click", function () {
      var b = this, url = location.origin + location.pathname;
      if (navigator.share) { navigator.share({ title: document.title, url: url }).catch(function () {}); return; }
      copy(url).then(function () { flash(b, "foot.shared", "foot.share"); }, function () {});
    });
  }

  // ---------- start ----------
  $("year").textContent = String(prNow().y);
  setTheme(store.get("iasd-theme") || "auto", false);
  initSettings();
  initLive();
  initVisit();
  initViewer();
  initContact();
  setLang(pickLang(), false);
  loadVideos();
})();
