import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {BaseDrawer} from '../base-drawer';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {EditorControlsService} from '../../editor-controls.service';
import {FormControl} from '@angular/forms';
import {CanvasService} from '../../../../image-editor/canvas/canvas.service';

@Component({
    selector: 'canvas-background-drawer',
    templateUrl: './canvas-background-drawer.component.html',
    styleUrls: ['./canvas-background-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class CanvasBackgroundDrawerComponent extends BaseDrawer implements OnInit {

    /**
     * Name of this drawer.
     */
    public name = 'background';

    public formControl = new FormControl();

    /**
     * ShadowControlsDrawer Constructor.
     */
    constructor(
        protected history: HistoryToolService,
        public controls: EditorControlsService,
        private canvas: CanvasService,
    ) {
        super(history, controls);
    }

    ngOnInit() {
        this.formControl.valueChanges.subscribe(color => {
            if ( ! color) return;
            this.dirty = true;
            this.canvas.fabric().setBackgroundColor(color);
            this.canvas.render();
        });
    }
}
