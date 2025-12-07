// ===================================
// USER AUTHENTICATION SYSTEM
// ===================================
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let registeredUsers = JSON.parse(localStorage.getItem('registeredUsers')) || [];

// Check if user is logged in - always check localStorage for fresh data
function isLoggedIn() {
    currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    return currentUser !== null;
}

// Check authentication before action
function requireAuth(callback, ...args) {
    if (!isLoggedIn()) {
        showAuthAlert();
        return false;
    }
    callback(...args);
    return true;
}

// Show authentication required alert
function showAuthAlert() {
    let alertModal = document.getElementById('authAlertModal');
    if (!alertModal) {
        alertModal = document.createElement('div');
        alertModal.id = 'authAlertModal';
        alertModal.className = 'auth-alert-modal';
        alertModal.innerHTML = `
            <div class="auth-alert-content">
                <div class="auth-alert-icon">🔒</div>
                <h3>Authentication Required</h3>
                <p>You must be registered and logged in to access this resource.</p>
                <div class="auth-alert-buttons">
                    <button class="btn-login" onclick="closeAuthAlert(); document.getElementById('loginModal').classList.add('show');">Login</button>
                    <button class="btn-register" onclick="closeAuthAlert(); document.getElementById('registerModal').classList.add('show');">Register</button>
                    <button class="btn-cancel" onclick="closeAuthAlert()">Cancel</button>
                </div>
            </div>
        `;
        document.body.appendChild(alertModal);
    }
    alertModal.classList.add('active');
}

function closeAuthAlert() {
    const alertModal = document.getElementById('authAlertModal');
    if (alertModal) {
        alertModal.classList.remove('active');
    }
}

// Open Login Modal
function openLoginModal() {
    let modal = document.getElementById('loginModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loginModal';
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <span class="auth-close" onclick="closeLoginModal()">&times;</span>
                <div class="auth-header">
                    <div class="auth-icon">👤</div>
                    <h2>Welcome Back!</h2>
                    <p>Login to access all features</p>
                </div>
                <form id="loginForm" onsubmit="handleLogin(event)">
                    <div class="form-group">
                        <label for="loginEmail">📧 Email</label>
                        <input type="email" id="loginEmail" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="loginPassword">🔑 Password</label>
                        <input type="password" id="loginPassword" placeholder="Enter your password" required>
                    </div>
                    <button type="submit" class="btn-submit">Login</button>
                </form>
                <div class="auth-footer">
                    <p>Don't have an account? <a href="#" onclick="closeLoginModal(); openRegisterModal();">Register here</a></p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Open Register Modal
function openRegisterModal() {
    let modal = document.getElementById('registerModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'registerModal';
        modal.className = 'auth-modal';
        modal.innerHTML = `
            <div class="auth-modal-content">
                <span class="auth-close" onclick="closeRegisterModal()">&times;</span>
                <div class="auth-header">
                    <div class="auth-icon">📝</div>
                    <h2>Create Account</h2>
                    <p>Register to access all features</p>
                </div>
                <form id="registerForm" onsubmit="handleRegister(event)">
                    <div class="form-group">
                        <label for="regName">👤 Full Name</label>
                        <input type="text" id="regName" placeholder="Enter your full name" required>
                    </div>
                    <div class="form-group">
                        <label for="regEmail">📧 Email</label>
                        <input type="email" id="regEmail" placeholder="Enter your email" required>
                    </div>
                    <div class="form-group">
                        <label for="regPassword">🔑 Password</label>
                        <input type="password" id="regPassword" placeholder="Create a password" minlength="6" required>
                    </div>
                    <div class="form-group">
                        <label for="regConfirmPassword">🔐 Confirm Password</label>
                        <input type="password" id="regConfirmPassword" placeholder="Confirm your password" required>
                    </div>
                    <button type="submit" class="btn-submit">Register</button>
                </form>
                <div class="auth-footer">
                    <p>Already have an account? <a href="#" onclick="closeRegisterModal(); openLoginModal();">Login here</a></p>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
    const modal = document.getElementById('registerModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const user = registeredUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        closeLoginModal();
        updateAuthUI();
        showNotification(`✓ Welcome back, ${user.name}!`);
    } else {
        showNotification('❌ Invalid email or password');
    }
}

// Handle Register
function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('❌ Passwords do not match');
        return;
    }
    
    if (registeredUsers.find(u => u.email === email)) {
        showNotification('❌ Email already registered');
        return;
    }
    
    const newUser = { name, email, password, registeredAt: new Date().toISOString() };
    registeredUsers.push(newUser);
    localStorage.setItem('registeredUsers', JSON.stringify(registeredUsers));
    
    currentUser = newUser;
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    closeRegisterModal();
    updateAuthUI();
    showNotification(`✓ Welcome, ${name}! Registration successful.`);
}

// Handle Logout
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    updateAuthUI();
    showNotification('✓ You have been logged out');
}

// Update UI based on auth state
function updateAuthUI() {
    // Get existing HTML elements
    const authButtons = document.getElementById('authButtons');
    const userProfile = document.getElementById('userProfile');
    const userName = document.getElementById('userName');
    
    // Also remove any dynamically created userInfo elements (cleanup duplicates)
    const oldUserInfo = document.getElementById('userInfo');
    if (oldUserInfo) oldUserInfo.remove();
    
    // Remove any duplicate user-info divs in header-nav
    document.querySelectorAll('.header-nav .user-info').forEach(el => el.remove());
    
    if (isLoggedIn()) {
        // Hide login/register buttons, show user profile
        if (authButtons) authButtons.style.display = 'none';
        if (userProfile) {
            userProfile.style.display = 'flex';
            if (userName) userName.textContent = currentUser.name;
        }
    } else {
        // Show login/register buttons, hide user profile
        if (authButtons) authButtons.style.display = 'flex';
        if (userProfile) userProfile.style.display = 'none';
    }
}

// Protected link click handler
function protectedLink(url) {
    console.log('protectedLink called, isLoggedIn:', isLoggedIn());
    if (!isLoggedIn()) {
        showAuthAlert();
        return false;
    }
    window.open(url, '_blank');
    return true;
}

// Protected download handler
function protectedDownload(downloadFunc) {
    console.log('protectedDownload called, isLoggedIn:', isLoggedIn());
    if (!isLoggedIn()) {
        showAuthAlert();
        return false;
    }
    downloadFunc();
    return true;
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', function() {
    updateAuthUI();
});

// ===================================
// DAY 5 DOWNLOAD FUNCTION
// ===================================
function downloadDay5Info() {
    if (!isLoggedIn()) { showAuthAlert(); return; }
    showNotification('⏳ Preparing Day 5 report download...');
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Day 5 - Tulu Dimtu & Bale Mountains - Field Trip Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #2d5016; text-align: center; border-bottom: 3px solid #2d5016; padding-bottom: 10px; }
        h2 { color: #4a7c2c; margin-top: 30px; border-bottom: 2px solid #7fb069; padding-bottom: 5px; }
        h3 { color: #3a7ca5; margin-top: 20px; }
        p { margin: 10px 0; text-align: justify; }
        ul { margin: 10px 0 10px 20px; }
        li { margin: 5px 0; }
        .badge { background: #7fb069; color: white; padding: 5px 15px; border-radius: 15px; display: inline-block; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #ccc; font-style: italic; color: #666; }
    </style>
</head>
<body>
    <h1>DAY 5 - HAWASSA → BALE ROBE → TULU DIMTU</h1>
    <p style="text-align: center;"><span class="badge">Mountain & Wildlife Exploration</span></p>
    
    <h2>1. Journey Narrative</h2>
    <p><strong>Route:</strong> Hawassa → Bale Robe → Tulu Dimtu → Meda Welabu University</p>
    <p>Day 5 marked the beginning of our journey into the Bale Mountains region, one of Ethiopia's most important biodiversity hotspots.</p>
    
    <h2>2. Tulu Dimtu</h2>
    <p><strong>Elevation:</strong> 4,377 meters (14,360 feet)</p>
    <p><strong>Significance:</strong> Second highest peak in Ethiopia</p>
    <p>Tulu Dimtu is located in the Bale Mountains National Park and offers spectacular views of the Afro-alpine moorland ecosystem.</p>
    
    <h3>Key Features</h3>
    <ul>
        <li>Afro-alpine moorland - largest in Africa</li>
        <li>Giant lobelia plants</li>
        <li>Unique high-altitude vegetation</li>
        <li>Spectacular panoramic views</li>
        <li>Cool mountain climate</li>
    </ul>
    
    <h2>3. Bale Mountains National Park</h2>
    <p><strong>Area:</strong> 2,200 km²</p>
    <p><strong>Established:</strong> 1970</p>
    <p><strong>UNESCO:</strong> World Heritage Site candidate</p>
    
    <h3>Endemic Wildlife</h3>
    <ul>
        <li><strong>Ethiopian Wolf:</strong> World's rarest canid (fewer than 500 remain)</li>
        <li><strong>Mountain Nyala:</strong> Endemic antelope species</li>
        <li><strong>Giant Mole Rat:</strong> Primary prey of Ethiopian Wolf</li>
        <li><strong>Bale Monkey:</strong> Endemic primate</li>
        <li>Over 280 bird species (many endemic)</li>
    </ul>
    
    <h3>Ecosystems</h3>
    <ul>
        <li>Afro-alpine moorland (above 3,500m)</li>
        <li>Ericaceous belt (heather zone)</li>
        <li>Hagenia-Juniper forest</li>
        <li>Harenna Forest (largest cloud forest in Ethiopia)</li>
    </ul>
    
    <h2>4. Meda Welabu University</h2>
    <p>Our accommodation for the night was at Meda Welabu University, providing comfortable facilities for the group.</p>
    
    <h2>5. Tourism Components (Four A's)</h2>
    <h3>Attractions</h3>
    <ul>
        <li>Tulu Dimtu peak and viewpoints</li>
        <li>Endemic wildlife viewing</li>
        <li>Unique Afro-alpine landscape</li>
        <li>Birdwatching opportunities</li>
    </ul>
    
    <h3>Accessibility</h3>
    <ul>
        <li>Road from Hawassa via Bale Robe</li>
        <li>4x4 vehicles recommended for park roads</li>
        <li>Park headquarters at Dinsho</li>
    </ul>
    
    <h3>Amenities</h3>
    <ul>
        <li>Park visitor center</li>
        <li>Guided tours available</li>
        <li>Camping facilities</li>
        <li>Basic lodges in nearby towns</li>
    </ul>
    
    <h3>Accommodation</h3>
    <ul>
        <li>Bale Mountain Lodge (luxury)</li>
        <li>Goba hotels</li>
        <li>Dinsho guesthouses</li>
        <li>University accommodations</li>
    </ul>
    
    <h2>6. Conservation Importance</h2>
    <p>The Bale Mountains are critical for:</p>
    <ul>
        <li>Ethiopian Wolf conservation (largest population)</li>
        <li>Water catchment for millions of people</li>
        <li>Endemic species protection</li>
        <li>Climate research</li>
    </ul>
    
    <div class="footer">
        <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        <p>Tourism & Hotel Management Field Trip - Day 5</p>
        <p>Bale Mountains Region, Ethiopia</p>
    </div>
</body>
</html>`;
    
    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Day5_Tulu_Dimtu_Bale_Mountains_Report.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('✓ Day 5 report downloaded successfully!');
}

// ===================================
// DAY 4 DOWNLOAD FUNCTIONS
// ===================================
function downloadDay4Section(sectionName) {
    if (!isLoggedIn()) { showAuthAlert(); return; }
    const sections = {
        'day4-a': {
            title: 'Amora Gedle (Gudumale Park)',
            type: 'Public Park',
            content: `
                <h2>AMORA GEDLE (GUDUMALE PARK)</h2>
                <p><strong>Type:</strong> Public Park</p>
                <p><strong>Location:</strong> Beside Lake Hawassa, Hawassa City</p>
                
                <h3>Description</h3>
                <p>Amora Gedle is a peaceful public park located beside Lake Hawassa. It is known for its green trees, walking paths, birds, and open relaxation areas. Locals come here for jogging, resting, and enjoying the fresh lake breeze. The park offers a calm environment inside the busy city.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>Green trees and natural shade</li>
                    <li>Walking and jogging paths</li>
                    <li>Bird watching opportunities</li>
                    <li>Open relaxation areas</li>
                    <li>Fresh lake breeze</li>
                    <li>Peaceful environment</li>
                </ul>
                
                <h3>Activities</h3>
                <ul>
                    <li>Morning jogging</li>
                    <li>Family picnics</li>
                    <li>Bird watching</li>
                    <li>Photography</li>
                    <li>Relaxation and meditation</li>
                </ul>
            `
        },
        'day4-b': {
            title: 'Hawassa Fish Market',
            type: 'Cultural Site',
            content: `
                <h2>HAWASSA FISH MARKET</h2>
                <p><strong>Type:</strong> Cultural & Culinary Site</p>
                <p><strong>Location:</strong> Lake Hawassa Shore, Hawassa City</p>
                
                <h3>Description</h3>
                <p>The Fish Market is one of the most cultural places in Hawassa. Here, fishermen bring fresh fish, clean it, and prepare it for visitors. People gather to eat fresh fried fish, see pelicans waiting for leftovers, and watch daily local activities. It's a lively and authentic spot that shows the real lifestyle of the community.</p>
                
                <h3>Key Features</h3>
                <ul>
                    <li>Fresh fish directly from Lake Hawassa</li>
                    <li>Traditional fish preparation</li>
                    <li>Pelicans and other birds</li>
                    <li>Local fishermen activities</li>
                    <li>Authentic cultural experience</li>
                </ul>
                
                <h3>What to Experience</h3>
                <ul>
                    <li>Watch fishermen bring in their catch</li>
                    <li>See fish being cleaned and prepared</li>
                    <li>Taste fresh fried tilapia</li>
                    <li>Observe pelicans waiting for scraps</li>
                    <li>Experience local community life</li>
                </ul>
                
                <h3>Best Time to Visit</h3>
                <p>Early morning (6-8 AM) for the freshest fish and most activity</p>
            `
        },
        'day4-c': {
            title: 'Lewi Resort Hawassa',
            type: 'Resort Hotel',
            content: `
                <h2>LEWI RESORT HAWASSA</h2>
                <p><strong>Type:</strong> Mid-to-Upper Range Resort</p>
                <p><strong>Location:</strong> Lake Hawassa Shore</p>
                <p><strong>Established:</strong> Part of Lewi Hotels & Resorts chain (since 1992)</p>
                
                <h3>Description</h3>
                <p>Lewi Resort is a popular lakeside resort known for its natural style, wooden design, quiet atmosphere, and relaxing gardens. It provides restaurants, swimming pools, conference halls, and beautiful lake views.</p>
                
                <h3>Facilities</h3>
                <ul>
                    <li>Restaurant/Café</li>
                    <li>Swimming Pool</li>
                    <li>Spa/Massage Services</li>
                    <li>Fitness Center</li>
                    <li>Free WiFi</li>
                    <li>Free Private Parking</li>
                    <li>Free Bicycle Rental</li>
                    <li>Business Center</li>
                    <li>4 Meeting Halls</li>
                    <li>Garden & Barbecue Area</li>
                </ul>
                
                <h3>Room Options</h3>
                <p>Approximately 62 rooms with more than 9 room type options including singles, suites, family rooms, lakefront, and garden view.</p>
                
                <h3>Department Services</h3>
                <ul>
                    <li>24-hour Front Desk</li>
                    <li>Reservations & Booking</li>
                    <li>Housekeeping & Room Service</li>
                    <li>Food & Beverage</li>
                    <li>Wellness & Recreation</li>
                    <li>Business & Events</li>
                    <li>Guest Services</li>
                </ul>
            `
        },
        'day4-d': {
            title: 'Haile Resort Hawassa',
            type: 'Luxury Resort',
            content: `
                <h2>HAILE RESORT HAWASSA</h2>
                <p><strong>Type:</strong> Upscale Full-Service Resort</p>
                <p><strong>Location:</strong> Lake Hawassa Shore</p>
                <p><strong>Established:</strong> Part of Haile Hotels & Resorts chain (founded 2010)</p>
                <p><strong>Owner:</strong> Olympic Champion Haile Gebrselassie</p>
                
                <h3>Description</h3>
                <p>Haile Resort is one of Hawassa's most modern and well-developed resorts. It offers luxury accommodation, clean rooms, sports facilities, lakeside restaurants, and wide gardens. Many local and international visitors choose it for holidays, conferences, and family trips.</p>
                
                <h3>Facilities</h3>
                <ul>
                    <li>Multiple Restaurants & Bars</li>
                    <li>Spa/Wellness Centre</li>
                    <li>Outdoor Swimming Pool with Water Slide</li>
                    <li>Children's Pool</li>
                    <li>Kids-Friendly Amenities</li>
                    <li>Conference Halls (up to 3000 capacity)</li>
                    <li>Free WiFi</li>
                    <li>Parking</li>
                    <li>Shuttle Services</li>
                    <li>Fitness/Gym</li>
                </ul>
                
                <h3>Room Features</h3>
                <ul>
                    <li>Air-conditioning</li>
                    <li>Balcony (lake/pool view)</li>
                    <li>Private Bathrooms</li>
                    <li>Seating Area</li>
                    <li>TV with Cable</li>
                    <li>Coffee/Tea Maker</li>
                </ul>
                
                <h3>Event Capacity</h3>
                <ul>
                    <li>Small Meetings: 15-20 persons</li>
                    <li>Conferences: 100-500 persons</li>
                    <li>Large Events: up to 3000 persons</li>
                </ul>
                
                <h3>Department Services</h3>
                <ul>
                    <li>24-hour Front Desk & Concierge</li>
                    <li>Central Reservation System</li>
                    <li>Daily Housekeeping & 24-hour Room Service</li>
                    <li>Multiple F&B Outlets</li>
                    <li>Full Spa & Recreation</li>
                    <li>Events & Conference Department</li>
                    <li>Guest Services (shuttle, tours, rentals)</li>
                    <li>Security & Maintenance</li>
                </ul>
            `
        }
    };

    const section = sections[sectionName];
    if (!section) {
        showNotification('❌ Section information not found');
        return;
    }

    showNotification(`⏳ Preparing ${section.title} download...`);

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${section.title} - Field Trip Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #2d5016; text-align: center; border-bottom: 3px solid #2d5016; padding-bottom: 10px; }
        h2 { color: #4a7c2c; margin-top: 30px; }
        h3 { color: #3a7ca5; margin-top: 20px; }
        p { margin: 10px 0; }
        ul { margin: 10px 0 10px 20px; }
        li { margin: 5px 0; }
        .badge { background: #7fb069; color: white; padding: 5px 15px; border-radius: 15px; display: inline-block; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #ccc; font-style: italic; color: #666; }
    </style>
</head>
<body>
    <h1>${section.title.toUpperCase()}</h1>
    <p style="text-align: center;"><span class="badge">${section.type}</span></p>
    ${section.content}
    <div class="footer">
        <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        <p>Tourism & Hotel Management Field Trip - Day 4</p>
        <p>Hawassa, Ethiopia</p>
    </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${section.title.replace(/[^a-zA-Z0-9]/g, '_')}_Report.doc`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    showNotification(`✓ ${section.title} downloaded successfully!`);
}

// ===================================
// HAWASSA CITY - LEARN MORE INFO
// ===================================
function showHawassaInfo() {
    if (!isLoggedIn()) { showAuthAlert(); return; }
    // Create modal if it doesn't exist
    let modal = document.getElementById('hawassaInfoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'hawassaInfoModal';
        modal.className = 'info-modal';
        modal.innerHTML = `
            <div class="info-modal-content">
                <span class="info-modal-close" onclick="closeHawassaInfo()">&times;</span>
                <div class="info-modal-header">
                    <h2>🏙️ Hawassa City - Complete Guide</h2>
                    <span class="info-badge">Sidama Region, Ethiopia</span>
                </div>
                <div class="info-modal-body">
                    <div class="info-section">
                        <h3>📍 Location & Geography</h3>
                        <ul>
                            <li><strong>Region:</strong> Sidama Region (formerly part of SNNPR)</li>
                            <li><strong>Distance from Addis Ababa:</strong> 275 km south</li>
                            <li><strong>Elevation:</strong> 1,708 meters above sea level</li>
                            <li><strong>Population:</strong> Approximately 400,000+</li>
                            <li><strong>Lake Hawassa:</strong> 90 km² freshwater lake</li>
                        </ul>
                    </div>
                    
                    <div class="info-section">
                        <h3>🎯 Major Attractions</h3>
                        <ul>
                            <li><strong>Lake Hawassa:</strong> Beautiful freshwater lake with hippos, diverse birdlife, and scenic boat rides</li>
                            <li><strong>Fish Market:</strong> Famous morning fish market where fishermen sell fresh catch</li>
                            <li><strong>Amora Gedel Park:</strong> Urban park with colobus monkeys and walking trails</li>
                            <li><strong>Hawassa Stadium:</strong> Modern sports facility hosting national events</li>
                            <li><strong>Sidama Cultural Museum:</strong> Showcasing local heritage and traditions</li>
                        </ul>
                    </div>
                    
                    <div class="info-section">
                        <h3>🏨 Accommodation Options</h3>
                        <ul>
                            <li><strong>Haile Resort:</strong> Luxury lakeside resort owned by Olympic champion Haile Gebrselassie</li>
                            <li><strong>Lewi Resort:</strong> Mid-range resort with excellent lake views</li>
                            <li><strong>Hawassa Referral Hotel:</strong> Budget-friendly option in city center</li>
                            <li><strong>Southern Star Hotel:</strong> Business hotel with conference facilities</li>
                            <li><strong>Pinna Hotel:</strong> Modern hotel near the lake</li>
                        </ul>
                    </div>
                    
                    <div class="info-section">
                        <h3>🍽️ Local Cuisine</h3>
                        <ul>
                            <li><strong>Fresh Tilapia:</strong> Grilled or fried fish from Lake Hawassa</li>
                            <li><strong>Kitfo:</strong> Traditional Ethiopian minced raw beef</li>
                            <li><strong>Injera with Wot:</strong> Spongy bread with various stews</li>
                            <li><strong>Sidama Coffee:</strong> World-renowned coffee from the region</li>
                            <li><strong>Fresh Fruit Juices:</strong> Avocado, mango, papaya blends</li>
                        </ul>
                    </div>
                    
                    <div class="info-section">
                        <h3>🎭 Cultural Significance</h3>
                        <ul>
                            <li><strong>Sidama People:</strong> One of Ethiopia's largest ethnic groups</li>
                            <li><strong>Fichee-Chambalaalla:</strong> Sidama New Year celebration (UNESCO recognized)</li>
                            <li><strong>Traditional Music:</strong> Unique Sidama songs and dances</li>
                            <li><strong>Coffee Ceremony:</strong> Important cultural tradition</li>
                        </ul>
                    </div>
                    
                    <div class="info-section">
                        <h3>🚗 How to Get There</h3>
                        <ul>
                            <li><strong>By Road:</strong> 4-5 hours drive from Addis Ababa via excellent highway</li>
                            <li><strong>By Air:</strong> Hawassa Airport with domestic flights from Addis Ababa</li>
                            <li><strong>Public Transport:</strong> Regular bus services from Addis Ababa (Meskel Square)</li>
                        </ul>
                    </div>
                    
                    <div class="info-section highlight">
                        <h3>💡 Travel Tips</h3>
                        <ul>
                            <li>Best time to visit: October to March (dry season)</li>
                            <li>Visit the fish market early morning (6-8 AM) for the best experience</li>
                            <li>Bring binoculars for birdwatching at the lake</li>
                            <li>Try the local Sidama coffee - it's exceptional!</li>
                            <li>Respect local customs and dress modestly</li>
                        </ul>
                    </div>
                </div>
                <div class="info-modal-footer">
                    <a href="https://en.wikipedia.org/wiki/Hawassa" target="_blank" class="btn-wiki">📖 Wikipedia</a>
                    <a href="https://www.google.com/maps/place/Hawassa,+Ethiopia" target="_blank" class="btn-map">📍 Google Maps</a>
                    <button onclick="closeHawassaInfo()" class="btn-close-modal">Close</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeHawassaInfo() {
    const modal = document.getElementById('hawassaInfoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// ===================================
// MOBILE MENU TOGGLE
// ===================================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const sidebar = document.getElementById('sidebar');

mobileMenuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    }
});

// ===================================
// SMOOTH SCROLL NAVIGATION
// ===================================
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Update progress
        updateProgress();
        
        // Get target section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Smooth scroll to section
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 20;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu after clicking
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// ===================================
// SIDEBAR SEARCH FUNCTIONALITY
// ===================================
const sidebarSearch = document.getElementById('sidebarSearch');
let searchResults = [];
let selectedSearchIndex = 0;

if (sidebarSearch) {
    // Real-time search while typing
    sidebarSearch.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase().trim();
        const navItems = document.querySelectorAll('.nav-list li');
        searchResults = [];
        selectedSearchIndex = 0;
        
        navItems.forEach((item, index) => {
            const link = item.querySelector('.nav-link');
            const title = link.querySelector('.day-title').textContent.toLowerCase();
            const subtitle = link.querySelector('.day-subtitle').textContent.toLowerCase();
            const dayBadge = link.querySelector('.day-badge').textContent;
            
            // Check if search term matches
            const titleMatch = title.includes(searchTerm);
            const subtitleMatch = subtitle.includes(searchTerm);
            const dayMatch = dayBadge.includes(searchTerm);
            
            if (searchTerm && (titleMatch || subtitleMatch || dayMatch)) {
                item.style.display = 'block';
                // Highlight matching items
                link.style.background = 'rgba(129, 195, 215, 0.25)';
                link.style.border = '2px solid rgba(129, 195, 215, 0.5)';
                
                // Add to search results
                searchResults.push({
                    element: link,
                    item: item,
                    href: link.getAttribute('href'),
                    title: link.querySelector('.day-title').textContent,
                    subtitle: link.querySelector('.day-subtitle').textContent
                });
                
                // Add search result indicator
                if (!link.querySelector('.search-match')) {
                    const matchBadge = document.createElement('span');
                    matchBadge.className = 'search-match';
                    matchBadge.textContent = '✓';
                    link.appendChild(matchBadge);
                }
            } else if (searchTerm) {
                item.style.display = 'none';
                link.style.border = 'none';
                // Remove search match badge
                const matchBadge = link.querySelector('.search-match');
                if (matchBadge) matchBadge.remove();
            } else {
                // Reset when search is empty
                item.style.display = 'block';
                link.style.border = 'none';
                if (!link.classList.contains('active')) {
                    link.style.background = 'rgba(255,255,255,0.05)';
                }
                // Remove search match badge
                const matchBadge = link.querySelector('.search-match');
                if (matchBadge) matchBadge.remove();
            }
        });
        
        // Show search results count
        updateSearchCounter(searchTerm, searchResults.length);
        
        if (searchTerm && searchResults.length > 0) {
            // Automatically highlight first result
            highlightSelectedResult();
        }
    });
    
    // Navigate to destination on Enter key
    sidebarSearch.addEventListener('keydown', (e) => {
        const searchTerm = sidebarSearch.value.toLowerCase().trim();
        
        if (e.key === 'Enter' && searchResults.length > 0) {
            e.preventDefault();
            
            // Navigate to the first/selected search result
            const selectedResult = searchResults[selectedSearchIndex];
            
            if (selectedResult) {
                // Remove active class from all links
                navLinks.forEach(l => l.classList.remove('active'));
                
                // Add active class to selected link
                selectedResult.element.classList.add('active');
                
                // Update progress
                updateProgress();
                
                // Scroll to the section
                const targetSection = document.querySelector(selectedResult.href);
                if (targetSection) {
                    const headerHeight = 70;
                    const offsetTop = targetSection.offsetTop - headerHeight;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
                
                // Clear search and reset
                sidebarSearch.value = '';
                sidebarSearch.blur();
                resetSearch();
                
                // Show navigation notification
                showNotification(`📍 Navigated to: ${selectedResult.title}`);
                
                // Close mobile menu if open
                if (window.innerWidth <= 768) {
                    sidebar.classList.remove('active');
                    mobileMenuToggle.classList.remove('active');
                }
            }
        }
        
        // Arrow key navigation through search results
        if (searchResults.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                selectedSearchIndex = (selectedSearchIndex + 1) % searchResults.length;
                highlightSelectedResult();
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                selectedSearchIndex = (selectedSearchIndex - 1 + searchResults.length) % searchResults.length;
                highlightSelectedResult();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            sidebarSearch.value = '';
            resetSearch();
            sidebarSearch.blur();
        }
    });
    
    // Clear search when clicking outside
    document.addEventListener('click', (e) => {
        if (!sidebar.contains(e.target)) {
            if (sidebarSearch.value && searchResults.length > 0) {
                // Don't clear, just remove highlights
            }
        }
    });
}

// Highlight selected search result
function highlightSelectedResult() {
    searchResults.forEach((result, index) => {
        if (index === selectedSearchIndex) {
            result.element.style.background = 'rgba(129, 195, 215, 0.4)';
            result.element.style.transform = 'translateX(8px)';
            result.element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
            result.element.style.background = 'rgba(129, 195, 215, 0.25)';
            result.element.style.transform = 'translateX(5px)';
        }
    });
}

// Reset search state
function resetSearch() {
    const navItems = document.querySelectorAll('.nav-list li');
    searchResults = [];
    selectedSearchIndex = 0;
    
    navItems.forEach(item => {
        item.style.display = 'block';
        const link = item.querySelector('.nav-link');
        link.style.border = 'none';
        if (!link.classList.contains('active')) {
            link.style.background = 'rgba(255,255,255,0.05)';
            link.style.transform = 'translateX(0)';
        }
        // Remove search match badges
        const matchBadge = link.querySelector('.search-match');
        if (matchBadge) matchBadge.remove();
    });
}

// Update search counter
function updateSearchCounter(searchTerm, count) {
    let counter = document.querySelector('.search-counter');
    
    if (!counter) {
        counter = document.createElement('div');
        counter.className = 'search-counter';
        const searchInput = document.getElementById('sidebarSearch');
        searchInput.parentElement.appendChild(counter);
    }
    
    if (searchTerm) {
        if (count > 0) {
            counter.textContent = `${count} result${count > 1 ? 's' : ''}`;
            counter.style.background = 'rgba(127, 176, 105, 0.9)';
        } else {
            counter.textContent = 'No results';
            counter.style.background = 'rgba(244, 67, 54, 0.9)';
        }
        counter.style.display = 'block';
    } else {
        counter.style.display = 'none';
    }
}

// Show search notification
function showSearchNotification(message) {
    // Remove existing search notification
    const existingNotif = document.querySelector('.search-notification');
    if (existingNotif) existingNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = 'search-notification';
    notification.textContent = message;
    
    const searchContainer = document.querySelector('.sidebar-search');
    searchContainer.appendChild(notification);
    
    // Auto remove after 2 seconds
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// ===================================
// PROGRESS TRACKING
// ===================================
function updateProgress() {
    const totalDays = 9;
    const activeLink = document.querySelector('.nav-link.active');
    
    if (activeLink) {
        const dayNumber = parseInt(activeLink.getAttribute('data-day')) || 0;
        const percentage = Math.round((dayNumber / totalDays) * 100);
        
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = document.getElementById('progressPercentage');
        
        if (progressFill && progressPercentage) {
            progressFill.style.width = percentage + '%';
            progressPercentage.textContent = percentage + '%';
        }
    }
}

// Initialize progress on page load
document.addEventListener('DOMContentLoaded', () => {
    updateProgress();
});

// ===================================
// FOOTER LINKS NAVIGATION
// ===================================
const footerLinks = document.querySelectorAll('.footer-link');

footerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all footer links
        footerLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get target section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Smooth scroll to section
        if (targetSection) {
            const headerHeight = 70;
            const offsetTop = targetSection.offsetTop - headerHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
        
        // Close mobile menu after clicking
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            mobileMenuToggle.classList.remove('active');
        }
    });
});

// Update active footer link on scroll
window.addEventListener('scroll', () => {
    const scrollPos = window.pageYOffset + 150;
    
    // Check footer link sections
    const footerSections = ['executive-summary', 'intro', 'summary', 'contact'];
    
    footerSections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                footerLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
});

// ===================================
// ACTIVE NAVIGATION ON SCROLL
// ===================================
const sections = document.querySelectorAll('.day-section');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// ===================================
// COLLAPSIBLE SECTIONS (SWOT & IMPACTS)
// ===================================
function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    const button = window.event ? window.event.target : document.activeElement;
    
    if (section.classList.contains('active')) {
        section.classList.remove('active');
        button.innerHTML = button.innerHTML.replace('▲', '▼');
    } else {
        section.classList.add('active');
        button.innerHTML = button.innerHTML.replace('▼', '▲');
    }
}

// ===================================
// IMAGE LIGHTBOX
// ===================================
function openLightbox(img) {
    // Create lightbox if it doesn't exist
    let lightbox = document.getElementById('lightbox');
    if (!lightbox) {
        lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <span class="lightbox-close" onclick="closeLightbox()">&times;</span>
                <img id="lightbox-img" src="" alt="Enlarged view">
            </div>
        `;
        document.body.appendChild(lightbox);
    }
    
    // Set image and show lightbox
    document.getElementById('lightbox-img').src = img.src;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (lightbox) {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close lightbox on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
    }
});

// Close lightbox when clicking outside image
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && e.target === lightbox) {
        closeLightbox();
    }
});

// ===================================
// DOWNLOAD DAY 2 INFO - Senkele Sanctuary
// ===================================
function downloadDay2Info() {
    if (!isLoggedIn()) { showAuthAlert(); return; }
    try {
        showNotification('⏳ Preparing Senkele Sanctuary download...');
        
        const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Day 2 - Senkele Swayne's Hartebeest Sanctuary</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #2d5016; text-align: center; border-bottom: 3px solid #2d5016; padding-bottom: 10px; }
        h2 { color: #4a7c2c; margin-top: 30px; border-bottom: 2px solid #7fb069; padding-bottom: 5px; }
        h3 { color: #3a7ca5; margin-top: 20px; }
        p { margin: 10px 0; text-align: justify; }
        ul { margin: 10px 0 10px 20px; }
        li { margin: 5px 0; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin: 20px 0; page-break-inside: avoid; }
        .badge { background: #7fb069; color: white; padding: 5px 15px; border-radius: 15px; display: inline-block; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #ccc; font-style: italic; color: #666; }
        .swot-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
        .swot-item { padding: 15px; border-radius: 10px; }
        .strengths { background: #d4edda; }
        .weaknesses { background: #f8d7da; }
        .opportunities { background: #d1ecf1; }
        .threats { background: #fff3cd; }
    </style>
</head>
<body>
    <div class="header">
        <h1>DAY 2 - SENKELE SWAYNE'S HARTEBEEST SANCTUARY</h1>
        <p style="font-size: 18px; color: #666;">FIELD TRIP REPORT</p>
        <span class="badge">Wildlife Sanctuary</span>
    </div>

    <div class="section">
        <h2>1. INTRODUCTION - JOURNEY EXPERIENCE</h2>
        <p>On the morning of Day 2, we left Shashamane and headed southwest toward the Senkele Swayne's Hartebeest Sanctuary, one of Ethiopia's most important wildlife conservation areas.</p>
        <p>As we drove, the scenery gradually changed:</p>
        <ul>
            <li>Urban houses decreased</li>
            <li>Farmlands and open grasslands began to dominate</li>
            <li>The air became cleaner and the road quieter</li>
            <li>Livestock and rural communities appeared along the route</li>
        </ul>
        <p>By the time we approached the sanctuary, the landscape had completely shifted into wide open savanna grasslands, signaling the entry to a protected wildlife habitat.</p>
    </div>

    <div class="section">
        <h2>2. ABOUT THE SANCTUARY</h2>
        <p><strong>Location:</strong> Southwest of Shashamane, Oromia Region</p>
        <p><strong>Area:</strong> Approximately 54 km²</p>
        <p><strong>Established:</strong> To protect the endangered Swayne's Hartebeest</p>
        <p><strong>Ecosystem:</strong> Savanna grassland</p>
        
        <h3>Wildlife Present</h3>
        <ul>
            <li>Swayne's Hartebeest (endemic and endangered)</li>
            <li>Various antelope species</li>
            <li>Over 180 bird species</li>
            <li>Small mammals and reptiles</li>
        </ul>
    </div>

    <div class="section">
        <h2>3. SWOT ANALYSIS</h2>
        <div class="swot-grid">
            <div class="swot-item strengths">
                <h3>Strengths</h3>
                <ul>
                    <li>Rich natural vegetation</li>
                    <li>Very close to city (easy for local tourism)</li>
                    <li>Peaceful and pollution-free environment</li>
                    <li>Affordable for domestic tourists</li>
                    <li>Educational and ecological significance</li>
                </ul>
            </div>
            <div class="swot-item weaknesses">
                <h3>Weaknesses</h3>
                <ul>
                    <li>Limited infrastructure (no modern bathrooms, cafés, or signage)</li>
                    <li>Lack of marketing and promotion</li>
                    <li>Inadequate waste management in some areas</li>
                    <li>No structured tour packages</li>
                </ul>
            </div>
            <div class="swot-item opportunities">
                <h3>Opportunities</h3>
                <ul>
                    <li>Can be upgraded into a major urban eco-park</li>
                    <li>Potential for hiking trails, picnic sites, birdwatching programs</li>
                    <li>Opportunity for community-based tourism</li>
                    <li>Could be used for research and environmental conservation projects</li>
                </ul>
            </div>
            <div class="swot-item threats">
                <h3>Threats</h3>
                <ul>
                    <li>Risk of deforestation from nearby settlements</li>
                    <li>Human encroachment and illegal wood cutting</li>
                    <li>Littering by some visitors</li>
                    <li>Lack of continuous government funding</li>
                </ul>
            </div>
        </div>
    </div>

    <div class="section">
        <h2>4. TOURISM IMPACTS</h2>
        <h3>✅ Positive Impacts</h3>
        <ul>
            <li>Generates income for local community and city administration</li>
            <li>Creates jobs (guides, guards, vendors)</li>
            <li>Encourages natural resource conservation</li>
            <li>Provides educational and recreational value</li>
            <li>Increases environmental awareness among youth</li>
        </ul>
        
        <h3>⚠️ Negative Impacts</h3>
        <ul>
            <li>Littering and pollution from irresponsible visitors</li>
            <li>Disturbance to wildlife</li>
            <li>Soil erosion on some walking trails</li>
            <li>Pressure on resources if visitor numbers grow without management</li>
        </ul>
    </div>

    <div class="section">
        <h2>5. FIELD OBSERVATIONS</h2>
        <ul>
            <li>The forest was calm and refreshing, full of natural sounds</li>
            <li>We saw children and families enjoying the natural shade</li>
            <li>Birds were visible and active, indicating a healthy ecosystem</li>
            <li>Some areas needed better maintenance and trash disposal</li>
            <li>The environment gave a clear example of how urban green spaces benefit local climate</li>
            <li>Students from another school were also visiting — proving its role as an educational hub</li>
            <li>We noticed some signs of tree cutting, showing the need for stronger conservation</li>
            <li>The overall atmosphere was peaceful, natural, and suitable for eco-tourism</li>
        </ul>
    </div>

    <div class="footer">
        <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        <p>Tourism & Hotel Management Field Trip</p>
        <p>Rift Valley & Bale-Arsi Corridor, Ethiopia</p>
    </div>
</body>
</html>`;
        
        // Create blob and download
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Day2_Senkele_Sanctuary_Report.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('✓ Senkele Sanctuary report downloaded successfully!');
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('❌ Error downloading report');
    }
}

// ===================================
// DOWNLOAD SITE INFO AS WORD-COMPATIBLE DOCUMENT
// ===================================
function downloadSiteInfo(siteName, siteId) {
    if (!isLoggedIn()) { showAuthAlert(); return; }
    try {
        showNotification(`⏳ Preparing ${siteName} download...`);
        
        // Find the destination card containing this site
        const cards = document.querySelectorAll('.destination-card');
        let siteCard = null;
        
        cards.forEach(card => {
            const header = card.querySelector('.destination-header h3');
            if (header && header.textContent.includes(siteName)) {
                siteCard = card;
            }
        });
        
        if (!siteCard) {
            showNotification(`❌ Could not find information for ${siteName}`);
            return;
        }
        
        // Build HTML content for Word
        let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${siteName} - Field Trip Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #2d5016; text-align: center; border-bottom: 3px solid #2d5016; padding-bottom: 10px; }
        h2 { color: #4a7c2c; margin-top: 30px; border-bottom: 2px solid #7fb069; padding-bottom: 5px; }
        h3 { color: #3a7ca5; margin-top: 20px; }
        p { margin: 10px 0; text-align: justify; }
        ul { margin: 10px 0 10px 20px; }
        li { margin: 5px 0; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin: 20px 0; page-break-inside: avoid; }
        .badge { background: #7fb069; color: white; padding: 5px 15px; border-radius: 15px; display: inline-block; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #ccc; font-style: italic; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>${siteName.toUpperCase()}</h1>
        <p style="font-size: 18px; color: #666;">FIELD TRIP REPORT</p>
    </div>
`;
        
        // Get site type
        const siteType = siteCard.querySelector('.destination-type');
        if (siteType) {
            htmlContent += `<p><span class="badge">${siteType.textContent}</span></p>`;
        }
        
        // Get Journey Section
        const journeySection = siteCard.querySelector('.journey-section');
        if (journeySection) {
            const journeyTitle = journeySection.querySelector('h4');
            const journeyParas = journeySection.querySelectorAll('p');
            if (journeyTitle) {
                htmlContent += `
    <div class="section">
        <h2>${journeyTitle.textContent}</h2>`;
                journeyParas.forEach(p => {
                    htmlContent += `<p>${p.textContent.trim()}</p>`;
                });
                htmlContent += `</div>`;
            }
        }
        
        // Get Arrival Experience
        const arrivalExp = siteCard.querySelector('.arrival-experience');
        if (arrivalExp) {
            const expTitle = arrivalExp.querySelector('.experience-header h4');
            const expContent = arrivalExp.querySelector('.experience-content');
            
            if (expTitle && expContent) {
                htmlContent += `
    <div class="section">
        <h2>${expTitle.textContent}</h2>`;
                
                // Get all paragraphs
                const paras = expContent.querySelectorAll('p');
                paras.forEach(p => {
                    htmlContent += `<p>${p.textContent.trim()}</p>`;
                });
                
                // Get observation list
                const obsList = expContent.querySelector('.observation-list');
                if (obsList) {
                    htmlContent += '<ul>';
                    const items = obsList.querySelectorAll('li');
                    items.forEach(item => {
                        htmlContent += `<li>${item.textContent.trim()}</li>`;
                    });
                    htmlContent += '</ul>';
                }
                
                // Get differences
                const diffSection = expContent.querySelector('.differences-section');
                if (diffSection) {
                    const diffTitle = diffSection.querySelector('h5');
                    if (diffTitle) {
                        htmlContent += `<h3>${diffTitle.textContent}</h3><ul>`;
                    }
                    const diffItems = diffSection.querySelectorAll('.difference-item');
                    diffItems.forEach(item => {
                        const text = item.querySelector('span:last-child');
                        if (text) {
                            htmlContent += `<li>${text.textContent.trim()}</li>`;
                        }
                    });
                    htmlContent += '</ul>';
                }
                
                htmlContent += `</div>`;
            }
        }
        
        // Get Park Overview
        const parkOverview = siteCard.querySelector('.park-overview');
        if (parkOverview) {
            const overviewTitle = parkOverview.querySelector('h4');
            const overviewParas = parkOverview.querySelectorAll('p');
            if (overviewTitle) {
                htmlContent += `
    <div class="section">
        <h2>${overviewTitle.textContent}</h2>`;
                overviewParas.forEach(p => {
                    htmlContent += `<p>${p.textContent.trim()}</p>`;
                });
                htmlContent += `</div>`;
            }
        }
        
        // Get description
        const description = siteCard.querySelector('.destination-description');
        if (description) {
            htmlContent += `
    <div class="section">
        <h2>DESCRIPTION</h2>
        <p>${description.textContent.trim()}</p>
    </div>`;
        }
        
        // Get expanded description if exists
        const expandedDesc = siteCard.querySelector('.destination-description-expanded');
        if (expandedDesc) {
            htmlContent += `<div class="section"><h2>DETAILED INFORMATION</h2>`;
            const paragraphs = expandedDesc.querySelectorAll('p');
            paragraphs.forEach(p => {
                htmlContent += `<p>${p.textContent.trim()}</p>`;
            });
            
            // Get wildlife lists
            const wildlifeLists = expandedDesc.querySelectorAll('.wildlife-list');
            wildlifeLists.forEach(list => {
                htmlContent += '<ul>';
                const items = list.querySelectorAll('li');
                items.forEach(item => {
                    htmlContent += `<li>${item.textContent.trim()}</li>`;
                });
                htmlContent += '</ul>';
            });
            
            // Get conservation notes
            const conservationNote = expandedDesc.querySelector('.conservation-note');
            if (conservationNote) {
                const noteText = conservationNote.querySelector('p');
                if (noteText) {
                    htmlContent += `<p><strong>Conservation Challenges:</strong> ${noteText.textContent.trim()}</p>`;
                }
            }
            htmlContent += `</div>`;
        }
        
        // Get Four A's
        const fourAs = siteCard.querySelectorAll('.four-a-item');
        if (fourAs.length > 0) {
            htmlContent += `
    <div class="section">
        <h2>FOUR A'S ANALYSIS</h2>`;
            
            fourAs.forEach(item => {
                const title = item.querySelector('h4');
                const list = item.querySelector('ul');
                if (title && list) {
                    htmlContent += `<h3>${title.textContent}</h3><ul>`;
                    const items = list.querySelectorAll('li');
                    items.forEach(li => {
                        htmlContent += `<li>${li.textContent.trim()}</li>`;
                    });
                    htmlContent += '</ul>';
                }
            });
            htmlContent += '</div>';
        }
        
        // Get SWOT Analysis
        const swotSection = siteCard.querySelector('.swot-grid');
        if (swotSection) {
            htmlContent += `
    <div class="section">
        <h2>SWOT ANALYSIS</h2>`;
            
            const swotItems = swotSection.querySelectorAll('.swot-item');
            swotItems.forEach(item => {
                const title = item.querySelector('h4');
                const list = item.querySelector('ul');
                if (title && list) {
                    htmlContent += `<h3>${title.textContent}</h3><ul>`;
                    const items = list.querySelectorAll('li');
                    items.forEach(li => {
                        htmlContent += `<li>${li.textContent.trim()}</li>`;
                    });
                    htmlContent += '</ul>';
                }
            });
            htmlContent += '</div>';
        }
        
        // Get Tourism Impacts
        const impactSection = siteCard.querySelector('.impact-grid');
        if (impactSection) {
            htmlContent += `
    <div class="section">
        <h2>TOURISM IMPACTS</h2>`;
            
            const impactItems = impactSection.querySelectorAll('.impact-item');
            impactItems.forEach(item => {
                const title = item.querySelector('h4');
                const text = item.querySelector('p');
                if (title && text) {
                    htmlContent += `
        <h3>${title.textContent}</h3>
        <p>${text.textContent.trim()}</p>`;
                }
            });
            htmlContent += '</div>';
        }
        
        // Footer
        htmlContent += `
    <div class="footer">
        <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        <p>Tourism & Hotel Management Field Trip</p>
        <p>Rift Valley & Bale-Arsi Corridor, Ethiopia</p>
    </div>
</body>
</html>`;
        
        // Create blob and download as .doc file (HTML format that Word can open)
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${siteName.replace(/\s+/g, '_')}_Report.doc`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification(`✓ ${siteName} downloaded successfully!`);
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification(`❌ Error downloading ${siteName}`);
    }
}

// ===================================
// DOWNLOAD FULL REPORT AS WORD-COMPATIBLE DOCUMENT
// ===================================
function downloadAllReport() {
    if (!isLoggedIn()) { showAuthAlert(); return; }
    try {
        showNotification('⏳ Preparing full report download...');
        
        // Build HTML content for Word
        let htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ethiopia Field Trip - Complete Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
        h1 { color: #2d5016; text-align: center; border-bottom: 3px solid #2d5016; padding-bottom: 10px; page-break-after: avoid; }
        h2 { color: #4a7c2c; margin-top: 30px; border-bottom: 2px solid #7fb069; padding-bottom: 5px; page-break-after: avoid; }
        h3 { color: #3a7ca5; margin-top: 20px; page-break-after: avoid; }
        p { margin: 10px 0; text-align: justify; }
        ul { margin: 10px 0 10px 20px; }
        li { margin: 5px 0; }
        .header { text-align: center; margin-bottom: 50px; }
        .section { margin: 30px 0; page-break-inside: avoid; }
        .day-section { page-break-before: always; }
        .badge { background: #7fb069; color: white; padding: 5px 15px; border-radius: 15px; display: inline-block; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat-box { text-align: center; padding: 15px; background: #f0f0f0; border-radius: 10px; }
        .stat-number { font-size: 32px; font-weight: bold; color: #2d5016; }
        .footer { margin-top: 50px; padding-top: 20px; border-top: 2px solid #ccc; font-style: italic; color: #666; text-align: center; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ETHIOPIA FIELD TRIP REPORT</h1>
        <p style="font-size: 18px; color: #666;">Tourism & Hotel Management</p>
        <p style="font-size: 16px; color: #666;">Rift Valley & Bale-Arsi Corridor</p>
    </div>
`;
        
        // Introduction
        const introSection = document.querySelector('.intro-section');
        if (introSection) {
            htmlContent += `
    <div class="section">
        <h2>INTRODUCTION</h2>`;
            
            const introPara = introSection.querySelector('.container > p');
            if (introPara) {
                htmlContent += `<p>${introPara.textContent.trim()}</p>`;
            }
            
            // Intro cards
            const introCards = introSection.querySelectorAll('.intro-card');
            introCards.forEach(card => {
                const title = card.querySelector('h3');
                const text = card.querySelector('p');
                if (title && text) {
                    htmlContent += `
        <h3>${title.textContent}</h3>
        <p>${text.textContent.trim()}</p>`;
                }
            });
            htmlContent += '</div>';
        }
        
        // Get all day sections
        const daySections = document.querySelectorAll('.day-section');
        
        daySections.forEach((section, index) => {
            const dayHeader = section.querySelector('.day-header h2');
            if (dayHeader) {
                htmlContent += `
    <div class="day-section">
        <h1>DAY ${index + 1}: ${dayHeader.textContent}</h1>`;
            }
            
            // Get all destination cards in this day
            const cards = section.querySelectorAll('.destination-card');
            cards.forEach(card => {
                const siteName = card.querySelector('.destination-header h3');
                const siteType = card.querySelector('.destination-type');
                const description = card.querySelector('.destination-description');
                
                if (siteName) {
                    htmlContent += `
        <div class="section">
            <h2>${siteName.textContent}</h2>`;
                    
                    if (siteType) {
                        htmlContent += `<p><span class="badge">${siteType.textContent}</span></p>`;
                    }
                    
                    if (description) {
                        htmlContent += `<p>${description.textContent.trim()}</p>`;
                    }
                    
                    // Four A's
                    const fourAs = card.querySelectorAll('.four-a-item');
                    if (fourAs.length > 0) {
                        htmlContent += '<h3>Four A\'s Analysis:</h3>';
                        
                        fourAs.forEach(item => {
                            const title = item.querySelector('h4');
                            const list = item.querySelector('ul');
                            if (title && list) {
                                htmlContent += `<p><strong>${title.textContent}</strong></p><ul>`;
                                const items = list.querySelectorAll('li');
                                items.forEach(li => {
                                    htmlContent += `<li>${li.textContent.trim()}</li>`;
                                });
                                htmlContent += '</ul>';
                            }
                        });
                    }
                    htmlContent += '</div>';
                }
            });
            htmlContent += '</div>';
        });
        
        // Summary Section
        const summary = document.querySelector('.footer-summary');
        if (summary) {
            htmlContent += `
    <div class="day-section">
        <h1>TRIP SUMMARY</h1>`;
            
            const summaryText = summary.querySelector('.summary-content > p');
            if (summaryText) {
                htmlContent += `<p>${summaryText.textContent.trim()}</p>`;
            }
            
            // Stats
            const stats = summary.querySelectorAll('.stat-card');
            if (stats.length > 0) {
                htmlContent += '<div class="stats">';
                stats.forEach(stat => {
                    const number = stat.querySelector('.stat-number');
                    const label = stat.querySelector('.stat-label');
                    if (number && label) {
                        htmlContent += `
            <div class="stat-box">
                <div class="stat-number">${number.textContent}</div>
                <div>${label.textContent}</div>
            </div>`;
                    }
                });
                htmlContent += '</div>';
            }
            
            // Key Findings
            const keyFindings = summary.querySelectorAll('.key-findings li');
            if (keyFindings.length > 0) {
                htmlContent += '<h2>Key Findings:</h2><ul>';
                keyFindings.forEach(finding => {
                    htmlContent += `<li>${finding.textContent.trim()}</li>`;
                });
                htmlContent += '</ul>';
            }
            htmlContent += '</div>';
        }
        
        // Recommendations
        const recommendations = document.querySelector('.footer-recommendations');
        if (recommendations) {
            htmlContent += `
    <div class="section">
        <h1>RECOMMENDATIONS</h1>`;
            
            const recCards = recommendations.querySelectorAll('.recommendation-card');
            recCards.forEach(card => {
                const title = card.querySelector('h3');
                const items = card.querySelectorAll('li');
                if (title) {
                    htmlContent += `<h2>${title.textContent}</h2><ul>`;
                    items.forEach(item => {
                        htmlContent += `<li>${item.textContent.trim()}</li>`;
                    });
                    htmlContent += '</ul>';
                }
            });
            htmlContent += '</div>';
        }
        
        // Conclusion
        const conclusion = document.querySelector('.footer-conclusion p');
        if (conclusion) {
            htmlContent += `
    <div class="section">
        <h1>CONCLUSION</h1>
        <p>${conclusion.textContent.trim()}</p>
    </div>`;
        }
        
        // Footer
        htmlContent += `
    <div class="footer">
        <p><strong>Generated on:</strong> ${new Date().toLocaleString()}</p>
        <p>Tourism & Hotel Management Department</p>
        <p>Ethiopia Field Trip Report 2024</p>
    </div>
</body>
</html>`;
        
        // Create blob and download as .doc file (HTML format that Word can open)
        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Ethiopia_Field_Trip_Complete_Report.doc';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        
        showNotification('✓ Full report downloaded successfully!');
        
    } catch (error) {
        console.error('Download error:', error);
        showNotification('❌ Error downloading full report');
    }
}

// ===================================
// SCROLL TO TOP BUTTON
// ===================================
window.addEventListener('scroll', () => {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'flex';
        } else {
            scrollBtn.style.display = 'none';
        }
    }
});

function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
} 


// ===================================
// SHOW MORE INFO MODAL
// ===================================
function showMoreInfo(dayId) {
    if (!isLoggedIn()) { showAuthAlert(); return; }
    const dayInfo = {
        'day1': {
            title: 'Day 1 - Departure & Rift Valley Lakes',
            content: `
                <h4>🚐 Journey Overview</h4>
                <p>Our field trip began with an early morning departure from Woliso, heading towards the Ethiopian Rift Valley.</p>
                <h4>📍 Key Destinations</h4>
                <ul>
                    <li>Lake Ziway - First stop for birdwatching</li>
                    <li>Rift Valley viewpoints</li>
                    <li>Local communities along the route</li>
                </ul>
                <h4>📚 Learning Outcomes</h4>
                <p>Understanding the geological significance of the Rift Valley and its impact on tourism development.</p>
            `
        },
        'day2': {
            title: 'Day 2 - Senkele Sanctuary',
            content: `
                <h4>🦌 Senkele Swayne's Hartebeest Sanctuary</h4>
                <p>One of Ethiopia's most important wildlife conservation areas, home to the endangered Swayne's Hartebeest.</p>
                <h4>📍 Location</h4>
                <p>Located southwest of Shashamane, covering approximately 54 km² of savanna grassland.</p>
                <h4>🐾 Wildlife</h4>
                <ul>
                    <li>Swayne's Hartebeest (endemic species)</li>
                    <li>Various antelope species</li>
                    <li>Over 180 bird species</li>
                    <li>Small mammals and reptiles</li>
                </ul>
                <h4>📚 Conservation Status</h4>
                <p>The sanctuary plays a crucial role in protecting the endangered Swayne's Hartebeest from extinction.</p>
            `
        },
        'day3': {
            title: 'Day 3 - Hawassa Region',
            content: `
                <h4>🏙️ Hawassa City</h4>
                <p>Capital of the Southern Nations, Nationalities, and Peoples' Region (SNNPR), known for its beautiful lakeside location.</p>
                <h4>📍 Key Attractions</h4>
                <ul>
                    <li>Lake Hawassa - scenic beauty and birdlife</li>
                    <li>Fish Market - local fishing culture</li>
                    <li>Gudumale Park (Amora Gedle)</li>
                    <li>Cultural sites and traditional markets</li>
                </ul>
                <h4>🏨 Tourism Infrastructure</h4>
                <p>Well-developed tourism facilities including hotels, restaurants, and transportation services.</p>
            `
        },
        'day4': {
            title: 'Day 4 - Abijatta-Shalla Lakes National Park',
            content: `
                <h4>🦩 Twin Lakes National Park</h4>
                <p>Home to two beautiful Rift Valley lakes - Abijatta and Shalla, known for flamingos and diverse birdlife.</p>
                <h4>📍 Key Features</h4>
                <ul>
                    <li>Lake Abijatta - shallow alkaline lake</li>
                    <li>Lake Shalla - deep crater lake with hot springs</li>
                    <li>Flamingo populations</li>
                    <li>Over 400 bird species</li>
                </ul>
                <h4>⚠️ Conservation Challenges</h4>
                <p>The park faces challenges from water level decline and human encroachment.</p>
            `
        },
        'day5': {
            title: 'Day 5 - Bale Mountains',
            content: `
                <h4>🏔️ Bale Mountains National Park</h4>
                <p>One of Ethiopia's most important biodiversity hotspots, home to endemic species.</p>
                <h4>🐺 Endemic Wildlife</h4>
                <ul>
                    <li>Ethiopian Wolf - world's rarest canid</li>
                    <li>Mountain Nyala - endemic antelope</li>
                    <li>Giant Mole Rat</li>
                    <li>Numerous endemic bird species</li>
                </ul>
                <h4>🌿 Ecosystems</h4>
                <p>Features Afro-alpine moorland, the largest in Africa, with unique vegetation.</p>
            `
        },
        'day6': {
            title: 'Day 6 - Sof Omar Cave',
            content: `
                <h4>🕳️ Sof Omar Cave System</h4>
                <p>One of the longest cave systems in Africa, carved by the Weyib River.</p>
                <h4>📍 Key Features</h4>
                <ul>
                    <li>16 km of explored passages</li>
                    <li>Massive chambers and pillars</li>
                    <li>Underground river</li>
                    <li>Religious and cultural significance</li>
                </ul>
                <h4>🦇 Wildlife</h4>
                <p>Home to various bat species and unique cave-dwelling organisms.</p>
            `
        },
        'day7': {
            title: 'Day 7 - Dodola & Arsi Region',
            content: `
                <h4>🏔️ Dodola Highlands</h4>
                <p>Gateway to community-based trekking and highland exploration.</p>
                <h4>📍 Activities</h4>
                <ul>
                    <li>Community-based tourism</li>
                    <li>Highland trekking</li>
                    <li>Cultural experiences</li>
                    <li>Horse riding</li>
                </ul>
                <h4>👥 Community Tourism</h4>
                <p>Local communities benefit directly from tourism through guiding and accommodation services.</p>
            `
        },
        'day8': {
            title: 'Day 8 - Arsi National Park',
            content: `
                <h4>🌲 Arsi Mountains National Park</h4>
                <p>Rich biodiversity area in the Arsi Zone of Oromia Region.</p>
                <h4>🐾 Wildlife</h4>
                <ul>
                    <li>Mountain Nyala</li>
                    <li>Menelik's Bushbuck</li>
                    <li>Various primate species</li>
                    <li>Diverse birdlife</li>
                </ul>
                <h4>🌿 Vegetation</h4>
                <p>Dense forests, bamboo thickets, and highland meadows.</p>
            `
        },
        'day9': {
            title: 'Day 9 - Return Journey',
            content: `
                <h4>🚐 Final Journey Home</h4>
                <p>The last day of our field trip, returning from Arsi University to Woliso.</p>
                <h4>📍 Stops Attempted</h4>
                <ul>
                    <li>Soder Resort - under renovation</li>
                    <li>Oromia Convention Hall - access denied</li>
                    <li>Adama city observations</li>
                </ul>
                <h4>📚 Lessons Learned</h4>
                <p>Importance of advance communication and flexibility in tourism planning.</p>
            `
        }
    };

    const info = dayInfo[dayId] || { title: 'Information', content: '<p>No additional information available.</p>' };
    
    // Create modal
    let modal = document.getElementById('moreInfoModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'moreInfoModal';
        modal.className = 'more-info-modal';
        modal.innerHTML = `
            <div class="more-info-content">
                <span class="more-info-close" onclick="closeMoreInfo()">&times;</span>
                <h3 id="moreInfoTitle"></h3>
                <div id="moreInfoBody"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('moreInfoTitle').textContent = info.title;
    document.getElementById('moreInfoBody').innerHTML = info.content;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMoreInfo() {
    const modal = document.getElementById('moreInfoModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMoreInfo();
    }
});

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.download-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'download-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide and remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}


// ===================================
// HEADER NAVIGATION
// ===================================
const headerLinks = document.querySelectorAll('.header-link');

headerLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all links
        headerLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        link.classList.add('active');
        
        // Get target section
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        // Smooth scroll to section (accounting for fixed header)
        if (targetSection) {
            const headerHeight = 70;
            const offsetTop = targetSection.offsetTop - headerHeight;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Update active header link on scroll
window.addEventListener('scroll', () => {
    const sections = ['hero', 'intro', 'contact', 'summary'];
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                headerLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('data-section') === sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        }
    });
});

// ===================================
// DARK MODE TOGGLE
// ===================================
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const body = document.body;

// Check for saved theme preference or default to light mode
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.textContent = '☀️';
}

// Toggle theme
themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    // Update icon
    if (body.classList.contains('dark-mode')) {
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
        showNotification('🌙 Dark mode enabled');
    } else {
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
        showNotification('☀️ Light mode enabled');
    }
});


// ===================================
// GALLERY IMAGE SWITCHER
// ===================================
function changeMainImage(thumbnail) {
    const mainImage = document.querySelector('#mainImage img');
    if (mainImage && thumbnail) {
        mainImage.src = thumbnail.src;
        mainImage.alt = thumbnail.alt;
        
        // Add animation effect
        mainImage.style.opacity = '0';
        setTimeout(() => {
            mainImage.style.opacity = '1';
        }, 100);
    }
}


// ===================================
// AUTHENTICATION SYSTEM
// ===================================

// Check if user is logged in on page load
window.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

function checkLoginStatus() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        showUserProfile(user.name);
    }
}

function showUserProfile(name) {
    document.getElementById('authButtons').style.display = 'none';
    document.getElementById('userProfile').style.display = 'flex';
    document.getElementById('userName').textContent = name;
}

function showAuthButtons() {
    document.getElementById('authButtons').style.display = 'flex';
    document.getElementById('userProfile').style.display = 'none';
}

// Modal Functions
function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('show');
    document.body.style.overflow = 'auto';
}

function switchToRegister() {
    closeLoginModal();
    openRegisterModal();
}

function switchToLogin() {
    closeRegisterModal();
    openLoginModal();
}

// Close modal when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === registerModal) {
        closeRegisterModal();
    }
}

// Handle Registration
function handleRegister(event) {
    event.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('❌ Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        showNotification('❌ Password must be at least 6 characters!');
        return;
    }
    
    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userExists = users.find(u => u.email === email);
    
    if (userExists) {
        showNotification('❌ User with this email already exists!');
        return;
    }
    
    // Register new user
    const newUser = {
        name: name,
        email: email,
        password: password, // In production, this should be hashed!
        registeredAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    // Auto-login after registration
    const currentUser = {
        name: newUser.name,
        email: newUser.email,
        loginAt: new Date().toISOString()
    };
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
    
    showUserProfile(newUser.name);
    document.getElementById('registerForm').reset();
    closeRegisterModal();
    showNotification(`✅ Welcome, ${newUser.name}! Registration successful.`);
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Login successful
        const currentUser = {
            name: user.name,
            email: user.email,
            loginAt: new Date().toISOString()
        };
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showUserProfile(user.name);
        closeLoginModal();
        document.getElementById('loginForm').reset();
        showNotification(`✅ Welcome back, ${user.name}!`);
    } else {
        showNotification('❌ Invalid email or password!');
    }
}

// Handle Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthUI();
        showNotification('👋 Logged out successfully!');
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================
document.addEventListener('DOMContentLoaded', () => {
    // Elements to animate
    const animatedElements = document.querySelectorAll('.destination-card, .intro-card, .day-header, .section-header');
    
    // Add base class
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
    });
    
    // Intersection Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);
    
    // Observe elements
    animatedElements.forEach((el, index) => {
        // Add staggered delay based on index within container if needed
        // For now, just observe
        observer.observe(el);
    });
});


// ===================================
// CHATBOT SYSTEM
// ===================================

// Trip Data - Contains all 9 days of field trip information
const tripData = `
DAY 1 - WOLISO TO ZIWAY
Our field trip began early in the morning from Woliso. The air was cool, and the sky still had a soft morning mist. As we started traveling, we observed the quiet movement of local people heading to markets, farmlands, and daily work. Small towns passed by, each with distinct rural lifestyles—open markets, donkey carts, and scattered teff fields. Moving further, the landscape began to change from highland greenery to wider semi-arid lowlands as we approached the Rift Valley.

ABIJATTA-SHALLA NATIONAL PARK
When we entered the park area, the atmosphere changed immediately. The land became more open, dusty, and covered with acacia trees. We saw herds of cattle grazing, warthogs running across the road, flamingos in the distance, and the smell of hot ground from geothermal activity. It was the first moment we truly felt we had entered the Great Rift Valley ecosystem. The park felt like stepping into another world — a combination of volcanic land, two massive lakes, and dry woodland. Lake Abijatta appeared shallow with wide alkaline shores, while Lake Shalla stood deep and dark blue, surrounded by steep cliffs. Along the road, we observed birds sitting on dead branches, and local communities using the land around the park for grazing and firewood collection.

LAKE LANGANO
After exploring Abijatta–Shalla National Park, we continued our journey toward Lake Langano, one of Ethiopia's most famous Rift Valley lakes. The drive was scenic: as we left the dry, open plains near Shalla, the landscape gradually became greener and more tropical. Lake Langano is known for its brownish water, which is safe for swimming because it is free from bilharzia. The lake is surrounded by resorts and recreational facilities, making it a popular weekend destination for tourists and locals alike.

DAY 2 - SENKELE SANCTUARY
Day 2 took us to Senkele Swayne's Hartebeest Sanctuary, a protected area dedicated to conserving the endangered Swayne's Hartebeest. The sanctuary is located in the Oromia Region and covers approximately 54 square kilometers. We observed the unique hartebeest species, which is endemic to Ethiopia. The sanctuary also hosts other wildlife including ostriches, warthogs, and various bird species. The landscape is characterized by open grasslands and scattered acacia trees.

ARRIVAL IN HAWASSA - UNEXPECTED DELAY
After finishing our scheduled field visits for Day 2, the group departed toward Hawassa City, heading to the planned departure/overnight area, which was arranged at Hawassa University. The trip from the previous site to Hawassa was smooth, and by evening we reached the city on time. However, upon arrival at Hawassa University's entrance, the team faced an unexpected challenge: The university did not allow immediate entry. The group was forced to wait several hours at the university gate. Students experienced boredom, fatigue, and frustration, especially after an already long travel schedule. This delay significantly impacted our evening experience and reduced the time available for rest and preparation for the next day.

DAY 3 - HAWASSA CITY
Hawassa is an important urban tourism destination located in the Sidama Region of Ethiopia. It is known for its lakeside environment, modern hotels, cultural activities, and recreational spaces. The city serves as a major hub for hospitality, conferences, and government institutions. Hawassa is located 275 km south of Addis Ababa, at an elevation of 1,708 meters above sea level, with a population of approximately 400,000+. Lake Hawassa covers 90 km² and is a beautiful freshwater lake.

WONDO GENET FOREST AND HOT SPRINGS
Wondo Genet is a famous eco-tourism destination located about 25 km from Hawassa. It is known for its natural hot springs, dense forest, and diverse wildlife. The area features therapeutic hot spring pools, lush green forests with colobus monkeys, hiking trails, and bird watching opportunities. The hot springs are believed to have healing properties and attract both local and international visitors.

LAKE HAWASSA FIKIR HIKE
Lake Hawassa Fikir Hike is a scenic walking area along the shores of Lake Hawassa. It offers beautiful views of the lake, opportunities to see hippos, diverse birdlife including pelicans and marabou storks, and a peaceful environment for relaxation. The area is popular for morning walks, photography, and enjoying the natural beauty of the lake.

DAY 4 - HAWASSA CITY TOUR
Day 4 was dedicated to exploring various attractions within Hawassa City.

AMORA GEDLE (GUDUMALE PARK)
Amora Gedle is a peaceful public park located beside Lake Hawassa. It is known for its green trees, walking paths, birds, and open relaxation areas. Locals come here for jogging, resting, and enjoying the fresh lake breeze. The park offers a calm environment inside the busy city.

HAWASSA FISH MARKET
The Fish Market is one of the most cultural places in Hawassa. Here, fishermen bring fresh fish, clean it, and prepare it for visitors. People gather to eat fresh fried fish, see pelicans waiting for leftovers, and watch daily local activities. It's a lively and authentic spot that shows the real lifestyle of the community.

LEWI RESORT HAWASSA
Lewi Resort is a popular lakeside resort known for its natural style, wooden design, quiet atmosphere, and relaxing gardens. It provides restaurants, swimming pools, conference halls, and beautiful lake views. The resort has approximately 62 rooms with more than 9 room type options including singles, suites, family rooms, lakefront, and garden view.

HAILE RESORT HAWASSA
Haile Resort is one of Hawassa's most modern and well-developed resorts, owned by Olympic Champion Haile Gebrselassie. It offers luxury accommodation, clean rooms, sports facilities, lakeside restaurants, and wide gardens. The resort has multiple restaurants and bars, spa/wellness centre, outdoor swimming pool with water slide, children's pool, and conference halls with capacity up to 3000 persons.

DAY 5 - BALE MOUNTAINS AND TULU DIMTU
Day 5 marked the beginning of our journey into the Bale Mountains region, one of Ethiopia's most important biodiversity hotspots. We traveled from Hawassa to Bale Robe and then to Tulu Dimtu.

TULU DIMTU
Tulu Dimtu is the second highest peak in Ethiopia at 4,377 meters (14,360 feet). It is located in the Bale Mountains National Park and offers spectacular views of the Afro-alpine moorland ecosystem. Key features include the largest Afro-alpine moorland in Africa, giant lobelia plants, unique high-altitude vegetation, and cool mountain climate.

BALE MOUNTAINS NATIONAL PARK
Bale Mountains National Park covers 2,200 km² and was established in 1970. It is a UNESCO World Heritage Site candidate. The park is home to endemic wildlife including the Ethiopian Wolf (world's rarest canid with fewer than 500 remaining), Mountain Nyala (endemic antelope species), Giant Mole Rat, and Bale Monkey. The park has over 280 bird species, many of which are endemic.

DAY 6 - SOF OMAR CAVE
Day 6 took us to Sof Omar Cave, one of Africa's longest cave systems. The cave is formed by the Weyib River cutting through limestone over millions of years. It stretches for approximately 15.1 kilometers and features stunning geological formations including stalactites, stalagmites, and massive chambers. The cave has both natural and cultural significance, serving as a pilgrimage site for Muslims. Key features include the Chamber of Columns, natural skylights, underground river passages, and unique rock formations.

DAY 7 - DODOLA AND ARSI HIGHLANDS
Day 7 involved traveling through the Dodola area and Arsi highlands. Dodola is known for its community-based trekking programs and beautiful highland scenery. The area offers horse trekking, hiking trails, traditional villages, and stunning mountain views. The Arsi highlands are characterized by agricultural landscapes, dense forests, and traditional Oromo culture.

DAY 8 - ARSI NATIONAL PARK
Day 8 was dedicated to exploring Arsi National Park. The park is home to diverse wildlife including the Mountain Nyala, Menelik's Bushbuck, and various bird species. The landscape features dense forests, open grasslands, and mountain peaks. The park is important for conservation of endemic species and offers opportunities for wildlife viewing and nature walks.

DAY 9 - RETURN JOURNEY VIA ADAMA
Day 9 was our final day, returning to Woliso via Adama (Nazret). We departed from Asella in the morning and traveled through the scenic Arsi highlands. Along the way, we observed the changing landscapes from highlands to the Rift Valley floor.

SODERE HOT SPRINGS
We made a brief stop at Sodere Hot Springs, a popular recreational area known for its natural hot springs and swimming pools. The area is located along the Awash River and offers a relaxing environment.

ADAMA (NAZRET)
Adama is a major commercial and industrial city in the Oromia Region. We attempted to visit the Oromia Convention Hall, an important regional center used for major conferences, regional government meetings, large ceremonies, and cultural and social events. However, upon arrival, we were not allowed to enter as the hall was fully occupied by a major meeting, and security restricted all visitors. This was the second failed site visit of the day — another reminder that advance communication should always be part of academic trip planning.

ARRIVAL IN WOLISO
We finally arrived back in Woliso in the evening, completing our 9-day educational field trip. The journey covered over 1000 kilometers and visited more than 15 destinations including national parks, wildlife sanctuaries, lakes, caves, resorts, and cultural sites.

WILDLIFE OBSERVED
Throughout the trip, we observed various wildlife including: Flamingos at Lake Abijatta, Swayne's Hartebeest at Senkele Sanctuary, Hippos at Lake Hawassa, Pelicans and Marabou Storks, Colobus Monkeys at Wondo Genet, Ethiopian Wolf in Bale Mountains, Mountain Nyala, Warthogs, Ostriches, and over 100 bird species.

TOURISM COMPONENTS (FOUR A's)
The trip helped us understand the Four A's of Tourism:
1. ATTRACTIONS - Natural parks, lakes, caves, wildlife, hot springs, cultural sites
2. ACCESSIBILITY - Roads, transportation, park entrances, guided tours
3. AMENITIES - Hotels, resorts, restaurants, visitor centers, swimming pools
4. ACCOMMODATION - Haile Resort, Lewi Resort, university hostels, lodges

KEY LEARNINGS
1. Importance of advance planning and communication with host institutions
2. Understanding of eco-tourism principles and conservation
3. Practical knowledge of hospitality services and resort operations
4. Appreciation for Ethiopia's diverse natural and cultural heritage
5. Teamwork and field research skills
`;

// Chatbot Elements
const chatbotToggle = document.getElementById('chatbotToggle');
const chatbotWindow = document.getElementById('chatbotWindow');
const chatbotMessages = document.getElementById('chatbotMessages');
const chatbotForm = document.getElementById('chatbotForm');
const chatbotInput = document.getElementById('chatbotInput');
const chatbotMinimize = document.getElementById('chatbotMinimize');
const chatbotSuggestions = document.getElementById('chatbotSuggestions');

// Initialize Chatbot
function initChatbot() {
    if (!chatbotToggle || !chatbotWindow) return;
    
    // Add welcome message
    addBotMessage("👋 Hello! I'm your Trip Assistant Bot. Ask me anything about the 9-day field trip to Ethiopia's Rift Valley and Bale Mountains!");
    
    // Toggle chat window
    chatbotToggle.addEventListener('click', toggleChatWindow);
    chatbotMinimize.addEventListener('click', toggleChatWindow);
    
    // Handle form submission
    chatbotForm.addEventListener('submit', handleChatSubmit);
    
    // Handle suggestion buttons
    chatbotSuggestions.addEventListener('click', (e) => {
        if (e.target.classList.contains('suggestion-btn')) {
            const query = e.target.dataset.query;
            chatbotInput.value = query;
            handleChatSubmit(new Event('submit'));
        }
    });
}

// Toggle chat window visibility
function toggleChatWindow() {
    chatbotToggle.classList.toggle('active');
    chatbotWindow.classList.toggle('active');
    
    if (chatbotWindow.classList.contains('active')) {
        chatbotInput.focus();
    }
}

// Handle chat form submission
function handleChatSubmit(e) {
    e.preventDefault();
    
    const userMessage = chatbotInput.value.trim();
    if (!userMessage) return;
    
    // Add user message
    addUserMessage(userMessage);
    chatbotInput.value = '';
    
    // Show typing indicator
    showTypingIndicator();
    
    // Process and respond after a delay (simulating thinking)
    setTimeout(() => {
        removeTypingIndicator();
        const response = findBestResponse(userMessage);
        addBotMessage(response);
    }, 800 + Math.random() * 700);
}

// Add user message to chat
function addUserMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';
    messageDiv.innerHTML = `
        <div class="message-avatar">👤</div>
        <div class="message-content">${escapeHtml(message)}</div>
    `;
    chatbotMessages.appendChild(messageDiv);
    scrollToBottom();
}

// Add bot message to chat with typing effect
function addBotMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message bot';
    messageDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="message-content"></div>
    `;
    chatbotMessages.appendChild(messageDiv);
    
    const contentDiv = messageDiv.querySelector('.message-content');
    typeMessage(contentDiv, message);
}

// Typing effect for bot messages
function typeMessage(element, message, index = 0) {
    if (index < message.length) {
        element.innerHTML += message.charAt(index);
        scrollToBottom();
        setTimeout(() => typeMessage(element, message, index + 1), 15);
    }
}

// Show typing indicator
function showTypingIndicator() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'chat-message bot typing-message';
    typingDiv.innerHTML = `
        <div class="message-avatar">🤖</div>
        <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatbotMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingMessage = chatbotMessages.querySelector('.typing-message');
    if (typingMessage) {
        typingMessage.remove();
    }
}

// Scroll chat to bottom
function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// OFFICIAL FIELD TRIP REPORT ASSISTANT - Complete detailed answers
function findBestResponse(query) {
    let q = query.toLowerCase().trim();
    
    // Rejection message for off-topic questions
    const reject = "Sorry, I can only answer questions related to this field trip report (Day 1–9, journey, SWOT, impacts, problems). Please ask about specific days, locations visited, challenges faced, or tourism analysis.";
    
    // ============ TYPO CORRECTIONS ============
    // Common misspellings → correct spellings
    q = q.replace(/sof\s*umar/gi, 'sof omar')
         .replace(/sof\s*omer/gi, 'sof omar')
         .replace(/sofomar/gi, 'sof omar')
         .replace(/hawasa/gi, 'hawassa')
         .replace(/hawwassa/gi, 'hawassa')
         .replace(/wondo\s*gent/gi, 'wondo genet')
         .replace(/wendogenet/gi, 'wondo genet')
         .replace(/langanu/gi, 'langano')
         .replace(/abijata/gi, 'abijatta')
         .replace(/shala/gi, 'shalla')
         .replace(/sodere/gi, 'soder')
         .replace(/asela/gi, 'asella')
         .replace(/dodolla/gi, 'dodola')
         .replace(/arsi\s*park/gi, 'arsi national park')
         .replace(/bale\s*mountain/gi, 'bale mountains')
         .replace(/tulu\s*dimto/gi, 'tulu dimtu')
         .replace(/oromiya/gi, 'oromia');
    
    // OFF-TOPIC keywords - reject immediately
    const offTopic = ['upwork', 'freelance', 'code', 'programming', 'python', 'javascript', 'money', 'salary', 'bitcoin', 'crypto', 'relationship', 'girlfriend', 'boyfriend', 'love', 'health', 'medicine', 'doctor', 'politics', 'president', 'election', 'religion', 'weather today', 'news', 'football', 'soccer', 'movie', 'music', 'game', 'recipe', 'cook', 'homework', 'exam', 'assignment', 'ai', 'chatgpt', 'openai', 'job', 'career', 'interview'];
    if (offTopic.some(w => q.includes(w))) return reject;
    
    // Greetings
    if (q.match(/^(hi|hello|hey|good morning|good afternoon|good evening|greetings)$/i)) {
        return "Hello! 👋 I am the Trip Report Assistant for the 9-day university field trip. I can answer questions ONLY from the official report covering: Day 1 (Ziway, Abijatta-Shalla, Langano), Day 2 (Senkele, Hawassa), Day 3 (Wondo Genet), Day 4 (Hawassa City), Day 5 (Travel to Bale), Day 6 (Sof Omar Cave), Day 7 (Bale Mountains, Dodola, Asella), Day 8 (Arsi National Park), and Day 9 (Soder, Adama, return to Woliso). Ask me about any day, location, problem, SWOT analysis, or tourism impact!";
    }
    if (q.match(/^(thanks|thank you|thank|thx)$/i)) return "You're welcome! Feel free to ask more questions about the field trip report! 😊";
    if (q === 'help' || q === '?') {
        return "📚 I can help you with information from the 9-day field trip report:\n• Day 1 — Ziway, Abijatta-Shalla Park, Lake Langano\n• Day 2 — Senkele Sanctuary, Hawassa (evening delay problem)\n• Day 3 — Wondo Genet hot springs\n• Day 4 — Hawassa City tourism sites\n• Day 5 — Travel to Sof Omar area\n• Day 6 — Sof Omar Cave (problems encountered)\n• Day 7 — Bale Mountains, Dodola, Asella\n• Day 8 — Arsi National Park\n• Day 9 — Soder Resort, Adama, return to Woliso\n\nAsk about any specific day, location, problem, SWOT, or tourism impact!";
    }
    
    // Too short - ask for clarity
    if (q.length < 3) return "Could you please provide more details? Which day (1-9) or location are you asking about?";
    
    // Unclear problem question without day
    if ((q === 'problem' || q === 'what problem' || q === 'problems' || q === 'what went wrong') && !q.match(/day\s*\d/i)) {
        return "Which day or location are you asking about? According to the report, we had major problems on:\n• Day 2 — Hawassa University gate delay\n• Day 6 — Sof Omar Cave (dark, no guides, limited info)\n• Day 9 — Soder Resort out of service, Adama Oromia Hall visit failed\n\nPlease specify which one you want to know about.";
    }
    
    // DETECT DAY NUMBER
    const dayMatch = q.match(/day\s*(\d)/i);
    const dayNum = dayMatch ? dayMatch[1] : null;
    
    // DETECT QUESTION TYPE
    const askProblem = /problem|issue|challenge|difficult|wrong|fail|bad|weakness|error|mistake/i.test(q);
    const askWhat = /what|happen|activity|did|do|visit|summary|tell|explain|describe|about/i.test(q);
    const askSWOT = /swot|strength|weakness|opportunity|threat/i.test(q);
    const askImpact = /impact|effect|economic|social|cultural|environmental/i.test(q);
    
    // ============ DAY-SPECIFIC DETAILED ANSWERS ============
    
    // DAY 1 - ZIWAY
    if (dayNum === '1' || q.includes('ziway') || q.includes('abijatta') || q.includes('shalla') || q.includes('langano')) {
        if (askProblem) {
            return "⚠️ Day 1 — Ziway Region (Problems): According to the report, the roads to Abijatta-Shalla National Park were dusty and in poor condition. The park had limited visitor facilities and infrastructure. The weather was very hot in the Rift Valley lowlands, making it uncomfortable for extended outdoor activities. There was also inadequate signage and interpretation centers for tourists.";
        }
        return "📍 Day 1 — Ziway Region: We departed from Woliso early morning and traveled to the Rift Valley. We visited Abijatta-Shalla National Park, which features two volcanic lakes — Lake Abijatta (shallow, alkaline) and Lake Shalla (deep, dark blue). We observed flamingos, pelicans, and other bird species. We also learned about the geothermal features and hot springs in the area. Later, we visited Lake Langano, known for being safe for swimming (no bilharzia). We analyzed the tourism components including SWOT analysis of the destinations.";
    }
    
    // DAY 2 - SENKELE & HAWASSA EVENING PROBLEM
    if (dayNum === '2' || q.includes('senkele') || q.includes('hartebeest') || (q.includes('hawassa') && (askProblem || q.includes('evening') || q.includes('university') || q.includes('delay') || q.includes('gate')))) {
        if (askProblem || q.includes('evening') || q.includes('problem') || q.includes('delay') || q.includes('gate')) {
            return "⚠️ Day 2 — Hawassa University Gate Problem: According to the report, after finishing our field visits at Senkele Sanctuary, we arrived at Hawassa University gate in the evening. However, we faced a serious problem — we were NOT allowed to enter the university for several hours. The students had to wait at the gate for a very long time, causing boredom, fatigue, and frustration after an already long day of travel. This was a clear WEAKNESS of the Department Head who did not confirm access arrangements earlier and made no prior communication with Hawassa University about our arrival time. This delay significantly impacted our evening rest and preparation for the next day.";
        }
        return "📍 Day 2 — Senkele Sanctuary & Hawassa: In the morning, we visited Senkele Swayne's Hartebeest Sanctuary, which protects the endangered Swayne's Hartebeest endemic to Ethiopia. This sanctuary covers 54 km² in Oromia Region. In the evening, we traveled to Hawassa City. However, upon arrival at Hawassa University, we faced an unexpected problem — we were not allowed immediate entry and had to wait several hours at the gate due to lack of advance coordination by the department head.";
    }
    
    // DAY 3 - WONDO GENET
    if (dayNum === '3' || q.includes('wondo') || q.includes('genet') || (q.includes('hot spring') && !q.includes('soder'))) {
        if (askProblem) {
            return "⚠️ Day 3 — Wondo Genet (Challenges): According to the report, Wondo Genet was quite crowded with visitors, which limited our ability to fully explore all areas. We had limited time to experience all the attractions including the hot springs, forest walks, and wildlife observation. The facilities were basic and could be improved for better tourist experience.";
        }
        return "📍 Day 3 — Wondo Genet: We visited Wondo Genet, located about 25 km from Hawassa. This is a famous eco-tourism destination known for its natural hot springs with therapeutic properties. We explored the dense natural forest which is home to Colobus monkeys and various bird species. We learned about eco-tourism principles and how natural resources can be sustainably used for tourism. The hot springs attract both local and international visitors seeking relaxation and health benefits.";
    }
    
    // DAY 4 - HAWASSA CITY TOURISM
    if (dayNum === '4' || q.includes('gudumale') || q.includes('fish market') || q.includes('lewi') || q.includes('haile resort')) {
        if (askProblem) {
            return "⚠️ Day 4 — Hawassa City (Challenges): According to the report, the day involved visiting multiple tourism sites in Hawassa. Time management was challenging with many locations to cover. Some facilities had limited capacity for large groups.";
        }
        return "📍 Day 4 — Hawassa City Tourism: We explored Hawassa's main tourism attractions. We visited Gudumale Park (Amora Gedle) — a peaceful public park beside Lake Hawassa with green trees and walking paths. We went to the famous Fish Market where fishermen sell fresh catch from the lake. We also toured Lewi Resort (mid-range lakeside resort with 62 rooms) and Haile Resort (luxury resort owned by Olympic champion Haile Gebrselassie). These visits showed us how nature, culture, and modern hospitality blend together in a regional tourism center.";
    }
    
    // DAY 5 - TRAVEL TO BALE/SOF OMAR AREA
    if (dayNum === '5' || q.includes('tulu dimtu') || q.includes('meda welabu')) {
        if (askProblem) {
            return "⚠️ Day 5 — Travel to Bale (Challenges): According to the report, the travel to Sof Omar area was long and tiring. The roads in some sections were in poor condition. Accommodation facilities in the area were basic compared to urban areas. The changing altitude affected some students.";
        }
        return "📍 Day 5 — Bale Mountains & Tulu Dimtu: We traveled towards the Bale region, experiencing the unique highland landscape. We visited Tulu Dimtu area — Ethiopia's second highest peak at 4,377 meters elevation. The journey took us through remote communities where we observed traditional lifestyles. We stayed at Meda Welabu University. The landscape was characterized by Afro-alpine moorland ecosystem with unique vegetation like giant lobelia plants.";
    }
    
    // DAY 6 - SOF OMAR CAVE (MAJOR PROBLEMS)
    if (dayNum === '6' || q.includes('sof omar') || q.includes('cave') || q.includes('weyib')) {
        if (askProblem || q.includes('problem') || q.includes('issue') || q.includes('dark')) {
            return "⚠️ Day 6 — Sof Omar Cave (MAJOR PROBLEMS): According to the report, we faced several serious issues at Sof Omar Cave. First, the cave was VERY DARK inside, making it extremely difficult to see and move around safely. We needed proper guides and lighting equipment, but these were not adequately arranged. It was HARD TO MOVE inside the cave due to the darkness and uneven terrain. Most importantly, there was a major WEAKNESS of the Department Head — he did NOT gather full information about the cave before the visit. Because of this poor preparation, our group received very LIMITED INFORMATION about the cave's features, history, and significance. This significantly reduced the educational value of the visit.";
        }
        return "📍 Day 6 — Sof Omar Cave: We visited Sof Omar Cave, one of Africa's longest cave systems at approximately 15.1 kilometers. The cave was formed by the Weyib River cutting through limestone over millions of years. It features stunning stalactites, stalagmites, and underground chambers. However, our visit faced challenges — the cave was very dark inside, we needed guides and proper lighting, and it was difficult to move around. Unfortunately, the department head had not gathered complete information beforehand, so we received limited information about the cave's geological and cultural significance.";
    }
    
    // DAY 7 - BALE MOUNTAINS TO ASELLA
    if (dayNum === '7' || q.includes('dodola') || q.includes('asella') || (q.includes('bale') && q.includes('mountain'))) {
        if (askProblem) {
            return "⚠️ Day 7 — Bale to Asella (Challenges): According to the report, the day involved extensive travel from Bale Mountains through Dodola to Asella. The long journey was tiring for students. Some roads were rough, especially in highland areas. Time management was challenging with multiple stops along the way.";
        }
        return "📍 Day 7 — Bale Mountains, Dodola & Asella: We started with a morning visit to Bale Mountains National Park (2,200 km², established 1970), where we observed the unique Afro-alpine ecosystem and looked for endemic wildlife like the Ethiopian Wolf (world's rarest canid, fewer than 500 remain) and Mountain Nyala. After the park visit, we had lunch in Dodola town. In the afternoon, we continued our journey to Asella (Arsi Zone capital), arriving in the evening. The day gave us experience of highland tourism and community-based tourism concepts.";
    }
    
    // DAY 8 - ARSI NATIONAL PARK
    if (dayNum === '8' || q.includes('arsi national') || q.includes('arsi park') || q.includes('arsi university')) {
        if (askProblem) {
            return "⚠️ Day 8 — Arsi National Park (Challenges): According to the report, wildlife viewing at Arsi National Park was dependent on weather conditions and animal movement patterns. We couldn't see all the wildlife species we hoped to observe. The park infrastructure and visitor facilities were limited compared to more developed parks.";
        }
        return "📍 Day 8 — Arsi National Park: In the morning, we visited Arsi National Park, which is home to diverse wildlife including the Mountain Nyala (endemic antelope), Menelik's Bushbuck, and various bird species. The park features dense forests and open grasslands typical of the Ethiopian highlands. We learned about national park management and conservation efforts. In the afternoon, we returned to Arsi University area where the day's program concluded.";
    }
    
    // DAY 9 - SODER, ADAMA, RETURN (MAJOR PROBLEMS)
    if (dayNum === '9' || q.includes('soder') || q.includes('adama') || q.includes('nazret') || q.includes('oromia hall') || q.includes('woliso') || q.includes('return') || q.includes('last day') || q.includes('final day')) {
        if (askProblem || q.includes('problem') || q.includes('issue')) {
            return "⚠️ Day 9 — Return Journey (MULTIPLE PROBLEMS): According to the report, this day had TWO major problems. First, we stopped at SODER RESORT (Sodere Hot Springs), but it was OUT OF SERVICE and in POOR CONDITION. The facilities were not operational, which was disappointing. This was another WEAKNESS of the Department Head who did NOT check the resort's status before planning the visit. Second, we went to ADAMA (Nazret) to visit the Oromia Convention Hall, but we FAILED to enter because there was a big meeting happening inside — security did not allow visitors. We then passed through Addis Ababa and finally arrived at Woliso in the evening, completing our 9-day field trip.";
        }
        return "📍 Day 9 — Return Journey (Soder, Adama, Woliso): On the final day, we departed for the return journey. We stopped at Soder Resort (Sodere Hot Springs), but unfortunately found it out of service and in poor condition — the department head had not verified its status beforehand. We then traveled to Adama (Nazret) to visit Oromia Convention Hall, but could not enter due to an ongoing major meeting. We passed through Addis Ababa and finally arrived back at Woliso in the evening, completing our 9-day educational field trip covering over 1,000 kilometers.";
    }
    
    // ============ GENERAL TOPICS ============
    
    // SWOT ANALYSIS
    if (askSWOT) {
        if (q.includes('strength')) {
            return "💪 SWOT — STRENGTHS (from the report): The destinations we visited have rich biodiversity with endemic species (Ethiopian Wolf, Mountain Nyala, Swayne's Hartebeest). They feature unique geological formations (volcanic Rift Valley lakes, Sof Omar Cave system). The region offers diverse ecosystems from Rift Valley lowlands to Afro-alpine highlands. There is strong cultural heritage and traditional communities. Cities like Hawassa have growing tourism infrastructure with quality resorts (Haile Resort, Lewi Resort).";
        }
        if (q.includes('weakness')) {
            return "⚠️ SWOT — WEAKNESSES (from the report): Poor road conditions in many areas, especially to remote sites. Limited visitor facilities and infrastructure at national parks. Inadequate signage and interpretation centers. Insufficient marketing and promotion of attractions. Waste management issues at some sites. DEPARTMENT HEAD WEAKNESSES: Day 2 — Failed to coordinate with Hawassa University (gate delay). Day 6 — Did not gather cave information (limited educational value). Day 9 — Did not check Soder Resort status (found out of service).";
        }
        if (q.includes('opportunity')) {
            return "🌟 SWOT — OPPORTUNITIES (from the report): Great potential for eco-tourism development and expansion. Bird watching tourism can grow (flamingos, endemic species). Research and educational tourism programs can be developed. Community-based tourism initiatives can benefit local people. Sites can be integrated into regional tourism circuits. International marketing of unique attractions like Sof Omar Cave (Africa's longest cave) can attract more visitors.";
        }
        if (q.includes('threat')) {
            return "⚡ SWOT — THREATS (from the report): Habitat degradation from overgrazing and human encroachment threatens wildlife. Climate change impacts water resources and ecosystems (Lake Abijatta water levels declining). Pollution from nearby settlements affects natural areas. Uncontrolled tourism development could damage sensitive sites. Lack of proper planning and coordination (as we experienced) reduces tourism quality.";
        }
        return "📊 SWOT Analysis (from the report): We analyzed each destination using the SWOT framework. STRENGTHS include biodiversity and unique landscapes. WEAKNESSES include poor infrastructure and planning failures. OPPORTUNITIES include eco-tourism growth potential. THREATS include environmental degradation and climate change. Ask about a specific aspect (strength/weakness/opportunity/threat) for detailed information!";
    }
    
    // TOURISM IMPACTS
    if (askImpact) {
        if (q.includes('economic')) {
            return "💰 ECONOMIC IMPACTS (from the report): Tourism generates income for local communities through entrance fees, guide services, and small businesses. It creates employment for park rangers, guides, hotel staff, and transport providers. Resorts like Haile Resort and Lewi Resort in Hawassa contribute significantly to the local economy. However, the report notes that benefits are not always evenly distributed to local communities living near attractions.";
        }
        if (q.includes('social')) {
            return "👥 SOCIAL IMPACTS (from the report): Tourism increases awareness about wildlife conservation among both visitors and local residents. It encourages community participation in park management and conservation efforts. Tourism provides educational opportunities for students and researchers (like our field trip). However, it can also cause cultural changes in local communities due to outside influence and modernization.";
        }
        if (q.includes('cultural')) {
            return "🎭 CULTURAL IMPACTS (from the report): Tourism promotes respect for natural and cultural heritage. It supports traditional conservation practices used by local communities. Tourism provides cultural exchange opportunities between visitors and local communities. Sof Omar Cave has religious and cultural significance for local Muslim communities. However, there is a risk of cultural commodification if tourism is not managed properly.";
        }
        if (q.includes('environmental')) {
            return "🌿 ENVIRONMENTAL IMPACTS (from the report): Positive impacts include protection of endangered species and ecosystems through park management and conservation funding. Negative risks include habitat disturbance from too many visitors, littering and pollution at popular sites, pressure on water resources, and potential damage to sensitive areas like caves if not properly managed with visitor limits.";
        }
        return "🌍 TOURISM IMPACTS (from the report): We studied four types of impacts during the field trip:\n• Economic — jobs, income, local business growth\n• Social — awareness, education, community participation\n• Cultural — heritage preservation, cultural exchange\n• Environmental — conservation benefits vs. degradation risks\n\nAsk about a specific impact type for detailed information!";
    }
    
    // FOUR A's OF TOURISM
    if (q.includes('four a') || q.includes('4 a') || q.includes('attraction') || q.includes('accessibility') || q.includes('amenities') || q.includes('accommodation')) {
        return "📚 FOUR A's OF TOURISM (from the report): We analyzed destinations using this framework:\n• ATTRACTIONS — Natural sites (lakes, caves, mountains, wildlife), cultural heritage\n• ACCESSIBILITY — Road conditions, distance from major cities, transport options\n• AMENITIES — Visitor facilities, guides, signage, restaurants, services\n• ACCOMMODATION — Hotels, resorts, lodges, university guesthouses\n\nEach destination was evaluated on these four components to assess tourism potential.";
    }
    
    // DEPARTMENT HEAD WEAKNESSES (specific question)
    if (q.includes('department') || q.includes('head') || q.includes('coordinator') || q.includes('organizer') || q.includes('leader')) {
        return "⚠️ DEPARTMENT HEAD WEAKNESSES (from the report): Three major failures were documented:\n\n1) Day 2 — Hawassa University: Did NOT confirm access arrangements beforehand, causing students to wait hours at the gate in the evening.\n\n2) Day 6 — Sof Omar Cave: Did NOT gather full information about the cave before the visit, resulting in limited educational value for students.\n\n3) Day 9 — Soder Resort: Did NOT check the resort's operational status beforehand, finding it out of service upon arrival.\n\nThese failures highlight the critical importance of advance planning and communication in organizing educational field trips.";
    }
    
    // WILDLIFE
    if (q.includes('wildlife') || q.includes('animal') || q.includes('bird') || q.includes('flamingo') || q.includes('wolf') || q.includes('nyala')) {
        return "🦁 WILDLIFE (from the report): We observed various species during the trip:\n• Day 1 — Flamingos and pelicans at Abijatta-Shalla lakes\n• Day 2 — Swayne's Hartebeest (endemic, endangered) at Senkele Sanctuary\n• Day 3 — Colobus monkeys and birds at Wondo Genet forest\n• Day 7 — Ethiopian Wolf (world's rarest canid, <500 remain) and Mountain Nyala at Bale Mountains\n• Day 8 — Mountain Nyala and Menelik's Bushbuck at Arsi National Park\n\nThe trip highlighted Ethiopia's unique endemic wildlife and conservation challenges.";
    }
    
    // LOCATIONS (detailed)
    if (q.includes('hawassa') && !askProblem) {
        return "🏙️ HAWASSA CITY (from the report): Capital of Sidama Region, located 275 km south of Addis Ababa at 1,708m elevation. Known for Lake Hawassa (90 km² freshwater lake), the famous fish market where fishermen sell fresh catch, and modern resorts (Haile Resort — luxury, Lewi Resort — mid-range). We visited on Days 2-4. The city is a major hub for hospitality, conferences, and tourism. Note: We experienced the evening delay problem at Hawassa University gate on Day 2.";
    }
    if (q.includes('bale') && !dayNum) {
        return "⛰️ BALE MOUNTAINS (from the report): National Park covering 2,200 km², established in 1970. Home to endemic Ethiopian Wolf (world's rarest canid, fewer than 500 remain), Mountain Nyala, Giant Mole Rat, and over 280 bird species. Features Afro-alpine moorland ecosystem (largest in Africa) and Tulu Dimtu peak (4,377m — Ethiopia's 2nd highest). We visited on Day 5 (Tulu Dimtu area) and Day 7 (main park).";
    }
    
    // TRIP SUMMARY
    if (q.includes('summary') || q.includes('overview') || (q.includes('trip') && q.includes('about')) || q.includes('all days')) {
        return "📍 9-DAY FIELD TRIP SUMMARY (from the report):\n• Day 1 — Ziway: Abijatta-Shalla National Park, Lake Langano\n• Day 2 — Senkele Sanctuary, Hawassa (⚠️ gate delay problem)\n• Day 3 — Wondo Genet hot springs and forest\n• Day 4 — Hawassa City: Gudumale Park, Fish Market, Resorts\n• Day 5 — Travel to Bale, Tulu Dimtu area\n• Day 6 — Sof Omar Cave (⚠️ dark, limited info problem)\n• Day 7 — Bale Mountains National Park, Dodola, Asella\n• Day 8 — Arsi National Park\n• Day 9 — Soder Resort (⚠️ out of service), Adama (⚠️ failed visit), return to Woliso\n\nTotal: 1,000+ km traveled, 15+ sites visited, multiple problems due to poor advance planning.";
    }
    
    // Has trip-related keyword but unclear
    const tripWords = ['day', 'trip', 'visit', 'tour', 'field', 'travel', 'journey'];
    if (tripWords.some(w => q.includes(w))) {
        return "I understand you're asking about the field trip. Could you please be more specific? You can ask about:\n• Specific days (Day 1-9)\n• Locations (Hawassa, Bale, Sof Omar, Langano, etc.)\n• Problems encountered (Day 2, 6, or 9)\n• SWOT analysis (strengths, weaknesses, opportunities, threats)\n• Tourism impacts (economic, social, cultural, environmental)\n• Wildlife observed\n• Department head's weaknesses";
    }
    
    return reject;
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', initChatbot);

// ===================================
// SCROLL-BASED ANIMATIONS SYSTEM
// ===================================

// Initialize all scroll animations
function initScrollAnimations() {
    // Add animation classes to elements
    addAnimationClasses();
    
    // Create Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.15
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                // Unobserve after animation (performance)
                animationObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe all animated elements
    document.querySelectorAll('.animate-fade-in, .animate-slide-up, .animate-slide-left, .animate-slide-right, .animate-scale-in').forEach(el => {
        animationObserver.observe(el);
    });
}

// Add animation classes to elements
function addAnimationClasses() {
    // Destination cards - slide up with stagger
    document.querySelectorAll('.destination-card').forEach((card, index) => {
        card.classList.add('animate-slide-up');
        card.classList.add('delay-' + Math.min((index % 3) + 1, 3));
    });
    
    // Day headers - fade in
    document.querySelectorAll('.day-header').forEach(header => {
        header.classList.add('animate-fade-in');
    });
    
    // Intro cards - scale in with stagger
    document.querySelectorAll('.intro-card').forEach((card, index) => {
        card.classList.add('animate-scale-in');
        card.classList.add('delay-' + (index + 1));
    });
    
    // Summary cards - slide up
    document.querySelectorAll('.summary-card').forEach((card, index) => {
        card.classList.add('animate-slide-up');
        card.classList.add('delay-' + Math.min((index % 4) + 1, 4));
    });
    
    // SWOT items - alternate slide directions
    document.querySelectorAll('.swot-item').forEach((item, index) => {
        if (index % 2 === 0) {
            item.classList.add('animate-slide-left');
        } else {
            item.classList.add('animate-slide-right');
        }
        item.classList.add('delay-' + Math.min((index % 4) + 1, 4));
    });
    
    // Impact items - scale in
    document.querySelectorAll('.impact-item').forEach((item, index) => {
        item.classList.add('animate-scale-in');
        item.classList.add('delay-' + Math.min((index % 4) + 1, 4));
    });
    
    // Stat boxes - slide up
    document.querySelectorAll('.stat-box').forEach((box, index) => {
        box.classList.add('animate-slide-up');
        box.classList.add('delay-' + Math.min((index % 4) + 1, 4));
    });
    
    // Contact cards - scale in
    document.querySelectorAll('.contact-card').forEach((card, index) => {
        card.classList.add('animate-scale-in');
        card.classList.add('delay-' + (index + 1));
    });
    
    // Section headers
    document.querySelectorAll('.section-header, .summary-header').forEach(header => {
        header.classList.add('animate-fade-in');
    });
}

// Parallax effect for hero section
function initParallax() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const rate = scrolled * 0.3;
                
                // Only apply parallax when hero is in view
                if (scrolled < window.innerHeight) {
                    hero.style.backgroundPositionY = rate + 'px';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Smooth reveal for sidebar nav items
function initSidebarAnimations() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach((link, index) => {
        link.style.opacity = '0';
        link.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            link.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            link.style.opacity = '1';
            link.style.transform = 'translateX(0)';
        }, 100 + (index * 80));
    });
}

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number, .stat-value');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent;
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                
                if (!isNaN(numericValue) && numericValue > 0) {
                    let current = 0;
                    const increment = numericValue / 30;
                    const suffix = finalValue.replace(/[0-9]/g, '');
                    
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= numericValue) {
                            target.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            target.textContent = Math.floor(current) + suffix;
                        }
                    }, 30);
                }
                counterObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// Initialize all animations on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure CSS is loaded
    setTimeout(() => {
        initScrollAnimations();
        initParallax();
        initSidebarAnimations();
        animateCounters();

    }, 100);
});

// ===================================


// ============ OLD CODE REMOVED ============
/*
    
    // Short rejection message for unrelated questions
    const notFoundResponse = "❌ Sorry, I only answer questions about the field trip. Try: Day 1, Hawassa, Wildlife, etc.";
    
    // Too short query
    if (lowerQuery.length < 2) {
        return "Please ask about the field trip.";
    }
    
    // Basic greetings
    if (lowerQuery.match(/^(hi|hello|hey)$/)) {
        return "Hi! � Ask me about  the 9-day Ethiopia field trip!";
    }
    
    // Thanks
    if (lowerQuery.match(/^(thanks|thank)$/)) {
        return "You're welcome! 😊";
    }
    
    // Help
    if (lowerQuery === 'help') {
        return "Ask about: Day 1-9, Hawassa, Bale, Sof Omar, Wildlife, Hotels";
    }
    
    // Valid trip keywords
    const validKeywords = [
        'day', 'woliso', 'ziway', 'abijatta', 'shalla', 'langano', 'lake',
        'senkele', 'hartebeest', 'hawassa', 'wondo', 'genet', 'fikir',
        'gudumale', 'fish market', 'lewi', 'haile', 'resort', 'hotel',
        'bale', 'tulu', 'dimtu', 'mountain', 'sof omar', 'cave',
        'dodola', 'arsi', 'adama', 'nazret', 'sodere',
        'wildlife', 'animal', 'bird', 'flamingo', 'hippo', 'wolf', 'nyala',
        'trip', 'tour', 'tourism', 'park', 'forest', 'spring', 'ethiopia'
    ];
    
    // Check for valid keyword
    const hasValidKeyword = validKeywords.some(k => lowerQuery.includes(k));
    if (!hasValidKeyword) {
        return notFoundResponse;
    }
    
    // Short answers database
    const shortAnswers = {
        // Day summaries
        'day 1': "📍 Day 1: Woliso → Ziway. Visited Abijatta-Shalla National Park (flamingos, volcanic lakes) and Lake Langano (swimming, resorts).",
        'day 2': "📍 Day 2: Senkele Sanctuary - home to endangered Swayne's Hartebeest. Evening arrival at Hawassa University (delayed entry).",
        'day 3': "📍 Day 3: Hawassa City tour - Wondo Genet hot springs, Lake Hawassa Fikir Hike (hippos, birds).",
        'day 4': "📍 Day 4: Hawassa sites - Gudumale Park, Fish Market, Lewi Resort, Haile Resort.",
        'day 5': "📍 Day 5: Bale Mountains - Tulu Dimtu (4,377m, 2nd highest peak in Ethiopia). Endemic wildlife area.",
        'day 6': "📍 Day 6: Sof Omar Cave - one of Africa's longest cave systems (15.1 km). Underground river passages.",
        'day 7': "📍 Day 7: Dodola & Arsi Highlands - community trekking, traditional villages, mountain scenery.",
        'day 8': "📍 Day 8: Arsi National Park - Mountain Nyala, dense forests, wildlife viewing.",
        'day 9': "📍 Day 9: Return journey via Adama. Visited Sodere Hot Springs. Arrived Woliso evening.",
        
        // Locations
        'hawassa': "🏙️ Hawassa: Capital of Sidama Region, 275km from Addis Ababa. Known for Lake Hawassa, fish market, and modern resorts.",
        'bale': "⛰️ Bale Mountains: National Park with endemic Ethiopian Wolf, Mountain Nyala. Tulu Dimtu peak at 4,377m.",
        'sof omar': "🕳️ Sof Omar Cave: Africa's longest cave (15.1km). Formed by Weyib River. Stalactites, underground chambers.",
        'langano': "🏊 Lake Langano: Safe for swimming (no bilharzia). Popular resort destination in Rift Valley.",
        'wondo genet': "♨️ Wondo Genet: Natural hot springs, dense forest, colobus monkeys. 25km from Hawassa.",
        'senkele': "🦌 Senkele Sanctuary: Protected area for endangered Swayne's Hartebeest. 54 km² in Oromia.",
        
        // Wildlife
        'wildlife': "🦁 Wildlife seen: Flamingos, Swayne's Hartebeest, Hippos, Ethiopian Wolf, Mountain Nyala, Colobus Monkeys, Pelicans, Warthogs.",
        'flamingo': "🦩 Flamingos: Observed at Lake Abijatta in large flocks. Pink color from algae diet.",
        'wolf': "🐺 Ethiopian Wolf: World's rarest canid (<500 remain). Seen in Bale Mountains.",
        'hippo': "🦛 Hippos: Observed at Lake Hawassa during Fikir Hike walk.",
        'hartebeest': "🦌 Swayne's Hartebeest: Endemic antelope at Senkele Sanctuary. Endangered species.",
        
        // Hotels
        'haile resort': "🏨 Haile Resort: Luxury lakeside resort owned by Olympic champion Haile Gebrselassie. Pool, spa, conference halls.",
        'lewi resort': "🏨 Lewi Resort: Mid-range lakeside resort. 62 rooms, wooden design, lake views, swimming pool.",
        'hotel': "🏨 Hotels visited: Haile Resort (luxury), Lewi Resort (mid-range), University accommodations.",
        'resort': "🏨 Resorts: Haile Resort & Lewi Resort in Hawassa - both lakeside with pools and restaurants.",
        
        // Tourism concepts
        'tourism': "📚 Tourism concepts: Four A's - Attractions, Accessibility, Amenities, Accommodation.",
        'four a': "📚 Four A's of Tourism: 1) Attractions 2) Accessibility 3) Amenities 4) Accommodation"
    };
    
    // Find matching short answer
    for (const [key, answer] of Object.entries(shortAnswers)) {
        if (lowerQuery.includes(key)) {
            return answer;
        }
    }
    
    // Day number detection
    const dayMatch = lowerQuery.match(/day\s*(\d)/);
    if (dayMatch) {
        const dayNum = dayMatch[1];
        if (shortAnswers['day ' + dayNum]) {
            return shortAnswers['day ' + dayNum];
        }
    }
    
    // Generic trip question
    if (lowerQuery.includes('trip') || lowerQuery.includes('tour')) {
        return "📍 9-day field trip: Rift Valley lakes, Bale Mountains, Sof Omar Cave. 1000+ km traveled, 15+ sites visited.";
    }
    
*/
