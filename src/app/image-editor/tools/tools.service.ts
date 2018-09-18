import {Injectable} from '@angular/core';
import {FilterToolService} from './filter/filter-tool.service';
import {ResizeToolService} from './resize/resize-tool.service';
import {TransformToolService} from './transform/transform-tool.service';
import {CropToolService} from './crop/crop-tool.service';
import {DrawToolService} from './draw/draw-tool.service';
import {TextToolService} from './text/text-tool.service';
import {ShapesToolService} from './shapes/shapes-tool.service';
import {FrameToolService} from './frame/frame-tool.service';
import {RoundToolService} from './round/round-tool.service';
import {ExportToolService} from './export/export-tool.service';
import {CanvasService} from '../canvas/canvas.service';
import {ImportToolService} from './import-tool.service';
import {WatermarkToolService} from './watermark-tool.service';
import {HistoryToolService} from '../history/history-tool.service';

@Injectable()
export class ToolsService {

    /**
     * ToolsService Constructor.
     */
    constructor(
        private filterTool: FilterToolService,
        private resizeTool: ResizeToolService,
        private cropTool: CropToolService,
        private transformTool: TransformToolService,
        private drawTool: DrawToolService,
        private textTool: TextToolService,
        private shapesTool: ShapesToolService,
        private frameTool: FrameToolService,
        private cornerTool: RoundToolService,
        private exportTool: ExportToolService,
        private importTool: ImportToolService,
        private canvas: CanvasService,
        private watermark: WatermarkToolService,
        private history: HistoryToolService,
    ) {}

    public get(name: string): any {
        if (name === 'canvas') {
            return this.canvas;
        } else {
            return this[name] || this[name+'Tool'];
        }
    }
}