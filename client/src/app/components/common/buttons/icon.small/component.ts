import {Component, Input, Output} from '@angular/core';

@Component({
    selector    : 'button-small-icon',
    templateUrl : './template.html',
})

export class ButtonIconSmall {
    @Input() caption        : string        = '';
    @Input() icon           : string        = '';
    @Input() handler        : Function      = function() {};
    @Input() enabled        : boolean       = true;
    @Input() focused        : boolean       = false;

    @Output() disable(){
        return this.enabled = false;
    }

    @Output() enable(){
        return this.enabled = true;
    }

    constructor() {
    }

}
