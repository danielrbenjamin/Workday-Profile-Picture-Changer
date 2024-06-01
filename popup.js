document.querySelector('.custom-file-upload').addEventListener('click', () => {
    document.getElementById('file-upload').click();
  });
  
  document.getElementById('file-upload').addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
      console.log('File selected:', file);
      const reader = new FileReader();
      reader.onloadend = function () {
        const imageData = reader.result;
        const preview = document.getElementById('preview');
        preview.src = imageData;
        preview.style.display = 'block';
        console.log('Image data:', imageData);
  
        // Save image data to chrome.storage.local
        chrome.storage.local.set({ profileImage: imageData }, () => {
          console.log('Profile image saved to storage');
        });
      };
      reader.readAsDataURL(file);
    }
  });
  
  // Load and display the current profile image in the popup
  chrome.storage.local.get('profileImage', (result) => {
    if (result.profileImage) {
      const preview = document.getElementById('preview');
      preview.src = result.profileImage;
      preview.style.display = 'block';
    }
  });
  