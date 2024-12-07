document.addEventListener('DOMContentLoaded', function () {
    const desktopElement = document.getElementById('desktop');
    const toggleAppListButton = document.getElementById('toggle-app');
    const toggleFunctionsListButton = document.getElementById('toggle-functions');
    const appMenuElement = document.getElementById('app-menu');
    const functionsMenuElement = document.getElementById('functions-menu');
    const calendarPanel = document.getElementById('calendar');
    const calendarPanelButton = document.getElementById('time');
    const WifiMenu = document.getElementById('wifi-menu');
    const BluetoothMenu = document.getElementById('bluetooth-menu');
    const WeatherCard = document.getElementById('weatherCard');
    const WeatherBTN = document.getElementById('weatherBTN');

    // Handle UI toggles
    toggleAppListButton.addEventListener('click', () => {
        appMenuElement.style.display = (appMenuElement.style.display === 'none') ? 'block' : 'none';
        appMenuElement.classList.toggle('move-up');
        functionsMenuElement.style.display = 'none';
        calendarPanel.style.display = 'none';
    });

    toggleFunctionsListButton.addEventListener('click', () => {
        functionsMenuElement.style.display = (functionsMenuElement.style.display === 'none') ? 'block' : 'none';
        appMenuElement.style.display = 'none';
        calendarPanel.style.display = 'none';
    });

    calendarPanelButton.addEventListener('click', () => {
        calendarPanel.style.display = (calendarPanel.style.display === 'none') ? 'flex' : 'none';
        functionsMenuElement.style.display = 'none';
        appMenuElement.style.display = 'none';
    });
    desktopElement.addEventListener('click', () => {
        calendarPanel.style.display = 'none';
        functionsMenuElement.style.display = 'none';
        appMenuElement.style.display = 'none';
        WifiMenu.style.display = 'none';
        WeatherCard.style.display = 'none';
        BluetoothMenu.style.display = 'none';
    });
});