import {Component, Input } from '@angular/core';
import { IMenuItem } from '../../../../interfaces/interface.menu';

@Component({
    selector    : 'bar-top-menu-item',
    templateUrl : './template.html',
})

export class BarTopMenuItem {

    @Input() caption        : string            = '';
    @Input() icon           : string            = '';
    @Input() handler        : Function          = function() {};
    @Input() items          : Array<IMenuItem>  = [];

    constructor() {
    }

    private _onMenuItemClick(){
        typeof this.handler === 'function' && this.handler();
    }

}
