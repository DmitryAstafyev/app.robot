"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const tools_guid_1 = require("../tools/tools.guid");
class ServiceApps {
    constructor() {
        this.EAdded = new core_1.EventEmitter();
        this.ERemoved = new core_1.EventEmitter();
        this.EUpdated = new core_1.EventEmitter();
        this._apps = [];
    }
    _setDefaults(app) {
        app.id = typeof app.id === 'string' ? app.id : tools_guid_1.GUID.generate();
        return app;
    }
    get() {
        return this._apps;
    }
    add(app) {
        this._apps.push(this._setDefaults(app));
        this.EAdded.emit(app);
    }
    remove(id) {
        this._apps = this._apps.filter((app) => {
            return app.id !== id;
        });
        this.ERemoved.emit(id);
    }
    update(app) {
        let _updated = null;
        this._apps = this._apps.map((_app) => {
            if (_app.id === app.id) {
                Object.keys(app).forEach((key) => {
                    if (app[key] !== _app[key] && _app[key] !== void 0) {
                        _app[key] = app[key];
                        if (_updated === null) {
                            _updated = _app;
                        }
                    }
                });
            }
            return _app;
        });
        _updated !== null && this.EUpdated.emit(_updated);
        return _updated !== null;
    }
}
exports.default = (new ServiceApps());
//# sourceMappingURL=service.apps.js.map