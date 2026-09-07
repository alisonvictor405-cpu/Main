/* ============================================================
   Happy Birthday, Adedolapo — v2 "The Birthday Edition"
   app.js · no dependencies · made by Dayo
   ============================================================ */
(function () {
  'use strict';

  var BIRTHDAY = new Date(2026, 8, 8, 0, 0, 0, 0).getTime(); // Sept 8, 2026, midnight local
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(id) { return document.getElementById(id); }
  function on(el, ev, fn) { el.addEventListener(ev, fn); }

  /* ---------- SPLASH ---------- */
  var splash = $('splash');
  function hideSplash() {
    if (!splash) return;
    splash.classList.add('gone');
    setTimeout(function () { splash.remove(); }, 900);
  }
  // Hide once window load OR after a generous fallback timeout
  if (splash) {
    if (document.readyState === 'complete') setTimeout(hideSplash, 350);
    else on(window, 'load', function () { setTimeout(hideSplash, 350); });
    setTimeout(hideSplash, 4000); // fallback
    on($('splashRetry') || document, 'click', function (e) {
      if (e.target && e.target.id === 'splashRetry') window.location.reload();
    });
  }

  /* ---------- BIRTHDAY MODE ---------- */
  function isBirthdayNow() { return Date.now() >= BIRTHDAY; }
  if (isBirthdayNow()) document.body.classList.add('is-birthday');

  /* ---------- TIMER: countdown -> count-up ---------- */
  var tD = $('tDays'), tH = $('tHours'), tM = $('tMins'), tS = $('tSecs');
  var timerTitle = $('timerTitle'), timerNote = $('timerNote'), timerCapsule = $('timerCapsule');
  var flipped = false;

  function pad(n) { return (n < 10 ? '0' : '') + n; }

  function tick() {
    var now = Date.now();
    if (now < BIRTHDAY) {
      var left = BIRTHDAY - now;
      var s = Math.floor(left / 1000);
      tD.textContent = pad(Math.floor(s / 86400));
      tH.textContent = pad(Math.floor((s % 86400) / 3600));
      tM.textContent = pad(Math.floor((s % 3600) / 60));
      tS.textContent = pad(s % 60);
    } else {
      if (!flipped) {
        flipped = true;
        document.body.classList.add('is-birthday');
        if (timerTitle) timerTitle.textContent = "It's your day";
        if (timerCapsule) timerCapsule.textContent = 'she has been celebrating since';
        if (timerNote) timerNote.innerHTML = 'and it\'s only just beginning <span class="gold-star">✦</span>';
        if (window.burstConfetti) window.burstConfetti();
        if (window.launchLanterns) window.launchLanterns();
      }
      var gone = now - BIRTHDAY;
      var s2 = Math.floor(gone / 1000);
      tD.textContent = pad(Math.floor(s2 / 86400));
      tH.textContent = pad(Math.floor((s2 % 86400) / 3600));
      tM.textContent = pad(Math.floor((s2 % 3600) / 60));
      tS.textContent = pad(s2 % 60);
    }
  }
  if (tD) { tick(); setInterval(tick, 1000); }

  /* ---------- REVEAL ON SCROLL ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !REDUCED) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('seen'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('seen'); });
  }

  /* ---------- NOTE MODAL (garden buttons) ---------- */
  var backdrop = $('modalBackdrop'), mEye = $('modalEyebrow'), mTitle = $('modalTitle'), mText = $('modalText');
  var NOTES = {
    heart: { eye: 'a note for you', title: 'You are so loved', text: 'Not just today — every day. The world is genuinely softer and brighter with you in it, Adedolapo. Happy birthday. ❤️' },
    flower: { eye: 'a bloom for you', title: 'A little magic', text: 'Every flower on this page blooms for you today. May your year be as beautiful as you make everyone else\'s feel. 🌷' },
    sparkle: { eye: 'a secret', title: 'Make a wish', text: 'Close your eyes and wish for something big. I already wished for you — and I\'ll keep wishing every year. ✨' }
  };
  function openNote(kind) {
    var n = NOTES[kind]; if (!n || !backdrop) return;
    mEye.textContent = n.eye; mTitle.textContent = n.title; mText.textContent = n.text;
    backdrop.classList.add('open');
    if (!REDUCED) spawnParticle(kind === 'heart' ? '❤' : kind === 'flower' ? '🌷' : '✨', 12);
  }
  function closeNote() { if (backdrop) backdrop.classList.remove('open'); }
  var bh = $('btnHeart'), bf = $('btnFlower'), bs = $('btnSparkle');
  if (bh) on(bh, 'click', function () { openNote('heart'); });
  if (bf) on(bf, 'click', function () { openNote('flower'); });
  if (bs) on(bs, 'click', function () { openNote('sparkle'); });
  if ($('modalClose')) on($('modalClose'), 'click', closeNote);
  if (backdrop) on(backdrop, 'click', function (e) { if (e.target === backdrop) closeNote(); });
  on(document, 'keydown', function (e) { if (e.key === 'Escape') closeNote(); });

  /* ---------- ENVELOPE + WORD-BY-WORD LETTER ---------- */
  var envelope = $('envelope'), letter = $('letter');
  var letterOpened = false;
  function wrapWords() {
    var ps = document.querySelectorAll('.letter-body p');
    ps.forEach(function (p) {
      // wrap only text nodes, keep <em> words as-is inside spans
      var frag = document.createDocumentFragment();
      Array.prototype.slice.call(p.childNodes).forEach(function (node) {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var w = document.createElement('span');
            w.className = 'word'; w.textContent = part;
            frag.appendChild(w);
          });
        } else {
          // element node (em) — wrap the em itself in a word span class
          var w2 = document.createElement('span');
          w2.className = 'word';
          w2.appendChild(node.cloneNode(true));
          frag.appendChild(w2);
        }
      });
      p.innerHTML = '';
      p.appendChild(frag);
    });
  }
  function revealWords() {
    var words = document.querySelectorAll('.letter-body .word');
    var i = 0;
    function step() {
      if (i >= words.length) return;
      words[i].classList.add('on');
      i++;
      setTimeout(step, REDUCED ? 0 : 90);
    }
    setTimeout(step, 400);
  }
  function openLetter() {
    if (letterOpened || !envelope) return;
    letterOpened = true;
    envelope.classList.add('envelope-opened');
    setTimeout(function () { envelope.style.display = 'none'; }, 700);
    if (letter) { letter.classList.add('open'); }
    wrapWords();
    revealWords();
    if (!REDUCED) spawnParticle('❤', 10);
  }
  if (envelope) {
    on(envelope, 'click', openLetter);
    on(envelope, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); } });
    on(envelope, 'mouseenter', function () { envelope.classList.add('peek'); });
    on(envelope, 'mouseleave', function () { envelope.classList.remove('peek'); });
  }
  // If reduced-motion or no-JS fallback, letter words already visible via CSS

  /* ---------- CAKE / CANDLES ---------- */
  var candles = document.querySelectorAll('.candle');
  var wishReveal = $('wishReveal'), wishText = $('wishText'), cakeHint = $('cakeHint');
  var progressDots = document.querySelectorAll('#cakeProgress span');
  var cakeFinale = $('cakeFinale');
  var blown = 0;
  candles.forEach(function (c, idx) {
    function blow() {
      if (c.classList.contains('out')) return;
      c.classList.add('out');
      if (progressDots[idx]) progressDots[idx].classList.remove('lit');
      blown++;
      if (wishReveal && wishText) {
        wishReveal.hidden = false;
        wishText.textContent = c.getAttribute('data-wish');
        wishReveal.style.animation = 'none';
        wishReveal.offsetHeight; // reflow to restart animation
        wishReveal.style.animation = '';
      }
      if (cakeHint && blown < candles.length) {
        cakeHint.textContent = (candles.length - blown) + ' candle' + (candles.length - blown > 1 ? 's' : '') + ' left ✦';
      } else if (cakeHint) {
        cakeHint.textContent = 'you made every wish 🎂';
        if (cakeFinale) cakeFinale.classList.add('show');
        if (!REDUCED) { burstConfetti(); spawnParticle('🎉', 8); }
      }
    }
    on(c, 'click', blow);
    on(c, 'keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); blow(); } });
  });

  /* ---------- SCRATCH CARD ---------- */
  var sc = $('scratchCanvas');
  if (sc && sc.getContext) {
    var wrap = sc.parentElement;
    function sizeCanvas() {
      var r = wrap.getBoundingClientRect();
      sc.width = Math.max(1, Math.floor(r.width));
      sc.height = Math.max(1, Math.floor(r.height));
      paintCover();
    }
    function paintCover() {
      var ctx = sc.getContext('2d');
      ctx.globalCompositeOperation = 'source-over';
      ctx.clearRect(0, 0, sc.width, sc.height);
      var g = ctx.createLinearGradient(0, 0, sc.width, sc.height);
      g.addColorStop(0, '#c7b3e0'); g.addColorStop(.5, '#b394d6'); g.addColorStop(1, '#a37fd0');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, sc.width, sc.height);
      // decorative dots + label
      ctx.fillStyle = 'rgba(255,255,255,.35)';
      for (var y = 12; y < sc.height; y += 26) {
        for (var x = 12 + (y / 26 % 2 ? 13 : 0); x < sc.width; x += 26) {
          ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.fillStyle = 'rgba(255,255,255,.9)';
      ctx.font = '700 ' + Math.max(11, sc.width / 26) + 'px "DM Sans", sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillText('SCRATCH HERE ✦', sc.width / 2, sc.height / 2);
    }
    var ctx = sc.getContext('2d');
    var scratching = false, scratchedCount = 0, revealed = false;
    var SAMPLES = 220; // approx grid samples for reveal detection
    function scratchAt(x, y) {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 26, 0, Math.PI * 2);
      ctx.fill();
    }
    function pos(e) {
      var r = sc.getBoundingClientRect();
      var t = e.touches ? e.touches[0] : e;
      return { x: t.clientX - r.left, y: t.clientY - r.top };
    }
    function checkReveal() {
      scratchedCount++;
      if (scratchedCount % 6 !== 0 || revealed) return;
      var data = ctx.getImageData(0, 0, sc.width, sc.height).data;
      var clear = 0, total = 0;
      for (var i = 3; i < data.length; i += 4 * 14) { // sample alpha channel
        total++;
        if (data[i] < 40) clear++;
      }
      if (total && clear / total > 0.55) {
        revealed = true;
        sc.style.transition = 'opacity .8s ease';
        sc.style.opacity = '0';
        setTimeout(function () { sc.style.pointerEvents = 'none'; }, 800);
        if (!REDUCED) { spawnParticle('✨', 14); burstConfetti(); }
      }
    }
    function start(e) { scratching = true; var p = pos(e); scratchAt(p.x, p.y); checkReveal(); if (e.cancelable) e.preventDefault(); }
    function move(e) { if (!scratching) return; var p = pos(e); scratchAt(p.x, p.y); checkReveal(); if (e.cancelable) e.preventDefault(); }
    function end() { scratching = false; }
    on(sc, 'mousedown', start); on(window, 'mousemove', move); on(window, 'mouseup', end);
    on(sc, 'touchstart', start, { passive: false }); on(sc, 'touchmove', move, { passive: false }); on(sc, 'touchend', end);
    on(window, 'resize', function () { if (!revealed) sizeCanvas(); });
    sizeCanvas();
  }

  /* ---------- MUSIC (Web Audio, no files) ---------- */
  var musicBtn = $('musicBtn'), musicVol = $('musicVol');
  var actx = null, playing = false, masterGain = null, musicNodes = [];
  // A gentle music-box style loop (pentatonic-ish arpeggio) — pure oscillators
  var MELODY = [
    [523.25, 0.00], [659.25, 0.45], [783.99, 0.90], [659.25, 1.35],
    [587.33, 1.80], [783.99, 2.25], [523.25, 2.70], [440.00, 3.15],
    [523.25, 3.60], [659.25, 4.05], [880.00, 4.50], [783.99, 4.95],
    [659.25, 5.40], [523.25, 5.85], [587.33, 6.30], [783.99, 6.75]
  ];
  var LOOP_LEN = 7.2, loopTimer = null;
  function scheduleLoop(t0) {
    MELODY.forEach(function (note) {
      var osc = actx.createOscillator();
      var g = actx.createGain();
      osc.type = 'sine';
      osc.frequency.value = note[0];
      g.gain.setValueAtTime(0, t0 + note[1]);
      g.gain.linearRampToValueAtTime(0.16, t0 + note[1] + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + note[1] + 0.55);
      osc.connect(g); g.connect(masterGain);
      osc.start(t0 + note[1]); osc.stop(t0 + note[1] + 0.6);
      musicNodes.push(osc);
    });
    // soft chord pad under the loop
    [261.63, 329.63, 392.00].forEach(function (f) {
      var osc = actx.createOscillator(); var g = actx.createGain();
      osc.type = 'triangle'; osc.frequency.value = f;
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(0.035, t0 + 1.2);
      g.gain.setValueAtTime(0.035, t0 + LOOP_LEN - 1.5);
      g.gain.linearRampToValueAtTime(0, t0 + LOOP_LEN);
      osc.connect(g); g.connect(masterGain);
      osc.start(t0); osc.stop(t0 + LOOP_LEN);
      musicNodes.push(osc);
    });
    loopTimer = setTimeout(function () { if (playing) scheduleLoop(actx.currentTime + 0.05); }, (LOOP_LEN - 0.1) * 1000);
  }
  function startMusic() {
    if (!window.AudioContext && !window.webkitAudioContext) return;
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    if (actx.state === 'suspended') actx.resume();
    masterGain = actx.createGain();
    var v = musicVol ? musicVol.value / 100 : 0.55;
    masterGain.gain.value = v * 0.6;
    masterGain.connect(actx.destination);
    playing = true;
    scheduleLoop(actx.currentTime + 0.1);
    musicBtn.textContent = '❚❚';
    musicBtn.classList.add('playing');
    musicBtn.setAttribute('aria-pressed', 'true');
    musicBtn.setAttribute('aria-label', 'Turn background music off');
  }
  function stopMusic() {
    playing = false;
    clearTimeout(loopTimer);
    musicNodes.forEach(function (n) { try { n.stop(0); } catch (e) {} });
    musicNodes = [];
    if (masterGain) { try { masterGain.disconnect(); } catch (e) {} }
    musicBtn.textContent = '♪';
    musicBtn.classList.remove('playing');
    musicBtn.setAttribute('aria-pressed', 'false');
    musicBtn.setAttribute('aria-label', 'Turn background music on');
  }
  if (musicBtn) {
    on(musicBtn, 'click', function () { playing ? stopMusic() : startMusic(); });
  }
  if (musicVol) {
    on(musicVol, 'input', function () {
      if (masterGain) masterGain.gain.value = (musicVol.value / 100) * 0.6;
    });
  }

  /* ---------- PARTICLES (floating hearts/flowers/sparks) ---------- */
  function spawnParticle(ch, count) {
    if (REDUCED) return;
    for (var i = 0; i < count; i++) {
      (function (j) {
        setTimeout(function () {
          var el = document.createElement('div');
          el.className = ch === '❤' ? 'fx-heart' : 'fx-spark';
          el.textContent = ch;
          el.style.left = (20 + Math.random() * 60) + 'vw';
          el.style.bottom = (10 + Math.random() * 30) + 'vh';
          el.style.fontSize = (0.8 + Math.random() * 0.9) + 'rem';
          document.body.appendChild(el);
          setTimeout(function () { el.remove(); }, 2700);
        }, j * 90);
      })(i);
    }
  }

  /* ---------- CONFETTI CANVAS ---------- */
  var fx = $('fxCanvas');
  var confetti = [];
  var fxRunning = false;
  var COLORS = ['#8b5fbf', '#d94f70', '#c99a3f', '#f6dce4', '#b893e6', '#e6a1be'];
  if (fx && fx.getContext) {
    var fctx = fx.getContext('2d');
    function sizeFx() { fx.width = window.innerWidth; fx.height = window.innerHeight; }
    on(window, 'resize', sizeFx); sizeFx();
    function loopFx() {
      if (!confetti.length) { fxRunning = false; fctx.clearRect(0, 0, fx.width, fx.height); return; }
      fxRunning = true;
      fctx.clearRect(0, 0, fx.width, fx.height);
      confetti = confetti.filter(function (c) {
        c.x += c.vx; c.y += c.vy; c.vy += 0.12; c.rot += c.vr;
        fctx.save();
        fctx.translate(c.x, c.y); fctx.rotate(c.rot);
        fctx.fillStyle = c.color;
        fctx.fillRect(-c.s / 2, -c.s / 4, c.s, c.s / 2);
        fctx.restore();
        return c.y < fx.height + 30;
      });
      requestAnimationFrame(loopFx);
    }
    window.burstConfetti = function () {
      if (REDUCED || !fx) return;
      for (var i = 0; i < 120; i++) {
        confetti.push({
          x: Math.random() * fx.width,
          y: -20 - Math.random() * 120,
          vx: (Math.random() - 0.5) * 2.4,
          vy: 1.6 + Math.random() * 2.6,
          rot: Math.random() * Math.PI * 2,
          vr: (Math.random() - 0.5) * 0.22,
          s: 7 + Math.random() * 7,
          color: COLORS[Math.floor(Math.random() * COLORS.length)]
        });
      }
      if (!fxRunning) requestAnimationFrame(loopFx);
    };
    // expose lanterns too
    window.launchLanterns = function () {
      if (REDUCED) return;
      for (var i = 0; i < 7; i++) {
        (function (j) {
          setTimeout(function () {
            var l = document.createElement('div');
            l.className = 'lantern';
            l.style.left = (5 + Math.random() * 90) + 'vw';
            l.style.setProperty('--drift', ((Math.random() - 0.5) * 140) + 'px');
            l.style.animationDuration = (9 + Math.random() * 7) + 's';
            document.body.appendChild(l);
            setTimeout(function () { l.remove(); }, 17000);
          }, j * 900);
        })(i);
      }
    };
  }
  // safe no-op fallbacks if canvas missing
  window.burstConfetti = window.burstConfetti || function () {};
  window.launchLanterns = window.launchLanterns || function () {};

  // celebrate immediately if it's already the birthday
  if (isBirthdayNow() && !REDUCED) {
    setTimeout(function () { window.burstConfetti(); }, 1200);
    setTimeout(window.launchLanterns, 800);
  }

})();
