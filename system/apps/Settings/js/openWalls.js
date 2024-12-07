const Wallpapersbtn = document.getElementById('Wallpapers');

Wallpapersbtn.addEventListener('click', () => {
    const WallpapersApp = apps.find(app => app.name === 'Wallpaper App');
    if (WallpapersApp) {
        openAppInWindow(WallpapersApp);
    }
});