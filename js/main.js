// Initialize the game
window.onload = function() {
    // Run browser compatibility test first
    const compatibilityTester = new BrowserCompatibilityTester();
    const compatibilityReport = compatibilityTester.runAllTests();
    
    // Display compatibility report if there are issues
    if (compatibilityReport.compatibility.issues.length > 0) {
        compatibilityTester.displayReport(compatibilityReport);
    }
    
    // Create Phaser game instance
    const game = new Phaser.Game(config);
    
    // Initialize game optimizer
    const optimizer = new GameOptimizer(game);
    window.gameOptimizer = optimizer; // Make it accessible globally
    
    // Handle browser visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Pause game when tab is not visible
            game.scene.pause('GameScene');
            game.scene.pause('UIScene');
        } else {
            // Resume game when tab becomes visible again
            game.scene.resume('GameScene');
            game.scene.resume('UIScene');
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        game.scale.refresh();
    });
    
    // Add placeholder for ad containers
    createAdContainers();
    
    // Start performance monitoring after game loads
    game.events.once('ready', function() {
        // Run performance tests and apply optimizations
        setTimeout(() => {
            console.log('Running performance tests...');
            optimizer.startMonitoring();
            
            // After 5 seconds, check performance and apply optimizations if needed
            setTimeout(() => {
                const results = optimizer.stopMonitoring();
                console.log('Initial performance:', results);
                
                // Apply optimizations based on device and performance
                optimizer.applyOptimizations();
                
                // Generate compatibility report
                const report = optimizer.generateCompatibilityReport();
                console.log('Compatibility report:', report);
            }, 5000);
        }, 2000);
    });
};

// Create ad placeholder containers
function createAdContainers() {
    const gameContainer = document.getElementById('game-container');
    
    // Top banner ad
    const topAdContainer = document.createElement('div');
    topAdContainer.className = 'ad-container ad-banner-top';
    topAdContainer.innerHTML = '<p>Advertisement Placeholder</p>';
    gameContainer.appendChild(topAdContainer);
    
    // Bottom banner ad
    const bottomAdContainer = document.createElement('div');
    bottomAdContainer.className = 'ad-container ad-banner-bottom';
    bottomAdContainer.innerHTML = '<p>Advertisement Placeholder</p>';
    gameContainer.appendChild(bottomAdContainer);
}
