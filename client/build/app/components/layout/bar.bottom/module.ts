import { NgModule           } from '@angular/core';
import { CommonModule       } from '@angular/common';

import { AppWrapper         } from './app.wrapper/component';

@NgModule({
    entryComponents : [ ],
    imports         : [ CommonModule ],
    declarations    : [ AppWrapper ],
    exports         : [ AppWrapper ]
})

export class BarBottomModule {
    constructor(){
    }
}