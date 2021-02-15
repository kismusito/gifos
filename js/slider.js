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
    const getContainerSlider = document.getElementById(
        "trending_slider--content"
    );
    const getParentContainer = document.querySelector(
        ".trending_slider--container-content"
    );

    localStorage.removeItem("actual_gifs_slider");

    if (getParentContainer) {
        const slides = await getTrendingGifs();
        const totalToDivide = window.innerWidth > 700 ? 3 : 1;
        const totalItemWith = getParentContainer.scrollWidth / totalToDivide;

        let totalGifs = [];

        slides.data.forEach((slide) => {
            const createdElement = gifLayout(
                slide,
                getContainerSlider,
                "slider"
            );
            createdElement.style.width = totalItemWith + "px";
            getContainerSlider.appendChild(createdElement);
            totalGifs = [...totalGifs, slide];
        });

        localStorage.setItem("actual_gifs_slider", JSON.stringify(totalGifs));

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
    }
})();
