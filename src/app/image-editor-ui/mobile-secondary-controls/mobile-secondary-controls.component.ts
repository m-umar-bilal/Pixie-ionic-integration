import {Component, ViewEncapsulation} from '@angular/core';
import {HistoryToolService} from '../../image-editor/history/history-tool.service';
import {ActiveObjectService} from '../../image-editor/canvas/active-object.service';
import {EditorControlsService} from '../toolbar-controls/editor-controls.service';
import {ActiveDrawerService} from '../toolbar-controls/drawers/active-drawer.service';
import {BreakpointsService} from 'vebto-client/core/ui/breakpoints.service';
import {ObjectsService} from '../../image-editor/objects/objects.service';

@Component({
    selector: 'mobile-secondary-controls',
    templateUrl: './mobile-secondary-controls.component.html',
    styleUrls: ['./mobile-secondary-controls.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class MobileSecondaryControlsComponent {

    constructor(
        public history: HistoryToolService,
        public activeObject: ActiveObjectService,
        public controls: EditorControlsService,
        private activeDrawer: ActiveDrawerService,
        public breakpoints: BreakpointsService,
        private objects: ObjectsService,
    ) {}

    public deleteObject() {
        const obj = this.activeObject.get();
        if ( ! obj) return;
        this.activeObject.delete();
        this.history.add('deleted: '+obj.name, 'delete-custom');
    }

    /**
     * Open drawer for adding more of current active object.
     */
    public openObjectDrawer() {
        const obj = this.activeObject.get();

        this.controls.closeAllPanels();

        switch (obj.name) {
            case 'shape':
                this.controls.openPanel('shapes');
                break;
            case 'sticker':
                this.controls.openPanel('stickers');
                break;
            case 'text':
                this.controls.openPanel('text');
                break;
        }
    }

    public shouldShowSettingsIcon() {
        return ! this.activeDrawer.dirty() && ! this.controls.panelIsVisible('objectSettings');
    }

    public bringActiveObjectToFront() {
        this.activeObject.bringToFront();
        this.objects.syncObjects();
    }
}
