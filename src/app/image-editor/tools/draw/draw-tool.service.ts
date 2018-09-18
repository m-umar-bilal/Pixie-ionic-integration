import {Injectable} from '@angular/core';
import {CanvasService} from '../../canvas/canvas.service';
import {fabric} from 'fabric';
import {VLineBrush} from './brushes/v-line-brush';
import {HLineBrush} from './brushes/h-line-brush';
import {DiamondBrush} from './brushes/diamond-brush';
import {SquareBrush} from './brushes/square-brush';
import {IEvent} from 'fabric/fabric-impl';
import {CanvasStateService} from '../../canvas/canvas-state.service';
import {BrushSizes} from './draw-defaults';

@Injectable()
export class DrawToolService {

    private enabled: boolean =  false;

    private customBrushes = {
        VLineBrush: VLineBrush(this.canvasState.fabric),
        HLineBrush: HLineBrush(this.canvasState.fabric),
        //DiamondBrush: DiamondBrush(this.canvasState.fabric),
        SquareBrush: SquareBrush(this.canvasState.fabric),
    };

    public currentBrush = {
        type: 'PencilBrush',
        color: '#000',
        width: BrushSizes[1],
    };

    /**
     * DrawToolService Constructor.
     */
    constructor(private canvasState: CanvasStateService) {}

    /**
     * Enable drawing mode on canvas.
     */
    public enable() {
        this.canvasState.fabric.isDrawingMode = true;
        this.setBrushType(this.currentBrush.type);
        this.enabled = true;
        this.canvasState.fabric.on('object:added', this.onDrawingAdded);
    }

    /**
     * Disable drawing mode on canvas.
     */
    public disable() {
        this.canvasState.fabric.isDrawingMode = false;
        this.enabled = false;
        this.canvasState.fabric.off('object:added', this.onDrawingAdded)
    }

    /**
     * Get type of current drawing brush.
     */
    public getBrushType(): string {
        return this.currentBrush.type;
    }

    /**
     * Change type of drawing brush.
     */
    public setBrushType(type: string) {
        this.currentBrush.type = type;
        const brush = fabric[type] ? new fabric[type](this.canvasState.fabric) : this.customBrushes[type];
        this.canvasState.fabric.freeDrawingBrush = brush;
        this.applyBrushStyles();
    }

    /**
     * Apply current brush styles to fabric.js FreeDrawingBrush instance.
     */
    private applyBrushStyles() {
        Object.keys(this.currentBrush)
            .forEach(key => {
                this.canvasState.fabric.freeDrawingBrush[key] = this.currentBrush[key];
            });
    }

    /**
     * Change size of drawing brush.
     */
    public setBrushSize(size: number) {
        this.currentBrush.width = size;
        this.applyBrushStyles();
    }

    /**
     * Get size of drawing brush.
     */
    public getBrushSize(): number {
        return this.currentBrush.width;
    }

    /**
     * Change color of drawing brush.
     */
    public setBrushColor(color: string) {
        this.currentBrush.color = color;
        this.applyBrushStyles();
    }

    /**
     * Get color of drawing brush.
     */
    public getBrushColor(): string {
        return this.currentBrush.color;
    }

    /**
     * Added a new to drawing path added by canvas.
     */
    private onDrawingAdded(e: IEvent) {
        if (e.target.type !== 'path') return;
        e.target.name = 'drawing';
    }
}
