document.addEventListener('DOMContentLoaded', function () {

    let unWatchedMessages = 0;
    const functionsBtn = document.getElementById('noutifiBox');
    const toggleFunctionsListButton = document.getElementById('toggle-functions');
    const panelForAppend = document.getElementById('control-panels');
    const desktopElement = document.getElementById('desktop');
    const toggleAppListButton = document.getElementById('toggle-app');
    const calendarPanelButton = document.getElementById('time');

    // Create bell icon once and add to functionsBtn
    let bell = document.createElement('i');
    bell.style.color = '#ffffff';
    bell.classList.add("material-icons");
    bell.innerHTML = `notifications`;
    bell.style.display = 'none';
    functionsBtn.appendChild(bell);

    // Create message panel once and add to panelForAppend
    let messagePanel = document.createElement('div');
    messagePanel.classList.add('massengesBox');
    messagePanel.setAttribute('id', 'MP');
    messagePanel.style.display = 'none'; // Initially hidden
    panelForAppend.appendChild(messagePanel);

    // Listen for incoming messages
    window.addEventListener('message', function(event) {
        // Ensure that the message is of the type 'toast'
        if (event.data.type === 'toast') {
            const icon = event.data.icon;
            const message = event.data.message;

            unWatchedMessages++;
            bell.style.display = 'block';

            // Create a new message item and append it to the existing messagePanel
            const messageItem = document.createElement('div');
            messageItem.classList.add('messange-item');
            messageItem.innerHTML = `<div class="card">
                <div class="card-content">
                <i class="material-icons left">${icon}</i>
                <p>${message}</p>
                </div>
                <div class="card-content grey lighten-4">
                <div id="closebtn">Close</div>
                </div>
            </div>`;

            messagePanel.appendChild(messageItem);  // Add the new message to the existing panel

            // Corrected to find the 'closebtn' inside the messageItem
            const closeBTN = messageItem.querySelector('#closebtn');
            
            // Toggle visibility of the message panel on button click
            toggleFunctionsListButton.addEventListener('click', () => {
                messagePanel.style.display = (messagePanel.style.display === 'none') ? 'flex' : 'none';
            });

            // Close the message panel when interacting with other elements
            desktopElement.addEventListener('click', () => {
                messagePanel.style.display = 'none';
            });
            toggleAppListButton.addEventListener('click', () => {
                messagePanel.style.display = 'none';
            });
            calendarPanelButton.addEventListener('click', () => {
                messagePanel.style.display = 'none';
            });

            // Close the individual message item when the close button is clicked
            closeBTN.addEventListener('click', () => {
                messageItem.style.display = 'none';
            });

            // Create and show the Materialize toast notification
            M.toast({
                html: `<i class="material-icons left">${icon}</i>${message}`,
                displayLength: 4000
            });
            let onSound = new Audio('../sounds/noutifi.wav');
            onSound.play();
        }
    });
});
