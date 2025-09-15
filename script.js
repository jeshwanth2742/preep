import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, setDoc, collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import { getAnalytics, logEvent } from "firebase/analytics";

// --- Firebase Config ---
const firebaseConfig = {
  apiKey: "AIzaSyCiKGqhSSCVQ3GPtnMA1DZSzemXLWoBM1M",
  authDomain: "preepclicker.firebaseapp.com",
  projectId: "preepclicker",
  storageBucket: "preepclicker.firebasestorage.app",
  messagingSenderId: "108481604",
  appId: "1:108481604:web:ee13c981b725d02f68c011",
  measurementId: "G-VHRHQF036D"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// --- Screens & Elements (same as before) ---
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

// --- Game Variables ---
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

// --- Restart / Play Again ---
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
  target.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
}

// --- Target click ---
target.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
  target.style.transform = "scale(1.2)";
  setTimeout(() => (target.style.transform = "scale(1)"), 100);
  moveTarget();
});

// --- Start the game ---
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

// --- End the game ---
function endGame() {
  clearInterval(timerInterval);
  gameScreen.classList.add("hidden");
  leaderboardScreen.classList.remove("hidden");
  saveScoreFirebase(username, score);
  logEvent(analytics, 'game_finished', { username, score });
}

// --- Save Score to Firebase ---
async function saveScoreFirebase(name, score) {
  const userRef = doc(db, "leaderboard", name);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    if (score > userSnap.data().score) {
      await setDoc(userRef, { score });
    }
  } else {
    await setDoc(userRef, { score });
  }

  showLeaderboardFirebase();
}

// --- Show Leaderboard ---
async function showLeaderboardFirebase() {
  const q = query(collection(db, "leaderboard"), orderBy("score", "desc"), limit(5));
  const querySnapshot = await getDocs(q);

  leaderboardList.innerHTML = "";
  let rank = 1;
  querySnapshot.forEach(doc => {
    const data = doc.data();
    leaderboardList.inner


