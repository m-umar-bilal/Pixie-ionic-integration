import {Component, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {Settings} from 'vebto-client/core/config/settings.service';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {ActiveObjectService} from '../../../../image-editor/canvas/active-object.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {FillToolService} from '../../../../image-editor/tools/fill/fill-tool.service';
import {BaseDrawer} from '../base-drawer';
import {ImportToolService} from '../../../../image-editor/tools/import-tool.service';

@Component({
    selector: 'texture-controls-drawer',
    templateUrl: './texture-controls-drawer.component.html',
    styleUrls: ['./texture-controls-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class TextureControlsDrawerComponent extends BaseDrawer {

    /**
     * Name of this drawer.
     */
    public name = 'texture';

    /**
     * Iterable for showing default texture in the view.
     */
    public defaultTextures = Array.from(Array(28).keys());

    /**
     * ShadowControlsDrawer Constructor.
     */
    constructor(
        public activeObject: ActiveObjectService,
        protected history: HistoryToolService,
        public controls: EditorControlsService,
        private settings: Settings,
        private sanitizer: DomSanitizer,
        private fillTool: FillToolService,
        private importTool: ImportToolService,
    ) {
        super(history, controls);
    }

    public getTextureBgStyle(index: number): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(
            'url(' + this.getTextureUrl(index) + ')'
        );
    }

    private getTextureUrl(index: number): string {
        return this.settings.getAssetUrl('images/textures/' + index + '.png');
    }

    public fillWithPattern(index: number) {
        this.dirty = true;
        this.fillTool.withPattern(this.getTextureUrl(index));
    }

    public openUploadDialog() {
        this.importTool.importAndGetData().then(data => {
            this.dirty = true;
            this.fillTool.withPattern(data);
        });
    }
}
