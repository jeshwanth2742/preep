// --- Screens ---
const loginScreen = document.getElementById("login-screen");
const gameScreen = document.getElementById("game-screen");
const leaderboardScreen = document.getElementById("leaderboard-screen");

// --- Elements ---
const usernameInput = document.getElementById("username");
const startBtn = document.getElementById("start-btn");
const playAgainBtn = document.getElementById("play-again-btn");
const restartBtn = document.getElementById("restart-btn");

const target = document.getElementById("target");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
const timerDisplay = document.getElementById("timer");
const leaderboardList = document.getElementById("leaderboard-list");

// --- Game Variables ---
let username = "";
let score = 0;
let timeLeft = 25; // increased game time
let timerInterval;
let disappearTimeout;

// --- Start Game ---
startBtn.addEventListener("click", () => {
  username = usernameInput.value.trim();
  if (!username) return alert("Please enter your name!");
  loginScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  startGame();
});

// --- Restart / Play Again ---
restartBtn.addEventListener("click", () => location.reload());
playAgainBtn.addEventListener("click", () => location.reload());

// --- Move target randomly ---
function moveTarget() {
  const areaWidth = gameArea.clientWidth - target.clientWidth;
  const areaHeight = gameArea.clientHeight - target.clientHeight;
  const x = Math.random() * areaWidth;
  const y = Math.random() * areaHeight;

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.style.display = "block";

  // Target disappears automatically slightly faster (500ms)
  clearTimeout(disappearTimeout);
  disappearTimeout = setTimeout(() => {
    target.style.display = "none";

    // Schedule next appearance automatically
    if (timeLeft > 0) {
      setTimeout(moveTarget, 200); // short delay before reappearing
    }
  }, 500); // slightly faster disappearance
}

// --- Target click ---
target.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;

  // Clicked → hide and move immediately
  clearTimeout(disappearTimeout);
  target.style.display = "none";
  setTimeout(moveTarget, 100); // small delay before next appearance
});

// --- Start the game ---
function startGame() {
  score = 0;
  timeLeft = 25; // updated game time
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  moveTarget(); // first target

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    if (timeLeft <= 0) endGame();
  }, 1000);
}

// --- End the game ---
function endGame() {
  clearInterval(timerInterval);
  clearTimeout(disappearTimeout);
  target.style.display = "none";
  gameScreen.classList.add("hidden");
  leaderboardScreen.classList.remove("hidden");
  saveScoreFirebase(username, score);
  firebase.analytics().logEvent('game_finished', { username, score });
}

// --- Save Score to Firebase ---
function saveScoreFirebase(name, score) {
  const userRef = firebase.firestore().collection("leaderboard").doc(name);
  userRef.get().then((doc) => {
    if (doc.exists) {
      if (score > doc.data().score) {
        userRef.set({ score });
      }
    } else {
      userRef.set({ score });
    }
  }).finally(() => {
    showLeaderboardFirebase();
  });
}

// --- Show Leaderboard ---
function showLeaderboardFirebase() {
  firebase.firestore()
    .collection("leaderboard")
    .orderBy("score", "desc")
    .limit(5)
    .get()
    .then((snapshot) => {
      leaderboardList.innerHTML = "";
      let rank = 1;
      snapshot.forEach(doc => {
        const data = doc.data();
        leaderboardList.innerHTML += `<li>${rank}. ${doc.id} - ${data.score}</li>`;
        rank++;
      });
    });
}





