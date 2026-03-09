/**
 * app.js — Mutiullahi Uthman Portfolio
 * Loader: ink curtain + counter + name reveal, then curtain splits open.
 */

(function () {
  'use strict';

  var PARTICLES_CONFIG = {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 1000 } },
      color:  { value: '#C8B89A' },
      shape:  { type: 'circle' },
      opacity: {
        value: 0.25, random: true,
        anim: { enable: true, speed: 0.5, opacity_min: 0.05, sync: false }
      },
      size: { value: 2, random: true, anim: { enable: false } },
      line_linked: {
        enable: true, distance: 130,
        color: '#C8B89A', opacity: 0.1, width: 1
      },
      move: {
        enable: true, speed: 0.8,
        direction: 'none', random: true,
        straight: false, out_mode: 'out'
      }
    },
    interactivity: {
      detect_on: 'canvas',
      events: {
        onhover: { enable: true, mode: 'grab' },
        onclick:  { enable: false },
        resize:   true
      },
      modes: {
        grab: { distance: 160, line_linked: { opacity: 0.3 } }
      }
    },
    retina_detect: true
  };

  function $(id) { return document.getElementById(id); }

  function runCounter(duration, onTick, onDone) {
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased    = 1 - Math.pow(1 - progress, 3);
      var val      = Math.floor(100 * eased);
      onTick(val);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        onTick(100);
        onDone && onDone();
      }
    }
    requestAnimationFrame(step);
  }

  var dismissed = false;

  function dismissLoader() {
    if (dismissed) return;
    dismissed = true;
    var loader = $('page-loader');
    if (!loader) return;
    loader.classList.add('loader--exit');
    setTimeout(function () {
      loader.classList.add('loader--done');
      document.body.classList.remove('js-loading');
    }, 950);
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('js-loading');

    if ($('particles-js') && typeof particlesJS === 'function') {
      particlesJS('particles-js', PARTICLES_CONFIG);
    }

    /* Staggered name line reveal */
    setTimeout(function () {
      var first = $('ldr-first');
      var last  = $('ldr-last');
      if (first) first.classList.add('visible');
      setTimeout(function () {
        if (last) last.classList.add('visible');
      }, 240);
    }, 200);

    /* Counter + line fill */
    var counterEl = $('loader-counter');
    var fillEl    = $('loader-line-fill');
    var startTime = Date.now();
    var MIN_SHOW  = 2600;

    runCounter(2200, function (val) {
      if (counterEl) counterEl.textContent = val;
      if (fillEl)    fillEl.style.width    = val + '%';
    });

    window.addEventListener('load', function () {
      var elapsed   = Date.now() - startTime;
      var remaining = Math.max(0, MIN_SHOW - elapsed);
      setTimeout(dismissLoader, remaining);
    });

    setTimeout(dismissLoader, 5000);
  });

}());