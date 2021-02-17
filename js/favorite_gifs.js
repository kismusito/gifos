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

export const favoriteGifs = _ => {
    const getFavoriteGifs = localStorage.getItem("local-favorites");
    const favoriteContainer = document.getElementById("favorite_gifs");
    if (favoriteContainer) {
        if (getFavoriteGifs) {
            const gifs = JSON.parse(getFavoriteGifs);
            if (gifs) {
                favoriteContainer.innerHTML = "";
                if (gifs.length > 0) {
                    gifs.map((gif) => {
                        favoriteContainer.appendChild(
                            gifLayout(gif, favoriteContainer , "favorite")
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
}
