import { IButton } from './interface.modalwindow.button';

interface IComponent {
    factory: any;
    params: any;
}

export enum EState {
    minimixed = 'minimized',
    maximaxed = 'maximazed',
    normal = 'normal'
};

export interface IModalWindow {
    caption: string;
    buttons: Array<IButton>;
    resizable?: boolean;
    closable?: boolean;
    maximizable?: boolean;
    minimizibal?: boolean;
    movable?: boolean;
    state?: EState;
    lastState?: EState;
    id?: string;
    focused?: boolean;
    component: IComponent;
};