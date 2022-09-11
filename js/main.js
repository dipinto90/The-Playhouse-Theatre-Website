
// Here we are setting the variables
const prev = document.querySelector(".prev"); //here we are selecting the previous navigation button from html
const next = document.querySelector(".next"); //here we are selecting the next navigation button from html
const images = document.querySelector(".carousel").children; // here we are selecting the carousel container and their children elements inside of it
const totalNumberImages = images.length; // here we are setting the total of images that is going to be the length of a set of the images we selected in html

let count = 0; // To record which image is currently being displayed.

//Here we are creating an event, for showing the previous image on the slide, and the function is going to be a click.
prev.addEventListener("click", (e) => {
  // control it to display the previous image
  retrieveImage("prev");
});

//Here we are creating an event, for showing the next image on the slide, and the function is going to be a click.
next.addEventListener("click", (e) => {
  // control it to display the next image
  retrieveImage("next");
});

// this is a function that is going to show us in which direction we want to go to tsee the next image
function retrieveImage(direction) {
  if (direction == "next") {
    count++;// If the direction is next then is going to be counting an extra image
    if (count == totalNumberImages) { // This will start counting from 0 images up to 4
      count = 0;
    }
  } else {
    if (count == 0) { 
      count = totalNumberImages - 1; // if the direction is not next, instead is not going to be summing up, but instead substracting one image when going back
    } else {
      count--;
    }
  }

  for (let i = 0; i < totalNumberImages; i++) {
    images[i].classList.remove("main"); // In this for loop says the main image needs to be remove on each loop.
  }

  images[count].classList.add("main"); // and the main image is going to be replace by other main images from the carousel
}


