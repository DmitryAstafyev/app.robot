import { NgModule                       } from '@angular/core';
import { CommonModule                   } from '@angular/common';
import { FormsModule                    } from '@angular/forms';
import { AppsClock                      } from './trey/clock/component';
import { AppsJudgmentDay                } from './trey/judgmentday/component';
import { AppsRobotLogger                } from './desktop/robot.logger/component';
import { AppsRobotQRScanner             } from './desktop/robot.qr.scanner/component';


@NgModule({
    entryComponents : [ AppsClock, AppsRobotLogger, AppsJudgmentDay, AppsRobotQRScanner ],
    imports         : [ CommonModule, FormsModule  ],
    declarations    : [ AppsClock, AppsRobotLogger, AppsJudgmentDay, AppsRobotQRScanner ],
    exports         : [ AppsClock, AppsRobotLogger, AppsJudgmentDay, AppsRobotQRScanner ]
})


export class Components {
    constructor(){
    }
}