import { getSuggestionGifs, getGifs } from "./actions.js";
import { elementCreator } from "./creator.js";
import { gifLayout } from "./layouts.js";

function getByID(_id) {
    return document.getElementById(_id);
}

async function getSearchedWord(element) {
    const selectedQuery = element.getAttribute("area-selected");
    const getContainerPredictions = getByID("predictions_area_section");
    const getGifsContainer = getByID("search_area_section");
    const searchInput = getByID("user_prediction");

    try {
        const gifs = await getGifs(`gifs/search?q=${selectedQuery}&limit=12&`);
        const gifData = gifs.data;
        if (gifData.length > 0) {
            getContainerPredictions.innerHTML = "";
            getGifsContainer.innerHTML = "";
            searchInput.value = "";

            for (let i in gifData) {
                getGifsContainer.innerHTML += gifLayout(gifData[i]);
            }
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

function predictSearch() {
    const searchInput = getByID("user_prediction");
    const searchIcon = getByID("loader_elements");

    if (searchInput) {
        searchInput.addEventListener("keyup", (e) => {
            window.clearTimeout(timeout);
            searchIcon.style.display = "block";
            timeout = setTimeout(
                () => getSearch(e.target.value, searchIcon),
                1000
            );
        });
    }
}

predictSearch();
