// backgroundChanger.js
// the changeBackgroundImage function is defined inside an IIFE. 
// It's still exposed to the global scope, but its visibility is limited.
// backgroundChanger.js

const backgroundImageList = [
  '../images/hidden-home-cover.webp',
  // add links to your shared google photos image directly here
  // or from your page, image directory or front matter
];

function getRandomBackgroundImage() {
  const randomIndex = Math.floor(Math.random() * backgroundImageList.length);
  return backgroundImageList[randomIndex];
}

(function () {

  function changeBackgroundImage(newImages) {
    const backgroundDiv = document.querySelector('.bg-hidden-home');

    if (backgroundDiv) {
      // Check if newImages is provided and is an array
      if (Array.isArray(newImages) && newImages.length > 0) {
        // Append new images to the existing backgroundImageList
        backgroundImageList.push(...newImages);
      }

      const randomBackgroundImage = getRandomBackgroundImage();

      // Remove existing Tailwind CSS background classes
      backgroundDiv.classList.remove('bg-hidden-home');

      // Set new background image directly using the style attribute
      backgroundDiv.style.backgroundImage = `url(${randomBackgroundImage})`;

      // Optionally, you can also apply additional styles here
    }
  }

  // Expose the function to the specific scope where it's needed
  window.changeBackgroundImage = changeBackgroundImage;
})();
