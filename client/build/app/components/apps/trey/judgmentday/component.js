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
let AppsJudgmentDay = class AppsJudgmentDay {
    constructor() {
        this._days = '00';
        this._hours = '00';
        this._minutes = '00';
        this._seconds = '00';
        this._day = (new Date('01.01.2020')).getTime();
        this._tick();
    }
    _fill(value) {
        return value < 10 ? ('0' + value) : ('' + value);
    }
    _tick() {
        const now = new Date();
        const diff = this._day - now.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff - days * (1000 * 3600 * 24)) / (1000 * 3600));
        const minutes = Math.floor((diff - days * (1000 * 3600 * 24) - hours * (1000 * 3600)) / (1000 * 60));
        const seconds = Math.floor((diff - days * (1000 * 3600 * 24) - hours * (1000 * 3600) - minutes * (1000 * 60)) / 1000);
        this._days = this._fill(days);
        this._hours = this._fill(hours);
        this._minutes = this._fill(minutes);
        this._seconds = this._fill(seconds);
        setTimeout(this._tick.bind(this), 1000);
    }
};
AppsJudgmentDay = __decorate([
    core_1.Component({
        selector: 'apps-judgmentday',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [])
], AppsJudgmentDay);
exports.AppsJudgmentDay = AppsJudgmentDay;
//# sourceMappingURL=component.js.map