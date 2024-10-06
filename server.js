const express = require('express');
const bodyParser = require('body-parser');
const app = express();
let highScores = [];

// Middleware
app.use(bodyParser.json());

// Handle GET request for high scores
app.get('/high-scores', (req, res) => {
  res.json(highScores);
});

// Handle POST request to submit a new score
app.post('/submit-score', (req, res) => {
  const { name, score } = req.body;
  
  // Add the new score and sort the array by score (highest first)
  highScores.push({ name, score });
  highScores.sort((a, b) => b.score - a.score);

  // Limit leaderboard to top 10 scores
  highScores = highScores.slice(0, 10);
  
  res.status(201).send('Score added');
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
