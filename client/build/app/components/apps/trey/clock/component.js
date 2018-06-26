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
let AppsClock = class AppsClock {
    constructor() {
        this._hours = '00';
        this._minutes = '00';
        this._seconds = '00';
        this._tick();
    }
    _fill(value) {
        return value < 10 ? ('0' + value) : ('' + value);
    }
    _tick() {
        const now = new Date();
        this._hours = this._fill(now.getHours());
        this._minutes = this._fill(now.getMinutes());
        this._seconds = this._fill(now.getSeconds());
        setTimeout(this._tick.bind(this), 1000);
    }
};
AppsClock = __decorate([
    core_1.Component({
        selector: 'apps-clock',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [])
], AppsClock);
exports.AppsClock = AppsClock;
//# sourceMappingURL=component.js.map