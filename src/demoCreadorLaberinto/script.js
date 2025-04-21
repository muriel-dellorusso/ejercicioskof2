import { PGEvent } from "../shared/pg-event";

/**
 * Represents a maze engine, which is responsible for generating, storing and solving mazes,
 * guaranteeing that the maze is solvable and following the rules of the game:
 * 
 * - The maze must have only one entrance and one exit.
 * - The maze must be surrounded by walls.
 * - The maze must have a solution.
 * 
 * @class
 */
class MazeEngine {
    /**
     * The code representing the entrance in the maze.
     * @type {string}
     */
    ENTRANCE_CODE = "E";

    /**
     * The code representing the exit in the maze.
     * @type {string}
     */
    EXIT_CODE = "X";

    /**
     * The code representing a wall in the maze.
     * @type {string}
     */
    WALL_CODE = "P";

    /**
     * The code representing a path in the maze.
     * @type {string}
     */
    PATH_CODE = "C";

    /**
     * Creates a new instance of the MazeEngine class.
     * @constructor
     * @param {number} rows The number of rows in the maze.
     * @param {number} cols The number of columns in the maze.
     */
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.maze = [];

        this.setEmptyMaze();
    }

    /**
     * Sets an empty maze, with only walls.
     * @returns {Array<Array<string>>} The empty maze.
     */
    /**
     * Sets an empty maze, with only walls.
     * @returns {Array<Array<string>>} The empty maze.
     */
    setEmptyMaze() {
        this.maze = [];
        for (let rowIndex = 0; rowIndex < this.rows; rowIndex++) {
            let row = [];
            for (let columnIndex = 0; columnIndex < this.cols; columnIndex++) {
                // Check if the current cell is on the border
                // If it is on the border, set it as a wall
                // If it is not on the border, set it as a path
                if (rowIndex === 0 || rowIndex === this.rows - 1 || columnIndex === 0 || columnIndex === this.cols - 1) {
                    row.push(this.WALL_CODE);
                } else {
                    row.push(this.PATH_CODE);
                }
            }
            this.maze.push(row);
        }
        return this.maze;
    }

    /**
     * Retrieves all the option codes.
     * @returns {Array<string>} The option codes.
     */
    getAllOptions() {
        return [this.WALL_CODE, this.PATH_CODE, this.ENTRANCE_CODE, this.EXIT_CODE];
    }

    /**
     * Retrieve the available options for a given cell in the maze.
     * @param {number} rowIndex The row index of the cell.
     * @param {number} columnIndex The column index of the cell.
     * @returns {Array<string>} The available options for the cell, using the codes defined in the class (WALL_CODE, PATH_CODE, ENTRANCE_CODE, EXIT_CODE).
     */
    getAvailableOptionsFor(rowIndex, columnIndex) {
        let availableOptions = [];

        // Check if the cell is on the border
        // If it is on the border, it can be a wall, entrance or exit.
        if (rowIndex === 0 || rowIndex === this.rows - 1 || columnIndex === 0 || columnIndex === this.cols - 1) {
            availableOptions.push(this.WALL_CODE);

            // Check if the cell is on the corner
            // If it is on the corner, it can only be a wall.
            if ((rowIndex === 0 || rowIndex === this.rows - 1) && (columnIndex === 0 || columnIndex === this.cols - 1)) {
                return availableOptions;
            }

            // If it is not on the corner, it can be an entrance or exit.

            // Check if the maze already has an entrance.
            if (!this.findPosition(this.ENTRANCE_CODE)) {
                availableOptions.push(this.ENTRANCE_CODE);
            } 

            // Check if the maze already has an exit.
            if (!this.findPosition(this.EXIT_CODE)) {
                availableOptions.push(this.EXIT_CODE);
            }

            return availableOptions;
        }

        // If the cell is not on the border, it can be a path or a wall.
        availableOptions.push(this.PATH_CODE);
        availableOptions.push(this.WALL_CODE);

        return availableOptions;
    }

    /**
     * Sets the value of a cell in the maze.
     * @param {number} rowIndex The row index of the cell.
     * @param {number} columnIndex The column index of the cell.
     * @param {string} value The value to set in the cell.
     */
    setCellValue(rowIndex, columnIndex, value) {
        // Check if the value is valid.
        let availableOptions = this.getAvailableOptionsFor(rowIndex, columnIndex);
        if (!availableOptions.includes(value)) {
            throw new Error(`Invalid value for cell (${rowIndex}, ${columnIndex}): ${value}`);
        }

        // Set the value in the cell.
        this.maze[rowIndex][columnIndex] = value;
    }

    /**
     * Forcibly sets a maze from a given matrix.
     * @param {Array<Array<string>>} maze The maze to set.
     * @returns {Array<Array<string>>} The maze set.
     */
    setMaze(maze) {
        if (maze.length !== this.rows || maze[0].length !== this.cols) {
            throw new Error("Invalid maze dimensions.");
        }

        this.maze = maze;
        return this.maze;
    }

    /**
     * Finds the position of a given code in the maze.
     * @param {string} code The code to find.
     * @returns {Object|null} An object containing the row and column indices of the code, or null if not found.
     */
    findPosition(code) {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.maze[row][col] === code) {
                    return { row, col };
                }
            }
        }
        return null;
    }

    /**
     * Depth-First Search (DFS) algorithm to find if the maze is solvable.
     * @param {number} row The row index of the current cell.
     * @param {number} col The column index of the current cell.
     * @param {Array<Array<boolean>>} visited Matrix to keep track of visited cells.
     * @returns {boolean} True if the maze is solvable, false otherwise.
     */
    dfs(row, col, visited) {
        // Check if the current cell is the exit
        if (this.maze[row][col] === this.EXIT_CODE) {
            return true;
        }

        // Mark the current cell as visited
        visited[row][col] = true;

        // Check all possible directions (up, down, left, right)
        let directions = [
            [-1, 0], // Up
            [1, 0],  // Down
            [0, -1], // Left
            [0, 1]   // Right
        ];

        for (let [dr, dc] of directions) {
            let newRow = row + dr;
            let newCol = col + dc;

            // Check if the new position is within the maze boundaries and not visited yet
            if (newRow >= 0 && newRow < this.rows && newCol >= 0 && newCol < this.cols && !visited[newRow][newCol] && this.maze[newRow][newCol] !== this.WALL_CODE) {
                // Recursively call DFS for the new position
                if (this.dfs(newRow, newCol, visited)) {
                    return true; // If a solution is found, return true
                }
            }
        }

        return false; // If no solution is found from this cell, return false
    }
    
    /**
     * Determines if the maze, in its current state, is solvable.
     * In order to determinate if the maze is solvable, this method uses Depth-First Search (DFS) algorithm.
     * 
     * See more: https://en.wikipedia.org/wiki/Depth-first_search
     * @returns {boolean} True if the maze is solvable, false otherwise.
     */
    isSolvable() {
        // Find the entrance position
        let entrancePosition = this.findPosition(this.ENTRANCE_CODE);
        if (!entrancePosition) {
            throw new Error("Maze has no entrance.");
        }

        // Initialize visited matrix to keep track of visited cells
        let visited = new Array(this.rows).fill(false).map(() => new Array(this.cols).fill(false));

        // Start DFS from the entrance
        return this.dfs(entrancePosition.row, entrancePosition.col, visited);
    }
}

/**
 * Class responsible for rendering a maze using the DOM elements, based on the maze matrix.
 * In this case, the maze is rendered using SELECT elements with the possible options for each cell.
 * @class
 */
class MazeDOMRenderer {
    /**
     * Creates a new instance of the MazeDOMRenderer class.
     * @constructor
     * @param {MazeEngine} mazeEngine The maze engine to render.
     */
    constructor(mazeEngine) {
        this.engine = mazeEngine;

        /**
         * Event handler for when the maze changes.
         * @type {Function}
         */
        this.onChange = () => {};
    }

    /**
     * Renders the maze using the DOM elements.
     * Dear copilot: Check the commented code at the top of the file to see the initial implementation.
     */
    render() {
        // Get the container element to render the maze
        let container = document.getElementById("opcionesLaberinto");
        container.innerHTML = "";

        // Iterate over the maze matrix to render each cell
        // Use a for-of loop to get the row index and the row itself
        for (let [rowIndex, row] of this.engine.maze.entries()) {
            // Create a row element
            let rowElem = document.createElement("DIV");
            rowElem.classList.add("fila-opciones");

            // Iterate over the row to render each cell
            // Use a for-of loop to get the column index and the cell value
            for (let [columnIndex, cellValue] of row.entries()) {
                // Create a cell element
                let cellElem = document.createElement("DIV");
                cellElem.classList.add("celda-opciones");

                // Create a SELECT element with the possible options for the cell
                let selectElem = document.createElement("SELECT");

                // Add an event listener to the SELECT element to update the cell value
                // on each maze change
                selectElem.addEventListener("change", (e) => {
                    this.updateCell(rowIndex, columnIndex, e);
                    this.updateAllCellsOptions();
                    this.onChange();
                })

                // Get the available options for the cell
                let allOptions = this.engine.getAllOptions();
                let availableOptions = this.engine.getAvailableOptionsFor(rowIndex, columnIndex);

                // Iterate over all the options to create an OPTION element for each one.
                for (let option of allOptions) {
                    let optionElem = document.createElement("OPTION");
                    optionElem.innerHTML = option;
                    optionElem.value = option;

                    // If the option is not available, disable it
                    if (!availableOptions.includes(option)) {
                        optionElem.setAttribute("disabled", "true");
                    }

                    // Append the OPTION element to the SELECT element
                    selectElem.appendChild(optionElem);
                }

                // Set the value of the SELECT element to the current cell value
                selectElem.value = cellValue;

                // Append the SELECT element to the cell element
                cellElem.appendChild(selectElem);

                // Append the cell element to the row element
                rowElem.appendChild(cellElem);
            }

            // Append the row element to the container element
            container.appendChild(rowElem);
        }
    }

    /**
     * Updates the value of a cell in the maze.
     * @param {number} rowIndex The row index of the cell.
     * @param {number} columnIndex The column index of the cell.
     * @param {Event} event The event that triggered the update.
     */
    updateCell(rowIndex, columnIndex, event) {
        let selectedValue = event.target.value;
        this.engine.setCellValue(rowIndex, columnIndex, selectedValue);
    }

    /**
     * Updates all the cells options based on the current state of the maze.
     * This method is called when a cell is updated, to disable some options based on the maze rules.
     */
    updateAllCellsOptions() {
        let allSelects = document.querySelectorAll("#opcionesLaberinto select");
        for (let [index, select] of allSelects.entries()) {
            let rowIndex = Math.floor(index / this.engine.cols);
            let columnIndex = index % this.engine.cols;
            let availableOptions = this.engine.getAvailableOptionsFor(rowIndex, columnIndex);
            for (let option of availableOptions) {
                let optionElem = select.querySelector(`option[value="${option}"]`);
                if (optionElem) {
                    optionElem.removeAttribute("disabled");
                }
            }
        }
    }
}

/**
 * Class responsible for transpile the maze to HTML code.
 * In this case, the maze is transpiled to a list of DIV elements with classes representing the maze codes.
 * @class
 */
class MazeHTMLTranspiler {
    /**
     * Creates a new instance of the MazeHTMLTranspiler class.
     * @constructor
     * @param {MazeEngine} mazeEngine The maze engine to transpile.
     */
    constructor(mazeEngine) {
        this.engine = mazeEngine;
    }

    /**
     * Transpiles the maze to HTML code.
     * @returns {string} The HTML code representing the maze.
     * @example
     * // Example of the generated HTML code:
     * // <div class='pared'></div>
     * // <div class='camino'></div>
     * // <div class='entrada'></div>
     * // <div class='salida'></div>
     * // ...
     */
    transpile() {
        let htmlCode = "";
        for (let row of this.engine.maze) {
            for (let cell of row) {
                let alias;
                switch (cell) {
                    case this.engine.WALL_CODE:
                        alias = "pared";
                        break;
                    case this.engine.PATH_CODE:
                        alias = "camino";
                        break;
                    case this.engine.ENTRANCE_CODE:
                        alias = "entrada";
                        break;
                    case this.engine.EXIT_CODE:
                        alias = "salida";
                        break;
                }
                htmlCode += `<div class='${alias}'></div>\n`;
            }
        }
        return htmlCode;
    }
}

const updateCodeViewer = (code) => {
    // Get the code viewer element and set the code
    let codeViewer = document.getElementById("codigoGenerado");
    codeViewer.innerText = code;

    // Highlight the code using the highlight.js library
    hljs.highlightBlock(codeViewer);
}

const copyCode = () => {
    // Get the code viewer element and select its content
    let codeViewer = document.getElementById("codigoGenerado");
    let range = document.createRange();
    range.selectNode(codeViewer);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);

    // Get the selected content
    let code = window.getSelection().toString();

    // Copy the selected content to the clipboard
    navigator.clipboard.writeText(code);
    window.getSelection().removeAllRanges();
}

const updateAnalytics = (mazeEngine) => {
    let wallCount = 0;
    let pathCount = 0;
    let entranceCount = 0;
    let exitCount = 0;

    for (let row of mazeEngine.maze) {
        for (let cell of row) {
            switch (cell) {
                case mazeEngine.WALL_CODE:
                    wallCount++;
                    break;
                case mazeEngine.PATH_CODE:
                    pathCount++;
                    break;
                case mazeEngine.ENTRANCE_CODE:
                    entranceCount++;
                    break;
                case mazeEngine.EXIT_CODE:
                    exitCount++;
                    break;
            }
        }
    }

    document.getElementById("rp").innerText = wallCount;
    document.getElementById("rc").innerText = pathCount;
    document.getElementById("re").innerText = entranceCount;
    document.getElementById("rs").innerText = exitCount;
}

const solveAndSave = (engine, pgEvent) => {
    // Check if the maze is solvable
    const mazeIsSolvable = engine.isSolvable();
    if (mazeIsSolvable) {
        pgEvent.postToPg({
            event: "SUCCESS",
            message: "¡Haz completado y guardado el laberinto!",
            reasons: [],
            state: JSON.stringify({})
        });
    } else {
        pgEvent.postToPg({
            event: "FAILURE",
            message: "Mmm... parece que tu laberinto no tiene solución.",
            reasons: [],
            state: JSON.stringify({})
        })
    }

    // Hide the save note
    document.getElementById("notaDeGuardado").style.display = "none";

    // Return the result of the maze solving
    return mazeIsSolvable;
}

const main = () => {
    // Define the maze dimensions and initial state
    const MAZE_ROWS = 10;
    const MAZE_COLUMNS = 10;
    const INITIAL_MAZE = [
        ["P", "E", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["P", "C", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["P", "C", "C", "P", "P", "P", "P", "P", "P", "P"],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["P", "P", "P", "P", "P", "P", "P", "P", "P", "P"],
        ["P", "P", "P", "P", "P", "P", "P", "X", "P", "P"],
    ];

    const pgEvent = new PGEvent();
    let hasBeenResolved = false;

    // Create instances of the MazeEngine, MazeDOMRenderer and MazeHTMLTranspiler classes
    const engine = new MazeEngine(MAZE_ROWS, MAZE_COLUMNS);
    const renderer = new MazeDOMRenderer(engine);
    const transpiler = new MazeHTMLTranspiler(engine);

    // Set the initial maze, render it, update the code viewer and update the analytics
    engine.setMaze(INITIAL_MAZE);
    renderer.render();
    updateCodeViewer(transpiler.transpile());
    updateAnalytics(engine);
    
    // Add event listeners...
    document.getElementById("copiarCodigoBTN").addEventListener("click", copyCode);
    document.getElementById("guardarCodigoBTN").addEventListener("click", () => {
        hasBeenResolved = solveAndSave(engine, pgEvent);
    });
    renderer.onChange = () => {
        updateCodeViewer(transpiler.transpile());
        updateAnalytics(engine);
        document.getElementById("notaDeGuardado").style.display = "block";

        // Check if the maze can be solved
        const mazeIsSolvable = engine.isSolvable();
        if (hasBeenResolved && !mazeIsSolvable) {
            pgEvent.postToPg({
                event: "FAILURE",
                message: "¡Ups! Parece que has cambiado el laberinto después de haberlo completado.",
                reasons: [],
                state: JSON.stringify({})
            });
            hasBeenResolved = false;
            return
        }

        if (mazeIsSolvable && !hasBeenResolved) {
            pgEvent.postToPg({
                event: "SUCCESS",
                message: "¡Haz completado el laberinto! Recuerda que, si haces nuevos cambios, deberás guardarlos manualmente.",
                reasons: [],
                state: JSON.stringify({})
            });
            hasBeenResolved = true;
        }
    };
}

main();