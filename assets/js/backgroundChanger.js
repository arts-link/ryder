// backgroundChanger.js
// the changeBackgroundImage function is defined inside an IIFE. 
// It's still exposed to the global scope, but its visibility is limited.

const backgroundImageList = [
  '../images/hidden-home-cover.webp',
  // add links to your shared google photos image directly here
  'https://lh3.googleusercontent.com/pw/ABLVV84PckiqmIJNE5iB3BI_vV-grDSeDQfjyyLolAE1_t_No1Z_IlzgI9UJ5rvabL5U-gnT_v7_S07qkzF-ucjzEJT5kLFwtUaLwfebH-2R4GiUDEIukIfOHaEVi_JECfmXOyDDAsb3zwNfaZN78b2lXbwxgg=w613-h1088-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/ABLVV854B1XWYwZtzSIxhizEmGnrW1jgdyI0P9gQ942oI715M_4mGXWUIniRb5p5xedTx9WS4_nGIB_IOdK9ypRNDDPStmqwpwMA_RdC6NwtolzRe1uN0d6_NIISimDXWuiuM91pzNh4RMtpyUkybPcg3hWHxw=w613-h1088-s-no-gm?authuser=0',
];

function getRandomBackgroundImage() {
  const randomIndex = Math.floor(Math.random() * backgroundImageList.length);
  return backgroundImageList[randomIndex];
}

(function () {
  // function changeBackgroundImage() {
  //   console.log('in changeBackgroundImage invoke func')
  //   const body = document.body;
  //   const randomBackgroundImage = getRandomBackgroundImage();
  //   body.style.backgroundImage = `url(${randomBackgroundImage})`;
  // }
  function changeBackgroundImage() {
    const backgroundDiv = document.querySelector('.bg-hidden-home');

    if (backgroundDiv) {
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
