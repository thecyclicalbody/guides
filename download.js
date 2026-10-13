/* The Cyclical Body: one download page for every workbook/ebook.
   Squarespace page /download holds: <div id="tcb-download"></div><script src="https://guides.thecyclicalbody.com/download.js"></script>
   Sign-up redirect per ebook: /download?f=<slug>&access=<code>. Source: Lead Magnets/tracking/download.js. Built by tools/build.py. */
(function () {
  var DOWNLOADS = {
 "pms": {
  "title": "The PMS workbook",
  "file": "https://guides.thecyclicalbody.com/pms/pms.pdf",
  "code": "pms-6274d0",
  "signupUrl": "/access-pms"
 }
};
  var cur = document.currentScript;
  var mount = document.getElementById("tcb-download");
  if (!mount) { mount = document.createElement("div"); mount.id = "tcb-download"; cur.parentNode.insertBefore(mount, cur); }
  function track(n, tries) { tries = tries || 0;
    if (window.tcbTrack) return window.tcbTrack(n);
    if (tries < 20) setTimeout(function () { track(n, tries + 1); }, 300); }
  function esc(t) { return String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;"); }
  var card = function (inner) { return '<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500&family=Work+Sans:wght@400;600&display=swap" rel="stylesheet">' +
    '<div style="font-family:\'Work Sans\',system-ui,sans-serif;color:#342D21;background:#FBF7F1;border:1px solid #E3D4C0;border-radius:22px;max-width:560px;margin:clamp(32px,7vw,88px) auto;padding:32px 24px;text-align:center;line-height:1.6;box-sizing:border-box">' + inner + '</div>'; };
  var h2 = function (t) { return '<h2 style="font-family:\'Playfair Display\',Georgia,serif;font-weight:500;font-size:1.8rem;line-height:1.2;margin:0 0 .6em;color:#342D21">' + t + '</h2>'; };
  var btn = function (href, t, extra) { return '<a href="' + esc(href) + '"' + (extra || "") + ' style="display:inline-block;border-radius:999px;padding:13px 26px;background:#342D21;color:#fff;font-weight:600;text-decoration:none">' + t + '</a>'; };
  var small = function (t) { return '<p style="margin:1.2em 0 0;font-size:.9rem;color:#5E5446">' + t + '</p>'; };

  var u; try { u = new URL(location.href); } catch (e) { return; }
  var slug = u.searchParams.get("f"), d = slug && DOWNLOADS[slug];
  if (!d) { mount.innerHTML = card(h2("Hmm, this link isn't complete") + '<p>Use the link from your sign-up, or find all free guides on the homepage.</p>' + btn("/", "Go to the homepage")); return; }

  var live = (/(^|\.)thecyclicalbody\.com$/.test(location.hostname) && window.self === window.top) || /[?&]gatetest=1/.test(location.search);
  var KEY = "tcb-access-" + slug, ok = false;
  if (u.searchParams.get("access") === d.code) {
    ok = true; try { localStorage.setItem(KEY, "1"); } catch (e) {}
    track(slug + "/unlocked");
    u.searchParams.delete("access"); history.replaceState(null, "", u.pathname + u.search + u.hash);
  }
  if (!ok) { try { ok = localStorage.getItem(KEY) === "1"; } catch (e) {} }
  if (!ok && live) {
    track(slug + "/gate-shown");
    mount.innerHTML = card(h2(esc(d.title) + " is free") + "<p>Sign up with your email and you'll get it straight away.</p>" + btn(d.signupUrl, "Get my free copy") +
      small("Already signed up? Just enter your email again and you'll go straight to your download."));
    mount.querySelector("a").addEventListener("click", function () { track(slug + "/gate-click"); });
    return;
  }
  mount.innerHTML = card('<span style="font-size:.75rem;letter-spacing:.16em;text-transform:uppercase;font-weight:600;color:#7A5629">Your free workbook</span>' +
    h2(esc(d.title)) + "<p>It's ready for you. Print it, or fill it in on your tablet, and take it one step at a time.</p>" +
    btn(d.file, "Download the workbook (PDF)", ' target="_blank" rel="noopener"') +
    small("Tip: save it somewhere you'll see it again this week. I'll also send you a few emails with extra insights on this topic."));
  mount.querySelector("a").addEventListener("click", function () { track(slug + "/download"); });
})();
