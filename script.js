const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

const DOWN = "down";
const UP = "up";
const LEFT = "left";
const RIGHT = "right";
const SIZE = 10;

function Snake() {
    this.body = [{ x: 0, y: 2 * SIZE },
        { x: 0, y: 1 * SIZE },
        { x: 0, y: 0 * SIZE }
    ];
    this.color = "green";
    this.direction = DOWN;
    this.xDelta = 0;
    this.yDelta = SIZE;

    this.drawSnake = function(color) {
        this.body.forEach((element) => {
            drawObject(element, this.color);
        });
    }
}

function Apple() {
    this.x = random(0, 190);
    this.y = random(0, 190);
    this.width = SIZE;
    this.height = SIZE;
    this.color = "red";
}

function SnakeGame() {
    this.snake = new Snake();
    this.apple = new Apple();
    this.reset = false;

    this.drawBoard = function() {

        context.clearRect(0, 0, canvas.width, canvas.height);
        drawObject(this.apple);
        this.snake.drawSnake();
    }

    this.moveSnake = function() {

        switch (this.snake.direction) {
            case UP:
                this.snake.xDelta = 0;
                this.snake.yDelta = -SIZE;
                break;
            case DOWN:
                this.snake.xDelta = 0;
                this.snake.yDelta = SIZE;
                break;
            case RIGHT:
                this.snake.xDelta = SIZE;
                this.snake.yDelta = 0;
                break;
            case LEFT:
                this.snake.xDelta = -SIZE;
                this.snake.yDelta = 0;
                break;
        }

        const head = {
            x: this.snake.body[0].x + this.snake.xDelta,
            y: this.snake.body[0].y + this.snake.yDelta,
        };

        this.snake.body.unshift(head);
        if (this.interactFood()) {
            this.apple = new Apple();
        } else {
            this.snake.body.pop();
        }
    }

    this.isGameOver = function() {
        if (this.snake.body[0].x < 0 || this.snake.body[0].x > canvas.width || this.snake.body[0].y < 0 || this.snake.body[0].y > canvas.height) {
            this.reset = true;
            alert("game over");
        }
    }

    this.resetGame = function() {
        this.snake = new Snake();
        this.apple = new Apple();
        this.reset = false;
    }

    this.interactFood = function() {
        return (this.snake.body[0].x === this.apple.x &&
            this.snake.body[0].y === this.apple.y)
    }

}

let game = new SnakeGame();
let updated = 0;

function drawObject(object, color) {
    context.fillStyle = object.color ? object.color : color;
    context.fillRect(object.x, object.y, SIZE, SIZE);
}

function loop(now) {
    requestAnimationFrame(loop);

    if (!game.reset) {
        if (now - updated > 400) {
            game.drawBoard();
            game.moveSnake();
            updated = now;
        }
        game.isGameOver();
    } else {
        game.resetGame();
    }

}

loop();

document.addEventListener('keydown', function(event) {

    if (event.code === "ArrowUp" && game.snake.direction != DOWN) {
        game.snake.direction = UP;
    } else if (event.code === "ArrowDown" && game.snake.direction != UP) {
        game.snake.direction = DOWN;
    } else if (event.code === "ArrowLeft" && game.snake.direction != RIGHT) {
        game.snake.direction = LEFT;
    } else if (event.code === "ArrowRight" && game.snake.direction != LEFT) {
        game.snake.direction = RIGHT;
    }
});

function random(min, max) {
    let rand = Math.floor(Math.random() * (max - min)) + min;
    rand += (SIZE - rand % SIZE);

    return rand;
}