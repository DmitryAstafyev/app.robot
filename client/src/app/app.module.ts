import { NgModule                           } from '@angular/core';
import { BrowserModule                      } from '@angular/platform-browser';

import { Layout                             } from './components/layout/holder/component';
import { LayoutModule                       } from './components/layout/module';
import { Components as ComponentsCommmon    } from './components/common/components';

import ServiceApps from './services/service.apps';
import ServiceMenu from './services/service.menu';
import ServiceModalWindows from './services/service.modalwindows';

import { AppsClock                  } from "./components/apps/trey/clock/component";
import { AppsJudgmentDay            } from "./components/apps/trey/judgmentday/component";
import { AppsRobotLogger            } from './components/apps/desktop/robot.logger/component';
import { AppsRobotQRScanner         } from './components/apps/desktop/robot.qr.scanner/component';

@NgModule({
    imports:      [ BrowserModule, ComponentsCommmon, LayoutModule ],
    declarations: [ Layout ],
    bootstrap:    [ Layout ]
})

export class AppModule {

    constructor(){
        ServiceApps.add({
            component: {
                factory: AppsClock,
                params: {}
            }
        });
        ServiceApps.add({
            component: {
                factory: AppsJudgmentDay,
                params: {}
            }
        });
        ServiceMenu.add([
            {
                caption: 'Robot Logger',
                icon: 'fa fa-heartbeat',
                handler: ()=>{ 
                    ServiceModalWindows.add({
                        caption: 'Robot Logger',
                        component: {
                            factory: AppsRobotLogger,
                            params: {}
                        },
                        buttons: []
                    });
                }
            },
            {
                caption: 'Robot QR Scanner',
                icon: 'fa fa-map-marker',
                handler: ()=>{ 
                    ServiceModalWindows.add({
                        caption: 'Robot QR Scanner',
                        component: {
                            factory: AppsRobotQRScanner,
                            params: {}
                        },
                        buttons: []
                    });
                }
            }
        ]);
    }
}
