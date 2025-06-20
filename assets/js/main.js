// Main JavaScript for the portfolio website
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavigation();
        this.setupDarkMode();
        this.setupAnimations();
        this.setupTypewriter();
        this.setupStats();
        this.setupScrollEffects();
    }

    // Navigation functionality
    setupNavigation() {
        const navToggle = document.getElementById('nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });
        }

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Active link highlighting
        this.updateActiveLink();
        window.addEventListener('scroll', () => this.updateActiveLink());
    }

    updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Dark mode functionality
    setupDarkMode() {
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;
        
        // Check for saved dark mode preference
        const isDarkMode = localStorage.getItem('darkMode') === 'enabled';
        
        if (isDarkMode) {
            body.classList.add('dark-mode');
            if (darkModeToggle) darkModeToggle.checked = true;
        }

        if (darkModeToggle) {
            darkModeToggle.addEventListener('change', () => {
                if (darkModeToggle.checked) {
                    body.classList.add('dark-mode');
                    localStorage.setItem('darkMode', 'enabled');
                } else {
                    body.classList.remove('dark-mode');
                    localStorage.setItem('darkMode', 'disabled');
                }
            });
        }
    }

    // Animation setup
    setupAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for animation
        const animatedElements = document.querySelectorAll('.stat-card, .skill-tag, .about-text, .about-image');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    }

    // Typewriter effect for hero subtitle
    setupTypewriter() {
        const subtitle = document.querySelector('.hero-subtitle');
        if (!subtitle) return;

        const texts = [
            'Full Stack Developer',
            'UI/UX Enthusiast',
            'Problem Solver',
            'Tech Innovator'
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
                typeSpeed = 50;
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

    // Animated stats counter
    setupStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        const animateStats = () => {
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target') || stat.textContent);
                const increment = target / 100;
                let current = 0;

                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        stat.textContent = Math.ceil(current);
                        setTimeout(updateCounter, 20);
                    } else {
                        stat.textContent = target;
                    }
                };

                updateCounter();
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
            });

            observer.observe(statsSection);
        }
    }

    // Scroll effects
    setupScrollEffects() {
        let lastScrollTop = 0;
        const header = document.querySelector('.header');

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // Header hide/show on scroll
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }
            
            lastScrollTop = scrollTop;

            // Parallax effect for hero background
            const heroBackground = document.querySelector('.hero-pattern');
            if (heroBackground) {
                const scrolled = window.pageYOffset;
                heroBackground.style.transform = `translateY(${scrolled * 0.5}px)`;
            }
        });
    }
}

// Utility functions
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

    // Copy text to clipboard
    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                this.showToast('Copied to clipboard!');
            });
        } else {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Copied to clipboard!');
        }
    },

    // Show toast notification
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: var(--primary-color);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--border-radius-md);
            box-shadow: var(--shadow-lg);
            z-index: 3000;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        }, 10);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(20px)';
            setTimeout(() => document.body.removeChild(toast), 300);
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
    }
};

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});

// Make utils available globally
window.portfolioUtils = utils;

// Contact form handling (if contact form exists)
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Add your form submission logic here
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call
            
            utils.showToast('Message sent successfully!');
            contactForm.reset();
        } catch (error) {
            utils.showToast('Error sending message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    });
}

// Performance optimization
window.addEventListener('load', () => {
    // Preload critical images
    const criticalImages = [
        'https://i.ibb.co/sqLR7Wk/316743021-157045573699673-1104146878573161653-n.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
    
    // Add loaded class for any load-dependent animations
    document.body.classList.add('loaded');
});