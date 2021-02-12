import "./search.js";
import { getTrendingGifs } from "./actions.js";
import { gifLayout } from "./layouts.js";

function getTranslateTotal(
    element,
    itemWith,
    direction = "next",
    maxDirection
) {
    const getElementStyle = window.getComputedStyle(element);
    if (getElementStyle) {
        const getElementStyleTransform = getElementStyle.transform;
        if (getElementStyleTransform) {
            const matrixValuesMath = getElementStyleTransform.match(
                /matrix.*\((.+)\)/
            );
            if (matrixValuesMath) {
                const matrixValues = matrixValuesMath[1].split(", ")[4];
                const valueGet = Number(matrixValues);
                let totalTranslate = 0;

                if (direction == "next") {
                    totalTranslate = valueGet - itemWith;
                } else {
                    if (valueGet < 0) {
                        totalTranslate = valueGet + itemWith;
                    }
                }

                if (Math.abs(totalTranslate) == maxDirection) {
                    return valueGet;
                }

                return totalTranslate;
            }
        }
    }

    if (direction == "next") {
        return "-" + itemWith;
    }

    return 0;
}

(async () => {
    const slides = await getTrendingGifs();
    const getContainerSlider = document.getElementById(
        "trending_slider--content"
    );
    const getParentContainer = document.querySelector(
        ".trending_slider--container-content"
    );
    const totalItemWith = getParentContainer.scrollWidth / 3;

    slides.data.forEach((slide) => {
        const createElement = document.createElement("div");
        createElement.className = "slide_content_separator";
        createElement.style.width = totalItemWith + "px";
        createElement.innerHTML += gifLayout(slide);
        getContainerSlider.appendChild(createElement);
    });

    const itemWidth = getContainerSlider.children[0].scrollWidth;

    const totalWidth = itemWidth * slides.data.length;
    getContainerSlider.style.width = totalWidth + "px";

    const getPrevButton = document.getElementById(
        "trending_slider--prev_button"
    );
    const getNextButton = document.getElementById(
        "trending_slider--next_button"
    );

    const maxDirectionTranslate = totalWidth - itemWidth * 2;
    console.log(maxDirectionTranslate);
    getPrevButton.addEventListener("click", () => {
        const totalTranslate = getTranslateTotal(
            getContainerSlider,
            itemWidth,
            "prev",
            maxDirectionTranslate
        );
        getContainerSlider.style.transform = `translate3d(${totalTranslate}px , 0 , 0)`;
    });

    getNextButton.addEventListener("click", () => {
        const totalTranslate = getTranslateTotal(
            getContainerSlider,
            itemWidth,
            "next",
            maxDirectionTranslate
        );
        getContainerSlider.style.transform = `translate3d(${totalTranslate}px , 0 , 0)`;
    });
})();
