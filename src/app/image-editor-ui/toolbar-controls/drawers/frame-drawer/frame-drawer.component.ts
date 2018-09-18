import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {FormControl} from '@angular/forms';
import {EditorControlsService} from '../../editor-controls.service';
import {BaseDrawer} from '../base-drawer';
import {FrameToolService} from '../../../../image-editor/tools/frame/frame-tool.service';
import {ActiveFrameService} from '../../../../image-editor/tools/frame/active-frame.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {Frame} from '../../../../image-editor/tools/frame/frame';

@Component({
    selector: 'frame-drawer',
    templateUrl: './frame-drawer.component.html',
    styleUrls: ['./frame-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class FrameDrawerComponent extends BaseDrawer implements OnInit {

    /**
     * Name of this drawer.
     */
    public name = 'frame';

    /**
     * Frame size slider model.
     */
    public sizeModel: number;

    /**
     * Control for color widget.
     */
    public colorControl = new FormControl();

    /**
     * FrameDrawerComponent Constructor.
     */
    constructor(
        public frameTool: FrameToolService,
        public controls: EditorControlsService,
        public activeFrame: ActiveFrameService,
        protected history: HistoryToolService,
    ) {
        super(history, controls);
    }

    ngOnInit() {
        this.colorControl.valueChanges.subscribe(value => {
            this.frameTool.changeColor(value);
        });
    }

    public getFrameThumbUrl(frame: Frame) {
        return this.frameTool.patterns.getBaseUrl(frame) + '/thumbnail.png';
    }

    /**
     * Add specified frame to canvas.
     */
    public selectFrame(frame: Frame) {
        this.dirty = true;
        this.frameTool.add(frame.name);
    }

    public scaleFrame(value: number | null) {
        this.frameTool.resize(value);
    }

    public frameIsActive(frame: Frame) {
        return this.activeFrame.is(frame);
    }

    public removeFrame() {
        this.activeFrame.remove();
    }

    public showFrameConfig(frame: Frame) {
        this.sizeModel = frame.size.default;
        this.controls.openPanel('frameControls');
    }
}
