let currentTab = 0;
const tabs = [];

document.addEventListener('DOMContentLoaded', () => {
  addTab(); // Create the first tab
  setupNavigation();
});

function setupNavigation() {
  document.getElementById('prev').addEventListener('click', () => navigateIframe('back'));
  document.getElementById('next').addEventListener('click', () => navigateIframe('forward'));
  document.getElementById('refresh').addEventListener('click', refreshIframe);
  document.getElementById('go').addEventListener('click', () => navigateTo(document.getElementById('url').value));
}

function addTab() {
  const newTabId = `tab-${tabs.length}`;
  tabs.push(newTabId);

  const tabsContainer = document.getElementById('tabs');
  const tabElement = document.createElement('li');
  tabElement.className = `tab ${tabs.length === 1 ? 'active' : ''}`;
  tabElement.id = `tab-btn-${newTabId}`;
  tabElement.innerHTML = `
    <a href="#" onclick="switchTab('${newTabId}')">Tab ${tabs.length}</a>
    <i class="material-icons close-btn" onclick="closeTab('${newTabId}', this)">close</i>
  `;
  tabsContainer.insertBefore(tabElement, tabsContainer.lastElementChild);

  const browser = document.getElementById('browser');
  const iframe = document.createElement('iframe');
  iframe.id = newTabId;
  iframe.src = 'newTab.html';
  iframe.style.display = tabs.length === 1 ? 'block' : 'none';
  browser.appendChild(iframe);

  if (tabs.length === 1) switchTab(newTabId); // Auto-switch to the first tab
}

function switchTab(tabId) {
  tabs.forEach((tab) => {
    document.getElementById(tab).style.display = tab === tabId ? 'block' : 'none';
    document.getElementById(`tab-btn-${tab}`).classList.toggle('active', tab === tabId);
  });
  document.getElementById('url').value = document.getElementById(tabId).src;
  currentTab = tabs.indexOf(tabId);
}

function closeTab(tabId, closeBtn) {
  document.getElementById(tabId).remove();
  closeBtn.parentElement.remove();
  const tabIndex = tabs.indexOf(tabId);
  tabs.splice(tabIndex, 1);

  if (tabs.length > 0) {
    const nextTabId = tabs[tabIndex > 0 ? tabIndex - 1 : 0];
    switchTab(nextTabId);
  } else {
    addTab();
  }
}

function navigateTo(input) {
  const url = input.startsWith('http') ? input : `https://www.google.com/search?q=${encodeURIComponent(input)}`;
  document.getElementById(tabs[currentTab]).src = url;
}

function navigateIframe(action) {
  const iframe = document.getElementById(tabs[currentTab]);
  try {
    iframe.contentWindow.history[action]();
  } catch (e) {
    console.error('Cross-origin navigation error');
  }
}

function refreshIframe() {
  const iframe = document.getElementById(tabs[currentTab]);
  iframe.src = iframe.src;
}
