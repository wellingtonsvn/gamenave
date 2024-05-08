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

document.addEventListener('keydown', function(event) {
    if (event.code === 'ArrowLeft') {
        movePlayerLeft();
    } else if (event.code === 'ArrowRight') {
        movePlayerRight();
    } else if (event.code === 'Space') {
        shoot();
    }
});

function movePlayerLeft() {
    playerPositionX -= 20;
    playerPositionX = Math.max(playerPositionX, 0); // Impede que a nave vá além do lado esquerdo
    playerPositionX = Math.min(playerPositionX, game.offsetWidth - player.offsetWidth); // Impede que a nave vá além do lado direito
    player.style.left = playerPositionX + 'px';
}

function movePlayerRight() {
    playerPositionX += 20;
    playerPositionX = Math.max(playerPositionX, 0); // Impede que a nave vá além do lado esquerdo
    playerPositionX = Math.min(playerPositionX, game.offsetWidth - player.offsetWidth); // Impede que a nave vá além do lado direito
    player.style.left = playerPositionX + 'px';
}

function shoot() {
    bullet.style.display = 'block';
    bullet.style.left = player.offsetLeft + (player.offsetWidth / 6) - 6 + 'px'; // Ajuste para centralizar o tiro
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
            enemy.classList.add('hit'); // Marca a nave inimiga como atingida pelo jogador
            enemy.remove();
            bullet.style.display = 'none';
            updateScore();
        }
    });
}

function createEnemy() {
    const enemy = document.createElement('div');
    enemy.classList.add('enemy');
    const maxEnemyLeft = game.offsetWidth - player.offsetWidth; // Determina o limite máximo para a posição horizontal da nave inimiga
    enemy.style.left = Math.max(0, Math.min(maxEnemyLeft, Math.random() * maxEnemyLeft)) + 'px'; // Limita a posição horizontal da nave inimiga dentro dos limites da área ocupada pela nave do jogador
    enemy.style.top = '0';
    game.appendChild(enemy);

    let enemyInterval = setInterval(function() {
        let enemyTop = parseInt(enemy.style.top);
        enemy.style.top = (enemyTop + enemySpeed) + 'px'; // Usamos a variável de velocidade aqui

        if (enemyTop > window.innerHeight) {
            gameOver(); // Chamada da função gameOver() quando uma nave inimiga atinge a parte inferior da tela
            if (!enemy.classList.contains('hit')) {
                updateMissedScore();
            }
            enemy.remove();
            clearInterval(enemyInterval);
        }
    }, 30);
}

function gameOver() {
    alert('melhore :)');
    location.reload(); // Recarrega a página quando o jogador perder
}

let score = 0;
const scoreElement = document.getElementById('scoreValue');

function updateScore() {
    score++;
    scoreElement.textContent = score;

    // Verifica se o jogador passou para a próxima fase
    if (score >= PHASE_SCORE_THRESHOLD[currentPhase - 1]) {
        currentPhase++;
        increaseEnemySpeed(); // Aumenta a velocidade das naves inimigas na próxima fase
        document.getElementById('levelValue').textContent = currentPhase; // Atualiza o nível na interface
        alert(`Parabéns! Você passou para a fase ${currentPhase}.`);
    }
}

function increaseEnemySpeed() {
    enemySpeed += ENEMY_SPEED_INCREMENT; // Aumenta a velocidade das naves inimigas
}

let missedScore = 0; // Pontuação por naves inimigas perdidas
const missedScoreElement = document.getElementById('missedScoreValue');

function updateMissedScore() {
    missedScore++;
    missedScoreElement.textContent = missedScore;
}

setInterval(createEnemy, 2000);
