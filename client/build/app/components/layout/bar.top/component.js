"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const service_menu_1 = require("../../../services/service.menu");
const EVENTS = {
    mousedown: 'mousedown'
};
let BarTop = class BarTop {
    constructor() {
        this._menuOpened = false;
        this._items = service_menu_1.default.get();
        this._onGlobalMouseDown = this._onGlobalMouseDown.bind(this);
        this._bindCallerListeners();
    }
    ngOnDestroy() {
        this._unbindCallerListeners();
    }
    _bindCallerListeners() {
        window.addEventListener(EVENTS.mousedown, this._onGlobalMouseDown);
    }
    _unbindCallerListeners() {
        window.removeEventListener(EVENTS.mousedown, this._onGlobalMouseDown);
    }
    _onGlobalMouseDown() {
        this._menuOpened = false;
    }
    _onMenuOpen() {
        this._menuOpened = !this._menuOpened;
    }
    _onMenuItemClick(item) {
    }
};
BarTop = __decorate([
    core_1.Component({
        selector: 'bar-top',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [])
], BarTop);
exports.BarTop = BarTop;
//# sourceMappingURL=component.js.map