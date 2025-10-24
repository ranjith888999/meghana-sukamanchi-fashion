// ===== CLOUD-BASED ADMIN CONTENT INTEGRATION =====
async function loadAdminContent() {
    console.log('🌐 Loading content from cloud storage...');
    
    let websiteContent = null;
    
    try {
        // First try to load from cloud
        if (window.cloudManager) {
            const cloudResult = await window.cloudManager.loadContent();
            if (cloudResult.success) {
                websiteContent = cloudResult.data;
                console.log('✅ Content loaded from cloud:', websiteContent);
                
                // Cache to localStorage for offline fallback
                localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
            }
        }
        
        // Fallback to localStorage if cloud fails
        if (!websiteContent) {
            const localContent = localStorage.getItem('websiteContent');
            if (localContent) {
                websiteContent = JSON.parse(localContent);
                console.log('📱 Using local storage fallback');
            }
        }
    } catch (error) {
        console.error('❌ Error loading content:', error);
        return;
    }
    
    if (!websiteContent) {
        console.log('ℹ️ No content found in cloud or local storage');
        return;
    }

    // Update hero section
    if (websiteContent.hero) {
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const heroTagline = document.querySelector('.hero-tagline');
        const heroSection = document.querySelector('.hero');

        if (heroTitle) heroTitle.textContent = websiteContent.hero.title;
        if (heroSubtitle) heroSubtitle.textContent = websiteContent.hero.subtitle;
        if (heroTagline) heroTagline.textContent = websiteContent.hero.tagline;
        
        if (heroSection && websiteContent.hero.background) {
            heroSection.style.background = `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.5)), url('${websiteContent.hero.background}')`;
            heroSection.style.backgroundSize = 'cover';
            heroSection.style.backgroundPosition = 'center';
            heroSection.style.backgroundAttachment = 'fixed';
        }
    }

    // Update about section
    if (websiteContent.about) {
        const aboutTitle = document.querySelector('.about-text h3');
        const aboutParagraphs = document.querySelectorAll('.about-text p');
        const aboutImage = document.querySelector('.designer-photo');

        if (aboutTitle) aboutTitle.textContent = websiteContent.about.title;
        if (aboutParagraphs[0]) aboutParagraphs[0].textContent = websiteContent.about.description1;
        if (aboutParagraphs[1]) aboutParagraphs[1].textContent = websiteContent.about.description2;
        if (aboutImage) aboutImage.src = websiteContent.about.image;
    }

    // Update contact information
    if (websiteContent.contact) {
        // Update phone numbers
        const phoneElements = document.querySelectorAll('[href*="tel"], [href*="wa.me"]');
        phoneElements.forEach(el => {
            if (el.href.includes('tel:')) {
                el.href = `tel:${websiteContent.contact.phone.replace(/\s+/g, '')}`;
            } else if (el.href.includes('wa.me')) {
                const phoneNumber = websiteContent.contact.phone.replace(/[\s\-\+]/g, '');
                el.href = `https://wa.me/${phoneNumber}`;
            }
        });

        // Update email
        const emailElements = document.querySelectorAll('[href*="mailto"]');
        emailElements.forEach(el => {
            el.href = `mailto:${websiteContent.contact.email}`;
        });

        // Update displayed contact info
        const phoneDisplay = document.querySelector('.contact-details p');
        const emailDisplay = document.querySelectorAll('.contact-details p')[1];
        const locationDisplay = document.querySelectorAll('.contact-details p')[2];

        if (phoneDisplay) phoneDisplay.textContent = websiteContent.contact.phone;
        if (emailDisplay) emailDisplay.textContent = websiteContent.contact.email;
        if (locationDisplay) locationDisplay.textContent = websiteContent.contact.location;

        // Update Instagram links
        const instagramLinks = document.querySelectorAll('[href*="instagram"]');
        instagramLinks.forEach(el => {
            el.href = `https://instagram.com/${websiteContent.contact.instagram}`;
        });
    }

    // Update portfolio items
    if (websiteContent.portfolio) {
        updatePortfolioItems(websiteContent.portfolio);
    }
    
    console.log('✅ Website content updated successfully!');
}

function updatePortfolioItems(portfolioData) {
    const portfolioGrid = document.querySelector('.portfolio-grid');
    if (!portfolioGrid) return;

    portfolioGrid.innerHTML = '';
    
    portfolioData.forEach(item => {
        const portfolioItem = document.createElement('div');
        portfolioItem.className = 'portfolio-item';
        portfolioItem.setAttribute('data-category', item.category);
        
        portfolioItem.innerHTML = `
            <div class="portfolio-image">
                <img src="${item.image}" alt="${item.title}" class="portfolio-img">
                <div class="portfolio-overlay">
                    <h4>${item.title}</h4>
                    <p>${item.category.charAt(0).toUpperCase() + item.category.slice(1)}</p>
                </div>
            </div>
        `;
        
        portfolioGrid.appendChild(portfolioItem);
    });
    
    // Re-initialize portfolio filters after content is loaded
    initializePortfolioFilters();
}

// ===== SMOOTH SCROLLING & NAVIGATION =====
document.addEventListener('DOMContentLoaded', async function() {
    // Load initial content from cloud
    console.log('🚀 Initializing cloud sync...');
    await loadAdminContent();
    
    // Real-time sync is handled by cloud-manager.js autoSync
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animationPlayState = 'running';
            entry.target.classList.add('animate');
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', function() {
    const animatedElements = document.querySelectorAll('.service-card, .portfolio-item, .contact-item, .stat-item');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });
});

// Add CSS for animated elements
const style = document.createElement('style');
style.textContent = `
    .animate {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
    
    .service-card.animate {
        animation: slideInUp 0.6s ease forwards;
    }
    
    .portfolio-item.animate {
        animation: slideInUp 0.6s ease forwards;
    }
    
    .stat-item.animate {
        animation: slideInUp 0.6s ease forwards;
    }
    
    .contact-item.animate {
        animation: slideInLeft 0.6s ease forwards;
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);

// ===== PORTFOLIO FILTER =====
function initializePortfolioFilters() {
    console.log('🎯 Initializing portfolio filters...');
    
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');
    
    console.log(`Found ${filterButtons.length} filter buttons and ${portfolioItems.length} portfolio items`);
    
    // Remove existing event listeners to prevent duplicates
    filterButtons.forEach(button => {
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
    });
    
    // Re-select buttons after cloning
    const newFilterButtons = document.querySelectorAll('.filter-btn');
    
    newFilterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            console.log(`🎯 Filtering by: ${filter}`);
            
            // Remove active class from all buttons
            newFilterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            this.classList.add('active');
            
            // Get current portfolio items (they might be dynamic)
            const currentPortfolioItems = document.querySelectorAll('.portfolio-item');
            
            // Filter portfolio items
            currentPortfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                console.log(`Item category: ${category}, Filter: ${filter}`);
                
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    // Animate in
                    setTimeout(() => {
                        item.style.transition = 'all 0.5s ease';
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    item.style.transition = 'all 0.3s ease';
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    
                    // Hide after animation
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// Initialize filters when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize filters for any existing portfolio items
    setTimeout(() => {
        initializePortfolioFilters();
    }, 1000); // Wait for content to load
});

// Add fadeInScale animation
const portfolioStyle = document.createElement('style');
portfolioStyle.textContent = `
    @keyframes fadeInScale {
        from {
            opacity: 0;
            transform: scale(0.8);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
`;
document.head.appendChild(portfolioStyle);

// ===== FORM HANDLING =====
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const phone = formData.get('phone');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Create WhatsApp message
            const whatsappMessage = `Hi Meghana! I'm interested in your services.
            
Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}
Message: ${message}`;
            
            // Encode message for URL
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappURL = `https://wa.me/918885932353?text=${encodedMessage}`;
            
            // Open WhatsApp
            window.open(whatsappURL, '_blank');
            
            // Show success message
            showNotification('Message prepared! Opening WhatsApp...', 'success');
            
            // Reset form
            this.reset();
        });
    }
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    const notificationStyles = `
        .notification {
            position: fixed;
            top: 100px;
            right: 20px;
            background: white;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            max-width: 350px;
        }
        
        .notification.success {
            border-left: 4px solid #27ae60;
        }
        
        .notification.error {
            border-left: 4px solid #e74c3c;
        }
        
        .notification.info {
            border-left: 4px solid #d4af37;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification-content {
            padding: 1rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        
        .notification-message {
            color: #333;
            font-weight: 500;
        }
        
        .notification-close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #666;
            margin-left: 1rem;
        }
        
        .notification-close:hover {
            color: #333;
        }
    `;
    
    // Add styles to head if not already present
    if (!document.querySelector('#notification-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'notification-styles';
        styleElement.textContent = notificationStyles;
        document.head.appendChild(styleElement);
    }
    
    // Add notification to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideNotification(notification);
    }, 5000);
    
    // Add close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', () => {
        hideNotification(notification);
    });
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// ===== COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
    let startTimestamp = null;
    const start = 0;
    
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (target - start) + start);
        element.textContent = current + '+';
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Observe stat numbers for counter animation
document.addEventListener('DOMContentLoaded', function() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const statObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const text = entry.target.textContent;
                const number = parseInt(text.replace('+', ''));
                animateCounter(entry.target, number);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => {
        statObserver.observe(stat);
    });
});

// ===== PARALLAX EFFECT =====
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// ===== PRELOADER =====
document.addEventListener('DOMContentLoaded', function() {
    // Create preloader
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    preloader.innerHTML = `
        <div class="preloader-content">
            <div class="preloader-logo">Meghana Sukamanchi</div>
            <div class="preloader-spinner"></div>
        </div>
    `;
    
    // Add preloader styles
    const preloaderStyles = `
        .preloader {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            transition: opacity 0.5s ease, visibility 0.5s ease;
        }
        
        .preloader-content {
            text-align: center;
        }
        
        .preloader-logo {
            font-family: 'Playfair Display', serif;
            font-size: 2rem;
            font-weight: 600;
            background: linear-gradient(135deg, #2c3e50, #d4af37);
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 2rem;
        }
        
        .preloader-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(212, 175, 55, 0.3);
            border-top: 3px solid #d4af37;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .preloader.hidden {
            opacity: 0;
            visibility: hidden;
        }
    `;
    
    const preloaderStyleElement = document.createElement('style');
    preloaderStyleElement.textContent = preloaderStyles;
    document.head.appendChild(preloaderStyleElement);
    
    // Add preloader to body
    document.body.appendChild(preloader);
    
    // Hide preloader after page load
    window.addEventListener('load', function() {
        setTimeout(() => {
            preloader.classList.add('hidden');
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.parentNode.removeChild(preloader);
                }
            }, 500);
        }, 1000);
    });
});

// ===== SCROLL TO TOP BUTTON =====
document.addEventListener('DOMContentLoaded', function() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
    
    // Add button styles
    const scrollTopStyles = `
        .scroll-top-btn {
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #d4af37, #f4d03f);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
            transition: all 0.3s ease;
            transform: translateY(100px);
            z-index: 1000;
        }
        
        .scroll-top-btn.show {
            transform: translateY(0);
        }
        
        .scroll-top-btn:hover {
            transform: translateY(-3px) scale(1.1);
            box-shadow: 0 8px 25px rgba(212, 175, 55, 0.4);
        }
    `;
    
    const scrollTopStyleElement = document.createElement('style');
    scrollTopStyleElement.textContent = scrollTopStyles;
    document.head.appendChild(scrollTopStyleElement);
    
    // Add button to body
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ===== CONTACT LINKS =====
document.addEventListener('DOMContentLoaded', function() {
    // WhatsApp link functionality
    const whatsappLinks = document.querySelectorAll('a[href*="wa.me"], .social-icon[href*="whatsapp"]');
    whatsappLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const message = "Hi Meghana! I'm interested in your bespoke clothing services.";
            const encodedMessage = encodeURIComponent(message);
            const whatsappURL = `https://wa.me/918885932353?text=${encodedMessage}`;
            window.open(whatsappURL, '_blank');
        });
    });
    
    // Email links
    const emailLinks = document.querySelectorAll('a[href*="mailto"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const subject = "Inquiry about Bespoke Clothing Services";
            const body = "Hi Meghana,\n\nI'm interested in your bespoke clothing services. Could you please provide more information?\n\nThank you!";
            this.href = `mailto:teammeghanasukamanchi@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        });
    });
});

console.log('Meghana Sukamanchi Fashion Designer Website - JavaScript Loaded Successfully! ✨');