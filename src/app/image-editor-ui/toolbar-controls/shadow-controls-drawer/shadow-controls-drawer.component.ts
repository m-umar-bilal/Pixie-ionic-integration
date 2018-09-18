import {Component, ElementRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColorpickerPanelComponent} from 'vebto-client/core/ui/color-picker/colorpicker-panel.component';
import {OverlayPanel} from 'vebto-client/core/ui/overlay-panel/overlay-panel.service';
import {EditorControlsService} from '../editor-controls.service';
import {ActiveObjectService} from '../../../image-editor/canvas/active-object.service';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {BaseDrawer} from '../drawers/base-drawer';

@Component({
    selector: 'shadow-controls-drawer',
    templateUrl: './shadow-controls-drawer.component.html',
    styleUrls: ['./shadow-controls-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class ShadowControlsDrawer extends BaseDrawer {
    @ViewChild('colorPickerButton', {read: ElementRef}) colorPickerButton: ElementRef;

    /**
     * Name of this drawer.
     */
    public name = 'shadow';

    /**
     * ShadowControlsDrawer Constructor.
     */
    constructor(
        private overlayPanel: OverlayPanel,
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

    /**
     * Open color picker and change shadow color.
     */
    public openColorPicker() {
        this.overlayPanel.open(ColorpickerPanelComponent, {position: 'bottom', origin: this.colorPickerButton})
            .valueChanged().subscribe(color => {
                this.setValue('shadow.color', color);
            });
    }
}
