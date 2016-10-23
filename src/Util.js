"use strict";

window.util = {};

window.util.container = function (klass, gameContainer, width, height) {
    width = width || 3;
    height = height || 3;

    var y, x;

    var container = $("<div>").addClass(klass);
    gameContainer.append(container);

    for (y = 0; y < height; y++) {
        var rowContainer = $("<div>").addClass("field-row");
        container.append(rowContainer);
        for (x = 0; x < width; x++) {
            var cellContainer = $("<div>").addClass("field-cell");
            rowContainer.append(cellContainer);
        }
    }

    return container;
};


