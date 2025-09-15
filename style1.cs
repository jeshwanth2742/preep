body {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  margin: 0;
  background: #111;
  color: white;
  font-family: Arial, sans-serif;
  flex-direction: column;
}

#game-area {
  position: relative;
  width: 400px;
  height: 400px;
  background: #222;
  border: 2px solid white;
  overflow: hidden;
  border-radius: 10px;
}

#target {
  position: absolute;
  width: 60px;
  height: 60px;
  background: url('assets/preep-logo.png') no-repeat center/cover;
  cursor: pointer;
  transition: transform 0.1s ease;
}

#score {
  font-size: 1.5rem;
  margin-top: 10px;
}