import {Component, OnDestroy, ViewChild, ElementRef, Input, EventEmitter, AfterViewChecked} from '@angular/core';
import ServiceStaticWSConnector from '../../../../services/service.ws';
import { IPhoneQR } from '../../../../services/service.ws';
import { Subscription } from 'rxjs/Subscription';
import { GUID } from '../../../../tools/tools.guid';
const SERVER = {
    WS_URL      : "ws://localhost:8081/",
    WS_PROTOCOL : "robot",
};

const POINTS_LIMITATION = 500;
const POWS_LIMITATION = 50;

const OFFSET_X = 200;
const OFFSET_Y = 100;

@Component({
    selector    : 'apps-robot-qr-scanner',
    templateUrl : './template.html',
})

export class AppsRobotQRScanner implements OnDestroy, AfterViewChecked {

    @Input() EHolderResized: EventEmitter<any>;

    private _eHolderResized: Subscription;
    private _ePhoneQR: Subscription;

    private _points: Array<IPhoneQR> = [];
    private _pows: Array<{x: number, y: number}> = [];

    private _maxY: number = 0;
    private _maxX: number = 0;
    private _width: number = 0;
    private _height: number = 0;

    private _robotX: number = 0;
    private _robotY: number = 0;
    private _GUID: string = GUID.generate();

    @ViewChild("_wrapper", {read: ElementRef}) _wrapper: ElementRef;

    constructor() {
        //this._connect();
        this._emulate();
        this._onHolderResized = this._onHolderResized.bind(this);
    }

    ngOnDestroy(){
        this._unbind();
        ServiceStaticWSConnector.emulationStop();
        this._eHolderResized !== void 0 && this._eHolderResized.unsubscribe();
    }

    ngAfterViewChecked(){
        if (this._eHolderResized !== void 0){
            return;
        }
        if (this.EHolderResized !== void 0 && this.EHolderResized !== null){
            this._eHolderResized = this.EHolderResized.subscribe(this._onHolderResized);
        }
    }

    private _connect(){
        this._onQRCome = this._onQRCome.bind(this);
        this._bind();
        if (!ServiceStaticWSConnector.isConnected()){
            ServiceStaticWSConnector.connect(SERVER.WS_URL, SERVER.WS_PROTOCOL);
        }
    }

    private _emulate(){
        this._onQRCome = this._onQRCome.bind(this);
        this._bind();
        if (!ServiceStaticWSConnector.isEmulation()){
            ServiceStaticWSConnector.emulationStart();
        }
    }

    private _bind(){
        this._ePhoneQR = ServiceStaticWSConnector.EPhoneQR.subscribe(this._onQRCome);
    }

    private _unbind(){
        this._ePhoneQR.unsubscribe();
    }

    private _onQRCome(data: IPhoneQR){
        data = Object.assign({}, data);
        data.angle = - data.angle;
        //data._angle = data.angle * 180 / Math.PI;
        this._points.push(data);
        this._checkLimit();
        this._calculate();
    }

    private _checkLimit(){
        if (this._points.length > POINTS_LIMITATION) {
            this._points.splice(0, this._points.length - POINTS_LIMITATION)
        }
    }

    private _getStyles(point: IPhoneQR, index: number){
        return {
            top: `${point._y}px`,
            left: `${point._x}px`,
            opacity: index / this._points.length,
            transform: `rotate(${point.angle}rad)`
        }
    }

    private _onHolderResized(){
        this._calculate();
    }

    private _updateOutputSize(){
        if (this._wrapper !== void 0 && this._wrapper !== null) {
            const size = this._wrapper.nativeElement.getBoundingClientRect();
            this._width = size.width;
            this._height = size.height;
        }
    }

    private _updateMinMax(){
        this._maxX = 0;
        this._maxY = 0;
        this._points.forEach((point: IPhoneQR) => {
            if (this._maxX < point.x) {
                this._maxX = point.x;
            }
            if (this._maxY < point.y) {
                this._maxY = point.y;
            }
        });
    }

    private _calculate(){
        this._updateOutputSize();
        this._updateMinMax();
        let xRate: number;
        let yRate: number;
        let rate: number;
        if (this._maxX > this._width || this._maxY > this._height) {
            xRate = this._maxX / this._width;
            yRate = this._maxY / this._height;
        } else {
            xRate = this._width / this._maxX;
            yRate = this._height / this._maxY;
        }
        rate = xRate < yRate ? xRate : yRate;
        this._points = this._points.map((point: IPhoneQR) => {
            point._x = point.x * rate;
            point._y = point.y * rate;
            return point;
        });
        this._updateRobotCoord(rate);
    }

    private _updateRobotCoord(rate: number){
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

    private _getPowStyles(pow: {x: number, y: number}, index: number){
        return {
            top: `${pow.y}px`,
            left: `${pow.x}px`,
            opacity: index / this._pows.length
        }
    }

}
