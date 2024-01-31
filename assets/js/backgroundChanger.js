// backgroundChanger.js
// the changeBackgroundImage function is defined inside an IIFE. 
// It's still exposed to the global scope, but its visibility is limited.

const backgroundImageList = [
  '../images/hidden-home-cover.webp',
  // add links to your shared google photos image directly here
  'https://lh3.googleusercontent.com/pw/ABLVV84PckiqmIJNE5iB3BI_vV-grDSeDQfjyyLolAE1_t_No1Z_IlzgI9UJ5rvabL5U-gnT_v7_S07qkzF-ucjzEJT5kLFwtUaLwfebH-2R4GiUDEIukIfOHaEVi_JECfmXOyDDAsb3zwNfaZN78b2lXbwxgg=w613-h1088-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/ABLVV854B1XWYwZtzSIxhizEmGnrW1jgdyI0P9gQ942oI715M_4mGXWUIniRb5p5xedTx9WS4_nGIB_IOdK9ypRNDDPStmqwpwMA_RdC6NwtolzRe1uN0d6_NIISimDXWuiuM91pzNh4RMtpyUkybPcg3hWHxw=w613-h1088-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/ABLVV86h_0kvKZ-eRI1WJhUOpIRk0elQ0rypGEWcQJnHX5QgLBYY3KqKwCrVn7hVIhKZoCymxjg_P8tHbMaPqg2iY-EeODHvcG4hv1VTVf1dyPCoEhm9qP1as1EEgK_wVJ6oq4cuO548n4i1CoQzO3FncLdm6Q=w1155-h650-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/ABLVV872UJW6LsZ3ecRRu0Q97APztiiW2gjxooi-fJSMaosj_KCMLrWeoTnkZwXJGfEd52lZHSY78vZUGlqdZ3hVAN0WQ_Ogw2fW5e2z6f_yIs9ZXZPB3XroeCNaPfFDxpieIt9Y4gZAaF5yeU175SY-nK4P8g=w612-h1088-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/ABLVV86tz5bkwmjiMkPBtuWfrpuoIjW_h3ZLbiQKIb4XhWe0JTTKxrPpNa9diFj-PB0UYixQl7bTACVoj-pdHGQI68LZCgM7lBbHVlCB8afJ_k_F0hotPQDRIrMdlS_ZY6t7HDinj_qivFvabsLVubPmT5wE_g=w1155-h650-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/ABLVV875N7UIlnDhom-ggcxRAYKB4zGp4tdJlfg92qBNhdq2Ne761IbqOGpIONrThF4OLWnoim_bklMle8y4YRQ_m8ir6Lpemve2p0FRd14wAL2zjHlSZY_yt5bnizUyWuS5lG3vPuCMjZRUxW1-w2-_IPZ8Hw=w1155-h650-s-no-gm?authuser=0',
  'https://lh3.googleusercontent.com/pw/ABLVV86qJgZ2EdKX62hCsb4yXbCNaUmgWac9sMfvS0hnfsqsswhWCwOEAe8oZId48tod8Cm9C_X0wqPL1MHkrmQDOpzQGrQ6zzpId0IVGTAWyiRJEsGtwx_GHueF3yLM8Xg7LzfyF40EzWI46ydmtG6wnajiVA=w1155-h650-s-no-gm?authuser=0',
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
