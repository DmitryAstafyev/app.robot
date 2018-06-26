
const
    SETTINGS          = require('../config.js'),
    CommandProcessor  = require('./websocket.commands.processor'),
    MQTT              = require('mqtt'),
    ServerEmitter     = require('./server.events');

const
    MQTT_EVENTS = {
        'connect' : 'connect',
        'message' : 'message',
        'error'   : 'error'
    },
    SERVICE_EVENT = {
        income  : 'web/in',
        outcome : 'web/out',
		common 	: '#'
    };

class ServiceMQTTStream{

    constructor(){
        this.GUID               = (require('guid')).raw();
        this[MQTT_EVENTS.connect] = this[MQTT_EVENTS.connect].bind(this);
        this[MQTT_EVENTS.message] = this[MQTT_EVENTS.message].bind(this);
        this[MQTT_EVENTS.error  ] = this[MQTT_EVENTS.error  ].bind(this);
        ServerEmitter.emitter.on(ServerEmitter.EVENTS.CLIENT_IS_DISCONNECTED,   this.onClientDisconnect );
    }

    start(){
        console.log('Connection MQTT client by [' + SETTINGS.MQTT_CLIENT + ']');
        this.client = MQTT.connect(SETTINGS.MQTT_CLIENT);
        Object.keys(MQTT_EVENTS).forEach((event) => {
            this.client.on(event, this[event]);
        });
    }

    [MQTT_EVENTS.connect](){
        //Subscribe
        Object.keys(SERVICE_EVENT).forEach((event)=>{
            this.client.subscribe(SERVICE_EVENT[event]);
        });
        console.log('MQTT Client is connected');
    }

    [MQTT_EVENTS.message](topic, message){
    	if (message instanceof Buffer) {
    		message = message.toString();
		}
		ServerEmitter.emitter.emit(ServerEmitter.EVENTS.SEND_ALL, CommandProcessor.COMMANDS.MQTTMessageCome, { message: message });
		console.log('MQTT Client message: ' + message);

	}

    [MQTT_EVENTS.error](error){
        console.log('MQTT Client error.' + JSON.stringify(error));
    }

    onClientDisconnect(connection, clientGUID){
    }

}
module.exports = ServiceMQTTStream;
