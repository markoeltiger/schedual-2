class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    preload() {
        // Load any assets needed for the loading screen
        this.load.image('logo', 'assets/images/logo-placeholder.png');
    }

    create() {
        this.scene.start('PreloadScene');
    }
}
