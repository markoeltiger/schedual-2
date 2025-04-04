class AdManager {
    constructor(scene) {
        this.scene = scene;
        this.adZones = [];
        this.adReady = false;
        this.lastAdTime = 0;
        this.adCooldown = 60000; // 1 minute cooldown between reward ads
        
        // Initialize ad zones
        this.createAdZones();
        
        // Set ad ready after a short delay (simulating ad SDK initialization)
        this.scene.time.delayedCall(2000, () => {
            this.adReady = true;
            console.log('Ad system initialized and ready');
        });
    }
    
    createAdZones() {
        // Create banner ad zones (these would be linked to real ad networks in production)
        const gameWidth = this.scene.cameras.main.width;
        const gameHeight = this.scene.cameras.main.height;
        
        // Top banner ad zone
        const topBanner = {
            x: gameWidth / 2,
            y: 30,
            width: gameWidth,
            height: 60,
            type: 'banner',
            id: 'top-banner'
        };
        
        // Bottom banner ad zone
        const bottomBanner = {
            x: gameWidth / 2,
            y: gameHeight - 30,
            width: gameWidth,
            height: 60,
            type: 'banner',
            id: 'bottom-banner'
        };
        
        this.adZones.push(topBanner, bottomBanner);
        
        // Create visual placeholders for ad zones
        this.createAdPlaceholders();
    }
    
    createAdPlaceholders() {
        this.adZones.forEach(zone => {
            // Create background for ad zone
            const background = this.scene.add.graphics();
            background.fillStyle(0x000000, 0.3);
            background.fillRect(zone.x - zone.width/2, zone.y - zone.height/2, zone.width, zone.height);
            
            // Add dashed border
            background.lineStyle(2, 0xFFFFFF, 0.5);
            background.strokeRect(zone.x - zone.width/2, zone.y - zone.height/2, zone.width, zone.height);
            
            // Add placeholder text
            const text = this.scene.add.text(zone.x, zone.y, 'Advertisement', {
                fontFamily: 'Segoe UI',
                fontSize: 14,
                color: '#FFFFFF'
            });
            text.setOrigin(0.5);
            
            // Store references to visual elements
            zone.visuals = {
                background,
                text
            };
        });
    }
    
    showRewardAd(callback) {
        // Check if ad is ready and cooldown has passed
        const currentTime = Date.now();
        if (!this.adReady || currentTime - this.lastAdTime < this.adCooldown) {
            console.log('Ad not ready or on cooldown');
            return false;
        }
        
        // Show simulated reward ad
        this.showAdOverlay(() => {
            // Update last ad time
            this.lastAdTime = currentTime;
            
            // Execute callback with reward
            if (callback) {
                callback(true);
            }
        });
        
        return true;
    }
    
    showAdOverlay(onComplete) {
        // Create semi-transparent background
        const overlay = this.scene.add.rectangle(400, 300, 800, 600, 0x000000, 0.8);
        overlay.setDepth(100);
        
        // Create ad container
        const adContainer = this.scene.add.rectangle(400, 300, 400, 300, 0x333333);
        adContainer.setDepth(101);
        
        // Add ad title
        const adTitle = this.scene.add.text(400, 200, 'WATCHING AD', {
            fontFamily: 'Segoe UI',
            fontSize: 24,
            fontStyle: 'bold',
            color: '#FFFFFF'
        });
        adTitle.setOrigin(0.5);
        adTitle.setDepth(102);
        
        // Add simulated ad content
        const adContent = this.scene.add.text(400, 300, 'This is a simulated advertisement.\nIn a real game, this would be a video ad\nfrom an ad network provider.', {
            fontFamily: 'Segoe UI',
            fontSize: 18,
            color: '#FFFFFF',
            align: 'center'
        });
        adContent.setOrigin(0.5);
        adContent.setDepth(102);
        
        // Add progress bar
        const progressBarBg = this.scene.add.rectangle(400, 380, 300, 20, 0x666666);
        progressBarBg.setDepth(102);
        
        const progressBar = this.scene.add.rectangle(250, 380, 0, 20, 0x4CAF50);
        progressBar.setOrigin(0, 0.5);
        progressBar.setDepth(103);
        
        // Add skip button (appears after 5 seconds)
        const skipButton = this.scene.add.rectangle(400, 430, 150, 40, 0x2196F3, 0);
        skipButton.setDepth(102);
        
        const skipText = this.scene.add.text(400, 430, 'Skip Ad', {
            fontFamily: 'Segoe UI',
            fontSize: 18,
            color: '#FFFFFF'
        });
        skipText.setOrigin(0.5);
        skipText.setDepth(103);
        skipText.setAlpha(0);
        
        // Simulate ad progress
        this.scene.tweens.add({
            targets: progressBar,
            width: 300,
            duration: 5000,
            onComplete: () => {
                // Show skip button
                this.scene.tweens.add({
                    targets: [skipButton, skipText],
                    alpha: 1,
                    duration: 500
                });
                
                // Make skip button interactive
                skipButton.setInteractive();
                skipButton.on('pointerdown', () => {
                    // Clean up and complete
                    overlay.destroy();
                    adContainer.destroy();
                    adTitle.destroy();
                    adContent.destroy();
                    progressBarBg.destroy();
                    progressBar.destroy();
                    skipButton.destroy();
                    skipText.destroy();
                    
                    if (onComplete) {
                        onComplete();
                    }
                });
            }
        });
    }
    
    // Method to check if reward ad is available
    isRewardAdAvailable() {
        const currentTime = Date.now();
        return this.adReady && (currentTime - this.lastAdTime >= this.adCooldown);
    }
    
    // Get time remaining until next ad is available (in seconds)
    getAdCooldownRemaining() {
        const currentTime = Date.now();
        const elapsed = currentTime - this.lastAdTime;
        const remaining = Math.max(0, this.adCooldown - elapsed);
        return Math.ceil(remaining / 1000);
    }
}
