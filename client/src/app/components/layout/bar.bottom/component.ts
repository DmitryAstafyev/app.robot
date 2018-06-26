import { Component, OnDestroy, ComponentFactoryResolver } from '@angular/core';
import ServiceModalWindows from '../../../services/service.modalwindows';
import { IModalWindow, EState } from '../../../interfaces/interface.modalwindow';
import ServiceApps from '../../../services/service.apps';
import { IApps } from '../../../interfaces/interface.apps';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'bar-bottom',
  templateUrl: './template.html',
})

export class BarBottom implements OnDestroy {

    private _windows: Array<IModalWindow> = [];
    private _apps: Array<IApps> = [];

    private _eUpdated: Subscription;
    private _eAdded: Subscription;
    private _eRemoved: Subscription;

    constructor(private componentFactoryResolver : ComponentFactoryResolver){
      this._apps = ServiceApps.get().map((app: IApps) => {
        app.component.factory = componentFactoryResolver.resolveComponentFactory(app.component.factory);
        return app;
      });
      this._onModalWindowUpdate = this._onModalWindowUpdate.bind(this);
      this._eUpdated = ServiceModalWindows.EUpdated.subscribe(this._onModalWindowUpdate);
      this._eAdded = ServiceApps.EAdded.subscribe(this._onAppAdded);
      this._eRemoved = ServiceApps.ERemoved.subscribe(this._onAppRemoved);
    }

    ngOnDestroy(){
      this._eUpdated.unsubscribe();
      this._eAdded.unsubscribe();
      this._eRemoved.unsubscribe();
    }

    private _isModalWindowIn(id: string){
      let result = false;
      this._windows.forEach((_window: IModalWindow) => {
        if (_window.id === id) {
          result = true;
        }
      });
      return result;
    }

    private _onModalWindowUpdate(modalwindow: IModalWindow){
      if (modalwindow.state === EState.minimixed){
        !this._isModalWindowIn(modalwindow.id) && this._windows.push(modalwindow);
      } else {
        this._windows = this._windows.filter((_window: IModalWindow) => {
          return modalwindow.id !== _window.id;
        });
      }
    }

    private _onModalWindowClick(modalwindow: IModalWindow){
      ServiceModalWindows.update({
        id: modalwindow.id,
        state: modalwindow.lastState !== void 0 ? modalwindow.lastState : EState.normal
      });
    }

    private _onAppAdded(app: IApps){
      app.component.factory = this.componentFactoryResolver.resolveComponentFactory(app.component.factory);
      this._apps.push(app);
    }

    private _onAppRemoved(id: string){
      this._apps = this._apps.filter((app: IApps) => {
        return id !== app.id;
      });
    }

}
