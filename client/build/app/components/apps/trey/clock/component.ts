import {Component} from '@angular/core';

@Component({
    selector    : 'apps-clock',
    templateUrl : './template.html',
})

export class AppsClock {

    private _hours: string = '00';
    private _minutes: string = '00';
    private _seconds: string = '00';

    constructor() {
        this._tick();
    }

    private _fill(value: number){
        return value < 10 ? ('0' + value) : ('' + value);
    }

    private _tick(){
        const now = new Date();
        this._hours = this._fill(now.getHours());
        this._minutes = this._fill(now.getMinutes());
        this._seconds = this._fill(now.getSeconds());
        setTimeout(this._tick.bind(this), 1000);
    }

}
