/**
 * AMR SHAWKY — PORTFOLIO SCRIPT
 * High-performance, clean vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initHeroScene();
    initCardTilt();
    initScrollProgress();
    initNavbar();
    initBackToTop();
    initTypingEffect();
    initCounters();
    initProjectFilter();
    initProjectModal();
    initRevealAnimations();
    initContactForm();
    initFooterYear();
});

/* Ambient orbital network scene for the hero artwork */
function initHeroScene() {
    const canvas = document.getElementById('heroScene');
    const hero = document.getElementById('home');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !hero || !ctx) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const particles = [];
    let width = 0;
    let height = 0;
    let frameId = 0;
    let lastFrame = 0;
    let inView = true;
    let pageVisible = !document.hidden;
    let pointerTargetX = 0;
    let pointerTargetY = 0;
    let pointerX = 0;
    let pointerY = 0;
    const particleCount = window.innerWidth < 700 ? 20 : 38;

    function resize() {
        const bounds = hero.getBoundingClientRect();
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        width = bounds.width;
        height = bounds.height;
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        particles.length = 0;

        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: width * (0.43 + Math.random() * 0.55),
                y: height * (0.05 + Math.random() * 0.9),
                vx: (Math.random() - 0.5) * 0.12,
                vy: (Math.random() - 0.5) * 0.12,
                radius: 0.8 + Math.random() * 1.5,
                phase: Math.random() * Math.PI * 2,
                tone: Math.random() > 0.76 ? 'blue' : 'lime'
            });
        }
        draw(0);
    }

    function draw(time) {
        ctx.clearRect(0, 0, width, height);
        if (!width || !height) return;

        pointerX += (pointerTargetX - pointerX) * 0.035;
        pointerY += (pointerTargetY - pointerY) * 0.035;
        const centerX = width * (width < 700 ? 0.69 : 0.76) + pointerX * width * 0.018;
        const centerY = height * (width < 700 ? 0.32 : 0.48) + pointerY * height * 0.022;
        const orbitScale = Math.min(width, height);
        const motionTime = reduceMotion ? 0 : time * 0.00016;

        // Three glass-like orbital paths echo the generated architecture artwork.
        const orbits = [
            { x: orbitScale * 0.22, y: orbitScale * 0.085, rotation: -0.34, phase: 0.2 },
            { x: orbitScale * 0.17, y: orbitScale * 0.12, rotation: 0.62, phase: 2.1 },
            { x: orbitScale * 0.27, y: orbitScale * 0.045, rotation: -0.92, phase: 4.0 }
        ];

        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        orbits.forEach((orbit, index) => {
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(orbit.rotation + Math.sin(motionTime + index) * 0.035);
            ctx.beginPath();
            ctx.ellipse(0, 0, orbit.x, orbit.y, 0, 0, Math.PI * 2);
            ctx.strokeStyle = index === 1 ? 'rgba(183, 204, 255, 0.12)' : 'rgba(203, 241, 124, 0.13)';
            ctx.lineWidth = 0.8;
            ctx.stroke();

            const angle = motionTime * (index % 2 ? -1 : 1) + orbit.phase;
            const nodeX = Math.cos(angle) * orbit.x;
            const nodeY = Math.sin(angle) * orbit.y;
            ctx.beginPath();
            ctx.arc(nodeX, nodeY, 2.1, 0, Math.PI * 2);
            ctx.fillStyle = index === 1 ? 'rgba(166, 192, 255, 0.92)' : 'rgba(216, 248, 151, 0.95)';
            ctx.shadowColor = index === 1 ? 'rgba(116, 156, 255, 0.7)' : 'rgba(198, 237, 112, 0.75)';
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.restore();
        });

        // Fine connections and drifting nodes form a quiet, living system map.
        particles.forEach((particle, index) => {
            if (!reduceMotion) {
                particle.x += particle.vx;
                particle.y += particle.vy;
                if (particle.x < width * 0.4 || particle.x > width * 1.01) particle.vx *= -1;
                if (particle.y < 0 || particle.y > height) particle.vy *= -1;
            }

            for (let next = index + 1; next < particles.length; next++) {
                const other = particles[next];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 112) continue;
                const alpha = (1 - distance / 112) * 0.13;
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(other.x, other.y);
                ctx.strokeStyle = `rgba(190, 220, 155, ${alpha})`;
                ctx.lineWidth = 0.65;
                ctx.stroke();
            }

            const pulse = 0.55 + (Math.sin(time * 0.0012 + particle.phase) + 1) * 0.18;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = particle.tone === 'blue'
                ? `rgba(157, 185, 255, ${pulse * 0.6})`
                : `rgba(210, 241, 153, ${pulse * 0.52})`;
            ctx.fill();
        });
        ctx.restore();
    }

    function animate(time) {
        frameId = 0;
        if (reduceMotion || !inView || !pageVisible) return;
        if (time - lastFrame >= 32) {
            draw(time);
            lastFrame = time;
        }
        frameId = requestAnimationFrame(animate);
    }

    function syncAnimation() {
        if (reduceMotion || !inView || !pageVisible) {
            if (frameId) cancelAnimationFrame(frameId);
            frameId = 0;
            return;
        }
        if (!frameId) frameId = requestAnimationFrame(animate);
    }

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            inView = entries[0].isIntersecting;
            syncAnimation();
        }, { threshold: 0.01 });
        observer.observe(hero);
    }
    document.addEventListener('visibilitychange', () => {
        pageVisible = !document.hidden;
        syncAnimation();
    });
    if (!reduceMotion) {
        hero.addEventListener('pointermove', event => {
            if (event.pointerType === 'touch') return;
            const bounds = hero.getBoundingClientRect();
            pointerTargetX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
            pointerTargetY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        }, { passive: true });
        hero.addEventListener('pointerleave', () => {
            pointerTargetX = 0;
            pointerTargetY = 0;
        }, { passive: true });
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();
    syncAnimation();
}

function initCardTilt() {
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!finePointer || reduceMotion) return;

    document.querySelectorAll('.showcase-card').forEach(card => {
        let pendingFrame = 0;
        card.addEventListener('pointermove', event => {
            if (pendingFrame) cancelAnimationFrame(pendingFrame);
            pendingFrame = requestAnimationFrame(() => {
                const bounds = card.getBoundingClientRect();
                const x = (event.clientX - bounds.left) / bounds.width - 0.5;
                const y = (event.clientY - bounds.top) / bounds.height - 0.5;
                card.style.setProperty('--card-tilt-x', `${(x * 3).toFixed(2)}deg`);
                card.style.setProperty('--card-tilt-y', `${(y * -3).toFixed(2)}deg`);
                pendingFrame = 0;
            });
        }, { passive: true });

        card.addEventListener('pointerleave', () => {
            if (pendingFrame) cancelAnimationFrame(pendingFrame);
            pendingFrame = 0;
            card.style.setProperty('--card-tilt-x', '0deg');
            card.style.setProperty('--card-tilt-y', '0deg');
        }, { passive: true });
    });
}

/* ============================================
   1. PRELOADER
   ============================================ */
function initPreloader() {
    const preloader = document.getElementById('preloader');
    const bar = document.getElementById('preloaderBar');
    if (!preloader || !bar) return;

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 20) + 10;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            bar.style.width = '100%';
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
            }, 300);
        } else {
            bar.style.width = progress + '%';
        }
    }, 80);

    document.body.style.overflow = 'hidden';
}

/* ============================================
   2. SCROLL PROGRESS
   ============================================ */
function initScrollProgress() {
    const progressEl = document.getElementById('scrollProgress');
    if (!progressEl) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const factor = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
        progressEl.style.transform = `scaleX(${factor})`;
    }, { passive: true });
}

/* ============================================
   3. NAVBAR & MOBILE MENU
   ============================================ */
function initNavbar() {
    const navbar = document.getElementById('mainNavbar');
    const toggleBtn = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-item-link');
    const sections = document.querySelectorAll('section[id]');

    // Scroll styling
    window.addEventListener('scroll', () => {
        if (navbar) {
            if (window.scrollY > 40) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }

        // Active link tracking
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active-link');
            }
        });
    }, { passive: true });

    // Mobile menu toggle
    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('open')) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });

        // Close when clicking link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = toggleBtn.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }
}

/* ============================================
   4. BACK TO TOP
   ============================================ */
function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 450) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    }, { passive: true });

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

/* ============================================
   5. TYPING EFFECT
   ============================================ */
function initTypingEffect() {
    const target = document.getElementById('typingOutput');
    if (!target) return;

    const phrases = [
        'Clean Architecture & CQRS Specialist',
        'Distributed Microservices & MassTransit',
        'Backend (.NET) Mentor at Elevate Tech',
        'Ranked #6 LinkedIn Tech Creator in Egypt 🇪🇬',
        'High-Throughput Redis & SQL Optimization'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let currentSpeed = 90;

    function tick() {
        const fullPhrase = phrases[phraseIndex];

        if (isDeleting) {
            target.textContent = fullPhrase.substring(0, charIndex - 1);
            charIndex--;
            currentSpeed = 40;
        } else {
            target.textContent = fullPhrase.substring(0, charIndex + 1);
            charIndex++;
            currentSpeed = 90;
        }

        if (!isDeleting && charIndex === fullPhrase.length) {
            isDeleting = true;
            currentSpeed = 2200; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            currentSpeed = 400; // Pause before typing new
        }

        setTimeout(tick, currentSpeed);
    }

    tick();
}

/* ============================================
   6. COUNTER ANIMATION
   ============================================ */
function initCounters() {
    const statsContainer = document.getElementById('statsCounterStrip');
    if (!statsContainer) return;

    const counters = statsContainer.querySelectorAll('.counter-val-large');
    let hasAnimated = false;

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'), 10);
                    const duration = 1600;
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    let frame = 0;

                    const timer = setInterval(() => {
                        frame++;
                        const progress = frame / totalFrames;
                        // Ease out cubic
                        const easeOut = 1 - Math.pow(1 - progress, 3);
                        const current = Math.floor(easeOut * target);

                        counter.textContent = current + (current >= 10 ? '+' : '+');

                        if (frame >= totalFrames) {
                            counter.textContent = target + '+';
                            clearInterval(timer);
                        }
                    }, frameDuration);
                });
            }
        });
    }, { threshold: 0.3 });

    observer.observe(statsContainer);
}

/* ============================================
   7. PROJECT FILTER
   ============================================ */
function initProjectFilter() {
    const filterTabs = document.querySelectorAll('.filter-button-tab');
    const projectCards = document.querySelectorAll('.showcase-card');

    if (!filterTabs.length || !projectCards.length) return;

    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const filterValue = this.getAttribute('data-filter');

            // Active tab state
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');

            // Filter cards
            projectCards.forEach(card => {
                const categoryAttr = card.getAttribute('data-category') || '';
                const categories = categoryAttr.split(' ');

                if (filterValue === 'all' || categories.includes(filterValue)) {
                    card.classList.remove('hidden-project');
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    requestAnimationFrame(() => {
                        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    });
                } else {
                    card.classList.add('hidden-project');
                }
            });
        });
    });
}

/* ============================================
   8. PROJECT MODAL
   ============================================ */
function initProjectModal() {
    const overlay = document.getElementById('projectModalOverlay');
    const dialog = document.getElementById('projectModalDialog');
    const closeBtn = document.getElementById('modalCloseBtn');
    const bodyContainer = document.getElementById('modalDynamicBody');

    if (!overlay || !dialog || !bodyContainer) return;

    let previousOverflow = '';
    let lastFocusedElement = null;

    function openModal(projectId) {
        const data = window.projectsData?.[projectId];
        if (!data || !Array.isArray(data.technologies) || !Array.isArray(data.features)) return;

        const isLive = data.isLive || false;
        const actionBtnLabel = isLive ? 'Visit Live Portal' : 'View Source Code';
        const actionBtnIcon = isLive ? 'fas fa-globe' : 'fab fa-github';

        const techHtml = data.technologies.map(t => 
            `<span class="modal-tech-pill">${t}</span>`
        ).join('');

        const featuresHtml = data.features.map(f => 
            `<li><i class="fas fa-check-circle"></i><span>${f}</span></li>`
        ).join('');

        bodyContainer.innerHTML = `
            <div class="modal-banner-holder">
                <img src="${data.image}" alt="${data.title}">
                <div class="modal-banner-gradient"></div>
                <div class="modal-banner-titlebox">
                    <h1 id="modalProjectTitle">${data.title}</h1>
                    <p>${data.subtitle}</p>
                </div>
            </div>
            <div class="modal-content-area">
                <p class="modal-long-desc">${data.description}</p>
                
                <h3 class="modal-section-title"><i class="fas fa-microchip"></i> Architectural Breakdown</h3>
                <p class="modal-long-desc">${data.details}</p>

                <h3 class="modal-section-title"><i class="fas fa-cubes"></i> Technologies & Patterns</h3>
                <div class="modal-tech-tags-grid">${techHtml}</div>

                <h3 class="modal-section-title"><i class="fas fa-check-double"></i> Core Capabilities</h3>
                <ul class="modal-features-list">${featuresHtml}</ul>

                <div class="modal-footer-actions">
                    <a href="${data.github}" target="_blank" rel="noopener" class="btn-modern btn-modern-primary">
                        <i class="${actionBtnIcon}"></i> ${actionBtnLabel}
                    </a>
                    <button type="button" class="btn-modern btn-modern-secondary" id="modalInnerCloseBtn">
                        Close
                    </button>
                </div>
            </div>
        `;

        lastFocusedElement = document.activeElement;
        previousOverflow = document.body.style.overflow;
        overlay.setAttribute('aria-hidden', 'false');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        dialog.scrollTop = 0;
        closeBtn?.focus();

        // Inner close button
        const innerClose = document.getElementById('modalInnerCloseBtn');
        if (innerClose) {
            innerClose.addEventListener('click', closeModal);
        }
    }

    function closeModal() {
        if (!overlay.classList.contains('active')) return;
        overlay.classList.remove('active');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = previousOverflow;
        lastFocusedElement?.focus();
    }

    // Card click triggers
    document.addEventListener('click', e => {
        const trigger = e.target.closest('.view-project-btn, .showcase-card[data-project]');
        if (trigger) {
            // If clicking direct github external link, don't open modal
            if (e.target.closest('a[href^="http"]')) return;
            
            const projectId = trigger.getAttribute('data-project');
            if (projectId) {
                openModal(projectId);
            }
        }
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Backdrop click
    overlay.addEventListener('click', e => {
        if (e.target === overlay) {
            closeModal();
        }
    });

    // Escape key
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeModal();
        }
    });
}

/* ============================================
   9. SCROLL REVEAL MOTION
   ============================================ */
function initRevealAnimations() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targets = document.querySelectorAll(
        '.section-header-block, .bento-box, .matrix-category-card, .showcase-card, .journey-node, .counter-column, .contact-channel-card, .contact-form-box'
    );

    if (reduceMotion || !('IntersectionObserver' in window)) return;

    document.documentElement.classList.add('motion-ready');
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('motion-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -36px 0px' });

    targets.forEach((target, index) => {
        target.style.setProperty('--motion-delay', `${Math.min(index % 4, 3) * 70}ms`);
        observer.observe(target);
    });
}

/* ============================================
   9. CONTACT FORM
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const nameInput = document.getElementById('formName');
    const emailInput = document.getElementById('formEmail');
    const messageInput = document.getElementById('formMessage');
    const nameErr = document.getElementById('nameError');
    const emailErr = document.getElementById('emailError');
    const messageErr = document.getElementById('messageError');

    const submitBtn = document.getElementById('formSubmitBtn');
    const btnLabel = document.getElementById('btnLabel');
    const btnSpinner = document.getElementById('btnSpinner');

    function validate() {
        let isValid = true;

        // Name
        if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
            nameInput.classList.add('input-error');
            nameInput.classList.remove('input-success');
            if (nameErr) nameErr.textContent = 'Please enter your name (at least 2 characters).';
            isValid = false;
        } else {
            nameInput.classList.remove('input-error');
            nameInput.classList.add('input-success');
            if (nameErr) nameErr.textContent = '';
        }

        // Email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value.trim())) {
            emailInput.classList.add('input-error');
            emailInput.classList.remove('input-success');
            if (emailErr) emailErr.textContent = 'Please enter a valid email address.';
            isValid = false;
        } else {
            emailInput.classList.remove('input-error');
            emailInput.classList.add('input-success');
            if (emailErr) emailErr.textContent = '';
        }

        // Message
        if (!messageInput.value.trim() || messageInput.value.trim().length < 8) {
            messageInput.classList.add('input-error');
            messageInput.classList.remove('input-success');
            if (messageErr) messageErr.textContent = 'Please enter a message (at least 8 characters).';
            isValid = false;
        } else {
            messageInput.classList.remove('input-error');
            messageInput.classList.add('input-success');
            if (messageErr) messageErr.textContent = '';
        }

        return isValid;
    }

    form.addEventListener('submit', e => {
        e.preventDefault();

        if (!validate()) return;

        // Simulate sending
        if (submitBtn) submitBtn.disabled = true;
        if (btnLabel) btnLabel.style.display = 'none';
        if (btnSpinner) btnSpinner.style.display = 'inline-block';

        setTimeout(() => {
            form.reset();
            [nameInput, emailInput, messageInput].forEach(input => {
                if (input) input.classList.remove('input-success', 'input-error');
            });

            if (submitBtn) submitBtn.disabled = false;
            if (btnLabel) btnLabel.style.display = 'inline-block';
            if (btnSpinner) btnSpinner.style.display = 'none';

            showToast();
        }, 1200);
    });

    // Real-time input clearing on type
    [nameInput, emailInput, messageInput].forEach(inp => {
        if (inp) {
            inp.addEventListener('input', () => {
                inp.classList.remove('input-error');
            });
        }
    });
}

/* ============================================
   10. TOAST NOTIFICATION
   ============================================ */
function showToast() {
    const toast = document.getElementById('toastNotification');
    const closeBtn = document.getElementById('toastCloseBtn');
    if (!toast) return;

    toast.classList.add('show');

    const hideTimer = setTimeout(() => {
        toast.classList.remove('show');
    }, 4500);

    if (closeBtn) {
        closeBtn.onclick = () => {
            clearTimeout(hideTimer);
            toast.classList.remove('show');
        };
    }
}

/* ============================================
   11. FOOTER YEAR
   ============================================ */
function initFooterYear() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
}
