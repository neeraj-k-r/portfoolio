(function () {
  'use strict';

  var CFG = {
    sheet: 'https://codexpets.org/pets/clawdex/spritesheet.webp',
    cols: 8,
    rows: 9,
    cellW: 192,
    cellH: 208,
    viewW: 96,
    viewH: 104,
    bounds: 14
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

  var root = null;
  var stage = null;
  var sprite = null;
  var loaded = false;
  var state = { row: 0, frame: 0, nextAt: 0, loopsLeft: Infinity };
  var tickTimer = null;

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

  function tick(now) {
    if (!loaded) return;
    if (now < state.nextAt) return;
    var r = ROWS[state.row];
    state.frame = (state.frame + 1) % CFG.cols;
    paint(state.row, state.frame);
    if (state.frame === 0 && state.loopsLeft !== Infinity) {
      state.loopsLeft -= 1;
      if (state.loopsLeft <= 0) setRow(0, Infinity);
    }
    state.nextAt = now + r.every;
  }

  function build() {
    root = document.createElement('div');
    root.id = 'clawdex-pet';
    stage = document.createElement('div');
    stage.className = 'cdx-stage';
    sprite = document.createElement('div');
    sprite.className = 'cdx-sprite';
    stage.appendChild(sprite);
    root.appendChild(stage);
    document.body.appendChild(root);
  }

  function boot() {
    build();
    sprite.style.width = CFG.viewW + 'px';
    sprite.style.height = CFG.viewH + 'px';
    sprite.style.backgroundImage = 'url("' + CFG.sheet + '")';
    sprite.style.backgroundSize = (CFG.cellW * CFG.cols) + 'px ' + (CFG.cellH * CFG.rows) + 'px';

    var img = new Image();
    img.onload = function () {
      loaded = true;
      root.classList.add('cdx-loaded');
      setRow(0, Infinity);
      tickTimer = setInterval(function () { tick(performance.now()); }, 60);
    };
    img.src = CFG.sheet;
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.ClawdexPet = {};
})();
