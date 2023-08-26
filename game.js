class Game {
    constructor() {
        this.boardSize = 100;

        this.playerTurnElement = document.getElementById('playerTurn');
        this.dieRollElement = document.getElementById('dieRoll');
        this.boardElement = document.getElementById('board');
        this.positionElement = document.getElementById('position');
        this.messageElement = document.getElementById('message');
        this.rollButton = document.getElementById('rollButton');

        this.positionElements = [
            document.getElementById('position1'),
            document.getElementById('position2')
        ];

        // Create the cells of the game board
        for (let i = 0; i < this.boardSize; i++) {
            let cell = document.createElement('div');

            // Calculate the correct number for the cell
            let row = Math.floor(i / 10);
            let col = i % 10;
            let number;

            if (row % 2 !== 0) {
                number = (9 - row) * 10 + (col + 1);
            } else {
                number = (9 - row) * 10 + (10 - col);
            }

            // Create a text node with the number of the square and append to the cell
            let cellNumber = document.createTextNode(number);
            cell.appendChild(cellNumber);
            
            // Append the cell to the board
            this.boardElement.appendChild(cell);
        }

        // Set up the players
        this.createPlayers();

        this.currentPlayerIndex = 0;

        // Initialize the current player's turn display
        this.playerTurnElement.textContent = this.currentPlayerIndex + 1;

        this.boardSize = 100;
        this.snakes = {
            39: 2,
            42: 17,
            26: 4,
            53: 30,
            65: 44,
            75: 57,
            88: 52,
            98: 40
        };
        this.ladders = {
            3: 24,
            12: 45,
            32: 48,
            49: 68,
            41: 62,
            61: 80,
            73: 91
        };

        this.rollButton.addEventListener('click', () => {
            this.movePlayer();
        });

        this.updatePlayerPosition();
    }


    createPlayers() {
        this.players = [
            { position: 0, element: this.createPlayerElement('piece_robo1.png') },
            { position: 0, element: this.createPlayerElement('piece_robo2.png') }
        ];
    }

    createPlayerElement(imageSrc) {
        let playerElement = document.createElement('img');
        playerElement.src = imageSrc;
        playerElement.className = 'player';
        this.boardElement.appendChild(playerElement); 
        return playerElement;
    }

    updatePlayerPosition() {
        for (let player of this.players) {
            let row = Math.floor(player.position / 10);
            let col = player.position % 10;

            if (row % 2 === 0) {
                player.element.style.left = `${col * 52}px`; // 52 accounts for cell size + gap
                player.element.style.top = `${(9 - row) * 52}px`; // 52 accounts for cell size + gap
            } else {
                player.element.style.left = `${(9 - col) * 52}px`; // 52 accounts for cell size + gap
                player.element.style.top = `${(9 - row) * 52}px`; // 52 accounts for cell size + gap
            }
        }
    }


    rollDie() {
        return Math.floor(Math.random() * 6) + 1;
    }

    async movePlayer() {
        let dieRoll = this.rollDie();
        this.dieRollElement.textContent = dieRoll; // display die roll
        let finalPosition = this.players[this.currentPlayerIndex].position + dieRoll;

        // Limit the position to not exceed the boardSize - 1 (99)
        finalPosition = Math.min(finalPosition, this.boardSize - 1);

        // Animate the movement one step at a time
        while (this.players[this.currentPlayerIndex].position < finalPosition) {
            this.players[this.currentPlayerIndex].position++;
            this.players[this.currentPlayerIndex].position = Math.min(this.players[this.currentPlayerIndex].position, this.boardSize - 1);  // Don't exceed boardSize - 1
            this.updatePlayerPosition();
            this.positionElements[this.currentPlayerIndex].textContent = this.players[this.currentPlayerIndex].position + 1; // Adjust for 0-indexing
            await new Promise(resolve => setTimeout(resolve, 500));  // Delay for half a second
        }

        // After animation, check if we landed on a snake or ladder, move to new position
        let playerLandedOnSnakeOrLadder;
        do {
            playerLandedOnSnakeOrLadder = false;
            if (this.players[this.currentPlayerIndex].position in this.snakes) {
                this.players[this.currentPlayerIndex].position = this.snakes[this.players[this.currentPlayerIndex].position];
                playerLandedOnSnakeOrLadder = true;
            } else if (this.players[this.currentPlayerIndex].position in this.ladders) {
                this.players[this.currentPlayerIndex].position = this.ladders[this.players[this.currentPlayerIndex].position];
                playerLandedOnSnakeOrLadder = true;
            }
            this.updatePlayerPosition();
            this.positionElements[this.currentPlayerIndex].textContent = this.players[this.currentPlayerIndex].position + 1;
        } while (playerLandedOnSnakeOrLadder);

        // If the current player has won
        if (this.checkWin()) {
            this.messageElement.textContent = `Player ${this.currentPlayerIndex + 1} has won the game!`;
            this.rollButton.disabled = true;
        } else {
            // Update the display for the current player's turn
            this.playerTurnElement.textContent = this.currentPlayerIndex === 0 ? 2 : 1;

            // Switch to the next player
            this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;

            // Update position for the next player
            this.positionElements[this.currentPlayerIndex].textContent = this.players[this.currentPlayerIndex].position + 1;
        }
    }



    checkWin() {
         return this.players[this.currentPlayerIndex].position >= this.boardSize - 1; // it should be compared with 99, not 100
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
});
