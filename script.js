document.addEventListener('DOMContentLoaded', () => {
    const numOptionsInput = document.getElementById('numOptions');
    const setOptionsButton = document.getElementById('setOptions');
    const optionsContainer = document.getElementById('optionsContainer');
    const playButton = document.getElementById('playButton');
    const resultDiv = document.getElementById('result');
    const winnerSound = document.getElementById('winnerSound');

    setOptionsButton.addEventListener('click', () => {
        const numOptions = parseInt(numOptionsInput.value);
        if (numOptions < 2) {
            alert('Please enter at least 2 options');
            return;
        }
        createOptionInputs(numOptions);
    });

    function createOptionInputs(num) {
        optionsContainer.innerHTML = '';
        for (let i = 0; i < num; i++) {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'option-input';
            input.placeholder = `Option ${i + 1}`;
            optionsContainer.appendChild(input);
        }
    }

    playButton.addEventListener('click', () => {
        const options = Array.from(document.querySelectorAll('.option-input'))
            .map(input => input.value.trim())
            .filter(value => value !== '');

        if (options.length < 2) {
            alert('Please fill in at least 2 options');
            return;
        }

        playAnimation(options);
    });

    function playAnimation(options) {
        const inputs = document.querySelectorAll('.option-input');
        let currentIndex = 0;
        let cycles = 0;
        const maxCycles = 3;
        let delay = 100;

        function highlightOption(index) {
            inputs.forEach(input => {
                input.classList.remove('highlight', 'spinning');
            });
            inputs[index].classList.add('highlight', 'spinning');
        }

        function animate() {
            if (cycles >= maxCycles && currentIndex === 0) {
                const chosenIndex = Math.floor(Math.random() * options.length);
                resultDiv.textContent = `Selected: ${options[chosenIndex]}`;
                highlightOption(chosenIndex);
                
                // Play winner sound
                winnerSound.currentTime = 0; // Reset the audio to start
                winnerSound.play().catch(error => {
                    console.log('Audio playback failed:', error);
                });
                
                // Add confetti effect
                const duration = 3 * 1000;
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

                function randomInRange(min, max) {
                    return Math.random() * (max - min) + min;
                }

                const interval = setInterval(function() {
                    const timeLeft = animationEnd - Date.now();

                    if (timeLeft <= 0) {
                        return clearInterval(interval);
                    }

                    const particleCount = 50 * (timeLeft / duration);
                    
                    // since particles fall down, start a bit higher than random
                    confetti({
                        ...defaults,
                        particleCount,
                        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
                    });
                    confetti({
                        ...defaults,
                        particleCount,
                        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
                    });
                }, 250);
                
                return;
            }

            highlightOption(currentIndex);
            currentIndex = (currentIndex + 1) % options.length;

            if (currentIndex === 0) {
                cycles++;
                delay += 50;
            }

            setTimeout(animate, delay);
        }

        resultDiv.textContent = '';
        animate();
    }

    // Initialize with 2 options
    createOptionInputs(2);
}); 