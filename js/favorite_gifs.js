import { pagination } from "./pagination.js";

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

export const favoriteGifs = (_) => {
    const getFavoriteGifs = localStorage.getItem("local-favorites");
    const favoriteContainer = document.getElementById("favorite_gifs");
    if (favoriteContainer) {
        if (getFavoriteGifs) {
            const gifs = JSON.parse(getFavoriteGifs);
            if (gifs) {
                favoriteContainer.innerHTML = "";
                if (gifs.length > 0) {
                    const itemsPerPage = 12;
                    const totalPages = Math.ceil(gifs.length / itemsPerPage);
                    pagination(
                        gifs,
                        itemsPerPage,
                        1,
                        favoriteContainer,
                        "favorite",
                        totalPages
                    );
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
};
