// Simple placeholder image generator
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = 64;
canvas.height = 64;

// Generate placeholder images
function generatePlaceholders() {
    // Colors for different assets
    const colors = {
        logo: '#FF5722',
        background: '#4CAF50',
        plot: '#795548',
        plant1: '#8BC34A',
        plant2: '#CDDC39',
        plant3: '#FFC107',
        coin: '#FFD700',
        button: '#2196F3'
    };
    
    // Generate each placeholder
    for (const [name, color] of Object.entries(colors)) {
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Fill background
        ctx.fillStyle = color;
        
        // Different shapes for different assets
        switch (name) {
            case 'logo':
                // Logo - circle with text
                ctx.beginPath();
                ctx.arc(32, 32, 30, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#FFF';
                ctx.font = '16px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('GAME', 32, 32);
                break;
                
            case 'background':
                // Background - full rectangle with pattern
                ctx.fillRect(0, 0, 64, 64);
                
                // Add some pattern
                ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
                for (let i = 0; i < 64; i += 8) {
                    ctx.fillRect(i, 0, 4, 64);
                    ctx.fillRect(0, i, 64, 4);
                }
                break;
                
            case 'plot':
                // Plot - brown rectangle
                ctx.fillRect(4, 4, 56, 56);
                
                // Add soil texture
                ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
                for (let i = 8; i < 64; i += 16) {
                    for (let j = 8; j < 64; j += 16) {
                        ctx.fillRect(i, j, 4, 4);
                    }
                }
                break;
                
            case 'plant1':
            case 'plant2':
            case 'plant3':
                // Plants - different sizes based on growth
                const size = name === 'plant1' ? 16 : (name === 'plant2' ? 32 : 48);
                
                // Draw stem
                ctx.fillStyle = '#558B2F';
                ctx.fillRect(30, 64 - size, 4, size);
                
                // Draw leaves
                ctx.fillStyle = color;
                ctx.beginPath();
                ctx.ellipse(32, 64 - size, size / 2, size / 3, 0, 0, Math.PI * 2);
                ctx.fill();
                break;
                
            case 'coin':
                // Coin - gold circle
                ctx.beginPath();
                ctx.arc(32, 32, 28, 0, Math.PI * 2);
                ctx.fill();
                
                // Inner circle
                ctx.fillStyle = '#FFA000';
                ctx.beginPath();
                ctx.arc(32, 32, 22, 0, Math.PI * 2);
                ctx.fill();
                
                // $ symbol
                ctx.fillStyle = '#FFF';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('$', 32, 32);
                break;
                
            case 'button':
                // Button - rounded rectangle
                ctx.beginPath();
                ctx.roundRect(4, 12, 56, 40, 10);
                ctx.fill();
                
                // Button highlight
                ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
                ctx.beginPath();
                ctx.roundRect(4, 12, 56, 20, 10);
                ctx.fill();
                break;
        }
        
        // Convert to data URL and log
        const dataUrl = canvas.toDataURL('image/png');
        console.log(`Generated ${name} placeholder: ${dataUrl.substring(0, 50)}...`);
        
        // Create download link
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `${name}-placeholder.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    // Generate growth spritesheet
    generateGrowthSpritesheet();
}

// Generate growth spritesheet (3 frames)
function generateGrowthSpritesheet() {
    // Create larger canvas for spritesheet
    const spritesheetCanvas = document.createElement('canvas');
    const spritesheetCtx = spritesheetCanvas.getContext('2d');
    
    // 3 frames side by side
    spritesheetCanvas.width = 64 * 3;
    spritesheetCanvas.height = 64;
    
    // Colors for different growth stages
    const colors = ['#8BC34A', '#CDDC39', '#FFC107'];
    
    // Generate each frame
    for (let i = 0; i < 3; i++) {
        // Plant size based on growth stage
        const size = 16 + (i * 16);
        
        // Draw stem
        spritesheetCtx.fillStyle = '#558B2F';
        spritesheetCtx.fillRect(i * 64 + 30, 64 - size, 4, size);
        
        // Draw leaves
        spritesheetCtx.fillStyle = colors[i];
        spritesheetCtx.beginPath();
        spritesheetCtx.ellipse(i * 64 + 32, 64 - size, size / 2, size / 3, 0, 0, Math.PI * 2);
        spritesheetCtx.fill();
    }
    
    // Convert to data URL and log
    const dataUrl = spritesheetCanvas.toDataURL('image/png');
    console.log(`Generated growth spritesheet: ${dataUrl.substring(0, 50)}...`);
    
    // Create download link
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'growth-placeholder.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Call the generator function
generatePlaceholders();
