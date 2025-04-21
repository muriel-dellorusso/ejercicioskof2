import { FreeStaticCasitaCompleja } from "../shared/casita-compleja";

window.onload = () => {
    FreeStaticCasitaCompleja({
        housesAmount: 4,
        container: document.getElementById("casita"),
        preview: document.getElementById("preview"),
        successMessage: "Congratulations! You found the right letter!",
        failureMessage: "Oh no! That's not the right letter. Try again.",
        onHouseChange: (houses) => {
            houses.forEach(house => {
                console.log(house);

                // Seleccionar el elemento donde se reflejarán los cambios
                const lettersPreview = document.querySelectorAll(".char-preview")[house.index - 1];
                const htmlElement = house.htmlElement;

                // Actualización en htmlElement
                let indexContainer = htmlElement.querySelector("div.index-container");
                let indexNumber = htmlElement.querySelector("div.index-container > b");

                // Crear contenedor e índice si no existen en htmlElement
                if (!indexContainer) {
                    indexContainer = document.createElement("div");
                    indexContainer.classList.add("index-container");
                    htmlElement.appendChild(indexContainer);
                }
                if (!indexNumber) {
                    indexNumber = document.createElement("b");
                    indexContainer.appendChild(indexNumber);
                }

                // Actualizar el contenido del índice
                indexNumber.innerHTML = house.index;

                // Actualización en lettersPreview
                let indexContainerPreview = lettersPreview.querySelector("div.index-container");
                let indexNumberPreview = lettersPreview.querySelector("div.index-container > b");

                // Crear contenedor e índice si no existen en lettersPreview
                if (!indexContainerPreview) {
                    indexContainerPreview = document.createElement("div");
                    indexContainerPreview.classList.add("index-container");
                    lettersPreview.appendChild(indexContainerPreview);
                }
                if (!indexNumberPreview) {
                    indexNumberPreview = document.createElement("b");
                    indexContainerPreview.appendChild(indexNumberPreview);
                }

                // Actualizar el contenido del índice en lettersPreview
                indexNumberPreview.innerHTML = house.index;
            }
            );
        },
    });
}