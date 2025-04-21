import CasitaDigital from "../shared/casita-digital";

window.onload = () => {
    CasitaDigital({
        expectedLetter: "G",
        house: document.getElementById("casa"),
        letter: document.getElementById("mensaje"),
    });
};