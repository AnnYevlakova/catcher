/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

function collides(x, y, r, b, x2, y2, r2, b2) {
    return !(r <= x2 || x > r2 ||
             b <= y2 || y > b2);
}   

function boxCollides(pos, size, pos2, size2) {
    return collides(pos[0], pos[1],
           pos[0] + size[0]-10, pos[1] + size[1] -10,
           pos2[0], pos2[1],
           pos2[0] + size2[0] -10, pos2[1] + size2[1]-10);
}
    
function checkPlayerBounds(player, canvas) {
    if(player.pos[0] < 0) {
        player.pos[0] = 0;
    }
    else if(player.pos[0] > canvas.width - player.sprite.size[0]) {
        player.pos[0] = canvas.width - player.sprite.size[0];
    }
}
function pushPoint(player, points, pos, Sprite) {
    points.push( {
        pos: [player.pos[0], player.pos[1]],
         sprite: new Sprite('img/points.png', pos,[50,25], 0, [0], 'vertical', true, 4, 10)
    });
}
function check(enemies, player, scoreEl, canvas, gameOver, points, Sprite) {
    let score = Number(scoreEl.innerHTML);
    checkPlayerBounds(player,canvas);

    // Run collision detection for all enemies
    for(var i=0; i<enemies.length; i++) {
        let pos = enemies[i].pos;
        let size = enemies[i].sprite.size;
        let id = enemies[i].sprite.id;

        if(boxCollides(pos, size, player.pos, player.sprite.size)) {
            switch(id) {
                case 3:
                    if(heart.classList.contains('2')) {
                    heart.classList.remove('2');
                    heart.classList.add('1');
                    heart.src = "img/heart1.png";                 
                    player.sprite.pos = [231, 0];
                    } else if(heart.classList.contains('1')) {
                        heart.classList.remove('1');
                        heart.classList.add('0');
                        heart.src = "img/heart0.png";
                        player.sprite.pos = [0, 97];
                    } else if(heart.classList.contains('0')) {
                        heart.classList.remove('0');
                        gameOver();
                        score = 0;
                    }
                    enemies.splice(i, 1);
                    break;
                case 1:
                    score += 5;
                    pushPoint(player, points, [0,25], Sprite);
                    enemies.splice(i, 1);
                    break;
                case 2:
                    score += 20;
                    pushPoint(player, points, [0,50], Sprite);
                    enemies.splice(i, 1);
                    break;
                case 4:
                    score -= 50;
                    pushPoint(player, points, [0,0], Sprite);
                    enemies.splice(i, 1);
                default:
                    score -=50;
                    pushPoint(player, points, [0,0], Sprite);
                    if(score < 0) {
                        if(heart.classList.contains('2')) {
                            heart.classList.remove('2');
                            heart.classList.add('1');
                            heart.src = "img/heart1.png";
                             player.sprite.pos = [231, 0];
                        } else if(heart.classList.contains('1')) {
                            heart.classList.remove('1');
                            heart.classList.add('0');
                            heart.src = "img/heart0.png";
                            player.sprite.pos = [0, 97];
                        } else if(heart.classList.contains('0')) {
                            heart.classList.remove('0');
                            gameOver();
                            score = 0;
                        }
                    }
                    enemies.splice(i, 1);
                }
            }
        }
        scoreEl.innerHTML = score;
    }

module.exports = {
    check
}



/***/ }),
/* 1 */
/***/ (function(module, exports) {

let pressedKeys = {};

function setKey(event, status) {
    let code = event.keyCode;
    let key;

    switch(code) {
        case 37: key = 'LEFT'; break;
        case 39: key = 'RIGHT'; break;
        default: key = String.fromCharCode(code);
    }

    pressedKeys[key] = status;
}

document.addEventListener('keydown', function(e) {
    setKey(e, true);
});

document.addEventListener('keyup', function(e) {
    setKey(e, false);
});

 window.addEventListener('blur', function() {
    pressedKeys = {};
});


module.exports = {
    isDown: function(key) {
        return pressedKeys[key.toUpperCase()];
    }
};


/***/ }),
/* 2 */
/***/ (function(module, exports) {


let color = '';
let level = 0;

function getSettings() {
    return [color, level];
}
function setLevel() {
    level = 0;
}
function nextLevel(curLevel, dt, i, enemies, gameWin) {
    i = i || 0;
    if(dt-i> 30 && level < 2){
        curLevel.innerHTML = `Level ${level+1}`;
        level += 1;
        return i +=30;
    }else if(dt-i> 30 && level == 2) {
        curLevel.innerHTML = 'SUPER LEVEL';
        level += 1;
        return i +=30;
    }else if(dt-i < 30 && level == 3) {
        curLevel.innerHTML = 'SUPER LEVEL';
        return i;
    }else if(dt-i < 30){
        return i;
    } else if(dt-i > 50 && level == 3){
        gameWin();
    }
}


function setListeners(gameOver, reset, main, audio, gameOverSound) {
    document.getElementById('start-box').style.top = (document.documentElement.clientHeight-document.getElementById('start-box').clientHeight)/2 + 'px';
    document.getElementById('start-box').style.left = (document.documentElement.clientWidth-document.getElementById('start-box').clientWidth)/2 + 'px';

    
    document.getElementById('settings').addEventListener('click', function() {
        document.getElementById('sets').classList.remove('hover');
        document.getElementById('sets').style.top = (document.documentElement.clientHeight-document.getElementById('sets').clientHeight)/2 + 'px';
        document.getElementById('sets').style.left = (document.documentElement.clientWidth-document.getElementById('sets').clientWidth)/2 + 'px';
        settings.length = 0;
    });

    document.getElementById('set').addEventListener('click', function() {
        document.getElementById('sets').classList.add('hover');
        color = document.getElementById('color').options[document.getElementById('color').options.selectedIndex].value;
        level = Number(document.getElementById('level').options[document.getElementById('level').options.selectedIndex].value);
    });

    document.getElementById('rules').addEventListener('click', function() {
        document.getElementById('game-rules').classList.remove('hover');
        document.getElementById('game-rules').style.top = (document.documentElement.clientHeight-document.getElementById('game-rules').clientHeight)/2 + 'px';
        document.getElementById('game-rules').style.left = (document.documentElement.clientWidth-document.getElementById('game-rules').clientWidth)/2 + 'px';
    });

    document.getElementById('close-rules').addEventListener('click', function () {
        document.getElementById('game-rules').classList.add('hover');
    });

    function goBack() {
        audio.pause();
        gameOver();
        gameOverSound.pause();
        document.querySelector('.result').classList.add('hover');
        document.querySelector('.start-box').classList.remove('hover');
    }
    document.querySelectorAll('.back')[0].addEventListener('click', goBack);
    document.querySelectorAll('.back')[1].addEventListener('click', goBack);
    
    document.querySelector('.score-box .play-again').addEventListener('click', function() {
        audio.play();
        reset();
    });
    document.querySelector('.result .play-again').addEventListener('click', function() {
        audio.play();
        setLevel()
        reset();
        main();
    });
}

module.exports = {
    getSettings,
    setListeners,
    nextLevel,
    setLevel
}


/***/ }),
/* 3 */
/***/ (function(module, exports) {

let resourceCache = {};
let loading = [];
let readyCallbacks = [];

// Load an image url or an array of image urls
function load(urlOrArr) {
    if(urlOrArr instanceof Array) {
        urlOrArr.forEach(function(url) {_load(url); });
    }else {
        _load(urlOrArr);
    }
}

function _load(url) {
    if(resourceCache[url]) {
        return resourceCache[url];
    } else {
        let img = new Image();
        img.onload = function() {
            resourceCache[url] = img;
            if(isReady()) {
                readyCallbacks.forEach(function(func) { func(); });
            }
        };
        resourceCache[url] = false;
        img.src = url;
    }
}

function get(url) {
    return resourceCache[url];
}

function isReady() {
    let ready = true;
    for(var k in resourceCache) {
        if(resourceCache.hasOwnProperty(k) && !resourceCache[k]) {
            ready = false;
        }
    }
    return ready;
}

function onReady(func) {
    readyCallbacks.push(func);
}

module.exports = {
    load, get, onReady, isReady
}



/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

let {load, get, onReady, isReady} = __webpack_require__(3);
let {isDown}  = __webpack_require__(1);
let {check} = __webpack_require__(0);
let {getSettings, setListeners, nextLevel, setLevel} = __webpack_require__(2);

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


/***/ })
/******/ ]);