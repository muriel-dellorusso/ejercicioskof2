import CasitaDigital from "../shared/casita-digital";

window.onload = () => {
    CasitaDigital({
        expectedLetter: "L",
        house: document.getElementById("casa"),
        letter: document.getElementById("mensaje"),
    });
};