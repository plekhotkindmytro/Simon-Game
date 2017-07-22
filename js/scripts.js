var CONTROLS = {
    tiles: {
        green: null,
        red: null,
        yellow: null,
        blue: null
    },
    onOff: null,
    count: null,
    start: null,
    strict: null,
    init: function () {
        this.tiles.blue = $("#blue-tile");
        this.tiles.green = $("#green-tile");
        this.tiles.red = $("#red-tile");
        this.tiles.yellow = $("#yellow-tile");

        this.btnOnOff = $("#on-off");
        this.count = $("#output");
        this.start = $("#start");
        this.strict = $("#strict");
    }
};

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
};

var gameState = {

};

var controls;
$(document).ready(function () {
    controls = new Controls();


    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    var context = new AudioContext(),

        masterGain = context.createGain();
    nodes = [];

    masterGain.gain.value = 0.3;
    masterGain.connect(context.destination);

    $(".play-tile").on("mousedown", function () {
        var oscillator = context.createOscillator();
        oscillator.type = 'square';
        oscillator.frequency.value = 760;
        oscillator.connect(masterGain);
        oscillator.start(0);

        nodes.push(oscillator);

    });

    $(".play-tile").on("mouseup", function () {
        var new_nodes = [];

        for (var i = 0; i < nodes.length; i++) {
            if (Math.round(nodes[i].frequency.value) === Math.round(760)) {
                nodes[i].stop(0);
                nodes[i].disconnect();
            } else {
                new_nodes.push(nodes[i]);
            }
        }

        nodes = new_nodes;

    });


});




// on - activates display #output
//    - makes controll buttons enabled


// off - deactivates, clears the display #output
//     - stops playing simonArray;
//     - clears simonArray
//     - clear state of all buttons
//       - disable controll buttons 
//       - disable tiles
