const target = document.getElementById("target");
const gameArea = document.getElementById("game-area");
const scoreDisplay = document.getElementById("score");
let score = 0;

function moveTarget() {
  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;
  const x = Math.random() * (areaWidth - target.clientWidth);
  const y = Math.random() * (areaHeight - target.clientHeight);
  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
}

target.addEventListener("click", () => {
  score++;
  scoreDisplay.textContent = `Score: ${score}`;
  target.style.transform = "scale(1.2)";
  setTimeout(() => (target.style.transform = "scale(1)"), 100);
  moveTarget();
});

// Move target every second even if not clicked
setInterval(moveTarget, 1000);

// Initial position
moveTarget();
