// Create placeholder audio files
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function generateAudioPlaceholders() {
    // Generate different audio effects
    generateClickSound();
    generateHarvestSound();
    generateBackgroundMusic();
    
    console.log('Generated all audio placeholders');
}

// Generate click sound (short beep)
function generateClickSound() {
    const duration = 0.1;
    const audioBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    // Create a simple beep sound
    for (let i = 0; i < audioBuffer.length; i++) {
        // Sine wave at 880Hz with decay
        channelData[i] = Math.sin(880 * Math.PI * 2 * i / audioContext.sampleRate) * 
                         (1 - i / audioBuffer.length);
    }
    
    // Convert to WAV and save
    saveAudioBuffer(audioBuffer, 'click-placeholder.mp3');
}

// Generate harvest sound (longer sound with multiple tones)
function generateHarvestSound() {
    const duration = 0.5;
    const audioBuffer = audioContext.createBuffer(1, audioContext.sampleRate * duration, audioContext.sampleRate);
    const channelData = audioBuffer.getChannelData(0);
    
    // Create a more complex sound for harvesting
    for (let i = 0; i < audioBuffer.length; i++) {
        // Mix of frequencies with rising pitch
        const progress = i / audioBuffer.length;
        const freq1 = 440 + 220 * progress;
        const freq2 = 660 + 110 * progress;
        
        channelData[i] = (
            Math.sin(freq1 * Math.PI * 2 * i / audioContext.sampleRate) * 0.5 +
            Math.sin(freq2 * Math.PI * 2 * i / audioContext.sampleRate) * 0.3
        ) * (1 - Math.pow(progress, 2));
    }
    
    // Convert to WAV and save
    saveAudioBuffer(audioBuffer, 'harvest-placeholder.mp3');
}

// Generate background music (looping pattern)
function generateBackgroundMusic() {
    const duration = 5.0; // 5 seconds loop
    const audioBuffer = audioContext.createBuffer(2, audioContext.sampleRate * duration, audioContext.sampleRate);
    const leftChannel = audioBuffer.getChannelData(0);
    const rightChannel = audioBuffer.getChannelData(1);
    
    // Create a simple looping background pattern
    const notes = [261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 493.88]; // C4 to B4
    const noteDuration = 0.25; // quarter note
    const noteCount = duration / noteDuration;
    
    for (let note = 0; note < noteCount; note++) {
        const startSample = Math.floor(note * noteDuration * audioContext.sampleRate);
        const endSample = Math.floor((note + 0.8) * noteDuration * audioContext.sampleRate); // 80% of note duration
        
        // Choose a note from the scale
        const noteFreq = notes[note % notes.length];
        const bassFreq = noteFreq / 2;
        
        for (let i = startSample; i < endSample && i < audioBuffer.length; i++) {
            const sampleProgress = (i - startSample) / (endSample - startSample);
            const envelope = 0.5 * Math.sin(sampleProgress * Math.PI); // Simple envelope
            
            // Melody in left channel
            leftChannel[i] = Math.sin(noteFreq * Math.PI * 2 * i / audioContext.sampleRate) * 
                            0.2 * envelope;
            
            // Bass in right channel
            rightChannel[i] = Math.sin(bassFreq * Math.PI * 2 * i / audioContext.sampleRate) * 
                             0.3 * envelope;
        }
    }
    
    // Add some ambient pad sound throughout
    for (let i = 0; i < audioBuffer.length; i++) {
        const slowOsc = Math.sin(55 * Math.PI * 2 * i / audioContext.sampleRate) * 0.1;
        leftChannel[i] += slowOsc;
        rightChannel[i] += slowOsc;
    }
    
    // Convert to WAV and save
    saveAudioBuffer(audioBuffer, 'background-music-placeholder.mp3');
}

// Helper function to save AudioBuffer as audio file
function saveAudioBuffer(audioBuffer, filename) {
    // This is a simplified version - in a real app, you'd use proper encoding
    // For placeholders, we'll just create a download link with a note
    
    console.log(`Generated ${filename} placeholder (note: actual audio encoding would happen in a real environment)`);
    
    // In a browser environment, we would do:
    // const blob = new Blob([audioBufferToWav(audioBuffer)], { type: 'audio/wav' });
    // const url = URL.createObjectURL(blob);
    // const link = document.createElement('a');
    // link.href = url;
    // link.download = filename;
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);
}

// Call the generator function
generateAudioPlaceholders();
