import {Component, ViewEncapsulation} from '@angular/core';
import {ImportToolService} from '../../../image-editor/tools/import-tool.service';
import {Settings} from 'vebto-client/core/config/settings.service';
import {OverlayPanelRef} from 'vebto-client/core/ui/overlay-panel/overlay-panel-ref';
import {FormControl, FormGroup} from '@angular/forms';
import {CanvasService} from '../../../image-editor/canvas/canvas.service';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';

@Component({
    selector: 'open-sample-image-panel',
    templateUrl: './open-sample-image-panel.component.html',
    styleUrls: ['./open-sample-image-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class OpenSampleImagePanelComponent {

    public newCanvasForm = new FormGroup({
        width: new FormControl(800),
        height: new FormControl(600),
    });

    public newCanvasFormVisible: boolean = false;

    public sampleImages: {url: string, thumbnail?: string}[];

    constructor(
        public importTool: ImportToolService,
        private config: Settings,
        private panelRef: OverlayPanelRef,
        private canvas: CanvasService,
        private history: HistoryToolService,
    ) {
        this.sampleImages = this.config.get('pixie.ui.openImageDialog.sampleImages');
    }

    public openUploadDialog() {
        this.importTool.openUploadDialog({backgroundImage: true}).then(() => this.close());
    }

    public openSampleImage(url: string) {
        this.importTool.openBackgroundImage(url).then(() => this.close())
    }

    public createNewCanvas() {
        const width = this.newCanvasForm.get('width').value,
            height = this.newCanvasForm.get('height').value;

        this.config.set('pixie.blankCanvasSize', {width, height});
        this.canvas.openNew(width, height,).then(() => this.close())
    }

    public close() {
        this.panelRef.close();
        this.history.addInitial();
    }
}
