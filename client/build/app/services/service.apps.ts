import { EventEmitter } from "@angular/core";
import { IApps } from '../interfaces/interface.apps';
import { GUID } from '../tools/tools.guid';

class ServiceApps {

    public EAdded: EventEmitter<IApps> = new EventEmitter<IApps>();
    public ERemoved: EventEmitter<string> = new EventEmitter<string>();
    public EUpdated: EventEmitter<IApps> = new EventEmitter<IApps>();

    private _apps: Array<IApps> = [];
    
    constructor(){
        
    }

    private _setDefaults(app: IApps): IApps{
        app.id = typeof app.id === 'string' ? app.id : GUID.generate();
        return app;
    }

    public get(){
        return this._apps;
    }

    public add(app: IApps){
        this._apps.push(this._setDefaults(app));
        this.EAdded.emit(app);
    }

    public remove(id: string){
        this._apps = this._apps.filter((app: IApps) => {
            return app.id !== id;
        });
        this.ERemoved.emit(id);
    }

    public update(app: IApps | any){
        let _updated: any = null;
        this._apps = this._apps.map((_app: IApps) => {
            if (_app.id === app.id) {
                Object.keys(app).forEach((key: string)=>{
                    if (app[key] !== _app[key] && _app[key] !== void 0){
                        _app[key] = app[key];
                        if (_updated === null){
                            _updated = _app;
                        }
                    }
                });
            }
            return _app;
        });
        _updated !== null && this.EUpdated.emit(_updated);
        return _updated !== null;
    }

}

export default (new ServiceApps());