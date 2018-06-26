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
const service_modalwindows_1 = require("../../../services/service.modalwindows");
const interface_modalwindow_1 = require("../../../interfaces/interface.modalwindow");
const service_apps_1 = require("../../../services/service.apps");
let BarBottom = class BarBottom {
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this._windows = [];
        this._apps = [];
        this._apps = service_apps_1.default.get().map((app) => {
            app.component.factory = componentFactoryResolver.resolveComponentFactory(app.component.factory);
            return app;
        });
        this._onModalWindowUpdate = this._onModalWindowUpdate.bind(this);
        this._eUpdated = service_modalwindows_1.default.EUpdated.subscribe(this._onModalWindowUpdate);
        this._eAdded = service_apps_1.default.EAdded.subscribe(this._onAppAdded);
        this._eRemoved = service_apps_1.default.ERemoved.subscribe(this._onAppRemoved);
    }
    ngOnDestroy() {
        this._eUpdated.unsubscribe();
        this._eAdded.unsubscribe();
        this._eRemoved.unsubscribe();
    }
    _isModalWindowIn(id) {
        let result = false;
        this._windows.forEach((_window) => {
            if (_window.id === id) {
                result = true;
            }
        });
        return result;
    }
    _onModalWindowUpdate(modalwindow) {
        if (modalwindow.state === interface_modalwindow_1.EState.minimixed) {
            !this._isModalWindowIn(modalwindow.id) && this._windows.push(modalwindow);
        }
        else {
            this._windows = this._windows.filter((_window) => {
                return modalwindow.id !== _window.id;
            });
        }
    }
    _onModalWindowClick(modalwindow) {
        service_modalwindows_1.default.update({
            id: modalwindow.id,
            state: modalwindow.lastState !== void 0 ? modalwindow.lastState : interface_modalwindow_1.EState.normal
        });
    }
    _onAppAdded(app) {
        app.component.factory = this.componentFactoryResolver.resolveComponentFactory(app.component.factory);
        this._apps.push(app);
    }
    _onAppRemoved(id) {
        this._apps = this._apps.filter((app) => {
            return id !== app.id;
        });
    }
};
BarBottom = __decorate([
    core_1.Component({
        selector: 'bar-bottom',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [core_1.ComponentFactoryResolver])
], BarBottom);
exports.BarBottom = BarBottom;
//# sourceMappingURL=component.js.map