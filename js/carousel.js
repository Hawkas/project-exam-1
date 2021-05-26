let left = document.querySelector(".button-left");
let right = document.querySelector(".button-right");
let itemContainer = document.querySelector(".article__item--latest");
let carouselFull = document.querySelector(".carousel__inner");
let carouselVisible = document.querySelector(".carousel__outer").getBoundingClientRect().width;
let itemWidth = parseFloat(document.querySelector(".article__item--latest").getBoundingClientRect().width);
const pageCounter = document.querySelector(".carousel__pagecount");
// Page count index
let pages = 0;

// Modifier to adjust for margins when moving
let marginValue = parseFloat(window.getComputedStyle(itemContainer, null).getPropertyValue("margin-right"));
let modifier = 0;

function getPageCount() {
  let perPage = parseInt(carouselVisible / itemWidth);
  let pageAmount = Math.ceil(carouselFull.offsetWidth / (itemWidth * perPage));
  console.log(pageAmount);
  pageCounter.innerHTML = "";
  for (let i = 1; i <= pageAmount; i++) {
    if (i === 1) {
      pageCounter.innerHTML += `<button data-page="${i - 1}" class="currentpage"></button>`;
    } else {
      pageCounter.innerHTML += `<button data-page="${i - 1}" class=""></button>`;
    }
  }
}

getPageCount();
let pageButtons = document.querySelectorAll(".carousel__pagecount button");
for (button of pageButtons) {
  button.addEventListener("click", counterNav);
}
console.log(pageButtons);
// Navigate carousel by the page counters
function counterNav() {
  if (this.classList.contains("currentpage")) return;
  else {
    let goal = parseInt(this.dataset.page);
    let mod = marginValue * goal;

    pages = goal;
    modifier = mod;

    carouselFull.style.transform = `translateX(-${goal * carouselVisible + mod}px)`;
    for (button of pageButtons) {
      if (button.classList.contains("currentpage")) button.classList.remove("currentpage");
    }
    this.classList.add("currentpage");

    if (goal === pageButtons.length - 1) {
      right.classList.remove("show");
      if (!left.classList.contains("show")) left.classList.add("show");
    }
    // If new page neither first nor last //
    if (goal !== 0 && goal !== pageButtons.length - 1) {
      right.classList.add("show");
      left.classList.add("show");
    }
    if (goal === 0) {
      left.classList.remove("show");
      if (!right.classList.contains("show")) right.classList.add("show");
      modifier = 0;
    }
  }
}

/* Right Button */
right.addEventListener("click", () => {
  right = document.querySelector(".button-right");
  left = document.querySelector(".button-left");
  if (!right.classList.contains("show")) {
    return;
  } else {
    // Increment pages for accurate transform distance
    pages++;
    modifier += marginValue;
    if (!left.classList.contains("show")) {
      left.classList.add("show");
    }
    carouselFull.style.transform = `translateX(-${pages * carouselVisible + modifier}px)`;
    console.log(pages);
    let nextPage = document.querySelector(`.carousel__pagecount button:nth-child(${pages + 1})`);
    let prevPage = document.querySelector(`.carousel__pagecount button:nth-child(${pages})`);
    nextPage.classList.add("currentpage");
    prevPage.classList.remove("currentpage");

    // If the multiplied width of the translate value, minus width of an item, is higher than the full carousel, disable the button.
    let compareDeficit = carouselFull.getBoundingClientRect().width - pages * carouselVisible - itemWidth;
    if (compareDeficit < carouselVisible) {
      right.classList.remove("show");
    }
  }
});

/* Left button */
left.addEventListener("click", () => {
  left = document.querySelector(".button-left");
  right = document.querySelector(".button-right");
  if (!left.classList.contains("show")) return;
  else {
    pages--;
    modifier -= 15;
    if (!right.classList.contains("show")) {
      right.classList.add("show");
    }
    carouselFull.style.transform = `translateX(-${pages * carouselVisible + modifier}px)`;
  }
  console.log(pages);
  let nextPage = document.querySelector(`.carousel__pagecount button:nth-child(${pages + 1})`);
  let prevPage = document.querySelector(`.carousel__pagecount button:nth-child(${pages + 2})`);
  nextPage.classList.add("currentpage");
  prevPage.classList.remove("currentpage");
  if (pages === 0) {
    left.classList.remove("show");
    modifier = 0;
  }
});

/* Refresh width values and reset carousel on resize */
window.addEventListener("resize", () => {
  carouselFull = document.querySelector(".carousel__inner");
  carouselFull.style.transform = "translateX(0)";
  carouselVisible = document.querySelector(".carousel__outer").getBoundingClientRect().width;
  itemWidth = parseFloat(document.querySelector(".article__item--latest").getBoundingClientRect().width);
  marginValue = parseFloat(window.getComputedStyle(itemContainer, null).getPropertyValue("margin-right"));
  modifier = 0;
  pages = 0;
  if (!right.classList.contains("show")) right.classList.add("show");
  if (left.classList.contains("show")) left.classList.remove("show");
  getPageCount();
  pageButtons = document.querySelectorAll(".carousel__pagecount button");
  for (button of pageButtons) {
    button.addEventListener("click", counterNav);
  }
});
