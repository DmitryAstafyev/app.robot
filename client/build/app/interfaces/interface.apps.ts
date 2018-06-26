interface IComponent {
    factory: any;
    params: any;
}

export interface IApps {
    id?: string;
    component: IComponent;
};