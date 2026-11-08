(function () {
  'use strict';

  var CFG = {
    sheet: '/assets/pet-goku.webp',
    fallbackSheet: 'https://assets.petdex.dev/pets/goku-036616929fb7/sprite.webp',
    cols: 8,
    rows: 9,
    cellW: 192,
    cellH: 208,
    viewW: 96,
    viewH: 104,
    bounds: 14,
    walkSpeed: 230,
    bubbleMs: 2600,
    idleJitterMs: 320
  };

  var ROWS = [
    { id: 'idle', every: 230 },
    { id: 'runRight', every: 105 },
    { id: 'runLeft', every: 105 },
    { id: 'wave', every: 130 },
    { id: 'jump', every: 120 },
    { id: 'failed', every: 210 },
    { id: 'wait', every: 210 },
    { id: 'run', every: 105 },
    { id: 'review', every: 120 }
  ];

  var MESSAGES = [
    "It's over 9000!",
    'Kaio-Ken!',
    'All systems go.',
    'Ship it!',
    'You got this.',
    'Reviewing your skills…',
    'Drag me anywhere!'
  ];

  var root = null;
  var stage = null;
  var sprite = null;
  var bubble = null;
  var closeBtn = null;
  var placeholder = null;
  var loaded = false;
  var reducedMotion = false;
  var userHidden = false;
  var dashHidden = false;

  var state = { row: 0, frame: 0, nextAt: 0, loopsLeft: Infinity };
  var pos = { x: 0, y: 0 };
  var target = null;
  var dragging = null;
  var tickTimer = null;
  var schedTimer = null;
  var bubbleTimer = null;
  var dashTimer = null;
  var lastDown = null;

  function viewport() {
    return { width: window.innerWidth, height: window.innerHeight };
  }

  function clampPos(p) {
    var v = viewport();
    var b = CFG.bounds;
    var x = Math.min(Math.max(p.x, b), Math.max(b, v.width - CFG.viewW - b));
    var y = Math.min(Math.max(p.y, b), Math.max(b, v.height - CFG.viewH - b));
    return { x: Math.round(x), y: Math.round(y) };
  }

  function applyPos(p) {
    pos = p;
    root.style.transform = 'translate3d(' + p.x + 'px, ' + p.y + 'px, 0)';
  }

  function paint(row, frame) {
    sprite.style.backgroundPosition = '-' + (frame * CFG.viewW) + 'px -' + (row * CFG.viewH) + 'px';
  }

  function setRow(row, loops) {
    state.row = row;
    state.frame = 0;
    state.loopsLeft = loops == null ? Infinity : loops;
    state.nextAt = performance.now() + ROWS[row].every;
    paint(row, 0);
  }

  function stopWalk() {
    if (target) {
      cancelAnimationFrame(target.raf);
      target = null;
    }
  }

  function playOnce(row, loops) {
    if (!loaded || reducedMotion || dragging) return;
    stopWalk();
    setRow(row, loops == null ? 1 : loops);
    var guard = Date.now();
    (function awaitEnd() {
      if (state.loopsLeft <= 0) { setRow(0, Infinity); return; }
      if (Date.now() - guard > 12000) { setRow(0, Infinity); return; }
      requestAnimationFrame(awaitEnd);
    })();
  }

  function say(text) {
    bubble.textContent = text;
    bubble.classList.add('cdx-show');
    clearTimeout(bubbleTimer);
    bubbleTimer = setTimeout(function () {
      bubble.classList.remove('cdx-show');
    }, CFG.bubbleMs);
  }

  function walkTo(p) {
    if (!loaded || reducedMotion || dragging) return;
    stopWalk();
    var start = pos;
    var dx = p.x - start.x;
    var dy = p.y - start.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 8) { applyPos(clampPos(p)); setRow(0, Infinity); return; }
    var dur = Math.max(350, dist / CFG.walkSpeed * 1000);
    var row = Math.abs(dx) > 40 ? (dx > 0 ? 1 : 2) : 0;
    var t0 = performance.now();
    if (row !== 0) setRow(row, Infinity);
    var raf;
    function step(now) {
      var t = Math.min(1, (now - t0) / dur);
      var ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      applyPos({ x: start.x + dx * ease, y: start.y + dy * ease });
      if (t < 1) {
        raf = requestAnimationFrame(step);
      } else {
        target = null;
        applyPos(clampPos(p));
        setRow(0, Infinity);
      }
    }
    target = { raf: 0 };
    raf = requestAnimationFrame(step);
    target.raf = raf;
  }

  function randomTarget() {
    var v = viewport();
    var b = CFG.bounds;
    return {
      x: b + Math.random() * Math.max(40, v.width - CFG.viewW - b * 2),
      y: b + Math.random() * Math.max(40, v.height - CFG.viewH - b * 2)
    };
  }

  function scheduleActivity() {
    clearTimeout(schedTimer);
    if (!loaded || reducedMotion || dragging || userHidden || dashHidden) {
      schedTimer = setTimeout(scheduleActivity, 4000);
      return;
    }
    var delay = 5000 + Math.random() * 7000;
    schedTimer = setTimeout(function () {
      if (!loaded || reducedMotion || dragging || userHidden || dashHidden) {
        scheduleActivity();
        return;
      }
      var roll = Math.random();
      if (roll < 0.5) walkTo(randomTarget());
      else if (roll < 0.62) playOnce(4, 1);
      else if (roll < 0.72) playOnce(3, 1);
      else if (roll < 0.80) playOnce(5, 1);
      else if (roll < 0.88) playOnce(6, 1);
      scheduleActivity();
    }, delay);
  }

  function tick(now) {
    if (!loaded || reducedMotion) return;
    if (dragging) {
      var wantRow = Math.abs(dragging.vx) > 20 ? (dragging.vx > 0 ? 1 : 2) : 0;
      if (state.row !== wantRow) setRow(wantRow, Infinity);
      else if (now >= state.nextAt) {
        state.frame = (state.frame + 1) % CFG.cols;
        paint(state.row, state.frame);
        state.nextAt = now + ROWS[state.row].every;
      }
      return;
    }
    if (target) return;
    if (now < state.nextAt) return;
    var r = ROWS[state.row];
    state.frame = (state.frame + 1) % CFG.cols;
    paint(state.row, state.frame);
    if (state.frame === 0 && state.loopsLeft !== Infinity) {
      state.loopsLeft -= 1;
      if (state.loopsLeft <= 0) setRow(0, Infinity);
    }
    state.nextAt = now + r.every + (state.row === 0 ? Math.random() * CFG.idleJitterMs : 0);
  }

  function onPointerDown(ev) {
    if (!loaded) return;
    if (ev.button !== undefined && ev.button !== 0) return;
    ev.preventDefault();
    lastDown = { x: ev.clientX, y: ev.clientY, t: performance.now() };
    if (ev.target === closeBtn) return;
    stopWalk();
    var rect = root.getBoundingClientRect();
    dragging = {
      dx: ev.clientX - rect.left,
      dy: ev.clientY - rect.top,
      lastX: ev.clientX,
      lastY: ev.clientY,
      lastT: performance.now(),
      vx: 0,
      vy: 0
    };
    stage.classList.add('cdx-dragging');
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  function onPointerMove(ev) {
    if (!dragging) return;
    ev.preventDefault();
    var now = performance.now();
    var dt = Math.max(1, now - dragging.lastT);
    dragging.vx = (ev.clientX - dragging.lastX) / dt * 1000;
    dragging.vy = (ev.clientY - dragging.lastY) / dt * 1000;
    dragging.lastX = ev.clientX;
    dragging.lastY = ev.clientY;
    dragging.lastT = now;
    applyPos(clampPos({ x: ev.clientX - dragging.dx, y: ev.clientY - dragging.dy }));
  }

  function onPointerUp(ev) {
    if (!dragging) return;
    window.removeEventListener('pointermove', onPointerMove);
    window.removeEventListener('pointerup', onPointerUp);
    window.removeEventListener('pointercancel', onPointerUp);
    var wasDrag = lastDown && Math.abs(ev.clientX - lastDown.x) + Math.abs(ev.clientY - lastDown.y) > 8;
    var wasFast = performance.now() - lastDown.t < 300;
    dragging = null;
    stage.classList.remove('cdx-dragging');
    setRow(0, Infinity);
    scheduleActivity();
    if (!wasDrag && wasFast) {
      playOnce(3, 1);
      say(MESSAGES[Math.floor(Math.random() * (MESSAGES.length - 1))]);
    }
    lastDown = null;
  }

  function build() {
    root = document.createElement('div');
    root.id = 'clawdex-pet';
    root.setAttribute('role', 'img');
    root.setAttribute('aria-label', 'Goku, your code pet');

    stage = document.createElement('div');
    stage.className = 'cdx-stage';

    sprite = document.createElement('div');
    sprite.className = 'cdx-sprite';

    bubble = document.createElement('div');
    bubble.className = 'cdx-bubble';

    closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'cdx-close';
    closeBtn.setAttribute('aria-label', 'Hide Goku');
    closeBtn.textContent = '\u00d7';
    closeBtn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      hide(true);
    });

    placeholder = document.createElement('div');
    placeholder.className = 'cdx-placeholder';
    placeholder.textContent = '>_';

    stage.appendChild(placeholder);
    stage.appendChild(sprite);
    stage.appendChild(bubble);
    stage.appendChild(closeBtn);
    root.appendChild(stage);
    document.body.appendChild(root);

    stage.addEventListener('pointerdown', onPointerDown);
    stage.addEventListener('dblclick', function (ev) {
      ev.stopPropagation();
      if (!loaded || reducedMotion || dragging) return;
      playOnce(4, 1);
    });
  }

  function checkDashboard() {
    // Keep companion available everywhere; user can close it via the [×] button anytime
  }

  function applyVisibility() {
    if (userHidden) root.classList.add('cdx-hidden');
    else root.classList.remove('cdx-hidden');
  }

  function hide(persist) {
    userHidden = true;
    applyVisibility();
  }

  function show() {
    userHidden = false;
    applyVisibility();
  }

  function boot() {
    userHidden = false;
    reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    build();
    applyVisibility();

    // Place the pet immediately, before the sprite loads.
    var v0 = viewport();
    applyPos(clampPos({ x: v0.width - CFG.viewW - CFG.bounds, y: v0.height - CFG.viewH - CFG.bounds }));

    sprite.style.width = CFG.viewW + 'px';
    sprite.style.height = CFG.viewH + 'px';

    var scale = CFG.viewW / CFG.cellW;
    var sheetW = CFG.cellW * CFG.cols * scale;
    var sheetH = CFG.cellH * CFG.rows * scale;
    sprite.style.backgroundSize = sheetW + 'px ' + sheetH + 'px';

    function onSpriteReady(url) {
      if (loaded) return;
      loaded = true;
      sprite.style.backgroundImage = 'url("' + url + '")';
      root.classList.add('cdx-loaded');
      applyPos(clampPos(pos));
      paint(0, 0);
      if (!reducedMotion) {
        setRow(0, Infinity);
        if (!tickTimer) tickTimer = setInterval(function () { tick(performance.now()); }, 60);
        scheduleActivity();
      }
    }

    var img = new Image();
    img.referrerPolicy = 'no-referrer';
    img.crossOrigin = 'anonymous';
    img.onload = function () {
      onSpriteReady(CFG.sheet);
    };
    img.onerror = function () {
      // Try relative path or CDN fallback with no-referrer
      var relImg = new Image();
      relImg.onload = function () {
        onSpriteReady('assets/pet-goku.webp');
      };
      relImg.onerror = function () {
        var cdnImg = new Image();
        cdnImg.referrerPolicy = 'no-referrer';
        cdnImg.crossOrigin = 'anonymous';
        cdnImg.onload = function () {
          onSpriteReady(CFG.fallbackSheet);
        };
        cdnImg.onerror = function () {
          console.warn('[pet] all sprite sources failed, activating fallback interactive mode');
          loaded = true;
          root.classList.add('cdx-loaded');
          applyPos(clampPos(pos));
          if (!reducedMotion) scheduleActivity();
        };
        cdnImg.src = CFG.fallbackSheet;
      };
      relImg.src = 'assets/pet-goku.webp';
    };
    img.src = CFG.sheet;

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden && !reducedMotion) {
        state.nextAt = performance.now() + ROWS[state.row].every;
      }
    });

    window.addEventListener('resize', function () {
      if (!dragging && !target) applyPos(clampPos(pos));
    });
  }

  function prefixed() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.ClawdexPet = { show: show, hide: function () { hide(false); } };
})();
