document.addEventListener('DOMContentLoaded', function () {
    const categories = ['architecture', 'nature', 'figures'];
    const appFolder = 'apps/Wallpapers'; // Path to wallpaper app folder
    const categoryListElement = document.getElementById('category-list');
    const wallpaperListElement = document.getElementById('wallpaper-list');
    const wallpaperPreview = document.getElementById('preview');

    // Load categories
    function loadCategories() {
        categoryListElement.innerHTML = '';
        categories.forEach(category => {
            const categoryButton = document.createElement('a');
            categoryButton.className = 'waves-effect waves-light btn';
            categoryButton.textContent = capitalizeFirstLetter(category);
            categoryButton.addEventListener('click', () => loadWallpapers(category));
            categoryListElement.appendChild(categoryButton);
        });
    }

    // Load wallpapers from the selected category's list.json
    function loadWallpapers(category) {
        wallpaperListElement.innerHTML = 'Loading wallpapers...';
        fetch(`${category}/list.json`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch wallpaper list');
                }
                return response.json();
            })
            .then(wallpapers => {
                wallpaperListElement.innerHTML = '';
                wallpapers.forEach(wallpaper => {

                    
                    

                    const wallpaperItem = document.createElement('div');
                    wallpaperItem.className = 'operator waves-effect waves-light wallpaper-item z-depth-1';
                    wallpaperItem.innerHTML = `
                        <img src="${category}/${wallpaper.url}" alt="${wallpaper.name}">
                        <span>${wallpaper.name}</span>
                    `;
                    wallpaperItem.addEventListener('click', () => {
                        setWallpaper(`${appFolder}/${category}/${wallpaper.url}`);
                        wallpaperPreview.style.backgroundImage = `url('${category}/${wallpaper.url}')`;
                    });
                    wallpaperListElement.appendChild(wallpaperItem);
                });
                
            })
            .catch(error => {
                wallpaperListElement.innerHTML = 'Error loading wallpapers';
                console.error('Failed to load wallpapers:', error);
            });
    }

    // Send wallpaper URL to OS to change the wallpaper
    function setWallpaper(wallpaperUrl) {
        // Sending the wallpaper path to the parent OS
        window.parent.postMessage({
            wallpaperPath: wallpaperUrl
        }, '*'); // Communicate with the parent OS window
    }

    // Capitalize first letter of a string
    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // Initialize the app by loading categories
    loadCategories();
});
