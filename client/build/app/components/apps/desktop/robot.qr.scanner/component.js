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
const service_ws_1 = require("../../../../services/service.ws");
const tools_guid_1 = require("../../../../tools/tools.guid");
const SERVER = {
    WS_URL: "ws://localhost:8081/",
    WS_PROTOCOL: "robot",
};
const POINTS_LIMITATION = 500;
const POWS_LIMITATION = 50;
const OFFSET_X = 200;
const OFFSET_Y = 100;
let AppsRobotQRScanner = class AppsRobotQRScanner {
    constructor() {
        this._points = [];
        this._pows = [];
        this._maxY = 0;
        this._maxX = 0;
        this._width = 0;
        this._height = 0;
        this._robotX = 0;
        this._robotY = 0;
        this._GUID = tools_guid_1.GUID.generate();
        //this._connect();
        this._emulate();
        this._onHolderResized = this._onHolderResized.bind(this);
    }
    ngOnDestroy() {
        this._unbind();
        service_ws_1.default.emulationStop();
        this._eHolderResized !== void 0 && this._eHolderResized.unsubscribe();
    }
    ngAfterViewChecked() {
        if (this._eHolderResized !== void 0) {
            return;
        }
        if (this.EHolderResized !== void 0 && this.EHolderResized !== null) {
            this._eHolderResized = this.EHolderResized.subscribe(this._onHolderResized);
        }
    }
    _connect() {
        this._onQRCome = this._onQRCome.bind(this);
        this._bind();
        if (!service_ws_1.default.isConnected()) {
            service_ws_1.default.connect(SERVER.WS_URL, SERVER.WS_PROTOCOL);
        }
    }
    _emulate() {
        this._onQRCome = this._onQRCome.bind(this);
        this._bind();
        if (!service_ws_1.default.isEmulation()) {
            service_ws_1.default.emulationStart();
        }
    }
    _bind() {
        this._ePhoneQR = service_ws_1.default.EPhoneQR.subscribe(this._onQRCome);
    }
    _unbind() {
        this._ePhoneQR.unsubscribe();
    }
    _onQRCome(data) {
        data = Object.assign({}, data);
        data.angle = -data.angle;
        //data._angle = data.angle * 180 / Math.PI;
        this._points.push(data);
        this._checkLimit();
        this._calculate();
    }
    _checkLimit() {
        if (this._points.length > POINTS_LIMITATION) {
            this._points.splice(0, this._points.length - POINTS_LIMITATION);
        }
    }
    _getStyles(point, index) {
        return {
            top: `${point._y}px`,
            left: `${point._x}px`,
            opacity: index / this._points.length,
            transform: `rotate(${point.angle}rad)`
        };
    }
    _onHolderResized() {
        this._calculate();
    }
    _updateOutputSize() {
        if (this._wrapper !== void 0 && this._wrapper !== null) {
            const size = this._wrapper.nativeElement.getBoundingClientRect();
            this._width = size.width;
            this._height = size.height;
        }
    }
    _updateMinMax() {
        this._maxX = 0;
        this._maxY = 0;
        this._points.forEach((point) => {
            if (this._maxX < point.x) {
                this._maxX = point.x;
            }
            if (this._maxY < point.y) {
                this._maxY = point.y;
            }
        });
    }
    _calculate() {
        this._updateOutputSize();
        this._updateMinMax();
        let xRate;
        let yRate;
        let rate;
        if (this._maxX > this._width || this._maxY > this._height) {
            xRate = this._maxX / this._width;
            yRate = this._maxY / this._height;
        }
        else {
            xRate = this._width / this._maxX;
            yRate = this._height / this._maxY;
        }
        rate = xRate < yRate ? xRate : yRate;
        this._points = this._points.map((point) => {
            point._x = point.x * rate;
            point._y = point.y * rate;
            return point;
        });
        this._updateRobotCoord(rate);
    }
    _updateRobotCoord(rate) {
        if (this._points.length === 0) {
            return;
        }
        const last = this._points[this._points.length - 1];
        const offset = 1.5708;
        /*
        this._robotX = last.x + Math.cos(last.angle) * 12;
        this._robotY = last.y + Math.sin(last.angle) * 12;
        */
        const robotX = last._x - Math.cos(last.angle - offset) * 12 * rate;
        const robotY = last._y - Math.sin(last.angle - offset) * 12 * rate;
        this._pows.push({
            x: robotX,
            y: robotY
        });
        if (this._pows.length > POWS_LIMITATION) {
            this._pows.splice(1, 0);
        }
    }
    _getPowStyles(pow, index) {
        return {
            top: `${pow.y}px`,
            left: `${pow.x}px`,
            opacity: index / this._pows.length
        };
    }
};
__decorate([
    core_1.Input(),
    __metadata("design:type", core_1.EventEmitter)
], AppsRobotQRScanner.prototype, "EHolderResized", void 0);
__decorate([
    core_1.ViewChild("_wrapper", { read: core_1.ElementRef }),
    __metadata("design:type", core_1.ElementRef)
], AppsRobotQRScanner.prototype, "_wrapper", void 0);
AppsRobotQRScanner = __decorate([
    core_1.Component({
        selector: 'apps-robot-qr-scanner',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [])
], AppsRobotQRScanner);
exports.AppsRobotQRScanner = AppsRobotQRScanner;
//# sourceMappingURL=component.js.map