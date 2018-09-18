import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {EditorControlsService} from '../../editor-controls.service';
import {BaseDrawer} from '../base-drawer';
import {CanvasService} from '../../../../image-editor/canvas/canvas.service';
import {HistoryToolService} from '../../../../image-editor/history/history-tool.service';
import {ResizeToolService} from '../../../../image-editor/tools/resize/resize-tool.service';
import {Toast} from 'vebto-client/core/ui/toast.service';

@Component({
    selector: 'resize-drawer',
    templateUrl: './resize-drawer.component.html',
    styleUrls: ['./resize-drawer.component.scss'],
    encapsulation: ViewEncapsulation.None,
    host: {'class': 'controls-drawer'},
})
export class ResizeDrawerComponent extends BaseDrawer implements OnInit {

    /**
     * Name of this drawer.
     */
    public name = 'resize';

    private _width: number;
    private _height: number;

    public get width() {
        return this._width;
    }

    public set width(value: number) {
        this._width = Math.floor(value);
        this.aspectToHeight(this._width);
    }

    public get height() {
        return this._height;
    }

    public set height(value: number) {
        this._height = Math.floor(value);
        this.aspectToWidth(this._height);
    }

    /**
     * Whether pixels or percentages should be used.
     */
    public usePercentages: boolean = false;

    /**
     * Whether aspect ratio should be maintained.
     */
    public maintainAspectRatio: boolean = true;

    /**
     * ResizeDrawerComponent Constructor.
     */
    constructor(
        private canvas: CanvasService,
        protected history: HistoryToolService,
        private resizeTool: ResizeToolService,
        public controls: EditorControlsService,
        private toast: Toast,
    ) {
        super(history, controls);
        this.dirty = true;
    }

    ngOnInit() {
        this.width = this.usePercentages ? 100 : this.canvas.state.original.width;
        this.height = this.usePercentages ? 100 : this.canvas.state.original.height;
    }

    /**
     * Resize image to specified dimensions.
     */
    public apply() {
        this.resizeTool.apply(this.width, this.height, this.usePercentages);
        super.apply();
        this.toast.open('Photo resized.');
    }

    /**
     * Toggle resizing mode between percentages and pixels.
     */
    public togglePercentages() {
        if (this.usePercentages) {
            this.width = 100;
            this.height = 100;
        } else {
            this.width = this.canvas.state.original.width;
            this.height = this.canvas.state.original.height;
        }
    };

    /**
     * Maintain aspect ratio when setting height.
     */
    private aspectToWidth(newHeight: number) {
        if ( ! this.maintainAspectRatio) return;

        if (this.usePercentages) {
            this._width = newHeight;
        } else {
            let hRatio = parseFloat((this.canvas.state.original.height / newHeight).toPrecision(3));
            this._width = Math.floor(this.canvas.state.original.width / hRatio);
        }
    };

    /**
     * Maintain aspect ratio when setting width.
     */
    private aspectToHeight(newWidth: number) {
        if ( ! this.maintainAspectRatio) return;

        if (this.usePercentages) {
            this._height = newWidth;
        } else {
            let wRatio = parseFloat((this.canvas.state.original.width / newWidth).toPrecision(3));
            this._height = Math.floor(this.canvas.state.original.height / wRatio);
        }
    };
}
