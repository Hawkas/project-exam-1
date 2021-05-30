const form = document.querySelector(".contact");
const button = document.querySelector(".contact__button");

const inputName = document.querySelector("#name");
const inputSubject = document.querySelector("#subject");
const inputEmail = document.querySelector("#email");
const inputMessage = document.querySelector("#message");

const nameError = document.querySelector(".contact__input-wrap--name .error");
const subjectError = document.querySelector(".contact__input-wrap--subject .error");
const emailError = document.querySelector(".contact__input-wrap--email .error");
const messageError = document.querySelector(".contact__input-wrap--message .error");

const nameReq = 6;
const subjReq = 16;
const msgReq = 26;

function checkLength(input, error, req = "email") {
  let val = input.value;
  if (val.trim().length === 0) {
    input.classList.remove("errorborder");
    error.style.display = "none";
    return false;
  }
  if (req === "email") {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (pattern.test(val.trim())) {
      error.style.display = "none";
      input.classList.remove("errorborder");
      return true;
    }
  }
  if (val.trim().length >= req) {
    error.style.display = "none";
    input.classList.remove("errorborder");
    return true;
  } else {
    error.style.display = "block";
    input.classList.add("errorborder");
    return false;
  }
}
// Just to correct the validation errors when input validates in realtime
function checkBoolean(input, req = "email") {
  let val = input.value;
  if (val.trim().length === 0) {
    return false;
  }
  if (req === "email") {
    let pattern =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (pattern.test(val.trim())) {
      return true;
    }
  }
  if (val.trim().length >= req) {
    return true;
  } else {
    return false;
  }
}
function submitForm() {
  let nameCheck = checkLength(inputName, nameError, nameReq);
  let subjCheck = checkLength(inputSubject, subjectError, subjReq);
  let emailCheck = checkLength(inputEmail, emailError);
  let msgCheck = checkLength(inputMessage, messageError, msgReq);
  if (nameCheck && subjCheck && emailCheck && msgCheck) {
    form.submit();
  } else {
    if (!nameCheck) {
      inputName.classList.add("errorborder");
      nameError.style.display = "block";
    }
    if (!subjCheck) {
      inputSubject.classList.add("errorborder");
      subjectError.style.display = "block";
    }
    if (!emailCheck) {
      inputEmail.classList.add("errorborder");
      emailError.style.display = "block";
    }
    if (!msgCheck) {
      inputMessage.classList.add("errorborder");
      messageError.style.display = "block";
    }
  }
}

function stopSubmit(e) {
  e.preventDefault();
}

form.addEventListener("submit", stopSubmit);
button.addEventListener("click", submitForm);

// Level 2 solution

function checkParams() {
  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  for (let param of arguments) {
    if (params.get(param)) {
      continue;
    } else return false;
  }
  return true;
}

if (checkParams("name", "subject", "email", "message")) {
  let validText = document.createElement("strong");
  validText.innerHTML = "Your message has been received";
  validText.classList.add("validated");
  validText.style.display = "block";
  validText.style.transform = "translateX(0)";
  form.insertBefore(validText, form.firstChild);
}

// Validating inputs in real time.

function adjustValid(input, error, req = "email") {
  if (checkBoolean(input, req)) {
    input.classList.remove("errorborder");
    error.style.display = "none";
  }
}
function realTimeCheck(e) {
  if (e.target === inputName) adjustValid(e.target, nameError, nameReq);
  if (e.target === inputSubject) adjustValid(e.target, subjectError, subjReq);
  if (e.target === inputEmail) adjustValid(e.target, emailError);
  if (e.target === inputMessage) adjustValid(e.target, messageError, msgReq);
}
function blurCheck(e) {
  if (e.target === inputName) checkLength(e.target, nameError, nameReq);
  if (e.target === inputSubject) checkLength(e.target, subjectError, subjReq);
  if (e.target === inputEmail) checkLength(e.target, emailError);
  if (e.target === inputMessage) checkLength(e.target, messageError, msgReq);
}
const inputList = document.querySelectorAll(".contact input, .contact textarea");
for (let input of inputList) {
  input.addEventListener("blur", blurCheck);
  input.addEventListener("input", realTimeCheck);
}
