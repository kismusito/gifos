function evaluateChangeTheme(field, theme, triggerThemeChange) {
    field.rel = "stylesheet";
    field.type = "text/css";

    if (theme) {
        if (theme == "dark") {
            triggerThemeChange.innerText = "MODO DIURNO";
            triggerThemeChange.setAttribute("area-theme-change", "light");
        } else {
            triggerThemeChange.innerText = "MODO NOCTURNO";
            triggerThemeChange.setAttribute("area-theme-change", "dark");
        }
        field.href = "scss/colors_" + theme + ".css";
    } else {
        triggerThemeChange.innerText = "MODO NOCTURNO";
        triggerThemeChange.setAttribute("area-theme-change", "dark");
        field.href = "scss/colors_light.css";
    }

    document.getElementsByTagName("HEAD")[0].appendChild(field);
}

(() => {
    const getChangeThemeTrigger = document.querySelectorAll(
        ".change_theme_trigger"
    );
    const actualTheme = localStorage.getItem("theme");
    var styleElement = document.createElement("link");

    for (let i = 0; i < getChangeThemeTrigger.length; i++) {
        getChangeThemeTrigger[i].addEventListener("click", (e) => {
            const getAttributes = e.target.attributes;
            if (getAttributes) {
                const getThemeToChange =
                    getAttributes["area-theme-change"].value;
                if (getThemeToChange) {
                    document
                        .getElementsByTagName("HEAD")[0]
                        .removeChild(styleElement);
                    localStorage.setItem("theme", getThemeToChange);
                    evaluateChangeTheme(
                        styleElement,
                        getThemeToChange,
                        getChangeThemeTrigger[i]
                    );
                }
            }
        });

        evaluateChangeTheme(
            styleElement,
            actualTheme,
            getChangeThemeTrigger[i]
        );
    }
})();
