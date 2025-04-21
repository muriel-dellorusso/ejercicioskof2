import { PGEvent } from "./pg-event.js";

/**
 * Class to handle drag-and-drop functionality for categorizing items.
 */
export class DragDivider {
    
    /**
     * @typedef {Object} ItemConfig
     * @property {HTMLElement} element - The HTML element of the item.
     * @property {string} expectedCategory - The expected category for this item.
     *
     * @typedef {Object} CategoryConfig
     * @property {string} name - The name of the category.
     * @property {HTMLElement} element - The HTML element of the category.
     *
     * @typedef {Object} DragDividerConfig
     * @property {Object} base - Configuration for the base container.
     * @property {HTMLElement} base.element - The HTML element of the base container.
     * @property {ItemConfig[]} base.items - The items within the base container.
     * @property {CategoryConfig[]} categories - The categories where items can be dropped.
     * @property {HTMLElement} verifyButton - Button element to trigger validation.
     * @property {function} [onChange] - Callback executed when the state changes.
     */

    /**
     * @param {DragDividerConfig} config - Initial configuration for the functionality.
     * @throws {Error} Throws an error if the configuration is invalid.
     */
   
    constructor(config) {
        
        if (!config.base || !config.base.element || !config.categories || !config.verifyButton) {
            throw new Error("Invalid configuration: base, categories, and verifyButton are required.");
        }

        this.base = config.base;
        this.categories = config.categories;
        this.onChange = config.onChange;
        this.messages = config.messages;

        config.verifyButton.addEventListener("click", () => this.validateItems());
        const resetButton = document.querySelector(".reset-button");
        if (resetButton) {
            resetButton.addEventListener("click", () => this.resetActivity());
        }

        this.initDraggableItems();
        this.initCategories();
        this.initBase();

        // Load state if available
        this.pgEvent = new PGEvent();
        // this.pgEvent.getValues();
        // console.log(this.pgEvent);
        // console.log(JSON.parse(this.pgEvent));
        // if (this.pgEvent.data.state) {
        //     console.log("Previous state found:", JSON.parse(this.pgEvent.data.state));
        //     this.loadState(JSON.parse(this.pgEvent.data.state));
        // }
    }

    
    /**
     * Initializes the items in the base container to be draggable.
     */
    initDraggableItems() {
        this.base.items.forEach(item => {
            if (!item.element) {
                console.error("Invalid item element", item);
                return;
            }

            item.element.setAttribute("draggable", true);
            item.element.classList.add("item");

            item.element.addEventListener("dragstart", (event) => {
                event.dataTransfer.setData("text/plain", item.element.id);
            });

            // Touch event handlers for tablets
            item.element.addEventListener("touchstart", (event) => this.handleTouchStart(event, item.element));
            item.element.addEventListener("touchmove", (event) => this.handleTouchMove(event));
            item.element.addEventListener("touchend", (event) => this.handleTouchEnd(event));
        });
    }

    /**
     * Configures the categories for dropping items.
     */
    initCategories() {
        this.categories.forEach(category => {
            if (!category.element) {
                console.error("Invalid category element", category);
                return;
            }

            category.element.addEventListener("dragover", (event) => event.preventDefault());
            category.element.addEventListener("drop", (event) => this.handleDrop(event, category));
        });
    }

    /**
     * Configures the base container for returning items.
     */
    initBase() {
        this.base.element.addEventListener("dragover", (event) => event.preventDefault());
        this.base.element.addEventListener("drop", (event) => this.handleDrop(event, this.base));
    }

    /**
     * Handles drop events.
     */
    handleDrop(event, target) {
        event.preventDefault();
        const itemId = event.dataTransfer.getData("text/plain");
        const draggedElement = document.querySelector(`#${itemId}`);
        if (draggedElement) {
            target.element.appendChild(draggedElement);
            this.updateState();
        }
    }

    /**
     * Handles touch start events.
     */
    handleTouchStart(event, element) {
        this.draggedItem = element;
        this.draggedItem.style.opacity = "0.5";
        const touch = event.touches[0];
        this.draggedItem.startX = touch.clientX;
        this.draggedItem.startY = touch.clientY;
    }

    /**
     * Handles touch move events.
     */
    handleTouchMove(event) {
        event.preventDefault();
        const touch = event.touches[0];
        this.draggedItem.style.position = "absolute";
        this.draggedItem.style.left = `${touch.clientX}px`;
        this.draggedItem.style.top = `${touch.clientY}px`;
    }

    /**
     * Handles touch end events.
     */
    handleTouchEnd(event) {
        const touch = event.changedTouches[0];
        const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
        
        if (dropTarget) {
            let validCategory = this.categories.find(category => 
                category.element === dropTarget || dropTarget.closest(`[id='${category.element.id}']`)
                
            );
            // console.log(validCategory);
            
            if (validCategory) {
                validCategory.element.appendChild(this.draggedItem);
            } else {
                this.base.element.appendChild(this.draggedItem);
            }
        }
        
        this.draggedItem.style.opacity = "1";
        this.draggedItem.style.position = "static";
        this.draggedItem = null;
        this.updateState();
    }

    /**
     * Validates the placement of items in categories.
     */
    validateItems() {
        const pgEvent = new PGEvent();
        pgEvent.getValues()
        const state = this.getState();
        // console.log(state);
        
        pgEvent.postToPg({
            event: this.areItemsCorrect() ? "SUCCESS" : "FAILURE",
            message: this.areItemsCorrect() ? this.messages.onSuccess : this.messages.onFail,
            reasons: [],
            state: JSON.stringify(state)
        });
    }
    resetActivity() {
        // Construir el estado inicial: todos los elementos en la base, categorías vacías
        const initialState = {
            base: this.base.items.map(item => item.element.id),
            categories: this.categories.map(category => ({
                name: category.name,
                items: []
            }))
        };
    
        // Mover todos los elementos al contenedor base antes de limpiar las categorías
        this.categories.forEach(category => {
            Array.from(category.element.querySelectorAll(".item")).forEach(item => {
                this.base.element.appendChild(item); // Mover cada elemento a la base
            });
        });
    
        // Limpiar el estado de las categorías y cargar el estado inicial
        this.loadState(initialState);
        
        const pgEvent = new PGEvent();
        pgEvent.getValues()
        // Enviar un evento indicando que se ha realizado el reset
        pgEvent.postToPg({
            event: "FAILURE",
            message: this.messages.onReset,
            reasons: [],
            state: JSON.stringify(initialState)
        });
    
        // console.log("Activity reset successfully:", initialState);
    }
    
    
    
    
    

    /**
     * Returns a boolean indicating if the items are correctly placed in the categories.
     * @returns {boolean} - True if all items are correctly placed, false otherwise.
     */
    areItemsCorrect() {
        let allCorrect = true;

        // Check items in categories
        this.categories.forEach(category => {
            Array.from(category.element.querySelectorAll(".item")).forEach(child => {
                const itemConfig = this.base.items.find(item => item.element === child);

                if (!itemConfig || itemConfig.expectedCategory !== category.name) {
                    allCorrect = false;
                }
            });
        });

        // Check items in the base container
        Array.from(this.base.element.querySelectorAll(".item")).forEach(child => {
            const itemConfig = this.base.items.find(item => item.element === child);

            if (!itemConfig || itemConfig.expectedCategory !== "base") {
                allCorrect = false;
            }
        });

        return allCorrect;
    }

    /**
     * Updates the state and triggers the `onChange` callback if defined.
     */
    updateState() {
        // Get the current state
        const baseElements = Array.from(this.base.element.querySelectorAll(".item"));
        const categoriesState = this.categories.map(category => {
            return {
                name: category.name,
                items: Array.from(category.element.querySelectorAll(".item"))
            };
        });

        // Trigger the callback
        if (this.onChange) {
            this.onChange(baseElements, categoriesState);
        }
    }

    getState() {
        const baseElements = Array.from(this.base.element.querySelectorAll(".item"));
        const categoriesState = this.categories.map(category => {
            return {
                name: category.name,
                items: Array.from(category.element.querySelectorAll(".item")).map(item => item.id) // Usar item.id
            };
        });
        return { base: baseElements.map(item => item.id), categories: categoriesState }; // Usar item.id
    }
    

    /**
     * Load the state of the items and categories.
     * Also it moves the elements to their respective containers in the DOM.
     * 
     * @param {Object} state - The state to load.
     */
    loadState(state) {
    
        // Mover los elementos al contenedor base antes de limpiar
        this.categories.forEach(category => {
            Array.from(category.element.querySelectorAll(".item")).forEach(item => {
                this.base.element.appendChild(item); // Mover los elementos al contenedor base
            });
        });
    
        // Limpiar las categorías y restaurar su contenido
        this.categories.forEach(category => {
            const title = category.element.querySelector(".drop-zone-title");
            category.element.innerHTML = ""; // Limpia el contenido de la categoría
            if (title) {
                category.element.appendChild(title); // Vuelve a agregar el título
            }
        });
    
        // Mover elementos al contenedor base según el estado
        state.base.forEach(itemId => {
            const item = document.getElementById(itemId);
            if (item) {
                this.base.element.appendChild(item);
            } else {
                console.warn(`Item with ID "${itemId}" not found in the DOM.`);
            }
        });
    
        // Mover elementos a las categorías correspondientes
        state.categories.forEach(categoryState => {
            const category = this.categories.find(c => c.name === categoryState.name);
            if (category) {
                categoryState.items.forEach(itemId => {
                    const item = document.getElementById(itemId);
                    if (item) {
                        category.element.appendChild(item);
                    } else {
                        console.warn(`Item with ID "${itemId}" not found for category "${categoryState.name}".`);
                    }
                });
            } else {
                console.warn(`Category "${categoryState.name}" not found.`);
            }
        });
    
    }
    
    
    
}

/**
 * Class to handle drag-and-drop functionality for joining items with connectors.
 */
export class DragJoiner {
    /**
     * @typedef {Object} ItemConfig
     * @property {HTMLElement} element - The HTML element of the item.
     * @property {string} name - The name of the item.
     *
     * @typedef {Object} CategoryConfig
     * @property {string} name - The name of the category.
     * @property {ItemConfig[]} items - The items within the category.
     *
     * @typedef {Object} ConnectorConfig
     * @property {HTMLElement} container - The container element for connectors.
     * @property {string} [color] - The color of the connectors.
     * @property {number} [width] - The width of the connectors.
     * @property {number} [radius] - The radius of the connectors.
     *
     * @typedef {Object} DragJoinerConfig
     * @property {CategoryConfig[]} categories - The categories containing items.
     * @property {Array.<Array.<string>>} expectations - The expected connections between items.
     * @property {ConnectorConfig} connector - Configuration for the connectors.
     * @property {HTMLElement} verifyButton - Button element to trigger validation.
     * @property {function} [onChange] - Callback executed when the state changes.
     */

    /**
     * @param {DragJoinerConfig} config - Initial configuration for the functionality.
     */
    constructor(config) {
        this.categories = config.categories;
        this.expectations = config.expectations;
        this.connectorColor = config.connector.color || "#000000";
        this.connectorWidth = config.connector.width || 2;
        this.connectorRadius = config.connector.radius || 5;
        this.onChange = config.onChange;
        this.connectorsContainer = config.connector.container;
        this.messages = config.messages;
    
        this.connectorsContainer.innerHTML = "";
    
        this.relations = {};
        this.connectorIdCounter = 0;
    
        this.initItems();
        this.setupDraggableItems();
    
        this.pgEvent = new PGEvent();
        // this.pgEvent.getValues();
    
        // if (this.pgEvent.data.state) {
        //     console.log("Loading previous state:", JSON.parse(this.pgEvent.data.state));
        //     this.loadState(JSON.parse(this.pgEvent.data.state));
        // }
    
        this.verifyButton = config.verifyButton;
        this.verifyButton.addEventListener("click", () => this.validateConnections());
    
        // Agregar evento al botón de reinicio
        const resetButton = document.querySelector(".reset-button");
        resetButton.addEventListener("click", () => this.resetActivity());
    }
    

    /**
     * Initialize the items by adding event listeners for dragging.
     */
    initItems() {
        this.categories.forEach(category => {
            category.items.forEach(item => {
                if (item.element) {
                    item.element.addEventListener("mousedown", (e) => this.onItemDragStart(e, item));
                    item.element.addEventListener("touchstart", (e) => this.onItemDragStart(e, item));
                }
            });
        });
    }


    /**
     * Set up mouse move and mouse up events for dragging connectors.
     */
    setupDraggableItems() {
        this.connector = null;
        this.startItem = null;

        document.addEventListener("mousemove", (e) => {
            if (this.connector) {
                this.updateConnectorPosition(e.clientX, e.clientY);
            }
        });
        
        document.addEventListener("mouseup", (e) => {
            if (this.connector) {
                this.finalizeConnector(e);
            }
        });
        
        document.addEventListener("touchmove", (e) => {
            if (this.connector) {
                const touch = e.touches[0];
                this.updateConnectorPosition(touch.clientX, touch.clientY);
            }
        });

        document.addEventListener("touchend", (e) => {
            if (this.connector) {
                this.finalizeConnector(e);
            }
        });
    }

    /**
     * Handles when an item starts being dragged.
     * @param {MouseEvent} e - The mouse event.
     * @param {ItemConfig} item - The item being dragged.
     */
    onItemDragStart(e, item) {
        e.preventDefault();
        this.startItem = item;
        
        const posX = e.touches ? e.touches[0].clientX : e.clientX;
        const posY = e.touches ? e.touches[0].clientY : e.clientY;

        this.connector = document.createElement("div");
        const connectorId = `connector-${this.connectorIdCounter++}`;
        this.connector.id = connectorId;

        this.connector.style.position = "absolute";
        this.connector.style.left = `${posX}px`;
        this.connector.style.top = `${posY}px`;
        this.connector.style.width = "2px";
        this.connector.style.height = "2px";
        this.connector.style.backgroundColor = this.connectorColor;
        this.connector.style.borderRadius = `${this.connectorRadius}px`;

        this.connector.dataset.relationKey = `${this.startItem.name}-${connectorId}`;

        this.connector.startX = posX;
        this.connector.startY = posY;

        this.connectorsContainer.appendChild(this.connector);
    }

    updateConnectorPosition(x, y) {
        if (!this.connector) return;

        const startX = this.connector.startX;
        const startY = this.connector.startY;
        
        const width = x - startX;
        const height = y - startY;
        
        const angle = Math.atan2(height, width) * 180 / Math.PI;

        this.connector.style.width = `${Math.abs(width)}px`;
        this.connector.style.height = "4px";
        this.connector.style.transform = `rotate(${angle}deg)`;
        this.connector.style.transformOrigin = `0% 50%`;
        this.connector.style.left = `${startX}px`;
        this.connector.style.top = `${startY}px`;
    }

    /**
     * Update the position of the connector based on mouse movement.
     * @param {number} x - The x-coordinate of the mouse.
     * @param {number} y - The y-coordinate of the mouse.
     */
    updateConnectorPosition(x, y) {
        if (!this.connector) return;

        const startX = this.connector.startX;
        const startY = this.connector.startY;
        
        const width = x - startX;
        const height = y - startY;
        
        const angle = Math.atan2(height, width) * 180 / Math.PI;

        this.connector.style.width = `${Math.abs(width)}px`;
        this.connector.style.height = "4px";
        this.connector.style.transform = `rotate(${angle}deg)`;
        this.connector.style.transformOrigin = `0% 50%`;
        this.connector.style.left = `${startX}px`;
        this.connector.style.top = `${startY}px`;
    }

    /**
     * Finalize the connection when the mouse is released.
     */
    finalizeConnector(event) {
        const posX = event.changedTouches ? event.changedTouches[0].clientX : event.clientX;
        const posY = event.changedTouches ? event.changedTouches[0].clientY : event.clientY;
        
        const dropTarget = document.elementFromPoint(posX, posY);

        if (!dropTarget || !this.isItemInCategories(dropTarget) || dropTarget === this.startItem.element) {
            this.connectorsContainer.removeChild(this.connector);
            this.connector = null;
            this.startItem = null;
            return;
        }

        const dropTargetItem = this.categories.flatMap(category => category.items).find(item => item.element === dropTarget);

        this.relations[this.connectorIdCounter] = {
            connector: this.connector,
            start: this.startItem,
            target: dropTargetItem
        };
        
        this.updateConnectorPositionForLoadedState(this.connector, this.startItem.element, dropTargetItem.element);
        
        this.connector = null;
        this.startItem = null;
    }

    /**
     * Remove a connector and its associated relation.
     * @param {string} connectorId - The ID of the connector to remove.
     */
    removeConnectorAndRelation(connectorId) {
        const connector = document.getElementById(connectorId);

        // If the connector doesn't exist, exit early
        if (!connector) return;

        connector.parentElement.removeChild(connector);

        // Search and remove the relation associated with the connector
        for (const key in this.relations) {
            const relation = this.relations[key];
            if (relation.connector && relation.connector.id === connectorId) {
                delete this.relations[key];
                break;
            }
        }

        // Trigger onChange callback if defined
        if (this.onChange) {
            this.onChange(this.relations);
        }
    }

    /**
     * Checks if the given element is part of the categories.
     * @param {HTMLElement} element - The element to check.
     * @returns {boolean} - True if the element is part of the categories, false otherwise.
     */
    isItemInCategories(element) {
        return this.categories.some(category => 
            category.items.some(item => item.element === element)
        );
    }

    resetActivity() {
        // Eliminar todas las conexiones
        this.connectorsContainer.innerHTML = "";
        this.relations = {};
    
        // Construir el estado inicial (sin conexiones)
        const initialState = [];
    
        // Enviar el estado inicial al sistema
        const pgEvent = new PGEvent();
        pgEvent.getValues();
        pgEvent.postToPg({
            event: "FAILURE",
            message: this.messages.onReset,
            reasons: [],
            state: JSON.stringify(initialState)
        });
    
        // console.log("Activity reset successfully.");
    }
    
    
    /**
     * Validates the connections between items.
     */
    validateConnections() {
        let allCorrect = true;
        const matchedExpectations = new Set();
    
        for (const key in this.relations) {
            const relation = this.relations[key];
            
            // Verificar si la relación es correcta
            const expectedMatch = this.expectations.find(
                pair => {
                    const isMatch = (pair[0] === relation.start.name && pair[1] === relation.target.name) ||
                        (pair[0] === relation.target.name && pair[1] === relation.start.name);
                    if (isMatch) {
                        matchedExpectations.add(pair);
                    }
                    return isMatch;
                }
            );
    
            if (!expectedMatch) {
                allCorrect = false;
                break;
            }
        }
    
        if (matchedExpectations.size !== this.expectations.length) {
            allCorrect = false;
        }
    
        const pgEvent = new PGEvent();
        pgEvent.getValues();
        let state = this.getState()
        
        pgEvent.postToPg({
            event: allCorrect ? "SUCCESS" : "FAILURE",
            message: allCorrect ? this.messages.onSuccess : this.messages.onFail,
            reasons: [],
            state: JSON.stringify(state) // Guardar el estado al validar
        });
    

    }
    


    getState() {
        return Object.keys(this.relations).map(key => {
            const relation = this.relations[key];
            return {
                start: relation.start.name,
                target: relation.target.name,
                connectorId: relation.connector.id
            };
        });
    }    

    loadState(state) {
        // Limpiar conexiones anteriores
        this.connectorsContainer.innerHTML = "";
        this.relations = {};
        
        // console.log(state);
        
        state.forEach(relation => {
            const startItem = this.categories.flatMap(category => category.items).find(item => item.name === relation.start);
            const targetItem = this.categories.flatMap(category => category.items).find(item => item.name === relation.target);
    
            if (startItem && targetItem) {
                const connector = document.createElement("div");
                connector.id = relation.connectorId;
                connector.style.position = "absolute";
                connector.style.backgroundColor = this.connectorColor;
                connector.style.width = `${this.connectorWidth}px`;
                connector.style.height = `${this.connectorWidth}px`;
                connector.style.borderRadius = `${this.connectorRadius}px`;
                connector.style.cursor = "pointer";
                connector.style.pointerEvents = "auto";
    
                this.connectorsContainer.appendChild(connector);
    
                this.relations[relation.connectorId] = {
                    connector: connector,
                    start: startItem,
                    target: targetItem
                };
    
                this.updateConnectorPositionForLoadedState(connector, startItem.element, targetItem.element);
            }
        });
    }
    

    updateConnectorPositionForLoadedState(connector, startElement, targetElement) {
        const startRect = startElement.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();

        const startX = startRect.left + startRect.width / 2;
        const startY = startRect.top + startRect.height / 2;
        const endX = targetRect.left + targetRect.width / 2;
        const endY = targetRect.top + targetRect.height / 2;

        const width = endX - startX;
        const height = endY - startY;

        const angle = Math.atan2(height, width) * 180 / Math.PI;

        connector.style.width = `${Math.abs(width)}px`;
        connector.style.height = "4px";
        connector.style.transform = `rotate(${angle}deg)`;
        connector.style.transformOrigin = `0% 50%`;
        connector.style.left = `${startX}px`;
        connector.style.top = `${startY}px`;
    }
}
