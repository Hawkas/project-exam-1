function dateHandler(rawDate) {
  let postDate = new Date(rawDate);
  let options = { month: "long" };
  const dateObject = {
    day: postDate.getDate() || "Unknown",
    month: new Intl.DateTimeFormat("en-US", options).format(postDate) || "Unknown",
    year: postDate.getFullYear() || "Unknown",
  };
  return dateObject;
}
function checkCategories(categoriesList) {
  let categoryObject = { featured: false, name: "" };
  if (categoriesList.length > 1) {
    for (category of categoriesList) {
      if (category.name === "Featured") {
        categoryObject.featured = true;
      } else {
        categoryObject.name = category.name;
      }
    }
  } else {
    categoryObject.name = categoriesList.name;
  }
  return categoryObject;
}

function sortImages(images) {
  let imgSorted = { mobile: "", desktop: "", medium: "", alt: images[0].alt_text };
  for (img of images) {
    if (img["media_details"].width === 640) imgSorted.mobile = img.source_url;
    if (img["media_details"].width === 1440) {
      imgSorted.desktop = img.source_url;
      imgSorted.medium = img["media_details"].sizes.medium_large.source_url;
    }
  }
  return imgSorted;
}
// To align the sidebar line with the article line
function adjustHeight() {
  const sidebarTitle = document.querySelector(".sidebar__title");
  const mainTitle = document.querySelector(".fullcontent__title");
  let height = mainTitle.getBoundingClientRect().height;
  if (document.querySelector(".fullcontent__titlewrap")) {
    height = document.querySelector(".fullcontent__titlewrap").getBoundingClientRect().height;
  }
  sidebarTitle.style.minHeight = `${height}px`;
}

if (document.querySelector(".main--about")) {
  adjustHeight();
  window.addEventListener("resize", adjustHeight);
}

if (document.querySelector(".main--post")) {
  const queryString = document.location.search;
  const params = new URLSearchParams(queryString);
  const id = params.get("id");
  const category = params.get("category");
  const cors = "https://noroffcors.herokuapp.com/";
  const url = cors + `https://fronthauk.com/blogposts/wp-json/wp/v2/posts/?_embed`;
  const out = document.querySelector(".main--post");
  let post = {};
  let images = {};
  let categories = {};
  let authorName = "";
  let date = {};
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      post = data;
      console.log(post);
      const imageUrl = cors + "https://fronthauk.com/blogposts/wp-json/wp/v2/media?parent=" + id;

      return fetch(imageUrl);
    })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      // Filter out the fitting category name, author name, images belonging to this post, and sort the date object into usable information
      categories = checkCategories(post._embedded["wp:term"][0]);
      authorName = post._embedded.author[0].name;
      images = sortImages(data);
      console.log(images);
      date = dateHandler(post.date);
      out.innerHTML = `
        <div class="modal">
          <div class="modal__wrap">
            <button class="modal__close">Close</button>
            <picture class="fullcontent__imagewrap modal__imagewrap">
              <source media="(max-width: 640px)" srcset="${images.mobile}" />
              <source media="(min-width: 640px)" srcset="${images.desktop}" />
              <img src="${images.desktop}" alt="${images.alt}" class="fullcontent__image" />
            </picture>
          </div>
        </div>
        <div class="fullcontent__container">
          <div data-category="${categories.name}" class="fullcontent__article fullcontent__article--post">
            <div class="fullcontent__titlewrap">
              <div class="article__info article__info--post infotext--big">
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
              <h1 class="fullcontent__title blogheader">${post.title.rendered}</h1>
            </div>
            <div class="fullcontent__bodytext fullcontent__bodytext--post bodytext--large">${post.content.rendered}</div>
          </div>
          <aside class="fullcontent__sidebar fullcontent__sidebar--post section__contrast">
          <div class="sidebar">
            <h2 class="sidebar__title sidebar__title--post asideheader">Similar Articles</h2>
            <div class="sidebar__similar">
              <ul class="sidebar__similarlist">
                <li>
                  <article class="article__item article__item--similar">
                    <a class="article__linkwrap" href="">
                      <div class="article__imagewrap">
                        <div class="article__tag article__tag--guide tagtext--small article__tag--similar">Guide</div>
                        <picture>
                          <source media="(max-width: 1018.5px)" srcset="/media/hades-1440w.jpg 1440w" />
                          <source media="(min-width: 1018.5px)" srcset="/media/hades-1440w.jpg 1440w" />
                          <img
                            class="article__image article__image--similar"
                            src="/media/hades-1440w.jpg"
                            alt="The API will fill this in"
                          />
                        </picture>
                      </div>
                    </a>
                    <div class="article__textblock article__textblock--similar">
                      <h3 class="article__title article__title--similar h3small">
                        <a class="links" href="">Phasmophobia - New Ghosts &amp; More Creepy Stuff</a>
                      </h3>
                    </div>
                  </article>
                </li>
                <li>
                  <article class="article__item article__item--similar">
                    <a class="article__linkwrap" href="">
                      <div class="article__imagewrap">
                        <div class="article__tag article__tag--guide tagtext--small article__tag--similar">Guide</div>
                        <picture>
                          <source media="(max-width: 1018.5px)" srcset="/media/hades-1440w.jpg 1440w" />
                          <source media="(min-width: 1018.5px)" srcset="/media/hades-1440w.jpg 1440w" />
                          <img
                            class="article__image article__image--similar"
                            src="/media/hades-1440w.jpg"
                            alt="The API will fill this in"
                          />
                        </picture>
                      </div>
                    </a>
                    <div class="article__textblock article__textblock--similar">
                      <h3 class="article__title article__title--similar h3small">
                        <a class="links" href="">Phasmophobia - New Ghosts &amp; More Creepy Stuff</a>
                      </h3>
                    </div>
                  </article>
                </li>
                <li>
                  <article class="article__item article__item--similar">
                    <a class="article__linkwrap" href="">
                      <div class="article__imagewrap">
                        <div class="article__tag article__tag--guide tagtext--small article__tag--similar">Guide</div>
                        <picture>
                          <source media="(max-width: 1018.5px)" srcset="/media/hades-1440w.jpg 1440w" />
                          <source media="(min-width: 1018.5px)" srcset="/media/hades-1440w.jpg 1440w" />
                          <img
                            class="article__image article__image--similar"
                            src="/media/hades-1440w.jpg"
                            alt="The API will fill this in"
                          />
                        </picture>
                      </div>
                    </a>
                    <div class="article__textblock article__textblock--similar">
                      <h3 class="article__title article__title--similar h3small">
                        <a class="links" href="">Phasmophobia - New Ghosts &amp; More Creepy Stuff</a>
                      </h3>
                    </div>
                  </article>
                </li>
                <li>
                  <article class="article__item article__item--similar">
                    <a class="article__linkwrap" href="">
                      <div class="article__imagewrap">
                        <div class="article__tag article__tag--guide tagtext--small article__tag--similar">Guide</div>
                        <picture>
                          <source media="(max-width: 1018.5px)" srcset="/media/hades-1440w.jpg 1440w" />
                          <source media="(min-width: 1018.5px)" srcset="/media/hades-1440w.jpg 1440w" />
                          <img
                            class="article__image article__image--similar"
                            src="/media/hades-1440w.jpg"
                            alt="The API will fill this in"
                          />
                        </picture>
                      </div>
                    </a>
                    <div class="article__textblock article__textblock--similar">
                      <h3 class="article__title article__title--similar h3small">
                        <a class="links" href="">Phasmophobia - New Ghosts &amp; More Creepy Stuff</a>
                      </h3>
                    </div>
                  </article>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>`;
      // Modal variables
      if (document.querySelector(".modal")) {
        const modalBackdrop = document.querySelector(".modal__backdrop");
        const modalOuter = document.querySelector(".modal");
        const imgOne = document.querySelector(".fullcontent__image");
        const imgTwo = document.querySelector("figure img");
        const modalClose = document.querySelector(".modal__close");
        const imageWrap = document.querySelector(".modal__image");

        function modalToggle(e) {
          if (modalOuter.classList.contains("modal--active") || e.target === modalClose) {
            if (e.target === document.querySelector(".modal__image img")) return;
            modalBackdrop.style.display = "none";
            imageWrap.innerHTML = "";
            modalOuter.classList.remove("modal--active");
          } else if (!modalOuter.classList.contains("modal--active")) {
            imageWrap.innerHTML = e.target.parentNode.outerHTML;
            modalBackdrop.style.display = "block";
            modalOuter.classList.add("modal--active");
          }
        }
        imgOne.addEventListener("click", modalToggle);
        imgTwo.addEventListener("click", modalToggle);
        modalClose.addEventListener("click", modalToggle);
        modalBackdrop.addEventListener("click", modalToggle);
      }

      adjustHeight();
      window.addEventListener("resize", adjustHeight);
    })
    .catch((error) => console.error(error));
}
