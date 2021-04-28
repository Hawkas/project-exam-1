const url = "https://fronthauk.com/blogposts/wp-json/wp/v2/posts/";

fetch(url)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    document.body.innerHTML = `
    <h1>${data[1].title.rendered}</h1>
    ${data[1].content.rendered}
    <strong>Post ID: ${data[1].id}</strong>
    <br /><strong>Date: ${data[1].date}</strong>
      <h1>${data[0].title.rendered}</h1>
      ${data[0].content.rendered}
      <strong>Post ID: ${data[0].id}</strong><br />
      <strong>Date: ${data[0].date}</strong><br />
      <br /><br /><small>---------------------------Messages below are not from the API---------------------------</small>
      <br /><small>Everything works as it should</small><br />
      <small>Now excuse me while I spend the next few weeks picking colors and stock photos</small>
      `;
  })
  .catch((error) => console.error(error));
