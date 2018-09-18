import {Component, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {Settings} from 'vebto-client/core/config/settings.service';
import {BaseDrawer} from '../base-drawer';
import {BasicShape} from '../../../../image-editor/tools/shapes/default-shapes';
import {ShapesToolService} from '../../../../image-editor/tools/shapes/shapes-tool.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';

@Component({
    selector: 'shapes-drawer',
    templateUrl: './shapes-drawer.component.html',
    styleUrls: ['./shapes-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class ShapesDrawerComponent extends BaseDrawer {

    /**
     * Name of this drawer.
     */
    public name = 'shapes';

    public shapes: BasicShape[];

    /**
     * ShapesDrawerComponent Constructor.
     */
    constructor(
        public shapesTool: ShapesToolService,
        protected history: HistoryToolService,
        public editorControls: EditorControlsService,
        private config: Settings,
    ) {
        super(history, editorControls);
        this.shapes = this.config.get('pixie.tools.shapes.items');
    }

    /**
     * Add specified shape to canvas.
     */
    public addShape(shape: BasicShape) {
        this.shapesTool.addBasicShape(shape);
        this.dirty = true;
    }

    public close() {
        this.editorControls.closeAllPanels();
        super.close();
    }
}
