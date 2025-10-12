// Initialize AOS
AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    offset: 50
});

let allNews = [];
let currentFilter = 'all';

// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
        });

        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.style.display = 'none';
            }
        });
    }

    // Load news from markdown files
    loadNewsFromMarkdown();

    // Setup filter tabs
    setupFilterTabs();
});

// Parse markdown frontmatter
function parseFrontmatter(markdown) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = markdown.match(frontmatterRegex);
    
    if (!match) {
        return { frontmatter: {}, content: markdown };
    }
    
    const frontmatterText = match[1];
    const content = match[2].trim();
    const frontmatter = {};
    
    // Parse YAML-like frontmatter
    frontmatterText.split('\n').forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex > -1) {
            const key = line.substring(0, colonIndex).trim();
            let value = line.substring(colonIndex + 1).trim();
            
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) || 
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            
            // Convert boolean strings
            if (value === 'true') value = true;
            if (value === 'false') value = false;
            
            frontmatter[key] = value;
        }
    });
    
    return { frontmatter, content };
}

// Get list of markdown files from GitHub API
async function getNewsMarkdownFiles() {
    try {
        const response = await fetch('https://api.github.com/repos/muhammadrehan-dev/Resource-Hub/contents/content/news');
        
        if (!response.ok) {
            console.log('GitHub API failed, trying fallback...');
            return [];
        }
        
        const files = await response.json();
        
        // Filter only .md files (exclude index.html, .css, .js, etc.)
        return files
            .filter(file => file.name.endsWith('.md'))
            .map(file => ({
                name: file.name,
                url: file.download_url,
                path: file.path
            }));
    } catch (error) {
        console.error('Error fetching news files from GitHub:', error);
        return [];
    }
}

// Load news from markdown files
async function loadNewsFromMarkdown() {
    const container = document.getElementById('newsContainer');
    const emptyState = document.getElementById('emptyState');
    
    try {
        // Get list of markdown files
        const markdownFiles = await getNewsMarkdownFiles();
        
        if (markdownFiles.length === 0) {
            container.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        // Fetch and parse all markdown files
        const newsPromises = markdownFiles.map(async (file) => {
            try {
                const response = await fetch(file.url);
                const markdown = await response.text();
                const { frontmatter, content } = parseFrontmatter(markdown);
                
                return {
                    title: frontmatter.title || 'Untitled',
                    date: frontmatter.date || new Date().toISOString(),
                    category: frontmatter.category || 'General Update',
                    body: content,
                    featured: frontmatter.featured || false,
                    sendNotification: frontmatter.sendNotification || false,
                    isArchived: false // Will be set later
                };
            } catch (error) {
                console.error(`Error loading ${file.name}:`, error);
                return null;
            }
        });
        
        allNews = await Promise.all(newsPromises);
        allNews = allNews.filter(item => item !== null);
        
        // Sort by date (newest first)
        allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Mark old news as archived (older than 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        allNews = allNews.map(news => ({
            ...news,
            isArchived: new Date(news.date) < thirtyDaysAgo
        }));
        
        displayNews(allNews);
        
    } catch (error) {
        console.error('Error loading news:', error);
        container.innerHTML = '';
        emptyState.style.display = 'block';
    }
}

// Display news cards
function displayNews(newsArray) {
    const container = document.getElementById('newsContainer');
    const emptyState = document.getElementById('emptyState');
    
    // Filter news based on current filter
    let filteredNews = newsArray;
    
    if (currentFilter !== 'all') {
        if (currentFilter === 'archived') {
            filteredNews = newsArray.filter(news => news.isArchived);
        } else {
            filteredNews = newsArray.filter(news => 
                news.category === currentFilter && !news.isArchived
            );
        }
    } else {
        // Show only active news in "all" filter
        filteredNews = newsArray.filter(news => !news.isArchived);
    }
    
    // Clear loading state
    container.innerHTML = '';
    
    // Show empty state if no news
    if (filteredNews.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Create news cards
    filteredNews.forEach((news, index) => {
        const card = createNewsCard(news, index);
        container.appendChild(card);
    });
}

// Create news card element
function createNewsCard(news, index) {
    const card = document.createElement('div');
    card.className = `news-card ${news.isArchived ? 'archived' : ''}`;
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    const categoryClass = news.category.toLowerCase().replace(/\s+/g, '-');
    const formattedDate = formatDate(news.date);
    const content = marked.parse(news.body || '');
    
    card.innerHTML = `
        ${news.featured ? '<div class="featured-badge"><i class="fas fa-star"></i> Featured</div>' : ''}
        
        <div class="news-header">
            <div class="news-title-section">
                <h2>${news.title}</h2>
                <div class="news-meta">
                    <span class="news-date">
                        <i class="fas fa-calendar-alt"></i>
                        ${formattedDate}
                    </span>
                    <span class="category-badge ${categoryClass} ${news.isArchived ? 'archived' : ''}">
                        ${getCategoryIcon(news.category)}
                        ${news.category}
                    </span>
                </div>
            </div>
        </div>
        
        <div class="news-content">
            ${content}
        </div>
    `;
    
    return card;
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        'General Update': '<i class="fas fa-info-circle"></i>',
        'Urgent': '<i class="fas fa-exclamation-triangle"></i>',
        'Exam': '<i class="fas fa-clipboard-list"></i>',
        'Assignment': '<i class="fas fa-tasks"></i>'
    };
    return icons[category] || '<i class="fas fa-circle"></i>';
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }
}

// Setup filter tabs
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get filter value
            currentFilter = tab.getAttribute('data-filter');
            
            // Filter and display news
            displayNews(allNews);
        });
    });
}

// Console message
console.log('%c📰 News Page Loaded', 'color: #00bcd4; font-size: 18px; font-weight: bold;');
console.log('%cStay updated with the latest announcements!', 'color: #7f8c8d; font-size: 12px;');
