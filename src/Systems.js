window.systems = {};

window.systems.CompositeSystem = (function () {
    "use strict";

    function CompositeSystem(systems) {
        this.systems = systems;
    }

    CompositeSystem.prototype.render = function () {
        var system = this;

        system.systems.forEach(function (s) {
            system._bench(s.constructor.name + ".render", function () {
                s.render()
            });
        });
    };

    CompositeSystem.prototype.update = function () {
        var system = this;

        system.systems.forEach(function (s) {
            system._bench(s.constructor.name + ".update", function () {
                s.update()
            });
        });
    };

    CompositeSystem.prototype.run = function () {
        var system = this;

        system._bench("ALL", function () {
            system.update();
            system.render();
        });
    };

    CompositeSystem.prototype._bench = function (name, fn) {
        var start = Date.now();

        fn();

        var end = Date.now();
        // console.log(name, end - start);
    };

    return CompositeSystem;
})();

window.systems.BoardRenderSystem = (function () {
    "use strict";

    function BoardRenderSystem(world, container) {
        this.world = world;
        this.container = container;
        this.rows = [];
        this.cells = [];
    }

    BoardRenderSystem.prototype.getCellRow = function (position) {
        return this.rows[position.y] = this.rows[position.y] ||
            $(this.container.find(".field-row")[position.y]);
    };

    BoardRenderSystem.prototype.getCell = function (position) {
        var cells = this.cells[position.y] = this.cells[position.y] || {};

        return cells[position.x] = cells[position.x] ||
            $(this.getCellRow(position).find(".field-cell")[position.x]);
    };

    BoardRenderSystem.prototype.render = function () {
        var system = this;

        this.world.query("UpdatedCell").forEach(function (cell) {
            system.getCell(cell.entity.component("Position"))
                .toggleClass("field-cell-alive", cell.entity.has("Alive"));
            cell.entity.remove("UpdatedCell");
        });
    };

    BoardRenderSystem.prototype.update = function () {

    };

    return BoardRenderSystem;
})();

window.systems.DebugSystem = (function () {
    "use strict";

    function DebugSystem(world, container) {
        this.world = world;
        this.container = container;
        this.rows = [];
        this.cells = [];
    }

    DebugSystem.prototype.getCellRow = function (position) {
        return this.rows[position.y] = this.rows[position.y] ||
            $(this.container.find(".field-row")[position.y]);
    };

    DebugSystem.prototype.getCell = function (position) {
        var cells = this.cells[position.y] = this.cells[position.y] || {};

        return cells[position.x] = cells[position.x] ||
            $(this.getCellRow(position).find(".field-cell")[position.x]);
    };

    DebugSystem.prototype.render = function () {
        var system = this;

        this.world.query("Cell").forEach(function (cell) {
            system.getCell(cell.entity.component("Position"))
                .html(cell.entity.component("NeighbourCount").count
                    + " &rarr; "
                    + cell.entity.component("NextNeighbourCount").increment);
        });
    };

    DebugSystem.prototype.update = function () {

    };

    return DebugSystem;
})();

window.systems.UpdateAllCellsSystem = (function () {
    "use strict";

    function UpdateAllCellsSystem(world) {
        this.world = world;
    }

    UpdateAllCellsSystem.prototype.render = function () {

    };

    UpdateAllCellsSystem.prototype.update = function () {
        this.world.query("Cell").forEach(function (cell) {
            cell.entity.component("UpdatedCell");
        });
    };

    return UpdateAllCellsSystem;
})();

window.systems.UnderPopulationSystem = (function () {
    "use strict";

    function UnderPopulationSystem(world) {
        this.world = world;
    }

    UnderPopulationSystem.prototype.render = function () {

    };

    UnderPopulationSystem.prototype.update = function () {
        this.world.query("Alive").forEach(function (cell) {
            var e = cell.entity;

            if (e.component("NeighbourCount").count < 2) {
                e.component("UpdatedCell");

                e.component("Neighbours").neighbours.forEach(function (neighbour) {
                    neighbour.entity.component("NextNeighbourCount").increment--;
                });

                e.remove("Alive");
            }
        });
    };

    return UnderPopulationSystem;
})();

window.systems.OverCrowdingSystem = (function () {
    "use strict";

    function OverCrowdingSystem(world) {
        this.world = world;
    }

    OverCrowdingSystem.prototype.render = function () {

    };

    OverCrowdingSystem.prototype.update = function () {
        this.world.query("Alive").forEach(function (cell) {
            var e = cell.entity;

            if (e.component("NeighbourCount").count > 3) {
                e.component("UpdatedCell");

                e.component("Neighbours").neighbours.forEach(function (neighbour) {
                    neighbour.entity.component("NextNeighbourCount").increment--;
                });

                e.remove("Alive");
            }
        });
    };

    return OverCrowdingSystem;
})();

window.systems.NewGenerationSystem = (function () {
    "use strict";

    function NewGenerationSystem(world) {
        this.world = world;
    }

    NewGenerationSystem.prototype.render = function () {

    };

    NewGenerationSystem.prototype.update = function () {
        this.world.query("Cell").forEach(function (cell) {
            var e = cell.entity;

            if (!e.has("Alive"))
                if (e.component("NeighbourCount").count == 3) {
                    e.component("UpdatedCell");

                    e.component("Neighbours").neighbours.forEach(function (neighbour) {
                        neighbour.entity.component("NextNeighbourCount").increment++;
                    });

                    e.component("Alive");
                }
        });
    };

    return NewGenerationSystem;
})();

window.systems.NeighbourGatheringSystem = (function () {
    "use strict";

    function NeighbourGatheringSystem(world) {
        this.world = world;
    }

    NeighbourGatheringSystem.prototype.render = function () {

    };

    NeighbourGatheringSystem.prototype.update = function () {
        var system = this;

        system.world.query("Cell").forEach(function (current) {
            if (current.entity.has("Neighbours")) return;

            system.world.query("Cell").forEach(function (neighbour) {
                if (areNeighbours(current.entity, neighbour.entity))
                    current.entity.component("Neighbours").neighbours.push(neighbour);
            });
        });
    };

    function areNeighbours(current, neighbour) {
        var currentPos = current.component("Position");
        var neighbourPos = neighbour.component("Position");

        return current.component("Cell").componentId != neighbour.component("Cell").componentId
            && Math.abs(currentPos.x - neighbourPos.x) <= 1
            && Math.abs(currentPos.y - neighbourPos.y) <= 1;
    }

    return NeighbourGatheringSystem;
})();

window.systems.NeighbourCountingSystem = (function () {
    "use strict";

    function NeighbourCountingSystem(world) {
        this.world = world;
    }

    NeighbourCountingSystem.prototype.render = function () {

    };

    NeighbourCountingSystem.prototype.update = function () {
        this.world.query("InvalidNeighbourCount").forEach(function (current) {
            var e = current.entity;

            e.component("NeighbourCount").count = 0;

            e.component("Neighbours").neighbours.forEach(function (neighbour) {
                if (neighbour.entity.has("Alive"))
                    e.component("NeighbourCount").count++;
            });

            e.remove("InvalidNeighbourCount");
        });

        this.world.query("NextNeighbourCount").forEach(function (current) {
            var e = current.entity;

            e.component("NeighbourCount").count =
                e.component("NeighbourCount").count + e.component("NextNeighbourCount").increment;

            e.remove("NextNeighbourCount");
        });
    };

    return NeighbourCountingSystem;
})();
