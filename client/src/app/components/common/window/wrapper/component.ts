import { Component, Input, ViewContainerRef, OnInit, ComponentRef, OnDestroy, ChangeDetectorRef, EventEmitter } from '@angular/core';

@Component({
    selector        : 'modal-window-wrapper',
    template        : '',
})

export class ModalWindowWrapper implements OnInit, OnDestroy{
    @Input() component: any;
    @Input() EResized: EventEmitter<any>;

    private ref: ComponentRef<any>;

    public update(params : Object){
        Object.keys(params).forEach((key)=>{
            this.ref.instance[key] = params[key];
        });
        this.changeDetectorRef.detectChanges();
    }

    constructor(private container           : ViewContainerRef,
                private changeDetectorRef   : ChangeDetectorRef
    ){ }

    ngOnInit(){
        this.ref = this.container.createComponent(this.component.factory);
        if (this.component.params !== void 0){
            Object.keys(this.component.params).forEach((key)=>{
                this.ref.instance[key] = this.component.params[key];
            });
            this.ref.instance.EHolderResized = this.EResized;
        }
        typeof this.component.callback === 'function' && this.component.callback(this.ref.instance);
        this.component.forceUpdate = this.update.bind(this);
    }

    ngOnDestroy(){
        this.ref.destroy();
    }
}