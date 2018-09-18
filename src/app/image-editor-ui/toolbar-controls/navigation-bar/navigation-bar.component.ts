import {Component, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../editor-controls.service';
import {Settings} from 'vebto-client/core/config/settings.service';
import {CanvasService} from '../../../image-editor/canvas/canvas.service';
import {NavItem} from '../../../image-editor/default-settings';
import {ExportToolService} from '../../../image-editor/tools/export/export-tool.service';
import {MergeToolService} from '../../../image-editor/tools/merge/merge-tool.service';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {EditorUiService} from '../../editor-ui.service';
import {Toast} from 'vebto-client/core/ui/toast.service';

@Component({
    selector: 'navigation-bar',
    templateUrl: './navigation-bar.component.html',
    styleUrls: ['./navigation-bar.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NavigationBarComponent {

    /**
     * NavigationBarComponent Constructor.
     */
    constructor(
        public controls: EditorControlsService,
        public canvas: CanvasService,
        private saveTool: ExportToolService,
        public config: Settings,
        public mergeTool: MergeToolService,
        private history: HistoryToolService,
        public editorUi: EditorUiService,
        private toast: Toast,
    ) {}

    public executeNavItemAction(item: NavItem) {
        if (item.action === 'merge') {
            return this.merge();
        } else if (typeof item.action === 'string') {
            return this.controls.togglePanel(item.action);
        } else if (typeof item.action === 'function') {
            item.action();
        }
    }

    /**
     * Check if specified nav item should be disabled.
     */
    public navItemIsDisabled(item: NavItem): boolean {
        const hasMainImage = !!this.canvas.getMainImage();

        if (item.name === 'merge') {
            return ! this.mergeTool.canMerge();
        } else if (item.name === 'transform') {
            return !hasMainImage;
        } else if (item.name === 'background') {
            return hasMainImage;
        } else {
            return false;
        }
    }

    private merge() {
        this.mergeTool.apply().then(() => {
            this.history.add('objects: merged', this.controls.getIconName('merge'));
            this.toast.open('Objects merged.');
        });
    }
}
