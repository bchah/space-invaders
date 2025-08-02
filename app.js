const grid = document.querySelector(".grid")
const resultDisplay = document.querySelector(".results")
// Number of squares in the grid
const shooterStartIndex = 202
const width = 15
const startingAliens = 10;
let numAliens = startingAliens; // Total number of aliens
const startingGameSpeed = 700; // Initial game speed
let gameSpeed = startingGameSpeed;
let level = 1;
let squares = []
let currentShooterIndex = shooterStartIndex
let gameLoopInterval
let shooterListener = null
let laserListener = null
let isGoingRight = true
let direction = 1
let results = 0
let alienInvaders = []
let invaderColorMap = []



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
    draw()
    squares[currentShooterIndex].classList.add("shooter")
    shooterListener = document.addEventListener("keydown", moveShooter);
    gameLoopInterval = setInterval(moveInvaders, gameSpeed)
    laserListener = document.addEventListener('keydown', shoot)

}

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        const pos = alienInvaders[i]
        squares[pos].classList.remove("invader")
        squares[pos].style.backgroundColor = ""
    }
}

function moveShooter(e) {
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
    resultDisplay.innerHTML = "Game Over!"
    clearInterval(gameLoopInterval)
    document.removeEventListener("keydown", shooterListener);
    document.removeEventListener("keydown", laserListener);
    shooterListener = null;
    laserListener = null;
    gameLoopInterval = null;
    document.querySelector(".grid").appendChild(document.createElement("div"));
    document.querySelector(".grid div:last-child").classList.add("trophy");
    const trophy = document.querySelector(".trophy");
    trophy.style.backgroundImage = "url('./sad-trophy.png')";
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
            document.getElementById('level').innerText = level; // Update level display
            gameSpeed = startingGameSpeed; // Reset speed
            numAliens = startingAliens; // Reset number of aliens
            init();
        });
    squares.forEach(square => {
        square.classList.remove("shooter", "invader", "laser", "boom")
        square.style.backgroundColor = ""
    });
}

function handleWin() {
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
        trophy.addEventListener("click", () => {
            level++; // Increase level
            document.getElementById('level').innerText = level; // Update level display
            gameSpeed = Math.max(50, gameSpeed - 50); // Increase speed
            numAliens = Math.min(120, numAliens + 5); // Increase number of aliens, max 120
            init();
        });
        clearInterval(gameLoopInterval)
        document.removeEventListener("keydown", shooterListener);
        document.removeEventListener("keydown", laserListener);
        shooterListener = null;
        laserListener = null;
        gameLoopInterval = null;
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

    let currentLaserIndex = currentShooterIndex

    function moveLaser() {
        if (!squares) {
            return;
        }
        squares[currentLaserIndex].classList.remove("laser")
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add("laser")

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
        } else {
            setTimeout(() => {
                moveLaser();
            }, 60);
        }
    }

    if (e.key === "ArrowUp") {
       moveLaser();
    }
}

init();

