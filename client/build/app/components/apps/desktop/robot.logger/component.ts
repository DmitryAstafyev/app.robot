import {Component, OnDestroy, ViewChild, ElementRef} from '@angular/core';
import ServiceStaticWSConnector from '../../../../services/service.ws';
import { Subscription } from 'rxjs/Subscription';

const SERVER = {
    WS_URL      : "ws://localhost:8081/",
    WS_PROTOCOL : "robot",
};

const LOGS_LIMITATION = 1000;

@Component({
    selector    : 'apps-robot-logger',
    templateUrl : './template.html',
})

export class AppsRobotLogger implements OnDestroy {

    private _eConnected: Subscription;
    private _eDisconnected: Subscription;
    private _eData: Subscription;
    private _eError: Subscription;

    private _logs: Array<string> = [];
    private _autoScrolling: boolean = true;

    @ViewChild("_nodeList", {read: ElementRef}) _nodeList: ElementRef;

    constructor() {
        this._connect();
    }

    ngOnDestroy(){
        this._unbind();
    }

    private _connect(){
        this._onConnected = this._onConnected.bind(this);
        this._onDisconnected = this._onDisconnected.bind(this);
        this._onData = this._onData.bind(this);
        this._onError = this._onError.bind(this);
        this._bind();
        if (!ServiceStaticWSConnector.isConnected()){
            ServiceStaticWSConnector.connect(SERVER.WS_URL, SERVER.WS_PROTOCOL);
        }
    }

    private _bind(){
        this._eConnected = ServiceStaticWSConnector.EConnected.subscribe(this._onConnected);
        this._eDisconnected = ServiceStaticWSConnector.EDisconnected.subscribe(this._onDisconnected);
        this._eData = ServiceStaticWSConnector.EData.subscribe(this._onData);
        this._eError = ServiceStaticWSConnector.EError.subscribe(this._onError);
    }

    private _unbind(){
        this._eConnected.unsubscribe();
        this._eDisconnected.unsubscribe();
        this._eData.unsubscribe();
        this._eError.unsubscribe();
    }

    private _onConnected(){
        console.log('connected...');
    }

    private _onDisconnected(){
        console.log('disconnected...');
    }

    private _onData(data: string){
        const rows = data.split(/[\n\r]/gi);
        this._logs.push(...rows);
        this._checkLimit();
        this._scrollDown();
    }

    private _onError(){
        console.log('error...');
    }

    private _checkLimit(){
        if (this._logs.length > LOGS_LIMITATION) {
            this._logs.splice(0, this._logs.length - LOGS_LIMITATION)
        }
    }

    private _scrollDown(): any{
        if (!this._autoScrolling){
            return;
        }
        setTimeout(() => {
            if (this._nodeList === void 0 || this._nodeList === null) {
                return null;
            }
            this._nodeList.nativeElement.scrollTo(0, this._nodeList.nativeElement.scrollHeight);
        }, 50);
    }

    private _onClick(e: MouseEvent) {
        this._autoScrolling = !this._autoScrolling;
    }
}
