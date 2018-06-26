"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const service_notifications_1 = require("../../../services/service.notifications");
const AUTO_CLOSE_NOTIFICATION_DURATION = 10 * 1000; //ms => 10 sec
const CLOSE_ANIMATION_DURATION = 500;
let Notifications = class Notifications {
    constructor() {
        this._notifications = [];
        this._addedNotification = this._addedNotification.bind(this);
        this._removedNotification = this._removedNotification.bind(this);
        this._eAddedNotification = service_notifications_1.default.EAddedNotification.subscribe(this._addedNotification);
        this._eRemovedNotification = service_notifications_1.default.ERemovedNotification.subscribe(this._removedNotification);
    }
    ngOnDestroy() {
        this._eAddedNotification.unsubscribe();
        this._eRemovedNotification.unsubscribe();
    }
    ////////////////////////////////////////////////////////////////////////////
    // Service handlers
    ////////////////////////////////////////////////////////////////////////////
    _addedNotification(notification) {
        if (typeof notification !== 'object' || notification === null) {
            return;
        }
        notification = this._addCloseHandlers(notification);
        notification = this._autoClose(notification);
        this._notifications.push(notification);
    }
    _removedNotification(id) {
    }
    ////////////////////////////////////////////////////////////////////////////
    // Internal stuff
    ////////////////////////////////////////////////////////////////////////////
    _addCloseHandlers(notification) {
        if (notification.buttons !== null && notification.addCloseHandler) {
            notification.buttons = notification.buttons.map((button) => {
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
    _autoClose(notification) {
        if (notification.closable) {
            notification._closeTimerId = setTimeout(this._close.bind(this, notification.id), AUTO_CLOSE_NOTIFICATION_DURATION);
        }
        return notification;
    }
    _close(id) {
        this._notifications = this._notifications.map((notification) => {
            if (notification.id === id) {
                notification._closeTimerId !== -1 && clearTimeout(notification._closeTimerId);
                notification._closing = true;
                setTimeout(this._remove.bind(this, id), CLOSE_ANIMATION_DURATION);
            }
            return notification;
        });
    }
    _remove(id) {
        this._notifications = this._notifications.filter((notification) => {
            if (notification.id === id) {
                return false;
            }
            return true;
        });
    }
};
Notifications = __decorate([
    core_1.Component({
        selector: 'notifications',
        templateUrl: './template.html',
    }),
    __metadata("design:paramtypes", [])
], Notifications);
exports.Notifications = Notifications;
//# sourceMappingURL=component.js.map