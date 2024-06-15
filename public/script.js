let nextBtn = document.querySelectorAll(".nextbtn");
let prevBtn = document.querySelectorAll(".pretbtn");
let formPage = document.querySelectorAll(".form-page");
let progress_line = document.querySelector(".progress-line");
let progress_Step = document.querySelectorAll(".progress-steps");
let currentPage = 0;

nextBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    Validate();
    // currentPage++;
    progress_Step[currentPage].classList.add("active");
    updatePage();
  });
});

prevBtn.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    progress_Step[currentPage].classList.remove("active");

    currentPage--;
    removeStyles();
    updatePage();
  });
});

function Validate() {
  if (currentPage === 0) {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    
   
    // Validate name
    if (name.value.trim().length <= 0) {
      showError(name,'Please enter your name.')
      return;
    }

    // Validate email
    if (email.value.trim().length <= 2) {
     showError(email,'Plese enter valid email')
     return;
    }

    // Validate password
    if (password.value.trim().length < 8) {
     showError(password,'Password must be 8 characters')
     return;
    }

    // All inputs are valid, proceed to next page
    currentPage++;
  } else if (currentPage >= 1) {
    currentPage++;
  }
}
function showError(element,message){
  let errorSpan = document.createElement("span");
  errorSpan.innerHTML = ' '
  errorSpan.style.color = 'red'
  errorSpan.style.paddingLeft = '10px'
  element.parentElement.classList.toggle("shake");
  errorSpan.innerText = message;
  element.parentElement.parentElement.appendChild(errorSpan);
  setTimeout(function () {
    errorSpan.style.display = "none";
  }, 1500);
// Stop execution if password is invalid
}

function removeStyles() {
  let name = document.getElementById("name");
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  name.classList.remove("shake");
  email.classList.remove("shake");
  password.classList.remove("shake");
}
function updatePage() {
  formPage.forEach((form) => {
    form.classList.remove("active");
  });
  formPage[currentPage].classList.add("active");
  progress_line.style.width = currentPage * 150 + "px";
}

//-----------Gender------//
let swithcBtn = document.querySelector(".switch");
swithcBtn.addEventListener("click", move);
function move() {
  swithcBtn.classList.toggle("move");
  document.querySelector(".male").firstElementChild.classList.toggle("move");
  document.querySelector(".female").firstElementChild.classList.toggle("round");
  if (swithcBtn.classList.contains("move")) {
    document.querySelector("#gender").setAttribute("value", "male");
  } else {
    document.querySelector("#gender").setAttribute("value", "female");
  }
 
}