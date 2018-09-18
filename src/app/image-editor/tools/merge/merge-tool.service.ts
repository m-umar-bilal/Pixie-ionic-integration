import {Injectable} from '@angular/core';
import {ActiveObjectService} from '../../canvas/active-object.service';
import {CanvasService} from '../../canvas/canvas.service';
import {ExportToolService} from '../export/export-tool.service';
import {ObjectsService} from '../../objects/objects.service';
import {ActiveFrameService} from '../frame/active-frame.service';

@Injectable()
export class MergeToolService {

    /**
     * FillToolService Constructor.
     */
    constructor(
        private activeObject: ActiveObjectService,
        private canvas: CanvasService,
        private saveTool: ExportToolService,
        private objects: ObjectsService,
        private activeFrame: ActiveFrameService,
    ) {}

    /**
     * Check if there's anything to merge.
     */
    public canMerge(): boolean {
        return this.objects.getAll().length > 1;
    }

    public apply() {
        return new Promise(async resolve => {
            const data = this.saveTool.getDataUrl();
            this.clearCanvas();
            await this.canvas.loadMainImage(data);
            resolve();
        });
    }

    private clearCanvas() {
        this.activeFrame.remove();
        this.canvas.fabric().clear();
    }
}