import { EventEmitter } from "@angular/core";
import { INotification, ENotificationTypes } from '../interfaces/interface.notification';
import { GUID } from '../tools/tools.guid';

class ServiceNotifications extends EventEmitter<INotification> {

    public EAddedNotification: EventEmitter<INotification> = new EventEmitter<INotification>();
    public ERemovedNotification: EventEmitter<string> = new EventEmitter<string>();

    private _notifications: Array<INotification> = [];
    
    constructor(){
        super();
    }

    private _setDefaults(notification: INotification): INotification{
        notification.buttons            = notification.buttons instanceof Array ? notification.buttons : [];
        notification.closable           = typeof notification.closable === 'boolean' ? notification.closable : true;
        notification.addCloseHandler    = typeof notification.addCloseHandler === 'boolean' ? notification.addCloseHandler : true;
        notification.progress           = typeof notification.progress === 'boolean' ? notification.progress : false;
        notification.id                 = typeof notification.id === 'string' ? notification.id : GUID.generate();
        notification.caption            = typeof notification.caption === 'string' ? notification.caption : '';
        notification.message            = typeof notification.message === 'string' ? notification.message : '';
        notification.type               = typeof notification.type === 'string' ? notification.type : ENotificationTypes.info;
        notification._closeTimerId      = -1;
        notification._closing           = false;
        return notification;
    }

    public get(){
        return this._notifications;
    }

    public add(notification: INotification){
        this._notifications.push(this._setDefaults(notification));
        this.EAddedNotification.emit(notification);
    }

    public remove(id: string){
        this._notifications = this._notifications.filter((notification: INotification) => {
            return notification.id !== id;
        });
        this.ERemovedNotification.emit(id);
    }


}

export default (new ServiceNotifications());