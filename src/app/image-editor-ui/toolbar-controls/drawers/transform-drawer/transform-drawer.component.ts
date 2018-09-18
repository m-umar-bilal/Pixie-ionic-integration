import {Component, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {MatSliderChange} from '@angular/material';
import {BaseDrawer} from '../base-drawer';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {TransformToolService} from '../../../../image-editor/tools/transform/transform-tool.service';

@Component({
    selector: 'transform-drawer',
    templateUrl: './transform-drawer.component.html',
    styleUrls: ['./transform-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class TransformDrawerComponent extends BaseDrawer {

    /**
     * Name of this drawer.
     */
    public name = 'transform';

    /**
     * TransformDrawerComponent Constructor.
     */
    constructor(
        protected history: HistoryToolService,
        private transformTool: TransformToolService,
        public controls: EditorControlsService,
    ) {
        super(history, controls);
    }

    /**
     * Rotate canvas 90 degrees left.
     */
    public rotateLeft() {
        this.transformTool.rotate('basic', -90);
        this.dirty = true;
    }

    /**
     * Rotate canvas 90 degrees right.
     */
    public rotateRight() {
        this.transformTool.rotate('basic', 90);
        this.dirty = true;
    }

    public skew(e: MatSliderChange) {
        this.transformTool.rotate('skew', e.value);
        this.dirty = true;
    }

    /**
     * Flip canvas horizontally.
     */
    public flipHorizontal() {
        this.transformTool.flip('horizontal');
        this.dirty = true;
    }

    /**
     * Flip canvas vertically.
     */
    public flipVertical() {
        this.transformTool.flip('vertical');
        this.dirty = true;
    }
}
