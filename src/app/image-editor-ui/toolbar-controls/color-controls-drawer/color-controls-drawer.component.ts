import {Component, Input, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../editor-controls.service';
import {ActiveObjectService} from '../../../image-editor/canvas/active-object.service';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {BaseDrawer} from '../drawers/base-drawer';

@Component({
    selector: 'color-controls-drawer',
    templateUrl: './color-controls-drawer.component.html',
    styleUrls: ['./color-controls-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class ColorControlsDrawerComponent extends BaseDrawer {

    /**
     * Name of this drawer.
     */
    @Input() public name = 'color';

    /**
     * Active object control color widget should be bound to.
     */
    @Input() controlName: string;

    /**
     * ShadowControlsDrawer Constructor.
     */
    constructor(
        public activeObject: ActiveObjectService,
        protected history: HistoryToolService,
        public controls: EditorControlsService,
    ) {
        super(history, controls);
    }
}
