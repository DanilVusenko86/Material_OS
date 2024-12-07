function search_apps() {
    let input = document.getElementById('app-search').value
    input = input.toLowerCase();
    let apps = document.getElementsByClassName('app');

    for (i = 0; i < apps.length; i++) {
        if (!apps[i].innerHTML.toLowerCase().includes(input)) {
            apps[i].style.display = "none";
        }
        else {
            apps[i].style.display = "list-item";
        }
    }
}
