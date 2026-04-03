// ==============================================
// CEP — Architectural Noir v2 — Full Animations
// ==============================================

// ——— CANVAS PARTICLE NETWORK ———
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -1000, y: -1000 };
const PARTICLE_COUNT = 100;
const CONNECT_DIST = 200;
const MOUSE_DIST = 280;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.reset();
    }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4;
        this.vy = (Math.random() - 0.5) * 0.4;
        this.r = Math.random() * 3 + 1.5;
        // Shape: 0=circle, 1=triangle, 2=square, 3=diamond
        this.shape = Math.floor(Math.random() * 4);
        this.rotation = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.015;
        this.baseAlpha = Math.random() * 0.5 + 0.35;
        this.alpha = this.baseAlpha;
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotSpeed;

        // Mouse interaction
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MOUSE_DIST) {
            const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.02;
            this.vx += dx * force;
            this.vy += dy * force;
            this.alpha = this.baseAlpha + (1 - dist / MOUSE_DIST) * 0.6;
        } else {
            this.alpha += (this.baseAlpha - this.alpha) * 0.05;
        }

        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Wrap
        if (this.x < -20) this.x = canvas.width + 20;
        if (this.x > canvas.width + 20) this.x = -20;
        if (this.y < -20) this.y = canvas.height + 20;
        if (this.y > canvas.height + 20) this.y = -20;
    }
    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.fillStyle = `rgba(212,168,83,${this.alpha})`;
        ctx.strokeStyle = `rgba(212,168,83,${this.alpha * 0.9})`;
        ctx.lineWidth = 1.2;

        // Glow effect
        ctx.shadowColor = 'rgba(212,168,83,0.5)';
        ctx.shadowBlur = 8;

        const s = this.r * 2.5;
        switch (this.shape) {
            case 0: // Circle
                ctx.beginPath();
                ctx.arc(0, 0, this.r, 0, Math.PI * 2);
                ctx.fill();
                break;
            case 1: // Triangle
                ctx.beginPath();
                ctx.moveTo(0, -s);
                ctx.lineTo(s * 0.87, s * 0.5);
                ctx.lineTo(-s * 0.87, s * 0.5);
                ctx.closePath();
                ctx.stroke();
                break;
            case 2: // Square
                ctx.strokeRect(-s / 2, -s / 2, s, s);
                break;
            case 3: // Diamond
                ctx.beginPath();
                ctx.moveTo(0, -s);
                ctx.lineTo(s * 0.7, 0);
                ctx.lineTo(0, s);
                ctx.lineTo(-s * 0.7, 0);
                ctx.closePath();
                ctx.stroke();
                break;
        }
        ctx.restore();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < CONNECT_DIST) {
                const alpha = (1 - dist / CONNECT_DIST) * 0.35;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(212,168,83,${alpha})`;
                ctx.lineWidth = 0.8;
                ctx.shadowColor = 'rgba(212,168,83,0.15)';
                ctx.shadowBlur = 4;
                ctx.stroke();
                ctx.shadowBlur = 0;
            }
        }
    }
}

function animateCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animateCanvas);
}

resizeCanvas();
initParticles();
animateCanvas();
window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });
document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// ——— CURSOR GLOW ———
const glow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', e => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
});

// ——— NAVBAR ———
const navbar = document.getElementById('navbar');
let lastY = 0;
window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 60);
    navbar.style.transform = (y > lastY && y > 200) ? 'translateY(-100%)' : 'translateY(0)';
    lastY = y;
});

// ——— BURGER ———
const burger = document.getElementById('burger');
const navMenu = document.getElementById('navMenu');
burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('active');
});
navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        burger.classList.remove('active');
        navMenu.classList.remove('active');
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

// ——— SCROLL REVEAL ———
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// Word-by-word hero reveal
const wordObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const words = entry.target.querySelectorAll('[data-reveal-word]');
            words.forEach((w, i) => {
                setTimeout(() => w.classList.add('visible'), i * 120);
            });
            wordObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.hero-title').forEach(el => wordObserver.observe(el));

// ——— TILT / RADIAL GLOW ON CARDS ———
document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
    });
});

// ——— COUNTER ANIMATION ———
const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.count);
            const duration = 2000;
            const start = performance.now();
            const tick = now => {
                const p = Math.min((now - start) / duration, 1);
                const ease = 1 - Math.pow(1 - p, 3);
                el.textContent = Math.floor(ease * target);
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
        const scrolled = Math.max(0, Math.min(1, (viewH - rect.top) / (viewH + totalH)));
        const progress = scrolled * totalH;
        timelineTrack.style.height = progress + 'px';

        timelineSteps.forEach(step => {
            const stepRect = step.getBoundingClientRect();
            step.classList.toggle('active', stepRect.top < viewH * 0.6);
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
    setTimeout(() => {
        span.textContent = orig;
        btn.style.background = '';
        btn.style.pointerEvents = '';
        form.reset();
    }, 3000);
});

// ——— SERVICE LINK → CONTACT ———
document.querySelectorAll('.srv-link').forEach(btn => {
    btn.addEventListener('click', () => {
        const svc = btn.dataset.service;
        const card = btn.closest('.srv-card');
        const name = card.querySelector('h3').textContent;
        document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => {
            const sel = form?.querySelector('#service');
            const msg = form?.querySelector('#message');
            if (sel) sel.value = svc || '';
            if (msg) { msg.value = `Здравствуйте! Интересует: ${name}. `; msg.focus(); }
        }, 800);
    });
});
