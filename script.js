const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const leaderboardScreen = document.getElementById("leaderboard-screen");

const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("start-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const restartBtn = document.getElementById("restart-btn");

const target = document.getElementById("target");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const leaderboardList = document.getElementById("leaderboard-list");

let username = "";
let score = 0;
let timeLeft = 60;
let timerInterval;

// --- Start Game ---
startBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (!username) return alert("Please enter your name!");
  loginScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  startGame();
});

// --- Restart Game ---
restartBtn.addEventListener("click", () => location.reload());
playAgainBtn.addEventListener("click", () => location.reload());

// --- Move target ---
function moveTarget() {
  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;
  const x = Math.random() * (areaWidth - target.clientWidth);
  const y = Math.random() * (areaHeight - target.clientHeight);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  // random color effect
  target.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
}

// --- Click target ---
target.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
  target.style.transform = "scale(1.2)";
  setTimeout(() => (target.style.transform = "scale(1)"), 100);
  moveTarget();
});

// --- Game logic ---
function startGame() {
  score = 0;
  timeLeft = 60;
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;
  moveTarget();

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

function endGame() {
  clearInterval(timerInterval);
  gameScreen.classList.add("hidden");
  leaderboardScreen.classList.remove("hidden");
  saveScore(username, score);
  showLeaderboard();
}

// --- Leaderboard ---
function saveScore(name, score) {
  const scores = JSON.parse(localStorage.getItem("preepLeaderboard") || "[]");
  scores.push({ name, score });
  scores.sort((a, b) => b.score - a.score);
  localStorage.setItem("preepLeaderboard", JSON.stringify(scores.slice(0, 5)));
}

function showLeaderboard() {
  const scores = JSON.parse(localStorage.getItem("preepLeaderboard") || "[]");
  leaderboardList.innerHTML = scores
    .map((s, i) => `<li>${i + 1}. ${s.name} - ${s.score}</li>`)
    .join("");
}
