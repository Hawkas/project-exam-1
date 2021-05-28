// To align the sidebar line with the article line
const sidebarTitle = document.querySelector(".sidebar__title");
const mainTitle = document.querySelector(".fullcontent__title");

function adjustHeight() {
  let height = mainTitle.getBoundingClientRect().height;
  sidebarTitle.style.minHeight = `${height}px`;
}
adjustHeight();
window.addEventListener("resize", adjustHeight);
