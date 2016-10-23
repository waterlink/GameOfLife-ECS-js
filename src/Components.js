window.components = {};

window.components.Cell = (function () {
    "use strict";

    return function Cell() {

    };
})();

window.components.Position = (function () {
    "use strict";

    return function Position(x, y) {
        this.x = x || 0;
        this.y = y || 0;
    };
})();

window.components.NeighbourCount = (function () {
    "use strict";

    return function NeighbourCount(count) {
        this.count = count || 0;
    };
})();

window.components.NextNeighbourCount = (function () {
    "use strict";

    return function NextNeighbourCount(increment) {
        this.increment = increment || 0;
    };
})();

window.components.Alive = (function () {
    "use strict";

    return function Alive() {

    };
})();

window.components.Neighbours = (function () {
    "use strict";

    function Neighbours(neighbours) {
        this.neighbours = neighbours || [];
    }

    return Neighbours;
})();

window.components.UpdatedCell = (function () {
    "use strict";

    return function UpdatedCell() {

    };
})();

window.components.InvalidNeighbourCount = (function () {
    "use strict";

    return function InvalidNeighbourCount() {

    };
})();