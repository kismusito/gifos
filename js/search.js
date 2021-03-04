import {
    getSuggestionGifs,
    getGifs,
    getTrendingSearchesGifs,
} from "./actions.js";
import { elementCreator } from "./creator.js";
import { gifLayout } from "./layouts.js";

function getByID(_id) {
    return document.getElementById(_id);
}

let allGifs = [];

async function getSearchedWord(element, start = 0, reload = true) {
    const selectedQuery =
        typeof element == "string"
            ? element
            : element.getAttribute("area-selected");
    const getContainerPredictions = getByID("predictions_area_section");
    const getGifsContainer = getByID("search_area_section");
    const getGifsContainerActions = getByID("search_area_actions");
    const getTitleSearched = getByID("searched_gifs_section--title");
    const searchInput = getByID("user_prediction");
    const iconRight = getByID("icon_right");
    const iconLeft = getByID("icon_left");
    const getTrendingContainer = document.querySelector(
        ".trending_searchs--container"
    );

    try {
        const gifs = await getGifs(
            `gifs/search?q=${selectedQuery}&limit=12&offset=${start}&`
        );

        const gifData = gifs.data;
        if (gifData.length > 0) {
            if (reload) {
                getGifsContainer.innerHTML = "";
                allGifs = [];
                localStorage.removeItem("actual_gifs_searched");
            }

            allGifs = [...gifData, ...allGifs];

            localStorage.setItem(
                "actual_gifs_searched",
                JSON.stringify(allGifs)
            );

            getContainerPredictions.innerHTML = "";
            getTrendingContainer.style.display = "none";

            getGifsContainerActions.innerText = "";

            searchInput.value = "";

            const createButton = document.createElement("button");
            createButton.innerText = "Ver más";
            createButton.setAttribute(
                "data-pagination-offset",
                start == 0
                    ? 12
                    : gifs.pagination.offset + gifs.pagination.count + 1
            );
            createButton.className = "btn_purple";
            getTitleSearched.innerHTML = `<h2>${selectedQuery}</h2>`;

            for (let i in gifData) {
                getGifsContainer.appendChild(
                    gifLayout(gifData[i], getGifsContainer, "search")
                );
            }

            getGifsContainerActions.appendChild(createButton);

            createButton.addEventListener("click", (e) => {
                const getOffset =
                    e.target.attributes["data-pagination-offset"].value;
                if (getOffset) {
                    getSearchedWord(selectedQuery, getOffset, false);
                }
            });
        } else {
            getTrendingContainer.style.display = "block";
            getGifsContainerActions.innerText = "";
            getTitleSearched.innerHTML = `<h2>Oops...</h2>`;
            getGifsContainer.innerHTML = `
                <div id="display_info">
                    <img src="../assets/img/icon-busqueda-sin-resultado.svg" alt="busqueda sin resultado" />
                    <p class="no_found_gifs_text">Intenta con otra búsqueda.</p>
                </div>
            `;
        }
    } catch (error) {
        console.error(error);
    }
}

async function getSearch(term, icon) {
    const getContainerPredictions = getByID("predictions_area_section");

    if (getContainerPredictions) {
        const results = await getSuggestionGifs(term);
        if (results) {
            getContainerPredictions.innerHTML = "";
            results.data.map((result) => {
                const elementOptions = {
                    type: "li",
                    className: "predictions_area_item",
                    attributes: [
                        {
                            name: "area-selected",
                            value: result.name,
                        },
                    ],
                    icon: "search",
                    click: getSearchedWord,
                    text: result.name,
                };

                const createLiElement = elementCreator(elementOptions);

                getContainerPredictions.appendChild(createLiElement);
            });
            icon.style.display = "none";
        }
    }
}

var timeout = null;

function createSpanIcon(icon, onClick) {
    const iconElement = document.createElement("span");
    iconElement.className = "material-icons";
    iconElement.innerHTML = icon;
    iconElement.addEventListener("click", onClick);
    return iconElement;
}

function clearSearch() {
    const getContainerPredictions = getByID("predictions_area_section");
    const searchInput = getByID("user_prediction");
    const iconRight = getByID("icon_right");
    const iconLeft = getByID("icon_left");

    if (getContainerPredictions && searchInput) {
        getContainerPredictions.innerHTML = "";
        searchInput.value = "";

        if (iconRight) {
            iconRight.innerHTML = ""
            iconRight.appendChild(createSpanIcon("search", searchValue));
        }

        if(iconLeft) {
            iconLeft.style.display = "none"
        }
    }
}

function searchValue() {
    const searchInput = getByID("user_prediction");
    if (searchInput) {
        if (searchInput.value.length > 0) {
            getSearch(searchInput.value, searchIcon);
        } else {
            alert("Debes buscar algo...");
        }
    }
}

(async () => {
    const searchInput = getByID("user_prediction");
    const trending_searchs = getByID("trending_searchs");
    const searchIcon = getByID("loader_elements");
    const iconRight = getByID("icon_right");
    const iconLeft = getByID("icon_left");

    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            window.clearTimeout(timeout);
            searchIcon.style.display = "block";
            iconRight.style.display = "none";

            timeout = setTimeout(() => {
                getSearch(e.target.value, searchIcon);
                iconRight.style.display = "block";
                iconLeft.style.display = "block";
                iconRight.innerHTML = "";
                iconRight.appendChild(createSpanIcon("close", clearSearch));
            }, 1000);

            if (e.key == "Enter") {
                window.clearTimeout(timeout);
                searchIcon.style.display = "none";
                iconLeft.style.display = "block";
                iconRight.innerHTML = "";
                iconRight.appendChild(createSpanIcon("close", clearSearch));
                getSearchedWord(e.target.value, searchIcon);
            }
        });
    }

    if (iconRight) {
        iconRight.appendChild(createSpanIcon("search", searchValue));
    }

    if (trending_searchs) {
        const searchs = await getTrendingSearchesGifs();
        if (searchs.data) {
            let totalTrendingToShow = 5;
            for (let i in searchs.data) {
                const generateText =
                    searchs.data[i] + (i < totalTrendingToShow ? "," : "");
                const trendingItem = document.createElement("span");
                trendingItem.appendChild(document.createTextNode(generateText));
                trendingItem.className = "trending_item_searched";
                trendingItem.setAttribute("area-selected", searchs.data[i]);
                trendingItem.addEventListener("click", (_) => {
                    getSearchedWord(trendingItem);
                });
                trending_searchs.appendChild(trendingItem);

                if (i > 5) {
                    break;
                }
            }
        }
    }
})();
