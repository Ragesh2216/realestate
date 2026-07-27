document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader hide logic after 1.5 seconds (1500ms)
    const preloader = document.getElementById('preloader');
    if (preloader) {
        document.body.classList.add('preloader-active');
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                document.body.classList.remove('preloader-active');
            }, 500); // Wait for transition (500ms) to complete
        }, 1500);
    }

    // 1. Sticky Header scroll effect
    const header = document.getElementById('header-container');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    });

    // 2. Mobile Hamburger Menu Toggle
    const mobileMenuTrigger = document.querySelector('.mmenu-trigger');
    const navMenu = document.getElementById('navigation');
    
    if (mobileMenuTrigger && navMenu) {
        mobileMenuTrigger.addEventListener('click', () => {
            mobileMenuTrigger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('mmenu-active');
        });

        // Close menu when clicking on any link
        const menuLinks = navMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuTrigger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.classList.remove('mmenu-active');
            });
        });
    }

    // 3. Tab switching (For Sale / For Rent)
    const tabLinks = document.querySelectorAll('.rld-banner-tab .nav-item a');
    const saleTab = document.getElementById('tabs_1');
    const rentTab = document.getElementById('tabs_2');

    tabLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            tabLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const target = link.getAttribute('href');
            if (target === '#tabs_1') {
                if (saleTab) saleTab.classList.add('show', 'active');
                if (rentTab) rentTab.classList.remove('show', 'active');
            } else {
                if (rentTab) rentTab.classList.add('show', 'active');
                if (saleTab) saleTab.classList.remove('show', 'active');
            }
        });
    });

    // 4. Advanced Search Collapse/Expand Toggle
    const dropdownFilters = document.querySelectorAll('.dropdown-filter');
    dropdownFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            const parentSearch = btn.closest('.rld-main-search');
            const checkboxList = parentSearch.querySelector('.explore__form-checkbox-list');
            
            if (checkboxList) {
                checkboxList.classList.toggle('filter-block');
                
                const span = btn.querySelector('span') || btn;
                const icon = btn.querySelector('i');
                if (checkboxList.classList.contains('filter-block')) {
                    span.textContent = 'Simple Search';
                    if (icon) icon.className = 'fa-solid fa-angle-up';
                } else {
                    span.textContent = 'Advanced Search';
                    if (icon) icon.className = 'fa-solid fa-angle-down';
                }
            }
        });
    });

    // 5. Custom Range Sliders Live Value Update
    const sliders = [
        { id: 'area-range', input: 'area-slider', output: 'area-val', unit: 'sq ft' },
        { id: 'price-range', input: 'price-slider', output: 'price-val', unit: '$' },
        { id: 'area-range-rent', input: 'area-slider-rent', output: 'area-val-rent', unit: 'sq ft' },
        { id: 'price-range-rent', input: 'price-slider-rent', output: 'price-val-rent', unit: '$' }
    ];

    sliders.forEach(slider => {
        const sliderInput = document.getElementById(slider.input);
        const sliderOutput = document.getElementById(slider.output);
        
        if (sliderInput && sliderOutput) {
            sliderInput.addEventListener('input', (e) => {
                const value = parseInt(e.target.value).toLocaleString();
                if (slider.unit === '$') {
                    sliderOutput.textContent = `${slider.unit}${value}`;
                } else {
                    sliderOutput.textContent = `${value} ${slider.unit}`;
                }
            });
        }
    });

    // 6. Generic Carousel Implementation (Recent Properties & Testimonials)
    function setupCarousel(carouselSelector) {
        const carousel = document.querySelector(carouselSelector);
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        
        if (!track) return;

        let currentIndex = 0;
        
        const updateCarousel = () => {
            const slide = carousel.querySelector('.carousel-slide');
            if (!slide) return;
            const slideWidth = slide.getBoundingClientRect().width;
            track.style.transform = `translateX(-${currentIndex * (slideWidth + 32)}px)`; // 32px is the gap
        };

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const slidesCount = track.querySelectorAll('.carousel-slide').length;
                const slide = carousel.querySelector('.carousel-slide');
                if (!slide) return;
                const visibleSlides = Math.round(track.getBoundingClientRect().width / slide.getBoundingClientRect().width) || 1;
                
                if (currentIndex < slidesCount - visibleSlides) {
                    currentIndex++;
                    updateCarousel();
                } else {
                    currentIndex = 0; // wrap around
                    updateCarousel();
                }
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                const slidesCount = track.querySelectorAll('.carousel-slide').length;
                const slide = carousel.querySelector('.carousel-slide');
                if (!slide) return;
                const visibleSlides = Math.round(track.getBoundingClientRect().width / slide.getBoundingClientRect().width) || 1;
                
                if (currentIndex > 0) {
                    currentIndex--;
                    updateCarousel();
                } else {
                    currentIndex = slidesCount - visibleSlides; // wrap to end
                    updateCarousel();
                }
            });
        }

        window.addEventListener('resize', updateCarousel);
    }

    setupCarousel('.recent-carousel');
    setupCarousel('.testimonials-carousel');

    // 7. Counters Animation (Scroll Triggered)
    const counters = document.querySelectorAll('.counter');
    const speed = 100;

    const startCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText;
        const increment = Math.ceil(target / speed);

        if (count < target) {
            counter.innerText = count + increment;
            setTimeout(() => startCounter(counter), 20);
        } else {
            counter.innerText = target;
        }
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                counter.innerText = "0";
                startCounter(counter);
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 8. User Login / Registration Modal
    const modal = document.querySelector('.login-and-register-form');
    const modalTriggers = document.querySelectorAll('.modal-open');
    const modalClose = document.querySelector('.close-reg');
    const modalOverlay = document.querySelector('.main-overlay');

    if (modal) {
        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
        });

        const closeModal = () => {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        if (modalClose) modalClose.addEventListener('click', closeModal);
        if (modalOverlay) modalOverlay.addEventListener('click', closeModal);
        
        const modalTabs = document.querySelectorAll('.tabs-menu li');
        const modalContents = document.querySelectorAll('.tab-contents');

        modalTabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                modalTabs.forEach(t => t.classList.remove('current'));
                tab.classList.add('current');

                modalContents.forEach(content => content.classList.remove('active'));
                modalContents[index].classList.add('active');
            });
        });
    }

    // 9. Language Dropdown menu
    const langWrap = document.querySelector('.lang-wrap');
    if (langWrap) {
        const showLang = langWrap.querySelector('.show-lang');
        const tooltip = langWrap.querySelector('.lang-tooltip');

        showLang.addEventListener('click', (e) => {
            e.stopPropagation();
            tooltip.classList.toggle('active');
        });

        document.addEventListener('click', () => {
            tooltip.classList.remove('active');
        });
    }

    // 10. Listing Page: Grid/List Toggle Switch
    const viewGridBtn = document.getElementById('view-grid');
    const viewListBtn = document.getElementById('view-list');
    const listingContainer = document.querySelector('.listing-container');
    if (viewGridBtn && viewListBtn && listingContainer) {
        viewGridBtn.addEventListener('click', (e) => {
            e.preventDefault();
            viewGridBtn.classList.add('active');
            viewListBtn.classList.remove('active');
            listingContainer.classList.remove('list-layout');
            listingContainer.classList.add('grid-layout');
        });
        viewListBtn.addEventListener('click', (e) => {
            e.preventDefault();
            viewListBtn.classList.add('active');
            viewGridBtn.classList.remove('active');
            listingContainer.classList.remove('grid-layout');
            listingContainer.classList.add('list-layout');
        });
    }

    // 11. Property Page: Floor Plan blueprint Tabs
    const floorTabs = document.querySelectorAll('.floor-tabs li a');
    const floorContents = document.querySelectorAll('.floor-plan-content');
    if (floorTabs && floorContents) {
        floorTabs.forEach((tab, index) => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                floorTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                floorContents.forEach(c => c.classList.remove('active'));
                if (floorContents[index]) {
                    floorContents[index].classList.add('active');
                }
            });
        });
    }

    // 12. About Page: Interactive FAQ Accordion Panel
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    if (accordionHeaders) {
        accordionHeaders.forEach(header => {
            header.addEventListener('click', () => {
                const body = header.nextElementSibling;
                const icon = header.querySelector('i');
                
                header.classList.toggle('active');
                if (body) {
                    body.classList.toggle('active');
                }
                
                if (icon) {
                    if (header.classList.contains('active')) {
                        icon.className = 'fa-solid fa-minus';
                    } else {
                        icon.className = 'fa-solid fa-plus';
                    }
                }
            });
        });
    }

    // 13. Listing Page: Mortgage Calculator Widget
    const calcBtn = document.getElementById('calc-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const homeVal = parseFloat(document.getElementById('calc-home-val').value) || 0;
            const downPayment = parseFloat(document.getElementById('calc-down-payment').value) || 0;
            const rate = parseFloat(document.getElementById('calc-interest').value) || 0;
            const term = parseInt(document.getElementById('calc-term').value) || 30;
            
            const principal = homeVal - downPayment;
            const monthlyRate = (rate / 100) / 12;
            const totalMonths = term * 12;
            
            let monthlyPayment = 0;
            if (principal > 0 && totalMonths > 0) {
                if (monthlyRate > 0) {
                    monthlyPayment = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);
                } else {
                    monthlyPayment = principal / totalMonths;
                }
            }
            
            const resultEl = document.getElementById('calc-result');
            if (resultEl) {
                resultEl.textContent = `$${monthlyPayment.toFixed(2)} / month`;
                resultEl.style.fontWeight = '800';
            }
        });
    }

    // 14. Scroll Entrance Animation Controller
    const scrollElements = document.querySelectorAll(
        'section, .project-single, .testimonials-item, .service-item, .contact-card, .accordion-item, .sidebar-filters, .agent-contact-card, .property-desc-box, .blog-widget, .about-us-info, .agent-status, .escalations'
    );
    
    scrollElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
                observer.unobserve(entry.target); // trigger animation only once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(el => {
        scrollObserver.observe(el);
    });
});
