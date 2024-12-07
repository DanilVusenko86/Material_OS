fetch('json/theme.json')  // URL of your JSON file
  .then(response => response.json())   // Convert the response to JSON
  .then(data => {
    applyTheme(data);  // Use the JSON data here
  })
  .catch(error => {
    console.error('Error fetching JSON:', error);  // Handle errors
  });

function applyTheme(theme) {
    const playbtn = document.getElementById('play');
    const cardPlaybtn = document.getElementById('playFirst');
    const progressbar = document.getElementById('progressBar');
    const navigation = document.getElementById('navigation');
    const title = document.getElementById('MusicTitle');

    playbtn.style.backgroundColor = theme.hightlight;
    progressbar.style.backgroundColor = theme.hightlight;
    navigation.style.backgroundColor = theme.hightlight;
    cardPlaybtn.style.backgroundColor = theme.hightlight;
    title.style.color = theme.hightlight;
}