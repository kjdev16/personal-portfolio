// GitHub API configuration
const GITHUB_USERNAME = 'kjdev16';
const GITHUB_API_BASE = 'https://api.github.com';
const REPOS_PER_PAGE = 12;

// State management
let allRepositories = [];
let filteredRepositories = [];
let currentPage = 1;
let currentFilter = 'all';
let currentSort = 'updated';
let searchQuery = '';

// DOM elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const profileCard = document.getElementById('profile-card');
const reposGrid = document.getElementById('repos-grid');
const reposLoading = document.getElementById('repos-loading');
const loadMoreContainer = document.getElementById('load-more-container');
const loadMoreBtn = document.getElementById('load-more-btn');
const noResults = document.getElementById('no-results');
const searchInput = document.getElementById('search-repos');
const sortSelect = document.getElementById('sort-repos');
const filterButtons = document.querySelectorAll('.filter-btn');
const repoModal = document.getElementById('repo-modal');

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
    // Load profile, activity calendar, and initial repos in parallel for better performance
    await Promise.all([
        loadGitHubProfile(),
        loadGitHubActivity(),
        loadInitialRepositories()
    ]);
    setupEventListeners();
});

// Load GitHub profile information with caching
async function loadGitHubProfile() {
    try {
        // Check for cached profile data first
        const cachedProfile = getCachedProfile();
        if (cachedProfile && isCacheValid(cachedProfile.timestamp)) {
            displayProfile(cachedProfile.data);
            updateHeroStats(cachedProfile.data);
            return;
        }
        
        // Show loading state for profile
        profileCard.innerHTML = `
            <div class="profile-loading">
                <div class="loading-spinner"></div>
                <p>Loading GitHub profile...</p>
            </div>
        `;
        
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const profile = await response.json();
        
        // Cache the profile data
        cacheProfile(profile);
        
        displayProfile(profile);
        updateHeroStats(profile);
    } catch (error) {
        console.error('Error loading GitHub profile:', error);
        showProfileError();
    }
}

// Display profile information
function displayProfile(profile) {
    const profileContent = `
        <div class="profile-content show">
            <img src="${profile.avatar_url}" alt="${profile.name || profile.login}" class="profile-avatar">
            <div class="profile-info">
                <h2>${profile.name || profile.login}</h2>
                <p class="profile-username">@${profile.login}</p>
                ${profile.bio ? `<p class="profile-bio">${profile.bio}</p>` : ''}
                <div class="profile-stats">
                    <div class="profile-stat">
                        <span class="profile-stat-number">${profile.public_repos}</span>
                        <span class="profile-stat-label">Repositories</span>
                    </div>
                    <div class="profile-stat">
                        <span class="profile-stat-number">${profile.followers}</span>
                        <span class="profile-stat-label">Followers</span>
                    </div>
                    <div class="profile-stat">
                        <span class="profile-stat-number">${profile.following}</span>
                        <span class="profile-stat-label">Following</span>
                    </div>
                </div>
                <div class="profile-links">
                    <a href="https://github.com/kjdev16" target="_blank" class="profile-link">
                        <i class='bx bxl-github'></i>
                        View on GitHub
                    </a>
                    <a href="https://github.com/kjdev16" target="_blank" class="profile-link">
                        <i class='bx bx-user'></i>
                        My Profile
                    </a>
                    ${profile.blog ? `
                        <a href="${profile.blog}" target="_blank" class="profile-link">
                            <i class='bx bx-link-external'></i>
                            Website
                        </a>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
    
    profileCard.innerHTML = profileContent;
}

// Update hero stats
function updateHeroStats(profile) {
    document.getElementById('total-repos').textContent = profile.public_repos;
    document.getElementById('total-stars').textContent = '0'; // Will be updated after repos load
    document.getElementById('total-forks').textContent = '0'; // Will be updated after repos load
}

// Show profile error
function showProfileError() {
    profileCard.innerHTML = `
        <div class="profile-content show">
            <div class="profile-error">
                <i class='bx bx-error-circle'></i>
                <h3>Unable to load profile</h3>
                <p>There was an error loading the GitHub profile. Please try again later.</p>
            </div>
        </div>
    `;
}

// Load GitHub activity and contribution calendar
async function loadGitHubActivity() {
    try {
        const calendarContainer = document.getElementById('contribution-calendar');
        const calendarLoading = document.getElementById('calendar-loading');
        
        // Check for cached activity data
        const cachedActivity = getCachedActivity();
        if (cachedActivity && isCacheValid(cachedActivity.timestamp)) {
            displayActivityCalendar(cachedActivity.data);
            updateActivityStats(cachedActivity.stats);
            return;
        }
        
        // Show loading state
        calendarLoading.style.display = 'flex';
        calendarContainer.style.display = 'none';
        
        // Fetch contribution data from GitHub API
        const response = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/events?per_page=100`);
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const events = await response.json();
        
        // Process events to create contribution data
        const contributionData = processContributionData(events);
        const activityStats = calculateActivityStats(contributionData);
        
        // Cache the activity data
        cacheActivity(contributionData, activityStats);
        
        // Display the calendar and stats
        displayActivityCalendar(contributionData);
        updateActivityStats(activityStats);
        
        // Hide loading
        calendarLoading.style.display = 'none';
        calendarContainer.style.display = 'block';
        
    } catch (error) {
        console.error('Error loading GitHub activity:', error);
        showActivityError();
    }
}

// Process contribution data from GitHub events
function processContributionData(events) {
    const contributions = {};
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    // Initialize all dates with 0 contributions
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        contributions[dateStr] = 0;
    }
    
    // Count contributions from events
    events.forEach(event => {
        if (event.type === 'PushEvent' && event.payload && event.payload.commits) {
            const dateStr = event.created_at.split('T')[0];
            if (contributions[dateStr] !== undefined) {
                contributions[dateStr] += event.payload.commits.length;
            }
        }
    });
    
    return contributions;
}

// Calculate activity statistics
function calculateActivityStats(contributionData) {
    const values = Object.values(contributionData);
    const totalCommits = values.reduce((sum, count) => sum + count, 0);
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date();
    for (let i = 0; i < 365; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        if (contributionData[dateStr] > 0) {
            currentStreak++;
        } else {
            break;
        }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    Object.values(contributionData).forEach(count => {
        if (count > 0) {
            tempStreak++;
            longestStreak = Math.max(longestStreak, tempStreak);
        } else {
            tempStreak = 0;
        }
    });
    
    return {
        totalCommits,
        currentStreak,
        longestStreak
    };
}

// Display activity calendar
function displayActivityCalendar(contributionData) {
    const calendarContainer = document.getElementById('contribution-calendar');
    
    // Create SVG calendar
    const svg = createContributionCalendar(contributionData);
    calendarContainer.innerHTML = '';
    calendarContainer.appendChild(svg);
}

// Create contribution calendar SVG
function createContributionCalendar(contributionData) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 120');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '120');
    
    const maxContributions = Math.max(...Object.values(contributionData));
    const colors = [
        '#ebedf0', // No contributions
        '#9be9a8', // 1-3 contributions
        '#40c463', // 4-6 contributions
        '#30a14e', // 7-9 contributions
        '#216e39'  // 10+ contributions
    ];
    
    let x = 0;
    const today = new Date();
    const oneYearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        const contributions = contributionData[dateStr] || 0;
        
        // Determine color based on contribution count
        let colorIndex = 0;
        if (contributions > 0) {
            if (contributions <= 3) colorIndex = 1;
            else if (contributions <= 6) colorIndex = 2;
            else if (contributions <= 9) colorIndex = 3;
            else colorIndex = 4;
        }
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', 0);
        rect.setAttribute('width', '10');
        rect.setAttribute('height', '10');
        rect.setAttribute('fill', colors[colorIndex]);
        rect.setAttribute('rx', '2');
        rect.setAttribute('ry', '2');
        
        // Add tooltip
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${dateStr}: ${contributions} contribution${contributions !== 1 ? 's' : ''}`;
        rect.appendChild(title);
        
        svg.appendChild(rect);
        x += 12;
    }
    
    return svg;
}

// Update activity statistics
function updateActivityStats(stats) {
    document.getElementById('total-commits').textContent = stats.totalCommits;
    document.getElementById('current-streak').textContent = stats.currentStreak;
    document.getElementById('longest-streak').textContent = stats.longestStreak;
}

// Show activity error
function showActivityError() {
    const calendarContainer = document.getElementById('contribution-calendar');
    const calendarLoading = document.getElementById('calendar-loading');
    
    calendarLoading.style.display = 'none';
    calendarContainer.innerHTML = `
        <div class="activity-error">
            <i class='bx bx-error-circle'></i>
            <h3>Unable to load activity</h3>
            <p>There was an error loading the GitHub activity. Please try again later.</p>
        </div>
    `;
}

// Activity caching functions
function cacheActivity(data, stats) {
    const cacheData = {
        data: data,
        stats: stats,
        timestamp: Date.now()
    };
    localStorage.setItem('github_activity_cache', JSON.stringify(cacheData));
}

function getCachedActivity() {
    const cached = localStorage.getItem('github_activity_cache');
    return cached ? JSON.parse(cached) : null;
}

// Load initial repositories (first page only) for faster loading
async function loadInitialRepositories() {
    try {
        showLoading();
        
        // Check for cached data first
        const cachedData = getCachedData();
        if (cachedData && isCacheValid(cachedData.timestamp)) {
            allRepositories = cachedData.repos;
            updateHeroStatsFromCache(cachedData.stats);
            applyFiltersAndSort();
            hideLoading();
            return;
        }
        
        // Fetch first page of repositories for immediate display
        const response = await fetch(
            `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?page=1&per_page=30&sort=updated`
        );
        
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        
        const repos = await response.json();
        
        // Calculate initial stats
        const totalStats = repos.reduce((acc, repo) => {
            acc.stars += repo.stargazers_count;
            acc.forks += repo.forks_count;
            return acc;
        }, { stars: 0, forks: 0 });
        
        // Update hero stats
        document.getElementById('total-stars').textContent = totalStats.stars;
        document.getElementById('total-forks').textContent = totalStats.forks;
        
        allRepositories = repos;
        applyFiltersAndSort();
        hideLoading();
        
        // Load remaining repositories in background (non-blocking)
        setTimeout(() => {
            loadAllRepositoriesInBackground();
        }, 100);
        
    } catch (error) {
        console.error('Error loading initial repositories:', error);
        showError('Failed to load repositories. Please try again later.');
        hideLoading();
    }
}

// Load all repositories in background for complete data
async function loadAllRepositoriesInBackground() {
    try {
        // Fetch all repositories (GitHub API returns max 100 per page)
        let page = 1;
        let allRepos = [];
        
        // Start with the repos we already have
        allRepos = [...allRepositories];
        
        // Only fetch additional pages if we have more than 30 repos
        if (allRepos.length >= 30) {
            page = 2; // Start from page 2 since we already have page 1
        }
        
        while (true) {
            const response = await fetch(
                `${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?page=${page}&per_page=100&sort=updated`
            );
            
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const repos = await response.json();
            
            if (repos.length === 0) break;
            
            allRepos = allRepos.concat(repos);
            page++;
            
            // Add a small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // Calculate total stats
        const totalStats = allRepos.reduce((acc, repo) => {
            acc.stars += repo.stargazers_count;
            acc.forks += repo.forks_count;
            return acc;
        }, { stars: 0, forks: 0 });
        
        // Update hero stats with complete data
        document.getElementById('total-stars').textContent = totalStats.stars;
        document.getElementById('total-forks').textContent = totalStats.forks;
        
        allRepositories = allRepos;
        
        // Cache the data
        cacheData(allRepos, totalStats);
        
        // Re-apply filters with complete data
        applyFiltersAndSort();
        
    } catch (error) {
        console.error('Error loading all repositories:', error);
        // Don't show error to user since initial load was successful
    }
}

// Cache management functions
function cacheData(repos, stats) {
    const cacheData = {
        repos: repos,
        stats: stats,
        timestamp: Date.now()
    };
    localStorage.setItem('github_repos_cache', JSON.stringify(cacheData));
}

function getCachedData() {
    const cached = localStorage.getItem('github_repos_cache');
    return cached ? JSON.parse(cached) : null;
}

function cacheProfile(profile) {
    const cacheData = {
        data: profile,
        timestamp: Date.now()
    };
    localStorage.setItem('github_profile_cache', JSON.stringify(cacheData));
}

function getCachedProfile() {
    const cached = localStorage.getItem('github_profile_cache');
    return cached ? JSON.parse(cached) : null;
}

function isCacheValid(timestamp) {
    // Cache is valid for 1 hour
    const oneHour = 60 * 60 * 1000;
    return (Date.now() - timestamp) < oneHour;
}

function updateHeroStatsFromCache(stats) {
    document.getElementById('total-stars').textContent = stats.stars;
    document.getElementById('total-forks').textContent = stats.forks;
}

// Apply current filters and sorting
function applyFiltersAndSort() {
    let filtered = [...allRepositories];
    
    // Apply search filter
    if (searchQuery) {
        filtered = filtered.filter(repo => 
            repo.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (repo.description && repo.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (repo.topics && repo.topics.some(topic => topic.toLowerCase().includes(searchQuery.toLowerCase())))
        );
    }
    
    // Apply category filter
    switch (currentFilter) {
        case 'public':
            filtered = filtered.filter(repo => !repo.private);
            break;
        case 'forked':
            filtered = filtered.filter(repo => repo.fork);
            break;
        case 'original':
            filtered = filtered.filter(repo => !repo.fork);
            break;
        // 'all' shows everything
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
        switch (currentSort) {
            case 'updated':
                return new Date(b.updated_at) - new Date(a.updated_at);
            case 'created':
                return new Date(b.created_at) - new Date(a.created_at);
            case 'name':
                return a.name.localeCompare(b.name);
            case 'stars':
                return b.stargazers_count - a.stargazers_count;
            case 'size':
                return b.size - a.size;
            default:
                return 0;
        }
    });
    
    filteredRepositories = filtered;
    currentPage = 1;
    displayRepositories();
}

// Display repositories
function displayRepositories() {
    if (filteredRepositories.length === 0) {
        showNoResults();
        return;
    }
    
    hideNoResults();
    
    const startIndex = 0;
    const endIndex = currentPage * REPOS_PER_PAGE;
    const reposToShow = filteredRepositories.slice(startIndex, endIndex);
    
    reposGrid.innerHTML = '';
    
    reposToShow.forEach((repo, index) => {
        const repoCard = createRepositoryCard(repo);
        reposGrid.appendChild(repoCard);
        
        // Animate card appearance
        setTimeout(() => {
            repoCard.style.opacity = '1';
            repoCard.style.transform = 'translateY(0)';
        }, index * 50);
    });
    
    // Show/hide load more button
    if (endIndex < filteredRepositories.length) {
        loadMoreContainer.style.display = 'block';
    } else {
        loadMoreContainer.style.display = 'none';
    }
}

// Create repository card element
function createRepositoryCard(repo) {
    const card = document.createElement('div');
    card.className = 'repo-card';
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    
    // Get language color
    const languageColor = getLanguageColor(repo.language);
    
    // Format dates
    const updatedDate = new Date(repo.updated_at).toLocaleDateString();
    const createdDate = new Date(repo.created_at).toLocaleDateString();
    
    card.innerHTML = `
        <div class="repo-header">
            <div class="repo-icon">
                <i class='bx ${repo.fork ? 'bx-git-repo-forked' : 'bx-book'}'></i>
            </div>
            <div class="repo-info">
                <h3>${repo.name}</h3>
                <span class="repo-visibility ${repo.private ? 'private' : 'public'}">
                    ${repo.private ? 'Private' : 'Public'}
                </span>
            </div>
        </div>
        
        ${repo.description ? `<p class="repo-description">${repo.description}</p>` : ''}
        
        <div class="repo-stats">
            <div class="repo-stat">
                <i class='bx bx-star'></i>
                <span>${repo.stargazers_count}</span>
            </div>
            <div class="repo-stat">
                <i class='bx bx-git-repo-forked'></i>
                <span>${repo.forks_count}</span>
            </div>
            <div class="repo-stat">
                <i class='bx bx-calendar'></i>
                <span>Updated ${updatedDate}</span>
            </div>
        </div>
        
        ${repo.language ? `
            <div class="repo-language">
                <div class="language-dot" style="background-color: ${languageColor}"></div>
                <span>${repo.language}</span>
            </div>
        ` : ''}
        
        ${repo.topics && repo.topics.length > 0 ? `
            <div class="repo-topics">
                ${repo.topics.slice(0, 5).map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                ${repo.topics.length > 5 ? `<span class="topic-tag">+${repo.topics.length - 5} more</span>` : ''}
            </div>
        ` : ''}
        
        <div class="repo-actions">
            <a href="${repo.html_url}" target="_blank" class="repo-action">
                <i class='bx bx-link-external'></i>
                View
            </a>
            ${repo.clone_url ? `
                <a href="#" class="repo-action" onclick="copyToClipboard('${repo.clone_url}')">
                    <i class='bx bx-copy'></i>
                    Clone
                </a>
            ` : ''}
        </div>
    `;
    
    // Add click handler for modal
    card.addEventListener('click', (e) => {
        if (!e.target.closest('.repo-action')) {
            showRepositoryModal(repo);
        }
    });
    
    return card;
}

// Get language color
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C': '#555555',
        'C#': '#239120',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'Dart': '#00B4AB',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'Vue': '#2c3e50',
        'React': '#61DAFB',
        'Angular': '#DD0031',
        'Shell': '#89e051',
        'PowerShell': '#012456',
        'Dockerfile': '#384d54',
        'YAML': '#cb171e',
        'JSON': '#292929',
        'Markdown': '#083fa1'
    };
    
    return colors[language] || '#586069';
}

// Show repository modal with detailed information
function showRepositoryModal(repo) {
    const modalBody = document.getElementById('modal-body');
    const modalRepoName = document.getElementById('modal-repo-name');
    
    modalRepoName.textContent = repo.name;
    
    modalBody.innerHTML = `
        <div class="repo-modal-content">
            <div class="repo-modal-header">
                <div class="repo-modal-info">
                    <h4>${repo.full_name}</h4>
                    <p class="repo-modal-description">${repo.description || 'No description available'}</p>
                </div>
                <span class="repo-visibility ${repo.private ? 'private' : 'public'}">
                    ${repo.private ? 'Private' : 'Public'}
                </span>
            </div>
            
            <div class="repo-modal-stats">
                <div class="modal-stat">
                    <i class='bx bx-star'></i>
                    <span>${repo.stargazers_count} Stars</span>
                </div>
                <div class="modal-stat">
                    <i class='bx bx-git-repo-forked'></i>
                    <span>${repo.forks_count} Forks</span>
                </div>
                <div class="modal-stat">
                    <i class='bx bx-show'></i>
                    <span>${repo.watchers_count} Watchers</span>
                </div>
                <div class="modal-stat">
                    <i class='bx bx-bug'></i>
                    <span>${repo.open_issues_count} Issues</span>
                </div>
            </div>
            
            ${repo.language ? `
                <div class="repo-modal-language">
                    <div class="language-dot" style="background-color: ${getLanguageColor(repo.language)}"></div>
                    <span>Primary language: ${repo.language}</span>
                </div>
            ` : ''}
            
            <div class="repo-modal-dates">
                <p><strong>Created:</strong> ${new Date(repo.created_at).toLocaleDateString()}</p>
                <p><strong>Last updated:</strong> ${new Date(repo.updated_at).toLocaleDateString()}</p>
                ${repo.pushed_at ? `<p><strong>Last push:</strong> ${new Date(repo.pushed_at).toLocaleDateString()}</p>` : ''}
            </div>
            
            ${repo.topics && repo.topics.length > 0 ? `
                <div class="repo-modal-topics">
                    <h5>Topics:</h5>
                    <div class="topics-list">
                        ${repo.topics.map(topic => `<span class="topic-tag">${topic}</span>`).join('')}
                    </div>
                </div>
            ` : ''}
            
            <div class="repo-modal-actions">
                <a href="${repo.html_url}" target="_blank" class="modal-action-btn primary">
                    <i class='bx bx-link-external'></i>
                    View on GitHub
                </a>
                ${repo.clone_url ? `
                    <button class="modal-action-btn" onclick="copyToClipboard('${repo.clone_url}')">
                        <i class='bx bx-copy'></i>
                        Copy Clone URL
                    </button>
                ` : ''}
                ${repo.homepage ? `
                    <a href="${repo.homepage}" target="_blank" class="modal-action-btn">
                        <i class='bx bx-world'></i>
                        Live Demo
                    </a>
                ` : ''}
            </div>
        </div>
    `;
    
    repoModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Close repository modal
function closeRepoModal() {
    repoModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Copy to clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!');
        });
    } else {
        // Fallback for older browsers
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
    // Search input
    searchInput.addEventListener('input', debounce((e) => {
        searchQuery = e.target.value.trim();
        applyFiltersAndSort();
    }, 300));
    
    // Sort dropdown
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        applyFiltersAndSort();
    });
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            applyFiltersAndSort();
        });
    });
    
    // Load more button
    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        displayRepositories();
    });
    
    // Modal close events
    repoModal.addEventListener('click', (e) => {
        if (e.target === repoModal || e.target.classList.contains('modal-backdrop')) {
            closeRepoModal();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && repoModal.classList.contains('show')) {
            closeRepoModal();
        }
    });
}

// Utility functions
function showLoading() {
    reposLoading.style.display = 'flex';
    reposGrid.style.display = 'none';
    loadMoreContainer.style.display = 'none';
    noResults.style.display = 'none';
}

function hideLoading() {
    reposLoading.style.display = 'none';
    reposGrid.style.display = 'grid';
}

function showNoResults() {
    noResults.style.display = 'block';
    reposGrid.style.display = 'none';
    loadMoreContainer.style.display = 'none';
}

function hideNoResults() {
    noResults.style.display = 'none';
    reposGrid.style.display = 'grid';
}

function showError(message) {
    reposGrid.innerHTML = `
        <div class="error-message">
            <i class='bx bx-error-circle'></i>
            <h3>Error</h3>
            <p>${message}</p>
            <button onclick="location.reload()" class="retry-btn">
                <i class='bx bx-refresh'></i>
                Retry
            </button>
        </div>
    `;
}

// Debounce function for search
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

// Add some CSS for modal content
const modalStyles = `
    .repo-modal-content {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
    
    .repo-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
    }
    
    .repo-modal-info h4 {
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
    }
    
    .repo-modal-description {
        color: var(--text-secondary);
        line-height: 1.6;
    }
    
    .repo-modal-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        gap: 1rem;
    }
    
    .modal-stat {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
        font-size: 0.875rem;
    }
    
    .modal-stat i {
        color: var(--primary-color);
        font-size: 1rem;
    }
    
    .repo-modal-language {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        color: var(--text-secondary);
    }
    
    .repo-modal-dates {
        background: var(--bg-secondary);
        padding: 1rem;
        border-radius: var(--border-radius-md);
    }
    
    .repo-modal-dates p {
        margin-bottom: 0.5rem;
        color: var(--text-secondary);
    }
    
    .repo-modal-dates strong {
        color: var(--text-primary);
    }
    
    .repo-modal-topics h5 {
        color: var(--text-primary);
        margin-bottom: 0.75rem;
    }
    
    .topics-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
    
    .repo-modal-actions {
        display: flex;
        gap: 1rem;
        flex-wrap: wrap;
    }
    
    .modal-action-btn {
        background: var(--bg-secondary);
        color: var(--text-secondary);
        text-decoration: none;
        padding: 0.75rem 1.5rem;
        border: 1px solid var(--border-color);
        border-radius: var(--border-radius-md);
        font-weight: 500;
        transition: all var(--transition-normal);
        display: flex;
        align-items: center;
        gap: 0.5rem;
        cursor: pointer;
    }
    
    .modal-action-btn:hover {
        background: var(--primary-color);
        color: var(--text-white);
        border-color: var(--primary-color);
    }
    
    .modal-action-btn.primary {
        background: var(--primary-color);
        color: var(--text-white);
        border-color: var(--primary-color);
    }
    
    .modal-action-btn.primary:hover {
        background: var(--primary-light);
    }
    
    .error-message {
        grid-column: 1 / -1;
        text-align: center;
        padding: 4rem 2rem;
        color: var(--text-secondary);
    }
    
    .error-message i {
        font-size: 4rem;
        margin-bottom: 1rem;
        color: var(--text-light);
    }
    
    .error-message h3 {
        font-size: 1.5rem;
        margin-bottom: 0.5rem;
        color: var(--text-primary);
    }
    
    .retry-btn {
        background: var(--primary-color);
        color: var(--text-white);
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius-md);
        font-weight: 600;
        cursor: pointer;
        margin-top: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all var(--transition-normal);
    }
    
    .retry-btn:hover {
        background: var(--primary-light);
    }
`;

// Add styles to document
const styleSheet = document.createElement('style');
styleSheet.textContent = modalStyles;
document.head.appendChild(styleSheet);