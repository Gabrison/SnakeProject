// JavaScript
const snakeCanvas = document.getElementById('snakeCanvas');
snakeCanvas.style.border = "2px solid black"; // Adjust border width and color as needed
const ctx = snakeCanvas.getContext("2d");

// Set canvas dimensions explicitly
snakeCanvas.width = 400;
snakeCanvas.height = 400;

let snake = [
  {x: 200, y: 200},
  {x: 190, y: 200},
  {x: 180, y: 200},
  {x: 170, y: 200},
  {x: 160, y: 200}
];

let dx = 10; // Initial movement direction
let dy = 0;  // y axis moving direction
let food_x, food_y;
let score = 0;

function drawSnakePart(snakePart) {
  ctx.fillStyle = 'lightblue';
  ctx.strokeStyle = 'darkblue';
  ctx.fillRect(snakePart.x, snakePart.y, 10, 10);
  ctx.strokeRect(snakePart.x, snakePart.y, 10, 10);
}

function drawSnake() {
  snake.forEach(drawSnakePart);
}

function moveSnake() {
  const head = {x: snake[0].x + dx, y: snake[0].y + dy};
  snake.unshift(head);
  if (head.x === food_x && head.y === food_y) {
    // Increase snake size
    score++;
    generateFood();
  } else {
    snake.pop();
  }
}

function clearCanvas() {
  ctx.clearRect(0, 0, snakeCanvas.width, snakeCanvas.height);
}

function main() {
  if (has_game_ended()) {
    alert('Game Over');

    // Submit the score to the backend
    submitScore();

    // Fetch and display the leaderboard in the DOM
    fetchHighScores();

    return; // Stop the game loop
  }
  
  setTimeout(function() {
    clearCanvas();
    moveSnake();
    drawSnake();
    drawFood();
    main();
  }, 100);
}

function change_direction(event) {
  const LEFT_KEY = 37;
  const RIGHT_KEY = 39;
  const UP_KEY = 38;
  const DOWN_KEY = 40;

  const keyPressed = event.keyCode;

  if (keyPressed === LEFT_KEY && dx !== 10) {
    dx = -10;
    dy = 0;
  }

  if (keyPressed === UP_KEY && dy !== 10) {
    dx = 0;
    dy = -10;
  }

  if (keyPressed === RIGHT_KEY && dx !== -10) {
    dx = 10;
    dy = 0;
  }

  if (keyPressed === DOWN_KEY && dy !== -10) {
    dx = 0;
    dy = 10;
  }
}

document.addEventListener("keydown", change_direction);

function has_game_ended() {
  for (let i = 4; i < snake.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true; // Snake collided with itself
    }
  }
   // walls logic
  const hitLeftWall = snake[0].x < 0;
  const hitRightWall = snake[0].x > snakeCanvas.width - 10;
  const hitTopWall = snake[0].y < 0;
  const hitBottomWall = snake[0].y > snakeCanvas.height - 10;

  return hitLeftWall || hitRightWall || hitTopWall || hitBottomWall;
}

// Function to generate random food coordinates
function generateFood() {
  food_x = Math.floor(Math.random() * (snakeCanvas.width / 10)) * 10;
  food_y = Math.floor(Math.random() * (snakeCanvas.height / 10)) * 10;
}

// Function to draw food
function drawFood() {
  ctx.fillStyle = 'lightgreen';
  ctx.strokeStyle = 'darkgreen';
  ctx.fillRect(food_x, food_y, 10, 10);
  ctx.strokeRect(food_x, food_y, 10, 10);
}

// Function to submit score to the backend
function submitScore() {
  const playerName = prompt("Game over! Enter your name for the leaderboard:");

  axios.post('http://localhost:3000/submit-score', {
    name: playerName,
    score: score
  })
  .then(() => {
    console.log('Score submitted');
  })
  .catch(err => {
    console.error('Error submitting score', err);
  });
}

// Function to display high scores in the DOM
function fetchHighScores() {
  axios.get('http://localhost:3000/high-scores')
    .then(response => {
      const highScores = response.data;
      
      // Get the leaderboard div
      const leaderboardDiv = document.getElementById('leaderboard');
      
      // Clear the existing content
      leaderboardDiv.innerHTML = '';

      // Create the leaderboard HTML
      let leaderboardHTML = '<h3>Leaderboard</h3><ul>';
      highScores.forEach((score, index) => {
        leaderboardHTML += `<li>${index + 1}. ${score.name}: ${score.score}</li>`;
      });
      leaderboardHTML += '</ul>';

      // Add the new leaderboard content
      leaderboardDiv.innerHTML = leaderboardHTML;
    })
    .catch(err => {
      console.error('Error fetching high scores', err);
    });
}

// Function to restart the game
function restartGame() {
  // Reset snake, direction, and score
  snake = [
    {x: 200, y: 200},
    {x: 190, y: 200},
    {x: 180, y: 200},
    {x: 170, y: 200},
    {x: 160, y: 200}
  ];
  dx = 10;
  dy = 0;
  score = 0;
  generateFood();
  // Restart the game loop
  main();
}

// Start the game
generateFood();
main();

// Add event listener for restart button
snakeCanvas.addEventListener('click', function(event) {
  const rect = snakeCanvas.getBoundingClientRect();
  const clickX = event.clientX - rect.left;
  const clickY = event.clientY - rect.top;
  if (clickX >= 150 && clickX <= 250 && clickY >= 250 && clickY <= 300) {
    restartGame();
  }
});
