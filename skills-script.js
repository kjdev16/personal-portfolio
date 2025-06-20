// Navigation Toggle
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
            
            // Animate progress bars
            if (entry.target.classList.contains('skill-item')) {
                const progressBar = entry.target.querySelector('.progress-bar');
                if (progressBar) {
                    const progress = progressBar.getAttribute('data-progress');
                    setTimeout(() => {
                        progressBar.style.width = progress + '%';
                    }, 200);
                }
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.skill-category, .skill-item, .project-card, .stat-item').forEach(el => {
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

// Skill category hover effects
document.querySelectorAll('.skill-category').forEach(category => {
    category.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-8px) scale(1.02)';
    });
    
    category.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Project card interactions
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const overlay = this.querySelector('.project-overlay');
        const bg = this.querySelector('.project-bg');
        
        overlay.style.opacity = '1';
        bg.style.transform = 'scale(1.1)';
    });
    
    card.addEventListener('mouseleave', function() {
        const overlay = this.querySelector('.project-overlay');
        const bg = this.querySelector('.project-bg');
        
        overlay.style.opacity = '0';
        bg.style.transform = 'scale(1)';
    });
});

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

// Filter projects by technology (optional enhancement)
function filterProjects(tech) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        const projectTech = project.getAttribute('data-tech');
        
        if (tech === 'all' || projectTech.includes(tech)) {
            project.style.display = 'block';
            project.style.opacity = '1';
            project.style.transform = 'translateY(0)';
        } else {
            project.style.opacity = '0';
            project.style.transform = 'translateY(20px)';
            setTimeout(() => {
                project.style.display = 'none';
            }, 300);
        }
    });
}

// Add click handlers for skill items to show related projects
document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('click', function() {
        const skillType = this.getAttribute('data-skill');
        
        // Remove active class from all skills
        document.querySelectorAll('.skill-item').forEach(s => s.classList.remove('active'));
        
        // Add active class to clicked skill
        this.classList.add('active');
        
        // Scroll to projects section
        const projectsSection = document.querySelector('.projects-section');
        if (projectsSection) {
            projectsSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Highlight related projects
        setTimeout(() => {
            highlightRelatedProjects(skillType);
        }, 500);
    });
});

function highlightRelatedProjects(skillType) {
    const projects = document.querySelectorAll('.project-card');
    
    projects.forEach(project => {
        const projectTech = project.getAttribute('data-tech');
        
        if (projectTech.includes(skillType)) {
            project.style.boxShadow = '0 25px 50px -12px rgba(249, 83, 45, 0.25)';
            project.style.transform = 'translateY(-12px) scale(1.02)';
            project.style.border = '2px solid var(--primary-color)';
        } else {
            project.style.boxShadow = 'var(--shadow-lg)';
            project.style.transform = 'translateY(0) scale(1)';
            project.style.border = '1px solid var(--border-color)';
        }
    });
    
    // Reset highlighting after 3 seconds
    setTimeout(() => {
        projects.forEach(project => {
            project.style.boxShadow = 'var(--shadow-lg)';
            project.style.transform = 'translateY(0) scale(1)';
            project.style.border = '1px solid var(--border-color)';
        });
        
        // Remove active class from skills
        document.querySelectorAll('.skill-item').forEach(s => s.classList.remove('active'));
    }, 3000);
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

// Add CSS for active skill state
const style = document.createElement('style');
style.textContent = `
    .skill-item.active {
        background: rgba(249, 83, 45, 0.1) !important;
        border-color: var(--primary-color) !important;
        transform: translateX(12px) scale(1.02) !important;
        box-shadow: var(--shadow-lg) !important;
    }
    
    .skill-item.active .skill-details h4 {
        color: var(--primary-color) !important;
    }
    
    .skill-item.active .progress-bar {
        box-shadow: 0 0 10px rgba(249, 83, 45, 0.5);
    }
`;
document.head.appendChild(style);

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        // Add focus styles for keyboard navigation
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    // Remove focus styles when using mouse
    document.body.classList.remove('keyboard-navigation');
});

// Add focus styles
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .keyboard-navigation .skill-item:focus,
    .keyboard-navigation .project-card:focus,
    .keyboard-navigation .nav-link:focus {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
    }
`;
document.head.appendChild(focusStyle);

// Make skill items and project cards focusable
document.querySelectorAll('.skill-item, .project-card').forEach(el => {
    el.setAttribute('tabindex', '0');
});

// Add enter key support for skill items
document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});