"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const interface_notification_1 = require("../interfaces/interface.notification");
const tools_guid_1 = require("../tools/tools.guid");
class ServiceNotifications extends core_1.EventEmitter {
    constructor() {
        super();
        this.EAddedNotification = new core_1.EventEmitter();
        this.ERemovedNotification = new core_1.EventEmitter();
        this._notifications = [];
    }
    _setDefaults(notification) {
        notification.buttons = notification.buttons instanceof Array ? notification.buttons : [];
        notification.closable = typeof notification.closable === 'boolean' ? notification.closable : true;
        notification.addCloseHandler = typeof notification.addCloseHandler === 'boolean' ? notification.addCloseHandler : true;
        notification.progress = typeof notification.progress === 'boolean' ? notification.progress : false;
        notification.id = typeof notification.id === 'string' ? notification.id : tools_guid_1.GUID.generate();
        notification.caption = typeof notification.caption === 'string' ? notification.caption : '';
        notification.message = typeof notification.message === 'string' ? notification.message : '';
        notification.type = typeof notification.type === 'string' ? notification.type : interface_notification_1.ENotificationTypes.info;
        notification._closeTimerId = -1;
        notification._closing = false;
        return notification;
    }
    get() {
        return this._notifications;
    }
    add(notification) {
        this._notifications.push(this._setDefaults(notification));
        this.EAddedNotification.emit(notification);
    }
    remove(id) {
        this._notifications = this._notifications.filter((notification) => {
            return notification.id !== id;
        });
        this.ERemovedNotification.emit(id);
    }
}
exports.default = (new ServiceNotifications());
//# sourceMappingURL=service.notifications.js.map