const cors = "https://noroffcors.herokuapp.com/";
const url = cors + "https://fronthauk.com/blogposts/wp-json/wp/v2/posts/11";
let post;
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    post = data;
    return fetch(cors + "https://fronthauk.com/blogposts/wp-json/wp/v2/media?parent=" + post.id);
  })
  .then((response) => response.json())
  .then((data) => {
    console.log(post, data);
    let images = sortImages(data);
    document.body.innerHTML = `
    <img src="${images.mobile}" alt="${images.alt}" srcset="">
    <h1>${post.title.rendered}</h1>
    ${post.content.rendered}
    <strong>Post ID: ${post.id}</strong>
    <br /><strong>Date: ${post.date}</strong>
      <h1>${post.title.rendered}</h1>
      ${post.content.rendered}
      <strong>Post ID: ${post.id}</strong><br />
      <strong>Date: ${post.date}</strong><br />
      `;
  })
  .catch((error) => console.error(error));
function sortImages(images) {
  let imgSorted = { mobile: "", desktop: "", alt: images[0].alt_text };
  for (img of images) {
    if (img["media_details"].width === 640) imgSorted.mobile = img.source_url;
    if (img["media_details"].width === 1440) imgSorted.desktop = img.source_url;
  }
  return imgSorted;
}
