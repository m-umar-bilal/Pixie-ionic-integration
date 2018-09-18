import {Component, ViewEncapsulation} from '@angular/core';
import {HistoryToolService} from '../../../image-editor/history/history-tool.service';
import {HistoryItem} from '../../../image-editor/history/history-item.interface';
import {OverlayPanelRef} from 'vebto-client/core/ui/overlay-panel/overlay-panel-ref';

@Component({
    selector: 'history-panel',
    templateUrl: './history-panel.component.html',
    styleUrls: ['./history-panel.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class HistoryPanelComponent {

    /**
     * HistoryPanelComponent Constructor.
     */
    constructor(
        public history: HistoryToolService,
        public panelRef: OverlayPanelRef,
    ) {}

    /**
     * Load specified history state item into canvas.
     */
    public loadHistoryState(item: HistoryItem) {
        this.history.load(item);
    }
}
