export interface IMenuItem {
    icon: string;
    caption: string;
    handler: Function;
    items?: Array<IMenuItem>;
    id?: string;
}