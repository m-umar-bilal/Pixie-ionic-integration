import {Injectable} from '@angular/core';
import {HistoryItem} from './history-item.interface';
import {Image} from 'fabric/fabric-impl';
import {CanvasService} from '../canvas/canvas.service';
import {ActiveObjectService} from '../canvas/active-object.service';
import {ObjectsService} from '../objects/objects.service';
import {FrameToolService} from '../tools/frame/frame-tool.service';
import {SerializedCanvas} from './serialized-canvas';
import {TextToolService} from '../tools/text/text-tool.service';
import {GoogleFontsPanelService} from '../../image-editor-ui/toolbar-controls/google-fonts-panel/google-fonts-panel.service';

@Injectable()
export class HistoryToolService {

    private items: HistoryItem[] = [];

    /**
     * Index of currently active history state item.
     */
    private pointer: number = 0;

    /**
     * HistoryToolService Constructor.
     */
    constructor(
        public canvas: CanvasService,
        private activeObject: ActiveObjectService,
        private objects: ObjectsService,
        private frameTool: FrameToolService,
        private googleFonts: GoogleFontsPanelService,
        private textTool: TextToolService,
    ) {
        this.canvas.state.loaded.subscribe(() => {
            if (this.canvas.state.isEmpty()) return;
            this.addInitial();
        });
    }

    /**
     * Check if undo operation is possible.
     */
    public canUndo() {
        return this.pointer - 1 > -1;
    }

    /**
     * Check if redo operation is possible.
     */
    public canRedo() {
        return this.items.length > this.pointer + 1;
    }

    /**
     * Undo last operation.
     */
    public undo() {
        if ( ! this.canUndo()) return;
        this.load(this.items[this.pointer - 1]);
    }

    /**
     * Redo last operation.
     */
    public redo() {
        if ( ! this.canRedo()) return;
        this.load(this.items[this.pointer + 1]);
    }

    /**
     * Reload current history state.
     */
    public reload() {
        this.load(this.items[this.pointer]);
    }

    /**
     * Replace current history item with current canvas state.
     */
    public replaceCurrent() {
        const current = this.items[this.pointer];
        this.items[this.pointer] = this.createHistoryItem(current.name, current.icon);
    }

    public add(name: string, icon: string, movePointer: boolean = true) {
        const len = this.items.push(this.createHistoryItem(name, icon));
        if (movePointer) this.pointer = len - 1;
    };

    /**
     * Add new history from json and load it.
     */
    public addFromJson(json: string) {
        const name = !this.items.length ? 'initial' : 'loaded: state',
            icon = (name === 'initial' ? 'home' : 'history'),
            historyItem = this.createHistoryItem(name, icon, JSON.parse(json)),
            len = this.items.push(historyItem);

        this.pointer = len - 1;
        return this.load(historyItem);
    };

    /**
     * Get all history items.
     */
    public getAllItems(): HistoryItem[] {
        return this.items; 
    }

    /**
     * Get history item by name.
     */
    public get(name: string) {
        return this.items.find(curr => curr.name === name);
    }

    /**
     * Get history stack pointer.
     */
    public getPointer(): number {
        return this.pointer;
    }

    /**
     * Get serialized canvas and editor state.
     */
    public getCurrentCanvasState(): SerializedCanvas {
        return {
            canvas: this.canvas.fabric().toJSON(['selectable', 'name', 'data']),
            editor: {frame: this.frameTool.getActive(), fonts: this.textTool.getUsedFonts()},
            canvasWidth: this.canvas.state.original.width,
            canvasHeight: this.canvas.state.original.height,
        };
    }

    public clear() {
        this.items = [];
        this.pointer = 0;
    }

    public addInitial() {
        if (this.items.length) return;
        this.add('Initial', 'home', false);
        this.pointer = 0;
    }

    public load(item: HistoryItem|string): Promise<any> {
       return new Promise(resolve => {
           //if we getAll passed a name, fetch a matching history item
           if (typeof(item) === 'string') {
               item = this.get(item);
           }

           const historyItem = item as HistoryItem;

           this.pointer = this.items.findIndex(curr => curr === item);

           //load fonts into into dom
           if (historyItem.editor.fonts.length) {
               this.googleFonts.loadIntoDom(historyItem.editor.fonts).then(() => {
                   this.canvas.fabric().getObjects('i-text').forEach(obj => {
                       obj.set({dirty: true});
                   });
                   this.canvas.render();
               });
           }

           this.canvas.fabric().loadFromJSON(historyItem.canvas, () => {
               //init or remove canvas frame
               if (historyItem.editor.frame) {
                   this.frameTool.add(historyItem.editor.frame.name);
               } else {
                   this.frameTool.remove();
               }

               this.canvas.zoom.set(1);

               //resize canvas if needed
               if (historyItem.canvasWidth && historyItem.canvasHeight) {
                   this.canvas.resize(historyItem.canvasWidth, historyItem.canvasHeight);
               }

               //prepare fabric.js and canvas
               this.canvas.render();
               this.canvas.fabric().calcOffset();
               this.canvas.state.loading = false;
               this.canvas.zoom.fitToScreen();

               this.objects.syncObjects();
               resolve();
           }, obj => {
               //reapply any filters object used to have
               if (obj.hasOwnProperty('applyFilters')) {
                   (obj as Image).applyFilters();
               }
           });
       })
    }

    private createHistoryItem(name: string, icon: string|null = null, state?: SerializedCanvas): HistoryItem {
        if ( ! state) state = this.getCurrentCanvasState();

        return Object.assign(state, {
            name: name,
            index: this.items.length,
            icon: icon,
            zoom: this.canvas.zoom.get(),
            activeObjectId: this.activeObject.getId(),
        });
    }
}
