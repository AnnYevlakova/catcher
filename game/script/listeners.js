
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
