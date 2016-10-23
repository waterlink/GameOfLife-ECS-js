window.entity = {};

window.entity.Entity = (function () {
    "use strict";

    function Entity(world) {
        this.world = world;
        this.components = {};
    }

    Entity.prototype.component = function (name) {
        if (!this.has(name)) {
            this.components[name] = new window.components[name];
            this.components[name].entity = this;
            this.world.add(name, this.components[name]);
        }

        return this.components[name];
    };

    Entity.prototype.has = function (name) {
        return this.components.hasOwnProperty(name);
    };

    Entity.prototype.remove = function (name) {
        if (!this.has(name)) return;

        this.world.remove(name, this.components[name]);
        this.components[name].entity = null;
        delete this.components[name];
    };

    return Entity;
})();

window.entity.World = (function () {
    "use strict";

    function World() {
        this.components = {};
        this.reusablePool = {};
    }

    World.prototype.query = function (name) {
        return (this.components[name] = this.components[name] || [])
            .filter(function (component) {
                return component;
            });
    };

    World.prototype.add = function (name, component) {
        this.components[name] = this.components[name] || [];
        this.reusablePool[name] = this.reusablePool[name] || [];

        if (this.reusablePool[name].length === 0) {
            this.components[name].push(component);
            component.componentId = this.components[name].length - 1;
        } else {
            component.componentId = this.reusablePool[name].pop();
            this.components[name][component.componentId] = component;
        }
    };

    World.prototype.remove = function (name, component) {
        this.components[name] = this.components[name] || [];
        this.reusablePool[name] = this.reusablePool[name] || [];

        this.components[name][component.componentId] = null;
        this.reusablePool[name].push(component.componentId);
    };

    return World;
})();