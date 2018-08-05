var computer = "O";
var player = "X";
var status;
var winner;
var turn;
var emptySqrs = [];

var gameGrid = [
    "-", "-", "-",
    "-", "-", "-",
    "-", "-", "-"
];

function switchTurn() {
    turn = turn === player ? computer : player;
    var gameResult = gameState(gameGrid);
    if (gameResult.status == "done") {
        winner = gameResult.winner;
        setTimeout(winnerDialog, 700);
    } else {
        if (turn === computer) {
            computerTurn();
        } else {
            userTurn();
        }
    }
};

function findEmptySquares(gameResult, empty) {
    emptySqrs = [];
    var blankSquares = [];
    if (!empty) {
        for (var i = 0; i < gameResult.length; i++) {
            if (gameResult[i] === "-") {
                emptySqrs.push(i);
            }
        }
        return emptySqrs;
    } else {
        for (var i = 0; i < state.length; i++) {
            if (gameResult[i] === "-") {
                blankSquares.push(i);
            }
        }
        return blankSquares;
    }
};

function isEmpty(square, state, blanks) {
    var emptySqrs = findEmptySquares(state, blanks);
    if (emptySqrs.indexOf(square) != -1) {
        return true;
    }
};

var gameState = function(state, blanks) {
    var game = {
        winner: '',
        status: '',
        isOver: false,
    };

    findEmptySquares(state, blanks);
    var blankSquares = findEmptySquares(state, blanks);

    function hWinLines() {
        for (var i = 0; i <= 6; i = i + 3) {
            if (state[i] !== "-" && state[i] === state[i + 1] && state[i + 1] == state[i + 2]) {
                game.winner = state[i];
                game.status = "done";
                game.isOver = true;
                return true;
            }
        }
    }

    function vWinLines() {
        for (var i = 0; i <= 2; i++) {
            if (state[i] !== "-" && state[i] === state[i + 3] && state[i + 3] === state[i + 6]) {
                game.winner = state[i];
                game.status = "done";
                game.isOver = true;
                return true;
            }
        }
    }

    function dWinLines() {
        for (var i = 0, j = 4; i <= 2; i = i + 2, j = j - 2) {
            if (state[i] !== "-" && state[i] == state[i + j] && state[i + j] === state[i + 2 * j]) {
                game.winner = state[i];
                game.status = "done";
                game.isOver = true;
                return true;
            }
        }
    }

    function isWinner(state, blanks) {
        if (hWinLines() || vWinLines() || dWinLines()) {
            return true;
        } else {
            return false;
        }
    }

    if (isWinner(state, blanks)) {
        return game;
    } else if (blankSquares.length == 0 && !isWinner(state)) {
        game.winner = "draw";
        game.status = "done";
        game.isOver = true;
        return game;
    } else {
        game.winner = "";
        game.isOver = false;
        return game;
    }
};

function winnerDialog() {
    if (winner == computer) {
        $(".loser").show("fade");
        $("#overlay").show();
        $(".new-game").click(function() {
            $(".loser").hide("fade");
            $("#overlay").hide();
            turn = player;
            setTimeout(startGame, 300);
        });
    } else if (winner == player) {
        $(".winner").show("fade");
        $("#overlay").show();
        $(".new-game").click(function() {
            $(".winner").hide("fade");
            $("#overlay").hide();
            turn = computer;
            setTimeout(startGame, 300);
        });
    } else {
        $(".draw").show("fade");
        $("#overlay").show();
        $(".new-game").click(function() {
            $(".draw").hide("fade");
            $("#overlay").hide();
            turn = player;
            setTimeout(startGame, 300);
        });
    }
};

function disableSqr(state, blanks) {
    findEmptySquares(state, blanks);
    for (var i = 0; i < gameGrid.length; i++) {
        if (emptySqrs.indexOf(i) == -1) {
            $('#square' + i).removeClass("enabled");
        }
    }
};

function startGame() {
    status = "start";
    gameGrid = [
        "-", "-", "-",
        "-", "-", "-",
        "-", "-", "-"
    ];

    emptySqrs = [];

    for (var i = 0; i < gameGrid.length; i++) {
        $("#square" + i).html("");
        $('#square' + i).addClass("enabled");
    }
    $("table").addClass("enabled");

    if (turn == player) {
        userTurn();
    } else {
        setTimeout(computerTurn, 400);
    }
};

function userTurn() {
    $(".square").each(function() {
        var id = this.id;
        var squareId = $(this).index("td");
        $(this).click(function() {
            if ($(this).hasClass("enabled")) {
                gameGrid[squareId] = player;
                $(this).html(player);
                switchTurn();
            }
        });
    });
}

function computerTurn() {
    var potentialMoves = [];
    var step = undefined;
    var possibleGames = gameGrid;
    var selection = -100;
    for (var i = 0; i < possibleGames.length; i++) {
        if (isEmpty(i, possibleGames)) {
            var brd = possibleGames.slice();
            brd[i] = computer;
            var score = checkMin(brd, 1);
            if (score > selection) {
                selection = score;
                step = i;
            }
            potentialMoves.push([step, selection]);
        }
    }

    gameGrid[step] = computer;
    var squareId = "square" + step;
    $("#" + squareId).html(computer);
    disableSqr(gameGrid);
    switchTurn();
}

function checkMin(state, turns) {
    var game = gameState(state);
    if (game.winner === "draw") {
        return 0;
    } else if (game.winner === computer) {
        return 10 - turns;
    } else {
        var newTurns = 1 + turns;
        var playerScore = 100;
        for (var i = 0; i < state.length; i++) {
            if (isEmpty(i, state)) {
                var brd = state.slice();
                brd[i] = player;

                var score = checkMax(brd, newTurns);

                if (score < playerScore) {
                    playerScore = score;
                }
            }
        }

        return playerScore;
    }
}

function checkMax(state, turns, step) {
    var game = gameState(state);
    if (game.winner === player) {
        return turns - 10;
    } else if (game.winner === "draw") {
        return 0;
    } else {
        var newTurns = 1 + turns;
        var selection = -100;
        for (var i = 0; i < state.length; i++) {
            if (isEmpty(i, state)) {
                var brd = state.slice();
                brd[i] = computer;
                var score = checkMin(brd, newTurns);
                if (score > selection) {
                    selection = score;
                }
            }
        }
        return selection;
    }
}

$(document).ready(function() {
    $(".choose").show("fade");
    $("#X").click(function() {
        player = "X";
        computer = "O";
        turn = player;
        $(".choose").hide("fade");
        $("#overlay").hide();
        setTimeout(startGame, 500);
    });

    $("#O").click(function() {
        player = "O";
        computer = "X";
        turn = computer;
        $(".choose").hide("fade");
        $("#overlay").hide();
        setTimeout(startGame, 500);
    });

});