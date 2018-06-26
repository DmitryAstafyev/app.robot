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
let ButtonIconSmall = class ButtonIconSmall {
    constructor() {
        this.caption = '';
        this.icon = '';
        this.handler = function () { };
        this.enabled = true;
        this.focused = false;
    }
    disable() {
        return this.enabled = false;
    }
    enable() {
        return this.enabled = true;
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ButtonIconSmall.prototype, "caption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ButtonIconSmall.prototype, "icon", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Function)
], ButtonIconSmall.prototype, "handler", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ButtonIconSmall.prototype, "enabled", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ButtonIconSmall.prototype, "focused", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ButtonIconSmall.prototype, "disable", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ButtonIconSmall.prototype, "enable", null);
ButtonIconSmall = __decorate([
    core_1.Component({
        selector: 'button-small-icon',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [])
], ButtonIconSmall);
exports.ButtonIconSmall = ButtonIconSmall;
//# sourceMappingURL=component.js.map