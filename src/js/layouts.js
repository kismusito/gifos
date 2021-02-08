const favoriteGif = (item) => {};

const fullScreenGif = (item) => {};

const downloadGif = (item) => {};

export const gifLayout = (data) => {
    console.log(data)
    return `
        <div class="gif--container">
            <img
                src="${data.images.original.url}"
                class="gif--img"
                alt=""
            />

            <div class="gif--hover-container">
                <div class="gif--content-actions">
                    <div class="gif--content-action-item"></div>
                    <div class="gif--content-action-item"></div>
                    <div class="gif--content-action-item"></div>
                </div>

                <div class="gif--info">
                    <p class="gif--info-subtitle">${data.username ? data.username : "Anonymous"}</p>
                    <p class="gif--info-title">${data.title}</p>
                </div>
            </div>
        </div>
    `;
};
