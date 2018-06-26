import { NgModule                       } from '@angular/core';
import { CommonModule                   } from '@angular/common';
import { FormsModule                    } from '@angular/forms';
import { ButtonFlatText                 } from './buttons/flat-text/component';

import { ModalWindowModule              } from './window/module';

@NgModule({
    entryComponents : [ ButtonFlatText ],
    imports         : [ CommonModule, FormsModule  ],
    declarations    : [ ButtonFlatText ],
    exports         : [ ModalWindowModule, ButtonFlatText ]
})


export class Components {
    constructor(){
    }
}