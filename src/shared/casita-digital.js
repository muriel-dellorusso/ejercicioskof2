import { PGEvent } from "./pg-event";

/**
 * Valida que el mensaje recibido tenga el formato esperado.
 * @param {MessageEvent} event 
 * @returns {boolean}
 */
const isValidInitialEvent = (event) => {
  return (
    event?.data?.data &&
    event?.data?.type === "init" &&
    typeof event.data.data === "string"
  );
};

/**
 * Espera un mensaje del backend con un timeout (por defecto 5000 ms).
 * @param {number} timeout 
 * @returns {Promise<string|null>} Resuelve con el dato recibido o null si se agota el tiempo.
 */
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

/**
 * The HouseController object controls the behavior and functionality of a house.
 * @typedef {Object} HouseController
 * @property {HTMLElement} houseContainer - The container element where the house is displayed.
 * @property {HTMLElement} messageElement - The HTML element where the message is displayed.
 * @property {function} updateText - Updates the text of an HTML element with a message character based on the given message number.
 * @property {function} updateMessage - Updates the message based on the state of the lights.
 * @property {function} createLights - Creates select elements for lights and appends them to the corresponding elements on the page.
 * @property {function} createHouse - Creates a house based on the provided squares array.
 * @property {function} init - Initializes the HouseController object with the provided parameters.
 */
const HouseController = {
  /**
   * The container element where the house is displayed.
   * @type {HTMLElement}
   */
  houseContainer: null,

  /**
   * The HTML element where the message is displayed.
   * @type {HTMLElement}
   */
  messageElement: null,

  /**
   * The collection of lights.
   * @type {HTMLCollection}
   */
  lights: [],

  /**
   * On change event handler for the lights.
   * @param {HTMLCollection} lights - The collection of lights.
   */
  onLightsChange: (lights) => { },

  /**
   * The available characters for the message.
   * @type {Array<string>}
   */
  availableChars: [
    " ", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N",
    "Ñ", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
    ".", ",", "!", "?"
  ],

  /**
   * Sets the value of the lights (selects), based on a 0-1 array.
   * @param {Array<number>} lightsValues - The array of values for the lights.
   */
  setLightsValues: (lightsValues) => {
    for (let i = 0; i < lightsValues.length; i++) {
      HouseController.lights[i].value = lightsValues[i];
    }
    HouseController.updateMessage();
  },

  /**
   * Translate the lights values to a message, based on the available characters.
   * @param {HTMLCollection} lights - The collection of lights.
   * @returns {string} The message based on the lights values.
   */
  translateLightsToMessage: (lights) => {
    let message = "";
    for (let light of lights) {
      message += light.value;
    }
    let messageNumber = parseInt(message, 2); // Binary to decimal
    return HouseController.availableChars[messageNumber];
  },

  /**
   * Translate the message to lights values, based on the available characters.
   * @param {string} message - The message to translate to lights values.
   * @returns {Array<number>} The lights values based on the message.
   */
  translateMessageToLights: (message) => {
    let messageNumber = HouseController.availableChars.indexOf(message);
    let binaryMessage = messageNumber.toString(2);
    let numLights = HouseController.lights.length;
    let missingZeros = numLights - binaryMessage.length;
    for (let i = 0; i < missingZeros; i++) {
      binaryMessage = "0" + binaryMessage;
    }
    return binaryMessage.split("").map((value) => parseInt(value));
  },

  /**
   * Updates the text of an HTML element with a message character based on the given message number.
   * @param {number} messageNumber - The index of the character in the availableChars array.
   */
  updateText: (messageNumber) => {
    const message = HouseController.availableChars[messageNumber];
    HouseController.messageElement.textContent = message === undefined ? "?" : message;
  },

  /**
   * Updates the message based on the state of the lights.
   */
  updateMessage: () => {
    window.scrollTo(0, 10000);
    let message = "";
    for (let light of HouseController.lights) {
      let value = light.value;
      message += value;
      if (value === "1") {
        light.classList.add("binary-select__select--selected");
      } else {
        light.classList.remove("binary-select__select--selected");
      }
    }
    let messageNumber = parseInt(message, 2);
    HouseController.updateText(messageNumber);
  },

  /**
   * Creates select elements for lights and appends them to the corresponding elements on the page.
   * @returns {void}
   */
  createLights: () => {
    let numLights = Math.ceil(Math.log2(HouseController.availableChars.length));
    let lightsContainer = document.createElement("div");

    for (let i = 0; i < numLights; i++) {
      let selectElement = document.createElement("SELECT");
      selectElement.classList.add("binary-select__select");

      selectElement.addEventListener("change", () => {
        HouseController.onLightsChange(HouseController.lights);
        HouseController.updateMessage();
      });

      let elemOption0 = document.createElement("OPTION");
      elemOption0.innerHTML = "0";
      elemOption0.value = "0";
      selectElement.appendChild(elemOption0);

      let elemOption1 = document.createElement("OPTION");
      elemOption1.innerHTML = "1";
      elemOption1.value = "1";
      selectElement.appendChild(elemOption1);

      lightsContainer.appendChild(selectElement);
      HouseController.lights.push(selectElement);
    }

    HouseController.houseContainer.appendChild(lightsContainer);
  },

  /**
   * Initializes the HouseController object with the provided parameters.
   * @param {HTMLElement} houseContainer - The container element where the house will be created.
   * @param {HTMLElement} whereToWrite - The HTML element where the message will be displayed.
   * @param {function} onLightsChange - The event handler for the lights.
   */
  init: (houseContainer, whereToWrite, onLightsChange) => {
    HouseController.houseContainer = houseContainer;
    HouseController.messageElement = whereToWrite;
    HouseController.onLightsChange = onLightsChange;
    HouseController.createLights();
  },
};

/**
 * Class that represents a timer to execute actions after a set time.
 */
export class Timer {
  /**
   * Creates a new timer.
   * @param {number} duration - Duration in milliseconds.
   * @param {function} callback - Function to execute when the timer ends.
   */
  constructor(duration, callback) {
    this.duration = duration;
    this.callback = callback;
    this.timer = null;
  }

  /**
   * Starts the timer.
   */
  start() {
    this.stop();
    this.timer = setTimeout(() => {
      this.callback();
      this.start();
    }, this.duration);
  }

  /**
   * Stops the timer.
   */
  stop() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  /**
   * Resets the timer.
   */
  reset() {
    this.stop();
    this.start();
  }
}

/**
 * Main function that initializes CasitaDigital, incorporates PGEvent for state recovery,
 * and sends events to the backend when the user changes the value of a light.
 * 
 * @param {Object} params - Initialization parameters.
 * @param {string} params.initialLetter - Initial letter to display.
 * @param {string} params.expectedLetter - Expected letter the user must find.
 * @param {boolean} params.isFreeMode - Indicates if it's free mode.
 * @param {HTMLElement} params.house - Container where the house will be created.
 * @param {HTMLElement} params.letter - Element where the message is displayed.
 * @param {String} params.successMessage - Success message.
 * @param {String} params.failureMessage - Failure message.
 */
const CasitaDigital = async (params) => {
  const defaultSuccessMessage = "¡Felicidades! Has encontrado la letra correcta.";
  const defaultFailureMessage = "¡Oh no! Esa no es la letra correcta. Inténtalo de nuevo.";

  const { expectedLetter, house, letter: messageElement } = params;

  let areTherePendingChanges = false;
  let hasUserMetTheChallengeBefore = false;

  const hasApproved = (houseController, lights) =>
    houseController.translateLightsToMessage(lights) === expectedLetter;

  const saveState = (houseController, lights) => {
    if (!areTherePendingChanges) {
      console.log("No hay cambios pendientes.");
      return;
    }

    const messageMatches = hasApproved(houseController, lights);
    const message =
      messageMatches
        ? params.successMessage || defaultSuccessMessage
        : params.failureMessage || defaultFailureMessage;

    pgEvent.postToPg({
      event: messageMatches ? "SUCCESS" : "FAILURE",
      message,
      reasons: [],
      state: JSON.stringify({
        lights: Array.from(lights).map((light) => parseInt(light.value)),
      }),
    });

    areTherePendingChanges = false;
    hasUserMetTheChallengeBefore = messageMatches;
  };

  const pgEvent = new PGEvent();

  const houseController = Object.create(HouseController);

  const timer = new Timer(8000, () =>
    saveState(houseController, houseController.lights)
  );
  timer.start();

  houseController.init(house, messageElement, (lights) => {
    if (params.isFreeMode) {
      return;
    }
    areTherePendingChanges = true;
    timer.reset();

    const userHasMetTheChallenge = hasApproved(houseController, lights);
    if (userHasMetTheChallenge === hasUserMetTheChallengeBefore) {
      return;
    }
    saveState(houseController, lights);
  });

  pgEvent.getValues();
  let lightsState = await waitForMessage();
  lightsState = lightsState ? JSON.parse(lightsState) : null;

  // Si no se recibe estado o se recibe "not-started", se usa el estado por defecto.
  if (lightsState && lightsState.lights && lightsState.data !== "not-started") {
    houseController.setLightsValues(lightsState.lights);
  } else {
    const initialLetter = params.initialLetter || " ";
    houseController.setLightsValues(
      houseController.translateMessageToLights(initialLetter)
    );
  }
};

export default CasitaDigital;