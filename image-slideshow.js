
const t79Show = {
    //
    AUTOPLAY : false,
    NAVIGATION_CONTROLS : true,
    SLIDESHOW_CONTROLS : true,
    //
    GALLERY_TAG_ATTRIBUTE : "data-gallery",
    GALLERY_CLASS_NAME : "gallery",
    MARK_IMAGE_GROUPS : true,
    ALT_IMAGE_URL : "data-galleryimage",
    ALT_IMAGE_SIZE : "data-gallerysize",
    //
    LEFT_NAVIGATION_ARROW : "icons/caret-left-solid.svg",
    RIGHT_NAVIGATION_ARROW : "icons/caret-right-solid.svg"
}

const t79Style = {
    BACKGROUND_COLOR : "#ffffff33",
    BACKGROUND_BLUR : "10px",
    BASE_FONT_SIZE : "14px",
    MARGIN : "5vw"
}

window.addEventListener('resize', function() {
	positionImageView();
	window.setTimeout(function() {
		positionImageView();
	}, 600);
});

function slideshowInit() {
    generateSlideshowElm();
    getImages();
}

function generateSlideshowElm() {
    t79Show.containerElm = makeContainerElm();
    t79Show.leftControllersContainerElm = makeLeftControllersContainerElm();
    t79Show.previousImageButtonElm = makePreviousImageButtonElm();
    t79Show.outerImageFrameElm = makeOuterImageFrameElm();
    t79Show.innerImageFrameElm = makeInnerImageFrameElm();
    t79Show.imageViewElm = makeImageViewElm();
    t79Show.rightControllersContainerElm = makeRightControllersContainerElm();
    t79Show.nextImageButtonElm = makeNextImageButtonElm();

    t79Show.leftControllersContainerElm.appendChild(t79Show.previousImageButtonElm);
    t79Show.containerElm.appendChild(t79Show.leftControllersContainerElm);
    t79Show.innerImageFrameElm.appendChild(t79Show.imageViewElm);
    t79Show.outerImageFrameElm.appendChild(t79Show.innerImageFrameElm);
    t79Show.containerElm.appendChild(t79Show.outerImageFrameElm);
    t79Show.rightControllersContainerElm.appendChild(t79Show.nextImageButtonElm);
    t79Show.containerElm.appendChild(t79Show.rightControllersContainerElm);
    document.body.appendChild(t79Show.containerElm);

    styleContainerElm("initialize");
    styleControllerContainerElm(t79Show.leftControllersContainerElm, "initialize");
    styleNavigationButtonElm(t79Show.previousImageButtonElm, "initialize");
    styleOuterFrameElm("initialize");
    styleInnerFrameElm("initialize");
    styleImageViewElm("initialize");
    styleControllerContainerElm(t79Show.rightControllersContainerElm, "initialize");
    styleNavigationButtonElm(t79Show.nextImageButtonElm, "initialize");
}

function makeContainerElm() {
    const containerElm = document.createElement("div");
    containerElm.id = "slideshow-container";
    containerElm.addEventListener("click", goOutOfFullscreen);
    return containerElm;
}

function makeLeftControllersContainerElm() {
    const leftContainerElm = document.createElement("div");
    leftContainerElm.id = "slideshow-left-controllers-container";
    return leftContainerElm;
}

function makePreviousImageButtonElm() {
    const previousButElm = document.createElement("img");
    previousButElm.id = "slideshow-previous-image-button";
    previousButElm.src = t79Show.LEFT_NAVIGATION_ARROW;
    previousButElm.addEventListener("click", (e) => {
        e.stopPropagation();
        goToPreviousImage();
    });
    return previousButElm;
}

function makeOuterImageFrameElm() {
    const outerFrameElm = document.createElement("div");
    outerFrameElm.id = "slideshow-outer-frame";
    return outerFrameElm;
}

function makeInnerImageFrameElm() {
    const innerFrameElm = document.createElement("div");
    innerFrameElm.id = "slideshow-inner-frame";
    return innerFrameElm;
}

function makeImageViewElm() {
    const imageViewElm = document.createElement("img");
    imageViewElm.id = "slideshow-image-view";
    return imageViewElm;
}

function makeRightControllersContainerElm() {
    const rightContainerElm = document.createElement("div");
    rightContainerElm.id = "slideshow-right-controllers-container";
    return rightContainerElm;
}

function makeNextImageButtonElm() {
    const nextButElm = document.createElement("img");
    nextButElm.id = "slideshow-next-image-button";
    nextButElm.src = t79Show.RIGHT_NAVIGATION_ARROW;
    nextButElm.addEventListener("click", (e) => {
        e.stopPropagation();
        goToNextImage();
    });
    return nextButElm;
}

function getImages() {
    const searchResult = searchForImages();
    makeImagesReady(searchResult);
}

function searchForImages() {
    const searchString = constructSearchString();
    const rawSearchOutput = mainSearchForImages(searchString);
    const images = extractImages(rawSearchOutput);
    return images;
}

function constructSearchString() {
    let searchString = "";
    if (t79Show.MARK_IMAGE_GROUPS) {
        searchString += "[data-gallery] img, gallery img, ";
    }
    searchString += "img[data-gallery], img.gallery";
    return searchString;
}

function mainSearchForImages(searchString) {
    const galleries = document.querySelectorAll(searchString);
    const galleriesArray = Array.from(galleries);
    return galleriesArray;
}

function extractImages(rawSearchOutput) {
    const result = [];
    rawSearchOutput.forEach(element => {
        if (element.children.length > 0) {
            result.concat(searchImagesFromOneGroup(element));
        }
        else {
            result.push(element);
        }
    });
    return result;
}

function searchImagesFromOneGroup(element) {
    const images = element.querySelectorAll("img");
    const imagesArray = Array.from(images);
    return imagesArray;
}

function makeImagesReady(searchResult) {
    let imageCount = 0;
    var previousImage;
    searchResult.forEach(element => {
        imageCount++;
        styleSelectedImageElm(element, "initialize");
        element.addEventListener("click", goIntoFullscreen);
        element.setAttribute("data-galleryimageid", imageCount);
        if (previousImage) {
            previousImage.setAttribute("data-nextgalleryimage", imageCount);
            element.setAttribute("data-previousgalleryimage", previousImage.getAttribute("data-galleryimageid"));
        }
        previousImage = element;
    });
}

function runSlideshow() {
    t79Show.slideshowInterval = window.setInterval(goToNextImage, 6000, "next");
}

function stopSlideshow() {
    window.clearInterval(t79Show.slideshowInterval);
}

function goIntoFullscreen(e) {
    styleContainerElm("goesIntoFullscreen");
    styleSelectedImageElm(this, "goesIntoFullscreen");
    t79Show.selectedImageElm = this;
    t79Show.imageViewElm.src = this.src;
    updateNavigationButtons();
    positionImageView();
    runSlideshow();
}

function goToPreviousImage() {
    const previousImageId = t79Show.selectedImageElm.getAttribute("data-previousgalleryimage");
    const previousImageElm = document.querySelector("[data-galleryimageid='" + previousImageId + "']");
    changeSelectedImage(previousImageElm);
    t79Show.imageViewElm.src = previousImageElm.src;
    console.log(previousImageElm);
    updateNavigationButtons();
    positionImageView();
}

function goToNextImage() {
    const nextImageId = t79Show.selectedImageElm.getAttribute("data-nextgalleryimage");
    const nextImageElm = document.querySelector("[data-galleryimageid='" + nextImageId + "']");
    changeSelectedImage(nextImageElm);
    t79Show.imageViewElm.src = nextImageElm.src;
    console.log(nextImageElm);
    updateNavigationButtons();
    positionImageView();
}

function positionImageView() {
    const imageWidth = t79Show.selectedImageElm.getAttribute("width");
    const imageHeight = t79Show.selectedImageElm.getAttribute("height");
    const imageRatio = imageWidth / imageHeight;
    const outerFrameWidth = t79Show.outerImageFrameElm.clientWidth;
    const outerFrameHeight = t79Show.outerImageFrameElm.clientHeight;
    const outerFrameRatio = outerFrameWidth / outerFrameHeight;

    if (imageWidth < outerFrameWidth && imageHeight < outerFrameHeight) {
        t79Show.imageViewElm.width = imageWidth;
        t79Show.imageViewElm.height = imageHeight;
    }
    else if (imageRatio < outerFrameRatio) {
        t79Show.innerImageFrameElm.style.width = `${outerFrameHeight * imageRatio}px`;
        t79Show.innerImageFrameElm.style.height = `${outerFrameHeight}px`;
        t79Show.imageViewElm.width = outerFrameHeight * imageRatio;
        t79Show.imageViewElm.height = outerFrameHeight;
    }
    else {
        t79Show.innerImageFrameElm.style.width = `${outerFrameWidth}px`;
        t79Show.innerImageFrameElm.style.height = `${outerFrameWidth / imageRatio}px`;
        t79Show.imageViewElm.width = outerFrameWidth;
        t79Show.imageViewElm.height = outerFrameWidth / imageRatio; 
    }
}

function goOutOfFullscreen(e) {
    styleContainerElm("goesOutOfFullscreen");
    styleSelectedImageElm(t79Show.selectedImageElm, "comesOutOfFullscreen");
    t79Show.selectedImageElm = undefined;
}

function changeSelectedImage(imageElm) {
    if (t79Show.selectedImageElm) {
        styleSelectedImageElm(t79Show.selectedImageElm, "areDeselected");
    }
    t79Show.selectedImageElm = imageElm;
    styleSelectedImageElm(imageElm, "becomingSelected");
}

function updateNavigationButtons() {
    if (t79Show.selectedImageElm.getAttribute("data-previousgalleryimage") == undefined) {
        styleNavigationButtonElm(t79Show.previousImageButtonElm, "hide");
    }
    else {
        styleNavigationButtonElm(t79Show.previousImageButtonElm, "show");
    }
    if (t79Show.selectedImageElm.getAttribute("data-nextgalleryimage") == undefined) {
        styleNavigationButtonElm(t79Show.nextImageButtonElm, "hide");
    }
    else {
        styleNavigationButtonElm(t79Show.nextImageButtonElm, "show");
    }
}

function styleContainerElm(state) {
    switch (state) {
        case "initialize":
            t79Show.containerElm.style.backgroundColor = t79Style.BACKGROUND_COLOR;
            t79Show.containerElm.style.position = "fixed";
            t79Show.containerElm.style.top = 0;
            t79Show.containerElm.style.left = 0;
            t79Show.containerElm.style.width = "100vw";
            t79Show.containerElm.style.height = "100vh";
            t79Show.containerElm.style.fontSize = t79Style.BASE_FONT_SIZE;
            t79Show.containerElm.style.display = "none";
            t79Show.containerElm.style.flexFlow = "row nowrap";
            t79Show.containerElm.style.justifyContent = "space-between";
            t79Show.containerElm.style.alignItems = "center";
            t79Show.containerElm.style.boxSizing = "border-box";
            t79Show.containerElm.style.overflow = "hidden";
            t79Show.containerElm.style.cursor = "zoom-out";
            t79Show.containerElm.style.webkitBackdropFilter = `blur(${t79Style.BACKGROUND_BLUR})`;
            t79Show.containerElm.style.backdropFilter = `blur(${t79Style.BACKGROUND_BLUR})`;
            t79Show.containerElm.style.padding = t79Style.MARGIN;
            break;
        case "goesIntoFullscreen":
            t79Show.containerElm.style.display = "flex";
            break;
        case "goesOutOfFullscreen":
            t79Show.containerElm.style.display = "none";
    }
}

function styleControllerContainerElm(containerElm, state) {
    switch (state) {
        case "initialize":
            containerElm.style.display = "flex";
            containerElm.style.flexFlow = "column nowrap";
            containerElm.style.justifyContent = "center";
            containerElm.style.alignItems = "center";
            containerElm.style.position = "relative";
    }
}

function styleNavigationButtonElm(buttonElm, state) {
    switch (state) {
        case "initialize":
            buttonElm.style.width = "2rem";
            buttonElm.style.height = "auto";
            break;
        case "show":
            buttonElm.style.opacity = 1;
            break;
        case "hide":
            buttonElm.style.opacity = 0;
    }
}

function styleOuterFrameElm(state) {
    switch (state) {
        case "initialize":
            t79Show.outerImageFrameElm.style.display = "flex";
            t79Show.outerImageFrameElm.style.flexFlow = "column nowrap";
            t79Show.outerImageFrameElm.style.justifyContent = "center";
            t79Show.outerImageFrameElm.style.alignItems = "center";
            t79Show.outerImageFrameElm.style.width = "100%";
            t79Show.outerImageFrameElm.style.height = "100%";
    }
}

function styleInnerFrameElm(state) {
    switch (state) {
        case "initialize": 
            t79Show.innerImageFrameElm.style.display = "flex";
            t79Show.innerImageFrameElm.style.flexFlow = "column nowrap";
            t79Show.innerImageFrameElm.style.justifyContent = "center";
            t79Show.innerImageFrameElm.style.alignItems = "center";
            t79Show.innerImageFrameElm.style.width = "100%";
    }
}

function styleSelectedImageElm(image, state) {
    switch (state) {
        case "initialize":
            image.style.cursor = "zoom-in";
            break;
        case "goesIntoFullscreen":
        case "becomingSelected":
            image.style.opacity = 0;
            break;
        case "comesOutOfFullscreen":
        case "areDeselected":
            image.style.opacity = 1;
    }
}

function styleImageViewElm(state) {
    switch (state) {
        case "initialize":
            break;
    }
}



export { slideshowInit };