<picture><img src="webpage/gay_pride_flag.svg" width="50"></picture> <picture><img src="webpage/transgender_pride_flag.svg" width="50"></picture>
# .js Image Slideshow Gallery 

For a demo se the github pages: [https://terjeurnes.github.io/js-image-slideshow/](https://terjeurnes.github.io/js-image-slideshow/)

A simple full screen image viewer and slideshow. With some customizing possibilities. 
It will auto discover any marked images or images under a mark parent. The marking can be an attribute or a class. E.g. `<img src="img01.jpg" data-gallery>`

Everything is collected in one file, `image-slideshow.js`. It is a module that exports the `slideshowInit()` function. You do not need to run the slideshow as a module, just remove the last line and use the script as normal.



The image tag can be setup in different ways. All this examples will give a image with size of 1800 x 1200 pixel.
```
(1) <img src="street-1.jpg" width="1800" height="1200" style="width:100%; height:auto;>
(2) <img src="street-2.jpg" class="gallery" width="1800" height="1200" style="width:100%; height:auto;>
(2) <img src="street-4.jpg" width="1800" height="1200" style="width:100%; height:auto; data-gallery>
(3) <img src="street-3.jpg" data-gallerysize="1800x1200" style="width:100%; height:auto;>
(4) <img src="street-6-small.jpg" width="600" height="400" data-gallerysize="1800x1200" data-galleryimage="street-6.jpg">
```



#### Customizing options:
| Description | Constant | Default | Other | |
|-------------|----------|---------|--------|-|
| Slideshow autoplay when going into full screen. | AUTOPLAY | off | on | v0.1 |
| Slideshow goes in loop. | LOOP | off | on | v0.1 |
| Slideshow controllers visible | SLIDESHOW_CONTROLS | on | off | v0.1.2 |
| Navigation controllers visible | NAVIGATION_CONTROLS | on | off | v0.1.2 |
| Thumbnails list in full screen. | | auto | on, off | |
| Image attribute marking | GALLERY_TAG_ATTRIBUTE | data-gallery | | v0.1 |
| Image class marking | GALLERY_CLASS_NAME | gallery | | v0.1 |
| Mark parent tags | MARK_IMAGE_GROUPS | true | false | v0.1 |
| Alternative image url attribute | ALT_IMAGE_URL | data-galleryimage | | v0.1 |
| Alternative image size attribute | ALT_IMAGE_SIZE | data-gallerysize | | v0.1 |




