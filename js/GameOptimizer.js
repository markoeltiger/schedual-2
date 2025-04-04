// Performance optimization and testing utilities
class GameOptimizer {
    constructor(game) {
        this.game = game;
        this.metrics = {
            fps: [],
            memory: [],
            renderTime: []
        };
        this.isMonitoring = false;
        this.monitorInterval = null;
        this.deviceInfo = this.detectDevice();
    }
    
    // Detect device type and capabilities
    detectDevice() {
        const info = {
            isMobile: false,
            browser: 'unknown',
            screenSize: {
                width: window.innerWidth,
                height: window.innerHeight
            },
            pixelRatio: window.devicePixelRatio || 1
        };
        
        // Check if mobile
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if (/android|iPad|iPhone|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            info.isMobile = true;
        }
        
        // Detect browser
        if (userAgent.indexOf("Chrome") > -1) {
            info.browser = "Chrome";
        } else if (userAgent.indexOf("Safari") > -1) {
            info.browser = "Safari";
        } else if (userAgent.indexOf("Firefox") > -1) {
            info.browser = "Firefox";
        } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
            info.browser = "IE";
        } else if (userAgent.indexOf("Edge") > -1) {
            info.browser = "Edge";
        }
        
        console.log("Device detected:", info);
        return info;
    }
    
    // Start monitoring performance
    startMonitoring() {
        if (this.isMonitoring) return;
        
        this.isMonitoring = true;
        this.metrics = {
            fps: [],
            memory: [],
            renderTime: []
        };
        
        let lastTime = performance.now();
        let frames = 0;
        
        // Create FPS counter display
        this.fpsText = this.game.add.text(10, 580, 'FPS: 0', {
            fontFamily: 'Segoe UI',
            fontSize: 14,
            color: '#FFFFFF',
            backgroundColor: '#000000'
        });
        this.fpsText.setDepth(1000);
        
        this.monitorInterval = setInterval(() => {
            const now = performance.now();
            frames++;
            
            // Calculate FPS every second
            if (now - lastTime >= 1000) {
                const fps = Math.round((frames * 1000) / (now - lastTime));
                this.metrics.fps.push(fps);
                this.fpsText.setText(`FPS: ${fps}`);
                
                // Get memory usage if available
                if (performance.memory) {
                    this.metrics.memory.push(performance.memory.usedJSHeapSize / (1024 * 1024));
                }
                
                // Reset counters
                frames = 0;
                lastTime = now;
            }
        }, 100);
        
        console.log("Performance monitoring started");
    }
    
    // Stop monitoring and return results
    stopMonitoring() {
        if (!this.isMonitoring) return null;
        
        clearInterval(this.monitorInterval);
        this.isMonitoring = false;
        
        if (this.fpsText) {
            this.fpsText.destroy();
        }
        
        // Calculate averages
        const results = {
            averageFps: this.calculateAverage(this.metrics.fps),
            minFps: Math.min(...this.metrics.fps),
            maxFps: Math.max(...this.metrics.fps)
        };
        
        if (this.metrics.memory.length > 0) {
            results.averageMemory = this.calculateAverage(this.metrics.memory);
        }
        
        console.log("Performance monitoring results:", results);
        return results;
    }
    
    // Calculate average from array of numbers
    calculateAverage(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    
    // Apply optimizations based on device capabilities
    applyOptimizations() {
        const game = this.game;
        
        // Mobile-specific optimizations
        if (this.deviceInfo.isMobile) {
            console.log("Applying mobile optimizations");
            
            // Reduce particle effects
            this.reduceParticleEffects(game);
            
            // Disable some visual effects
            this.disableNonEssentialEffects(game);
            
            // Scale down textures
            this.optimizeTextures(game);
        }
        
        // Browser-specific optimizations
        if (this.deviceInfo.browser === "Safari") {
            // Safari-specific optimizations
            console.log("Applying Safari-specific optimizations");
            // Safari has issues with some WebGL features, adjust accordingly
        }
        
        // Low-end device optimizations (based on FPS)
        if (this.metrics.fps.length > 0 && this.calculateAverage(this.metrics.fps) < 30) {
            console.log("Applying low-end device optimizations");
            this.applyLowEndOptimizations(game);
        }
        
        console.log("Optimizations applied");
    }
    
    // Reduce particle count and complexity
    reduceParticleEffects(game) {
        // This would be implemented to find all particle emitters and reduce their settings
        console.log("Reducing particle effects for better performance");
        
        // Example implementation (would need to be adapted to actual game structure)
        // game.particleReduction = true;
    }
    
    // Disable non-essential visual effects
    disableNonEssentialEffects(game) {
        console.log("Disabling non-essential visual effects");
        
        // Example: disable shadows, complex animations, etc.
        // game.disableVisualEffects = true;
    }
    
    // Optimize textures for performance
    optimizeTextures(game) {
        console.log("Optimizing textures");
        
        // Example: use lower resolution textures
        // game.lowResTextures = true;
    }
    
    // Apply optimizations for low-end devices
    applyLowEndOptimizations(game) {
        console.log("Applying low-end device optimizations");
        
        // Reduce animation frame rate
        // Simplify physics calculations
        // Reduce draw calls
    }
    
    // Run a comprehensive test suite
    runTestSuite() {
        console.log("Running test suite...");
        
        // Start performance monitoring
        this.startMonitoring();
        
        // Test various game functions
        this.testGameFunctions();
        
        // After some time, stop monitoring and apply optimizations
        setTimeout(() => {
            const results = this.stopMonitoring();
            console.log("Test results:", results);
            
            // Apply optimizations based on results
            this.applyOptimizations();
            
            // Run a second test to verify improvements
            this.startMonitoring();
            
            setTimeout(() => {
                const improvedResults = this.stopMonitoring();
                console.log("Post-optimization results:", improvedResults);
                
                // Calculate improvement
                const improvement = {
                    fps: improvedResults.averageFps - results.averageFps,
                    percentage: ((improvedResults.averageFps - results.averageFps) / results.averageFps) * 100
                };
                
                console.log(`Performance improved by ${improvement.fps.toFixed(2)} FPS (${improvement.percentage.toFixed(2)}%)`);
            }, 10000);
        }, 10000);
    }
    
    // Test various game functions to stress test performance
    testGameFunctions() {
        console.log("Testing game functions...");
        
        // This would simulate various game actions to test performance
        // For example:
        // - Plant multiple resources
        // - Trigger multiple harvests
        // - Test UI interactions
        // - Test animations
    }
    
    // Generate a compatibility report
    generateCompatibilityReport() {
        const report = {
            device: this.deviceInfo,
            performance: {
                averageFps: this.calculateAverage(this.metrics.fps),
                minFps: this.metrics.fps.length > 0 ? Math.min(...this.metrics.fps) : 0,
                maxFps: this.metrics.fps.length > 0 ? Math.max(...this.metrics.fps) : 0
            },
            compatibility: {
                overall: "Good",
                issues: []
            },
            recommendations: []
        };
        
        // Determine overall compatibility
        if (report.performance.averageFps < 20) {
            report.compatibility.overall = "Poor";
            report.compatibility.issues.push("Low frame rate detected");
            report.recommendations.push("Try closing other applications to free up resources");
        } else if (report.performance.averageFps < 40) {
            report.compatibility.overall = "Fair";
            report.recommendations.push("Game will run, but some visual effects may be disabled for better performance");
        }
        
        // Browser-specific issues
        if (this.deviceInfo.browser === "IE") {
            report.compatibility.issues.push("Internet Explorer has limited support for modern web features");
            report.recommendations.push("Consider using Chrome or Firefox for better experience");
        }
        
        // Mobile-specific recommendations
        if (this.deviceInfo.isMobile) {
            report.recommendations.push("For best experience, play in landscape orientation");
            
            if (this.deviceInfo.screenSize.width < 768) {
                report.recommendations.push("Small screen detected. Some UI elements may be smaller than optimal");
            }
        }
        
        console.log("Compatibility report generated:", report);
        return report;
    }
}

// Export the optimizer
window.GameOptimizer = GameOptimizer;
