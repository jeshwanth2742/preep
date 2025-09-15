function moveTarget() {
  const areaWidth = gameArea.clientWidth - target.clientWidth;
  const areaHeight = gameArea.clientHeight - target.clientHeight;
  const x = Math.random() * areaWidth;
  const y = Math.random() * areaHeight;

  target.style.left = `${x}px`;
  target.style.top = `${y}px`;
  target.style.display = "block";

  const isNegative = Math.random() < negativeChance;
  target.dataset.negative = isNegative ? "true" : "false";

  if (isNegative) {
    target.style.backgroundImage = "";
    target.style.backgroundColor = "black";
  } else {
    target.style.backgroundImage = "url('assets/preep-logo.png')";
    target.style.backgroundColor = "transparent";
  }

  target.style.boxShadow = "0 0 10px #fff";
  target.style.transform = "scale(0)";
  setTimeout(() => target.style.transform = "scale(1)", 50);

  clearTimeout(disappearTimeout);
  disappearTimeout = setTimeout(() => {
    target.style.display = "none";
    if (!isNegative) missSound.play();
    if (timeLeft > 0) setTimeout(moveTarget, 200);
  }, disappearTime);
}





