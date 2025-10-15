// Handle playing audio clips for all 12 buttons.
// Only one button can play at a time - clicking another stops the current one.
// While audio plays, the button changes to translucent green; it reverts when playback ends.

(function () {
    // Button IDs and their corresponding audio files (temporarily all use the same file)
    const buttonConfigs = [
        { id: 'btn-one', audioSrc: 'media/1_ConfirmingDate.mp3' },
        { id: 'btn-two', audioSrc: 'media/2_whyTaiwan.mp3' },
        { id: 'btn-three', audioSrc: 'media/3_decisionMakingProcess.mp3' },
        { id: 'btn-four', audioSrc: 'media/4_announcingTheMove.mp3' },
        { id: 'btn-five', audioSrc: 'media/5_peopleAtSFO.mp3' },
        { id: 'btn-six', audioSrc: 'media/6_firstDays.mp3' },
        { id: 'btn-seven', audioSrc: 'media/7_phoneCalls.mp3' },
        // { id: 'btn-eight', audioSrc: 'media/1_ConfirmingDate.mp3' },
        // { id: 'btn-nine', audioSrc: 'media/1_ConfirmingDate.mp3' },
        // { id: 'btn-ten', audioSrc: 'media/1_ConfirmingDate.mp3' },
        // { id: 'btn-eleven', audioSrc: 'media/1_ConfirmingDate.mp3' },
        // { id: 'btn-twelve', audioSrc: 'media/1_ConfirmingDate.mp3' }
    ];

    // Global state to track which button is currently playing
    let currentlyPlaying = {
        audio: null,
        buttonId: null,
        button: null
    };

    function stopCurrentAudio() {
        if (currentlyPlaying.audio) {
            currentlyPlaying.audio.pause();
            currentlyPlaying.audio.currentTime = 0;
        }

        if (currentlyPlaying.button) {
            currentlyPlaying.button.classList.remove('is-playing');
        }

        // Reset global state
        currentlyPlaying = {
            audio: null,
            buttonId: null,
            button: null
        };
    }

    function setupButton(config) {
        const btn = document.getElementById(config.id);
        if (!btn) return;

        btn.addEventListener('click', async () => {
            // If this button is already playing, do nothing
            if (currentlyPlaying.buttonId === config.id) return;

            // Stop any currently playing audio
            stopCurrentAudio();

            // Create new audio instance
            const audio = new Audio(config.audioSrc);
            audio.preload = 'auto';

            // Update global state
            currentlyPlaying = {
                audio: audio,
                buttonId: config.id,
                button: btn
            };

            // Update UI to active state
            btn.classList.add('is-playing');

            const cleanup = () => {
                // Only clean up if this is still the current audio
                if (currentlyPlaying.buttonId === config.id) {
                    stopCurrentAudio();
                }
            };

            audio.addEventListener('ended', cleanup, { once: true });
            audio.addEventListener('error', cleanup, { once: true });

            try {
                await audio.play();
            } catch (err) {
                // In case autoplay is blocked or file missing
                cleanup();
                // Optionally, you could alert or log the error
                // console.error('Audio play failed:', err);
            }
        });
    }

    // Initialize all buttons
    buttonConfigs.forEach(setupButton);
})();

