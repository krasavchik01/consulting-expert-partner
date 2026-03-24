// ============================================
// CONSULTING EXPERT PARTNER — Desert Noir Luxury
// ============================================

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // Close mobile menu if open
            navMenu?.classList.remove('active');
            burgerMenu?.classList.remove('active');
        }
    });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 60) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Burger menu toggle
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

burgerMenu?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    burgerMenu.classList.toggle('active');

    const spans = burgerMenu.querySelectorAll('span');
    if (burgerMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
        spans.forEach(s => {
            s.style.transform = 'none';
            s.style.opacity = '1';
        });
    }
});

// Intersection Observer — scroll-triggered reveals
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
});

// Apply reveal to key elements
const revealSelectors = [
    '.section-header',
    '.section-eyebrow',
    '.section-title',
    '.section-description',
    '.service-card',
    '.benefit-card',
    '.process-step',
    '.contact-info',
    '.contact-form',
    '.why-us-left',
    '.cta-content'
];

revealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
        el.classList.add('reveal');
        if (i < 6) {
            el.classList.add(`reveal-delay-${Math.min(i + 1, 4)}`);
        }
        revealObserver.observe(el);
    });
});

// Counter animation for stat numbers
const animateCounter = (element, target, suffix) => {
    const duration = 2000;
    const startTime = performance.now();

    const update = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(eased * target);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    };

    requestAnimationFrame(update);
};

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const text = el.textContent;
            const target = parseInt(text.replace(/\D/g, ''));
            const suffix = text.includes('%') ? '%' : '+';

            el.textContent = '0' + suffix;
            setTimeout(() => animateCounter(el, target, suffix), 200);

            statsObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(stat => {
    statsObserver.observe(stat);
});

// Form handling
const contactForm = document.querySelector('.contact-form');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);
    console.log('Form submitted:', data);

    const button = contactForm.querySelector('.btn-primary');
    const buttonSpan = button.querySelector('span');
    const originalText = buttonSpan.textContent;

    buttonSpan.textContent = 'Отправлено!';
    button.style.background = '#2d6a4f';
    button.style.pointerEvents = 'none';

    setTimeout(() => {
        buttonSpan.textContent = originalText;
        button.style.background = '';
        button.style.pointerEvents = '';
        contactForm.reset();
    }, 3000);
});

// Service button click → scroll to contact with pre-filled service
document.querySelectorAll('.service-button').forEach(button => {
    button.addEventListener('click', () => {
        const card = button.closest('.service-card');
        const serviceName = card.querySelector('.service-title').textContent;
        const contactSection = document.querySelector('#contact');

        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                const serviceSelect = contactForm?.querySelector('#service');
                const messageArea = contactForm?.querySelector('#message');

                if (serviceSelect) {
                    const options = Array.from(serviceSelect.options);
                    const match = options.find(opt =>
                        serviceName.toLowerCase().includes(opt.text.toLowerCase().split(' ')[0])
                    );
                    if (match) serviceSelect.value = match.value;
                }

                if (messageArea) {
                    messageArea.value = `Здравствуйте! Меня интересует услуга: ${serviceName}. `;
                    messageArea.focus();
                }
            }, 800);
        }
    });
});

// CTA buttons → scroll to contact
document.querySelectorAll('.btn-primary').forEach(button => {
    if (button.closest('.contact-form')) return;
    if (button.getAttribute('href') === '#contact' || button.closest('a[href="#contact"]')) return;

    button.addEventListener('click', () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                contactForm?.querySelector('input')?.focus();
            }, 800);
        }
    });
});
