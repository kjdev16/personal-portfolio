// Navigation ToggleAdd commentMore actions
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Form Handling
const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
const successModal = document.getElementById('success-modal');
const loadingOverlay = document.getElementById('loading-overlay');
const submitBtn = document.querySelector('.submit-btn');

// Add ripple effect to button
submitBtn.addEventListener('click', function(e) {
    const ripple = document.querySelector('.btn-ripple');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.style.transform = 'scale(0)';
    ripple.style.animation = 'ripple 0.6s linear';
});

// Form submission
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
        showFormStatus('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading overlay
    showLoading();
    
    // Store original button content
    const originalContent = submitBtn.innerHTML;
    
    // Update button to loading state
    submitBtn.innerHTML = `
        <span class="btn-content">
            <span class="btn-text">Sending...</span>
            <span class="btn-icon">
                <i class='bx bx-loader-alt bx-spin'></i>
            </span>
        </span>
    `;
    submitBtn.disabled = true;
    
    try {
        const formData = new FormData(contactForm);
        
        const response = await fetch(contactForm.action, {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            // Hide loading overlay
            hideLoading();
            
            // Show success modal
            showModal();
            
            // Reset form
            contactForm.reset();
            resetFormStyles();
            
            // Show success message
            showFormStatus('Message sent successfully! I\'ll get back to you soon.', 'success');
        } else {
            throw new Error('Network response was not ok');
        }
    } catch (error) {
        console.error('Error:', error);
        hideLoading();
        showFormStatus('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
        // Reset button
        submitBtn.innerHTML = originalContent;
        submitBtn.disabled = false;
    }
});

// Show/Hide loading overlay
function showLoading() {
    loadingOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function hideLoading() {
    loadingOverlay.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Show form status
function showFormStatus(message, type) {
    formStatus.textContent = message;
    formStatus.className = `form-status ${type}`;
    formStatus.style.display = 'block';
    
    // Hide after 5 seconds
    setTimeout(() => {
        formStatus.style.display = 'none';
    }, 5000);
}

// Modal functions
function showModal() {
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Add entrance animation
    setTimeout(() => {
        successModal.querySelector('.modal-content').style.transform = 'scale(1)';
        successModal.querySelector('.modal-content').style.opacity = '1';
    }, 10);
}

function closeModal() {
    const modalContent = successModal.querySelector('.modal-content');
    modalContent.style.transform = 'scale(0.8)';
    modalContent.style.opacity = '0';
    
    setTimeout(() => {
        successModal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }, 300);
}

// Close modal when clicking backdrop
successModal.addEventListener('click', (e) => {
    if (e.target === successModal || e.target.classList.contains('modal-backdrop')) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && successModal.classList.contains('show')) {
        closeModal();
    }
});

// Form input animations and validation
document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('focus', function() {
        this.parentElement.classList.add('focused');
        this.classList.remove('error');
    });
    
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.parentElement.classList.remove('focused');
        }
        validateField(this);
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('error') && this.value.trim()) {
            this.classList.remove('error');
        }
    });
    
    // Check if input has value on page load
    if (input.value) {
        input.parentElement.classList.add('focused');
    }
});

// Form validation
function validateForm() {
    const inputs = contactForm.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    let isValid = true;
    
    // Check if field is empty
    if (field.hasAttribute('required') && !field.value.trim()) {
        field.classList.add('error');
        isValid = false;
    } else {
        field.classList.remove('error');
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            field.classList.add('error');
            isValid = false;
        }
    }
    
    return isValid;
}

function resetFormStyles() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('focused');
    });
    
    document.querySelectorAll('.form-input, .form-textarea').forEach(input => {
        input.classList.remove('error');
    });
}

// Smooth scrolling for anchor links
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

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        header.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
});

// Intersection Observer for animations
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
document.querySelectorAll('.info-item, .form-group, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add loading animation to page
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero elements
    const heroElements = document.querySelectorAll('.title-line, .hero-subtitle, .hero-stats');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add hover effects to info items
document.querySelectorAll('.info-item').forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(8px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0) scale(1)';
    });
});

// Add click to copy functionality for email
document.querySelector('.info-content a[href^="mailto:"]').addEventListener('click', function(e) {
    e.preventDefault();
    const email = this.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(email).then(() => {
            showTooltip(this, 'Email copied!');
        });
    } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = email;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showTooltip(this, 'Email copied!');
    }
});

// Show tooltip
function showTooltip(element, message) {
    const tooltip = document.createElement('div');
    tooltip.textContent = message;
    tooltip.style.cssText = `
        position: absolute;
        background: #1a1a1a;
        color: white;
        padding: 0.5rem 0.75rem;
        border-radius: 6px;
        font-size: 0.75rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = element.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 10);
    
    setTimeout(() => {
        tooltip.style.opacity = '0';
        setTimeout(() => document.body.removeChild(tooltip), 300);
    }, 2000);
}

// Add typing effect to hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
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

// Apply debouncing to scroll events
const debouncedScrollHandler = debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Add focus trap for modal
function trapFocus(element) {
    const focusableElements = element.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    element.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement.focus();
                    e.preventDefault();
                }
            }
        }
    });

    firstElement.focus();
}

// Apply focus trap when modal opens
const originalShowModal = showModal;
showModal = function() {
    originalShowModal();
    trapFocus(successModal);
};