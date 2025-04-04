class MainMenuScene extends Phaser.Scene {
    constructor() {
        super('MainMenuScene');
    }

    create() {
        // Add background
        this.add.image(400, 300, 'background');
        
        // Add title
        const title = this.add.text(400, 150, 'Resource Management Simulation', {
            fontFamily: 'Arial',
            fontSize: 36,
            color: '#ffffff',
            fontStyle: 'bold',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 4
        });
        title.setOrigin(0.5);
        
        // Add start button
        const startButton = this.add.image(400, 300, 'button');
        startButton.setScale(2);
        startButton.setInteractive({ useHandCursor: true });
        
        const startText = this.add.text(400, 300, 'Start Game', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff'
        });
        startText.setOrigin(0.5);
        
        // Add instructions button
        const instructionsButton = this.add.image(400, 400, 'button');
        instructionsButton.setScale(2);
        instructionsButton.setInteractive({ useHandCursor: true });
        
        const instructionsText = this.add.text(400, 400, 'Instructions', {
            fontFamily: 'Arial',
            fontSize: 24,
            color: '#ffffff'
        });
        instructionsText.setOrigin(0.5);
        
        // Button events
        startButton.on('pointerdown', () => {
            this.sound.play('click');
            this.scene.start('GameScene');
        });
        
        instructionsButton.on('pointerdown', () => {
            this.sound.play('click');
            this.showInstructions();
        });
        
        // Add button hover effects
        this.addButtonHoverEffects(startButton);
        this.addButtonHoverEffects(instructionsButton);
        
        // Start background music
        if (!this.sound.get('background_music')) {
            const music = this.sound.add('background_music', {
                volume: 0.5,
                loop: true
            });
            music.play();
        }
    }
    
    addButtonHoverEffects(button) {
        button.on('pointerover', () => {
            button.setTint(0xcccccc);
        });
        
        button.on('pointerout', () => {
            button.clearTint();
        });
    }
    
    showInstructions() {
        // Create a semi-transparent background
        const overlay = this.add.rectangle(400, 300, 700, 500, 0x000000, 0.8);
        overlay.setInteractive();
        
        // Add instructions text
        const instructions = this.add.text(400, 200, 
            'Game Instructions:\n\n' +
            '1. Plant resources by clicking on empty plots\n' +
            '2. Wait for resources to grow\n' +
            '3. Harvest when ready to collect yield\n' +
            '4. Sell your harvest for profit\n' +
            '5. Buy upgrades to improve your operation\n\n' +
            'Your goal is to build the most profitable operation!',
            {
                fontFamily: 'Arial',
                fontSize: 20,
                color: '#ffffff',
                align: 'center',
                wordWrap: { width: 600 }
            }
        );
        instructions.setOrigin(0.5, 0);
        
        // Add close button
        const closeButton = this.add.image(400, 450, 'button');
        closeButton.setScale(1.5);
        closeButton.setInteractive({ useHandCursor: true });
        
        const closeText = this.add.text(400, 450, 'Close', {
            fontFamily: 'Arial',
            fontSize: 20,
            color: '#ffffff'
        });
        closeText.setOrigin(0.5);
        
        // Close button event
        closeButton.on('pointerdown', () => {
            this.sound.play('click');
            overlay.destroy();
            instructions.destroy();
            closeButton.destroy();
            closeText.destroy();
        });
        
        // Add button hover effect
        this.addButtonHoverEffects(closeButton);
    }
}
