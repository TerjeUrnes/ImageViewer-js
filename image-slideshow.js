
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
    MARGIN : "5vw",
    LEFT_NAVIGATION_ARROW : "icons/caret-left-solid.svg",
    RIGHT_NAVIGATION_ARROW : "icons/caret-right-solid.svg"
}

const t79Style = {
    BACKGROUND_COLOR : "#ffffff33",
    BACKGROUND_BLUR : "10px",
    BASE_FONT_SIZE : "14px"
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
    t79Show.container = makeContainerElm();
    t79Show.container.innerText = ".";
    styleContainer("initialize");
    t79Show.outerImageFrame = makeOuterImageFrameElm();
    styleOuterFrame("initialize");
    t79Show.innerImageFrame = makeInnerImageFrameElm();
    styleInnerFrame("initialize");
    t79Show.imageView = makeImageViewElm();
    styleImageView("initialize");
    t79Show.innerImageFrame.appendChild(t79Show.imageView);
    t79Show.outerImageFrame.appendChild(t79Show.innerImageFrame);
    t79Show.container.appendChild(t79Show.outerImageFrame);
    document.body.appendChild(t79Show.container);

    // const test = document.createElement("div");
    // test.style.webkitBackdrop
}

function makeContainerElm() {
    const container = document.createElement("div");
    container.id = "slideshow-container";
    container.addEventListener("click", goOutOfFullscreen);
    return container;
}

function makeOuterImageFrameElm() {
    const outerFrame = document.createElement("div");
    outerFrame.id = "slideshow-outer-frame";
    return outerFrame;
}

function makeInnerImageFrameElm() {
    const innerFrame = document.createElement("div");
    innerFrame.id = "slideshow-inner-frame";
    return innerFrame;
}

function makeImageViewElm() {
    const imageView = document.createElement("img");
    imageView.id = "slideshow-image-view";
    return imageView;
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
        styleSelectedImage(element, "initialize");
        element.addEventListener("click", goIntoFullscreen);
        element.setAttribute("data-galleryimageid", imageCount);
        if (previousImage) {
            previousImage.setAttribute("data-nextgalleryimage", imageCount);
            element.setAttribute("data-previousgalleryimage", previousImage.getAttribute("data-galleryimageid"));
        }
        else {
            element.setAttribute("data-previousgalleryimage", undefined);
        }
        previousImage = element;
    });
}

function goIntoFullscreen(e) {
    styleContainer("goesIntoFullscreen");
    styleSelectedImage(this, "goesIntoFullscreen");
    t79Show.selectedImage = this;
    t79Show.imageView.src = this.src;
    positionImageView();
}

function positionImageView() {
    const imageWidth = t79Show.selectedImage.getAttribute("width");
    const imageHeight = t79Show.selectedImage.getAttribute("height");
    const imageRatio = imageWidth / imageHeight;
    const outerFrameWidth = t79Show.outerImageFrame.clientWidth;
    const outerFrameHeight = t79Show.outerImageFrame.clientHeight;
    const outerFrameRatio = outerFrameWidth / outerFrameHeight;

    if (imageWidth < outerFrameWidth && imageHeight < outerFrameHeight) {
        t79Show.imageView.width = imageWidth;
        t79Show.imageView.height = imageHeight;
    }
    else if (imageRatio < outerFrameRatio) {
        t79Show.innerImageFrame.style.width = `${outerFrameHeight * imageRatio}px`;
        t79Show.innerImageFrame.style.height = `${outerFrameHeight}px`;
        t79Show.imageView.width = outerFrameHeight * imageRatio;
        t79Show.imageView.height = outerFrameHeight;
    }
    else {
        t79Show.innerImageFrame.style.width = `${outerFrameWidth}px`;
        t79Show.innerImageFrame.style.height = `${outerFrameWidth / imageRatio}px`;
        t79Show.imageView.width = outerFrameWidth;
        t79Show.imageView.height = outerFrameWidth / imageRatio; 
    }
}

function goOutOfFullscreen(e) {
    styleContainer("goesOutOfFullscreen");
    styleSelectedImage(t79Show.selectedImage, "comesOutOfFullscreen");
    t79Show.selectedImage = undefined;
}

function changeSelectedImage(element) {
    if (t79Show.selectedImage) {
        styleSelectedImage(t79Show.selectedImage, "areDeselected");
    }
    t79Show.selectedImage = element;
    styleSelectedImage(element, "becomingSelected");
}

function styleContainer(state) {
    switch (state) {
        case "initialize":
            t79Show.container.style.backgroundColor = t79Style.BACKGROUND_COLOR;
            t79Show.container.style.position = "fixed";
            t79Show.container.style.top = 0;
            t79Show.container.style.left = 0;
            t79Show.container.style.width = "100vw";
            t79Show.container.style.height = "100vh";
            t79Show.container.style.fontSize = t79Style.BASE_FONT_SIZE;
            t79Show.container.style.display = "none";
            t79Show.container.style.flexFlow = "row nowrap";
            t79Show.container.style.justifyContent = "center";
            t79Show.container.style.alignItems = "center";
            t79Show.container.style.boxSizing = "border-box";
            t79Show.container.style.overflow = "hidden";
            t79Show.container.style.cursor = "zoom-out";
            t79Show.container.style.webkitBackdropFilter = `blur(${t79Style.BACKGROUND_BLUR})`;
            t79Show.container.style.backdropFilter = `blur(${t79Style.BACKGROUND_BLUR})`;
            break;
        case "goesIntoFullscreen":
            t79Show.container.style.display = "flex";
            break;
        case "goesOutOfFullscreen":
            t79Show.container.style.display = "none";
    }
}

function styleOuterFrame(state) {
    switch (state) {
        case "initialize":
            t79Show.outerImageFrame.style.display = "flex";
            t79Show.outerImageFrame.style.flexFlow = "column nowrap";
            t79Show.outerImageFrame.style.justifyContent = "center";
            t79Show.outerImageFrame.style.alignItems = "center";
            t79Show.outerImageFrame.style.width = "100%";
            t79Show.outerImageFrame.style.height = "100%";
    }
}

function styleInnerFrame(state) {
    switch (state) {
        case "initialize": 
            t79Show.innerImageFrame.style.display = "flex";
            t79Show.innerImageFrame.style.flexFlow = "column nowrap";
            t79Show.innerImageFrame.style.justifyContent = "center";
            t79Show.innerImageFrame.style.alignItems = "center";
            t79Show.innerImageFrame.style.width = "100%";
    }
}

function styleSelectedImage(image, state) {
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

function styleImageView(state) {
    switch (state) {
        case "initialize":
            break;
    }
}



export { slideshowInit };