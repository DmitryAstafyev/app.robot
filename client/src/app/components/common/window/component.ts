import { Component, Input, Output, OnDestroy, AfterViewChecked, ChangeDetectorRef, EventEmitter } from '@angular/core';
import { IButton } from '../../../interfaces/interface.modalwindow.button';
import { EState, IModalWindow } from '../../../interfaces/interface.modalwindow';
import ServiceModalWindows from '../../../services/service.modalwindows';
import { Subscription } from 'rxjs/Subscription';

const EVENTS = {
    keypress  : 'keypress',
    mousedown : 'mousedown',
    mouseup   : 'mouseup',
    mousemove : 'mousemove',
};

const DIRECTIONS = {
    top     : Symbol('top'),
    left    : Symbol('left'),
    right   : Symbol('right'),
    bottom  : Symbol('bottom'),
    corner  : Symbol('corner'),
    move    : Symbol('move'),
    nothing : Symbol('nothing')
};

const LIMITS = {
    width: 100,
    height: 100,
};

@Component({
    selector    : 'modal-window',
    templateUrl : './template.html',
})

export class ModalWindow implements OnDestroy, AfterViewChecked {
    @Input() id: string;
    @Input() component: any;
    @Input() caption: string = '';
    @Input() buttons: Array<IButton> = [];
    @Input() closable: boolean;
    @Input() resizable: boolean;
    @Input() movable: boolean;
    @Input() maximizable: boolean;
    @Input() minimizibal: boolean;
    @Input() state: EState;
    @Input() focused: boolean;

    @Output() close(){
        ServiceModalWindows.remove(this.id);
    }

    @Output() minimize(){
    }

    @Output() resore(){
    }

    @Output() maximize(){
    }

    private _size: { t: number, l: number, h: number, w: number } = { t: 20, l: 20, h: 700, w: 700 };
    private _direction: Symbol = DIRECTIONS.nothing;
    private _current: { x: number, y: number } = { x: -1, y: -1};
    private DIRECTIONS: any = DIRECTIONS;
    private STATES: any = EState;
    private _inited: boolean = false;

    private _eUpdated: Subscription;

    private EResized: EventEmitter<any> = new EventEmitter<any>();

    constructor(private changeDetectorRef : ChangeDetectorRef) {
        this._globalMouseMove = this._globalMouseMove.bind(this);
        this._globalMouseUp = this._globalMouseUp.bind(this);
        this._onRestore = this._onRestore.bind(this);
        this._eUpdated = ServiceModalWindows.EUpdated.subscribe(this._onRestore);
        this._bindCallerListeners();
    }

    ngAfterViewChecked(){
        if (this._inited){
            return;
        }
        this._addDefaultButtons();
        this._inited = true;
    }

    ngOnDestroy(){
        this._eUpdated.unsubscribe();
        this._unbindCallerListeners();
    }

    private _bindCallerListeners() {
        window.addEventListener(EVENTS.mousemove, this._globalMouseMove);
        window.addEventListener(EVENTS.mouseup,   this._globalMouseUp);
    }

    private _unbindCallerListeners() {
        window.removeEventListener(EVENTS.mousemove, this._globalMouseMove);
        window.removeEventListener(EVENTS.mouseup,   this._globalMouseUp);
    }

    private _globalMouseMove(e: MouseEvent){
        if (this._direction === DIRECTIONS.nothing) {
            return;
        }
        const x = e.pageX;
        const y = e.pageY;
        switch (this._direction) {
            case DIRECTIONS.top:
                if (y < this._current.y) {
                    this._size.h += (this._current.y - y);
                    this._size.t -= (this._current.y - y);
                } else {
                    (this._size.h - (y - this._current.y) > LIMITS.height) && (this._size.h -= (y - this._current.y));
                    this._size.t += (y - this._current.y);
                }
                break;
            case DIRECTIONS.bottom:
                if (y < this._current.y) {
                    (this._size.h - (this._current.y - y) > LIMITS.height) && (this._size.h -= (this._current.y - y));
                } else {
                    this._size.h += (y - this._current.y);
                }
                break;
            case DIRECTIONS.left:
                if (x < this._current.x) {
                    this._size.w += (this._current.x - x);
                    this._size.l -= (this._current.x - x);
                } else {
                    (this._size.w - (x - this._current.x) > LIMITS.width) && (this._size.w -= (x - this._current.x));
                    this._size.l += (x - this._current.x);
                }
                break;
            case DIRECTIONS.right:
                if (x < this._current.x) {
                    (this._size.w - (this._current.x - x) > LIMITS.width) && (this._size.w -= (this._current.x - x));
                } else {
                    this._size.w += (x - this._current.x);
                }
                break;
            case DIRECTIONS.corner:
                if (x < this._current.x) {
                    (this._size.w - (this._current.x - x) > LIMITS.width) && (this._size.w -= (this._current.x - x));
                } else {
                    this._size.w += (x - this._current.x);
                }
                if (y < this._current.y) {
                    (this._size.h - (this._current.y - y) > LIMITS.height) && (this._size.h -= (this._current.y - y));
                } else {
                    this._size.h += (y - this._current.y);
                }
                break;
            case DIRECTIONS.move:
                if (y < this._current.y) {
                    this._size.t -= (this._current.y - y);
                } else {
                    this._size.t += (y - this._current.y);
                }
                if (x < this._current.x) {
                    this._size.l -= (this._current.x - x);
                } else {
                    this._size.l += (x - this._current.x);
                }
                break;
        }
        this._current.x = x;
        this._current.y = y;
    }

    private _globalMouseUp(e: MouseEvent){
        if (~[DIRECTIONS.bottom, DIRECTIONS.left, DIRECTIONS.right, DIRECTIONS.top, DIRECTIONS.corner].indexOf(this._direction as symbol)){
            this.EResized.emit();
        }
        this._direction = DIRECTIONS.nothing;
    }

    private _onElementMouseDown(direction: symbol, e: MouseEvent) {
        if (!this.resizable && ~[DIRECTIONS.bottom, DIRECTIONS.left, DIRECTIONS.right, DIRECTIONS.top, DIRECTIONS.corner].indexOf(direction)){
            return;
        }
        if (!this.movable && direction === DIRECTIONS.move){
            return;
        }
        if (this.state === EState.maximaxed || this.state === EState.minimixed){
            return;
        }
        this._onFocus();
        this._direction = direction;
        this._current.x = e.pageX;
        this._current.y = e.pageY;
        e.stopPropagation();
        return false;
    }

    private _addDefaultButtons(){
        if (this.closable) {
            this.buttons.unshift({
                icon: 'fa fa-remove',
                caption: 'Close',
                handler: this._close.bind(this)
            });
        }
        if (this.maximizable) {
            this.buttons.unshift({
                icon: 'fa fa-window-maximize',
                caption: 'Maximize',
                handler: this._maximaze.bind(this)
            });
        }
        if (this.minimize) {
            this.buttons.unshift({
                icon: 'fa fa-window-minimize',
                caption: 'Minimize',
                handler: this._minimize.bind(this)
            });
        }
    }

    private _maximaze(){
        this.state = EState.maximaxed;
        this.buttons = this.buttons.map((button: IButton) => {
            if (button.caption === 'Maximize') {
                button.caption = 'Restore';
                button.icon = 'fa fa-window-restore';
                button.handler = this._restore.bind(this);
            }
            return button;
        });
        ServiceModalWindows.update({
            id: this.id,
            state: this.state
        });
        this._forceUpdate();
    }

    private _restore(){
        this.state = EState.normal;
        this.buttons = this.buttons.map((button: IButton) => {
            if (button.caption === 'Restore') {
                button.caption = 'Maximize';
                button.icon = 'fa fa-window-maximize';
                button.handler = this._maximaze.bind(this);
            }
            return button;
        });
        ServiceModalWindows.update({
            id: this.id,
            state: this.state
        });
        this._forceUpdate();
    }

    private _minimize(){
        const lastState = this.state;
        this.state = EState.minimixed;
        ServiceModalWindows.update({
            id: this.id,
            state: this.state,
            lastState: lastState
        });
        ServiceModalWindows.unsetFocus(this.id);
        this._forceUpdate();
    }

    private _close(){
        this.close();
    }

    private _forceUpdate(){
        this.changeDetectorRef.detectChanges();
    }

    private _getStyles(){
        switch(this.state){
            case EState.maximaxed:
                return {
                    top: '0px',
                    left: '0px',
                    width: '100%',
                    height: '100%'
                }
            case EState.minimixed:
                return {
                    top: '100%',
                    left: '0px',
                    width: '0px',
                    height: '0px'
                };
            default:
                return {
                    top: `${this._size.t}px`,
                    left: `${this._size.l}px`,
                    width: `${this._size.w}px`,
                    height: `${this._size.h}px`
                };
        }
    }

    private _onRestore(modalwindow: IModalWindow){
        if (this.id !== modalwindow.id) {
            return;
        }
        if (this.state === EState.minimixed && modalwindow.state !== EState.minimixed){
            this.state = modalwindow.state;
            ServiceModalWindows.setFocus(this.id);
        }
        if (this.focused !== modalwindow.focused){
            this.focused = modalwindow.focused;
        }
    }

    private _onFocus(){
        this.focused = true;
        ServiceModalWindows.setFocus(this.id);
    }

}
