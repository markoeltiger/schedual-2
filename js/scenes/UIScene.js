class UIScene extends Phaser.Scene {
    constructor() {
        super('UIScene');
        this.gameData = null;
    }

    create() {
        // Get reference to game scene
        this.gameScene = this.scene.get('GameScene');
        
        // Listen for UI data updates
        this.gameScene.events.on('updateUIData', this.updateUI, this);
        
        // Create UI elements
        this.createUI();
    }
    
    createUI() {
        // Create resource panel
        const resourcePanel = this.add.graphics();
        resourcePanel.fillStyle(0x000000, 0.7);
        resourcePanel.fillRoundedRect(10, 10, 200, 100, 10);
        resourcePanel.lineStyle(2, 0x4CAF50, 1);
        resourcePanel.strokeRoundedRect(10, 10, 200, 100, 10);
        
        // Create resource display with icon
        const resourceIcon = this.add.image(30, 35, 'plant3');
        resourceIcon.setScale(0.5);
        
        this.resourceText = this.add.text(55, 25, 'Resources: 0', {
            fontFamily: 'Segoe UI',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        
        // Create currency display with icon
        const currencyIcon = this.add.image(30, 75, 'coin');
        currencyIcon.setScale(0.5);
        
        this.currencyText = this.add.text(55, 65, 'Currency: $0', {
            fontFamily: 'Segoe UI',
            fontSize: 20,
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        
        // Create sell button with improved styling
        const sellButton = this.add.graphics();
        sellButton.fillStyle(0x2196F3, 1);
        sellButton.fillRoundedRect(650, 20, 120, 40, 20);
        sellButton.fillGradientStyle(0x2196F3, 0x2196F3, 0x0D47A1, 0x0D47A1, 1);
        sellButton.fillRoundedRect(650, 20, 120, 40, 20);
        
        const sellButtonInteractive = this.add.zone(650, 20, 120, 40);
        sellButtonInteractive.setOrigin(0, 0);
        sellButtonInteractive.setInteractive({ useHandCursor: true });
        
        const sellText = this.add.text(710, 40, 'SELL', {
            fontFamily: 'Segoe UI',
            fontSize: 20,
            fontStyle: 'bold',
            color: '#ffffff'
        });
        sellText.setOrigin(0.5);
        
        // Sell button event
        sellButtonInteractive.on('pointerdown', () => {
            this.tweens.add({
                targets: sellButton,
                y: 2,
                duration: 50,
                ease: 'Power1',
                yoyo: true
            });
            
            const saleValue = this.gameScene.sellResources();
            if (saleValue > 0) {
                this.showSaleNotification(saleValue);
            }
        });
        
        // Add button hover effects
        this.addButtonHoverEffects(sellButtonInteractive, sellButton);
        
        // Create upgrade section
        this.createUpgradeSection();
    }
    
    createUpgradeSection() {
        // Create upgrade panel background
        const upgradePanel = this.add.graphics();
        upgradePanel.fillStyle(0x000000, 0.7);
        upgradePanel.fillRoundedRect(10, 120, 780, 100, 10);
        upgradePanel.lineStyle(2, 0xFFC107, 1);
        upgradePanel.strokeRoundedRect(10, 120, 780, 100, 10);
        
        // Upgrade section title
        this.add.text(20, 130, 'Upgrades:', {
            fontFamily: 'Segoe UI',
            fontSize: 22,
            fontStyle: 'bold',
            color: '#FFC107',
            stroke: '#000000',
            strokeThickness: 2
        });
        
        // Growth speed upgrade
        const growthButton = this.createUpgradeButton(150, 180, 'Growth Speed');
        
        this.growthText = this.add.text(150, 160, 'Growth Speed: 1x\nCost: $100', {
            fontFamily: 'Segoe UI',
            fontSize: 16,
            color: '#ffffff',
            align: 'center'
        });
        this.growthText.setOrigin(0.5, 0);
        
        // Harvest yield upgrade
        const yieldButton = this.createUpgradeButton(350, 180, 'Harvest Yield');
        
        this.yieldText = this.add.text(350, 160, 'Harvest Yield: 1x\nCost: $150', {
            fontFamily: 'Segoe UI',
            fontSize: 16,
            color: '#ffffff',
            align: 'center'
        });
        this.yieldText.setOrigin(0.5, 0);
        
        // Auto harvest upgrade
        const autoButton = this.createUpgradeButton(550, 180, 'Auto Harvest');
        
        this.autoText = this.add.text(550, 160, 'Auto Harvest: No\nCost: $500', {
            fontFamily: 'Segoe UI',
            fontSize: 16,
            color: '#ffffff',
            align: 'center'
        });
        this.autoText.setOrigin(0.5, 0);
        
        // Upgrade button events
        growthButton.on('pointerdown', () => {
            this.sound.play('click');
            const success = this.gameScene.purchaseUpgrade('growthSpeed');
            if (success) {
                this.showUpgradeEffect(150, 180);
            }
        });
        
        yieldButton.on('pointerdown', () => {
            this.sound.play('click');
            const success = this.gameScene.purchaseUpgrade('harvestYield');
            if (success) {
                this.showUpgradeEffect(350, 180);
            }
        });
        
        autoButton.on('pointerdown', () => {
            this.sound.play('click');
            const success = this.gameScene.purchaseUpgrade('autoHarvest');
            if (success) {
                this.showUpgradeEffect(550, 180);
            }
        });
    }
    
    createUpgradeButton(x, y, label) {
        // Create button background with gradient
        const button = this.add.graphics();
        button.fillGradientStyle(0x2196F3, 0x2196F3, 0x0D47A1, 0x0D47A1, 1);
        button.fillRoundedRect(x - 75, y - 20, 150, 40, 10);
        
        // Create interactive zone
        const buttonZone = this.add.zone(x - 75, y - 20, 150, 40);
        buttonZone.setOrigin(0, 0);
        buttonZone.setInteractive({ useHandCursor: true });
        
        // Add hover effects
        buttonZone.on('pointerover', () => {
            button.clear();
            button.fillGradientStyle(0x42A5F5, 0x42A5F5, 0x1976D2, 0x1976D2, 1);
            button.fillRoundedRect(x - 75, y - 20, 150, 40, 10);
        });
        
        buttonZone.on('pointerout', () => {
            button.clear();
            button.fillGradientStyle(0x2196F3, 0x2196F3, 0x0D47A1, 0x0D47A1, 1);
            button.fillRoundedRect(x - 75, y - 20, 150, 40, 10);
        });
        
        buttonZone.on('pointerdown', () => {
            button.clear();
            button.fillGradientStyle(0x1976D2, 0x1976D2, 0x0D47A1, 0x0D47A1, 1);
            button.fillRoundedRect(x - 75, y - 20, 150, 40, 10);
            
            // Add a small animation
            this.tweens.add({
                targets: button,
                y: 2,
                duration: 50,
                ease: 'Power1',
                yoyo: true
            });
        });
        
        buttonZone.on('pointerup', () => {
            button.clear();
            button.fillGradientStyle(0x42A5F5, 0x42A5F5, 0x1976D2, 0x1976D2, 1);
            button.fillRoundedRect(x - 75, y - 20, 150, 40, 10);
        });
        
        return buttonZone;
    }
    
    addButtonHoverEffects(buttonZone, buttonGraphic) {
        buttonZone.on('pointerover', () => {
            buttonGraphic.clear();
            buttonGraphic.fillGradientStyle(0x42A5F5, 0x42A5F5, 0x1976D2, 0x1976D2, 1);
            buttonGraphic.fillRoundedRect(650, 20, 120, 40, 20);
        });
        
        buttonZone.on('pointerout', () => {
            buttonGraphic.clear();
            buttonGraphic.fillGradientStyle(0x2196F3, 0x2196F3, 0x0D47A1, 0x0D47A1, 1);
            buttonGraphic.fillRoundedRect(650, 20, 120, 40, 20);
        });
    }
    
    updateUI(data) {
        this.gameData = data;
        
        // Update resource and currency displays
        this.resourceText.setText(`Resources: ${data.resources}`);
        this.currencyText.setText(`Currency: $${data.currency}`);
        
        // Update upgrade texts
        this.growthText.setText(`Growth Speed: ${data.upgrades.growthSpeed}x\nCost: $${Math.floor(100 * data.upgrades.growthSpeed)}`);
        this.yieldText.setText(`Harvest Yield: ${data.upgrades.harvestYield}x\nCost: $${Math.floor(150 * data.upgrades.harvestYield)}`);
        this.autoText.setText(`Auto Harvest: ${data.upgrades.autoHarvest ? 'Yes' : 'No'}\nCost: $${data.upgrades.autoHarvest ? 'Purchased' : '500'}`);
    }
    
    showSaleNotification(amount) {
        // Create notification background
        const notificationBg = this.add.graphics();
        notificationBg.fillStyle(0x000000, 0.8);
        notificationBg.fillRoundedRect(300, 250, 200, 60, 30);
        
        // Create notification text
        const notification = this.add.text(400, 280, `Sold for $${amount}!`, {
            fontFamily: 'Segoe UI',
            fontSize: 24,
            fontStyle: 'bold',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        notification.setOrigin(0.5);
        
        // Add coin icons around the notification
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const x = 400 + Math.cos(angle) * 120;
            const y = 280 + Math.sin(angle) * 60;
            
            const coin = this.add.image(x, y, 'coin');
            coin.setScale(0.4);
            coin.alpha = 0;
            
            // Animate coins
            this.tweens.add({
                targets: coin,
                x: 400,
                y: 280,
                alpha: 1,
                scale: 0.1,
                duration: 1000,
                ease: 'Cubic.out',
                onComplete: () => {
                    coin.destroy();
                }
            });
        }
        
        // Animate notification
        this.tweens.add({
            targets: [notification, notificationBg],
            y: '-=80',
            alpha: { from: 1, to: 0 },
            duration: 2000,
            ease: 'Power2',
            onComplete: () => {
                notification.destroy();
                notificationBg.destroy();
            }
        });
    }
    
    showUpgradeEffect(x, y) {
        // Create particle effect for upgrade
        const particles = this.add.particles('coin');
        
        const emitter = particles.createEmitter({
            x: x,
            y: y,
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 0.4, end: 0 },
            lifespan: 1000,
            quantity: 15,
            tint: 0xFFD700
        });
        
        // Stop emitter after one burst
        this.time.delayedCall(100, () => {
            emitter.stop();
            // Destroy particles after they fade out
            this.time.delayedCall(1000, () => {
                particles.destroy();
            });
        });
        
        // Show upgrade text
        const upgradeText = this.add.text(x, y - 40, 'Upgraded!', {
            fontFamily: 'Segoe UI',
            fontSize: 20,
            fontStyle: 'bold',
            color: '#FFC107',
            stroke: '#000000',
            strokeThickness: 3
        });
        upgradeText.setOrigin(0.5);
        
        // Animate upgrade text
        this.tweens.add({
            targets: upgradeText,
            y: y - 80,
            alpha: 0,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                upgradeText.destroy();
            }
        });
    }
}
