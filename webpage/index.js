import { slideshowInit } from "../image-slideshow.js";

document.addEventListener("readystatechange", (e) => {
    if (document.readyState === "complete") {
        initSlides();
    }
});

function initSlides() {
    slideshowInit();
}