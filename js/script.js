let ogBoard;
const player = 'O';
const ai = 'X';
const winCombos = [
    // horizontal, vertical, diagonal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [6, 4, 2]

]
// select all elements with class = "cell"; array
const cells = document.querySelectorAll('.cell');

const resetButton = document.querySelector('.resetBtn');
resetButton.addEventListener('click', startGame);


// for Reset/Play Again button
startGame();

function startGame() {
    // clear endgame section
    document.querySelector('.endgame').style.display = "none";
    //create array of 9 elements
    ogBoard = Array.from(Array(9).keys());
    //remove all X/Os from board
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    // console.log(square.target.id);
    // call turn func when human player clicks
    if (typeof ogBoard[square.target.id] == 'number') {//if cell is empty
        turn(square.target.id, player);
        if (!checkTie()) turn(bestSpot(), ai);
    }

}

function turn(squareId, player) {
    ogBoard[squareId] = player;
    // puts 'O' on a cell that player clicks on
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(ogBoard, player);
    if (gameWon) gameOver(gameWon);

}
// determine winner
function checkWin(board, player) {
    // acc - returned value; if element = player, concat i(index) to acc
    // [] is initialValue argument in .reduce()
    // FIND EVERY INDEX THE PLAYER PLAYED IN
    let plays = board.reduce((acc, ele, i) =>
        (ele === player) ? acc.concat(i) : acc, []);

    let gameWon = null;
    for (let [index, win] of winCombos.entries()) {
        // has player played on every cell that counts as a win?
        if (win.every(ele => plays.indexOf(ele) > -1)) {
            gameWon = { index: index, player: player };
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    //change bg color based on winner
    for (let index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = gameWon.player == player ? "blue" : "red"
    }
    // prevent player from clicking after winning
    for (let i = 0; i < cells.length; i++) {
        cells.removeEventListener
    }
    declareWinner(gameWon.player == player ? "YAY, You Win!" : "Aww, You Lose!")
}

// AI & winner notification
function declareWinner(who) {
    document.querySelector('.endgame').style.display = 'block';
    document.querySelector('.endgame .text').innerText = who;
}
function emptySquares() {
    return ogBoard.filter(s => typeof s == 'number');
}
function bestSpot() {
    // find first square that's not empty
    return emptySquares()[0];
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = 'green';
            cells[i].removeEventListener('click', turnClick, false)
        }
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}




// algorithm