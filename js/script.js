console.log(window.screen.width);
const menuBar = document.querySelector(".navblock__bars");
menuBar.addEventListener("click", openMenu);
function openMenu() {
  const listBlock = document.querySelector(".navblock__lower");
  menuBar.classList.toggle("switch");
  listBlock.classList.toggle("hide");
}

// This one doesnt do anything but prevent the dropdown menu from appearing when resizing the window, and was taken from https://css-tricks.com/stop-animations-during-window-resizing/
let resizeTimer;
window.addEventListener("resize", () => {
  document.body.classList.add("resize-animation-stopper");
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    document.body.classList.remove("resize-animation-stopper");
  }, 400);
});
// const equalWidth = function () {
//   let heroBody = document.querySelector(".hero__gibberish");
//   let titleInfo = document.querySelector(".hero__title").getBoundingClientRect();
//   let bodyInfo = heroBody.getBoundingClientRect();
//   if (parseInt(bodyInfo.width) === parseInt(titleInfo.width)) return;
//   else heroBody.style.maxWidth = `${titleInfo.width}px`;
// };

// window.addEventListener("resize", equalWidth);
