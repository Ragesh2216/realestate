// Loading Screen Animation
window.addEventListener('load', function () {
    const loadingScreen = document.getElementById('loading-screen');

    // Hide loading screen after 1.5 seconds
    setTimeout(function () {
        loadingScreen.classList.add('fade-out');
    }, 1500);
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', function () {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
}

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Close mobile menu if open
            if (window.innerWidth <= 968) {
                navMenu.style.display = 'none';
            }
        }
    });
});

// Header Scroll Effect
let lastScroll = 0;
const header = document.getElementById('main-header');

window.addEventListener('scroll', function () {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        header.style.boxShadow = '0 4px 16px rgba(108, 63, 227, 0.15)';
        header.style.padding = '10px 0';
    } else {
        header.style.boxShadow = '0 2px 8px rgba(108, 63, 227, 0.1)';
        header.style.padding = '15px 0';
    }

    lastScroll = currentScroll;
});

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function (entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.service-card, .feature-item, .testimonial-card, .pricing-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Counter Animation for Stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);

    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            // Format number with appropriate suffix
            if (target >= 1000000) {
                element.textContent = (start / 1000000).toFixed(1) + 'M+';
            } else if (target >= 1000) {
                element.textContent = (start / 1000).toFixed(0) + 'K+';
            } else {
                element.textContent = Math.floor(start);
            }
        }
    }, 16);
}

// Observe stats section
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const statNumbers = entry.target.querySelectorAll('.stat-number');

            statNumbers.forEach(stat => {
                const text = stat.textContent;
                let value;

                if (text.includes('K+')) {
                    value = parseFloat(text) * 1000;
                } else if (text.includes('M+') || text.includes('B+')) {
                    value = parseFloat(text) * 1000000;
                } else if (text.includes('/')) {
                    // Handle rating format
                    stat.textContent = '0.0/5';
                    let current = 0;
                    const target = 4.9;
                    const timer = setInterval(() => {
                        current += 0.1;
                        if (current >= target) {
                            stat.textContent = '4.9/5';
                            clearInterval(timer);
                        } else {
                            stat.textContent = current.toFixed(1) + '/5';
                        }
                    }, 40);
                    return;
                } else if (text.includes('%')) {
                    value = parseFloat(text);
                    const timer = setInterval(() => {
                        let current = 0;
                        if (current >= value) {
                            stat.textContent = value + '%';
                            clearInterval(timer);
                        } else {
                            current += 1;
                            stat.textContent = current + '%';
                        }
                    }, 20);
                    return;
                }

                stat.textContent = '0';
                animateCounter(stat, value || parseInt(text));
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats-grid');
if (statsSection) {
    statsObserver.observe(statsSection.parentElement);
}

// Floating Card Animation Enhancement
document.querySelectorAll('.floating-card').forEach((card, index) => {
    card.style.animationDelay = `${index * 0.2}s`;
});

// Form Validation
const contactForm = document.querySelector('.contact-form');
const formInputs = document.querySelectorAll('.form-input, .form-textarea');

formInputs.forEach(input => {
    input.addEventListener('focus', function () {
        this.style.borderColor = 'var(--primary-color)';
    });

    input.addEventListener('blur', function () {
        if (this.value === '') {
            this.style.borderColor = 'var(--gray-200)';
        }
    });
});

// 404 Redirect Function
function goto404() {
    window.location.href = '404.html';
}

// Parallax Effect for Hero Section
window.addEventListener('scroll', function () {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-bg-shapes .shape');

    parallaxElements.forEach((el, index) => {
        const speed = (index + 1) * 0.1;
        el.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.05}deg)`;
    });
});

// Add hover effect to service cards
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.borderColor = 'var(--primary-color)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.borderColor = 'transparent';
    });
});

// Pricing card interactions
document.querySelectorAll('.pricing-card:not(.featured)').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-10px) scale(1.02)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Add ripple effect to buttons
function createRipple(event) {
    const button = event.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
    circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
    circle.classList.add('ripple');

    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    button.appendChild(circle);
}

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = `
    .btn-primary, .btn-secondary, .cta-btn, .plan-btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Apply ripple effect to all buttons
document.querySelectorAll('.btn-primary, .btn-secondary, .cta-btn, .plan-btn').forEach(button => {
    button.addEventListener('click', createRipple);
});

// Loading progress bar
const loadingProgress = document.querySelector('.loading-progress');
if (loadingProgress) {
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width += 2;
            loadingProgress.style.width = width + '%';
        }
    }, 30);
}

// Add cursor trail effect (subtle)
let mouseX = 0;
let mouseY = 0;
let cursorCircle = null;

document.addEventListener('mousemove', function (e) {
    mouseX = e.pageX;
    mouseY = e.pageY;
});

// Testimonial hover effect
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.borderLeft = '4px solid var(--primary-color)';
    });

    card.addEventListener('mouseleave', function () {
        this.style.borderLeft = 'none';
    });
});

// Feature icon animation on hover
document.querySelectorAll('.feature-icon').forEach(icon => {
    icon.addEventListener('mouseenter', function () {
        this.style.transform = 'scale(1.2) rotate(10deg)';
    });

    icon.addEventListener('mouseleave', function () {
        this.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Console welcome message
console.log('%c Welcome to Stackly Real Estate! ', 'background: linear-gradient(135deg, #6C3FE3, #00D4D4); color: white; font-size: 20px; padding: 10px; border-radius: 5px;');
console.log('%c Find your dream home today ', 'color: #6C3FE3; font-size: 14px;');
