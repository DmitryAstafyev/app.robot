
module.exports = {
    emitter : new (require('events').EventEmitter)(),
    EVENTS  : {
        'SEND_VIA_WS'               : Symbol(),
        'SEND_ALL'                  : Symbol(),
        'CLIENT_IS_DISCONNECTED'    : Symbol(),
        'WRITE_TO_SERIAL'           : Symbol()
    }
}