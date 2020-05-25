document.addEventListener("DOMContentLoaded", () => {
    const grid = document.querySelector(".grid")
    let squares = Array.from(document.querySelectorAll(".grid div"))
    const score = document.querySelector("#score")
    const startButton = document.querySelector("#start-button")
    const width = 10
    let nextRandom = 0
    let timerId
    let scoreCounter = 0
    let colors = [
        "orange",
        "red",
        "purple",
        "green",
        "blue"
    ]
    //The Tetrominoes
    const lTetromino = [
        [1, width + 1, width * 2 + 1, 2],
        [width, width + 1, width + 2, width * 2 + 2],
        [1, width + 1, width * 2 + 1, width * 2],
        [width, width * 2, width * 2 + 1, width * 2 + 2]
    ]

    const zTetromino = [
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1],
        [0, width, width + 1, width * 2 + 1],
        [width + 1, width + 2, width * 2, width * 2 + 1]
    ]

    const tTetromino = [
        [1, width, width + 1, width + 2],
        [1, width + 1, width + 2, width * 2 + 1],
        [width, width + 1, width + 2, width * 2 + 1],
        [1, width, width + 1, width * 2 + 1]
    ]

    const oTetromino = [
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1],
        [0, 1, width, width + 1]
    ]

    const iTetromino = [
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3],
        [1, width + 1, width * 2 + 1, width * 3 + 1],
        [width, width + 1, width + 2, width + 3]
    ]

    const tetrominos = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino]

    let currentPosition = 4
    let currentRotation = 0

    // Select a random tetromino
    let random = Math.floor(Math.random() * tetrominos.length)
    let currentTetromino = tetrominos[random][currentRotation]

    function draw() {
        currentTetromino.forEach(index => {
            squares[currentPosition + index].classList.add("tetromino")
            squares[currentPosition + index].style.backgroundColor = colors[random]
        })
    }

    function undraw() {
        currentTetromino.forEach(index => {
            squares[currentPosition + index].classList.remove("tetromino")
            squares[currentPosition + index].style.backgroundColor = ""
        })
    }

    // timerId = setInterval(moveDown, 1000)

    function control(e) {
        if (timerId) {
            if (e.keyCode == 37) {
                moveLeft()
            } else if (e.keyCode == 38) {
                rotate()
            } else if (e.keyCode == 39) {
                moveRight()
            } else if (e.keyCode == 40) {
                moveDown()
            }
        }
    }

    document.addEventListener("keyup", control)

    function moveDown() {
        undraw()
        currentPosition += width
        draw()
        freeze()
    }

    function freeze() {
        if (currentTetromino.some(index => squares[currentPosition + index + width].classList.contains("taken"))) {
            currentTetromino.forEach(index => squares[currentPosition + index].classList.add("taken"))

            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random() * tetrominos.length)
            currentTetromino = tetrominos[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            addScore()
            gameOver()
        }
    }

    function moveLeft() {
        undraw()
        const istAtLeftEdge = currentTetromino.some(index => (currentPosition + index) % width == 0)

        if (!istAtLeftEdge) currentPosition -= 1

        if (currentTetromino.some(
            index => squares[currentPosition + index].classList.contains("taken")
        )) {
            currentPosition += 1
        }
    }

    function moveRight() {
        undraw()
        const istAtRightEdge = currentTetromino.some(index => (currentPosition + index) % width == width - 1)

        if (!istAtRightEdge) currentPosition += 1

        if (currentTetromino.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            currentPosition -= 1
        }

        draw()
    }


    function rotate() {
        undraw()
        currentRotation++
        if (currentRotation == currentTetromino.length) {
            currentRotation = 0
        }
        currentTetromino = tetrominos[random][currentRotation]
        draw()
    }

    // show up nect tetromino in mini-grid

    const displaySquares = document.querySelectorAll(".mini-grid div")
    const displayWidth = 4
    let displayIndex = 0
    //The Tetrominos without rotations

    const upNextTetrominoes = [
        [1, displayWidth + 1, displayWidth * 2 + 1, 2], //lTetromino
        [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1], //zTetromino
        [1, displayWidth, displayWidth + 1, displayWidth + 2], //tTetromino
        [0, 1, displayWidth, displayWidth + 1], //oTetromino
        [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1] //iTetromino
    ]

    // display the shape in the3 mini-grid display
    function displayShape() {
        displaySquares.forEach(square => {
            square.classList.remove("tetromino")
            square.style.backgroundColor = ""
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add("tetromino")
            displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
        })

    }

    startButton.addEventListener("click", () => {
        if (timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random() * tetrominos.length)
            displayShape()
        }
    })


    function addScore() {
        for (let i = 0; i < 199; i += width) {
            const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 7, i + 8, i + 9]
            if (row.every(index => squares[index].classList.contains("taken"))) {
                scoreCounter += 10
                score.innerHTML = scoreCounter
                row.forEach(index => {
                    squares[index].classList.remove("taken")
                    squares[index].classList.remove("tetromino")
                    squares[index].style.backgroundColor = ""
                })
                const squaresRemoved = squares.splice(i, width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
            }
        }
    }

    function gameOver() {
        if (currentTetromino.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            score.innerHTML = "game over"
            clearInterval(timerId)
        }
    }


















})