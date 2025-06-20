// GitHub API configuration
const GITHUB_USERNAME = 'kjdev16';
const GITHUB_API_BASE = 'https://api.github.com';

// Skills data with detailed information
const skillsData = {
    'Frontend Development': {
        icon: 'bx-code-alt',
        description: 'Building beautiful and responsive user interfaces',
        skills: [
            {
                name: 'HTML5',
                icon: 'bxl-html5',
                level: 'Expert',
                progress: 95,
                color: '#e34f26',
                projects: ['personal-portfolio', 'death-note-address-book', 'check-your-luck', 'dice-game', 'dice-coin-roll-game'],
                description: 'Semantic markup, accessibility, and modern HTML5 features'
            },
            {
                name: 'CSS3 & SCSS',
                icon: 'bxl-css3',
                level: 'Expert',
                progress: 92,
                color: '#1572b6',
                projects: ['personal-portfolio', 'death-note-address-book', 'check-your-luck', 'dice-game', 'dice-coin-roll-game'],
                description: 'Advanced styling, animations, flexbox, grid, and responsive design'
            },
            {
                name: 'JavaScript',
                icon: 'bxl-javascript',
                level: 'Advanced',
                progress: 88,
                color: '#f7df1e',
                projects: ['personal-portfolio', 'death-note-address-book', 'check-your-luck', 'dice-game', 'dice-coin-roll-game'],
                description: 'ES6+, DOM manipulation, async/await, and modern JavaScript patterns'
            },
            {
                name: 'Bootstrap',
                icon: 'bxl-bootstrap',
                level: 'Advanced',
                progress: 85,
                color: '#7952b3',
                projects: ['dice-game', 'dice-coin-roll-game'],
                description: 'Responsive framework for rapid UI development'
            },
            {
                name: 'Tailwind CSS',
                icon: 'bx-palette',
                level: 'Intermediate',
                progress: 75,
                color: '#06b6d4',
                projects: ['modern-portfolio'],
                description: 'Utility-first CSS framework for custom designs'
            }
        ]
    },
    'Backend & Frameworks': {
        icon: 'bx-server',
        description: 'Server-side development and modern frameworks',
        skills: [
            {
                name: 'Python',
                icon: 'bxl-python',
                level: 'Advanced',
                progress: 82,
                color: '#3776ab',
                projects: ['automation-scripts', 'data-analysis-tools'],
                description: 'Web development, automation, data analysis, and scripting'
            },
            {
                name: 'Node.js',
                icon: 'bxl-nodejs',
                level: 'Intermediate',
                progress: 70,
                color: '#339933',
                projects: ['contact-integration'],
                description: 'Server-side JavaScript runtime for scalable applications'
            },
            {
                name: 'Express.js',
                icon: 'bx-server',
                level: 'Intermediate',
                progress: 68,
                color: '#000000',
                projects: ['contact-integration'],
                description: 'Fast, unopinionated web framework for Node.js'
            },
            {
                name: 'React.js',
                icon: 'bxl-react',
                level: 'Learning',
                progress: 60,
                color: '#61dafb',
                projects: ['react-portfolio'],
                description: 'Component-based library for building user interfaces'
            }
        ]
    },
    'Tools & Technologies': {
        icon: 'bx-wrench',
        description: 'Development tools and platforms I use daily',
        skills: [
            {
                name: 'Git & GitHub',
                icon: 'bxl-git',
                level: 'Expert',
                progress: 90,
                color: '#f05032',
                projects: 'all',
                description: 'Version control, collaboration, and project management'
            },
            {
                name: 'Linux',
                icon: 'bxl-tux',
                level: 'Intermediate',
                progress: 70,
                color: '#fcc624',
                projects: 'development',
                description: 'Command line, system administration, and development environment'
            },
            {
                name: 'VS Code',
                icon: 'bx-code-block',
                level: 'Expert',
                progress: 95,
                color: '#007acc',
                projects: 'all',
                description: 'Primary code editor with extensions and customizations'
            },
            {
                name: 'Telegram Bot API',
                icon: 'bxl-telegram',
                level: 'Intermediate',
                progress: 75,
                color: '#0088cc',
                projects: ['contact-integration', 'telegram-bots'],
                description: 'Building interactive bots and automation'
            }
        ]
    },
    'Design & UI/UX': {
        icon: 'bx-palette',
        description: 'Creating beautiful and user-friendly interfaces',
        skills: [
            {
                name: 'Responsive Design',
                icon: 'bx-mobile-alt',
                level: 'Expert',
                progress: 90,
                color: '#ff6b6b',
                projects: ['personal-portfolio', 'death-note-address-book', 'check-your-luck'],
                description: 'Mobile-first design and cross-device compatibility'
            },
            {
                name: 'UI/UX Principles',
                icon: 'bx-brush',
                level: 'Advanced',
                progress: 80,
                color: '#4ecdc4',
                projects: ['personal-portfolio', 'modern-portfolio'],
                description: 'User experience design and interface optimization'
            },
            {
                name: 'Animation & Effects',
                icon: 'bx-movie-play',
                level: 'Advanced',
                progress: 85,
                color: '#45b7d1',
                projects: ['personal-portfolio', 'check-your-luck', 'dice-game'],
                description: 'CSS animations, transitions, and interactive effects'
            }
        ]
    }
};

// Project categories and types
const projectCategories = {
    'web': 'Web Applications',
    'game': 'Games & Interactive',
    'tool': 'Tools & Utilities',
    'api': 'API & Integration'
};

// State management
let allProjects = [];
let filteredProjects = [];
let currentSkillFilter = null;
let currentProjectFilter = 'all';
let searchQuery = '';
let currentView = 'category';

// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const skillsLoading = document.getElementById('skills-loading');
const skillsGrid = document.getElementById('skills-grid');
const projectsLoading = document.getElementById('projects-loading');
const projectsGrid = document.getElementById('projects-grid');
const noProjects = document.getElementById('no-projects');
const searchInput = document.getElementById('search-projects');
const filterButtons = document.querySelectorAll('.filter-btn');
const showAllBtn = document.getElementById('show-all-btn');
const viewButtons = document.querySelectorAll('.view-btn');
const projectModal = document.getElementById('project-modal');

// Navigation toggle
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

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    await loadSkills();
    await loadProjects();
    setupEventListeners();
    updateHeroStats();
});

// Load and display skills
async function loadSkills() {
    try {
        showSkillsLoading();
        
        // Simulate loading delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));
        
        displaySkills();
        hideSkillsLoading();
        
    } catch (error) {
        console.error('Error loading skills:', error);
        showSkillsError();
    }
}

// Display skills based on current view
function displaySkills() {
    skillsGrid.innerHTML = '';
    
    if (currentView === 'category') {
        displaySkillsByCategory();
    } else {
        displaySkillsByLevel();
    }
}

// Display skills grouped by category
function displaySkillsByCategory() {
    Object.entries(skillsData).forEach(([categoryName, categoryData], categoryIndex) => {
        const categoryCard = createSkillCategoryCard(categoryName, categoryData);
        skillsGrid.appendChild(categoryCard);
        
        // Animate category appearance
        setTimeout(() => {
            categoryCard.style.opacity = '1';
            categoryCard.style.transform = 'translateY(0)';
        }, categoryIndex * 100);
    });
}

// Display skills grouped by proficiency level
function displaySkillsByLevel() {
    const skillsByLevel = {
        'Expert': [],
        'Advanced': [],
        'Intermediate': [],
        'Learning': []
    };
    
    // Group skills by level
    Object.values(skillsData).forEach(category => {
        category.skills.forEach(skill => {
            skillsByLevel[skill.level].push(skill);
        });
    });
    
    // Create level-based categories
    Object.entries(skillsByLevel).forEach(([level, skills], levelIndex) => {
        if (skills.length > 0) {
            const levelCard = createSkillLevelCard(level, skills);
            skillsGrid.appendChild(levelCard);
            
            // Animate level card appearance
            setTimeout(() => {
                levelCard.style.opacity = '1';
                levelCard.style.transform = 'translateY(0)';
            }, levelIndex * 100);
        }
    });
}

// Create skill category card
function createSkillCategoryCard(categoryName, categoryData) {
    const card = document.createElement('div');
    card.className = 'skill-category';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    card.innerHTML = `
        <div class="category-header">
            <div class="category-icon">
                <i class='bx ${categoryData.icon}'></i>
            </div>
            <h3>${categoryName}</h3>
            <p>${categoryData.description}</p>
        </div>
        <div class="skills-list">
            ${categoryData.skills.map(skill => createSkillItem(skill)).join('')}
        </div>
    `;
    
    return card;
}

// Create skill level card
function createSkillLevelCard(level, skills) {
    const card = document.createElement('div');
    card.className = 'skill-category level-category';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    const levelIcons = {
        'Expert': 'bx-trophy',
        'Advanced': 'bx-medal',
        'Intermediate': 'bx-star',
        'Learning': 'bx-book-open'
    };
    
    const levelColors = {
        'Expert': '#ffd700',
        'Advanced': '#ff6b47',
        'Intermediate': '#4ecdc4',
        'Learning': '#95a5a6'
    };
    
    card.innerHTML = `
        <div class="category-header">
            <div class="category-icon" style="background: linear-gradient(135deg, ${levelColors[level]}, ${levelColors[level]}aa)">
                <i class='bx ${levelIcons[level]}'></i>
            </div>
            <h3>${level} Level</h3>
            <p>${skills.length} skill${skills.length !== 1 ? 's' : ''} in this category</p>
        </div>
        <div class="skills-list">
            ${skills.map(skill => createSkillItem(skill)).join('')}
        </div>
    `;
    
    return card;
}

// Create individual skill item
function createSkillItem(skill) {
    const projectCount = Array.isArray(skill.projects) ? skill.projects.length : 
                        skill.projects === 'all' ? 'All' : 
                        skill.projects === 'development' ? 'Dev' : '1+';
    
    return `
        <div class="skill-item" data-skill="${skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}" data-projects='${JSON.stringify(skill.projects)}'>
            <div class="skill-info">
                <div class="skill-icon" style="background: linear-gradient(135deg, ${skill.color}, ${skill.color}aa)">
                    <i class='bx ${skill.icon}'></i>
                </div>
                <div class="skill-details">
                    <h4>${skill.name}</h4>
                    <span class="skill-level">${skill.level}</span>
                </div>
            </div>
            <div class="skill-progress">
                <div class="progress-bar" data-progress="${skill.progress}" style="background: linear-gradient(90deg, ${skill.color}, ${skill.color}aa)"></div>
            </div>
            <div class="skill-description">${skill.description}</div>
            <div class="project-count">${projectCount} Project${projectCount !== 1 && projectCount !== 'All' && projectCount !== 'Dev' ? 's' : ''}</div>
        </div>
    `;
}

// Load projects from GitHub
async function loadProjects() {
    try {
        showProjectsLoading();
        
        // Fetch repositories from GitHub API
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Filter and enhance project data
        allProjects = repos
            .filter(repo => !repo.fork && repo.name !== GITHUB_USERNAME) // Exclude forks and profile repo
            .map(repo => enhanceProjectData(repo));
        
        applyProjectFilters();
        hideProjectsLoading();
        
    } catch (error) {
        console.error('Error loading projects:', error);
        showProjectsError();
    }
}

// Enhance project data with additional information
function enhanceProjectData(repo) {
    const project = { ...repo };
    
    // Determine project category based on name and description
    project.category = determineProjectCategory(repo);
    
    // Add technology stack based on language and topics
    project.techStack = determineTechStack(repo);
    
    // Add project type and difficulty
    project.type = determineProjectType(repo);
    project.difficulty = determineProjectDifficulty(repo);
    
    // Add custom descriptions for known projects
    project.enhancedDescription = getEnhancedDescription(repo);
    
    return project;
}

// Determine project category
function determineProjectCategory(repo) {
    const name = repo.name.toLowerCase();
    const description = (repo.description || '').toLowerCase();
    
    if (name.includes('game') || name.includes('dice') || name.includes('luck')) {
        return 'game';
    }
    if (name.includes('bot') || name.includes('api') || name.includes('integration')) {
        return 'api';
    }
    if (name.includes('tool') || name.includes('script') || name.includes('automation')) {
        return 'tool';
    }
    return 'web';
}

// Determine technology stack
function determineTechStack(repo) {
    const stack = [];
    
    if (repo.language) {
        stack.push(repo.language);
    }
    
    if (repo.topics) {
        stack.push(...repo.topics);
    }
    
    // Add common web technologies based on project type
    const name = repo.name.toLowerCase();
    if (name.includes('portfolio') || name.includes('website')) {
        stack.push('HTML5', 'CSS3', 'JavaScript');
    }
    
    return [...new Set(stack)]; // Remove duplicates
}

// Determine project type
function determineProjectType(repo) {
    const name = repo.name.toLowerCase();
    
    if (name.includes('portfolio')) return 'Portfolio Website';
    if (name.includes('game')) return 'Interactive Game';
    if (name.includes('bot')) return 'Telegram Bot';
    if (name.includes('tool')) return 'Development Tool';
    if (name.includes('api')) return 'API Integration';
    
    return 'Web Application';
}

// Determine project difficulty
function determineProjectDifficulty(repo) {
    const techCount = repo.topics ? repo.topics.length : 0;
    const hasDescription = repo.description && repo.description.length > 50;
    const isRecent = new Date(repo.updated_at) > new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);
    
    let score = 0;
    if (techCount > 3) score += 2;
    if (hasDescription) score += 1;
    if (isRecent) score += 1;
    if (repo.stargazers_count > 0) score += 1;
    
    if (score >= 4) return 'Advanced';
    if (score >= 2) return 'Intermediate';
    return 'Beginner';
}

// Get enhanced description for known projects
function getEnhancedDescription(repo) {
    const descriptions = {
        'personal-portfolio': 'A modern, responsive portfolio website showcasing my skills and projects with smooth animations and professional design.',
        'death-note-address-book': 'A themed address book application with local storage functionality and Death Note anime-inspired design.',
        'check-your-luck': 'An interactive luck-based game with engaging animations and random number generation algorithms.',
        'dice-game': 'A multiplayer dice game built with Bootstrap for responsive design and JavaScript for game logic.',
        'dice-coin-roll-game': 'A combination game featuring both dice rolling and coin flipping with Bootstrap styling and smooth animations.'
    };
    
    return descriptions[repo.name] || repo.description || 'A project built with modern web technologies.';
}

// Apply project filters
function applyProjectFilters() {
    let filtered = [...allProjects];
    
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(project => 
            project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.enhancedDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
            project.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }
    
    // Apply category filter
    if (currentProjectFilter !== 'all') {
        filtered = filtered.filter(project => project.category === currentProjectFilter);
    }
    
    // Apply skill filter
    if (currentSkillFilter) {
        filtered = filtered.filter(project => {
            const skillProjects = getSkillProjects(currentSkillFilter);
            return skillProjects.includes(project.name) || 
                   skillProjects.includes('all') ||
                   project.techStack.some(tech => tech.toLowerCase().includes(currentSkillFilter.toLowerCase()));
        });
    }
    
    filteredProjects = filtered;
    displayProjects();
}

// Get projects associated with a skill
function getSkillProjects(skillName) {
    for (const category of Object.values(skillsData)) {
        for (const skill of category.skills) {
            if (skill.name.toLowerCase().replace(/[^a-z0-9]/g, '-') === skillName) {
                return Array.isArray(skill.projects) ? skill.projects : [skill.projects];
            }
        }
    }
    return [];
}

// Display projects
function displayProjects() {
    if (filteredProjects.length === 0) {
        showNoProjects();
        return;
    }
    
    hideNoProjects();
    projectsGrid.innerHTML = '';
    
    filteredProjects.forEach((project, index) => {
        const projectCard = createProjectCard(project);
        projectsGrid.appendChild(projectCard);
        
        // Animate project card appearance
        setTimeout(() => {
            projectCard.style.opacity = '1';
            projectCard.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// Create project card
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    const primaryLanguage = project.language || 'Web';
    const languageColor = getLanguageColor(primaryLanguage);
    
    card.innerHTML = `
        <div class="project-image">
            <div class="project-overlay">
                <div class="project-links">
                    <a href="${project.html_url}" target="_blank" class="project-link">
                        <i class='bx bx-link-external'></i>
                    </a>
                    ${project.homepage ? `
                        <a href="${project.homepage}" target="_blank" class="project-link">
                            <i class='bx bx-world'></i>
                        </a>
                    ` : ''}
                    <button class="project-link" onclick="showProjectModal('${project.name}')">
                        <i class='bx bx-info-circle'></i>
                    </button>
                </div>
            </div>
            <div class="project-bg ${project.name}" style="background: linear-gradient(135deg, ${languageColor}aa, ${languageColor}44)"></div>
        </div>
        <div class="project-content">
            <div class="project-header">
                <h3>${project.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
                <span class="project-type">${project.type}</span>
            </div>
            <p class="project-description">${project.enhancedDescription}</p>
            <div class="project-stats">
                <div class="project-stat">
                    <i class='bx bx-star'></i>
                    <span>${project.stargazers_count}</span>
                </div>
                <div class="project-stat">
                    <i class='bx bx-git-repo-forked'></i>
                    <span>${project.forks_count}</span>
                </div>
                <div class="project-stat">
                    <i class='bx bx-calendar'></i>
                    <span>${new Date(project.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
            <div class="project-tech">
                ${project.techStack.slice(0, 4).map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                ${project.techStack.length > 4 ? `<span class="tech-tag">+${project.techStack.length - 4}</span>` : ''}
            </div>
            <div class="project-difficulty">
                <span class="difficulty-badge ${project.difficulty.toLowerCase()}">${project.difficulty}</span>
            </div>
        </div>
    `;
    
    return card;
}

// Get language color
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Dart': '#00B4AB',
        'Shell': '#89e051',
        'Web': '#667eea'
    };
    
    return colors[language] || '#586069';
}

// Show project modal
function showProjectModal(projectName) {
    const project = allProjects.find(p => p.name === projectName);
    if (!project) return;
    
    const modalBody = document.getElementById('modal-project-body');
    const modalTitle = document.getElementById('modal-project-name');
    
    modalTitle.textContent = project.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    
    modalBody.innerHTML = `
        <div class="project-modal-content">
            <div class="project-modal-header">
                <div class="project-modal-info">
                    <h4>${project.full_name}</h4>
                    <p class="project-modal-description">${project.enhancedDescription}</p>
                    <div class="project-modal-meta">
                        <span class="project-type-badge">${project.type}</span>
                        <span class="difficulty-badge ${project.difficulty.toLowerCase()}">${project.difficulty}</span>
                    </div>
                </div>
            </div>
            
            <div class="project-modal-stats">
                <div class="modal-stat">
                    <i class='bx bx-star'></i>
                    <span>${project.stargazers_count} Stars</span>
                </div>
                <div class="modal-stat">
                    <i class='bx bx-git-repo-forked'></i>
                    <span>${project.forks_count} Forks</span>
                </div>
                <div class="modal-stat">
                    <i class='bx bx-show'></i>
                    <span>${project.watchers_count} Watchers</span>
                </div>
                <div class="modal-stat">
                    <i class='bx bx-code-block'></i>
                    <span>${project.size} KB</span>
                </div>
            </div>
            
            <div class="project-modal-tech">
                <h5>Technologies Used:</h5>
                <div class="tech-stack">
                    ${project.techStack.map(tech => `
                        <span class="tech-tag-large" style="background: ${getLanguageColor(tech)}22; color: ${getLanguageColor(tech)}; border-color: ${getLanguageColor(tech)}44">
                            ${tech}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            <div class="project-modal-dates">
                <div class="date-info">
                    <strong>Created:</strong> ${new Date(project.created_at).toLocaleDateString()}
                </div>
                <div class="date-info">
                    <strong>Last Updated:</strong> ${new Date(project.updated_at).toLocaleDateString()}
                </div>
                ${project.pushed_at ? `
                    <div class="date-info">
                        <strong>Last Push:</strong> ${new Date(project.pushed_at).toLocaleDateString()}
                    </div>
                ` : ''}
            </div>
            
            <div class="project-modal-actions">
                <a href="${project.html_url}" target="_blank" class="modal-action-btn primary">
                    <i class='bx bx-link-external'></i>
                    View on GitHub
                </a>
                ${project.homepage ? `
                    <a href="${project.homepage}" target="_blank" class="modal-action-btn">
                        <i class='bx bx-world'></i>
                        Live Demo
                    </a>
                ` : ''}
                <button class="modal-action-btn" onclick="copyToClipboard('${project.clone_url}')">
                    <i class='bx bx-copy'></i>
                    Copy Clone URL
                </button>
            </div>
        </div>
    `;
    
    projectModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close project modal
function closeProjectModal() {
    projectModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Copy to clipboard
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!');
        });
    } else {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showToast('Copied to clipboard!');
    }
}

// Show toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
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
}

// Setup event listeners
function setupEventListeners() {
    // Skill item clicks
    document.addEventListener('click', (e) => {
        const skillItem = e.target.closest('.skill-item');
        if (skillItem) {
            handleSkillClick(skillItem);
        }
    });
    
    // Search input
    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value.trim();
        applyProjectFilters();
    }, 300));
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentProjectFilter = btn.dataset.filter;
            applyProjectFilters();
        });
    });
    
    // Show all button
    showAllBtn.addEventListener('click', () => {
        resetFilters();
        scrollToProjects();
    });
    
    // View toggle buttons
    viewButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            viewButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentView = btn.dataset.view;
            displaySkills();
        });
    });
    
    // Modal close events
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal || e.target.classList.contains('modal-backdrop')) {
            closeProjectModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('show')) {
            closeProjectModal();
        }
    });
    
    // Intersection Observer for animations
    setupIntersectionObserver();
}

// Handle skill item click
function handleSkillClick(skillItem) {
    const skillName = skillItem.dataset.skill;
    
    // Remove previous active states
    document.querySelectorAll('.skill-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active state to clicked skill
    skillItem.classList.add('active');
    currentSkillFilter = skillName;
    
    // Update projects title
    const skillDisplayName = skillItem.querySelector('h4').textContent;
    document.getElementById('projects-title').innerHTML = `Projects using <span class="skill-highlight">${skillDisplayName}</span>`;
    
    // Apply filters and scroll to projects
    applyProjectFilters();
    scrollToProjects();
    
    // Show skill feedback
    showSkillFeedback(skillItem, skillDisplayName);
}

// Show skill feedback
function showSkillFeedback(skillItem, skillName) {
    const feedback = document.createElement('div');
    feedback.className = 'skill-feedback';
    feedback.innerHTML = `
        <i class='bx bx-check-circle'></i>
        <span>Filtering projects by ${skillName}</span>
    `;
    
    skillItem.appendChild(feedback);
    
    setTimeout(() => feedback.classList.add('show'), 10);
    
    setTimeout(() => {
        feedback.classList.remove('show');
        setTimeout(() => {
            if (feedback.parentNode) {
                feedback.parentNode.removeChild(feedback);
            }
        }, 300);
    }, 2000);
}

// Reset all filters
function resetFilters() {
    currentSkillFilter = null;
    currentProjectFilter = 'all';
    searchQuery = '';
    
    // Reset UI
    document.querySelectorAll('.skill-item').forEach(item => {
        item.classList.remove('active');
    });
    
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === 'all') {
            btn.classList.add('active');
        }
    });
    
    searchInput.value = '';
    document.getElementById('projects-title').textContent = 'Featured Projects';
    
    applyProjectFilters();
}

// Scroll to projects section
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

// Update hero stats
function updateHeroStats() {
    const totalSkills = Object.values(skillsData).reduce((acc, category) => acc + category.skills.length, 0);
    
    document.getElementById('total-technologies').textContent = totalSkills;
    
    // Update project count after projects are loaded
    setTimeout(() => {
        document.getElementById('total-projects').textContent = allProjects.length;
    }, 1000);
}

// Setup intersection observer for animations
function setupIntersectionObserver() {
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
        observer.observe(el);
    });
}

// Utility functions
function showSkillsLoading() {
    skillsLoading.style.display = 'flex';
    skillsGrid.style.display = 'none';
}

function hideSkillsLoading() {
    skillsLoading.style.display = 'none';
    skillsGrid.style.display = 'grid';
}

function showProjectsLoading() {
    projectsLoading.style.display = 'flex';
    projectsGrid.style.display = 'none';
    noProjects.style.display = 'none';
}

function hideProjectsLoading() {
    projectsLoading.style.display = 'none';
    projectsGrid.style.display = 'grid';
}

function showNoProjects() {
    noProjects.style.display = 'block';
    projectsGrid.style.display = 'none';
}

function hideNoProjects() {
    noProjects.style.display = 'none';
    projectsGrid.style.display = 'grid';
}

function showSkillsError() {
    skillsGrid.innerHTML = `
        <div class="error-message">
            <i class='bx bx-error-circle'></i>
            <h3>Error Loading Skills</h3>
            <p>There was an error loading the skills data. Please refresh the page.</p>
        </div>
    `;
    hideSkillsLoading();
}

function showProjectsError() {
    projectsGrid.innerHTML = `
        <div class="error-message">
            <i class='bx bx-error-circle'></i>
            <h3>Error Loading Projects</h3>
            <p>There was an error loading projects from GitHub. Please try again later.</p>
        </div>
    `;
    hideProjectsLoading();
}

// Debounce function
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

// Header scroll effect
let lastScrollTop = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', debounce(() => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    lastScrollTop = scrollTop;
}, 10));

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.floating-element');
    
    parallaxElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
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