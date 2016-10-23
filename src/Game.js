(function () {
    "use strict";

    var y, x, y2, x2;

    var gameContainer = $(".game-container");

    var world = new window.entity.World;

    var width = 80;
    var height = 80;

    var cellCache = [];

    function createNewCell(x, y) {
        var entity = new window.entity.Entity(world);

        cellCache[y][x] = entity.component("Cell");

        entity.component("Position").y = y;
        entity.component("Position").x = x;

        entity.component("UpdatedCell");
        entity.component("InvalidNeighbourCount");

        if (Math.random() < 0.35) {
            entity.component("Alive");
        }
    }

    function createAllCells() {
        for (y = 0; y < height; y++) {
            cellCache.push([]);

            for (x = 0; x < width; x++) {
                var entity = createNewCell(x, y);
            }
        }
    }

    function preComputeNeighboursOf(cell) {
        for (y2 = y - 1; y2 <= y + 1; y2++)
            for (x2 = x - 1; x2 <= x + 1; x2++)
                if (y2 >= 0 && y2 < height && x2 >= 0 && x2 < width)
                    if (x2 != x || y2 != y)
                        cell.entity.component("Neighbours").neighbours.push(cellCache[y2][x2]);
    }

    function preComputeAllNeighbours() {
        for (y = 0; y < height; y++) {
            for (x = 0; x < width; x++) {
                preComputeNeighboursOf(cellCache[y][x]);
            }
        }
    }

    createAllCells();
    preComputeAllNeighbours();

    var gameFieldContainer = util.container("field", gameContainer, width, height);

    var gameSystem = new systems.CompositeSystem([
        new window.systems.NeighbourCountingSystem(world),
        new window.systems.UnderPopulationSystem(world),
        new window.systems.OverCrowdingSystem(world),
        new window.systems.NewGenerationSystem(world),
        new window.systems.BoardRenderSystem(world, gameFieldContainer)
    ]);

    setInterval(function () { gameSystem.run(); }, 16);
})();