import {Component, OnDestroy, ViewChild, ElementRef, Input, EventEmitter, AfterViewChecked} from '@angular/core';
import { ModalWindow } from '../../../../classes/environment/modalwindow';
import ServiceStaticWSConnector from '../../../../services/service.ws';
import { IPhoneQR } from '../../../../services/service.ws';
import { Subscription } from 'rxjs/Subscription';
import { GUID } from '../../../../tools/tools.guid';

interface IPawPoint {
    x: number, 
    y: number, 
    _x: number, 
    _y: number,  
    a: number, 
}
interface IUSPoint {
    x: number, 
    y: number, 
    _x: number, 
    _y: number, 
    __x: number, 
    __y: number, 
    a: number, 
    d: number
};

const SERVER = {
    WS_URL      : "ws://localhost:8081/",
    WS_PROTOCOL : "robot",
};

const POINTS_LIMITATION = 200;
const POWS_LIMITATION = 50;
const US1_LIMITATION = 200;

const POW_OFFSET_ANGLE = 1.5708;//rad
const POW_DISTANCE = 12;
const US1_OFFSET_ANGLE = 1.5708;//rad

@Component({
    selector    : 'apps-robot-qr-scanner',
    templateUrl : './template.html',
})

export class AppsRobotQRScanner extends ModalWindow implements OnDestroy, AfterViewChecked {

    private _eHolderResized: Subscription;
    private _ePhoneQR: Subscription;
    private _eBrickUS1: Subscription;


    private _points: Array<IPhoneQR> = [];
    private _pows: Array<IPawPoint> = [];
    private _us1: Array<IUSPoint> = [];

    private _maxY: number = 0;
    private _maxX: number = 0;
    private _width: number = 0;
    private _height: number = 0;

    private _GUID: string = GUID.generate();

    @ViewChild("_wrapper", {read: ElementRef}) _wrapper: ElementRef;

    constructor() {
        super();
        this._onHolderResized = this._onHolderResized.bind(this);
        this._onQRCome = this._onQRCome.bind(this);
        this._onBrickUS1Come = this._onBrickUS1Come.bind(this);
        //this._emulate();
        this._connect();
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
        this._bind();
        if (!ServiceStaticWSConnector.isConnected()){
            ServiceStaticWSConnector.connect(SERVER.WS_URL, SERVER.WS_PROTOCOL);
        }
    }

    private _emulate(){
        this._bind();
        if (!ServiceStaticWSConnector.isEmulation()){
            ServiceStaticWSConnector.emulationStart();
        }
    }

    private _bind(){
        this._ePhoneQR = ServiceStaticWSConnector.EPhoneQR.subscribe(this._onQRCome);
        this._eBrickUS1 = ServiceStaticWSConnector.EBrickUS1.subscribe(this._onBrickUS1Come);
    }

    private _unbind(){
        this._ePhoneQR.unsubscribe();
        this._eBrickUS1.unsubscribe();
    }

    private _onQRCome(data: IPhoneQR){
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

    private _onBrickUS1Come(distance: number){
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

    private _checkLimit(){
        if (this._points.length > POINTS_LIMITATION) {
            this._points.splice(0, this._points.length - POINTS_LIMITATION)
        }
        if (this._pows.length > POWS_LIMITATION) {
            this._pows.splice(1, 0);
        }
        if (this._us1.length > US1_LIMITATION) {
            this._us1.splice(1, 0);
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
        this._us1.forEach((point) => {
            if (this._maxX < point.__x) {
                this._maxX = point.__x;
            }
            if (this._maxY < point.__y) {
                this._maxY = point.__y;
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
        this._updateUS1Coord(rate);
    }

    private _updateRobotCoord(rate: number){
        this._pows = this._pows.map((pow: IPawPoint) => {
            pow._x = pow.x * rate - Math.cos(pow.a - POW_OFFSET_ANGLE) * POW_DISTANCE * rate;
            pow._y = pow.y * rate - Math.sin(pow.a - POW_OFFSET_ANGLE) * POW_DISTANCE * rate;
            return pow;
        });
    }

    private _getPowStyles(pow: IPawPoint, index: number){
        return {
            top: `${pow._y}px`,
            left: `${pow._x}px`,
            opacity: index / this._pows.length
        }
    }

    private _updateUS1Coord(rate: number){
        this._us1 = this._us1.map((point: IUSPoint) => {
            point.__x = point.x - Math.cos(point.a - US1_OFFSET_ANGLE) * point.d;
            point.__y = point.y - Math.sin(point.a - US1_OFFSET_ANGLE) * point.d;
            point._x = point.x * rate - Math.cos(point.a - US1_OFFSET_ANGLE) * point.d * rate;
            point._y = point.y * rate - Math.sin(point.a - US1_OFFSET_ANGLE) * point.d * rate;
            return point;
        });
    }

    private _getUs1Styles(point: IUSPoint, index: number){
        return {
            top: `${point._y}px`,
            left: `${point._x}px`,
            opacity: index / this._us1.length
        }
    }

}
