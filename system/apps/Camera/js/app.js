// Get elements
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const captureButton = document.getElementById('captureButton');
const captureIcon = document.getElementById('captureIcon');
const downloadLink = document.getElementById('downloadLink');

let isPhotoMode = true;
let mediaRecorder;
let recordedChunks = [];

// Request access to the camera
navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
        video.srcObject = stream;
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = handleDataAvailable;
    })
    .catch(err => {
        console.error("Error accessing the camera", err);
    });

// Capture photo or start/stop video recording
captureButton.addEventListener('click', () => {
    if (isPhotoMode) {
        takePhoto();
    } else {
        if (mediaRecorder.state === "inactive") {
            startRecording();
        } else {
            stopRecording();
        }
    }
});

// Take a photo
function takePhoto() {
    const context = canvas.getContext('2d');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert the image to base64 data URL and display it or download it
    const dataURL = canvas.toDataURL('image/png');
    downloadLink.href = dataURL;
    downloadLink.download = 'photo.png';
    downloadLink.click();  // Auto-download the photo
}

// Start recording video
function startRecording() {
    recordedChunks = [];
    mediaRecorder.start();
    captureIcon.innerText = "stop"; // Change button to stop icon
    console.log('Recording started...');
}

// Stop recording video
function stopRecording() {
    mediaRecorder.stop();
    captureIcon.innerText = "videocam"; // Reset button to video camera icon
    console.log('Recording stopped...');
}

// Handle the recorded video data
function handleDataAvailable(event) {
    if (event.data.size > 0) {
        recordedChunks.push(event.data);
        downloadVideo();
    }
}

// Save and download the recorded video
function downloadVideo() {
    const blob = new Blob(recordedChunks, {
        type: 'video/webm'
    });
    const url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.download = 'video.webm';
    downloadLink.click();  // Auto-download the video
}

// Switch to Photo mode
document.getElementById('photoMode').addEventListener('click', () => {
    isPhotoMode = true;
    captureIcon.innerText = 'camera_alt';
    console.log('Switched to photo mode');
});

// Switch to Video mode
document.getElementById('videoMode').addEventListener('click', () => {
    isPhotoMode = false;
    captureIcon.innerText = 'videocam';
    console.log('Switched to video mode');
});
