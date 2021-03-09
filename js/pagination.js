import { gifLayout } from "./layouts.js";

function printGif(gif, layoutParent, type) {
    layoutParent.appendChild(gifLayout(gif, layoutParent, type));
}

function changePage(
    items,
    itemsPerPage,
    page,
    layoutParent,
    type,
    totalButtons
) {
    pagination(items, itemsPerPage, page, layoutParent, type, totalButtons);
}

function createButton(
    page,
    items,
    itemsPerPage,
    layoutParent,
    type,
    totalButtons
) {
    const buttonElement = document.createElement("button");
    buttonElement.className = "btn_pagination";
    buttonElement.appendChild(document.createTextNode(page));

    buttonElement.addEventListener("click", () => {
        changePage(items, itemsPerPage, page, layoutParent, type, totalButtons);
    });
    return buttonElement;
}

function createPagination(
    totalButtons,
    items,
    itemsPerPage,
    layoutParent,
    type
) {
    const createButtonContainer = document.createElement("div");
    createButtonContainer.className = "button_pagination_container";

    for (let i = 0; i < totalButtons; i++) {
        createButtonContainer.appendChild(
            createButton(
                i + 1,
                items,
                itemsPerPage,
                layoutParent,
                type,
                totalButtons
            )
        );
    }

    return createButtonContainer;
}

export const pagination = (
    items,
    itemsPerPage = 5,
    page = 1,
    layoutParent,
    type,
    totalButtons
) => {
    layoutParent.innerHTML = "";

    for (let i = itemsPerPage * (page - 1); i <= itemsPerPage * page - 1; i++) {
        if (i > items.length - 1) {
            break;
        }

        printGif(items[i], layoutParent, type);
    }

    if (totalButtons > 1) {
        layoutParent.appendChild(
            createPagination(
                totalButtons,
                items,
                itemsPerPage,
                layoutParent,
                type
            )
        );
    }
};
