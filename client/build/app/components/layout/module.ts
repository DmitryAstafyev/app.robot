import { NgModule                               } from '@angular/core';
import { CommonModule                           } from '@angular/common';
import { Notifications                          } from './notifications/component';
import { BarTop                                 } from './bar.top/component';
import { BarTopMenuItem                         } from './bar.top/menu.item/component';

import { BarBottomModule                        } from './bar.bottom/module';
import { Windows                                } from './windows/component';
import { BarBottom                              } from './bar.bottom/component';

import { Components as ComponentsCommmon        } from '../../components/common/components';
import { Components as ComponentsApps           } from '../../components/apps/components';
import { Components as ComponentsEffects        } from '../../components/effects/components';

@NgModule({
    entryComponents : [ ],
    imports         : [ CommonModule, ComponentsCommmon, ComponentsApps, ComponentsEffects, BarBottomModule ],
    declarations    : [ Notifications, BarTop, BarTopMenuItem, BarBottom, Windows ],
    exports         : [ Notifications, BarTop, BarTopMenuItem, BarBottom, Windows ]
})

export class LayoutModule {
    constructor(){
    }
}