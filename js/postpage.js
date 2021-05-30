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
  let categoryObject = { featured: false, name: "Error", id: 0 };

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
    if (typeof categoriesList.name === undefined) return categoryObject;
    categoryObject.name = categoriesList[0].name;
    categoryObject.id = categoriesList[0].id;
  }
  return categoryObject;
}
function sortEmbedded(item) {
  let img = item._embedded["wp:featuredmedia"][0];
  let imgSorted = { medium: "", desktop: "", alt: img.alt_text };
  imgSorted.medium = img["media_details"].sizes.medium_large.source_url;
  imgSorted.desktop = img["media_details"].sizes.full.source_url;
  return imgSorted;
}
function sortImages(images) {
  let imgSorted = { mobile: "", desktop: "", medium: "", alt: images[0].alt_text };
  for (let img of images) {
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
  const id = parseInt(params.get("id")) ?? 11;
  const category = parseInt(params.get("category")) ?? 3;
  const cors = "https://noroffcors.herokuapp.com/";
  const url = cors + `https://fronthauk.com/blogposts/wp-json/wp/v2/posts/?categories=${category}&_embed`;
  const mainOut = document.querySelector(".fullcontent__article");
  const imgOut = document.querySelector(".fullcontent__imageout");
  const similarOut = document.querySelector(".sidebar__similarlist");
  const description = document.querySelector(`meta[name="description"]`);
  let post = {};
  let images = {};
  let categories = {};
  let authorName = "";
  let date = {};
  let pictureHtml = "";
  let articleHtml = "";
  let similarHtml = "";
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      post = data;
      const imageUrl = cors + "https://fronthauk.com/blogposts/wp-json/wp/v2/media?parent=" + id;

      return fetch(imageUrl);
    })
    .then((response) => response.json())
    .then((data) => {
      for (let item of post) {
        categories = checkCategories(item._embedded["wp:term"][0]);
        authorName = item._embedded.author[0].name;
        if (item.id !== id) images = sortEmbedded(item);
        date = dateHandler(item.date);
        if (item.id === id) {
          // Title will include HTML Entities, so I'm gonna use innerHTML instead of document.title
          document.querySelector("title").innerHTML = item.title.rendered + " | GameBlog";
          let excerpt = item.excerpt.rendered;
          excerpt = excerpt.replace(/(<([^>]+)>)/gi, "");
          description.setAttribute("content", `GameBlog | ${excerpt}`);
          images = sortImages(data);
          console.log(images);
          pictureHtml = `
          <picture class="fullcontent__imagewrap">
            <source media="(max-width: 640px)" srcset="${images.mobile} 640w" />
            <source media="(min-width: 640px) and (max-width: 720px)" srcset="${images.medium} 1x, ${images.desktop} 2x" />
            <source media="(min-width: 720px)" srcset="${images.desktop} 1440w" />
            <img src="${images.desktop}" alt="${images.alt}" class="fullcontent__image"/>
          </picture>`;
          articleHtml = `
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
            <h1 class="fullcontent__title blogheader">${item.title.rendered}</h1>
          </div>
          <div class="fullcontent__bodytext fullcontent__bodytext--post bodytext--large">${item.content.rendered}</div>`;
        } else {
          let link = "./post.html?id=" + item.id + "&category=" + categories.id;
          similarHtml += `
          <li>
            <article class="article__item article__item--similar">
              <a class="article__linkwrap" href="${link}" tabindex="-1">
                <div class="article__imagewrap">
                  <div class="article__tag article__tag--${categories.name.toLowerCase()} tagtext--small article__tag--similar">
                    ${categories.name}
                  </div>
                  <img
                    class="article__image article__image--similar"
                    srcset="${images.medium} 1x, ${images.desktop} 2x"
                    src="${images.medium}"
                    alt="${images.alt}"
                  />
                </div>
              </a>
              <div class="article__textblock article__textblock--similar">
                <h3 class="article__title article__title--similar h3small">
                  <a class="links" href="${link}">${item.title.rendered}</a>
                </h3>
              </div>
            </article>
          </li>`;
        }
        imgOut.innerHTML = pictureHtml;
        mainOut.innerHTML = articleHtml;
        similarOut.innerHTML = similarHtml;
      }
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
    .catch((error) => {
      console.error(error);
      let errorMessage = `<h3 class="error" style="display: block; font-size: 1.5rem;">Looks like something went wrong. Try blowing on it!</h3>`;
      imgOut.innerHTML = errorMessage;
      mainOut.innerHTML = errorMessage;
      similarOut.innerHTML = errorMessage;
    });
}
