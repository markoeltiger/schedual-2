class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');
        
        // Game state
        this.resources = 0;
        this.currency = 100;
        this.plots = [];
        this.upgrades = {
            growthSpeed: 1,
            harvestYield: 1,
            autoHarvest: false
        };
        
        // Ad manager will be initialized in create()
        this.adManager = null;
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');
        
        // Initialize ad manager
        this.adManager = new AdManager(this);
        
        // Create plots
        this.createPlots();
        
        // Start UI scene
        this.scene.launch('UIScene');
        
        // Set up communication with UI scene
        this.events.on('updateUI', this.updateUI, this);
        
        // Initial UI update
        this.updateUI();
        
        // Create bonus button for watching ads
        this.createAdBonusButton();
    }
    
    createAdBonusButton() {
        // Create button background with gradient
        const bonusButton = this.add.graphics();
        bonusButton.fillGradientStyle(0xFF5722, 0xFF5722, 0xE64A19, 0xE64A19, 1);
        bonusButton.fillRoundedRect(650, 500, 120, 40, 10);
        
        // Create interactive zone
        const buttonZone = this.add.zone(650, 500, 120, 40);
        buttonZone.setOrigin(0, 0);
        buttonZone.setInteractive({ useHandCursor: true });
        
        // Add button text
        const buttonText = this.add.text(710, 520, 'Watch Ad\nfor Bonus', {
            fontFamily: 'Segoe UI',
            fontSize: 14,
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center'
        });
        buttonText.setOrigin(0.5);
        
        // Store references
        this.adBonusButton = {
            graphics: bonusButton,
            zone: buttonZone,
            text: buttonText,
            cooldownText: null
        };
        
        // Add hover effects
        buttonZone.on('pointerover', () => {
            if (this.adManager.isRewardAdAvailable()) {
                bonusButton.clear();
                bonusButton.fillGradientStyle(0xFF7043, 0xFF7043, 0xF4511E, 0xF4511E, 1);
                bonusButton.fillRoundedRect(650, 500, 120, 40, 10);
            }
        });
        
        buttonZone.on('pointerout', () => {
            if (this.adManager.isRewardAdAvailable()) {
                bonusButton.clear();
                bonusButton.fillGradientStyle(0xFF5722, 0xFF5722, 0xE64A19, 0xE64A19, 1);
                bonusButton.fillRoundedRect(650, 500, 120, 40, 10);
            }
        });
        
        // Add click event
        buttonZone.on('pointerdown', () => {
            this.showAdForBonus();
        });
        
        // Update button state initially
        this.updateAdBonusButton();
        
        // Set up timer to update button state
        this.time.addEvent({
            delay: 1000,
            callback: this.updateAdBonusButton,
            callbackScope: this,
            loop: true
        });
    }
    
    updateAdBonusButton() {
        const { graphics, zone, text, cooldownText } = this.adBonusButton;
        
        if (this.adManager.isRewardAdAvailable()) {
            // Ad is available
            graphics.clear();
            graphics.fillGradientStyle(0xFF5722, 0xFF5722, 0xE64A19, 0xE64A19, 1);
            graphics.fillRoundedRect(650, 500, 120, 40, 10);
            
            zone.input.cursor = 'pointer';
            
            text.setText('Watch Ad\nfor Bonus');
            text.setAlpha(1);
            
            // Remove cooldown text if exists
            if (cooldownText) {
                cooldownText.destroy();
                this.adBonusButton.cooldownText = null;
            }
        } else {
            // Ad is on cooldown
            graphics.clear();
            graphics.fillGradientStyle(0x9E9E9E, 0x9E9E9E, 0x757575, 0x757575, 1);
            graphics.fillRoundedRect(650, 500, 120, 40, 10);
            
            zone.input.cursor = 'default';
            
            text.setText('Ad Bonus');
            text.setAlpha(0.7);
            
            // Show or update cooldown text
            const remainingTime = this.adManager.getAdCooldownRemaining();
            
            if (!cooldownText) {
                this.adBonusButton.cooldownText = this.add.text(710, 540, `Available in: ${remainingTime}s`, {
                    fontFamily: 'Segoe UI',
                    fontSize: 10,
                    color: '#FFFFFF',
                    align: 'center'
                });
                this.adBonusButton.cooldownText.setOrigin(0.5);
                this.adBonusButton.cooldownText.setAlpha(0.7);
            } else {
                cooldownText.setText(`Available in: ${remainingTime}s`);
            }
        }
    }
    
    showAdForBonus() {
        if (!this.adManager.isRewardAdAvailable()) {
            return;
        }
        
        // Show ad and give bonus on completion
        this.adManager.showRewardAd((success) => {
            if (success) {
                // Give player a random bonus
                const bonusType = Phaser.Math.Between(1, 3);
                
                switch (bonusType) {
                    case 1:
                        // Currency bonus
                        const currencyBonus = 50;
                        this.currency += currencyBonus;
                        this.showBonusMessage(`+$${currencyBonus} Currency!`);
                        break;
                        
                    case 2:
                        // Resource bonus
                        const resourceBonus = 30;
                        this.resources += resourceBonus;
                        this.showBonusMessage(`+${resourceBonus} Resources!`);
                        break;
                        
                    case 3:
                        // Growth speed temporary boost
                        const originalSpeed = this.upgrades.growthSpeed;
                        this.upgrades.growthSpeed *= 2;
                        this.showBonusMessage('2x Growth Speed\nfor 30 seconds!');
                        
                        // Reset after 30 seconds
                        this.time.delayedCall(30000, () => {
                            this.upgrades.growthSpeed = originalSpeed;
                            this.showBonusMessage('Growth speed boost ended', 0xFF5722);
                        });
                        break;
                }
                
                // Update UI
                this.updateUI();
                
                // Update ad button state
                this.updateAdBonusButton();
            }
        });
    }
    
    showBonusMessage(message, color = 0x4CAF50) {
        // Create message background
        const messageBg = this.add.graphics();
        messageBg.fillStyle(color, 0.9);
        messageBg.fillRoundedRect(250, 250, 300, 100, 15);
        
        // Add star particles around the message
        const particles = this.add.particles('coin');
        const emitter = particles.createEmitter({
            x: 400,
            y: 300,
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            lifespan: 1500,
            quantity: 2,
            frequency: 100,
            blendMode: 'ADD',
            tint: 0xFFD700
        });
        
        // Create message text
        const messageText = this.add.text(400, 300, message, {
            fontFamily: 'Segoe UI',
            fontSize: 24,
            fontStyle: 'bold',
            color: '#FFFFFF',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        });
        messageText.setOrigin(0.5);
        
        // Animate the message
        this.tweens.add({
            targets: [messageBg, messageText],
            alpha: { from: 0, to: 1 },
            duration: 500,
            ease: 'Power2',
            onComplete: () => {
                // Hold for a moment then fade out
                this.time.delayedCall(2000, () => {
                    this.tweens.add({
                        targets: [messageBg, messageText, particles],
                        alpha: 0,
                        duration: 500,
                        ease: 'Power2',
                        onComplete: () => {
                            messageBg.destroy();
                            messageText.destroy();
                            particles.destroy();
                        }
                    });
                });
            }
        });
    }
    
    createPlots() {
        const plotPositions = [
            { x: 200, y: 200 },
            { x: 400, y: 200 },
            { x: 600, y: 200 },
            { x: 200, y: 400 },
            { x: 400, y: 400 },
            { x: 600, y: 400 }
        ];
        
        plotPositions.forEach((position, index) => {
            const plot = this.add.image(position.x, position.y, 'plot');
            plot.setInteractive({ useHandCursor: true });
            
            // Add plot data
            plot.setData({
                id: index,
                state: 'empty', // empty, growing, ready
                growthTimer: null,
                growthStage: 0,
                plant: null
            });
            
            // Plot click event
            plot.on('pointerdown', () => {
                this.handlePlotClick(plot);
            });
            
            this.plots.push(plot);
        });
    }
    
    handlePlotClick(plot) {
        const plotData = plot.getData();
        
        switch (plotData.state) {
            case 'empty':
                this.plantResource(plot);
                break;
            case 'growing':
                // Nothing happens when clicking a growing plant
                break;
            case 'ready':
                this.harvestResource(plot);
                break;
        }
    }
    
    plantResource(plot) {
        const plotData = plot.getData();
        const plantCost = 10;
        
        // Check if player has enough currency
        if (this.currency >= plantCost) {
            // Deduct cost
            this.currency -= plantCost;
            
            // Update plot state
            plotData.state = 'growing';
            plotData.growthStage = 0;
            
            // Create plant sprite with animation
            const plant = this.add.sprite(plot.x, plot.y, 'growth', 0);
            plant.setScale(0);
            plotData.plant = plant;
            
            // Animate the plant appearing
            this.tweens.add({
                targets: plant,
                scale: 1,
                duration: 500,
                ease: 'Back.out',
                onComplete: () => {
                    // Add a small dirt particle effect
                    const particles = this.add.particles('plot');
                    const emitter = particles.createEmitter({
                        x: plot.x,
                        y: plot.y,
                        speed: { min: 30, max: 70 },
                        angle: { min: 240, max: 300 },
                        scale: { start: 0.1, end: 0 },
                        lifespan: 600,
                        quantity: 8,
                        tint: 0x795548
                    });
                    
                    // Stop emitter after one burst
                    this.time.delayedCall(100, () => {
                        emitter.stop();
                        // Destroy particles after they fade out
                        this.time.delayedCall(600, () => {
                            particles.destroy();
                        });
                    });
                }
            });
            
            // Set growth timer
            const growthTime = 5000 / this.upgrades.growthSpeed; // 5 seconds divided by growth speed upgrade
            plotData.growthTimer = this.time.addEvent({
                delay: growthTime / 3, // Three growth stages
                callback: () => this.growPlant(plot),
                callbackScope: this,
                repeat: 2 // Call 3 times total (0, 1, 2)
            });
            
            // Play planting sound
            this.sound.play('click');
            
            // Add a small camera shake for feedback
            this.cameras.main.shake(100, 0.003);
            
            // Update plot data
            plot.setData(plotData);
            
            // Update UI
            this.updateUI();
            
            // Show planting cost feedback
            this.showCostFeedback(plot.x, plot.y, plantCost);
        } else {
            // Not enough currency - show feedback
            this.showInsufficientFundsMessage();
        }
    }
    
    showCostFeedback(x, y, amount) {
        // Show cost text that floats up and fades
        const costText = this.add.text(x, y, `-$${amount}`, {
            fontFamily: 'Segoe UI',
            fontSize: 20,
            fontStyle: 'bold',
            color: '#FF5722',
            stroke: '#000000',
            strokeThickness: 3
        });
        costText.setOrigin(0.5);
        
        // Animate the cost text
        this.tweens.add({
            targets: costText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                costText.destroy();
            }
        });
    }
    
    showInsufficientFundsMessage() {
        // Create a message in the center of the screen
        const messageBg = this.add.graphics();
        messageBg.fillStyle(0xFF5722, 0.8);
        messageBg.fillRoundedRect(250, 250, 300, 60, 15);
        
        const message = this.add.text(400, 280, 'Not enough currency!', {
            fontFamily: 'Segoe UI',
            fontSize: 22,
            fontStyle: 'bold',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        });
        message.setOrigin(0.5);
        
        // Animate the message
        this.tweens.add({
            targets: [messageBg, message],
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            delay: 1000,
            onComplete: () => {
                messageBg.destroy();
                message.destroy();
            }
        });
    }
    
    growPlant(plot) {
        const plotData = plot.getData();
        
        // Increment growth stage
        plotData.growthStage++;
        
        // Update plant sprite frame with animation
        if (plotData.plant) {
            // Create a growth animation
            this.tweens.add({
                targets: plotData.plant,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                yoyo: true,
                onComplete: () => {
                    // Update the frame after the animation
                    plotData.plant.setFrame(plotData.growthStage);
                    
                    // Add a small particle effect for growth
                    const particles = this.add.particles('plant1');
                    const emitter = particles.createEmitter({
                        x: plot.x,
                        y: plot.y - 20,
                        speed: { min: 20, max: 50 },
                        angle: { min: 0, max: 360 },
                        scale: { start: 0.2, end: 0 },
                        lifespan: 800,
                        quantity: 5,
                        tint: 0x8BC34A
                    });
                    
                    // Stop emitter after one burst
                    this.time.delayedCall(100, () => {
                        emitter.stop();
                        // Destroy particles after they fade out
                        this.time.delayedCall(800, () => {
                            particles.destroy();
                        });
                    });
                }
            });
        }
        
        // Check if fully grown
        if (plotData.growthStage >= 2) {
            plotData.state = 'ready';
            
            // Add a glow effect to indicate readiness
            const glow = this.add.graphics();
            glow.fillStyle(0xFFFF00, 0.3);
            glow.fillCircle(plot.x, plot.y, 40);
            
            // Pulse the glow
            this.tweens.add({
                targets: glow,
                alpha: { from: 0.3, to: 0.6 },
                duration: 800,
                yoyo: true,
                repeat: -1
            });
            
            // Store the glow reference
            plotData.glowEffect = glow;
            
            // Auto-harvest if upgrade is purchased
            if (this.upgrades.autoHarvest) {
                this.time.delayedCall(500, () => {
                    this.harvestResource(plot);
                });
            }
        }
        
        // Update plot data
        plot.setData(plotData);
    }
    
    harvestResource(plot) {
        const plotData = plot.getData();
        
        // Calculate yield based on upgrade
        const resourceYield = 20 * this.upgrades.harvestYield;
        
        // Add resources
        this.resources += resourceYield;
        
        // Play harvest sound
        this.sound.play('harvest');
        
        // Create harvest effect
        this.createHarvestEffect(plot.x, plot.y);
        
        // Remove glow effect if exists
        if (plotData.glowEffect) {
            plotData.glowEffect.destroy();
            plotData.glowEffect = null;
        }
        
        // Reset plot with animation
        plotData.state = 'empty';
        plotData.growthStage = 0;
        
        if (plotData.plant) {
            // Animate the plant disappearing
            this.tweens.add({
                targets: plotData.plant,
                scale: 0,
                duration: 300,
                ease: 'Back.in',
                onComplete: () => {
                    plotData.plant.destroy();
                    plotData.plant = null;
                    
                    // Add a small dust effect after harvesting
                    const particles = this.add.particles('plot');
                    const emitter = particles.createEmitter({
                        x: plot.x,
                        y: plot.y,
                        speed: { min: 20, max: 50 },
                        angle: { min: 0, max: 360 },
                        scale: { start: 0.1, end: 0 },
                        lifespan: 500,
                        quantity: 5,
                        tint: 0x795548
                    });
                    
                    // Stop emitter after one burst
                    this.time.delayedCall(100, () => {
                        emitter.stop();
                        // Destroy particles after they fade out
                        this.time.delayedCall(500, () => {
                            particles.destroy();
                        });
                    });
                }
            });
        }
        
        // Update plot data
        plot.setData(plotData);
        
        // Update UI
        this.updateUI();
    }
    
    createHarvestEffect(x, y) {
        // Create particle effect for harvesting
        const particles = this.add.particles('coin');
        
        // Create a more elaborate particle effect
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 100, max: 300 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.6, end: 0 },
            lifespan: { min: 800, max: 1200 },
            quantity: 15,
            blendMode: 'ADD',
            rotate: { min: 0, max: 360 },
            tint: [ 0xFFD700, 0xFFA500, 0xFFFF00 ]
        });
        
        // Add a flash effect
        const flash = this.add.circle(x, y, 40, 0xFFFFFF, 0.8);
        this.tweens.add({
            targets: flash,
            alpha: 0,
            scale: 2,
            duration: 300,
            onComplete: () => {
                flash.destroy();
            }
        });
        
        // Add a rising text showing the yield
        const yield = 20 * this.upgrades.harvestYield;
        const yieldText = this.add.text(x, y - 20, `+${yield}`, {
            fontFamily: 'Segoe UI',
            fontSize: 24,
            fontStyle: 'bold',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 3
        });
        yieldText.setOrigin(0.5);
        
        // Animate the yield text
        this.tweens.add({
            targets: yieldText,
            y: y - 80,
            alpha: 0,
            scale: 1.5,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => {
                yieldText.destroy();
            }
        });
        
        // Stop emitter after one burst
        this.time.delayedCall(100, () => {
            emitter.stop();
            // Destroy particles after they fade out
            this.time.delayedCall(1200, () => {
                particles.destroy();
            });
        });
        
        // Add camera shake for feedback
        this.cameras.main.shake(200, 0.005);
    }
    
    sellResources() {
        if (this.resources > 0) {
            // Calculate sale value
            const saleValue = this.resources * 2;
            
            // Add currency
            this.currency += saleValue;
            
            // Reset resources
            this.resources = 0;
            
            // Play sound
            this.sound.play('click');
            
            // Update UI
            this.updateUI();
            
            return saleValue;
        }
        
        return 0;
    }
    
    purchaseUpgrade(type) {
        let cost = 0;
        
        switch (type) {
            case 'growthSpeed':
                cost = 100 * this.upgrades.growthSpeed;
                if (this.currency >= cost) {
                    this.currency -= cost;
                    this.upgrades.growthSpeed += 0.5;
                    this.sound.play('click');
                    this.updateUI();
                    return true;
                }
                break;
                
            case 'harvestYield':
                cost = 150 * this.upgrades.harvestYield;
                if (this.currency >= cost) {
                    this.currency -= cost;
                    this.upgrades.harvestYield += 0.5;
                    this.sound.play('click');
                    this.updateUI();
                    return true;
                }
                break;
                
            case 'autoHarvest':
                if (!this.upgrades.autoHarvest && this.currency >= 500) {
                    this.currency -= 500;
                    this.upgrades.autoHarvest = true;
                    this.sound.play('click');
                    this.updateUI();
                    return true;
                }
                break;
        }
        
        return false;
    }
    
    updateUI() {
        // Send game state to UI scene
        this.events.emit('updateUIData', {
            resources: this.resources,
            currency: this.currency,
            upgrades: this.upgrades
        });
    }
}
