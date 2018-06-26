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
const SERVER = {
    WS_URL: "ws://localhost:8081/",
    WS_PROTOCOL: "robot",
};
const LOGS_LIMITATION = 1000;
let AppsRobotLogger = class AppsRobotLogger {
    constructor() {
        this._logs = [];
        this._autoScrolling = true;
        this._connect();
    }
    ngOnDestroy() {
        this._unbind();
    }
    _connect() {
        this._onConnected = this._onConnected.bind(this);
        this._onDisconnected = this._onDisconnected.bind(this);
        this._onData = this._onData.bind(this);
        this._onError = this._onError.bind(this);
        this._bind();
        if (!service_ws_1.default.isConnected()) {
            service_ws_1.default.connect(SERVER.WS_URL, SERVER.WS_PROTOCOL);
        }
    }
    _bind() {
        this._eConnected = service_ws_1.default.EConnected.subscribe(this._onConnected);
        this._eDisconnected = service_ws_1.default.EDisconnected.subscribe(this._onDisconnected);
        this._eData = service_ws_1.default.EData.subscribe(this._onData);
        this._eError = service_ws_1.default.EError.subscribe(this._onError);
    }
    _unbind() {
        this._eConnected.unsubscribe();
        this._eDisconnected.unsubscribe();
        this._eData.unsubscribe();
        this._eError.unsubscribe();
    }
    _onConnected() {
        console.log('connected...');
    }
    _onDisconnected() {
        console.log('disconnected...');
    }
    _onData(data) {
        const rows = data.split(/[\n\r]/gi);
        this._logs.push(...rows);
        this._checkLimit();
        this._scrollDown();
    }
    _onError() {
        console.log('error...');
    }
    _checkLimit() {
        if (this._logs.length > LOGS_LIMITATION) {
            this._logs.splice(0, this._logs.length - LOGS_LIMITATION);
        }
    }
    _scrollDown() {
        if (!this._autoScrolling) {
            return;
        }
        setTimeout(() => {
            if (this._nodeList === void 0 || this._nodeList === null) {
                return null;
            }
            this._nodeList.nativeElement.scrollTo(0, this._nodeList.nativeElement.scrollHeight);
        }, 50);
    }
    _onClick(e) {
        this._autoScrolling = !this._autoScrolling;
    }
};
__decorate([
    core_1.ViewChild("_nodeList", { read: core_1.ElementRef }),
    __metadata("design:type", core_1.ElementRef)
], AppsRobotLogger.prototype, "_nodeList", void 0);
AppsRobotLogger = __decorate([
    core_1.Component({
        selector: 'apps-robot-logger',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [])
], AppsRobotLogger);
exports.AppsRobotLogger = AppsRobotLogger;
//# sourceMappingURL=component.js.map