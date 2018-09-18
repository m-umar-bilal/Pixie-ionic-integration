import {AfterViewInit, Component, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../editor-controls.service';
import {BaseDrawer} from '../drawers/base-drawer';
import {ActiveObjectService} from '../../../image-editor/canvas/active-object.service';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {ActiveDrawerService} from '../drawers/active-drawer.service';
import {delay} from 'rxjs/operators';

@Component({
    selector: 'object-settings-drawer',
    templateUrl: './object-settings-drawer.component.html',
    styleUrls: ['./object-settings-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class ObjectSettingsDrawerComponent extends BaseDrawer implements AfterViewInit {
    @ViewChildren('controlsDrawer') drawers: QueryList<BaseDrawer>;

    /**
     * Name of this drawer.
     */
    public name = 'objectSettings';

    /**
     * ObjectSettingsDrawerComponent Constructor.
     */
    constructor(
        public activeObject: ActiveObjectService,
        protected history: HistoryToolService,
        public editorControls: EditorControlsService,
        private activeDrawer: ActiveDrawerService,
    ) {
        super(history, editorControls);
    }

    ngAfterViewInit() {
        //need to delay changes so expression changed error is avoided
        this.drawers.changes.pipe(delay(0)).subscribe(() => {
            this.activeDrawer.set(this.drawers.last || this.drawers.first);
        });
    }

    public apply() {
        this.activeObject.deselect();
        this.controls.closeAllPanels();
    }

    public close() {
        this.activeObject.deselect();
        this.controls.closeAllPanels();
    }
}
