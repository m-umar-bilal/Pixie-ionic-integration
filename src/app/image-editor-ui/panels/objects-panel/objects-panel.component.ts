import {Component, ViewEncapsulation} from '@angular/core';
import {ObjectsService} from '../../../image-editor/objects/objects.service';
import {OverlayPanelRef} from 'vebto-client/core/ui/overlay-panel/overlay-panel-ref';
import {Object} from 'fabric/fabric-impl';
import {EditorControlsService} from '../../toolbar-controls/editor-controls.service';
import {ActiveDrawerService} from '../../toolbar-controls/drawers/active-drawer.service';

@Component({
    selector: 'objects-panel',
    templateUrl: './objects-panel.component.html',
    styleUrls: ['./objects-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ObjectsPanelComponent {

    /**
     * ObjectsPanelComponent Constructor.
     */
    constructor(
        public objects: ObjectsService,
        public panelRef: OverlayPanelRef,
        private controls: EditorControlsService,
        private activeDrawer: ActiveDrawerService,
    ) {}

    public getIcon(object: Object) {
        switch (object.name) {
            case 'text':
                return 'text-box-custom';
            case 'shape':
                return 'polygon-custom';
            case 'sticker':
                return 'sticker-custom';
            case 'drawing':
                return 'pencil-custom';
            case 'mainImage':
            case 'image':
                return 'photo-library'
        }
    }

    public selectObject(object: Object) {
        this.objects.select(object);

        if ( ! this.activeDrawer.dirty()) {
            this.controls.openPanel('objectSettings');
        }
    }

    public getObjectDisplayName(object: Object): string {
        const name = object.name;
        return name ? name.replace(/([A-Z])/g, ' $1') : '';
    }
}
