class PreloadScene extends Phaser.Scene {
    constructor() {
        super('PreloadScene');
    }

    preload() {
        // Display loading progress
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;
        
        // Add logo
        const logo = this.add.image(width / 2, height / 2 - 100, 'logo');
        logo.setScale(0.5);
        
        // Create loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(width / 2 - 160, height / 2, 320, 50);
        
        // Loading text
        const loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        // Percent text
        const percentText = this.make.text({
            x: width / 2,
            y: height / 2 + 25,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        // Loading event listeners
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(width / 2 - 150, height / 2 + 10, 300 * value, 30);
        });
        
        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
        });
        
        // Load game assets
        this.loadGameAssets();
    }

    loadGameAssets() {
        // Load images
        this.load.image('background', 'assets/images/background-placeholder.png');
        this.load.image('plot', 'assets/images/plot-placeholder.png');
        this.load.image('plant1', 'assets/images/plant1-placeholder.png');
        this.load.image('plant2', 'assets/images/plant2-placeholder.png');
        this.load.image('plant3', 'assets/images/plant3-placeholder.png');
        this.load.image('coin', 'assets/images/coin-placeholder.png');
        this.load.image('button', 'assets/images/button-placeholder.png');
        
        // Load spritesheets
        this.load.spritesheet('growth', 'assets/sprites/growth-placeholder.png', { 
            frameWidth: 64, 
            frameHeight: 64 
        });
        
        // Load audio
        this.load.audio('click', 'assets/audio/click-placeholder.mp3');
        this.load.audio('harvest', 'assets/audio/harvest-placeholder.mp3');
        this.load.audio('background_music', 'assets/audio/background-music-placeholder.mp3');
    }

    create() {
        this.scene.start('MainMenuScene');
    }
}
