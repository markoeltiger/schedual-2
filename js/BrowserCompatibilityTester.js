// Browser compatibility testing module
class BrowserCompatibilityTester {
    constructor() {
        this.testResults = {
            features: {},
            performance: {},
            compatibility: {}
        };
        
        // Detect browser and device
        this.browserInfo = this.detectBrowser();
    }
    
    // Detect browser and version
    detectBrowser() {
        const userAgent = navigator.userAgent;
        let browser = "Unknown";
        let version = "Unknown";
        let mobile = false;
        
        // Check for mobile
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
            mobile = true;
        }
        
        // Detect browser
        if (userAgent.indexOf("Firefox") > -1) {
            browser = "Firefox";
            version = userAgent.match(/Firefox\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Edge") === -1 && userAgent.indexOf("Edg") === -1) {
            browser = "Chrome";
            version = userAgent.match(/Chrome\/([0-9.]+)/)[1];
        } else if (userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") === -1) {
            browser = "Safari";
            version = userAgent.match(/Version\/([0-9.]+)/)?.[1] || "Unknown";
        } else if (userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Edg") > -1) {
            browser = "Edge";
            version = userAgent.match(/Edge\/([0-9.]+)/)?.[1] || userAgent.match(/Edg\/([0-9.]+)/)?.[1] || "Unknown";
        } else if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1) {
            browser = "Internet Explorer";
            version = userAgent.match(/MSIE ([0-9.]+)/)?.[1] || "11.0";
        }
        
        return {
            name: browser,
            version: version,
            mobile: mobile,
            userAgent: userAgent,
            platform: navigator.platform,
            language: navigator.language,
            screenWidth: window.screen.width,
            screenHeight: window.screen.height,
            devicePixelRatio: window.devicePixelRatio || 1
        };
    }
    
    // Run all compatibility tests
    runAllTests() {
        console.log("Running browser compatibility tests...");
        console.log("Browser detected:", this.browserInfo);
        
        // Test essential features
        this.testWebGL();
        this.testLocalStorage();
        this.testAudio();
        this.testTouchSupport();
        this.testOrientation();
        
        // Test performance
        this.testRenderingPerformance();
        
        // Generate compatibility report
        return this.generateReport();
    }
    
    // Test WebGL support
    testWebGL() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            
            if (gl) {
                const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown";
                
                this.testResults.features.webgl = {
                    supported: true,
                    renderer: renderer,
                    version: gl.getParameter(gl.VERSION),
                    shadingLanguageVersion: gl.getParameter(gl.SHADING_LANGUAGE_VERSION),
                    vendor: gl.getParameter(gl.VENDOR)
                };
            } else {
                this.testResults.features.webgl = {
                    supported: false
                };
            }
        } catch (e) {
            this.testResults.features.webgl = {
                supported: false,
                error: e.message
            };
        }
        
        console.log("WebGL support:", this.testResults.features.webgl);
    }
    
    // Test LocalStorage support
    testLocalStorage() {
        try {
            const testKey = "_test_" + Math.random();
            localStorage.setItem(testKey, "test");
            const result = localStorage.getItem(testKey);
            localStorage.removeItem(testKey);
            
            this.testResults.features.localStorage = {
                supported: result === "test"
            };
        } catch (e) {
            this.testResults.features.localStorage = {
                supported: false,
                error: e.message
            };
        }
        
        console.log("LocalStorage support:", this.testResults.features.localStorage);
    }
    
    // Test Audio support
    testAudio() {
        try {
            const audio = new Audio();
            
            this.testResults.features.audio = {
                supported: !!audio.canPlayType,
                mp3: audio.canPlayType('audio/mpeg').replace(/no/, ''),
                ogg: audio.canPlayType('audio/ogg; codecs="vorbis"').replace(/no/, ''),
                wav: audio.canPlayType('audio/wav; codecs="1"').replace(/no/, ''),
                m4a: audio.canPlayType('audio/x-m4a;').replace(/no/, ''),
                aac: audio.canPlayType('audio/aac;').replace(/no/, '')
            };
        } catch (e) {
            this.testResults.features.audio = {
                supported: false,
                error: e.message
            };
        }
        
        console.log("Audio support:", this.testResults.features.audio);
    }
    
    // Test touch support
    testTouchSupport() {
        this.testResults.features.touch = {
            supported: 'ontouchstart' in window || navigator.maxTouchPoints > 0,
            maxTouchPoints: navigator.maxTouchPoints || 0
        };
        
        console.log("Touch support:", this.testResults.features.touch);
    }
    
    // Test screen orientation
    testOrientation() {
        this.testResults.features.orientation = {
            supported: !!window.screen.orientation || !!window.orientation,
            type: window.screen.orientation ? window.screen.orientation.type : null,
            angle: window.screen.orientation ? window.screen.orientation.angle : window.orientation
        };
        
        console.log("Orientation support:", this.testResults.features.orientation);
    }
    
    // Test rendering performance
    testRenderingPerformance() {
        // Create a canvas for testing
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Measure time to render 1000 rectangles
        const startTime = performance.now();
        
        for (let i = 0; i < 1000; i++) {
            ctx.fillStyle = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
            ctx.fillRect(Math.random() * 800, Math.random() * 600, 20, 20);
        }
        
        const endTime = performance.now();
        const renderTime = endTime - startTime;
        
        this.testResults.performance.rendering = {
            time: renderTime,
            rectanglesPerSecond: 1000 / (renderTime / 1000)
        };
        
        console.log("Rendering performance:", this.testResults.performance.rendering);
    }
    
    // Generate compatibility report
    generateReport() {
        // Determine overall compatibility
        let overallCompatibility = "Excellent";
        const issues = [];
        const recommendations = [];
        
        // Check WebGL
        if (!this.testResults.features.webgl.supported) {
            overallCompatibility = "Poor";
            issues.push("WebGL is not supported");
            recommendations.push("Use a browser with WebGL support, such as Chrome, Firefox, or Edge");
        }
        
        // Check LocalStorage
        if (!this.testResults.features.localStorage.supported) {
            overallCompatibility = "Fair";
            issues.push("LocalStorage is not supported");
            recommendations.push("Game progress cannot be saved. Use a modern browser for full functionality");
        }
        
        // Check Audio
        if (!this.testResults.features.audio.supported) {
            issues.push("Audio playback may not be fully supported");
            recommendations.push("Game will run without sound. Use Chrome or Firefox for best experience");
        }
        
        // Check rendering performance
        if (this.testResults.performance.rendering.rectanglesPerSecond < 10000) {
            if (overallCompatibility === "Excellent") overallCompatibility = "Good";
            issues.push("Graphics performance is below optimal levels");
            recommendations.push("Close other applications or tabs to improve performance");
        }
        
        // Mobile-specific checks
        if (this.browserInfo.mobile) {
            if (!this.testResults.features.touch.supported) {
                overallCompatibility = "Poor";
                issues.push("Touch input is not properly detected on your mobile device");
                recommendations.push("Try using a different mobile browser");
            }
            
            if (this.browserInfo.screenWidth < 768) {
                recommendations.push("For best experience on small screens, rotate your device to landscape mode");
            }
        }
        
        // Browser-specific recommendations
        if (this.browserInfo.name === "Internet Explorer") {
            overallCompatibility = "Poor";
            issues.push("Internet Explorer has limited support for modern web features");
            recommendations.push("Please use Chrome, Firefox, or Edge for the best experience");
        } else if (this.browserInfo.name === "Safari" && parseFloat(this.browserInfo.version) < 11) {
            overallCompatibility = "Fair";
            issues.push("You're using an older version of Safari");
            recommendations.push("Update to the latest Safari version for best performance");
        }
        
        // Compile the final report
        const report = {
            browser: this.browserInfo,
            features: this.testResults.features,
            performance: this.testResults.performance,
            compatibility: {
                overall: overallCompatibility,
                issues: issues,
                recommendations: recommendations
            }
        };
        
        console.log("Compatibility Report:", report);
        return report;
    }
    
    // Display compatibility report to user
    displayReport(report) {
        // This would create a UI element to show the report to the user
        console.log("Displaying compatibility report to user:", report);
        
        // Example implementation (would be integrated with the game UI)
        const reportContainer = document.createElement('div');
        reportContainer.style.position = 'absolute';
        reportContainer.style.top = '50%';
        reportContainer.style.left = '50%';
        reportContainer.style.transform = 'translate(-50%, -50%)';
        reportContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        reportContainer.style.color = 'white';
        reportContainer.style.padding = '20px';
        reportContainer.style.borderRadius = '10px';
        reportContainer.style.maxWidth = '80%';
        reportContainer.style.maxHeight = '80%';
        reportContainer.style.overflow = 'auto';
        reportContainer.style.zIndex = '1000';
        
        let html = `
            <h2>Browser Compatibility Report</h2>
            <p><strong>Overall Compatibility:</strong> <span style="color: ${report.compatibility.overall === 'Excellent' ? '#4CAF50' : report.compatibility.overall === 'Good' ? '#8BC34A' : report.compatibility.overall === 'Fair' ? '#FFC107' : '#F44336'}">${report.compatibility.overall}</span></p>
            <p><strong>Browser:</strong> ${report.browser.name} ${report.browser.version}</p>
            <p><strong>Device:</strong> ${report.browser.mobile ? 'Mobile' : 'Desktop'}</p>
        `;
        
        if (report.compatibility.issues.length > 0) {
            html += '<h3>Issues Detected:</h3><ul>';
            report.compatibility.issues.forEach(issue => {
                html += `<li>${issue}</li>`;
            });
            html += '</ul>';
        }
        
        if (report.compatibility.recommendations.length > 0) {
            html += '<h3>Recommendations:</h3><ul>';
            report.compatibility.recommendations.forEach(rec => {
                html += `<li>${rec}</li>`;
            });
            html += '</ul>';
        }
        
        html += '<button id="close-report" style="background-color: #4CAF50; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px;">Continue to Game</button>';
        
        reportContainer.innerHTML = html;
        document.body.appendChild(reportContainer);
        
        document.getElementById('close-report').addEventListener('click', function() {
            reportContainer.remove();
        });
    }
}

// Export the tester
window.BrowserCompatibilityTester = BrowserCompatibilityTester;
