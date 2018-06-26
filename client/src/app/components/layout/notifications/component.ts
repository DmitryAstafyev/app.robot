import { Component } from '@angular/core';
import ServiceNotifications from '../../../services/service.notifications';
import { INotification, INotificationButton, ENotificationTypes } from '../../../interfaces/interface.notification';
import { Subscription } from 'rxjs/Subscription';

const AUTO_CLOSE_NOTIFICATION_DURATION = 10 * 1000; //ms => 10 sec
const CLOSE_ANIMATION_DURATION = 500;

@Component({
    selector    : 'notifications',
    templateUrl : './template.html',
})

export class Notifications {

    private _notifications: Array<INotification> = [];

    private _eAddedNotification: Subscription;
    private _eRemovedNotification: Subscription;

    constructor(){
        this._addedNotification = this._addedNotification.bind(this);
        this._removedNotification = this._removedNotification.bind(this);
        this._eAddedNotification = ServiceNotifications.EAddedNotification.subscribe(this._addedNotification);
        this._eRemovedNotification = ServiceNotifications.ERemovedNotification.subscribe(this._removedNotification);
    }

    ngOnDestroy(){
        this._eAddedNotification.unsubscribe();
        this._eRemovedNotification.unsubscribe();
    }

    ////////////////////////////////////////////////////////////////////////////
    // Service handlers
    ////////////////////////////////////////////////////////////////////////////
    private _addedNotification(notification: INotification){
        if (typeof notification !== 'object' || notification === null) {
            return;
        }
        notification = this._addCloseHandlers(notification);
        notification = this._autoClose(notification);
        this._notifications.push(notification);
    }

    private _removedNotification(id: string){

    }

    ////////////////////////////////////////////////////////////////////////////
    // Internal stuff
    ////////////////////////////////////////////////////////////////////////////
    private _addCloseHandlers(notification: INotification): INotification{
        if (notification.buttons !== null && notification.addCloseHandler) {
            notification.buttons = notification.buttons.map((button: INotificationButton) => {
                const handler = button.handler;
                button.handler = () => {
                    this._close(notification.id);
                    handler();
                };
                return button;
            });
        }
        return notification;
    }

    _autoClose(notification: INotification): INotification{
        if (notification.closable) {
            notification._closeTimerId = setTimeout(this._close.bind(this, notification.id), AUTO_CLOSE_NOTIFICATION_DURATION);
        }
        return notification;
    }

    _close(id: string){
        this._notifications = this._notifications.map((notification: INotification) => {
            if (notification.id === id) {
                notification._closeTimerId !== -1 && clearTimeout(notification._closeTimerId);
                notification._closing = true;
                setTimeout(this._remove.bind(this, id), CLOSE_ANIMATION_DURATION);
            }
            return notification;
        });
    }

    _remove(id: string){
        this._notifications = this._notifications.filter((notification: INotification) => {
            if (notification.id === id) {
                return false;
            }
            return true;
        });
    }

}
