/* ==========================================================================
   DINK HOME GLOBAL GSAP ANIMATIONS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // 1. REGISTER PLUGINS
    gsap.registerPlugin(ScrollTrigger);

    // 2. LENIS SMOOTH SCROLL (GLOBAL INSTANCE)
    let lenis;
    try {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis();
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
            window.lenis = lenis;
        }
    } catch (e) {
        console.warn("Lenis failed to initialize:", e);
    }

    // 3. CORE UI ANIMATIONS

    // Custom Cursor Dot
    const cursor = document.querySelector('.cursor-dot');
    if (cursor) {
        gsap.set(cursor, { opacity: 0 }); // Hidden until move
        window.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1,
                display: "block",
                opacity: 1
            });
        });
    }


    // Logo Slider Hover
    const logoContainer = document.querySelector('.logo-container');
    const logoSlider = document.getElementById('logo-slider');
    if (logoContainer && logoSlider) {
        logoContainer.addEventListener('mouseenter', () => {
            const h = getComputedStyle(logoContainer).getPropertyValue('--logo-h').trim();
            gsap.to(logoSlider, { y: `-${h}`, duration: 0.5, ease: "power2.out" });
        });
        logoContainer.addEventListener('mouseleave', () => {
            gsap.to(logoSlider, { y: "0", duration: 0.5, ease: "power2.out" });
        });
    }

    // Header Scroll Shrink
    const nav = document.getElementById('main-nav');
    if (nav) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                nav.classList.add('py-3', 'bg-black/95', 'backdrop-blur-2xl');
                nav.classList.remove('py-5', 'bg-black/80');
            } else {
                nav.classList.add('py-5', 'bg-black/80');
                nav.classList.remove('py-3', 'bg-black/95', 'backdrop-blur-2xl');
            }
        });
    }

    // 4. GLOBAL REVEAL ANIMATIONS
    const initGlobalReveals = () => {
        // Reveal Up (Single items)
        gsap.utils.toArray('.reveal-up, .reveal, .scroll-reveal, .reveal-load, .legal-section').forEach(el => {
            gsap.to(el, {
                autoAlpha: 1,
                y: 0,
                duration: 1.2,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: el,
                    start: "top 95%",
                    toggleActions: "play none none none"
                }
            });
        });

        // Staggered Containers
        gsap.utils.toArray('.stagger-container').forEach(container => {
            gsap.to(container.querySelectorAll('.stagger-item, .product-card'), {
                autoAlpha: 1,
                y: 0,
                stagger: 0.15,
                duration: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: container,
                    start: "top 85%"
                }
            });
        });

        // Batch Reveals (for grids like Catalog and FAQ)
        const batchItems = gsap.utils.toArray('.reveal-item, .reveal-init');
        if (batchItems.length > 0) {
            ScrollTrigger.batch(batchItems, {
                onEnter: batch => gsap.to(batch, {
                    autoAlpha: 1,
                    visibility: "visible",
                    y: 0,
                    duration: 1.2,
                    ease: "expo.out",
                    stagger: 0, // No stagger between items in a batch (makes them appear in rows)
                    overwrite: true
                }),
                start: "top 90%",
            });
        }
    };
    initGlobalReveals();

    // Immediate Load Animations (Smoother for top-of-page content)
    const loadItems = document.querySelectorAll('.animate-on-load');
    if (loadItems.length > 0) {
        gsap.to(loadItems, {
            autoAlpha: 1,
            y: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power3.out",
            delay: 0.1
        });
    }

    // 5. PAGE-SPECIFIC ANIMATIONS (WITH GUARDS)

    // --- Hero Parallax (Home, About, Testimonials) ---
    // Home/About Parallax
    const standardHeroImg = document.querySelector('.hero-bg-media img, .hero-bg');
    if (standardHeroImg) {
        gsap.to(standardHeroImg, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
                trigger: standardHeroImg.parentElement,
                scrub: true
            }
        });
    }

    // Testimonials Specific "Impact" Parallax (Zoom/Scale)
    const impactHero = document.getElementById('hero-parallax');
    if (impactHero) {
        gsap.to(impactHero, {
            y: 300,
            scale: 1.4,
            opacity: 0.1,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "bottom top",
                scrub: 1
            }
        });
    }

    // --- 3D Tilt Interaction (About Pillars) ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    if (tiltCards.length > 0) {
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 12;
                const rotateY = (centerX - x) / 12;

                gsap.to(card, {
                    rotateX: rotateX,
                    rotateY: rotateY,
                    scale: 1.02,
                    duration: 0.4,
                    ease: "power2.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotateX: 0,
                    rotateY: 0,
                    scale: 1,
                    duration: 1,
                    ease: "elastic.out(1, 0.6)"
                });
            });
        });
    }

    // --- Interactive Gold Glow Follower (Contact, FAQ, Testimonials) ---
    const glows = document.querySelectorAll('.gold-glow');
    if (glows.length > 0) {
        document.addEventListener('mousemove', (e) => {
            glows.forEach(glow => {
                const rect = glow.parentElement.getBoundingClientRect();
                const offsetX = glow.offsetWidth / 2;
                const offsetY = glow.offsetHeight / 2;
                const x = e.clientX - rect.left - offsetX;
                const y = e.clientY - rect.top - offsetY;

                gsap.to(glow, {
                    x: x,
                    y: y,
                    duration: 2.5,
                    ease: "power2.out"
                });
            });
        });
    }


    // --- Sidebar Active highlighter (Privacy) ---
    const legalSections = gsap.utils.toArray('.legal-section');
    const legalLinks = document.querySelectorAll('.nav-link[href^="#"]');
    if (legalSections.length > 0 && legalLinks.length > 0) {
        legalSections.forEach((section, i) => {
            ScrollTrigger.create({
                trigger: section,
                start: "top 50%",
                end: "bottom 50%",
                onToggle: self => {
                    if (self.isActive && legalLinks[i]) {
                        legalLinks.forEach(link => link.classList.remove('active'));
                        legalLinks[i].classList.add('active');
                    }
                }
            });
        });
    }


    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('backToTop');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                gsap.to(backToTopBtn, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" });
            } else {
                gsap.to(backToTopBtn, { scale: 0, opacity: 0, duration: 0.3, ease: "power2.in" });
            }
        });

        backToTopBtn.addEventListener('click', () => {
            if (window.lenis) {
                window.lenis.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }


    // --- EDITORIAL AUTO-SLIDER LOGIC ---
    const editorialSlides = document.querySelectorAll('.editorial-slide');
    const editorialLoader = document.getElementById('editorial-loader');
    const currentSlideNum = document.getElementById('current-slide-num');

    if (editorialSlides.length > 0 && editorialLoader) {
        let currentIdx = 0;
        const duration = 6; // 6 seconds for high-end feel

        const nextSlide = () => {
            // Remove active from current
            editorialSlides[currentIdx].classList.remove('active');

            // Move to next
            currentIdx = (currentIdx + 1) % editorialSlides.length;

            // Add active to next
            const activeSlide = editorialSlides[currentIdx];
            activeSlide.classList.add('active');

            // Update counter
            if (currentSlideNum) {
                currentSlideNum.innerText = activeSlide.dataset.index;
            }

            // Restart Loader
            startLoader();
        };

        const startLoader = () => {
            gsap.fromTo(editorialLoader,
                { width: "0%" },
                { width: "100%", duration: duration, ease: "none", onComplete: nextSlide }
            );
        };

        // Start the cycle
        startLoader();
    }

    // Make body visible after animations are ready (Anti-flash)
    gsap.set("body", { visibility: "visible", opacity: 1 });
});

// --- UI LOGIC (Non-GSAP but related to page behavior) ---

// FAQ Toggle Logic
function toggleFAQ(element) {
    const item = element.parentElement;
    if (!item) return;

    const isActive = item.classList.contains('active');

    // Close other items
    document.querySelectorAll('.faq-item').forEach(el => {
        if (el !== item) el.classList.remove('active');
    });

    // Toggle current
    item.classList.toggle('active');

    // Refresh GSAP ScrollTrigger since page height changed
    if (window.ScrollTrigger) {
        ScrollTrigger.refresh();
    }
}