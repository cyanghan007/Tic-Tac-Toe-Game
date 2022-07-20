const GAME = {
    X_CLASS : 'x', //variable for white chicken // white chicken = O
    Y_CLASS : 'y', //variable for brown chicken // brown chicken = X
    turn: undefined, // sets turns per player
    winner: null, //sets winner
    selectedCharacter : document.querySelectorAll(".img .id"), // grabs all images
    blockElements: document.querySelectorAll("[tile]"), //selects tiles on boards
    boardElement: document.getElementById("board"), // grabs board using id
    startBtn: document.getElementById("startBtn"), //start game button
    startWindow: document.querySelector(".start-game"), //start game pop up window
    winEl: document.querySelector(".winner-msg"),
    drawEl: document.querySelector(".draw-msg"),
    winnerImg: document.querySelector(".winner-msg .winner"), //winner winner chicken dinner message pop up window
    restartBtn: document.getElementById("restartBtn"), //restart button
    drawBtn: document.getElementById("drawBtn"), // draw button
    winAudio: document.getElementById(".winAudio")
}


// used to select all ids for my character imgs on start game screen
// (e) is event storage listener for the click
character = () => {
    GAME.selectedCharacter.forEach(img => {
        img.addEventListener("click", (e) =>{
            let target = (e).target.dataset.id;
            removeImgSelection(GAME.selectedCharacter);
            document.querySelector(`[data-id="${target}"]`).classList.add("selected");
            
        //swap character values based off selection
        if(target == "x2" || target == "y2") {
            GAME.X_CLASS = "x2";
            GAME.Y_CLASS = "y2";
        }

        //set turns // returns boolean value
        GAME.turn = target == "y" || target == "y2" ? true : false;

        })
    });
}

character();

//start game setup
startGame = () => {
    tileHoverEffect();

    //iterates over tiles and allows click event
    GAME.blockElements.forEach(tile => {
        tile.classList.remove(GAME.X_CLASS); //clears board to reset game
        tile.classList.remove(GAME.Y_CLASS);
        tile.classList.remove("win")
        tile.removeEventListener("click", mouseClick);
        tile.addEventListener("click", mouseClick, {once: true}); // allows tiles to be clicked only 1 time     
    });

    GAME.startWindow.classList.add("hide"); //hides character window onces a class is picked
    GAME.winEl.classList.remove("show");
    GAME.drawEl.classList.remove("show");
    GAME.winnerImg.children.length ? GAME.winnerImg.removeChild(GAME.winner) : null; //fix this
    //^ allows for only one image to be shown when there is a winner
}
//sets hover effect of selected character to tile // called in line 45 & 118
tileHoverEffect = () => {
    GAME.boardElement.classList.remove(GAME.X_CLASS); //removes the X and Y class
    GAME.boardElement.classList.remove(GAME.Y_CLASS);
    if(GAME.turn) {
        GAME.boardElement.classList.add(GAME.Y_CLASS);
    } else {
        GAME.boardElement.classList.add(GAME.X_CLASS);
    }
}

// for loop that removes image border color change when selected// action is called in profile function
removeImgSelection = (img) => {
    [].forEach.call(img, function(el) {
        el.classList.remove("selected");
    })
}

//game buttons
GAME.startBtn.addEventListener("click", startGame);
GAME.restartBtn.addEventListener("click", startGame);
GAME.drawBtn.addEventListener("click", startGame);

//mouse click function
mouseClick = (e) => {
    const tile = (e).target;
    //returns true or false based off characters turn
    const currentPlayer = GAME.turn ? GAME.Y_CLASS : GAME.X_CLASS;
    markTile(tile, currentPlayer)

    //checks for winner
let flag = checkWinner(currentPlayer, GAME.blockElements).filter((win, index) => {
    if(win) {

        //change background color for winning set
        WIN_COMBINATIONS[index].map(i => {
            GAME.blockElements[i].classList.add('win');
        });

        GAME.turn = swapTurns(GAME.turn);
        tileHoverEffect(); 

        //sets winner
        GAME.winner = GAME.blockElements[WIN_COMBINATIONS[index][0]].cloneNode(true);
        return win !== false;
        }
    });
   
    //check for winner or tie
    if (flag.length) {
        endGame(false, GAME.winEl, GAME.drawEl);
        GAME.winnerImg.append(GAME.winner); // need to attend to append, not working 
    } else if(isDraw(flag)){
        endGame(true, GAME.winEl, GAME.drawEl);
}
   
    GAME.turn = swapTurns(GAME.turn);
    tileHoverEffect(); //swaps image hover effect based off character selection

}


//this function will allow current player to select and place within chosen cell
//function is called in line 66
markTile = (tile, currentPlayer) => {
    tile.classList.add(currentPlayer);
}

//function to swap turns //returns the opposite value of the current users turn\
// called in line 68 in mouse click function
swapTurns = (turn) => {
    return turn = !turn;
}

//winning combinations for the game // called in line 74
const WIN_COMBINATIONS = [
    [0, 1, 2], //horizontal win tile combinations start here
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6], //vertical win tile combinations start here
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8], //digonal win tile combinations start here
    [2, 4, 6]
];
//called in line 69
checkWinner = (currentPlayer, blockElements) => {
    let winGame = []; //array to store winning combinations

    WIN_COMBINATIONS.some(combination => {
        winGame.push(combination.every(index => {
            return blockElements[index].classList.contains(currentPlayer)
        }))
    })
    return winGame || null
}


//function to check for ties
isDraw = (flag) => {
    if (flag.length)return;
    return[...GAME.blockElements].every(tile => {
        return tile.classList.contains(GAME.X_CLASS) || //checks to se if all tiles cells are filled, returns draw if true
        tile.classList.contains(GAME.Y_CLASS);

    });
}

//end game function
endGame = (draw, winEl, drawEl) => {
    if (!draw){
        winEl.classList.add('show');
    }else {
        drawEl.classList.add('show');
    }
}

//plays audio when there is a winner
playAudio = () => {
    if (GAME.winner === true);
        GAME.winAudio.play();
} 