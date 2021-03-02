(() => {
    const getHamburguerMenu = document.getElementById("hamburguer_menu");
    const getMenuTrigger = document.getElementById("mobile_menu");
    const getBodyTag = document.querySelector("body");

    if (getHamburguerMenu) {
        getHamburguerMenu.addEventListener("click", () => {
            if (getMenuTrigger) {
                if (!getMenuTrigger.classList.contains("active")) {
                    getMenuTrigger.classList.add("active");
                    getBodyTag.style.overflow = "hidden";
                    getMenuTrigger.style.display = "block";
                } else {
                    getMenuTrigger.classList.remove("active");
                    getBodyTag.style.overflowY = "visible";
                    getMenuTrigger.style.display = "none";
                }
            }
        });
    }
})();
