// script.js – Portfolio + Cyberpunk Gun Cursor

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════════════════════════
   REVEAL OBSERVER
═══════════════════════════════════════════════════════════════ */
const revealIO = new IntersectionObserver((entries, obs) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('active'); obs.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

/* ═══════════════════════════════════════════════════════════════
   CARD ENTRANCE
═══════════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════════
   HERO ANIMATIONS
═══════════════════════════════════════════════════════════════ */
window.addEventListener('load', () => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.from('.hero-img',  { opacity: 0, scale: 0.85, duration: 0.8, ease: 'back.out(1.6)', delay: 0.1 });
  gsap.from('.hero-name', { opacity: 0, y: 30, duration: 0.7, ease: 'power2.out', delay: 0.25 });
  gsap.from('.hero-label, .hero-role-line, .hero-tagline-sub, .hero-cta, .hero-social', {
    opacity: 0, y: 18, stagger: 0.1, duration: 0.6, ease: 'power2.out', delay: 0.55
  });
  gsap.from('.hero-terminal', { opacity: 0, y: 20, duration: 0.7, ease: 'power2.out', delay: 0.9 });
  gsap.utils.toArray('section h2').forEach(h2 => {
    gsap.from(h2, { opacity: 0, y: 22, duration: 0.65, ease: 'power2.out',
      scrollTrigger: { trigger: h2, start: 'top 90%', once: true } });
  });

  // ── Role cycling typewriter ──
  const roleEl   = document.getElementById('role-text');
  const roles    = ['Full-Stack Developer', 'AI & ML Engineer', 'Python Developer', 'Problem Solver', 'System Builder'];
  let rIdx = 0;

  if (reducedMotion) {
    if (roleEl) roleEl.textContent = 'System Builder';
  } else if (roleEl) {
    function typeRole() {
      const word = roles[rIdx % roles.length];
      let i = 0;
      // Type forward
      const typer = setInterval(() => {
        roleEl.textContent = word.slice(0, ++i);
        if (i >= word.length) {
          clearInterval(typer);
          // Pause then delete
          setTimeout(() => {
            let j = word.length;
            const eraser = setInterval(() => {
              roleEl.textContent = word.slice(0, --j);
              if (j <= 0) {
                clearInterval(eraser);
                rIdx++;
                setTimeout(typeRole, 200);
              }
            }, 40);
          }, 1500);
        }
      }, 80);
    }
    setTimeout(typeRole, 700);
  }

  // ── Terminal code typing ──
  const termCode   = document.getElementById('terminal-code');
  const termOutput = document.getElementById('terminal-output');

  // Pre-built HTML lines with syntax spans
  const LINES = [
    '<span class="t-kw">class</span> <span class="t-var">Santosh</span><span class="t-pun">:</span>',
    '    <span class="t-var">name</span>    <span class="t-pun">=</span> <span class="t-str">"Karimisetti Santosh Kumar"</span>',
    '    <span class="t-var">role</span>    <span class="t-pun">=</span> <span class="t-pun">[</span><span class="t-str">"Full-Stack Dev"</span><span class="t-pun">,</span> <span class="t-str">"AI Engineer"</span><span class="t-pun">,</span> <span class="t-str">"System Builder"</span><span class="t-pun">]</span>',
    '    <span class="t-var">stack</span>   <span class="t-pun">=</span> <span class="t-pun">[</span><span class="t-str">"Python"</span><span class="t-pun">,</span> <span class="t-str">"Django"</span><span class="t-pun">,</span> <span class="t-str">"Flask"</span><span class="t-pun">,</span> <span class="t-str">"React.js"</span><span class="t-pun">,</span> <span class="t-str">"MongoDB"</span><span class="t-pun">]</span>',
    '    <span class="t-var">status</span>  <span class="t-pun">=</span> <span class="t-str">"Final Year CSE \u00b7 Open to full-time roles"</span>',
    '',
    '    <span class="t-kw">def</span> <span class="t-var">build</span><span class="t-pun">(</span><span class="t-var">self</span><span class="t-pun">):</span>',
    '        <span class="t-kw">return</span> <span class="t-str">"Systems, not just features."</span>'
  ];

  if (reducedMotion) {
    // Show full code instantly
    if (termCode) termCode.innerHTML = LINES.join('\n');
    if (termOutput) {
      termOutput.innerHTML = '<span class="t-prompt">&gt;&gt;&gt; </span><span class="t-var">santosh</span><span class="t-pun">.</span><span class="t-var">build</span><span class="t-pun">()</span>\n<span class="t-out">\'Systems, not just features.\'</span><span class="typing-cursor">|</span>';
      termOutput.classList.add('visible');
    }
  } else if (termCode && termOutput) {
    // Type each plain-text line at 25ms/char, then reveal HTML version
    // We type plain text char by char then replace with highlighted HTML
    const PLAIN = [
      'class Santosh:',
      '    name    = "Karimisetti Santosh Kumar"',
      '    role    = ["Full-Stack Dev", "AI Engineer", "System Builder"]',
      '    stack   = ["Python", "Django", "Flask", "React.js", "MongoDB"]',
      '    status  = "Final Year CSE \u00b7 Open to full-time roles"',
      '',
      '    def build(self):',
      '        return "Systems, not just features."'
    ];

    let lineIdx = 0;
    let charIdx = 0;
    let rendered = []; // finished highlighted lines

    function typeLine() {
      if (lineIdx >= PLAIN.length) {
        // All lines done – swap to full highlighted HTML
        termCode.innerHTML = LINES.join('\n');
        // Show output after 500ms
        setTimeout(() => {
          termOutput.innerHTML =
            '<span class="t-prompt">&gt;&gt;&gt; </span>' +
            '<span class="t-var">santosh</span><span class="t-pun">.</span><span class="t-var">build</span><span class="t-pun">()</span>\n' +
            '<span class="t-out">\'Systems, not just features.\'</span><span class="typing-cursor">|</span>';
          termOutput.classList.add('visible');
        }, 500);
        return;
      }

      const plain = PLAIN[lineIdx];

      if (plain === '') {
        // Empty line: push and move on instantly
        rendered.push('');
        lineIdx++; charIdx = 0;
        termCode.innerHTML = [...rendered].join('\n');
        setTimeout(typeLine, 40);
        return;
      }

      if (charIdx <= plain.length) {
        const partial = plain.slice(0, charIdx);
        termCode.innerHTML = [...rendered, partial].join('\n');
        charIdx++;
        setTimeout(typeLine, 25);
      } else {
        // Line complete: store highlighted version
        rendered.push(LINES[lineIdx]);
        lineIdx++; charIdx = 0;
        typeLine();
      }
    }

    setTimeout(typeLine, 600);
  }
});

window.addEventListener('scroll', () => {
  document.documentElement.style.setProperty('--hero-parallax', `${window.scrollY * 0.4}px`);
}, { passive: true });

/* ═══════════════════════════════════════════════════════════════
   NAVBAR ACTIVE STATE ON SCROLL
═══════════════════════════════════════════════════════════════ */
const navLinks = document.querySelectorAll('.nav-link');

const activeSectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        if (link.getAttribute('data-section') === id) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }
  });
}, {
  rootMargin: '-40% 0px -55% 0px', // triggers when section is ~in the middle of viewport
  threshold: 0
});

document.querySelectorAll('section[id]').forEach(sec => activeSectionObserver.observe(sec));

/* ═══════════════════════════════════════════════════════════════
   DARK-MODE TOGGLE
═══════════════════════════════════════════════════════════════ */
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
    if (d) {
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
    }
  }
  applyTheme(dark);
  toggleBtn.addEventListener('click', () => { dark = !dark; applyTheme(dark); });
}

/* ═══════════════════════════════════════════════════════════════
   CYBERPUNK GUN CURSOR
═══════════════════════════════════════════════════════════════ */
(function initGunCursor() {
  const gun    = document.getElementById('gun-cursor');
  const gunSvg = document.getElementById('gun-svg');
  if (!gun || !gunSvg) return;

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let currentAngle = 0, targetAngle = 0;
  let hoveredEl = null, isFiring = false;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    gun.style.left = mx + 'px';
    gun.style.top  = my + 'px';
    if (hoveredEl) targetAngle = calcAngleTo(hoveredEl);
  }, { passive: true });
  document.addEventListener('mouseleave', () => gun.style.opacity = '0');
  document.addEventListener('mouseenter', () => gun.style.opacity = '1');

  (function rotateLoop() {
    let diff = targetAngle - currentAngle;
    while (diff >  180) diff -= 360;
    while (diff < -180) diff += 360;
    currentAngle += diff * 0.12;
    gunSvg.style.transform = `rotate(${currentAngle}deg)`;
    gunSvg.style.transformOrigin = '30% 50%';
    requestAnimationFrame(rotateLoop);
  })();

  function calcAngleTo(el) {
    const r = el.getBoundingClientRect();
    return Math.atan2(r.top + r.height / 2 - my, r.left + r.width / 2 - mx) * (180 / Math.PI);
  }

  function getMuzzleTip(angleDeg) {
    const rad = angleDeg * Math.PI / 180;
    return { x: mx + Math.cos(rad) * 44, y: my + Math.sin(rad) * 44 };
  }

  const TARGETS = 'a, button, .btn, .pill, .card, input, textarea, select';

  function bindHover(el) {
    el.addEventListener('mouseenter', () => {
      hoveredEl = el; gun.classList.add('aim'); targetAngle = calcAngleTo(el);
    });
    el.addEventListener('mouseleave', () => {
      hoveredEl = null; targetAngle = 0; gun.classList.remove('aim');
    });
  }
  document.querySelectorAll(TARGETS).forEach(bindHover);

  // Button click fire reaction
  document.addEventListener('click', e => {
    const btn = e.target.closest('button, .btn');
    if (btn) {
      gun.style.animation = 'none';
      gun.offsetHeight;
      gun.style.animation = 'gunFlip 0.4s cubic-bezier(0.36, 0.07, 0.19, 0.97) forwards';
      const flash = document.createElement('div');
      flash.style.cssText = `position:fixed;left:${e.clientX}px;top:${e.clientY}px;width:20px;height:20px;border-radius:50%;background:radial-gradient(circle, #fffbe6, #FFD700, transparent);pointer-events:none;z-index:99998;transform:translate(-50%,-50%) scale(0);`;
      document.body.appendChild(flash);
      flash.style.animation = 'muzzleFlash 0.25s ease-out forwards';
      flash.addEventListener('animationend', () => flash.remove(), { once: true });
      setTimeout(() => {
        gun.style.animation = 'none';
        gun.style.transform = 'rotate(0deg)';
      }, 420);
    }
  });

  function scheduleIdleFire() {
    const delay = 2500 + Math.random() * 2500;
    setTimeout(() => {
      if (!hoveredEl && !isFiring) {
        const randomAngle = (Math.random() - 0.5) * 60;
        const tip = getMuzzleTip(randomAngle);
        spawnFlash(tip.x, tip.y);
        const rad = randomAngle * Math.PI / 180;
        spawnBullet(tip.x, tip.y, tip.x + Math.cos(rad) * 400, tip.y + Math.sin(rad) * 400, null);
      }
      scheduleIdleFire();
    }, delay);
  }
  scheduleIdleFire();

  document.addEventListener('click', e => {
    if (isFiring) return;
    const target   = e.target.closest(TARGETS);
    const isAnchor = target && target.tagName === 'A';
    if (isAnchor) e.preventDefault();
    isFiring = true;

    const spinStart = currentAngle, spinDur = 400, spinStart_t = performance.now();
    function spinFrame(now) {
      const t = Math.min((now - spinStart_t) / spinDur, 1);
      const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
      targetAngle = spinStart + 360 * ease;
      if (t < 1) requestAnimationFrame(spinFrame);
      else { targetAngle = spinStart % 360; doFire(target, isAnchor); }
    }
    requestAnimationFrame(spinFrame);
  });

  function doFire(targetEl, performRedirect) {
    gun.classList.add('fire-anim');
    setTimeout(() => gun.classList.remove('fire-anim'), 200);
    const tip = getMuzzleTip(currentAngle);
    spawnFlash(tip.x, tip.y);
    spawnSmoke(tip.x, tip.y);

    let destX, destY;
    if (targetEl) {
      const r = targetEl.getBoundingClientRect();
      destX = r.left + r.width / 2; destY = r.top + r.height / 2;
    } else {
      const rad = currentAngle * Math.PI / 180;
      destX = tip.x + Math.cos(rad) * 450; destY = tip.y + Math.sin(rad) * 450;
    }

    spawnBullet(tip.x, tip.y, destX, destY, () => {
      spawnImpact(destX, destY);
      if (targetEl) {
        targetEl.classList.add('element-hit');
        setTimeout(() => targetEl.classList.remove('element-hit'), 350);
      }
      setTimeout(() => {
        isFiring = false;
        if (performRedirect && targetEl && targetEl.tagName === 'A' && targetEl.href) {
          if (targetEl.target === '_blank') {
            window.open(targetEl.href, '_blank', 'noopener,noreferrer');
          } else if (targetEl.getAttribute('download') !== null) {
            const a = document.createElement('a');
            a.href = targetEl.href; a.download = targetEl.download || ''; a.click();
          } else if (targetEl.href.startsWith('mailto:') || targetEl.href.startsWith('tel:')) {
            window.location.href = targetEl.href;
          } else {
            const hash = targetEl.getAttribute('href');
            if (hash && hash.startsWith('#')) {
              document.querySelector(hash)?.scrollIntoView({ behavior: 'smooth' });
            } else { window.location.href = targetEl.href; }
          }
        }
      }, 120);
    });
  }

  function spawnFlash(x, y) {
    const el = document.createElement('div');
    el.className = 'muzzle-flash';
    el.style.cssText = `left:${x}px;top:${y}px;`;
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  function spawnSmoke(x, y) {
    const el = document.createElement('div');
    el.style.cssText = `position:fixed;left:${x}px;top:${y}px;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,rgba(200,200,200,0.5) 0%,transparent 80%);pointer-events:none;z-index:99994;transform:translate(-50%,-50%) scale(0);`;
    document.body.appendChild(el);
    el.animate([
      { transform:'translate(-50%,-50%) scale(0)',   opacity:0.7 },
      { transform:'translate(-50%,-80%) scale(2.5)', opacity:0   }
    ], { duration:600, easing:'ease-out', fill:'forwards' }).onfinish = () => el.remove();
  }

  function spawnBullet(sx, sy, tx, ty, onHit) {
    const angle = Math.atan2(ty - sy, tx - sx);
    const dist  = Math.hypot(tx - sx, ty - sy);
    const dur   = Math.max(80, Math.min(dist / 2.5, 250));
    const el = document.createElement('div');
    el.className = 'bullet';
    el.style.cssText = `left:${sx}px;top:${sy}px;transform:rotate(${angle*180/Math.PI}deg);`;
    document.body.appendChild(el);
    el.animate([
      { transform:`rotate(${angle*180/Math.PI}deg) translateX(0)`,        opacity:1   },
      { transform:`rotate(${angle*180/Math.PI}deg) translateX(${dist}px)`,opacity:0.2 }
    ], { duration:dur, easing:'linear', fill:'forwards' }).onfinish = () => { el.remove(); if (onHit) onHit(); };
  }

  function spawnImpact(x, y) {
    const COLORS = ['#ffaa30','#ff7010','#ffdd80','#cc8833','#ffffff','#ff5500'];
    for (let i = 0; i < 14; i++) {
      const p   = document.createElement('div');
      p.className = 'impact-particle';
      const ang = (Math.PI * 2 / 14) * i + (Math.random() - 0.5) * 0.5;
      const r   = 20 + Math.random() * 32;
      const sz  = 3 + Math.random() * 4;
      const dur = 0.3 + Math.random() * 0.3;
      const col = COLORS[Math.floor(Math.random() * COLORS.length)];
      p.style.cssText = `left:${x}px;top:${y}px;width:${sz}px;height:${sz}px;background:${col};box-shadow:0 0 5px ${col};--tx:${Math.cos(ang)*r}px;--ty:${Math.sin(ang)*r}px;--dur:${dur}s;`;
      document.body.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
    const ring = document.createElement('div');
    ring.className = 'impact-ring';
    ring.style.cssText = `left:${x}px;top:${y}px;`;
    document.body.appendChild(ring);
    ring.addEventListener('animationend', () => ring.remove(), { once: true });
    setTimeout(() => {
      const ring2 = document.createElement('div');
      ring2.className = 'impact-ring';
      ring2.style.cssText = `left:${x}px;top:${y}px;border-color:#ff4b4b;`;
      document.body.appendChild(ring2);
      ring2.addEventListener('animationend', () => ring2.remove(), { once: true });
    }, 80);
  }

})();

/* ═══════════════════════════════════════════════════════════════
   REDUCED MOTION
═══════════════════════════════════════════════════════════════ */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.globalTimeline.pause();
}
