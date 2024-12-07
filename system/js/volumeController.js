const volumeSlider = document.getElementById('volumeSlider');
const { exec } = require('child_process');

volumeSlider.addEventListener('input', (event) => {
    const volumeValue = event.target.value;
    // Send volume value to the main process
    exec(`amixer set Master ${volumeValue}%`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        console.log(`Volume decreased: ${stdout}`);
    });
});
