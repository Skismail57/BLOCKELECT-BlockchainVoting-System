class Alert {
    static sounds = {};
    static soundEnabled = true;

    static init() {
        // Pre-load sounds for better performance
        const soundMap = {
            success: '../sounds/success.wav',
            warning: '../sounds/warning.wav',
            error: '../sounds/error.wav',
            info: '../sounds/info.wav'
        };

        Object.keys(soundMap).forEach(type => {
            this.sounds[type] = new Audio(soundMap[type]);
            this.sounds[type].volume = 0.5;
            this.sounds[type].preload = 'auto';

            // Handle loading errors gracefully
            this.sounds[type].addEventListener('error', () => {
                console.warn(`Could not load sound file for ${type}: ${soundMap[type]}`);
            });
        });
    }

    static show(type, iconClass, title, message) {
        // Play pre-loaded sound
        this.playSound(type);

        let container = document.querySelector('.alert-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'alert-container';
            document.body.appendChild(container);
        }

        const alert = document.createElement('div');
        alert.className = `alert ${type}`;
        alert.innerHTML = `
      <div class="title">
        <i class="bi bi-${iconClass}"></i>
        ${title}
      </div>
      <small>${message}</small>
    `;

        container.appendChild(alert);

        requestAnimationFrame(() => {
            alert.classList.add('show');
        });

        setTimeout(() => {
            alert.classList.remove('show');
            alert.classList.add('hide');
            alert.addEventListener('transitionend', () => alert.remove());
        }, 5000);
    }

    static playSound(type) {
        // Check if sounds are enabled and the sound exists
        if (!this.soundEnabled || !this.sounds[type]) {
            return;
        }

        try {
            // Clone the audio node to allow overlapping sounds
            const audio = this.sounds[type].cloneNode();
            audio.volume = this.sounds[type].volume;

            // Play the sound and handle any errors
            audio.play().catch(error => {
                console.warn('Could not play alert sound:', error);
                // Fallback: try to play original audio if clone fails
                if (this.sounds[type].paused) {
                    this.sounds[type].currentTime = 0;
                    this.sounds[type].play().catch(() => {
                        console.warn('Fallback sound playback also failed');
                    });
                }
            });
        } catch (error) {
            console.warn('Error playing alert sound:', error);
        }
    }

    // Utility methods for sound control
    static toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    static setSoundEnabled(enabled) {
        this.soundEnabled = enabled;
    }

    static setVolume(volume) {
        // Clamp volume between 0 and 1
        const clampedVolume = Math.max(0, Math.min(1, volume));

        Object.keys(this.sounds).forEach(type => {
            if (this.sounds[type]) {
                this.sounds[type].volume = clampedVolume;
            }
        });
    }

    // Method to test individual sounds
    static testSound(type) {
        if (this.sounds[type]) {
            this.playSound(type);
        } else {
            console.warn(`Sound type "${type}" not found`);
        }
    }

    // Get current sound status
    static getSoundStatus() {
        return {
            enabled: this.soundEnabled,
            loadedSounds: Object.keys(this.sounds).filter(type =>
                this.sounds[type] && this.sounds[type].readyState >= 2
            ),
            volume: this.sounds.success ? this.sounds.success.volume : 0.5
        };
    }
}

// Initialize sounds when the page loads
document.addEventListener('DOMContentLoaded', () => {
    Alert.init();
});

// Alternative initialization if DOMContentLoaded has already fired
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        Alert.init();
    });
} else {
    Alert.init();
}

// Test sound control
// Alert.toggleSound(); // Toggle sound on/off
// Alert.setVolume(0.8); // Set volume to 80%
// Alert.testSound('success'); // Test the success sound
// console.log(Alert.getSoundStatus()); // Check sound status