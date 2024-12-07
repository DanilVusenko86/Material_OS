document.addEventListener('DOMContentLoaded', function () {
    const desktopElement = document.getElementById('desktop');

    // Function to set the wallpaper for the OS
    function setWallpaper(wallpaperPath) {
        desktopElement.style.backgroundImage = `url('${wallpaperPath}')`;
        localStorage.setItem('currentWallpaper', wallpaperPath); // Save wallpaper to localStorage
    }

    // Load the saved wallpaper when the OS starts
    function loadSavedWallpaper() {
        const savedWallpaper = localStorage.getItem('currentWallpaper');
        if (savedWallpaper) {
            setWallpaper(savedWallpaper); // Apply saved wallpaper on load
        }
    }

    // Listen for messages from the iframe (wallpaper app)
    window.addEventListener('message', function (event) {
        if (event.data && event.data.wallpaperPath) {
            setWallpaper(event.data.wallpaperPath); // Set the wallpaper in the OS
        }
    });

    // Load saved wallpaper on OS start
    loadSavedWallpaper();
});
