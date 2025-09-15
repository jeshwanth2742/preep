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

// --- Sounds ---
const hitSound = new Audio("hit.mp3"); // positive hit
const missSound = new Audio("miss.mp3"); // miss or negative

// --- Game Variables ---
let username = "";
let score = 0;
let timeLeft = 25;
let timerInterval;
let disappearTimeout;
let disappearTime = 700; // starts slower
let negativeChance = 0.2; // 20% chance negative

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

  // Decide if this target is negative
  const isNegative = Math.random() < negativeChance;
  target.dataset.negative = isNegative ? "true" : "false";
  target.style.background = isNegative ? "black" : "url('assets/preep-logo.png') no-repeat center/cover";
  target.style.boxShadow = "0 0 10px #fff"; // glow effect
  target.style.transform = "scale(0)"; // start small
  setTimeout(() => target.style.transform = "scale(1)", 50); // pop animation

  // Target disappears automatically
  clearTimeout(disappearTimeout);
  disappearTimeout = setTimeout(() => {
    target.style.display = "none";
    if (!isNegative) missSound.play(); // optional miss sound for positive missed target

    // Schedule next appearance if game not over
    if (timeLeft > 0) {
      setTimeout(moveTarget, 200);
    }
  }, disappearTime);
}

// --- Target click ---
target.addEventListener("click", () => {
  const isNegative = target.dataset.negative === "true";
  target.style.display = "none";
  clearTimeout(disappearTimeout);

  // Score feedback
  const feedback = document.createElement("div");
  feedback.className = "score-feedback";
  feedback.textContent = isNegative ? "-1" : "+1";
  feedback.style.left = target.style.left;
  feedback.style.top = target.style.top;
  gameArea.appendChild(feedback);
  setTimeout(() => feedback.remove(), 800);

  // Update score
  if (isNegative) {
    score = Math.max(0, score - 1);
  } else {
    score++;
    hitSound.play();
  }
  scoreDisplay.textContent = `Score: ${score}`;
  scoreDisplay.style.color = isNegative ? "#f00" : "#0f0";
  setTimeout(() => scoreDisplay.style.color = "#fff", 200);

  // Slight scale-up animation
  target.style.transform = "scale(1.2)";
  setTimeout(() => target.style.transform = "scale(1)", 100);

  // Next target
  setTimeout(moveTarget, 100);
});

// --- Start the game ---
function startGame() {
  score = 0;
  timeLeft = 25;
  disappearTime = 700; // reset disappearance speed
  scoreDisplay.textContent = `Score: ${score}`;
  timerDisplay.textContent = `Time: ${timeLeft}s`;

  moveTarget(); // first target

  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `Time: ${timeLeft}s`;

    // Gradually increase difficulty
    disappearTime = Math.max(300, disappearTime - 10); // faster but not too fast

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





