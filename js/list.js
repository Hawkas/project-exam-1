const out = document.querySelector(".section__articles--blogs");
const button = document.querySelector(".button--listed");
const buttonTagArray = document.querySelectorAll(".filterbar__buttontag");
function setActive() {
  if (this.classList.contains("buttontag--active")) {
    this.classList.toggle("buttontag--active");
  } else {
    for (buttonTag of buttonTagArray) {
      if (buttonTag.classList.contains("buttontag--active")) {
        buttonTag.classList.toggle("buttontag--active");
      }
    }
    this.classList.toggle("buttontag--active");
  }
}
for (let i = 0; i < 5; i++) {
  out.innerHTML += `<li style="display: none;" data-info="added">
  <article class="article__item article__item--listed">
    <div class="article__imagewrap">
      <img class="article__image" src="/media/hades-1440w.jpg" alt="The API will fill this in" />
    </div>
    <div class="article__textblock">
      <div class="article__info infotext">
        <div class="article__tag article__tag--guide tagtext">Guide</div>
        <div class="article__infotext">
          <div class="article__author">
            <span class="fas fa-user"></span>
            <p>KeyboardWarrior7</p>
          </div>
          <div class="article__date">
            <span class="fas fa-calendar-alt"></span>
            <p>03 April 2021</p>
          </div>
        </div>
      </div>
      <h3 class="article__title h3big">
        <a class="links" href="">Phasmophobia - New Ghosts &amp; More Creepy Stuff</a>
      </h3>
      <p class="article__excerpt bodytext">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ultricies sed odio quisque quam id sem placerat
        consectetur malesuada. Mauris libero dui est viverra enim interdum proin a. Velit varius enim volutpat enim sit
        faucibus. Mus sed nibh mauris faucibus lectus leo morbi...
      </p>
      <a href="" class="article__link links links--blue buttontext">
        Read More<span class="fas fa-chevron-right"></span>
      </a>
    </div>
  </article>
</li>`;
}
function viewMore() {
  let listArray = document.querySelectorAll(".section__articles--blogs li");
  console.log(listArray);
  if (button.classList.contains("viewmore")) {
    for (list of listArray) {
      if (list.dataset.info) list.style.display = "block";
    }
  }
  if (button.classList.contains("viewless")) {
    for (list of listArray) {
      if (list.dataset.info) list.style.display = "none";
    }
  }
  button.classList.toggle("viewless");
  button.classList.toggle("viewmore");
  button.classList.toggle("viewmore", "viewless");
  if (button.classList.contains("viewless")) {
    button.innerHTML = `View Less <span class="fas fa-chevron-circle-down"></span>`;
  } else button.innerHTML = `View More <span class="fas fa-chevron-circle-down"></span>`;
}
button.addEventListener("click", viewMore);
for (buttonTag of buttonTagArray) {
  buttonTag.addEventListener("click", setActive);
}
