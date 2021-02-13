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
    const getTrendingContainer = document.querySelector(
        ".trending_searchs--container"
    );

    try {
        const gifs = await getGifs(
            `gifs/search?q=${selectedQuery}&limit=12&offset=${start}&`
        );

        const gifData = gifs.data;
        if (gifData.length > 0) {
            getContainerPredictions.innerHTML = "";
            getTrendingContainer.style.display = "none";
            if (reload) {
                getGifsContainer.innerHTML = "";
            }
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
                getGifsContainer.appendChild(gifLayout(gifData[i] , getGifsContainer));
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

(async () => {
    const searchInput = getByID("user_prediction");
    const trending_searchs = getByID("trending_searchs");
    const searchIcon = getByID("loader_elements");

    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            window.clearTimeout(timeout);
            searchIcon.style.display = "block";

            timeout = setTimeout(
                () => getSearch(e.target.value, searchIcon),
                1000
            );

            if (e.key == "Enter") {
                window.clearTimeout(timeout);
                searchIcon.style.display = "none";
                getSearchedWord(e.target.value, searchIcon);
            }
        });
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
