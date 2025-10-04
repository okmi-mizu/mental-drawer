// Steampunk Interactive Effects
(function() {
    'use strict';

    let scrollPosition = 0;
    let currentTheme = 'blue';

    // Initialize on DOM load
    document.addEventListener('DOMContentLoaded', function() {
        createSteampunkElements();
        setupScrollEffects();
        setupLoadingIndicator();
    });

    // Create all steampunk visual elements
    function createSteampunkElements() {
        const container = document.createElement('div');
        container.id = 'steampunk-container';

        // Create gears
        const gearContainer = document.createElement('div');
        gearContainer.className = 'gear-container';

        const gearColors = ['#4a9fd8', '#5d4a3a', '#f4e04d', '#8b5a9e'];
        for (let i = 0; i < 4; i++) {
            const gear = createGear(gearColors[i]);
            gear.style.position = 'fixed';
            gear.style.top = (80 + i * 160) + 'px';
            gearContainer.appendChild(gear);
        }

        container.appendChild(gearContainer);

        // Create pipe system with links
        const pipeSystem = createPipeSystem();
        container.appendChild(pipeSystem);

        // Create donation bucket
        const bucket = createDonationBucket();
        container.appendChild(bucket);

        // Create train
        const train = createTrain();
        container.appendChild(train);

        document.body.appendChild(container);
    }

    // Create a gear SVG
    function createGear(color) {
        const gearDiv = document.createElement('div');
        gearDiv.className = 'gear';

        const svg = `
            <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <filter id="shadow-${color}">
                        <feDropShadow dx="2" dy="2" stdDeviation="2" flood-opacity="0.5"/>
                    </filter>
                </defs>
                <g filter="url(#shadow-${color})">
                    <!-- Perfectly circular gear with 12 evenly spaced teeth -->
                    <circle cx="50" cy="50" r="35" fill="${color}" stroke="#333" stroke-width="1"/>
                    <!-- 12 teeth around the circle -->
                    ${Array.from({length: 12}, (_, i) => {
                        const angle = (i * 30 - 90) * Math.PI / 180; // 30 degrees apart, start at top
                        const x = 50 + Math.cos(angle) * 40;
                        const y = 50 + Math.sin(angle) * 40;
                        return `<rect x="${x-3}" y="${y-5}" width="6" height="10" fill="${color}" stroke="#333" stroke-width="0.5" transform="rotate(${i * 30} ${x} ${y})"/>`;
                    }).join('')}
                    <!-- Inner circle -->
                    <circle cx="50" cy="50" r="20" fill="#666" stroke="#333" stroke-width="2"/>
                    <!-- Center hole -->
                    <circle cx="50" cy="50" r="8" fill="#333"/>
                    <!-- Bolt details at cardinal points -->
                    <circle cx="50" cy="35" r="2" fill="#888"/>
                    <circle cx="65" cy="50" r="2" fill="#888"/>
                    <circle cx="50" cy="65" r="2" fill="#888"/>
                    <circle cx="35" cy="50" r="2" fill="#888"/>
                </g>
            </svg>
        `;

        gearDiv.innerHTML = svg;
        return gearDiv;
    }

    // Create pipe system with links
    function createPipeSystem() {
        const pipeSystem = document.createElement('div');
        pipeSystem.className = 'pipe-system';

        // Video Link with Steam
        const videoDiv = document.createElement('div');
        videoDiv.className = 'pipe';
        const videoLink = document.createElement('a');
        videoLink.href = '#/videos';
        videoLink.className = 'pipe-link';
        videoLink.textContent = '🎥 Videos';

        // Add steam effects
        for (let i = 0; i < 3; i++) {
            const steam = document.createElement('div');
            steam.className = 'steam';
            videoDiv.appendChild(steam);
        }
        videoDiv.appendChild(videoLink);

        // Merch Link with Water Drips
        const merchDiv = document.createElement('div');
        merchDiv.className = 'pipe';
        const merchLink = document.createElement('a');
        merchLink.href = '#/merch';
        merchLink.className = 'pipe-link';
        merchLink.textContent = '🛍️ Merch';

        // Add water drips
        for (let i = 0; i < 4; i++) {
            const drip = document.createElement('div');
            drip.className = 'water-drip';
            merchDiv.appendChild(drip);
        }
        merchDiv.appendChild(merchLink);

        // Donations Link
        const donationDiv = document.createElement('div');
        donationDiv.className = 'pipe';
        const donationLink = document.createElement('a');
        donationLink.href = '#/donations';
        donationLink.className = 'pipe-link';
        donationLink.textContent = '💰 Donations';
        donationDiv.appendChild(donationLink);

        pipeSystem.appendChild(videoDiv);
        pipeSystem.appendChild(merchDiv);
        pipeSystem.appendChild(donationDiv);

        return pipeSystem;
    }

    // Create donation bucket
    function createDonationBucket() {
        const bucket = document.createElement('div');
        bucket.className = 'donation-bucket';

        const svg = `
            <svg viewBox="0 0 100 80" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bucketGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style="stop-color:#a0826d;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#6b5345;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <!-- Bucket body -->
                <path d="M20,30 L25,70 L75,70 L80,30 Z" fill="url(#bucketGrad)" stroke="#4a3728" stroke-width="2"/>
                <!-- Bucket rim -->
                <ellipse cx="50" cy="30" rx="30" ry="8" fill="#8b7355" stroke="#4a3728" stroke-width="2"/>
                <!-- Handle -->
                <path d="M25,30 Q50,10 75,30" fill="none" stroke="#4a3728" stroke-width="3"/>
                <!-- Water level -->
                <ellipse cx="50" cy="60" rx="22" ry="6" fill="#4db8ff" opacity="0.7"/>
                <!-- Label -->
                <text x="50" y="55" text-anchor="middle" font-size="10" fill="#fff" font-weight="bold">DONATE</text>
            </svg>
        `;

        bucket.innerHTML = svg;
        return bucket;
    }

    // Create train
    function createTrain() {
        const trainContainer = document.createElement('div');
        trainContainer.className = 'train-container';

        const train = document.createElement('div');
        train.className = 'train';

        const svg = `
            <svg viewBox="0 0 120 60" xmlns="http://www.w3.org/2000/svg">
                <!-- Engine body -->
                <rect x="20" y="20" width="50" height="25" fill="#8b4513" stroke="#333" stroke-width="2" rx="3"/>
                <!-- Cabin -->
                <rect x="70" y="15" width="40" height="30" fill="#cd853f" stroke="#333" stroke-width="2" rx="2"/>
                <!-- Smoke stack -->
                <rect x="30" y="10" width="10" height="10" fill="#555" stroke="#333" stroke-width="1"/>
                <!-- Windows -->
                <rect x="75" y="20" width="12" height="10" fill="#87ceeb" stroke="#333" stroke-width="1"/>
                <rect x="93" y="20" width="12" height="10" fill="#87ceeb" stroke="#333" stroke-width="1"/>
                <!-- Wheels -->
                <circle cx="35" cy="45" r="8" fill="#333" stroke="#000" stroke-width="2"/>
                <circle cx="55" cy="45" r="8" fill="#333" stroke="#000" stroke-width="2"/>
                <circle cx="85" cy="45" r="8" fill="#333" stroke="#000" stroke-width="2"/>
                <circle cx="100" cy="45" r="8" fill="#333" stroke="#000" stroke-width="2"/>
                <!-- Wheel details -->
                <circle cx="35" cy="45" r="3" fill="#666"/>
                <circle cx="55" cy="45" r="3" fill="#666"/>
                <circle cx="85" cy="45" r="3" fill="#666"/>
                <circle cx="100" cy="45" r="3" fill="#666"/>
            </svg>
        `;

        train.innerHTML = svg;

        // Add smoke puffs
        for (let i = 0; i < 4; i++) {
            const smoke = document.createElement('div');
            smoke.className = 'train-smoke';
            trainContainer.appendChild(smoke);
        }

        trainContainer.appendChild(train);
        return trainContainer;
    }

    // Setup scroll effects
    function setupScrollEffects() {
        let lastScroll = 0;

        window.addEventListener('scroll', function() {
            const scroll = window.pageYOffset || document.documentElement.scrollTop;
            const scrollDelta = scroll - lastScroll;
            scrollPosition = scroll;

            // Rotate gears based on scroll
            const gears = document.querySelectorAll('.gear');
            gears.forEach((gear, index) => {
                const currentRotation = parseFloat(gear.dataset.rotation || 0);
                const direction = index % 2 === 0 ? 1 : -1;
                const newRotation = currentRotation + (scrollDelta * direction * 0.5);
                gear.dataset.rotation = newRotation;
                gear.style.transform = `rotate(${newRotation}deg)`;
            });

            // Change background theme based on scroll position
            const windowHeight = window.innerHeight;
            const docHeight = document.documentElement.scrollHeight;
            const scrollPercent = scroll / (docHeight - windowHeight);

            let newTheme = 'blue';
            if (scrollPercent < 0.25) {
                newTheme = 'blue';
            } else if (scrollPercent < 0.5) {
                newTheme = 'brown';
            } else if (scrollPercent < 0.75) {
                newTheme = 'yellow';
            } else {
                newTheme = 'purple';
            }

            if (newTheme !== currentTheme) {
                document.body.classList.remove('theme-blue', 'theme-brown', 'theme-yellow', 'theme-purple');
                document.body.classList.add('theme-' + newTheme);
                currentTheme = newTheme;
            }

            lastScroll = scroll;
        });

        // Initial theme
        document.body.classList.add('theme-blue');
    }

    // Setup loading indicator
    function setupLoadingIndicator() {
        // Show train when page is loading
        const observer = new MutationObserver(function(mutations) {
            const appDiv = document.getElementById('app');
            if (appDiv && appDiv.textContent.includes('Please wait')) {
                document.body.classList.add('loading');
            } else {
                setTimeout(() => {
                    document.body.classList.remove('loading');
                }, 1000);
            }
        });

        const appDiv = document.getElementById('app');
        if (appDiv) {
            observer.observe(appDiv, { childList: true, subtree: true, characterData: true });
        }

        // Also check on hook events
        if (window.$docsify) {
            window.$docsify.plugins = [].concat(window.$docsify.plugins || [], [
                function(hook) {
                    hook.beforeEach(function(content) {
                        document.body.classList.add('loading');
                        return content;
                    });
                    hook.afterEach(function(html) {
                        setTimeout(() => {
                            document.body.classList.remove('loading');
                        }, 500);
                        return html;
                    });
                }
            ]);
        }
    }

})();
