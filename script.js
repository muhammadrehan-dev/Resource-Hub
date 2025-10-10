// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    offset: 100
});

// Google Drive folder links - REPLACE THESE WITH YOUR ACTUAL LINKS
const googleDriveLinks = {
    'Applied Physics': 'https://drive.google.com/drive/folders/13ke3PZAf5H21Z3HIf4FQvB8bMcVZBs93?usp=drive_link' ,
    'ICT': 'https://drive.google.com/drive/folders/1x8lD7BH50vg2rp4a3HP1FhkDi13jGP6v?usp=drive_link',
    'Programming': 'https://drive.google.com/drive/folders/1DoPFcos3djeXszOefTcC4G7plo4uHtr5?usp=drive_link',
    'English': 'https://drive.google.com/drive/folders/1IE_KnH00f7GlonHLqB95XnIqoNkCK55D?usp=sharing',
    'Calculus': 'https://drive.google.com/drive/folders/1mDXAb3eBUAU3ArwzZizLijP_WzK5xP9s?usp=drive_link',
    'Islamiat': 'https://drive.google.com/drive/folders/105zMzsX1MnyAT9P6NMxMMiaxymNdiblC?usp=sharing'
};

// Handle card link clicks
document.addEventListener('DOMContentLoaded', function() {
    const cardLinks = document.querySelectorAll('.card-link');
    
    cardLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const subject = this.getAttribute('data-subject');
            const driveLink = googleDriveLinks[subject];
            
            if (driveLink) {
                // Add a smooth transition effect
                this.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    window.open(driveLink, '_blank');
                    this.style.transform = '';
                }, 150);
            } else {
                alert(`Google Drive link for ${subject} is not set yet. Please add it in script.js`);
            }
        });
    });
});

// Add loading animation to cards
const subjectCards = document.querySelectorAll('.subject-card');
subjectCards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    
    setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
    }, 100 * index);
});

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

// Console message for developers
console.log('%c🎓 DUET Resource Hub', 'color: #00bcd4; font-size: 24px; font-weight: bold;');
console.log('%cBatch 25F | Cybersecurity A2', 'color: #0097a7; font-size: 16px; font-weight: bold;');
console.log('%cMade with ❤️ by TH3 CUT3 V1RU5', 'color: #7f8c8d; font-size: 14px;');
console.log('%cDon\'t forget to update Google Drive links in script.js!', 'color: #ff6b6b; font-size: 12px; font-weight: bold;');
