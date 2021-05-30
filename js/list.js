//! Pre fetch variables and functions

const out = document.querySelector(".section__articles--blogs");
const selectSort = document.querySelector("#sort");
const cors = "https://noroffcors.herokuapp.com/";
const url = cors + "https://fronthauk.com/blogposts/wp-json/wp/v2/posts?per_page=20&orderby=date&_embed";
const button = document.querySelector(".button--listed");
const buttonTagArray = document.querySelectorAll(".filterbar__buttontag");

//* Format date
function dateHandler(rawDate) {
  let postDate = new Date(rawDate);
  let options = { month: "long" };
  const dateObject = {
    day: postDate.getDate() || "Unknown",
    month: new Intl.DateTimeFormat("en-US", options).format(postDate) || "Unknown",
    year: postDate.getFullYear() || "Unknown",
    time: rawDate || "Unknown",
  };
  return dateObject;
}

//* Sort out relevant cateogory name, ignore featured
function checkCategories(categoriesList) {
  let categoryObject = { featured: false, name: "Error", id: 3 };

  if (categoriesList.length > 1) {
    for (let category of categoriesList) {
      if (category.name === "Featured") {
        categoryObject.featured = true;
      } else {
        categoryObject.name = category.name || "unknown";
        categoryObject.id = category.id;
      }
    }
  } else {
    if (!categoriesList[0].name) return categoryObject;
    categoryObject.name = categoriesList[0].name;
    categoryObject.id = categoriesList[0].id;
  }
  return categoryObject;
}

//* Sort images into object with properties for each size
function sortEmbedded(item) {
  let img = item._embedded["wp:featuredmedia"][0];
  let imgSorted = { medium: "", desktop: "", alt: img.alt_text };
  imgSorted.medium = img["media_details"].sizes.medium_large.source_url;
  imgSorted.desktop = img["media_details"].sizes.full.source_url;
  return imgSorted;
}

//* Ensure all articles have equal height regardless of content
function sizeAdjust() {
  let articles = document.querySelectorAll(".article__item--listed .article__textblock");
  let biggest = 0;
  for (let article of articles) {
    if (article.getBoundingClientRect().height > biggest) {
      biggest = article.getBoundingClientRect().height;
    }
  }
  for (let article of articles) {
    article.style.minHeight = `${biggest}px`;
  }
}

//* Reval or hide articles depending on data-set value (would want to animate this, as it's jarring when it just appears)
function viewMore() {
  let listArray = document.querySelectorAll(".section__articles--blogs li");
  if (button.classList.contains("viewmore")) {
    for (let list of listArray) {
      if (list.dataset.view === "hidden") list.style.display = "block";
    }
  }
  if (button.classList.contains("viewless")) {
    for (let list of listArray) {
      if (list.dataset.view === "hidden") list.style.display = "none";
    }
  }
  button.classList.toggle("viewless");
  // button.classList.toggle("viewmore");
  if (button.classList.contains("viewless")) {
    button.innerHTML = `View Less <span class="fas fa-chevron-circle-down"></span>`;
  } else button.innerHTML = `View More <span class="fas fa-chevron-circle-down"></span>`;
}

//* Visual on/off state for filter tags
function setActive(button) {
  if (button.classList.contains("buttontag--active")) {
    button.classList.remove("buttontag--active");
  } else {
    for (let buttonTag of buttonTagArray) {
      buttonTag.classList.remove("buttontag--active");
    }
    button.classList.add("buttontag--active");
  }
}

//* Sort without injecting new elements into the DOM
function sortBy() {
  let listItemsRaw = out.children;
  let listItems = [...listItemsRaw];
  let counter = 0;
  if (selectSort.value === "dateold") {
    listItems.sort(function (a, b) {
      if (new Date(a.dataset.time) > new Date(b.dataset.time)) return 1;
      if (new Date(a.dataset.time) < new Date(b.dataset.time)) return -1;
      return 0;
    });
  }
  if (selectSort.value === "datenew") {
    listItems.sort(function (a, b) {
      if (new Date(a.dataset.time) > new Date(b.dataset.time)) return -1;
      if (new Date(a.dataset.time) < new Date(b.dataset.time)) return 1;
      return 0;
    });
  }
  if (selectSort.value === "alphabetdesc") {
    listItems.sort(function (a, b) {
      if (a.dataset.title > b.dataset.title) return 1;
      if (a.dataset.title < b.dataset.title) return -1;
      return 0;
    });
  }
  if (selectSort.value === "alphabetasc") {
    listItems.sort(function (a, b) {
      if (a.dataset.title > b.dataset.title) return -1;
      if (a.dataset.title < b.dataset.title) return 1;
      return 0;
    });
  }
  for (let item of listItems) {
    counter++;
    if (counter > 10) item.dataset.view = "hidden";
    else {
      item.dataset.view = "visible";
      item.style.display = "block";
    }
    if (item.dataset.view === "hidden") item.style.display = "none";
    out.appendChild(item);
  }
  sizeAdjust();
}

//* Add HTML to output, either raw or filtered in some way, and make sure it adheres to selected sorting option
function listBlogs(blogList) {
  let itemCount = 0;
  let newHtml = "";
  for (let item of blogList) {
    let categories = checkCategories(item._embedded["wp:term"][0]);
    let authorName = item._embedded.author[0].name;
    let images = sortEmbedded(item);
    let date = dateHandler(item.date);
    let link = "./post.html?id=" + item.id + "&category=" + categories.id;
    let excerpt = item.excerpt.rendered;
    excerpt = excerpt.replace(/(<([^>]+)>)/gi, "");
    if (itemCount < 10) {
      itemCount++;
      newHtml += `
      <li data-view="visible" data-time="${date.time}" data-title="${item.title.rendered}">
        <article class="article__item article__item--listed">
          <a href="${link}" tabindex="-1">
            <div class="article__imagewrap">
              <img
                class="article__image article__image--listed"
                srcset="${images.medium} 1x, ${images.desktop} 2x"
                src="${images.medium}"
                alt="${images.alt}"
              />
            </div>
          </a>
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
    } else {
      newHtml += `
      <li style="display: none;" data-view="hidden" data-time="${date.time}" data-title="${item.title.rendered}">
        <article class="article__item article__item--listed">
          <a href="${link}" tabindex="-1">
            <div class="article__imagewrap">
              <img
                class="article__image article__image--listed"
                srcset="${images.medium} 1x, ${images.desktop} 2x"
                src="${images.medium}"
                alt="${images.alt}"
              />
            </div>
          </a>
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
  }
  if (itemCount < 10) button.style.display = "none";
  out.innerHTML = newHtml;
  sortBy();
}
//! The Fetchening
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    let postArray = data;
    listBlogs(data);

    //* Post fetch adjustments and event-listeners
    //? I made sure that if the fetch throws an error, nothing happens. Ever.

    function sortByCategory(filter) {
      let posts = [...postArray];
      let newPosts = posts.filter(function (item) {
        let category = checkCategories(item._embedded["wp:term"][0]);
        if (category.name === filter) return true;
        else return false;
      });
      listBlogs(newPosts);
    }

    function filterTags(e) {
      if (e.target.classList.contains("buttontag--active")) {
        listBlogs(postArray);
        button.style.display = "block";
      } else {
        if (e.target === document.querySelector(".filterbar__buttontag.article__tag--guide")) sortByCategory("Guide");
        if (e.target === document.querySelector(".filterbar__buttontag.article__tag--opinion")) sortByCategory("Opinion");
        if (e.target === document.querySelector(".filterbar__buttontag.article__tag--review")) sortByCategory("Review");
        if (e.target === document.querySelector(".filterbar__buttontag.article__tag--news")) sortByCategory("News");
      }
      setActive(e.target);
    }

    selectSort.addEventListener("input", sortBy);
    button.addEventListener("click", viewMore);
    for (let buttonTag of buttonTagArray) {
      buttonTag.addEventListener("click", filterTags);
    }
    window.addEventListener("resize", sizeAdjust());
  })
  .catch((error) => {
    console.error(error);
    button.style.display = "none";
    let errorMessage = `<h3 class="error" style="display: block; font-size: 1.5rem;">Looks like something went wrong. Try blowing on it!</h3>`;
    out.innerHTML = errorMessage;
  });
