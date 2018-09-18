import {Injectable} from '@angular/core';
import {CanvasPanService} from './canvas-pan.service';
import {CanvasStateService} from './canvas-state.service';

@Injectable()
export class CanvasZoomService {

    /**
     * Maximum zoom scale factor.
     */
    public maxScale = 2;

    /**
     * Minimum zoom scale factor.
     */
    public minScale = 0.1;

    /**
     * Current canvas zoom scale factor.
     */
    public currentZoom: number = 1;

    /**
     * CanvasZoomService Constructor.
     */
    constructor(
        private state: CanvasStateService,
        private pan: CanvasPanService,
    ) {}

    /**
     * Get current zoom scale factor.
     */
    public get() {
        return this.currentZoom;
    }

    /**
     * Get current zoom percent.
     */
    public getPercent() {
        return Math.floor(this.currentZoom * 100);
    }

    /**
     * Zoom canvas to specified scale.
     */
    public set(scaleFactor: number, resize: boolean = true) {
        if (scaleFactor < this.minScale || scaleFactor > this.maxScale) return;

        const width = this.state.original.width * scaleFactor,
            height = this.state.original.height * scaleFactor;

        this.state.fabric.setZoom(scaleFactor);

        if (resize) {
            this.state.fabric.setHeight(height);
            this.state.fabric.setWidth(width);
        }

        this.currentZoom = scaleFactor;
    }

    /**
     * Resize canvas to fit available screen space.
     */
    public fitToScreen() {
        const size = this.state.calcWrapperSize();

        let maxWidth = size.width - 40, maxHeight = size.height - 40;

        if (this.state.original.height > maxHeight || this.state.original.width > maxWidth) {
            const scale = Math.min(maxHeight / this.state.original.height, maxWidth / this.state.original.width);
            this.set(scale);
        }
    }

    public init() {
        this.bindMouseWheel();
        this.bindToPinchZoom();
    }

    private bindMouseWheel() {
        let zoomStep = 0.05;

        this.state.fabric.on('mouse:wheel', opt => {
            opt.e.preventDefault();
            opt.e.stopPropagation();

            if (opt.e.deltaY < 0) {
                this.set(this.currentZoom + zoomStep);
            } else {
                this.set(this.currentZoom - zoomStep);
            }

            this.pan.set();
            this.state.fabric.requestRenderAll();
        });
    }

    /**
     * Resize canvas when pinch zooming on mobile.
     */
    private bindToPinchZoom() {
        let mc = new Hammer.Manager(this.state.maskWrapperEl);
        let pinch = new Hammer.Pinch();
        mc.add([pinch]);

        mc.on("pinch", (ev: HammerInput) => {
            const step = Math.abs(ev['overallVelocity']);

            if (ev['additionalEvent'] === 'pinchout') {
                this.set(this.get() + step);
            } else {
                this.set(this.get() - step);
            }

            this.pan.set();
            this.state.fabric.requestRenderAll();
        });
    }
}