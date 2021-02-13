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
                    JSON.stringify([...favoritesParse, item])
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
        console.log(
            "No se puede cargar la lista de favoritos. Eliminando registros..."
        );
    }
};

const fullScreenGif = (event, item , parentElement) => {
    console.log(parentElement)
};

const downloadGif = async (event, item) => {
    let a = document.createElement("a");
    let response = await fetch(item.images.original.url);
    let file = await response.blob();
    a.download = item.title;
    a.href = window.URL.createObjectURL(file);
    a.click();
};

function creatorElement(tag, className) {
    const createdElement = document.createElement(tag);
    createdElement.className = className;
    return createdElement;
}

function createActionElement(action, data, iconHTML = "" , parentElement = null) {
    const elementAction = creatorElement("div", "gif--content-action-item");
    elementAction.addEventListener("click", (e) => {
        action(e, data , parentElement);
    });

    elementAction.innerHTML = iconHTML;

    return elementAction;
}

export const gifLayout = (data , parent) => {
    const favorites = localStorage.getItem("local-favorites");
    let isFavorite = false;

    if (favorites) {
        try {
            const favoritesParse = JSON.parse(favorites);
            if (favoritesParse) {
                isFavorite = favoritesParse.some((gif) => gif.id == data.id);
            }
        } catch (error) {
            localStorage.removeItem("local-favorites");
            console.log(
                "No se puede cargar la lista de favoritos. Eliminando registros..."
            );
        }
    }

    const createGifContainer = creatorElement("div", "gif--container");

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

    const favorite = createActionElement(
        favoriteGif,
        data,
        `<i class="${isFavorite ? "fas" : "far"} fa-heart"></i>`
    );

    const download = createActionElement(
        downloadGif,
        data,
        `<span class="material-icons">download</span>`
    );

    const fullScreen = createActionElement(
        fullScreenGif,
        data,
        `<i class="fas fa-expand-alt"></i>`,
        parent
    );

    createActionButtons.appendChild(favorite);
    createActionButtons.appendChild(download);
    createActionButtons.appendChild(fullScreen);

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
