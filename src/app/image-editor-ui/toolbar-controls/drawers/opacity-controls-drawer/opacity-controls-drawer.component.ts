import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {BaseDrawer} from '../base-drawer';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {EditorControlsService} from '../../editor-controls.service';
import {ActiveObjectService} from '../../../../image-editor/canvas/active-object.service';

@Component({
    selector: 'opacity-controls-drawer',
    templateUrl: './opacity-controls-drawer.component.html',
    styleUrls: ['./opacity-controls-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class OpacityControlsDrawer extends BaseDrawer {
    @ViewChild('colorPickerButton', {read: ElementRef}) colorPickerButton: ElementRef;

    /**
     * Name of this drawer.
     */
    public name = 'opacity';

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

    public setValue(name: string, value: string|number) {
        this.dirty = true;
        this.activeObject.setValue(name, value);
    }
}
