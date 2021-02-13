import { gifLayout } from "./layouts.js";

const noFavoritesFound = (_) => {
    return `<div class="no_found_favorite">
                <img
                    src="assets/img/icon-fav-sin-contenido.svg"
                    alt="no favs found"
                />
                <p>
                    "¡Guarda tu primer GIFO en Favoritos <br />
                    para que se muestre aquí!"
                </p>
            </div>`;
};

(() => {
    const getFavoriteGifs = localStorage.getItem("local-favorites");
    const favoriteContainer = document.getElementById("favorite_gifs");
    if (favoriteContainer) {
        if (getFavoriteGifs) {
            const gifs = JSON.parse(getFavoriteGifs);
            if (gifs) {
                if (gifs.length > 0) {
                    gifs.map((gif) => {
                        favoriteContainer.appendChild(
                            gifLayout(gif, favoriteContainer)
                        );
                    });
                } else {
                    favoriteContainer.innerHTML = noFavoritesFound();
                }
            } else {
                favoriteContainer.innerHTML = noFavoritesFound();
            }
        } else {
            favoriteContainer.innerHTML = noFavoritesFound();
        }
    }
})();
