(() => {
    const getBodyTag = document.querySelector("body");
    const getModalContainer = document.getElementById("fullScreen_gif--shadow");
    const getIconClose = document.getElementById("fullScreen_gif--icon_close");

    getIconClose.addEventListener("click", () => {
        getBodyTag.style.overflowY = "visible";
        getModalContainer.style.display = "none";
    })
})()