const canvas = document.getElementById("flappyBirdGame");
const ctx = canvas.getContext("2d");

canvas.width = 600;
canvas.height = 480;

let TotalScore = 0;

const bird = {
  x: 120,
  y: 1, 
  width: 20,
  height: 20, 
  radius: 10,
  gravity: 0.5,
  velocity: 0,
  lift: -9,

  jump() { 
    this.velocity = this.lift;
  },
  
  update() {
    this.velocity += 0.5;
    this.y += this.velocity;

    if (this.y < 0) {
      this.y = 0;
    }
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
    }
  },

  draw() {
    ctx.fillStyle = "rgba(93, 14, 65, 0.6)";
    ctx.beginPath();
    ctx.arc(this.x + this.radius, this.y + this.radius, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
};

const pipe = {
  width: 50,
  gap: 100,
  speed: 4,
  minHeight: 50,
  maxHeight: canvas.height - 50,

  minSpace: 300,
  maxSpace: 100,
  startSpace: 800,
  pipes: [],

  generate() {
    let lastPipe = this.pipes[this.pipes.length - 1];
    let height = Math.floor(Math.random() * (this.maxHeight));
    let xPosition = this.startSpace;

    if (lastPipe) {
      let space = Math.floor(Math.random() * this.minSpace) + this.maxSpace;
      xPosition = lastPipe.x + pipe.width + space;
    }

    this.pipes.push({ x: xPosition, height });
  },
  
  update() {
    for (let i = 0; i < this.pipes.length; i++) {
      this.pipes[i].x -= this.speed;
    }
  },

  draw() {
    for (let i = 0; i < this.pipes.length; i++) {
      ctx.fillStyle = "#FF204E";
      const p = this.pipes[i];
      ctx.fillRect(p.x, 0, this.width, p.height);

      const bottomHeight = canvas.height - p.height - this.gap;
      ctx.fillRect(p.x, p.height + this.gap, this.width, bottomHeight);
    }
  }
};

let score = 0;

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#E4E4E4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  bird.update();
  bird.draw();

  pipe.update();
  pipe.draw();

  pipe.generate();

  for (let i = 0; i < pipe.pipes.length; i++) {
    const p = pipe.pipes[i];
    if (bird.x + bird.width > p.x && bird.x < p.x + pipe.width) {
      if (bird.y < p.height) {
        resetGame();
      } else if (bird.y + bird.height > p.height + pipe.gap){
        resetGame();
      }
    }
  }

  for (let i = 0; i < pipe.pipes.length; i++) {
    const p = pipe.pipes[i];

    if (p.x < bird.x && !p.scored) {
      score++;
      p.scored = true;

      if (TotalScore < score) {
        TotalScore = score;
        $('#score-total').text(TotalScore);
      }

    }
  }

  ctx.fillStyle = "#000";
  ctx.font = "12px Arial";
  ctx.fillText("Score: " + score, 10, 30);
  
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  bird.y = 0;
  bird.velocity = 0;
  pipe.pipes = [];
  score = 0;
}

gameLoop();

document.addEventListener('keydown', () => {
  bird.jump();
});
