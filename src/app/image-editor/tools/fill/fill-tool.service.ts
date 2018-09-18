import {fabric} from 'fabric';
import {Injectable} from '@angular/core';
import {ActiveObjectService} from '../../canvas/active-object.service';
import {gradientPresets} from '../gradient-presets';
import {CanvasService} from '../../canvas/canvas.service';

@Injectable()
export class FillToolService {

    /**
     * FillToolService Constructor.
     */
    constructor(
        private activeObject: ActiveObjectService,
        private canvas: CanvasService
    ) {}

    public withPattern(url: string) {
        fabric.util.loadImage(url, img => {
            const pattern = new fabric.Pattern({
                source: img,
                repeat: 'repeat'
            });

            this.activeObject.setValue('fill', pattern);
        });
    }

    public withGradient(index, type: 'stroke'|'fill' = 'fill') {
        const activeObject =  this.activeObject.get();
        if ( ! activeObject) return;

        activeObject.setGradient(type, gradientPresets[index]);
        this.canvas.render();
    }
}