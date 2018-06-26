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
const forms_1 = require("@angular/forms");
const component_1 = require("./buttons/flat-text/component");
const module_1 = require("./window/module");
let Components = class Components {
    constructor() {
    }
};
Components = __decorate([
    core_1.NgModule({
        entryComponents: [component_1.ButtonFlatText],
        imports: [common_1.CommonModule, forms_1.FormsModule],
        declarations: [component_1.ButtonFlatText],
        exports: [module_1.ModalWindowModule, component_1.ButtonFlatText]
    }),
    __metadata("design:paramtypes", [])
], Components);
exports.Components = Components;
//# sourceMappingURL=components.js.map