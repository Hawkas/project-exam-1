//! API variables
const featuredOut = document.querySelector(".section__articles--featured");
const cors = "https://noroffcors.herokuapp.com/";
const url = cors + "https://fronthauk.com/blogposts/wp-json/wp/v2/posts?per_page=20&orderby=date&_embed";
let carouselFull = document.querySelector(".carousel__inner");
let images = {};
let categories = {};
let authorName = "";
let date = {};

//! Carousel buttons
let left = document.querySelector(".button-left");
let right = document.querySelector(".button-right");

function dateHandler(rawDate) {
  let postDate = new Date(rawDate);
  let options = { month: "long" };
  const dateObject = {
    day: postDate.getDate() || "Unknown",
    month: new Intl.DateTimeFormat("en-US", options).format(postDate) || "Unknown",
    year: postDate.getFullYear() || "Unknown",
    time: postDate.getHours() || "Unknown",
  };
  return dateObject;
}
function checkCategories(categoriesList) {
  let categoryObject = { featured: false, name: "Error" };

  if (categoriesList.length > 1) {
    for (category of categoriesList) {
      if (category.name === "Featured") {
        categoryObject.featured = true;
      } else {
        categoryObject.name = category.name || "unknown";
      }
    }
  } else {
    if (typeof categoriesList.name === undefined) return categoryObject;
    categoryObject.name = categoriesList[0].name;
  }
  return categoryObject;
}

function sortImages(item) {
  let img = item._embedded["wp:featuredmedia"][0];
  let imgSorted = { mobile: "", desktop: "", medium: "", alt: img.alt_text };
  if (img["media_details"].width === 640) imgSorted.mobile = img.source_url;
  if (img["media_details"].width === 1440) {
    imgSorted.desktop = img.source_url;
    imgSorted.medium = img["media_details"].sizes.medium_large.source_url;
  }
  return imgSorted;
}
//! The Fetchening
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    let featureCount = 0;
    let featuredHtml = "";
    let carouselHtml = "";
    for (item of data) {
      categories = checkCategories(item._embedded["wp:term"][0]);
      authorName = item._embedded.author[0].name;
      images = sortImages(item);
      date = dateHandler(item.date);
      let link = "./post.html?id=" + item.id + "&category=" + categories.name;
      if (categories.featured === true) {
        featureCount++;
        let excerpt = item.excerpt.rendered;
        excerpt = excerpt.replace(/(<([^>]+)>)/gi, "");
        featuredHtml += `
        <li>
        <article class="article__item article__item--featured">
          <div class="article__imagewrap">
            <img
              class="article__image article__image--featured"
              src="${images.medium}"
              alt="${images.alt}"
            />
          </div>
          <div class="article__textblock">
            <div class="article__info infotext">
              <div class="article__tag article__tag--${categories.name.toLowerCase()} tagtext">${categories.name}</div>
              <div class="article__infotext">
                <div class="article__author">
                  <span class="fas fa-user"></span>
                  <p>${authorName}</p>
                </div>
                <div class="article__date">
                  <span class="fas fa-calendar-alt"></span>
                  <p>${date.day + " " + date.month + " " + date.year}</p>
                </div>
              </div>
            </div>
            <h3 class="article__title h3big">
              <a class="links" href="${link}">${item.title.rendered}</a>
            </h3>
            <p class="article__excerpt bodytext">${excerpt}</p>
            <a href="${link}" class="article__link links links--blue buttontext">
              Read More<span class="fas fa-chevron-right"></span>
            </a>
          </div>
        </article>
        </li>`;
      }
      if (featureCount > 4) break;
    }
    // And then we go again for the carousel (I want to improve this to all be done in one loop but time is short)
    // I want to include the featured items here just to fill the carousel
    for (item of data) {
      categories = checkCategories(item._embedded["wp:term"][0]);
      authorName = item._embedded.author[0].name;
      images = sortImages(item);
      date = dateHandler(item.date);
      let link = "./post.html?id=" + item.id;
      let excerpt = item.excerpt.rendered;
      excerpt = excerpt.replace(/(<([^>]+)>)/gi, "");
      carouselHtml += `
      <li>
        <article class="article__item article__item--latest">
          <a class="link-one" href="${link}">
            <div class="article__imagewrap">
              <div class="article__tag article__tag--${categories.name.toLowerCase()} tagtext article__tag--latest">
                ${categories.name}
              </div>
                <img
                  class="article__image article__image--latest"
                  src="${images.medium}"
                  alt="${images.alt}"
                />
            </div>
          </a>
          <div class="article__textblock article__textblock--latest">
            <div class="article__info infotext">
              <div class="article__infotext">
                <div class="article__author">
                  <span class="fas fa-user"></span>
                  <p>${authorName}</p>
                </div>
                <div class="article__date">
                  <span class="fas fa-calendar-alt"></span>
                  <p>${date.day + " " + date.month + " " + date.year}</p>
                </div>
              </div>
            </div>
            <h3 class="article__title h3small">
              <a class="links link-two" href="${link}">${item.title.rendered}</a>
            </h3>
          </div>
        </article>
      </li>`;
    }
    featuredOut.innerHTML = featuredHtml;
    carouselFull.innerHTML = carouselHtml;

    if (document.querySelector(".article__item--latest")) {
      let itemContainer = document.querySelector(".article__item--latest");
      let carouselVisible = document.querySelector(".carousel__outer").getBoundingClientRect().width;
      let itemWidth = parseFloat(itemContainer.getBoundingClientRect().width);
      const pageCounter = document.querySelector(".carousel__pagecount");
      // Page count index
      let pages = 0;

      // Modifier to adjust for margins when moving
      let marginValue = parseFloat(window.getComputedStyle(itemContainer, null).getPropertyValue("margin-right"));
      let modifier = 0;

      //? The Great Wall of Functions

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
        let linkArray = document.querySelectorAll(".article__item--latest a");
        for (link of linkArray) {
          link.tabIndex = -1;
        }
        for (let i = 1; i <= perPage; i++) {
          let childIndex = perPage * pageNumber + i;
          if (document.querySelector(`.carousel__inner > li:nth-child(${childIndex})`)) {
            document.querySelector(`.carousel__inner > li:nth-child(${childIndex}) .link-one`).tabIndex = 0;
            document.querySelector(`.carousel__inner > li:nth-child(${childIndex}) .link-two`).tabIndex = 0;
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

      // Resizing featured articles by height of the tallest. Should've gone with CSS Grid rather than flexbox, whoops.

      function sizeAdjust() {
        const articles = document.querySelectorAll(".article__item--featured .article__textblock");
        let biggest = 0;
        for (article of articles) {
          if (article.getBoundingClientRect().height > biggest) {
            biggest = article.getBoundingClientRect().height;
          }
        }
        for (article of articles) {
          article.style.minHeight = `${biggest}px`;
        }
      }
      sizeAdjust();
      /* Refresh width values and reset carousel on resize */
      window.addEventListener("resize", () => {
        /* Update and reset variables for new size values */
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
        sizeAdjust();
      });
    }
  })
  .catch((error) => {
    console.error(error);
    let errorMessage = `<h3 class="error" style="display: block;">Looks like something went wrong. Try blowing on it!</h3>`;
    featuredOut.innerHTML = errorMessage;
    carouselFull.innerHTML = errorMessage;
  });
