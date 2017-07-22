var Controls = function () {
    var values = {
        count: {
            start: "--",
            error: "!!",
        }
    };
    var classes = {
        count: {
            enabled: ".output-enabled",
            disabled: ".output-disabled"
        }
    }
    var that = this;

    that.tiles = {};
    that.tiles.blue = $("#blue-tile");
    that.tiles.green = $("#green-tile");
    that.tiles.red = $("#red-tile");
    that.tiles.yellow = $("#yellow-tile");

    that.count = {}
    that.count.output = $("#output");
    that.count.enable = function () {
        that.count.output.val(values.count.start);
        that.count.removeClass(classes.count.disabled);
        that.count.addClass(classes.count.enabled);
    };
    that.count.disable = function () {
        that.count.output.val(values.count.start);
        that.count.removeClass(classes.count.disabled);
        that.count.addClass(classes.count.enabled);
    };
    that.count.error = function () {
        that.count.output.val(values.count.error);
    };


    that.btnOnOff = $("#on-off");
    that.btnOnOff.change(function () {
        if (this.checked) {
            // on
            enableAllControls();
        } else {
            // off
            disableAllControls();
        }
    });

    that.start = $("#start");
    that.strict = $("#strict");

    function enableAllControls() {
        that.tiles.blue.removeClass("disabled-element");
        that.tiles.green.removeClass("disabled-element");
        that.tiles.red.removeClass("disabled-element");
        that.tiles.yellow.removeClass("disabled-element");
        that.start.removeClass("disabled-element");
        that.strict.removeClass("disabled-element");
        that.count.enable();
    }

    function disableAllControls() {
        that.count.disable();
    }



};
