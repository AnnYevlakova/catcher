let {load, get, onReady, isReady} = require('../resources');
let {isDown}  = require('../input');
let {check} = require('../collides');
let {getSettings, setListeners, nextLevel, setLevel} = require('../listeners');

let canvas = document.createElement("canvas");
let ctx = canvas.getContext("2d");
canvas.width = 950;
canvas.height = 480;
document.getElementsByClassName('game-box')[0].appendChild(canvas);
let curLevel = document.getElementById('current-level');
let startGame;
let duration;
let i = 0;
let pause = false;
let audio = document.getElementById('audio');
let gameOverSound = document.getElementById('gameOver-sound');
let winSound = document.getElementById('winSound');
setListeners(gameOver, reset, main, audio, gameOverSound);

let requestAnimFrame = (function(){
    return window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback){
            window.setTimeout(callback, 1000 / 60);
        };
})();



let lastTime;
function main() {
    if(pause) {
        return;
    }
    let now = Date.now();
    duration = (now-startGame) / 1000;
    let dt = (now - lastTime) / 1000.0;
    i = nextLevel(curLevel, duration,i, enemies, gameWin);
    
    update(dt);
    render();

    lastTime = now;
    requestAnimFrame(main);
};


let levels  = {
    0: [12,8,5,6, 300],
    1: [16,12,9,8, 200],
    2: [21,17,14,13, 100],
    3: [22,18,15,14, 50]
    
}

function init() {
    document.getElementById('logo').classList.add('hover');
    
    audio.play();
    terrainPattern = ctx.createPattern(get('img/terrain.png'), 'repeat');

    document.querySelector('.start-box').classList.add('hover');
    
    reset();
    lastTime = Date.now();
    main();
}


function start() {
   document.getElementById('start').addEventListener('click', init);
   curLevel.innerHTML = `Level ${getSettings()[1]}`;
    startGame = Date.now();
}
load([
    'img/player-blue.png',
    'img/player-pinc.png',
    'img/player-green.png',
    'img/fly.png',
    'img/terrain.png',
    'img/items.png',
    'img/points.png'
]);
onReady(start); 










function Sprite(url, pos, size, speed, frames, dir, once, id, itemSpeed) {
    this.id = id;
    this.url = url;
    this.pos = pos;
    this.size = size;
    this.speed = typeof speed === 'number' ? speed : 0;
    this.frames = frames;
    this._index = 0;
    this.dir = dir;
    this.once = once;
    this.itemSpeed = itemSpeed;
};

Sprite.prototype.update = function(dt) {
    this._index += this.speed*dt;
}

Sprite.prototype.render = function(ctx) {
    let frame;

    if(this.speed > 0) {
        var max = this.frames.length;
        var idx = Math.floor(this._index);
        frame = this.frames[idx % max];

        if(this.once && idx >= max) {
            this.done = true;
            return;
        }
    }
    else {
        frame = 0;
    }


    let x = this.pos[0];
    let y = this.pos[1];

    if(this.dir == 'vertical') {
        y += frame * this.size[1];
    }
    else {
        x += frame * this.size[0];
    }

    ctx.drawImage(get(this.url),
                  x, y,
                  this.size[0], this.size[1],
                  0, 0,
                  this.size[0], this.size[1]);
}


let player;
function setPlayer(color) {
    color = getSettings()[0] || 'blue';
    return {
        pos: [320, 300],
        sprite: new Sprite(`img/player-${color}.png`, [0, 0], [75, 96], 8, [0], 'horizontal')
    };
}




let enemies = [];
let points = [];
let enemySpeed = 50;
let pointSpeed = 50;
let playerSpeed = 200;

let gameTime = 0;
let isGameOver;
let terrainPattern;
let isWin = false;

// The score
let score = 0;
let scoreEl = document.getElementById('score');
let heart = document.getElementById('heart');




function updateEntities(dt) {
    // Update the player sprite animation
    player.sprite.update(dt);

    // Update all the enemies
    enemies.filter((enemy)=>{
        if(enemy.sprite.id == 4) {
            enemy.pos[1] += enemy.sprite.itemSpeed*10 * dt;
            if(enemies.length%2 == 0) {
                enemy.pos[0] += enemy.sprite.itemSpeed*10 * dt;
            } else {
                enemy.pos[0] -= enemy.sprite.itemSpeed*10 * dt; 
            }
        enemy.sprite.update(dt);
        } else {
            enemy.pos[1] += enemy.sprite.itemSpeed*10 * dt;
            enemy.sprite.update(dt);
        }
        // Remove if offscreen
        if(enemy.pos[1] + enemy.sprite.size[1] > canvas.height+50) {
            return false;
        }
        return true;
    });
    
    // Update all the points
    points.filter((point)=> {
        point.pos[1] -= point.sprite.itemSpeed*10 * dt;
        point.sprite.update(dt);
        // Remove if offscreen
        if(point.pos[1] + point.sprite.size[1] < -30) {
            return false;
        }
        return true;
    });
}






function update(dt, level) {
    gameTime += dt;
    level = levels[getSettings()[1]];
    
    handleInput(dt);
    updateEntities(dt);
    let i = Math.round(Math.random()*level[4]); 
    
    if(i == Math.round(level[4]*0.01)) {
        enemies.push({
            pos: [Math.random() *(canvas.width- 70),-70],
            sprite: new Sprite('img/fly.png', [0, 0], [73, 34],12, [0,1], 'vertical', false, 0, level[0])
        });
    }
    if(i == Math.round(level[4]*0.33)) {
        enemies.push({
            pos: [Math.random() *(canvas.width- 70),-70],
            sprite: new Sprite('img/items.png', [57, 0], [49,35], 10  , [0,1], 'vertical', false, 1, level[1])
        });
    }
    if(i == Math.round(level[4]*0.61)) {
        enemies.push({
            pos: [Math.random() *(canvas.width- 70),-70],
            sprite: new Sprite('img/items.png', [180,0], [61, 45], 2, [0,1], 'vertical', false, 2, level[2])
        });
    }
    if(i == Math.round(level[4]*0.89)) {
        enemies.push({
            pos: [Math.random() *(canvas.width- 70),-70],
            sprite: new Sprite('img/items.png', [0,55], [60, 60], 2, [0], 'vertical',false,3, level[3])
        });
    }
    if(i == Math.round(level[4]*0.55) && getSettings()[1] == 3) {
        enemies.push({
            pos: [Math.random() *(canvas.width- 70),-70],
            sprite: new Sprite('img/items.png', [240,0], [60, 180], 8, [0,1], 'horisontal',false, 4, level[3])
        });
    }
    let currentScore = check(enemies, player, scoreEl, canvas, gameOver, points, Sprite);
};






function handleInput(dt) {
    if(isDown('LEFT') || isDown('a')) {
        player.pos[0] -= playerSpeed * dt;
        player.sprite.frames=[0,1,2];
    } else if(isDown('RIGHT') || isDown('d')) {
        player.pos[0] += playerSpeed * dt;
        player.sprite.frames=[0,1,2];
    } else {
        player.sprite.frames=[0];
    }
}




// Draw everything
function render() {
    ctx.fillStyle = terrainPattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    if(!isGameOver || !isWin) {
        renderEntity(player);
    }
    renderEntities(enemies);
    renderEntities(points);
};

function renderEntities(list) {
    list.forEach((item)=>{
        renderEntity(item);
    });    
}

function renderEntity(entity) {
    ctx.save();
    ctx.translate(entity.pos[0], entity.pos[1]);
    entity.sprite.render(ctx);
    ctx.restore();
}


function gameWin() {
    winSound.play();
    audio.pause();
    pause = true;
    isWin = true;
    document.getElementById('result-game').innerHTML = 'You Win!';
    document.getElementById('result').classList.remove('hover');
    document.getElementById('result').style.top = (document.documentElement.clientHeight-document.getElementById('result').clientHeight)/2 + 'px';
    document.getElementById('result').style.left = (document.documentElement.clientWidth-document.getElementById('result').clientWidth)/2 + 'px';
    
    document.getElementById('current-score').innerHTML = `your score: ${document.getElementById('score').innerHTML}`;
    document.querySelector('.score-box').style.opacity = 0;
    player.pos= [0, -700];
}


// Game over
function gameOver() {
    audio.pause();
    gameOverSound.play();
    pause = true;
    isGameOver = true;
    document.getElementById('result-game').innerHTML = 'Game Over';
    document.getElementById('result').classList.remove('hover');
    document.getElementById('result').style.top = (document.documentElement.clientHeight-document.getElementById('result').clientHeight)/2 + 'px';
    document.getElementById('result').style.left = (document.documentElement.clientWidth-document.getElementById('result').clientWidth)/2 + 'px';
    
    document.getElementById('current-score').innerHTML = `your score: ${document.getElementById('score').innerHTML}`;
    document.querySelector('.score-box').style.opacity = 0;
    player.pos = [0, -700];
}

// Reset game to original state
function reset() {
    pause = false;
    document.getElementById('result').classList.add('hover');
    isGameOver = false;
    isWin = false;
    gameTime = 0;
    score = 0;
    heart.src = "img/heart2.png";
    heart.classList.add('2');
    enemies = [];
    points = [];
    document.querySelector('.score-box').style.opacity = 1;
    player = setPlayer(color);
    player.pos = [(canvas.width-80)/2, 350];
    player.sprite.pos = [0,0];
    curLevel.innerHTML = `Level ${getSettings()[1]}`;
    score = 0;
    scoreEl.innerHTML = 0;
    startGame = Date.now();
    i = 0;
};
module.exports = {
    enemies, player, scoreEl, canvas, gameOver, points, Sprite, gameWin, pause, main, i, audio, gameOverSound
}
