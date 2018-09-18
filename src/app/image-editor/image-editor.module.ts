import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Settings} from 'vebto-client/core/config/settings.service';
import {CanvasService} from './canvas/canvas.service';
import {FilterToolService} from './tools/filter/filter-tool.service';
import {ResizeToolService} from './tools/resize/resize-tool.service';
import {TransformToolService} from './tools/transform/transform-tool.service';
import {HistoryToolService} from './history/history-tool.service';
import {CropZoneService} from './tools/crop/crop-zone.service';
import {CropToolService} from './tools/crop/crop-tool.service';
import {DrawToolService} from './tools/draw/draw-tool.service';
import {TextToolService} from './tools/text/text-tool.service';
import {ShapesToolService} from './tools/shapes/shapes-tool.service';
import {CanvasPanService} from './canvas/canvas-pan.service';
import {ActiveObjectService} from './canvas/active-object.service';
import {CanvasZoomService} from './canvas/canvas-zoom.service';
import {HttpErrorHandler} from 'vebto-client/core/http/errors/http-error-handler.service';
import {ClientHttpErrorHandler} from 'vebto-client/core/http/errors/client-http-error-handler.service';
import {ExportToolService} from './tools/export/export-tool.service';
import {FillToolService} from './tools/fill/fill-tool.service';
import {Keybinds} from 'vebto-client/core/keybinds/keybinds.service';
import {CanvasKeybindsService} from './canvas/canvas-keybinds.service';
import {MergeToolService} from './tools/merge/merge-tool.service';
import {RoundToolService} from './tools/round/round-tool.service';
import {ObjectsService} from './objects/objects.service';
import {WatermarkToolService} from './tools/watermark-tool.service';
import {FrameToolService} from './tools/frame/frame-tool.service';
import {FramePatternsService} from './tools/frame/frame-patterns.service';
import {ActiveFrameService} from './tools/frame/active-frame.service';
import {FrameBuilderService} from './tools/frame/frame-builder.service';
import {ToolsService} from './tools/tools.service';
import {ImportToolService} from './tools/import-tool.service';
import {Uploads} from 'vebto-client/core/files/uploads.service';
import {FileValidator} from 'vebto-client/core/files/file-validator';
import {CanvasStateService} from './canvas/canvas-state.service';
import {TranslationsModule} from 'vebto-client/core/translations/translations.module';

@NgModule({
    imports: [
        CommonModule,
        TranslationsModule,
    ],
    exports: [
        TranslationsModule,
    ],
    providers: [
        Settings,
        Keybinds,
        Uploads,
        FileValidator,
        {
            provide: HttpErrorHandler,
            useClass: ClientHttpErrorHandler,
        },
        CanvasService,
        CanvasPanService,
        CanvasZoomService,
        CanvasStateService,
        CanvasKeybindsService,
        ObjectsService,
        ActiveObjectService,
        FilterToolService,
        ResizeToolService,
        HistoryToolService,
        TransformToolService,
        CropZoneService,
        CropToolService,
        DrawToolService,
        TextToolService,
        ShapesToolService,
        ExportToolService,
        ImportToolService,
        FillToolService,
        MergeToolService,
        RoundToolService,
        WatermarkToolService,
        FrameToolService,
        FramePatternsService,
        ActiveFrameService,
        FrameBuilderService,
        ToolsService,
    ],
})
export class ImageEditorModule {
}
