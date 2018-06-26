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
let AppWrapper = class AppWrapper {
    constructor(container, changeDetectorRef) {
        this.container = container;
        this.changeDetectorRef = changeDetectorRef;
    }
    update(params) {
        Object.keys(params).forEach((key) => {
            this.ref.instance[key] = params[key];
        });
        this.changeDetectorRef.detectChanges();
    }
    ngOnInit() {
        this.ref = this.container.createComponent(this.component.factory);
        if (this.component.params !== void 0) {
            Object.keys(this.component.params).forEach((key) => {
                this.ref.instance[key] = this.component.params[key];
            });
        }
        typeof this.component.callback === 'function' && this.component.callback(this.ref.instance);
        this.component.forceUpdate = this.update.bind(this);
    }
    ngOnDestroy() {
        this.ref.destroy();
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], AppWrapper.prototype, "component", void 0);
AppWrapper = __decorate([
    core_1.Component({
        selector: 'bar-bottom-app-wrapper',
        template: '',
    }),
    __metadata("design:paramtypes", [core_1.ViewContainerRef,
        core_1.ChangeDetectorRef])
], AppWrapper);
exports.AppWrapper = AppWrapper;
//# sourceMappingURL=component.js.map