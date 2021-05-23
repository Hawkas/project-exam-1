console.log(window.screen.width);
const menuBar = document.querySelector(".navblock__bars");
menuBar.addEventListener("click", openMenu);
function openMenu() {
  const listBlock = document.querySelector(".navblock__lower");
  menuBar.classList.toggle("switch");
  listBlock.classList.toggle("hide");
}
