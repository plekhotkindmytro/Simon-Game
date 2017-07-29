var context = new(AudioContext || webkitAudioContex)();
var oscillator;
var gain;

var notes = [
    45, 47, 49, 51
];



var Controls = function () {
    var values = {
        count: {
            start: "--",
            error: "!!",
        }
    };
    var classes = {
        count: {
            enabled: "output-enabled",
            disabled: "output-disabled"
        }
    }
    var that = this;
    var attack = 1 / 64;

    that.tiles = {};
    that.tiles.blue = $("#blue-tile");
    that.tiles.green = $("#green-tile");
    that.tiles.red = $("#red-tile");
    that.tiles.yellow = $("#yellow-tile");
    that.btnOnOff = $("#on-off");
    that.start = $("#start");
    that.strict = $("#strict");
    that.strictInput = $("#strict-input");
    that.count = {}
    that.count.output = $("#output");


    that.count.enable = function () {
        that.count.output.text(values.count.start);
        that.count.output.removeClass(classes.count.disabled);
        that.count.output.addClass(classes.count.enabled);
    };
    that.count.disable = function () {
        that.count.output.text(values.count.start);
        that.count.output.removeClass(classes.count.enabled);
        that.count.output.addClass(classes.count.disabled);
    };
    that.count.error = function () {
        that.count.output.val(values.count.error);
    };

    that.btnOnOff.change(function () {
        if (this.checked) {
            // on
            enableAllControls();
        } else {
            // off
            disableAllControls();
        }
    });

    function enableAllControls() {
        that.tiles.blue
            .add(that.tiles.green)
            .add(that.tiles.red)
            .add(that.tiles.yellow)
            .add(that.start)
            .add(that.strict)
            .removeClass("disabled-element");

        $(window).on("mouseup", function () {
            that.tiles.blue.removeClass("light-blue-tile");
            that.tiles.green.removeClass("light-green-tile");
            that.tiles.yellow.removeClass("light-yellow-tile");
            that.tiles.red.removeClass("light-red-tile");

            if (oscillator) {
                gain.gain.linearRampToValueAtTime(0, context.currentTime + attack);
                oscillator.stop(context.currentTime + attack);
                oscillator = null;
            }

        });
        that.tiles.blue
            .on("mousedown", function () {
                that.tiles.blue.addClass("light-blue-tile");

                startOscillator(notes[0]);
            });


        that.tiles.green
            .on("mousedown", function () {
                that.tiles.green.addClass("light-green-tile");

                startOscillator(notes[1]);
            });

        that.tiles.yellow
            .on("mousedown", function () {
                that.tiles.yellow.addClass("light-yellow-tile");

                startOscillator(notes[2]);
            });

        that.tiles.red
            .on("mousedown", function () {
                that.tiles.red.addClass("light-red-tile");

                startOscillator(notes[3]);
            });

        that.strictInput.prop('checked', false);
        that.count.enable();

        var game = new Game();
        that.start.on("click", function () {
            blinkText(that.count.output, 2, game.playNew);
        });

    }



    function disableAllControls() {
        that.tiles.blue
            .add(that.tiles.green)
            .add(that.tiles.red)
            .add(that.tiles.yellow)
            .add(that.start)
            .add(that.strict)
            .addClass("disabled-element");

        that.strictInput.prop('checked', false);
        that.count.disable();
    }

    function startOscillator(note) {
        oscillator = context.createOscillator();
        gain = context.createGain();
        oscillator.frequency.value = mToF(note);
        oscillator.type = "sine";
        oscillator.connect(gain);
        gain.gain.setValueAtTime(0, context.currentTime);
        gain.gain.linearRampToValueAtTime(1, context.currentTime + attack);
        gain.connect(context.destination);
        oscillator.start(0);
    }

    function mToF(note) {
        return Math.pow(2, (note - 69) / 12) * 440.0;
    }

    function Game() {
        var sequence = [];

        this.playNew = function () {
            var randomTile = Math.floor(Math.random() * 4);
            sequence.push(randomTile);
            var soundLengthMs = 1000;
            sequence.forEach(function (tile) {

                switch (tile) {
                    case 0:
                        that.tiles.blue.trigger("mousedown");
                        setTimeout(function () {
                            that.tiles.blue.trigger("mouseup");
                        }, soundLengthMs);
                        break;
                    case 1:
                        that.tiles.green.trigger("mousedown");
                        setTimeout(function () {
                            that.tiles.green.trigger("mouseup");
                        }, soundLengthMs);
                        break;
                    case 2:
                        that.tiles.red.trigger("mousedown");
                        setTimeout(function () {
                            that.tiles.red.trigger("mouseup");
                        }, soundLengthMs);
                        break;
                    case 3:
                        that.tiles.yellow.trigger("mousedown");
                        setTimeout(function () {
                            that.tiles.yellow.trigger("mouseup");
                        }, soundLengthMs);
                        break;
                }
            });


        }

    }


    disableAllControls();
};



/** 
    Usage: blinkText(that.count.output, 2, function(){});
*/
function blinkText(el, reps, callback) {
    var text = el.text();
    if (reps > 0) {
        el.text("");
        setTimeout(function () {
            el.text(text);
            setTimeout(function () {
                blinkText(el, --reps, callback);
            }, 300);
        }, 300);

    } else {
        callback();
    }
}
