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
const modalwindow_1 = require("../../../../classes/environment/modalwindow");
const service_ws_1 = require("../../../../services/service.ws");
const tools_guid_1 = require("../../../../tools/tools.guid");
;
const SERVER = {
    WS_URL: "ws://localhost:8081/",
    WS_PROTOCOL: "robot",
};
const POINTS_LIMITATION = 200;
const POWS_LIMITATION = 10;
const US1_LIMITATION = 200;
const POW_OFFSET_ANGLE = 1.5708; //rad
const POW_DISTANCE = 12;
const US1_OFFSET_ANGLE = 1.5708; //rad
let AppsRobotQRScanner = class AppsRobotQRScanner extends modalwindow_1.ModalWindow {
    constructor() {
        super();
        this._points = [];
        this._pows = [];
        this._us1 = [];
        this._maxY = 0;
        this._maxX = 0;
        this._width = 0;
        this._height = 0;
        this._GUID = tools_guid_1.GUID.generate();
        this._onHolderResized = this._onHolderResized.bind(this);
        this._onQRCome = this._onQRCome.bind(this);
        this._onBrickUS1Come = this._onBrickUS1Come.bind(this);
        this._emulate();
        //this._connect();
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
        this._bind();
        if (!service_ws_1.default.isConnected()) {
            service_ws_1.default.connect(SERVER.WS_URL, SERVER.WS_PROTOCOL);
        }
    }
    _emulate() {
        this._bind();
        if (!service_ws_1.default.isEmulation()) {
            service_ws_1.default.emulationStart();
        }
    }
    _bind() {
        this._ePhoneQR = service_ws_1.default.EPhoneQR.subscribe(this._onQRCome);
        this._eBrickUS1 = service_ws_1.default.EBrickUS1.subscribe(this._onBrickUS1Come);
    }
    _unbind() {
        this._ePhoneQR.unsubscribe();
        this._eBrickUS1.unsubscribe();
    }
    _onQRCome(data) {
        data = Object.assign({}, data);
        data.angle = -data.angle;
        this._points.push(data);
        this._pows.push({
            a: this._points[this._points.length - 1].angle,
            x: this._points[this._points.length - 1].x,
            y: this._points[this._points.length - 1].y,
            _x: 0,
            _y: 0
        });
        this._checkLimit();
        this._calculate();
    }
    _onBrickUS1Come(distance) {
        if (this._points.length === 0) {
            return;
        }
        const last = this._points[this._points.length - 1];
        this._us1.push({
            a: last.angle,
            x: last.x,
            y: last.y,
            d: distance / 10,
            _x: 0,
            _y: 0,
            __x: 0,
            __y: 0
        });
        this._checkLimit();
    }
    _checkLimit() {
        if (this._points.length > POINTS_LIMITATION) {
            this._points.splice(0, this._points.length - POINTS_LIMITATION);
        }
        if (this._pows.length > POWS_LIMITATION) {
            this._pows.splice(1, 0);
        }
        if (this._us1.length > US1_LIMITATION) {
            this._us1.splice(1, 0);
        }
    }
    _getStyles(point, index) {
        return {
            top: `${point._y}px`,
            left: `${point._x}px`,
            opacity: index / this._points.length,
            transform: `rotate(${point.angle}rad)`,
            fontSize: `${1.5 * (this._maxX < 150 ? 1 : (150 / this._maxX))}rem`
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
        this._us1.forEach((point) => {
            if (this._maxX < point.__x) {
                this._maxX = point.__x;
            }
            if (this._maxY < point.__y) {
                this._maxY = point.__y;
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
        this._updateUS1Coord(rate);
    }
    _updateRobotCoord(rate) {
        this._pows = this._pows.map((pow) => {
            pow._x = pow.x * rate - Math.cos(pow.a - POW_OFFSET_ANGLE) * POW_DISTANCE * rate;
            pow._y = pow.y * rate - Math.sin(pow.a - POW_OFFSET_ANGLE) * POW_DISTANCE * rate;
            return pow;
        });
    }
    _getPowStyles(pow, index) {
        return {
            top: `${pow._y}px`,
            left: `${pow._x}px`,
            opacity: index / this._pows.length
        };
    }
    _updateUS1Coord(rate) {
        this._us1 = this._us1.map((point) => {
            point.__x = point.x - Math.cos(point.a - US1_OFFSET_ANGLE) * point.d;
            point.__y = point.y - Math.sin(point.a - US1_OFFSET_ANGLE) * point.d;
            point._x = point.x * rate - Math.cos(point.a - US1_OFFSET_ANGLE) * point.d * rate;
            point._y = point.y * rate - Math.sin(point.a - US1_OFFSET_ANGLE) * point.d * rate;
            return point;
        }).filter((point) => {
            return point._x !== 0 && point._y !== 0;
        });
    }
    _getUs1Styles(point, index) {
        return {
            top: `${point._y}px`,
            left: `${point._x}px`,
            opacity: point._x !== 0 ? (point._y !== 0 ? (index / this._us1.length) : 0) : 0
        };
    }
};
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