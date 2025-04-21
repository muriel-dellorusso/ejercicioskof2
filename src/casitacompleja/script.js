import { FreeStaticCasitaCompleja } from "../shared/casita-compleja";

window.onload = () => {
    FreeStaticCasitaCompleja({
        housesAmount: 4,
        container: document.getElementById("casita"),
        preview: document.getElementById("preview"),
    });
}