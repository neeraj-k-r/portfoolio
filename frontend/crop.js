/* portfoolio.me — lightweight dependency-free image cropper for work uploads. */
(function () {
  'use strict';
  var MIN = 24;          // minimum crop size (displayed px)
  var state = null;

  function $(id) { return document.getElementById(id); }

  function open(file, opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var modal = $('cropModal');
      var img = $('cropImage');
      if (!modal || !img || !file) { resolve(null); return; }
      if (state) { finish(state, null); }
      var st = {
        file: file, img: img, ratio: opts.aspect || null,
        resolve: resolve, box: null, stageW: 0, stageH: 0,
        natW: 0, natH: 0
      };
      st.url = URL.createObjectURL(file);
      state = st;
      img.onload = function () {
        st.natW = img.naturalWidth;
        st.natH = img.naturalHeight;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(function () { resetBox(st); if (st.ratio) setRatio(st, st.ratio); syncRatioButtons(st.ratio); });
      };
      img.onerror = function () { finish(st, null); };
      img.src = st.url;
    });
  }

  function clamp(v, a, b) { return v < a ? a : v > b ? b : v; }

  function onBoxDown(e) {
    if (!state) return;
    if (e.target.classList && e.target.classList.contains('crop-h')) return;
    e.preventDefault();
    var st = state, box = $('cropBox');
    var sx = e.clientX, sy = e.clientY;
    var start = { x: st.box.x, y: st.box.y };
    try { box.setPointerCapture(e.pointerId); } catch (err) {}
    function move(ev) {
      st.box.x = clamp(start.x + (ev.clientX - sx), 0, st.stageW - st.box.w);
      st.box.y = clamp(start.y + (ev.clientY - sy), 0, st.stageH - st.box.h);
      render(st);
    }
    function up(ev) {
      box.removeEventListener('pointermove', move);
      box.removeEventListener('pointerup', up);
      box.removeEventListener('pointercancel', up);
      try { box.releasePointerCapture(ev.pointerId); } catch (err) {}
    }
    box.addEventListener('pointermove', move);
    box.addEventListener('pointerup', up);
    box.addEventListener('pointercancel', up);
  }

  function onHandleDown(e) {
    if (!state) return;
    var dir = e.target.getAttribute && e.target.getAttribute('data-h');
    if (!dir) return;
    e.preventDefault();
    e.stopPropagation();
    var st = state, handle = e.target, stage = $('cropStage');
    var r = stage.getBoundingClientRect();
    var s = { x: st.box.x, y: st.box.y, w: st.box.w, h: st.box.h };
    var west = dir.charAt(1) === 'w', north = dir.charAt(0) === 'n';
    var anchorX = west ? s.x + s.w : s.x;
    var anchorY = north ? s.y + s.h : s.y;
    var maxW = west ? anchorX : st.stageW - anchorX;
    var maxH = north ? anchorY : st.stageH - anchorY;
    try { handle.setPointerCapture(e.pointerId); } catch (err) {}
    function move(ev) {
      var px = clamp(ev.clientX - r.left, 0, st.stageW);
      var py = clamp(ev.clientY - r.top, 0, st.stageH);
      var w, h;
      if (st.ratio) {
        w = Math.abs(px - anchorX);
        h = w / st.ratio;
        if (h > maxH) { h = maxH; w = h * st.ratio; }
        if (w > maxW) { w = maxW; h = w / st.ratio; }
        if (w < MIN) { w = MIN; h = w / st.ratio; }
        if (h < MIN) { h = MIN; w = h * st.ratio; }
      } else {
        w = clamp(Math.abs(px - anchorX), west ? Math.min(MIN, anchorX) : MIN, maxW);
        h = clamp(Math.abs(py - anchorY), north ? Math.min(MIN, anchorY) : MIN, maxH);
      }
      st.box.w = w; st.box.h = h;
      st.box.x = west ? anchorX - w : anchorX;
      st.box.y = north ? anchorY - h : anchorY;
      render(st);
    }
    function up(ev) {
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', up);
      handle.removeEventListener('pointercancel', up);
      try { handle.releasePointerCapture(ev.pointerId); } catch (err) {}
    }
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', up);
    handle.addEventListener('pointercancel', up);
  }

  function applyCrop(st) {
    var scale = st.stageW ? st.natW / st.stageW : 1;
    var sx = Math.max(0, Math.min(Math.round(st.box.x * scale), st.natW - 1));
    var sy = Math.max(0, Math.min(Math.round(st.box.y * scale), st.natH - 1));
    var sw = Math.max(1, Math.min(Math.round(st.box.w * scale), st.natW - sx));
    var sh = Math.max(1, Math.min(Math.round(st.box.h * scale), st.natH - sy));
    var c = document.createElement('canvas');
    c.width = sw; c.height = sh;
    c.getContext('2d').drawImage(st.img, sx, sy, sw, sh, 0, 0, sw, sh);
    var base = (st.file.name || 'image').replace(/\.[^.]+$/, '');
    var mime = /image\/(png|jpeg|webp)/.test(st.file.type || '') ? st.file.type : 'image/png';
    encode(st, c, base, mime, 0.92);
  }

  function encode(st, canvas, base, mime, q) {
    canvas.toBlob(function (blob) {
      if (!blob && mime !== 'image/jpeg') { encode(st, canvas, base, 'image/jpeg', q); return; }
      if (!blob) { finish(st, null); return; }
      var ext = mime === 'image/png' ? 'png' : mime === 'image/webp' ? 'webp' : 'jpg';
      finish(st, new File([blob], base + '-crop.' + ext, { type: mime }));
    }, mime, q);
  }

  function setRatio(st, ratio) {
    st.ratio = ratio || null;
    if (!st.ratio) return;
    var w = st.stageW, h = w / st.ratio;
    if (h > st.stageH) { h = st.stageH; w = h * st.ratio; }
    st.box = { x: (st.stageW - w) / 2, y: (st.stageH - h) / 2, w: w, h: h };
    render(st);
  }

  function syncRatioButtons(ratio) {
    var wrap = $('cropRatios');
    if (!wrap) return;
    wrap.querySelectorAll('button').forEach(function (b) {
      var v = b.getAttribute('data-ratio');
      var match = (v === 'free' && !ratio) || (v !== 'free' && Math.abs(parseFloat(v) - ratio) < 1e-4);
      b.classList.toggle('active', match);
    });
  }

  function resetBox(st) {
    st.stageW = st.img.clientWidth;
    st.stageH = st.img.clientHeight;
    st.box = { x: 0, y: 0, w: st.stageW, h: st.stageH };
    render(st);
  }

  function render(st) {
    var b = $('cropBox');
    if (!b) return;
    b.style.left = st.box.x + 'px';
    b.style.top = st.box.y + 'px';
    b.style.width = st.box.w + 'px';
    b.style.height = st.box.h + 'px';
  }

  function finish(st, result) {
    var modal = $('cropModal');
    if (modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); }
    try { URL.revokeObjectURL(st.url); } catch (e) {}
    state = null;
    st.resolve(result);
  }

  function bindOnce() {
    var modal = $('cropModal');
    if (!modal || modal.dataset.bound) return;
    modal.dataset.bound = '1';
    if ($('cropCancel')) $('cropCancel').onclick = function () { if (state) finish(state, null); };
    if ($('cropBackdrop')) $('cropBackdrop').onclick = function () { if (state) finish(state, null); };
    if ($('cropReset')) $('cropReset').onclick = function () { if (state) resetBox(state); };
    if ($('cropApply')) $('cropApply').onclick = function () { if (state) applyCrop(state); };
    if ($('cropBox')) $('cropBox').addEventListener('pointerdown', onBoxDown);
    modal.querySelectorAll('.crop-h').forEach(function (h) { h.addEventListener('pointerdown', onHandleDown); });
    if ($('cropRatios')) $('cropRatios').addEventListener('click', function (e) {
      var b = e.target.closest ? e.target.closest('button') : null;
      if (!b || !state) return;
      var v = b.getAttribute('data-ratio');
      setRatio(state, v === 'free' ? null : parseFloat(v));
      syncRatioButtons(state.ratio);
    });
  }

  window.PortfoolioCrop = { open: function (file, opts) { bindOnce(); return open(file, opts); } };
})();
