// Initialize AOS
AOS.init({
    duration: 600,
    easing: 'ease-in-out',
    once: true,
    offset: 50
});

let allDeadlines = [];
let currentFilter = 'all';
let countdownIntervals = [];

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

    // Load deadlines
    loadDeadlines();

    // Setup filter tabs
    setupFilterTabs();

    // Check for deadline reminders every hour
    setInterval(checkDeadlineReminders, 3600000);
});

// Load deadlines
async function loadDeadlines() {
    try {
        const response = await fetch('../deadlines.json');
        
        if (!response.ok) {
            throw new Error('Failed to load deadlines');
        }

        const data = await response.json();
        allDeadlines = data.deadlines || [];
        
        // Sort by due date (earliest first)
        allDeadlines.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        
        // Mark expired deadlines
        const now = new Date();
        allDeadlines = allDeadlines.map(deadline => ({
            ...deadline,
            isExpired: new Date(deadline.dueDate) < now
        }));
        
        updateStats();
        displayDeadlines(allDeadlines);
        checkDeadlineReminders();
        
    } catch (error) {
        console.error('Error loading deadlines:', error);
        showEmptyState();
    }
}

// Update statistics
function updateStats() {
    const now = new Date();
    const activeDeadlines = allDeadlines.filter(d => !d.isExpired);
    const highPriority = activeDeadlines.filter(d => d.priority === 'high').length;
    
    document.getElementById('highPriorityCount').textContent = highPriority;
    document.getElementById('upcomingCount').textContent = activeDeadlines.length;
    document.getElementById('totalCount').textContent = allDeadlines.length;
}

// Display deadlines
function displayDeadlines(deadlinesArray) {
    const container = document.getElementById('deadlinesContainer');
    const emptyState = document.getElementById('emptyState');
    
    // Clear existing intervals
    countdownIntervals.forEach(interval => clearInterval(interval));
    countdownIntervals = [];
    
    // Filter deadlines
    let filteredDeadlines = deadlinesArray;
    
    if (currentFilter !== 'all') {
        if (currentFilter === 'expired') {
            filteredDeadlines = deadlinesArray.filter(d => d.isExpired);
        } else {
            filteredDeadlines = deadlinesArray.filter(d => 
                d.subject === currentFilter && !d.isExpired
            );
        }
    } else {
        filteredDeadlines = deadlinesArray.filter(d => !d.isExpired);
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Show empty state if no deadlines
    if (filteredDeadlines.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Create deadline cards
    filteredDeadlines.forEach((deadline, index) => {
        const card = createDeadlineCard(deadline, index);
        container.appendChild(card);
    });
}

// Create deadline card
function createDeadlineCard(deadline, index) {
    const card = document.createElement('div');
    const expiredClass = deadline.isExpired ? 'expired' : '';
    card.className = `deadline-card priority-${deadline.priority} ${expiredClass}`;
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', (index * 100).toString());
    
    const dueDate = new Date(deadline.dueDate);
    const formattedDate = formatDate(dueDate);
    const countdownId = `countdown-${deadline.id}`;
    
    card.innerHTML = `
        <div class="deadline-header">
            <div class="deadline-title-section">
                <h2 class="deadline-title">${deadline.title}</h2>
                <span class="deadline-subject">
                    ${getSubjectIcon(deadline.subject)}
                    ${deadline.subject}
                </span>
            </div>
            <span class="priority-badge ${deadline.priority}">
                ${getPriorityIcon(deadline.priority)}
                ${deadline.priority}
            </span>
        </div>
        
        <p class="deadline-description">${deadline.description}</p>
        
        <div class="deadline-footer">
            <div class="deadline-time">
                <div class="deadline-date">
                    <i class="fas fa-calendar-alt"></i>
                    Due: ${formattedDate}
                </div>
                <div class="countdown-timer ${getCountdownClass(dueDate, deadline.isExpired)}" id="${countdownId}">
                    ${deadline.isExpired ? '<i class="fas fa-times-circle"></i> Expired' : '<i class="fas fa-hourglass-half"></i> Calculating...'}
                </div>
            </div>
            ${deadline.submissionLink ? 
                `<a href="${deadline.submissionLink}" target="_blank" class="submit-btn ${deadline.isExpired ? 'disabled' : ''}">
                    <i class="fas fa-paper-plane"></i>
                    Submit Assignment
                </a>` : 
                `<button class="submit-btn disabled">
                    <i class="fas fa-link-slash"></i>
                    No Submission Link
                </button>`
            }
        </div>
    `;
    
    // Start countdown if not expired
    if (!deadline.isExpired) {
        const interval = setInterval(() => {
            updateCountdown(countdownId, dueDate);
        }, 1000);
        countdownIntervals.push(interval);
        updateCountdown(countdownId, dueDate);
    }
    
    return card;
}

// Update countdown timer
function updateCountdown(elementId, dueDate) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const now = new Date();
    const diff = dueDate - now;
    
    if (diff <= 0) {
        element.innerHTML = '<i class="fas fa-times-circle"></i> Expired';
        element.classList.add('expired');
        return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    let countdownText = '';
    
    if (days > 0) {
        countdownText = `${days}d ${hours}h ${minutes}m`;
    } else if (hours > 0) {
        countdownText = `${hours}h ${minutes}m ${seconds}s`;
    } else {
        countdownText = `${minutes}m ${seconds}s`;
    }
    
    element.innerHTML = `<i class="fas fa-hourglass-half"></i> ${countdownText}`;
    
    // Mark as urgent if less than 24 hours
    if (days === 0 && hours < 24) {
        element.classList.add('urgent');
    }
}

// Get countdown class
function getCountdownClass(dueDate, isExpired) {
    if (isExpired) return 'expired';
    
    const now = new Date();
    const diff = dueDate - now;
    const hoursLeft = diff / (1000 * 60 * 60);
    
    return hoursLeft < 24 ? 'urgent' : '';
}

// Format date
function formatDate(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long',
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Get subject icon
function getSubjectIcon(subject) {
    const icons = {
        'Applied Physics': '<i class="fas fa-atom"></i>',
        'ICT': '<i class="fas fa-laptop-code"></i>',
        'Programming': '<i class="fas fa-code"></i>',
        'English': '<i class="fas fa-book-open"></i>',
        'Calculus': '<i class="fas fa-square-root-alt"></i>',
        'Islamiat': '<i class="fas fa-mosque"></i>'
    };
    return icons[subject] || '<i class="fas fa-book"></i>';
}

// Get priority icon
function getPriorityIcon(priority) {
    const icons = {
        'high': '<i class="fas fa-exclamation-circle"></i>',
        'medium': '<i class="fas fa-exclamation-triangle"></i>',
        'low': '<i class="fas fa-info-circle"></i>'
    };
    return icons[priority] || '<i class="fas fa-circle"></i>';
}

// Setup filter tabs
function setupFilterTabs() {
    const tabs = document.querySelectorAll('.filter-tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentFilter = tab.getAttribute('data-filter');
            displayDeadlines(allDeadlines);
        });
    });
}

// Check deadline reminders
function checkDeadlineReminders() {
    const now = new Date();
    const oneDayLater = new Date(now.getTime() + (24 * 60 * 60 * 1000));
    
    allDeadlines.forEach(deadline => {
        const dueDate = new Date(deadline.dueDate);
        
        // Send reminder if deadline is within 24 hours
        if (dueDate > now && dueDate <= oneDayLater && !deadline.reminderSent) {
            sendDeadlineReminder(deadline);
            deadline.reminderSent = true;
        }
    });
}

// Send deadline reminder via OneSignal
function sendDeadlineReminder(deadline) {
    const hoursLeft = Math.floor((new Date(deadline.dueDate) - new Date()) / (1000 * 60 * 60));
    
    fetch('/.netlify/functions/send-notification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: `⏰ Deadline Reminder: ${deadline.subject}`,
            message: `${deadline.title} is due in ${hoursLeft} hours! Don't forget to submit.`,
            url: 'https://25fcyber.netlify.app/deadlines/'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Deadline reminder sent:', deadline.title);
        }
    })
    .catch(error => {
        console.error('Error sending reminder:', error);
    });
}

// Show empty state
function showEmptyState() {
    const container = document.getElementById('deadlinesContainer');
    const emptyState = document.getElementById('emptyState');
    container.innerHTML = '';
    emptyState.style.display = 'block';
}

// Console message
console.log('%c📅 Deadlines Page Loaded', 'color: #00bcd4; font-size: 18px; font-weight: bold;');
console.log('%cNever miss a deadline!', 'color: #7f8c8d; font-size: 12px;');
