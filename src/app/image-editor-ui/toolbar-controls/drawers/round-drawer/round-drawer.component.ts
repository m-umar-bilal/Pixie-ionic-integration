import {Component, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {BaseDrawer} from '../base-drawer';
import {ActiveObjectService} from '../../../../image-editor/canvas/active-object.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {RoundToolService} from '../../../../image-editor/tools/round/round-tool.service';

@Component({
    selector: 'round-drawer',
    templateUrl: './round-drawer.component.html',
    styleUrls: ['./round-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class RoundDrawerComponent extends BaseDrawer implements OnDestroy, OnInit {

    /**
     * Name of this drawer.
     */
    public name = 'corners';

    public radius: number = 50;

    /**
     * ShadowControlsDrawer Constructor.
     */
    constructor(
        public activeObject: ActiveObjectService,
        protected history: HistoryToolService,
        public controls: EditorControlsService,
        public roundTool: RoundToolService,
    ) {
        super(history, controls);
    }

    ngOnInit() {
        this.roundTool.showPreview();
        this.dirty = true;
    }

    ngOnDestroy() {
        this.roundTool.hidePreview();
    }

    public apply() {
        this.roundTool.apply(this.roundTool.getPreviewRadius()).then(() => {
            super.apply();
        });
    }
}
