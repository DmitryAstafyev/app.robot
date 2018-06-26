import { Component, OnDestroy } from '@angular/core';
import ServiceMenu from '../../../services/service.menu';
import { IMenuItem } from '../../../interfaces/interface.menu';

const EVENTS = {
  mousedown : 'mousedown'
};

@Component({
  selector: 'bar-top',
  templateUrl: './template.html',
})

export class BarTop implements OnDestroy {

    private _menuOpened: boolean = false;
    private _items: Array<IMenuItem> = ServiceMenu.get();

    constructor(){
      this._onGlobalMouseDown = this._onGlobalMouseDown.bind(this);
      this._bindCallerListeners();
    }

    ngOnDestroy(){
      this._unbindCallerListeners();
    }

    private _bindCallerListeners() {
        window.addEventListener(EVENTS.mousedown, this._onGlobalMouseDown);
    }

    private _unbindCallerListeners() {
        window.removeEventListener(EVENTS.mousedown, this._onGlobalMouseDown);
    }

    private _onGlobalMouseDown(){
      this._menuOpened = false;
    }

    private _onMenuOpen(){
      this._menuOpened = !this._menuOpened;
    }

    private _onMenuItemClick(item: IMenuItem){

    }
}
