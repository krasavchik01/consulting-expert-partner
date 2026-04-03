// ==============================================
// CEP — Architectural Noir v2
// Performance-first: CSS animations + lightweight JS
// ==============================================

const isMobile = window.innerWidth < 768;

// ——— CANVAS — Desktop only, lightweight ———
const canvas = document.getElementById('bg-canvas');
if (!isMobile && canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: -1000, y: -1000 };
    const COUNT = 70;
    const LINK = 180;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', () => { resize(); init(); });
    document.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    class P {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.r = Math.random() * 2.5 + 1;
            this.shape = Math.floor(Math.random() * 4);
            this.rot = Math.random() * 6.28;
            this.rs = (Math.random() - 0.5) * 0.012;
            this.a = Math.random() * 0.4 + 0.3;
        }
        update() {
            this.x += this.vx; this.y += this.vy; this.rot += this.rs;
            const dx = this.x - mouse.x, dy = this.y - mouse.y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d < 240) {
                const f = (240 - d) / 240 * 0.015;
                this.vx += dx * f; this.vy += dy * f;
            }
            this.vx *= 0.99; this.vy *= 0.99;
            if (this.x < -20) this.x = canvas.width + 20;
            if (this.x > canvas.width + 20) this.x = -20;
            if (this.y < -20) this.y = canvas.height + 20;
            if (this.y > canvas.height + 20) this.y = -20;
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rot);
            ctx.fillStyle = ctx.strokeStyle = `rgba(212,168,83,${this.a})`;
            ctx.lineWidth = 1;
            const s = this.r * 2.5;
            if (this.shape === 0) { ctx.beginPath(); ctx.arc(0, 0, this.r, 0, 6.28); ctx.fill(); }
            else if (this.shape === 1) { ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * .87, s * .5); ctx.lineTo(-s * .87, s * .5); ctx.closePath(); ctx.stroke(); }
            else if (this.shape === 2) { ctx.strokeRect(-s / 2, -s / 2, s, s); }
            else { ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * .7, 0); ctx.lineTo(0, s); ctx.lineTo(-s * .7, 0); ctx.closePath(); ctx.stroke(); }
            ctx.restore();
        }
    }

    function init() { particles = Array.from({ length: COUNT }, () => new P()); }
    init();

    (function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const p of particles) { p.update(); p.draw(); }
        // connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < LINK) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212,168,83,${(1 - d / LINK) * 0.25})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(loop);
    })();
} else if (canvas) {
    canvas.style.display = 'none';
}

// ——— CURSOR GLOW — desktop only ———
const glow = document.getElementById('cursorGlow');
if (!isMobile && glow) {
    document.addEventListener('mousemove', e => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });
}

// ——— NAVBAR ———
const navbar = document.getElementById('navbar');
let lastY = 0;
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    navbar.style.transform = (y > lastY && y > 200) ? 'translateY(-100%)' : 'translateY(0)';
    lastY = y;
}, { passive: true });

// ——— BURGER ———
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
burger?.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
});
navMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        burger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// ——— SMOOTH SCROLL ———
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// ——— SCROLL REVEAL — Varied directions ———
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // stagger children if they have data-stagger
            const kids = entry.target.querySelectorAll('[data-stagger]');
            kids.forEach((k, i) => {
                k.style.transitionDelay = (i * 0.08) + 's';
                k.classList.add('visible');
            });
        }
    });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Word-by-word hero
const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-reveal-word]').forEach((w, i) => {
                setTimeout(() => w.classList.add('visible'), i * 100);
            });
            wordObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });
document.querySelectorAll('.hero-title').forEach(el => wordObserver.observe(el));

// ——— SERVICE & BENEFIT CARDS — stagger on scroll ———
document.querySelectorAll('.srv-grid, .why-right').forEach(grid => {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const cards = entry.target.children;
                Array.from(cards).forEach((c, i) => {
                    setTimeout(() => c.classList.add('visible'), i * 80);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    obs.observe(grid);
});

// ——— TILT / GLOW ON CARDS — desktop only ———
if (!isMobile) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
            card.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
        });
    });
}

// ——— COUNTER ANIMATION ———
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            const start = performance.now();
            const tick = now => {
                const p = Math.min((now - start) / 2000, 1);
                el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target);
                if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            countObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-count]').forEach(el => countObserver.observe(el));

// ——— TIMELINE PROGRESS ———
const timelineSection = document.querySelector('.timeline');
const timelineTrack = document.getElementById('timelineTrack');
const timelineSteps = document.querySelectorAll('.timeline-step');

if (timelineSection && timelineTrack) {
    const updateTimeline = () => {
        const rect = timelineSection.getBoundingClientRect();
        const viewH = window.innerHeight;
        const totalH = timelineSection.offsetHeight;
        const progress = Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + totalH)));
        timelineTrack.style.height = (progress * totalH) + 'px';
        timelineSteps.forEach(step => {
            step.classList.toggle('active', step.getBoundingClientRect().top < viewH * 0.6);
        });
    };
    window.addEventListener('scroll', updateTimeline, { passive: true });
    updateTimeline();
}

// ——— FORM ———
const form = document.getElementById('contactForm');
form?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn');
    const span = btn.querySelector('span');
    const orig = span.textContent;
    span.textContent = 'Отправлено!';
    btn.style.background = '#2d6a4f';
    btn.style.pointerEvents = 'none';
    setTimeout(() => { span.textContent = orig; btn.style.background = ''; btn.style.pointerEvents = ''; form.reset(); }, 3000);
});

// ——— SERVICE → CONTACT ———
document.querySelectorAll('.srv-link').forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.srv-card');
        const name = card.querySelector('h3').textContent;
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const sel = form?.querySelector('#service');
            const msg = form?.querySelector('#message');
            if (sel) sel.value = btn.dataset.service || '';
            if (msg) { msg.value = `Здравствуйте! Интересует: ${name}. `; msg.focus(); }
        }, 800);
    });
});
