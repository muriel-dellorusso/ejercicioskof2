import { FreeStaticCasitaCompleja } from "../shared/casita-compleja";

window.onload = () => {
    FreeStaticCasitaCompleja({
        housesAmount: 4,
        container: document.getElementById("casita"),
        preview: document.getElementById("preview"),
        successMessage: "Congratulations! You found the right word!",
        failureMessage: "Oh no! That's not the right word. Try again.",
    });
}