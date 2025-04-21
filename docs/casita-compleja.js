import { PGEvent } from "./pg-event";

/**
 * Represents a binary exercise UI generator in order to allow the user
 * to find a word by selecting binary values, in a dinamic way.
 * @class
 */
class CasitaDigitalCompleja {
    /**
     * Represents a complex house.
     * @constructor
     * @param {string} expectedWord - The expected word for the house.
     * @param {string} availableChars - The available characters for constructing the house.
     */
    constructor(expectedWord, availableChars) {
        this.expectedWord = expectedWord;
        this.availableChars = availableChars;
    }

    /**
     * Create the UI elements.
     * @param {HTMLElement} container - The container element for the CasitaCompleja object.
     * @param {HTMLElement} preview - The preview element for the CasitaCompleja object.
     * @param {Array<Array<string>>} binaryArray - The binary array.
     * @param {Function} onBinaryStringChange - The function that will be called when the user changes the binary string.
     * @returns {void}
     */
    createUI(container, preview, binaryArray, onBinaryStringChange) {
        const binaryString = binaryArray.flat().join("");
        const obtainedWord = this.binaryStringToWord(binaryString);
        const obtainedWordChars = obtainedWord.split("");
        
        // Create the UI elements
        this.generateBinarySelects(container, onBinaryStringChange);
        this.createPreview(preview, obtainedWordChars);
    }

    /**
     * Dado un string binario, devuelve el char correspondiente
     * del array availableChars o "_" si no se encuentra.
     * @param {string} binaryString
     * @returns {string} char de availableChars o "_"
     */
    binaryStringToChar(binaryString) {
        const index = parseInt(binaryString, 2);
        return this.availableChars[index] !== undefined ? this.availableChars[index] : "_";
    }

    /**
     * Returns the amount of bits needed to represent the entire
     * availableChars array
     * @returns {number} amount of bits
     */
    getBitsNeeded() {
        return Math.ceil(Math.log2(this.availableChars.length));
    }

    /**
     * Given a binary string, it returns the corresponding word
     * @param {string} binaryString
     * @returns {string} word
     */
    binaryStringToWord(binaryString) {
        const bitsNeeded = this.getBitsNeeded();
        const word = [];
        for (let i = 0; i < binaryString.length; i += bitsNeeded) {
            const charBinary = binaryString.slice(i, i + bitsNeeded);
            word.push(this.binaryStringToChar(charBinary));
        }
        return word.join("");
    }

    /**
     * Given a word, it returns the corresponding binary string
     * @param {string} word
     * @returns {string} binary string
     */
    wordToBinaryString(word) {
        const bitsNeeded = this.getBitsNeeded();
        const binaryString = [];
        for (const element of word) {
            const char = element;
            const charIndex = this.availableChars.indexOf(char);
            const charBinary = charIndex.toString(2).padStart(bitsNeeded, "0");
            binaryString.push(charBinary);
        }
        return binaryString.join("");
    }

    /**
     * Get the binary string from the SELECT elements
     * @param {HTMLElement} container
     * @returns {Array<Array<string>>} Array of chars, each one with an array of bits.
     */
    getBinaryStringFromSelects(container) {
        const selects = container.querySelectorAll(".binary-select__select");
        const bitsNeeded = this.getBitsNeeded();
        const binaryString = [];
        for (let i = 0; i < selects.length; i += bitsNeeded) {
            const charBinary = [];
            for (let j = 0; j < bitsNeeded; j++) {
                charBinary.push(selects[i + j].value);
            }
            binaryString.push(charBinary);
        }
        return binaryString;
    }

    /**
     * Create the preview element structure.
     * 
     * It generates the following HTML structure in the given parent element:
     * <div class="char-preview">
     *   <span class="char-preview__char">A</span>
     * </div>
     * 
     * @param {HTMLElement} parent - The parent element
     * @param {Array<string>} obtainedWordChars - The obtained word chars
     * @returns {void}
     */
    createPreview(parent, obtainedWordChars) {
        obtainedWordChars.map((char) => {
            const charDiv = document.createElement("div");
            charDiv.classList.add("char-preview");

            const charSpan = document.createElement("span");
            charSpan.classList.add("char-preview__char");
            charSpan.textContent = char;

            charDiv.appendChild(charSpan);
            parent.appendChild(charDiv);
        });
    }

    /**
     * Updates the preview element with the obtained word
     * 
     * It generates the following HTML structure in the given parent element:
     * <div class="char-preview">
     *    <span class="char-preview__char">A</span>
     * </div>
     * 
     * @param {HTMLElement} preview - The preview element
     * @param {Array<Array<string>>} binaryArray - The binary array
     * @returns {void}
     */
    updatePreview(preview, binaryArray) {
        const binaryString = binaryArray.flat().join("");
        const obtainedWord = this.binaryStringToWord(binaryString);

        // Split the obtained word into an array of chars
        const obtainedWordChars = obtainedWord.split("");

        // Get the preview elements
        const previewElements = preview.querySelectorAll(".char-preview__char");

        // Update the preview elements with the obtained word chars
        obtainedWordChars.forEach((char, index) => {
            previewElements[index].textContent = char;
        });
    }

    /**
     * Generate a collection of SELECT elements for binary strings,
     * in order to generate the expected word.
     * 
     * When the user selects a value from a SELECT element, the
     * onBinaryStringChange function is called.
     * 
     * It generates the SELECT elements inside the container element,
     * in the following format:
     *  <div class="binary-select">
     *      <div class="binary-select__char">
     *          <select class="binary-select__select">
     *              <option value="0">0</option>
     *              <option value="1">1</option>
     *         </select>
     *         <!-- more SELECT elements, one for each char bit -->
     * 
     *         <p class="binary-select__char-preview">A</p>
     *     </div>
     *    <!-- more divs, one for each char -->
     * </div>
     * 
     * @param {HTMLElement} container
     * @param {Function} onBinaryStringChange
     */
    generateBinarySelects(container, onBinaryStringChange) {
        // Well... here we go.

        // First, check how many chars we have in the expected word
        const expectedWordChars = this.expectedWord.split("");

        // Then, we create a div for each char
        expectedWordChars.map((char) => {
            // Create the div for the char
            const charDiv = document.createElement("div");
            charDiv.classList.add("binary-select__char");

            // Then, we need to calculate the amount of bits needed
            // to represent the available chars.
            const bitsNeeded = this.getBitsNeeded();

            // Now, we create a SELECT element for each bit, with 0 and 1 values.
            const selects = [];
            for (let i = 0; i < bitsNeeded; i++) {
                const select = document.createElement("select");
                select.classList.add("binary-select__select");

                // Add the options (0 and 1 are the only options)
                const options = ["0", "1"];
                options.forEach((optionValue) => {
                    const option = document.createElement("option");
                    option.value = optionValue;
                    option.text = optionValue;
                    select.appendChild(option);
                });

                // Add the event listener
                select.addEventListener("change", (e) => {
                    // Update the class for the select.
                    this.toggleSelect(select);

                    // Call the custom event listener.
                    onBinaryStringChange(this.getBinaryStringFromSelects(container));
                });

                // Append the select to the char div
                charDiv.appendChild(select);
                selects.push(select);
            }

            // Append the char div to the container
            container.appendChild(charDiv);
        });
    }

    /**
     * Toggle the class "binary-select__select--selected" for a SELECT element
     * @param {HTMLElement} select
     * @returns {void}
     */
    toggleSelect(select) {
        if (select.value === "1") {
            select.classList.add("binary-select__select--selected");
        } else {
            select.classList.remove("binary-select__select--selected");
        }
    }

    /**
     * Given a binary array, it sets the SELECT elements to the
     * corresponding values.
     * For example, given the binary array [[0, 1], [1, 0]].
     * 
     * @param {HTMLElement} container
     * @param {Array<Array<string>>} binaryArray
     * @returns {void}
     */
    setBinarySelects(container, binaryArray) {
        const selects = container.querySelectorAll(".binary-select__select");
        for (let i = 0; i < binaryArray.length; i++) {
            const charBinary = binaryArray[i];
            for (let j = 0; j < charBinary.length; j++) {
                selects[i * charBinary.length + j].value = charBinary[j];
            }
        }

        // Update the class for the selects.
        selects.forEach((select) => {
            this.toggleSelect(select);
        });
    }
}

/**
 * Creates a CasitaCompleja object.
 *
 * @param {Object} params - The parameters for creating a CasitaCompleja object.
 * @param {string} params.initialWord - The initial word shown by default.
 * @param {string} params.expectedWord - The word the user needs to find. Not used if free mode is enabled.
 * @param {boolean} params.isFreeMode - Indicates if the user is in free mode, allowing unrestricted changes.
 * @param {Function} params.onHouseChange - Callback function called when the house changes.
 * @param {HTMLElement} params.container - The container element for the CasitaCompleja object.
 * @param {HTMLElement} params.preview - The preview element for the CasitaCompleja object.
 * @param {String} params.successMessage - The success message to show when the user finds the word. If not provided, a default message will be used.
 * @param {String} params.failureMessage - The failure message to show when the user doesn't find the word. If not provided, a default message will be used.
 */
// --- Funciones de espera del mensaje del backend ---
const isValidInitialEvent = (event) => {
    return (
      event?.data?.data &&
      event?.data?.type === "init" &&
      typeof event.data.data === "string"
    );
  };
  
  async function waitForMessage(timeout = 5000) {
    return new Promise((resolve) => {
      const timer = setTimeout(() => {
        window.removeEventListener("message", handler);
        resolve(null); // Resuelve con null si ocurre el timeout
      }, timeout);
      function handler(event) {
        if (isValidInitialEvent(event)) {
          clearTimeout(timer);
          window.removeEventListener("message", handler);
          resolve(event.data.data); // Resuelve con la información recibida
        }
      }
      window.addEventListener("message", handler);
    });
  }
  
  // --- Inicialización de la actividad ---
  const CasitaCompleja = async (params) => {
    const defaultSuccessMessage = "¡Bien hecho! Has encontrado la letra correcta.";
    const defaultFailureMessage = "¡Oh no! Esa no es la palabra correcta. Inténtalo de nuevo.";
  
    const availableChars = [
      "?", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
      "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    ];
    const expectedWord = params.expectedWord.toUpperCase();
    const pgEvent = new PGEvent();
    let hasSucceded = false;
  
    const generator = new CasitaDigitalCompleja(expectedWord, availableChars);
    const calculateResults = (allSelects) => {
      const bitsNeeded = generator.getBitsNeeded();
      return Array.from({ length: Math.ceil(allSelects.length / bitsNeeded) }, (_, i) => {
        const group = Array.from(allSelects).slice(i * bitsNeeded, (i + 1) * bitsNeeded);
        const actualChar = generator.binaryStringToChar(
          group.map(select => select.value).join("")
        );
        return {
          index: (i + 1).toString(),
          htmlElement: group[0].closest(".binary-select__char"),
          isOK: actualChar === expectedWord[i],
          actualChar: actualChar,
        };
      });
    };
  
    // Función que se llama cada vez que el usuario completa un char
    const evaluateWord = async (binaryArray) => {
      console.log(binaryArray);
      const binaryString = binaryArray.flat().join("");
      const obtainedWord = generator.binaryStringToWord(binaryString);
  
      if (params.onHouseChange) {
        const allSelects = params.container.querySelectorAll(".binary-select__select");
        const results = calculateResults(allSelects);
        params.onHouseChange(results);
      }
  
      // En free mode solo se actualiza la preview
      if (params.isFreeMode) {
        generator.updatePreview(params.preview, binaryArray);
        return;
      }
  
      const eventType = obtainedWord !== expectedWord ? "FAILURE" : "SUCCESS";
      const message = obtainedWord !== expectedWord
        ? params.failureMessage || defaultFailureMessage
        : params.successMessage || defaultSuccessMessage;
      pgEvent.postToPg({
        event: eventType,
        message,
        reasons: [],
        state: JSON.stringify({ selectors: binaryString })
      });
  
      hasSucceded = obtainedWord === expectedWord;
      generator.updatePreview(params.preview, binaryArray);
    };
  
    pgEvent.getValues();
    // Espera al mensaje asíncrono del backend antes de generar la UI
    let savedState = await waitForMessage();
    let binaryArray;
  
    if (savedState) {
      // Si se recibió un dato, lo parseamos
      let parsedState = JSON.parse(savedState);
      // Si el dato guardado es válido (distinto de "not-started")
      if (parsedState.data !== "not-started" && parsedState.selectors) {
        const binaryStringData = parsedState.selectors;
        const bitsNeeded = generator.getBitsNeeded();
        binaryArray = [];
        // Reconstruir el array a partir de la cadena guardada
        for (let i = 0; i < binaryStringData.length; i += bitsNeeded) {
          const group = binaryStringData.substring(i, i + bitsNeeded).split('');
          binaryArray.push(group);
        }
      }
    }
  
    // Si no se recibió estado o se recibió "not-started", usar el estado por defecto
    if (!binaryArray) {
      const defaultBinaryString = generator.wordToBinaryString(
        params.initialWord?.toUpperCase() || expectedWord.replace(/[A-Z]/g, "?")
      );
      const bitsNeeded = generator.getBitsNeeded();
      binaryArray = [];
      for (let i = 0; i < defaultBinaryString.length; i += bitsNeeded) {
        const group = defaultBinaryString.slice(i, i + bitsNeeded).split('');
        binaryArray.push(group);
      }
    }
  
    // Construir la UI usando el array resultante (ya sea desde estado guardado o por defecto)
    generator.createUI(params.container, params.preview, binaryArray, evaluateWord);
    generator.setBinarySelects(params.container, binaryArray);
    generator.updatePreview(params.preview, binaryArray);
  
    if (params.onHouseChange) {
      const allSelects = params.container.querySelectorAll(".binary-select__select");
      const results = calculateResults(allSelects);
      params.onHouseChange(results);
    }
  };
  


/**
 * Represents a CasitaCompleja object, with static generation and free mode.
 * @param {Object} params - The parameters for creating a CasitaCompleja object.
 * @param {number} params.housesAmount - The amount of houses to generate.
 * @param {HTMLElement} params.container - The container element for the CasitaCompleja object.
 * @param {HTMLElement} params.preview - The preview element for the CasitaCompleja object.
 * @param {Function} params.onHouseChange - The function that will be called when the user changes the house.
 */
const FreeStaticCasitaCompleja = (params) => {
    CasitaCompleja({
        expectedWord: "?".repeat(params.housesAmount),
        isFreeMode: true,
        container: params.container,
        preview: params.preview,
        onHouseChange: params.onHouseChange,
    });
};

export default CasitaCompleja;
export { FreeStaticCasitaCompleja };