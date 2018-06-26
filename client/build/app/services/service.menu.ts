import { EventEmitter } from "@angular/core";
import { IMenuItem } from '../interfaces/interface.menu';
import { GUID } from '../tools/tools.guid';

class ServiceMenu {

    public EAdded: EventEmitter<IMenuItem> = new EventEmitter<IMenuItem>();
    public ERemoved: EventEmitter<string> = new EventEmitter<string>();
    public EUpdated: EventEmitter<IMenuItem> = new EventEmitter<IMenuItem>();

    private _items: Array<IMenuItem> = [];
    
    constructor(){
        
    }

    private _setDefaults(item: IMenuItem): IMenuItem{
        item.id = typeof item.id === 'string' ? item.id : GUID.generate();
        item.items = item.items instanceof Array ? item.items : [];
        if (item.items.length > 0) {
            item.items = item.items.map((item: IMenuItem) => {
                return this._setDefaults(item);
            });
        }
        return item;
    }

    private _getParrent(id: string, items?: Array<IMenuItem>): Array<IMenuItem> | null{
        let parent: any = null;
        if (id === '') {
            return this._items;
        }
        items = !(items instanceof Array) ? this._items : items;
        items.forEach((item: IMenuItem) => {
            if (parent !== null) {
                return;
            }
            if (item.id === id) {
                parent = item.items;
            } else if (item.items.length > 0) {
                parent = this._getParrent(id, item.items);
            }
        });
        return parent;
    }

    public get(){
        return this._items;
    }

    public add(items: IMenuItem | Array<IMenuItem>, parent: string = ''){
        const target = this._getParrent(parent);
        if (target === null){
            return;
        }
        if (!(items instanceof Array)){
            items = [items];
        }
        items.forEach((item: IMenuItem) => {
            target.push(this._setDefaults(item));
            this.EAdded.emit(item);
        });
    }

    public remove(id: string){
        this._items = this._items.filter((item: IMenuItem) => {
            return item.id !== id;
        });
        this.ERemoved.emit(id);
    }

    public update(item: IMenuItem | any){
        let _updated: any = null;
        this._items = this._items.map((_item: IMenuItem) => {
            if (_item.id === item.id) {
                Object.keys(item).forEach((key: string)=>{
                    if (item[key] !== _item[key] && _item[key] !== void 0){
                        _item[key] = item[key];
                        if (_updated === null){
                            _updated = _item;
                        }
                    }
                });
            }
            return _item;
        });
        _updated !== null && this.EUpdated.emit(_updated);
        return _updated !== null;
    }

}

export default (new ServiceMenu());