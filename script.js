/* =================================
   CONFIGURACIÓN DEL CANVAS Y CONTEXTO
   ================================= */
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

/* =================================
   CONSTANTES DEL JUEGO
   ================================= */
// Dimensiones de los objetos
const PADDLE_WIDTH = 10;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 8;
const PADDLE_SPEED = 6;

// Velocidad inicial de la bola y límite máximo
const BALL_INITIAL_SPEED = 4;
const MAX_BALL_SPEED = 8;

// Puntuación para ganar
const WINNING_SCORE = 11;

// Colores del juego
const COLOR_PRIMARY = '#00ff88';
const COLOR_BACKGROUND = '#000';
const COLOR_TEXT = '#fff';

/* =================================
   OBJETOS DEL JUEGO
   ================================= */
// Raqueta del Jugador 1 (izquierda)
const paddle1 = {
    x: 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0 // Velocidad vertical
};

// Raqueta del Jugador 2 (derecha)
const paddle2 = {
    x: canvas.width - PADDLE_WIDTH - 10,
    y: canvas.height / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0 // Velocidad vertical
};

// Bola del juego
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    vx: BALL_INITIAL_SPEED, // Velocidad horizontal
    vy: BALL_INITIAL_SPEED, // Velocidad vertical
    radius: BALL_SIZE
};

// Variables de puntuación y estado
let score1 = 0;
let score2 = 0;
let gameRunning = false;
let gameOver = false;

// Almacenar las teclas presionadas
const keysPressed = {
    ArrowUp: false,
    ArrowDown: false,
    'a': false,
    'A': false,
    'z': false,
    'Z': false
};

/* =================================
   MANEJADORES DE EVENTOS DE TECLADO
   ================================= */
// Detectar cuando una tecla es presionada
document.addEventListener('keydown', (e) => {
    if (e.key in keysPressed) {
        keysPressed[e.key] = true;
    }
});

// Detectar cuando una tecla es liberada
document.addEventListener('keyup', (e) => {
    if (e.key in keysPressed) {
        keysPressed[e.key] = false;
    }
});

/* =================================
   FUNCIONES DE ACTUALIZACIÓN
   ================================= */
/**
 * Actualiza la posición de las raquetas según las teclas presionadas
 */
function updatePaddles() {
    // Movimiento del Jugador 1 (raqueta izquierda)
    if (keysPressed['ArrowUp'] && paddle1.y > 0) {
        paddle1.y -= PADDLE_SPEED;
    }
    if (keysPressed['ArrowDown'] && paddle1.y < canvas.height - PADDLE_HEIGHT) {
        paddle1.y += PADDLE_SPEED;
    }

    // Movimiento del Jugador 2 (raqueta derecha)
    if ((keysPressed['a'] || keysPressed['A']) && paddle2.y > 0) {
        paddle2.y -= PADDLE_SPEED;
    }
    if ((keysPressed['z'] || keysPressed['Z']) && paddle2.y < canvas.height - PADDLE_HEIGHT) {
        paddle2.y += PADDLE_SPEED;
    }
}

/**
 * Actualiza la posición de la bola
 */
function updateBall() {
    // Actualizar posición de la bola
    ball.x += ball.vx;
    ball.y += ball.vy;

    // Rebote en los bordes superior e inferior
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.vy = -ball.vy;
        // Asegurar que la bola no salga del canvas
        ball.y = Math.max(ball.radius, Math.min(canvas.height - ball.radius, ball.y));
    }

    // Colisión con la raqueta del Jugador 1 (izquierda)
    if (ball.x - ball.radius < paddle1.x + paddle1.width &&
        ball.y > paddle1.y &&
        ball.y < paddle1.y + paddle1.height) {
        ball.vx = Math.abs(ball.vx); // Asegurar que va hacia la derecha
        ball.x = paddle1.x + paddle1.width + ball.radius;
        // Aumentar velocidad ligeramente si no está en el máximo
        if (Math.abs(ball.vx) < MAX_BALL_SPEED) {
            ball.vx *= 1.05;
        }
    }

    // Colisión con la raqueta del Jugador 2 (derecha)
    if (ball.x + ball.radius > paddle2.x &&
        ball.y > paddle2.y &&
        ball.y < paddle2.y + paddle2.height) {
        ball.vx = -Math.abs(ball.vx); // Asegurar que va hacia la izquierda
        ball.x = paddle2.x - ball.radius;
        // Aumentar velocidad ligeramente si no está en el máximo
        if (Math.abs(ball.vx) < MAX_BALL_SPEED) {
            ball.vx *= 1.05;
        }
    }

    // Puntuación: si la bola sale del canvas por la izquierda
    if (ball.x - ball.radius < 0) {
        score2++;
        updateScore();
        resetBall();
    }

    // Puntuación: si la bola sale del canvas por la derecha
    if (ball.x + ball.radius > canvas.width) {
        score1++;
        updateScore();
        resetBall();
    }
}

/**
 * Reinicia la posición y velocidad de la bola
 */
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    // Velocidad aleatoria para que sea más interesante
    ball.vx = (Math.random() > 0.5 ? 1 : -1) * BALL_INITIAL_SPEED;
    ball.vy = (Math.random() - 0.5) * 2 * BALL_INITIAL_SPEED;
}

/**
 * Actualiza la display de puntuación y verifica si alguien ha ganado
 */
function updateScore() {
    document.getElementById('score1').textContent = score1;
    document.getElementById('score2').textContent = score2;

    // Verificar si alguien ha ganado
    if (score1 >= WINNING_SCORE) {
        gameRunning = false;
        gameOver = true;
        document.getElementById('gameStatus').textContent = '🎉 ¡Jugador 1 GANA! Presiona reiniciar para jugar de nuevo.';
    } else if (score2 >= WINNING_SCORE) {
        gameRunning = false;
        gameOver = true;
        document.getElementById('gameStatus').textContent = '🎉 ¡Jugador 2 GANA! Presiona reiniciar para jugar de nuevo.';
    } else {
        document.getElementById('gameStatus').textContent = `Puntuación actualizada - ${score1} : ${score2}`;
    }
}

/* =================================
   FUNCIONES DE DIBUJO
   ================================= */
/**
 * Dibuja la raqueta en el canvas
 */
function drawPaddle(paddle) {
    ctx.fillStyle = COLOR_PRIMARY;
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
    // Efecto de brillo en los bordes
    ctx.strokeStyle = COLOR_PRIMARY;
    ctx.lineWidth = 1;
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

/**
 * Dibuja la bola en el canvas
 */
function drawBall() {
    ctx.fillStyle = COLOR_PRIMARY;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
    // Efecto de brillo
    ctx.strokeStyle = COLOR_PRIMARY;
    ctx.lineWidth = 1;
    ctx.stroke();
}

/**
 * Dibuja la línea punteada del medio
 */
function drawCenterLine() {
    ctx.strokeStyle = COLOR_PRIMARY;
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.setLineDash([]);
}

/**
 * Dibuja el texto "VR #1" en el centro del canvas
 */
function drawCenterText() {
    ctx.fillStyle = 'rgba(0, 255, 136, 0.15)';
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('VR #1', canvas.width / 2, canvas.height / 2);
}

/**
 * Dibuja todo lo que hay en el canvas
 */
function draw() {
    // Limpiar canvas con fondo negro
    ctx.fillStyle = COLOR_BACKGROUND;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dibujar línea central
    drawCenterLine();

    // Dibujar marca VR #1
    drawCenterText();

    // Dibujar objetos del juego
    drawPaddle(paddle1);
    drawPaddle(paddle2);
    drawBall();
}

/* =================================
   BUCLE PRINCIPAL DEL JUEGO
   ================================= */
/**
 * Actualiza y dibuja el juego continuamente
 */
function gameLoop() {
    if (gameRunning && !gameOver) {
        updatePaddles();
        updateBall();
    }

    draw();
    requestAnimationFrame(gameLoop);
}

/* =================================
   MANEJADORES DE BOTONES
   ================================= */
/**
 * Inicia el juego
 */
document.getElementById('startBtn').addEventListener('click', () => {
    if (!gameRunning && !gameOver) {
        gameRunning = true;
        document.getElementById('gameStatus').textContent = '¡Juego en curso! Puntuación actual: ' + score1 + ' : ' + score2;
    }
});

/**
 * Reinicia completamente el juego
 */
document.getElementById('resetBtn').addEventListener('click', () => {
    // Reiniciar variables
    score1 = 0;
    score2 = 0;
    gameRunning = false;
    gameOver = false;

    // Reiniciar posiciones
    paddle1.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    paddle2.y = canvas.height / 2 - PADDLE_HEIGHT / 2;
    resetBall();

    // Actualizar UI
    document.getElementById('score1').textContent = '0';
    document.getElementById('score2').textContent = '0';
    document.getElementById('gameStatus').textContent = 'Presiona "Iniciar Juego" para comenzar';
});

/* =================================
   INICIAR EL JUEGO
   ================================= */
gameLoop();
