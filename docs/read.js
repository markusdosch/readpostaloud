let currentUtterance = null;
let isReading = false;
let isPaused = false;

const articleElement = document.querySelector('.article-content');
const paragraphLeafNodes = Array.from(articleElement.querySelectorAll('.page > * > *'));
let currentParagraph = 0;
paragraphLeafNodes[currentParagraph].classList.add("paragraph-active");

document.querySelector('.play-icon').addEventListener('click', readArticleAloud);

document.querySelector('.pause-icon').addEventListener('click', pauseReading);

document.querySelector('.stop-icon').addEventListener('click', stopReading);

document.querySelector('.skip-back-icon').addEventListener('click', skipBack);

document.querySelector('.skip-forward-icon').addEventListener('click', skipForward);

document.querySelector('.language-select').addEventListener('change', function () {
    console.log('Language changed to:', this.value);
});

populateVoiceSelect();

function skipForward() {
    stopReading();

    if (currentParagraph === paragraphLeafNodes.length - 1) { return; }

    currentParagraph++;
    document.querySelector(".paragraph-active")?.classList.remove("paragraph-active");
    paragraphLeafNodes[currentParagraph].classList.add("paragraph-active");
}

function skipBack() {
    stopReading();

    if (currentParagraph === 0) { return; }

    currentParagraph--;
    document.querySelector(".paragraph-active")?.classList.remove("paragraph-active");
    paragraphLeafNodes[currentParagraph].classList.add("paragraph-active");
}

function readArticleAloud() {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported in this browser');
        return;
    }

    if (isReading && isPaused) {
        resumeReading();
        return;
    }

    if (isReading) {
        return;
    }

    // Get the text content
    const textContent = articleElement.textContent || articleElement.innerText;

    if (!textContent.trim()) {
        console.warn('No text content found to read');
        return;
    }

    // Create a new SpeechSynthesisUtterance instance
    currentUtterance = new SpeechSynthesisUtterance();

    // Configure the speech settings
    currentUtterance.rate = 1;      // Speed (0.1 to 10)
    currentUtterance.pitch = 1;     // Pitch (0 to 2)
    currentUtterance.volume = 1;    // Volume (0 to 1)
    currentUtterance.lang = getSelectedVoice().lang; // Language
    currentUtterance.voice = getSelectedVoice();

    // Set up event listeners
    currentUtterance.onstart = function () {
        isReading = true;
        isPaused = false;
        console.log('Speech started');
    };

    currentUtterance.onend = function () {
        isReading = false;
        isPaused = false;
        currentUtterance = null;
        console.log('Speech ended');
    };

    currentUtterance.onerror = function (event) {
        console.error('Speech synthesis error:', event.error);
        isReading = false;
        isPaused = false;
        currentUtterance = null;
    };

    currentUtterance.onend = readNextParagraph;

    // Start speaking
    readNextParagraph();
}

function readNextParagraph() {
    document.querySelector(".paragraph-active")?.classList.remove("paragraph-active");

    if (currentParagraph >= paragraphLeafNodes.length) {
        return;
    }

    paragraphLeafNodes[currentParagraph].classList.add("paragraph-active");

    currentUtterance.text = paragraphLeafNodes[currentParagraph].textContent || paragraphLeafNodes[currentParagraph].innerText;

    speechSynthesis.speak(currentUtterance);
    currentParagraph++;
}

/**
 * Pauses the current speech synthesis
 */
function pauseReading() {
    if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported in this browser');
        return;
    }

    if (isReading && !isPaused) {
        speechSynthesis.pause();
        isPaused = true;
        console.log('Speech paused');
    } else if (!isReading) {
        console.warn('No speech is currently active to pause');
    } else if (isPaused) {
        console.warn('Speech is already paused');
    }
}

/**
 * Resumes the paused speech synthesis
 */
function resumeReading() {
    if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported in this browser');
        return;
    }

    if (isReading && isPaused) {
        speechSynthesis.resume();
        isPaused = false;
        console.log('Speech resumed');
    } else if (!isReading) {
        console.warn('No speech is currently active to resume');
    } else if (!isPaused) {
        console.warn('Speech is not paused');
    }
}

/**
 * Stops the current speech synthesis completely
 */
function stopReading() {
    if (!('speechSynthesis' in window)) {
        console.error('Speech synthesis not supported in this browser');
        return;
    }

    if (isReading) {
        speechSynthesis.cancel();
        isReading = false;
        isPaused = false;
        currentUtterance = null;
        currentParagraph = 0;
        document.querySelector(".paragraph-active")?.classList.remove("paragraph-active");
        paragraphLeafNodes[currentParagraph].classList.add("paragraph-active");
        console.log('Speech stopped');
    } else {
        console.warn('No speech is currently active to stop');
    }
}

/**
 * Gets the current state of the speech synthesis
 */
function getSpeechState() {
    return {
        isReading: isReading,
        isPaused: isPaused,
        isSupported: 'speechSynthesis' in window
    };
}

function populateVoiceSelect() {
    const selectElement = document.querySelector('.language-select');

    if (!selectElement) {
        console.error('Select element with class "language-select" not found');
        return;
    }

    // Check if Speech Synthesis is supported
    if (!('speechSynthesis' in window)) {
        console.error('Speech Synthesis not supported in this browser');
        selectElement.innerHTML = '<option value="">Speech synthesis not supported</option>';
        return;
    }

    function loadVoices() {
        const voices = speechSynthesis.getVoices();

        if (voices.length === 0) {
            console.warn('No voices available');
            selectElement.innerHTML = '<option value="">No voices available</option>';
            return;
        }

        // Clear existing options
        selectElement.innerHTML = '';

        // Add voice options
        voices.forEach((voice, i) => {
            const option = document.createElement('option');
            option.value = i; // Use index as value
            option.textContent = `${voice.name} (${voice.lang})`;

            // Add additional info as data attributes
            option.dataset.voiceName = voice.name;
            option.dataset.lang = voice.lang;
            option.dataset.isDefault = voice.default;
            option.dataset.isLocal = voice.localService;

            selectElement.appendChild(option);
        });

        console.log(`Loaded ${voices.length} voices`);

        selectElement.value = voices.findIndex(voice => voice.lang.startsWith(window?.article?.lang || document.documentElement.lang || "en-US"));
    }

    // Load voices immediately
    loadVoices();
}

function getSelectedVoice() {
    const selectElement = document.querySelector('.language-select');

    if (!selectElement) {
        console.error('Select element with class "language-select" not found');
        return null;
    }

    const selectedIndex = selectElement.value;

    if (!selectedIndex || selectedIndex === '') {
        console.warn('No voice selected');
        return null;
    }

    const voices = speechSynthesis.getVoices();
    const selectedVoice = voices[selectedIndex];

    if (!selectedVoice) {
        console.error('Selected voice not found');
        return null;
    }

    return selectedVoice;
}
