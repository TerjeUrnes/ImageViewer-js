Simple fullscreen image viewer.  
In pure vanilla JavaScript with no dependencies.
# Image Viewer JS

![Screenshot](webpage/screenshots/imageviewer01.png)

## How to use

Just include the file [imageviewer.js](./imageviewer.js) and make a instance of the class `ImageViewer`. The instance finds the images on the page. Ether all images or only those that is marked.

```javascript
new ImageViewer();
```
The instance have to be created after the page is finish loading.

## Image Scraping: All images

The default is to collect tagged images. To collect all set `SELECT_ALL_IMAGES` to true.

```javascript
new ImageViewer({
    "select_all_images": true
})
```

## Image Scraping: Marked images
A image is marked if the image element has a mark or if a parent element is marked.
To mark is to ether add an attribute or a class. Default attribute is `data-gallery` and default class is `gallery`.

```html
<div class="img-styling" data-gallery>
    <img src="mother-and-child.jpg">
    <img src="father-and-child.jpg">
</div>
<div class="img-styling">
    <img src="mother-and-child.jpg" class="gallery">
    <img src="father-and-child.jpg" data-gallery>
</div>
```

To change the marks change the `GALLERY_MARK_ATTRIBUTE` or / and `GALLERY_MARK_CLASS`.

```javascript
new ImageViewer({
    "select_all_images": true
})
```

