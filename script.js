const scriptArea = document.getElementById('script');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const voiceSelect = document.getElementById('voiceSelect');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let utterance;
let synth = window.speechSynthesis;
let voices = [];

// Fetch and populate voices
function populateVoices() {
  voices = synth.getVoices();

  // Fallback check if Indian male or female voice is unavailable
  const indianFemaleVoice = voices.find((voice) => voice.lang === 'en-IN' && voice.name.toLowerCase().includes('female'));
  const indianMaleVoice = voices.find((voice) => voice.lang === 'en-IN' && voice.name.toLowerCase().includes('male'));

  // Store these voices for use
  voiceOptions = {
    female: indianFemaleVoice || voices.find((voice) => voice.lang === 'en-IN'), // Default to any Indian voice
    male: indianMaleVoice || voices.find((voice) => voice.lang === 'en-GB' && voice.name.toLowerCase().includes('male')), // Fallback to British male
  };
}

// Populate voices when available (for browsers that delay voice loading)
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = populateVoices;
} else {
  populateVoices();
}

// Update speed display
speedSlider.addEventListener('input', () => {
  speedValue.textContent = speedSlider.value;
});

// Start dictation
startBtn.addEventListener('click', () => {
  const scriptText = scriptArea.value.trim();
  if (!scriptText) {
    alert('Please enter some text to dictate.');
    return;
  }

  const selectedVoice = voiceSelect.value; // Get the user’s preference (male or female)
  utterance = new SpeechSynthesisUtterance(scriptText);
  utterance.rate = speedSlider.value / 100; // Convert WPM to speech rate
  utterance.voice = voiceOptions[selectedVoice] || voices[0]; // Fallback to the first voice if no match

  synth.speak(utterance);

  startBtn.disabled = true;
  stopBtn.disabled = false;

  utterance.onend = () => {
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };
});

// Stop dictation
stopBtn.addEventListener('click', () => {
  synth.cancel();
  startBtn.disabled = false;
  stopBtn.disabled = true;
});

// Initialize speed slider with updated minimum value
speedSlider.min = 60; // Minimum speed set to 60 WPM
speedSlider.max = 120; // Maximum speed remains 120 WPM
speedSlider.value = 90; // Default value
speedValue.textContent = speedSlider.value;
