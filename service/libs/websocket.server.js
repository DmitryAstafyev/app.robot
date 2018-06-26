const Signature         = 'WebSocketServer';

const SETTINGS          = require('../config.js'),
      Errors            = require('./errors'),
      CommandProcessor  = require('./websocket.commands.processor'),
      EventEmitter      = require('events').EventEmitter,
      WebSocketEvents   = require('./websocket.events.js'),
      ServerEmitter     = require('./server.events.js');


const WS_SERVER_SETTINGS= {
    PROTOCOL : 'robot'
};

const WS_SERVER_EVENTS  = {
    request : 'request',
    message : 'message',
    close   : 'close'
};

const MESSAGE_TYPES     = {
    utf8    : 'utf8',
    binary  : 'binary',
};

class Connection{

    constructor(GUID, connection, eventEmitter){
        this.GUID               = GUID;
        this.clientGUID         = GUID;
        this.eventEmitter       = new EventEmitter();
        this.serverEventEmitter = eventEmitter;
        this.connection         = connection;
        this.connection     .on(WS_SERVER_EVENTS.message,               this.onMessage.     bind(this));
        this.connection     .on(WS_SERVER_EVENTS.close,                 this.onClose.       bind(this));
        this.eventEmitter   .on(WebSocketEvents.CLIENT_GUID_IS_GOTTEN,  this.onClientGUID.  bind(this));
        this.income             = new (CommandProcessor.income  )(this.sendUTF8.bind(this), this.GUID, this.eventEmitter);
        this.outgoing           = new (CommandProcessor.outgoing)(this.sendUTF8.bind(this), this.GUID, this.eventEmitter);
        this.outgoing.greeting();
    }

    getJSON(message){
        let result = null;
        try{
            result = JSON.parse(message);
        } catch (e){

        }
        return result;
    }

    onMessage(message){
        if (message.type === MESSAGE_TYPES.utf8) {
            console.log('[' + Signature + '][' + this.GUID + ']:: Received message from address (' + this.connection.remoteAddress + '): ' + message.utf8Data);
            let _message = this.getJSON(message.utf8Data);
            if (_message !== null){
                this.income.proceed(_message);
            } else {
                console.log('[' + Signature + '][' + this.GUID + ']:: Received message from address (' + this.connection.remoteAddress + ') has wrong format: ' + message.utf8Data);
            }
        } else if (message.type === MESSAGE_TYPES.binary) {
            console.log('[' + Signature + '][' + this.GUID + ']:: Received binary message from address (' + this.connection.remoteAddress + '): ' + message.binaryData.length + ' bytes');
        }

    }

    onClose(reasonCode, description){
        console.log('[' + Signature + ']:: Connection from address (' + this.connection.remoteAddress + ') is disconnected.');
        ServerEmitter.emitter.emit(ServerEmitter.EVENTS.CLIENT_IS_DISCONNECTED, this.GUID, this.clientGUID);
    }

    onClientGUID(clientGUID){
        this.clientGUID = clientGUID;
        this.outgoing.GUIDAccepted(this.clientGUID);
        console.log('[' + Signature + ']:: Connection from address (' + this.connection.remoteAddress + ') is set client GUID: ' + this.clientGUID);
    }

    doCommand(command, params){
        if (this.outgoing[command] !== void 0){
            this.outgoing[command](this.clientGUID, params);
        }
    }

    sendUTF8(data){
        this.connection.sendUTF(typeof data !== 'string' ? JSON.stringify(data) : data);
    }

    sendBytes(data){
        this.connection.sendBytes(data);
    }

}

class WebSocketServer {

    constructor(httpServer){
        this.httpServer     = httpServer;
        this.wsServer       = null;
        this.connections    = {};
        this.eventEmitter   = new EventEmitter();
    }

    create(){
        console.log('[' + Signature + ']:: Starting webSocket server.');
        let WebSocketServer = require('websocket').server;
        this.wsServer       = new WebSocketServer({
            httpServer              : this.httpServer,
            autoAcceptConnections   : false
        });
        this.wsServer.on(WS_SERVER_EVENTS.request, this.onRequest.bind(this));
        this.bindEvents();
        console.log('[' + Signature + ']:: WebSocket server is started.');
        return this.eventEmitter;
    }

    bindEvents(){
        ServerEmitter.emitter.on(ServerEmitter.EVENTS.SEND_VIA_WS,              this.onSend.bind(this));
        ServerEmitter.emitter.on(ServerEmitter.EVENTS.SEND_ALL,                 this.onSendAll.bind(this));
        ServerEmitter.emitter.on(ServerEmitter.EVENTS.CLIENT_IS_DISCONNECTED,   this.onDisconnect.bind(this));
    }

    getConnectionByClientGUID(clientGUID){
        let connection = null;
        Object.keys(this.connections).forEach((key)=>{
            this.connections[key].clientGUID    === clientGUID && (connection = this.connections[key]);
            key                                 === clientGUID && (connection = this.connections[key]);
        });
        return connection;
    }

    onSend(GUID, command, params){
        let connection = this.getConnectionByClientGUID(GUID);
        if (connection !== null){
            connection.doCommand(command, params);
        } else{
            console.log('[' + Signature + ']:: cannot find connection for client: ' + GUID);
        }
    }

    onSendAll(command, params){
        Object.keys(this.connections).forEach((connection)=>{
            this.connections[connection].doCommand(command, params);
        });
    }

    originIsAllowed(origin){
        return true;
    }

    onRequest(request){
        if (this.originIsAllowed(request.origin)){
            let GUID = (require('guid')).raw();
            this.connections[GUID] = new Connection(
                GUID,
                request.accept(WS_SERVER_SETTINGS.PROTOCOL, request.origin),
                this.eventEmitter
            );
            console.log('[' + Signature + ']:: Connection (' + GUID + ') from origin: ' + request.origin + ' is accepted.');
        } else {
            console.log('[' + Signature + ']:: Refuse connection from origin: ' + request.origin);
            request.reject();
            return false;
        }
    }

    onDisconnect(connection, clientGUID){
        this.connections[connection] !== void 0 && (delete this.connections[connection]);
    }

    emulation(){
        function generate(){
            return {
                [CommandProcessor.COMMANDS.FixesCome        ] : { x: Math.round(Math.random() * 100), y: Math.round(Math.random() * 100)},
                [CommandProcessor.COMMANDS.PositionCome     ] : { x: Math.round(Math.random() * 100), y: Math.round(Math.random() * 100), a: (Math.random() * 2 * 3.14)},
                [CommandProcessor.COMMANDS.LogsDataCome     ] : { str: 'Test log data'},
                [CommandProcessor.COMMANDS.StatusDataCome   ] : { rows : [ {key: 'a', value: 'aa'}]},
            };
        }
        let commands = generate();
        Object.keys(commands).forEach((command)=>{
            Object.keys(this.connections).forEach((connection)=>{
                this.connections[connection].doCommand(command, commands[command]);
            });
        });
        console.log('Emulation events are sent.');
        setTimeout(this.emulation.bind(this), 1000);
    }

}

module.exports = WebSocketServer;
