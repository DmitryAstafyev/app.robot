import { NgModule           } from '@angular/core';
import { CommonModule       } from '@angular/common';

import { ModalWindow        } from './component';
import { ModalWindowWrapper } from './wrapper/component';
import { ButtonIconSmall    } from '../buttons/icon.small/component';

@NgModule({
    entryComponents : [ ],
    imports         : [ CommonModule ],
    declarations    : [ ModalWindow, ModalWindowWrapper, ButtonIconSmall ],
    exports         : [ ModalWindow, ModalWindowWrapper, ButtonIconSmall ]
})

export class ModalWindowModule {
    constructor(){
    }
}