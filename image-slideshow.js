
const t79Show = {
    //
    DURATION : 5,
    AUTOPLAY : "off",
    LOOP : "off",
    NAVIGATION_CONTROLS : "show",
    SLIDESHOW_CONTROLS : "show",
    THUMBNAIL_STRIP: "auto",
    //
    GALLERY_TAG_ATTRIBUTE : "data-gallery",
    GALLERY_CLASS_NAME : "gallery",
    MARK_IMAGE_GROUPS : "true",
    ALT_IMAGE_URL : "data-galleryimage",
    ALT_IMAGE_SIZE : "data-gallerysize",
    THUMBNAIL_URL : "data-thumbnailimage",
    THUMBNAIL_SIZE : "data-thumbnailsize",
    //
    LEFT_NAVIGATION_ARROW : "icons/caret-left-solid.svg",
    RIGHT_NAVIGATION_ARROW : "icons/caret-right-solid.svg",
    SLIDESHOW_PLAY : "icons/play-solid.svg",
    SLIDESHOW_PAUSE : "icons/pause-solid.svg",
    SLIDESHOW_INCREASE : "icons/caret-up-solid.svg",
    SLIDESHOW_DECREASE : "icons/caret-down-solid.svg",
    OPEN_THUMBNAIL_STRIP : "icons/folder-solid.svg",
    CLOSE_THUMBNAIL_STRIP : "icons/folder-open-solid.svg",
    //
    BACKGROUND_COLOR : "#00000099",
    BACKGROUND_BLUR : "15px",
    BASE_FONT_SIZE : "14px",
    IMAGE_PADDING : "2em",
    THUMBNAIL_STRIP_PADDING : "1.5em",
    THUMBNAIL_STRIP_WIDTH : "17em"
}

window.addEventListener('resize', function() {
    if (t79Show.isInFullscreen) {
        positionImageView();
        window.setTimeout(function() {
            positionImageView();
        }, 600);
    }
});

function slideshowInit() {
    setValues();
    generateSlideshowElm();
    getImages();
}

function setValues() {
    t79Show.slideshowDuration = t79Show.DURATION;
    t79Show.thumbnailsGenerated = false;
}

function generateSlideshowElm() {
    makeElements();
    addElements();
}

function makeElements() {
    makeContainerElm();
    makeThumbnailElm();
    makeInnerContainerElm();
    makeNavigationButtonsElm();
    makeSlideshowControllerButtonsElm();
    makeImageAndImageFramesElm();
}

function addElements() {
    addImageAndImageFramesElm();
    addSlideshowControllerButtonsElm();
    addNavigationButtonsElm();
    addThumbnailElm();
    addInnerContainerElm();
    addContainerElm();
}

function makeContainerElm() {
    t79Show.containerElm = document.createElement("div");
    t79Show.containerElm.id = "slideshow-container";
    t79Show.containerElm.addEventListener("click", goOutOfFullscreen);
    styleContainerElm("initialize");
}

function addContainerElm() {
    document.body.appendChild(t79Show.containerElm);
}

function makeThumbnailElm() {
    makeThumbnailControlElm();
    makeThumbnailControlButtonElm();
    makeThumbnailStripElm();
}

function addThumbnailElm() {
    if (t79Show.THUMBNAIL_STRIP == "auto") {
        t79Show.thumbnailControlElm.appendChild(t79Show.thumbnailControlButtonElm);
        t79Show.containerElm.appendChild(t79Show.thumbnailControlElm);
    }
    if (t79Show.THUMBNAIL_STRIP != "off") {
        t79Show.containerElm.appendChild(t79Show.thumbnailStripElm);
    }
}

function makeThumbnailStripElm() {
    if(t79Show.THUMBNAIL_STRIP != "off") {
        t79Show.thumbnailStripElm = document.createElement("div");
        t79Show.thumbnailStripElm.id = "slideshow-thumbnail-strip";
        styleThumbnailStripElm("initialize");
    }
}

function makeThumbnailControlElm() {
    if (t79Show.THUMBNAIL_STRIP == "auto") {
        t79Show.thumbnailControlElm = document.createElement("div");
        t79Show.thumbnailControlElm.id = "slideshow-thumbnail-control";
        styleThumbnailControlElm("initialize");
    }
}

function makeThumbnailControlButtonElm() {
    if (t79Show.THUMBNAIL_STRIP == "auto") {
        t79Show.thumbnailControlButtonElm = document.createElement("img");
        t79Show.thumbnailControlButtonElm.id = "slideshow-thumbnail-control-button";
        t79Show.thumbnailControlButtonElm.setAttribute("data-thumbnail", "closed");
        t79Show.thumbnailControlButtonElm.src = t79Show.OPEN_THUMBNAIL_STRIP;
        t79Show.thumbnailControlButtonElm.addEventListener("click", (e) => {
            e.stopPropagation();
            if (e.target.getAttribute("data-thumbnail") == "closed") {
                openThumbnailStrip();
                t79Show.thumbnailControlButtonElm.src = t79Show.CLOSE_THUMBNAIL_STRIP;
            }
            else {
                closeThumbnailStrip();
                t79Show.thumbnailControlButtonElm.src = t79Show.OPEN_THUMBNAIL_STRIP;
            }
            
        });
        styleThumbnailControlButtonElm("initialize");
    }
}

function makeInnerContainerElm() {
    t79Show.innerContainerElm = document.createElement("div");
    t79Show.innerContainerElm.id = "slideshow-inner-container";
    styleInnerContainerElm("initialize");
    if(t79Show.THUMBNAIL_STRIP == "on") {
        styleInnerContainerElm("initialize thumb open");
    }
    else if (t79Show.THUMBNAIL_STRIP == "auto") {
        styleInnerContainerElm("initialize thumb closed");
    }
    else {
        styleInnerContainerElm("initialize full");
    }
}

function addInnerContainerElm() {
    t79Show.containerElm.appendChild(t79Show.innerContainerElm);
}

function makeNavigationButtonsElm() {
    if(t79Show.NAVIGATION_CONTROLS == "show") {
        makePreviousImageButtonElm();
        makeNextImageButtonElm();
    }
}

function addNavigationButtonsElm() {
    if(t79Show.NAVIGATION_CONTROLS == "show") {
        t79Show.innerContainerElm.appendChild(t79Show.previousImageButtonElm);
        t79Show.innerContainerElm.appendChild(t79Show.nextImageButtonElm);
    }
}

function makePreviousImageButtonElm() {
    t79Show.previousImageButtonElm = document.createElement("img");
    t79Show.previousImageButtonElm.id = "slideshow-previous-image-button";
    t79Show.previousImageButtonElm.src = t79Show.LEFT_NAVIGATION_ARROW;
    t79Show.previousImageButtonElm.addEventListener("click", (e) => {
        if (e.target.style.opacity == 1) {
            e.stopPropagation();
        }
        goToPreviousImage();
    });
    styleNavigationButtonElm(t79Show.previousImageButtonElm, "initialize");
    styleNavigationButtonElm(t79Show.previousImageButtonElm, "initialize left");
}

function makeNextImageButtonElm() {
    t79Show.nextImageButtonElm = document.createElement("img");
    t79Show.nextImageButtonElm.id = "slideshow-next-image-button";
    t79Show.nextImageButtonElm.src = t79Show.RIGHT_NAVIGATION_ARROW;
    t79Show.nextImageButtonElm.addEventListener("click", (e) => {        
        if (e.target.style.opacity == 1) {
            e.stopPropagation();
        }
        goToNextImage();
    });
    styleNavigationButtonElm(t79Show.nextImageButtonElm, "initialize");
    styleNavigationButtonElm(t79Show.nextImageButtonElm, "initialize right");
}

function makeSlideshowControllerButtonsElm() {
    if (t79Show.SLIDESHOW_CONTROLS == "show") {
        makeSlideshowControllerContainer();
        makeSlideshowPlayPauseButtonElm();
        makeSlideshowTimerContainerElm();
        makeSlideshowIncreaseButtonElm();
        makeSlideshowTimerLabelElm();
        makeSlideshowDecreaseButtonElm();
    }
}

function addSlideshowControllerButtonsElm() {
    if (t79Show.SLIDESHOW_CONTROLS == "show") {
        t79Show.slideshowTimerContainerElm.appendChild(t79Show.slideshowIncreaseButtonElm);
        t79Show.slideshowTimerContainerElm.appendChild(t79Show.slideshowTimerLabelElm);
        t79Show.slideshowTimerContainerElm.appendChild(t79Show.slideshowDecreaseButtonElm);
        t79Show.slideshowControllerContainerElm.appendChild(t79Show.slideshowPlayPauseButtonElm); 
        t79Show.slideshowControllerContainerElm.appendChild(t79Show.slideshowTimerContainerElm);   
        t79Show.innerContainerElm.appendChild(t79Show.slideshowControllerContainerElm);
    }
}

function makeSlideshowControllerContainer() {
    t79Show.slideshowControllerContainerElm = document.createElement("div");
    t79Show.slideshowControllerContainerElm.id = "slideshow-controller-container";
    styleSlideshowControllersContainerElm("initialize");
}

function makeSlideshowPlayPauseButtonElm() {
    t79Show.slideshowPlayPauseButtonElm = document.createElement("img");
    t79Show.slideshowPlayPauseButtonElm.id = "slideshow-play-button";
    t79Show.slideshowPlayPauseButtonElm.src = t79Show.SLIDESHOW_PLAY;
    t79Show.slideshowPlayPauseButtonElm.setAttribute("data-playing", false);
    t79Show.slideshowPlayPauseButtonElm.addEventListener("click", (e) => {
        e.stopPropagation();
        if (e.target.getAttribute("data-playing") == "true") {
            stopSlideshow();
        }
        else {
            runSlideshow();
        }
    });
    styleSliderControllersButtonsElm(t79Show.slideshowPlayPauseButtonElm, "initialize");
}

function makeSlideshowTimerContainerElm() {
    t79Show.slideshowTimerContainerElm = document.createElement("div");
    t79Show.slideshowTimerContainerElm.id = "slideshow-timer-container";
    styleSlideshowTimerContainerElm("initialize");
}

function makeSlideshowIncreaseButtonElm() {
    t79Show.slideshowIncreaseButtonElm = document.createElement("img");
    t79Show.slideshowIncreaseButtonElm.id = "slideshow-increase-button";
    t79Show.slideshowIncreaseButtonElm.src = t79Show.SLIDESHOW_INCREASE;
    t79Show.slideshowIncreaseButtonElm.addEventListener("click", (e) => {
        e.stopPropagation();
        increaseSlideshowDuration()
    });
    styleSliderControllersButtonsElm(t79Show.slideshowIncreaseButtonElm, "initialize");
}

function makeSlideshowDecreaseButtonElm() {
    t79Show.slideshowDecreaseButtonElm = document.createElement("img");
    t79Show.slideshowDecreaseButtonElm.id = "slideshow-decrease-button";
    t79Show.slideshowDecreaseButtonElm.src = t79Show.SLIDESHOW_DECREASE;
    t79Show.slideshowDecreaseButtonElm.addEventListener("click", (e) => {
        e.stopPropagation();
        decreaseSlideshowDuration()
    });
    styleSliderControllersButtonsElm(t79Show.slideshowDecreaseButtonElm, "initialize");
}

function makeSlideshowTimerLabelElm() {
    t79Show.slideshowTimerLabelElm = document.createElement("div");
    t79Show.slideshowTimerLabelElm.id = "slideshow-timer-label";
    t79Show.slideshowTimerLabelElm.innerText = t79Show.slideshowDuration;
    styleSliderControllersButtonsElm(t79Show.slideshowTimerLabelElm, "initialize");
}

function makeImageAndImageFramesElm() {
    makeOuterImageFrameElm();
    makeInnerImageFrameElm();
    makeImageViewElm();
    makeTextViewElm();
}

function addImageAndImageFramesElm() {
    t79Show.innerImageFrameElm.appendChild(t79Show.imageViewElm);
    t79Show.innerImageFrameElm.appendChild(t79Show.textViewElm);
    t79Show.outerImageFrameElm.appendChild(t79Show.innerImageFrameElm);
    t79Show.innerContainerElm.appendChild(t79Show.outerImageFrameElm);
}

function makeOuterImageFrameElm() {
    t79Show.outerImageFrameElm = document.createElement("div");
    t79Show.outerImageFrameElm.id = "slideshow-outer-frame";
    styleOuterFrameElm("initialize");
}

function makeInnerImageFrameElm() {
    t79Show.innerImageFrameElm = document.createElement("div");
    t79Show.innerImageFrameElm.id = "slideshow-inner-frame";
    styleInnerFrameElm("initialize");
}

function makeImageViewElm() {
    t79Show.imageViewElm = document.createElement("img");
    t79Show.imageViewElm.id = "slideshow-image-view";
    styleImageViewElm("initialize");
}

function makeTextViewElm() {
    t79Show.textViewElm = document.createElement("div");
    t79Show.textViewElm.id = "slideshow-text-view";
    styleTextViewElm("initialize"); 
}



//
//
//
//
//
//
//
//
//
//

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
        searchString += "[" + t79Show.GALLERY_TAG_ATTRIBUTE + "] img, " + t79Show.GALLERY_CLASS_NAME + " img, ";
    }
    searchString += "img[" + t79Show.GALLERY_TAG_ATTRIBUTE + "], img." + t79Show.GALLERY_CLASS_NAME;
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
    const images = element.querySelectorAll("img, div.text-slide");
    const imagesArray = Array.from(images);
    return imagesArray;
}

function makeImagesReady(searchResult) {
    let imageCount = 1;
    t79Show.idFirstImage = imageCount;
    var previousImage;
    searchResult.forEach(element => {
        styleSelectedImageElm(element, "initialize");
        element.addEventListener("click", goIntoFullscreen);
        element.setAttribute("data-galleryimageid", imageCount);
        if (previousImage) {
            previousImage.setAttribute("data-nextgalleryimage", imageCount);
            element.setAttribute("data-previousgalleryimage", previousImage.getAttribute("data-galleryimageid"));
        }
        if (element.getAttribute("data-slidetext") != undefined) {
            element.setAttribute("data-slideshown", "none");
        }
        previousImage = element;
        imageCount++;
    });
}

function increaseSlideshowDuration() {
    if (t79Show.slideshowDuration < 99) {
        t79Show.slideshowDuration += 1;
        updateSlideshowDuration();
        if (t79Show.slideshowDuration == 99) {
            t79Show.slideshowIncreaseButtonElm.style.opacity = 0.3;
        }
        t79Show.slideshowDecreaseButtonElm.style.opacity = 1;
    }
    else {
        t79Show.slideshowIncreaseButtonElm.style.opacity = 0.3;
    }
    
}

function decreaseSlideshowDuration() {
    if (t79Show.slideshowDuration > 1) {
        t79Show.slideshowDuration -= 1;
        updateSlideshowDuration();
        if (t79Show.slideshowDuration == 1) {
            t79Show.slideshowDecreaseButtonElm.style.opacity = 0.3;
        }
        t79Show.slideshowIncreaseButtonElm.style.opacity = 1;
    }
    else {
        t79Show.slideshowDecreaseButtonElm.style.opacity = 0.3;
    }
}

function updateSlideshowDuration() {
    t79Show.slideshowTimerLabelElm.innerText = t79Show.slideshowDuration;
    changeSlideshowDuration();
}

function runSlideshow() {
    if (t79Show.slideshowPlayPauseButtonElm.getAttribute("data-playing") == "true") {
        return;
    }
    t79Show.slideshowInterval = window.setInterval(goToNextImage, t79Show.slideshowDuration * 1000);
    t79Show.slideshowRunning = true;
    t79Show.slideshowPlayPauseButtonElm.src = t79Show.SLIDESHOW_PAUSE;
    t79Show.slideshowPlayPauseButtonElm.setAttribute("data-playing", true);
}

function changeSlideshowDuration() {
    if (t79Show.slideshowPlayPauseButtonElm.getAttribute("data-playing") == "false") {
        return;
    }
    window.clearInterval(t79Show.slideshowInterval);
    t79Show.slideshowInterval = window.setInterval(goToNextImage, t79Show.slideshowDuration * 1000);
}

function stopSlideshow() {
    window.clearInterval(t79Show.slideshowInterval);
    t79Show.slideshowRunning = false;
    t79Show.slideshowPlayPauseButtonElm.src = t79Show.SLIDESHOW_PLAY;
    t79Show.slideshowPlayPauseButtonElm.setAttribute("data-playing", false);
}

function goIntoFullscreen(e) {
    if(t79Show.AUTOPLAY == "on") {
        runSlideshow()
    } else {
        t79Show.slideshowRunning = false;
    }

    if (t79Show.THUMBNAIL_STRIP == "on" && t79Show.thumbnailsGenerated == false) {
        makeThumbnailStrip();
        styleThumbnailStripElm("open");
        t79Show.thumbnailsGenerated = true;
    }

    styleContainerElm("goesIntoFullscreen");
    styleSelectedImageElm(this, "goesIntoFullscreen");
    t79Show.selectedImageElm = this;
    t79Show.imageViewElm.src = getImageAddress(this);
    updateNavigationButtons();
    positionImageView();

    t79Show.isInFullscreen = true;

    //t79Show.thumbnailStripElm.scrollTo({top: 300, behavior: 'smooth'})
}

function openThumbnailStrip() {
    t79Show.thumbnailControlButtonElm.setAttribute("data-thumbnail", "open");
    styleInnerContainerElm("initialize thumb open");
    if (t79Show.thumbnailsGenerated == false) {
        makeThumbnailStrip();
        t79Show.thumbnailsGenerated = true;
    }
    styleThumbnailStripElm("open");
    positionImageView();
}

function closeThumbnailStrip() {
    t79Show.thumbnailControlButtonElm.setAttribute("data-thumbnail", "closed");
    styleThumbnailStripElm("close");
    styleInnerContainerElm("initialize thumb closed");
    positionImageView();
}

function makeThumbnailStrip() {

    const container = document.createElement("div");

    let imageElm = document.querySelector("[data-galleryimageid='" + t79Show.idFirstImage + "']");
    let thumbImageElm = document.createElement("img");
    styleThumbnailImg(thumbImageElm, "initialize");
    thumbImageElm.src = imageElm.src;
    thumbImageElm.setAttribute("data-gallerythumbimageid", imageElm.getAttribute("data-galleryimageid"));
    thumbImageElm.addEventListener("click", (e) => {
        e.stopPropagation();
        goToThisImage(e);
    });
    container.appendChild(thumbImageElm);

    container.style.display = "flex";
    container.style.flexFlow = "column nowrap";
    container.style.justifyContent = "flex-start";
    container.style.alignItems = "center";
    container.style.gap = "1em";
    container.style.width = "100%";

    while (imageElm.getAttribute("data-nextgalleryimage") != undefined) {
        imageElm = document.querySelector("[data-galleryimageid='" + imageElm.getAttribute("data-nextgalleryimage") + "']");
        let thumbImageElm = document.createElement("img");
        styleThumbnailImg(thumbImageElm, "initialize");
        thumbImageElm.src = imageElm.src;
        thumbImageElm.setAttribute("data-gallerythumbimageid", imageElm.getAttribute("data-galleryimageid"));
        thumbImageElm.addEventListener("click", (e) => {
            e.stopPropagation();
            goToThisImage(e);
        });
        container.appendChild(thumbImageElm);
        console.log("make strip");
    }

    t79Show.thumbnailStripElm.appendChild(container);
}

function getImageAddress(image) {
    if (image.getAttribute(t79Show.ALT_IMAGE_URL) != undefined) {
        return image.getAttribute(t79Show.ALT_IMAGE_URL);
    }
    else {
        return image.src;
    }
}

function goToPreviousImage() {
    
    var imageElm;
    
    if ((t79Show.selectedImageElm.getAttribute("data-slidetext") == undefined || t79Show.selectedImageElm.getAttribute("data-slideshown") == "none")) {
        const previousImageId = t79Show.selectedImageElm.getAttribute("data-previousgalleryimage");
        if (previousImageId == undefined) {
            return;
        }
        imageElm = document.querySelector("[data-galleryimageid='" + previousImageId + "']");
    } else {
        imageElm = t79Show.selectedImageElm;
    }
    
    if (imageElm.getAttribute("data-slidetext") != undefined && imageElm.getAttribute("data-slideshown") == "none") {
        t79Show.textViewElm.innerHTML = imageElm.getAttribute("data-slidetext");
        t79Show.imageViewElm.style.display = "none";
        t79Show.textViewElm.style.display = "flex";
        changeSelectedImage(imageElm);
        imageElm.setAttribute("data-slideshown", "text");
        console.log("printet text: " + imageElm.getAttribute("data-galleryimageid"));
    }
    else {
        t79Show.imageViewElm.src = getImageAddress(imageElm);
        t79Show.imageViewElm.style.display = "block";
        t79Show.textViewElm.style.display = "none";
        if (imageElm.getAttribute("data-slideshown") != undefined) {
            imageElm.setAttribute("data-slideshown", "none");
        }
        imageElm.setAttribute("data-slideshown", "none")
        console.log("shown image: " + imageElm.getAttribute("data-galleryimageid"));

    }

    if (imageElm.getAttribute("data-slidetext") == undefined) {
        changeSelectedImage(imageElm);
    }

    updateNavigationButtons();
    positionImageView();
}

function goToThisImage(e) {
    const imageElm = document.querySelector("[data-galleryimageid='" + e.target.getAttribute("data-gallerythumbimageid") + "']");
    
    changeSelectedImage(imageElm);
    t79Show.imageViewElm.src = getImageAddress(imageElm);


    updateNavigationButtons();
    positionImageView();
}

function goToNextImage() {

    var imageElm;
    
    if ((t79Show.selectedImageElm.getAttribute("data-slidetext") == undefined || t79Show.selectedImageElm.getAttribute("data-slideshown") == "none")) {
        var nextImageId = t79Show.selectedImageElm.getAttribute("data-nextgalleryimage");
        if (nextImageId == undefined) {
            if (t79Show.slideshowRunning) {
                if (t79Show.LOOP == "on") {
                    nextImageId = t79Show.idFirstImage;
                }
                else {
                    stopSlideshow();
                    return;
                }
            }
            else {
                return;
            }
        }
        imageElm = document.querySelector("[data-galleryimageid='" + nextImageId + "']");
    } else {
        imageElm = t79Show.selectedImageElm;
    }

    if (imageElm.getAttribute("data-slidetext") != undefined && imageElm.getAttribute("data-slideshown") == "none") {
        t79Show.textViewElm.innerHTML = imageElm.getAttribute("data-slidetext");
        t79Show.imageViewElm.style.display = "none";
        t79Show.textViewElm.style.display = "flex";
        changeSelectedImage(imageElm);
        imageElm.setAttribute("data-slideshown", "text");
    }
    else {
        
        t79Show.imageViewElm.src = getImageAddress(imageElm);
        t79Show.imageViewElm.style.display = "block";
        t79Show.textViewElm.style.display = "none";
        t79Show.numViews = 0;
        imageElm.setAttribute("data-slideshown", "none");
    }

    if (imageElm.getAttribute("data-slidetext") == undefined) {
        changeSelectedImage(imageElm);
    }



    //const nextThumbImageElm = document.querySelector("[data-gallerythumbimageid='" + nextImageId + "']");

    updateNavigationButtons();
    positionImageView();

    //t79Show.thumbnailStripElm.scrollTo({top: nextThumbImageElm.getBoundingClientRect().top, behavior: 'smooth'})
}

function positionImageView() {

    let imageWidth = 1;
    let imageHeight = 1;

    const isImageView = t79Show.numViews != 1;

    if (isImageView && t79Show.selectedImageElm.getAttribute(t79Show.ALT_IMAGE_SIZE) != undefined) {
        var width;
        var height;
        [width, height] = t79Show.selectedImageElm.getAttribute(t79Show.ALT_IMAGE_SIZE).split("x");
        imageWidth = parseInt(width);
        imageHeight = parseInt(height);
    }
    else if (isImageView) {
        imageWidth = t79Show.selectedImageElm.getAttribute("width");
        imageHeight = t79Show.selectedImageElm.getAttribute("height");
    }
    else {
        imageWidth = t79Show.outerImageFrameElm.clientWidth;
        imageHeight = t79Show.outerImageFrameElm.clientHeight;
    }
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

    if (t79Show.NAVIGATION_CONTROLS == "show" || t79Show.SLIDESHOW_CONTROLS == "show") {

        let thumbnailStripRight = 0;
        if (t79Show.THUMBNAIL_STRIP != "off") {
            thumbnailStripRight = t79Show.thumbnailStripElm.getBoundingClientRect().right;
        }
        var navigationButLeftRect;
        if (t79Show.NAVIGATION_CONTROLS == "show") {
            navigationButLeftRect = t79Show.previousImageButtonElm.getBoundingClientRect();
        }
        else {
            navigationButLeftRect = t79Show.slideshowControllerContainerElm.getBoundingClientRect();
        }

        var imageViewRect = t79Show.innerImageFrameElm.getBoundingClientRect();
        
        const margin = imageViewRect.x - thumbnailStripRight;
        const caretWidth = navigationButLeftRect.right - navigationButLeftRect.x;
        const marginMinusCaret = margin - caretWidth;
        const halfMargin = marginMinusCaret * 0.4;
    
        if (t79Show.NAVIGATION_CONTROLS == "show") {
            t79Show.previousImageButtonElm.style.left = "calc(" + halfMargin + "px + 1em)";
            t79Show.nextImageButtonElm.style.right = "calc(" + halfMargin + "px + 1.2em)";
        }
        if (t79Show.SLIDESHOW_CONTROLS == "show") {
            t79Show.slideshowControllerContainerElm.style.left = "calc(" + halfMargin + "px + 1em)";
        }

        if (isImageView ) {
            styleImageViewElmClipPath(imageWidth, imageHeight, outerFrameWidth);
        }
    }
}

function goOutOfFullscreen(e) {
    t79Show.isInFullscreen = false;
    styleContainerElm("goesOutOfFullscreen");
    styleSelectedImageElm(t79Show.selectedImageElm, "comesOutOfFullscreen");
    t79Show.selectedImageElm = undefined;
    if (t79Show.slideshowRunning) {
        stopSlideshow();
    }
}

function changeSelectedImage(imageElm) {
    if (t79Show.selectedImageElm) {
        styleSelectedImageElm(t79Show.selectedImageElm, "areDeselected");
    }
    t79Show.selectedImageElm = imageElm;
    styleSelectedImageElm(imageElm, "becomingSelected");
}

function updateNavigationButtons() {
    if (t79Show.NAVIGATION_CONTROLS == "show") {
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
}

//
//
//
//
//
//
//
//
//
//
//
//

function styleContainerElm(state) {
    switch (state) {
        case "initialize":
            t79Show.containerElm.style.backgroundColor = t79Show.BACKGROUND_COLOR;
            t79Show.containerElm.style.position = "fixed";
            t79Show.containerElm.style.top = 0;
            t79Show.containerElm.style.left = 0;
            t79Show.containerElm.style.width = "100vw";
            t79Show.containerElm.style.height = "100vh";
            t79Show.containerElm.style.fontSize = t79Show.BASE_FONT_SIZE;
            t79Show.containerElm.style.display = "none";
            t79Show.containerElm.style.flexFlow = "row nowrap";
            t79Show.containerElm.style.justifyContent = "space-between";
            t79Show.containerElm.style.alignItems = "center";
            t79Show.containerElm.style.boxSizing = "border-box";
            t79Show.containerElm.style.overflow = "hidden";
            t79Show.containerElm.style.cursor = "zoom-out";
            t79Show.containerElm.style.webkitBackdropFilter = `blur(${t79Show.BACKGROUND_BLUR})`;
            t79Show.containerElm.style.backdropFilter = `blur(${t79Show.BACKGROUND_BLUR})`;
            break;
        case "goesIntoFullscreen":
            t79Show.containerElm.style.display = "flex";
            break;
        case "goesOutOfFullscreen":
            t79Show.containerElm.style.display = "none";
    }
}

function styleThumbnailControlElm(state) {
    switch (state) {
        case "initialize":
            t79Show.thumbnailControlElm.style.display = "flex";
            t79Show.thumbnailControlElm.style.flexFlow = "column nowrap";
            t79Show.thumbnailControlElm.style.justifyContent = "flex-end";
            t79Show.thumbnailControlElm.style.alignItems = "center";
            t79Show.thumbnailControlElm.style.width = "2em";
            t79Show.thumbnailControlElm.style.height = "calc(100% - 3em)";
            t79Show.thumbnailControlElm.style.padding = "1.5em 0em 1.5em 1em";
    }
}

function styleThumbnailControlButtonElm(state) {
    switch (state) {
        case "initialize":
            t79Show.thumbnailControlButtonElm.style.width = "100%";
            t79Show.thumbnailControlButtonElm.style.height = "auto";
            t79Show.thumbnailControlButtonElm.style.cursor = "pointer";
    }
}

function styleThumbnailStripElm(state) {
    switch (state) {
        case "initialize":
            t79Show.thumbnailStripElm.style.display = "none";
            t79Show.thumbnailStripElm.style.width = "20em";
            t79Show.thumbnailStripElm.style.height = "100vh";
            t79Show.thumbnailStripElm.style.padding = "2em";
            t79Show.thumbnailStripElm.style.overflow = "scroll";
            t79Show.thumbnailStripElm.style.msOverflowStyle = "none";
            t79Show.thumbnailStripElm.style.scrollbarWidth = "none";
            turnOffThumbnailStripScrollBar();
            break;
        case "open":
            t79Show.thumbnailStripElm.style.display = "block";
            break;
        case "close":
            t79Show.thumbnailStripElm.style.display = "none";
    }
}

function turnOffThumbnailStripScrollBar() {
    var styleElement = document.createElement("style");
    styleElement.appendChild(document.createTextNode("#slideshow-thumbnail-strip::-webkit-scrollbar {-webkit-appearance: none; display: none;}"));
    styleElement.appendChild(document.createTextNode(".text-slide {display: none;}"));
    document.getElementsByTagName("head")[0].appendChild(styleElement);
}

function styleThumbnailImg(thumbImg, state) {
    switch (state) {
        case "initialize":
            thumbImg.style.width = "100%";
            thumbImg.style.height = "auto";
            thumbImg.style.cursor = "pointer";
    }
}

function styleInnerContainerElm(state) {
    switch (state) {
        case "initialize":
            t79Show.innerContainerElm.style.height = "100%";
            t79Show.innerContainerElm.style.display = "flex";
            t79Show.innerContainerElm.style.flexFlow = "column nowrap";
            t79Show.innerContainerElm.style.justifyContent = "center";
            t79Show.innerContainerElm.style.alignItems = "center";
            t79Show.innerContainerElm.style.position = "relative";
            t79Show.innerContainerElm.style.padding = t79Show.IMAGE_PADDING;
            break;
        case "initialize thumb open":
            t79Show.innerContainerElm.style.width = "calc(100% - 22em)";
            break;
        case "initialize thumb closed":
            t79Show.innerContainerElm.style.width = "calc(100% - 3em)";
            break;
        case "initialize full":
            t79Show.innerContainerElm.style.width = "100%";
    }
}

function styleSlideshowControllersContainerElm(state) {
    switch (state) {
        case "initialize":
            t79Show.slideshowControllerContainerElm.style.position = "absolute";
            //t79Show.slideshowControllerContainerElm.style.left = "1em";
            t79Show.slideshowControllerContainerElm.style.bottom = "calc(50% + 5em)";
            t79Show.slideshowControllerContainerElm.style.display = "flex";
            t79Show.slideshowControllerContainerElm.style.flexFlow = "column nowrap";
            t79Show.slideshowControllerContainerElm.style.justifyContent = "flex-start";
            t79Show.slideshowControllerContainerElm.style.alignItems = "center";
            t79Show.slideshowControllerContainerElm.style.gap = "1em";

    }
}

function styleSlideshowTimerContainerElm(state) {
    switch (state) {
        case "initialize":
            t79Show.slideshowTimerContainerElm.style.display = "flex";
            t79Show.slideshowTimerContainerElm.style.flexFlow = "column nowrap";
            t79Show.slideshowTimerContainerElm.style.justifyContent = "center";
            t79Show.slideshowTimerContainerElm.style.alignItems = "center";
    }
}

function styleSliderControllersButtonsElm(buttonElm, state) {
    switch (state) {
        case "initialize":
            buttonElm.style.width = "auto";
            buttonElm.style.height = "1.3em";
            buttonElm.style.cursor = "pointer";
    }
}

function styleNavigationButtonElm(buttonElm, state) {
    switch (state) {
        case "initialize":
            buttonElm.style.width = "auto";
            buttonElm.style.height = "3em";
            buttonElm.style.position = "absolute";
            buttonElm.style.bottom = "calc(50% - 1.5em)";
            buttonElm.style.cursor = "pointer";
            break;
        case "initialize left":
            buttonElm.style.left = "1em";
            break;
        case "initialize right":
            buttonElm.style.right = "1.2em";
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
            t79Show.outerImageFrameElm.style.position = "relative";
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

function styleTextViewElm(state) {
    switch (state) {
        case "initialize":
            t79Show.textViewElm.style.width = "100%";
            t79Show.textViewElm.style.height = "100%";
            t79Show.textViewElm.style.display = "none";
            t79Show.textViewElm.style.flexFlow = "column nowrap";
            t79Show.textViewElm.style.justifyContent = "center";
            t79Show.textViewElm.style.alignItems = "center";
            t79Show.textViewElm.style.fontSize = "2.2em";
            t79Show.textViewElm.style.textAlign = "center";
            break;
    }
}

function styleImageViewElmClipPath(imageWidth, imageHeight, outerFrameWidth) {
    if (imageWidth < outerFrameWidth - 300 || 
        (t79Show.NAVIGATION_CONTROLS == "hide" && t79Show.SLIDESHOW_CONTROLS == "hide")) {
        t79Show.imageViewElm.style.clipPath = "none";
        return;
    }

    var showControllerRect;
    var navigationButLeftRect;
    var navigationButRightRect;

    let showControlRightDistance = 0;
    let navigationRightDistance = 0;

    if (t79Show.SLIDESHOW_CONTROLS == "show") {
        showControllerRect = t79Show.slideshowControllerContainerElm.getBoundingClientRect();
        showControlRightDistance = showControllerRect.right;
    }
    if (t79Show.NAVIGATION_CONTROLS == "show") {
        navigationButLeftRect = t79Show.previousImageButtonElm.getBoundingClientRect();
        navigationButRightRect = t79Show.nextImageButtonElm.getBoundingClientRect();
        navigationRightDistance = navigationButLeftRect.right;
    }
    const imageViewRect = t79Show.imageViewElm.getBoundingClientRect();

    if (Math.max(showControlRightDistance, navigationRightDistance) < imageViewRect.x - 20) {
        t79Show.imageViewElm.style.clipPath = "none";
        return;
    }

    const iW = imageViewRect.right - imageViewRect.x;
    const iH = imageViewRect.bottom - imageViewRect.y;
    const iL = imageViewRect.x;
    const iR = imageViewRect.right;

    let scT = 0;
    let scB = 0;
    let scR = 0;

    if (t79Show.SLIDESHOW_CONTROLS == "show") {
        scT = showControllerRect.y - imageViewRect.y - 15;
        scB = showControllerRect.bottom - imageViewRect.y + 10;
        scR = showControllerRect.right;
    }

    let nlT = 0;
    let nlB = 0;
    let nlR = 0;

    let nrT = 0;
    let nrB = 0;
    let nrL = 0;

    if (t79Show.NAVIGATION_CONTROLS == "show") {
        nlT = navigationButLeftRect.y - imageViewRect.y - 15;
        nlB = navigationButLeftRect.bottom - imageViewRect.y + 15;
        nlR = navigationButLeftRect.right;
    
        nrT = navigationButRightRect.y - imageViewRect.y - 15;
        nrB = navigationButRightRect.bottom - imageViewRect.y + 15;
        nrL = navigationButRightRect.x;
    }

    const c = 3;

    const p0 = 'M0,0';
    const p5 = 'L0,' + iH;
    const p6 = 'L' + iW + ',' + iH;
    const p7 = 'L' + iW + ',0';

    let depth = 0;

    let path1 = '';
    if (t79Show.SLIDESHOW_CONTROLS == "show") {
        depth = scR - iL + 10;
    }
    if (depth > 0 && t79Show.SLIDESHOW_CONTROLS == "show") {
        const p1a = 'L0,' + (scT - c);
        const p1b = 'Q0,' + scT;
        const p1c = '' + c + ',' + scT;
        const p2a = 'L' + (depth - c) + ',' + scT;
        const p2b = 'Q' + depth + ',' + scT;
        const p2c = '' + depth + ',' + (scT + c);
        const p3a = 'L' + depth + ',' + (scB - c);
        const p3b = 'Q' + depth + ',' + scB;
        const p3c = '' + (depth - c) + ',' + scB;
        const p4a = 'L' + c + ',' + scB;
        const p4b = 'Q0,' + scB;
        const p4c = '0,' + (scB + c)

        path1 = p1a + ' ' + p1b + ' ' + p1c + ' ' + p2a + ' ' + p2b + ' ' + p2c + ' ' + p3a + ' ' + p3b + ' ' + p3c + ' ' + p4a + ' ' + p4b + ' ' + p4c;

    }

    let path2 = '';
    depth = 0;
    if (t79Show.NAVIGATION_CONTROLS == "show") {
        depth = nlR - iL + 15;
    }
    if (depth > 0 && t79Show.NAVIGATION_CONTROLS == "show" && t79Show.previousImageButtonElm.style.opacity > 0) {
        const p5a = 'L0,' + (nlT - c);
        const p5b = 'Q0,' + nlT;
        const p5c = '' + c + ',' + nlT;
        const p6a = 'L' + (depth - c) + ',' + nlT;
        const p6b = 'Q' + depth + ',' + nlT;
        const p6c = '' + depth + ',' + (nlT + c);
        const p7a = 'L' + depth + ',' + (nlB - c);
        const p7b = 'Q' + depth + ',' + nlB;
        const p7c = '' + (depth - c) + ',' + nlB;
        const p8a = 'L' + c + ',' + nlB;
        const p8b = 'Q0,' + nlB;
        const p8c = '0,' + (nlB + c);

        path2 = p5a + ' ' + p5b + ' ' + p5c + ' ' + p6a + ' ' + p6b + ' ' + p6c + ' ' + p7a + ' ' + p7b + ' ' + p7c + ' ' + p8a + ' ' + p8b + ' ' + p8c;
    }

    let path3 = '';
    depth = 0;
    if (t79Show.NAVIGATION_CONTROLS == "show") {
        depth = iR - nrL + 15; 
    }
    if (depth > 0 && t79Show.NAVIGATION_CONTROLS == "show" && t79Show.nextImageButtonElm.style.opacity > 0) {
        const p9a = 'L' + iW + ',' + (nrB + c);
        const p9b = 'Q' + iW + ',' + nrB;
        const p9c = '' + (iW - c) + ',' + nrB;
        const p10a = 'L' + (iW - depth + c) + ',' + nrB;
        const p10b = 'Q' + (iW - depth) + ',' + nrB;
        const p10c = '' + (iW - depth) + ',' + (nrB - c);
        const p11a = 'L' + (iW - depth) + ',' + (nrT + c);
        const p11b = 'Q' + (iW - depth) + ',' + nrT;
        const p11c = '' + (iW - depth + c) + ',' + nrT;
        const p12a = 'L' + (iW - c) + ',' + nrT;
        const p12b = 'Q' + iW + ',' + nrT;
        const p12c = '' + iW + ',' + (nrT - c);

        path3 = p9a + ' ' + p9b + ' ' + p9c + ' ' + p10a + ' ' + p10b + ' ' + p10c + ' ' + p11a + ' ' + p11b + ' ' + p11c + ' ' + p12a + ' ' + p12b + ' ' + p12c;
    }

    const path = "'" + p0 + ' ' + path1 + ' ' + path2 + ' ' + p5 + ' ' + p6 + ' ' + path3 + p7 + " Z'";

    t79Show.imageViewElm.style.clipPath = 'path(' + path + ')';
}



export { slideshowInit };