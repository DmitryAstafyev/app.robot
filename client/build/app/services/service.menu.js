"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const tools_guid_1 = require("../tools/tools.guid");
class ServiceMenu {
    constructor() {
        this.EAdded = new core_1.EventEmitter();
        this.ERemoved = new core_1.EventEmitter();
        this.EUpdated = new core_1.EventEmitter();
        this._items = [];
    }
    _setDefaults(item) {
        item.id = typeof item.id === 'string' ? item.id : tools_guid_1.GUID.generate();
        item.items = item.items instanceof Array ? item.items : [];
        if (item.items.length > 0) {
            item.items = item.items.map((item) => {
                return this._setDefaults(item);
            });
        }
        return item;
    }
    _getParrent(id, items) {
        let parent = null;
        if (id === '') {
            return this._items;
        }
        items = !(items instanceof Array) ? this._items : items;
        items.forEach((item) => {
            if (parent !== null) {
                return;
            }
            if (item.id === id) {
                parent = item.items;
            }
            else if (item.items.length > 0) {
                parent = this._getParrent(id, item.items);
            }
        });
        return parent;
    }
    get() {
        return this._items;
    }
    add(items, parent = '') {
        const target = this._getParrent(parent);
        if (target === null) {
            return;
        }
        if (!(items instanceof Array)) {
            items = [items];
        }
        items.forEach((item) => {
            target.push(this._setDefaults(item));
            this.EAdded.emit(item);
        });
    }
    remove(id) {
        this._items = this._items.filter((item) => {
            return item.id !== id;
        });
        this.ERemoved.emit(id);
    }
    update(item) {
        let _updated = null;
        this._items = this._items.map((_item) => {
            if (_item.id === item.id) {
                Object.keys(item).forEach((key) => {
                    if (item[key] !== _item[key] && _item[key] !== void 0) {
                        _item[key] = item[key];
                        if (_updated === null) {
                            _updated = _item;
                        }
                    }
                });
            }
            return _item;
        });
        _updated !== null && this.EUpdated.emit(_updated);
        return _updated !== null;
    }
}
exports.default = (new ServiceMenu());
//# sourceMappingURL=service.menu.js.map