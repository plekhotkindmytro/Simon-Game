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

    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var context = new AudioContext();


    var blueOscillator = context.createOscillator();
    blueOscillator.type = 'square';
    blueOscillator.frequency.value = 500;

    var greenOscillator = context.createOscillator();
    greenOscillator.type = 'square';
    greenOscillator.frequency.value = 600;


    function enableAllControls() {
        that.tiles.blue
            .add(that.tiles.green)
            .add(that.tiles.red)
            .add(that.tiles.yellow)
            .add(that.start)
            .add(that.strict)
            .removeClass("disabled-element");

        blueOscillator.start();
        greenOscillator.start();

        that.tiles.blue
            .on("mousedown", function () {
                blueOscillator.connect(context.destination);
            })
            .on("mouseup", function () {
                blueOscillator.disconnect(context.destination);
            });


        that.tiles.green.on("mousedown", function () {
                greenOscillator.connect(context.destination);
            })
            .on("mouseup", function () {
                greenOscillator.disconnect(context.destination);
            });

        that.strictInput.prop('checked', false);
        that.count.enable();

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

    // TODO: FIX
    blueOscillator.start();
    greenOscillator.start();
    disableAllControls();
};

/** 
    Usage: blinkText(that.count.output, 2);
*/
function blinkText(el, reps) {
    var text = el.text();
    if (reps > 0) {
        el.text("");
        setTimeout(function () {
            el.text(text);
            setTimeout(function () {
                shake(el, --reps);
            }, 300);
        }, 300);

    }
}
