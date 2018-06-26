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
const interface_modalwindow_1 = require("../../../interfaces/interface.modalwindow");
const service_modalwindows_1 = require("../../../services/service.modalwindows");
const EVENTS = {
    keypress: 'keypress',
    mousedown: 'mousedown',
    mouseup: 'mouseup',
    mousemove: 'mousemove',
};
const DIRECTIONS = {
    top: Symbol('top'),
    left: Symbol('left'),
    right: Symbol('right'),
    bottom: Symbol('bottom'),
    corner: Symbol('corner'),
    move: Symbol('move'),
    nothing: Symbol('nothing')
};
const LIMITS = {
    width: 100,
    height: 100,
};
let ModalWindow = class ModalWindow {
    constructor(changeDetectorRef) {
        this.changeDetectorRef = changeDetectorRef;
        this.caption = '';
        this.buttons = [];
        this._size = { t: 20, l: 20, h: 700, w: 700 };
        this._direction = DIRECTIONS.nothing;
        this._current = { x: -1, y: -1 };
        this.DIRECTIONS = DIRECTIONS;
        this.STATES = interface_modalwindow_1.EState;
        this._inited = false;
        this.EResized = new core_1.EventEmitter();
        this._globalMouseMove = this._globalMouseMove.bind(this);
        this._globalMouseUp = this._globalMouseUp.bind(this);
        this._onRestore = this._onRestore.bind(this);
        this._eUpdated = service_modalwindows_1.default.EUpdated.subscribe(this._onRestore);
        this._bindCallerListeners();
    }
    close() {
        service_modalwindows_1.default.remove(this.id);
    }
    minimize() {
    }
    resore() {
    }
    maximize() {
    }
    ngAfterViewChecked() {
        if (this._inited) {
            return;
        }
        this._addDefaultButtons();
        this._inited = true;
    }
    ngOnDestroy() {
        this._eUpdated.unsubscribe();
        this._unbindCallerListeners();
    }
    _bindCallerListeners() {
        window.addEventListener(EVENTS.mousemove, this._globalMouseMove);
        window.addEventListener(EVENTS.mouseup, this._globalMouseUp);
    }
    _unbindCallerListeners() {
        window.removeEventListener(EVENTS.mousemove, this._globalMouseMove);
        window.removeEventListener(EVENTS.mouseup, this._globalMouseUp);
    }
    _globalMouseMove(e) {
        if (this._direction === DIRECTIONS.nothing) {
            return;
        }
        const x = e.pageX;
        const y = e.pageY;
        switch (this._direction) {
            case DIRECTIONS.top:
                if (y < this._current.y) {
                    this._size.h += (this._current.y - y);
                    this._size.t -= (this._current.y - y);
                }
                else {
                    (this._size.h - (y - this._current.y) > LIMITS.height) && (this._size.h -= (y - this._current.y));
                    this._size.t += (y - this._current.y);
                }
                break;
            case DIRECTIONS.bottom:
                if (y < this._current.y) {
                    (this._size.h - (this._current.y - y) > LIMITS.height) && (this._size.h -= (this._current.y - y));
                }
                else {
                    this._size.h += (y - this._current.y);
                }
                break;
            case DIRECTIONS.left:
                if (x < this._current.x) {
                    this._size.w += (this._current.x - x);
                    this._size.l -= (this._current.x - x);
                }
                else {
                    (this._size.w - (x - this._current.x) > LIMITS.width) && (this._size.w -= (x - this._current.x));
                    this._size.l += (x - this._current.x);
                }
                break;
            case DIRECTIONS.right:
                if (x < this._current.x) {
                    (this._size.w - (this._current.x - x) > LIMITS.width) && (this._size.w -= (this._current.x - x));
                }
                else {
                    this._size.w += (x - this._current.x);
                }
                break;
            case DIRECTIONS.corner:
                if (x < this._current.x) {
                    (this._size.w - (this._current.x - x) > LIMITS.width) && (this._size.w -= (this._current.x - x));
                }
                else {
                    this._size.w += (x - this._current.x);
                }
                if (y < this._current.y) {
                    (this._size.h - (this._current.y - y) > LIMITS.height) && (this._size.h -= (this._current.y - y));
                }
                else {
                    this._size.h += (y - this._current.y);
                }
                break;
            case DIRECTIONS.move:
                if (y < this._current.y) {
                    this._size.t -= (this._current.y - y);
                }
                else {
                    this._size.t += (y - this._current.y);
                }
                if (x < this._current.x) {
                    this._size.l -= (this._current.x - x);
                }
                else {
                    this._size.l += (x - this._current.x);
                }
                break;
        }
        this._current.x = x;
        this._current.y = y;
    }
    _globalMouseUp(e) {
        if (~[DIRECTIONS.bottom, DIRECTIONS.left, DIRECTIONS.right, DIRECTIONS.top, DIRECTIONS.corner].indexOf(this._direction)) {
            this.EResized.emit();
        }
        this._direction = DIRECTIONS.nothing;
    }
    _onElementMouseDown(direction, e) {
        if (!this.resizable && ~[DIRECTIONS.bottom, DIRECTIONS.left, DIRECTIONS.right, DIRECTIONS.top, DIRECTIONS.corner].indexOf(direction)) {
            return;
        }
        if (!this.movable && direction === DIRECTIONS.move) {
            return;
        }
        if (this.state === interface_modalwindow_1.EState.maximaxed || this.state === interface_modalwindow_1.EState.minimixed) {
            return;
        }
        this._onFocus();
        this._direction = direction;
        this._current.x = e.pageX;
        this._current.y = e.pageY;
        e.stopPropagation();
        return false;
    }
    _addDefaultButtons() {
        if (this.closable) {
            this.buttons.unshift({
                icon: 'fa fa-remove',
                caption: 'Close',
                handler: this._close.bind(this)
            });
        }
        if (this.maximizable) {
            this.buttons.unshift({
                icon: 'fa fa-window-maximize',
                caption: 'Maximize',
                handler: this._maximaze.bind(this)
            });
        }
        if (this.minimize) {
            this.buttons.unshift({
                icon: 'fa fa-window-minimize',
                caption: 'Minimize',
                handler: this._minimize.bind(this)
            });
        }
    }
    _maximaze() {
        this.state = interface_modalwindow_1.EState.maximaxed;
        this.buttons = this.buttons.map((button) => {
            if (button.caption === 'Maximize') {
                button.caption = 'Restore';
                button.icon = 'fa fa-window-restore';
                button.handler = this._restore.bind(this);
            }
            return button;
        });
        service_modalwindows_1.default.update({
            id: this.id,
            state: this.state
        });
        this._forceUpdate();
    }
    _restore() {
        this.state = interface_modalwindow_1.EState.normal;
        this.buttons = this.buttons.map((button) => {
            if (button.caption === 'Restore') {
                button.caption = 'Maximize';
                button.icon = 'fa fa-window-maximize';
                button.handler = this._maximaze.bind(this);
            }
            return button;
        });
        service_modalwindows_1.default.update({
            id: this.id,
            state: this.state
        });
        this._forceUpdate();
    }
    _minimize() {
        const lastState = this.state;
        this.state = interface_modalwindow_1.EState.minimixed;
        service_modalwindows_1.default.update({
            id: this.id,
            state: this.state,
            lastState: lastState
        });
        service_modalwindows_1.default.unsetFocus(this.id);
        this._forceUpdate();
    }
    _close() {
        this.close();
    }
    _forceUpdate() {
        this.changeDetectorRef.detectChanges();
    }
    _getStyles() {
        switch (this.state) {
            case interface_modalwindow_1.EState.maximaxed:
                return {
                    top: '0px',
                    left: '0px',
                    width: '100%',
                    height: '100%'
                };
            case interface_modalwindow_1.EState.minimixed:
                return {
                    top: '100%',
                    left: '0px',
                    width: '0px',
                    height: '0px'
                };
            default:
                return {
                    top: `${this._size.t}px`,
                    left: `${this._size.l}px`,
                    width: `${this._size.w}px`,
                    height: `${this._size.h}px`
                };
        }
    }
    _onRestore(modalwindow) {
        if (this.id !== modalwindow.id) {
            return;
        }
        if (this.state === interface_modalwindow_1.EState.minimixed && modalwindow.state !== interface_modalwindow_1.EState.minimixed) {
            this.state = modalwindow.state;
            service_modalwindows_1.default.setFocus(this.id);
        }
        if (this.focused !== modalwindow.focused) {
            this.focused = modalwindow.focused;
        }
    }
    _onFocus() {
        this.focused = true;
        service_modalwindows_1.default.setFocus(this.id);
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ModalWindow.prototype, "id", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], ModalWindow.prototype, "component", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ModalWindow.prototype, "caption", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Array)
], ModalWindow.prototype, "buttons", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalWindow.prototype, "closable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalWindow.prototype, "resizable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalWindow.prototype, "movable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalWindow.prototype, "maximizable", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalWindow.prototype, "minimizibal", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], ModalWindow.prototype, "state", void 0);
__decorate([
    core_1.Input(),
    __metadata("design:type", Boolean)
], ModalWindow.prototype, "focused", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModalWindow.prototype, "close", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModalWindow.prototype, "minimize", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModalWindow.prototype, "resore", null);
__decorate([
    core_1.Output(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ModalWindow.prototype, "maximize", null);
ModalWindow = __decorate([
    core_1.Component({
        selector: 'modal-window',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [core_1.ChangeDetectorRef])
], ModalWindow);
exports.ModalWindow = ModalWindow;
//# sourceMappingURL=component.js.map