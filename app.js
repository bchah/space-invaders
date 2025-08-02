const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
// Number of squares in the grid
const shooterStartIndex = 202
const width = 15
const startingAliens = 10;
let numAliens = startingAliens; // Total number of aliens
let totalAliensDestroyed = 0; 
const startingGameSpeed = 700; // Initial game speed
let gameSpeed = startingGameSpeed;
const startingLaserSpeed = 300;
let laserSpeed = startingLaserSpeed; // Initial laser speed
let level = 1;
let squares = []
let currentShooterIndex = shooterStartIndex
let gameLoopInterval
let shooterListener = null
let laserListener = null
let keyListener = null
let startKeyListener = null; // Listener for starting the game
let isGoingRight = true
let direction = 1
let results = 0
let alienInvaders = []
let invaderColorMap = []
const keysDown = new Set();
let lastShotTime = 0;
let isPlaying = false;



function draw() {
    
    for (let i = 0; i < alienInvaders.length; i++) {
        const pos = alienInvaders[i]
        squares[pos].classList.add("invader")
        squares[pos].style.backgroundColor = ""
        if (squares[pos].classList.contains("boom")) {
        squares[pos].classList.remove("boom");
        }
    }
}

const init = () => {
    isPlaying = true;
    currentShooterIndex = shooterStartIndex
    isGoingRight = true
    direction = 1
    results = 0
    alienInvaders = []
    invaderColorMap = []
    document.querySelector(".trophy")?.remove();
    if (squares) {
    squares.forEach(square => {
        square.classList.remove("shooter", "invader", "laser", "boom")
        square.style.backgroundColor = ""
    });
    }   
    if (shooterListener) {
        document.removeEventListener("keydown", shooterListener)
        shooterListener = null
    }
    if (laserListener) {
        document.removeEventListener("keydown", laserListener)
        laserListener = null
    }
    if (gameLoopInterval) {
        clearInterval(gameLoopInterval)
        gameLoopInterval = null
    }

    if (keyListener) {
        document.removeEventListener("keyup", keyListener)
        keyListener = null
    }

    if (startKeyListener) {
        document.removeEventListener("keydown", startKeyListener);
        startKeyListener = null;
    }

    resultDisplay.innerHTML = "0"

    for (let i = 0; i < numAliens; i++) {
        const row = Math.floor(i / 10)
        const col = i % 10
        alienInvaders.push(row * width + col)
        const hue = Math.floor(Math.random() * 360)
        invaderColorMap.push(`hsl(${hue}, 100%, 30%)`)
    }

    for (let i = 0; i < width * width; i++) {
        const square = document.createElement("div")
        grid.appendChild(square)
    }

    squares = Array.from(document.querySelectorAll(".grid div"))
    if (level == 10) {
        document.getElementById('status').innerText = "Final Level";
    } else {
        document.getElementById('status').innerText = "Level " + level; // Show current level
    }
    resultDisplay.innerText = results;
    draw()
    squares[currentShooterIndex].classList.add("shooter")
    shooterListener = document.addEventListener("keydown", moveShooter);
    gameLoopInterval = setInterval(moveInvaders, gameSpeed)
    laserListener = document.addEventListener('keydown', shoot)
    keyListener = document.addEventListener("keyup", (e) => {
        keysDown.delete(e.key);
    });

}

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        const pos = alienInvaders[i]
        squares[pos].classList.remove("invader")
        squares[pos].style.backgroundColor = ""
    }
}

function moveShooter(e) {
    if (!squares || !isPlaying) return; // Check if squares are initialized and game is active
    squares[currentShooterIndex].classList.remove("shooter")
    switch (e.key) {
        case "ArrowLeft":
            if (currentShooterIndex % width !== 0) currentShooterIndex -= 1
            break
        case "ArrowRight":
            if (currentShooterIndex % width < width - 1) currentShooterIndex += 1
            break
    }
         squares[currentShooterIndex].classList.add("shooter")
}

function handleLoss() {
    isPlaying = false;
    resultDisplay.innerHTML = "Game Over!"
    clearInterval(gameLoopInterval)
    document.removeEventListener("keydown", shooterListener);
    document.removeEventListener("keydown", laserListener);
    shooterListener = null;
    laserListener = null;
    gameLoopInterval = null;
    document.getElementById('status').innerText = "Total Score: " + totalAliensDestroyed; // Show total aliens destroyed
    document.querySelector(".grid").appendChild(document.createElement("div"));
    document.querySelector(".grid div:last-child").classList.add("trophy");
    const trophy = document.querySelector(".trophy");
    trophy.style.backgroundImage = "url('./sad-trophy.png')";
    // Remove shooter and invaders
    squares.forEach(square => {
        square.classList.remove("shooter", "invader", "laser", "boom")
        square.style.backgroundColor = ""
    });
    // fade in the trophy
    trophy.style.opacity = "0";
    setTimeout(() => {
            trophy.style.opacity = "1";
        }, 100);
        trophy.addEventListener("mouseover", function() {
            resultDisplay.innerHTML = "Start again?";
        });
        trophy.addEventListener("click", () => {
            level = 1; // Reset level
            gameSpeed = startingGameSpeed; // Reset speed
            numAliens = startingAliens; // Reset number of aliens
            totalAliensDestroyed = 0; // Reset total aliens destroyed
            init();
        });
        initStartKeyListener(); // Listen for any valid key to start again
    squares.forEach(square => {
        square.classList.remove("shooter", "invader", "laser", "boom")
        square.style.backgroundColor = ""
    });
}

function handleWin() {
        isPlaying = false;
        // Remove shooter and invaders
        squares.forEach(square => {
            square.classList.remove("shooter", "invader", "laser", "boom")
            square.style.backgroundColor = ""
        });
        clearInterval(gameLoopInterval)
        document.removeEventListener("keydown", shooterListener);
        document.removeEventListener("keydown", laserListener);
        shooterListener = null;
        laserListener = null;
        gameLoopInterval = null;
        
        level++; // Increase level
        if (level > 10) {gameWasBeaten(); return;} // After 10 levels

        resultDisplay.innerHTML = "You Win!"
        document.querySelector(".grid").appendChild(document.createElement("div"));
        document.querySelector(".grid div:last-child").classList.add("trophy");
        const trophy = document.querySelector(".trophy");
        trophy.style.backgroundImage = "url('./trophy.png')";
        // fade in the trophy
        trophy.style.opacity = "0";
        setTimeout(() => {
            trophy.style.opacity = "1";
        }, 100);
        trophy.addEventListener("mouseover", function() {
            resultDisplay.innerHTML = "Continue?";
        });
        gameSpeed = Math.max(50, gameSpeed - 70); // Increase speed
        numAliens = Math.min(100, numAliens + 10); // Increase number of aliens, max 100
        laserSpeed = Math.max(50, laserSpeed - 20); // Increase laser speed
        trophy.addEventListener("click", () => {
            init();
        });
        initStartKeyListener(); // Listen for any valid key to start again
        
}

function gameWasBeaten() {
    isPlaying = false;
    resultDisplay.innerHTML = "";
    document.body.appendChild(document.createElement("div"));
        const trophy = document.body.lastChild;
        trophy.classList.add("victory");
        trophy.style.backgroundImage = "url('./victory.png')";
        // fade in the trophy
        trophy.style.opacity = "0";
        setTimeout(() => {
            trophy.style.opacity = "1";
        }, 100);
        level = 1; // Reset level
        gameSpeed = startingGameSpeed; // Reset speed
        numAliens = startingAliens; // Reset number of aliens
        totalAliensDestroyed = 0; // Reset total aliens destroyed
        trophy.addEventListener("click", () => {
            trophy.style.opacity = "0";
            setTimeout(() => {
                trophy.remove();
                init();
            }, 200);
        });
}

function moveInvaders() {
    const leftEdge = alienInvaders.some(pos => pos % width === 0)
    const rightEdge = alienInvaders.some(pos => pos % width === width - 1)
    remove()

    if (rightEdge && isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            isGoingRight = false
        }
    }

    if (leftEdge && !isGoingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            isGoingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains("invader")) {
        handleLoss();
    }

    if (alienInvaders.length === 0) {
        handleWin();
    }
}

function shoot(e) {
    if (e.key !== "ArrowUp" || keysDown.has(e.key) || !isPlaying) return;
    keysDown.add(e.key);

    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        if (!squares) {
            return;
        }

        try {
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")
        } catch (error) {
            // Catch error where currentLaserIndex has changed to an invalid index
            return;
        }

        if (squares[currentLaserIndex].classList.contains("invader")) {
            // Laser hit!
            const hitInvaderIndex = alienInvaders.indexOf(currentLaserIndex)
            if (hitInvaderIndex !== -1) {
                alienInvaders.splice(hitInvaderIndex, 1)
                invaderColorMap.splice(hitInvaderIndex, 1)
            }
            squares[currentLaserIndex].classList.remove("laser")
            squares[currentLaserIndex].classList.remove("invader")
            squares[currentLaserIndex].style.backgroundColor = ""
            squares[currentLaserIndex].classList.add("boom")
            
            setTimeout(() => squares[currentLaserIndex].classList.remove("boom"), 250)
            results++
            resultDisplay.innerHTML = results
            totalAliensDestroyed++
        } else {
            setTimeout(() => {
                moveLaser();
            }, 100);
        }
    }

    if (e.key === "ArrowUp") {
        if (Date.now() - lastShotTime < laserSpeed) return; // Prevent rapid firing
        lastShotTime = Date.now();
       moveLaser();
    }
}

function startGame() {
    if (document.querySelector(".title-screen") !== null) {
        // animate opacity to 0
        document.querySelector(".title-screen").style.opacity = "0";
        setTimeout(() => {
            document.querySelector(".title-screen").remove();
        }, 200);
    }
    init();
}

// Listen for any valid key to start game
function initStartKeyListener() {
    startKeyListener = (e) => {
        if (
            e.key === "Enter" ||
            e.key === " " ||
            e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight"
        ) {
            startGame();
            document.removeEventListener("keydown", startKeyListener);
        }
    };
    document.addEventListener("keydown", startKeyListener);
}

function initTitle() {
document.querySelector(".title-screen")?.addEventListener("click", () => {
    startGame();
});

initStartKeyListener();

}

initTitle();

