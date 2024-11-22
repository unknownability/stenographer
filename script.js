const scriptArea = document.getElementById('script');
const speedSlider = document.getElementById('speed');
const speedValue = document.getElementById('speedValue');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let utterance;
let synth = window.speechSynthesis;

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
