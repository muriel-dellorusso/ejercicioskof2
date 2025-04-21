import CasitaDigital from "../shared/casita-digital";

window.onload = () => {
    CasitaDigital({
        expectedLetter: "L",
        house: document.getElementById("casa"),
        letter: document.getElementById("mensaje"),
        successMessage: "Congratulations! You found the right letter!",
        failureMessage: "Oh no! That's not the right letter. Try again.",
    });
};