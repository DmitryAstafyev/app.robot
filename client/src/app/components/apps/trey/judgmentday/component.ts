import {Component} from '@angular/core';

@Component({
    selector    : 'apps-judgmentday',
    templateUrl : './template.html',
})

export class AppsJudgmentDay {
    private _days: string = '00';
    private _hours: string = '00';
    private _minutes: string = '00';
    private _seconds: string = '00';
    private _day: number = 1577833200000;

    constructor() {
        this._tick();
    }

    private _fill(value: number){
        return value < 10 ? ('0' + value) : ('' + value);
    }

    private _tick(){
        const now = new Date();
        const diff = this._day - now.getTime(); 
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff - days * (1000 * 3600 * 24)) / (1000 * 3600));
        const minutes = Math.floor((diff - days * (1000 * 3600 * 24) - hours * (1000 * 3600)) / (1000 * 60));
        const seconds = Math.floor((diff - days * (1000 * 3600 * 24) - hours * (1000 * 3600) - minutes * (1000 * 60)) / 1000);
        this._days = this._fill(days);
        this._hours = this._fill(hours);
        this._minutes = this._fill(minutes);
        this._seconds = this._fill(seconds);
        setTimeout(this._tick.bind(this), 1000);
    }

}
