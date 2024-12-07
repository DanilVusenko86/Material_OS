const { ipcRenderer } = require('electron');
const fs = require('fs');
const path = require('path');

let currentPath = 'materialos/system/Files';
let historyStack = [];

document.addEventListener('DOMContentLoaded', () => {
  const modals = document.querySelectorAll('.modal');
  M.Modal.init(modals);

  ipcRenderer.send('list-disks');
  loadDirectory(currentPath);

  document.querySelector('.controls li:nth-child(1) a').addEventListener('click', goBack);
  document.querySelector('.controls li:nth-child(3) a').addEventListener('click', () => {
    showModal('New Folder', 'folder');
  });
  document.querySelector('.controls li:nth-child(4) a').addEventListener('click', () => {
    showModal('New File', 'file');
  });

  document.getElementById('confirmName').addEventListener('click', createItem);

  document.querySelectorAll('.sidebar .collection-item').forEach(item => {
    item.addEventListener('click', (event) => {
      const folderName = event.currentTarget.textContent.trim().toLowerCase();
      navigateToFolder(folderName);
    });
  });
});

function loadDirectory(dirPath) {
  historyStack.push(currentPath);
  currentPath = dirPath;
  document.querySelector('.breadcrumb-nav .breadcrumb:last-child').textContent = path.basename(dirPath) || 'Home';

  fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    const fileList = document.querySelector('.file-list');
    fileList.innerHTML = '';
    files.forEach(file => {
      const listItem = document.createElement('li');
      listItem.className = 'file-item collection-item';
      listItem.innerHTML = `<i class="material-icons left">${file.isDirectory() ? 'folder' : 'insert_drive_file'}</i>${file.name}`;
      listItem.addEventListener('click', () => {
        if (file.isDirectory()) {
          loadDirectory(path.join(currentPath, file.name));
        }
      });
      fileList.appendChild(listItem);
    });
  });
}

function showModal(title, type) {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('nameInput').value = '';
  newType = type;
  const nameModal = M.Modal.getInstance(document.getElementById('nameModal'));
  nameModal.open();
}

function createItem() {
  const newName = document.getElementById('nameInput').value.trim();
  if (!newName) {
    M.toast({ html: 'Name cannot be empty!', classes: 'red' });
    return;
  }

  const newPath = path.join(currentPath, newName);
  if (newType === 'folder') {
    fs.mkdir(newPath, err => {
      if (err) {
        console.error(err);
        M.toast({ html: 'Failed to create folder!', classes: 'red' });
        return;
      }
      M.toast({ html: 'Folder created!', classes: 'green' });
      loadDirectory(currentPath);
    });
  } else if (newType === 'file') {
    fs.writeFile(newPath, '', err => {
      if (err) {
        console.error(err);
        M.toast({ html: 'Failed to create file!', classes: 'red' });
        return;
      }
      M.toast({ html: 'File created!', classes: 'green' });
      loadDirectory(currentPath);
    });
  }
}

function goBack() {
  if (historyStack.length > 0) {
    const previousPath = historyStack.pop();
    loadDirectory(previousPath);
  } else {
    M.toast({ html: 'No previous directory!', classes: 'red' });
  }
}

function navigateToFolder(folderName) {
  let targetPath;
  switch (folderName) {
    case 'home':
      targetPath = process.env.HOME || '/home';
      break;
    case 'documents':
      targetPath = path.join(process.env.HOME, 'Documents');
      break;
    case 'downloads':
      targetPath = path.join(process.env.HOME, 'Downloads');
      break;
    case 'music':
      targetPath = path.join(process.env.HOME, 'Music');
      break;
    case 'pictures':
      targetPath = path.join(process.env.HOME, 'Pictures');
      break;
    case 'videos':
      targetPath = path.join(process.env.HOME, 'Videos');
      break;
    case 'computer':
      targetPath = '/';
      break;
    case 'trash':
      targetPath = path.join(process.env.HOME, '.Trash');
      break;
    default:
      targetPath = currentPath;
  }
  loadDirectory(targetPath);
}

ipcRenderer.on('disks', (event, disks) => {
  const sidebar = document.querySelector('.sidebar .collection');
  disks.forEach(disk => {
    const diskItem = document.createElement('li');
    diskItem.className = 'collection-item';
    diskItem.innerHTML = `<i class="material-icons left">storage</i>${disk}`;
    diskItem.addEventListener('click', () => {
      loadDirectory(disk);
    });
    sidebar.appendChild(diskItem);
  });
});
