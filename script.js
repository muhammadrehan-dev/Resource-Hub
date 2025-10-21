// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Skeleton Loader Logic
document.addEventListener('DOMContentLoaded', function() {
    // Fun loading messages
    const messages = [
        "Loading your resources",
        "Fetching course materials",
        "Preparing your study hub",
        "Cyber mode: Activated",
        "Compiling knowledge base",
        "Hacking into the mainframe... JK!",
        "Loading awesomeness",
        "Brewing some code coffee",
        "Almost there, champ!"
    ];

    let messageIndex = 0;
    const messageElement = document.getElementById('loadingMessage');
    let messageInterval;

    // Only start rotating messages if element exists
    if (messageElement) {
        messageInterval = setInterval(() => {
            messageIndex = (messageIndex + 1) % messages.length;
            messageElement.textContent = messages[messageIndex];
        }, 2000);
    }

    // Hide skeleton after page loads
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (messageInterval) clearInterval(messageInterval);
            const skeletonLoader = document.getElementById('skeletonLoader');
            if (skeletonLoader) {
                skeletonLoader.classList.add('hidden');
                
                // Remove skeleton from DOM after animation
                setTimeout(() => {
                    skeletonLoader.remove();
                }, 500);
            }
        }, 1500);
    });

    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            if (mobileMenu.style.display === 'block') {
                mobileMenu.style.display = 'none';
            } else {
                mobileMenu.style.display = 'block';
            }
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuBtn.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.style.display = 'none';
            }
        });

        // Close mobile menu when a link is clicked
        const mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.style.display = 'none';
            });
        });
    }

    // Load latest news and deadlines on homepage
    if (document.getElementById('newsGrid')) {
        loadLatestNewsFromMarkdown();
    }
    
    if (document.getElementById('deadlinesGrid')) {
        loadUpcomingDeadlinesFromMarkdown();
    }

    // Initialize subject cards animation - MOVED INSIDE DOMContentLoaded
    initializeSubjectCards();
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

// Get list of markdown files from the news directory
async function getNewsMarkdownFiles() {
    try {
        // Fetch the news directory listing from GitHub API
        const response = await fetch('https://api.github.com/repos/muhammadrehan-dev/Resource-Hub/contents/content/news');
        
        if (!response.ok) {
            console.log('GitHub API failed, using fallback method');
            return [];
        }
        
        const files = await response.json();
        
        // Filter only .md files (exclude index.html, .css, .js)
        return files
            .filter(file => file.name.endsWith('.md'))
            .map(file => ({
                name: file.name,
                url: file.download_url
            }));
    } catch (error) {
        console.error('Error fetching news files:', error);
        return [];
    }
}

// Load latest news from markdown files
async function loadLatestNewsFromMarkdown() {
    const newsGrid = document.getElementById('newsGrid');
    
    try {
        // Get list of markdown files
        const markdownFiles = await getNewsMarkdownFiles();
        
        if (markdownFiles.length === 0) {
            newsGrid.innerHTML = '<div class="news-placeholder"><p>No recent news available</p></div>';
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
                    sendNotification: frontmatter.sendNotification || false
                };
            } catch (error) {
                console.error(`Error loading ${file.name}:`, error);
                return null;
            }
        });
        
        let newsItems = await Promise.all(newsPromises);
        newsItems = newsItems.filter(item => item !== null);
        
        // Filter out archived news (older than 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        newsItems = newsItems.filter(item => new Date(item.date) >= thirtyDaysAgo);
        
        // Sort by date (newest first) and take top 3
        newsItems.sort((a, b) => new Date(b.date) - new Date(a.date));
        newsItems = newsItems.slice(0, 3);
        
        if (newsItems.length === 0) {
            newsGrid.innerHTML = '<div class="news-placeholder"><p>No recent news available</p></div>';
            return;
        }
        
        newsGrid.innerHTML = '';
        
        newsItems.forEach((item, index) => {
            const card = createNewsCardPreview(item, index);
            newsGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading news:', error);
        newsGrid.innerHTML = '<div class="news-placeholder"><p>Unable to load news. Please check back later.</p></div>';
    }
}

// Create news card preview for homepage
function createNewsCardPreview(news, index) {
    const card = document.createElement('div');
    card.className = 'news-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    const date = new Date(news.date);
    const formattedDate = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
    });
    
    const categoryClass = news.category.toLowerCase().replace(/\s+/g, '-');
    const excerpt = news.body ? news.body.substring(0, 120) + '...' : 'No description';
    
    card.innerHTML = `
        <div class="news-category ${categoryClass}">${news.category}</div>
        <h3 class="news-title">${news.title}</h3>
        <p class="news-excerpt">${excerpt}</p>
        <div class="news-footer">
            <span class="news-date"><i class="fas fa-calendar"></i> ${formattedDate}</span>
        </div>
    `;
    
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        window.location.href = 'content/news/';
    });
    
    return card;
}

// Get list of deadline markdown files
async function getDeadlineMarkdownFiles() {
    try {
        const response = await fetch('https://api.github.com/repos/muhammadrehan-dev/Resource-Hub/contents/content/deadlines');
        
        if (!response.ok) {
            console.log('GitHub API failed for deadlines');
            return [];
        }
        
        const files = await response.json();
        
        return files
            .filter(file => file.name.endsWith('.md'))
            .map(file => ({
                name: file.name,
                url: file.download_url
            }));
    } catch (error) {
        console.error('Error fetching deadline files:', error);
        return [];
    }
}

// Load upcoming deadlines from markdown files
async function loadUpcomingDeadlinesFromMarkdown() {
    const deadlinesGrid = document.getElementById('deadlinesGrid');
    
    try {
        const markdownFiles = await getDeadlineMarkdownFiles();
        
        if (markdownFiles.length === 0) {
            // Fallback to JSON if no markdown files
            loadUpcomingDeadlinesFromJSON();
            return;
        }
        
        // Fetch and parse all markdown files
        const deadlinePromises = markdownFiles.map(async (file) => {
            try {
                const response = await fetch(file.url);
                const markdown = await response.text();
                const { frontmatter, content } = parseFrontmatter(markdown);
                
                return {
                    title: frontmatter.title || 'Untitled',
                    subject: frontmatter.subject || 'General',
                    dueDate: new Date(frontmatter.dueDate || frontmatter.date),
                    description: content || frontmatter.description || '',
                    priority: frontmatter.priority || 'medium',
                    submissionLink: frontmatter.submissionLink || ''
                };
            } catch (error) {
                console.error(`Error loading ${file.name}:`, error);
                return null;
            }
        });
        
        let deadlines = await Promise.all(deadlinePromises);
        deadlines = deadlines.filter(item => item !== null);
        
        // Filter only upcoming (not expired)
        const now = new Date();
        deadlines = deadlines.filter(d => d.dueDate > now);
        
        // Sort by due date and take top 3
        deadlines.sort((a, b) => a.dueDate - b.dueDate);
        deadlines = deadlines.slice(0, 3);
        
        if (deadlines.length === 0) {
            deadlinesGrid.innerHTML = '<div class="deadline-placeholder"><p>No upcoming deadlines</p></div>';
            return;
        }
        
        deadlinesGrid.innerHTML = '';
        
        deadlines.forEach((deadline, index) => {
            const card = createDeadlineCardPreview(deadline, index);
            deadlinesGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading deadlines:', error);
        // Fallback to JSON
        loadUpcomingDeadlinesFromJSON();
    }
}

// Fallback: Load deadlines from JSON (existing functionality)
async function loadUpcomingDeadlinesFromJSON() {
    const deadlinesGrid = document.getElementById('deadlinesGrid');
    
    try {
        const response = await fetch('content/deadlines/deadlines.json');
        
        if (!response.ok) {
            throw new Error('Failed to load deadlines');
        }

        const data = await response.json();
        let deadlines = data.deadlines || [];
        
        // Filter only upcoming (not expired)
        const now = new Date();
        deadlines = deadlines.filter(d => new Date(d.dueDate) > now);
        
        // Sort by due date and take top 3
        deadlines.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        deadlines = deadlines.slice(0, 3);
        
        if (deadlines.length === 0) {
            deadlinesGrid.innerHTML = '<div class="deadline-placeholder"><p>No upcoming deadlines</p></div>';
            return;
        }
        
        deadlinesGrid.innerHTML = '';
        
        deadlines.forEach((deadline, index) => {
            deadline.dueDate = new Date(deadline.dueDate);
            const card = createDeadlineCardPreview(deadline, index);
            deadlinesGrid.appendChild(card);
        });
        
    } catch (error) {
        console.error('Error loading deadlines from JSON:', error);
        deadlinesGrid.innerHTML = '<div class="deadline-placeholder"><p>Unable to load deadlines. Please check back later.</p></div>';
    }
}

// Create deadline card preview for homepage
function createDeadlineCardPreview(deadline, index) {
    const card = document.createElement('div');
    card.className = 'deadline-card';
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    const dueDate = deadline.dueDate;
    const now = new Date();
    const timeLeft = dueDate - now;
    const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));
    
    const formattedDate = dueDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const priorityClass = deadline.priority || 'medium';
    let timeLeftText = '';
    let urgencyClass = '';
    
    if (daysLeft === 0) {
        timeLeftText = 'Due Today!';
        urgencyClass = 'urgent';
    } else if (daysLeft === 1) {
        timeLeftText = 'Due Tomorrow';
        urgencyClass = 'urgent';
    } else if (daysLeft <= 3) {
        timeLeftText = `${daysLeft} days left`;
        urgencyClass = 'urgent';
    } else {
        timeLeftText = `${daysLeft} days left`;
    }
    
    card.innerHTML = `
        <div class="deadline-priority priority-${priorityClass}">
            <i class="fas fa-flag"></i> ${priorityClass.toUpperCase()}
        </div>
        <div class="deadline-subject-badge">${deadline.subject}</div>
        <h3 class="deadline-title">${deadline.title}</h3>
        <p class="deadline-desc">${deadline.description}</p>
        <div class="deadline-footer">
            <span class="deadline-date"><i class="fas fa-clock"></i> ${formattedDate}</span>
            <span class="deadline-countdown ${urgencyClass}">
                <i class="fas fa-hourglass-half"></i> ${timeLeftText}
            </span>
        </div>
    `;
    
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => {
        window.location.href = 'content/deadlines/';
    });
    
    return card;
}

// Initialize subject cards with animation - MODIFIED FUNCTION
function initializeSubjectCards() {
    const subjectCards = document.querySelectorAll('.subject-card');
    
    // Reset and animate all cards
    subjectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
    });
}

// Add smooth scroll behavior for better UX
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

// Add hover effect to card links
document.addEventListener('DOMContentLoaded', function() {
    const cardLinks = document.querySelectorAll('.card-link');
    cardLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const card = this.closest('.subject-card');
            if (card) {
                card.style.transform = 'translateY(-12px) scale(1.02)';
            }
        });
        
        link.addEventListener('mouseleave', function() {
            const card = this.closest('.subject-card');
            if (card) {
                card.style.transform = '';
            }
        });
    });
});

// Console message for developers
console.log('%c🎓 DUET Resource Hub', 'color: #00bcd4; font-size: 24px; font-weight: bold;');
console.log('%cBatch 25F | Cybersecurity A2', 'color: #0097a7; font-size: 16px; font-weight: bold;');
console.log('%cMade with ❤️ by TH3 CUT3 V1RU5', 'color: #7f8c8d; font-size: 14px;');
console.log('%cNavigating to subject pages... 🚀', 'color: #27ae60; font-size: 12px; font-weight: bold;');

// Add page transition effect
window.addEventListener('beforeunload', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.3s ease';
});
