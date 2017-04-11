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

