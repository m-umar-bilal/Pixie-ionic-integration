import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CanvasService} from '../image-editor/canvas/canvas.service';
import {HistoryToolService} from '../image-editor/history/history-tool.service';
import {fromEvent} from 'rxjs';
import {distinctUntilChanged, debounceTime} from 'rxjs/operators';
import {EditorControlsService} from './toolbar-controls/editor-controls.service';
import {BreakpointsService} from 'vebto-client/core/ui/breakpoints.service';
import {FloatingPanelsService} from './toolbar-controls/floating-panels.service';
import {CanvasKeybindsService} from '../image-editor/canvas/canvas-keybinds.service';
import {ActiveObjectService} from '../image-editor/canvas/active-object.service';
import {ActiveDrawerService} from './toolbar-controls/drawers/active-drawer.service';
import {EditorUiService} from './editor-ui.service';
import {CanvasStateService} from '../image-editor/canvas/canvas-state.service';
import {Settings} from 'vebto-client/core/config/settings.service';

@Component({
    selector: 'image-editor',
    templateUrl: './image-editor.component.html',
    styleUrls: ['./image-editor.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ImageEditorComponent implements OnInit {
    @ViewChild('canvasWrapper') canvasWrapper: ElementRef;
    @ViewChild('canvasMaskWrapper') canvasMaskWrapper: ElementRef;
    @ViewChild('editorControls', {read: ElementRef}) editorControls: ElementRef;

    /**
     * ImageEditorComponent Constructor.
     */
    constructor(
        public canvas: CanvasService,
        private history: HistoryToolService,
        public controls: EditorControlsService,
        public breakpoints: BreakpointsService,
        private floatingPanels: FloatingPanelsService,
        private canvasKeybinds: CanvasKeybindsService,
        private el: ElementRef,
        private activeObject: ActiveObjectService,
        private activeDrawer: ActiveDrawerService,
        public editorUi: EditorUiService,
        private state: CanvasStateService,
        public config: Settings,
    ) {}

    ngOnInit() {
        this.state.wrapperEl = this.canvasWrapper.nativeElement;
        this.state.maskWrapperEl = this.canvasMaskWrapper.nativeElement;

        this.canvas.init().subscribe(() => {
            this.canvasKeybinds.init();
            this.fitCanvasToScreenOnResize();
            this.openObjectSettingsOnDoubleClick();
            this.closePanelsOnObjectDelete();
            this.handleObjectSelection();
            this.updateHistoryOnObjectModification();
            this.canvasMaskWrapper.nativeElement.classList.remove('not-loaded');
        });
    }

    private closePanelsOnObjectDelete() {
        this.canvas.fabric().on('object:delete', () => this.controls.closeAllPanels());
    }

    /**
     *  Open object settings panel on object double click.
     */
    private openObjectSettingsOnDoubleClick() {
        this.canvas.fabric().on('mouse:dblclick', () => {
            if (!this.activeObject.getId() || this.activeDrawer.dirty()) return;
            this.controls.openPanel('objectSettings');
        });
    }

    /**
     * Replace current history item, so object position is
     * updated after object is scaled, moved or rotated.
     */
    private updateHistoryOnObjectModification() {
        this.canvas.fabric().on('object:modified', event => {
            if (!event.e || this.activeDrawer.dirty()) return;
            this.history.replaceCurrent();
        });
    }

    private handleObjectSelection() {
        this.canvas.fabric().on('selection:created', e => this.onObjectSelection(e));
        this.canvas.fabric().on('selection:updated', e => this.onObjectSelection(e));

        this.canvas.fabric().on('selection:cleared', event => {
            if (  ! event.e || this.activeDrawer.dirty()) return;
            this.controls.closeCurrentPanel();
        });
    }

    public onObjectSelection(event) {
        //only open drawer panel if selection event originated from
        //user clicking or tapping object on the canvas and not from
        //selecting object programmatically in the app
        if ( ! event.e || this.activeDrawer.dirty()) return;
        this.controls.openObjectDrawer(event.target.name);
    }

    private fitCanvasToScreenOnResize() {
        fromEvent(window, 'resize')
            .pipe(debounceTime(200), distinctUntilChanged())
            .subscribe((e) => {
                this.canvas.zoom.fitToScreen();
            });
    }
}
