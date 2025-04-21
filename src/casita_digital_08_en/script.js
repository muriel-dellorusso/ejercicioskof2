import CasitaCompleja from "../shared/casita-compleja";

window.onload = () => {
    CasitaCompleja({
        initialWord: "NA???AL",
        expectedWord: "NATURAL",
        container: document.getElementById("casita"),
        preview: document.getElementById("preview"),
        successMessage: "Congratulations! You found the right word!",
        failureMessage: "Oh no! That's not the right word. Try again.",
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

                // Actualización del estado de la casa en htmlElement
                let check = htmlElement.querySelector("span.check-status");
                if (!check) {
                    check = document.createElement("span");
                    check.classList.add("check-status");
                    htmlElement.appendChild(check);
                }

                // Actualizar el contenido del estado de la casa
                check.innerHTML = house.isOK ? "✅" : "❌";
                check.className = "check-status " + (house.isOK ? "check-true" : "check-false");

                // Actualización del estado de la casa en lettersPreview
                let checkPreview = lettersPreview.querySelector("span.check-status");
                if (!checkPreview) {
                    checkPreview = document.createElement("span");
                    checkPreview.classList.add("check-status");
                    lettersPreview.appendChild(checkPreview);
                }

                // Actualizar el contenido del estado de verificación en lettersPreview
                checkPreview.innerHTML = check.innerHTML;
                checkPreview.className = check.className;
            }
            );
        },
    });
}