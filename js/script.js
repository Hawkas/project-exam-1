const menuBar = document.querySelector(".navblock__bars");
const listBlock = document.querySelector(".navblock__lower");
const anchorArray = document.querySelectorAll("a");
let resizeTimer;
/* To prevent jankiness from link click events */
function noBubble(e) {
  e.stopPropagation();
}
/* Open dropdown menu and animate bars */
function openMenu() {
  menuBar.classList.toggle("switch");
  listBlock.classList.toggle("hide");
}
// Hide menu when pressing on the opaque bg
listBlock.addEventListener("click", function () {
  if (document.querySelector(".hide")) {
    openMenu();
  }
});

menuBar.addEventListener("click", openMenu);
for (anchor of anchorArray) {
  anchor.addEventListener("click", noBubble);
}

// This is just to prevent the dropdown menu from appearing when resizing the window, and was taken from https://css-tricks.com/stop-animations-during-window-resizing/

window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});
