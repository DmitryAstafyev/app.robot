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
const platform_browser_1 = require("@angular/platform-browser");
const component_1 = require("./components/layout/holder/component");
const module_1 = require("./components/layout/module");
const components_1 = require("./components/common/components");
const service_apps_1 = require("./services/service.apps");
const service_menu_1 = require("./services/service.menu");
const service_modalwindows_1 = require("./services/service.modalwindows");
const component_2 = require("./components/apps/trey/clock/component");
const component_3 = require("./components/apps/trey/judgmentday/component");
const component_4 = require("./components/apps/desktop/robot.logger/component");
const component_5 = require("./components/apps/desktop/robot.qr.scanner/component");
let AppModule = class AppModule {
    constructor() {
        service_apps_1.default.add({
            component: {
                factory: component_2.AppsClock,
                params: {}
            }
        });
        service_apps_1.default.add({
            component: {
                factory: component_3.AppsJudgmentDay,
                params: {}
            }
        });
        service_menu_1.default.add([
            {
                caption: 'Robot Logger',
                icon: 'fa fa-heartbeat',
                handler: () => {
                    service_modalwindows_1.default.add({
                        caption: 'Robot Logger',
                        component: {
                            factory: component_4.AppsRobotLogger,
                            params: {}
                        },
                        buttons: []
                    });
                }
            },
            {
                caption: 'Robot QR Scanner',
                icon: 'fa fa-map-marker',
                handler: () => {
                    service_modalwindows_1.default.add({
                        caption: 'Robot QR Scanner',
                        component: {
                            factory: component_5.AppsRobotQRScanner,
                            params: {}
                        },
                        buttons: []
                    });
                }
            }
        ]);
    }
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [platform_browser_1.BrowserModule, components_1.Components, module_1.LayoutModule],
        declarations: [component_1.Layout],
        bootstrap: [component_1.Layout]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map