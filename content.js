console.log('Content script loaded.');

function updateImageSource(imgElement, imageData) {
    imgElement.src = imageData;
    if (imgElement.alt.includes("Employee's Photo")) {
        imgElement.style.backgroundImage = 'none';
    }
    console.log('Image source updated for:', imgElement);
}

function changeImageSources(imageData) {
    // Change profile picture for all images with profile name in alt attribute
    const nameContainer = document.querySelector('div[aria-label^="Profile "]');
    if (nameContainer) {
        const ariaLabel = nameContainer.getAttribute('aria-label');
        if (ariaLabel) {
            const profileName = ariaLabel.replace(/^Profile\s*/i, '').trim();
            const imgElements = document.querySelectorAll(`img[alt*="${profileName}"], img[alt*="Employee's Photo"]`);
            imgElements.forEach((imgElement) => {
                updateImageSource(imgElement, imageData);
            });
        } else {
            console.log('aria-label not found in name container.');
        }
    } else {
        console.log('Name container not found.');
    }

    // Change the image inside the span with class wdappchrome-aaal
    const spanImageElement = document.querySelector('span.wdappchrome-aaal img');
    if (spanImageElement) {
        updateImageSource(spanImageElement, imageData);
    } else {
        console.log('Span with class wdappchrome-aaal not found.');
    }

    // Change the specific image src if it matches the description
    const specificImgElements = document.querySelectorAll('img.gwt-Image.WN0P.WF5.WO0P.WJ0P.WK0P.WIEW');
    specificImgElements.forEach((imgElement) => {
        updateImageSource(imgElement, imageData);
    });
}

function applyImageChanges(imageData) {
    changeImageSources(imageData);

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1) {
                    if (node.matches('img.gwt-Image.WN0P.WF5.WO0P.WJ0P.WK0P.WIEW, img[alt*="Employee\'s Photo"], span.wdappchrome-aaal img, div[aria-label^="Profile "]')) {
                        updateImageSource(node, imageData);
                    } else {
                        // Check for any matching children of the added node
                        const childImgElements = node.querySelectorAll('img.gwt-Image.WN0P.WF5.WO0P.WJ0P.WK0P.WIEW, img[alt*="Employee\'s Photo"], span.wdappchrome-aaal img, div[aria-label^="Profile "] img');
                        childImgElements.forEach((childImgElement) => {
                            updateImageSource(childImgElement, imageData);
                        });
                    }
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });
}

// Apply image changes from chrome.storage.local if it exists
chrome.storage.local.get('profileImage', (result) => {
    if (result.profileImage) {
        applyImageChanges(result.profileImage);
    }
});