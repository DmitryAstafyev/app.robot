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
const component_1 = require("./notifications/component");
const component_2 = require("./bar.top/component");
const component_3 = require("./bar.top/menu.item/component");
const module_1 = require("./bar.bottom/module");
const component_4 = require("./windows/component");
const component_5 = require("./bar.bottom/component");
const components_1 = require("../../components/common/components");
const components_2 = require("../../components/apps/components");
const components_3 = require("../../components/effects/components");
let LayoutModule = class LayoutModule {
    constructor() {
    }
};
LayoutModule = __decorate([
    core_1.NgModule({
        entryComponents: [],
        imports: [common_1.CommonModule, components_1.Components, components_2.Components, components_3.Components, module_1.BarBottomModule],
        declarations: [component_1.Notifications, component_2.BarTop, component_3.BarTopMenuItem, component_5.BarBottom, component_4.Windows],
        exports: [component_1.Notifications, component_2.BarTop, component_3.BarTopMenuItem, component_5.BarBottom, component_4.Windows]
    }),
    __metadata("design:paramtypes", [])
], LayoutModule);
exports.LayoutModule = LayoutModule;
//# sourceMappingURL=module.js.map