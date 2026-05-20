// ============================================
// PRELOADER
// ============================================
(function initPreloader() {
    const preloader = document.getElementById('preloader');
    const preloaderBar = document.getElementById('preloaderBar');
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.classList.add('hidden');
                document.body.style.overflow = '';
                initAllAnimations();
            }, 400);
        }
        preloaderBar.style.width = progress + '%';
    }, 120);
    document.body.style.overflow = 'hidden';
})();

// ============================================
// INIT ALL ANIMATIONS AFTER PRELOADER
// ============================================
function initAllAnimations() {
    initParticleCanvas();
    initCursor();
    initMobileMenu();
    initScrollProgress();
    initNavbar();
    initThemeToggle();
    initTypingEffect();
    initScrollAnimations();
    initTimelineAnimation();
    initMagneticEffect();
    initTiltCards();
    initSmoothScroll();
    initParallax();
    initProjectFilter();
    initTestimonialCarousel();
    initContactForm();
}

// ============================================
// INTERACTIVE PARTICLE CANVAS
// ============================================
function initParticleCanvas() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    var particles = [];
    var mouse = { x: null, y: null, radius: 150 };
    var PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;
    var CONNECTION_DISTANCE = 120;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    document.addEventListener('mouseleave', function() {
        mouse.x = null;
        mouse.y = null;
    });

    function Particle() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.speedY = (Math.random() - 0.5) * 0.8;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    Particle.prototype.update = function() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
        if (mouse.x !== null && mouse.y !== null) {
            var dx = mouse.x - this.x;
            var dy = mouse.y - this.y;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouse.radius) {
                var force = (mouse.radius - dist) / mouse.radius;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }
        }
    };

    Particle.prototype.draw = function() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(168, 85, 247, ' + this.opacity + ')';
        ctx.fill();
    };

    for (var i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (var a = 0; a < particles.length; a++) {
            for (var b = a + 1; b < particles.length; b++) {
                var dx = particles[a].x - particles[b].x;
                var dy = particles[a].y - particles[b].y;
                var dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECTION_DISTANCE) {
                    var opacity = (1 - dist / CONNECTION_DISTANCE) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(168, 85, 247, ' + opacity + ')';
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[a].x, particles[a].y);
                    ctx.lineTo(particles[b].x, particles[b].y);
                    ctx.stroke();
                }
            }
        }
        if (mouse.x !== null && mouse.y !== null) {
            for (var j = 0; j < particles.length; j++) {
                var mdx = mouse.x - particles[j].x;
                var mdy = mouse.y - particles[j].y;
                var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < mouse.radius) {
                    var mopacity = (1 - mdist / mouse.radius) * 0.3;
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(236, 72, 153, ' + mopacity + ')';
                    ctx.lineWidth = 0.8;
                    ctx.moveTo(particles[j].x, particles[j].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(function(p) {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
}

// ============================================
// CUSTOM CURSOR
// ============================================
function initCursor() {
    var cursor = document.getElementById('cursor');
    var cursorDot = document.getElementById('cursorDot');
    if (window.innerWidth <= 768) {
        if (cursor) cursor.style.display = 'none';
        if (cursorDot) cursorDot.style.display = 'none';
        return;
    }

    document.addEventListener('mousemove', function(e) {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursorDot.style.left = e.clientX - 3 + 'px';
        cursorDot.style.top = e.clientY - 3 + 'px';
    });

    var interactiveElements = document.querySelectorAll('a, button, .tech-badge, .magnetic, input, textarea');
    interactiveElements.forEach(function(el) {
        el.addEventListener('mouseenter', function() { cursor.classList.add('hover'); });
        el.addEventListener('mouseleave', function() { cursor.classList.remove('hover'); });
    });
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    var menuBtn = document.getElementById('menu-btn');
    var navbar = document.getElementById('navbar-default');
    if (!menuBtn || !navbar) return;

    menuBtn.addEventListener('click', function() {
        navbar.classList.toggle('hidden');
    });

    document.querySelectorAll('nav a').forEach(function(link) {
        link.addEventListener('click', function() {
            if (!navbar.classList.contains('hidden')) {
                navbar.classList.add('hidden');
            }
        });
    });
}

// ============================================
// SCROLL PROGRESS AND BACK TO TOP
// ============================================
function initScrollProgress() {
    var scrollProgress = document.getElementById('scrollProgress');
    var backToTop = document.getElementById('backToTop');
    var progressRing = document.getElementById('progressRing');
    var circumference = 2 * Math.PI * 16;

    window.addEventListener('scroll', function() {
        var scrollTop = document.documentElement.scrollTop;
        var scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var progress = scrollHeight > 0 ? scrollTop / scrollHeight : 0;

        if (scrollProgress) {
            scrollProgress.style.transform = 'scaleX(' + progress + ')';
        }

        if (backToTop) {
            if (scrollTop > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        if (progressRing) {
            var offset = circumference - (progress * circumference);
            progressRing.style.strokeDashoffset = offset;
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

// ============================================
// NAVBAR SCROLL EFFECT AND ACTIVE LINK
// ============================================
function initNavbar() {
    var navbarEl = document.getElementById('navbar');
    var navLinks = document.querySelectorAll('.nav-link');
    var sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', function() {
        if (navbarEl) {
            if (window.scrollY > 50) {
                navbarEl.classList.add('scrolled');
            } else {
                navbarEl.classList.remove('scrolled');
            }
        }

        var current = '';
        sections.forEach(function(section) {
            var sectionTop = section.offsetTop - 100;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(function(link) {
            link.classList.remove('active-link');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active-link');
            }
        });
    });
}

// ============================================
// THEME TOGGLE
// ============================================
function initThemeToggle() {
    var toggle = document.getElementById('themeToggle');
    var icon = document.getElementById('themeIcon');
    if (!toggle || !icon) return;

    var savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    icon.className = savedTheme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';

    toggle.addEventListener('click', function() {
        var current = document.documentElement.getAttribute('data-theme');
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);
        icon.className = next === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    });
}

// ============================================
// TYPING EFFECT
// ============================================
function initTypingEffect() {
    var texts = [
        'Building scalable .NET solutions...',
        'Clean Architecture enthusiast...',
        'Microservices & CQRS expert...',
        'Technical Content Creator...',
        'Mentoring developers...'
    ];

    var typingText = document.getElementById('typingText');
    if (!typingText) return;
    var textIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 100;

    function type() {
        var currentText = texts[textIndex];
        if (isDeleting) {
            typingText.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingText.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            typingSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            typingSpeed = 500;
        }
        setTimeout(type, typingSpeed);
    }
    type();
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function initScrollAnimations() {
    var observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var delay = entry.target.getAttribute('data-delay') || 0;
                setTimeout(function() {
                    entry.target.classList.add('animated');
                }, parseInt(delay));

                if (entry.target.closest('#statsGrid')) {
                    animateCounters();
                }

                if (entry.target.id === 'skillBars' || entry.target.closest('#skillBars')) {
                    animateSkillBars();
                }
            }
        });
    }, observerOptions);

    var animatedElements = document.querySelectorAll(
        '.reveal-up, .reveal-scale, .reveal-left, .reveal-right, .reveal-rotate, ' +
        '.section-title, .stagger-container, .skill-bar-item'
    );
    animatedElements.forEach(function(el) { observer.observe(el); });
}

// ============================================
// COUNTER ANIMATION
// ============================================
var countersAnimated = false;
function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    document.querySelectorAll('.counter-number').forEach(function(counter) {
        var target = parseInt(counter.getAttribute('data-target'));
        var duration = 2000;
        var step = target / (duration / 16);
        var current = 0;

        function updateCounter() {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + (target >= 100 ? '+' : '');
            }
        }
        updateCounter();
    });
}

// ============================================
// SKILL BAR ANIMATION
// ============================================
var skillBarsAnimated = false;
function animateSkillBars() {
    if (skillBarsAnimated) return;
    skillBarsAnimated = true;

    var bars = document.querySelectorAll('.skill-bar-item');
    bars.forEach(function(bar, index) {
        setTimeout(function() {
            bar.classList.add('animated');
            var fill = bar.querySelector('.skill-progress-fill');
            var percent = bar.querySelector('.skill-percent');
            if (fill) {
                var width = fill.getAttribute('data-width');
                fill.style.width = width + '%';
            }
            if (percent) {
                var target = parseInt(percent.getAttribute('data-target'));
                animatePercent(percent, target);
            }
        }, index * 150);
    });
}

function animatePercent(el, target) {
    var current = 0;
    var step = target / 30;
    var interval = setInterval(function() {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(interval);
        }
        el.textContent = Math.floor(current) + '%';
    }, 50);
}

// ============================================
// TIMELINE ANIMATION
// ============================================
function initTimelineAnimation() {
    var timelineObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                var dot = entry.target.querySelector('.timeline-dot');
                if (dot) dot.classList.add('pulse');
                entry.target.classList.add('animated');
            }
        });
    }, { threshold: 0.3 });

    document.querySelectorAll('.timeline-item').forEach(function(item) {
        timelineObserver.observe(item);
    });
}

// ============================================
// MAGNETIC EFFECT
// ============================================
function initMagneticEffect() {
    if (window.innerWidth <= 768) return;
    document.querySelectorAll('.magnetic').forEach(function(el) {
        el.addEventListener('mousemove', function(e) {
            var rect = el.getBoundingClientRect();
            var x = e.clientX - rect.left - rect.width / 2;
            var y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = 'translate(' + (x * 0.1) + 'px, ' + (y * 0.1) + 'px)';
        });

        el.addEventListener('mouseleave', function() {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// ============================================
// 3D TILT CARDS
// ============================================
function initTiltCards() {
    if (window.innerWidth <= 768) return;
    document.querySelectorAll('.tilt-card').forEach(function(card) {
        card.addEventListener('mousemove', function(e) {
            var rect = card.getBoundingClientRect();
            var x = e.clientX - rect.left;
            var y = e.clientY - rect.top;
            var centerX = rect.width / 2;
            var centerY = rect.height / 2;
            var rotateX = (y - centerY) / 15;
            var rotateY = (centerX - x) / 15;
            card.style.transform = 'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
        });
    });
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                var headerOffset = 80;
                var elementPosition = target.getBoundingClientRect().top;
                var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
            }
        });
    });
}

// ============================================
// PARALLAX EFFECT
// ============================================
function initParallax() {
    window.addEventListener('scroll', function() {
        var scrolled = window.pageYOffset;

        document.querySelectorAll('.parallax-layer').forEach(function(layer) {
            var speed = parseFloat(layer.getAttribute('data-speed')) || 0.3;
            layer.style.transform = 'translateY(' + (scrolled * speed * -0.5) + 'px)';
        });

        var heroContent = document.querySelector('#home .container');
        if (heroContent && scrolled < 800) {
            heroContent.style.transform = 'translateY(' + (scrolled * 0.2) + 'px)';
            heroContent.style.opacity = Math.max(0, 1 - scrolled / 700);
        }
    });
}

// ============================================
// PROJECT FILTER
// ============================================
function initProjectFilter() {
    var filterBtns = document.querySelectorAll('.filter-btn');
    var projectItems = document.querySelectorAll('.project-item');
    var projectsGrid = document.getElementById('projectsGrid');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var filter = this.getAttribute('data-filter');

            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');

            projectItems.forEach(function(item) {
                var category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.classList.remove('hidden-project');
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(function() {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(function() {
                        item.classList.add('hidden-project');
                    }, 400);
                }
            });
        });
    });
}

// ============================================
// TESTIMONIAL CAROUSEL
// ============================================
function initTestimonialCarousel() {
    var track = document.getElementById('testimonialTrack');
    var dots = document.querySelectorAll('.testimonial-dot');
    var prevBtn = document.getElementById('prevTestimonial');
    var nextBtn = document.getElementById('nextTestimonial');
    if (!track) return;

    var currentSlide = 0;
    var totalSlides = document.querySelectorAll('.testimonial-slide').length;
    var autoPlayInterval;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;
        track.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        dots.forEach(function(dot) { dot.classList.remove('active'); });
        if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(function() {
            goToSlide(currentSlide + 1);
        }, 5000);
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            stopAutoPlay();
            goToSlide(currentSlide - 1);
            startAutoPlay();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            stopAutoPlay();
            goToSlide(currentSlide + 1);
            startAutoPlay();
        });
    }

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            stopAutoPlay();
            goToSlide(parseInt(this.getAttribute('data-index')));
            startAutoPlay();
        });
    });

    // Touch/swipe support
    var startX = 0;
    var endX = 0;
    var carousel = document.getElementById('testimonialCarousel');
    if (carousel) {
        carousel.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        }, { passive: true });

        carousel.addEventListener('touchend', function(e) {
            endX = e.changedTouches[0].clientX;
            var diff = startX - endX;
            if (Math.abs(diff) > 50) {
                stopAutoPlay();
                if (diff > 0) {
                    goToSlide(currentSlide + 1);
                } else {
                    goToSlide(currentSlide - 1);
                }
                startAutoPlay();
            }
        }, { passive: true });
    }

    startAutoPlay();
}

// ============================================
// CONTACT FORM WITH VALIDATION
// ============================================
function initContactForm() {
    var form = document.getElementById('contactForm');
    if (!form) return;

    var nameInput = document.getElementById('name');
    var emailInput = document.getElementById('email');
    var messageInput = document.getElementById('message');
    var nameError = document.getElementById('nameError');
    var emailError = document.getElementById('emailError');
    var messageError = document.getElementById('messageError');
    var submitBtn = document.getElementById('submitBtn');
    var submitText = document.getElementById('submitText');
    var submitLoading = document.getElementById('submitLoading');

    function validateField(input, errorEl, rules) {
        var value = input.value.trim();
        var error = '';

        if (rules.required && !value) {
            error = 'This field is required';
        } else if (rules.email && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            error = 'Please enter a valid email';
        } else if (rules.minLength && value.length < rules.minLength) {
            error = 'Minimum ' + rules.minLength + ' characters required';
        }

        if (error) {
            input.classList.add('error');
            input.classList.remove('success');
            if (errorEl) errorEl.textContent = error;
            return false;
        } else {
            input.classList.remove('error');
            if (value) input.classList.add('success');
            if (errorEl) errorEl.textContent = '';
            return true;
        }
    }

    // Real-time validation
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateField(nameInput, nameError, { required: true, minLength: 2 });
        });
        nameInput.addEventListener('input', function() {
            if (nameInput.classList.contains('error')) {
                validateField(nameInput, nameError, { required: true, minLength: 2 });
            }
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateField(emailInput, emailError, { required: true, email: true });
        });
        emailInput.addEventListener('input', function() {
            if (emailInput.classList.contains('error')) {
                validateField(emailInput, emailError, { required: true, email: true });
            }
        });
    }

    if (messageInput) {
        messageInput.addEventListener('blur', function() {
            validateField(messageInput, messageError, { required: true, minLength: 10 });
        });
        messageInput.addEventListener('input', function() {
            if (messageInput.classList.contains('error')) {
                validateField(messageInput, messageError, { required: true, minLength: 10 });
            }
        });
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        var isNameValid = validateField(nameInput, nameError, { required: true, minLength: 2 });
        var isEmailValid = validateField(emailInput, emailError, { required: true, email: true });
        var isMessageValid = validateField(messageInput, messageError, { required: true, minLength: 10 });

        if (isNameValid && isEmailValid && isMessageValid) {
            submitText.classList.add('hidden');
            submitLoading.classList.remove('hidden');
            submitBtn.disabled = true;

            setTimeout(function() {
                submitText.classList.remove('hidden');
                submitLoading.classList.add('hidden');
                submitBtn.disabled = false;
                form.reset();
                document.querySelectorAll('.floating-input').forEach(function(input) {
                    input.classList.remove('success', 'error');
                });
                showToast();
            }, 2000);
        }
    });
}

// ============================================
// TOAST NOTIFICATION
// ============================================
function showToast() {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.classList.add('show');
    setTimeout(function() {
        hideToast();
    }, 4000);
}

function hideToast() {
    var toast = document.getElementById('toast');
    if (toast) toast.classList.remove('show');
}

// Make hideToast globally accessible for onclick
window.hideToast = hideToast;