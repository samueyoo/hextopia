import { INVALID_MOVE } from "boardgame.io/core"; //If a move is invalid (like clicking a cell someone has already clicked) we can let the framework by returning this special constant

//Helper functions
function IsVictory(cells) {
    const positions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    const isRowComplete = row => {
        const symbols = row.map(i => cells[i]);
        return symbols.every(i => i !== null && i === symbols[0]);
    };
    //Iterate through each of the position's "rows" (three element arrays)
        //Within each position's elements:
            //Create a new array by mapping the three element array (row)
                //Each map iteration will take the row array's current value and use it as the index value of the cells array
                //e.g., [0, 1, 2] will end up mapping cells[0], cells[1], cells[2] => Array[playerID who clicked on cell 0, playerID who clicked on cell 1... etc]
            //Check if new array has a value in each element && each value if === to the value of the first element of this new array
            //e.g., if the newly created array is: [1, 1, 1] then symbols[0] is 1; if every symbol is the same, then we return TRUE
    return positions.map(isRowComplete).some(i => i === true); //I guess positions.map method can pass in the row parameter to isRowComplete?
}

function IsDraw(cells) {
    //A comparison if the length of cells after filtering for all the elements === null
    //Since if all the cells are occupied, the returned array from filter will be empty, meaning the .length === 0
    return cells.filter(c => c === null).length === 0;
}

export const TicTacToe = { //TicTacToe is an object with each property's value a function of some sort?
    //Function to initialize the start of the game
    setup: () => ({ //Calling setup will return an object with a cells property of 9 element array filled with null values
        cells: Array(9).fill(null) //Creates a 9 element array filled with null values under a "cells" property
    }),

    turn: { 
        minMoves: 1, //Sets the max amount of functions called from "moves" before the turn automatically ends
        maxMoves: 1, //Sets the minimum amount of moves called players HAVE to make before being able to endTurn
    },

    moves: { //Sets up the different moves under the moves property
        clickCell: ({ G, playerID }, id) => { //Takes the game state (G) object, the playerID which identifies the player making the move, and the id which specifies the cell
            if (G.cells[id]) { //Even if playerID is 0, and so gets assigned to a cell, returns truthy? So this still works somehow?
                return INVALID_MOVE;
            }
            G.cells[id] = playerID;
        },
        changeAllCells: ({ G, playerID }, value) => { //Test function
            for (let i = 0; i < G.cells.length; i++) { 
                G.cells[i] = value;
            }
            // G.cells.forEach(cell => { //forEach does not seem to work; the for loop above does though
            //     cell = `test change: ${value}`;
            // })
        }
    },

    //endIf takes a function to determine if the game is over
    //If it returns anything at all, the game ends and the return value is available at ctx.gameover
    endIf: ({ G, ctx }) => { //Checks if either condition returns true
        if (IsVictory(G.cells)) {
            return { winner: ctx.currentPlayer };
        }
        if (IsDraw(G.cells)) {
            return { draw: true };
        }
    },
};