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


    function enableAllControls() {
        that.tiles.blue.removeClass("disabled-element");
        that.tiles.green.removeClass("disabled-element");
        that.tiles.red.removeClass("disabled-element");
        that.tiles.yellow.removeClass("disabled-element");
        that.start.removeClass("disabled-element");
        that.strict.removeClass("disabled-element");
        that.strictInput.prop('checked', false);
        that.count.enable();
        // blinkText(that.count.output, 2);
    }

    function disableAllControls() {
        that.tiles.blue.addClass("disabled-element");
        that.tiles.green.addClass("disabled-element");
        that.tiles.red.addClass("disabled-element");
        that.tiles.yellow.addClass("disabled-element");
        that.start.addClass("disabled-element");
        that.strict.addClass("disabled-element");
        that.strictInput.prop('checked', false);
        that.count.disable();
    }

    disableAllControls();
};

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
