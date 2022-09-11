
// First we need to set our variables
const signupContent = document.querySelector(".signup-content"); /* is going to get all the information of signup container */
const signupForm = document.querySelector(".signup-form"); /* Will get all the information from the form */
const signupImageLink = document.querySelector(".signup-image-link"); /* this link will redirect us to the signin webpage */
const signinLink = document.querySelector(".signin-link");
const signup = document.querySelector("#signup");/* will use the signup button */

// Here we used JS form validation instead of HMTL5 tag with type = email and the attribute "pattern"
const email = document.querySelector("#email");

// create a regular expression. This will allow the form to accept any type of email address: gmail.com, hotmail.com, yahoo.com, etc.
const validRegex =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
// Another posibility for only using an specific email address is to use this const validRegex = /.+@gmail\.com/;

// Here we are creating an event for the sign-up
signup.addEventListener("click", (e) => { // Here we are selecting signup fo creating a click event.
  if (email.value.match(validRegex)) { // if the value of the email matches the validRegex which is the long code for validating any type of email address then:

    //  valid
    e.preventDefault(); // This allows the website to don't get refreshed

    // create our own html element which is going to validate the event, by adding a confirmation message under the form:
    const welcomeHead = document.createElement("h4");  // Here we are creating a const called welcomeHead which is going to create an h2 element, which is going to contain the message:
    welcomeHead.className = "welcome"; // Here is a className that is going to be attached with welcomeHead, which is the "welcome" message:
    const node = document.createTextNode("Registered successfully!");
    // Here we've created a const node which is going to create a text message called "Registered successfully!"


    welcomeHead.appendChild(node); // here we attach the node message with the rest of the information keeped in welcomeHead

    signupContent.appendChild(welcomeHead);  // here we attaching the welcomeHead message to signupContent

    signupContent.classList.add("success-register"); // here we are adding to the class list "success-register", which means the form has been validated

    signupForm.classList.add("deactive"); // here the signupForm is going to be deactive 
    signupImageLink.classList.add("deactive");// here the signupImageLink is going to be deactive 
    signinLink.classList.remove("deactive"); // here the signinLink is going to be active 
  } else {
    //    invalid email address
    email.focus();
  }
});

/*
 const emailAddress = document.querySelector('#emailAddress');

  const validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if (emailAddress.value.match(validRegex)) {

    alert("Thank you. You feedback has been receieved!");
    emailAddress.focus();

  } else {
    alert("Invalid email address!");
    emailAddress.focus();
  }
*/