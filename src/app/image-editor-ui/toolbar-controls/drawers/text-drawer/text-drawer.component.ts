import {Component, ElementRef, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {GoogleFontsPanelComponent} from '../../google-fonts-panel/google-fonts-panel.component';
import {OverlayPanel} from 'vebto-client/core/ui/overlay-panel/overlay-panel.service';
import {BaseDrawer} from '../base-drawer';
import {TextToolService} from '../../../../image-editor/tools/text/text-tool.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {ActiveObjectService} from '../../../../image-editor/canvas/active-object.service';

@Component({
    selector: 'text-drawer',
    templateUrl: './text-drawer.component.html',
    styleUrls: ['./text-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class TextDrawerComponent extends BaseDrawer {

    /**
     * Name of this drawer.
     */
    public name = 'text';

    /**
     * TextDrawerComponent Constructor.
     */
    constructor(
        public textTool: TextToolService,
        private overlayPanel: OverlayPanel,
        protected history: HistoryToolService,
        public controls: EditorControlsService,
        public activeObject: ActiveObjectService,
    ) {
        super(history, controls);
    }

    /**
     * Add new text object to canvas.
     */
    public addText() {
        this.dirty = true;
        this.textTool.add();
    }

    public openGoogleFontsPanel(origin: HTMLElement) {
        this.overlayPanel.open(GoogleFontsPanelComponent, {position: 'bottom', origin: new ElementRef(origin)})
            .valueChanged().subscribe(font => {
                this.textTool.setFont(font);
            });
    }
}
