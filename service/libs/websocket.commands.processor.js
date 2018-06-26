const Signature         = 'WebSocketServer';

const WebSocketEvents   = require('./websocket.events.js'),
      ServerEmitter     = require('./server.events.js');

const COMMANDS = {
    greeting                : 'greeting',
    GUIDAccepted            : 'GUIDAccepted',
    LogsDataCome            : 'LogsDataCome',
    StatusDataCome          : 'StatusDataCome',
    PositionCome            : 'PositionCome',
    FixesCome               : 'FixesCome',
	MQTTMessageCome 		: 'MQTTMessageCome'
};

class IncomeCommandsProcessor {

    constructor(sender, GUID, eventEmitter){
        this.sender         = sender;
        this.GUID           = GUID;
        this.eventEmitter   = eventEmitter;
    }

    validate(message){
        let result = true;
        message.GUID    === void 0 && (result = false);
        message.command === void 0 && (result = false);
        message.params  === void 0 && (result = false);
        return result;
    }

    proceed(message){
        if (this.validate(message)){
            if (this[message.command] !== void 0){
                this[message.command](message);
            } else {
                console.log('[' + Signature + '][' + this.GUID + ']:: Next command does not support: ' + message.command);
            }
        } else {
            console.log('[' + Signature + '][' + this.GUID + ']:: Received message with wrong format: ' + JSON.stringify(message));
        }
    }

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * Commands
    * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    [COMMANDS.greeting      ](message){
        console.log('[' + Signature + '][' + this.GUID + ']:: GUID of current connection will be bound with client: ' + message.GUID);
        this.eventEmitter.emit(WebSocketEvents.CLIENT_GUID_IS_GOTTEN, message.GUID);
    }

}

class OutgoingCommandsProcessor {

    constructor(sender, GUID, eventEmitter){
        this.sender         = sender;
        this.GUID           = GUID;
        this.eventEmitter   = eventEmitter;
    }

    /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
     * Commands
     * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * */
    [COMMANDS.greeting              ](){
        this.sender({
            GUID    : '',
            command : COMMANDS.greeting,
            params  : {}
        });
    }

    [COMMANDS.GUIDAccepted          ](clientGUID){
        this.sender({
            GUID    : clientGUID,
            command : COMMANDS.GUIDAccepted,
            params  : {}
        });
    }

    [COMMANDS.LogsDataCome](clientGUID, params){
        this.sender({
            GUID    : clientGUID,
            command : COMMANDS.LogsDataCome,
            params  : params
        });
    }

    [COMMANDS.StatusDataCome](clientGUID, params){
        this.sender({
            GUID    : clientGUID,
            command : COMMANDS.StatusDataCome,
            params  : params
        });
    }

    [COMMANDS.PositionCome](clientGUID, params){
        this.sender({
            GUID    : clientGUID,
            command : COMMANDS.PositionCome,
            params  : params
        });
    }

    [COMMANDS.FixesCome](clientGUID, params){
        this.sender({
            GUID    : clientGUID,
            command : COMMANDS.FixesCome,
            params  : params
        });
    }

	[COMMANDS.MQTTMessageCome](clientGUID, params){
		this.sender({
			GUID    : clientGUID,
			command : COMMANDS.MQTTMessageCome,
			params  : params
		});
	}
}

module.exports = {
    income      : IncomeCommandsProcessor,
    outgoing    : OutgoingCommandsProcessor,
    COMMANDS    : COMMANDS
};