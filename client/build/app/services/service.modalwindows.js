"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const interface_modalwindow_1 = require("../interfaces/interface.modalwindow");
const tools_guid_1 = require("../tools/tools.guid");
class ServiceModalWindows {
    constructor() {
        this.EAdded = new core_1.EventEmitter();
        this.ERemoved = new core_1.EventEmitter();
        this.EUpdated = new core_1.EventEmitter();
        this._modalwindows = [];
    }
    _setDefaults(modalwindow) {
        modalwindow.buttons = modalwindow.buttons instanceof Array ? modalwindow.buttons : [];
        modalwindow.closable = typeof modalwindow.closable === 'boolean' ? modalwindow.closable : true;
        modalwindow.resizable = typeof modalwindow.resizable === 'boolean' ? modalwindow.resizable : true;
        modalwindow.maximizable = typeof modalwindow.resizable === 'boolean' ? modalwindow.resizable : true;
        modalwindow.minimizibal = typeof modalwindow.resizable === 'boolean' ? modalwindow.resizable : true;
        modalwindow.movable = typeof modalwindow.movable === 'boolean' ? modalwindow.movable : true;
        modalwindow.state = typeof modalwindow.state === 'string' ? modalwindow.state : interface_modalwindow_1.EState.normal;
        modalwindow.lastState = typeof modalwindow.lastState === 'string' ? modalwindow.lastState : interface_modalwindow_1.EState.normal;
        modalwindow.focused = typeof modalwindow.focused === 'boolean' ? modalwindow.focused : true;
        modalwindow.id = typeof modalwindow.id === 'string' ? modalwindow.id : tools_guid_1.GUID.generate();
        return modalwindow;
    }
    get() {
        return this._modalwindows;
    }
    add(modalwindow) {
        this._modalwindows.push(this._setDefaults(modalwindow));
        this.EAdded.emit(modalwindow);
    }
    remove(id) {
        this._modalwindows = this._modalwindows.filter((modalwindow) => {
            return modalwindow.id !== id;
        });
        this.ERemoved.emit(id);
    }
    update(modalwindow) {
        let _updated = null;
        this._modalwindows = this._modalwindows.map((_window) => {
            if (_window.id === modalwindow.id) {
                Object.keys(modalwindow).forEach((key) => {
                    if (modalwindow[key] !== _window[key] && _window[key] !== void 0) {
                        _window[key] = modalwindow[key];
                        if (_updated === null) {
                            _updated = _window;
                        }
                    }
                });
            }
            return _window;
        });
        _updated !== null && this.EUpdated.emit(_updated);
        return _updated !== null;
    }
    setFocus(id) {
        this._modalwindows = this._modalwindows.map((_window) => {
            const focus = _window.focused;
            if (id === _window.id) {
                _window.focused = true;
            }
            else {
                _window.focused = false;
            }
            if (_window.focused !== focus) {
                this.EUpdated.emit(_window);
            }
            return _window;
        });
    }
    unsetFocus(id) {
        let changed = false;
        this._modalwindows = this._modalwindows.map((_window) => {
            const focus = _window.focused;
            if (id === _window.id) {
                _window.focused = false;
            }
            if (_window.focused !== focus) {
                this.EUpdated.emit(_window);
            }
            return _window;
        });
        this._modalwindows = this._modalwindows.map((_window) => {
            if (changed) {
                return _window;
            }
            if (id !== _window.id && !_window.focused) {
                _window.focused = true;
                changed = true;
                this.EUpdated.emit(_window);
            }
            return _window;
        });
    }
}
exports.default = (new ServiceModalWindows());
//# sourceMappingURL=service.modalwindows.js.map