// Initialize synthesizer and filter, then chain them together
const polySynth = new Tone.PolySynth(Tone.Synth).toDestination();
const basicFilter = new Tone.Filter(1000, 'lowpass').toDestination();
polySynth.connect(basicFilter);

// Define a map for keyboard to note mappings
const noteMap = {
    'z': 'C4', 'x': 'D4', 'c': 'E4', 
    'v': 'F4', 'b': 'G4', 'n': 'A4', 
    'm': 'B4', ',': 'C5'
};

// Function to handle keydown and keyup events
function handleKeyEvent(event, isKeyDown) {
    const note = noteMap[event.key.toLowerCase()];
    if (note) {
        isKeyDown ? polySynth.triggerAttack(note) : polySynth.triggerRelease(note);
        const keyElement = document.querySelector(`.key[data-key="${event.key.toLowerCase()}"]`);
        if (keyElement) {
            keyElement.classList.toggle('pressed', isKeyDown);
        }
    }
}

// Attach event listeners for keydown and keyup
document.addEventListener('keydown', (e) => handleKeyEvent(e, true));
document.addEventListener('keyup', (e) => handleKeyEvent(e, false));

// Function to update filter properties based on user input
function setupFilterControl(filterId, property) {
    const inputElement = document.getElementById(filterId);
    inputElement.addEventListener('input', (e) => {
        basicFilter[property].value = parseFloat(e.target.value);
    });
}

// Initialize filter controls
setupFilterControl('filter-frequency', 'frequency');
setupFilterControl('filter-q', 'Q');
