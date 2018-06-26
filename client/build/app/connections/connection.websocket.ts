import { EventEmitter } from "@angular/core";

const WS_EVENTS = {
    message : 'message',
    error   : 'error',
    open    : 'open',
    close   : 'close'
};

const WS_RECONNECTION_TIMEOUT = 2000;

export class ConnectionWebSocket {

    private _address: string;
    private _protocol: string;
    private _client: WebSocket;
    private _connected: boolean = false;
    private _reconnectionTimer: any = -1;

    public EDisconnected: EventEmitter<string> = new EventEmitter<string>();
    public EConnected: EventEmitter<string> = new EventEmitter<string>();
    public EError: EventEmitter<string> = new EventEmitter<string>();
    public EData: EventEmitter<string> = new EventEmitter<string>();

    constructor(address: string, protocol: string){
        if (typeof address !== 'string' || address.trim() === '') {
            throw new Error('Address should be a not empty string.');
        }
        if (typeof protocol !== 'string' || protocol.trim() === '') {
            throw new Error('Protocol should be a not empty string.');
        }
        this._address = address;
        this._protocol = protocol;
        Object.keys(WS_EVENTS).forEach((event)=>{
            this[WS_EVENTS[event]] = this[WS_EVENTS[event]].bind(this);
        });
        this._connect();
    }

    public destroy(){
        if (this._client !== null && this._client.close !== void 0){
            this._client.close();
        }
        this._unbind();
        this._client = null;
        clearTimeout(this._reconnectionTimer);
    }

    public send(message: string) {
        return new Promise((resolve, reject) => {
            if (!this._connected) {
                return reject(new Error('Client is not connected.'));
            }
            this._client.send(message);
        });
    }

    private _connect() {
        if (!this._connected){
            this._client = new WebSocket(
                this._address,
                this._protocol
            );
            this._bind();
        }
    }

    private _reconnect(){
        this.destroy();
        this._reconnectionTimer = setTimeout(() => {
            this._connect();
        }, WS_RECONNECTION_TIMEOUT);
    }

    private _bind(){
        Object.keys(WS_EVENTS).forEach((event)=>{
            this._client.addEventListener(WS_EVENTS[event], this[WS_EVENTS[event]]);
        });
    }

    private _unbind(){
        Object.keys(WS_EVENTS).forEach((event)=>{
            this._client.removeEventListener(WS_EVENTS[event], this[WS_EVENTS[event]]);
        });
    }

    private message(event: MessageEvent) {
        if (typeof event.data !== 'string'){
            return;
        }
        this.EData.emit(event.data);
    }

    private error(){
        this.EError.emit(this._protocol);
    }

    private open(){
        this._connected = true;
        this.EConnected.emit(this._protocol);
    }

    private close(){
        this._connected = false;
        this.EDisconnected.emit(this._protocol);
        this._reconnect();
    }

}