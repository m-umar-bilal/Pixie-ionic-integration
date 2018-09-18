import {fabric} from 'fabric';
import {Injectable} from '@angular/core';
import {ActiveObjectService} from '../../canvas/active-object.service';
import {CanvasService} from '../../canvas/canvas.service';
import {Rect} from 'fabric/fabric-impl';
import {ExportToolService} from '../export/export-tool.service';
import {CanvasStateService} from '../../canvas/canvas-state.service';

@Injectable()
export class RoundToolService {

    private previewRect: Rect;

    /**
     * FillToolService Constructor.
     */
    constructor(
        private activeObject: ActiveObjectService,
        private canvas: CanvasService,
        private state: CanvasStateService,
        private saveTool: ExportToolService,
    ) {}

    public apply(radius: number) {
        this.updatePreview(radius);
        this.state.fabric.remove(this.previewRect);

        this.state.fabric.clipTo = ctx => {
            const retina = this.state.fabric.getRetinaScaling();

            this.previewRect.set({
                width: this.previewRect.width / retina,
                height: this.previewRect.height / retina,
                rx: this.previewRect.rx / retina,
                ry: this.previewRect.ry / retina,
                stroke: null,
            });

            this.previewRect.render(ctx);
            this.state.fabric.clipTo = null;
        };

        const data = this.saveTool.getDataUrl();
        this.state.fabric.clear();
        this.hidePreview();

        return this.canvas.loadMainImage(data);
    }

    public getPreviewRadius(): number {
        return this.previewRect.rx;
    }

    public updatePreview(radius: number) {
        this.previewRect.set({
            rx: radius, ry: radius
        });

        this.canvas.render();
    };

    public showPreview() {
        this.previewRect = new fabric.Rect({
            width: this.state.original.width,
            height: this.state.original.height,
            rx: 50,
            ry: 50,
            objectCaching: false,
            fill: 'transparent',
            name: 'round.rect',
            stroke: 'rgba(255,255,255,0.8)',
            strokeWidth: 3,
            strokeDashArray: [4,4],
            selectable: false,
            evented: false,
        });

        this.state.fabric.add(this.previewRect);
        this.previewRect.moveTo(99);
        this.previewRect.viewportCenter();
        this.canvas.render();
    }

    public hidePreview() {
        if ( ! this.previewRect) return;
        this.state.fabric.remove(this.previewRect);
        this.canvas.render();
        this.previewRect = null;
    }
}