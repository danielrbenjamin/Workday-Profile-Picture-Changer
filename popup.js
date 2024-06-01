document.addEventListener('DOMContentLoaded', function () {
  const fileUploadLabel = document.querySelector('.custom-file-upload');
  const fileUploadInput = document.getElementById('file-upload');
  const preview = document.getElementById('preview');

  fileUploadLabel.addEventListener('click', function (event) {
      // Prevent the default action
      event.preventDefault();
      // Manually trigger the file input click
      fileUploadInput.click();
  });

  fileUploadInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
          console.log('File selected:', file);
          const reader = new FileReader();
          reader.onloadend = function () {
              const imageData = reader.result;
              preview.src = imageData;
              preview.style.display = 'block';
              console.log('Image data:', imageData);

              // Save image data to chrome.storage.local
              chrome.storage.local.set({ profileImage: imageData }, function () {
                  console.log('Profile image saved to storage');

                  // Update the profile picture immediately in the current tab
                  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                      chrome.scripting.executeScript({
                          target: { tabId: tabs[0].id },
                          func: (imageData) => {
                              function changeImageSources(imageData) {
                                  const nameContainer = document.querySelector('div[aria-label^="Profile "]');
                                  if (nameContainer) {
                                      const ariaLabel = nameContainer.getAttribute('aria-label');
                                      if (ariaLabel) {
                                          const profileName = ariaLabel.replace(/^Profile\s*/i, '').trim();
                                          const imgElements = document.querySelectorAll(`img[alt*="${profileName}"]`);
                                          imgElements.forEach((imgElement) => {
                                              imgElement.src = imageData;
                                              console.log('Profile picture changed for image:', imgElement);
                                          });
                                      }
                                  }
                                  const spanImageElement = document.querySelector('span.wdappchrome-aaal img');
                                  if (spanImageElement) {
                                      spanImageElement.src = imageData;
                                      console.log('Background image changed for span with class wdappchrome-aaal:', spanImageElement);
                                  }
                              }

                              chrome.storage.local.get('profileImage', (result) => {
                                  if (result.profileImage) {
                                      changeImageSources(result.profileImage);
                                  }
                              });
                          },
                          args: [imageData]
                      });
                  });
              });
          };
          reader.readAsDataURL(file);
      }
  });

  // Load and display the current profile image in the popup
  chrome.storage.local.get('profileImage', function (result) {
      if (result.profileImage) {
          preview.src = result.profileImage;
          preview.style.display = 'block';
      }
  });
});
