import CasitaDigital from "../shared/casita-digital";

window.onload = () => {
    CasitaDigital({
        // initialLetter: "A",
        // expectedLetter: "B",
        house: document.getElementById("casa"),
        letter: document.getElementById("mensaje"),
        isFreeMode: true,
        successMessage: "Congratulations! You found the right letter!",
        failureMessage: "Oh no! That's not the right letter. Try again.",
    });
};