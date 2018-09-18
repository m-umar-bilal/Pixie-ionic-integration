import {Injectable} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';
import {MergeToolService} from '../merge/merge-tool.service';

@Injectable()
export class CropToolService {

    constructor(private canvas: CanvasService, private mergeTool: MergeToolService) {}

    /**
     * Crop canvas to specified dimensions.
     */
    public apply(box: {left: number, top: number, width: number, height: number}) {
        this.mergeTool.apply().then(() => {
            this.canvas.resize(box.width, box.height);

            const img = this.canvas.getMainImage();
            img.cropX = box.left;
            img.cropY = box.top;
            img.width = box.width;
            img.height = box.height;

            this.canvas.render();
        });

    }
}
