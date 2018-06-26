import { Input, EventEmitter } from '@angular/core';
import { IMenuItem } from '../../interfaces/interface.modalwindow.menu';

export class ModalWindow {

    @Input() EHolderResized: EventEmitter<any>;

    applicationMenu: Array<IMenuItem> = [];

    public getApplicationMenu(): Array<IMenuItem>{
        return this.applicationMenu.map((item: IMenuItem) => { 
            return Object.assign({}, item);
        });
    }

}