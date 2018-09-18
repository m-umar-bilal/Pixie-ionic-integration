import {EditorControlsService} from '../editor-controls.service';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';

export abstract class BaseDrawer {

    /**
     * Whether this drawer has performed any operations yet.
     */
    public dirty: boolean = false;

    /**
     * Name of this drawer.
     */
    public abstract name: string;

    /**
     * BaseDrawer Constructor.
     */
    protected constructor(
        protected history: HistoryToolService,
        public controls: EditorControlsService,
    ) {}

    public close() {
        this.controls.closeCurrentPanel();

        if (this.dirty) {
            this.history.reload();
            this.dirty = false;
        }
    }

    public apply() {
        this.controls.closeCurrentPanel();
        this.saveChanges();
    }

    protected saveChanges() {
        if ( ! this.dirty) return;
        this.addChangesToHistory();
        this.dirty = false;
    }

    protected addChangesToHistory() {
        const formattedName = this.name.replace(/([A-Z])/g, ' $1');
        this.history.add('applied: '+formattedName, this.controls.getIconName(this.name));
    }
}