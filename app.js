const searchInput = document.querySelector("#searchBar");
const perPage = 15;
let currentPage = 1;
const apiKey = "EJRlgKvlINUvcQewBQqhCbQxXCCMTdvbz8Q9ePoJ4Co0M5Zuf9D4MxIA";

const imagesWrapper = document.querySelector(".images");

const mainImg = document.querySelector(".card img");

const cameraMen = document.querySelector(".photographer");

// const refreshBtn = document.querySelector(".refreshBtn");

const loadMore = document.querySelector(".load-more");

const lightbox = document.querySelector(".lightbox");

const closeLightBox = document.querySelector(".uil-times");

const hidLightBox = document.querySelector("#lightbox-container");

const downloadBtn = lightbox.querySelector(".uil-import");

const headerBanner = document.querySelector(".search"),
  style =
    headerBanner.currentStyle || window.getComputedStyle(headerBanner, true),
  bi = style.backgroundImage.slice(4, -1);

console.log(`this is bi`, bi);

const generateHTML = (images) => {
  imagesWrapper.innerHTML = images
    .map(
      (img) =>
        ` <li class="card" >
        <img onclick="showWhiteBox('${img.photographer}','${img.src.large2x}','${img.photographer_url}')" src=${img.src.large2x} alt="${img.alt}">
        <div class="details">
            <div class="photographer">
                <i class="uil uil-camera"></i>
                <span><a class="photographer-link" href="${img.photographer_url}">${img.photographer}</a></span>
            </div>
            <button><i class="uil uil-import" onclick="downloadImg('${img.src.large2x}')"></i></button>
        </div>
    </li>`
    )
    .join(" ");
};

const getImages = async (apiUrl) => {
  loadMore.innerText = "Loading...";
  loadMore.classList.add("disabled");

  const config = { headers: { Authorization: apiKey } };
  const res = await axios.get(apiUrl, config);
  console.log(res.data);
  loadMore.innerText = "Load More";
  loadMore.classList.remove("disabled");
  // let nextPage = res.data.next_page;
  // console.log(nextPage);
  // console.log(res.data.photos);
  // console.log(res.data.photos[0].src.large2x);
  // console.log(closeLightBox);
  // console.log(download)
  generateHTML(res.data.photos);

  console.log(headerBanner.bi);
};

searchInput.addEventListener("keypress", function (event) {
  if (event.target.value === "") return (searchQuery = null);
  if (event.key === "Enter") {
    // or keycode of enter key is 13
    event.preventDefault();
    currentPage = 1;
    let searchQuery = searchInput.value;
    console.log(searchQuery);
    imagesWrapper.innerHTML = "";

    getImages(
      `https://api.pexels.com/v1/search?query=${searchQuery}?page=${currentPage}&per_page=${perPage}`
    );
  }
});

const showWhiteBox = (photographer, img, photographer_url) => {
  lightbox.classList.add("lightbox-show");

  let cameraSpan = lightbox.querySelector(".lightbox span");

  cameraSpan.innerHTML = `<a class="photographer-link" href="${photographer_url}">${photographer}</a>`;
  // let anchor = document.createElement("a");
  // anchor.href = photographer_url;

  // cameraMen.appendChild(anchor);

  lightbox.querySelector("img").src = img;
  downloadBtn.setAttribute("data-img", img); // storing the img url as a btn attribute so we can download
  document.body.style.overflow = "hidden";
};

closeLightBox.addEventListener("click", function () {
  lightbox.classList.remove("lightbox-show");
  document.body.style.overflow = "auto";
  // hidLightBox.style.display = "none";
});

//Click outside of the lighBox div to close it
window.onclick = function (event) {
  if (event.target === hidLightBox) {
    lightbox.classList.remove("lightbox-show");
    document.body.style.overflow = "auto";
  }
};

downloadBtn.addEventListener("click", (e) => {
  downloadImg(e.target.dataset.img);
});

const loadMoreImages = () => {
  currentPage++;
  let apiUrl = "";
  if (searchInput.value !== "") {
    apiUrl = `https://api.pexels.com/v1/search/?page=${currentPage}&per_page=${perPage}&query=${searchInput.value}`;
  } else {
    apiUrl = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
  }
  getImages(apiUrl);
  console.log(currentPage);
};

getImages(
  `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`
);

const downloadImg = (imgUrl) => {
  fetch(imgUrl)
    .then((res) => res.blob()) //converting recieved image to blob
    .then((file) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(file); // creating its download linl and
      a.download = new Date().getTime(); //downloading it
      a.click();
    })
    .catch(() => alert("Failed to download image."));
};

loadMore.addEventListener("click", loadMoreImages);

// download.addEventListener('click', downloadImg(downloadUrl));

// let nextPage = 1;
// refreshBtn.addEventListener('click', function () {
//     nextPage++;
//     getImages(`https://api.pexels.com/v1/curated?page=${nextPage}&per_page=${perPage}`);
//     console.log(nextPage);
// })
