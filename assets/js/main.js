// Main JavaScript for the portfolio website
class PortfolioApp {
    constructor() {
        this.isScrolling = false;
        this.lastScrollTop = 0;
        this.scrollTimeout = null;
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDarkMode();
        this.setupAnimations();
        this.setupTypewriter();
        this.setupStats();
        this.setupScrollEffects();
        this.setupParallax();
        this.setupCursorEffects();
        this.setupLoadingAnimations();
        this.setupPerformanceOptimizations();
    }

    // Enhanced Navigation functionality
    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');
        const header = document.querySelector('.header');

        // Mobile menu toggle with smooth animation
        if (navToggle) {
            navToggle.addEventListener('click', (e) => {
                e.preventDefault();
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
                
                // Prevent body scroll when menu is open
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
        }

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Add click animation
                link.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    link.style.transform = '';
                }, 150);

                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';

                // Smooth scroll to section if it's an internal link
                const href = link.getAttribute('href');
                if (href.startsWith('#')) {
                    e.preventDefault();
                    this.smoothScrollTo(href.substring(1));
                }
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!header.contains(e.target) && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        });

        // Active link highlighting with improved logic
        this.updateActiveLink();
        window.addEventListener('scroll', this.debounce(() => this.updateActiveLink(), 10));
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}` || (current === '' && href === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    // Enhanced Dark mode functionality
    setupDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;
        
        // Check for saved dark mode preference or system preference
        const savedMode = localStorage.getItem('darkMode');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedMode === 'enabled' || (savedMode === null && systemPrefersDark)) {
            body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        }

        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', () => {
                if (darkModeToggle.checked) {
                    body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'enabled');
                    this.showToast('Dark mode enabled', 'info');
                } else {
                    body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'disabled');
                    this.showToast('Light mode enabled', 'info');
                }
                
                // Update header background immediately when dark mode changes
                this.updateHeaderBackground();
            });
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (localStorage.getItem('darkMode') === null) {
                if (e.matches) {
                    body.classList.add('dark-mode');
                    if (darkModeToggle) darkModeToggle.checked = true;
                } else {
                    body.classList.remove('dark-mode');
                    if (darkModeToggle) darkModeToggle.checked = false;
                }
                // Update header background when system theme changes
                this.updateHeaderBackground();
            }
        });
    }

    // Update header background based on current scroll position and dark mode
    updateHeaderBackground() {
        const header = document.querySelector('.header');
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        if (scrollTop > 50) {
            if (isDarkMode) {
                header.style.background = 'rgba(15, 23, 42, 0.9)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.9)';
            }
        } else {
            if (isDarkMode) {
                header.style.background = 'rgba(15, 23, 42, 0.8)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.8)';
            }
        }
        header.style.backdropFilter = 'blur(20px) saturate(180%)';
    }

    // Enhanced Animation setup with Intersection Observer
    setupAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll(
            '.stat-card, .skill-tag, .about-text, .about-image, .hero-greeting, .hero-title, .hero-subtitle, .hero-description, .hero-actions, .social-links'
        );
        
        animatedElements.forEach(el => {
            el.classList.add('animate-element');
            observer.observe(el);
        });
    }

    // Enhanced Typewriter effect
    setupTypewriter() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        const texts = [
            'Full Stack Developer',
            'UI/UX Enthusiast',
            'Problem Solver',
            'Tech Innovator',
            'Creative Coder'
        ];

        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const typeWriter = () => {
            const currentText = texts[textIndex];
            
            if (isDeleting) {
                subtitle.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 30;
            } else {
                subtitle.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                typeSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        };

        // Start typewriter effect after initial animation
        setTimeout(typeWriter, 2000);
    }

    // Enhanced Animated stats counter with percentage support
    setupStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateStats = () => {
            statNumbers.forEach((stat, index) => {
                const targetValue = stat.getAttribute('data-target') || stat.textContent;
                const isPercentage = targetValue.includes('%');
                const target = parseFloat(targetValue.replace('%', ''));
                const duration = 2000; // 2 seconds
                const steps = 60; // 60 steps for smooth animation
                const increment = target / steps;
                let current = 0;
                let step = 0;

                // Stagger animation
                setTimeout(() => {
                    const updateCounter = () => {
                        if (step < steps) {
                            current += increment;
                            step++;
                            
                            // Format the display value
                            let displayValue;
                            if (isPercentage) {
                                displayValue = Math.min(Math.round(current), target) + '%';
                            } else {
                                displayValue = Math.min(Math.round(current), target);
                            }
                            
                            stat.textContent = displayValue;
                            requestAnimationFrame(updateCounter);
                        } else {
                            // Ensure final value is exact
                            if (isPercentage) {
                                stat.textContent = target + '%';
                            } else {
                                stat.textContent = target;
                            }
                        }
                    };
                    updateCounter();
                }, index * 150); // Increased stagger for better visual effect
            });
        };

        // Trigger stats animation when stats section is visible
        const statsSection = document.querySelector('.stats-section');
        if (statsSection) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        animateStats();
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });

            observer.observe(statsSection);
        }
    }

    // Enhanced Scroll effects
    setupScrollEffects() {
        const header = document.querySelector('.header');
        let ticking = false;

        const updateHeader = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const isDarkMode = document.body.classList.contains('dark-mode');
            
            // Header hide/show on scroll with smooth transition
            if (scrollTop > this.lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            // Add background blur effect based on scroll and dark mode
            if (scrollTop > 50) {
                if (isDarkMode) {
                    header.style.background = 'rgba(15, 23, 42, 0.9)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.9)';
                }
                header.style.backdropFilter = 'blur(20px) saturate(180%)';
            } else {
                if (isDarkMode) {
                    header.style.background = 'rgba(15, 23, 42, 0.8)';
                } else {
                    header.style.background = 'rgba(255, 255, 255, 0.8)';
                }
                header.style.backdropFilter = 'blur(20px) saturate(180%)';
            }

            this.lastScrollTop = scrollTop;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        });
    }

    // Parallax effects
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.hero-pattern, .hero-avatar-bg');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            
            parallaxElements.forEach(element => {
                element.style.transform = `translateY(${rate}px)`;
            });
        });
    }

    // Custom cursor effects
    setupCursorEffects() {
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.cssText = `
            position: fixed;
            width: 20px;
            height: 20px;
            background: var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            transition: all 0.1s ease;
            mix-blend-mode: difference;
        `;
        document.body.appendChild(cursor);

        const cursorFollower = document.createElement('div');
        cursorFollower.className = 'cursor-follower';
        cursorFollower.style.cssText = `
            position: fixed;
            width: 40px;
            height: 40px;
            border: 2px solid var(--primary-color);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9998;
            opacity: 0;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(cursorFollower);

        let mouseX = 0, mouseY = 0;
        let cursorX = 0, cursorY = 0;
        let followerX = 0, followerY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursor.style.opacity = '1';
            cursorFollower.style.opacity = '0.3';
        });

        // Animate cursor
        const animateCursor = () => {
            cursorX += (mouseX - cursorX) * 0.1;
            cursorY += (mouseY - cursorY) * 0.1;
            followerX += (mouseX - followerX) * 0.05;
            followerY += (mouseY - followerY) * 0.05;

            cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
            cursorFollower.style.transform = `translate(${followerX - 20}px, ${followerY - 20}px)`;

            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
            cursorFollower.style.opacity = '0';
        });

        // Cursor effects on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .nav-link, .social-link');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                cursor.style.transform += ' scale(1.5)';
                cursorFollower.style.transform += ' scale(1.5)';
            });
            
            el.addEventListener('mouseleave', () => {
                cursor.style.transform = cursor.style.transform.replace(' scale(1.5)', '');
                cursorFollower.style.transform = cursorFollower.style.transform.replace(' scale(1.5)', '');
            });
        });
    }

    // Loading animations
    setupLoadingAnimations() {
        // Add loading animation to images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('load', () => {
                img.classList.add('loaded');
            });
            
            if (img.complete) {
                img.classList.add('loaded');
            }
        });

        // Page load animation
        window.addEventListener('load', () => {
            document.body.classList.add('page-loaded');
            
            // Animate hero elements sequentially
            const heroElements = document.querySelectorAll('.hero-greeting, .hero-title, .hero-subtitle, .hero-description, .hero-actions, .social-links');
            heroElements.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('animate-in');
                }, index * 200);
            });
        });
    }

    // Performance optimizations
    setupPerformanceOptimizations() {
        // Lazy load images
        const lazyImages = document.querySelectorAll('img[data-src]');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));

        // Preload critical resources
        const criticalResources = [
            'https://i.ibb.co/sqLR7Wk/316743021-157045573699673-1104146878573161653-n.jpg'
        ];

        criticalResources.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }

    // Utility methods
    smoothScrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <i class="toast-icon ${this.getToastIcon(type)}"></i>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">&times;</button>
        `;
        
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--bg-card);
            color: var(--text-primary);
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-xl);
            z-index: 3000;
            opacity: 0;
            transform: translateY(20px) scale(0.9);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            border: 1px solid var(--border-color);
            min-width: 300px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0) scale(1)';
        });
        
        // Close button functionality
        const closeBtn = toast.querySelector('.toast-close');
        closeBtn.addEventListener('click', () => {
            this.hideToast(toast);
        });
        
        // Auto hide after 4 seconds
        setTimeout(() => {
            this.hideToast(toast);
        }, 4000);
    }

    hideToast(toast) {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px) scale(0.9)';
        setTimeout(() => {
            if (toast.parentNode) {
                document.body.removeChild(toast);
            }
        }, 300);
    }

    getToastIcon(type) {
        const icons = {
            success: 'bx-check-circle',
            error: 'bx-x-circle',
            warning: 'bx-error',
            info: 'bx-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Enhanced utility functions
const utils = {
    // Smooth scroll to element
    scrollTo(elementId) {
        const element = document.getElementById(elementId);
        if (element) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = element.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    },

    // Enhanced copy to clipboard
    async copyToClipboard(text) {
        try {
        if (navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                this.showToast('Copied to clipboard!', 'success');
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
                textArea.style.position = 'fixed';
                textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
                this.showToast('Copied to clipboard!', 'success');
            }
        } catch (error) {
            this.showToast('Failed to copy to clipboard', 'error');
        }
    },

    // Enhanced form validation
    validateForm(form) {
        const inputs = form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                this.showFieldError(input, 'This field is required');
                isValid = false;
            } else if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    this.showFieldError(input, 'Please enter a valid email');
                    isValid = false;
                }
            }
        });

        return isValid;
    },

    showFieldError(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: var(--error-color);
            font-size: 0.875rem;
            margin-top: 0.25rem;
            animation: slideIn 0.3s ease;
        `;

        const existingError = input.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }

        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = 'var(--error-color)';
        
        setTimeout(() => {
            input.style.borderColor = '';
        }, 3000);
    },

    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function
    throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Make utils available globally
window.portfolioUtils = utils;

// Enhanced contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (!utils.validateForm(contactForm)) {
            return;
        }
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.7';
        
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            utils.showToast('Message sent successfully!', 'success');
            contactForm.reset();
            
            // Reset form styles
            const inputs = contactForm.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.style.borderColor = '';
            });
        } catch (error) {
            utils.showToast('Error sending message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
        }
    });

    // Real-time form validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                utils.showFieldError(input, 'This field is required');
            } else if (input.type === 'email' && input.value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(input.value)) {
                    utils.showFieldError(input, 'Please enter a valid email');
                }
            }
        });

        input.addEventListener('input', () => {
            const error = input.parentNode.querySelector('.field-error');
            if (error) {
                error.remove();
                input.style.borderColor = '';
            }
        });
    });
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    .animate-element {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .animate-element.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .toast-icon {
        font-size: 1.25rem;
    }
    
    .toast-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: var(--text-secondary);
        padding: 0;
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.2s ease;
    }
    
    .toast-close:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
    }
    
    .toast-success .toast-icon { color: var(--success-color); }
    .toast-error .toast-icon { color: var(--error-color); }
    .toast-warning .toast-icon { color: var(--warning-color); }
    .toast-info .toast-icon { color: var(--primary-color); }
    
    img.loaded {
        animation: fadeIn 0.5s ease;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    .page-loaded .hero-content {
        animation: none;
    }
`;
document.head.appendChild(style);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page load time:', perfData.loadEventEnd - perfData.loadEventStart, 'ms');
        }, 0);
    });
}