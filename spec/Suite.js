(function () {
    "use strict";

    var testContainer = $(".test-container");

    function worldFrom(board) {
        var world = new window.entity.World;

        for (var i = 0; i < board.length; i++) {
            for (var j = 0; j < board[0].length; j++) {
                var entity = new window.entity.Entity(world);

                entity.component("Cell");
                entity.component("Position").y = i;
                entity.component("Position").x = j;

                entity.component("UpdatedCell");
                entity.component("InvalidNeighbourCount");

                if (board[i][j]) entity.component("Alive");
            }
        }

        return world;
    }

    function logicSystem(world) {
        return new window.systems.CompositeSystem([
            new window.systems.NeighbourGatheringSystem(world),
            new window.systems.NeighbourCountingSystem(world),
            new window.systems.UnderPopulationSystem(world),
            new window.systems.OverCrowdingSystem(world),
            new window.systems.NewGenerationSystem(world),
            new window.systems.UpdateAllCellsSystem(world)
        ]);
    }

    function renderSystem(world, name) {
        var container = util.container(name, testContainer);
        return new window.systems.CompositeSystem([
            new window.systems.BoardRenderSystem(world, container),
            new window.systems.DebugSystem(world, container)
        ]);
    }

    function testOneGenerationWith(board) {
        var world = worldFrom(board);

        renderSystem(world, "before-container").render();

        logicSystem(world).update();
        renderSystem(world, "before-container").render();

        logicSystem(world).update();
        renderSystem(world, "before-container").render();

        logicSystem(world).update();
        renderSystem(world, "before-container").render();

        logicSystem(world).update();
        renderSystem(world, "after-container").render();
    }

    (function UnderPopulationSystem_SingleCell() {
        testOneGenerationWith([
            [false, false, false],
            [false, true, false],
            [false, false, false]
        ]);
    })();

    (function UnderPopulationSystem_OneNeighbour() {
        testOneGenerationWith([
            [false, false, false],
            [false, true, true],
            [false, false, false]
        ]);
    })();

    (function UnderPopulationSystem_TwoNeighbours() {
        testOneGenerationWith([
            [false, false, false],
            [true, true, true],
            [false, false, false]
        ]);
    })();

    (function OverCrowdingSystem_FourNeighbours() {
        testOneGenerationWith([
            [false, true, false],
            [true, true, true],
            [false, true, false]
        ]);
    })();

    (function OverCrowdingSystem_FiveNeighbours() {
        testOneGenerationWith([
            [false, true, true],
            [true, true, true],
            [false, true, false]
        ]);
    })();
})();