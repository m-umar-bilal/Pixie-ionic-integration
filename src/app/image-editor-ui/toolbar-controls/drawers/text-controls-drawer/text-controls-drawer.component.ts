import {Component, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {ActiveObjectService} from '../../../../image-editor/canvas/active-object.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {BaseDrawer} from '../base-drawer';

@Component({
    selector: 'text-controls-drawer',
    templateUrl: './text-controls-drawer.component.html',
    styleUrls: ['./text-controls-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class TextControlsDrawerComponent extends BaseDrawer {

    /**
     * Name of this drawer.
     */
    public name = 'textOptions';

    /**
     * TextControlsDrawerComponent Constructor.
     */
    constructor(
        public activeObject: ActiveObjectService,
        protected history: HistoryToolService,
        public editorControls: EditorControlsService,
    ) {
        super(history, editorControls);
    }

    public toggleValue(name: string) {
        this.dirty = true;
        const control = this.activeObject.getControl(name);

        if (control.value) {
            control.setValue(false);
        } else {
            control.setValue(true);
        }
    }

    public toggleItalicStyle() {
        this.dirty = true;
        const control = this.activeObject.getControl('text.fontStyle');

        if (control.value === 'italic') {
            control.setValue('normal');
        } else {
            control.setValue('italic');
        }
    }
}
