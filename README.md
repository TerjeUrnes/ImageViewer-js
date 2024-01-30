<picture><img src="webpage/gay_pride_flag.svg" width="50"></picture> <picture><img src="webpage/transgender_pride_flag.svg" width="50"></picture>
# .js Image Slideshow Gallery 

For a demo, see the GitHub pages.: [https://terjeurnes.github.io/js-image-slideshow/](https://terjeurnes.github.io/js-image-slideshow/)

It is a simple fullscreen slideshow and image viewer. That auto detects all images on the page. There are also some features that are selectable, e.g. thumbnail view, autoplay and looping.

The slideshow/image viewer is all inside of one file. That only needs to add and call the initialize function `slideshowInit()`. It is an ECMA-script [module](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules) that exports that function. If you do not want to use it as that, you only need to remove the last line.

### Tagging the images 🏷️

The script can collect all images on the page by setting the `SELECT_ALL_IMAGES` constant, the default is `false`. The default behaviour is to select marked images or select all images under a marked parent tag. Marks can be attributes or a class name. The marks can be set in the `GALLERY_MARK_ATTRIBUTE` and `GALLERY_MARK_CLASS` constants, default is `data-gallery` and `gallery` respectively.

E.g. `<img src="img01.jpg" data-gallery>` or `<img src="img01.jpg" class="gallery">` or under a parent, or one of its ancestors `<div data-gallery><img src="img01.jpg"><img src="img02.jpg"><div><img src="img03.jpg"></div></div> <div class="gallery"><div><img src="img04.jpg"></div><div><img src="img05.jpg"><img src="img06.jpg"></div></div>` 

### 🖼️  Image URLs and sizes 

All images need a url and a size, and that can be set in different ways. 

First, how I am using it. I prefer to only use the full-resolution image, with styling to set the view size. 
E.g. `<img src="img01.jpg" width="2200" height="1500" style="width: 100%; height: auto;">`
E.i. I am not using a separate image for the fullscreen view. I don't see any problem with that because of today's fast internet connections and tools such as [ImageOptim](https://imageoptim.com/)  and I don't have sites with critical loading time. The positive with that is no loading time when going into fullscreen view. With the use of that tool, the image in the example goes from a size of 1.9MB in full quality out of Lightroom to 400k. Or an 1800x1200, which is still a decent size,  goes from 1.4MB to 270k. All images in the demo site are 1800x1200.

The image tag can be setup in different ways. All this examples will give a image with size of 1800 x 1200 pixel.
```
(1) <img src="street-1.jpg" width="1800" height="1200" style="width:100%; height:auto;>
(2) <img src="street-2.jpg" class="gallery" width="1800" height="1200" style="width:100%; height:auto;>
(3) <img src="street-4.jpg" width="1800" height="1200" style="width:100%; height:auto; data-gallery>
(4) <img src="street-3.jpg" data-gallerysize="1800x1200" style="width:100%; height:auto;>
(5) <img src="street-6-small.jpg" width="600" height="400" data-gallerysize="1800x1200" data-galleryimage="street-6.jpg">
```



#### Customizing options:
| Description | Constant | Default | Other | |
|-------------|----------|---------|--------|-|
| Slideshow starts up when going into full screen. | AUTOPLAY | off | on | v0.1 |
| Slideshow will loop after the last image. | LOOP | off | on | v0.1 |
| Slideshow controllers is visible | SLIDESHOW_CONTROLS | on | off | v0.2 |
| Navigation controllers is visible | NAVIGATION_CONTROLS | on | off | v0.2 |
| Thumbnails list in full screen. | THUMBNAIL_STRIP | auto | on, off | v0.2 |
| Image attribute marking that is used when gathering the images. | GALLERY_TAG_ATTRIBUTE | data-gallery | | v0.1 |
| Image class alternative marking. | GALLERY_CLASS_NAME | gallery | | v0.1 |
| Mark parent tags and all images in sub tags is gather.| MARK_IMAGE_GROUPS | true | false | v0.1 |
| Alternative image url attribute | ALT_IMAGE_URL | data-galleryimage | | v0.1 |
| Alternative image size attribute | ALT_IMAGE_SIZE | data-gallerysize | | v0.1 |




