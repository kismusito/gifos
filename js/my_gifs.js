import { gifLayout } from "./layouts.js";

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
    const getMyGifos = localStorage.getItem("uploaded-gifs");
    const myGifosContainer = document.getElementById("my_uploaded_gifs");
    if (myGifosContainer) {
        if (getMyGifos) {
            const gifs = JSON.parse(getMyGifos);
            if (gifs) {
                if (gifs.length > 0) {
                    gifs.map((gif) => {
                        myGifosContainer.appendChild(
                            gifLayout(gif, myGifosContainer, "favorite")
                        );
                    });
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
