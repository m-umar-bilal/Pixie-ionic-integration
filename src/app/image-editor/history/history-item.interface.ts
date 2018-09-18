import {SerializedCanvas} from './serialized-canvas';

export interface HistoryItem extends SerializedCanvas {
    name: string,
    index: number,
    icon: string,
    zoom: number,
    activeObjectId?: string,
}