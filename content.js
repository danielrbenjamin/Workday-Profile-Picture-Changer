console.log('Content script loaded.');

function changeImageSources(imageData) {
    // Change profile picture
    const nameContainer = document.querySelector('div[aria-label^="Profile "]');
    if (nameContainer) {
        const ariaLabel = nameContainer.getAttribute('aria-label');
        if (ariaLabel) {
            const profileName = ariaLabel.replace(/^Profile\s*/i, '').trim();
            const imgElements = document.querySelectorAll(`img[alt*="${profileName}"]`);
            if (imgElements.length > 0) {
                imgElements.forEach((imgElement) => {
                    imgElement.src = imageData;
                    console.log('Profile picture changed for image:', imgElement);
                });
            } else {
                console.log('Profile picture elements not found.');
            }
        } else {
            console.log('aria-label not found in name container.');
        }
    } else {
        console.log('Name container not found.');
    }

    // Change the image inside the span with class wdappchrome-aaal
    const spanImageElement = document.querySelector('span.wdappchrome-aaal img');
    if (spanImageElement) {
        spanImageElement.src = imageData;
        console.log('Background image changed for span with class wdappchrome-aaal:', spanImageElement);
    } else {
        console.log('Span with class wdappchrome-aaal not found.');
    }
}

function applyImageChangesOnLoad(imageData) {
    const observer = new MutationObserver((mutations, observer) => {
        if (document.querySelector('div[aria-label^="Profile "]') || document.querySelector('span.wdappchrome-aaal img')) {
            changeImageSources(imageData);
            observer.disconnect(); // Stop observing after the images are updated
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // Check if elements are already loaded
    changeImageSources(imageData);
}

// Apply image changes from chrome.storage.local if it exists
chrome.storage.local.get('profileImage', (result) => {
    if (result.profileImage) {
        applyImageChangesOnLoad(result.profileImage);
    }
});
