/**
 * SPATIAL ANIMATIONS — APEX CONSULTANCY
 * Handles: Scroll Reveal, Magnetic Buttons, Cursor, Scroll Progress,
 *          Non-Sync Float, Counter, Aurora Injection, Header Glass
 */
(function () {
    'use strict';

    /* ─── 1. AURORA INJECTION ──────────────────────────────────── */
    if (!document.querySelector('.aurora-container')) {
        const el = document.createElement('div');
        el.className = 'aurora-container';
        el.innerHTML = `
            <div class="aurora-glow aurora-purple"></div>
            <div class="aurora-glow aurora-blue"></div>
            <div class="aurora-glow aurora-cyan"></div>`;
        document.body.prepend(el);
    }

    /* ─── 2. SCROLL PROGRESS BAR ───────────────────────────────── */
    const bar = document.createElement('div');
    bar.id = 'scroll-progress-bar';
    document.body.prepend(bar);

    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = ((scrolled / total) * 100).toFixed(2) + '%';
    }, { passive: true });

    /* ─── 3. CUSTOM CURSOR ─────────────────────────────────────── */
    const dot  = document.createElement('div'); dot.id  = 'cursor-dot';
    const ring = document.createElement('div'); ring.id = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    document.addEventListener('mousemove', (e) => {
        dot.style.left  = e.clientX + 'px';
        dot.style.top   = e.clientY + 'px';
        ring.style.left = e.clientX + 'px';
        ring.style.top  = e.clientY + 'px';
    }, { passive: true });

    /* ─── 4. HEADER GLASS ON SCROLL ───────────────────────────── */
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 60);
        }, { passive: true });
    }

    /* ─── 5. SCROLL REVEAL (Intersection Observer) ─────────────── */
    const revealSel = [
        '.section-header', '.stat-box', '.service-card',
        '.course-card', '.testimonial-card', '.step',
        '.gallery-item', '.gallery-category', '.chairman-profile',
        '.goal-content', '.consultation-content', '.promo-banner',
        '.faq-item', '.accordion-item', '.feature-card',
        '.chairman-badge', '.page-header .page-title',
        '[class*="info-card"]', '[class*="cost-card"]',
        '[class*="requirement"]', '[class*="timeline"]'
    ].join(', ');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                // Small stagger for siblings
                const siblings = entry.target.parentElement
                    ? Array.from(entry.target.parentElement.children) : [];
                const idx = siblings.indexOf(entry.target);
                const delay = idx * 80; // 80ms per sibling
                setTimeout(() => {
                    entry.target.classList.add('is-revealed');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll(revealSel).forEach(el => {
        el.classList.add('anim-reveal');
        observer.observe(el);
    });

    /* ─── 6. CHAIRMAN: LEFT / RIGHT REVEAL ────────────────────── */
    const chairImg = document.querySelector('.chairman-image');
    const chairContent = document.querySelector('.chairman-content');
    if (chairImg) {
        chairImg.classList.add('anim-reveal-left');
        new IntersectionObserver((e) => {
            if (e[0].isIntersecting) {
                e[0].target.classList.add('is-revealed');
            }
        }, { threshold: 0.2 }).observe(chairImg);
    }
    if (chairContent) {
        chairContent.classList.add('anim-reveal-right');
        new IntersectionObserver((e) => {
            if (e[0].isIntersecting) {
                e[0].target.classList.add('is-revealed');
            }
        }, { threshold: 0.2 }).observe(chairContent);
    }

    /* ─── 7. ANIMATED COUNTERS ─────────────────────────────────── */
    const counterObs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.getAttribute('data-target') || '0', 10);
            if (!target) return;
            const duration = 2000;
            const start = performance.now();
            const tick = (now) => {
                const progress = Math.min((now - start) / duration, 1);
                // Ease out cubic
                const eased = 1 - Math.pow(1 - progress, 3);
                el.textContent = Math.floor(eased * target).toLocaleString();
                if (progress < 1) requestAnimationFrame(tick);
                else el.textContent = target.toLocaleString();
            };
            requestAnimationFrame(tick);
            counterObs.unobserve(el);
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number[data-target]').forEach(el => {
        counterObs.observe(el);
    });

    /* ─── 8. NON-SYNC FLOAT ────────────────────────────────────── */
    document.querySelectorAll('.service-card, .course-card, .stat-box').forEach(el => {
        const dur = (Math.random() * 3.5 + 4.5).toFixed(2);
        el.style.setProperty('--float-duration', dur + 's');
        // Only add float class once reveal is complete to avoid conflict
        el.addEventListener('transitionend', () => {
            if (el.classList.contains('is-revealed')) {
                el.classList.add('spatial-float');
            }
        }, { once: true });
    });

    /* ─── 9. MAGNETIC BUTTONS ──────────────────────────────────── */
    document.querySelectorAll('.btn, .nav-cta, .btn-enroll').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = (e.clientX - r.left - r.width  / 2) * 0.18;
            const y = (e.clientY - r.top  - r.height / 2) * 0.18;
            btn.style.transform = `translate(${x}px, ${y}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0,0)';
        });
    });

    /* ─── 10. GALLERY FILTER (keep existing logic, add transitions) */
    // If filterGallery is globally defined, wrap it for smooth transitions
    if (typeof window.filterGallery === 'function') {
        const orig = window.filterGallery;
        window.filterGallery = function (cat) {
            document.querySelectorAll('.gallery-category').forEach(c => {
                c.style.opacity = '0';
                c.style.transform = 'scale(0.95) translateY(20px)';
                c.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            });
            setTimeout(() => {
                orig(cat);
                document.querySelectorAll('.gallery-category').forEach((c, i) => {
                    if (c.style.display !== 'none') {
                        setTimeout(() => {
                            c.style.opacity = '1';
                            c.style.transform = 'scale(1) translateY(0)';
                        }, i * 80);
                    }
                });
            }, 300);
        };
    }

    /* ─── 11. STAGGER GRIDS ────────────────────────────────────── */
    document.querySelectorAll(
        '.services-grid, .courses-grid, .stats-grid, .testimonials-grid'
    ).forEach(grid => grid.classList.add('anim-stagger'));

})();
