// script.js – Portfolio + Cyberpunk Gun Cursor (Full Spec Implementation)

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════════════════
   REVEAL OBSERVER – text/heading elements only (.reveal class)
══════════════════════════════════════════════════════════════════════════════ */
const revealIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* ═══════════════════════════════════════════════════════════════════════════
   CARD ENTRANCE – pure IntersectionObserver (reliable on file://)
══════════════════════════════════════════════════════════════════════════════ */
document.querySelectorAll('.cards-animate').forEach(grid => {
  const cards = Array.from(grid.querySelectorAll('.card'));
  cards.forEach(c => c.classList.add('card-hidden'));

  new IntersectionObserver(([entry], obs) => {
    if (entry.isIntersecting) {
      cards.forEach((c, i) => setTimeout(() => {
        c.classList.remove('card-hidden');
        c.classList.add('card-visible');
      }, i * 90));
      obs.unobserve(entry.target);
    }
  }, { threshold: 0.05 }).observe(grid);
});

// Contact card
const contactCard = document.getElementById('card-contact');
if (contactCard) {
  contactCard.classList.add('card-hidden');
  new IntersectionObserver(([e], obs) => {
    if (e.isIntersecting) {
      contactCard.classList.remove('card-hidden');
      contactCard.classList.add('card-visible');
      obs.unobserve(contactCard);
    }
  }, { threshold: 0.1 }).observe(contactCard);
}

/* ═══════════════════════════════════════════════════════════════════════════
   HERO ANIMATIONS
══════════════════════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  gsap.from('.hero-img',      { opacity: 0, scale: 0.85, duration: 0.8, ease: 'back.out(1.6)', delay: 0.1 });
  gsap.from('.hero-name',     { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out', delay: 0.25 });
  gsap.from('.hero-tagline, .hero-location, .hero-cta, .hero-social', {
    opacity: 0, y: 18, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.65
  });
  gsap.utils.toArray('section h2').forEach(h2 => {
    gsap.from(h2, { opacity: 0, y: 22, duration: 0.65, ease: 'power2.out',
      scrollTrigger: { trigger: h2, start: 'top 90%', once: true } });
  });
});

window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--hero-parallax', `${window.scrollY * 0.4}px`);
}, { passive: true });

/* ═══════════════════════════════════════════════════════════════════════════
   DARK-MODE TOGGLE
══════════════════════════════════════════════════════════════════════════════ */
const toggleBtn = document.getElementById('theme-toggle');
if (toggleBtn) {
  let dark = localStorage.getItem('darkMode') !== null
    ? JSON.parse(localStorage.getItem('darkMode'))
    : window.matchMedia('(prefers-color-scheme: dark)').matches;

  function applyTheme(d) {
    const r = document.documentElement.style;
    r.setProperty('--bg-primary', d ? '#0a0a0f' : '#f4f4f8');
    r.setProperty('--bg-alt',     d ? '#111118' : '#e8e8ee');
    r.setProperty('--text-white', d ? '#ffffff'  : '#0d0d14');
    r.setProperty('--text-muted', d ? '#A0A8B8'  : '#555566');
    toggleBtn.textContent = d ? '☀️' : '🌙';
    localStorage.setItem('darkMode', d);
  }
  applyTheme(dark);
  toggleBtn.addEventListener('click', () => { dark = !dark; applyTheme(dark); });
}

/* ═══════════════════════════════════════════════════════════════════════════
   CYBERPUNK GUN CURSOR
   ─────────────────────────────────────────────────────────────────────────
   States (per design spec):
   1. IDLE    – gun horizontal, randomly fires bullets every few seconds
   2. HOVER   – gun smoothly rotates to aim at hovered interactive element
   3. CLICK   – gun spins 360° → fires bullet toward target → impact
   4. FIRE    – bullet travels to button with blast + sparks
   5. REDIRECT– after impact the original action executes (link navigation etc.)
══════════════════════════════════════════════════════════════════════════════ */
(function initGunCursor() {
  const gun = document.getElementById('gun-cursor');
  const gunSvg = document.getElementById('gun-svg');
  if (!gun || !gunSvg) return;

  let mx = window.innerWidth / 2;
  let my = window.innerHeight / 2;
  let currentAngle = 0;     // deg — current visual rotation of the gun
  let targetAngle  = 0;     // deg — angle we want to smoothly lerp to
  let hoveredEl    = null;  // currently hovered interactive element
  let isFiring     = false; // lock to prevent double-fires

  // ── Track mouse position ──────────────────────────────────────────────────
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    gun.style.left = mx + 'px';
    gun.style.top  = my + 'px';
    if (hoveredEl) targetAngle = calcAngleTo(hoveredEl);
  }, { passive: true });
  document.addEventListener('mouseleave', () => gun.style.opacity = '0');
  document.addEventListener('mouseenter', () => gun.style.opacity = '1');

  // ── Smooth rotation lerp loop ─────────────────────────────────────────────
  // Instead of snap-rotate, we lerp currentAngle → targetAngle each frame
  (function rotateLoop() {
    let diff = targetAngle - currentAngle;
    // Wrap diff to [-180, 180] so we always take the shortest arc
    while (diff >  180) diff -= 360;
    while (diff < -180) diff += 360;
    currentAngle += diff * 0.12; // lerp factor — smoother = smaller value
    gunSvg.style.transform = `rotate(${currentAngle}deg)`;
    gunSvg.style.transformOrigin = '30% 50%';
    requestAnimationFrame(rotateLoop);
  })();

  // ── Angle from gun centre to an element's centre ──────────────────────────
  function calcAngleTo(el) {
    const r = el.getBoundingClientRect();
    return Math.atan2(r.top + r.height / 2 - my, r.left + r.width / 2 - mx) * (180 / Math.PI);
  }

  // ── Muzzle tip world coordinates ─────────────────────────────────────────
  // Barrel tip is ~44px from pivot (updated for larger metallic gun SVG)
  function getMuzzleTip(angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    return { x: mx + Math.cos(rad) * 44, y: my + Math.sin(rad) * 44 };
  }

  // ── Interactive selector ──────────────────────────────────────────────────
  const TARGETS = 'a, button, .btn, .pill, .card, input, textarea, select';

  // Bind hover aim to all interactive elements
  function bindHover(el) {
    el.addEventListener('mouseenter', () => {
      hoveredEl = el;
      gun.classList.add('aim');
      targetAngle = calcAngleTo(el);
    });
    el.addEventListener('mouseleave', () => {
      hoveredEl   = null;
      targetAngle = 0;   // return to horizontal
      gun.classList.remove('aim');
    });
  }
  document.querySelectorAll(TARGETS).forEach(bindHover);

  // ── IDLE random firing ────────────────────────────────────────────────────
  // Fires a random bullet every 2.5–5 s when not hovering anything
  function scheduleIdleFire() {
    const delay = 2500 + Math.random() * 2500;
    setTimeout(() => {
      if (!hoveredEl && !isFiring) {
        const randomAngle = (Math.random() - 0.5) * 60; // ±30° from horizontal
        const tip = getMuzzleTip(randomAngle);
        spawnFlash(tip.x, tip.y);
        const rad = randomAngle * Math.PI / 180;
        const destX = tip.x + Math.cos(rad) * 400;
        const destY = tip.y + Math.sin(rad) * 400;
        spawnBullet(tip.x, tip.y, destX, destY, null);
      }
      scheduleIdleFire();
    }, delay);
  }
  scheduleIdleFire();

  // ── Click handler ─────────────────────────────────────────────────────────
  // Per spec: click → 360° spin → fire → impact → redirect
  document.addEventListener('click', e => {
    if (isFiring) return;
    const target = e.target.closest(TARGETS);

    // Only intercept <a> link navigation — buttons fire their own
    // event listeners immediately on the original click (no need to prevent/re-fire)
    const isAnchor = target && target.tagName === 'A';
    if (isAnchor) e.preventDefault();

    isFiring = true;
    gun.style.cursor = 'none';

    // Step 1 – 360° spin (over ~400 ms)
    const spinStart = currentAngle;
    const spinEnd   = spinStart + 360;
    const spinDur   = 400;
    const spinStart_t = performance.now();

    function spinFrame(now) {
      const t = Math.min((now - spinStart_t) / spinDur, 1);
      // ease-in-out quad
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      targetAngle = spinStart + 360 * ease;
      if (t < 1) {
        requestAnimationFrame(spinFrame);
      } else {
        targetAngle = spinEnd % 360;
        // Step 2 – fire after spin completes
        doFire(target, isAnchor);
      }
    }
    requestAnimationFrame(spinFrame);
  });

  function doFire(targetEl, performRedirect) {
    // Recoil punch: quickly shift gun backward then return
    gun.classList.add('fire-anim');
    setTimeout(() => gun.classList.remove('fire-anim'), 200);

    // Muzzle flash at barrel tip
    const tip = getMuzzleTip(currentAngle);
    spawnFlash(tip.x, tip.y);
    // Extra smoke puff
    spawnSmoke(tip.x, tip.y);

    // Determine destination
    let destX, destY;
    if (targetEl) {
      const r = targetEl.getBoundingClientRect();
      destX = r.left + r.width  / 2;
      destY = r.top  + r.height / 2;
    } else {
      const rad = currentAngle * Math.PI / 180;
      destX = tip.x + Math.cos(rad) * 450;
      destY = tip.y + Math.sin(rad) * 450;
    }

    spawnBullet(tip.x, tip.y, destX, destY, () => {
      // On impact
      spawnImpact(destX, destY);
      if (targetEl) {
        targetEl.classList.add('element-hit');
        setTimeout(() => targetEl.classList.remove('element-hit'), 350);
      }

      // Redirect after impact
      setTimeout(() => {
        isFiring = false;
        if (performRedirect && targetEl) {
          if (targetEl.tagName === 'A' && targetEl.href) {
            if (targetEl.target === '_blank') {
              window.open(targetEl.href, '_blank', 'noopener,noreferrer');
            } else if (targetEl.getAttribute('download') !== null) {
              const a = document.createElement('a');
              a.href = targetEl.href;
              a.download = targetEl.download || '';
              a.click();
            } else if (targetEl.href.startsWith('mailto:') || targetEl.href.startsWith('tel:')) {
              window.location.href = targetEl.href;
            } else {
              const hash = targetEl.getAttribute('href');
              if (hash && hash.startsWith('#')) {
                document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
              } else {
                window.location.href = targetEl.href;
              }
            }
          // Buttons: their click listeners already ran on the original event.
          // Do NOT call .click() again — that causes an infinite loop.
          }
        }
      }, 120);
    });
  }

  // ── Muzzle Flash ──────────────────────────────────────────────────────────
  function spawnFlash(x, y) {
    const el = document.createElement('div');
    el.className = 'muzzle-flash';
    el.style.cssText = `left:${x}px;top:${y}px;`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  // ── Smoke puff ────────────────────────────────────────────────────────────
  function spawnSmoke(x, y) {
    const el = document.createElement('div');
    el.style.cssText = `
      position:fixed; left:${x}px; top:${y}px;
      width:16px; height:16px; border-radius:50%;
      background: radial-gradient(circle, rgba(200,200,200,0.5) 0%, transparent 80%);
      pointer-events:none; z-index:99994;
      transform:translate(-50%,-50%) scale(0);
      animation: smoke-expand 0.5s ease-out forwards;
    `;
    document.body.appendChild(el);
    // Inline keyframe via Web Animations API
    el.animate([
      { transform: 'translate(-50%,-50%) scale(0)',   opacity: 0.7 },
      { transform: 'translate(-50%,-80%) scale(2.5)', opacity: 0   }
    ], { duration: 600, easing: 'ease-out', fill: 'forwards' })
      .onfinish = () => el.remove();
  }

  // ── Bullet ────────────────────────────────────────────────────────────────
  function spawnBullet(sx, sy, tx, ty, onHit) {
    const angle = Math.atan2(ty - sy, tx - sx);
    const dist  = Math.hypot(tx - sx, ty - sy);
    const dur   = Math.max(80, Math.min(dist / 2.5, 250)); // ms

    const el = document.createElement('div');
    el.className = 'bullet';
    el.style.cssText = `left:${sx}px;top:${sy}px;transform:rotate(${angle * 180 / Math.PI}deg);`;
    document.body.appendChild(el);

    el.animate([
      { transform: `rotate(${angle * 180 / Math.PI}deg) translateX(0)`,         opacity: 1   },
      { transform: `rotate(${angle * 180 / Math.PI}deg) translateX(${dist}px)`, opacity: 0.2 }
    ], { duration: dur, easing: 'linear', fill: 'forwards' }).onfinish = () => {
      el.remove();
      if (onHit) onHit();
    };
  }

  // ── Impact sparks + ring ──────────────────────────────────────────────────
  function spawnImpact(x, y) {
    // Warm metallic sparks: steel + copper + ember tones (no neon blue)
    const COLORS = ['#ffaa30', '#ff7010', '#ffdd80', '#cc8833', '#ffffff', '#ff5500'];
    const COUNT  = 14;

    for (let i = 0; i < COUNT; i++) {
      const p     = document.createElement('div');
      p.className = 'impact-particle';
      const ang   = (Math.PI * 2 / COUNT) * i + (Math.random() - 0.5) * 0.5;
      const r     = 20 + Math.random() * 32;
      const size  = 3 + Math.random() * 4;
      const dur   = 0.3 + Math.random() * 0.3;
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      p.style.cssText = `
        left:${x}px;top:${y}px;
        width:${size}px;height:${size}px;
        background:${color};
        box-shadow:0 0 5px ${color};
        --tx:${Math.cos(ang) * r}px;
        --ty:${Math.sin(ang) * r}px;
        --dur:${dur}s;
      `;
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }

    // Shockwave ring
    const ring = document.createElement('div');
    ring.className = 'impact-ring';
    ring.style.cssText = `left:${x}px;top:${y}px;`;
    document.body.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });

    // Second larger ring (staggered)
    setTimeout(() => {
      const ring2 = document.createElement('div');
      ring2.className = 'impact-ring';
      ring2.style.cssText = `left:${x}px;top:${y}px;border-color:#ff4b4b;`;
      document.body.appendChild(ring2);
      ring2.addEventListener('animationend', () => ring2.remove(), { once: true });
    }, 80);
  }

})(); // end initGunCursor

/* ═══════════════════════════════════════════════════════════════════════════
   REDUCED MOTION
══════════════════════════════════════════════════════════════════════════════ */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.pause();
}
