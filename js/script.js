let ogBoard;
const you = 'O';
const ai = 'X';
const winCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
const resetButton = document.querySelector('.resetBtn').addEventListener('click', startGame);
startGame();

function startGame() { // called when resetBtn pressed
    // clear endgame board
    document.querySelector(".endgame").style.display = "none";
    ogBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof ogBoard[square.target.id] == 'number') {
        turn(square.target.id, you)
        if (!checkWin(ogBoard, you) && !checkTie()) turn(bestSpot(), ai);
    }
}

function turn(squareId, player) {
    ogBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(ogBoard, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((acc, ele, i) =>
        (ele === player) ? acc.concat(i) : acc, []);
    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(ele => plays.indexOf(ele) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor =
            gameWon.player == you ? "blue" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == you ? "You win!" : "You lose.");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
    return ogBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(ogBoard, ai).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    let openSpots = emptySquares();

    if (checkWin(newBoard, you)) {
        return { score: -10 };
    } else if (checkWin(newBoard, ai)) {
        return { score: 10 };
    } else if (openSpots.length === 0) {
        return { score: 0 };
    }
    let moves = [];
    for (let i = 0; i < openSpots.length; i++) {
        let move = {};
        move.index = newBoard[openSpots[i]];
        newBoard[openSpots[i]] = player;

        if (player == ai) {
            let result = minimax(newBoard, you);
            move.score = result.score;
        } else {
            let result = minimax(newBoard, ai);
            move.score = result.score;
        }

        newBoard[openSpots[i]] = move.index;

        moves.push(move);
    }

    let bestMove;
    if (player === ai) {
        let bestScore = -10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = 10000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}