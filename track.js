/* The Cyclical Body: site-wide event tracking (Umami, cookieless).
   Loaded once from the Squarespace header. Source: Lead Magnets/tracking/track.js. Built by tools/build.py.
   Tracks clicks and sign-up submissions only. Never sends names, emails or answers. */
(function () {
  if (window.tcbSiteTrack) return; window.tcbSiteTrack = true;
  var CFG = {"callUrl": "https://calendar.app.google/iEZnrSfxjV3P1isU7", "signups": {"/challenge": "signup/challenge-waitlist", "/cyclical-program": "signup/program-waitlist", "/access-free-hormone-ebook": "signup/hormone-ebook", "/flyer-lp": "signup/flyer-ebook", "/access-iron-check": "signup/iron-check", "/access-free-masterclass": "signup/masterclass"}};
  var local = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  var queue = [];
  function page() { return location.pathname.replace(/\/+$/, "") || "/"; }
  var last = { key: "", at: 0 };
  function send(name, data) {
    data = data || {}; data.page = data.page || page();
    // Squarespace re-dispatches clicks on same-page anchor buttons: drop identical events within 1s.
    var key = name + JSON.stringify(data), now = Date.now();
    if (key === last.key && now - last.at < 1000) return;
    last = { key: key, at: now };
    if (local) { (window.tcbTrackLog = window.tcbTrackLog || []).push([name, data]); console.debug("[tcbTrack]", name, data); return; }
    if (window.umami && window.umami.track) window.umami.track(name, data); else queue.push([name, data]);
  }
  if (!window.tcbTrack) window.tcbTrack = send; // shared with embeds and the download page
  var t = setInterval(function () {
    if (window.umami && window.umami.track) { clearInterval(t); queue.splice(0).forEach(function (q) { window.umami.track(q[0], q[1]); }); }
  }, 200);
  setTimeout(function () { clearInterval(t); }, 15000);
  function inEmbed(el) { return !!el.closest('[id^="tcb-embed-"], #tcb-iron'); } // embeds track themselves

  /* sign-ups: any Squarespace form/newsletter submit with a valid-looking email */
  document.addEventListener("submit", function (e) {
    var f = e.target; if (!f || inEmbed(f)) return;
    var em = f.querySelector('input[type="email"], input[name="email"]');
    if (!em || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(em.value || "")) return;
    var name = CFG.signups[page()] || ("signup" + page());
    send(name);
  }, true);

  /* clicks */
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]"); if (!a || inEmbed(a)) return;
    var href = a.getAttribute("href") || "", label = (a.textContent || "").trim().replace(/\s+/g, " ").slice(0, 40);
    if (href.indexOf(CFG.callUrl) === 0) return send("book-call", { label: label });
    if (/^mailto:/.test(href)) return send("email-click", { label: label });
    if (/instagram\.com|tiktok\.com|youtube\.com/.test(href)) return send("social-click", { to: a.hostname.replace(/^www\./, "") });
    if (/#(signup|sign-up|ebook)$/.test(href) || a.matches(".sqs-block-button-element, [class*=btn]")) {
      if (href.charAt(0) !== "#" && href.indexOf("http") === 0 && a.hostname !== location.hostname && !/(^|\.)thecyclicalbody\.com$/.test(a.hostname)) return send("outbound-click", { to: a.hostname, label: label });
      return send("cta-click", { label: label, to: href.replace(/^https?:\/\/[^/]+/, "") });
    }
  }, true);
})();
