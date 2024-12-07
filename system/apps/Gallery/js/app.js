const loadPhotos = () => {
  fetch('scan_photos.php')
    .then(response => response.json())
    .then(photos => {
      const photoGrid = document.getElementById('photoGrid');
      photoGrid.innerHTML = ''; // Clear existing photos

      photos.forEach(photo => {
        const col = document.createElement('div');
        col.className = 'col s12 m4';
        col.innerHTML = `
        <img src="${photo.src}" width="260px" style="margin-top: 15px;" alt="${photo.name}" class="materialboxed">
        `;
        photoGrid.appendChild(col);
      });
    })
    .catch(err => console.error('Error loading photos:', err));
};

// Open photo viewer modal
const openPhotoViewer = (photo) => {
  document.getElementById('modalImage').src = photo.src;
  document.getElementById('fileName').textContent = photo.name;
  document.getElementById('dateTaken').textContent = photo.date;
  const modal = M.Modal.getInstance(document.getElementById('photoModal'));
  modal.open();
};

// Initialize Materialize modal and load photos
document.addEventListener('DOMContentLoaded', () => {
  const elems = document.querySelectorAll('.modal');
  M.Modal.init(elems);

  // Load photos when the page is loaded
  loadPhotos();
});
document.addEventListener('DOMContentLoaded', function() {
  var elems = document.querySelectorAll('.materialboxed');
  var instances = M.Materialbox.init(elems);
});