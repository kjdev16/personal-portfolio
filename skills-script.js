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

// Enhanced Skills-Projects Logic
let currentActiveSkill = null;
let filterTimeout = null;

// Skill to project mapping with more detailed relationships
const skillProjectMapping = {
    'html': ['portfolio', 'death-note', 'luck-game', 'dice-game', 'dice-coin'],
    'css': ['portfolio', 'death-note', 'luck-game', 'dice-game', 'dice-coin'],
    'javascript': ['portfolio', 'death-note', 'luck-game', 'dice-game', 'dice-coin'],
    'python': ['telegram-bot', 'automation-scripts'],
    'bootstrap': ['dice-game', 'dice-coin'],
    'react': ['portfolio-v2'],
    'nodejs': ['contact-integration'],
    'express': ['contact-integration'],
    'git': ['all'],
    'linux': ['development'],
    'telegram': ['contact-integration']
};

// Project difficulty levels for better categorization
const projectDifficulty = {
    'portfolio': 'advanced',
    'death-note': 'intermediate',
    'luck-game': 'beginner',
    'dice-game': 'intermediate',
    'dice-coin': 'intermediate',
    'contact-integration': 'advanced'
};

// Enhanced skill click handler
document.querySelectorAll('.skill-item').forEach(skill => {
    skill.addEventListener('click', function(e) {
        e.preventDefault();
        
        const skillType = this.getAttribute('data-skill');
        const skillLevel = this.querySelector('.skill-level').textContent.toLowerCase();
        
        // Handle skill selection
        handleSkillSelection(this, skillType, skillLevel);
        
        // Scroll to projects with offset for header
        scrollToProjects();
        
        // Filter and highlight projects
        setTimeout(() => {
            filterProjectsBySkill(skillType, skillLevel);
        }, 500);
    });
    
    // Add keyboard support
    skill.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.click();
        }
    });
});

function handleSkillSelection(skillElement, skillType, skillLevel) {
    // Remove previous active states
    document.querySelectorAll('.skill-item').forEach(s => {
        s.classList.remove('active', 'selected');
    });
    
    // Add active state to clicked skill
    skillElement.classList.add('active', 'selected');
    currentActiveSkill = skillType;
    
    // Update skill category header to show selection
    const category = skillElement.closest('.skill-category');
    const categoryHeader = category.querySelector('.category-header h3');
    const originalText = categoryHeader.getAttribute('data-original') || categoryHeader.textContent;
    
    if (!categoryHeader.getAttribute('data-original')) {
        categoryHeader.setAttribute('data-original', originalText);
    }
    
    categoryHeader.textContent = `${originalText} - ${skillElement.querySelector('h4').textContent} Selected`;
    
    // Reset category header after delay
    setTimeout(() => {
        categoryHeader.textContent = originalText;
    }, 3000);
    
    // Show skill selection feedback
    showSkillSelectionFeedback(skillElement, skillType);
}

function showSkillSelectionFeedback(skillElement, skillType) {
    // Create and show feedback tooltip
    const feedback = document.createElement('div');
    feedback.className = 'skill-feedback';
    feedback.innerHTML = `
        <i class='bx bx-check-circle'></i>
        <span>Filtering projects by ${skillType.toUpperCase()}</span>
    `;
    
    skillElement.appendChild(feedback);
    
    // Animate feedback
    setTimeout(() => feedback.classList.add('show'), 10);
    
    // Remove feedback after delay
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

function scrollToProjects() {
    const projectsSection = document.querySelector('.projects-section');
    if (projectsSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = projectsSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

function filterProjectsBySkill(skillType, skillLevel) {
    const projects = document.querySelectorAll('.project-card');
    const relatedProjects = skillProjectMapping[skillType] || [];
    
    // Clear any existing filter timeout
    if (filterTimeout) {
        clearTimeout(filterTimeout);
    }
    
    // Add filter indicator to projects section
    showFilterIndicator(skillType, relatedProjects.length);
    
    projects.forEach((project, index) => {
        const projectId = getProjectId(project);
        const isRelated = relatedProjects.includes(projectId) || relatedProjects.includes('all');
        
        setTimeout(() => {
            if (isRelated) {
                highlightProject(project, skillType);
            } else {
                dimProject(project);
            }
        }, index * 100); // Stagger the animation
    });
    
    // Auto-reset filter after 5 seconds
    filterTimeout = setTimeout(() => {
        resetProjectFilter();
    }, 5000);
    
    // Update projects section title
    updateProjectsSectionTitle(skillType, relatedProjects.length);
}

function getProjectId(projectCard) {
    // Extract project ID from various sources
    const techData = projectCard.getAttribute('data-tech') || '';
    const title = projectCard.querySelector('h3').textContent.toLowerCase();
    
    if (title.includes('portfolio')) return 'portfolio';
    if (title.includes('death note')) return 'death-note';
    if (title.includes('luck')) return 'luck-game';
    if (title.includes('dice game') && !title.includes('coin')) return 'dice-game';
    if (title.includes('dice') && title.includes('coin')) return 'dice-coin';
    if (title.includes('contact')) return 'contact-integration';
    
    return 'unknown';
}

function highlightProject(project, skillType) {
    project.classList.add('highlighted', 'skill-related');
    project.style.transform = 'translateY(-12px) scale(1.02)';
    project.style.boxShadow = '0 25px 50px -12px rgba(249, 83, 45, 0.25)';
    project.style.border = '2px solid var(--primary-color)';
    project.style.background = 'linear-gradient(135deg, rgba(249, 83, 45, 0.05) 0%, rgba(255, 255, 255, 1) 100%)';
    
    // Add skill badge to project
    addSkillBadge(project, skillType);
    
    // Animate project content
    const content = project.querySelector('.project-content');
    content.style.transform = 'translateY(-4px)';
}

function dimProject(project) {
    project.classList.add('dimmed');
    project.classList.remove('highlighted', 'skill-related');
    project.style.opacity = '0.4';
    project.style.transform = 'translateY(0) scale(0.95)';
    project.style.filter = 'grayscale(50%)';
    
    // Remove any existing skill badges
    const existingBadge = project.querySelector('.skill-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
}

function addSkillBadge(project, skillType) {
    // Remove existing badge
    const existingBadge = project.querySelector('.skill-badge');
    if (existingBadge) {
        existingBadge.remove();
    }
    
    // Create new skill badge
    const badge = document.createElement('div');
    badge.className = 'skill-badge';
    badge.innerHTML = `
        <i class='bx bx-check-circle'></i>
        <span>Uses ${skillType.toUpperCase()}</span>
    `;
    
    const projectContent = project.querySelector('.project-content');
    projectContent.insertBefore(badge, projectContent.firstChild);
    
    // Animate badge appearance
    setTimeout(() => badge.classList.add('show'), 10);
}

function showFilterIndicator(skillType, projectCount) {
    // Remove existing indicator
    const existingIndicator = document.querySelector('.filter-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create filter indicator
    const indicator = document.createElement('div');
    indicator.className = 'filter-indicator';
    indicator.innerHTML = `
        <div class="filter-content">
            <i class='bx bx-filter'></i>
            <span>Showing ${projectCount} project${projectCount !== 1 ? 's' : ''} using <strong>${skillType.toUpperCase()}</strong></span>
            <button class="clear-filter" onclick="resetProjectFilter()">
                <i class='bx bx-x'></i>
                Clear Filter
            </button>
        </div>
    `;
    
    const projectsSection = document.querySelector('.projects-section .container');
    const sectionHeader = projectsSection.querySelector('.section-header');
    sectionHeader.appendChild(indicator);
    
    // Animate indicator
    setTimeout(() => indicator.classList.add('show'), 10);
}

function updateProjectsSectionTitle(skillType, projectCount) {
    const sectionTitle = document.querySelector('.projects-section .section-title');
    const originalTitle = sectionTitle.getAttribute('data-original') || sectionTitle.textContent;
    
    if (!sectionTitle.getAttribute('data-original')) {
        sectionTitle.setAttribute('data-original', originalTitle);
    }
    
    sectionTitle.innerHTML = `${originalTitle} <span class="skill-filter-text">- ${skillType.toUpperCase()}</span>`;
}

function resetProjectFilter() {
    const projects = document.querySelectorAll('.project-card');
    
    // Clear filter timeout
    if (filterTimeout) {
        clearTimeout(filterTimeout);
        filterTimeout = null;
    }
    
    // Reset all projects
    projects.forEach((project, index) => {
        setTimeout(() => {
            project.classList.remove('highlighted', 'dimmed', 'skill-related');
            project.style.transform = 'translateY(0) scale(1)';
            project.style.boxShadow = 'var(--shadow-lg)';
            project.style.border = '1px solid var(--border-color)';
            project.style.opacity = '1';
            project.style.filter = 'none';
            project.style.background = 'var(--bg-primary)';
            
            // Reset project content
            const content = project.querySelector('.project-content');
            content.style.transform = 'translateY(0)';
            
            // Remove skill badges
            const badge = project.querySelector('.skill-badge');
            if (badge) {
                badge.classList.remove('show');
                setTimeout(() => {
                    if (badge.parentNode) {
                        badge.remove();
                    }
                }, 300);
            }
        }, index * 50);
    });
    
    // Remove active states from skills
    document.querySelectorAll('.skill-item').forEach(skill => {
        skill.classList.remove('active', 'selected');
    });
    
    // Reset section title
    const sectionTitle = document.querySelector('.projects-section .section-title');
    const originalTitle = sectionTitle.getAttribute('data-original');
    if (originalTitle) {
        sectionTitle.textContent = originalTitle;
    }
    
    // Remove filter indicator
    const filterIndicator = document.querySelector('.filter-indicator');
    if (filterIndicator) {
        filterIndicator.classList.remove('show');
        setTimeout(() => {
            if (filterIndicator.parentNode) {
                filterIndicator.remove();
            }
        }, 300);
    }
    
    currentActiveSkill = null;
}

// Add "Show All Projects" functionality
function addShowAllButton() {
    const skillsSection = document.querySelector('.skills-section .section-header');
    
    const showAllBtn = document.createElement('button');
    showAllBtn.className = 'show-all-btn';
    showAllBtn.innerHTML = `
        <i class='bx bx-grid-alt'></i>
        <span>Show All Projects</span>
    `;
    
    showAllBtn.addEventListener('click', () => {
        resetProjectFilter();
        scrollToProjects();
    });
    
    skillsSection.appendChild(showAllBtn);
}

// Initialize show all button
document.addEventListener('DOMContentLoaded', () => {
    addShowAllButton();
});

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

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentActiveSkill) {
        resetProjectFilter();
    }
    
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-navigation');
});

// Make skill items and project cards focusable
document.querySelectorAll('.skill-item, .project-card').forEach(el => {
    el.setAttribute('tabindex', '0');
});