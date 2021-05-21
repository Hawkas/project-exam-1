const url = "https://fronthauk.com/blogposts/wp-json/wp/v2/posts";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    document.body.innerHTML = `
    <h1>${data.title.rendered}</h1>
    ${data.content.rendered}
    <strong>Post ID: ${data.id}</strong>
    <br /><strong>Date: ${data.date}</strong>
      <h1>${data.title.rendered}</h1>
      ${data.content.rendered}
      <strong>Post ID: ${data.id}</strong><br />
      <strong>Date: ${data.date}</strong><br />
      `;
  })
  .catch((error) => console.error(error));
