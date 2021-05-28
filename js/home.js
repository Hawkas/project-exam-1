let left = document.querySelector(".button-left");
let right = document.querySelector(".button-right");
let itemContainer = document.querySelector(".article__item--latest");
let carouselFull = document.querySelector(".carousel__inner");
let carouselVisible = document.querySelector(".carousel__outer").getBoundingClientRect().width;
let itemWidth = parseFloat(itemContainer.getBoundingClientRect().width);
const pageCounter = document.querySelector(".carousel__pagecount");
// Page count index
let pages = 0;

// Modifier to adjust for margins when moving
let marginValue = parseFloat(window.getComputedStyle(itemContainer, null).getPropertyValue("margin-right"));
let modifier = 0;

function getPageCount() {
  let perPage = Math.round(carouselVisible / (itemWidth + marginValue));
  // To account for the width accurately I need to add the margins to each item, but only the ones between the visible items per page.
  let pageAmount = carouselFull.getBoundingClientRect().width / (itemWidth * perPage + marginValue * perPage);
  // An item would be unreachable sometimes due to the rounding, so I have to manually make sure it rounds up on certain values only.
  // I want it to round up on 0.4 or 0.2 sometimes but not on 0.1. So I tried my hand at regEx and wrote this expression myself lol
  if (/[1-9]\.[2-9][0-9]+/.test(pageAmount.toString())) {
    pageAmount = Math.ceil(carouselFull.getBoundingClientRect().width / (itemWidth * perPage + marginValue * perPage));
  } else {
    pageAmount = Math.round(carouselFull.getBoundingClientRect().width / (itemWidth * perPage + marginValue * perPage));
  }
  pageCounter.innerHTML = "";
  for (let i = 1; i <= pageAmount; i++) {
    if (i === 1) {
      pageCounter.innerHTML += `<button data-page="${i - 1}" class="currentpage"></button>`;
    } else {
      pageCounter.innerHTML += `<button data-page="${i - 1}" class=""></button>`;
    }
  }
}
function tabHandler(pageNumber) {
  let perPage = parseInt(carouselVisible / itemWidth);
  let itemArray = document.querySelectorAll(".article__item--latest");
  // console.log(itemArray.length % perPage);
  for (item of itemArray) {
    item.tabIndex = -1;
  }
  for (let i = 1; i <= perPage; i++) {
    let childIndex = perPage * pageNumber + i;
    if (document.querySelector(`.article__item--latest:nth-child(${childIndex})`)) {
      document.querySelector(`.article__item--latest:nth-child(${childIndex})`).tabIndex = 0;
    }
  }
}
tabHandler(pages);
// Navigate carousel by the page counters
function counterNav() {
  if (this.classList.contains("currentpage")) return;
  else {
    let goal = parseInt(this.dataset.page);
    let mod = marginValue * goal;

    // Setting incremental variables to the current page
    pages = goal;
    modifier = mod;

    carouselFull.style.transform = `translateX(-${goal * carouselVisible + mod}px)`;
    tabHandler(goal);
    for (button of pageButtons) {
      if (button.classList.contains("currentpage")) button.classList.remove("currentpage");
    }
    this.classList.add("currentpage");
    // Correcting the arrow buttons for new page of carousel
    if (goal === pageButtons.length - 1) {
      right.classList.remove("show");
      right.tabIndex = -1;
      if (!left.classList.contains("show")) {
        left.classList.add("show");
        left.tabIndex = 0;
      }
    }
    // If new page neither first nor last //
    if (goal !== 0 && goal !== pageButtons.length - 1) {
      right.classList.add("show");
      right.tabIndex = 0;
      left.classList.add("show");
      left.tabIndex = 0;
    }
    if (goal === 0) {
      left.classList.remove("show");
      left.tabIndex = -1;
      if (!right.classList.contains("show")) {
        right.classList.add("show");
        right.tabIndex = 0;
      }
      modifier = 0;
    }
  }
}
getPageCount();
let pageButtons = document.querySelectorAll(".carousel__pagecount button");
// console.log(pageButtons);
for (button of pageButtons) {
  button.addEventListener("click", counterNav);
}
/* Right Button */
right.addEventListener("click", () => {
  if (!right.classList.contains("show")) return;
  else {
    // Increment pages for accurate transform distance
    pages++;
    modifier += marginValue;
    if (!left.classList.contains("show")) {
      left.classList.add("show");
      left.tabIndex = 0;
    }
    tabHandler(pages);
    carouselFull.style.transform = `translateX(-${pages * carouselVisible + modifier}px)`;
    let nextPage = document.querySelector(`.carousel__pagecount button:nth-child(${pages + 1})`);
    let prevPage = document.querySelector(`.carousel__pagecount button:nth-child(${pages})`);
    nextPage.classList.add("currentpage");
    prevPage.classList.remove("currentpage");

    // If the multiplied width of the translate value, minus width of an item, is higher than the full carousel, disable the button.
    let compareDeficit = carouselFull.getBoundingClientRect().width - pages * carouselVisible - itemWidth;
    // console.log(compareDeficit);
    if (compareDeficit < carouselVisible) {
      right.classList.remove("show");
      right.tabIndex = -1;
    }
  }
});

/* Left button */
left.addEventListener("click", () => {
  if (!left.classList.contains("show")) return;
  else {
    pages--;
    modifier -= marginValue;
    if (!right.classList.contains("show")) {
      right.classList.add("show");
      right.tabIndex = 0;
    }
    tabHandler(pages);
    carouselFull.style.transform = `translateX(-${pages * carouselVisible + modifier}px)`;

    let nextPage = document.querySelector(`.carousel__pagecount button:nth-child(${pages + 1})`);
    let prevPage = document.querySelector(`.carousel__pagecount button:nth-child(${pages + 2})`);
    nextPage.classList.add("currentpage");
    prevPage.classList.remove("currentpage");
    if (pages === 0) {
      left.classList.remove("show");
      left.tabIndex = -1;
      modifier = 0;
    }
  }
});

/* Refresh width values and reset carousel on resize */
window.addEventListener("resize", () => {
  /* Update and reset variables */
  carouselFull = document.querySelector(".carousel__inner");
  carouselVisible = document.querySelector(".carousel__outer").getBoundingClientRect().width;
  itemContainer = document.querySelector(".article__item--latest");
  itemWidth = parseFloat(itemContainer.getBoundingClientRect().width);
  marginValue = parseFloat(window.getComputedStyle(itemContainer, null).getPropertyValue("margin-right"));
  pageButtons = document.querySelectorAll(".carousel__pagecount button");
  modifier = 0;
  pages = 0;
  carouselFull.style.transform = "translateX(0)";
  tabHandler(pages);
  if (!right.classList.contains("show")) right.classList.add("show");
  if (left.classList.contains("show")) left.classList.remove("show");
  getPageCount();
  pageButtons = document.querySelectorAll(".carousel__pagecount button");
  for (button of pageButtons) {
    button.addEventListener("click", counterNav);
  }
  left.tabIndex = -1;
  right.tabIndex = 0;
});
