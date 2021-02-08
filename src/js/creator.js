export function elementCreator({ type, className, attributes, click, text }) {
    const createElement = document.createElement(type);
    createElement.className = className;

    attributes.map((attribute) => {
        createElement.setAttribute(attribute.name, attribute.value);
    });

    createElement.addEventListener("click", (e) => click(e.target));

    const textNode = document.createTextNode(text);
    createElement.appendChild(textNode);

    return createElement;
}