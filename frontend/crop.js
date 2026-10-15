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
        requestAnimationFrame(function () { resetBox(st); });
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
    if ($('cropBox')) $('cropBox').addEventListener('pointerdown', onBoxDown);
  }

  window.PortfoolioCrop = { open: function (file, opts) { bindOnce(); return open(file, opts); } };
})();
