import { ImageViewer } from "../imageviewer.js";

document.addEventListener("readystatechange", (e) => {
    if (document.readyState === "complete") {
        new ImageViewer();
    }
});