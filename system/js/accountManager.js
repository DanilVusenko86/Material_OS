document.addEventListener('DOMContentLoaded', function () {
    const loginScreen = document.getElementById('login-screen');
    const accountList = document.getElementById('account-list'); // Ensure this is not null
    const loginButton = document.getElementById('login-button');
    const userAvatar = document.getElementById('bottomAvatar');
    const upanelsAvatar = document.getElementById('Avatar');

    if (!loginScreen || !accountList || !loginButton) {
        console.error("Login screen elements not found in the DOM");
        return;
    }

    // Check if OOBE has been completed
    if (!localStorage.getItem('oobe-completed')) {
        window.location.href = '../apps/Oobe/index.html';
    } else {
        loadLoginScreen();
    }

    function loadLoginScreen() {
        const accountData = JSON.parse(localStorage.getItem('os-account'));
        const accountAvatar = JSON.parse(localStorage.getItem('avatar-account'));

        userAvatar.innerHTML = `<img id="avatarBottom" src="${accountAvatar}"></img>`;
        upanelsAvatar.innerHTML = `<img id="avatarIP" src="${accountAvatar}"></img>`;

        if (accountData) {
            accountList.innerHTML = `
                <div style="display: flex; align-items: center; justify-content: space-around; flex-direction: column; height: 100px;">
                    <img id="avatar" src="${accountAvatar}">
                    <h5 class="grey-text text-darken-3">${accountData.username}</h5>
                </div>
            `;
        } else {
            M.toast({html: 'No account found! Please set up an account.'});
        }
    }

    loginButton.addEventListener('click', function () {
        const passwordInput = document.getElementById('login-password').value;
        const storedAccount = JSON.parse(localStorage.getItem('os-account'));

        if (storedAccount && (storedAccount.password === passwordInput || storedAccount.password === '')) {
            loginScreen.style.display = 'none';
            let onSound = new Audio('../sounds/on.wav');
            onSound.play();
        } else {
            M.toast({html: 'Incorrect password!'});
        }
    });
});
