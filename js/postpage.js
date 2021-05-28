// To align the sidebar line with the article line
const sidebarTitle = document.querySelector(".sidebar__title");
const mainTitle = document.querySelector(".fullcontent__title");
const infoDiv = document.querySelector(".article__info--post");

// Modal variables
const modalBackdrop = document.querySelector(".modal__backdrop");
const modalOuter = document.querySelector(".modal");
const modalImage = document.querySelector(".modal__imagewrap img");
const modalClose = document.querySelector(".modal__close");

function modalToggle(e) {
  if (modalOuter.classList.contains("modal--active")) {
    if (e.target === modalImage) return;
    modalBackdrop.style.display = "none";
  } else {
    modalBackdrop.style.display = "block";
  }
  modalOuter.classList.toggle("modal--active");
}
modalImage.addEventListener("click", modalToggle);
modalClose.addEventListener("click", modalToggle);
modalBackdrop.addEventListener("click", modalToggle);

function adjustHeight() {
  let height = mainTitle.getBoundingClientRect().height;
  if (document.querySelector(".fullcontent__titlewrap")) {
    height = document.querySelector(".fullcontent__titlewrap").getBoundingClientRect().height;
  }
  sidebarTitle.style.minHeight = `${height}px`;
}
adjustHeight();
window.addEventListener("resize", adjustHeight);
