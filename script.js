/**
 * AMR SHAWKY — PORTFOLIO SCRIPT
 * High-performance, clean vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initScrollProgress();
    initNavbar();
    initBackToTop();
    initTypingEffect();
    initCounters();
    initProjectFilter();
    initProjectModal();
    initContactForm();
    initFooterYear();
});

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

    function openModal(projectId) {
        const data = window.projectsData ? window.projectsData[projectId] : null;
        if (!data) return;

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
                    <h1>${data.title}</h1>
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

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Inner close button
        const innerClose = document.getElementById('modalInnerCloseBtn');
        if (innerClose) {
            innerClose.addEventListener('click', closeModal);
        }
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Card click triggers
    document.addEventListener('click', e => {
        const trigger = e.target.closest('[data-project]');
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
