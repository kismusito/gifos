import { pagination } from "./pagination.js";

const noFavoritesFound = (_) => {
    return `<div class="no_found_favorite">
                <img
                    src="assets/img/icon-mis-gifos-sin-contenido.svg"
                    alt="no favs found"
                />
                <p>
                    "¡Anímate a crear tu primer GIFO!"
                </p>
            </div>`;
};

(() => {
    const getMyGifos = localStorage.getItem("local-uploads");
    const myGifosContainer = document.getElementById("my_uploaded_gifs");
    if (myGifosContainer) {
        if (getMyGifos) {
            const gifs = JSON.parse(getMyGifos);
            if (gifs) {
                if (gifs.length > 0) {
                    const itemsPerPage = 12;
                    const totalPages = Math.ceil(gifs.length / itemsPerPage);
                    pagination(
                        gifs,
                        itemsPerPage,
                        1,
                        myGifosContainer,
                        "uploaded",
                        totalPages
                    );
                } else {
                    myGifosContainer.innerHTML = noFavoritesFound();
                }
            } else {
                myGifosContainer.innerHTML = noFavoritesFound();
            }
        } else {
            myGifosContainer.innerHTML = noFavoritesFound();
        }
    }
})();
