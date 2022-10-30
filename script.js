const stars = document.querySelector('#stars');
const ctx = gameCanvas.getContext('2d');
const scale = 1;
const rings = {'leftRing' : {scoreZone: -335}, 'centerRing': {scoreZone: -85}, 'rightRing': {scoreZone: 210}};
const ringNames = Object.keys(rings);
let playing = false;
let randomRing = ringNames[Math.floor(Math.random()*ringNames.length)];
let shipY = -25;
let changeX = 0, changeY = 0;
let lives, score, ringScaler, opacity, zoom, shipX;
ctx.setTransform(scale, 0, 0, scale, ctx.canvas.width / 2, ctx.canvas.height / 2);

const zoomStars = () => {
    zoom += 0.01;
    stars.style.backgroundSize = `${100 + zoom}%`;
}

const showLives = livesLeft => {
    lifeX = 295;

    for (let i = 1; i <= 3; i++) {
        ctx.fillStyle = i <= livesLeft ? '#0d0' : 'red';
        ctx.font = '50px Arial';
        ctx.fillText('•', lifeX, -170);

        lifeX += 30;
    }

    if (lives === 0) {
        ctx.font = '50px Arial';
        ctx.fillText('Game Over', -128, 0);
        playing = false;
    }
};

const checkForScore = () => {
    if (shipX >= rings[randomRing].scoreZone && shipX <= rings[randomRing].scoreZone + 70) {
        score += 10;
    } else {
        lives -= 1;
    }

    ringScaler -= 0.05
};

const showScore = () => {
    ctx.fillStyle = 'yellow';
    ctx.font = '25px Arial';
    ctx.fillText(`Score: ${score}`, -370, -180);
};

const moveRings = () => {
    const ring = document.querySelector(`#${randomRing}`);

    if (ringScaler < 0.75 && ringScaler > 0.7) {
        checkForScore();
    }

    ctx.save();
    ringScaler < 1 && (opacity -= 0.05);
    ctx.globalAlpha = Math.round(opacity * 10) / 10;
    lives > 0 && ctx.drawImage(
        ring,
        (-ring.width/ringScaler) / 2, (-ring.height/ringScaler) / 2,
        ring.width / ringScaler, ring.height / ringScaler
    );
    ctx.restore();

    if (ringScaler > 0.1) {
        ringScaler -= 0.05
    } else {
        ctx.clearRect(-400, -225, 800, 450);
        randomRing = ringNames[Math.floor(Math.random()*ringNames.length)];
        ringScaler = 10;
        opacity = 1;
    }
}

const moveShip = () => {
    shipX += changeX;
    lives > 0 && ctx.drawImage(spaceship, shipX, shipY, 90, 47);
    (shipX < -400 || shipX > 310) && (changeX = 0);
}

const keyPressed = e => {
    const key = e.keyCode;

    switch (key) {
        case 32:
            if (!playing) {
                lives = 3;
                score = 0;
                ringScaler = 10;
                opacity = 1;
                zoom = 0;
                shipX = -90 / 2
                playing = true;
                mainLoop();
            }
            break;
        case 37:
            shipX > -400 && (changeX=-3);
            break;
        case 39:
            shipX < 290 && (changeX=3);
            break;
    }
}

const mainLoop = () => {
    ctx.clearRect(-400, -225, 800, 450);
    moveRings();
    moveShip();
    showScore();
    showLives(lives)
    zoomStars();

    lives > 0 && requestAnimationFrame(mainLoop);
};

document.onkeydown = keyPressed;
