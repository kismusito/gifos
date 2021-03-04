import { favoriteGifs } from "./favorite_gifs.js";

const favoriteGif = (event, item) => {
    try {
        const favorites = localStorage.getItem("local-favorites");
        if (favorites) {
            const favoritesParse = JSON.parse(favorites);
            const alreadyFavorite = favoritesParse.some(
                (gif) => gif.id == item.id
            );
            if (!alreadyFavorite) {
                localStorage.setItem(
                    "local-favorites",
                    JSON.stringify([item, ...favoritesParse])
                );
                if (event.target.className == "gif--content-action-item") {
                    event.target.innerHTML = `<i class="fas fa-heart"></i>`;
                } else {
                    event.target.parentElement.innerHTML = `<i class="fas fa-heart"></i>`;
                }
            } else {
                localStorage.setItem(
                    "local-favorites",
                    JSON.stringify(
                        favoritesParse.filter((gif) => gif.id != item.id)
                    )
                );
                if (event.target.className == "gif--content-action-item") {
                    event.target.innerHTML = `<i class="far fa-heart"></i>`;
                } else {
                    event.target.parentElement.innerHTML = `<i class="far fa-heart"></i>`;
                }
            }

            favoriteGifs();
        } else {
            localStorage.setItem("local-favorites", JSON.stringify([item]));
            if (event.target.className == "gif--content-action-item") {
                event.target.innerHTML = `<i class="fas fa-heart"></i>`;
            } else {
                event.target.parentElement.innerHTML = `<i class="fas fa-heart"></i>`;
            }
        }
    } catch (error) {
        localStorage.removeItem("local-favorites");
        alert(
            "No se puede cargar la lista de favoritos. Eliminando registros..."
        );
    }
};

const layoutSliderFull = (item, next, prev, data) => {
    const getPreviewLayout = document.getElementById(
        "fullScreen_gif--gif_content"
    );
    const getButtonContainer = document.getElementById("data_button_actions");

    getPreviewLayout.innerHTML = "";
    getPreviewLayout.innerHTML = `
        <img
            src="${data[item].images.original.url}"
            class="gif--img"
            alt=""
        />
    `;

    let isFavorite = gifIsFavorite(data[item].id);

    const createGIFInfo = document.createElement("div");
    createGIFInfo.className = "gif_info_fullscreen";

    createGIFInfo.insertAdjacentHTML(
        "beforeend",
        `<div class="gif--info">
            <p class="gif--info-subtitle">${
                data[item].username ? data[item].username : "Anonymous"
            }</p>
            <p class="gif--info-title">${data[item].title}</p>
        </div>`
    );

    const createGIFInfoActions = document.createElement("div");
    createGIFInfoActions.className = "gif_fullScreen_actions";

    const favorite = createActionElement(
        favoriteGif,
        data[item],
        `<i class="${isFavorite ? "fas" : "far"} fa-heart"></i>`
    );

    const download = createActionElement(
        downloadGif,
        data[item],
        `<span class="material-icons">download</span>`
    );

    createGIFInfoActions.appendChild(favorite);
    createGIFInfoActions.appendChild(download);

    createGIFInfo.appendChild(createGIFInfoActions);

    getPreviewLayout.appendChild(createGIFInfo);

    getButtonContainer.innerHTML = "";

    const createPrevButton = document.createElement("button");
    createPrevButton.className = "arrow_button pre_button_modal";
    createPrevButton.innerHTML = `<span class="material-icons">keyboard_arrow_left</span>`;
    createPrevButton.addEventListener("click", () => {
        sliderFullScreen(data, data[prev]);
    });

    const createNextButton = document.createElement("button");
    createNextButton.className = "arrow_button next_button_modal";
    createNextButton.innerHTML = `<span class="material-icons">keyboard_arrow_right</span>`;
    createNextButton.addEventListener("click", () => {
        sliderFullScreen(data, data[next]);
    });

    getButtonContainer.appendChild(createPrevButton);
    getButtonContainer.appendChild(createNextButton);
};

const sliderFullScreen = (data, item) => {
    const searchedItem = data.findIndex((element) => element.id == item.id);

    let next;
    let prev;
    let index;

    if (data[searchedItem]) {
        if (data[searchedItem - 1]) {
            prev = searchedItem - 1;
        } else {
            prev = data.length - 1;
        }

        index = searchedItem;

        if (data[searchedItem + 1]) {
            next = searchedItem + 1;
        } else {
            next = 0;
        }
    }

    layoutSliderFull(index, next, prev, data);
};

const fullScreenGif = (event, item, type = "search") => {
    const getModalContainer = document.getElementById("fullScreen_gif--shadow");
    const getBodyTag = document.querySelector("body");
    getBodyTag.style.overflow = "hidden";
    getModalContainer.style.display = "flex";

    let data = [];

    switch (type) {
        case "search":
            data = JSON.parse(localStorage.getItem("actual_gifs_searched"));
            break;
        case "slider":
            data = JSON.parse(localStorage.getItem("actual_gifs_slider"));
            break;
        case "favorite":
            data = JSON.parse(localStorage.getItem("local-favorites"));
            break;
        case "uploaded":
            data = JSON.parse(localStorage.getItem("local-uploads"));
            break;
        default:
            alert("No se ha encontrado el recurso solicitado.");
            break;
    }

    sliderFullScreen(data, item);
};

const downloadGif = async (event, item) => {
    let a = document.createElement("a");
    let response = await fetch(item.images.original.url);
    let file = await response.blob();
    a.download = item.title;
    a.href = window.URL.createObjectURL(file);
    a.click();
};

function creatorElement(tag, className, click, type = "search") {
    const createdElement = document.createElement(tag);
    createdElement.className = className;
    if (click && window.innerWidth < 900) {
        createdElement.addEventListener("click", (e) => {
            fullScreenGif(e, click, type);
        });
    }
    return createdElement;
}

function createActionElement(
    action,
    data,
    iconHTML = "",
    parentElement = null,
    type = "search"
) {
    const elementAction = creatorElement("div", "gif--content-action-item");
    elementAction.addEventListener("click", (e) => {
        action(e, data, parentElement, type);
    });

    elementAction.innerHTML = iconHTML;

    return elementAction;
}

function gifIsFavorite(id) {
    const favorites = localStorage.getItem("local-favorites");
    let isFavorite = false;

    if (favorites) {
        try {
            const favoritesParse = JSON.parse(favorites);
            if (favoritesParse) {
                isFavorite = favoritesParse.some((gif) => gif.id == id);
            }
        } catch (error) {
            localStorage.removeItem("local-favorites");
            alert(
                "No se puede cargar la lista de favoritos. Eliminando registros..."
            );
        }
    }

    return isFavorite;
}

export const gifLayout = (
    data,
    parent,
    type = "search",
    favorite = true,
    full = true
) => {
    let isFavorite = gifIsFavorite(data.id);

    const createGifContainer = creatorElement(
        "div",
        "gif--container",
        data,
        type
    );

    createGifContainer.insertAdjacentHTML(
        "beforeend",
        `<img
            src="${data.images.original.url}"
            class="gif--img"
            alt=""
        />`
    );

    const createActionContainer = creatorElement("div", "gif--hover-container");
    const createActionButtons = creatorElement("div", "gif--content-actions");

    if (favorite) {
        const favorite = createActionElement(
            favoriteGif,
            data,
            `<i class="${isFavorite ? "fas" : "far"} fa-heart"></i>`
        );
        createActionButtons.appendChild(favorite);
    }

    const download = createActionElement(
        downloadGif,
        data,
        `<span class="material-icons">download</span>`
    );
    createActionButtons.appendChild(download);

    if (full) {
        const fullScreen = createActionElement(
            fullScreenGif,
            data,
            `<i class="fas fa-expand-alt"></i>`,
            type
        );
        createActionButtons.appendChild(fullScreen);
    }

    createActionContainer.appendChild(createActionButtons);

    createActionContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="gif--info">
            <p class="gif--info-subtitle">${
                data.username ? data.username : "Anonymous"
            }</p>
            <p class="gif--info-title">${data.title}</p>
        </div>`
    );

    createGifContainer.appendChild(createActionContainer);

    return createGifContainer;
};

if (
    window.location.pathname == "/favorites" ||
    window.location.pathname == "/favorites.html"
) {
    favoriteGifs();
}
