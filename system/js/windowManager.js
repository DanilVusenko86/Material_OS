document.addEventListener('DOMContentLoaded', function () {
    const desktopElement = document.getElementById('desktop');
    const openedAppsElement = document.getElementById('opened-apps');
    const appListElement = document.getElementById('app-list');

    const appsFolder = 'apps';
    const apps = [];
    let openedApps = []; // Track opened apps
    let pinnedApps = new Set(); // Track pinned apps
    let maximazed = false;

    // Load apps from the global apps-list.json
    const loadAppsFromJson = async () => {
        try {
            const response = await fetch(`${appsFolder}/apps-list.json`);
            const folders = await response.json();

            for (const folder of folders) {
                try {
                    const manifestResponse = await fetch(`${appsFolder}/${folder}/app.manifest`);

                    if (!manifestResponse.ok) {
                        console.error(`Failed to fetch manifest for ${folder}`);
                        continue;
                    }

                    const manifest = await manifestResponse.json();
                    apps.push({ ...manifest, folder });
                } catch (error) {
                    console.error(`Error loading manifest for ${folder}:`, error);
                }
            }

            renderAppList();
        } catch (error) {
            console.error('Failed to load apps list:', error);
        }
    };

    // Render the list of apps in the app menu
    const renderAppList = () => {
        appListElement.innerHTML = '';

        apps.forEach(app => {
            const li = document.createElement('li');
            li.className = 'app';
            li.innerHTML = `
            <center>
                <img src="${appsFolder}/${app.folder}/${app.icon}" alt="${app.name}"><br>
                <span>${app.name}</span>
            </center>
            `;
            li.addEventListener('click', () => openAppInWindow(app));
            appListElement.appendChild(li);
        });
    };

    // Open an app in a draggable window
    const openAppInWindow = (app) => {
        const windowElement = document.createElement('div');
        windowElement.className = 'window z-depth-2';
        windowElement.style.width = `${app.window.width}`;
        windowElement.style.height = `${app.window.height}`;
        windowElement.style.backgroundColor = `${app.window.windowColor}`;
        windowElement.style.color = `${app.window.textColor}`;
        windowElement.innerHTML = `
            <div class="operator waves-effect waves-dark title-bar">
                <span class="title">${app.name}</span>
                <button class="operator waves-effect waves-dark minimize-btn">
                    <i style="color: ${app.window.textColor};" class="material-icons">remove</i>
                </button>
                <button class="operator waves-effect waves-dark maximize-btn"> 
                    <i style="color: ${app.window.textColor};" class="material-icons">fullscreen</i>
                </button>
                <button class="operator waves-effect waves-dark close-btn">
                    <i style="color: ${app.window.textColor};" class="material-icons">close</i>
                </button>
            </div>
            <iframe id="appWindow" allowfullscreen="allowfullscreen" src="${appsFolder}/${app.folder}/${app.index}" nodeintegration="true" contextIsolation="false"></iframe>
        `;

        const closeButton = windowElement.querySelector('.close-btn');
        closeButton.addEventListener('click', () => {
            desktopElement.removeChild(windowElement);
            removeAppFromBottomPanel(app);
        });

        const maximazeButton = windowElement.querySelector('.maximize-btn');
        maximazeButton.addEventListener('click', () => {
            if (maximazed === false) {
                windowElement.style.width = '100%';
                windowElement.style.height = 'calc(100% - 50px)';
                windowElement.style.top = '0';
                windowElement.style.right = '0';
                windowElement.style.left = '0';
                windowElement.style.bottom = '0';
                maximazed = true;
            } else {
                windowElement.style.width = `${app.window.width}`;
                windowElement.style.height = `${app.window.height}`;
                maximazed = false
            }

        });

        // Minimize button functionality
        const minimizeButton = windowElement.querySelector('.minimize-btn');
        minimizeButton.addEventListener('click', () => {
            windowElement.style.display = 'none';
        });

        desktopElement.appendChild(windowElement);
        openedApps.push(app); // Track opened apps
        updateBottomPanel(app, windowElement);
        makeWindowDraggable(windowElement);
        makeWindowResizable(windowElement);
        bringWindowToFront(windowElement);
    };
    window.openAppInWindow = openAppInWindow;
    window.apps = apps;  // Attach `apps` to the global window object


    // Make the window draggable
    const makeWindowDraggable = (windowElement) => {
        const titleBar = windowElement.querySelector('.title-bar');
        let isDragging = false;
        let offsetX, offsetY;

        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offsetX = e.clientX - windowElement.getBoundingClientRect().left;
            offsetY = e.clientY - windowElement.getBoundingClientRect().top;
            bringWindowToFront(windowElement); // Bring to front when dragging
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                windowElement.style.left = `${e.clientX - offsetX}px`;
                windowElement.style.top = `${e.clientY - offsetY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    };

    // Make window resizable from all edges
    const makeWindowResizable = (windowElement) => {
        windowElement.style.resize = 'both';
        windowElement.style.overflow = 'hidden';
    };

    // Bring window to front
    const bringWindowToFront = (windowElement) => {
        const windows = document.querySelectorAll('.window');
        windows.forEach(win => win.style.zIndex = '1000'); // Reset z-index for all windows
        windowElement.style.zIndex = '1001'; // Bring clicked window to the front
    };

    // Update the bottom panel with opened and pinned apps
    const updateBottomPanel = (app, windowElement) => {
        const existingButton = Array.from(openedAppsElement.children).find(
            button => button.dataset.appName === app.name
        );

        if (!existingButton) {
            const appButton = document.createElement('div');
            appButton.className = 'bottom-bar-app';
            appButton.innerHTML = `<img src="${appsFolder}/${app.folder}/${app.icon}" alt="${app.name}">`;
            appButton.dataset.appName = app.name; // Add dataset to identify app

            // Pin/unpin functionality
            appButton.addEventListener('contextmenu', (event) => {
                event.preventDefault();
                toggleAppPin(appButton, app);
            });

            const restoreWindow = (windowElement) => {
                const iframe = windowElement.querySelector('iframe');
                iframe.style.width = '100%';
                iframe.style.height = '96%';
            };

            appButton.addEventListener('click', () => {
                const windows = document.querySelectorAll('.window');
                windows.forEach(window => window.style.zIndex = '1000');
                const targetWindow = Array.from(windows).find(win =>
                    win.querySelector('.title').textContent === app.name
                );
                if (targetWindow) {
                    targetWindow.style.display = 'block'; // Restore minimized window
                    restoreWindow(targetWindow);
                    bringWindowToFront(targetWindow);
                } else {
                    openAppInWindow(app); // Open the app again if closed
                }
            });

            openedAppsElement.appendChild(appButton);

            if (pinnedApps.has(app.name)) {

            }
        }
    };

    // Remove an app from the bottom panel
    const removeAppFromBottomPanel = (app) => {
        if (!pinnedApps.has(app.name)) {
            const appButtons = document.querySelectorAll('.bottom-bar-app');
            appButtons.forEach(button => {
                if (button.dataset.appName === app.name) { // Match by dataset
                    button.remove();
                }
            });
        }
    };

    // Toggle app pinning
    const toggleAppPin = (appButton, app) => {
        if (pinnedApps.has(app.name)) {
            pinnedApps.delete(app.name);
        } else {
            pinnedApps.add(app.name);
        }

        savePinnedApps(); // Save pinned apps to localStorage

        if (!pinnedApps.has(app.name) && !openedApps.some(a => a.name === app.name)) {
            removeAppFromBottomPanel(app);
        }
    };

    // Save pinned apps to localStorage
    const savePinnedApps = () => {
        localStorage.setItem('pinnedApps', JSON.stringify(Array.from(pinnedApps)));
    };

    // Load pinned apps from localStorage on OS startup
    const loadPinnedApps = () => {
        const storedPinnedApps = JSON.parse(localStorage.getItem('pinnedApps')) || [];
        pinnedApps = new Set(storedPinnedApps);
        pinnedApps.forEach(appName => {
            const app = apps.find(a => a.name === appName);
            if (app) {
                updateBottomPanel(app);
            }
        });
    };

    // Load apps from JSON
    loadAppsFromJson().then(() => loadPinnedApps()); // Ensure pinned apps are loaded after apps


});
