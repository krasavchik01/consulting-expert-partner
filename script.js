// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
    } else {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    }

    if (currentScroll > lastScroll && currentScroll > 80) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }

    lastScroll = currentScroll;
});

// Burger Menu Toggle
const burgerMenu = document.querySelector('.burger-menu');
const navMenu = document.querySelector('.nav-menu');

burgerMenu?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    burgerMenu.classList.toggle('active');

    // Animate burger menu
    const spans = burgerMenu.querySelectorAll('span');
    if (burgerMenu.classList.contains('active')) {
        spans[0].style.transform = 'rotate(45deg) translate(8px, 8px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(8px, -8px)';
    } else {
        spans[0].style.transform = 'none';
        spans[1].style.opacity = '1';
        spans[2].style.transform = 'none';
    }
});

// Intersection Observer for Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(card);
});

// Observe benefit items
document.querySelectorAll('.benefit-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-30px)';
    item.style.transition = `all 0.6s ease ${index * 0.1}s`;
    observer.observe(item);
});

// Observe process steps
document.querySelectorAll('.process-step').forEach((step, index) => {
    step.style.opacity = '0';
    step.style.transform = 'translateY(30px)';
    step.style.transition = `all 0.6s ease ${index * 0.15}s`;
    observer.observe(step);
});

// Counter Animation for Stats
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);

    const updateCounter = () => {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start) + (element.textContent.includes('%') ? '%' : '+');
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target + (element.textContent.includes('%') ? '%' : '+');
        }
    };

    updateCounter();
};

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumber = entry.target.querySelector('.stat-number');
            const text = statNumber.textContent;
            const number = parseInt(text.replace(/\D/g, ''));

            statNumber.textContent = '0' + (text.includes('%') ? '%' : '+');

            setTimeout(() => {
                animateCounter(statNumber, number);
            }, 300);

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-item').forEach(stat => {
    statsObserver.observe(stat);
});

// Form Handling
const contactForm = document.querySelector('.contact-form');

contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    console.log('Form submitted:', data);

    // Show success message
    const button = contactForm.querySelector('.btn-primary');
    const originalText = button.textContent;

    button.textContent = 'Отправлено!';
    button.style.background = 'linear-gradient(135deg, #4ade80 0%, #16a34a 100%)';

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = '';
        contactForm.reset();
    }, 3000);
});

// CTA Button Handlers
const ctaButtons = document.querySelectorAll('.cta-button, .hero-buttons .btn-primary, .cta-section .btn-primary');

ctaButtons.forEach(button => {
    button.addEventListener('click', () => {
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                const firstInput = contactForm?.querySelector('input');
                firstInput?.focus();
            }, 800);
        }
    });
});

// Service Button Handlers
const serviceButtons = document.querySelectorAll('.service-button');

serviceButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        const card = e.target.closest('.service-card');
        const serviceName = card.querySelector('.service-title').textContent;

        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });

            setTimeout(() => {
                const serviceSelect = contactForm?.querySelector('#service');
                const messageTextarea = contactForm?.querySelector('#message');

                if (serviceSelect && messageTextarea) {
                    // Try to match service name with select option
                    const options = Array.from(serviceSelect.options);
                    const matchingOption = options.find(option =>
                        serviceName.toLowerCase().includes(option.text.toLowerCase().split(' ')[0])
                    );

                    if (matchingOption) {
                        serviceSelect.value = matchingOption.value;
                    }

                    messageTextarea.value = `Здравствуйте! Меня интересует услуга: ${serviceName}. `;
                    messageTextarea.focus();
                }
            }, 800);
        }
    });
});

// Parallax Effect for Hero Orbs
let ticking = false;

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            const scrolled = window.pageYOffset;
            const orbs = document.querySelectorAll('.gradient-orb');

            orbs.forEach((orb, index) => {
                const speed = 0.3 + (index * 0.1);
                orb.style.transform = `translateY(${scrolled * speed}px)`;
            });

            ticking = false;
        });

        ticking = true;
    }
});

// Floating Cards Animation Enhancement
const floatingCards = document.querySelectorAll('.floating-card');

floatingCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.05) translateY(-10px)';
        card.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.zIndex = '10';
    });

    card.addEventListener('mouseleave', function() {
        this.style.zIndex = '1';
    });
});

// Mobile Menu Handling
if (window.innerWidth <= 768) {
    const navLinks = document.querySelectorAll('.nav-menu a');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            burgerMenu.classList.remove('active');

            const spans = burgerMenu.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// Add mobile menu styles dynamically
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: fixed;
            top: 80px;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(20px);
            padding: 40px 24px;
            gap: 24px;
            box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.3s ease;
            z-index: 999;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .nav-menu.active a {
            font-size: 18px;
            padding: 12px 0;
        }
    }
`;
document.head.appendChild(style);

// Smooth reveal on page load
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Add loading animation
document.addEventListener('DOMContentLoaded', () => {
    // Preload animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 500);
});

console.log('Consulting Expert Partner Ltd - Website Loaded Successfully');
