export function elementCreator({ type, className, attributes, click, text , icon}) {
    const createElement = document.createElement(type);
    createElement.className = className;

    attributes.map((attribute) => {
        createElement.setAttribute(attribute.name, attribute.value);
    });

    createElement.addEventListener("click", (e) => click(e.target));

    const iconElement = document.createElement("span");
    iconElement.className = "material-icons"
    iconElement.innerHTML = icon;

    createElement.innerHTML = iconElement.outerHTML + text;

    return createElement;
}
