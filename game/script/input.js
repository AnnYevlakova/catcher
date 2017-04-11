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
