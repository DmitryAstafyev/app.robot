import { NgModule                       } from '@angular/core';
import { CommonModule                   } from '@angular/common';
import { FormsModule                    } from '@angular/forms';
import { EffectFog                      } from './fog/component';

@NgModule({
    entryComponents : [ EffectFog ],
    imports         : [ CommonModule, FormsModule  ],
    declarations    : [ EffectFog ],
    exports         : [ EffectFog ]
})


export class Components {
    constructor(){
    }
}