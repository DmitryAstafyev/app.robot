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
const common_1 = require("@angular/common");
const component_1 = require("./component");
const component_2 = require("./wrapper/component");
const component_3 = require("../buttons/icon.small/component");
let ModalWindowModule = class ModalWindowModule {
    constructor() {
    }
};
ModalWindowModule = __decorate([
    core_1.NgModule({
        entryComponents: [],
        imports: [common_1.CommonModule],
        declarations: [component_1.ModalWindow, component_2.ModalWindowWrapper, component_3.ButtonIconSmall],
        exports: [component_1.ModalWindow, component_2.ModalWindowWrapper, component_3.ButtonIconSmall]
    }),
    __metadata("design:paramtypes", [])
], ModalWindowModule);
exports.ModalWindowModule = ModalWindowModule;
//# sourceMappingURL=module.js.map