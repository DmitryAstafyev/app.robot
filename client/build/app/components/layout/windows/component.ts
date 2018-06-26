import { Component, ComponentFactoryResolver, OnDestroy } from '@angular/core';
import ServiceModalWindows from '../../../services/service.modalwindows';
import { IModalWindow } from '../../../interfaces/interface.modalwindow';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'windows',
  templateUrl: './template.html',
})

export class Windows implements OnDestroy {

    private _windows: Array<IModalWindow> = [];
    private _eRemoved: Subscription;
    private _eAdded: Subscription;

    constructor(private componentFactoryResolver : ComponentFactoryResolver){
        this._windows = ServiceModalWindows.get().map((modalwindow: IModalWindow) => {
          modalwindow.component.factory = componentFactoryResolver.resolveComponentFactory(modalwindow.component.factory);
          return modalwindow;
        });
        this._onRemove = this._onRemove.bind(this);
        this._onAdd = this._onAdd.bind(this);
        this._eRemoved = ServiceModalWindows.ERemoved.subscribe(this._onRemove);
        this._eAdded = ServiceModalWindows.EAdded.subscribe(this._onAdd);
    }

    ngOnDestroy(){
      this._eRemoved.unsubscribe();
      this._eAdded.unsubscribe();
    }

    _onRemove(id: string){
      this._windows = this._windows.filter((_window: IModalWindow) => {
        return _window.id !== id;
      });
    }

    _onAdd(modalwindow: IModalWindow){
      modalwindow.component.factory = this.componentFactoryResolver.resolveComponentFactory(modalwindow.component.factory);
      this._windows.push(modalwindow);
    }

}
