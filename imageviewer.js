/**
 *  IMAGE VIEWER - js
 *  a fullscreen image viewer in pure javascript
 *  no dependencies
 *  ==================
 * 
 *  license: MIT
 *  Copyright (c) 2024 Terje Urnes
 * 
 *  version: v1.0.
 */


/**
 * IMAGE VIEWER
 * Main class.
 */
export class ImageViewer {

    static Instance;
    
    _config = {

    }

    _container;
    _imageFrame;

    constructor(config = {}) {

        Object.keys(config).forEach(key => {
            if (key.toUpperCase() in this._config) {
                this._config[key.toUpperCase()] = config[key];
            }
        })
        ImageViewer.Instance = this;
        this.ImageViewerInit(config); 
    }

    ImageViewerInit(config) {
        this.SetResizeEventListener();
        this.MakeImagesReady(config);
        this.MakeFullScreenViewElements(config);
    }

    GoIntoFullScreenView(image) {
        this._imageFrame.Image = image;
        this._container.Visible = true;
    }

    GoOutOfFullScreenView() {
        this._container.Visible = false;
    }

    GoToPreviousImage() {
        this._imageFrame.GoToPreviousImage();
    }

    GoToNextImage() {
        this._imageFrame.GoToNextImage();
    }

    RepositionImage() {
        this._imageFrame.RepositionImage();
    }

    SetResizeEventListener() {
        window.addEventListener('resize', function() {
            ImageViewer.Instance.RepositionImage();
        });
    }

    MakeFullScreenViewElements(config) {
        this._container = new ImageViewContainer(config);
        this._imageFrame = new ImageViewFrame(this._container, config);
    }

    MakeImagesReady(config) {
        let ic = new ImageCollection(config);
    }
}


/**
 * IMAGE VIEW FRAME
 */
class ImageViewFrame {

    _config = {
        
    }

    _viewElements;

    set Image(image) {
        this._viewElements.Image = image;
    }
    
    constructor(container, config) {
        this._container = container;
        Object.keys(config).forEach(key => {
            if (key.toUpperCase() in this._config) {
                this._config[key.toUpperCase()] = config[key];
            }
        })
        this._viewElements = new ImageViewElements(container, config);
        this.Initialize()
    }

    Initialize() {
        
    }

    GoToPreviousImage() {
        const previousImageId = this._viewElements.Image.getAttribute("data-previousgalleryimage");
        if (previousImageId == undefined) {
            return;
        }
        const previousImage = document.querySelector("[data-galleryimageid='" + previousImageId + "']");
        this._viewElements.Image = previousImage;
    }

    GoToNextImage() {
        const nextImageId = this._viewElements.Image.getAttribute("data-nextgalleryimage");
        if (nextImageId == undefined) {
            return;
        }
        const nextImage = document.querySelector("[data-galleryimageid='" + nextImageId + "']");
        this._viewElements.Image = nextImage;
    }

    RepositionImage() {

        const imageScreen = this._viewElements.ImageScreen;
        const frame = this._viewElements.OuterFrame;

        let imageWidth = imageScreen.naturalWidth;
        let imageHeight = imageScreen.naturalHeight;
        const imageRatio = imageWidth / imageHeight;

        const outerFrameWidth = frame.clientWidth;
        const outerFrameHeight = frame.clientHeight;
        const outerFrameRatio =  outerFrameWidth / outerFrameHeight;

        if (imageWidth < outerFrameWidth && imageHeight < outerFrameHeight) {
            this._viewElements.SetImageSize(imageWidth, imageHeight);
        }
        else if (imageRatio > outerFrameRatio) {
            this._viewElements.SetImageSize(outerFrameWidth, outerFrameWidth / imageRatio);
        } else {
            this._viewElements.SetImageSize(outerFrameHeight * imageRatio, outerFrameHeight);
        }

        this._viewElements.StyleImageClipPath();
    }

   
}


/**
 * IMAGE VIEW ELEMENTS
 */
class ImageViewElements {
    
    _config = {
        ALT_IMAGE_URL : "data-galleryimage",
        NAVIGATION_CONTROLS: "visible",
        NAVIGATION_CONTROLS_MARGIN: 10,
        NAVIGATION_CONTROL_IMAGE_CLIPPING: true,
        IMAGE_CORNER_RADIUS: "5px",

        LEFT_NAVIGATION_ARROW : "icons/caret-left-solid.svg",
        RIGHT_NAVIGATION_ARROW : "icons/caret-right-solid.svg",
    }

    _container;
    _outerFrame;
    _innerFrame;
    _imageScreen;

    _previousButton;
    _nextButton;

    _image;

    set Image(image) {
        this._image = image;
        let imageSrc = this._image.getAttribute(this._config.ALT_IMAGE_URL);
        if (imageSrc == undefined) {
            imageSrc = this._image.src;
        }
        this._imageScreen.src = imageSrc;
    }

    get Image() { return this._image; }
    get ImageScreen() { return this._imageScreen; }
    get InnerFrame() { return this._innerFrame; }
    get OuterFrame() { return this._outerFrame; }

    constructor(container, config) {
        Object.keys(config).forEach(key => {
            if (key.toUpperCase() in this._config) {
                this._config[key.toUpperCase()] = config[key];
            }
        })
        this._container = container;
        this.Initialize();
        
    }

    SetImageSize(width, height) {

        if (typeof width === "string") {
            this._innerFrame.style.width = width;
        }
        else {
            this._innerFrame.style.width = width + "px";
        }

        if (typeof height === "string") {
            this._innerFrame.style.height = height;
        }
        else {
            this._innerFrame.style.height = height + "px";
        }
    }

    Initialize() {
        this.MakeOuterImageFrame();
        this.MakeInnerImageFrame();
        this.MakeImageScreen();
        this.MakeNavigationButtons();

    }

    MakeOuterImageFrame() {
        this._outerFrame = document.createElement("div");
        this._outerFrame.id = "image-viewer-outer-frame";
        this.StyleOuterImageFrame("initialize");
        this._container.ImageContainer.appendChild(this._outerFrame);
    }

    MakeInnerImageFrame() {
        this._innerFrame = document.createElement("div");
        this._innerFrame.id = "image-viewer-inner-frame";
        this.StyleInnerImageFrame("initialize");
        this._outerFrame.appendChild(this._innerFrame);
    }

    MakeImageScreen() {
        this._imageScreen = document.createElement("img");
        this._imageScreen.id = "image-viewer-image-screen";
        this._imageScreen.addEventListener("load", () => {
            this.SetNavigationButtonsVisibility()
            ImageViewer.Instance.RepositionImage();
        });
        this._innerFrame.appendChild(this._imageScreen);
        this.StyleImageScreen("initialize");
    }

    MakeNavigationButtons() {
        this.MakePreviousButton();
        this.MakeNextButton();
    }

    MakePreviousButton() {
        this._previousButton = this.MakeNavigationButton();
        this._previousButton.id = "image-viewer-previous-button";
        this._previousButton.src = this._config.LEFT_NAVIGATION_ARROW;
        this._previousButton.addEventListener("click", (e) => {
            if (e.target.style.opacity > 0.8) {
                e.stopPropagation();
            }
            ImageViewer.Instance.GoToPreviousImage();
        });
        this.StyleNavigationButton(this._previousButton, "initialize left");
    }

    MakeNextButton() {
        this._nextButton = this.MakeNavigationButton();
        this._nextButton.id = "image-viewer-next-button";
        this._nextButton.src = this._config.RIGHT_NAVIGATION_ARROW;
        this._nextButton.addEventListener("click", (e) => {
            if (e.target.style.opacity > 0.8) {
                e.stopPropagation();
            }
            ImageViewer.Instance.GoToNextImage();
        });
        this.StyleNavigationButton(this._nextButton, "initialize right");
    }

    MakeNavigationButton() {
        let button = document.createElement("img");
        this.StyleNavigationButton(button, "initialize");
        this._outerFrame.appendChild(button);
        return button;
    }

    SetNavigationButtonsVisibility() {
        if (this._image.getAttribute("data-nextgalleryimage") == undefined) {
            this.StyleNavigationButton(this._nextButton, "hide");
        }
        else {
            this.StyleNavigationButton(this._nextButton, "show");
        }
        if (this._image.getAttribute("data-previousgalleryimage") == undefined) {
            this.StyleNavigationButton(this._previousButton, "hide");
        }
        else {
            this.StyleNavigationButton(this._previousButton, "show");
        }
    }

    StyleOuterImageFrame(state) {
        switch(state) {
            case "initialize":
                this._outerFrame.style.width = "100%";
                this._outerFrame.style.height = "100%";
                this._outerFrame.style.display = "flex";
                this._outerFrame.style.flexFlow = "row nowrap";
                this._outerFrame.style.justifyContent = "center";
                this._outerFrame.style.alignItems = "center";
                this._outerFrame.style.position = "relative";
                break;
        }
    }

    StyleInnerImageFrame(state) {
        switch(state) {
            case "initialize":
                this._innerFrame.style.width = "100%";
                this._innerFrame.style.height = "100%";
                this._innerFrame.style.display = "flex";
                this._innerFrame.style.flexFlow = "row nowrap";
                this._innerFrame.style.justifyContent = "center";
                this._innerFrame.style.alignItems = "center";
                break;
        }
    }

    StyleImageScreen(state) {
        switch(state) {
            case "initialize":
                this._imageScreen.style.maxWidth = "100%";
                this._imageScreen.style.maxHeight = "100%";
                this._imageScreen.style.borderRadius = this._config.IMAGE_CORNER_RADIUS;
                this._imageScreen.style.backgroundColor = "transparent";
                break;
        }
    }

    StyleNavigationButton(button, state) {
        switch(state) {
            case "initialize":
                button.style.position = "absolute";
                button.style.width = "auto";
                button.style.height = "3em";
                button.style.bottom = "calc(50% - 1.5em)";
                button.style.cursor = "pointer";
                button.style.opacity = 1;
                break;
            case "initialize left":
                button.style.left = "0.5em";
            case "initialize right":
                button.style.right = "1.2em";
            case "show":
                button.style.opacity = 1;
                button.style.cursor = "pointer";
                break;
            case "hide":
                button.style.opacity = 0;
                button.style.cursor = "default";
                break;
        }
    }

    StyleImageClipPath() {

        if (this._config.NAVIGATION_CONTROL_IMAGE_CLIPPING == false
                        || this._config.NAVIGATION_CONTROLS == "hidden") {
            this._imageScreen.style.clipPath = "none";
            return;
        }

        const imageScreenRect = this._imageScreen.getBoundingClientRect();
        const previousButtonRect = this._previousButton.getBoundingClientRect();
        const nextButtonRect = this._nextButton.getBoundingClientRect();

        const imageWidth = imageScreenRect.right - imageScreenRect.x;
        const imageHeight = imageScreenRect.bottom - imageScreenRect.y;
        const imageLeft = imageScreenRect.x;
        const imageRight = imageScreenRect.right;

        const cornerTopLeft = "M0,0";
        const cornerTopRight = `L${imageWidth},0`;
        const cornerBottomLeft = `L0,${imageHeight}`;
        const cornerBottomRight = `L${imageWidth},${imageHeight}`;

        const cornerRadius = 5;

        let leftNavClipPath = "";
        let rightNavClipPath = "";

        if (this._image.getAttribute("data-previousgalleryimage") != undefined) {
            const leftNavClipTop = previousButtonRect.y - imageScreenRect.y - this._config.NAVIGATION_CONTROLS_MARGIN;
            const leftNavClipRight = previousButtonRect.right + this._config.NAVIGATION_CONTROLS_MARGIN;
            const leftNavClipBottom = previousButtonRect.bottom - imageScreenRect.y + this._config.NAVIGATION_CONTROLS_MARGIN;

            const leftNavDepth = leftNavClipRight - imageLeft;

            if (leftNavDepth > 0) {
                const path = [];
                path.push(`L0,${leftNavClipTop - cornerRadius}`);
                path.push(`Q0,${leftNavClipTop}`);
                path.push(`${cornerRadius},${leftNavClipTop}`);
                path.push(`L${leftNavDepth - cornerRadius},${leftNavClipTop}`);
                path.push(`Q${leftNavDepth},${leftNavClipTop}`);
                path.push(`${leftNavDepth},${leftNavClipTop + cornerRadius}`);
                path.push(`L${leftNavDepth},${leftNavClipBottom - cornerRadius}`);
                path.push(`Q${leftNavDepth}, ${leftNavClipBottom}`);
                path.push(`${leftNavDepth - cornerRadius}, ${leftNavClipBottom}`);
                path.push(`L${cornerRadius}, ${leftNavClipBottom}`);
                path.push(`Q0, ${leftNavClipBottom}`);
                path.push(`0, ${leftNavClipBottom + cornerRadius}`);
                for (let i = 0; i < path.length; i++) {
                    leftNavClipPath += path[i];
                    if (i < path.length - 1) {
                        leftNavClipPath += " ";
                    }
                }
            }
        }

        if (this._image.getAttribute("data-nextgalleryimage") != undefined) {
            const rightNavClipTop = nextButtonRect.y - imageScreenRect.y - this._config.NAVIGATION_CONTROLS_MARGIN;
            const rightNavClipLeft = nextButtonRect.x - this._config.NAVIGATION_CONTROLS_MARGIN;
            const rightNavClipBottom = nextButtonRect.bottom - imageScreenRect.y + this._config.NAVIGATION_CONTROLS_MARGIN;

            const rightNavDepth = imageRight - rightNavClipLeft;
            console.log(rightNavDepth);

            if (rightNavDepth > 0) {
                const path = [];
                path.push(`L${imageWidth}, ${rightNavClipBottom - cornerRadius}`);
                path.push(`Q${imageWidth}, ${rightNavClipBottom}`);
                path.push(`${imageWidth - cornerRadius}, ${rightNavClipBottom}`);
                path.push(`L${imageWidth - rightNavDepth + cornerRadius}, ${rightNavClipBottom}`);
                path.push(`Q${imageWidth - rightNavDepth}, ${rightNavClipBottom}`);
                path.push(`${imageWidth - rightNavDepth}, ${rightNavClipBottom - cornerRadius}`);
                path.push(`L${imageWidth - rightNavDepth}, ${rightNavClipTop + cornerRadius}`);
                path.push(`Q${imageWidth - rightNavDepth}, ${rightNavClipTop}`);
                path.push(`${imageWidth - rightNavDepth + cornerRadius}, ${rightNavClipTop}`);
                path.push(`L${imageWidth - cornerRadius}, ${rightNavClipTop}`);
                path.push(`Q${imageWidth}, ${rightNavClipTop}`);
                path.push(`${imageWidth}, ${rightNavClipTop - cornerRadius}`);
                for (let i = 0; i < path.length; i++) {
                    rightNavClipPath += path[i];
                    if (i < path.length - 1) {
                        rightNavClipPath += " ";
                    }
                }
            }
        }

        const clipPath = `${cornerTopLeft} ${leftNavClipPath} ${cornerBottomLeft} ${cornerBottomRight} ${rightNavClipPath} ${cornerTopRight} Z`;
        this._imageScreen.style.clipPath = `path('${clipPath}')`;
    }
}


/**
 * 
 */
class ImageViewThumbnails {
    
    _container;

    constructor(container) {
        this._container = container;
    }
}


/**
 * 
 */
class ImageViewContainer {

    _containerElm;
    _imageContainerElm;
    _thumbnailContainerElm;
    
    _config = {
        THUMBNAIL_STRIP: "auto",
        THUMBNAIL_STRIP_WIDTH: "20em",
        BACKGROUND_COLOR: "#00000099",
        BACKGROUND_BLUR: "15px",
        BASE_FONT_SIZE: "14px",
        IMAGE_MARGIN: "2em 3em"
        
    }

    get Container() { return this._containerElm; }
    get ImageContainer() { return this._imageContainerElm; }
    get ThumbnailContainer() { return this._thumbnailContainerElm; }

    set Visible(visible) { 
        visible ? this.StyleContainerElm("visible true") : 
                    this.StyleContainerElm("visible false");
    }

    constructor(config) {
        Object.keys(config).forEach(key => {
            if (key.toUpperCase() in this._config) {
                this._config[key.toUpperCase()] = config[key];
            }
        })
        this.Initialize();
    }

    Initialize() {
        this.MakeContainer();
        this.MakeThumbnailContainer();
        this.MakeImageContainer();
    }

    MakeContainer() {
        const container = document.createElement('div');
        container.id = 'image-viewer-container';
        container.addEventListener('click', () => {
            ImageViewer.Instance.GoOutOfFullScreenView();
        });
        document.body.appendChild(container);
        this._containerElm = container;

        this.StyleContainerElm("initialize");
        this.StyleContainerElm("init thumbnails " + this._config.THUMBNAIL_STRIP);
        
    }

    MakeImageContainer() {
        const container = document.createElement('div');
        container.id = 'image-viewer-image-container';
        this._containerElm.appendChild(container);
        this._imageContainerElm = container;
        this.StyleImageContainer("initialize")
    }  
    
    MakeThumbnailContainer() {
        const container = document.createElement('div');
        container.id = 'image-viewer-thumbnail-container';
        this._containerElm.appendChild(container);
        this._thumbnailContainerElm = container;
        this.StyleThumbnailContainer("initialize");
    }

    

    StyleContainerElm(state) {
        switch(state) {
            case "initialize":
                this._containerElm.style.display = "none"
                this._containerElm.style.position = "fixed";
                this._containerElm.style.top = "0";
                this._containerElm.style.left = "0";
                this._containerElm.style.width = "100vw";
                this._containerElm.style.height = "100vh";
                this._containerElm.style.zIndex = "9999";
                this._containerElm.style.gridTemplateColumns = this._config.THUMBNAIL_STRIP_WIDTH + " 1fr"
                this._containerElm.style.gridTemplateRows = "1fr"
                this._containerElm.style.justifyItems = "stretch";
                this._containerElm.style.alignItems = "stretch";
                this._containerElm.style.boxSizing = "border-box";
                this._containerElm.style.overflow = "hidden";
                this._containerElm.style.cursor = "zoom-out";
                this._containerElm.style.backgroundColor = this._config.BACKGROUND_COLOR;
                this._containerElm.style.fontSize = this._config.BASE_FONT_SIZE;
                this._containerElm.style.backdropFilter = `blur(${this._config.BACKGROUND_BLUR})`;
                this._containerElm.style.webkitBackdropFilter = `blur(${this._config.BACKGROUND_BLUR})`;
                this._containerElm.style.minHeight = 0;
                this._containerElm.style.minWidth = 0;
                break;
            case "init thumbnails auto":
                this._containerElm.style.gridTemplateColumns = "0 1fr";
                break;
            case "init thumbnails open":
                this._containerElm.style.gridTemplateColumns = this._config.THUMBNAIL_STRIP_WIDTH + " 1fr";
                break;
            case "init thumbnails close":
                this._containerElm.style.gridTemplateColumns = "0 1fr";
                break;
            case "visible true":
                this._containerElm.style.display = "grid";
                break;
            case "visible false":
                this._containerElm.style.display = "none";

        }
    }

    StyleImageContainer(state) {
        switch(state) {
            case "initialize":
                this._imageContainerElm.style.width = "100%";
                this._imageContainerElm.style.height = "100%";
                this._imageContainerElm.style.gridColumn = 2;
                this._imageContainerElm.style.gridRow = 1;
                this._imageContainerElm.style.minWidth = 0;
                this._imageContainerElm.style.minHeight = 0;
                this._imageContainerElm.style.padding = this._config.IMAGE_MARGIN;
                break;
         }
    }

    StyleThumbnailContainer(state) {
        switch(state) {
            case "initialize":
                this._thumbnailContainerElm.style.gridColumn = 1;
                this._thumbnailContainerElm.style.gridRow = 1;
                break;
        }
    }
}


/**
 * 
 */
class ImageCollection {

    _config = {
        SELECT_ALL_IMAGES : "false",
        MARK_PARENTS : "true",
        GALLERY_MARK_ATTRIBUTE : "data-gallery",
        GALLERY_MARK_CLASS : "gallery"
    }

    _images = [];

    constructor(config) {
        Object.keys(config).forEach(key => {
            if (key.toUpperCase() in this._config) {
                this._config[key.toUpperCase()] = config[key];
            }
        })
        this.MakeImagesReady();
    }

    MakeImagesReady() {
        this.CollectImages();
        this.SetupImages();
    }

    CollectImages() {
        const imagesSearch = document.querySelectorAll(this.ConstructSearchString());
        const imagesSearchResult = Array.from(imagesSearch);
        imagesSearchResult.forEach(imageOrGroup => {
            if (imageOrGroup.children.length > 0) {
                const groupSearchResult = imageOrGroup.querySelectorAll("img");
                this._images.concat(Array.from(groupSearchResult));
            }
            else {
                this._images.push(imageOrGroup);
            }
        })
    }

    SetupImages() {
        let id = 1;
        var previousImage;
        this._images.forEach(image => {
            image.setAttribute("data-galleryimageid", id);
            if (previousImage) {
                previousImage.setAttribute("data-nextgalleryimage", id);
                image.setAttribute("data-previousgalleryimage", previousImage.getAttribute("data-galleryimageid"));
            }
            image.addEventListener("click", (e) => {
                ImageViewer.Instance.GoIntoFullScreenView(e.target);
            })
            previousImage = image;
            id++;
        })
    }   

    ConstructSearchString() {
        if (this._config.SELECT_ALL_IMAGES) {
            return "img";
        }
        let searchString = "";
        if (this._config.MARK_PARENTS) {
            if (this._config.GALLERY_MARK_ATTRIBUTE != "") {
                searchString += "[" + this._galleryMarkAttribute + "] img, ";
            }
            if (this._config.GALLERY_MARK_CLASS != "") {
                searchString += "." + this._galleryMarkClass + " img, ";
            }
        }
        if (this._config.GALLERY_MARK_ATTRIBUTE != "") {
            searchString += "img[" + this._galleryMarkAttribute + "],";
        }
        if (this._config.GALLERY_MARK_CLASS != "") {
            searchString += "img." + this._galleryMarkClass;
        }
        return searchString;
    }
}