const game = document.getElementById('game');
const player = document.getElementById('player');
const bullet = document.getElementById('bullet');
let playerPositionX = 50;
let enemySpeed = 2; // Velocidade inicial das naves inimigas
let currentPhase = 1;
const PHASE_SCORE_THRESHOLD = [20, 40, 80, 120, 200, 350, 500]; // Pontuação necessária para avançar para a próxima fase
const ENEMY_SPEED_INCREMENT = 1.0; // Incremento na velocidade das naves inimigas a cada fase
const welcomeScreen = document.getElementById('welcomeScreen');
const startButton = document.getElementById('startButton');

startButton.addEventListener('click', function() {
    welcomeScreen.style.display = 'none';
    startGame();
});

function startGame() {
    document.addEventListener('keydown', function(event) {
        if (event.code === 'ArrowLeft') {
            movePlayerLeft();
        } else if (event.code === 'ArrowRight') {
            movePlayerRight();
        } else if (event.code === 'Space') {
            shoot();
        }
    });

    setInterval(createEnemy, 2000);
}

function movePlayerLeft() {
    playerPositionX -= 20;
    playerPositionX = Math.max(playerPositionX, 0);
    playerPositionX = Math.min(playerPositionX, game.offsetWidth - player.offsetWidth);
    player.style.left = playerPositionX + 'px';
}

function movePlayerRight() {
    playerPositionX += 20;
    playerPositionX = Math.max(playerPositionX, 0);
    playerPositionX = Math.min(playerPositionX, game.offsetWidth - player.offsetWidth);
    player.style.left = playerPositionX + 'px';
}

function shoot() {
    bullet.style.display = 'block';
    bullet.style.left = player.offsetLeft + (player.offsetWidth / 6) - 6 + 'px';
    bullet.style.bottom = '70px';

    let bulletInterval = setInterval(function() {
        let bulletBottom = parseInt(bullet.style.bottom);
        bullet.style.bottom = (bulletBottom + 10) + 'px';

        if (bulletBottom > window.innerHeight) {
            bullet.style.display = 'none';
            clearInterval(bulletInterval);
        } else {
            checkCollision();
        }
    }, 30);
}

function checkCollision() {
    const enemies = document.querySelectorAll('.enemy');
    const bulletRect = bullet.getBoundingClientRect();

    enemies.forEach(function(enemy) {
        const enemyRect = enemy.getBoundingClientRect();
        if (bulletRect.bottom >= enemyRect.top && bulletRect.right >= enemyRect.left && bulletRect.left <= enemyRect.right) {
            enemy.classList.add('hit');
            enemy.remove();
            bullet.style.display = 'none';
            updateScore();
        }
    });
}

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    const maxEnemyLeft = game.offsetWidth - player.offsetWidth;
    enemy.style.left = Math.max(0, Math.min(maxEnemyLeft, Math.random() * maxEnemyLeft)) + 'px';
    enemy.style.top = '0';
    game.appendChild(enemy);

    let enemyInterval = setInterval(function() {
        let enemyTop = parseInt(enemy.style.top);
        enemy.style.top = (enemyTop + enemySpeed) + 'px';

        if (enemyTop > window.innerHeight) {
            if (!enemy.classList.contains('hit')) {
                gameOver();
                updateMissedScore();
            }
            enemy.remove();
            clearInterval(enemyInterval);
        }
    }, 30);
}

function gameOver() {
    alert('melhore :)');
    location.reload();
}

let score = 0;
const scoreElement = document.getElementById('scoreValue');

function updateScore() {
    score++;
    scoreElement.textContent = score;

    if (score >= PHASE_SCORE_THRESHOLD[currentPhase - 1]) {
        currentPhase++;
        increaseEnemySpeed();
        document.getElementById('levelValue').textContent = currentPhase;
        alert(`Parabéns! Você passou para a fase ${currentPhase}.`);
    }
}

function increaseEnemySpeed() {
    enemySpeed += ENEMY_SPEED_INCREMENT;
}

let missedScore = 0;
const missedScoreElement = document.getElementById('missedScoreValue');

function updateMissedScore() {
    missedScore++;
    missedScoreElement.textContent = missedScore;
}
