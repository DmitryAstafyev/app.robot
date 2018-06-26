"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const WS_EVENTS = {
    message: 'message',
    error: 'error',
    open: 'open',
    close: 'close'
};
const WS_RECONNECTION_TIMEOUT = 2000;
class ConnectionWebSocket {
    constructor(address, protocol) {
        this._connected = false;
        this._reconnectionTimer = -1;
        this.EDisconnected = new core_1.EventEmitter();
        this.EConnected = new core_1.EventEmitter();
        this.EError = new core_1.EventEmitter();
        this.EData = new core_1.EventEmitter();
        if (typeof address !== 'string' || address.trim() === '') {
            throw new Error('Address should be a not empty string.');
        }
        if (typeof protocol !== 'string' || protocol.trim() === '') {
            throw new Error('Protocol should be a not empty string.');
        }
        this._address = address;
        this._protocol = protocol;
        Object.keys(WS_EVENTS).forEach((event) => {
            this[WS_EVENTS[event]] = this[WS_EVENTS[event]].bind(this);
        });
        this._connect();
    }
    destroy() {
        if (this._client !== null && this._client.close !== void 0) {
            this._client.close();
        }
        this._unbind();
        this._client = null;
        clearTimeout(this._reconnectionTimer);
    }
    send(message) {
        return new Promise((resolve, reject) => {
            if (!this._connected) {
                return reject(new Error('Client is not connected.'));
            }
            this._client.send(message);
        });
    }
    _connect() {
        if (!this._connected) {
            this._client = new WebSocket(this._address, this._protocol);
            this._bind();
        }
    }
    _reconnect() {
        this.destroy();
        this._reconnectionTimer = setTimeout(() => {
            this._connect();
        }, WS_RECONNECTION_TIMEOUT);
    }
    _bind() {
        Object.keys(WS_EVENTS).forEach((event) => {
            this._client.addEventListener(WS_EVENTS[event], this[WS_EVENTS[event]]);
        });
    }
    _unbind() {
        Object.keys(WS_EVENTS).forEach((event) => {
            this._client.removeEventListener(WS_EVENTS[event], this[WS_EVENTS[event]]);
        });
    }
    message(event) {
        if (typeof event.data !== 'string') {
            return;
        }
        this.EData.emit(event.data);
    }
    error() {
        this.EError.emit(this._protocol);
    }
    open() {
        this._connected = true;
        this.EConnected.emit(this._protocol);
    }
    close() {
        this._connected = false;
        this.EDisconnected.emit(this._protocol);
        this._reconnect();
    }
}
exports.ConnectionWebSocket = ConnectionWebSocket;
//# sourceMappingURL=connection.websocket.js.map