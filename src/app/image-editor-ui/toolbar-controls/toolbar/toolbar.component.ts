import {AfterViewInit, Component, ViewChild, ViewEncapsulation} from '@angular/core';
import {Settings} from 'vebto-client/core/config/settings.service';
import {FloatingPanelsService} from '../floating-panels.service';
import {BreakpointsService} from 'vebto-client/core/ui/breakpoints.service';
import {ActiveDrawerService} from '../drawers/active-drawer.service';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {CanvasZoomService} from '../../../image-editor/canvas/canvas-zoom.service';
import {ImportToolService} from '../../../image-editor/tools/import-tool.service';
import {ExportToolService} from '../../../image-editor/tools/export/export-tool.service';
import {EditorUiService} from '../../editor-ui.service';
import {CanvasService} from '../../../image-editor/canvas/canvas.service';
import {delay} from 'rxjs/operators';
import {MatMenuTrigger} from '@angular/material';

@Component({
    selector: 'toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class ToolbarComponent implements AfterViewInit {
    @ViewChild(MatMenuTrigger) matMenuTrigger: MatMenuTrigger;

    /**
     * Whether toolbar design is in compact mode currently.
     */
    public compactMode: boolean = false;

    constructor(
        public history: HistoryToolService,
        public config: Settings,
        public zoom: CanvasZoomService,
        public panels: FloatingPanelsService,
        public breakpoints: BreakpointsService,
        public activeDrawer: ActiveDrawerService,
        private importTool: ImportToolService,
        private exportTool: ExportToolService,
        public editorUi: EditorUiService,
        private canvas: CanvasService,
        private floatingPanels: FloatingPanelsService,
    ) {}

    ngAfterViewInit() {
        this.canvas.state.loaded.pipe(delay(0)).subscribe(() => {
            this.floatingPanels.openSampleImagePanel();
        });

        this.breakpoints.observe('(max-width: 820px)')
            .subscribe(result => this.compactMode = result.matches);
    }

    public zoomIn() {
        this.zoom.set(this.zoom.get() + 0.05);
    }

    public zoomOut() {
        this.zoom.set(this.zoom.get() - 0.05);
    }

    public exportImage(extension?) {
        this.exportTool.export(null, extension);
    }

    /**
     * Ask user to upload a new background image and override current one.
     */
    public openBackgroundImage() {
        this.importTool.openUploadDialog({type: 'image', backgroundImage: true}).then(() => {
            this.history.add('changed: background Image', 'photo-library');
        });
    }

    /**
     * Ask user to upload a new overlay image and add it to canvas.
     */
    public openOverlayImage() {
        this.importTool.openUploadDialog().then(obj => {
            if ( ! obj) return;
            this.canvas.fabric().setActiveObject(obj);
            this.history.add('added: overlay Image', 'photo-library');
        });
    }

    /**
     * Ask user to upload state file and override current editor state.
     */
    public openStateFile() {
        this.importTool.openUploadDialog({type: 'state'});
    }

    /**
     * Execute custom open button action or open dropdown menu if no action provided.
     */
    public executeOpenButtonAction() {
        const action = this.config.get('pixie.ui.toolbar.openButtonAction');

        if ( ! action) {
            this.matMenuTrigger.toggleMenu();
        } else {
            action();
        }
    }
}
