const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const restartBtn = document.getElementById('restartBtn');

// --- AUDIO SETUP ---
const audioMoveP1 = new Audio('player1_move.mp3'); 
const audioMoveP2 = new Audio('player2_move.mp3'); 
const audioWinP1  = new Audio('player1_win.mp3');  // <--- Player 1 Win
const audioWinP2  = new Audio('player2_win.mp3');  // <--- Player 2 Win
const audioDraw   = new Audio('draw.mp3'); 

let gameActive = true;
let currentPlayer = "X";
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

const winningMessage = () => `Player ${currentPlayer} has won!`;
const drawMessage = () => `Game ended in a draw!`;
const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

statusDisplay.innerHTML = currentPlayerTurn();

function handleCellPlayed(clickedCell, clickedCellIndex) {
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());
    clickedCell.setAttribute('data-mark', currentPlayer);
    clickedCell.innerText = currentPlayer;

    // Play move sound
    if (gameActive) {
        if (currentPlayer === "X") {
            audioMoveP1.currentTime = 0;
            audioMoveP1.play();
        } else {
            audioMoveP2.currentTime = 0;
            audioMoveP2.play();
        }
    }
}

function handlePlayerChange() {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.innerHTML = currentPlayerTurn();
}

function handleResultValidation() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i <= 7; i++) {
        const winCondition = winningConditions[i];
        const a = gameState[winCondition[0]];
        const b = gameState[winCondition[1]];
        const c = gameState[winCondition[2]];

        if (a === '' || b === '' || c === '') {
            continue;
        }
        if (a === b && b === c) {
            roundWon = true;
            winningCells = winCondition;
            break;
        }
    }

    if (roundWon) {
        statusDisplay.innerHTML = winningMessage();
        gameActive = false;
        highlightWinningCells(winningCells);
        
        // --- CHECK WHO WON AND PLAY THEIR SOUND ---
        if (currentPlayer === "X") {
            audioWinP1.currentTime = 0;
            audioWinP1.play();
        } else {
            audioWinP2.currentTime = 0;
            audioWinP2.play();
        }
        return;
    }

    const roundDraw = !gameState.includes("");
    if (roundDraw) {
        statusDisplay.innerHTML = drawMessage();
        gameActive = false;
        
        audioDraw.currentTime = 0;
        audioDraw.play();
        return;
    }

    handlePlayerChange();
}

function highlightWinningCells(indices) {
    indices.forEach(index => {
        cells[index].classList.add('winner');
    });
}

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive) {
        return;
    }

    handleCellPlayed(clickedCell, clickedCellIndex);
    handleResultValidation();
}

function handleRestartGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.innerHTML = currentPlayerTurn();
    
    // Stop ALL possible win/draw sounds
    audioWinP1.pause();
    audioWinP1.currentTime = 0;

    audioWinP2.pause();
    audioWinP2.currentTime = 0;
    
    audioDraw.pause();       
    audioDraw.currentTime = 0;

    cells.forEach(cell => {
        cell.innerHTML = "";
        cell.className = "cell"; 
        cell.removeAttribute('data-mark');
    });
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', handleRestartGame);