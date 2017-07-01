var Game = function () {

    var simonArray = [];
    var strict = false;
    var on = false;

    this.onOff = function () {
        on = !ion;
    }
    this.toggleStrict = function () {
        strict = !strict;
    }
    this.start = function () {
        // TODO
        // starts playing array
        // Choose random tile and play;
    };

    this.isOn = function () {
        return on;
    }
    this.isStrict = function () {
        return strict;
    };
}

var gameState = {

};

$(document).ready(function () {
    $(".play-tiles").on("click", function () {});
});

// on - activates display #output
//    - makes controll buttons enabled


// off - deactivates, clears the display #output
//     - stops playing simonArray;
//     - clears simonArray
//     - clear state of all buttons
//       - disable controll buttons 
//       - disable tiles
