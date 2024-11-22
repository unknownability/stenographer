const scriptArea = document.getElementById('script');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let utterance;
let synth = window.speechSynthesis;
let selectedVoice = null;

// Populate available voices and select an Indian female voice
function setVoice() {
  const voices = synth.getVoices();
  selectedVoice = voices.find(
    (voice) => voice.lang === 'en-IN' && voice.name.toLowerCase().includes('female')
  );
}

// Set the voice when voices are loaded (some browsers may require a delay)
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = setVoice;
} else {
  setVoice();
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

  utterance = new SpeechSynthesisUtterance(scriptText);
  utterance.rate = speedSlider.value / 100; // Convert WPM to speech rate
  utterance.voice = selectedVoice || synth.getVoices()[0]; // Fallback to default voice if none found
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
