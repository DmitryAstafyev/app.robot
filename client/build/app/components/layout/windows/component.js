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
let Windows = class Windows {
    constructor(componentFactoryResolver) {
        this.componentFactoryResolver = componentFactoryResolver;
        this._windows = [];
        this._windows = service_modalwindows_1.default.get().map((modalwindow) => {
            modalwindow.component.factory = componentFactoryResolver.resolveComponentFactory(modalwindow.component.factory);
            return modalwindow;
        });
        this._onRemove = this._onRemove.bind(this);
        this._onAdd = this._onAdd.bind(this);
        this._eRemoved = service_modalwindows_1.default.ERemoved.subscribe(this._onRemove);
        this._eAdded = service_modalwindows_1.default.EAdded.subscribe(this._onAdd);
    }
    ngOnDestroy() {
        this._eRemoved.unsubscribe();
        this._eAdded.unsubscribe();
    }
    _onRemove(id) {
        this._windows = this._windows.filter((_window) => {
            return _window.id !== id;
        });
    }
    _onAdd(modalwindow) {
        modalwindow.component.factory = this.componentFactoryResolver.resolveComponentFactory(modalwindow.component.factory);
        this._windows.push(modalwindow);
    }
};
Windows = __decorate([
    core_1.Component({
        selector: 'windows',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [core_1.ComponentFactoryResolver])
], Windows);
exports.Windows = Windows;
//# sourceMappingURL=component.js.map