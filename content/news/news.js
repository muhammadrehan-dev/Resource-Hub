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

    // Load news
    loadNews();

    // Setup filter tabs
    setupFilterTabs();
});

// Load news from content folder
async function loadNews() {
    try {
        // Try to fetch the news index file or use GitHub API
        // For now, we'll use a simple approach with fetch
        const response = await fetch('../content/news/index.json');
        
        if (!response.ok) {
            // If index doesn't exist, show empty state
            allNews = [];
            displayNews(allNews);
            return;
        }

        const data = await response.json();
        allNews = data.news || [];
        
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
        
        // Fallback: Try to load sample news
        allNews = getSampleNews();
        displayNews(allNews);
    }
}

// Sample news for testing
function getSampleNews() {
    return [
        {
            title: "Mid-Term Examination Schedule Released",
            date: "2025-10-10T10:00:00",
            category: "Exam",
            body: "The mid-term examination schedule for Batch 25F has been released. Please check your respective subject pages for detailed timings.\n\n**Important Points:**\n- Exams start from October 20, 2025\n- Bring your student ID card\n- No electronic devices allowed\n- Report 15 minutes before exam time",
            featured: true,
            isArchived: false
        },
        {
            title: "Programming Lab Session Rescheduled",
            date: "2025-10-08T14:30:00",
            category: "General Update",
            body: "Due to faculty availability, the Programming lab session scheduled for October 12 has been moved to October 13 at the same time (2:00 PM).\n\nPlease make note of this change and attend accordingly.",
            featured: false,
            isArchived: false
        },
        {
            title: "Urgent: Physics Assignment Deadline Extended",
            date: "2025-10-05T09:00:00",
            category: "Urgent",
            body: "Good news! The Applied Physics Lab Report 1 deadline has been extended by 3 days. New deadline is October 23, 2025.\n\nMake sure to submit your reports on time.",
            featured: false,
            isArchived: false
        },
        {
            title: "Welcome to Batch 25F Cybersecurity A2",
            date: "2025-09-01T08:00:00",
            category: "General Update",
            body: "Welcome to the DUET Resource Hub! This platform will be your central place for all course materials, announcements, and deadlines.\n\nStay connected and check regularly for updates.",
            featured: false,
            isArchived: true
        }
    ];
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
    
    const categoryClass = news.category.toLowerCase().replace(' ', '-');
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
