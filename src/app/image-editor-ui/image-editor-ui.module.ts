import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ImageEditorComponent} from './image-editor.component';
import {HistoryPanelComponent} from './panels/history-panel/history-panel.component';
import {ObjectsPanelComponent} from './panels/objects-panel/objects-panel.component';
import {ImageEditorModule} from '../image-editor/image-editor.module';
import {ToolbarControlsModule} from './toolbar-controls/toolbar-controls.module';
import {EditorControlsService} from './toolbar-controls/editor-controls.service';
import {FloatingPanelsService} from './toolbar-controls/floating-panels.service';
import {ActiveDrawerService} from './toolbar-controls/drawers/active-drawer.service';
import {SvgIconModule} from 'vebto-client/core/ui/svg-icon/svg-icon.module';
import {MatButtonModule, MatRadioModule, MatSliderModule} from '@angular/material';
import {CustomScrollbarModule} from 'vebto-client/core/ui/custom-scrollbar/custom-scrollbar.module';
import {BreakpointsService} from 'vebto-client/core/ui/breakpoints.service';
import {OverlayPanel} from 'vebto-client/core/ui/overlay-panel/overlay-panel.service';
import {OverlayContainer} from '@angular/cdk/overlay';
import {EditorOverlayContainer} from './panels/editor-overlay-container';
import {EditorUiService} from './editor-ui.service';
import { ReorderObjectsDirective } from './panels/objects-panel/reorder-objects.directive';
import { OpenSampleImagePanelComponent } from './panels/open-sample-image-panel/open-sample-image-panel.component';
import {ReactiveFormsModule} from '@angular/forms';
import {BackgroundImageDirective} from './background-image.directive';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ImageEditorModule,
        ToolbarControlsModule,
        SvgIconModule,
        CustomScrollbarModule,

        //material
        MatSliderModule,
        MatRadioModule,
        MatButtonModule,
    ],
    declarations: [
        ImageEditorComponent,
        HistoryPanelComponent,
        ObjectsPanelComponent,
        ReorderObjectsDirective,
        OpenSampleImagePanelComponent,
        BackgroundImageDirective,
    ],
    entryComponents: [
        OpenSampleImagePanelComponent,
        HistoryPanelComponent,
        ObjectsPanelComponent,
    ],
    exports: [
        ImageEditorComponent,
    ],
    providers: [
        EditorControlsService,
        FloatingPanelsService,
        ActiveDrawerService,
        BreakpointsService,
        OverlayPanel,
        EditorUiService,
        {provide: OverlayContainer, useClass: EditorOverlayContainer},
    ],
})
export class ImageEditorUIModule {
}
