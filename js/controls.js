var context = new(AudioContext || webkitAudioContex)();
var oscillator;
var gain;
var computerTurn;

var noteTimeout;
var blinkTextTimeout;
var noteDisableTimeout;

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
    var game;

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
            enableAll();
        } else {
            // off
            disableAll();
        }
    });

    function enableTiles() {
        that.tiles.blue
            .add(that.tiles.green)
            .add(that.tiles.red)
            .add(that.tiles.yellow)
            .removeClass("disabled-element");

        computerTurn = false;
    }

    function enableControls() {
        that.start
            .add(that.strict)
            .removeClass("disabled-element");
        that.strictInput.prop('checked', false);
        that.count.enable();
        computerTurn = true;
    }

    function enableAll() {
        // enableTiles();
        enableControls();
    }

    $(window).on("mouseup", function () {
        if (!game) {
            return;
        }
        if (computerTurn) {
            return;
        }

        deactivateTiles();

        if (oscillator) {
            gain.gain.linearRampToValueAtTime(0, context.currentTime + attack);
            oscillator.stop(context.currentTime + attack);
            oscillator = null;
            game.checkSequence();
        }

    });

    that.tiles.blue
        .on("mousedown", function () {
            if (!game) {
                return;
            }
            that.tiles.blue.addClass("light-blue-tile");
            mousedown(0);
        });

    that.tiles.yellow
        .on("mousedown", function () {
            if (!game) {
                return;
            }
            that.tiles.yellow.addClass("light-yellow-tile");
            mousedown(1);
        });

    that.tiles.green
        .on("mousedown", function () {
            if (!game) {
                return;
            }
            that.tiles.green.addClass("light-green-tile");
            mousedown(2);
        });

    that.tiles.red
        .on("mousedown", function () {
            if (!game) {
                return;
            }
            that.tiles.red.addClass("light-red-tile");
            mousedown(3);
        });


    that.start.on("click", function () {
        game = new Game();
        that.count.output.text(values.count.start);
        blinkText(that.count.output, 2, game.playNew);
    });

    function mousedown(noteIndex) {
        if (!game) {
            return;
        }

        if (computerTurn) {
            scheduleNote(notes[noteIndex], context.currentTime);
        } else {
            startOscillator(notes[noteIndex]);
            game.addPlayerNote(noteIndex);
        }
    }

    function deactivateTiles() {
        that.tiles.blue.removeClass("light-blue-tile");
        that.tiles.green.removeClass("light-green-tile");
        that.tiles.yellow.removeClass("light-yellow-tile");
        that.tiles.red.removeClass("light-red-tile");

    }


    function disableTiles() {
        deactivateTiles();
        that.tiles.blue
            .add(that.tiles.green)
            .add(that.tiles.red)
            .add(that.tiles.yellow)
            .addClass("disabled-element");
        computerTurn = true;
    }


    function disableControls() {
        that.start
            .add(that.strict)
            .addClass("disabled-element");
        that.strictInput.prop('checked', false);
        that.count.disable();
        computerTurn = true;
    }

    function disableAll() {
        disableTiles();
        disableControls();

        if (oscillator) {
            oscillator.stop(0);
            console.log("disabled");
        }
        console.log(oscillator);
        console.log(gain);

        if (game) {
            game = null;
        }

        clearTimeout(noteTimeout);
        clearTimeout(noteDisableTimeout);
        clearTimeout(blinkTextTimeout);
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

    var noteLength = 1;
    var attack = 1 / 64;

    function scheduleNote(note, time) {
        var oscillator_ = context.createOscillator();
        // create an envelope using gain
        var gain_ = context.createGain();

        oscillator_.frequency.value = mToF(note);

        // connect the oscillator to the gain and the gain to the output
        oscillator_.connect(gain_);
        gain_.connect(context.destination);

        // let's make an envelope with almost no attack and a sharp decay...
        // starting value of 0:
        gain_.gain.setValueAtTime(0, time);
        // very quick attack to a value of 1:
        gain_.gain.linearRampToValueAtTime(1, time + attack);
        // immediate decay to a value of 0:
        gain_.gain.linearRampToValueAtTime(0, time + noteLength);

        // schedule the oscillator to start at `time` and end
        // at `time + noteLength`
        oscillator_.start(time);
        oscillator_.stop(time + noteLength);

        setTimeout(deactivateTiles, 1000 * noteLength);
    }

    function mToF(note) {
        return Math.pow(2, (note - 69) / 12) * 440.0;
    }

    function Game() {
        var killId = setTimeout(function () {
            for (var i = killId; i > 0; i--) clearInterval(i)
        }, 0);
        var sequence = [];
        var playerSequence = [];
        var game_ = this;
        var soundLengthMs = 1000;
        clearTimeout(blinkTextTimeout);
        clearTimeout(noteTimeout);
        clearTimeout(noteDisableTimeout);

        disableTiles();

        function playNote(index) {
            if (!game) {
                return;
            }
            var tileNumber = sequence[index];
            var tileElement;
            switch (tileNumber) {
                case 0:
                    tileElement = that.tiles.blue;
                    break;
                case 1:
                    tileElement = that.tiles.yellow;
                    break;
                case 2:
                    tileElement = that.tiles.green;
                    break;
                case 3:
                    tileElement = that.tiles.red;
                    break;
            }
            noteTimeout = setTimeout(function () {
                tileElement.trigger("mousedown");
                noteDisableTimeout = setTimeout(function () {
                    tileElement.trigger("mouseup");
                    index++;
                    if (index < sequence.length) {
                        playNote(index);
                    } else {
                        enableTiles();
                    }
                }, soundLengthMs);
            }, soundLengthMs / 2);
        }

        this.addPlayerNote = function (index) {
            playerSequence.push(index);
        }

        this.playNew = function () {
            var randomTile = Math.floor(Math.random() * 4);
            sequence.push(randomTile);

            disableTiles();
            noteTimeout = setTimeout(function () {
                playerSequence = [];
                game_.printScore(that.count.output);
                playNote(0);
            }, noteLength * 1000);

        };

        this.playAgain = function () {
            disableTiles();
            noteTimeout = setTimeout(function () {
                playerSequence = [];
                game_.printScore(that.count.output);
                playNote(0);
            }, noteLength * 1000);
        };

        function rightNotes(compArray, playerArray) {
            var i;
            var len = playerArray.length;

            for (i = 0; i < len; i++) {
                if (compArray[i] !== playerArray[i]) {
                    return false;
                }
            }

            return true;
        }

        this.checkSequence = function () {
            if (playerSequence.length < sequence.length) {
                if (rightNotes(sequence, playerSequence)) {
                    // do nothing
                } else {
                    disableTiles();
                    // print error and play again
                    if (that.strictInput.prop('checked')) {
                        that.count.output.text(values.count.error);
                        blinkText(that.count.output, 2, function () {
                            that.start.trigger("click");
                        });

                    } else {
                        disableTiles();
                        if (oscillator) {
                            gain.gain.linearRampToValueAtTime(0, context.currentTime + noteLength + attack);
                            oscillator.stop(context.currentTime + noteLength + attack);
                            oscillator = null;
                        }
                        that.count.output.text(values.count.error);
                        blinkText(that.count.output, 2, game_.playAgain);
                    }
                }

            } else if (rightNotes(sequence, playerSequence)) {
                if (sequence.length === 20) {
                    alert("You won the game!!!");
                    that.start.trigger("click");
                } else {
                    disableTiles();
                    game_.playNew();
                }
            } else {
                disableTiles();
                // print error and play again
                if (that.strictInput.prop('checked')) {
                    that.count.output.text(values.count.error);
                    blinkText(that.count.output, 2, function () {
                        that.start.trigger("click");
                    });
                } else {
                    if (oscillator) {
                        gain.gain.linearRampToValueAtTime(0, context.currentTime + noteLength + attack);
                        oscillator.stop(context.currentTime + noteLength + attack);
                        oscillator = null;
                    }
                    that.count.output.text(values.count.error);
                    blinkText(that.count.output, 2, game_.playAgain);
                }
            }
        };

        /**
             output - object selected by jQuery
             e.g. printScore($("#output"));
        */
        this.printScore = function (output) {
            var text = sequence.length < 10 ? "0" + sequence.length : sequence.length;
            output.text(text);
        };

    }


    disableAll();
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
            blinkTextTimeout = setTimeout(function () {
                blinkText(el, --reps, callback);
            }, 300);
        }, 300);

    } else {
        callback();
    }
}
