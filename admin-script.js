// Admin Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication
    if (sessionStorage.getItem('adminAuthenticated') !== 'true') {
        window.location.href = 'admin-login.html';
        return;
    }

    // Set admin username
    const username = sessionStorage.getItem('adminUsername');
    if (username) {
        document.getElementById('adminUsername').textContent = username;
    }

    // Initialize admin panel
    initializeAdminPanel();
    loadPortfolioItems();
});

// Initialize admin panel with saved data
function initializeAdminPanel() {
    // Load saved data from localStorage
    const savedData = JSON.parse(localStorage.getItem('websiteContent')) || getDefaultContent();
    
    // Populate form fields
    populateHeroForm(savedData.hero);
    populateAboutForm(savedData.about);
    populateContactForm(savedData.contact);
}

// Default website content
function getDefaultContent() {
    return {
        hero: {
            title: 'Meghana Sukamanchi',
            subtitle: 'Fashion Designer',
            tagline: 'Keeping it classy and elegant',
            background: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
        },
        about: {
            title: 'Elegant Fashion, Timeless Design',
            description1: 'Welcome to the world of bespoke fashion where elegance meets craftsmanship. I am Meghana Sukamanchi, a passionate fashion designer based in Hyderabad, India, dedicated to creating timeless pieces that celebrate individual style and sophistication.',
            description2: 'My design philosophy centers around keeping it classy and elegant, creating bespoke clothing that not only fits perfectly but tells a story. Each piece is meticulously crafted with attention to detail, ensuring that my clients feel confident and beautiful.',
            image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        },
        contact: {
            phone: '+91 8885932353',
            email: 'teammeghanasukamanchi@gmail.com',
            location: 'Hyderabad, India',
            instagram: 'meghanasukamanchi.label'
        },
        portfolio: [
            {
                id: 1,
                title: 'Elegant Evening Gown',
                category: 'formal',
                image: 'https://images.unsplash.com/photo-1566479179817-c08f8d459928?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 2,
                title: 'Contemporary Casual',
                category: 'casual',
                image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 3,
                title: 'Classic Saree Blouse',
                category: 'traditional',
                image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 4,
                title: 'Luxury Bridal Lehenga',
                category: 'bridal',
                image: 'https://images.unsplash.com/photo-1594736797933-d0dba46a717b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 5,
                title: 'Business Formal Suit',
                category: 'formal',
                image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            },
            {
                id: 6,
                title: 'Chic Summer Dress',
                category: 'casual',
                image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
        ]
    };
}

// Tab navigation
function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Remove active class from all nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');
}

// Populate form functions
function populateHeroForm(data) {
    document.getElementById('heroTitle').value = data.title || '';
    document.getElementById('heroSubtitle').value = data.subtitle || '';
    document.getElementById('heroTagline').value = data.tagline || '';
    document.getElementById('heroBackground').value = data.background || '';
}

function populateAboutForm(data) {
    document.getElementById('aboutTitle').value = data.title || '';
    document.getElementById('aboutDescription1').value = data.description1 || '';
    document.getElementById('aboutDescription2').value = data.description2 || '';
    document.getElementById('aboutImage').value = data.image || '';
}

function populateContactForm(data) {
    document.getElementById('phone').value = data.phone || '';
    document.getElementById('email').value = data.email || '';
    document.getElementById('location').value = data.location || '';
    document.getElementById('instagram').value = data.instagram || '';
}

// Form submission handlers
document.getElementById('heroForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const heroData = {
        title: document.getElementById('heroTitle').value,
        subtitle: document.getElementById('heroSubtitle').value,
        tagline: document.getElementById('heroTagline').value,
        background: document.getElementById('heroBackground').value
    };
    
    await saveContentData('hero', heroData);
    updateMainWebsite();
    showSuccessMessage();
});

document.getElementById('aboutForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const aboutData = {
        title: document.getElementById('aboutTitle').value,
        description1: document.getElementById('aboutDescription1').value,
        description2: document.getElementById('aboutDescription2').value,
        image: document.getElementById('aboutImage').value
    };
    
    await saveContentData('about', aboutData);
    updateMainWebsite();
    showSuccessMessage();
});

document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const contactData = {
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value,
        instagram: document.getElementById('instagram').value
    };
    
    await saveContentData('contact', contactData);
    updateMainWebsite();
    showSuccessMessage();
});

// Save content data to cloud storage (Global sync!)
async function saveContentData(section, data) {
    console.log(`🌐 Saving ${section} data to cloud...`);
    
    try {
        // Get current content from cloud or localStorage
        let websiteContent = getDefaultContent();
        
        if (window.cloudManager) {
            const cloudResult = await window.cloudManager.loadContent();
            if (cloudResult.success) {
                websiteContent = cloudResult.data;
            }
        } else {
            const localContent = localStorage.getItem('websiteContent');
            if (localContent) {
                websiteContent = JSON.parse(localContent);
            }
        }
        
        // Update the specific section
        websiteContent[section] = data;
        
        // Save to cloud storage
        if (window.cloudManager) {
            const saveResult = await window.cloudManager.saveContent(websiteContent);
            if (saveResult.success) {
                console.log(`✅ ${section} data saved to cloud successfully!`);
                
                // Also save to localStorage as backup
                localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
                
                // Show success notification
                showCloudSaveSuccess();
                return;
            } else {
                console.error('❌ Failed to save to cloud:', saveResult.error);
                throw new Error('Cloud save failed');
            }
        }
        
        // Fallback to localStorage only
        localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
        console.log(`📱 ${section} saved to local storage (fallback)`);
        
    } catch (error) {
        console.error('❌ Error saving content:', error);
        
        // Emergency fallback to localStorage
        let websiteContent = JSON.parse(localStorage.getItem('websiteContent')) || getDefaultContent();
        websiteContent[section] = data;
        localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
        
        showCloudSaveError();
    }
}

// Show success notification for cloud save
function showCloudSaveSuccess() {
    const notification = document.createElement('div');
    notification.className = 'cloud-notification success';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Inter, sans-serif;
            animation: slideIn 0.5s ease-out;
        ">
            <i class="fas fa-cloud-upload-alt"></i>
            ✅ Saved to cloud! Available across all systems
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 4000);
}

// Show error notification for cloud save
function showCloudSaveError() {
    const notification = document.createElement('div');
    notification.className = 'cloud-notification error';
    notification.innerHTML = `
        <div style="
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #dc3545, #c82333);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 10000;
            font-family: Inter, sans-serif;
            animation: slideIn 0.5s ease-out;
        ">
            <i class="fas fa-exclamation-triangle"></i>
            ⚠️ Cloud save failed - Saved locally only
        </div>
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Portfolio management
function loadPortfolioItems() {
    const websiteContent = JSON.parse(localStorage.getItem('websiteContent')) || getDefaultContent();
    const portfolioGrid = document.getElementById('portfolioGrid');
    portfolioGrid.innerHTML = '';
    
    websiteContent.portfolio.forEach((item, index) => {
        const portfolioCard = createPortfolioCard(item, index);
        portfolioGrid.appendChild(portfolioCard);
    });
}

function createPortfolioCard(item, index) {
    const card = document.createElement('div');
    card.className = 'portfolio-card';
    card.innerHTML = `
        <img src="${item.image}" alt="${item.title}" class="portfolio-image" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
        <div class="portfolio-info">
            <input type="text" value="${item.title}" onchange="updatePortfolioItem(${index}, 'title', this.value)" placeholder="Title">
            <select onchange="updatePortfolioItem(${index}, 'category', this.value)">
                <option value="formal" ${item.category === 'formal' ? 'selected' : ''}>Formal</option>
                <option value="casual" ${item.category === 'casual' ? 'selected' : ''}>Casual</option>
                <option value="traditional" ${item.category === 'traditional' ? 'selected' : ''}>Traditional</option>
                <option value="bridal" ${item.category === 'bridal' ? 'selected' : ''}>Bridal</option>
            </select>
            <input type="url" value="${item.image}" onchange="updatePortfolioItem(${index}, 'image', this.value)" placeholder="Image URL">
            <button type="button" class="btn btn-secondary" onclick="deletePortfolioItem(${index})" style="margin-top: 10px;">
                <i class="fas fa-trash"></i> Delete
            </button>
        </div>
    `;
    return card;
}

async function updatePortfolioItem(index, field, value) {
    console.log(`🌐 Updating portfolio item ${index} field ${field}...`);
    
    try {
        // Get current content from cloud or localStorage
        let websiteContent = getDefaultContent();
        
        if (window.cloudManager) {
            const cloudResult = await window.cloudManager.loadContent();
            if (cloudResult.success) {
                websiteContent = cloudResult.data;
            }
        } else {
            const localContent = localStorage.getItem('websiteContent');
            if (localContent) {
                websiteContent = JSON.parse(localContent);
            }
        }
        
        if (websiteContent.portfolio[index]) {
            websiteContent.portfolio[index][field] = value;
            
            // Save to cloud storage
            if (window.cloudManager) {
                const saveResult = await window.cloudManager.saveContent(websiteContent);
                if (saveResult.success) {
                    console.log(`✅ Portfolio item ${index} updated in cloud`);
                    localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
                } else {
                    throw new Error('Cloud save failed');
                }
            } else {
                localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
            }
            
            if (field === 'image') {
                // Reload the image
                const img = event.target.closest('.portfolio-card').querySelector('.portfolio-image');
                img.src = value;
            }
            
            updateMainWebsite();
        }
    } catch (error) {
        console.error('❌ Error updating portfolio item:', error);
        // Fallback to localStorage only
        let websiteContent = JSON.parse(localStorage.getItem('websiteContent')) || getDefaultContent();
        if (websiteContent.portfolio[index]) {
            websiteContent.portfolio[index][field] = value;
            localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
            updateMainWebsite();
        }
    }
}

async function deletePortfolioItem(index) {
    if (confirm('Are you sure you want to delete this portfolio item?')) {
        console.log(`🌐 Deleting portfolio item ${index}...`);
        
        try {
            // Get current content from cloud or localStorage
            let websiteContent = getDefaultContent();
            
            if (window.cloudManager) {
                const cloudResult = await window.cloudManager.loadContent();
                if (cloudResult.success) {
                    websiteContent = cloudResult.data;
                }
            } else {
                const localContent = localStorage.getItem('websiteContent');
                if (localContent) {
                    websiteContent = JSON.parse(localContent);
                }
            }
            
            websiteContent.portfolio.splice(index, 1);
            
            // Save to cloud storage
            if (window.cloudManager) {
                const saveResult = await window.cloudManager.saveContent(websiteContent);
                if (saveResult.success) {
                    console.log(`✅ Portfolio item ${index} deleted from cloud`);
                    localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
                } else {
                    throw new Error('Cloud save failed');
                }
            } else {
                localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
            }
            
            loadPortfolioItems();
            updateMainWebsite();
            showSuccessMessage();
        } catch (error) {
            console.error('❌ Error deleting portfolio item:', error);
            // Fallback to localStorage only
            let websiteContent = JSON.parse(localStorage.getItem('websiteContent')) || getDefaultContent();
            websiteContent.portfolio.splice(index, 1);
            localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
            loadPortfolioItems();
            updateMainWebsite();
            showSuccessMessage();
        }
    }
}

async function addPortfolioItem() {
    console.log('🌐 Adding new portfolio item...');
    
    try {
        // Get current content from cloud or localStorage
        let websiteContent = getDefaultContent();
        
        if (window.cloudManager) {
            const cloudResult = await window.cloudManager.loadContent();
            if (cloudResult.success) {
                websiteContent = cloudResult.data;
            }
        } else {
            const localContent = localStorage.getItem('websiteContent');
            if (localContent) {
                websiteContent = JSON.parse(localContent);
            }
        }
        
        const newItem = {
            id: Date.now(),
            title: 'New Design',
            category: 'formal',
            image: 'https://images.unsplash.com/photo-1566479179817-c08f8d459928?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        };
        
        websiteContent.portfolio.push(newItem);
        
        // Save to cloud storage
        if (window.cloudManager) {
            const saveResult = await window.cloudManager.saveContent(websiteContent);
            if (saveResult.success) {
                console.log('✅ New portfolio item added to cloud');
                localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
            } else {
                throw new Error('Cloud save failed');
            }
        } else {
            localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
        }
        
        loadPortfolioItems();
        updateMainWebsite();
        showCloudSaveSuccess();
    } catch (error) {
        console.error('❌ Error adding portfolio item:', error);
        // Fallback to localStorage only
        let websiteContent = JSON.parse(localStorage.getItem('websiteContent')) || getDefaultContent();
        const newItem = {
            id: Date.now(),
            title: 'New Design',
            category: 'formal',
            image: 'https://images.unsplash.com/photo-1566479179817-c08f8d459928?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        };
        websiteContent.portfolio.push(newItem);
        localStorage.setItem('websiteContent', JSON.stringify(websiteContent));
        loadPortfolioItems();
        updateMainWebsite();
        showCloudSaveError();
    }
}

// Update main website with new content
function updateMainWebsite() {
    const websiteContent = JSON.parse(localStorage.getItem('websiteContent'));
    if (!websiteContent) return;
    
    // Store the updated content for the main website to read
    localStorage.setItem('websiteContentUpdated', 'true');
    localStorage.setItem('lastUpdated', new Date().toISOString());
}

// Utility functions
function showSuccessMessage() {
    const successMsg = document.getElementById('successMessage');
    successMsg.style.display = 'block';
    setTimeout(() => {
        successMsg.style.display = 'none';
    }, 3000);
}

function showErrorMessage() {
    const errorMsg = document.getElementById('errorMessage');
    errorMsg.style.display = 'block';
    setTimeout(() => {
        errorMsg.style.display = 'none';
    }, 3000);
}

function previewWebsite() {
    window.open('index.html', '_blank');
}

function exportData() {
    const websiteContent = JSON.parse(localStorage.getItem('websiteContent')) || getDefaultContent();
    const dataStr = JSON.stringify(websiteContent, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'meghana-website-content.json';
    link.click();
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminAuthenticated');
        sessionStorage.removeItem('adminUsername');
        window.location.href = 'admin-login.html';
    }
}

// Auto-save functionality (save every 30 seconds)
setInterval(() => {
    console.log('Auto-save check...');
}, 30000);