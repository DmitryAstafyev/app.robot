import { EventEmitter } from "@angular/core";
import { IModalWindow, EState } from '../interfaces/interface.modalwindow';
import { GUID } from '../tools/tools.guid';
import { ButtonFlatText } from '../components/common/buttons/flat-text/component';

class ServiceModalWindows {

    public EAdded: EventEmitter<IModalWindow> = new EventEmitter<IModalWindow>();
    public ERemoved: EventEmitter<string> = new EventEmitter<string>();
    public EUpdated: EventEmitter<IModalWindow> = new EventEmitter<IModalWindow>();

    private _modalwindows: Array<IModalWindow> = [];
    
    constructor(){
        
    }

    private _setDefaults(modalwindow: IModalWindow): IModalWindow{
        modalwindow.buttons = modalwindow.buttons instanceof Array ? modalwindow.buttons : [];
        modalwindow.closable = typeof modalwindow.closable === 'boolean' ? modalwindow.closable : true;
        modalwindow.resizable = typeof modalwindow.resizable === 'boolean' ? modalwindow.resizable : true;
        modalwindow.maximizable = typeof modalwindow.resizable === 'boolean' ? modalwindow.resizable : true;
        modalwindow.minimizibal = typeof modalwindow.resizable === 'boolean' ? modalwindow.resizable : true;
        modalwindow.movable = typeof modalwindow.movable === 'boolean' ? modalwindow.movable : true;
        modalwindow.state = typeof modalwindow.state === 'string' ? modalwindow.state : EState.normal;
        modalwindow.lastState = typeof modalwindow.lastState === 'string' ? modalwindow.lastState : EState.normal;
        modalwindow.focused = typeof modalwindow.focused === 'boolean' ? modalwindow.focused : true;
        modalwindow.id = typeof modalwindow.id === 'string' ? modalwindow.id : GUID.generate();
        return modalwindow;
    }

    public get(){
        return this._modalwindows;
    }

    public add(modalwindow: IModalWindow){
        this._modalwindows.push(this._setDefaults(modalwindow));
        this.EAdded.emit(modalwindow);
    }

    public remove(id: string){
        this._modalwindows = this._modalwindows.filter((modalwindow: IModalWindow) => {
            return modalwindow.id !== id;
        });
        this.ERemoved.emit(id);
    }

    public update(modalwindow: IModalWindow | any){
        let _updated: any = null;
        this._modalwindows = this._modalwindows.map((_window: IModalWindow) => {
            if (_window.id === modalwindow.id) {
                Object.keys(modalwindow).forEach((key: string)=>{
                    if (modalwindow[key] !== _window[key] && _window[key] !== void 0){
                        _window[key] = modalwindow[key];
                        if (_updated === null){
                            _updated = _window;
                        }
                    }
                });
            }
            return _window;
        });
        _updated !== null && this.EUpdated.emit(_updated);
        return _updated !== null;
    }

    public setFocus(id: string){
        this._modalwindows = this._modalwindows.map((_window: IModalWindow) => {
            const focus = _window.focused;
            if (id === _window.id){
                _window.focused = true;
            } else {
                _window.focused = false;
            }
            if (_window.focused !== focus){
                this.EUpdated.emit(_window);
            }
            return _window;
        });
    }

    public unsetFocus(id: string){
        let changed = false;
        this._modalwindows = this._modalwindows.map((_window: IModalWindow) => {
            const focus = _window.focused;
            if (id === _window.id){
                _window.focused = false;
            }
            if (_window.focused !== focus){
                this.EUpdated.emit(_window);
            }
            return _window;
        });
        this._modalwindows = this._modalwindows.map((_window: IModalWindow) => {
            if (changed){
                return _window;
            }
            if (id !== _window.id && !_window.focused){
                _window.focused = true;
                changed = true;
                this.EUpdated.emit(_window);
            }
            return _window;
        });
    }


}

export default (new ServiceModalWindows());