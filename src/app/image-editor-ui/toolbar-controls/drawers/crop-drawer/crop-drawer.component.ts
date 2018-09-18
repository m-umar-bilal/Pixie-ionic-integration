import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren, ViewEncapsulation} from '@angular/core';
import {Settings} from 'vebto-client/core/config/settings.service';
import {BaseDrawer} from '../base-drawer';
import {EditorControlsService} from '../../editor-controls.service';
import {CropZoneService} from '../../../../image-editor/tools/crop/crop-zone.service';
import {CropToolService} from '../../../../image-editor/tools/crop/crop-tool.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';

@Component({
    selector: 'crop-drawer',
    templateUrl: './crop-drawer.component.html',
    styleUrls: ['./crop-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class CropDrawerComponent extends BaseDrawer implements AfterViewInit, OnInit, OnDestroy {
    @ViewChildren('ratioPreview') ratioPreviews: QueryList<ElementRef>;

    /**
     * Name of this drawer.
     */
    public name = 'crop';

    public aspectRatios: string[];

    cropzoneHeight: number;
    cropzoneWidth: number;

    constructor(
        public cropZone: CropZoneService, 
        private cropTool: CropToolService,
        protected history: HistoryToolService,
        public controls: EditorControlsService,
        private config: Settings,
    ) {
        super(history, controls);
        this.aspectRatios = this.config.get('pixie.tools.crop.items');
        this.dirty = true;
    }

    ngAfterViewInit() {
        this.ratioPreviews.forEach(el => {
            const adjusted = this.cropZone.getAdjustedSize(el.nativeElement.dataset.ratio, 40, 30);
            el.nativeElement.style.width = adjusted.width+'px';
            el.nativeElement.style.height = adjusted.height+'px';
        });
    }

    ngOnInit() {
        this.cropZone.draw();
        this.updateZoneSize();
        this.cropZone.resize$.subscribe(() => this.updateZoneSize());
    }

    ngOnDestroy() {
        this.cropZone.remove();
    }

    public apply() {
        this.cropZone.remove();
        this.cropTool.apply(this.cropZone.getSize());
        this.dirty = true;
        super.apply();
    }

    public applyAspectRatio(aspectRatio: string) {
        this.cropZone.changeAspectRatio(aspectRatio);
        this.updateZoneSize();
    }

    private updateZoneSize() {
        const size = this.cropZone.getSize();
        this.cropzoneHeight = Math.floor(size.height);
        this.cropzoneWidth = Math.floor(size.width);
    }

    public resizeCropzone() {
        this.cropZone.resize(this.cropzoneWidth, this.cropzoneHeight);
    }
}
