import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Settings} from 'vebto-client/core/config/settings.service';
import {BaseDrawer} from '../base-drawer';
import {EditorControlsService} from '../../editor-controls.service';
import {DrawToolService} from '../../../../image-editor/tools/draw/draw-tool.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {CanvasService} from '../../../../image-editor/canvas/canvas.service';

@Component({
    selector: 'draw-drawer',
    templateUrl: './draw-drawer.component.html',
    styleUrls: ['./draw-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class DrawDrawerComponent extends BaseDrawer implements OnInit, OnDestroy {

    public readonly brushSizes: number[];
    public readonly brushTypes: string[];

    /**
     * Name of this drawer.
     */
    public name = 'draw';

    /**
     * DrawDrawerComponent Constructor.
     */
    constructor(
        public drawTool: DrawToolService,
        private settings: Settings,
        protected history: HistoryToolService,
        public editorControls: EditorControlsService,
        private canvas: CanvasService,
        private config: Settings,
    ) {
        super(history, editorControls);
        this.brushSizes = this.config.get('pixie.tools.draw.brushSizes');
        this.brushTypes = this.config.get('pixie.tools.draw.brushTypes');
    }

    ngOnInit() {
        this.drawTool.enable();
        this.canvas.fabric().on('object:added', this.maybeMarkAsDirty.bind(this));
    }

    ngOnDestroy() {
        this.drawTool.disable();
        this.canvas.fabric().off('object:added', this.maybeMarkAsDirty.bind(this));
    }

    /**
     * Get absolute url for brush preview image.
     */
    public getBrushPreviewUrl(type: string): string {
        const name = type.replace('Brush', '').toLowerCase();
        return this.settings.getAssetUrl('images/brushes/'+name+'-square.png');
    }

    /**
     * Set brush type and close controls subdrawer.
     */
    public setBrushType(type: string) {
        this.drawTool.setBrushType(type);
        this.editorControls.closePanel('draw.brushTypes');
    }

    private maybeMarkAsDirty() {
        const lastDrawing = this.canvas.fabric().getObjects()
            .find(obj => obj.name === 'drawing');

        if (lastDrawing) {
            this.dirty = true;
            lastDrawing.set({selectable: false, evented: false});
            this.canvas.render();
        }
    }

}
