import {Component, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {Settings} from 'vebto-client/core/config/settings.service';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';
import {gradientPresets} from '../../../../image-editor/tools/gradient-presets';
import {ActiveObjectService} from '../../../../image-editor/canvas/active-object.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {FillToolService} from '../../../../image-editor/tools/fill/fill-tool.service';
import {BaseDrawer} from '../base-drawer';

@Component({
    selector: 'gradient-controls-drawer',
    templateUrl: './gradient-controls-drawer.component.html',
    styleUrls: ['./gradient-controls-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class GradientControlsDrawerComponent extends BaseDrawer {

    /**
     * Name of this drawer.
     */
    public name = 'gradient';

    /**
     * Default gradient's config.
     */
    public defaultGradients = gradientPresets;

    /**
     * GradientControlsDrawerComponent Constructor.
     */
    constructor(
        public activeObject: ActiveObjectService,
        protected history: HistoryToolService,
        public controls: EditorControlsService,
        private settings: Settings,
        private sanitizer: DomSanitizer,
        private fillTool: FillToolService,
    ) {
        super(history, controls);
    }

    public getGradientBgStyle(index: number): SafeStyle {
        return this.sanitizer.bypassSecurityTrustStyle(
            'url('+this.getGradientUrl(index)+')'
        );
    }

    private getGradientUrl(index: number): string {
        return this.settings.getAssetUrl('images/gradients/'+index+'.png')
    }

    public fillWithGradient(index: number) {
        this.dirty = true;
        this.fillTool.withGradient(index);
    }
}
