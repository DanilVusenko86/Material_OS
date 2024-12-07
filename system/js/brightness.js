const slider = document.getElementById('brightness-slider');
const body = document.body;

slider.addEventListener('input', (event) => {
    const brightnessValue = event.target.value;
    body.style.filter = `brightness(${brightnessValue}%)`;
});